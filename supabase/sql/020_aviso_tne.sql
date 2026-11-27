-- F-30. Aplicar después de 019.
begin;

alter table public.prestamos add column if not exists aviso_tne_en timestamptz;

create or replace view public.prestamos_pendientes with (security_invoker = true) as
select p.id, p.alumno_id, a.nombre as alumno, p.entregado_en, p.devuelto_en,
  string_agg(i.nombre || ' × ' || d.cantidad, ', ' order by i.nombre) as implementos,
  p.tne_devuelta,
  jsonb_agg(jsonb_build_object('id', i.id, 'nombre', i.nombre, 'disponible', d.cantidad - d.devuelto)
            order by i.nombre) as pendientes,
  p.aviso_tne_en
from public.prestamos p join public.alumnos a on a.id = p.alumno_id
join public.prestamo_items d on d.prestamo_id = p.id
join public.implementos i on i.id = d.implemento_id
where p.devuelto_en is null or not p.tne_devuelta
group by p.id, a.nombre;

create or replace function public.enviar_aviso_tne(p_prestamo uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  p public.prestamos%rowtype;
begin
  if not exists (select from public.perfiles where id = (select auth.uid()) and rol = 'profesor')
    then raise exception 'sin_permiso'; end if;

  -- Mismo bloqueo de fila que la devolución de implementos y la entrega de la TNE.
  select * into p from public.prestamos where id = p_prestamo for update;
  if not found then raise exception 'prestamo_no_encontrado'; end if;
  if p.devuelto_en is null then raise exception 'prestamo_abierto'; end if;
  if p.tne_devuelta then raise exception 'tne_ya_entregada'; end if;
  if p.aviso_tne_en is null then
    update public.prestamos set aviso_tne_en = now() where id = p_prestamo;
  end if;
end;
$$;

-- Conserva la fecha de envío, pero solo muestra el aviso mientras la TNE esté pendiente.
-- El alumno recibe un booleano y las políticas de préstamos siguen restringiendo las filas.
create or replace function public.mi_aviso_tne()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select from public.prestamos p
    join public.alumnos a on a.id = p.alumno_id
    join public.perfiles u on u.id = a.perfil_id
    where u.id = (select auth.uid()) and u.rol = 'alumno'
      and p.devuelto_en is not null and not p.tne_devuelta and p.aviso_tne_en is not null
  )
$$;

revoke all on function public.enviar_aviso_tne(uuid), public.mi_aviso_tne()
  from public, anon, authenticated;
grant execute on function public.enviar_aviso_tne(uuid), public.mi_aviso_tne() to authenticated;

notify pgrst, 'reload schema';
commit;
