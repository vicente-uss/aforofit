#!/usr/bin/env bash
# Solo DB local DESECHABLE. El script deja datos: destruir la base al terminar.
set -euo pipefail
: "${AFOROFIT_TEST_DATABASE_URL:?Indicar URL de la base de pruebas desechable}"
case "$AFOROFIT_TEST_DATABASE_URL" in
  *\?*|*\#*|*,*) echo 'La URL local no puede incluir opciones ni otros servidores'; exit 1 ;;
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
  db -c "select d.status, d.start_time, d.end_time, d.return_message
    from cron.job_run_details d join cron.job j using(jobid)
    where j.jobname='aforofit-reconciliar-aforo' order by d.start_time desc limit 5"
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

# Conservar la reserva de C-3 para crear una visita y enfrentar todas las entradas
# al mismo bloqueo, incluida la próxima ejecución programada de pg_cron.
db <<'SQL'
begin;
select 1 from public.aforo where id=1 for update;
update public.turnos set llamado_en=clock_timestamp() where estado='llamado';
select privado.registrar_ingreso_en('FC:19:CC:03',clock_timestamp());
insert into privado.codigos_ingreso(alumno_id,codigo,vence_en)
select id,'QATEST',clock_timestamp()+interval '3 minutes' from public.alumnos where rut='EST019-C-4';
commit;
SQL
visita=$(db -Atc "select v.id from public.visitas v join public.alumnos a on a.id=v.alumno_id
  where a.rut='EST019-C-3' and v.salida is null")
[[ -n "$visita" ]]
inicio_carrera=$(db -Atc 'select clock_timestamp()')

como() {
  local rol=$1 consulta=$2
  db -c "begin;
    select set_config('request.jwt.claims',jsonb_build_object('sub',p.id,'role','authenticated')::text,true)
      from public.perfiles p where p.rol='$rol' order by p.id limit 1;
    set local role authenticated;
    $consulta;
    commit"
}

PGAPPNAME=aforofit_qa_barrera db <<'SQL' &
begin;
select 1 from public.aforo where id=1 for update;
select pg_sleep(65-extract(second from clock_timestamp()));
commit;
SQL
barrera=$!
esperar_cron 'Barrera de aforo adquirida' "select exists(select from pg_stat_activity
  where application_name='aforofit_qa_barrera' and wait_event='PgSleep')"

PGAPPNAME=aforofit_qa_uid como profesor "select public.registrar_ingreso('FC:19:CC:01')" & ingreso=$!
PGAPPNAME=aforofit_qa_qr como profesor "select public.registrar_ingreso_codigo('QATEST')" & qr=$!
PGAPPNAME=aforofit_qa_manual como profesor "select public.cerrar_visita('$visita'::uuid)" & manual=$!
PGAPPNAME=aforofit_qa_config como admin "select public.actualizar_configuracion(1,horario,1)
  from public.configuracion where id=1" & configuracion=$!
esperar_cron 'Cuatro RPC y el job real compiten por el mismo bloqueo' "
  select count(*)=4 and exists(select from pg_stat_activity
    where query='select privado.procesar_aforo_programado()' and wait_event_type='Lock')
  from pg_stat_activity where application_name in
    ('aforofit_qa_uid','aforofit_qa_qr','aforofit_qa_manual','aforofit_qa_config') and wait_event_type='Lock'"
fallo=0
for pid in "$barrera" "$ingreso" "$qr" "$manual" "$configuracion"; do
  wait "$pid" || fallo=1
done
[[ "$fallo" == 0 ]]
esperar_cron 'Cron terminó exitosamente después de competir por aforo' "
  select exists(select from cron.job_run_details d join cron.job j using(jobid)
  where j.jobname='aforofit-reconciliar-aforo' and d.status='succeeded'
    and d.start_time >= '$inicio_carrera'::timestamptz)"

db -v visita="$visita" <<'SQL'
select set_config('aforofit_qa.visita', :'visita',false);
do $$
begin
  if not exists(select from public.visitas where id=current_setting('aforofit_qa.visita')::uuid
      and salida is not null and not cierre_automatico and cerrada_por is not null)
    or exists(select from privado.codigos_ingreso where codigo='QATEST')
    or (select count(*) from public.visitas where salida is null)
      + (select count(*) from public.turnos where estado='llamado') <> 1
    or not exists(select from public.aforo a where a.id=1 and a.capacidad=1
      and a.ocupacion=(select count(*) from public.visitas where salida is null)
      and a.en_espera=(select count(*) from public.turnos where estado='esperando')
      and a.turno_llamado is not distinct from (select min(numero) from public.turnos where estado='llamado')) then
    raise exception 'Carrera entre ingreso, QR, cierre manual, configuración y Cron inconsistente';
  end if;
  raise notice 'OK: QR consumido, cierre manual preservado y aforo consistente tras la carrera';
end;
$$;
SQL

# El mismo UID nunca puede terminar asociado a dos alumnos aunque ambas RPC se solapen.
resultados=$(mktemp -d)
trap 'rm -f "$resultados/tne" "$resultados/tui"; rmdir "$resultados"' EXIT
como profesor "select public.vincular_credencial('FC:19:CC:0F',id)
  from public.alumnos where rut='EST019-C-1'" >"$resultados/tne" & tne=$!
como profesor "select public.vincular_credencial('FC:19:CC:0F',id,'credencial_uss')
  from public.alumnos where rut='EST019-C-2'" >"$resultados/tui" & tui=$!
fallo=0
for pid in "$tne" "$tui"; do
  wait "$pid" || fallo=1
done
[[ "$fallo" == 0 ]]
[[ $(grep -hFc '"ok": true' "$resultados/tne" "$resultados/tui" | awk '{s+=$1} END{print s}') == 1 ]]
[[ $(grep -hFc '"motivo": "credencial_de_otro_alumno"' "$resultados/tne" "$resultados/tui" | awk '{s+=$1} END{print s}') == 1 ]]
[[ $(db -Atc "select count(*) from public.tarjetas t join public.alumnos a on a.id=t.alumno_id
  where t.uid='FC:19:CC:0F' and ((a.rut='EST019-C-1' and t.tipo='tne')
    or (a.rut='EST019-C-2' and t.tipo='credencial_uss'))") == 1 ]]
echo 'OK: Vinculación simultánea TNE/TUI conserva un solo titular y devuelve conflicto JSON'
