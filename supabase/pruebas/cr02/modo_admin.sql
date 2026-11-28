begin;
set local storage.allow_delete_query = 'true';

create function pg_temp.ok(caso text, aprobado boolean) returns void language plpgsql as $$
begin
  if aprobado is distinct from true then raise exception 'FALLÓ: %', caso; end if;
  raise notice 'OK %', caso;
end;
$$;

create function pg_temp.error_de(consulta text) returns text language plpgsql as $$
begin
  execute consulta;
  return null;
exception when others then return sqlerrm;
end;
$$;

create function pg_temp.sesion(usuario uuid, sesion uuid) returns void language sql as $$
  select set_config('request.jwt.claims', jsonb_build_object('sub', usuario, 'session_id', sesion)::text, true);
$$;

do $$
declare
  v_prof uuid := (select id from auth.users where email = 'profesor.demo@aforofit.cl');
  v_admin uuid := (select id from auth.users where email = 'admin.demo@aforofit.cl');
  v_alumno uuid := (select id from auth.users where email = 'alumno.demo@aforofit.cl');
  v_otro uuid := gen_random_uuid();
  v_sesion uuid := gen_random_uuid();
  v_otra_sesion uuid := gen_random_uuid();
  v_sesion_otro uuid := gen_random_uuid();
  v_persona uuid := (select id from public.alumnos order by id limit 1);
  v_config jsonb := (select to_jsonb(c) - 'id' - 'periodo_inicio' - 'periodo_fin' from public.configuracion c);
  v_emision date := (now() at time zone 'America/Santiago')::date;
  v_pin text := '712049';
  v_n integer;
begin
  insert into auth.users (id, email) values (v_otro, 'otro.profesor@example.invalid');
  update public.perfiles set rol = 'profesor' where id = v_otro;
  insert into auth.sessions (id, user_id) values
    (v_sesion, v_prof), (v_otra_sesion, v_prof), (v_sesion_otro, v_otro);
  insert into privado.modo_admin (profesor_id, secreto_id)
  values (v_prof, vault.create_secret(v_pin, 'qa_modo_admin_028'));

  perform pg_temp.ok('Anon y roles web no acceden al PIN o a la tabla de elevación',
    not has_function_privilege('anon', 'public.activar_modo_admin(text)', 'EXECUTE')
    and not has_function_privilege('anon', 'public.desactivar_modo_admin()', 'EXECUTE')
    and not has_function_privilege('anon', 'public.vencimiento_modo_admin()', 'EXECUTE')
    and not has_table_privilege('authenticated', 'privado.modo_admin', 'SELECT,UPDATE'));

  set local role authenticated;
  perform pg_temp.sesion(v_alumno, null);
  perform pg_temp.ok('El alumno no activa el modo ni puede consultar habilitación',
    public.activar_modo_admin(v_pin) = 'no_disponible'
    and pg_temp.error_de(format('select public.leer_habilitacion(%L)', v_persona)) = 'sin_permiso');
  perform pg_temp.sesion(v_otro, v_sesion_otro);
  perform pg_temp.ok('Un profesor distinto queda excluido aun con sesión y PIN válido',
    public.activar_modo_admin(v_pin) = 'no_disponible');

  perform pg_temp.sesion(v_prof, v_sesion);
  perform pg_temp.ok('PIN incorrecto y sin elevación inicial',
    public.activar_modo_admin('111111') = 'pin_incorrecto');
  perform pg_temp.ok('Profesor sin elevación no actualiza ninguna configuración',
    pg_temp.error_de('select public.actualizar_configuracion(20,null,3)') = 'sin_permiso'
    and pg_temp.error_de('select public.actualizar_configuracion_completa(null)') = 'sin_permiso');
  perform pg_temp.ok('Profesor sin elevación no actualiza habilitación',
    pg_temp.error_de(format('select public.registrar_habilitacion(%L, %L)', v_persona, v_emision)) = 'sin_permiso');
  perform pg_temp.ok('Profesor sin elevación no escribe catálogo ni fotos',
    pg_temp.error_de($q$insert into public.maquinas(nombre) values ('Máquina QA 028')$q$) like '%row-level security%'
    and pg_temp.error_de($q$insert into public.implementos(nombre) values ('Implemento QA 028')$q$) like '%row-level security%'
    and pg_temp.error_de($q$insert into storage.objects(bucket_id,name) values ('maquinas','qa-028.png')$q$) like '%row-level security%'
    and not exists (select from public.catalogo_implementos));

  for i in 1..3 loop
    if public.activar_modo_admin('111111') <> 'pin_incorrecto' then raise exception 'Intento % inesperado', i; end if;
  end loop;
  perform pg_temp.ok('Cinco intentos fallidos bloquean el acceso',
    public.activar_modo_admin('111111') = 'bloqueado');
  perform pg_temp.sesion(v_prof, v_otra_sesion);
  perform pg_temp.ok('El límite también rige en una segunda sesión',
    public.activar_modo_admin(v_pin) = 'bloqueado');

  reset role;
  update privado.modo_admin set bloqueado_hasta = statement_timestamp() - interval '1 second';
  set local role authenticated;
  perform pg_temp.sesion(v_prof, v_sesion);
  perform pg_temp.ok('El PIN correcto activa el modo tras el bloqueo',
    public.activar_modo_admin(v_pin) = 'activado');
  perform pg_temp.ok('La elevación vence en 30 minutos y conserva el rol profesor',
    public.vencimiento_modo_admin() > statement_timestamp() + interval '29 minutes'
    and (select rol = 'profesor' from public.perfiles where id = v_prof));

  insert into public.maquinas(nombre) values ('Máquina QA 028');
  update public.maquinas set estado = 'en_mantencion' where nombre = 'Máquina QA 028';
  delete from public.maquinas where nombre = 'Máquina QA 028';
  get diagnostics v_n = row_count;
  perform pg_temp.ok('Modo activo administra máquinas', v_n = 1);

  insert into public.implementos(nombre) values ('Implemento QA 028');
  perform pg_temp.ok('Modo activo lee inventario administrativo',
    exists (select from public.catalogo_implementos where nombre = 'Implemento QA 028'));
  update public.implementos set cantidad_total = 2 where nombre = 'Implemento QA 028';
  delete from public.implementos where nombre = 'Implemento QA 028';
  get diagnostics v_n = row_count;
  perform pg_temp.ok('Modo activo administra implementos', v_n = 1);

  insert into storage.objects(bucket_id,name) values ('maquinas','qa-028.png');
  update storage.objects set metadata = '{"size":10}' where bucket_id = 'maquinas' and name = 'qa-028.png';
  delete from storage.objects where bucket_id = 'maquinas' and name = 'qa-028.png';
  get diagnostics v_n = row_count;
  perform pg_temp.ok('Modo activo sube, lista, edita y elimina fotos', v_n = 1);

  perform pg_temp.ok('Modo activo lee y actualiza habilitación histórica',
    public.leer_habilitacion(v_persona) is not null
    and public.registrar_habilitacion(v_persona, v_emision) = (v_emision + interval '12 months')::date);
  perform pg_temp.ok('Modo activo guarda configuración en RPC completa y anterior',
    public.actualizar_configuracion_completa(v_config) ? 'capacidad');
  perform public.actualizar_configuracion((v_config ->> 'capacidad')::integer,
    v_config -> 'horario', (v_config ->> 'cierre_automatico_horas')::integer);

  perform pg_temp.sesion(v_prof, v_otra_sesion);
  perform public.desactivar_modo_admin();
  perform pg_temp.ok('Otra sesión de la cuenta no hereda el permiso',
    public.vencimiento_modo_admin() is null);
  perform pg_temp.sesion(v_prof, v_sesion);
  perform pg_temp.ok('Otra sesión no puede revocar el modo vigente',
    public.vencimiento_modo_admin() is not null);

  perform public.desactivar_modo_admin();
  perform pg_temp.ok('Desactivación revoca las operaciones administrativas',
    public.vencimiento_modo_admin() is null
    and pg_temp.error_de('select public.actualizar_configuracion_completa(null)') = 'sin_permiso');
  perform public.activar_modo_admin(v_pin);

  reset role;
  update privado.modo_admin set vence_en = statement_timestamp() - interval '1 second';
  set local role authenticated;
  perform pg_temp.ok('Vencimiento revoca las operaciones administrativas',
    public.vencimiento_modo_admin() is null
    and pg_temp.error_de(format('select public.leer_habilitacion(%L)', v_persona)) = 'sin_permiso');
  perform public.activar_modo_admin(v_pin);
  reset role;
  delete from auth.sessions where id = v_sesion;
  set local role authenticated;
  perform pg_temp.ok('El token de una sesión cerrada no conserva ni reactiva el modo',
    public.vencimiento_modo_admin() is null and public.activar_modo_admin(v_pin) = 'no_disponible');

  perform pg_temp.sesion(v_admin, null);
  perform pg_temp.ok('Admin anterior conserva sus permisos sin PIN',
    public.vencimiento_modo_admin() is null
    and public.leer_habilitacion(v_persona) is not null
    and exists (select from public.catalogo_implementos));
end;
$$;

rollback;
