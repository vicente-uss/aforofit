-- CR-02: el lector, el QR y el RUT convergen en la misma transacción de acceso.
begin;

create table privado.autorizaciones_acceso (
  id uuid primary key default gen_random_uuid(),
  persona_id uuid not null references public.alumnos(id),
  profesor_id uuid references public.perfiles(id) on delete set null,
  motivo text not null check (motivo in ('pendiente', 'vencido')),
  creado_en timestamptz not null,
  turno_id uuid unique references public.turnos(id),
  visita_id uuid unique references public.visitas(id),
  check (turno_id is not null or visita_id is not null)
);
alter table privado.autorizaciones_acceso enable row level security;
create index autorizaciones_acceso_persona_idx on privado.autorizaciones_acceso(persona_id);
create index autorizaciones_acceso_profesor_idx on privado.autorizaciones_acceso(profesor_id);

create function privado.registrar_acceso_persona(
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
  v_sin_documento boolean;
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

  select exists (select 1 from privado.inscripciones
    where persona_id = v_alumno.id and medico is null and not vigencia_legada) into v_sin_documento;
  if v_alumno.tipo_persona <> 'deportista_destacado'
     and (v_sin_documento or v_alumno.certificado_hasta is null or v_alumno.certificado_hasta < v_hoy) then
    v_motivo := case when v_sin_documento or v_alumno.certificado_hasta is null then 'pendiente' else 'vencido' end;
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

-- Conserva la firma utilizada por NFC, QR y las pruebas históricas.
create or replace function privado.registrar_ingreso_en(p_uid text, p_ahora timestamptz default now())
returns jsonb language plpgsql set search_path = '' as $$
declare
  v_persona uuid;
begin
  perform 1 from public.aforo where id = 1 for update;
  select alumno_id into v_persona from public.tarjetas where uid = p_uid;
  return privado.registrar_acceso_persona(v_persona, 'credencial_no_registrada', p_ahora, null);
end;
$$;

create function public.registrar_ingreso_rut(p_rut text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_rut text := upper(btrim(p_rut));
  v_persona uuid;
  v_coincidencias integer;
begin
  if not privado.es_profesor_o_admin() then raise exception 'sin_permiso' using errcode = '42501'; end if;
  if not coalesce(privado.rut_valido(v_rut), false) then raise exception 'rut_invalido'; end if;

  perform 1 from public.aforo where id = 1 for update;
  select count(*), (array_agg(id))[1] into v_coincidencias, v_persona
  from public.alumnos where upper(replace(rut, '.', '')) = v_rut;
  if v_coincidencias > 1 then raise exception 'rut_duplicado'; end if;
  return privado.registrar_acceso_persona(v_persona, 'rut_no_registrado', clock_timestamp(), null);
end;
$$;

create function public.autorizar_acceso_excepcional(p_persona uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if not privado.es_profesor() then raise exception 'sin_permiso' using errcode = '42501'; end if;
  perform 1 from public.aforo where id = 1 for update;
  return privado.registrar_acceso_persona(p_persona, 'persona_no_encontrada', clock_timestamp(), auth.uid());
end;
$$;

revoke all on function privado.registrar_acceso_persona(uuid,text,timestamptz,uuid),
  public.registrar_ingreso_rut(text), public.autorizar_acceso_excepcional(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.registrar_ingreso_rut(text), public.autorizar_acceso_excepcional(uuid) to authenticated;

commit;
