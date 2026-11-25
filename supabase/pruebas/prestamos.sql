-- S1 y S2. Ejecutar después de 015. Cada caso usa datos propios y se revierte.
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
  select set_config('request.jwt.claims', jsonb_build_object('sub', usuario, 'role','authenticated')::text, true)
$$;

do $$
declare
  prof uuid := gen_random_uuid();
  adm uuid := gen_random_uuid();
  estudiante uuid := gen_random_uuid();
  v_alumno uuid; otro uuid; basquet bigint; futbol bigint;
  pedido jsonb; prestamo uuid; siguiente uuid; emision date;
  uid_prueba text := upper(array_to_string(regexp_match(replace(prof::text,'-',''), '^(..)(..)(..)(..)(..)(..)(..)'), ':'));
  antes jsonb; resultado jsonb;
begin
  insert into auth.users(id,email) values (prof,prof || '@example.invalid'),
    (adm,adm || '@example.invalid'), (estudiante,estudiante || '@example.invalid');
  update public.perfiles set rol='profesor' where id=prof;
  update public.perfiles set rol='admin' where id=adm;
  insert into public.alumnos(nombre,perfil_id) values ('Alumno de prueba',estudiante) returning id into v_alumno;
  insert into public.alumnos(nombre) values ('Segundo alumno de prueba') returning id into otro;
  insert into public.implementos(nombre,cantidad_total) values ('Básquetbol ' || prof,2) returning id into basquet;
  insert into public.implementos(nombre,cantidad_total) values ('Fútbol ' || prof,2) returning id into futbol;
  pedido := jsonb_build_array(jsonb_build_object('implemento_id',basquet,'cantidad',2),
                              jsonb_build_object('implemento_id',futbol,'cantidad',1));
  select to_jsonb(a) into antes from public.aforo a where id=1;
  perform pg_temp.sesion(prof);
  set local role authenticated;
  prestamo := public.registrar_prestamo(v_alumno,pedido);
  perform pg_temp.ok('CA19: solicitud abierta con 2 balones de básquetbol y un segundo implemento',
    (select p.profesor_id=prof and not p.tne_devuelta and p.devuelto_en is null
     from public.prestamos p where p.id=prestamo)
    and (select cantidad=2 from public.prestamo_items where prestamo_id=prestamo and implemento_id=basquet)
    and (select count(*)=2 from public.prestamo_items where prestamo_id=prestamo));
  perform pg_temp.ok('CA19: stock disponible baja', (select disponible=0 from public.stock_prestamos where id=basquet));
  perform pg_temp.ok('Lista muestra alumno, implementos y entrega', exists (
    select 1 from public.prestamos_pendientes where id=prestamo and alumno_id=v_alumno and entregado_en is not null
      and implementos like '%Básquetbol%' and implementos like '%Fútbol%'));
  perform pg_temp.ok('D04: aforo intacto', antes = (select to_jsonb(a) from public.aforo a where id=1));
  perform pg_temp.ok('CA20: préstamo abierto bloquea otro',
    pg_temp.error_de(format('select public.registrar_prestamo(%L,%L)',v_alumno,pedido))='prestamo_abierto');
  perform pg_temp.ok('Stock insuficiente bloquea a otro alumno', pg_temp.error_de(format(
    'select public.registrar_prestamo(%L,%L)',otro,jsonb_build_array(jsonb_build_object('implemento_id',futbol,'cantidad',3))))='stock_insuficiente');
  perform pg_temp.ok('Cantidad cero rechazada', pg_temp.error_de(format(
    'select public.registrar_prestamo(%L,%L)',otro,jsonb_build_array(jsonb_build_object('implemento_id',basquet,'cantidad',0))))='items_invalidos');
  perform pg_temp.ok('Solicitud rechazada no deja cabecera', not exists(select 1 from public.prestamos where alumno_id=otro));

  perform pg_temp.sesion(estudiante);
  perform pg_temp.ok('Alumno no lee pendientes ajenos ni propios', not exists(select 1 from public.prestamos_pendientes));
  perform pg_temp.ok('Alumno no registra préstamos',
    pg_temp.error_de(format('select public.registrar_prestamo(%L,%L)',v_alumno,pedido))='sin_permiso');
  perform pg_temp.ok('Alumno no registra devoluciones',
    pg_temp.error_de(format('select public.registrar_devolucion(%L)',prestamo))='sin_permiso');
  perform pg_temp.ok('Alumno no habilita',
    pg_temp.error_de(format('select public.registrar_habilitacion(%L,current_date)',v_alumno))='sin_permiso');

  perform pg_temp.sesion(prof);
  perform public.registrar_devolucion(prestamo);
  perform pg_temp.ok('Devolución completa repone stock y devuelve la TNE',
    (select disponible=2 from public.stock_prestamos where id=basquet)
    and (select tne_devuelta and devuelto_en is not null from public.prestamos where id=prestamo)
    and not exists(select 1 from public.prestamos_pendientes where id=prestamo));
  perform pg_temp.ok('Devolver dos veces da error',
    pg_temp.error_de(format('select public.registrar_devolucion(%L)',prestamo))='prestamo_cerrado');
  perform pg_temp.ok('Préstamo inexistente da error',
    pg_temp.error_de(format('select public.registrar_devolucion(%L)',gen_random_uuid()))='prestamo_no_encontrado');
  siguiente := public.registrar_prestamo(v_alumno,pedido);
  perform pg_temp.ok('CA20: puede volver a pedir', siguiente <> prestamo);

  -- Reproduce D19 sin agregar devoluciones parciales al flujo S1.
  reset role;
  update public.prestamos set devuelto_en=now() where id=siguiente;
  set local role authenticated;
  perform pg_temp.ok('D19: solo la TNE pendiente bloquea', pg_temp.error_de(format(
    'select public.registrar_prestamo(%L,%L)',v_alumno,pedido))='tne_pendiente');
  perform pg_temp.ok('Profesor no habilita',
    pg_temp.error_de(format('select public.registrar_habilitacion(%L,current_date)',v_alumno))='sin_permiso');
  perform pg_temp.sesion(adm);
  emision := (now() at time zone 'America/Santiago')::date;
  perform public.registrar_habilitacion(v_alumno,emision);
  perform pg_temp.ok('CA28: emisión y vencimiento a 12 meses',
    (select certificado_emision=emision and certificado_hasta=(emision+interval '12 months')::date
     from public.alumnos where id=v_alumno));
  perform pg_temp.ok('Emisión futura rechazada',pg_temp.error_de(format(
    'select public.registrar_habilitacion(%L,%L)',v_alumno,emision+1))='emision_invalida');
  perform pg_temp.ok('Emisión nula rechazada',pg_temp.error_de(format(
    'select public.registrar_habilitacion(%L,null)',v_alumno))='emision_invalida');
  perform public.registrar_habilitacion(v_alumno,(emision-interval '13 months')::date);
  reset role;
  -- UID generado para este caso; la vigencia se comprueba antes del horario en 014.
  insert into public.tarjetas(uid,alumno_id) values (uid_prueba,v_alumno);
  set local role authenticated;
  resultado := public.registrar_ingreso(uid_prueba);
  perform pg_temp.ok('CA28: registrar_ingreso rechaza certificado vencido',
    resultado->>'resultado'='rechazo' and resultado->>'motivo'='certificado_no_vigente');
  reset role;
end;
$$;
rollback;
