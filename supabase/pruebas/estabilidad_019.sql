-- EST-01/02/03/05. Solo base desechable con 019 y usuarios ficticios.
-- No depende de la hora del sistema. No deja datos.
\set ON_ERROR_STOP on
begin;
set local time zone 'America/Santiago';
create function pg_temp.ok(caso text, correcto boolean) returns void language plpgsql as $$
begin
  if correcto is not true then raise exception 'FALLÓ: %', caso; end if;
  raise notice 'OK: %', caso;
end;
$$;

do $$
declare
  h constant timestamptz := '2026-12-07 10:00:00';
  v_alumno uuid;
  v_profesor uuid;
  v_actualizado timestamptz;
  v_tupla tid;
  v_horario jsonb;
  v_turno uuid;
  r jsonb;
  uid text;
begin
  update public.visitas set salida = entrada where salida is null;
  update public.turnos set estado = 'expirado' where estado in ('esperando','llamado');
  select horario into strict v_horario from public.configuracion where id = 1;
  perform privado.actualizar_configuracion_en(3, v_horario, 3, h);
  update public.configuracion set turno_expira_minutos = 10 where id = 1;

  insert into public.alumnos(nombre, rut, certificado_hasta)
  select 'Estabilidad ' || g, 'EST019-' || g, date '2027-12-31' from generate_series(1,6) g;
  insert into public.tarjetas(uid, alumno_id)
  select 'FC:19:00:0' || right(rut,1), id from public.alumnos where rut like 'EST019-%';

  perform privado.registrar_ingreso_en('FC:19:00:01',h);
  perform privado.registrar_ingreso_en('FC:19:00:02',h);
  perform privado.registrar_ingreso_en('FC:19:00:03',h);
  perform privado.registrar_ingreso_en('FC:19:00:04',h + interval '1 minute');
  perform privado.registrar_ingreso_en('FC:19:00:05',h + interval '2 minutes');
  perform privado.registrar_ingreso_en('FC:19:00:06',h + interval '3 minutes');
  perform privado.registrar_ingreso_en('FC:19:00:01',h + interval '4 minutes');
  perform privado.registrar_ingreso_en('FC:19:00:02',h + interval '5 minutes');
  perform pg_temp.ok('Dos reservas antes de reducir',
    (select count(*) from public.turnos where estado='llamado')=2);

  perform privado.actualizar_configuracion_en(1,v_horario,3,h+interval '6 minutes');
  perform pg_temp.ok('Bajar capacidad preserva visita y números de espera',
    (select ocupacion=1 and capacidad=1 and en_espera=3 and turno_llamado is null from public.aforo where id=1));
  r := privado.registrar_ingreso_en('FC:19:00:05',h+interval '7 minutes');
  perform pg_temp.ok('Reserva anterior no permite superar capacidad',
    r->>'resultado'='turno' and (r->>'turno')::int=2 and (r->>'ocupacion')::int=1);

  perform privado.actualizar_configuracion_en(2,v_horario,3,h+interval '8 minutes');
  perform pg_temp.ok('Al subir capacidad se recupera la primera reserva',
    (select turno_llamado=1 and en_espera=2 from public.aforo where id=1));
  r := privado.registrar_ingreso_en('FC:19:00:05',h+interval '9 minutes');
  perform pg_temp.ok('El segundo no se adelanta',r->>'resultado'='turno' and (r->>'turno')::int=2);

  -- Esta función es el mismo núcleo que invoca Cron, sin leer credenciales.
  perform privado.sincronizar_aforo(h+interval '17 minutes 59 seconds');
  perform pg_temp.ok('No vence antes de plazo',
    (select turno_llamado=1 from public.aforo where id=1));
  perform privado.sincronizar_aforo(h+interval '18 minutes');
  perform pg_temp.ok('Vence exactamente al plazo y llama al siguiente',
    (select turno_llamado=2 and en_espera=1 from public.aforo where id=1)
    and exists(select from public.turnos where numero=1 and estado='expirado' and creado_en::date=h::date));
  select actualizado_en, ctid into strict v_actualizado, v_tupla from public.aforo where id=1;
  perform privado.sincronizar_aforo(h+interval '19 minutes');
  perform pg_temp.ok('Sin cambios, no se actualiza el aforo',
    (select actualizado_en=v_actualizado and ctid=v_tupla from public.aforo where id=1));

  -- Dejar el turno 2 usado y la tercera visita abierta hasta su vencimiento.
  r := privado.registrar_ingreso_en('FC:19:00:05',h+interval '20 minutes');
  perform pg_temp.ok('Turno reservado válido entra con capacidad disponible',
    r->>'resultado'='entrada' and (r->>'ocupacion')::int=2);
  perform privado.sincronizar_aforo(h+interval '3 hours');
  perform pg_temp.ok('Cierre autónomo a la hora exacta, sin autor manual',
    exists(select from public.visitas v join public.alumnos a on a.id=v.alumno_id
      where a.rut='EST019-3' and v.salida=h+interval '3 hours' and v.cierre_automatico and v.cerrada_por is null));
  perform pg_temp.ok('Cierre libera cupo y llama siguiente',
    (select ocupacion=1 and turno_llamado=3 from public.aforo where id=1));

  -- Un turno en espera fuera de horario no se llama, aunque exista un cupo.
  update public.turnos set estado='esperando', llamado_en=null
  where numero=3 and creado_en::date=h::date;
  perform privado.sincronizar_aforo(h+interval '12 hours');
  perform pg_temp.ok('Fuera de horario no se llama',
    (select turno_llamado is null and en_espera=1 from public.aforo where id=1));
  perform privado.sincronizar_aforo(h+interval '1 day');
  perform pg_temp.ok('Día nuevo no arrastra turnos',
    (select turno_llamado is null and en_espera=0 from public.aforo where id=1)
    and not exists(select from public.turnos where estado in ('esperando','llamado') and creado_en::date=h::date));

  select id into strict v_alumno from public.alumnos where rut='EST019-1';
  -- El 4 de abril termina con una hora repetida. El 6 de septiembre salta de 23:59 a 01:00.
  -- La zona de la conexión no debe alterar la fecha operativa del gimnasio.
  set local time zone 'UTC';
  insert into public.turnos(alumno_id,numero,estado,creado_en)
  values(v_alumno,1,'esperando','2026-04-05 02:58:00+00') returning id into v_turno;
  perform privado.sincronizar_aforo('2026-04-05 03:00:00+00');
  perform pg_temp.ok('La hora repetida de otoño conserva el turno del mismo día Santiago',
    (select estado='esperando' from public.turnos where id=v_turno));
  perform privado.sincronizar_aforo('2026-04-05 04:00:00+00');
  perform pg_temp.ok('El turno expira al llegar la medianoche después de la hora repetida',
    (select estado='expirado' from public.turnos where id=v_turno));
  insert into public.turnos(alumno_id,numero,estado,creado_en)
  values(v_alumno,1,'esperando','2026-09-06 03:58:00+00') returning id into v_turno;
  perform privado.sincronizar_aforo('2026-09-06 03:59:59+00');
  perform pg_temp.ok('El turno permanece en espera hasta el salto de primavera',
    (select estado='esperando' from public.turnos where id=v_turno));
  perform privado.sincronizar_aforo('2026-09-06 04:00:00+00');
  perform pg_temp.ok('El turno expira en el primer instante del día de 23 horas',
    (select estado='expirado' from public.turnos where id=v_turno));

  select id into v_profesor from public.perfiles where rol='profesor' order by id limit 1;
  if v_profesor is null then raise exception 'Falta profesor ficticio'; end if;
  perform set_config('request.jwt.claims',jsonb_build_object('sub',v_profesor,'role','authenticated')::text,true);
  execute 'set local role authenticated';
  foreach uid in array array[null::text,'','FC:19:00','fc:19:00:01','FC:19:00:GG','FC:19:00:Á1',
    'FC:19:00:01:02',E'FC:19:00:01\n'] loop
    r := public.vincular_credencial(uid,v_alumno,'tne');
    perform pg_temp.ok('UID inválido retorna JSON sin excepción',r='{"ok":false,"motivo":"uid_invalido"}'::jsonb);
  end loop;
  foreach uid in array array['FC:19:AA:01','FC:19:AA:01:02:03:04','FC:19:AA:01:02:03:04:05:06:07'] loop
    r := public.vincular_credencial(uid,v_alumno,'credencial_uss');
    perform pg_temp.ok('UID canónico permitido',r='{"ok":true,"motivo":null}'::jsonb);
  end loop;
  execute 'reset role';
end;
$$;

select pg_temp.ok('Cron único y activo',
  (select count(*)=1 and bool_and(active and schedule='* * * * *')
   from cron.job where jobname='aforofit-reconciliar-aforo'));
select pg_temp.ok('Cron y bloqueo privados sin EXECUTE para roles web',
  not has_function_privilege('anon','privado.procesar_aforo_programado()','EXECUTE')
  and not has_function_privilege('authenticated','privado.procesar_aforo_programado()','EXECUTE')
  and not has_function_privilege('service_role','privado.procesar_aforo_programado()','EXECUTE')
  and not has_function_privilege('anon','privado.bloquear_configuracion_aforo()','EXECUTE')
  and not has_function_privilege('authenticated','privado.bloquear_configuracion_aforo()','EXECUTE')
  and not has_function_privilege('service_role','privado.bloquear_configuracion_aforo()','EXECUTE'));
rollback;
