#!/usr/bin/env bash
set -euo pipefail
export AFOROFIT_TEST_DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
db() { psql "$AFOROFIT_TEST_DATABASE_URL" -Xv ON_ERROR_STOP=1 "$@"; }
suite() {
  local salida
  salida=$(mktemp)
  if db -f "$1" >"$salida" 2>&1; then
    printf '%s · %s aprobadas\n' "$1" "$(grep -c 'NOTICE:  OK' "$salida")"
  else
    cat "$salida"
    return 1
  fi
}

# La instalación previa verifica el arranque limpio hasta 023.
bash .github/qa-023-sql.sh limpia

migracion=supabase/sql/024_configuracion_completa.sql
if [[ ${1:-} == actualizacion ]]; then
  db -q <<'SQL'
with alumno as (select id from public.alumnos where rut='00.000.023-F'),
rutina as (insert into public.rutinas(alumno_id,activa) select id,false from alumno returning id,alumno_id),
visita as (
  insert into public.visitas(alumno_id,entrada,salida)
  select alumno_id,now()-interval '3 days 1 hour',now()-interval '3 days' from rutina returning id
)
insert into public.feedback(visita_id,rutina_id,valor)
select visita.id,rutina.id,'justo' from visita,rutina;
SQL
fi
snapshot() {
  db -Atc "select to_jsonb(c) from public.configuracion c;
    select to_jsonb(r) from public.rutinas r order by id;
    select to_jsonb(e) from public.rutina_ejercicios e order by id;
    select to_jsonb(f) from public.feedback f order by id;
    select to_jsonb(v) from public.visitas v where salida is not null order by id"
}
snapshot >"$RUNNER_TEMP/datos-antes-024"
db -q -f "$migracion"
snapshot | diff "$RUNNER_TEMP/datos-antes-024" -
if [[ ${1:-} == actualizacion ]]; then
  db -Atc "select pg_get_functiondef('privado.nueva_carga(numeric,text,jsonb)'::regprocedure)" >"$RUNNER_TEMP/carga-024"
  # Cambiar los parámetros, antes de revertir, comprueba que sobreviven al rollback.
  db -q <<'SQL'
select set_config('request.jwt.claim.sub',(select id::text from public.perfiles where rol='admin' limit 1),false);
select public.actualizar_configuracion_completa(
  (to_jsonb(c) - 'id' - 'periodo_inicio' - 'periodo_fin') || '{"turno_expira_minutos":4}'::jsonb
) from public.configuracion c;
SQL
  snapshot >"$RUNNER_TEMP/datos-024"
  db -q -f supabase/reversion/024_configuracion_completa.sql
  [[ $(db -Atc "select to_regprocedure('public.actualizar_configuracion_completa(jsonb)') is null") == t ]]
  snapshot | diff "$RUNNER_TEMP/datos-024" -
  db -q -f "$migracion"
  snapshot | diff "$RUNNER_TEMP/datos-024" -
  db -Atc "select pg_get_functiondef('privado.nueva_carga(numeric,text,jsonb)'::regprocedure)" | diff "$RUNNER_TEMP/carga-024" -
  bash .github/qa-023-concurrencia.sh
  bash .github/qa-024-concurrencia.sh
  echo 'APROBADA actualización desde 023, reversión y reaplicación con datos persistentes'
  exit 0
fi

echo 'APROBADA instalación limpia 001–024'
[[ "${1:-}" != base ]] || exit 0
echo 'SUITES CONSOLIDADAS 024 (contar desde aquí)'
for archivo in supabase/pruebas/*.sql supabase/pruebas/{020,021,medidas,023,024}/*.sql; do
  # La suite migracion_017 se ejecuta desde 015 en el trabajo regresion-019.
  [[ "$archivo" != */migracion_017.sql ]] || continue
  suite "$archivo"
done
