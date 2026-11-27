-- Ejecutar sobre una base desechable con 021 y las cuentas de .github/qa-019.sh.
begin;

create function pg_temp.ok(caso text, cumple boolean) returns void language plpgsql as $$
begin
  if cumple is not true then raise exception 'FALLÓ: %', caso; end if;
  raise notice 'OK: %', caso;
end $$;

create function pg_temp.resultado(sentencia text) returns text language plpgsql as $$
declare filas integer;
begin
  execute sentencia;
  get diagnostics filas = row_count;
  return filas::text;
exception when others then
  return sqlstate || '/' || sqlerrm;
end $$;

do $$
<<qa>>
declare
  admin_id uuid := (select id from auth.users where email = 'admin.demo@aforofit.cl');
  profesor_id uuid := (select id from auth.users where email = 'profesor.demo@aforofit.cl');
  usuario_alumno uuid := (select id from auth.users where email = 'alumno.demo@aforofit.cl');
  alumno_id uuid;
  maquina_id bigint;
  en_plantilla bigint;
  en_rutina bigint;
  implemento_id bigint;
  libre bigint;
  rutina_id uuid;
  prestamo_id uuid;
  cuenta uuid;
begin
  insert into public.alumnos(nombre, rut, certificado_hasta)
  values ('QA Catálogo', 'QA-CATALOGO-021', current_date + 365) returning id into alumno_id;
  insert into public.maquinas(nombre) values ('QA Histórica') returning id into en_rutina;
  insert into public.rutinas(alumno_id, activa) values (alumno_id, false) returning id into rutina_id;
  insert into public.rutina_ejercicios(rutina_id,orden,ejercicio,maquina_id,series,repeticiones)
  values (rutina_id,1,'QA',en_rutina,1,1);
  select e.maquina_id into en_plantilla from public.plantilla_ejercicios e limit 1;
  perform pg_temp.ok('Storage limita tamaño y MIME', (
    select public and file_size_limit = 2097152
      and allowed_mime_types = array['image/jpeg','image/png','image/webp']
    from storage.buckets where id = 'maquinas'));

  perform set_config('request.jwt.claims', jsonb_build_object('sub',admin_id,'role','authenticated')::text,true);
  set local role authenticated;
  insert into public.maquinas(nombre,patron_movimiento,ajustes,estado,foto_url)
  values ('QA Equipo','Empuje','Asiento en 2','disponible','catalogo/qa.jpg') returning id into maquina_id;
  perform pg_temp.ok('CA25 conserva todos los datos de la ficha', exists(
    select from public.maquinas m where m.id = qa.maquina_id and nombre = 'QA Equipo'
      and patron_movimiento = 'Empuje' and ajustes = 'Asiento en 2' and foto_url = 'catalogo/qa.jpg'));
  perform pg_temp.ok('Admin edita ficha', pg_temp.resultado(format(
    'update public.maquinas set foto_url = %L, estado = %L where id = %s',
    'catalogo/qa-nueva.png','en_mantencion',maquina_id)) = '1');
  perform pg_temp.ok('Admin borra máquina sin referencias', pg_temp.resultado(format(
    'delete from public.maquinas where id = %s',maquina_id)) = '1');
  perform pg_temp.ok('FK protege una máquina en plantilla', pg_temp.resultado(format(
    'delete from public.maquinas where id = %s',en_plantilla)) like '23503/%');
  perform pg_temp.ok('FK protege una máquina en una rutina histórica', pg_temp.resultado(format(
    'delete from public.maquinas where id = %s',en_rutina)) like '23503/%');
  insert into public.implementos(nombre,cantidad_total) values ('QA Balón',5) returning id into implemento_id;
  insert into public.implementos(nombre,cantidad_total) values ('QA Libre',0) returning id into libre;
  perform pg_temp.ok('Admin borra implemento sin referencias', pg_temp.resultado(format(
    'delete from public.implementos where id = %s',libre)) = '1');
  perform pg_temp.ok('CA27 stock inicial', exists(select from public.catalogo_implementos
    where id = qa.implemento_id and cantidad_total = 5 and disponible = 5 and prestada = 0));
  perform pg_temp.ok('Total negativo rechazado', pg_temp.resultado(format(
    'update public.implementos set cantidad_total = -1 where id = %s',implemento_id)) like '23514/%');

  foreach cuenta in array array[profesor_id, usuario_alumno] loop
    perform set_config('request.jwt.claims', jsonb_build_object('sub',cuenta,'role','authenticated')::text,true);
    perform pg_temp.ok('El catálogo administrativo exige rol admin', not exists(select from public.catalogo_implementos));
    perform pg_temp.ok('Sin alta de implementos', pg_temp.resultado(
      'insert into public.implementos(nombre) values (''QA No Autorizado'')') like '42501/%');
    perform pg_temp.ok('Sin edición de implementos', pg_temp.resultado(format(
      'update public.implementos set cantidad_total = 9 where id = %s',implemento_id)) = '0');
    perform pg_temp.ok('Sin eliminación de implementos', pg_temp.resultado(format(
      'delete from public.implementos where id = %s',implemento_id)) = '0');
  end loop;
  perform set_config('request.jwt.claims', jsonb_build_object('sub',profesor_id,'role','authenticated')::text,true);
  perform public.cambiar_estado_maquina(en_rutina,'en_mantencion');
  perform pg_temp.ok('Profesor conserva RPC de mantención', exists(
    select from public.maquinas where id = en_rutina and estado = 'en_mantencion'));
  perform pg_temp.ok('CA27 préstamo rechaza más que el stock', pg_temp.resultado(format(
    'select public.registrar_prestamo(%L, %L)', alumno_id,
    jsonb_build_array(jsonb_build_object('implemento_id',implemento_id,'cantidad',6)))) = 'P0001/stock_insuficiente');
  prestamo_id := public.registrar_prestamo(alumno_id,jsonb_build_array(jsonb_build_object('implemento_id',implemento_id,'cantidad',3)));

  perform set_config('request.jwt.claims', jsonb_build_object('sub',admin_id,'role','authenticated')::text,true);
  perform pg_temp.ok('Stock con préstamo abierto', exists(select from public.catalogo_implementos
    where id = qa.implemento_id and disponible = 2 and prestada = 3));
  perform pg_temp.ok('Total inferior a lo prestado bloqueado', pg_temp.resultado(format(
    'update public.implementos set cantidad_total = 2 where id = %s',implemento_id)) = '23514/inventario_menor_que_prestado');
  perform pg_temp.ok('Puede reducirse al total pendiente', pg_temp.resultado(format(
    'update public.implementos set cantidad_total = 3 where id = %s',implemento_id)) = '1');
  perform pg_temp.ok('No se elimina con préstamo abierto',pg_temp.resultado(format(
    'delete from public.implementos where id = %s',implemento_id)) like '23503/%');
  perform public.registrar_devolucion(prestamo_id,jsonb_build_array(jsonb_build_object('implemento_id',implemento_id,'cantidad',1)));
  perform pg_temp.ok('Devolución parcial libera stock para reducir inventario', pg_temp.resultado(format(
    'update public.implementos set cantidad_total = 2 where id = %s',implemento_id)) = '1'
    and exists(select from public.catalogo_implementos where id = qa.implemento_id and prestada = 2));
  perform public.registrar_devolucion(prestamo_id);
  perform pg_temp.ok('Devolución completa repone stock', exists(select from public.catalogo_implementos
    where id = qa.implemento_id and disponible = 2 and prestada = 0));
  perform pg_temp.ok('No se elimina con préstamo ya devuelto', pg_temp.resultado(format(
    'delete from public.implementos where id = %s',implemento_id)) like '23503/%');
  reset role;

  set local role anon;
  perform pg_temp.ok('Anon sin catálogo administrativo', pg_temp.resultado(
    'select * from public.catalogo_implementos') like '42501/%');
  reset role;
end $$;

rollback;
