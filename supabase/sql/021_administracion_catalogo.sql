begin;

-- El endpoint público sigue sirviendo fotos por su ruta. El listado y las
-- escrituras conservan las políticas instaladas en 003 y 018.
update storage.buckets
set file_size_limit = 2097152,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'maquinas';

-- Las FK existentes impiden borrar máquinas usadas en plantillas o rutinas e
-- implementos que figuren en un préstamo, incluso si ya se devolvió.
create index if not exists plantilla_ejercicios_maquina_idx
  on public.plantilla_ejercicios (maquina_id);
create index if not exists rutina_ejercicios_maquina_idx
  on public.rutina_ejercicios (maquina_id);
create index if not exists prestamo_items_implemento_idx
  on public.prestamo_items (implemento_id);

create or replace view public.catalogo_implementos with (security_invoker = true) as
select i.id, i.nombre, i.categoria, i.cantidad_total, s.disponible,
       i.cantidad_total - s.disponible as prestada
from public.implementos i
join public.stock_prestamos s using (id)
where exists (
  select from public.perfiles where id = (select auth.uid()) and rol = 'admin'
);

revoke all on public.catalogo_implementos from public, anon, authenticated;
grant select on public.catalogo_implementos to authenticated;

-- El UPDATE ya tiene el bloqueo de la fila cuando se ejecuta este trigger.
-- registrar_prestamo (015) toma el mismo bloqueo antes de consultar el stock.
create or replace function privado.validar_reduccion_inventario()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  unidades_prestadas bigint;
begin
  select coalesce(sum(d.cantidad - d.devuelto), 0)
  into unidades_prestadas
  from public.prestamo_items d
  join public.prestamos p on p.id = d.prestamo_id
  where d.implemento_id = old.id and p.devuelto_en is null;

  if new.cantidad_total < unidades_prestadas then
    raise exception 'inventario_menor_que_prestado' using errcode = '23514';
  end if;
  return new;
end;
$$;

revoke all on function privado.validar_reduccion_inventario() from public, anon, authenticated;
drop trigger if exists validar_reduccion_inventario on public.implementos;
create trigger validar_reduccion_inventario
before update of cantidad_total on public.implementos
for each row when (new.cantidad_total < old.cantidad_total)
execute function privado.validar_reduccion_inventario();

commit;
