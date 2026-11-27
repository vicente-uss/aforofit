#!/usr/bin/env bash
set -euo pipefail

# qa-019 también ejecuta la suite de actualización 017 en el punto correcto,
# las comprobaciones de permisos de 018 y la concurrencia y Cron de 019.
bash .github/qa-019.sh
db() { psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -Xv ON_ERROR_STOP=1 "$@"; }
suite() {
  local archivo=$1 registro
  registro=$(mktemp)
  if db -f "$archivo" >"$registro" 2>&1; then
    printf 'APROBADA 021 %s %s\n' "$archivo" "$(grep -c 'NOTICE:  OK' "$registro")"
  else
    cat "$registro"
    return 1
  fi
}

db -f supabase/sql/021_administracion_catalogo.sql
db -f supabase/sql/021_administracion_catalogo.sql
for archivo in supabase/pruebas/*.sql supabase/pruebas/021/catalogo.sql; do
  [[ "$archivo" != */migracion_017.sql ]] || continue
  suite "$archivo"
done
bash .github/qa-021-concurrencia.sh

db -Atc "select id,nombre,estado,foto_url from public.maquinas order by id" >"$RUNNER_TEMP/maquinas-021"
db -Atc "select id,nombre,cantidad_total from public.implementos order by id" >"$RUNNER_TEMP/implementos-021"
db -f supabase/reversion/021_administracion_catalogo.sql
db -Atc "select id,nombre,estado,foto_url from public.maquinas order by id" | diff "$RUNNER_TEMP/maquinas-021" -
db -Atc "select id,nombre,cantidad_total from public.implementos order by id" | diff "$RUNNER_TEMP/implementos-021" -
[[ $(db -Atc "select to_regclass('public.catalogo_implementos') is null from storage.buckets where id='maquinas' and file_size_limit is null and allowed_mime_types is null") == t ]]
suite supabase/pruebas/seguridad_018.sql
db -f supabase/sql/021_administracion_catalogo.sql
suite supabase/pruebas/021/catalogo.sql
echo 'APROBADA reversión y reaplicación 021 sin alterar catálogo ni permisos previos'
