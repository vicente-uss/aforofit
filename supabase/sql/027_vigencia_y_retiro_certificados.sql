-- CR-02: criterio clínico compartido y retiro de archivos mediante Storage.
begin;

create function privado.vigencia_certificado(p_persona public.alumnos, p_hoy date)
returns table (estado text, emision date, hasta date, editable_admin boolean)
language sql stable set search_path = '' as $$
  with condicion as (
    select (p_persona).tipo_persona = 'deportista_destacado' as exento,
      i.persona_id is null or i.vigencia_legada as historico,
      i.medico is not null as adjunto
    from (values ((p_persona).id)) as p(id)
    left join privado.inscripciones i on i.persona_id = p.id
  )
  select case
      when exento then 'exento'
      when not (historico or adjunto) or (p_persona).certificado_hasta is null then 'pendiente'
      when (p_persona).certificado_hasta < p_hoy then 'vencido'
      else 'vigente'
    end,
    case when not exento and (historico or adjunto) then (p_persona).certificado_emision end,
    case when not exento and (historico or adjunto) then (p_persona).certificado_hasta end,
    not exento and historico
  from condicion;
$$;

create or replace function public.leer_inscripcion(p_persona uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not privado.es_profesor() then raise exception 'sin_permiso' using errcode = '42501'; end if;
  return (
    select jsonb_build_object(
      'id', a.id, 'nombre', a.nombre, 'rut', a.rut, 'carrera', a.carrera,
      'tipo_persona', a.tipo_persona, 'estado_certificado', v.estado,
      'certificado_emision', v.emision, 'certificado_hasta', v.hasta
    ) || coalesce(to_jsonb(i) - 'persona_id' - 'vigencia_legada', '{}'::jsonb)
    from public.alumnos a
    left join privado.inscripciones i on i.persona_id = a.id
    cross join lateral privado.vigencia_certificado(a, (now() at time zone 'America/Santiago')::date) v
    where a.id = p_persona
  );
end;
$$;

create function public.leer_habilitacion(p_alumno uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.perfiles where id = (select auth.uid()) and rol = 'admin') then
    raise exception 'sin_permiso' using errcode = '42501';
  end if;
  return (
    select jsonb_build_object(
      'estado_certificado', v.estado, 'certificado_emision', v.emision,
      'certificado_hasta', v.hasta, 'editable_admin', v.editable_admin
    )
    from public.alumnos a
    cross join lateral privado.vigencia_certificado(a, (now() at time zone 'America/Santiago')::date) v
    where a.id = p_alumno
  );
end;
$$;

-- Conserva el contrato de 015 para vigencias históricas. Las fichas con adjuntos
-- editan su fecha y archivo juntos desde Inscripciones.
create or replace function public.registrar_habilitacion(p_alumno uuid, p_emision date)
returns date language plpgsql security definer set search_path = '' as $$
declare
  v_persona public.alumnos%rowtype;
  v_estado text;
  v_editable boolean;
  v_hasta date;
  v_hoy date := (now() at time zone 'America/Santiago')::date;
begin
  if not exists (select 1 from public.perfiles where id = (select auth.uid()) and rol = 'admin') then
    raise exception 'sin_permiso';
  end if;
  if p_emision is null or not isfinite(p_emision) or p_emision > v_hoy then
    raise exception 'emision_invalida';
  end if;

  select * into v_persona from public.alumnos where id = p_alumno for update;
  if not found then raise exception 'alumno_no_encontrado'; end if;
  select estado, editable_admin into v_estado, v_editable
    from privado.vigencia_certificado(v_persona, v_hoy);
  if v_estado = 'exento' then raise exception 'certificado_exento'; end if;
  if not v_editable then raise exception 'certificado_gestionado_en_inscripcion'; end if;

  v_hasta := (p_emision + interval '12 months')::date;
  update public.alumnos set certificado_emision = p_emision, certificado_hasta = v_hasta where id = p_alumno;
  update privado.inscripciones set version = gen_random_uuid() where persona_id = p_alumno;
  return v_hasta;
end;
$$;

create or replace function privado.registrar_acceso_persona(
  p_persona uuid, p_no_encontrado text, p_ahora timestamptz, p_autoriza uuid
)
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
  v_autorizacion uuid;
  v_visita_nueva boolean := false;
  v_motivo text;
begin
  perform 1 from public.aforo where id = 1 for update;
  select * into strict v_config from public.configuracion where id = 1;

  -- Vencimientos y reservas se reconcilian también desde Cron.
  v_fila := privado.sincronizar_aforo(p_ahora);

  select * into v_alumno from public.alumnos where id = p_persona for share;
  if not found then
    return privado.respuesta_ingreso('rechazo', p_no_encontrado, null, null, p_ahora);
  end if;

  -- Regla 5: con una visita abierta, esta pasada es la salida.
  select v.id into v_visita from public.visitas v
  where v.alumno_id = v_alumno.id and v.salida is null;

  if found then
    if p_autoriza is not null then
      return privado.respuesta_ingreso('rechazo', 'visita_ya_abierta', v_alumno, null, p_ahora);
    end if;
    update public.visitas set salida = p_ahora where id = v_visita;
    return privado.respuesta_ingreso('salida', null, v_alumno, null, p_ahora);
  end if;

  select t.* into v_turno from public.turnos t
  where t.alumno_id = v_alumno.id
    and t.estado in ('esperando', 'llamado')
    and (t.creado_en at time zone 'America/Santiago')::date = v_hoy;

  select estado into v_motivo from privado.vigencia_certificado(v_alumno, v_hoy);
  if v_motivo in ('pendiente', 'vencido') then
    select id into v_autorizacion from privado.autorizaciones_acceso
    where turno_id = v_turno.id and visita_id is null;
    if v_autorizacion is null and p_autoriza is null then
      return privado.respuesta_ingreso('rechazo', 'certificado_no_vigente', v_alumno, null, p_ahora)
        || jsonb_build_object('estado_certificado', v_motivo);
    end if;
  elsif p_autoriza is not null then
    return privado.respuesta_ingreso('rechazo', 'autorizacion_no_requerida', v_alumno, null, p_ahora);
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

  -- Regla 4: el turno llamado conserva su reserva. Un ingreso nuevo respeta toda la fila.
  if v_turno.estado = 'llamado' and v_fila.ocupacion < v_config.capacidad then
    update public.turnos set estado = 'usado' where id = v_turno.id;
    v_visita_nueva := true;
  elsif v_turno.id is null then
    v_visita_nueva := v_fila.ocupacion + (
      select count(*) from public.turnos t
      where t.estado = 'llamado' and (t.creado_en at time zone 'America/Santiago')::date = v_hoy
    ) < v_config.capacidad and v_fila.en_espera = 0;

    if not v_visita_nueva then
      select coalesce(max(t.numero), 0) + 1 into v_numero from public.turnos t
      where (t.creado_en at time zone 'America/Santiago')::date = v_hoy;

      insert into public.turnos (alumno_id, numero, estado, creado_en)
      values (v_alumno.id, v_numero, 'esperando', p_ahora) returning * into v_turno;
    end if;
  end if;

  if v_visita_nueva then
    insert into public.visitas (alumno_id, entrada) values (v_alumno.id, p_ahora) returning id into v_visita;
  end if;

  if v_autorizacion is not null and v_visita_nueva then
    update privado.autorizaciones_acceso set visita_id = v_visita where id = v_autorizacion;
  elsif p_autoriza is not null and v_autorizacion is null then
    insert into privado.autorizaciones_acceso (persona_id, profesor_id, motivo, creado_en, turno_id, visita_id)
    values (v_alumno.id, p_autoriza, v_motivo, p_ahora, v_turno.id, v_visita);
  end if;

  if v_visita_nueva then
    return privado.respuesta_ingreso('entrada', null, v_alumno, null, p_ahora);
  end if;
  return privado.respuesta_ingreso('turno', null, v_alumno, v_turno.numero, p_ahora);
end;
$$;

-- La marca de retiro es duradera. Evita volver a asociar un archivo que ya pudo
-- haberse entregado a la API de Storage para borrarlo.
create table privado.certificados_retirados (
  ruta text primary key,
  retirado_en timestamptz not null default now()
);
alter table privado.certificados_retirados enable row level security;

create function privado.encolar_certificados_reemplazados()
returns trigger language plpgsql set search_path = '' as $$
begin
  insert into privado.certificados_retirados (ruta)
  select ruta from unnest(array[old.medico, old.alumno_regular]) as anterior(ruta)
  where ruta is not null and not exists (
    select 1 from privado.inscripciones i where i.medico = ruta or i.alumno_regular = ruta
  )
  on conflict do nothing;
  return null;
end;
$$;

create trigger retirar_certificados_reemplazados
after update of medico, alumno_regular or delete on privado.inscripciones
for each row execute function privado.encolar_certificados_reemplazados();

create or replace function privado.archivo_certificado(p_ruta text)
returns boolean language sql stable set search_path = '' as $$
  select not exists (select 1 from privado.certificados_retirados where ruta = p_ruta) and exists (
    select 1 from storage.objects
    where bucket_id = 'certificados' and name = p_ruta
      and (storage.foldername(name))[1] = (select auth.uid())::text
      and (metadata ->> 'size')::bigint between 1 and 10485760
      and metadata ->> 'mimetype' in ('application/pdf', 'image/jpeg', 'image/png')
  );
$$;

create or replace function privado.certificado_sin_referencia(p_ruta text)
returns boolean language sql stable security definer set search_path = '' as $$
  select privado.es_profesor() and
    exists (select 1 from privado.certificados_retirados where ruta = p_ruta) and
    not exists (select 1 from privado.inscripciones where medico = p_ruta or alumno_regular = p_ruta);
$$;

create function public.descartar_cargas_certificados(p_rutas text[])
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not privado.es_profesor() then raise exception 'sin_permiso' using errcode = '42501'; end if;
  if coalesce(cardinality(p_rutas), 0) > 2 then raise exception 'demasiadas_rutas'; end if;
  -- Mismo bloqueo de guardar_inscripcion: nadie puede adoptar una carga que
  -- se está descartando, y descartar una ruta adoptada no hace nada.
  perform pg_advisory_xact_lock(25001);
  insert into privado.certificados_retirados (ruta)
  select o.name from storage.objects o
  where o.bucket_id = 'certificados' and o.name = any(p_rutas)
    and (storage.foldername(o.name))[1] = (select auth.uid())::text
    and not exists (select 1 from privado.inscripciones i where i.medico = o.name or i.alumno_regular = o.name)
  on conflict do nothing;
end;
$$;

create function public.certificados_pendientes_de_retiro()
returns setof text language plpgsql stable security definer set search_path = '' as $$
begin
  if not privado.es_profesor() then raise exception 'sin_permiso' using errcode = '42501'; end if;
  return query
    select r.ruta
    from privado.certificados_retirados r
    join storage.objects o on o.bucket_id = 'certificados' and o.name = r.ruta
    where not exists (select 1 from privado.inscripciones i where i.medico = r.ruta or i.alumno_regular = r.ruta)
    order by r.retirado_en, r.ruta limit 100;
end;
$$;

revoke all on function privado.vigencia_certificado(public.alumnos,date),
  privado.encolar_certificados_reemplazados(), public.leer_habilitacion(uuid),
  public.descartar_cargas_certificados(text[]), public.certificados_pendientes_de_retiro()
  from public, anon, authenticated, service_role;
grant execute on function public.leer_habilitacion(uuid), public.descartar_cargas_certificados(text[]),
  public.certificados_pendientes_de_retiro() to authenticated;

commit;
