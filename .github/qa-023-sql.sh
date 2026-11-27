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

bash .github/qa-019.sh --limpia
if [[ ${1:-} == actualizacion ]]; then
  # Estado persistente de 022 distinto de las filas que generan las suites históricas.
  db -q <<'SQL'
with alumno as (select id from public.alumnos where rut='00.000.023-F'),
rutina as (insert into public.rutinas(alumno_id,activa) select id,false from alumno returning id),
visita as (
  insert into public.visitas(alumno_id,entrada,salida)
  select id,now()-interval '3 days 1 hour',now()-interval '3 days' from alumno returning id
)
insert into public.feedback(visita_id,rutina_id,valor)
select visita.id,rutina.id,'justo' from visita,rutina;
SQL
fi
for migracion in supabase/sql/02{0,1,2}_*.sql; do
  db -q -f "$migracion"
done

historial() {
  db -Atc "select to_jsonb(r) - 'nombre' - 'archivada_en' from public.rutinas r order by id;
  select to_jsonb(v) - 'rutina_id' - 'rutina_fijada' from public.visitas v order by id;
  select to_jsonb(f) from public.feedback f order by id"
}

funciones_previas() {
  db -Atc "select pg_get_functiondef(p) from unnest(array[
    'privado.generar_rutina_de(uuid)'::regprocedure,
    'privado.registrar_feedback_en(uuid,text,timestamp with time zone)'::regprocedure,
    'public.rutina_del_dia(uuid)'::regprocedure
  ]) as funciones(p)"
}
funciones_previas >"$RUNNER_TEMP/funciones-022"
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
  # El trabajo regresion-019 verifica 017 desde 015 y el Cron con datos propios.
  [[ "$archivo" != */migracion_017.sql ]] || continue
  suite "$archivo"
done
bash .github/qa-023-concurrencia.sh
db -q <<'SQL'
with activa as (
  select r.id, r.alumno_id from public.rutinas r where r.nombre = 'Carrera 023 dos' and r.activa
), visita as (
  insert into public.visitas(alumno_id,entrada)
  select alumno_id,now() from activa returning id, rutina_id
)
insert into public.feedback(visita_id,rutina_id,valor)
select id,rutina_id,'justo' from visita;
update public.visitas set salida=entrada where salida is null;
SQL

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
funciones_previas | diff "$RUNNER_TEMP/funciones-022" -
db -q -f supabase/sql/023_rutinas_personalizadas.sql
datos_completos | diff "$RUNNER_TEMP/datos-023" -
suite supabase/pruebas/023/rutinas_personalizadas.sql
echo 'APROBADA actualización desde 022, reversión con historial y reaplicación de 023'
