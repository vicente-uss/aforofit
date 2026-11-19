-- 001_perfiles_roles.sql
-- AforoFit · Avance 2 · Login con roles (alumno, profesor, admin)
-- Ejecutar en Supabase → SQL Editor.

-- 1. Tabla de perfiles: un perfil por usuario de auth.users ---------------------
create table if not exists public.perfiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  nombre     text,
  rol        text not null default 'alumno'
             check (rol in ('alumno', 'profesor', 'admin')),
  creado_en  timestamptz default now()
);

comment on table public.perfiles is 'Perfil y rol de cada usuario de Supabase Auth.';

-- 2. Seguridad por filas (RLS) -----------------------------------------------
alter table public.perfiles enable row level security;

-- Cada usuario autenticado lee solo su propio perfil.
drop policy if exists "perfiles_leer_propio" on public.perfiles;
create policy "perfiles_leer_propio"
  on public.perfiles
  for select
  to authenticated
  using (id = (select auth.uid()));

-- No se crean políticas de insert, update ni delete: desde el cliente nadie
-- puede crear perfiles ni cambiar su rol. Además se quitan los permisos de
-- escritura a los roles de la API como segunda barrera.
revoke insert, update, delete on public.perfiles from anon, authenticated;
revoke all on public.perfiles from anon;

-- 3. Trigger: al crear un usuario se crea su perfil con rol 'alumno' ---------
create or replace function public.crear_perfil_nuevo_usuario()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, nombre, rol)
  values (new.id, split_part(new.email, '@', 1), 'alumno')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists al_crear_usuario_crear_perfil on auth.users;
create trigger al_crear_usuario_crear_perfil
  after insert on auth.users
  for each row execute function public.crear_perfil_nuevo_usuario();

-- 4. Usuarios que ya existían antes del trigger ------------------------------
insert into public.perfiles (id, nombre, rol)
select u.id, split_part(u.email, '@', 1), 'alumno'
from auth.users u
on conflict (id) do nothing;

-- 5. Roles de prueba ---------------------------------------------------------
-- Crear primero los usuarios en Authentication → Users → Add user
-- (Auto Confirm User marcado; la clave se entrega al equipo por interno):
--   alumno.demo@aforofit.cl · profesor.demo@aforofit.cl · admin.demo@aforofit.cl
-- Luego descomentar y ejecutar:
--
-- update public.perfiles set rol = 'profesor'
-- where id = (select id from auth.users where email = 'profesor.demo@aforofit.cl');
--
-- update public.perfiles set rol = 'admin'
-- where id = (select id from auth.users where email = 'admin.demo@aforofit.cl');
