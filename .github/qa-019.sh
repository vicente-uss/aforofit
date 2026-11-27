#!/usr/bin/env bash
set -euo pipefail
export AFOROFIT_TEST_DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
export AFOROFIT_TEST_DESTRUCTIVO=SI
db() { psql "$AFOROFIT_TEST_DATABASE_URL" -X -v ON_ERROR_STOP=1 "$@"; }
suite() {
  local archivo=$1 registro
  registro=$(mktemp)
  if db -f "$archivo" >"$registro" 2>&1; then
    printf 'APROBADA %s %s\n' "$archivo" "$(grep -c 'NOTICE:  OK' "$registro")"
  else
    cat "$registro"
    return 1
  fi
}
base_015() {
  for archivo in supabase/sql/0{01,02,03,04,05,06,07,08,09,10,11,12,13,14,15}_*.sql; do
    db -q -f "$archivo" >/dev/null
  done
  db <<'SQL'
update public.perfiles p set rol=split_part(u.email,'.',1)
from auth.users u where p.id=u.id and u.email in ('profesor.demo@aforofit.cl','admin.demo@aforofit.cl');
SQL
}
cuentas() {
  local rol
  for rol in alumno profesor admin; do
    curl --fail-with-body --silent --show-error -o /dev/null \
      -H "apikey: $SERVICE_ROLE_KEY" -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
      -H 'Content-Type: application/json' \
      --data "{\"email\":\"$rol.demo@aforofit.cl\",\"password\":\"Solo-Pruebas-019!\",\"email_confirm\":true}" \
      http://127.0.0.1:54321/auth/v1/admin/users
  done
}
credenciales() { eval "$(supabase status -o env)"; }
versiones() {
  db -c 'select version()' -c 'show shared_preload_libraries' \
    -c "select name, default_version from pg_available_extensions where name='pg_cron'"
}
funciones() {
  db -Atc "select p.oid::regprocedure, md5(pg_get_functiondef(p.oid)), p.proacl,
    has_function_privilege('anon',p.oid,'EXECUTE'),has_function_privilege('authenticated',p.oid,'EXECUTE')
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname in ('public','privado') and p.prokind='f' order by p.oid::regprocedure::text"
}
permisos() {
  db -Atc "select p.oid::regprocedure, p.proowner, p.prosecdef, p.proconfig,
    p.proacl, has_function_privilege('anon',p.oid,'EXECUTE'),
    has_function_privilege('authenticated',p.oid,'EXECUTE'),has_function_privilege('service_role',p.oid,'EXECUTE')
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname in ('public','privado') and p.prokind='f' order by p.oid::regprocedure::text"
}
historicos() {
  db -At <<'SQL'
select 'visitas', md5(coalesce(string_agg(to_jsonb(v)::text, ',' order by v.id),'')) from public.visitas v;
select 'turnos', md5(coalesce(string_agg(to_jsonb(t)::text, ',' order by t.id),'')) from public.turnos t;
select 'prestamos', md5(coalesce(string_agg(to_jsonb(p)::text, ',' order by p.id),'')) from public.prestamos p;
select 'feedback', md5(coalesce(string_agg(to_jsonb(f)::text, ',' order by f.id),'')) from public.feedback f;
SQL
}
credenciales
cuentas
base_015
suite supabase/pruebas/migracion_017.sql
db -q -f supabase/sql/018_seguridad_final.sql
db <<'SQL'
with alumno as (select id from public.alumnos where rut='00.000.001-F'),
rutina as (insert into public.rutinas(alumno_id,activa) select id,false from alumno returning id),
visita as (
  insert into public.visitas(alumno_id,entrada,salida)
  select id,now()-interval '3 days 1 hour',now()-interval '3 days' from alumno returning id
)
insert into public.feedback(visita_id,rutina_id,valor) select visita.id,rutina.id,'justo' from visita,rutina;
insert into public.turnos(alumno_id,numero,estado,creado_en)
select id,1,'expirado',now()-interval '3 days' from public.alumnos where rut='00.000.001-F';
SQL
versiones
funciones >"$RUNNER_TEMP/funciones-018"
permisos >"$RUNNER_TEMP/permisos-018"
historicos >"$RUNNER_TEMP/historia-018"
db -c 'create extension if not exists pg_cron with schema pg_catalog' \
  -c "select cron.schedule('qa-ajeno-019', '0 0 1 1 *', 'select 19')"
ajeno=$(db -Atc "select to_jsonb(j) from cron.job j where jobname='qa-ajeno-019'")
[[ -n "$ajeno" ]]
db -q -f supabase/sql/019_estabilidad_final.sql
db -q -f supabase/sql/019_estabilidad_final.sql
historicos >"$RUNNER_TEMP/historia-019"
diff -u "$RUNNER_TEMP/historia-018" "$RUNNER_TEMP/historia-019"
echo 'APROBADA actualización 018 y reaplicación 019 sin cambios históricos'
permisos | grep -vE '^privado\.(bloquear_configuracion_aforo|procesar_aforo_programado)\(' >"$RUNNER_TEMP/permisos-019"
diff -u "$RUNNER_TEMP/permisos-018" "$RUNNER_TEMP/permisos-019"
echo 'APROBADOS privilegios efectivos, propietario, SECURITY DEFINER y search_path de funciones existentes'
resultado=0
for archivo in supabase/pruebas/*.sql; do
  [[ "$archivo" != */migracion_017.sql ]] || continue
  suite "$archivo" || resultado=1
done
bash supabase/pruebas/cron_concurrencia_019.sh || resultado=1
db -qc "select cron.alter_job(jobid, active:=false) from cron.job where jobname='aforofit-reconciliar-aforo'"
historicos >"$RUNNER_TEMP/historia-con-cron"
db -q -f supabase/reversion/019_estabilidad_final.sql
funciones >"$RUNNER_TEMP/funciones-reversion"
diff -u "$RUNNER_TEMP/funciones-018" "$RUNNER_TEMP/funciones-reversion" || resultado=1
historicos >"$RUNNER_TEMP/historia-reversion"
diff -u "$RUNNER_TEMP/historia-con-cron" "$RUNNER_TEMP/historia-reversion"
[[ $(db -Atc "select count(*) from cron.job where jobname='aforofit-reconciliar-aforo'") == 0 ]]
[[ $(db -Atc "select to_jsonb(j) from cron.job j where jobname='qa-ajeno-019'") == "$ajeno" ]]
suite supabase/pruebas/seguridad_018.sql || resultado=1
db -q -f supabase/sql/019_estabilidad_final.sql
[[ $(db -Atc "select count(*) from cron.job where jobname='aforofit-reconciliar-aforo' and active") == 1 ]]
[[ $(db -Atc "select to_jsonb(j) from cron.job j where jobname='qa-ajeno-019'") == "$ajeno" ]]
historicos >"$RUNNER_TEMP/historia-reaplicacion"
diff -u "$RUNNER_TEMP/historia-con-cron" "$RUNNER_TEMP/historia-reaplicacion"
echo 'APROBADOS datos históricos y trabajo ajeno durante reversión y reaplicación'

supabase stop --no-backup
supabase start -x studio,imgproxy,edge-runtime,logflare,vector,supavisor,mailpit
credenciales
cuentas
base_015
for archivo in supabase/sql/0{17,18,19}_*.sql; do
  db -q -f "$archivo" >/dev/null
done
suite supabase/pruebas/estabilidad_019.sql || resultado=1
echo 'APROBADA instalación limpia 001–019'
exit "$resultado"
