#!/usr/bin/env bash
# Solo DB local DESECHABLE. El script deja datos: destruir la base al terminar.
set -euo pipefail
: "${AFOROFIT_TEST_DATABASE_URL:?Indicar URL de la base de pruebas desechable}"
case "$AFOROFIT_TEST_DATABASE_URL" in
  postgres://*@127.0.0.1:*/*|postgresql://*@127.0.0.1:*/*|postgres://*@localhost:*/*|postgresql://*@localhost:*/*) ;;
  *) echo 'Se requiere una conexión local explícita'; exit 1 ;;
esac
: "${AFOROFIT_TEST_DESTRUCTIVO:?Confirmar con SI}"
[[ "$AFOROFIT_TEST_DESTRUCTIVO" == SI ]]
db() { psql "$AFOROFIT_TEST_DATABASE_URL" -X -v ON_ERROR_STOP=1 "$@"; }

db <<'SQL'
update public.visitas set salida=entrada where salida is null;
update public.turnos set estado='expirado' where estado in ('esperando','llamado');
update public.configuracion set capacidad=1,cierre_automatico_horas=1,turno_expira_minutos=1,
  horario=(select jsonb_object_agg(d,jsonb_build_object('apertura','00:00','ultimo_ingreso','23:59','cierre','23:59'))
    from unnest(array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']) d)
where id=1;
insert into public.alumnos(nombre,rut,certificado_hasta)
select 'Concurrencia '||g,'EST019-C-'||g, (now() at time zone 'America/Santiago')::date+365
from generate_series(1,4) g;
insert into public.tarjetas(uid,alumno_id)
select 'FC:19:CC:0'||right(rut,1),id from public.alumnos where rut like 'EST019-C-%';
SQL

# Dos conexiones reales y una reducción de configuración compiten por la misma fila.
db -c "select privado.registrar_ingreso_en('FC:19:CC:01',clock_timestamp())" & p1=$!
db -c "select privado.registrar_ingreso_en('FC:19:CC:02',clock_timestamp())" & p2=$!
db -c "select privado.actualizar_configuracion_en(1,horario,1,clock_timestamp()) from public.configuracion where id=1" & p3=$!
wait "$p1"; wait "$p2"; wait "$p3"
db <<'SQL'
do $$ begin
  if (select count(*) from public.visitas where salida is null)<>1
    or (select count(*) from public.turnos where estado='esperando')<>1 then
    raise exception 'Lecturas simultáneas: aforo o espera inconsistente';
  end if;
end $$;
-- Simular una visita olvidada y esperar al JOB real, sin invocarlo manualmente.
update public.visitas set entrada=clock_timestamp()-interval '2 hours' where salida is null;
SQL

for i in $(seq 1 100); do
  if [[ "$(db -Atc "select exists(select 1 from public.visitas v join public.alumnos a on a.id=v.alumno_id where a.rut like 'EST019-C-%' and v.cierre_automatico) and exists(select 1 from public.turnos where estado='llamado')")" == t ]]; then
    echo 'OK: Cron real cerró visita y llamó al siguiente'; break
  fi
  [[ "$i" != 100 ]] || { echo 'Cron no procesó el vencimiento'; exit 1; }
  sleep 1
done
# Dejar otro alumno esperando y forzar que el llamado actual ya haya vencido.
db <<'SQL'
select privado.registrar_ingreso_en('FC:19:CC:03',clock_timestamp());
update public.turnos set llamado_en=clock_timestamp()-interval '2 minutes' where estado='llamado';
SQL
for i in $(seq 1 100); do
  if [[ "$(db -Atc "select exists(select 1 from public.turnos t join public.alumnos a on a.id=t.alumno_id where a.rut='EST019-C-3' and t.estado='llamado') and exists(select 1 from public.turnos t join public.alumnos a on a.id=t.alumno_id where a.rut in ('EST019-C-1','EST019-C-2') and t.estado='expirado')")" == t ]]; then
    echo 'OK: Cron real venció reserva y llamó al siguiente'; break
  fi
  [[ "$i" != 100 ]] || { echo 'Cron no procesó el turno vencido'; exit 1; }
  sleep 1
done
db <<'SQL'
do $ begin
  if (select count(*) from cron.job where jobname='aforofit-reconciliar-aforo')<>1
    or not exists(select from cron.job_run_details d join cron.job j using(jobid)
      where j.jobname='aforofit-reconciliar-aforo' and d.status='succeeded') then
    raise exception 'No hay evidencia del trabajo programado';
  end if;
end $$;
SQL
