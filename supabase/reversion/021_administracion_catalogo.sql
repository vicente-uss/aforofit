begin;

drop trigger if exists validar_reduccion_inventario on public.implementos;
drop function if exists privado.validar_reduccion_inventario();
drop view if exists public.catalogo_implementos;
drop index if exists public.plantilla_ejercicios_maquina_idx;
drop index if exists public.rutina_ejercicios_maquina_idx;
drop index if exists public.prestamo_items_implemento_idx;

-- Restituye los valores predeterminados del bucket creado por 003.
update storage.buckets
set file_size_limit = null, allowed_mime_types = null
where id = 'maquinas';

commit;
