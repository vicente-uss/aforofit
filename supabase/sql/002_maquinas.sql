-- 002_maquinas.sql
-- AforoFit · Avance 2 · Catálogo de máquinas (tabla independiente, sin claves foráneas)
-- Ejecutar en Supabase → SQL Editor. Crea solo la estructura: no inserta datos.

-- 1. Tabla -------------------------------------------------------------------
create table if not exists public.maquinas (
  id                  bigint generated always as identity primary key,
  nombre              text not null,                 -- ej. "Máquina Smith"
  ejercicio           text,                          -- para qué ejercicio sirve
  grupo_muscular      text,                          -- qué grupo muscular trabaja
  patron_movimiento   text,                          -- ej. empuje, tirón, sentadilla
  ajustes             text,                          -- ajustes de la máquina (asiento, tope, etc.)
  cantidad            integer not null default 1
                      check (cantidad >= 1),         -- cuántas hay del mismo tipo
  estado              text not null default 'disponible'
                      check (estado in ('disponible', 'en_mantencion')),
  foto_url            text,                          -- ruta o URL de la foto
  creado_en           timestamptz not null default now()
);

comment on table public.maquinas is 'Catálogo de máquinas del gimnasio y su estado (disponible o en mantención).';

-- 2. Seguridad por filas (RLS) -----------------------------------------------
alter table public.maquinas enable row level security;

-- Cualquier usuario con sesión puede ver el catálogo (lo necesitan las rutinas).
drop policy if exists "maquinas_leer" on public.maquinas;
create policy "maquinas_leer"
  on public.maquinas
  for select
  to authenticated
  using (true);

-- Solo profesor y admin pueden crear, editar o borrar máquinas
-- (el profesor cambia el estado; el admin gestiona el catálogo).
drop policy if exists "maquinas_escribir_profesor_admin" on public.maquinas;
create policy "maquinas_escribir_profesor_admin"
  on public.maquinas
  for all
  to authenticated
  using (
    exists (
      select 1 from public.perfiles p
      where p.id = (select auth.uid()) and p.rol in ('profesor', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.perfiles p
      where p.id = (select auth.uid()) and p.rol in ('profesor', 'admin')
    )
  );

-- Sin sesión no se accede a nada.
revoke all on public.maquinas from anon;
