-- 019 · EST-01, EST-02, EST-03 y EST-05. Requiere 018 y pg_cron disponible.
begin;

-- Reconciliación única bajo el bloqueo de aforo. No escribe la fila pública si nada cambió.
create or replace function privado.sincronizar_aforo(p_ahora timestamptz default now())
returns public.aforo
language plpgsql
set search_path = ''
as $$
declare
  v_config public.configuracion%rowtype;
  v_fila public.aforo%rowtype;
  v_local timestamp := p_ahora at time zone 'America/Santiago';
  v_hoy date := v_local::date;
  v_hora time := date_trunc('minute', v_local)::time;
  v_franja jsonb;
  v_ocupacion integer;
  v_llamados integer;
  v_libres integer;
  v_espera integer;
  v_numero integer;
  v_nombre text;
  v_cambios integer := 0;
  v_n integer;
begin
  perform 1 from public.aforo where id = 1 for update;
  select * into strict v_config from public.configuracion where id = 1;

  update public.visitas
  set salida = entrada + make_interval(hours => v_config.cierre_automatico_horas),
      cierre_automatico = true, cerrada_por = null
  where salida is null
    and entrada <= p_ahora - make_interval(hours => v_config.cierre_automatico_horas);
  get diagnostics v_n = row_count;
  v_cambios := v_cambios + v_n;

  -- Un turno del día anterior no puede reservar cupo hoy.
  update public.turnos
  set estado = 'expirado'
  where estado in ('esperando', 'llamado')
    and ((creado_en at time zone 'America/Santiago')::date < v_hoy
      or (estado = 'llamado'
        and (creado_en at time zone 'America/Santiago')::date = v_hoy
        and llamado_en <= p_ahora - make_interval(mins => v_config.turno_expira_minutos)));
  get diagnostics v_n = row_count;
  v_cambios := v_cambios + v_n;

  select count(*) into v_ocupacion from public.visitas where salida is null;
  v_libres := greatest(v_config.capacidad - v_ocupacion, 0);

  -- Al reducir capacidad, las reservas sobrantes vuelven a esperar sin perder número.
  -- Conservamos las primeras reservas; las demás podrán volver a ser llamadas.
  update public.turnos t
  set estado = 'esperando', llamado_en = null
  where t.id in (
    select s.id from public.turnos s
    where s.estado = 'llamado' and (s.creado_en at time zone 'America/Santiago')::date = v_hoy
    order by s.numero offset v_libres
  );
  get diagnostics v_n = row_count;
  v_cambios := v_cambios + v_n;

  select count(*) into v_llamados from public.turnos
  where estado = 'llamado' and (creado_en at time zone 'America/Santiago')::date = v_hoy;

  v_franja := v_config.horario -> (array['lunes','martes','miercoles','jueves','viernes','sabado','domingo'])
    [extract(isodow from v_local)::integer];
  if jsonb_typeof(v_franja) = 'object'
      and v_hora between (v_franja ->> 'apertura')::time and (v_franja ->> 'ultimo_ingreso')::time then
    update public.turnos t
    set estado = 'llamado', llamado_en = p_ahora
    where t.id in (
      select s.id from public.turnos s
      where s.estado = 'esperando'
        and (s.creado_en at time zone 'America/Santiago')::date = v_hoy
      order by s.numero
      limit greatest(v_libres - v_llamados, 0)
    );
    get diagnostics v_n = row_count;
    v_cambios := v_cambios + v_n;
  end if;

  select t.numero, privado.nombre_para_turno(al.nombre) into v_numero, v_nombre
  from public.turnos t join public.alumnos al on al.id = t.alumno_id
  where t.estado = 'llamado' and (t.creado_en at time zone 'America/Santiago')::date = v_hoy
  order by t.numero limit 1;

  select count(*) into v_espera from public.turnos t
  where t.estado = 'esperando' and (t.creado_en at time zone 'America/Santiago')::date = v_hoy;

  -- Aun si el resumen visible coincide, notificar cambios reales de turnos al profesor.
  update public.aforo a
  set ocupacion = v_ocupacion, capacidad = v_config.capacidad,
      turno_llamado = v_numero, turno_llamado_nombre = v_nombre,
      en_espera = v_espera, umbral_casi_lleno = v_config.umbral_casi_lleno,
      actualizado_en = p_ahora
  where a.id = 1 and (v_cambios > 0 or
    (a.ocupacion, a.capacidad, a.turno_llamado, a.turno_llamado_nombre, a.en_espera, a.umbral_casi_lleno)
    is distinct from
    (v_ocupacion, v_config.capacidad, v_numero, v_nombre, v_espera, v_config.umbral_casi_lleno))
  returning * into v_fila;
  if not found then
    select * into strict v_fila from public.aforo where id = 1;
  end if;
  return v_fila;
end;
$$;

create or replace function privado.registrar_ingreso_en(p_uid text, p_ahora timestamptz default now())
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_config  public.configuracion%rowtype;
  v_alumno  public.alumnos%rowtype;
  v_turno   public.turnos%rowtype;
  v_local   timestamp := p_ahora at time zone 'America/Santiago';
  v_hoy     date := (p_ahora at time zone 'America/Santiago')::date;
  v_hora    time := date_trunc('minute', p_ahora at time zone 'America/Santiago')::time;
  v_franja  jsonb;
  v_visita  uuid;
  v_fila    public.aforo%rowtype;
  v_numero  integer;
begin
  perform 1 from public.aforo where id = 1 for update;
  select * into strict v_config from public.configuracion where id = 1;

  -- Vencimientos y reservas se reconcilian también desde Cron.
  v_fila := privado.sincronizar_aforo(p_ahora);

  -- Regla 1: la credencial debe estar vinculada.
  select a.* into v_alumno
  from public.tarjetas t
  join public.alumnos a on a.id = t.alumno_id
  where t.uid = p_uid;

  if not found then
    return privado.respuesta_ingreso('rechazo', 'credencial_no_registrada', null, null, p_ahora);
  end if;

  -- Regla 5: con una visita abierta, esta pasada es la salida.
  select v.id into v_visita from public.visitas v
  where v.alumno_id = v_alumno.id and v.salida is null;

  if found then
    update public.visitas set salida = p_ahora where id = v_visita;
    return privado.respuesta_ingreso('salida', null, v_alumno, null, p_ahora);
  end if;

  -- Regla 2 (D20): certificado vigente, es decir, certificado_hasta >= hoy. certificado_hasta es la
  -- emisión + 12 meses. Ya no se rechaza por período académico (se quitó «fuera_de_periodo»).
  if v_alumno.certificado_hasta is null or v_alumno.certificado_hasta < v_hoy then
    return privado.respuesta_ingreso('rechazo', 'certificado_no_vigente', v_alumno, null, p_ahora);
  end if;

  -- Regla 3: horario del día en Santiago. El minuto del último ingreso todavía se acepta.
  v_franja := v_config.horario -> (array['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'])
    [extract(isodow from v_local)::integer];

  if v_franja is null or jsonb_typeof(v_franja) <> 'object' then
    return privado.respuesta_ingreso('rechazo', 'gimnasio_cerrado', v_alumno, null, p_ahora);
  end if;

  if v_hora < (v_franja ->> 'apertura')::time or v_hora > (v_franja ->> 'ultimo_ingreso')::time then
    return privado.respuesta_ingreso('rechazo', 'fuera_de_horario', v_alumno, null, p_ahora);
  end if;

  -- Regla 4: capacidad y lista de espera.
  select t.* into v_turno from public.turnos t
  where t.alumno_id = v_alumno.id
    and t.estado in ('esperando', 'llamado')
    and (t.creado_en at time zone 'America/Santiago')::date = v_hoy;

  if found and v_turno.estado = 'llamado' and v_fila.ocupacion < v_config.capacidad then
    update public.turnos set estado = 'usado' where id = v_turno.id;
    insert into public.visitas (alumno_id, entrada) values (v_alumno.id, p_ahora);
    return privado.respuesta_ingreso('entrada', null, v_alumno, null, p_ahora);
  end if;

  if found then
    -- Ya estaba esperando: se devuelve el mismo turno, sin duplicarlo.
    return privado.respuesta_ingreso('turno', null, v_alumno, v_turno.numero, p_ahora);
  end if;

  -- Sin turno: entra solo si hay cupo real y nadie espera antes que él o ella.
  if v_fila.ocupacion + (
       select count(*) from public.turnos t
       where t.estado = 'llamado' and (t.creado_en at time zone 'America/Santiago')::date = v_hoy
     ) < v_config.capacidad
     and v_fila.en_espera = 0 then
    insert into public.visitas (alumno_id, entrada) values (v_alumno.id, p_ahora);
    return privado.respuesta_ingreso('entrada', null, v_alumno, null, p_ahora);
  end if;

  select coalesce(max(t.numero), 0) + 1 into v_numero from public.turnos t
  where (t.creado_en at time zone 'America/Santiago')::date = v_hoy;

  insert into public.turnos (alumno_id, numero, estado, creado_en)
  values (v_alumno.id, v_numero, 'esperando', p_ahora);

  return privado.respuesta_ingreso('turno', null, v_alumno, v_numero, p_ahora);
end;
$$;

create or replace function privado.actualizar_configuracion_en(
  p_capacidad                integer,
  p_horario                  jsonb,
  p_cierre_automatico_horas  integer,
  p_ahora                    timestamptz
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_anterior  public.configuracion%rowtype;
  v_horario   jsonb;
  v_fila      public.aforo%rowtype;
  v_contexto_anterior text;
begin
  if p_capacidad is null or p_capacidad not between 1 and 100 then
    raise exception 'capacidad_invalida' using detail = 'La capacidad debe estar entre 1 y 100 personas.';
  end if;
  if p_cierre_automatico_horas is null or p_cierre_automatico_horas not between 1 and 12 then
    raise exception 'cierre_invalido' using detail = 'El cierre automático debe estar entre 1 y 12 horas.';
  end if;
  v_horario := privado.validar_horario(p_horario);

  perform 1 from public.aforo where id = 1 for update;
  select * into strict v_anterior from public.configuracion where id = 1 for update;
  v_contexto_anterior := current_setting('aforofit.hora_configuracion', true);
  perform set_config('aforofit.hora_configuracion', p_ahora::text, true);

  -- El trigger usa la misma hora de esta operación (incluidas pruebas deterministas).
  update public.configuracion
  set capacidad = p_capacidad,
      horario = v_horario,
      cierre_automatico_horas = p_cierre_automatico_horas
  where id = 1;

  perform set_config('aforofit.hora_configuracion', coalesce(v_contexto_anterior, ''), true);
  select * into strict v_fila from public.aforo where id = 1;

  return jsonb_build_object(
    'capacidad', p_capacidad,
    'horario', v_horario,
    'cierre_automatico_horas', p_cierre_automatico_horas,
    'ocupacion', v_fila.ocupacion,
    'turno_llamado', v_fila.turno_llamado,
    'en_espera', v_fila.en_espera
  );
end;
$$;

create or replace function public.vincular_credencial(p_uid text, p_alumno_id uuid, p_tipo text default 'tne')
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_dueno uuid;
begin
  if not exists (
    select 1 from public.perfiles p
    where p.id = (select auth.uid()) and p.rol in ('profesor', 'admin')
  ) then
    return jsonb_build_object('ok', false, 'motivo', 'sin_permiso');
  end if;

  if p_uid is null or not (
    p_uid ~ '^[0-9A-F]{2}(:[0-9A-F]{2}){3} or p_tipo not in ('tne','credencial_uss') then
    return jsonb_build_object('ok', false, 'motivo', 'tipo_invalido');
  end if;
  if not exists (select 1 from public.alumnos a where a.id = p_alumno_id) then
    return jsonb_build_object('ok', false, 'motivo', 'alumno_no_encontrado');
  end if;

  -- on conflict cubre dos vinculaciones simultáneas de la misma tarjeta.
  insert into public.tarjetas (uid, alumno_id, tipo)
  values (p_uid, p_alumno_id, p_tipo)
  on conflict (uid) do nothing;

  select t.alumno_id into v_dueno from public.tarjetas t where t.uid = p_uid;

  if v_dueno is distinct from p_alumno_id then
    return jsonb_build_object('ok', false, 'motivo', 'credencial_de_otro_alumno');
  end if;

  return jsonb_build_object('ok', true, 'motivo', null);
end;
$$;
    or p_uid ~ '^[0-9A-F]{2}(:[0-9A-F]{2}){6} or p_tipo not in ('tne','credencial_uss') then
    return jsonb_build_object('ok', false, 'motivo', 'tipo_invalido');
  end if;
  if not exists (select 1 from public.alumnos a where a.id = p_alumno_id) then
    return jsonb_build_object('ok', false, 'motivo', 'alumno_no_encontrado');
  end if;

  -- on conflict cubre dos vinculaciones simultáneas de la misma tarjeta.
  insert into public.tarjetas (uid, alumno_id, tipo)
  values (p_uid, p_alumno_id, p_tipo)
  on conflict (uid) do nothing;

  select t.alumno_id into v_dueno from public.tarjetas t where t.uid = p_uid;

  if v_dueno is distinct from p_alumno_id then
    return jsonb_build_object('ok', false, 'motivo', 'credencial_de_otro_alumno');
  end if;

  return jsonb_build_object('ok', true, 'motivo', null);
end;
$$;
    or p_uid ~ '^[0-9A-F]{2}(:[0-9A-F]{2}){9} or p_tipo not in ('tne','credencial_uss') then
    return jsonb_build_object('ok', false, 'motivo', 'tipo_invalido');
  end if;
  if not exists (select 1 from public.alumnos a where a.id = p_alumno_id) then
    return jsonb_build_object('ok', false, 'motivo', 'alumno_no_encontrado');
  end if;

  -- on conflict cubre dos vinculaciones simultáneas de la misma tarjeta.
  insert into public.tarjetas (uid, alumno_id, tipo)
  values (p_uid, p_alumno_id, p_tipo)
  on conflict (uid) do nothing;

  select t.alumno_id into v_dueno from public.tarjetas t where t.uid = p_uid;

  if v_dueno is distinct from p_alumno_id then
    return jsonb_build_object('ok', false, 'motivo', 'credencial_de_otro_alumno');
  end if;

  return jsonb_build_object('ok', true, 'motivo', null);
end;
$$;
  ) then
    return jsonb_build_object('ok', false, 'motivo', 'uid_invalido');
  end if;

  if p_tipo is null or p_tipo not in ('tne','credencial_uss') then
    return jsonb_build_object('ok', false, 'motivo', 'tipo_invalido');
  end if;
  if not exists (select 1 from public.alumnos a where a.id = p_alumno_id) then
    return jsonb_build_object('ok', false, 'motivo', 'alumno_no_encontrado');
  end if;

  -- on conflict cubre dos vinculaciones simultáneas de la misma tarjeta.
  insert into public.tarjetas (uid, alumno_id, tipo)
  values (p_uid, p_alumno_id, p_tipo)
  on conflict (uid) do nothing;

  select t.alumno_id into v_dueno from public.tarjetas t where t.uid = p_uid;

  if v_dueno is distinct from p_alumno_id then
    return jsonb_build_object('ok', false, 'motivo', 'credencial_de_otro_alumno');
  end if;

  return jsonb_build_object('ok', true, 'motivo', null);
end;
$$;

create or replace function public.registrar_ingreso(p_uid text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_ocupacion integer;
  v_capacidad integer;
begin
  if not exists (
    select 1 from public.perfiles p
    where p.id = (select auth.uid()) and p.rol in ('profesor', 'admin')
  ) then
    select a.ocupacion, a.capacidad into v_ocupacion, v_capacidad from public.aforo a where a.id = 1;
    return jsonb_build_object(
      'resultado', 'rechazo',
      'motivo', 'sin_permiso',
      'alumno', null,
      'turno', null,
      'ocupacion', coalesce(v_ocupacion, 0),
      'capacidad', coalesce(v_capacidad, 0)
    );
  end if;

  perform 1 from public.aforo where id = 1 for update;
  return privado.registrar_ingreso_en(p_uid, clock_timestamp());
end;
$$;

create or replace function public.registrar_ingreso_codigo(p_codigo text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_alumno uuid;
  v_uid text;
begin
  if not privado.es_profesor_o_admin() then raise exception 'sin_permiso'; end if;
  perform 1 from public.aforo where id = 1 for update;
  delete from privado.codigos_ingreso
  where codigo=upper(btrim(p_codigo)) and vence_en>clock_timestamp() returning alumno_id into v_alumno;
  if not found then raise exception 'codigo_invalido'; end if;
  select uid into v_uid from public.tarjetas where alumno_id=v_alumno
    order by (tipo='tne') desc, uid limit 1 for share;
  if not found then raise exception 'sin_tarjeta'; end if;
  return privado.registrar_ingreso_en(v_uid,clock_timestamp());
end;
$$;

create or replace function public.cerrar_visita(p_visita uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not privado.es_profesor_o_admin() then
    raise exception 'sin_permiso' using detail = 'Solo un profesor o un admin cierra una visita a mano.';
  end if;

  perform 1 from public.aforo where id = 1 for update;
  return privado.cerrar_visita_en(p_visita, clock_timestamp(), (select auth.uid()));
end;
$$;

create or replace function public.actualizar_configuracion(
  p_capacidad                integer,
  p_horario                  jsonb,
  p_cierre_automatico_horas  integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.perfiles p where p.id = (select auth.uid()) and p.rol = 'admin'
  ) then
    raise exception 'sin_permiso' using detail = 'Solo un administrador cambia la configuración.';
  end if;

  perform 1 from public.aforo where id = 1 for update;
  return privado.actualizar_configuracion_en(p_capacidad, p_horario, p_cierre_automatico_horas, clock_timestamp());
end;
$$;

-- También ordena las modificaciones directas de configuración hechas por el propietario.
create or replace function privado.bloquear_configuracion_aforo()
returns trigger language plpgsql set search_path = '' as $$
begin
  perform 1 from public.aforo where id = 1 for update;
  return null;
end;
$$;
drop trigger if exists configuracion_bloquea_aforo on public.configuracion;
create trigger configuracion_bloquea_aforo before update on public.configuracion
  for each statement execute function privado.bloquear_configuracion_aforo();

create or replace function privado.al_cambiar_configuracion()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform privado.sincronizar_aforo(coalesce(
    nullif(current_setting('aforofit.hora_configuracion', true), '')::timestamptz,
    clock_timestamp()));
  return null;
end;
$$;

-- Cron corre como el propietario que instala 019, no como un usuario web.
create or replace function privado.procesar_aforo_programado()
returns void language plpgsql set search_path = '' as $$
begin
  perform 1 from public.aforo where id = 1 for update;
  perform privado.sincronizar_aforo(clock_timestamp());
end;
$$;

revoke all on function privado.bloquear_configuracion_aforo(), privado.procesar_aforo_programado()
  from public, anon, authenticated;
revoke all on function privado.sincronizar_aforo(timestamptz),
  privado.registrar_ingreso_en(text,timestamptz),
  privado.actualizar_configuracion_en(integer,jsonb,integer,timestamptz),
  privado.al_cambiar_configuracion() from public, anon, authenticated;

create extension if not exists pg_cron;
select cron.schedule('aforofit-reconciliar-aforo', '* * * * *',
  'select privado.procesar_aforo_programado()');
select cron.alter_job(jobid, active := true) from cron.job
  where jobname = 'aforofit-reconciliar-aforo' and username = current_user;

commit;
