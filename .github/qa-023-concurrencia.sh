#!/usr/bin/env bash
set -euo pipefail
db() { psql "$AFOROFIT_TEST_DATABASE_URL" -XAtv ON_ERROR_STOP=1 "$@"; }
uid=$(db -c "select id from auth.users where email='alumno.demo@aforofit.cl'")
test -n "$uid"
sesion="set request.jwt.claim.sub='$uid'; set role authenticated;"
alumno=$(db -c "select id from public.alumnos where perfil_id='$uid'")
guardar() {
  db -q -c "$sesion select public.guardar_rutina_personalizada('$alumno',null,'Carrera 023 $1',jsonb_build_array(
    jsonb_build_object('ejercicio','QA', 'series',1, 'minutos',5, 'maquina_id',(select min(id) from public.maquinas))));"
}
primera=$(guardar uno)
segunda=$(guardar dos)
db -q -c "update public.rutinas set activa=false where alumno_id='$alumno' and activa"
visita=$(db -q -c "insert into public.visitas(alumno_id, entrada) values('$alumno', now()) returning id")
# La primera sesión mantiene el bloqueo después de activar. La segunda, en otra conexión,
# debe esperar y terminar con la selección que pidió.
db -q -c "begin; $sesion select public.activar_rutina('$primera'); select pg_sleep(4); commit" &
pid=$!
bloqueo=f
for intento in {1..50}; do
  bloqueo=$(db -c "select exists (select from pg_stat_activity where pid <> pg_backend_pid()
    and query like '%pg_sleep(4)%' and wait_event='PgSleep')")
  if [[ $bloqueo == t ]]; then break; fi
  sleep 0.05
done
[[ $bloqueo == t ]]
db -q -c "$sesion select public.activar_rutina('$segunda')" &
segundo_pid=$!
esperando=f
for intento in {1..50}; do
  esperando=$(db -c "select exists (select from pg_stat_activity where pid <> pg_backend_pid()
    and query like '%$segunda%' and wait_event_type='Lock')")
  if [[ $esperando == t ]]; then break; fi
  sleep 0.05
done
[[ $esperando == t ]]
wait "$pid"
wait "$segundo_pid"
[[ $(db -c "select count(*)=1 and bool_and(id='$segunda') from public.rutinas where alumno_id='$alumno' and activa") == t ]]
[[ $(db -c "select rutina_fijada and rutina_id='$primera' from public.visitas where id='$visita'") == t ]]
db -q -c "update public.visitas set salida=entrada where id='$visita'"
echo 'APROBADA activación simultánea: la visita conserva la primera rutina y queda activa la segunda'
