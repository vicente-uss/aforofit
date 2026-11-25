-- S1 y S2. Ejecutar después de 014.
begin;

alter table public.alumnos add column if not exists certificado_emision date;
update public.alumnos
set certificado_emision = (certificado_hasta - interval '12 months')::date
where certificado_emision is null and certificado_hasta is not null;

create table if not exists public.prestamos (
  id uuid primary key default gen_random_uuid(),
  alumno_id uuid not null references public.alumnos,
  profesor_id uuid not null references public.perfiles,
  entregado_en timestamptz not null default now(),
  devuelto_en timestamptz,
  tne_devuelta boolean not null default false,
  check (not tne_devuelta or devuelto_en is not null)
);
create unique index if not exists prestamos_pendientes_por_alumno
  on public.prestamos(alumno_id) where devuelto_en is null or not tne_devuelta;

create table if not exists public.prestamo_items (
  prestamo_id uuid not null references public.prestamos,
  implemento_id bigint not null references public.implementos,
  cantidad integer not null check (cantidad > 0),
  primary key (prestamo_id, implemento_id)
);

alter table public.prestamos enable row level security;
alter table public.prestamo_items enable row level security;
drop policy if exists prestamos_leer on public.prestamos;
create policy prestamos_leer on public.prestamos for select to authenticated
  using (exists (select 1 from public.perfiles where id = (select auth.uid()) and rol in ('admin','profesor')));
drop policy if exists prestamo_items_leer on public.prestamo_items;
create policy prestamo_items_leer on public.prestamo_items for select to authenticated
  using (exists (select 1 from public.prestamos p where p.id = prestamo_id));

create or replace view public.stock_prestamos with (security_invoker = true) as
select i.id, i.nombre, i.cantidad_total - coalesce(sum(d.cantidad) filter (where p.id is not null), 0) as disponible
from public.implementos i
left join public.prestamo_items d on d.implemento_id = i.id
left join public.prestamos p on p.id = d.prestamo_id and p.devuelto_en is null
where exists (select 1 from public.perfiles where id = (select auth.uid()) and rol in ('admin','profesor'))
group by i.id;

-- Incluye el caso D19 de implementos devueltos con garantía pendiente.
create or replace view public.prestamos_pendientes with (security_invoker = true) as
select p.id, p.alumno_id, a.nombre as alumno, p.entregado_en, p.devuelto_en,
  string_agg(i.nombre || ' × ' || d.cantidad, ', ' order by i.nombre) as implementos
from public.prestamos p join public.alumnos a on a.id = p.alumno_id
join public.prestamo_items d on d.prestamo_id = p.id
join public.implementos i on i.id = d.implemento_id
where p.devuelto_en is null or not p.tne_devuelta
group by p.id, a.nombre;

revoke all on public.prestamos, public.prestamo_items, public.stock_prestamos,
  public.prestamos_pendientes from public, anon, authenticated;
grant select on public.prestamos, public.prestamo_items, public.stock_prestamos,
  public.prestamos_pendientes to authenticated;

create or replace function public.registrar_prestamo(p_alumno uuid, p_items jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_item record;
  v_stock bigint;
begin
  if not privado.es_profesor_o_admin() then raise exception 'sin_permiso'; end if;
  perform 1 from public.alumnos where id = p_alumno for update;
  if not found then raise exception 'alumno_no_encontrado'; end if;
  if exists (select 1 from public.prestamos where alumno_id = p_alumno and devuelto_en is null)
    then raise exception 'prestamo_abierto'; end if;
  if exists (select 1 from public.prestamos where alumno_id = p_alumno and not tne_devuelta)
    then raise exception 'tne_pendiente'; end if;

  if jsonb_typeof(p_items) is distinct from 'array' then raise exception 'items_invalidos'; end if;
  if jsonb_array_length(p_items) = 0 or exists (
    select 1 from jsonb_array_elements(p_items) e
    where jsonb_typeof(e->'implemento_id') is distinct from 'number'
       or jsonb_typeof(e->'cantidad') is distinct from 'number'
       or e->>'implemento_id' !~ '^[1-9][0-9]*$' or e->>'cantidad' !~ '^[1-9][0-9]*$'
  ) then raise exception 'items_invalidos'; end if;

  insert into public.prestamos(alumno_id, profesor_id) values (p_alumno, auth.uid()) returning id into v_id;
  -- El orden fijo evita bloqueos cruzados entre solicitudes con varios implementos.
  for v_item in select * from jsonb_to_recordset(p_items) as d(implemento_id bigint, cantidad integer)
                order by implemento_id loop
    perform 1 from public.implementos where id = v_item.implemento_id for update;
    if not found then raise exception 'implemento_no_encontrado'; end if;
    if exists (select 1 from public.prestamo_items where prestamo_id = v_id and implemento_id = v_item.implemento_id)
      then raise exception 'items_invalidos'; end if;
    select disponible into strict v_stock from public.stock_prestamos where id = v_item.implemento_id;
    if v_item.cantidad > v_stock then raise exception 'stock_insuficiente'; end if;
    insert into public.prestamo_items values (v_id, v_item.implemento_id, v_item.cantidad);
  end loop;
  return v_id;
exception when numeric_value_out_of_range then raise exception 'items_invalidos';
end;
$$;

create or replace function public.registrar_devolucion(p_prestamo uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_devuelto timestamptz;
begin
  if not privado.es_profesor_o_admin() then raise exception 'sin_permiso'; end if;
  select devuelto_en into v_devuelto from public.prestamos where id = p_prestamo for update;
  if not found then raise exception 'prestamo_no_encontrado'; end if;
  if v_devuelto is not null then raise exception 'prestamo_cerrado'; end if;
  update public.prestamos set devuelto_en = now(), tne_devuelta = true where id = p_prestamo;
end;
$$;

create or replace function public.registrar_habilitacion(p_alumno uuid, p_emision date)
returns date language plpgsql security definer set search_path = '' as $$
declare
  v_hasta date;
begin
  if not exists (select 1 from public.perfiles where id = auth.uid() and rol = 'admin')
    then raise exception 'sin_permiso'; end if;
  if p_emision is null or not isfinite(p_emision) or p_emision > (now() at time zone 'America/Santiago')::date
    then raise exception 'emision_invalida'; end if;
  update public.alumnos set certificado_emision = p_emision, certificado_hasta = (p_emision + interval '12 months')::date
  where id = p_alumno returning certificado_hasta into v_hasta;
  if not found then raise exception 'alumno_no_encontrado'; end if;
  return v_hasta;
end;
$$;

revoke all on function public.registrar_prestamo(uuid,jsonb), public.registrar_devolucion(uuid),
  public.registrar_habilitacion(uuid,date) from public, anon, authenticated;
grant execute on function public.registrar_prestamo(uuid,jsonb), public.registrar_devolucion(uuid),
  public.registrar_habilitacion(uuid,date) to authenticated;
commit;
