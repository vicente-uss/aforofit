-- 007_permisos_flujo_ingreso.sql
-- AforoFit · Avance 3 · Políticas RLS, permisos de lectura y Realtime del flujo central.
-- Requiere 005 y 006. Ejecutar en Supabase → SQL Editor. Se puede ejecutar más de una vez.
-- Nadie escribe directo desde el cliente: alumnos, tarjetas, visitas, turnos y aforo
-- solo cambian mediante las funciones. La única escritura directa es configuracion (admin).

-- 1. Alumnos: profesor y admin leen todo; el alumno, solo lo suyo ----------------------
drop policy if exists "alumnos_leer" on public.alumnos;
create policy "alumnos_leer"
  on public.alumnos for select
  to authenticated
  using (
    perfil_id = (select auth.uid())
    or exists (select 1 from public.perfiles p where p.id = (select auth.uid()) and p.rol in ('profesor', 'admin'))
  );

-- 2. Tarjetas, visitas y turnos: la política de alumnos filtra lo propio ---------------
drop policy if exists "tarjetas_leer" on public.tarjetas;
create policy "tarjetas_leer"
  on public.tarjetas for select
  to authenticated
  using (alumno_id in (select a.id from public.alumnos a));

drop policy if exists "visitas_leer" on public.visitas;
create policy "visitas_leer"
  on public.visitas for select
  to authenticated
  using (alumno_id in (select a.id from public.alumnos a));

drop policy if exists "turnos_leer" on public.turnos;
create policy "turnos_leer"
  on public.turnos for select
  to authenticated
  using (alumno_id in (select a.id from public.alumnos a));

-- 3. Configuración: lectura con sesión; solo el admin la edita -------------------------
drop policy if exists "configuracion_leer" on public.configuracion;
create policy "configuracion_leer"
  on public.configuracion for select
  to authenticated
  using (true);

drop policy if exists "configuracion_editar_admin" on public.configuracion;
create policy "configuracion_editar_admin"
  on public.configuracion for update
  to authenticated
  using (exists (select 1 from public.perfiles p where p.id = (select auth.uid()) and p.rol = 'admin'))
  with check (exists (select 1 from public.perfiles p where p.id = (select auth.uid()) and p.rol = 'admin'));

-- 4. Aforo: lectura pública, porque la pantalla no tiene sesión ------------------------
drop policy if exists "aforo_lectura_publica" on public.aforo;
create policy "aforo_lectura_publica"
  on public.aforo for select
  to anon, authenticated
  using (true);

-- 5. Permisos de tabla ------------------------------------------------------------------
grant select on public.alumnos, public.tarjetas, public.visitas, public.turnos to authenticated;
grant select, update on public.configuracion to authenticated;
grant select on public.aforo to anon, authenticated;

-- 6. Realtime: solo la fila de aforo, sin datos de alumnos ------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'aforo'
  ) then
    alter publication supabase_realtime add table public.aforo;
  end if;
end;
$$;

-- 7. Aviso de seguridad de Supabase: esta función solo la debe usar su trigger ----------
revoke execute on function public.crear_perfil_nuevo_usuario() from public, anon, authenticated;
