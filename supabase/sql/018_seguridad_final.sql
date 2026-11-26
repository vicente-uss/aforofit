begin;

-- Las políticas solo filtran filas; TRUNCATE, por ejemplo, no pasa por RLS.
revoke all on public.maquinas, public.implementos, public.perfiles from public, anon, authenticated;
grant select on public.perfiles to authenticated;
grant select, insert, update, delete on public.maquinas, public.implementos to authenticated;

-- Las cuatro columnas IDENTITY asignan su valor al insertar sin acceso directo a la secuencia.
revoke all on sequence public.maquinas_id_seq, public.implementos_id_seq,
  public.plantillas_id_seq, public.plantilla_ejercicios_id_seq from public, anon, authenticated;

drop policy if exists maquinas_escribir_profesor_admin on public.maquinas;
drop policy if exists maquinas_escribir_admin on public.maquinas;
create policy maquinas_escribir_admin on public.maquinas for all to authenticated
  using (exists (select from public.perfiles where id = (select auth.uid()) and rol = 'admin'))
  with check (exists (select from public.perfiles where id = (select auth.uid()) and rol = 'admin'));

-- El API de objetos públicos entrega fotos por ruta; el listado sí consulta esta política.
drop policy if exists fotos_maquinas_leer on storage.objects;
create policy fotos_maquinas_leer on storage.objects for select to authenticated
  using (bucket_id = 'maquinas' and exists (
    select from public.perfiles where id = (select auth.uid()) and rol = 'admin'
  ));

commit;
