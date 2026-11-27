-- Desactiva 023 sin perder nombres, versiones ni referencias históricas.
begin;
drop trigger if exists fijar_rutina_visita on public.visitas;
drop function if exists privado.fijar_rutina_visita();
drop function if exists public.modalidades_de_rutina(), public.activar_rutina(uuid),
  public.guardar_rutina_personalizada(uuid, uuid, text, jsonb), public.archivar_rutina_propia(uuid),
  public.registrar_feedback_visita(uuid, uuid, text);

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
  if not v_rutina.activa then
    raise exception 'rutina_inactiva' using detail = 'Solo se da feedback a la rutina activa.';
  end if;

  select * into v_visita from public.visitas v
  where v.alumno_id = v_rutina.alumno_id
  order by v.entrada desc
  limit 1;
  if not found then
    raise exception 'sin_visita' using detail = 'El alumno no tiene visitas registradas.';
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

  return query
  select r.id, r.origen, e.orden, e.ejercicio, m.id, m.nombre, m.foto_url,
         e.series, e.repeticiones, e.minutos, e.carga_kg, e.nota_ajuste, m.ajustes,
         m.estado, m.estado = 'en_mantencion'
  from public.rutinas r
  join public.rutina_ejercicios e on e.rutina_id = r.id
  join public.maquinas m on m.id = e.maquina_id
  where r.alumno_id = v_alumno and r.activa
  order by e.orden;
end;
$$;

drop function if exists privado.asociar_primera_rutina_visita(uuid, uuid);
drop function if exists privado.modalidad_rutina_habilitada(text);
commit;
