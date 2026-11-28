#!/usr/bin/env bash
set -euo pipefail
db() { psql 'postgresql://postgres:postgres@127.0.0.1:54322/postgres' -Xv ON_ERROR_STOP=1 "$@"; }

bash .github/qa-024-sql.sh base

# Comprueba que 025 y 026 preservan los datos e identificadores históricos.
snapshot() {
  db -Atc "
    select to_jsonb(a) - 'tipo_persona' from public.alumnos a order by id;
    select to_jsonb(t) from public.tarjetas t order by uid;
    select to_jsonb(v) from public.visitas v order by id;
    select to_jsonb(r) from public.rutinas r order by id;
    select to_jsonb(t) from public.turnos t order by id;
    select to_jsonb(p) from public.prestamos p order by id;"
}
snapshot >"$RUNNER_TEMP/datos-antes-cr02"
for migracion in supabase/sql/02{5,6}_*.sql; do
  db -q -f "$migracion"
done
snapshot | diff -u "$RUNNER_TEMP/datos-antes-cr02" -
echo 'APROBADA actualización 024–026 con registros existentes'

echo 'SUITES CONSOLIDADAS CR-02 (contar desde aquí)'
registro=$(mktemp)
trap 'rm -f "$registro"' EXIT
for archivo in supabase/pruebas/*.sql supabase/pruebas/{020,021,medidas,023,024,cr02}/*.sql; do
  [[ "$archivo" != */migracion_017.sql ]] || continue
  if db -f "$archivo" >"$registro" 2>&1; then
    printf '%s · %s aprobadas\n' "$archivo" "$(grep -c 'NOTICE:  OK' "$registro")"
  else
    cat "$registro"
    exit 1
  fi
done
