-- Ejecutar con psql -f sobre una base local desechable con 001–015.
-- La migración hace COMMIT. Los datos de esta suite quedan solo en esa base.
\set ON_ERROR_STOP on
do $$
begin
  if exists (select from information_schema.columns where table_schema='public'
      and table_name='prestamo_items' and column_name='devuelto') then
    raise exception 'Esta prueba requiere el esquema anterior a 017';
  end if;
end;
$$;
create temporary table casos_015 as
select estado, gen_random_uuid() alumno, gen_random_uuid() prestamo,
  case when estado <> 'abierto' then now() - interval '1 day' end devuelto_en,
  estado='cerrado' tne_devuelta
from (values ('abierto'),('solo_tne'),('cerrado')) as estados(estado);
insert into public.alumnos(id,nombre) select alumno,estado from casos_015;
insert into public.prestamos(id, alumno_id, profesor_id, devuelto_en, tne_devuelta)
select prestamo, alumno, (select id from public.perfiles where rol='profesor' limit 1),
  devuelto_en,tne_devuelta from casos_015;
create temporary table detalle_015 as
select c.prestamo, i.id implemento, row_number() over (partition by c.prestamo order by i.id)::integer cantidad
from casos_015 c cross join (select id from public.implementos order by id limit 2) i;
insert into public.prestamo_items(prestamo_id,implemento_id,cantidad)
select prestamo,implemento,cantidad from detalle_015;

create function pg_temp.verificar_historicos() returns void language plpgsql as $$
begin
  if (select count(*) from detalle_015) <> 6 or exists (
    select from casos_015 c join detalle_015 d using(prestamo)
    left join public.prestamos p on p.id=c.prestamo
    left join public.prestamo_items i on i.prestamo_id=c.prestamo and i.implemento_id=d.implemento
    where p.alumno_id is distinct from c.alumno or p.devuelto_en is distinct from c.devuelto_en
      or p.tne_devuelta is distinct from c.tne_devuelta or i.cantidad is distinct from d.cantidad
      or i.devuelto is distinct from (case when c.devuelto_en is null then 0 else d.cantidad end)
  ) then raise exception '017 cambió cantidades o estados históricos'; end if;
  raise notice 'OK: cantidades y estados de los tres préstamos históricos';
end;
$$;
\ir ../sql/017_devoluciones_qr_tarjetas.sql
select pg_temp.verificar_historicos();
\ir ../sql/017_devoluciones_qr_tarjetas.sql
select pg_temp.verificar_historicos();
