-- CR-02 fase 2. La instalación deja el modo apagado hasta configurar la demo.
begin;

create extension if not exists supabase_vault with schema vault;

create table privado.modo_admin (
  unico boolean primary key default true check (unico),
  profesor_id uuid not null references public.perfiles(id) on delete cascade,
  secreto_id uuid not null references vault.secrets(id) on delete cascade,
  sesion_id uuid,
  vence_en timestamptz,
  fallos integer not null default 0,
  bloqueado_hasta timestamptz
);
alter table privado.modo_admin enable row level security;
revoke all on privado.modo_admin from public, anon, authenticated;

create function public.vencimiento_modo_admin()
returns timestamptz language sql stable security definer set search_path = '' as $$
  select m.vence_en
  from privado.modo_admin m
  join public.perfiles p on p.id = m.profesor_id and p.rol = 'profesor'
  join auth.sessions s on s.id = m.sesion_id and s.user_id = p.id
  where p.id = (select auth.uid())
    and s.id = (select (auth.jwt() ->> 'session_id')::uuid)
    and (s.not_after is null or s.not_after > statement_timestamp())
    and m.vence_en > statement_timestamp();
$$;

create function privado.es_administrador()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.perfiles where id = (select auth.uid()) and rol = 'admin'
  ) or public.vencimiento_modo_admin() is not null;
$$;

create function public.activar_modo_admin(p_pin text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_modo privado.modo_admin%rowtype;
  v_sesion uuid := (auth.jwt() ->> 'session_id')::uuid;
  v_pin text;
  v_ahora timestamptz;
begin
  if not exists (
    select 1 from public.perfiles p
    join auth.sessions s on s.user_id = p.id
    where p.id = (select auth.uid()) and p.rol = 'profesor' and s.id = v_sesion
      and (s.not_after is null or s.not_after > clock_timestamp())
  ) then
    return 'no_disponible';
  end if;

  -- Una fila por cuenta serializa los intentos incluso entre sesiones distintas.
  select * into v_modo from privado.modo_admin
  where profesor_id = (select auth.uid()) for update;
  if not found then return 'no_disponible'; end if;

  v_ahora := clock_timestamp();
  if v_modo.bloqueado_hasta > v_ahora then return 'bloqueado'; end if;

  select decrypted_secret into v_pin from vault.decrypted_secrets where id = v_modo.secreto_id;
  if v_pin is null or v_pin !~ '^[0-9]{6}$' then return 'no_disponible'; end if;

  if p_pin is distinct from v_pin then
    update privado.modo_admin
    set fallos = case when v_modo.fallos >= 4 then 0 else v_modo.fallos + 1 end,
        bloqueado_hasta = case when v_modo.fallos >= 4 then v_ahora + interval '5 minutes' end
    where unico;
    if v_modo.fallos >= 4 then return 'bloqueado'; end if;
    return 'pin_incorrecto';
  end if;

  update privado.modo_admin
  set sesion_id = v_sesion, vence_en = v_ahora + interval '30 minutes',
      fallos = 0, bloqueado_hasta = null
  where unico;
  return 'activado';
end;
$$;

create function public.desactivar_modo_admin()
returns void language sql security definer set search_path = '' as $$
  update privado.modo_admin
  set sesion_id = null, vence_en = null
  where profesor_id = (select auth.uid())
    and sesion_id = (select (auth.jwt() ->> 'session_id')::uuid);
$$;

revoke all on function public.vencimiento_modo_admin(), public.activar_modo_admin(text),
  public.desactivar_modo_admin(), privado.es_administrador() from public, anon, authenticated;
grant execute on function public.vencimiento_modo_admin(), public.activar_modo_admin(text),
  public.desactivar_modo_admin(), privado.es_administrador() to authenticated;

alter policy maquinas_escribir_admin on public.maquinas
  using ((select privado.es_administrador())) with check ((select privado.es_administrador()));
alter policy implementos_escribir_admin on public.implementos
  using ((select privado.es_administrador())) with check ((select privado.es_administrador()));

alter policy fotos_maquinas_leer on storage.objects
  using (bucket_id = 'maquinas' and (select privado.es_administrador()));
alter policy fotos_maquinas_subir_admin on storage.objects
  with check (bucket_id = 'maquinas' and (select privado.es_administrador()));
alter policy fotos_maquinas_editar_admin on storage.objects
  using (bucket_id = 'maquinas' and (select privado.es_administrador()))
  with check (bucket_id = 'maquinas' and (select privado.es_administrador()));
alter policy fotos_maquinas_borrar_admin on storage.objects
  using (bucket_id = 'maquinas' and (select privado.es_administrador()));

create or replace view public.catalogo_implementos with (security_invoker = true) as
select i.id, i.nombre, i.categoria, i.cantidad_total, s.disponible,
       i.cantidad_total - s.disponible as prestada
from public.implementos i
join public.stock_prestamos s using (id)
where (select privado.es_administrador());

-- Los cuerpos siguientes conservan las reglas y contratos de 019, 024 y 027.

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
  if not privado.es_administrador() then
    raise exception 'sin_permiso' using detail = 'Solo un administrador cambia la configuración.';
  end if;

  perform 1 from public.aforo where id = 1 for update;
  return privado.actualizar_configuracion_en(p_capacidad, p_horario, p_cierre_automatico_horas, clock_timestamp());
end;
$$;

create or replace function public.actualizar_configuracion_completa(p_parametros jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_key text;
  v_horario jsonb;
  v_modalidades jsonb := p_parametros -> 'modalidades_rutina';
  v_progresion jsonb := p_parametros -> 'progresion';
  v_capacidad numeric;
  v_cierre numeric;
  v_umbral numeric;
  v_expira numeric;
  v_facil numeric;
  v_justo numeric;
  v_reduccion numeric;
  v_paso numeric;
  v_aforo public.aforo%rowtype;
  v_contexto_anterior text;
begin
  if not privado.es_administrador() then
    raise exception 'sin_permiso';
  end if;

  if jsonb_typeof(p_parametros) is distinct from 'object' then
    raise exception 'parametros_invalidos';
  end if;
  if p_parametros - array['capacidad','horario','cierre_automatico_horas',
      'umbral_casi_lleno','turno_expira_minutos','modalidades_rutina','progresion'] <> '{}'::jsonb then
    raise exception 'parametros_invalidos';
  end if;

  foreach v_key in array array['capacidad','cierre_automatico_horas','umbral_casi_lleno','turno_expira_minutos'] loop
    if jsonb_typeof(p_parametros -> v_key) is distinct from 'number' then
      raise exception 'parametros_invalidos' using detail = 'Capacidad, cierre automático, umbral y expiración deben ser números.';
    end if;
  end loop;
  v_capacidad := (p_parametros ->> 'capacidad')::numeric;
  v_cierre := (p_parametros ->> 'cierre_automatico_horas')::numeric;
  v_umbral := (p_parametros ->> 'umbral_casi_lleno')::numeric;
  v_expira := (p_parametros ->> 'turno_expira_minutos')::numeric;

  if v_capacidad not between 1 and 100 or v_capacidad <> trunc(v_capacidad) then
    raise exception 'capacidad_invalida';
  end if;
  if v_cierre not between 1 and 12 or v_cierre <> trunc(v_cierre) then
    raise exception 'cierre_invalido';
  end if;
  if v_umbral not between 0.01 and 1 or v_umbral <> round(v_umbral, 2) then
    raise exception 'umbral_invalido';
  end if;
  if v_expira not between 1 and 120 or v_expira <> trunc(v_expira) then
    raise exception 'expiracion_invalida';
  end if;
  v_horario := privado.validar_horario(p_parametros -> 'horario');

  if jsonb_typeof(v_modalidades) is distinct from 'object'
    or v_modalidades - array['sistema','profesor','alumno'] <> '{}'::jsonb
    or jsonb_typeof(v_modalidades -> 'sistema') is distinct from 'boolean'
    or jsonb_typeof(v_modalidades -> 'profesor') is distinct from 'boolean'
    or jsonb_typeof(v_modalidades -> 'alumno') is distinct from 'boolean' then
    raise exception 'modalidades_invalidas';
  end if;

  if jsonb_typeof(v_progresion) is distinct from 'object'
    or v_progresion - array['facil_kg','justo_kg','me_costo_porcentaje','redondeo_kg'] <> '{}'::jsonb then
    raise exception 'progresion_invalida';
  end if;
  foreach v_key in array array['facil_kg','justo_kg','me_costo_porcentaje','redondeo_kg'] loop
    if jsonb_typeof(v_progresion -> v_key) is distinct from 'number' then
      raise exception 'progresion_invalida';
    end if;
  end loop;
  v_facil := (v_progresion ->> 'facil_kg')::numeric;
  v_justo := (v_progresion ->> 'justo_kg')::numeric;
  v_reduccion := (v_progresion ->> 'me_costo_porcentaje')::numeric;
  v_paso := (v_progresion ->> 'redondeo_kg')::numeric;
  if v_facil not between 0.1 and 50 or v_facil <> round(v_facil, 1)
    or abs(v_justo) > v_facil or v_justo <> round(v_justo, 1)
    or v_reduccion not between -100 and -0.1 or v_reduccion <> round(v_reduccion, 1)
    or v_paso not between 0.1 and 50 or v_paso <> round(v_paso, 1) then
    raise exception 'progresion_invalida';
  end if;

  -- Orden de 019. El trigger reconcilia una vez, con todos los valores nuevos.
  perform 1 from public.aforo where id = 1 for update;
  v_contexto_anterior := current_setting('aforofit.hora_configuracion', true);
  perform set_config('aforofit.hora_configuracion', clock_timestamp()::text, true);
  update public.configuracion
  set capacidad = v_capacidad,
      horario = v_horario,
      cierre_automatico_horas = v_cierre,
      umbral_casi_lleno = v_umbral,
      turno_expira_minutos = v_expira,
      modalidades_rutina = v_modalidades,
      progresion = v_progresion
  where id = 1;
  if not found then
    raise exception 'configuracion_no_disponible';
  end if;

  perform set_config('aforofit.hora_configuracion', coalesce(v_contexto_anterior, ''), true);
  select * into strict v_aforo from public.aforo where id = 1;
  return jsonb_build_object('ocupacion', v_aforo.ocupacion, 'capacidad', v_aforo.capacidad);
end;
$$;

create or replace function public.leer_habilitacion(p_alumno uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not privado.es_administrador() then
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

create or replace function public.registrar_habilitacion(p_alumno uuid, p_emision date)
returns date language plpgsql security definer set search_path = '' as $$
declare
  v_persona public.alumnos%rowtype;
  v_estado text;
  v_editable boolean;
  v_hasta date;
  v_hoy date := (now() at time zone 'America/Santiago')::date;
begin
  if not privado.es_administrador() then
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

commit;
