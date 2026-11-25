-- Aplicar después de 015 y, si existe, de 016.
begin;

alter table public.prestamo_items add column if not exists devuelto integer not null default 0
  check (devuelto between 0 and cantidad);
-- En el flujo anterior, una cabecera devuelta implicaba que volvieron todos los implementos.
update public.prestamo_items d set devuelto = d.cantidad from public.prestamos p
where p.id = d.prestamo_id and p.devuelto_en is not null and d.devuelto <> d.cantidad;

create or replace view public.stock_prestamos with (security_invoker = true) as
select i.id, i.nombre, i.cantidad_total - coalesce(sum(d.cantidad - d.devuelto) filter (where p.id is not null), 0) as disponible
from public.implementos i
left join public.prestamo_items d on d.implemento_id = i.id
left join public.prestamos p on p.id = d.prestamo_id and p.devuelto_en is null
where exists (select 1 from public.perfiles where id = (select auth.uid()) and rol in ('admin','profesor'))
group by i.id;

-- Incluye el caso D19 de implementos devueltos con garantía pendiente.
create or replace view public.prestamos_pendientes with (security_invoker = true) as
select p.id, p.alumno_id, a.nombre as alumno, p.entregado_en, p.devuelto_en,
  string_agg(i.nombre || ' × ' || d.cantidad, ', ' order by i.nombre) as implementos,
  p.tne_devuelta,
  jsonb_agg(jsonb_build_object('id', i.id, 'nombre', i.nombre, 'disponible', d.cantidad - d.devuelto)
            order by i.nombre) as pendientes
from public.prestamos p join public.alumnos a on a.id = p.alumno_id
join public.prestamo_items d on d.prestamo_id = p.id
join public.implementos i on i.id = d.implemento_id
where p.devuelto_en is null or not p.tne_devuelta
group by p.id, a.nombre;

-- Un argumento sigue devolviendo todo lo pendiente. La garantía se entrega por separado.
drop function if exists public.registrar_devolucion(uuid);
create or replace function public.registrar_devolucion(p_prestamo uuid, p_items jsonb default null)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_fecha timestamptz;
  item record;
begin
  if not privado.es_profesor_o_admin() then raise exception 'sin_permiso'; end if;
  select devuelto_en into v_fecha from public.prestamos where id = p_prestamo for update;
  if not found then raise exception 'prestamo_no_encontrado'; end if;
  if v_fecha is not null then raise exception 'prestamo_cerrado'; end if;
  if p_items is null then
    update public.prestamo_items set devuelto = cantidad where prestamo_id = p_prestamo;
  else
    if jsonb_typeof(p_items) <> 'array' then raise exception 'items_invalidos'; end if;
    if jsonb_array_length(p_items) = 0 or exists (
      select from jsonb_array_elements(p_items) e
      where jsonb_typeof(e->'implemento_id') is distinct from 'number'
         or jsonb_typeof(e->'cantidad') is distinct from 'number'
         or e->>'implemento_id' !~ '^[1-9][0-9]*$' or e->>'cantidad' !~ '^[1-9][0-9]*$'
      group by e->>'implemento_id'
    ) or exists (
      select from jsonb_array_elements(p_items) e group by e->>'implemento_id' having count(*) > 1
    ) then raise exception 'items_invalidos'; end if;
    for item in select * from jsonb_to_recordset(p_items) as x(implemento_id bigint,cantidad integer) loop
      update public.prestamo_items set devuelto = devuelto + item.cantidad
      where prestamo_id = p_prestamo and implemento_id = item.implemento_id and cantidad - devuelto >= item.cantidad;
      if not found then raise exception 'devolucion_excesiva'; end if;
    end loop;
  end if;
  if not exists (select from public.prestamo_items where prestamo_id = p_prestamo and cantidad > devuelto) then
    update public.prestamos set devuelto_en = now() where id = p_prestamo;
  end if;
exception when numeric_value_out_of_range then raise exception 'items_invalidos';
end;
$$;

create or replace function public.entregar_tne(p_prestamo uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  p public.prestamos%rowtype;
begin
  if not privado.es_profesor_o_admin() then raise exception 'sin_permiso'; end if;
  select * into p from public.prestamos where id = p_prestamo for update;
  if not found then raise exception 'prestamo_no_encontrado'; end if;
  if p.devuelto_en is null then raise exception 'prestamo_abierto'; end if;
  if p.tne_devuelta then raise exception 'tne_ya_entregada'; end if;
  update public.prestamos set tne_devuelta = true where id = p_prestamo;
end;
$$;
revoke all on function public.registrar_devolucion(uuid,jsonb), public.entregar_tne(uuid) from public,anon,authenticated;
grant execute on function public.registrar_devolucion(uuid,jsonb), public.entregar_tne(uuid) to authenticated;

-- F-27: conserva las llamadas de dos argumentos mediante el valor por defecto.
drop function if exists public.vincular_credencial(text,uuid);
create or replace function public.vincular_credencial(p_uid text, p_alumno_id uuid, p_tipo text default 'tne')
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_dueno uuid;
begin
  if not exists (
    select 1 from public.perfiles p
    where p.id = (select auth.uid()) and p.rol in ('profesor', 'admin')
  ) then
    return jsonb_build_object('ok', false, 'motivo', 'sin_permiso');
  end if;

  if p_tipo is null or p_tipo not in ('tne','credencial_uss') then
    return jsonb_build_object('ok', false, 'motivo', 'tipo_invalido');
  end if;
  if not exists (select 1 from public.alumnos a where a.id = p_alumno_id) then
    return jsonb_build_object('ok', false, 'motivo', 'alumno_no_encontrado');
  end if;

  -- on conflict cubre dos vinculaciones simultáneas de la misma tarjeta.
  insert into public.tarjetas (uid, alumno_id, tipo)
  values (p_uid, p_alumno_id, p_tipo)
  on conflict (uid) do nothing;

  select t.alumno_id into v_dueno from public.tarjetas t where t.uid = p_uid;

  if v_dueno is distinct from p_alumno_id then
    return jsonb_build_object('ok', false, 'motivo', 'credencial_de_otro_alumno');
  end if;

  return jsonb_build_object('ok', true, 'motivo', null);
end;
$$;
revoke all on function public.vincular_credencial(text,uuid,text) from public,anon,authenticated;
grant execute on function public.vincular_credencial(text,uuid,text) to authenticated;
commit;
