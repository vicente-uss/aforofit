-- Datos ficticios. La suite se revierte completa.
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
  v_admin uuid := (select id from auth.users where email = 'admin.demo@aforofit.cl');
  v_alumno uuid := (select id from public.alumnos where perfil_id = v_uid);
  v_otro uuid := (select id from public.alumnos where rut = '00.000.002-F');
  v_uid_tarjeta text := (select uid from public.tarjetas where alumno_id = v_alumno limit 1);
  v_maquina bigint := (select min(id) from public.maquinas);
  v_ejercicios jsonb;
  v_propia uuid;
  v_nueva uuid;
  v_asignada uuid;
  v_editada uuid;
  v_sistema uuid;
  v_visita uuid;
  v_resultado jsonb;
  v_codigo text;
begin
  if v_uid_tarjeta is null or v_admin is null or v_prof is null then raise exception 'Faltan las cuentas de prueba'; end if;
  v_ejercicios := jsonb_build_array(
    jsonb_build_object('ejercicio', 'Press QA', 'maquina_id', v_maquina, 'series', 3, 'repeticiones', 12, 'carga_kg', 40, 'nota_ajuste', 'Altura 2'),
    jsonb_build_object('ejercicio', 'Bicicleta QA', 'maquina_id', v_maquina, 'series', 2, 'minutos', 8)
  );
  update public.visitas set salida = entrada where salida is null;
  update public.alumnos set certificado_hasta = current_date + 365 where id = v_alumno;
  update public.configuracion set capacidad = 20, horario = (
    select jsonb_object_agg(d, '{"apertura":"00:00","ultimo_ingreso":"23:59","cierre":"23:59"}'::jsonb)
    from unnest(array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']) d
  ) where id = 1;

  perform set_config('request.jwt.claim.sub', v_uid::text, true);
  set local role authenticated;
  v_propia := public.guardar_rutina_personalizada(v_alumno, null, ' Propia QA ', v_ejercicios);
  perform pg_temp.ok('CA38 nombre, autor, origen y creación inactiva',
    (select nombre = 'Propia QA' and origen = 'alumno' and autor_id = v_uid and not activa from public.rutinas where id = v_propia));
  perform pg_temp.ok('CA38 orden, fuerza, cardio y ajuste', (
    select array_agg(ejercicio order by orden) = array['Press QA','Bicicleta QA']
      and bool_or(minutos = 8) and bool_or(carga_kg = 40 and nota_ajuste = 'Altura 2')
    from public.rutina_ejercicios where rutina_id = v_propia
  ));
  perform pg_temp.ok('alumno no puede crear para otro', pg_temp.error_de(format(
    'select public.guardar_rutina_personalizada(%L,null,%L,%L)', v_otro, 'Ajena', v_ejercicios
  )) = 'sin_permiso');
  perform pg_temp.ok('escritura directa denegada', not has_table_privilege(current_user, 'public.rutinas', 'UPDATE')
    and not has_table_privilege(current_user, 'public.rutina_ejercicios', 'DELETE'));
  perform pg_temp.ok('ejercicios vacíos rechazados', pg_temp.error_de(format(
    'select public.guardar_rutina_personalizada(%L,%L,%L,%L)', v_alumno, v_propia, 'Inválida', '[]'
  )) = 'rutina_invalida');
  perform pg_temp.ok('máquina inexistente no archiva la versión vigente', pg_temp.error_de(format(
    'select public.guardar_rutina_personalizada(%L,%L,%L,%L)', v_alumno, v_propia, 'Inválida',
    jsonb_set(v_ejercicios, '{0,maquina_id}', '0')
  )) = 'ejercicios_invalidos' and (select archivada_en is null from public.rutinas where id = v_propia));
  perform public.activar_rutina(v_propia);
  perform pg_temp.ok('CA16 selecciona la rutina propia', (select activa from public.rutinas where id = v_propia));

  perform set_config('request.jwt.claim.sub', v_prof::text, true);
  perform pg_temp.ok('profesor no puede editar una rutina de alumno', pg_temp.error_de(format(
    'select public.guardar_rutina_personalizada(%L,%L,%L,%L)', v_alumno, v_propia, 'Ajena', v_ejercicios
  )) = 'sin_permiso');
  v_asignada := public.guardar_rutina_personalizada(v_alumno, null, 'Asignada QA', v_ejercicios);
  v_editada := public.guardar_rutina_personalizada(v_alumno, v_asignada, 'Asignada actualizada', v_ejercicios);
  perform pg_temp.ok('CA38 profesor edita su modalidad y asigna sin activar',
    (select autor_id = v_prof and origen = 'profesor' and alumno_id = v_alumno and not activa from public.rutinas where id = v_editada)
    and (select archivada_en is not null from public.rutinas where id = v_asignada));
  perform pg_temp.ok('profesor no activa por el alumno', pg_temp.error_de(format('select public.activar_rutina(%L)', v_editada)) = 'sin_permiso');
  perform public.cambiar_estado_maquina(v_maquina, 'en_mantencion');
  v_resultado := public.registrar_ingreso(v_uid_tarjeta);
  perform pg_temp.ok('ingreso por credencial', v_resultado->>'resultado' = 'entrada');
  reset role;

  perform set_config('request.jwt.claim.sub', v_uid::text, true);
  set local role authenticated;
  select id into strict v_visita from public.visitas where alumno_id = v_alumno and salida is null;
  perform pg_temp.ok('CA16 y CA13 visita conserva rutina activa y mantención',
    (select rutina_id = v_propia from public.visitas where id = v_visita)
    and (select count(*) = 2 and bool_and(rutina_id = v_propia and en_mantencion) from public.rutina_del_dia()));
  perform pg_temp.ok('visita abierta no permite feedback', pg_temp.error_de(format(
    'select public.registrar_feedback_visita(%L,%L,%L)', v_visita, v_propia, 'justo'
  )) = 'visita_abierta');
  v_nueva := public.guardar_rutina_personalizada(v_alumno, v_propia, 'Propia actualizada', jsonb_set(v_ejercicios, '{0,carga_kg}', '55'));
  perform pg_temp.ok('CA38 edición activa conserva los ejercicios históricos',
    (select activa and nombre = 'Propia actualizada' from public.rutinas where id = v_nueva)
    and (select not activa and archivada_en is not null from public.rutinas where id = v_propia)
    and (select carga_kg = 40 from public.rutina_ejercicios where rutina_id = v_propia and orden = 1));
  perform pg_temp.ok('edición concurrente obsoleta no pisa la revisión actual', pg_temp.error_de(format(
    'select public.guardar_rutina_personalizada(%L,%L,%L,%L)', v_alumno, v_propia, 'Obsoleta', v_ejercicios
  )) = 'rutina_modificada');
  perform pg_temp.ok('CA38 el alumno ve la asignación', (select nombre = 'Asignada actualizada' from public.rutinas where id = v_editada));
  perform public.activar_rutina(v_editada);
  perform public.archivar_rutina_propia(v_nueva);
  perform pg_temp.ok('eliminación archiva sin borrar ejercicios', (select archivada_en is not null from public.rutinas where id = v_nueva)
    and exists (select from public.rutina_ejercicios where rutina_id = v_nueva));
  perform pg_temp.ok('no puede activar un archivo ni archivar una asignación',
    pg_temp.error_de(format('select public.activar_rutina(%L)', v_nueva)) = 'sin_permiso'
    and pg_temp.error_de(format('select public.archivar_rutina_propia(%L)', v_editada)) = 'sin_permiso');

  perform set_config('request.jwt.claim.sub', v_prof::text, true);
  perform pg_temp.ok('salida por credencial', public.registrar_ingreso(v_uid_tarjeta)->>'resultado' = 'salida');
  perform set_config('request.jwt.claim.sub', v_uid::text, true);
  perform pg_temp.ok('la asignación activa no reemplaza la rutina usada para feedback',
    (select bool_and(rutina_id = v_propia) from public.rutina_del_dia()) and pg_temp.error_de(format(
      'select public.registrar_feedback_visita(%L,%L,%L)', v_visita, v_editada, 'justo'
    )) = 'rutina_inactiva');
  v_resultado := public.registrar_feedback_visita(v_visita, v_propia, 'me_costo');
  perform pg_temp.ok('feedback alumno no cambia cargas y apunta a la versión de ingreso',
    v_resultado->'cargas_ajustadas' = 'false'
    and exists (select from public.feedback where visita_id = v_visita and rutina_id = v_propia)
    and (select carga_kg = 40 from public.rutina_ejercicios where rutina_id = v_propia and orden = 1));

  v_codigo := public.generar_codigo_ingreso()->>'codigo';
  perform set_config('request.jwt.claim.sub', v_prof::text, true);
  perform pg_temp.ok('QR acepta el código real generado en el celular', public.registrar_ingreso_codigo(v_codigo)->>'resultado' = 'entrada');
  perform pg_temp.ok('QR fija la rutina asignada', (
    select rutina_id = v_editada from public.visitas where alumno_id = v_alumno and salida is null
  ));
  perform pg_temp.ok('QR de entrada es de un solo uso', pg_temp.error_de(format('select public.registrar_ingreso_codigo(%L)', v_codigo)) = 'codigo_invalido');
  perform set_config('request.jwt.claim.sub', v_uid::text, true);
  v_codigo := public.generar_codigo_ingreso()->>'codigo';
  perform set_config('request.jwt.claim.sub', v_prof::text, true);
  perform pg_temp.ok('salida por un QR nuevo', public.registrar_ingreso_codigo(v_codigo)->>'resultado' = 'salida');
  perform set_config('request.jwt.claim.sub', v_uid::text, true);
  select id into v_visita from public.visitas where alumno_id = v_alumno order by entrada desc, id desc limit 1;
  v_resultado := public.registrar_feedback_visita(v_visita, v_editada, 'me_costo');
  perform pg_temp.ok('CA15 feedback profesor registrado y cargas sin cambio',
    v_resultado->'cargas_ajustadas' = 'false'
    and (select carga_kg = 40 from public.rutina_ejercicios where rutina_id = v_editada and orden = 1)
    and exists (select from public.feedback where visita_id = v_visita and rutina_id = v_editada and valor = 'me_costo'));
  v_sistema := public.elegir_objetivo_nivel('fuerza','principiante');
  perform pg_temp.ok('tres orígenes y una sola selección', (select count(distinct origen) = 3 and count(*) filter (where activa) = 1
    from public.rutinas where alumno_id = v_alumno));
  perform public.activar_rutina(v_editada);
  perform public.activar_rutina(v_sistema);
  perform pg_temp.ok('el alumno puede volver a seleccionar la generada', (select activa from public.rutinas where id = v_sistema));
  reset role;

  update public.configuracion set modalidades_rutina = '{"sistema":false,"profesor":false,"alumno":false}';
  set local role authenticated;
  perform pg_temp.ok('tres modalidades deshabilitadas por configuración',
    public.modalidades_de_rutina() = '{"sistema":false,"profesor":false,"alumno":false}');
  perform pg_temp.ok('SQL bloquea la generación y la selección deshabilitadas',
    pg_temp.error_de(format('select public.generar_rutina(%L)', v_alumno)) = 'modalidad_deshabilitada'
    and pg_temp.error_de(format('select public.activar_rutina(%L)', v_sistema)) = 'modalidad_deshabilitada'
    and pg_temp.error_de(format('select public.activar_rutina(%L)', v_editada)) = 'modalidad_deshabilitada');
  perform pg_temp.ok('SQL bloquea cambios de objetivo y generación con sistema deshabilitado',
    pg_temp.error_de('select public.elegir_objetivo_nivel(''salud'',''intermedio'')') = 'modalidad_deshabilitada'
    and (select objetivo = 'fuerza' from public.alumnos where id = v_alumno));
  perform pg_temp.ok('SQL bloquea creación propia con modalidad deshabilitada', pg_temp.error_de(format(
    'select public.guardar_rutina_personalizada(%L,null,%L,%L)', v_alumno, 'Nueva', v_ejercicios
  )) = 'modalidad_deshabilitada');
  perform set_config('request.jwt.claim.sub', v_prof::text, true);
  perform pg_temp.ok('SQL bloquea editar asignada con modalidad deshabilitada', pg_temp.error_de(format(
    'select public.guardar_rutina_personalizada(%L,%L,%L,%L)', v_alumno, v_editada, 'Nueva', v_ejercicios
  )) = 'modalidad_deshabilitada');
  v_resultado := public.registrar_ingreso(v_uid_tarjeta);
  perform pg_temp.ok('el ingreso sigue independiente de las modalidades',
    v_resultado->>'resultado' = 'entrada'
    and exists (select from public.visitas where alumno_id = v_alumno and salida is null and rutina_fijada and rutina_id is null));
  perform set_config('request.jwt.claim.sub', v_uid::text, true);
  perform pg_temp.ok('rutina deshabilitada no aparece al ingresar', not exists (select from public.rutina_del_dia()));
  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform pg_temp.ok('admin no asigna rutinas como profesor', pg_temp.error_de(format(
    'select public.guardar_rutina_personalizada(%L,null,%L,%L)', v_alumno, 'Ajena', v_ejercicios
  )) = 'sin_permiso');
  reset role;
  perform pg_temp.ok('anónimo sin acceso a mutaciones ni modalidades',
    not has_function_privilege('anon', 'public.activar_rutina(uuid)', 'EXECUTE')
    and not has_function_privilege('anon', 'public.modalidades_de_rutina()', 'EXECUTE')
    and not has_function_privilege('anon', 'public.guardar_rutina_personalizada(uuid,uuid,text,jsonb)', 'EXECUTE'));

  begin
    update public.visitas set rutina_id = v_propia where alumno_id = v_otro;
    insert into public.visitas (alumno_id, entrada, salida, rutina_id)
      values (v_otro, now() - interval '1 hour', now(), v_propia);
    raise exception 'Debe fallar la asignación cruzada';
  exception when foreign_key_violation then
    raise notice 'OK FK impide relacionar visita y rutina de alumnos distintos';
  end;
end;
$$;

rollback;
