-- Suite 022. Usar solo en una base de pruebas. Los datos ficticios quedan en rollback.
begin;

create function pg_temp.ok(caso text, correcto boolean) returns void language plpgsql as $$
begin
  if correcto is not true then raise exception 'FALLÓ: %', caso; end if;
  raise notice 'OK: %', caso;
end $$;

create function pg_temp.resultado(sentencia text) returns text language plpgsql as $$
declare filas integer;
begin
  execute sentencia;
  get diagnostics filas = row_count;
  return filas::text;
exception when others then
  return sqlstate;
end $$;

do $$
declare
  cuenta_a uuid := gen_random_uuid();
  cuenta_b uuid := gen_random_uuid();
  cuenta_profesor uuid := gen_random_uuid();
  cuenta_admin uuid := gen_random_uuid();
  registro_a uuid;
  registro_b uuid;
  cuenta uuid;
  rol_app text;
  imc_calculado numeric;
  alta constant text := 'insert into public.mediciones(fecha,peso_kg,estatura_cm,cintura_cm) values ';
  hoy date := (now() at time zone 'America/Santiago')::date;
begin
  insert into auth.users (id,email) values
    (cuenta_a,'medidas-a-022@example.invalid'), (cuenta_b,'medidas-b-022@example.invalid'),
    (cuenta_profesor,'medidas-profesor-022@example.invalid'), (cuenta_admin,'medidas-admin-022@example.invalid');
  update public.perfiles set rol='profesor' where id=cuenta_profesor;
  update public.perfiles set rol='admin' where id=cuenta_admin;

  perform pg_temp.ok('RLS activo y forzado', (
    select relrowsecurity and relforcerowsecurity from pg_class where oid='public.mediciones'::regclass));
  perform pg_temp.ok('Sin publicación Realtime', not exists (
    select from pg_publication_tables where schemaname='public' and tablename='mediciones'));
  perform pg_temp.ok('Sin permisos directos para service_role', not (
    has_any_column_privilege('service_role','public.mediciones','SELECT,INSERT,UPDATE')
    or has_table_privilege('service_role','public.mediciones','DELETE,TRUNCATE')
  ));

  perform set_config('request.jwt.claims',jsonb_build_object('sub',cuenta_a,'role','authenticated')::text,true);
  set local role authenticated;
  insert into public.mediciones(fecha,peso_kg,estatura_cm,cintura_cm)
    values (hoy,70.5,175,80.25) returning id,imc into registro_a,imc_calculado;
  perform pg_temp.ok('Alumno guarda su medición y se calcula el IMC', imc_calculado=23.02);
  perform pg_temp.ok('Peso, estatura y cintura persisten con su fecha', exists (
    select id from public.mediciones
    where id=registro_a and fecha=hoy and peso_kg=70.5 and estatura_cm=175 and cintura_cm=80.25));
  perform pg_temp.ok('Alumno edita su medición y se recalcula el IMC', (
    pg_temp.resultado(format('update public.mediciones set peso_kg=71, estatura_cm=180, cintura_cm=null, fecha=%L where id=%L',hoy-1,registro_a))='1'));
  perform pg_temp.ok('Edición persiste y la cintura puede quedar vacía', exists (
    select id from public.mediciones where id=registro_a and imc=21.91 and cintura_cm is null and fecha=hoy-1));

  perform pg_temp.ok('Rechaza peso negativo', pg_temp.resultado(alta || format('(%L,-1,175,82)',hoy))='23514');
  perform pg_temp.ok('Rechaza estatura ingresada en metros', pg_temp.resultado(alta || format('(%L,70,1.75,82)',hoy))='23514');
  perform pg_temp.ok('Rechaza estatura cero', pg_temp.resultado(alta || format('(%L,70,0,82)',hoy))='23514');
  perform pg_temp.ok('Rechaza perímetro fuera de rango', pg_temp.resultado(alta || format('(%L,70,175,301)',hoy))='23514');
  perform pg_temp.ok('Rechaza NaN', pg_temp.resultado(alta || format('(%L,%L,175,82)',hoy,'NaN'))='23514');
  perform pg_temp.ok('Rechaza infinito', pg_temp.resultado(alta || format('(%L,70,175,%L)',hoy,'Infinity'))='23514');
  perform pg_temp.ok('Rechaza más de dos decimales', pg_temp.resultado(alta || format('(%L,70.001,175,82)',hoy))='23514');
  perform pg_temp.ok('Rechaza fecha futura de Santiago', pg_temp.resultado(alta || format('(%L,70,175,82)',hoy+1))='23514');
  perform pg_temp.ok('Rechaza fecha infinita', pg_temp.resultado(alta || format('(%L,70,175,82)','-infinity'))='23514');
  perform pg_temp.ok('Rechaza peso ausente', pg_temp.resultado(alta || format('(%L,null,175,82)',hoy))='23502');

  perform pg_temp.ok('No se puede enviar un dueño arbitrario', pg_temp.resultado(format(
    'insert into public.mediciones(perfil_id,fecha,peso_kg,estatura_cm) values (%L,%L,75,175)',cuenta_b,hoy))='42501');
  perform pg_temp.ok('No se puede reasignar la propiedad', pg_temp.resultado(format(
    'update public.mediciones set perfil_id=%L where id=%L',cuenta_b,registro_a))='42501');
  perform pg_temp.ok('No se puede sobrescribir el IMC',
    not has_column_privilege(current_user,'public.mediciones','imc','UPDATE') and pg_temp.resultado(format(
    'update public.mediciones set imc=20 where id=%L',registro_a)) in ('42501','428C9'));

  perform set_config('request.jwt.claims',jsonb_build_object('sub',cuenta_b,'role','authenticated')::text,true);
  perform pg_temp.ok('Alumno B no puede leer el registro de A', not exists(select id from public.mediciones where id=registro_a));
  perform pg_temp.ok('Alumno B no puede editar el registro de A', pg_temp.resultado(format(
    'update public.mediciones set peso_kg=90 where id=%L',registro_a))='0');
  perform pg_temp.ok('Alumno B no puede eliminar el registro de A', pg_temp.resultado(format(
    'delete from public.mediciones where id=%L',registro_a))='0');
  insert into public.mediciones(fecha,peso_kg,estatura_cm) values (hoy,60,170) returning id into registro_b;
  perform pg_temp.ok('El alumno B puede guardar y consultar su propio registro', (
    select count(id)=1 and bool_and(id=registro_b) from public.mediciones));

  foreach cuenta in array array[cuenta_profesor,cuenta_admin] loop
    rol_app := case when cuenta=cuenta_profesor then 'Profesor' else 'Administrador' end;
    -- Aun si el token sugiere un rol distinto, manda el perfil vigente.
    perform set_config('request.jwt.claims',jsonb_build_object(
      'sub',cuenta,'role','authenticated','user_metadata',jsonb_build_object('rol','alumno'))::text,true);
    perform pg_temp.ok(rol_app || ' no puede leer registros', not exists(select id from public.mediciones));
    perform pg_temp.ok(rol_app || ' no puede crear registros', pg_temp.resultado(alta || format('(%L,70,175,82)',hoy))='42501');
    perform pg_temp.ok(rol_app || ' no puede editar registros', pg_temp.resultado(format(
      'update public.mediciones set peso_kg=90 where id=%L',registro_a))='0');
    perform pg_temp.ok(rol_app || ' no puede eliminar registros', pg_temp.resultado(format(
      'delete from public.mediciones where id=%L',registro_a))='0');
  end loop;

  perform set_config('request.jwt.claims',jsonb_build_object('sub',cuenta_a,'role','authenticated','is_anonymous',true)::text,true);
  perform pg_temp.ok('Una sesión anónima de Auth no puede leer', not exists(select id from public.mediciones));
  perform pg_temp.ok('Una sesión anónima de Auth no puede guardar', pg_temp.resultado(alta || format('(%L,70,175,82)',hoy))='42501');
  reset role;
  set local role anon;
  perform pg_temp.ok('Anon no puede leer', pg_temp.resultado('select id from public.mediciones')='42501');
  perform pg_temp.ok('Anon no puede crear', pg_temp.resultado(alta || format('(%L,70,175,82)',hoy))='42501');
  perform pg_temp.ok('Anon no puede editar', pg_temp.resultado('update public.mediciones set peso_kg=90')='42501');
  perform pg_temp.ok('Anon no puede eliminar', pg_temp.resultado('delete from public.mediciones')='42501');

  reset role;
  perform set_config('request.jwt.claims',jsonb_build_object('sub',cuenta_a,'role','authenticated')::text,true);
  set local role authenticated;
  perform pg_temp.ok('Alumno A solo puede consultar su fila', (select count(id)=1 and bool_and(id=registro_a) from public.mediciones));
  perform pg_temp.ok('Alumno A puede eliminar su medición', pg_temp.resultado(format(
    'delete from public.mediciones where id=%L',registro_a))='1');
  perform pg_temp.ok('La eliminación queda persistida', not exists(select id from public.mediciones where id=registro_a));
  reset role;
  update public.perfiles set rol='admin' where id=cuenta_b;
  perform set_config('request.jwt.claims',jsonb_build_object('sub',cuenta_b,'role','authenticated')::text,true);
  set local role authenticated;
  perform pg_temp.ok('Un cambio de rol quita acceso incluso a las filas propias', not exists(select id from public.mediciones));
  reset role;
end $$;

rollback;
