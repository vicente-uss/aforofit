begin;
set local storage.allow_delete_query = 'true';

create function pg_temp.ok(caso text, valor boolean) returns void language plpgsql as $$
begin
  if valor is distinct from true then raise exception 'FALLÓ: %', caso; end if;
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
  v_admin uuid := (select id from public.perfiles where rol = 'admin' limit 1);
  v_prof uuid := (select id from public.perfiles where rol = 'profesor' limit 1);
  v_hoy date := (now() at time zone 'America/Santiago')::date;
  v_ahora timestamptz := (v_hoy + time '10:00') at time zone 'America/Santiago';
  v_historico uuid;
  v_pendiente uuid;
  v_documentado uuid;
  v_atleta uuid;
  v_otra_carga text := v_prof || '/00000000-0000-0000-0000-000000000273';
  v_archivo text := v_prof || '/00000000-0000-0000-0000-000000000271';
  v_reemplazo text := v_prof || '/00000000-0000-0000-0000-000000000272';
  v_ficha jsonb;
  v_pend jsonb;
  v_doc jsonb;
  v_exento jsonb;
  v_previa jsonb;
  v_base jsonb := '{"nombre":"Persona QA 027","rut":"1000000-9","correo":"qa@uss.cl",
    "nacimiento":"2000-01-01","telefono":"+56912345678","contacto_emergencia":"QA",
    "telefono_emergencia":"+56987654321","tipo_persona":"funcionario_colaborador"}';
  v_n integer;
begin
  update public.configuracion set capacidad = 20, horario = (
    select jsonb_object_agg(d, '{"apertura":"00:00","ultimo_ingreso":"23:59","cierre":"23:59"}'::jsonb)
    from unnest(array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']) d
  );
  update public.visitas set salida = entrada where salida is null;
  insert into public.alumnos(nombre,rut,certificado_emision,certificado_hasta)
  values ('Histórico QA 027', '1000010-6', (v_hoy - interval '12 months')::date, v_hoy)
  returning id into v_historico;
  insert into storage.objects(bucket_id,name,metadata) values
    ('certificados',v_archivo,'{"size":12,"mimetype":"application/pdf"}'),
    ('certificados',v_reemplazo,'{"size":14,"mimetype":"application/pdf"}'),
    ('certificados',v_otra_carga,'{"size":16,"mimetype":"application/pdf"}');

  set local role authenticated;
  perform set_config('request.jwt.claim.sub', v_prof::text, true);
  v_previa := public.guardar_inscripcion(v_historico, v_base || '{"rut":"1000010-6","nombre":"Histórico QA 027"}');
  v_ficha := public.guardar_inscripcion(null, v_base);
  v_pendiente := (v_ficha->>'id')::uuid;
  v_ficha := public.guardar_inscripcion(null, v_base || jsonb_build_object(
    'rut','1000002-5','medico',v_archivo,'certificado_emision',(v_hoy - interval '13 months')::date));
  v_documentado := (v_ficha->>'id')::uuid;
  v_ficha := public.guardar_inscripcion(null, v_base || '{"rut":"1000003-3","tipo_persona":"deportista_destacado"}');
  v_atleta := (v_ficha->>'id')::uuid;
  perform pg_temp.ok('Histórico incorporado a ficha conserva vigencia hasta el último día incluido',
    (v_previa->>'certificado_hasta')::date = v_hoy and v_previa->>'estado_certificado' = 'vigente');
  perform pg_temp.ok('Profesor no consulta la RPC administrativa',
    pg_temp.error_de(format('select public.leer_habilitacion(%L)',v_pendiente)) = 'sin_permiso');

  reset role;
  -- Simula fechas escritas por 015 antes de la corrección en una ficha sin archivo.
  update public.alumnos set certificado_emision = v_hoy, certificado_hasta = v_hoy + 365 where id = v_pendiente;
  perform pg_temp.ok('Último día incluido y el siguiente vencido en el criterio de acceso', (
    select (select estado from privado.vigencia_certificado(a, v_hoy)) = 'vigente'
      and (select estado from privado.vigencia_certificado(a, v_hoy + 1)) = 'vencido'
    from public.alumnos a where a.id = v_historico));

  set local role authenticated;
  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  v_pend := public.leer_habilitacion(v_pendiente);
  v_doc := public.leer_habilitacion(v_documentado);
  v_exento := public.leer_habilitacion(v_atleta);
  perform pg_temp.ok('Admin oculta fechas obsoletas para inscripción pendiente',
    v_pend @> '{"estado_certificado":"pendiente","certificado_emision":null,"certificado_hasta":null,"editable_admin":false}');
  perform pg_temp.ok('Admin informa exención sin fechas y vencimiento del adjunto sin datos sensibles',
    v_exento @> '{"estado_certificado":"exento","certificado_hasta":null,"editable_admin":false}'
    and v_doc @> '{"estado_certificado":"vencido","editable_admin":false}'
    and not (v_doc ?| array['medico','antecedentes','correo']));
  perform pg_temp.ok('RPC histórica impide alterar vigencias de fichas nuevas con o sin adjunto',
    pg_temp.error_de(format('select public.registrar_habilitacion(%L,%L)', v_pendiente,v_hoy)) = 'certificado_gestionado_en_inscripcion'
    and pg_temp.error_de(format('select public.registrar_habilitacion(%L,%L)', v_documentado,v_hoy)) = 'certificado_gestionado_en_inscripcion');
  perform pg_temp.ok('RPC histórica rechaza registrar un certificado para la exención',
    pg_temp.error_de(format('select public.registrar_habilitacion(%L,%L)', v_atleta,v_hoy)) = 'certificado_exento');
  perform pg_temp.ok('Solo registros históricos tienen fecha editable',
    public.leer_habilitacion(v_historico) @> '{"estado_certificado":"vigente","editable_admin":true}');
  perform public.registrar_habilitacion(v_historico,v_hoy);
  perform pg_temp.ok('Admin guarda el registro histórico con intervalo de 12 meses',
    (public.leer_habilitacion(v_historico)->>'certificado_hasta')::date = (v_hoy + interval '12 months')::date);
  perform pg_temp.ok('Admin no puede listar ni descartar archivos',
    pg_temp.error_de('select public.certificados_pendientes_de_retiro()') = 'sin_permiso'
    and pg_temp.error_de('select public.descartar_cargas_certificados(array[]::text[])') = 'sin_permiso');

  perform set_config('request.jwt.claim.sub', v_prof::text, true);
  v_ficha := public.leer_inscripcion(v_historico);
  perform pg_temp.ok('Inscripción refleja la fecha de admin y rechaza ediciones obsoletas',
    (v_ficha->>'certificado_emision')::date = v_hoy
    and pg_temp.error_de(format('select public.guardar_inscripcion(%L,%L)',v_historico,v_previa)) = 'ficha_desactualizada');
  perform pg_temp.ok('Inscripción confirma los mismos estados que Administración',
    public.leer_inscripcion(v_pendiente) @> (v_pend - 'editable_admin')
    and public.leer_inscripcion(v_documentado) @> (v_doc - 'editable_admin')
    and public.leer_inscripcion(v_atleta) @> (v_exento - 'editable_admin'));

  reset role;
  perform pg_temp.ok('Acceso ordinario por persona: histórico vigente y deportista exento',
    privado.registrar_acceso_persona(v_historico,null,v_ahora,null)->>'resultado' = 'entrada'
    and privado.registrar_acceso_persona(v_atleta,null,v_ahora,null)->>'resultado' = 'entrada');
  perform pg_temp.ok('Acceso rechaza pendiente y vencido con el mismo estado que las otras pantallas',
    privado.registrar_acceso_persona(v_pendiente,null,v_ahora,null)->>'estado_certificado' = v_pend->>'estado_certificado'
    and privado.registrar_acceso_persona(v_documentado,null,v_ahora,null)->>'estado_certificado' = v_doc->>'estado_certificado');
  perform pg_temp.ok('Excepción conserva el alcance y no habilita el certificado',
    privado.registrar_acceso_persona(v_pendiente,null,v_ahora,v_prof)->>'resultado' = 'entrada');
  perform privado.registrar_acceso_persona(v_pendiente,null,v_ahora + interval '1 minute',null);
  perform pg_temp.ok('Visita posterior vuelve a requerir documento o autorización',
    privado.registrar_acceso_persona(v_pendiente,null,v_ahora + interval '2 minutes',null)->>'estado_certificado' = 'pendiente');

  set local role authenticated;
  perform set_config('request.jwt.claim.sub', v_prof::text,true);
  v_ficha := public.leer_inscripcion(v_documentado);
  perform public.descartar_cargas_certificados(array[v_archivo,v_otra_carga]);
  perform pg_temp.ok('Descartar cargas ignora el archivo asociado y encola solo el propio sin ficha',
    (select array_agg(r) = array[v_otra_carga] from public.certificados_pendientes_de_retiro() r));
  perform pg_temp.ok('La ruta descartada no puede volver a asociarse mientras persistan sus bytes',
    pg_temp.error_de(format('select public.guardar_inscripcion(%L,%L)',v_documentado,
      v_ficha || jsonb_build_object('medico',v_otra_carga,'certificado_emision',v_hoy))) = 'archivo_invalido');
  v_ficha := public.guardar_inscripcion(v_documentado,
    v_ficha || jsonb_build_object('medico',v_reemplazo,'certificado_emision',v_hoy));
  perform pg_temp.ok('Solo el archivo anterior se encola al reemplazar y la ficha cambia a vigente',
    exists (select from public.certificados_pendientes_de_retiro() r where r = v_archivo)
    and not exists (select from public.certificados_pendientes_de_retiro() r where r = v_reemplazo)
    and v_ficha->>'estado_certificado' = 'vigente');
  delete from storage.objects where bucket_id = 'certificados' and name in (v_archivo,v_reemplazo);
  get diagnostics v_n = row_count;
  perform pg_temp.ok('Política de Storage protege el archivo vigente y permite retirar el reemplazado',
    v_n = 1 and exists (select from storage.objects where name = v_reemplazo)
    and not exists (select from public.certificados_pendientes_de_retiro() r where r = v_archivo));
  reset role;
  perform pg_temp.ok('El reemplazo válido se admite en la siguiente visita',
    privado.registrar_acceso_persona(v_documentado,null,v_ahora+interval '3 minutes',null)->>'resultado' = 'entrada');
end;
$$;
rollback;
