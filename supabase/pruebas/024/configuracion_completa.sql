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
  v_param jsonb;
  v_bad record;
  v_admin uuid := (select id from public.perfiles where rol = 'admin' limit 1);
  v_prof uuid := (select id from public.perfiles where rol = 'profesor' limit 1);
  v_user uuid := (select id from public.perfiles where rol = 'alumno' limit 1);
  v_res jsonb;
  v_carga jsonb := '{"facil_kg":0.5,"justo_kg":0,"me_costo_porcentaje":-5,"redondeo_kg":5}';
begin
  select to_jsonb(c) - 'id' - 'periodo_academico' into v_param from public.configuracion c;
  -- El contrato acepta exclusivamente estas siete claves.
  select jsonb_object_agg(k, v_param -> k) into v_param from unnest(array[
    'capacidad','horario','cierre_automatico_horas','umbral_casi_lleno','turno_expira_minutos','modalidades_rutina','progresion'
  ]) k;
  perform pg_temp.ok('sin EXECUTE para anon ni service_role',
    not has_function_privilege('anon','public.actualizar_configuracion_completa(jsonb)','EXECUTE')
    and not has_function_privilege('service_role','public.actualizar_configuracion_completa(jsonb)','EXECUTE'));
  set local role authenticated;
  perform set_config('request.jwt.claim.sub', v_user::text, true);
  perform pg_temp.ok('alumno sin permiso', pg_temp.error_de(format(
    'select public.actualizar_configuracion_completa(%L)', v_param)) = 'sin_permiso');
  perform set_config('request.jwt.claim.sub', v_prof::text, true);
  perform pg_temp.ok('profesor sin permiso', pg_temp.error_de(format(
    'select public.actualizar_configuracion_completa(%L)', v_param)) = 'sin_permiso');
  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform pg_temp.ok('administrador sin UPDATE directo',
    not has_table_privilege(current_user,'public.configuracion','UPDATE'));

  for v_bad in select * from (values
    ('capacidad', '100.1', 'capacidad_invalida'),
    ('capacidad', '"20"', 'parametros_invalidos'),
    ('cierre_automatico_horas', '13', 'cierre_invalido'),
    ('umbral_casi_lleno', '0', 'umbral_invalido'),
    ('umbral_casi_lleno', '0.555', 'umbral_invalido'),
    ('turno_expira_minutos', '120.1', 'expiracion_invalida'),
    ('turno_expira_minutos', '-1', 'expiracion_invalida'),
    ('turno_expira_minutos', '1e200', 'expiracion_invalida'),
    ('modalidades_rutina', '{"sistema":true,"profesor":true,"alumno":"true"}', 'modalidades_invalidas'),
    ('modalidades_rutina', '{"sistema":true,"profesor":true}', 'modalidades_invalidas'),
    ('modalidades_rutina', '["sistema","profesor","alumno"]', 'modalidades_invalidas'),
    ('modalidades_rutina', '{"sistema":true,"profesor":true,"alumno":true,"otra":false}', 'modalidades_invalidas'),
    ('progresion', '{"facil_kg":0.01,"justo_kg":0,"me_costo_porcentaje":-5,"redondeo_kg":1}', 'progresion_invalida'),
    ('progresion', '{"facil_kg":2,"justo_kg":3,"me_costo_porcentaje":-5,"redondeo_kg":1}', 'progresion_invalida'),
    ('progresion', '{"facil_kg":2,"justo_kg":0,"me_costo_porcentaje":5,"redondeo_kg":1}', 'progresion_invalida'),
    ('progresion', '{"facil_kg":2,"justo_kg":0,"me_costo_porcentaje":-5,"redondeo_kg":0}', 'progresion_invalida'),
    ('progresion', '{"facil_kg":2,"justo_kg":0,"me_costo_porcentaje":-5,"redondeo_kg":"NaN"}', 'progresion_invalida'),
    ('horario', '[]', 'horario_invalido'),
    ('id', '2', 'parametros_invalidos')
  ) as invalido(clave, valor, error) loop
    perform pg_temp.ok('solicitud manipulada ' || v_bad.clave || ' = ' || v_bad.valor, pg_temp.error_de(format(
      'select public.actualizar_configuracion_completa(%L)', v_param || jsonb_build_object(v_bad.clave, v_bad.valor::jsonb)
    )) = v_bad.error);
  end loop;
  perform pg_temp.ok('rechazos conservan valores', (select capacidad from public.configuracion) = (v_param ->> 'capacidad')::int);
  v_param := v_param || jsonb_build_object('capacidad', 18, 'umbral_casi_lleno', 0.57, 'turno_expira_minutos', 2,
    'progresion', v_carga, 'modalidades_rutina', '{"sistema":false,"profesor":true,"alumno":true}'::jsonb);
  v_res := public.actualizar_configuracion_completa(v_param);
  perform pg_temp.ok('persiste toda la configuración y sincroniza el aforo',
    (select to_jsonb(c) @> v_param from public.configuracion c)
    and (select capacidad = 18 and umbral_casi_lleno = 0.57 from public.aforo)
    and v_res -> 'capacidad' = '18');
  perform pg_temp.ok('sistema se deshabilita de forma independiente',
    public.modalidades_de_rutina() = v_param -> 'modalidades_rutina');
  reset role;

  perform pg_temp.ok('Fácil sube un paso si el incremento se pierde', privado.nueva_carga(40, 'facil', v_carga) = 45);
  perform pg_temp.ok('Justo en cero conserva incluso cargas fuera del múltiplo', privado.nueva_carga(41, 'justo', v_carga) = 41);
  perform pg_temp.ok('reducción y redondeo en el siguiente cálculo', privado.nueva_carga(40, 'me_costo', v_carga) = 35);
  perform pg_temp.ok('límite de almacenamiento en el incremento', privado.nueva_carga(9999, 'facil', v_carga) = 9999.9);
end;
$$;

rollback;
