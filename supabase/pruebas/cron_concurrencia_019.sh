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

esperar_cron() {
  local descripcion=$1 consulta=$2 resultado
  local intento
  for ((intento=0; intento<100; intento++)); do
    resultado=$(db -Atc "$consulta")
    if [[ "$resultado" == t ]]; then
      echo "OK: $descripcion"
      return
    fi
    sleep 1
  done
  echo "Cron no completó: $descripcion" >&2
  return 1
}

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
    or (select count(*) from public.turnos where estado='esperando')<>1
    or not exists(select from public.aforo where id=1 and ocupacion=1 and capacidad=1 and en_espera=1) then
    raise exception 'Lecturas simultáneas: aforo o espera inconsistente';
  end if;
  raise notice 'OK: Ingresos simultáneos y configuración respetan la capacidad';
end $$;
-- Simular una visita olvidada y esperar al JOB real, sin invocarlo manualmente.
update public.visitas set entrada=clock_timestamp()-interval '2 hours' where salida is null;
SQL

esperar_cron 'Cron real cerró visita y llamó al siguiente' "
  select exists(select from public.visitas v join public.alumnos a on a.id=v.alumno_id
    where a.rut like 'EST019-C-%' and v.cierre_automatico
      and v.salida=v.entrada+interval '1 hour' and v.cerrada_por is null)
  and exists(select from public.turnos t join public.alumnos a on a.id=t.alumno_id
    where a.rut in ('EST019-C-1','EST019-C-2') and t.estado='llamado')
  and exists(select from public.aforo where id=1 and ocupacion=0 and turno_llamado is not null)"
# Dejar otro alumno esperando y forzar que el llamado actual ya haya vencido.
db <<'SQL'
begin;
select 1 from public.aforo where id=1 for update;
-- Que la preparación siga siendo válida si el job anterior se observó justo al vencer.
update public.turnos set llamado_en=clock_timestamp() where estado='llamado';
select privado.registrar_ingreso_en('FC:19:CC:03',clock_timestamp());
update public.turnos set llamado_en=clock_timestamp()-interval '2 minutes' where estado='llamado';
commit;
SQL
esperar_cron 'Cron real venció reserva y llamó al siguiente' "
  select exists(select from public.turnos t join public.alumnos a on a.id=t.alumno_id
    where a.rut='EST019-C-3' and t.estado='llamado')
  and exists(select from public.turnos t join public.alumnos a on a.id=t.alumno_id
    where a.rut in ('EST019-C-1','EST019-C-2') and t.estado='expirado')"
db <<'SQL'
do $$ begin
  if (select count(*) from cron.job where jobname='aforofit-reconciliar-aforo')<>1
    or not exists(select from cron.job j where j.jobname='aforofit-reconciliar-aforo'
      and j.active and j.schedule='* * * * *'
      and j.command='select privado.procesar_aforo_programado()') then
    raise exception 'No hay evidencia del trabajo programado';
  end if;
  raise notice 'OK: Solo un trabajo activo con el comando y la frecuencia esperados';
end $$;
SQL

# El cambio de datos puede ser visible antes de que pg_cron anote el éxito de la ejecución.
esperar_cron 'Historial de Cron confirma dos ejecuciones exitosas durante la prueba' "
  select count(*)>=2 from cron.job_run_details d join cron.job j using(jobid)
  where j.jobname='aforofit-reconciliar-aforo' and d.status='succeeded'
    and d.end_time>=(select min(entrada)+interval '2 hours' from public.visitas v
      join public.alumnos a on a.id=v.alumno_id where a.rut like 'EST019-C-%')"
db -c "select d.status, d.start_time, d.end_time, d.return_message
  from cron.job_run_details d join cron.job j using(jobid)
  where j.jobname='aforofit-reconciliar-aforo' order by d.start_time desc limit 5"
