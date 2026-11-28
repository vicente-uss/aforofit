#!/usr/bin/env bash
set -euo pipefail
db() { psql 'postgresql://postgres:postgres@127.0.0.1:54322/postgres' -Xv ON_ERROR_STOP=1 "$@"; }

bash .github/qa-024-sql.sh base

# Comprueba que las migraciones de CR-02 preservan los datos e identificadores históricos.
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
for migracion in supabase/sql/02{5,6,7}_*.sql; do
  db -q -f "$migracion"
done
snapshot | diff -u "$RUNNER_TEMP/datos-antes-cr02" -
echo 'APROBADA actualización 024–027 con registros existentes'
db -q -f supabase/sql/028_modo_administrador.sql
snapshot | diff -u "$RUNNER_TEMP/datos-antes-cr02" -
echo 'APROBADA actualización a 028 con registros existentes'

if [[ ${1:-} == fase-3 ]]; then
  db -q <<'SQL'
with prestamo as (
  insert into public.prestamos (alumno_id, profesor_id, devuelto_en, tne_devuelta)
  select a.id, p.id, now(), true from public.alumnos a cross join public.perfiles p
  where a.rut = '00.000.001-F' and p.rol = 'profesor' limit 1
  returning id
)
insert into public.prestamo_items (prestamo_id, implemento_id, cantidad, devuelto)
select p.id, i.id, 1, 1 from prestamo p cross join public.implementos i limit 1;
SQL
  snapshot_029() {
    db -Atc "
      select to_jsonb(p) - 'externo_id' from public.prestamos p order by id;
      select to_jsonb(d) from public.prestamo_items d order by prestamo_id, implemento_id;
      select to_jsonb(i) - 'prestable' - 'foto_url' from public.implementos i order by id;"
  }
  snapshot_029 >"$RUNNER_TEMP/datos-antes-029"
  db -q -f supabase/sql/029_prestamos_inventario.sql
  snapshot_029 | diff -u "$RUNNER_TEMP/datos-antes-029" -
  echo 'APROBADA actualización a 029 con historial e inventario existentes'
fi

echo 'SUITES CONSOLIDADAS CR-02 (contar desde aquí)'
registro=$(mktemp)
trap 'rm -f "$registro"' EXIT
for archivo in supabase/pruebas/*.sql supabase/pruebas/{020,021,medidas,023,024,cr02}/*.sql; do
  [[ "$archivo" != */migracion_017.sql ]] || continue
  [[ "$archivo" != */prestamos_inventario_029.sql || ${1:-} == fase-3 ]] || continue
  if db -f "$archivo" >"$registro" 2>&1; then
    printf '%s · %s aprobadas\n' "$archivo" "$(grep -c 'NOTICE:  OK' "$registro")"
  else
    cat "$registro"
    exit 1
  fi
done
