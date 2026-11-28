-- CR02-07 a CR02-09: agenda y nómina de una multicancha independiente del gimnasio.
begin;

create extension if not exists btree_gist with schema extensions;
set local search_path = public, extensions;

create table public.multicancha_modulos (
  id smallint generated always as identity primary key,
  dias smallint[] not null check (cardinality(dias) > 0 and dias <@ array[1,2,3,4,5,6,7]::smallint[]),
  hora_inicio time(0) not null unique,
  hora_fin time(0) not null,
  reservable boolean not null default true,
  check ((case when reservable then hora_inicio >= '08:00' and hora_fin <= '16:00'
               else hora_inicio >= '16:00' and hora_fin <= '21:45' end)
         and hora_fin - hora_inicio = interval '80 minutes'
         and extract(second from hora_inicio) = 0)
);

-- Días ISO: 1 = lunes, 7 = domingo.
insert into public.multicancha_modulos (dias, hora_inicio, hora_fin) values
  ('{1,2,3,4,5}', '08:00', '09:20'),
  ('{1,2,3,4,5}', '09:30', '10:50'),
  ('{1,2,3,4,5}', '11:00', '12:20'),
  ('{1,2,3,4,5}', '12:30', '13:50'),
  ('{1,2,3,4,5}', '14:30', '15:50');
insert into public.multicancha_modulos (dias, hora_inicio, hora_fin, reservable) values
  ('{1,2,3,4,5}', '16:00', '17:20', false),
  ('{1,2,3,4,5}', '17:30', '18:50', false),
  ('{1,2,3,4,5}', '19:00', '20:20', false),
  ('{1,2,3,4,5}', '20:25', '21:45', false);

create table public.multicancha_configuracion (
  unica boolean primary key default true check (unica),
  max_participantes smallint not null default 14 check (max_participantes > 0)
);
insert into public.multicancha_configuracion default values;

create table public.multicancha_series (
  id uuid primary key default gen_random_uuid(),
  titulo text not null check (char_length(titulo) between 1 and 160),
  espacio text not null check (espacio in ('multicancha', 'sala_espejo')),
  dia smallint not null check (dia between 1 and 7),
  hora_inicio time(0) not null,
  hora_fin time(0) not null,
  vigente_desde date not null check (vigente_desde between date '2000-01-01' and date '9999-12-31'),
  vigente_hasta date check (vigente_hasta between vigente_desde and date '9999-12-31'),
  version uuid not null default gen_random_uuid(),
  editada_por uuid references public.perfiles(id) on delete set null,
  check (hora_inicio < hora_fin and extract(second from hora_inicio) = 0 and extract(second from hora_fin) = 0)
);

insert into public.multicancha_series (titulo, espacio, dia, hora_inicio, hora_fin, vigente_desde)
select titulo, espacio, dia, inicio::time, fin::time, date '2026-11-23'
from (values
  ('Judo', 'multicancha', 1, '12:30', '13:50'),
  ('Básquetbol varones selección', 'multicancha', 1, '17:30', '18:50'),
  ('Vóleibol varones selección', 'multicancha', 1, '19:00', '20:20'),
  ('Gym USS', 'multicancha', 1, '20:25', '21:45'),
  ('Básquetbol mixto', 'multicancha', 2, '12:30', '13:50'),
  ('Tenis de mesa selección', 'multicancha', 2, '17:00', '18:30'),
  ('Vóleibol damas selección', 'multicancha', 2, '18:30', '20:00'),
  ('Básquetbol varones selección', 'multicancha', 2, '20:00', '21:30'),
  ('Vóleibol mixto', 'multicancha', 3, '11:00', '12:20'),
  ('PEFI danza urbana', 'sala_espejo', 3, '14:40', '16:00'),
  ('Tenis de mesa taller', 'multicancha', 3, '16:10', '17:20'),
  ('Tenis de mesa selección', 'multicancha', 3, '17:30', '18:45'),
  ('Vóleibol varones selección', 'multicancha', 3, '19:00', '20:30'),
  ('Gym USS', 'multicancha', 3, '20:25', '21:45'),
  ('Vóleibol damas LDES', 'multicancha', 4, '16:00', '21:45'),
  ('Vóleibol varones LDES', 'multicancha', 5, '16:00', '21:45'),
  ('PEPE', 'multicancha', 6, '11:00', '13:50')
) as programa(titulo, espacio, dia, inicio, fin);

create table public.multicancha_reservas (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('ordinaria', 'institucional', 'bloqueo')),
  espacio text not null default 'multicancha' check (espacio in ('multicancha', 'sala_espejo')),
  fecha date not null,
  hora_inicio time(0) not null,
  hora_fin time(0) not null,
  inicio timestamptz not null,
  fin timestamptz not null,
  responsable text,
  carrera text,
  correo text,
  responsable_id uuid references public.perfiles(id) on delete set null,
  titulo text,
  creada_en timestamptz not null default now(),
  cancelada_en timestamptz,
  version uuid not null default gen_random_uuid(),
  check (fecha between date '2000-01-01' and date '9999-12-31'),
  check (hora_inicio < hora_fin and inicio < fin),
  check (tipo <> 'ordinaria' or espacio = 'multicancha'),
  check (
    (tipo = 'ordinaria'
      and responsable is not null and char_length(responsable) between 1 and 160
      and carrera is not null and char_length(carrera) between 1 and 160
      and correo is not null and char_length(correo) <= 254
      and correo ~ '^[a-z0-9_%+-]+(\.[a-z0-9_%+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)+$'
      and titulo is null)
    or
    (tipo <> 'ordinaria' and responsable is null and carrera is null and correo is null
      and responsable_id is null and titulo is not null and char_length(titulo) between 1 and 160)
  ),
  constraint multicancha_sin_superposicion
    exclude using gist (espacio with =, tstzrange(inicio, fin, '[)') with &&)
      where (cancelada_en is null and tipo <> 'institucional')
);

create index multicancha_reservas_fecha on public.multicancha_reservas (fecha, hora_inicio, id);
create index multicancha_reservas_responsable on public.multicancha_reservas (responsable_id, fecha desc);

create table public.multicancha_integrantes (
  reserva_id uuid not null references public.multicancha_reservas(id),
  rut text not null check (privado.rut_valido(rut)),
  nombre text not null check (char_length(nombre) between 1 and 160),
  carrera text not null check (char_length(carrera) between 1 and 160),
  primary key (reserva_id, rut)
);

create table public.multicancha_historial (
  id bigint generated always as identity primary key,
  reserva_id uuid not null references public.multicancha_reservas(id),
  accion text not null check (accion in ('creacion', 'modificacion', 'cancelacion', 'nomina')),
  actor_id uuid references public.perfiles(id) on delete set null,
  actor_nombre text not null,
  momento timestamptz not null default now(),
  fecha date not null,
  fecha_anterior date,
  detalle jsonb not null
);
create index multicancha_historial_reserva on public.multicancha_historial (reserva_id, id desc);
create index multicancha_historial_fecha on public.multicancha_historial (fecha, id desc);
create index multicancha_historial_fecha_anterior on public.multicancha_historial (fecha_anterior) where fecha_anterior is not null;

alter table public.multicancha_modulos enable row level security;
alter table public.multicancha_reservas enable row level security;
alter table public.multicancha_integrantes enable row level security;
alter table public.multicancha_historial enable row level security;
alter table public.multicancha_series enable row level security;
alter table public.multicancha_configuracion enable row level security;

revoke all on public.multicancha_modulos, public.multicancha_reservas,
  public.multicancha_integrantes, public.multicancha_historial, public.multicancha_series,
  public.multicancha_configuracion from public, anon, authenticated;
grant select on public.multicancha_modulos, public.multicancha_reservas,
  public.multicancha_integrantes, public.multicancha_historial, public.multicancha_series,
  public.multicancha_configuracion to authenticated;

create policy multicancha_modulos_profesor on public.multicancha_modulos for select to authenticated
  using ((select privado.es_profesor()));
create policy multicancha_reservas_lectura on public.multicancha_reservas for select to authenticated
  using ((select privado.es_profesor()) or (responsable_id = (select auth.uid()) and
    exists (select 1 from public.perfiles where id = (select auth.uid()) and rol = 'alumno')));
-- La subconsulta aplica la misma política de visibilidad de la reserva.
create policy multicancha_integrantes_lectura on public.multicancha_integrantes for select to authenticated
  using (exists (select 1 from public.multicancha_reservas where id = reserva_id));
create policy multicancha_historial_profesor on public.multicancha_historial for select to authenticated
  using ((select privado.es_profesor()));
create policy multicancha_series_profesor on public.multicancha_series for select to authenticated
  using ((select privado.es_profesor()));
create policy multicancha_configuracion_lectura on public.multicancha_configuracion for select to authenticated
  using (exists (select 1 from public.perfiles where id = (select auth.uid()) and rol in ('profesor','alumno')));

-- Las escrituras de agenda comparten una versión transaccional. Actualizar una fila
-- obliga a releer tras esperar en READ COMMITTED y evita escrituras con snapshots antiguos.
create table privado.multicancha_escritura (unica boolean primary key check (unica), version uuid not null);
alter table privado.multicancha_escritura enable row level security;
insert into privado.multicancha_escritura values (true, gen_random_uuid());
revoke all on privado.multicancha_escritura from public, anon, authenticated;

create function privado.validar_ocupacion_multicancha()
returns trigger language plpgsql set search_path = '' as $$
begin
  update privado.multicancha_escritura set version = gen_random_uuid() where unica;
  if new.cancelada_en is not null then return new; end if;
  if exists (
    select 1 from public.multicancha_reservas r
    where r.id <> new.id and r.cancelada_en is null and r.espacio = new.espacio
      and (new.tipo <> 'institucional' or r.tipo <> 'institucional')
      and tstzrange(r.inicio, r.fin, '[)') && tstzrange(new.inicio, new.fin, '[)')
  ) or (new.tipo <> 'institucional' and exists (
    select 1 from public.multicancha_series s
    where s.espacio = new.espacio and new.fecha >= s.vigente_desde
      and (s.vigente_hasta is null or new.fecha <= s.vigente_hasta)
      and s.dia = extract(isodow from new.fecha)
      and s.hora_inicio < new.hora_fin and new.hora_inicio < s.hora_fin
  )) then raise exclusion_violation; end if;
  return new;
end;
$$;

create trigger multicancha_validar_ocupacion
  before insert or update of tipo, espacio, fecha, hora_inicio, hora_fin, inicio, fin, cancelada_en
  on public.multicancha_reservas for each row execute function privado.validar_ocupacion_multicancha();

create function privado.validar_serie_multicancha()
returns trigger language plpgsql set search_path = '' as $$
begin
  update privado.multicancha_escritura set version = gen_random_uuid() where unica;
  if exists (
    select 1 from public.multicancha_reservas r
    where r.tipo <> 'institucional' and r.cancelada_en is null and r.espacio = new.espacio
      and r.fecha >= new.vigente_desde and (new.vigente_hasta is null or r.fecha <= new.vigente_hasta)
      and new.dia = extract(isodow from r.fecha)
      and new.hora_inicio < r.hora_fin and r.hora_inicio < new.hora_fin
  ) then raise exclusion_violation; end if;
  return new;
end;
$$;

create trigger multicancha_validar_serie before insert or update on public.multicancha_series
  for each row execute function privado.validar_serie_multicancha();

create function privado.guardar_serie_multicancha(
  p_titulo text, p_espacio text, p_dia smallint, p_inicio time, p_fin time, p_desde date, p_hasta date,
  p_id uuid, p_version uuid
) returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if not privado.es_profesor() then raise exception 'sin_permiso' using errcode = '42501'; end if;
  if extract(second from p_inicio) <> 0 or extract(second from p_fin) <> 0 then
    raise exception 'multicancha_horario';
  end if;
  if p_id is null then
    insert into public.multicancha_series (titulo, espacio, dia, hora_inicio, hora_fin, vigente_desde, vigente_hasta, editada_por)
    values (btrim(p_titulo), p_espacio, p_dia, p_inicio, p_fin, p_desde, p_hasta, auth.uid())
    returning id into v_id;
  else
    update public.multicancha_series set titulo = btrim(p_titulo), espacio = p_espacio, dia = p_dia, hora_inicio = p_inicio,
      hora_fin = p_fin, vigente_desde = p_desde, vigente_hasta = p_hasta, editada_por = auth.uid(), version = gen_random_uuid()
    where id = p_id and version = p_version returning id into v_id;
    if not found then raise exception 'multicancha_version'; end if;
  end if;
  return v_id;
exception
  when exclusion_violation or deadlock_detected then raise exception 'multicancha_superposicion' using errcode = '23P01';
  when check_violation or not_null_violation then raise exception 'multicancha_datos';
end;
$$;

create function public.guardar_serie_multicancha(
  p_titulo text, p_espacio text, p_dia smallint, p_inicio time, p_fin time, p_desde date, p_hasta date default null,
  p_id uuid default null, p_version uuid default null
) returns uuid language sql set search_path = ''
begin atomic
  select privado.guardar_serie_multicancha(p_titulo, p_espacio, p_dia, p_inicio, p_fin, p_desde, p_hasta, p_id, p_version);
end;

revoke all on function privado.validar_ocupacion_multicancha(), privado.validar_serie_multicancha(),
  privado.guardar_serie_multicancha(text, text, smallint, time, time, date, date, uuid, uuid),
  public.guardar_serie_multicancha(text, text, smallint, time, time, date, date, uuid, uuid)
  from public, anon, authenticated;
grant execute on function privado.guardar_serie_multicancha(text, text, smallint, time, time, date, date, uuid, uuid),
  public.guardar_serie_multicancha(text, text, smallint, time, time, date, date, uuid, uuid) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('multicancha', 'multicancha', false, 10485760,
  array['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
create policy multicancha_reglamento_lectura on storage.objects for select to authenticated
  using (bucket_id = 'multicancha' and name in ('reglamento.pdf', 'reglamento.docx')
    and exists (select 1 from public.perfiles where id = (select auth.uid()) and rol in ('profesor','alumno')));

create function privado.instante_multicancha(p_local timestamp)
returns timestamptz language plpgsql stable set search_path = '' as $$
declare
  v_instante timestamptz := p_local at time zone 'America/Santiago';
begin
  -- El ajuste de una hora en Santiago puede omitir o repetir una hora local.
  if (v_instante at time zone 'America/Santiago') <> p_local
    or ((v_instante - interval '1 hour') at time zone 'America/Santiago') = p_local
    or ((v_instante + interval '1 hour') at time zone 'America/Santiago') = p_local then
    raise exception 'multicancha_cambio_hora';
  end if;
  return v_instante;
end;
$$;

create function privado.auditar_multicancha(
  p_reserva uuid, p_accion text, p_fecha date, p_detalle jsonb, p_fecha_anterior date default null
)
returns void language sql set search_path = '' as $$
  insert into public.multicancha_historial (reserva_id, accion, actor_id, actor_nombre, fecha, fecha_anterior, detalle)
  select p_reserva, p_accion, id, coalesce(nullif(nombre, ''), rol), p_fecha, p_fecha_anterior, p_detalle
  from public.perfiles where id = (select auth.uid());
$$;

-- Las mutaciones se ejecutan en un esquema fuera de la API. Cada entrada valida el rol.
create function privado.guardar_multicancha(
  p_fecha date, p_tipo text, p_modulo smallint, p_hora_inicio time, p_hora_fin time,
  p_responsable text, p_carrera text, p_correo text, p_titulo text, p_id uuid, p_version uuid, p_espacio text
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_anterior public.multicancha_reservas;
  v_nueva public.multicancha_reservas;
  v_inicio_local time;
  v_fin_local time;
  v_inicio timestamptz;
  v_fin timestamptz;
  v_correo text := lower(btrim(p_correo));
  v_responsable_id uuid;
begin
  if not privado.es_profesor() then raise exception 'sin_permiso' using errcode = '42501'; end if;
  if p_fecha is null or p_fecha not between date '2000-01-01' and date '9999-12-31'
    or p_tipo is null or p_tipo not in ('ordinaria', 'institucional', 'bloqueo') then
    raise exception 'multicancha_datos';
  end if;

  if p_id is not null then
    select * into v_anterior from public.multicancha_reservas where id = p_id for update;
    if not found or v_anterior.cancelada_en is not null or v_anterior.version is distinct from p_version then
      raise exception 'multicancha_version';
    end if;
    if v_anterior.tipo <> p_tipo then raise exception 'multicancha_datos'; end if;
  end if;

  if p_tipo = 'ordinaria' then
    p_espacio := 'multicancha';
    -- Una reserva mantiene su horario histórico aunque cambie el catálogo de módulos.
    if p_modulo is null and p_id is not null and p_fecha = v_anterior.fecha then
      v_inicio_local := v_anterior.hora_inicio;
      v_fin_local := v_anterior.hora_fin;
    else
      select hora_inicio, hora_fin into v_inicio_local, v_fin_local from public.multicancha_modulos
      where id = p_modulo and reservable and extract(isodow from p_fecha)::smallint = any(dias) for share;
      if not found then raise exception 'multicancha_modulo'; end if;
    end if;
    if nullif(btrim(p_responsable), '') is null or nullif(btrim(p_carrera), '') is null
      or v_correo is null or length(v_correo) > 254
      or v_correo !~ '^[a-z0-9_%+-]+(\.[a-z0-9_%+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)+$' then
      raise exception 'multicancha_datos';
    end if;
    p_titulo := null;
    -- Solo cuenta de alumno con correo confirmado y una coincidencia única.
    select case count(*) when 1 then (array_agg(u.id))[1] end into v_responsable_id
    from auth.users u join public.perfiles p on p.id = u.id and p.rol = 'alumno'
    where lower(u.email) = v_correo and u.email_confirmed_at is not null;
  else
    p_espacio := coalesce(p_espacio, v_anterior.espacio, 'multicancha');
    v_inicio_local := p_hora_inicio;
    v_fin_local := p_hora_fin;
    p_responsable := null;
    p_carrera := null;
    v_correo := null;
    if nullif(btrim(p_titulo), '') is null then raise exception 'multicancha_datos'; end if;
  end if;

  if v_inicio_local is null or v_fin_local is null or v_inicio_local >= v_fin_local
    or extract(second from v_inicio_local) <> 0 or extract(second from v_fin_local) <> 0 then
    raise exception 'multicancha_horario';
  end if;
  if p_fecha = v_anterior.fecha and v_inicio_local = v_anterior.hora_inicio and v_fin_local = v_anterior.hora_fin then
    v_inicio := v_anterior.inicio;
    v_fin := v_anterior.fin;
  else
    v_inicio := privado.instante_multicancha(p_fecha + v_inicio_local);
    v_fin := privado.instante_multicancha(p_fecha + v_fin_local);
    if v_inicio >= v_fin then raise exception 'multicancha_horario'; end if;
    if v_inicio <= now() then raise exception 'multicancha_pasado'; end if;
  end if;

  if p_id is null then
    insert into public.multicancha_reservas
      (tipo, fecha, hora_inicio, hora_fin, inicio, fin, responsable, carrera, correo, responsable_id, titulo, espacio)
    values (p_tipo, p_fecha, v_inicio_local, v_fin_local, v_inicio, v_fin,
      btrim(p_responsable), btrim(p_carrera), v_correo, v_responsable_id, btrim(p_titulo), p_espacio)
    returning * into v_nueva;
    perform privado.auditar_multicancha(v_nueva.id, 'creacion', v_nueva.fecha, to_jsonb(v_nueva));
  else
    update public.multicancha_reservas set
      fecha = p_fecha, hora_inicio = v_inicio_local, hora_fin = v_fin_local, inicio = v_inicio, fin = v_fin,
      responsable = btrim(p_responsable), carrera = btrim(p_carrera), correo = v_correo,
      responsable_id = v_responsable_id, titulo = btrim(p_titulo), espacio = p_espacio, version = gen_random_uuid()
    where id = p_id returning * into v_nueva;
    perform privado.auditar_multicancha(v_nueva.id, 'modificacion', v_nueva.fecha,
      jsonb_build_object('antes', to_jsonb(v_anterior), 'despues', to_jsonb(v_nueva)), v_anterior.fecha);
  end if;
  return v_nueva.id;
exception
  when exclusion_violation or deadlock_detected then
    raise exception 'multicancha_superposicion' using errcode = '23P01';
  when check_violation then
    raise exception 'multicancha_datos';
end;
$$;

create function privado.cancelar_multicancha(p_id uuid, p_version uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_reserva public.multicancha_reservas;
begin
  if not privado.es_profesor() then raise exception 'sin_permiso' using errcode = '42501'; end if;
  update public.multicancha_reservas set cancelada_en = now(), version = gen_random_uuid()
  where id = p_id and cancelada_en is null and version = p_version returning * into v_reserva;
  if not found then raise exception 'multicancha_version'; end if;
  perform privado.auditar_multicancha(p_id, 'cancelacion', v_reserva.fecha, to_jsonb(v_reserva));
end;
$$;

create function privado.guardar_nomina_multicancha(p_id uuid, p_version uuid, p_integrantes jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_reserva public.multicancha_reservas;
  v_actor uuid := auth.uid();
  v_rol text;
  v_maximo smallint;
begin
  select rol into v_rol from public.perfiles where id = v_actor;
  if v_rol is null or v_rol not in ('profesor', 'alumno') then
    raise exception 'sin_permiso' using errcode = '42501';
  end if;
  select * into v_reserva from public.multicancha_reservas
  where id = p_id and tipo = 'ordinaria' and (v_rol = 'profesor' or responsable_id = v_actor)
  for update;
  if not found then raise exception 'sin_permiso' using errcode = '42501'; end if;
  if v_reserva.cancelada_en is not null or v_reserva.version is distinct from p_version then
    raise exception 'multicancha_version';
  end if;
  if jsonb_typeof(p_integrantes) is distinct from 'array' then raise exception 'multicancha_nomina'; end if;
  select max_participantes into strict v_maximo from public.multicancha_configuracion where unica for share;
  if jsonb_array_length(p_integrantes) + 1 > v_maximo then raise exception 'multicancha_maximo'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_integrantes) as i(datos)
    where jsonb_typeof(datos -> 'rut') is distinct from 'string'
      or jsonb_typeof(datos -> 'nombre') is distinct from 'string'
      or jsonb_typeof(datos -> 'carrera') is distinct from 'string'
  ) then raise exception 'multicancha_nomina'; end if;

  delete from public.multicancha_integrantes where reserva_id = p_id;
  insert into public.multicancha_integrantes (reserva_id, rut, nombre, carrera)
  select p_id, upper(replace(btrim(rut), '.', '')), btrim(nombre), btrim(carrera)
  from jsonb_to_recordset(p_integrantes) as i(rut text, nombre text, carrera text);
  update public.multicancha_reservas set version = gen_random_uuid() where id = p_id;
  perform privado.auditar_multicancha(p_id, 'nomina', v_reserva.fecha,
    jsonb_build_object('cantidad', jsonb_array_length(p_integrantes), 'responsable', v_reserva.responsable,
      'hora_inicio', v_reserva.hora_inicio, 'hora_fin', v_reserva.hora_fin));
exception
  when unique_violation then raise exception 'multicancha_rut_repetido';
  when check_violation or not_null_violation then raise exception 'multicancha_nomina';
end;
$$;

create function public.guardar_multicancha(
  p_fecha date, p_tipo text, p_modulo smallint default null, p_hora_inicio time default null,
  p_hora_fin time default null, p_responsable text default null, p_carrera text default null,
  p_correo text default null, p_titulo text default null, p_id uuid default null, p_version uuid default null,
  p_espacio text default null
) returns uuid language sql set search_path = ''
begin atomic
  select privado.guardar_multicancha(p_fecha, p_tipo, p_modulo, p_hora_inicio, p_hora_fin,
    p_responsable, p_carrera, p_correo, p_titulo, p_id, p_version, p_espacio);
end;

create function public.cancelar_multicancha(p_id uuid, p_version uuid)
returns void language sql set search_path = ''
begin atomic
  select privado.cancelar_multicancha(p_id, p_version);
end;

create function public.guardar_nomina_multicancha(p_id uuid, p_version uuid, p_integrantes jsonb)
returns void language sql set search_path = ''
begin atomic
  select privado.guardar_nomina_multicancha(p_id, p_version, p_integrantes);
end;

revoke all on function privado.instante_multicancha(timestamp), privado.auditar_multicancha(uuid, text, date, jsonb, date)
  from public, anon, authenticated;
revoke all on function privado.guardar_multicancha(date, text, smallint, time, time, text, text, text, text, uuid, uuid, text),
  privado.cancelar_multicancha(uuid, uuid), privado.guardar_nomina_multicancha(uuid, uuid, jsonb),
  public.guardar_multicancha(date, text, smallint, time, time, text, text, text, text, uuid, uuid, text),
  public.cancelar_multicancha(uuid, uuid), public.guardar_nomina_multicancha(uuid, uuid, jsonb)
  from public, anon, authenticated;
grant execute on function privado.guardar_multicancha(date, text, smallint, time, time, text, text, text, text, uuid, uuid, text),
  privado.cancelar_multicancha(uuid, uuid), privado.guardar_nomina_multicancha(uuid, uuid, jsonb),
  public.guardar_multicancha(date, text, smallint, time, time, text, text, text, text, uuid, uuid, text),
  public.cancelar_multicancha(uuid, uuid), public.guardar_nomina_multicancha(uuid, uuid, jsonb)
  to authenticated;

commit;
