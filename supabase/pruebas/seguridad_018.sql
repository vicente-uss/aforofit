-- Ejecutar en una base de prueba con 018 y las tres cuentas de demostración.
begin;
-- Storage activa esta variable durante los borrados por su API. Aquí solo hay
-- metadatos ficticios y rollback. Las políticas RLS siguen evaluando cada rol.
set local storage.allow_delete_query = 'true';

create function pg_temp.ok(caso text, correcto boolean) returns void language plpgsql as $$
begin
  if correcto is not true then raise exception 'FALLÓ: %', caso; end if;
  raise notice 'OK: %', caso;
end $$;

-- RLS puede denegar una operación filtrando todas las filas o lanzando 42501.
create function pg_temp.filas(sentencia text) returns integer language plpgsql as $$
declare n integer;
begin
  execute sentencia;
  get diagnostics n = row_count;
  return n;
exception when insufficient_privilege then return -1;
end $$;

do $$
<<seg>>
declare
  rol text;
  cuenta uuid;
  maquina bigint;
  funcion regprocedure;
  ruta constant text := '018-ficticia.jpg';
  n integer;
begin
  insert into public.maquinas(nombre) values ('018 ficticia') returning id into maquina;
  insert into storage.objects(bucket_id,name) values ('maquinas',ruta);
  perform pg_temp.ok('Bucket de fotos público', (select public from storage.buckets where id='maquinas'));
  perform pg_temp.ok('Tablas de negocio con RLS', not exists(
    select from pg_class where relnamespace='public'::regnamespace and relkind in ('r','p') and not relrowsecurity));
  perform pg_temp.ok('Vistas de préstamos respetan RLS del invocante',
    (select count(*)=2 and bool_and('security_invoker=true'=any(reloptions))
     from pg_class where oid in ('public.stock_prestamos'::regclass,'public.prestamos_pendientes'::regclass)));
  foreach rol in array array['anon','authenticated'] loop
    perform pg_temp.ok(rol || ' sin acceso directo a secuencias de identidad', not exists(
      select from pg_class where oid in ('public.maquinas_id_seq'::regclass, 'public.implementos_id_seq'::regclass,
        'public.plantillas_id_seq'::regclass,'public.plantilla_ejercicios_id_seq'::regclass)
      and has_sequence_privilege(rol,oid,'USAGE,SELECT,UPDATE')));
    perform pg_temp.ok(rol || ' sin permisos sobre esquema privado',
      not has_schema_privilege(rol,'privado','USAGE,CREATE'));
    perform pg_temp.ok(rol || ' sin permisos sobre códigos',
      not has_table_privilege(rol,'privado.codigos_ingreso','SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'));
  end loop;
  perform pg_temp.ok('Códigos protegidos por RLS sin políticas',
    (select relrowsecurity from pg_class where oid='privado.codigos_ingreso'::regclass)
    and not exists(select from pg_policy where polrelid='privado.codigos_ingreso'::regclass));
  foreach funcion in array array[
    'public.actualizar_configuracion(integer,jsonb,integer)'::regprocedure,
    'public.cambiar_estado_maquina(bigint,text)', 'public.cerrar_visita(uuid)',
    'public.elegir_objetivo_nivel(text,text)', 'public.entregar_tne(uuid)',
    'public.generar_codigo_ingreso()', 'public.generar_rutina(uuid)',
    'public.registrar_devolucion(uuid,jsonb)', 'public.registrar_devolucion(uuid)',
    'public.registrar_feedback(uuid,text)', 'public.registrar_habilitacion(uuid,date)',
    'public.registrar_ingreso(text)', 'public.registrar_ingreso_codigo(text)',
    'public.registrar_prestamo(uuid,jsonb)', 'public.rutina_del_dia(uuid)',
    'public.vincular_credencial(text,uuid,text)'
  ] loop
    perform pg_temp.ok(funcion::text || ' permisos efectivos y search_path',
      not has_function_privilege('anon',funcion,'EXECUTE')
      and has_function_privilege('authenticated',funcion,'EXECUTE')
      and (select 'search_path=""'=any(proconfig) and
        prosecdef = (funcion <> 'public.registrar_devolucion(uuid)'::regprocedure)
        from pg_proc where oid=funcion));
  end loop;
  set local role anon;
  perform pg_temp.ok('Anon sin lectura de máquinas',pg_temp.filas('select * from public.maquinas')=-1);
  perform pg_temp.ok('Anon sin listado',pg_temp.filas('select * from storage.objects where bucket_id=''maquinas''')<=0);
  reset role;
  foreach rol in array array['alumno','profesor','admin'] loop
    select p.id into strict cuenta from public.perfiles p join auth.users u on u.id=p.id
      where u.email=seg.rol || '.demo@aforofit.cl' and p.rol=seg.rol;
    perform set_config('request.jwt.claims', jsonb_build_object('sub',cuenta,'role','authenticated')::text,true);
    set local role authenticated;
    perform pg_temp.ok(rol || ' lee catálogo',exists(select from public.maquinas where id=maquina));
    perform pg_temp.ok(rol || ' sin truncate',
      not has_table_privilege(current_user,'public.maquinas','TRUNCATE'));
    perform pg_temp.ok(rol || ' sin cambio de rol',
      pg_temp.filas(format('update public.perfiles set rol=%L where id=%L','admin',cuenta))=-1);
    if rol='admin' then
      insert into public.maquinas(nombre) values ('018 admin');
      update public.maquinas set nombre='018 editada' where id=maquina;
      delete from public.maquinas where id=maquina;
      get diagnostics n = row_count;
      perform pg_temp.ok('Admin gestiona máquinas',n=1);
      insert into storage.objects(bucket_id,name) values ('maquinas','018-admin.jpg');
      update storage.objects set name='018-editada.jpg' where bucket_id='maquinas' and name='018-admin.jpg';
      delete from storage.objects where bucket_id='maquinas' and name='018-editada.jpg';
      get diagnostics n = row_count;
      perform pg_temp.ok('Admin lista y gestiona fotos',n=1 and exists(
        select from storage.objects where bucket_id='maquinas' and name=ruta));
    else
      perform pg_temp.ok(rol || ' sin alta de máquina',pg_temp.filas('insert into public.maquinas(nombre) values (''018'')')=-1);
      perform pg_temp.ok(rol || ' sin edición directa',pg_temp.filas(format('update public.maquinas set estado=''disponible'' where id=%s',maquina))=0);
      perform pg_temp.ok(rol || ' sin borrado',pg_temp.filas(format('delete from public.maquinas where id=%s',maquina))=0);
      perform pg_temp.ok(rol || ' sin listado',not exists(select from storage.objects where bucket_id='maquinas'));
      perform pg_temp.ok(rol || ' sin subir foto',pg_temp.filas('insert into storage.objects(bucket_id,name) values (''maquinas'',''018-otra.jpg'')')=-1);
      perform pg_temp.ok(rol || ' sin editar foto',pg_temp.filas(format('update storage.objects set name=''018-otra.jpg'' where bucket_id=''maquinas'' and name=%L',ruta))=0);
      perform pg_temp.ok(rol || ' sin borrar foto',pg_temp.filas(format('delete from storage.objects where bucket_id=''maquinas'' and name=%L',ruta))=0);
      if rol='profesor' then
        perform pg_temp.ok('Profesor cambia estado por RPC',
          public.cambiar_estado_maquina(maquina,'en_mantencion')->>'estado'='en_mantencion');
      else
        begin
          perform public.cambiar_estado_maquina(maquina,'en_mantencion');
          raise exception 'Se permitió cambio de estado al alumno';
        exception when raise_exception then
          perform pg_temp.ok('Alumno sin cambio por RPC',sqlerrm='sin_permiso');
        end;
      end if;
    end if;
    reset role;
  end loop;
end $$;
rollback;
