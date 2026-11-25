-- 012_mantencion_y_cierre_manual.sql
-- AforoFit · Entrega final · F-03 (B5, estado de máquinas) y F-28 (cerrar visita a mano, D21).
-- Requiere 001 a 011. Ejecutar en Supabase → SQL Editor. Se puede ejecutar más de una vez.
--
-- Errores: como en 011, «raise exception» con un código corto en el mensaje (sin_permiso,
-- maquina_no_encontrada, …) y la explicación en el detalle.

-- 1. Marca de cierre manual en visitas -------------------------------------------------
-- cerrada_por guarda qué profesor o admin cerró la visita a mano. Las salidas normales y el cierre
-- automático (regla 6) la dejan en null, así que registrar_ingreso no cambia.
alter table public.visitas
  add column if not exists cerrada_por uuid references public.perfiles (id) on delete set null;

comment on column public.visitas.cerrada_por is
  'Profesor o admin que cerró la visita a mano (D21). Null en salidas normales y cierres automáticos.';

-- Un cierre es manual o automático, nunca los dos; y solo una visita cerrada puede tener cerrada_por.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'visitas_cierre_manual_valido') then
    alter table public.visitas add constraint visitas_cierre_manual_valido
      check (cerrada_por is null or (salida is not null and not cierre_automatico));
  end if;
end;
$$;

-- 2. Ayuda: ¿la sesión es de un profesor o admin? --------------------------------------
create or replace function privado.es_profesor_o_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.perfiles p
    where p.id = (select auth.uid()) and p.rol in ('profesor', 'admin')
  )
$$;

-- 3. Cambiar el estado de una máquina (B5, RF20, D05) ------------------------------------
-- Valores exactos del check de 002_maquinas.sql. La advertencia en la rutina (regla 7) no se guarda:
-- rutina_del_dia (011) la calcula al leer, así que el cambio se ve en la próxima lectura del alumno.
create or replace function public.cambiar_estado_maquina(p_maquina bigint, p_estado text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_maquina public.maquinas%rowtype;
begin
  if not privado.es_profesor_o_admin() then
    raise exception 'sin_permiso' using detail = 'Solo un profesor o un admin cambia el estado de una máquina.';
  end if;

  if p_estado is null or p_estado not in ('disponible', 'en_mantencion') then
    raise exception 'valor_invalido' using detail = 'El estado debe ser disponible o en_mantencion.';
  end if;

  update public.maquinas set estado = p_estado
  where id = p_maquina
  returning * into v_maquina;

  if not found then
    raise exception 'maquina_no_encontrada' using detail = 'No existe una máquina con ese id.';
  end if;

  return jsonb_build_object('id', v_maquina.id, 'nombre', v_maquina.nombre, 'estado', v_maquina.estado);
end;
$$;

-- 4. Cerrar una visita a mano (F-28, D21) -----------------------------------------------
-- Lógica con la hora como parámetro, para probarla; el chequeo de rol está en public.cerrar_visita.
-- Después de cerrar llama a privado.sincronizar_aforo (006), la misma función con la que termina la
-- salida normal de registrar_ingreso: recalcula la ocupación y llama al siguiente turno si cabe.
-- No se copia esa lógica. La expiración de turnos llamados sin reclamar sigue ocurriendo en
-- registrar_ingreso, como hoy (detalle menor aceptado en AGENTS.md 10).
create or replace function privado.cerrar_visita_en(p_visita uuid, p_ahora timestamptz, p_por uuid)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_visita public.visitas%rowtype;
  v_fila   public.aforo%rowtype;
begin
  -- Mismo orden de bloqueo que registrar_ingreso: primero el aforo, después la visita.
  perform 1 from public.aforo where id = 1 for update;

  select * into v_visita from public.visitas where id = p_visita for update;
  if not found then
    raise exception 'visita_no_encontrada' using detail = 'No existe una visita con ese id.';
  end if;
  if v_visita.salida is not null then
    raise exception 'visita_ya_cerrada' using detail = 'Esa visita ya tiene salida registrada.';
  end if;

  -- greatest: la salida nunca queda antes de la entrada (check de 005).
  update public.visitas
  set salida = greatest(p_ahora, v_visita.entrada), cerrada_por = p_por, cierre_automatico = false
  where id = p_visita;

  v_fila := privado.sincronizar_aforo(p_ahora);

  return jsonb_build_object(
    'visita_id', p_visita,
    'ocupacion', v_fila.ocupacion,
    'capacidad', v_fila.capacidad,
    'turno_llamado', v_fila.turno_llamado
  );
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

  return privado.cerrar_visita_en(p_visita, now(), (select auth.uid()));
end;
$$;

-- 5. Feedback: una visita cerrada a mano no lo acepta (igual que el cierre automático) -----
-- Misma función de 011 con un chequeo más (visita_cierre_manual).
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

-- 6. Permisos de ejecución ---------------------------------------------------------------
revoke all on function privado.es_profesor_o_admin() from public, anon, authenticated;
revoke all on function privado.cerrar_visita_en(uuid, timestamptz, uuid) from public, anon, authenticated;
revoke all on function privado.registrar_feedback_en(uuid, text, timestamptz) from public, anon, authenticated;

revoke execute on function public.cambiar_estado_maquina(bigint, text) from public, anon;
grant execute on function public.cambiar_estado_maquina(bigint, text) to authenticated;

revoke execute on function public.cerrar_visita(uuid) from public, anon;
grant execute on function public.cerrar_visita(uuid) to authenticated;
