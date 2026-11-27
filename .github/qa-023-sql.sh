#!/usr/bin/env bash
set -euo pipefail
export AFOROFIT_TEST_DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
db() { psql "$AFOROFIT_TEST_DATABASE_URL" -Xv ON_ERROR_STOP=1 "$@"; }

suite() {
  local archivo=$1 salida
  salida=$(mktemp)
  if db -f "$archivo" >"$salida" 2>&1; then
    printf '%s · %s aprobadas\n' "$archivo" "$(grep -c 'NOTICE:  OK' "$salida")"
  else
    cat "$salida"
    return 1
  fi
}

if [[ ${1:-} == limpia ]]; then
  bash .github/qa-019.sh --limpia
else
  bash .github/qa-019.sh
fi
for migracion in supabase/sql/02{0,1,2}_*.sql; do
  db -q -f "$migracion"
done

historial() {
  db -Atc "select to_jsonb(r) - 'nombre' - 'archivada_en' from public.rutinas r order by id;
  select to_jsonb(v) - 'rutina_id' - 'rutina_fijada' from public.visitas v order by id;
  select to_jsonb(f) from public.feedback f order by id"
}

historial >"$RUNNER_TEMP/antes-023"
db -q -f supabase/sql/023_rutinas_personalizadas.sql
historial >"$RUNNER_TEMP/despues-023"
diff -u "$RUNNER_TEMP/antes-023" "$RUNNER_TEMP/despues-023"
suite supabase/pruebas/023/rutinas_personalizadas.sql

if [[ ${1:-} == limpia ]]; then
  echo 'APROBADA instalación desde cero 001–023'
  exit 0
fi

for archivo in supabase/pruebas/*.sql supabase/pruebas/{020,021,medidas}/*.sql; do
  # La prueba 017 verifica el salto desde 015 y ya se ejecutó en qa-019.
  [[ "$archivo" != */migracion_017.sql ]] || continue
  suite "$archivo"
done
bash .github/qa-023-concurrencia.sh

datos_completos() {
  db -Atc "select to_jsonb(r) from public.rutinas r order by id;
    select to_jsonb(e) from public.rutina_ejercicios e order by id;
    select to_jsonb(v) from public.visitas v order by id;
    select to_jsonb(f) from public.feedback f order by id"
}
datos_completos >"$RUNNER_TEMP/datos-023"
db -q -f supabase/reversion/023_rutinas_personalizadas.sql
[[ $(db -Atc "select to_regprocedure('public.activar_rutina(uuid)') is null
  and to_regprocedure('privado.fijar_rutina_visita()') is null") == t ]]
datos_completos | diff "$RUNNER_TEMP/datos-023" -
suite supabase/pruebas/rutinas.sql
db -q -f supabase/sql/023_rutinas_personalizadas.sql
datos_completos | diff "$RUNNER_TEMP/datos-023" -
suite supabase/pruebas/023/rutinas_personalizadas.sql
echo 'APROBADA actualización desde 022, reversión con historial y reaplicación de 023'
