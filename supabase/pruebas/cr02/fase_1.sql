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

do $$
declare
  v_prof uuid := (select id from public.perfiles where rol = 'profesor' limit 1);
  v_admin uuid := (select id from public.perfiles where rol = 'admin' limit 1);
  v_alumno uuid := (select id from public.perfiles where rol = 'alumno' limit 1);
  v_atleta uuid;
  v_persona uuid;
  v_estudiante uuid;
  v_ruta text := v_prof || '/10000000-0000-0000-0000-000000000025';
  v_regular text := v_prof || '/10000000-0000-0000-0000-000000000026';
  v_grande text := v_prof || '/10000000-0000-0000-0000-000000000027';
  v_base jsonb := '{
    "nombre":"Persona ficticia CR-02","rut":"1000000-9","correo":"DEMO@CORREO.USS.CL",
    "nacimiento":"2000-02-29","telefono":"+56912345678","contacto_emergencia":"Contacto ficticio",
    "telefono_emergencia":"+56987654321","antecedentes":"Observación ficticia","tipo_persona":"estudiante",
    "carrera":"Informática"}';
  v_res jsonb;
  v_n integer;
  v_turno integer;
  v_ahora timestamptz := '2026-11-27 10:00:00 America/Santiago';
begin
  perform pg_temp.ok('Bucket privado, 10 MiB y tipos de archivo acotados', (
    select not public and file_size_limit = 10485760 and cardinality(allowed_mime_types) = 3
    from storage.buckets where id = 'certificados'));
  perform pg_temp.ok('Anon no ejecuta RPC nuevas',
    not has_function_privilege('anon', 'public.leer_inscripcion(uuid)', 'EXECUTE')
    and not has_function_privilege('anon', 'public.guardar_inscripcion(uuid,jsonb)', 'EXECUTE')
    and not has_function_privilege('anon', 'public.registrar_ingreso_rut(text)', 'EXECUTE')
    and not has_function_privilege('anon', 'public.autorizar_acceso_excepcional(uuid)', 'EXECUTE'));
  perform pg_temp.ok('RUT valida K y cero y rechaza dígito inválido, puntos y ceros a la izquierda',
    privado.rut_valido('1000005-K') and privado.rut_valido('14-0')
    and not privado.rut_valido('1000000-1') and not privado.rut_valido('1.000.000-9')
    and not privado.rut_valido('01000000-9'));

  -- Storage entrega estos metadatos. Chromium comprueba además los bytes por la API.
  insert into storage.objects(bucket_id, name, metadata) values
    ('certificados', v_grande, '{"size":10485761,"mimetype":"application/pdf"}');

  set local role authenticated;
  perform set_config('request.jwt.claim.sub', v_prof::text, true);
  insert into storage.objects(bucket_id, name, metadata) values
    ('certificados', v_ruta, '{"size":10485760,"mimetype":"application/pdf"}'),
    ('certificados', v_regular, '{"size":12,"mimetype":"image/png"}');
  perform pg_temp.ok('Profesor puede cargar y leer sus archivos', (
    select count(*) = 2 from storage.objects where name in (v_ruta, v_regular)));
  perform pg_temp.ok('Una carga solo se admite en la carpeta del profesor',
    pg_temp.error_de(format(
      'insert into storage.objects(bucket_id,name) values (''certificados'',%L)',
      v_admin || '/10000000-0000-0000-0000-000000000028')) like '%row-level security%');
  perform pg_temp.ok('Rechaza correo externo y dominio que solo imita a USS',
    pg_temp.error_de(format('select public.guardar_inscripcion(null,%L)',
      v_base || '{"correo":"demo@uss.cl.example.invalid"}')) = 'correo_invalido');
  perform pg_temp.ok('Rechaza carrera vacía de estudiante',
    pg_temp.error_de(format('select public.guardar_inscripcion(null,%L)',
      v_base || '{"carrera":" "}')) = 'carrera_requerida');
  perform pg_temp.ok('Rechaza tipo de persona fuera del alcance',
    pg_temp.error_de(format('select public.guardar_inscripcion(null,%L)',
      v_base || '{"tipo_persona":"invitado"}')) = 'tipo_invalido');
  perform pg_temp.ok('Rechaza fecha de nacimiento futura',
    pg_temp.error_de(format('select public.guardar_inscripcion(null,%L)',
      v_base || '{"nacimiento":"2999-01-01"}')) = 'nacimiento_invalido');
  perform pg_temp.ok('Rechaza teléfono incompleto',
    pg_temp.error_de(format('select public.guardar_inscripcion(null,%L)',
      v_base || '{"telefono_emergencia":"+5697"}')) = 'telefono_invalido');
  perform pg_temp.ok('Rechaza archivo inexistente',
    pg_temp.error_de(format('select public.guardar_inscripcion(null,%L)',
      v_base || '{"medico":"no-existe"}')) = 'archivo_invalido');
  perform pg_temp.ok('Rechaza certificado superior al límite del bucket',
    pg_temp.error_de(format('select public.guardar_inscripcion(null,%L)',
      v_base || jsonb_build_object('medico', v_grande))) = 'archivo_invalido');
  perform pg_temp.ok('Rechaza emisión futura incluso con archivo',
    pg_temp.error_de(format('select public.guardar_inscripcion(null,%L)',
      v_base || jsonb_build_object('medico', v_ruta, 'certificado_emision', '2999-01-01'))) = 'emision_invalida');

  v_res := public.guardar_inscripcion(null, v_base || jsonb_build_object(
    'medico', v_ruta, 'alumno_regular', v_regular, 'certificado_emision', '2024-02-29'));
  v_estudiante := (v_res ->> 'id')::uuid;
  perform pg_temp.ok('Inscripción estudiante conserva ambas rutas, antecedentes y emisión por aniversario',
    v_res ->> 'medico' = v_ruta and v_res ->> 'alumno_regular' = v_regular
    and v_res ->> 'certificado_hasta' = '2025-02-28' and v_res ->> 'correo' = 'demo@correo.uss.cl'
    and v_res ->> 'antecedentes' = 'Observación ficticia');
  perform pg_temp.ok('Rechaza RUT duplicado', pg_temp.error_de(format(
    'select public.guardar_inscripcion(null,%L)', v_base)) = 'rut_duplicado');
  perform pg_temp.ok('Profesor vuelve a leer y editar bajo el mismo ID',
    public.leer_inscripcion(v_estudiante) = v_res and
    (public.guardar_inscripcion(v_estudiante, v_res || '{"nombre":"Estudiante editado"}') ->> 'id')::uuid = v_estudiante);
  perform pg_temp.ok('Bloquea versiones desactualizadas', pg_temp.error_de(format(
    'select public.guardar_inscripcion(%L,%L)', v_estudiante, v_res)) = 'ficha_desactualizada');
  delete from storage.objects where bucket_id = 'certificados' and name = v_ruta;
  get diagnostics v_n = row_count;
  perform pg_temp.ok('Un documento asociado no se puede borrar desde Storage', v_n = 0);

  v_res := public.guardar_inscripcion(null, v_base || '{
    "rut":"1000001-7","tipo_persona":"funcionario_colaborador","nombre":"Funcionario ficticio"}');
  v_persona := (v_res ->> 'id')::uuid;
  perform pg_temp.ok('Funcionario queda pendiente y sin carrera', v_res ->> 'certificado_hasta' is null
    and v_res ->> 'carrera' is null and v_res ->> 'alumno_regular' is null);
  v_res := public.guardar_inscripcion(null, v_base || '{
    "rut":"1000005-k","tipo_persona":"deportista_destacado","nombre":"Deportista ficticio"}');
  v_atleta := (v_res ->> 'id')::uuid;
  perform pg_temp.ok('Deportista destacado queda exento y guarda K mayúscula', v_res ->> 'rut' = '1000005-K'
    and v_res ->> 'tipo_persona' = 'deportista_destacado' and v_res ->> 'certificado_hasta' is null);
  perform pg_temp.ok('RUT bien formado sin inscripción devuelve rechazo específico',
    public.registrar_ingreso_rut('1000002-5') ->> 'motivo' = 'rut_no_registrado');
  perform pg_temp.ok('RUT inválido no opera el acceso',
    pg_temp.error_de($q$select public.registrar_ingreso_rut('1.000.002-5')$q$) = 'rut_invalido');

  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform pg_temp.ok('Admin no lee fichas, archivos ni autoriza excepciones', pg_temp.error_de(format(
    'select public.leer_inscripcion(%L)', v_estudiante)) = 'sin_permiso'
    and not exists (select 1 from storage.objects where bucket_id = 'certificados')
    and pg_temp.error_de(format('select public.autorizar_acceso_excepcional(%L)', v_persona)) = 'sin_permiso');
  perform set_config('request.jwt.claim.sub', v_alumno::text, true);
  perform pg_temp.ok('Alumno sin acceso a archivos, edición, RUT ni excepción',
    not exists (select 1 from storage.objects where bucket_id = 'certificados')
    and pg_temp.error_de(format('select public.guardar_inscripcion(null,%L)', v_base)) = 'sin_permiso'
    and pg_temp.error_de($q$select public.registrar_ingreso_rut('1000005-K')$q$) = 'sin_permiso'
    and pg_temp.error_de(format('select public.autorizar_acceso_excepcional(%L)', v_persona)) = 'sin_permiso');
  reset role;

  delete from public.turnos;
  update public.visitas set salida = entrada where salida is null;
  update public.configuracion set capacidad = 1 where id = 1;
  insert into public.tarjetas(uid, alumno_id, tipo) values ('25:26:00:01', v_atleta, 'credencial_uss'),
    ('25:26:00:02', v_persona, 'tne');

  perform pg_temp.ok('NFC admite deportista sin certificado',
    privado.registrar_ingreso_en('25:26:00:01', v_ahora) ->> 'resultado' = 'entrada');
  perform pg_temp.ok('TNE sin certificado devuelve pendiente',
    privado.registrar_ingreso_en('25:26:00:02', v_ahora) ->> 'estado_certificado' = 'pendiente');
  perform pg_temp.ok('Certificado médico vencido conserva motivo y estado', (
    privado.registrar_acceso_persona(v_estudiante, null, v_ahora, null)
      @> '{"motivo":"certificado_no_vigente","estado_certificado":"vencido"}'));
  perform pg_temp.ok('Excepción respeta horario y no se audita como concedida',
    privado.registrar_acceso_persona(v_persona, null, v_ahora - interval '5 hours', v_prof)
      ->> 'motivo' = 'fuera_de_horario' and not exists (select 1 from privado.autorizaciones_acceso));
  perform pg_temp.ok('Excepción respeta día cerrado',
    privado.registrar_acceso_persona(v_persona, null, v_ahora + interval '2 days', v_prof)
      ->> 'motivo' = 'gimnasio_cerrado');

  -- El reloj del caso de día cerrado puede haber reconciliado la ocupación.
  update public.visitas set salida = entrada where salida is null;
  perform privado.registrar_ingreso_en('25:26:00:01', v_ahora + interval '1 minute');
  v_res := privado.registrar_acceso_persona(v_persona, null, v_ahora + interval '2 minutes', v_prof);
  v_turno := (v_res ->> 'turno')::integer;
  perform pg_temp.ok('Excepción en recinto lleno crea un turno y registra autor y motivo',
    v_res ->> 'resultado' = 'turno' and exists (
      select 1 from privado.autorizaciones_acceso a join public.turnos t on t.id = a.turno_id
      where a.profesor_id = v_prof and a.persona_id = v_persona and a.motivo = 'pendiente'
        and t.numero = v_turno and a.visita_id is null));
  v_res := privado.registrar_acceso_persona(v_persona, null, v_ahora + interval '3 minutes', v_prof);
  perform pg_temp.ok('Reintento conserva turno y una sola autorización',
    (v_res ->> 'turno')::integer = v_turno and (select count(*) from privado.autorizaciones_acceso) = 1);
  perform privado.registrar_acceso_persona(v_estudiante, null, v_ahora + interval '3 minutes', v_prof);
  perform pg_temp.ok('Otra vía de identificación registra salida y libera cupo',
    privado.registrar_acceso_persona(v_atleta, null, v_ahora + interval '4 minutes', null) ->> 'resultado' = 'salida');
  perform pg_temp.ok('Segunda excepción no se adelanta al primer turno',
    privado.registrar_acceso_persona(v_estudiante, null, v_ahora + interval '4 minutes', null) ->> 'resultado' = 'turno');
  v_res := privado.registrar_ingreso_en('25:26:00:02', v_ahora + interval '5 minutes');
  perform pg_temp.ok('TNE acepta la autorización al llamar y la vincula a una visita',
    v_res ->> 'resultado' = 'entrada'
    and exists (select 1 from privado.autorizaciones_acceso where persona_id = v_persona and visita_id is not null));
  perform pg_temp.ok('Repetir autorización no cierra una visita abierta',
    privado.registrar_acceso_persona(v_persona, null, v_ahora + interval '5 minutes', v_prof)
      ->> 'motivo' = 'visita_ya_abierta');
  perform privado.registrar_ingreso_en('25:26:00:02', v_ahora + interval '6 minutes');
  perform pg_temp.ok('Futura entrada requiere autorización independiente y vigencia sigue nula',
    privado.registrar_acceso_persona(v_persona, null, v_ahora + interval '7 minutes', null)
      ->> 'motivo' = 'certificado_no_vigente' and
    (select certificado_hasta is null and certificado_emision is null from public.alumnos where id = v_persona));
  perform pg_temp.ok('Un turno excepcional vencido no habilita otra visita',
    privado.registrar_acceso_persona(v_estudiante, null, v_ahora + interval '22 minutes', null)
      ->> 'motivo' = 'certificado_no_vigente');
  v_res := privado.registrar_acceso_persona(v_persona, null, v_ahora + interval '23 minutes', v_prof);
  perform pg_temp.ok('Nueva autorización independiente admite la siguiente visita',
    v_res ->> 'resultado' = 'entrada' and (
    select count(*) = 2 from privado.autorizaciones_acceso where persona_id = v_persona and visita_id is not null));
end;
$$;

rollback;
