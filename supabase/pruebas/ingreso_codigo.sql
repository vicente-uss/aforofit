-- F-21. Cuentas de prueba de 001 y 008. Datos y horario aislados por rollback.
begin;
create function pg_temp.ok(caso text, resultado boolean) returns void language plpgsql as $$
begin
  if resultado is not true then raise exception 'FALLÓ: %', caso; end if;
  raise notice 'OK: %', caso;
end;
$$;
create function pg_temp.sesion(usuario uuid) returns void language sql as $$
  select set_config('request.jwt.claims',jsonb_build_object('sub',usuario,'role','authenticated')::text,true)
$$;
create function pg_temp.error_de(sentencia text) returns text language plpgsql as $$
begin execute sentencia; return null; exception when others then return sqlerrm; end;
$$;
do $$
declare
  alumno uuid; cuenta uuid; prof uuid; otro uuid; codigo text; nuevo text; r jsonb; uid text;
  hoy date := (now() at time zone 'America/Santiago')::date;
  abierto jsonb;
begin
  select id into strict cuenta from auth.users where email='alumno.demo@aforofit.cl';
  select id into strict alumno from public.alumnos where perfil_id=cuenta;
  select id into strict prof from public.perfiles where rol='profesor' limit 1;
  update public.visitas set salida=entrada where salida is null;
  delete from public.turnos where (creado_en at time zone 'America/Santiago')::date=hoy;
  delete from public.tarjetas where alumno_id=alumno;
  update public.alumnos set certificado_hasta=hoy+30 where id=alumno;
  select jsonb_object_agg(d, jsonb_build_object('apertura','00:00','ultimo_ingreso','23:59','cierre','23:59'))
    into abierto from unnest(array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']) d;
  update public.configuracion set capacidad=1, horario=abierto;
  perform pg_temp.sesion(cuenta);
  set local role authenticated;
  perform pg_temp.ok('Sin tarjeta no genera código',pg_temp.error_de('select public.generar_codigo_ingreso()')='sin_tarjeta');
  reset role;
  uid := upper(array_to_string(regexp_match(replace(gen_random_uuid()::text,'-',''), '^(..)(..)(..)(..)(..)(..)(..)'), ':'));
  insert into public.tarjetas(uid,alumno_id) values(uid,alumno);
  set local role authenticated;
  r := public.generar_codigo_ingreso();
  codigo := r->>'codigo';
  perform pg_temp.ok('Formato y vigencia de dos minutos',codigo ~ '^[GHJKMNPQRSTVWXYZ][A-HJ-NP-Z2-9]{5}$'
    and (r->>'vence_en')::timestamptz between clock_timestamp()+interval '119 seconds' and clock_timestamp()+interval '120 seconds');
  perform pg_temp.ok('Alumno no puede consumir',
    pg_temp.error_de(format('select public.registrar_ingreso_codigo(%L)',codigo))='sin_permiso');
  nuevo := public.generar_codigo_ingreso()->>'codigo';
  perform pg_temp.sesion(prof);
  perform pg_temp.ok('Código reemplazado',pg_temp.error_de(format('select public.registrar_ingreso_codigo(%L)',codigo))='codigo_invalido');
  r := public.registrar_ingreso_codigo(nuevo);
  perform pg_temp.ok('CA31: entrada real',r->>'resultado'='entrada' and (r->>'ocupacion')::int=1);
  perform pg_temp.ok('Un solo uso',pg_temp.error_de(format('select public.registrar_ingreso_codigo(%L)',nuevo))='codigo_invalido');
  perform pg_temp.sesion(cuenta); codigo := public.generar_codigo_ingreso()->>'codigo'; perform pg_temp.sesion(prof);
  r := public.registrar_ingreso_codigo(codigo);
  perform pg_temp.ok('R5: sale con un nuevo código',r->>'resultado'='salida' and (r->>'ocupacion')::int=0);
  reset role;
  update public.alumnos set certificado_hasta=hoy-1 where id=alumno;
  perform pg_temp.sesion(cuenta); codigo := public.generar_codigo_ingreso()->>'codigo'; perform pg_temp.sesion(prof);
  perform pg_temp.ok('R2: certificado vencido',public.registrar_ingreso_codigo(codigo)->>'motivo'='certificado_no_vigente');
  update public.alumnos set certificado_hasta=hoy+30 where id=alumno;
  update public.configuracion set horario='{}';
  perform pg_temp.sesion(cuenta); codigo := public.generar_codigo_ingreso()->>'codigo'; perform pg_temp.sesion(prof);
  perform pg_temp.ok('R3: gimnasio cerrado',public.registrar_ingreso_codigo(codigo)->>'motivo'='gimnasio_cerrado');
  update public.configuracion set horario=abierto;
  insert into public.alumnos(nombre) values('Otro alumno de prueba') returning id into otro;
  insert into public.visitas(alumno_id) values(otro);
  perform pg_temp.sesion(cuenta); codigo := public.generar_codigo_ingreso()->>'codigo'; perform pg_temp.sesion(prof);
  perform pg_temp.ok('R4: gimnasio lleno asigna turno',public.registrar_ingreso_codigo(codigo)->>'resultado'='turno');
  perform pg_temp.sesion(cuenta); codigo := public.generar_codigo_ingreso()->>'codigo'; perform pg_temp.sesion(prof);
  update privado.codigos_ingreso set vence_en=clock_timestamp()-interval '1 second' where alumno_id=alumno;
  perform pg_temp.ok('Vencido no se consume',pg_temp.error_de(format('select public.registrar_ingreso_codigo(%L)',codigo))='codigo_invalido');
end;
$$;
rollback;
