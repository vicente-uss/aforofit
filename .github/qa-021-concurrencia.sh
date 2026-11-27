#!/usr/bin/env bash
set -euo pipefail
db() { psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -XqAtv ON_ERROR_STOP=1 "$@"; }

admin=$(db -c "select id from auth.users where email='admin.demo@aforofit.cl'")
profesor=$(db -c "select id from auth.users where email='profesor.demo@aforofit.cl'")
alumno=$(db -c "insert into public.alumnos(nombre,rut) values ('QA Carrera','QA-CARRERA-021') returning id")
implemento=$(db -c "insert into public.implementos(nombre,cantidad_total) values ('QA Carrera',5) returning id")
registro=$(mktemp)
PGAPPNAME=qa-021-prestamo db >"$registro" 2>&1 <<SQL &
begin;
set local request.jwt.claims to '{"sub":"$profesor","role":"authenticated"}';
set local role authenticated;
select public.registrar_prestamo('$alumno','[{"implemento_id":$implemento,"cantidad":4}]');
select pg_sleep(4);
commit;
SQL
proceso=$!

for intento in {1..40}; do
  [[ $(db -c "select count(*) from pg_stat_activity where application_name='qa-021-prestamo' and wait_event='PgSleep'") == 0 ]] || break
  sleep .05
done
[[ $(db -c "select count(*) from pg_stat_activity where application_name='qa-021-prestamo' and wait_event='PgSleep'") == 1 ]] || { cat "$registro"; exit 1; }

if db >>"$registro" 2>&1 <<SQL
begin;
set local request.jwt.claims to '{"sub":"$admin","role":"authenticated"}';
set local role authenticated;
update public.implementos set cantidad_total=3 where id=$implemento;
commit;
SQL
then
  cat "$registro"
  echo 'FALLÓ: la edición concurrente consumió stock ya prestado'
  exit 1
fi
wait "$proceso"
grep -q 'inventario_menor_que_prestado' "$registro"
[[ $(db -c "select cantidad_total from public.implementos where id=$implemento") == 5 ]]
echo 'APROBADA concurrencia: el ajuste espera el préstamo y conserva las unidades comprometidas'
