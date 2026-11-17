-- 003_implementos_y_fotos.sql
-- AforoFit · Avance 2 · Implementos de préstamo y bucket de fotos de máquinas.
-- Requiere 001_perfiles_roles.sql y 002_maquinas.sql. Ejecutar en Supabase → SQL Editor.

-- 1. Implementos de préstamo ---------------------------------------------------
-- La disponibilidad se calculará con los préstamos abiertos; no se guarda aquí.
create table if not exists public.implementos (
  id              bigint generated always as identity primary key,
  nombre          text not null unique,
  categoria       text,
  cantidad_total  integer not null default 1 check (cantidad_total >= 0),
  creado_en       timestamptz not null default now()
);

comment on table public.implementos is 'Implementos que el profesor presta con la TNE como garantía.';

alter table public.implementos enable row level security;

drop policy if exists "implementos_leer" on public.implementos;
create policy "implementos_leer"
  on public.implementos for select
  to authenticated
  using (true);

drop policy if exists "implementos_escribir_admin" on public.implementos;
create policy "implementos_escribir_admin"
  on public.implementos for all
  to authenticated
  using (exists (select 1 from public.perfiles p where p.id = (select auth.uid()) and p.rol = 'admin'))
  with check (exists (select 1 from public.perfiles p where p.id = (select auth.uid()) and p.rol = 'admin'));

revoke all on public.implementos from anon;

-- 2. Bucket de fotos de máquinas ---------------------------------------------------
-- Lectura pública (las fotos se muestran en la rutina); escritura solo admin.
insert into storage.buckets (id, name, public)
values ('maquinas', 'maquinas', true)
on conflict (id) do update set public = true;

drop policy if exists "fotos_maquinas_leer" on storage.objects;
create policy "fotos_maquinas_leer"
  on storage.objects for select
  using (bucket_id = 'maquinas');

drop policy if exists "fotos_maquinas_subir_admin" on storage.objects;
create policy "fotos_maquinas_subir_admin"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'maquinas'
    and exists (select 1 from public.perfiles p where p.id = (select auth.uid()) and p.rol = 'admin')
  );

drop policy if exists "fotos_maquinas_editar_admin" on storage.objects;
create policy "fotos_maquinas_editar_admin"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'maquinas'
    and exists (select 1 from public.perfiles p where p.id = (select auth.uid()) and p.rol = 'admin')
  );

drop policy if exists "fotos_maquinas_borrar_admin" on storage.objects;
create policy "fotos_maquinas_borrar_admin"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'maquinas'
    and exists (select 1 from public.perfiles p where p.id = (select auth.uid()) and p.rol = 'admin')
  );
