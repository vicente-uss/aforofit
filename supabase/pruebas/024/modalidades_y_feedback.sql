begin;

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

do $$
declare
  v_admin uuid := (select id from auth.users where email = 'admin.demo@aforofit.cl');
  v_prof uuid := (select id from auth.users where email = 'profesor.demo@aforofit.cl');
  v_user uuid := (select id from auth.users where email = 'alumno.demo@aforofit.cl');
  v_alumno uuid := (select id from public.alumnos where perfil_id = v_user);
  v_tarjeta text := (select uid from public.tarjetas where alumno_id = v_alumno limit 1);
  v_horario jsonb := (select jsonb_object_agg(d, '{"apertura":"00:00","ultimo_ingreso":"23:59","cierre":"23:59"}'::jsonb)
    from unnest(array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']) d);
  v_on jsonb := '{"sistema":true,"profesor":true,"alumno":true}';
  v_param jsonb := jsonb_build_object('capacidad',20,'horario',v_horario,'cierre_automatico_horas',3,
    'turno_expira_minutos',10,'umbral_casi_lleno',0.8,'modalidades_rutina',v_on,
    'progresion','{"facil_kg":0.5,"justo_kg":0,"me_costo_porcentaje":-5,"redondeo_kg":5}'::jsonb);
  v_ejercicios jsonb := jsonb_build_array(jsonb_build_object(
    'ejercicio','Press QA','maquina_id',(select min(id) from public.maquinas),'series',3,'repeticiones',10,'carga_kg',40));
  v_rutinas jsonb;
  v_sistema uuid;
  v_propia uuid;
  v_asignada uuid;
  v_rutina uuid;
  v_visita uuid;
  v_vacia uuid;
  v_carga numeric;
  v_orden integer;
  v_origen text;
  v_resultado jsonb;
  v_rehabilitada uuid;
begin
  update public.alumnos set certificado_hasta = current_date + 365 where id = v_alumno;
  set local role authenticated;
  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform public.actualizar_configuracion_completa(v_param);
  perform set_config('request.jwt.claim.sub', v_user::text, true);
  v_sistema := public.elegir_objetivo_nivel('fuerza','principiante');
  v_propia := public.guardar_rutina_personalizada(v_alumno,null,'Propia 024',v_ejercicios);
  perform set_config('request.jwt.claim.sub', v_prof::text, true);
  v_asignada := public.guardar_rutina_personalizada(v_alumno,null,'Asignada 024',v_ejercicios);
  v_rutinas := jsonb_build_object('sistema',v_sistema,'profesor',v_asignada,'alumno',v_propia);

  foreach v_origen in array array['sistema','profesor','alumno'] loop
    v_rutina := (v_rutinas ->> v_origen)::uuid;
    perform set_config('request.jwt.claim.sub', v_user::text, true);
    perform public.activar_rutina(v_rutina);
    select orden, carga_kg into strict v_orden, v_carga from public.rutina_ejercicios
      where rutina_id = v_rutina and carga_kg is not null order by orden limit 1;

    perform set_config('request.jwt.claim.sub', v_prof::text, true);
    perform pg_temp.ok(v_origen || ' · ingreso con modalidad habilitada', public.registrar_ingreso(v_tarjeta)->>'resultado' = 'entrada');
    perform set_config('request.jwt.claim.sub', v_admin::text, true);
    perform public.actualizar_configuracion_completa(jsonb_set(v_param, '{modalidades_rutina}',
      jsonb_set(v_on, array[v_origen], 'false')));
    perform set_config('request.jwt.claim.sub', v_user::text, true);
    select id into strict v_visita from public.visitas where alumno_id = v_alumno and salida is null;
    perform pg_temp.ok(v_origen || ' · conserva selección, carga y rutina visible al deshabilitar',
      (select activa from public.rutinas where id = v_rutina)
      and (select rutina_id = v_rutina from public.visitas where id = v_visita)
      and (select bool_and(rutina_id = v_rutina) from public.rutina_del_dia())
      and (select carga_kg = v_carga from public.rutina_ejercicios where rutina_id = v_rutina and orden = v_orden));
    perform pg_temp.ok(v_origen || ' · rechaza activar durante la deshabilitación', pg_temp.error_de(format(
      'select public.activar_rutina(%L)',v_rutina)) = 'modalidad_deshabilitada');

    perform set_config('request.jwt.claim.sub', v_prof::text, true);
    perform public.registrar_ingreso(v_tarjeta);
    perform set_config('request.jwt.claim.sub', v_user::text, true);
    v_resultado := public.registrar_feedback_visita(v_visita, v_rutina, 'facil');
    perform pg_temp.ok(v_origen || ' · feedback de visita cerrada conserva rutina y aplica progresión solo a sistema',
      (v_resultado ->> 'cargas_ajustadas')::boolean = (v_origen = 'sistema')
      and exists (select from public.feedback where visita_id = v_visita and rutina_id = v_rutina and valor = 'facil')
      and (select carga_kg = case when v_origen = 'sistema'
        then case when round((v_carga + 0.5) / 5) * 5 > v_carga then round((v_carga + 0.5) / 5) * 5 else v_carga + 5 end
        else v_carga end from public.rutina_ejercicios where rutina_id = v_rutina and orden = v_orden));

    perform set_config('request.jwt.claim.sub', v_prof::text, true);
    perform public.registrar_ingreso(v_tarjeta);
    perform set_config('request.jwt.claim.sub', v_user::text, true);
    select id into strict v_vacia from public.visitas where alumno_id = v_alumno and salida is null;
    perform pg_temp.ok(v_origen || ' · omite selección deshabilitada en ingreso nuevo',
      (select rutina_fijada and rutina_id is null from public.visitas where id = v_vacia));

    perform set_config('request.jwt.claim.sub', v_admin::text, true);
    perform public.actualizar_configuracion_completa(v_param);
    perform set_config('request.jwt.claim.sub', v_user::text, true);
    perform pg_temp.ok(v_origen || ' · rehabilitar conserva selección sin vincularla retroactivamente',
      (select activa from public.rutinas where id = v_rutina)
      and (select rutina_id is null from public.visitas where id = v_vacia));

    if v_origen = 'sistema' then
      v_rehabilitada := public.generar_rutina(v_alumno);
    else
      perform public.activar_rutina(v_rutina);
      v_rehabilitada := v_rutina;
    end if;
    perform pg_temp.ok(v_origen || ' · se puede usar la modalidad rehabilitada durante la visita',
      (select rutina_id = v_rehabilitada from public.visitas where id = v_vacia));

    perform set_config('request.jwt.claim.sub', v_prof::text, true);
    perform public.registrar_ingreso(v_tarjeta);
  end loop;

  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform public.actualizar_configuracion_completa(jsonb_set(v_param, '{modalidades_rutina,alumno}', 'false'));
  perform set_config('request.jwt.claim.sub', v_user::text, true);
  perform public.archivar_rutina_propia(v_propia);
  perform pg_temp.ok('archiva rutina propia deshabilitada sin borrar feedback', (
    select archivada_en is not null from public.rutinas where id = v_propia
  ) and exists (select from public.feedback where rutina_id = v_propia));
end;
$$;

rollback;
