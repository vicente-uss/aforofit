begin;

create function pg_temp.ok(caso text, correcto boolean) returns void language plpgsql as $$
begin
  if correcto is not true then raise exception 'FALLÓ: %', caso; end if;
  raise notice 'OK: %', caso;
end;
$$;

create function pg_temp.error_de(sentencia text) returns text language plpgsql as $$
begin
  execute sentencia;
  return null;
exception when others then return sqlerrm;
end;
$$;

do $$
declare
  profesor uuid;
  administrador uuid;
  alumno uuid;
  vinculado uuid;
  externo_uno uuid := gen_random_uuid();
  externo_dos uuid := gen_random_uuid();
  fallido uuid := gen_random_uuid();
  balon bigint;
  peto bigint;
  fijo bigint;
  prestamo_uno uuid;
  prestamo_dos uuid;
  unidad jsonb;
  pedido jsonb;
  aforo_antes jsonb;
begin
  select id into strict profesor from auth.users where email = 'profesor.demo@aforofit.cl';
  select id into strict administrador from auth.users where email = 'admin.demo@aforofit.cl';
  select id into strict alumno from auth.users where email = 'alumno.demo@aforofit.cl';
  select id into strict vinculado from public.alumnos where perfil_id = alumno;
  insert into public.implementos(nombre, cantidad_total) values ('QA 029 balón', 3) returning id into balon;
  insert into public.implementos(nombre, cantidad_total) values ('QA 029 peto', 1) returning id into peto;
  insert into public.implementos(nombre, cantidad_total, prestable) values ('QA 029 fijo', 5, false) returning id into fijo;
  unidad := jsonb_build_array(jsonb_build_object('implemento_id', balon, 'cantidad', 1));
  pedido := jsonb_build_array(jsonb_build_object('implemento_id', balon, 'cantidad', 2),
    jsonb_build_object('implemento_id', peto, 'cantidad', 1));
  select to_jsonb(a) into aforo_antes from public.aforo a where id = 1;

  set local role anon;
  perform pg_temp.ok('Anónimo sin acceso a búsqueda ni préstamo por nombre',
    not has_function_privilege('public.buscar_solicitantes(text)', 'EXECUTE')
    and not has_function_privilege('public.registrar_prestamo_por_nombre(uuid,boolean,text,text,jsonb,boolean)', 'EXECUTE'));

  set local role authenticated;
  perform set_config('request.jwt.claims', jsonb_build_object('sub', alumno, 'role', 'authenticated')::text, true);
  perform pg_temp.ok('Alumno sin acceso a directorio ni a registrar externos',
    not exists(select from public.buscar_solicitantes('QA'))
    and pg_temp.error_de(format('select public.registrar_prestamo_por_nombre(%L,true,%L,null,%L,true)',
      externo_uno, 'QA Solicitante', pedido)) = 'sin_permiso');

  perform set_config('request.jwt.claims', jsonb_build_object('sub', profesor, 'role', 'authenticated')::text, true);
  perform pg_temp.ok('No se registra un préstamo sin confirmar la TNE física',
    pg_temp.error_de(format('select public.registrar_prestamo_por_nombre(%L,true,%L,null,%L,false)',
      externo_uno, 'QA Solicitante', pedido)) = 'tne_requerida');
  perform pg_temp.ok('Nombre en blanco rechazado',
    pg_temp.error_de(format('select public.registrar_prestamo_por_nombre(%L,true,%L,null,%L,true)',
      externo_uno, E' \n\t', pedido)) = 'nombre_invalido');
  perform pg_temp.ok('La baja de un elemento prestable se respeta en el servidor',
    pg_temp.error_de(format('select public.registrar_prestamo_por_nombre(%L,true,%L,null,%L,true)',
      fallido, 'QA Fallido',
      jsonb_build_array(jsonb_build_object('implemento_id', fijo, 'cantidad', 1)))) = 'implemento_no_prestable');
  perform pg_temp.ok('Un préstamo rechazado deja intacto el directorio externo',
    not exists(select from public.solicitantes_externos where id in (fallido, externo_uno)));

  prestamo_uno := public.registrar_prestamo_por_nombre(externo_uno, true, '  QA   Lucía Homónima  ', 'Equipo A', pedido, true);
  prestamo_dos := public.registrar_prestamo_por_nombre(externo_dos, true, 'QA Lucía Homónima', 'Equipo B', unidad, true);
  perform pg_temp.ok('Dos homónimas pueden tener préstamos distintos sin inscripción',
    (select count(*) = 2 from public.prestamos where id in (prestamo_uno, prestamo_dos) and alumno_id is null));
  perform pg_temp.ok('Autocompletado por texto sin tilde conserva IDs y referencias',
    (select count(*) = 2 and count(distinct referencia) = 2
     from public.buscar_solicitantes('lucia homonima') where id in (externo_uno, externo_dos) and externo));
  perform pg_temp.ok('La lista reciente incluye ambos solicitantes',
    (select count(*) = 2 from public.buscar_solicitantes('') where id in (externo_uno, externo_dos)));
  perform pg_temp.ok('Pendientes identificados sin opción de aviso para externos',
    (select count(*) = 2 from public.prestamos_pendientes
      where solicitante_id in (externo_uno, externo_dos) and not cuenta_vinculada));
  perform pg_temp.ok('Se agota el stock entre homónimas',
    (select disponible = 0 from public.stock_prestamos where id = balon));
  perform pg_temp.ok('El mismo ID se bloquea mientras haya material pendiente',
    pg_temp.error_de(format('select public.registrar_prestamo_por_nombre(%L,true,null,null,%L,true)',
      externo_uno, unidad)) = 'prestamo_abierto');

  perform public.registrar_devolucion(prestamo_uno, unidad);
  perform pg_temp.ok('Devolución parcial repone una unidad con los demás ítems pendientes',
    (select disponible = 1 from public.stock_prestamos where id = balon)
    and (select disponible = 0 from public.stock_prestamos where id = peto));
  perform pg_temp.ok('La garantía se retiene hasta recuperar todos los implementos',
    pg_temp.error_de(format('select public.entregar_tne(%L)', prestamo_uno)) = 'prestamo_abierto');
  perform public.registrar_devolucion(prestamo_uno);
  perform pg_temp.ok('Incluso la firma antigua de devolución conserva la TNE',
    (select not tne_devuelta from public.prestamos where id = prestamo_uno));
  perform pg_temp.ok('Un externo sin cuenta no puede recibir un aviso',
    pg_temp.error_de(format('select public.enviar_aviso_tne(%L)', prestamo_uno)) = 'sin_cuenta_vinculada');
  perform pg_temp.ok('Con el material devuelto, la TNE sigue bloqueando un nuevo préstamo',
    pg_temp.error_de(format('select public.registrar_prestamo_por_nombre(%L,true,null,null,%L,true)',
      externo_uno, unidad)) = 'tne_pendiente');
  perform public.entregar_tne(prestamo_uno);
  prestamo_uno := public.registrar_prestamo_por_nombre(externo_uno, true, null, null, unidad, true);
  perform pg_temp.ok('Tras retirar la TNE se reutiliza el mismo ID externo',
    (select count(*) = 2 from public.prestamos where externo_id = externo_uno));

  perform pg_temp.ok('Profesor operativo sin acceso de escritura al inventario',
    not exists(select from public.catalogo_implementos)
    and pg_temp.error_de('insert into public.implementos (nombre) values (''QA 029 sin permiso'')')
      = 'new row violates row-level security policy for table "implementos"');

  perform set_config('request.jwt.claims', jsonb_build_object('sub', administrador, 'role', 'authenticated')::text, true);
  perform pg_temp.ok('El inventario cuenta unidades prestadas a externos',
    (select prestada = 2 and disponible = 1 from public.catalogo_implementos where id = balon));
  perform pg_temp.ok('El total no puede quedar debajo de las unidades prestadas a externos',
    pg_temp.error_de(format('update public.implementos set cantidad_total = 1 where id = %s', balon)) =
      'inventario_menor_que_prestado');

  perform set_config('request.jwt.claims', jsonb_build_object('sub', profesor, 'role', 'authenticated')::text, true);
  prestamo_uno := public.registrar_prestamo_por_nombre(vinculado, false, null, null, unidad, true);
  perform public.registrar_devolucion(prestamo_uno, null);
  perform public.enviar_aviso_tne(prestamo_uno);
  perform set_config('request.jwt.claims', jsonb_build_object('sub', alumno, 'role', 'authenticated')::text, true);
  perform pg_temp.ok('El préstamo por nombre conserva el aviso para la cuenta vinculada', public.mi_aviso_tne());
  reset role;
  perform pg_temp.ok('Préstamos externos y vinculados preservan el aforo',
    (select to_jsonb(a) = aforo_antes from public.aforo a where id = 1));
end;
$$;

rollback;
