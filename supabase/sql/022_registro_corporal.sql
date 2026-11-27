-- RF27 · Mediciones privadas. El dueño es la cuenta del alumno que las registró.
begin;

create table public.mediciones (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null default auth.uid() references public.perfiles (id) on delete cascade,
  fecha date not null check (
    fecha between date '0001-01-01' and (now() at time zone 'America/Santiago')::date
  ),
  peso_kg numeric not null check (peso_kg between 20 and 400 and scale(peso_kg) <= 2),
  estatura_cm numeric not null check (estatura_cm between 80 and 250 and scale(estatura_cm) <= 2),
  cintura_cm numeric check (cintura_cm between 20 and 300 and scale(cintura_cm) <= 2),
  imc numeric generated always as (
    round(peso_kg * 10000 / nullif(estatura_cm * estatura_cm, 0), 2)
  ) stored
);

create index mediciones_perfil_fecha_idx on public.mediciones (perfil_id, fecha desc, id desc);

alter table public.mediciones enable row level security;
alter table public.mediciones force row level security;

revoke all on public.mediciones from public, anon, authenticated, service_role;
grant select (id, fecha, peso_kg, estatura_cm, cintura_cm, imc), delete
  on public.mediciones to authenticated;
grant insert (fecha, peso_kg, estatura_cm, cintura_cm),
      update (fecha, peso_kg, estatura_cm, cintura_cm)
  on public.mediciones to authenticated;

-- USING y WITH CHECK implícito para aplicar la misma regla a lecturas y escrituras.
-- El rol se lee del perfil vigente. El cliente no puede enviar ni cambiar el dueño.
create policy mediciones_del_alumno
  on public.mediciones for all to authenticated
  using (
    perfil_id = (select auth.uid())
    and (select p.rol from public.perfiles p where p.id = (select auth.uid())) = 'alumno'
    and (select auth.jwt() ->> 'is_anonymous') is distinct from 'true'
  );

commit;
