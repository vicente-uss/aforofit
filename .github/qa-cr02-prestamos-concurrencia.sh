#!/usr/bin/env bash
set -euo pipefail
url=postgresql://postgres:postgres@127.0.0.1:54322/postgres
[[ ${AFOROFIT_TEST_DATABASE_URL:-} == "$url" ]]
db() { psql "$url" -XqAtv ON_ERROR_STOP=1 "$@"; }
profesor=$(db -c "select id from auth.users where email = 'profesor.demo@aforofit.cl'")
registro=$(mktemp)
trap 'rm -f "$registro"' EXIT

competir() {
  local motivo=$1 mismo_id=$2 implemento primero segundo proceso
  implemento=$(db -c "insert into public.implementos (nombre, cantidad_total)
    values ('QA simultáneo $motivo', $((1 + mismo_id))) returning id")
  primero=$(db -c 'select gen_random_uuid()')
  segundo=$(db -c 'select gen_random_uuid()')
  if [[ $mismo_id == 1 ]]; then segundo=$primero; fi

  PGAPPNAME=qa-029-primero db >"$registro" 2>&1 <<SQL &
begin;
set local request.jwt.claims to '{"sub":"$profesor","role":"authenticated"}';
set local role authenticated;
select public.registrar_prestamo_por_nombre('$primero', true, 'QA Simultáneo', null,
  '[{"implemento_id":$implemento,"cantidad":1}]', true);
select pg_sleep(4);
commit;
SQL
  proceso=$!
  for intento in {1..40}; do
    [[ $(db -c "select count(*) from pg_stat_activity where application_name='qa-029-primero' and wait_event='PgSleep'") == 0 ]] || break
    sleep .05
  done
  [[ $(db -c "select count(*) from pg_stat_activity where application_name='qa-029-primero' and wait_event='PgSleep'") == 1 ]] || { cat "$registro"; exit 1; }

  if db >>"$registro" 2>&1 <<SQL
begin;
set local statement_timeout = '12s';
set local request.jwt.claims to '{"sub":"$profesor","role":"authenticated"}';
set local role authenticated;
select public.registrar_prestamo_por_nombre('$segundo', true, 'QA Simultáneo', null,
  '[{"implemento_id":$implemento,"cantidad":1}]', true);
commit;
SQL
  then
    cat "$registro"
    echo 'FALLÓ: ambos préstamos fueron aceptados'
    exit 1
  fi
  wait "$proceso"
  grep -q "ERROR:  $motivo" "$registro" || { cat "$registro"; exit 1; }
  [[ $(db -c "select coalesce(sum(cantidad - devuelto), 0) from public.prestamo_items where implemento_id = $implemento") == 1 ]]
  [[ $(db -c "select count(*) from public.solicitantes_externos where id in ('$primero', '$segundo')") == 1 ]]
  db <<SQL
delete from public.prestamo_items where implemento_id = $implemento;
delete from public.prestamos where externo_id = '$primero';
delete from public.solicitantes_externos where id = '$primero';
delete from public.implementos where id = $implemento;
SQL
  echo "APROBADA concurrencia 029: $motivo"
}

competir stock_insuficiente 0
competir prestamo_abierto 1
