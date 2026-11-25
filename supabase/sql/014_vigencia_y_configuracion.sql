-- 014_vigencia_y_configuracion.sql
-- AforoFit · Entrega final · F-32 (D20, regla 2) y F-09 (D24, RNF08: configuración mínima del admin).
-- Requiere 001 a 012. Ejecutar en Supabase → SQL Editor. Se puede ejecutar más de una vez.
-- 013 queda reservado para F-29 (turno con nombre).
--
-- Errores: como en 011 y 012, «raise exception» con un código corto en el mensaje (sin_permiso,
-- capacidad_invalida, …) y la explicación en el detalle.

-- 1. F-32 · Regla 2 sin período académico (D20) ------------------------------------------
-- Misma función de 006 (la versión vigente: 011 y 012 no la cambian) sin el rechazo «fuera_de_periodo».
-- Nada más cambia en su lógica.
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

  -- Regla 6: cierre automático de visitas y expiración de turnos llamados.
  update public.visitas
  set salida = entrada + make_interval(hours => v_config.cierre_automatico_horas),
      cierre_automatico = true
  where salida is null
    and entrada <= p_ahora - make_interval(hours => v_config.cierre_automatico_horas);

  update public.turnos
  set estado = 'expirado'
  where estado = 'llamado'
    and llamado_en <= p_ahora - make_interval(mins => v_config.turno_expira_minutos);

  -- Los cupos liberados llaman al siguiente turno antes de evaluar a este alumno.
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

  if found and v_turno.estado = 'llamado' then
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

-- Las columnas del período quedan, pero ya no se usan (no se borran para no romper datos ni scripts).
comment on column public.configuracion.periodo_inicio is
  'Sin uso desde D20 (24 nov 2026): el certificado dura un año desde su emisión. Se conserva por historial.';
comment on column public.configuracion.periodo_fin is
  'Sin uso desde D20 (24 nov 2026): el certificado dura un año desde su emisión. Se conserva por historial.';

-- 2. F-09 · Rangos de la configuración también en la tabla ---------------------------------
-- Capacidad de 1 a 100 y cierre automático de 1 a 12 horas (D24). La función de abajo los valida con
-- un error claro; los check son la segunda barrera.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'configuracion_capacidad_rango') then
    alter table public.configuracion
      add constraint configuracion_capacidad_rango check (capacidad between 1 and 100);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'configuracion_cierre_rango') then
    alter table public.configuracion
      add constraint configuracion_cierre_rango check (cierre_automatico_horas between 1 and 12);
  end if;
end;
$$;

-- El horario guardado (005) trae apertura y último ingreso. Se agrega la hora de cierre a los días
-- abiertos que no la tienen: una hora después del último ingreso, como en el gimnasio real
-- (lunes a viernes 21:00 → 22:00, sábado 13:00 → 14:00). registrar_ingreso solo usa apertura y
-- último ingreso (regla 3); el cierre es informativo.
update public.configuracion c
set horario = (
  select jsonb_object_agg(
    d.dia,
    case
      when jsonb_typeof(d.franja) = 'object' and not (d.franja ? 'cierre') then
        d.franja || jsonb_build_object(
          'cierre', to_char(least((d.franja ->> 'ultimo_ingreso')::time + interval '1 hour', time '23:59'), 'HH24:MI'))
      else d.franja
    end)
  from jsonb_each(c.horario) as d(dia, franja)
)
where c.id = 1
  and exists (
    select 1 from jsonb_each(c.horario) as d(dia, franja)
    where jsonb_typeof(d.franja) = 'object' and not (d.franja ? 'cierre'));

-- 3. Validación del horario ---------------------------------------------------------------
-- Recibe un objeto con los 7 días. Cada día es null (cerrado) o {apertura, cierre, ultimo_ingreso}
-- en formato HH:MM, con apertura < ultimo_ingreso <= cierre. Devuelve el horario limpio (solo esas
-- tres claves por día) o lanza horario_invalido con el día que falla.
create or replace function privado.validar_horario(p_horario jsonb)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  c_dias constant text[] := array['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  c_hora constant text := '^([01][0-9]|2[0-3]):[0-5][0-9]$';
  v_dia     text;
  v_franja  jsonb;
  v_ap      text;
  v_ci      text;
  v_ul      text;
  v_limpio  jsonb := '{}'::jsonb;
begin
  if p_horario is null or jsonb_typeof(p_horario) <> 'object' then
    raise exception 'horario_invalido' using detail = 'El horario debe ser un objeto con los 7 días.';
  end if;
  if exists (select 1 from jsonb_object_keys(p_horario) k where k <> all (c_dias)) then
    raise exception 'horario_invalido' using detail = 'El horario tiene un día desconocido.';
  end if;

  foreach v_dia in array c_dias loop
    if not (p_horario ? v_dia) then
      raise exception 'horario_invalido' using detail = format('Falta el día %s.', v_dia);
    end if;
    v_franja := p_horario -> v_dia;

    if jsonb_typeof(v_franja) = 'null' then
      v_limpio := v_limpio || jsonb_build_object(v_dia, null);  -- cerrado
      continue;
    end if;
    if jsonb_typeof(v_franja) <> 'object' then
      raise exception 'horario_invalido' using detail = format('El %s debe estar cerrado o tener horas.', v_dia);
    end if;

    v_ap := v_franja ->> 'apertura';
    v_ci := v_franja ->> 'cierre';
    v_ul := v_franja ->> 'ultimo_ingreso';
    if v_ap is null or v_ci is null or v_ul is null
       or v_ap !~ c_hora or v_ci !~ c_hora or v_ul !~ c_hora then
      raise exception 'horario_invalido'
        using detail = format('El %s necesita apertura, cierre y último ingreso en formato HH:MM.', v_dia);
    end if;
    if not (v_ap::time < v_ul::time and v_ul::time <= v_ci::time) then
      raise exception 'horario_invalido'
        using detail = format('El %s debe cumplir apertura < último ingreso <= cierre.', v_dia);
    end if;

    v_limpio := v_limpio || jsonb_build_object(
      v_dia, jsonb_build_object('apertura', v_ap, 'cierre', v_ci, 'ultimo_ingreso', v_ul));
  end loop;

  return v_limpio;
end;
$$;

-- 4. Actualizar la configuración (F-09, D24) ----------------------------------------------
-- Lógica con la hora como parámetro, para probarla; el chequeo de rol está en la función pública.
-- Período académico (D20), progresión y modalidades no se editan aquí: limitación declarada (D24).
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
begin
  if p_capacidad is null or p_capacidad not between 1 and 100 then
    raise exception 'capacidad_invalida' using detail = 'La capacidad debe estar entre 1 y 100 personas.';
  end if;
  if p_cierre_automatico_horas is null or p_cierre_automatico_horas not between 1 and 12 then
    raise exception 'cierre_invalido' using detail = 'El cierre automático debe estar entre 1 y 12 horas.';
  end if;
  v_horario := privado.validar_horario(p_horario);

  select * into strict v_anterior from public.configuracion where id = 1 for update;

  -- El trigger configuracion_sincroniza_aforo (006) también sincroniza con now() en cada update.
  update public.configuracion
  set capacidad = p_capacidad,
      horario = v_horario,
      cierre_automatico_horas = p_cierre_automatico_horas
  where id = 1;

  -- Si cambió la capacidad, la fila pública se recalcula al tiro: al subirla se llaman los turnos que
  -- caben; al bajarla nadie sale (las visitas abiertas siguen) y los que lleguen reciben turno.
  if p_capacidad <> v_anterior.capacidad then
    v_fila := privado.sincronizar_aforo(p_ahora);
  else
    select * into strict v_fila from public.aforo where id = 1;
  end if;

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

  return privado.actualizar_configuracion_en(p_capacidad, p_horario, p_cierre_automatico_horas, now());
end;
$$;

-- 5. Sin escritura directa en configuracion -------------------------------------------------
-- 007 dejaba al admin hacer update directo (política configuracion_editar_admin + grant update).
-- Ahora todo cambio pasa por actualizar_configuracion, que valida los rangos. Revisado: ninguna
-- pantalla escribe directo en la tabla; la lectura (configuracion_leer) se mantiene.
drop policy if exists "configuracion_editar_admin" on public.configuracion;
revoke insert, update, delete on public.configuracion from anon, authenticated;

-- 6. Permisos de ejecución ------------------------------------------------------------------
revoke all on function privado.validar_horario(jsonb) from public, anon, authenticated;
revoke all on function privado.actualizar_configuracion_en(integer, jsonb, integer, timestamptz)
  from public, anon, authenticated;

revoke execute on function public.actualizar_configuracion(integer, jsonb, integer) from public, anon;
grant execute on function public.actualizar_configuracion(integer, jsonb, integer) to authenticated;

-- Verificación: horario con cierre en los días abiertos y domingo cerrado.
select capacidad, cierre_automatico_horas, horario from public.configuracion where id = 1;
