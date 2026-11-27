-- Revierte únicamente F-30. Se pierden las fechas de los avisos enviados.
begin;

drop function if exists public.mi_aviso_tne();
drop function if exists public.enviar_aviso_tne(uuid);
-- PostgreSQL no permite quitar una columna con CREATE OR REPLACE VIEW.
drop view public.prestamos_pendientes;
alter table public.prestamos drop column if exists aviso_tne_en;

create view public.prestamos_pendientes with (security_invoker = true) as
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

revoke all on public.prestamos_pendientes from public, anon, authenticated;
grant select on public.prestamos_pendientes to authenticated;

notify pgrst, 'reload schema';
commit;
