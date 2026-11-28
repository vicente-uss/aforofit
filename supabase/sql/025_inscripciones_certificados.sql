-- CR-02: amplía la identidad existente y reserva la ficha y archivos al profesor.
begin;

alter table public.alumnos add column tipo_persona text not null default 'estudiante'
  check (tipo_persona in ('estudiante', 'funcionario_colaborador', 'deportista_destacado'));

create table privado.inscripciones (
  persona_id uuid primary key references public.alumnos(id) on delete cascade,
  correo text not null check (correo ~ '^[a-z0-9_%+-]+(\.[a-z0-9_%+-]+)*@(uss\.cl|correo\.uss\.cl)$'),
  nacimiento date not null,
  telefono text not null check (telefono ~ '^\+569[0-9]{8}$'),
  contacto_emergencia text not null check (length(contacto_emergencia) between 1 and 160),
  telefono_emergencia text not null check (telefono_emergencia ~ '^\+569[0-9]{8}$'),
  antecedentes text not null check (length(antecedentes) <= 4000),
  medico text unique,
  alumno_regular text unique,
  vigencia_legada boolean not null,
  version uuid not null default gen_random_uuid()
);
alter table privado.inscripciones enable row level security;

create function privado.es_profesor()
returns boolean language sql stable set search_path = '' as $$
  select exists (select 1 from public.perfiles where id = (select auth.uid()) and rol = 'profesor');
$$;

create function privado.rut_valido(p_rut text)
returns boolean language plpgsql immutable strict set search_path = '' as $$
declare
  v_suma integer := 0;
  v_dv integer;
  v_cuerpo text := split_part(p_rut, '-', 1);
begin
  if p_rut !~ '^[1-9][0-9]{0,7}-[0-9K]$' then return false; end if;
  for i in 1..length(v_cuerpo) loop
    v_suma := v_suma + substr(v_cuerpo, length(v_cuerpo) - i + 1, 1)::integer * (2 + (i - 1) % 6);
  end loop;
  v_dv := (11 - v_suma % 11) % 11;
  return right(p_rut, 1) = case when v_dv = 10 then 'K' else v_dv::text end;
end;
$$;

-- También reconoce RUT históricos válidos guardados con puntos, sin reescribir datos.
create index alumnos_rut_compat_idx on public.alumnos ((upper(replace(rut, '.', ''))));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('certificados', 'certificados', false, 10485760,
        array['application/pdf', 'image/jpeg', 'image/png']);

create policy certificados_profesor_leer on storage.objects for select to authenticated
using (bucket_id = 'certificados' and (select privado.es_profesor()));

create policy certificados_profesor_subir on storage.objects for insert to authenticated
with check (
  bucket_id = 'certificados' and (select privado.es_profesor())
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and storage.filename(name) ~ '^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$'
  and cardinality(storage.foldername(name)) = 1
);

create function privado.archivo_certificado(p_ruta text)
returns boolean language sql stable set search_path = '' as $$
  select exists (
    select 1 from storage.objects
    where bucket_id = 'certificados' and name = p_ruta
      and (storage.foldername(name))[1] = (select auth.uid())::text
      and (metadata ->> 'size')::bigint between 1 and 10485760
      and metadata ->> 'mimetype' in ('application/pdf', 'image/jpeg', 'image/png')
  );
$$;

-- Permite retirar una carga propia que todavía no está asociada a una ficha.
create function privado.certificado_sin_referencia(p_ruta text)
returns boolean language sql stable security definer set search_path = '' as $$
  select privado.es_profesor() and
    split_part(p_ruta, '/', 1) = (select auth.uid())::text and
    not exists (select 1 from privado.inscripciones where medico = p_ruta or alumno_regular = p_ruta);
$$;

create policy certificados_profesor_limpiar on storage.objects for delete to authenticated
using (bucket_id = 'certificados' and privado.certificado_sin_referencia(name));

create function public.leer_inscripcion(p_persona uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not privado.es_profesor() then raise exception 'sin_permiso' using errcode = '42501'; end if;
  return (
    select jsonb_build_object(
      'id', a.id, 'nombre', a.nombre, 'rut', a.rut, 'carrera', a.carrera,
      'tipo_persona', a.tipo_persona,
      'certificado_emision', case when i.medico is not null or i.vigencia_legada is distinct from false
        then a.certificado_emision end,
      'certificado_hasta', case when i.medico is not null or i.vigencia_legada is distinct from false
        then a.certificado_hasta end
    ) || coalesce(to_jsonb(i) - 'persona_id' - 'vigencia_legada', '{}'::jsonb)
    from public.alumnos a left join privado.inscripciones i on i.persona_id = a.id
    where a.id = p_persona
  );
end;
$$;

create function public.guardar_inscripcion(p_persona uuid, p_ficha jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid := p_persona;
  v_anterior public.alumnos%rowtype;
  v_previa privado.inscripciones%rowtype;
  v_nombre text := btrim(p_ficha ->> 'nombre');
  v_rut text := upper(btrim(p_ficha ->> 'rut'));
  v_tipo text := p_ficha ->> 'tipo_persona';
  v_carrera text := nullif(btrim(p_ficha ->> 'carrera'), '');
  v_emision date;
  v_hasta date;
  v_nacimiento date;
  v_medico text := p_ficha ->> 'medico';
  v_regular text := p_ficha ->> 'alumno_regular';
  v_telefono text := regexp_replace(p_ficha ->> 'telefono', '[[:space:]]', '', 'g');
  v_telefono_emergencia text := regexp_replace(p_ficha ->> 'telefono_emergencia', '[[:space:]]', '', 'g');
  v_hoy date := (now() at time zone 'America/Santiago')::date;
  v_vigencia_legada boolean := false;
begin
  if not privado.es_profesor() then raise exception 'sin_permiso' using errcode = '42501'; end if;

  -- Serializa cambios de inscripción y evita duplicar un RUT histórico con puntos.
  perform pg_advisory_xact_lock(25001);
  if p_persona is not null then
    select * into v_anterior from public.alumnos where id = p_persona for update;
    if not found then raise exception 'persona_no_encontrada'; end if;
    select * into v_previa from privado.inscripciones where persona_id = p_persona;
    if (p_ficha ->> 'version') is distinct from v_previa.version::text then
      raise exception 'ficha_desactualizada';
    end if;
  end if;

  if not coalesce(privado.rut_valido(v_rut), false) then raise exception 'rut_invalido'; end if;
  if exists (select 1 from public.alumnos where upper(replace(rut, '.', '')) = v_rut
    and id is distinct from p_persona) then raise exception 'rut_duplicado'; end if;
  if coalesce(length(v_nombre), 0) not between 1 and 160 then raise exception 'nombre_invalido'; end if;
  if v_tipo is null or v_tipo not in ('estudiante', 'funcionario_colaborador', 'deportista_destacado') then
    raise exception 'tipo_invalido';
  end if;
  if v_tipo = 'estudiante' and coalesce(length(v_carrera), 0) not between 1 and 160 then
    raise exception 'carrera_requerida';
  end if;
  if v_tipo <> 'estudiante' then v_carrera := null; v_regular := null; end if;
  if coalesce(lower(btrim(p_ficha ->> 'correo')), '') !~ '^[a-z0-9_%+-]+(\.[a-z0-9_%+-]+)*@(uss\.cl|correo\.uss\.cl)$' then
    raise exception 'correo_invalido';
  end if;
  v_nacimiento := nullif(p_ficha ->> 'nacimiento', '')::date;
  if v_nacimiento is null or not isfinite(v_nacimiento) or v_nacimiento >= v_hoy then
    raise exception 'nacimiento_invalido';
  end if;
  if coalesce(v_telefono, '') !~ '^\+569[0-9]{8}$'
    or coalesce(v_telefono_emergencia, '') !~ '^\+569[0-9]{8}$' then
    raise exception 'telefono_invalido';
  end if;
  if coalesce(length(btrim(p_ficha ->> 'contacto_emergencia')), 0) not between 1 and 160 then
    raise exception 'contacto_invalido';
  end if;

  if v_tipo = 'deportista_destacado' then v_medico := null; end if;
  if (v_medico is not null and v_medico is distinct from v_previa.medico
      and (not privado.archivo_certificado(v_medico) or exists (
        select 1 from privado.inscripciones where medico = v_medico or alumno_regular = v_medico)))
    or (v_regular is not null and v_regular is distinct from v_previa.alumno_regular
      and (not privado.archivo_certificado(v_regular) or exists (
        select 1 from privado.inscripciones where medico = v_regular or alumno_regular = v_regular)))
    or (v_medico is not null and v_medico = v_regular) then
    raise exception 'archivo_invalido';
  end if;

  if v_tipo = 'deportista_destacado' then
    v_emision := null;
    v_hasta := null;
  elsif v_medico is not null then
    v_emision := nullif(p_ficha ->> 'certificado_emision', '')::date;
    if v_emision is null or not isfinite(v_emision) or v_emision > v_hoy then
      raise exception 'emision_invalida';
    end if;
    v_hasta := (v_emision + interval '12 months')::date;
  elsif coalesce(v_previa.vigencia_legada, v_anterior.certificado_hasta is not null) then
    -- Mantiene la vigencia histórica registrada por administración antes de CR-02.
    v_emision := v_anterior.certificado_emision;
    v_hasta := v_anterior.certificado_hasta;
    v_vigencia_legada := true;
  end if;

  if v_id is null then
    insert into public.alumnos (nombre, rut, carrera, tipo_persona, certificado_emision, certificado_hasta)
    values (v_nombre, v_rut, v_carrera, v_tipo, v_emision, v_hasta) returning id into v_id;
  else
    update public.alumnos set nombre = v_nombre, rut = v_rut, carrera = v_carrera, tipo_persona = v_tipo,
      certificado_emision = v_emision, certificado_hasta = v_hasta where id = v_id;
  end if;

  insert into privado.inscripciones (persona_id, correo, nacimiento, telefono, contacto_emergencia,
    telefono_emergencia, antecedentes, medico, alumno_regular, vigencia_legada)
  values (v_id, lower(btrim(p_ficha ->> 'correo')), v_nacimiento, v_telefono,
    btrim(p_ficha ->> 'contacto_emergencia'), v_telefono_emergencia,
    coalesce(btrim(p_ficha ->> 'antecedentes'), ''), v_medico, v_regular, v_vigencia_legada)
  on conflict (persona_id) do update set correo = excluded.correo, nacimiento = excluded.nacimiento,
    telefono = excluded.telefono, contacto_emergencia = excluded.contacto_emergencia,
    telefono_emergencia = excluded.telefono_emergencia, antecedentes = excluded.antecedentes,
    medico = excluded.medico, alumno_regular = excluded.alumno_regular,
    vigencia_legada = excluded.vigencia_legada, version = gen_random_uuid();

  return public.leer_inscripcion(v_id);
end;
$$;

revoke all on function privado.es_profesor(), privado.rut_valido(text), privado.archivo_certificado(text),
  privado.certificado_sin_referencia(text), public.leer_inscripcion(uuid),
  public.guardar_inscripcion(uuid,jsonb) from public, anon, authenticated, service_role;
grant execute on function privado.es_profesor(), privado.certificado_sin_referencia(text),
  public.leer_inscripcion(uuid), public.guardar_inscripcion(uuid,jsonb) to authenticated;

commit;
