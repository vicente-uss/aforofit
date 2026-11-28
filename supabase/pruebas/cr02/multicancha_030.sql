-- Solo en Supabase desechable. Los datos y los cambios de configuración se revierten.
begin;

create function pg_temp.verificar(p_ok boolean, p_caso text)
returns void language plpgsql as $$
begin
  if p_ok is distinct from true then raise exception 'FALLÓ: %', p_caso; end if;
  raise notice 'OK %', p_caso;
end;
$$;

create function pg_temp.rechaza(p_consulta text, p_error text, p_caso text)
returns void language plpgsql as $$
begin
  begin
    execute p_consulta;
    raise exception 'Se esperaba %', p_error;
  exception when others then
    if position(p_error in sqlerrm) = 0 or sqlerrm = 'Se esperaba ' || p_error then
      raise exception 'FALLÓ % (%): %', p_caso, sqlstate, sqlerrm;
    end if;
  end;
  raise notice 'OK %', p_caso;
end;
$$;

do $$
declare
  v_lunes date := date_trunc('week', now() at time zone 'America/Santiago')::date + 7;
  v_profesor uuid := '00000000-0000-4000-8000-000000030001';
  v_alumno uuid := '00000000-0000-4000-8000-000000030002';
  v_otro uuid := '00000000-0000-4000-8000-000000030003';
  v_admin uuid := '00000000-0000-4000-8000-000000030004';
  v_reserva uuid;
  v_otra uuid;
  v_bloqueo uuid;
  v_actividad uuid;
  v_version uuid;
  v_version_antigua uuid;
  v_aforo jsonb;
  v_visitas bigint;
  v_turnos bigint;
  v_prestamos bigint;
begin
  insert into auth.users(id, email, email_confirmed_at, is_sso_user) values
    (v_profesor, 'qa030-profesor@example.test', now(), false),
    (v_alumno, 'qa030-alumno@example.test', now(), false),
    (v_otro, 'qa030-otro@example.test', now(), false),
    (v_admin, 'qa030-admin@example.test', now(), false),
    ('00000000-0000-4000-8000-000000030005', 'qa030-no-confirmado@example.test', null, false),
    ('00000000-0000-4000-8000-000000030006', 'qa030-ambiguo@example.test', now(), false),
    ('00000000-0000-4000-8000-000000030007', 'qa030-ambiguo@example.test', now(), true);
  update public.perfiles set rol = 'profesor' where id = v_profesor;
  update public.perfiles set rol = 'admin' where id = v_admin;
  select to_jsonb(a) into v_aforo from public.aforo a;
  select count(*) into v_visitas from public.visitas;
  select count(*) into v_turnos from public.turnos;
  select count(*) into v_prestamos from public.prestamos;

  perform pg_temp.verificar((select count(*) = 5 and bool_and(hora_fin - hora_inicio = interval '80 minutes')
    from public.multicancha_modulos), '030 catálogo provisional de cinco módulos de 80 minutos');
  perform pg_temp.verificar((select count(*) = 4 from pg_class where relnamespace = 'public'::regnamespace
    and relname in ('multicancha_modulos','multicancha_reservas','multicancha_integrantes','multicancha_historial')
    and relrowsecurity), '030 RLS activo en las cuatro tablas');
  perform pg_temp.verificar((select not public from storage.buckets where id = 'multicancha'), '030 reglamento en bucket privado');
  perform pg_temp.verificar(
    privado.instante_multicancha(timestamp '2026-04-04 08:00') = timestamptz '2026-04-04 11:00+00'
    and privado.instante_multicancha(timestamp '2026-04-05 08:00') = timestamptz '2026-04-05 12:00+00',
    '030 horario local durante el cambio de abril');
  perform pg_temp.verificar(
    privado.instante_multicancha(timestamp '2026-09-05 08:00') = timestamptz '2026-09-05 12:00+00'
    and privado.instante_multicancha(timestamp '2026-09-06 08:00') = timestamptz '2026-09-06 11:00+00',
    '030 horario local durante el cambio de septiembre');
  perform pg_temp.rechaza($q$select privado.instante_multicancha(timestamp '2026-04-04 23:30')$q$,
    'multicancha_cambio_hora', '030 falla si la hora local es ambigua');
  perform pg_temp.rechaza($q$select privado.instante_multicancha(timestamp '2026-09-06 00:30')$q$,
    'multicancha_cambio_hora', '030 falla si la hora local no existe');
  perform pg_temp.rechaza($q$insert into public.multicancha_modulos(dias, hora_inicio, hora_fin)
    values ('{1}','07:30','08:50')$q$, 'check constraint', '030 el catálogo no admite inicio antes de las 08:00');
  perform pg_temp.rechaza($q$insert into public.multicancha_modulos(dias, hora_inicio, hora_fin)
    values ('{1}','14:50','16:10')$q$, 'check constraint', '030 el catálogo no admite término después de las 16:00');
  perform pg_temp.rechaza($q$insert into public.multicancha_modulos(dias, hora_inicio, hora_fin)
    values ('{1}','13:50','14:50')$q$, 'check constraint', '030 el catálogo exige 80 minutos');

  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_profesor, 'role', 'authenticated')::text, true);
  set local role authenticated;
  v_reserva := public.guardar_multicancha(v_lunes, 'ordinaria', 1::smallint,
    p_responsable => ' QA Responsable ', p_carrera => ' QA Carrera ', p_correo => 'QA030-Alumno@Example.Test');
  perform pg_temp.verificar((select responsable_id = v_alumno and responsable = 'QA Responsable'
    and correo = 'qa030-alumno@example.test' and hora_inicio = '08:00' and hora_fin = '09:20'
    from public.multicancha_reservas where id = v_reserva), '030 crear con correo confirmado y sin ficha de gimnasio');

  v_otra := public.guardar_multicancha(v_lunes, 'ordinaria', 2::smallint,
    p_responsable => 'Otra cuenta', p_carrera => 'QA Carrera', p_correo => 'qa030-otro@example.test');
  perform public.guardar_multicancha(v_lunes + 1, 'ordinaria', 1::smallint,
    p_responsable => 'Externo', p_carrera => 'QA Carrera', p_correo => 'qa030-externo@example.test');
  perform public.guardar_multicancha(v_lunes + 1, 'ordinaria', 2::smallint,
    p_responsable => 'Sin verificar', p_carrera => 'QA Carrera', p_correo => 'qa030-no-confirmado@example.test');
  perform public.guardar_multicancha(v_lunes + 1, 'ordinaria', 3::smallint,
    p_responsable => 'Ambiguo', p_carrera => 'QA Carrera', p_correo => 'qa030-ambiguo@example.test');
  perform public.guardar_multicancha(v_lunes + 1, 'ordinaria', 4::smallint,
    p_responsable => 'Rol distinto', p_carrera => 'QA Carrera', p_correo => 'qa030-admin@example.test');
  perform pg_temp.verificar((select count(*) = 4 and bool_and(responsable_id is null)
    from public.multicancha_reservas where fecha = v_lunes + 1),
    '030 acepta externos y deja sin vínculo correo ausente, ambiguo, sin confirmar o con otro rol');

  v_bloqueo := public.guardar_multicancha(v_lunes, 'bloqueo', p_hora_inicio => '11:15',
    p_hora_fin => '11:40', p_titulo => 'QA Mantención');
  v_actividad := public.guardar_multicancha(v_lunes, 'institucional', p_hora_inicio => '17:00',
    p_hora_fin => '24:00', p_titulo => 'QA Taller');
  perform pg_temp.verificar((select hora_fin = '24:00' and fin = ((fecha + 1)::timestamp at time zone 'America/Santiago')
    from public.multicancha_reservas where id = v_actividad), '030 actividad después de 16:00 hasta medianoche');
  perform public.guardar_multicancha(v_lunes, 'institucional', p_hora_inicio => '09:20',
    p_hora_fin => '09:30', p_titulo => 'QA Actividad contigua');
  perform pg_temp.verificar((select count(*) = 1 from public.multicancha_reservas where titulo = 'QA Actividad contigua'),
    '030 dos intervalos que se tocan son válidos');
  perform pg_temp.rechaza(format($q$select public.guardar_multicancha(%L,'ordinaria',3::smallint,
    p_responsable=>'QA', p_carrera=>'QA', p_correo=>'qa@example.test')$q$, v_lunes),
    'multicancha_superposicion', '030 bloqueo parcial impide usar todo el módulo');
  perform pg_temp.rechaza(format($q$select public.guardar_multicancha(%L,'institucional',
    p_hora_inicio=>'08:15', p_hora_fin=>'09:45', p_titulo=>'QA Prioridad')$q$, v_lunes),
    'multicancha_superposicion', '030 actividad prioritaria exige resolver reserva existente explícitamente');
  perform pg_temp.verificar((select cancelada_en is null from public.multicancha_reservas where id = v_reserva),
    '030 intento de actividad no cancela la reserva');
  perform pg_temp.rechaza(format($q$select public.guardar_multicancha(%L,'ordinaria',1::smallint,
    p_responsable=>'QA', p_carrera=>'QA', p_correo=>'qa@example.test')$q$, v_lunes),
    'multicancha_superposicion', '030 reserva ordinaria superpuesta se rechaza');
  perform pg_temp.rechaza(format($q$select public.guardar_multicancha(%L,'ordinaria',1::smallint)$q$, v_lunes + 5),
    'multicancha_modulo', '030 reserva ordinaria fuera de día habilitado se rechaza');
  perform pg_temp.rechaza(format($q$select public.guardar_multicancha(%L,'ordinaria',null)$q$, v_lunes),
    'multicancha_modulo', '030 no admite intervalos libres para reservas ordinarias');
  perform pg_temp.rechaza($q$select public.guardar_multicancha('2000-01-03','ordinaria',1::smallint,
    p_responsable=>'QA', p_carrera=>'QA', p_correo=>'qa@example.test')$q$, 'multicancha_pasado', '030 no crea bloques en el pasado');
  perform pg_temp.rechaza(format($q$select public.guardar_multicancha(%L,'institucional',p_hora_inicio=>'19:00',
    p_hora_fin=>'18:00',p_titulo=>'QA')$q$, v_lunes), 'multicancha_horario', '030 rechaza horario invertido');
  perform pg_temp.rechaza($q$select public.guardar_multicancha(null,'bloqueo')$q$, 'multicancha_datos', '030 rechaza fecha vacía');
  perform pg_temp.rechaza(format($q$select public.guardar_multicancha(%L,'ordinaria',5::smallint,
    p_responsable=>'QA',p_carrera=>'QA',p_correo=>'sin-arroba')$q$, v_lunes), 'multicancha_datos', '030 valida correo');

  select version into v_version_antigua from public.multicancha_reservas where id = v_reserva;
  perform public.guardar_multicancha(v_lunes + 2, 'ordinaria', 4::smallint, p_responsable => 'QA Responsable actualizado',
    p_carrera => 'QA Carrera', p_correo => 'qa030-alumno@example.test', p_id => v_reserva, p_version => v_version_antigua);
  select version into v_version from public.multicancha_reservas where id = v_reserva;
  perform pg_temp.verificar((select fecha = v_lunes + 2 and hora_inicio = '12:30' and responsable = 'QA Responsable actualizado'
    and version <> v_version_antigua from public.multicancha_reservas where id = v_reserva), '030 edición reprograma con el mismo ID');
  perform pg_temp.verificar((select actor_id = v_profesor and fecha_anterior = v_lunes and fecha = v_lunes + 2
    and (detalle -> 'antes' ->> 'fecha')::date = v_lunes from public.multicancha_historial
    where reserva_id = v_reserva and accion = 'modificacion'), '030 historial conserva origen y destino con actor');
  perform pg_temp.rechaza(format('select public.cancelar_multicancha(%L,%L)', v_reserva, v_version_antigua),
    'multicancha_version', '030 una versión antigua no puede cancelar después de editar');
  perform public.guardar_multicancha(v_lunes, 'institucional', p_hora_inicio => '08:10',
    p_hora_fin => '09:10', p_titulo => 'QA Prioridad resuelta');
  perform pg_temp.rechaza(format($q$select public.guardar_multicancha(%L,'ordinaria',1::smallint,
    p_responsable=>'QA',p_carrera=>'QA',p_correo=>'qa@example.test')$q$, v_lunes),
    'multicancha_superposicion', '030 una actividad registrada tiene prioridad sobre un módulo');
  perform public.guardar_nomina_multicancha(v_otra, (select version from public.multicancha_reservas where id = v_otra),
    '[{"nombre":"QA ajeno","rut":"12345678-5","carrera":"QA ajena"}]');
  perform pg_temp.verificar((select count(*) = 1 from public.multicancha_integrantes where reserva_id = v_otra),
    '030 profesor completa nómina presencial y consulta integrantes');
  perform pg_temp.rechaza(format('delete from public.multicancha_reservas where id=%L', v_otra),
    'permission denied', '030 tampoco el profesor borra registros por acceso directo');

  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_alumno, 'role', 'authenticated')::text, true);
  perform pg_temp.verificar((select count(*) = 1 and bool_and(id = v_reserva) from public.multicancha_reservas),
    '030 el alumno solo ve su reserva');
  perform pg_temp.verificar((select count(*) = 0 from public.multicancha_integrantes where reserva_id = v_otra),
    '030 el alumno no ve la nómina ajena');
  perform pg_temp.verificar((select count(*) = 0 from public.multicancha_historial),
    '030 el alumno no accede a las auditorías');
  perform pg_temp.rechaza(format('select public.guardar_multicancha(%L,%L)', v_lunes, 'ordinaria'),
    'sin_permiso', '030 alumno no puede crear ni editar horarios por RPC');
  perform pg_temp.rechaza(format('select public.cancelar_multicancha(%L,%L)', v_reserva, v_version),
    'sin_permiso', '030 alumno no puede cancelar ni su reserva');
  perform pg_temp.rechaza(format('update public.multicancha_reservas set fecha=%L where id=%L', v_lunes, v_reserva),
    'permission denied', '030 alumno no puede modificar la tabla de reservas');
  perform pg_temp.rechaza(format($q$select public.guardar_nomina_multicancha(%L,null,'[]')$q$, v_otra),
    'sin_permiso', '030 alumno no puede alterar una nómina ajena');
  perform public.guardar_nomina_multicancha(v_reserva, v_version,
    '[{"nombre":"QA Integrante", "rut":"12.345.678-5", "carrera":"QA Carrera"}]');
  perform pg_temp.verificar((select count(*) = 1 and bool_and(nombre = 'QA Integrante' and rut = '12345678-5')
    from public.multicancha_integrantes where reserva_id = v_reserva), '030 alumno registra y consulta su nómina normalizada');
  perform pg_temp.rechaza(format($q$select public.guardar_nomina_multicancha(%L,%L,'[]')$q$, v_reserva, v_version),
    'multicancha_version', '030 edición antigua no pisa otra edición de nómina');
  select version into v_version from public.multicancha_reservas where id = v_reserva;
  perform pg_temp.rechaza(format($q$select public.guardar_nomina_multicancha(%L,%L,
    '[{"nombre":"QA","rut":"12345678-0","carrera":"QA"}]')$q$, v_reserva, v_version),
    'multicancha_nomina', '030 valida el dígito verificador');
  perform pg_temp.rechaza(format($q$select public.guardar_nomina_multicancha(%L,%L,
    '[{"nombre":"QA","rut":"12345678-5","carrera":"QA"},{"nombre":"QA","rut":"12.345.678-5","carrera":"QA"}]')$q$,
    v_reserva, v_version), 'multicancha_rut_repetido', '030 valida unicidad de RUT normalizado por nómina');
  perform pg_temp.verificar((select count(*) = 1 and bool_and(nombre = 'QA Integrante')
    from public.multicancha_integrantes where reserva_id = v_reserva), '030 errores no borran la nómina anterior');
  perform public.guardar_nomina_multicancha(v_reserva, v_version,
    '[{"nombre":"QA Integrante corregido","rut":"12345678-5","carrera":"QA Carrera 2"}]');
  perform pg_temp.verificar((select nombre = 'QA Integrante corregido' and carrera = 'QA Carrera 2'
    from public.multicancha_integrantes where reserva_id = v_reserva), '030 alumno corrige nombre y carrera');
  select version into v_version from public.multicancha_reservas where id = v_reserva;

  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_profesor, 'role', 'authenticated')::text, true);
  perform pg_temp.verificar((select count(*) = 2 and bool_and(actor_id = v_alumno) from public.multicancha_historial
    where reserva_id = v_reserva and accion = 'nomina'), '030 historial identifica al alumno que actualizó la nómina');
  perform public.cancelar_multicancha(v_reserva, v_version);
  perform pg_temp.verificar((select cancelada_en is not null from public.multicancha_reservas where id = v_reserva)
    and (select actor_id = v_profesor from public.multicancha_historial where reserva_id = v_reserva and accion = 'cancelacion'),
    '030 cancelación conserva reserva, identidad del actor e historial');
  perform public.guardar_multicancha(v_lunes + 2, 'ordinaria', 4::smallint,
    p_responsable => 'QA Nuevo equipo', p_carrera => 'QA Carrera', p_correo => 'qa030-equipo@example.test');
  perform pg_temp.verificar((select count(*) = 2 from public.multicancha_reservas where fecha = v_lunes + 2 and hora_inicio = '12:30'),
    '030 después de cancelar otro equipo puede reservar el módulo');
  perform public.cancelar_multicancha(v_bloqueo, (select version from public.multicancha_reservas where id = v_bloqueo));
  perform pg_temp.verificar((select cancelada_en is not null from public.multicancha_reservas where id = v_bloqueo),
    '030 desbloqueo explícito conserva evidencia');

  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_alumno, 'role', 'authenticated')::text, true);
  perform pg_temp.verificar((select cancelada_en is not null from public.multicancha_reservas where id = v_reserva)
    and (select count(*) = 1 from public.multicancha_integrantes where reserva_id = v_reserva),
    '030 alumno conserva consulta de su reserva cancelada y participantes');
  select version into v_version from public.multicancha_reservas where id = v_reserva;
  perform pg_temp.rechaza(format($q$select public.guardar_nomina_multicancha(%L,%L,'[]')$q$, v_reserva, v_version),
    'multicancha_version', '030 nómina cancelada es de solo lectura');

  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_admin, 'role', 'authenticated')::text, true);
  perform pg_temp.verificar((select count(*) = 0 from public.multicancha_reservas), '030 rol admin no hereda agenda del profesor');
  perform pg_temp.rechaza(format('select public.guardar_multicancha(%L,%L)', v_lunes, 'bloqueo'),
    'sin_permiso', '030 rol admin no hereda mutaciones de agenda');
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  set local role anon;
  perform pg_temp.rechaza('select * from public.multicancha_reservas', 'permission denied', '030 sin acceso público a reservas');
  perform pg_temp.rechaza(format('select public.guardar_multicancha(%L,%L)', v_lunes, 'bloqueo'),
    'permission denied', '030 sin ejecución pública de RPC');
  reset role;

  perform pg_temp.verificar(v_aforo is not distinct from (select to_jsonb(a) from public.aforo a)
    and v_visitas = (select count(*) from public.visitas) and v_turnos = (select count(*) from public.turnos)
    and v_prestamos = (select count(*) from public.prestamos),
    '030 agenda y nómina independientes de aforo, visitas, turnos y préstamos');
end;
$$;

rollback;
