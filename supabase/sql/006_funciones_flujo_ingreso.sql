-- 006_funciones_flujo_ingreso.sql
-- AforoFit · Avance 3 · Funciones del flujo central (reglas de negocio 1 a 6).
-- Requiere 005_tablas_flujo_ingreso.sql. Contrato: docs/contrato-flujo-ingreso.md.
-- Ejecutar en Supabase → SQL Editor. Se puede ejecutar más de una vez.

-- 1. Sincroniza el aforo: llama a los turnos que caben y actualiza la fila pública ----
create or replace function privado.sincronizar_aforo(p_ahora timestamptz default now())
returns public.aforo
language plpgsql
set search_path = ''
as $$
declare
  v_config    public.configuracion%rowtype;
  v_fila      public.aforo%rowtype;
  v_hoy       date := (p_ahora at time zone 'America/Santiago')::date;
  v_ocupacion integer;
  v_llamados  integer;
begin
  -- El bloqueo ordena las lecturas simultáneas: nadie toma el mismo cupo ni el mismo número.
  perform 1 from public.aforo where id = 1 for update;
  select * into strict v_config from public.configuracion where id = 1;

  select count(*) into v_ocupacion from public.visitas where salida is null;
  select count(*) into v_llamados from public.turnos
  where estado = 'llamado' and (creado_en at time zone 'America/Santiago')::date = v_hoy;

  -- Cada cupo libre llama al siguiente turno, en orden de llegada (regla 4).
  update public.turnos t
  set estado = 'llamado', llamado_en = p_ahora
  where t.id in (
    select s.id from public.turnos s
    where s.estado = 'esperando'
      and (s.creado_en at time zone 'America/Santiago')::date = v_hoy
    order by s.numero
    limit greatest(v_config.capacidad - v_ocupacion - v_llamados, 0)
  );

  update public.aforo a
  set ocupacion = v_ocupacion,
      capacidad = v_config.capacidad,
      -- Si hay varios llamados, la pantalla muestra el más antiguo.
      turno_llamado = (
        select min(t.numero) from public.turnos t
        where t.estado = 'llamado' and (t.creado_en at time zone 'America/Santiago')::date = v_hoy
      ),
      en_espera = (
        select count(*) from public.turnos t
        where t.estado = 'esperando' and (t.creado_en at time zone 'America/Santiago')::date = v_hoy
      ),
      umbral_casi_lleno = v_config.umbral_casi_lleno,
      actualizado_en = p_ahora
  where a.id = 1
  returning * into strict v_fila;

  return v_fila;
end;
$$;

-- 2. Arma la respuesta del contrato con el aforo ya actualizado -----------------------
create or replace function privado.respuesta_ingreso(
  p_resultado text,
  p_motivo    text,
  p_alumno    public.alumnos,
  p_turno     integer,
  p_ahora     timestamptz
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_fila public.aforo%rowtype;
begin
  v_fila := privado.sincronizar_aforo(p_ahora);
  return jsonb_build_object(
    'resultado', p_resultado,
    'motivo', p_motivo,
    'alumno', case when p_alumno.id is null then null
                   else jsonb_build_object('id', p_alumno.id, 'nombre', p_alumno.nombre) end,
    'turno', p_turno,
    'ocupacion', v_fila.ocupacion,
    'capacidad', v_fila.capacidad
  );
end;
$$;

-- 3. Lógica del ingreso, con la hora como parámetro para poder probarla ---------------
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

  -- Regla 2: certificado vigente y fecha dentro del período académico.
  if v_alumno.certificado_hasta is null or v_alumno.certificado_hasta < v_hoy then
    return privado.respuesta_ingreso('rechazo', 'certificado_no_vigente', v_alumno, null, p_ahora);
  end if;

  if v_hoy not between v_config.periodo_inicio and v_config.periodo_fin then
    return privado.respuesta_ingreso('rechazo', 'fuera_de_periodo', v_alumno, null, p_ahora);
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

-- 4. Punto de entrada del lector: exige rol de profesor o admin -----------------------
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

  return privado.registrar_ingreso_en(p_uid, now());
end;
$$;

-- 5. Vincula una credencial a un alumno (regla 1, CU11) -------------------------------
-- El contrato no recibe el tipo: se registra como 'tne', la credencial principal (D17).
create or replace function public.vincular_credencial(p_uid text, p_alumno_id uuid)
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

  if not exists (select 1 from public.alumnos a where a.id = p_alumno_id) then
    return jsonb_build_object('ok', false, 'motivo', 'alumno_no_encontrado');
  end if;

  -- on conflict cubre dos vinculaciones simultáneas de la misma tarjeta.
  insert into public.tarjetas (uid, alumno_id, tipo)
  values (p_uid, p_alumno_id, 'tne')
  on conflict (uid) do nothing;

  select t.alumno_id into v_dueno from public.tarjetas t where t.uid = p_uid;

  if v_dueno is distinct from p_alumno_id then
    return jsonb_build_object('ok', false, 'motivo', 'credencial_de_otro_alumno');
  end if;

  return jsonb_build_object('ok', true, 'motivo', null);
end;
$$;

-- 6. Si el administrador cambia un parámetro, la fila pública lo refleja --------------
create or replace function privado.al_cambiar_configuracion()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform privado.sincronizar_aforo(now());
  return null;
end;
$$;

drop trigger if exists configuracion_sincroniza_aforo on public.configuracion;
create trigger configuracion_sincroniza_aforo
  after update on public.configuracion
  for each row execute function privado.al_cambiar_configuracion();

-- 7. Permisos de ejecución (contrato, sección 3) --------------------------------------
revoke all on function privado.sincronizar_aforo(timestamptz) from public, anon, authenticated;
revoke all on function privado.respuesta_ingreso(text, text, public.alumnos, integer, timestamptz) from public, anon, authenticated;
revoke all on function privado.registrar_ingreso_en(text, timestamptz) from public, anon, authenticated;
revoke all on function privado.al_cambiar_configuracion() from public, anon, authenticated;

revoke execute on function public.registrar_ingreso(text) from public, anon;
grant execute on function public.registrar_ingreso(text) to authenticated;

revoke execute on function public.vincular_credencial(text, uuid) from public, anon;
grant execute on function public.vincular_credencial(text, uuid) to authenticated;
