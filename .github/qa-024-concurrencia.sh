#!/usr/bin/env bash
set -euo pipefail
db() { psql "$AFOROFIT_TEST_DATABASE_URL" -XAtv ON_ERROR_STOP=1 "$@"; }
admin=$(db -c "select id from auth.users where email='admin.demo@aforofit.cl'")
prof=$(db -c "select id from auth.users where email='profesor.demo@aforofit.cl'")
db -q <<'SQL'
update public.configuracion set capacidad=3, turno_expira_minutos=10, horario=(
  select jsonb_object_agg(d,'{"apertura":"00:00","ultimo_ingreso":"23:59","cierre":"23:59"}'::jsonb)
  from unnest(array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']) d
);
insert into public.alumnos(nombre,rut,certificado_hasta) values
  ('QA Dentro','QA-024-D',current_date+365),('QA Reserva antigua','QA-024-A',current_date+365),
  ('QA Reserva reciente','QA-024-R',current_date+365),('QA Nuevo','QA-024-N',current_date+365);
insert into public.tarjetas(uid,alumno_id)
  select 'FC:24:FE:01',id from public.alumnos where rut='QA-024-N';
insert into public.visitas(alumno_id,entrada)
  select id,clock_timestamp() from public.alumnos where rut='QA-024-D';
insert into public.turnos(alumno_id,numero,estado,creado_en,llamado_en)
  select id,case rut when 'QA-024-A' then 1 else 2 end,'llamado',clock_timestamp(),
    clock_timestamp() - case rut when 'QA-024-A' then interval '3 minutes' else interval '0 seconds' end
  from public.alumnos where rut in ('QA-024-A','QA-024-R');
SQL

db -q -c "begin;
  select set_config('request.jwt.claim.sub','$admin',true);
  set local role authenticated;
  select public.actualizar_configuracion_completa(
    (to_jsonb(c) - 'id' - 'periodo_inicio' - 'periodo_fin') || '{\"capacidad\":1,\"turno_expira_minutos\":2}'::jsonb)
    from public.configuracion c;
  select pg_sleep(5); commit" >"$RUNNER_TEMP/configuracion-024-lock" &
config_pid=$!

esperar() {
  local nombre=$1 evento=$2
  for intento in {1..65}; do
    if [[ $(db -c "select exists(select from pg_stat_activity where application_name='$nombre' and $evento)") == t ]]; then
      return 0
    fi
    sleep 0.05
  done
  return 1
}

# Se usa el estado de la sesión, no un retardo supuesto, para iniciar las otras dos conexiones.
for intento in {1..65}; do
  if [[ $(db -c "select exists(select from pg_stat_activity where pid<>pg_backend_pid()
    and query like '%pg_sleep(5)%' and wait_event='PgSleep')") == t ]]; then
    break
  fi
  [[ $intento != 65 ]]
  sleep 0.05
done

PGAPPNAME=qa-024-ingreso db -q -c "select set_config('request.jwt.claim.sub','$prof',false);
  set role authenticated; select public.registrar_ingreso('FC:24:FE:01')->>'resultado'" >"$RUNNER_TEMP/ingreso-024" &
ingreso_pid=$!
PGAPPNAME=qa-024-turnos db -q -c "select privado.procesar_aforo_programado()" &
turnos_pid=$!
esperar qa-024-ingreso "wait_event_type='Lock'"
esperar qa-024-turnos "wait_event_type='Lock'"
wait "$config_pid"
wait "$ingreso_pid"
wait "$turnos_pid"
[[ $(tail -n 1 "$RUNNER_TEMP/ingreso-024") == turno ]]
[[ $(db -c "select exists(select from public.visitas v join public.alumnos a on a.id=v.alumno_id
  where a.rut='QA-024-D' and v.salida is null)
  and (select capacidad=1 and ocupacion=1 and turno_llamado is null from public.aforo)
  and (select t.estado='expirado' from public.turnos t join public.alumnos a on a.id=t.alumno_id where a.rut='QA-024-A')
  and (select t.estado='esperando' and numero=2 and llamado_en is null
    from public.turnos t join public.alumnos a on a.id=t.alumno_id where a.rut='QA-024-R')") == t ]]
db -q -c "select set_config('request.jwt.claim.sub','$admin',false); set role authenticated;
  select public.actualizar_configuracion_completa(
    (to_jsonb(c) - 'id' - 'periodo_inicio' - 'periodo_fin') || '{\"capacidad\":2}'::jsonb) from public.configuracion c"
[[ $(db -c "select capacidad=2 and ocupacion=1 and turno_llamado=2 and en_espera=1 from public.aforo") == t ]]
echo 'APROBADA concurrencia de configuración, ingreso y turnos con ocupación y reservas activas'
