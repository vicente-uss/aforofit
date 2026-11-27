-- Ejecutar después de 020 en una base desechable. Las cuentas y los préstamos se revierten.
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
create function pg_temp.sesion(usuario uuid) returns void language sql as $$
  select set_config('request.jwt.claims', jsonb_build_object('sub', usuario, 'role', 'authenticated')::text, true)
$$;

do $$
declare
  profesor uuid := gen_random_uuid();
  admin uuid := gen_random_uuid();
  estudiante uuid := gen_random_uuid();
  otro_estudiante uuid := gen_random_uuid();
  alumno uuid;
  implemento bigint;
  prestamo uuid;
  siguiente uuid;
  unidad jsonb;
  pedido jsonb;
  envio timestamptz;
  aforo_antes jsonb;
begin
  insert into auth.users(id, email)
    select u, u || '@example.invalid' from unnest(array[profesor, admin, estudiante, otro_estudiante]) u;
  update public.perfiles set rol = 'profesor' where id = profesor;
  update public.perfiles set rol = 'admin' where id = admin;
  insert into public.alumnos(nombre, perfil_id) values ('Alumno F-30', estudiante) returning id into alumno;
  insert into public.alumnos(nombre, perfil_id) values ('Otro alumno F-30', otro_estudiante);
  insert into public.implementos(nombre, cantidad_total) values ('Balones F-30 ' || profesor, 2) returning id into implemento;
  unidad := jsonb_build_array(jsonb_build_object('implemento_id', implemento, 'cantidad', 1));
  pedido := jsonb_build_array(jsonb_build_object('implemento_id', implemento, 'cantidad', 2));
  select to_jsonb(a) into aforo_antes from public.aforo a where id = 1;

  set local role anon;
  perform pg_temp.ok('Anónimo sin permiso para consultar ni enviar',
    not has_function_privilege('public.mi_aviso_tne()', 'EXECUTE')
    and not has_function_privilege('public.enviar_aviso_tne(uuid)', 'EXECUTE'));

  set local role authenticated;
  perform pg_temp.sesion(profesor);
  prestamo := public.registrar_prestamo(alumno, pedido);
  perform pg_temp.ok('Préstamo inexistente rechazado',
    pg_temp.error_de(format('select public.enviar_aviso_tne(%L)', gen_random_uuid())) = 'prestamo_no_encontrado');
  perform pg_temp.ok('Préstamo abierto sin devolución no admite aviso',
    pg_temp.error_de(format('select public.enviar_aviso_tne(%L)', prestamo)) = 'prestamo_abierto');
  perform public.registrar_devolucion(prestamo, unidad);
  perform pg_temp.ok('La devolución parcial no habilita el aviso',
    pg_temp.error_de(format('select public.enviar_aviso_tne(%L)', prestamo)) = 'prestamo_abierto'
    and (select aviso_tne_en is null from public.prestamos_pendientes where id = prestamo));

  perform public.registrar_devolucion(prestamo, unidad);
  perform pg_temp.ok('El profesor ve la garantía pendiente sin aviso enviado',
    (select devuelto_en is not null and not tne_devuelta and aviso_tne_en is null
      from public.prestamos_pendientes where id = prestamo));

  perform pg_temp.sesion(estudiante);
  perform pg_temp.ok('La devolución total por sí sola no muestra el aviso', not public.mi_aviso_tne());
  perform pg_temp.ok('El alumno no puede enviar avisos',
    pg_temp.error_de(format('select public.enviar_aviso_tne(%L)', prestamo)) = 'sin_permiso');
  perform pg_temp.sesion(admin);
  perform pg_temp.ok('El administrador no puede enviar el aviso',
    pg_temp.error_de(format('select public.enviar_aviso_tne(%L)', prestamo)) = 'sin_permiso');

  perform pg_temp.sesion(profesor);
  perform public.enviar_aviso_tne(prestamo);
  perform pg_temp.ok('El profesor ve el aviso enviado y conserva la garantía pendiente',
    (select aviso_tne_en is not null and not tne_devuelta from public.prestamos_pendientes where id = prestamo));
  -- Fecha distinta a now() para detectar si un segundo envío sobrescribe la primera.
  reset role;
  update public.prestamos set aviso_tne_en = now() - interval '1 minute'
    where id = prestamo returning aviso_tne_en into envio;
  set local role authenticated;
  perform public.enviar_aviso_tne(prestamo);
  perform pg_temp.ok('El reintento conserva la fecha original',
    (select aviso_tne_en = envio from public.prestamos_pendientes where id = prestamo));
  perform pg_temp.ok('El profesor solo consulta el estado en el panel de préstamos', not public.mi_aviso_tne());
  perform pg_temp.ok('D19 y R9: la garantía pendiente bloquea otro préstamo incluso después del aviso',
    pg_temp.error_de(format('select public.registrar_prestamo(%L, %L)', alumno, pedido)) = 'tne_pendiente'
    and (select disponible = 2 from public.stock_prestamos where id = implemento));

  perform pg_temp.sesion(estudiante);
  perform pg_temp.ok('El dueño recibe el aviso en su perfil', public.mi_aviso_tne());
  perform pg_temp.ok('El aviso no concede acceso al detalle del préstamo',
    not exists (select from public.prestamos where id = prestamo)
    and not exists (select from public.prestamos_pendientes where id = prestamo));
  perform pg_temp.sesion(otro_estudiante);
  perform pg_temp.ok('Otro alumno no puede leer el aviso', not public.mi_aviso_tne());
  perform pg_temp.sesion(admin);
  perform pg_temp.ok('El administrador no ve el aviso del perfil', not public.mi_aviso_tne());

  perform pg_temp.sesion(profesor);
  perform public.entregar_tne(prestamo);
  perform pg_temp.ok('Entregar la garantía retira el préstamo de la lista',
    not exists (select from public.prestamos_pendientes where id = prestamo));
  perform pg_temp.ok('Un envío atrasado no reabre el aviso',
    pg_temp.error_de(format('select public.enviar_aviso_tne(%L)', prestamo)) = 'tne_ya_entregada');
  perform pg_temp.sesion(estudiante);
  perform pg_temp.ok('La entrega retira automáticamente el aviso del perfil', not public.mi_aviso_tne());

  perform pg_temp.sesion(profesor);
  siguiente := public.registrar_prestamo(alumno, unidad);
  perform public.registrar_devolucion(siguiente, null);
  perform pg_temp.sesion(estudiante);
  perform pg_temp.ok('Otro préstamo pendiente no reactiva el aviso anterior', not public.mi_aviso_tne());
  perform pg_temp.sesion(profesor);
  perform pg_temp.ok('D04: las operaciones de préstamos conservan el aforo',
    aforo_antes = (select to_jsonb(a) from public.aforo a where id = 1));
  reset role;
end;
$$;
rollback;
