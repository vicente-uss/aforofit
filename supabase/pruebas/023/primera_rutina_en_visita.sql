-- Datos ficticios. Los cambios y el historial de la suite se revierten.
begin;

create function pg_temp.ok(p_caso text, p_ok boolean)
returns void language plpgsql as $$
begin
  if p_ok is distinct from true then raise exception 'FALLÓ: %', p_caso; end if;
  raise notice 'OK %', p_caso;
end;
$$;

create function pg_temp.error_de(p_sql text)
returns text language plpgsql as $$
begin
  execute p_sql;
  return null;
exception when others then return sqlerrm;
end;
$$;

do $$
declare
  v_uid uuid := (select id from auth.users where email = 'alumno.demo@aforofit.cl');
  v_prof uuid := (select id from auth.users where email = 'profesor.demo@aforofit.cl');
  v_alumno uuid := (select id from public.alumnos where perfil_id = v_uid);
  v_tarjeta text := (select uid from public.tarjetas where alumno_id = v_alumno and tipo = 'tne' limit 1);
  v_maquina bigint := (select min(id) from public.maquinas);
  v_ejercicios jsonb;
  v_asignada uuid;
  v_propia uuid;
  v_generada uuid;
  v_siguiente uuid;
  v_visita uuid;
  v_cerrada_sin_rutina uuid;
  v_carga numeric;
  v_carga_siguiente numeric;
  v_resultado jsonb;
begin
  if v_tarjeta is null or v_prof is null then raise exception 'Faltan datos ficticios'; end if;
  v_ejercicios := jsonb_build_array(jsonb_build_object(
    'ejercicio', 'Press QA visita abierta', 'maquina_id', v_maquina,
    'series', 3, 'repeticiones', 12, 'carga_kg', 40
  ));
  update public.rutinas set activa = false where alumno_id = v_alumno;
  update public.visitas set salida = entrada where salida is null;
  insert into public.visitas (alumno_id, entrada, salida, rutina_fijada)
    values (v_alumno, now()-interval '4 days 1 hour', now()-interval '4 days', true)
    returning id into v_cerrada_sin_rutina;
  update public.alumnos set certificado_hasta = current_date + 365 where id = v_alumno;
  update public.configuracion set capacidad = 20, horario = (
    select jsonb_object_agg(d, '{"apertura":"00:00","ultimo_ingreso":"23:59","cierre":"23:59"}'::jsonb)
    from unnest(array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']) d
  ) where id = 1;

  perform set_config('request.jwt.claim.sub', v_prof::text, true);
  set local role authenticated;
  v_resultado := public.registrar_ingreso(v_tarjeta);
  select id into strict v_visita from public.visitas where alumno_id = v_alumno and salida is null;
  perform pg_temp.ok('entrada sin rutina deja la referencia vacía',
    v_resultado->>'resultado' = 'entrada' and
    (select rutina_fijada and rutina_id is null from public.visitas where id = v_visita));
  v_asignada := public.guardar_rutina_personalizada(v_alumno, null, 'Asignada durante la visita', v_ejercicios);
  perform pg_temp.ok('asignación del profesor no elige rutina por el alumno',
    (select rutina_id is null from public.visitas where id = v_visita) and
    pg_temp.error_de(format('select public.activar_rutina(%L)', v_asignada)) = 'sin_permiso');
  reset role;
  update public.configuracion set modalidades_rutina = jsonb_set(modalidades_rutina, '{profesor}', 'false');

  perform set_config('request.jwt.claim.sub', v_uid::text, true);
  set local role authenticated;
  perform pg_temp.ok('modalidad deshabilitada no ocupa la referencia de la visita',
    pg_temp.error_de(format('select public.activar_rutina(%L)', v_asignada)) = 'modalidad_deshabilitada'
    and (select rutina_id is null from public.visitas where id = v_visita)
    and not exists (select from public.rutina_del_dia()));
  reset role;
  update public.configuracion set modalidades_rutina = jsonb_set(modalidades_rutina, '{profesor}', 'true');

  set local role authenticated;
  perform public.activar_rutina(v_asignada);
  perform pg_temp.ok('seleccionar durante la visita fija y muestra la rutina asignada',
    (select rutina_id = v_asignada from public.visitas where id = v_visita)
    and (select count(*) = 1 and bool_and(rutina_id = v_asignada) from public.rutina_del_dia()));
  v_propia := public.guardar_rutina_personalizada(v_alumno, null, 'Propia durante la visita', v_ejercicios);
  perform public.activar_rutina(v_propia);
  perform pg_temp.ok('una segunda selección solo cambia la rutina del próximo ingreso',
    (select activa from public.rutinas where id = v_propia)
    and (select rutina_id = v_asignada from public.visitas where id = v_visita)
    and (select count(*) = 1 and bool_and(rutina_id = v_asignada) from public.rutina_del_dia()));

  perform set_config('request.jwt.claim.sub', v_prof::text, true);
  v_resultado := public.registrar_ingreso(v_tarjeta);
  perform set_config('request.jwt.claim.sub', v_uid::text, true);
  v_resultado := public.registrar_feedback_visita(v_visita, v_asignada, 'me_costo');
  perform pg_temp.ok('feedback mantiene el vínculo con la rutina asignada y su carga',
    v_resultado->'cargas_ajustadas' = 'false'
    and (select carga_kg = 40 from public.rutina_ejercicios where rutina_id = v_asignada)
    and exists (select from public.feedback where visita_id = v_visita and rutina_id = v_asignada));
  reset role;

  update public.rutinas set activa = false where alumno_id = v_alumno;
  perform set_config('request.jwt.claim.sub', v_prof::text, true);
  set local role authenticated;
  v_resultado := public.registrar_ingreso(v_tarjeta);
  select id into strict v_visita from public.visitas where alumno_id = v_alumno and salida is null;
  perform pg_temp.ok('segunda entrada sin rutina espera una generación',
    v_resultado->>'resultado' = 'entrada'
    and (select rutina_id is null from public.visitas where id = v_visita));
  reset role;
  update public.configuracion set modalidades_rutina = jsonb_set(modalidades_rutina, '{sistema}', 'false');

  perform set_config('request.jwt.claim.sub', v_uid::text, true);
  set local role authenticated;
  perform pg_temp.ok('generador deshabilitado no fija una rutina durante la visita',
    pg_temp.error_de('select public.elegir_objetivo_nivel(''fuerza'',''principiante'')') = 'modalidad_deshabilitada'
    and (select rutina_id is null from public.visitas where id = v_visita));
  reset role;
  update public.configuracion set modalidades_rutina = jsonb_set(modalidades_rutina, '{sistema}', 'true');

  set local role authenticated;
  v_generada := public.elegir_objetivo_nivel('fuerza', 'principiante');
  perform pg_temp.ok('generar desde objetivo y nivel fija y muestra la rutina en la visita abierta',
    (select rutina_id = v_generada from public.visitas where id = v_visita)
    and (select count(*) > 0 and bool_and(rutina_id = v_generada) from public.rutina_del_dia()));
  v_siguiente := public.generar_rutina(v_alumno);
  perform pg_temp.ok('regenerar conserva la primera versión fijada y deja activa la siguiente',
    (select activa from public.rutinas where id = v_siguiente)
    and (select rutina_id = v_generada from public.visitas where id = v_visita));

  select carga_kg into v_carga from public.rutina_ejercicios where rutina_id = v_generada and orden = 2;
  select carga_kg into v_carga_siguiente from public.rutina_ejercicios where rutina_id = v_siguiente and orden = 2;
  perform set_config('request.jwt.claim.sub', v_prof::text, true);
  v_resultado := public.registrar_ingreso(v_tarjeta);
  perform set_config('request.jwt.claim.sub', v_uid::text, true);
  v_resultado := public.registrar_feedback_visita(v_visita, v_generada, 'me_costo');
  perform pg_temp.ok('feedback progresa la rutina generada que se usó y conserva la siguiente',
    v_resultado->'cargas_ajustadas' = 'true'
    and (select carga_kg < v_carga from public.rutina_ejercicios where rutina_id = v_generada and orden = 2)
    and (select carga_kg = v_carga_siguiente from public.rutina_ejercicios where rutina_id = v_siguiente and orden = 2));
  perform pg_temp.ok('primera selección y generación conservan las visitas ya cerradas',
    (select rutina_id is null from public.visitas where id = v_cerrada_sin_rutina)
    and (select salida is not null and rutina_id = v_generada from public.visitas where id = v_visita));
  reset role;
  perform pg_temp.ok('asociación interna sin acceso de roles web',
    not has_function_privilege('anon', 'privado.asociar_primera_rutina_visita(uuid,uuid)', 'EXECUTE')
    and not has_function_privilege('authenticated', 'privado.asociar_primera_rutina_visita(uuid,uuid)', 'EXECUTE'));
end;
$$;

rollback;
