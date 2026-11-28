#!/usr/bin/env bash
set -euo pipefail
url=postgresql://postgres:postgres@127.0.0.1:54322/postgres
[[ ${AFOROFIT_TEST_DATABASE_URL:-} == "$url" ]]
db() { psql "$url" -XqAtv ON_ERROR_STOP=1 "$@"; }
profesor=$(db -c "select id from auth.users where email = 'profesor.demo@aforofit.cl'")
fecha=$(db -c "select (date_trunc('week', now() at time zone 'America/Santiago')::date + 21)")
registro=$(mktemp -d)
trap 'rm -rf "$registro"' EXIT

competir() {
  local caso=$1 fecha_caso=$2 primero=$3 segundo=$4 proceso
  PGAPPNAME=qa-030-primero db >"$registro/primero" 2>&1 <<SQL &
begin;
set local request.jwt.claims to '{"sub":"$profesor","role":"authenticated"}';
set local role authenticated;
$primero
select pg_sleep(4);
commit;
SQL
  proceso=$!
  for intento in {1..50}; do
    [[ $(db -c "select count(*) from pg_stat_activity where application_name='qa-030-primero' and wait_event='PgSleep'") == 0 ]] || break
    sleep .05
  done
  [[ $(db -c "select count(*) from pg_stat_activity where application_name='qa-030-primero' and wait_event='PgSleep'") == 1 ]] || { cat "$registro/primero"; exit 1; }

  if db >"$registro/segundo" 2>&1 <<SQL
begin;
set local statement_timeout = '12s';
set local request.jwt.claims to '{"sub":"$profesor","role":"authenticated"}';
set local role authenticated;
$segundo
commit;
SQL
  then
    echo "FALLÓ: ambas sesiones guardaron el mismo horario ($caso)"
    exit 1
  fi
  wait "$proceso"
  grep -q 'ERROR:  multicancha_superposicion' "$registro/segundo" || { cat "$registro/segundo"; exit 1; }
  [[ $(db -c "select count(*) from public.multicancha_reservas where fecha = '$fecha_caso' and cancelada_en is null") == 1 ]]
  [[ $(db -c "select count(*) from public.multicancha_historial where fecha = '$fecha_caso'") == 1 ]]
  echo "APROBADA concurrencia 030: $caso"
}

ordinaria="select public.guardar_multicancha('$fecha','ordinaria',1::smallint,
  p_responsable=>'QA Concurrente',p_carrera=>'QA',p_correo=>'concurrencia@example.test');"
competir 'una de dos reservas ordinarias simultáneas' "$fecha" "$ordinaria" "$ordinaria"

fecha_institucional=$(db -c "select date '$fecha' + 1")
competir 'actividad institucional y reserva simultáneas' "$fecha_institucional" \
  "select public.guardar_multicancha('$fecha_institucional','institucional',
    p_hora_inicio=>'08:05',p_hora_fin=>'08:45',p_titulo=>'QA Clase');" \
  "select public.guardar_multicancha('$fecha_institucional','ordinaria',1::smallint,
    p_responsable=>'QA Concurrente',p_carrera=>'QA',p_correo=>'concurrencia@example.test');"
