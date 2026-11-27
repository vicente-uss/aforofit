-- 023 · Rutinas personalizadas, selección y vínculo de la visita con su rutina.
begin;

alter table public.rutinas
  add column if not exists nombre text check (char_length(btrim(nombre)) between 1 and 100),
  add column if not exists archivada_en timestamptz;
do $$
begin
  if not exists (select from pg_constraint where conrelid = 'public.rutinas'::regclass
                 and conname = 'rutinas_archivo_inactivo') then
    alter table public.rutinas add constraint rutinas_archivo_inactivo
      check (archivada_en is null or not activa);
    alter table public.rutinas add constraint rutinas_id_alumno_unique unique (id, alumno_id);
  end if;
end;
$$;

-- NULL en rutina_fijada distingue las visitas anteriores a 023.
alter table public.visitas
  add column if not exists rutina_fijada boolean,
  add column if not exists rutina_id uuid;
do $$
begin
  if not exists (select from pg_constraint where conrelid = 'public.visitas'::regclass
                 and conname = 'visitas_rutina_propia') then
    alter table public.visitas add constraint visitas_rutina_propia
      foreign key (rutina_id, alumno_id) references public.rutinas (id, alumno_id);
  end if;
end;
$$;
create index if not exists visitas_rutina_idx on public.visitas (rutina_id, alumno_id)
  where rutina_id is not null;

create or replace function privado.modalidad_rutina_habilitada(p_origen text)
returns boolean language sql stable set search_path = '' as $$
  select exists (
    select from public.configuracion c
    where c.id = 1 and c.modalidades_rutina -> p_origen = 'true'::jsonb
  );
$$;

create or replace function public.modalidades_de_rutina()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'sistema', privado.modalidad_rutina_habilitada('sistema'),
    'profesor', privado.modalidad_rutina_habilitada('profesor'),
    'alumno', privado.modalidad_rutina_habilitada('alumno')
  ) where (select auth.uid()) is not null;
$$;

-- En las operaciones que pueden cambiar la selección se bloquea primero la fila del alumno.
-- El generador de 011 usa la misma fila y se conserva el índice único parcial.
-- Activar y generar ya tienen bloqueada la fila del alumno y validaron la modalidad.
-- Si el cierre gana la carrera por la fila de visitas, el UPDATE reevalúa salida.
create or replace function privado.asociar_primera_rutina_visita(p_alumno uuid, p_rutina uuid)
returns void language sql set search_path = '' as $$
  update public.visitas
  set rutina_id = p_rutina
  where alumno_id = p_alumno and salida is null and rutina_fijada is true and rutina_id is null;
$$;

create or replace function public.activar_rutina(p_rutina uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_alumno uuid;
  v_origen text;
begin
  select a.id into v_alumno
  from public.alumnos a join public.perfiles p on p.id = a.perfil_id
  where p.id = (select auth.uid()) and p.rol = 'alumno'
  for update of a;
  select r.origen into v_origen from public.rutinas r
  where r.id = p_rutina and r.alumno_id = v_alumno and r.archivada_en is null;
  if not found then raise exception 'sin_permiso'; end if;
  if not privado.modalidad_rutina_habilitada(v_origen) then raise exception 'modalidad_deshabilitada'; end if;

  update public.rutinas set activa = false where alumno_id = v_alumno and activa and id <> p_rutina;
  update public.rutinas set activa = true where id = p_rutina and not activa;
  perform privado.asociar_primera_rutina_visita(v_alumno, p_rutina);
end;
$$;

create or replace function public.guardar_rutina_personalizada(
  p_alumno uuid, p_rutina uuid, p_nombre text, p_ejercicios jsonb
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_rol text;
  v_origen text;
  v_anterior public.rutinas%rowtype;
  v_nueva uuid;
begin
  select rol into v_rol from public.perfiles where id = v_uid;
  if v_rol is null or v_rol not in ('profesor', 'alumno') then raise exception 'sin_permiso'; end if;
  v_origen := v_rol;
  perform 1 from public.alumnos a
  where a.id = p_alumno and (v_rol = 'profesor' or a.perfil_id = v_uid)
  for update;
  if not found then raise exception 'sin_permiso'; end if;

  if p_rutina is not null then
    select * into v_anterior from public.rutinas
    where id = p_rutina and alumno_id = p_alumno and origen = v_origen;
    if not found then raise exception 'sin_permiso'; end if;
    if v_anterior.archivada_en is not null then raise exception 'rutina_modificada'; end if;
  end if;
  if not privado.modalidad_rutina_habilitada(v_origen) then raise exception 'modalidad_deshabilitada'; end if;

  if p_nombre is null or char_length(btrim(p_nombre)) not between 1 and 100
     or jsonb_typeof(p_ejercicios) is distinct from 'array' then
    raise exception 'rutina_invalida';
  end if;
  if jsonb_array_length(p_ejercicios) not between 1 and 50 then
    raise exception 'rutina_invalida';
  end if;

  -- Una edición archiva la versión anterior para que las visitas conserven sus ejercicios.
  if p_rutina is not null then
    update public.rutinas set activa = false, archivada_en = now() where id = p_rutina;
  end if;
  insert into public.rutinas (alumno_id, nombre, origen, autor_id, activa)
  values (p_alumno, btrim(p_nombre), v_origen, coalesce(v_anterior.autor_id, v_uid), coalesce(v_anterior.activa, false))
  returning id into v_nueva;

  begin
    insert into public.rutina_ejercicios (
      rutina_id, orden, ejercicio, maquina_id, series, repeticiones, minutos, carga_kg, nota_ajuste
    )
    select v_nueva, x.ordinalidad, case when char_length(btrim(x.ejercicio)) between 1 and 100 then btrim(x.ejercicio) end,
      x.maquina_id, x.series, x.repeticiones, x.minutos, x.carga_kg,
      nullif(btrim(x.nota_ajuste), '')
    from rows from (jsonb_to_recordset(p_ejercicios) as (
      ejercicio text, maquina_id bigint, series integer, repeticiones integer, minutos integer,
      carga_kg numeric, nota_ajuste text
    )) with ordinality as x(ejercicio, maquina_id, series, repeticiones, minutos, carga_kg, nota_ajuste, ordinalidad)
    where coalesce(char_length(x.nota_ajuste), 0) <= 500
      and (x.carga_kg is null or (x.carga_kg between 0 and 9999.9 and x.carga_kg = round(x.carga_kg, 1)));
    if (select count(*) from public.rutina_ejercicios where rutina_id = v_nueva)
       <> jsonb_array_length(p_ejercicios) then raise exception 'ejercicios_invalidos'; end if;
  exception when data_exception or integrity_constraint_violation then
    raise exception 'ejercicios_invalidos';
  end;
  return v_nueva;
end;
$$;

create or replace function public.archivar_rutina_propia(p_rutina uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_alumno uuid;
begin
  select a.id into v_alumno
  from public.alumnos a join public.perfiles p on p.id = a.perfil_id
  where p.id = (select auth.uid()) and p.rol = 'alumno'
  for update of a;

  update public.rutinas set activa = false, archivada_en = now()
  where id = p_rutina and alumno_id = v_alumno and origen = 'alumno' and archivada_en is null;
  if not found then raise exception 'sin_permiso'; end if;
end;
$$;

create or replace function privado.fijar_rutina_visita()
returns trigger language plpgsql set search_path = '' as $$
begin
  perform 1 from public.alumnos where id = new.alumno_id for update;
  new.rutina_fijada := true;
  select r.id into new.rutina_id from public.rutinas r
  where r.alumno_id = new.alumno_id and r.activa and privado.modalidad_rutina_habilitada(r.origen);
  return new;
end;
$$;

drop trigger if exists fijar_rutina_visita on public.visitas;
create trigger fijar_rutina_visita before insert on public.visitas
for each row when (new.salida is null) execute function privado.fijar_rutina_visita();

revoke all on function privado.fijar_rutina_visita(), privado.modalidad_rutina_habilitada(text),
  privado.asociar_primera_rutina_visita(uuid, uuid)
from public, anon, authenticated;
revoke all on function public.modalidades_de_rutina(), public.activar_rutina(uuid),
  public.guardar_rutina_personalizada(uuid, uuid, text, jsonb), public.archivar_rutina_propia(uuid)
from public, anon, authenticated;
grant execute on function public.modalidades_de_rutina(), public.activar_rutina(uuid),
  public.guardar_rutina_personalizada(uuid, uuid, text, jsonb), public.archivar_rutina_propia(uuid)
to authenticated;


create or replace function privado.generar_rutina_de(p_alumno uuid)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  v_alumno     public.alumnos%rowtype;
  v_plantilla  bigint;
  v_rutina     uuid;
begin
  -- El bloqueo evita que dos llamadas simultáneas dejen dos rutinas activas.
  select * into v_alumno from public.alumnos where id = p_alumno for update;
  if not found then
    raise exception 'alumno_no_encontrado' using detail = 'No existe un alumno con ese id.';
  end if;

  if not privado.modalidad_rutina_habilitada('sistema') then
    raise exception 'modalidad_deshabilitada';
  end if;

  if v_alumno.objetivo is null or v_alumno.nivel is null then
    raise exception 'sin_objetivo_nivel'
      using detail = 'El alumno debe elegir objetivo y nivel antes de generar su rutina.';
  end if;

  select p.id into v_plantilla from public.plantillas p
  where p.objetivo = v_alumno.objetivo and p.nivel = v_alumno.nivel;
  if not found then
    raise exception 'sin_plantilla'
      using detail = format('No hay plantilla para %s · %s.', v_alumno.objetivo, v_alumno.nivel);
  end if;

  -- La rutina anterior queda inactiva como historial (no se borra).
  update public.rutinas set activa = false where alumno_id = p_alumno and activa;

  insert into public.rutinas (alumno_id, plantilla_id, origen, autor_id, activa)
  values (p_alumno, v_plantilla, 'sistema', null, true)
  returning id into v_rutina;

  insert into public.rutina_ejercicios (
    rutina_id, orden, ejercicio, maquina_id, series, repeticiones, minutos, carga_kg, nota_ajuste
  )
  select v_rutina, e.orden, e.ejercicio, e.maquina_id, e.series, e.repeticiones, e.minutos,
         e.carga_inicial_kg, e.nota_ajuste
  from public.plantilla_ejercicios e
  where e.plantilla_id = v_plantilla;

  perform privado.asociar_primera_rutina_visita(p_alumno, v_rutina);
  return v_rutina;
end;
$$;

create or replace function privado.registrar_feedback_en(
  p_rutina uuid,
  p_valor  text,
  p_ahora  timestamptz default now()
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_rutina      public.rutinas%rowtype;
  v_visita      public.visitas%rowtype;
  v_progresion  jsonb;
  v_feedback    uuid;
  v_ajusta      boolean;
begin
  if p_valor is null or p_valor not in ('facil', 'justo', 'me_costo') then
    raise exception 'valor_invalido' using detail = 'El feedback debe ser facil, justo o me_costo.';
  end if;

  select * into v_rutina from public.rutinas where id = p_rutina for update;
  if not found then
    raise exception 'rutina_no_encontrada' using detail = 'No existe una rutina con ese id.';
  end if;

  select * into v_visita from public.visitas v
  where v.alumno_id = v_rutina.alumno_id
  order by v.entrada desc, v.id desc
  limit 1;
  if not found then
    raise exception 'sin_visita' using detail = 'El alumno no tiene visitas registradas.';
  end if;
  -- Una visita nueva responde por la versión de ingreso, aunque luego se archive.
  -- Las visitas anteriores a 023 conservan la regla histórica de la rutina activa.
  if (v_visita.rutina_fijada is true and v_visita.rutina_id is distinct from p_rutina)
     or (v_visita.rutina_fijada is null and not v_rutina.activa) then
    raise exception 'rutina_inactiva' using detail = 'La rutina no corresponde a esta visita.';
  end if;
  if v_visita.rutina_fijada is true and v_visita.salida is null then
    raise exception 'visita_abierta';
  end if;
  if v_visita.cierre_automatico then
    raise exception 'visita_cierre_automatico'
      using detail = 'La última visita se cerró sola: no se pide feedback.';
  end if;
  if v_visita.cerrada_por is not null then
    raise exception 'visita_cierre_manual'
      using detail = 'El profesor cerró la última visita a mano: no se pide feedback.';
  end if;
  if exists (select 1 from public.feedback f where f.visita_id = v_visita.id) then
    raise exception 'feedback_ya_registrado' using detail = 'Ya hay feedback para la última visita.';
  end if;

  insert into public.feedback (visita_id, rutina_id, valor, creado_en)
  values (v_visita.id, p_rutina, p_valor, p_ahora)
  returning id into v_feedback;

  v_ajusta := v_rutina.origen = 'sistema';

  if v_ajusta then
    -- Se lee de la tabla en cada llamada: el administrador puede cambiar los parámetros.
    select c.progresion into strict v_progresion from public.configuracion c where c.id = 1;

    update public.rutina_ejercicios e
    set carga_kg = privado.nueva_carga(e.carga_kg, p_valor, v_progresion),
        actualizado_en = p_ahora
    where e.rutina_id = p_rutina
      and e.carga_kg is not null;   -- cardio no cambia
  end if;

  return jsonb_build_object(
    'feedback_id', v_feedback,
    'visita_id', v_visita.id,
    'valor', p_valor,
    'cargas_ajustadas', v_ajusta
  );
end;
$$;

create or replace function public.rutina_del_dia(p_alumno uuid default null)
returns table (
  rutina_id         uuid,
  origen            text,
  orden             integer,
  ejercicio         text,
  maquina_id        bigint,
  maquina           text,
  foto_url          text,
  series            integer,
  repeticiones      integer,
  minutos           integer,
  carga_kg          numeric,
  nota_ajuste       text,
  ajustes_maquina   text,
  estado_maquina    text,
  en_mantencion     boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid     uuid := (select auth.uid());
  v_alumno  uuid := p_alumno;
  v_visita  public.visitas%rowtype;
begin
  if v_alumno is null then
    select a.id into v_alumno from public.alumnos a where a.perfil_id = v_uid;
  end if;

  -- El dueño ve la suya; profesor y admin pueden ver la de cualquier alumno.
  if not exists (select 1 from public.alumnos a where a.id = v_alumno and a.perfil_id = v_uid)
     and not exists (
       select 1 from public.perfiles p where p.id = v_uid and p.rol in ('profesor', 'admin')
     ) then
    raise exception 'sin_permiso' using detail = 'Solo el alumno dueño, un profesor o un admin ven esta rutina.';
  end if;

  select * into v_visita from public.visitas v
  where v.alumno_id = v_alumno
  order by v.entrada desc, v.id desc limit 1;

  return query
  select r.id, r.origen, e.orden, e.ejercicio, m.id, m.nombre, m.foto_url,
         e.series, e.repeticiones, e.minutos, e.carga_kg, e.nota_ajuste, m.ajustes,
         m.estado, m.estado = 'en_mantencion'
  from public.rutinas r
  join public.rutina_ejercicios e on e.rutina_id = r.id
  join public.maquinas m on m.id = e.maquina_id
  where r.alumno_id = v_alumno
    and case
      when v_visita.rutina_fijada is true and (
        v_visita.salida is null or (
          v_visita.rutina_id is not null
          and not v_visita.cierre_automatico and v_visita.cerrada_por is null
          and (v_visita.salida at time zone 'America/Santiago')::date =
              (now() at time zone 'America/Santiago')::date
          and not exists (select from public.feedback f where f.visita_id = v_visita.id)
        )
      ) then r.id = v_visita.rutina_id
      else r.activa and privado.modalidad_rutina_habilitada(r.origen)
    end
  order by e.orden;
end;
$$;

create or replace function public.registrar_feedback_visita(p_visita uuid, p_rutina uuid, p_valor text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_alumno uuid;
  v_ultima uuid;
begin
  select a.id into v_alumno
  from public.alumnos a join public.perfiles p on p.id = a.perfil_id
  where p.id = (select auth.uid()) and p.rol = 'alumno' for update of a;
  if not found or not exists (select from public.rutinas where id = p_rutina and alumno_id = v_alumno) then
    raise exception 'sin_permiso';
  end if;
  select v.id into v_ultima from public.visitas v
  where v.alumno_id = v_alumno order by v.entrada desc, v.id desc limit 1;
  if v_ultima is distinct from p_visita or p_visita is null then raise exception 'sin_visita'; end if;
  return privado.registrar_feedback_en(p_rutina, p_valor, now());
end;
$$;
revoke all on function public.registrar_feedback_visita(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.registrar_feedback_visita(uuid, uuid, text) to authenticated;

commit;
