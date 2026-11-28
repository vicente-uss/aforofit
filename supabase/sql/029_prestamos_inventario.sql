begin;

create table public.solicitantes_externos (
  id uuid primary key,
  numero bigint generated always as identity unique,
  nombre text not null check (char_length(nombre) between 1 and 120),
  referencia text check (char_length(referencia) between 1 and 80)
);
alter table public.solicitantes_externos enable row level security;
revoke all on public.solicitantes_externos from public, anon, authenticated;
grant select on public.solicitantes_externos to authenticated;
create policy solicitantes_externos_leer on public.solicitantes_externos for select to authenticated
  using (exists (select from public.perfiles where id = (select auth.uid()) and rol in ('admin', 'profesor')));

alter table public.prestamos alter column alumno_id drop not null;
alter table public.prestamos add column externo_id uuid references public.solicitantes_externos;
alter table public.prestamos add constraint prestamos_un_solicitante check (num_nonnulls(alumno_id, externo_id) = 1);
create unique index prestamos_pendientes_por_externo on public.prestamos (externo_id)
  where externo_id is not null and (devuelto_en is null or not tne_devuelta);
create index prestamos_alumno_recientes on public.prestamos (alumno_id, entregado_en desc) where alumno_id is not null;
create index prestamos_externo_recientes on public.prestamos (externo_id, entregado_en desc) where externo_id is not null;

alter table public.implementos add column prestable boolean not null default true;
alter table public.implementos add column foto_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('implementos', 'implementos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']);
create policy fotos_implementos_leer_admin on storage.objects for select to authenticated
  using (bucket_id = 'implementos' and (select privado.es_administrador()));
create policy fotos_implementos_subir_admin on storage.objects for insert to authenticated
  with check (bucket_id = 'implementos' and (select privado.es_administrador()));
create policy fotos_implementos_borrar_admin on storage.objects for delete to authenticated
  using (bucket_id = 'implementos' and (select privado.es_administrador()));

create or replace view public.stock_prestamos with (security_invoker = true) as
select i.id, i.nombre, i.cantidad_total - coalesce(sum(d.cantidad - d.devuelto) filter (where p.id is not null), 0) as disponible,
  i.prestable, i.categoria
from public.implementos i
left join public.prestamo_items d on d.implemento_id = i.id
left join public.prestamos p on p.id = d.prestamo_id and p.devuelto_en is null
where exists (select from public.perfiles where id = (select auth.uid()) and rol in ('admin', 'profesor'))
group by i.id;

create or replace view public.catalogo_implementos with (security_invoker = true) as
select i.id, i.nombre, i.categoria, i.cantidad_total, s.disponible,
  i.cantidad_total - s.disponible as prestada, i.prestable, i.foto_url
from public.implementos i join public.stock_prestamos s using (id)
where (select privado.es_administrador());

create or replace view public.prestamos_pendientes with (security_invoker = true) as
select p.id, p.alumno_id, coalesce(a.nombre, e.nombre) as alumno, p.entregado_en, p.devuelto_en,
  string_agg(i.nombre || ' × ' || d.cantidad, ', ' order by i.nombre) as implementos,
  p.tne_devuelta,
  jsonb_agg(jsonb_build_object('id', i.id, 'nombre', i.nombre, 'disponible', d.cantidad - d.devuelto)
            order by i.nombre) as pendientes,
  p.aviso_tne_en, coalesce(p.alumno_id, p.externo_id) as solicitante_id,
  a.perfil_id is not null as cuenta_vinculada,
  case when e.id is null then a.rut
       else concat_ws(' · ', 'Externo #' || e.numero, e.referencia) end as referencia,
  e.id is not null as externo
from public.prestamos p left join public.alumnos a on a.id = p.alumno_id
left join public.solicitantes_externos e on e.id = p.externo_id
join public.prestamo_items d on d.prestamo_id = p.id
join public.implementos i on i.id = d.implemento_id
where p.devuelto_en is null or not p.tne_devuelta
group by p.id, a.id, e.id;

create function public.buscar_solicitantes(p_nombre text)
returns table (id uuid, nombre text, externo boolean, referencia text)
language sql stable security invoker set search_path = '' as $$
  with criterio as (
    select translate(lower(btrim(coalesce(p_nombre, ''))), 'áéíóúü', 'aeiouu') as texto
  ), personas as (
    select a.id, a.nombre, false as externo, a.rut as referencia,
      (select max(p.entregado_en) from public.prestamos p where p.alumno_id = a.id) as ultimo
    from public.alumnos a
    union all
    select e.id, e.nombre, true, concat_ws(' · ', 'Externo #' || e.numero, e.referencia),
      (select max(p.entregado_en) from public.prestamos p where p.externo_id = e.id)
    from public.solicitantes_externos e
  )
  select p.id, p.nombre, p.externo, p.referencia
  from personas p cross join criterio c
  where exists (select from public.perfiles where id = (select auth.uid()) and rol in ('admin', 'profesor'))
    and case when c.texto = '' then p.ultimo is not null
             else strpos(translate(lower(p.nombre), 'áéíóúü', 'aeiouu'), c.texto) > 0 end
  order by p.ultimo desc nulls last, p.nombre, p.id
  limit 12;
$$;

-- Ambos contratos comparten la validación, el bloqueo y el cálculo de stock.
create function privado.registrar_prestamo_solicitante(p_solicitante uuid, p_externo boolean, p_items jsonb)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  v_id uuid;
  v_item record;
  v_stock bigint;
  v_prestable boolean;
  v_abierto boolean;
begin
  if p_externo then
    perform 1 from public.solicitantes_externos where id = p_solicitante for update;
    if not found then raise exception 'solicitante_no_encontrado'; end if;
  else
    perform 1 from public.alumnos where id = p_solicitante for update;
    if not found then raise exception 'alumno_no_encontrado'; end if;
  end if;
  select devuelto_en is null into v_abierto from public.prestamos
  where ((p_externo and externo_id = p_solicitante) or (not p_externo and alumno_id = p_solicitante))
    and (devuelto_en is null or not tne_devuelta);
  if found then
    if v_abierto then raise exception 'prestamo_abierto'; end if;
    raise exception 'tne_pendiente';
  end if;

  if jsonb_typeof(p_items) is distinct from 'array' then raise exception 'items_invalidos'; end if;
  if jsonb_array_length(p_items) = 0 or exists (
    select from jsonb_array_elements(p_items) e
    where jsonb_typeof(e->'implemento_id') is distinct from 'number'
       or jsonb_typeof(e->'cantidad') is distinct from 'number'
       or e->>'implemento_id' !~ '^[1-9][0-9]*$' or e->>'cantidad' !~ '^[1-9][0-9]*$'
  ) then raise exception 'items_invalidos'; end if;

  insert into public.prestamos (alumno_id, externo_id, profesor_id)
  values (case when not p_externo then p_solicitante end, case when p_externo then p_solicitante end, auth.uid())
  returning id into v_id;

  for v_item in select * from jsonb_to_recordset(p_items) as d(implemento_id bigint, cantidad integer)
                order by implemento_id loop
    select prestable into v_prestable from public.implementos where id = v_item.implemento_id for update;
    if not found then raise exception 'implemento_no_encontrado'; end if;
    if not v_prestable then raise exception 'implemento_no_prestable'; end if;
    if exists (select from public.prestamo_items where prestamo_id = v_id and implemento_id = v_item.implemento_id)
      then raise exception 'items_invalidos'; end if;
    select disponible into strict v_stock from public.stock_prestamos where id = v_item.implemento_id;
    if v_item.cantidad > v_stock then raise exception 'stock_insuficiente'; end if;
    insert into public.prestamo_items (prestamo_id, implemento_id, cantidad)
    values (v_id, v_item.implemento_id, v_item.cantidad);
  end loop;
  return v_id;
exception when numeric_value_out_of_range then raise exception 'items_invalidos';
end;
$$;

create or replace function public.registrar_prestamo(p_alumno uuid, p_items jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
begin
  if not privado.es_profesor_o_admin() then raise exception 'sin_permiso'; end if;
  return privado.registrar_prestamo_solicitante(p_alumno, false, p_items);
end;
$$;

create function public.registrar_prestamo_por_nombre(
  p_solicitante uuid, p_externo boolean, p_nombre text, p_referencia text, p_items jsonb, p_tne_recibida boolean
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_nombre text;
  v_referencia text;
begin
  if not privado.es_profesor_o_admin() then raise exception 'sin_permiso'; end if;
  if p_tne_recibida is distinct from true then raise exception 'tne_requerida'; end if;
  if p_solicitante is null or p_externo is null then raise exception 'solicitante_no_encontrado'; end if;
  if p_nombre is not null then
    v_nombre := btrim(regexp_replace(p_nombre, '[[:space:]]+', ' ', 'g'));
    v_referencia := nullif(btrim(regexp_replace(p_referencia, '[[:space:]]+', ' ', 'g')), '');
    if not p_externo or char_length(v_nombre) not between 1 and 120 or char_length(v_referencia) > 80
      then raise exception 'nombre_invalido'; end if;
    -- El cliente conserva el ID al reintentar el alta tras una respuesta perdida.
    insert into public.solicitantes_externos (id, nombre, referencia)
    values (p_solicitante, v_nombre, v_referencia) on conflict (id) do nothing;
    if not exists (select from public.solicitantes_externos
      where id = p_solicitante and nombre = v_nombre and referencia is not distinct from v_referencia)
      then raise exception 'solicitante_no_encontrado'; end if;
  end if;
  return privado.registrar_prestamo_solicitante(p_solicitante, p_externo, p_items);
end;
$$;

-- La firma antigua sigue admitiendo devolver todo el material.
create or replace function public.registrar_devolucion(p_prestamo uuid)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  perform public.registrar_devolucion(p_prestamo, null);
end;
$$;

create or replace function public.enviar_aviso_tne(p_prestamo uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  p public.prestamos%rowtype;
begin
  if not exists (select from public.perfiles where id = (select auth.uid()) and rol = 'profesor')
    then raise exception 'sin_permiso'; end if;
  select * into p from public.prestamos where id = p_prestamo for update;
  if not found then raise exception 'prestamo_no_encontrado'; end if;
  if p.devuelto_en is null then raise exception 'prestamo_abierto'; end if;
  if p.tne_devuelta then raise exception 'tne_ya_entregada'; end if;
  if not exists (select from public.alumnos a join public.perfiles u on u.id = a.perfil_id
    where a.id = p.alumno_id and u.rol = 'alumno') then raise exception 'sin_cuenta_vinculada'; end if;
  if p.aviso_tne_en is null then
    update public.prestamos set aviso_tne_en = now() where id = p_prestamo;
  end if;
end;
$$;

revoke all on function privado.registrar_prestamo_solicitante(uuid,boolean,jsonb),
  public.registrar_prestamo_por_nombre(uuid,boolean,text,text,jsonb,boolean),
  public.buscar_solicitantes(text) from public, anon, authenticated;
grant execute on function public.registrar_prestamo_por_nombre(uuid,boolean,text,text,jsonb,boolean),
  public.buscar_solicitantes(text) to authenticated;

notify pgrst, 'reload schema';
commit;
