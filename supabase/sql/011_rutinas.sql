-- 011_rutinas.sql
-- AforoFit · Entrega final · F-01: base de datos de la rutina (B2 y B4 del CR-01).
-- Plantillas por objetivo y nivel (D12), rutina del alumno, feedback y progresión de cargas (regla 8),
-- rutina del día con el estado de cada máquina (regla 7) y aviso de entrada en tiempo real (D13).
-- Requiere 001 a 008 (perfiles, maquinas con el inventario de 004, alumnos, visitas y configuracion).
-- Ejecutar en Supabase → SQL Editor. Se puede ejecutar más de una vez.
--
-- Errores: las funciones públicas usan «raise exception» con un código corto en el mensaje
-- (sin_permiso, sin_objetivo_nivel, …) y la explicación en el detalle. En supabase-js llegan como
-- error.message y error.details.

-- 1. Plantillas (D12): 3 objetivos × 2 niveles ------------------------------------------
create table if not exists public.plantillas (
  id        bigint generated always as identity primary key,
  objetivo  text not null check (objetivo in ('fuerza', 'hipertrofia', 'salud')),
  nivel     text not null check (nivel in ('principiante', 'intermedio')),
  nombre    text not null,
  unique (objetivo, nivel)
);

comment on table public.plantillas is 'Plantillas de rutina por objetivo y nivel (D12). Solo lectura para usuarios.';

-- Un ejercicio es de fuerza (repeticiones y carga en kg) o de cardio (minutos, sin carga).
create table if not exists public.plantilla_ejercicios (
  id                bigint generated always as identity primary key,
  plantilla_id      bigint not null references public.plantillas (id) on delete cascade,
  orden             integer not null check (orden > 0),
  ejercicio         text not null,                           -- ej. «Sentadilla»
  maquina_id        bigint not null references public.maquinas (id),
  series            integer not null check (series > 0),
  repeticiones      integer check (repeticiones > 0),        -- null en cardio
  minutos           integer check (minutos > 0),             -- solo cardio
  carga_inicial_kg  numeric(5, 1) check (carga_inicial_kg >= 0),  -- null en cardio
  nota_ajuste       text,                                    -- ajuste de máquina sugerido
  unique (plantilla_id, orden),
  check (
    (repeticiones is not null and minutos is null)
    or (repeticiones is null and minutos is not null and carga_inicial_kg is null)
  )
);

comment on table public.plantilla_ejercicios is 'Ejercicios de cada plantilla. Solo usan máquinas de public.maquinas.';

-- 2. Rutina del alumno ------------------------------------------------------------------
-- origen y autor_id dejan abierta la puerta a D15 (rutinas del profesor o del alumno, próxima versión).
create table if not exists public.rutinas (
  id            uuid primary key default gen_random_uuid(),
  alumno_id     uuid not null references public.alumnos (id) on delete cascade,
  plantilla_id  bigint references public.plantillas (id) on delete set null,
  origen        text not null default 'sistema' check (origen in ('sistema', 'profesor', 'alumno')),
  autor_id      uuid references public.perfiles (id) on delete set null,
  activa        boolean not null default true,
  creada_en     timestamptz not null default now()
);

-- Una sola rutina activa por alumno; las anteriores quedan inactivas como historial.
create unique index if not exists rutinas_una_activa_por_alumno
  on public.rutinas (alumno_id) where activa;
create index if not exists rutinas_alumno_idx on public.rutinas (alumno_id);

comment on table public.rutinas is 'Rutinas de cada alumno. Solo una activa; las anteriores no se borran.';

create table if not exists public.rutina_ejercicios (
  id              uuid primary key default gen_random_uuid(),
  rutina_id       uuid not null references public.rutinas (id) on delete cascade,
  orden           integer not null check (orden > 0),
  ejercicio       text not null,
  maquina_id      bigint not null references public.maquinas (id),
  series          integer not null check (series > 0),
  repeticiones    integer check (repeticiones > 0),
  minutos         integer check (minutos > 0),
  carga_kg        numeric(5, 1) check (carga_kg >= 0),        -- carga actual; null en cardio
  nota_ajuste     text,
  actualizado_en  timestamptz not null default now(),
  unique (rutina_id, orden),
  check (
    (repeticiones is not null and minutos is null)
    or (repeticiones is null and minutos is not null and carga_kg is null)
  )
);

comment on table public.rutina_ejercicios is 'Ejercicios de la rutina del alumno con su carga actual (cambia con el feedback).';

-- 3. Feedback: uno por visita (VISITAS ||--o| FEEDBACK en el modelo ER) -------------------
create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  visita_id  uuid not null unique references public.visitas (id) on delete cascade,
  rutina_id  uuid not null references public.rutinas (id) on delete cascade,
  valor      text not null check (valor in ('facil', 'justo', 'me_costo')),
  creado_en  timestamptz not null default now()
);

create index if not exists feedback_rutina_idx on public.feedback (rutina_id);

comment on table public.feedback is 'Respuesta del alumno al salir: fácil, justo o me costó (regla 8).';

-- 4. Parámetro de redondeo de la progresión ----------------------------------------------
-- configuracion.progresion ya trae facil_kg, justo_kg y me_costo_porcentaje (005). Se agrega
-- el paso de redondeo (2,5 kg) para que tampoco quede fijo en el código. No pisa un valor existente.
update public.configuracion
set progresion = progresion || '{"redondeo_kg": 2.5}'::jsonb
where id = 1 and not (progresion ? 'redondeo_kg');

-- 5. Datos: las seis plantillas ---------------------------------------------------------
-- Las máquinas se buscan por nombre exacto (004). Si alguna no existe, la subconsulta da null y el
-- insert falla por maquina_id not null: así nunca queda una plantilla con una máquina no registrada.
-- Cargas iniciales sugeridas y conservadoras, en múltiplos de 2,5 kg. Datos de ejemplo del prototipo.
insert into public.plantillas (objetivo, nivel, nombre) values
  ('fuerza',      'principiante', 'Fuerza · principiante'),
  ('fuerza',      'intermedio',   'Fuerza · intermedio'),
  ('hipertrofia', 'principiante', 'Hipertrofia · principiante'),
  ('hipertrofia', 'intermedio',   'Hipertrofia · intermedio'),
  ('salud',       'principiante', 'Salud · principiante'),
  ('salud',       'intermedio',   'Salud · intermedio')
on conflict (objetivo, nivel) do update set nombre = excluded.nombre;

insert into public.plantilla_ejercicios (
  plantilla_id, orden, ejercicio, maquina_id, series, repeticiones, minutos, carga_inicial_kg, nota_ajuste
)
select
  p.id, v.orden, v.ejercicio,
  (select m.id from public.maquinas m where m.nombre = v.maquina),
  v.series, v.repeticiones, v.minutos, v.carga, v.nota
from (values
  -- Fuerza: pocas repeticiones (5 a 6) y más series.
  ('fuerza', 'principiante', 1, 'Calentamiento en bicicleta', 'Bicicleta estática (LifeFitness)', 1, null::int, 5, null::numeric, 'Sillín a la altura de la cadera'),
  ('fuerza', 'principiante', 2, 'Sentadilla guiada', 'Máquina Smith', 3, 6, null, 30, 'Topes de seguridad bajo la altura de la sentadilla'),
  ('fuerza', 'principiante', 3, 'Press de banca plano', 'Banco plano olímpico', 3, 6, null, 30, 'Barra a la altura de los ojos al acostarte'),
  ('fuerza', 'principiante', 4, 'Prensa de piernas', 'Prensa de piernas horizontal (SportsArt)', 3, 6, null, 60, 'Asiento con las rodillas en 90° al inicio'),
  ('fuerza', 'principiante', 5, 'Remo sentado en polea', 'Máquina de poleas cruzadas (DAP)', 3, 6, null, 20, 'Polea en la posición más baja'),

  ('fuerza', 'intermedio', 1, 'Calentamiento en trotadora', 'Trotadora (SportsArt)', 1, null, 5, null, 'Velocidad suave, sin inclinación'),
  ('fuerza', 'intermedio', 2, 'Sentadilla con barra', 'Jaula de sentadillas (rack negro)', 5, 5, null, 50, 'Soportes a la altura del hombro'),
  ('fuerza', 'intermedio', 3, 'Press de banca plano', 'Banco plano olímpico', 5, 5, null, 45, 'Barra a la altura de los ojos al acostarte'),
  ('fuerza', 'intermedio', 4, 'Peso muerto', 'Jaula de sentadillas (rack blanco)', 4, 5, null, 60, 'Barra en el suelo, dentro de la jaula'),
  ('fuerza', 'intermedio', 5, 'Press militar guiado', 'Máquina Smith', 4, 5, null, 25, 'Barra a la altura de la barbilla, sentado'),
  ('fuerza', 'intermedio', 6, 'Remo sentado en polea', 'Máquina de poleas cruzadas (DAP)', 4, 6, null, 30, 'Polea en la posición más baja'),

  -- Hipertrofia: 8 a 12 repeticiones.
  ('hipertrofia', 'principiante', 1, 'Calentamiento en bicicleta', 'Bicicleta estática (LifeFitness)', 1, null, 5, null, 'Sillín a la altura de la cadera'),
  ('hipertrofia', 'principiante', 2, 'Press de pecho sentado', 'Máquina de press de pecho sentado (SportsArt)', 3, 12, null, 25, 'Asiento con las manillas a la altura del pecho'),
  ('hipertrofia', 'principiante', 3, 'Prensa de piernas', 'Prensa de piernas horizontal (SportsArt)', 3, 12, null, 50, 'Asiento con las rodillas en 90° al inicio'),
  ('hipertrofia', 'principiante', 4, 'Extensión de piernas', 'Máquina de extensión de piernas', 3, 12, null, 20, 'Respaldo con la rodilla alineada al eje de la máquina'),
  ('hipertrofia', 'principiante', 5, 'Remo sentado en polea', 'Máquina de poleas cruzadas (DAP)', 3, 12, null, 20, 'Polea en la posición más baja'),
  ('hipertrofia', 'principiante', 6, 'Extensión de tríceps en polea', 'Máquina de poleas cruzadas (DAP)', 3, 12, null, 10, 'Polea en la posición más alta, con cuerda'),

  ('hipertrofia', 'intermedio', 1, 'Calentamiento en trotadora', 'Trotadora (SportsArt)', 1, null, 5, null, 'Velocidad suave, sin inclinación'),
  ('hipertrofia', 'intermedio', 2, 'Press de banca plano', 'Banco plano olímpico', 4, 10, null, 40, 'Barra a la altura de los ojos al acostarte'),
  ('hipertrofia', 'intermedio', 3, 'Press de banca declinado', 'Banco declinado olímpico', 3, 10, null, 35, 'Pies bien trabados en los rodillos'),
  ('hipertrofia', 'intermedio', 4, 'Sentadilla guiada', 'Máquina Smith', 4, 10, null, 40, 'Topes de seguridad bajo la altura de la sentadilla'),
  ('hipertrofia', 'intermedio', 5, 'Extensión de piernas', 'Máquina de extensión de piernas', 3, 12, null, 30, 'Respaldo con la rodilla alineada al eje de la máquina'),
  ('hipertrofia', 'intermedio', 6, 'Cruce de poleas', 'Máquina de poleas cruzadas (DAP)', 3, 12, null, 12.5, 'Poleas a la altura del hombro'),

  -- Salud: más cardio, cargas bajas y 15 repeticiones.
  ('salud', 'principiante', 1, 'Caminata en trotadora', 'Trotadora (SportsArt)', 1, null, 15, null, 'Velocidad suave, sin inclinación'),
  ('salud', 'principiante', 2, 'Prensa de piernas', 'Prensa de piernas horizontal (SportsArt)', 2, 15, null, 30, 'Asiento con las rodillas en 90° al inicio'),
  ('salud', 'principiante', 3, 'Press de pecho sentado', 'Máquina de press de pecho sentado (SportsArt)', 2, 15, null, 15, 'Asiento con las manillas a la altura del pecho'),
  ('salud', 'principiante', 4, 'Remo sentado en polea', 'Máquina de poleas cruzadas (DAP)', 2, 15, null, 10, 'Polea en la posición más baja'),
  ('salud', 'principiante', 5, 'Bicicleta', 'Bicicleta estática (LifeFitness)', 1, null, 10, null, 'Sillín a la altura de la cadera'),

  ('salud', 'intermedio', 1, 'Bicicleta', 'Bicicleta estática (LifeFitness)', 1, null, 15, null, 'Sillín a la altura de la cadera'),
  ('salud', 'intermedio', 2, 'Sentadilla guiada', 'Máquina Smith', 3, 15, null, 20, 'Topes de seguridad bajo la altura de la sentadilla'),
  ('salud', 'intermedio', 3, 'Press de pecho sentado', 'Máquina de press de pecho sentado (SportsArt)', 3, 15, null, 20, 'Asiento con las manillas a la altura del pecho'),
  ('salud', 'intermedio', 4, 'Remo sentado en polea', 'Máquina de poleas cruzadas (DAP)', 3, 15, null, 15, 'Polea en la posición más baja'),
  ('salud', 'intermedio', 5, 'Trote suave en trotadora', 'Trotadora (SportsArt)', 1, null, 15, null, 'Velocidad cómoda, inclinación 1 %')
) as v(objetivo, nivel, orden, ejercicio, maquina, series, repeticiones, minutos, carga, nota)
join public.plantillas p on p.objetivo = v.objetivo and p.nivel = v.nivel
on conflict (plantilla_id, orden) do update set
  ejercicio        = excluded.ejercicio,
  maquina_id       = excluded.maquina_id,
  series           = excluded.series,
  repeticiones     = excluded.repeticiones,
  minutos          = excluded.minutos,
  carga_inicial_kg = excluded.carga_inicial_kg,
  nota_ajuste      = excluded.nota_ajuste;

-- 6. Regla 8: nueva carga según el feedback ----------------------------------------------
-- Misma regla que lib/rutina/progresion.ts. Con los valores iniciales: fácil = +2,5 kg,
-- justo = igual, me costó = −5 %, redondeado al múltiplo de 2,5 kg más cercano y nunca negativo.
-- Ej. CA14: 40 kg → 42,5 / 40 / 37,5. 37 kg con «me costó» → 35,15 → 35 kg.
-- Cardio (carga null) devuelve null: no cambia.
create or replace function privado.nueva_carga(p_carga numeric, p_valor text, p_progresion jsonb)
returns numeric
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_facil      numeric := (p_progresion ->> 'facil_kg')::numeric;
  v_justo      numeric := (p_progresion ->> 'justo_kg')::numeric;
  v_me_costo   numeric := (p_progresion ->> 'me_costo_porcentaje')::numeric;
  v_paso       numeric := (p_progresion ->> 'redondeo_kg')::numeric;
  v_bruta      numeric;
begin
  if p_carga is null then
    return null;
  end if;

  if v_facil is null or v_justo is null or v_me_costo is null or v_paso is null or v_paso <= 0 then
    raise exception 'progresion_sin_configurar'
      using detail = 'configuracion.progresion debe tener facil_kg, justo_kg, me_costo_porcentaje y redondeo_kg.';
  end if;

  v_bruta := case p_valor
    when 'facil'    then p_carga + v_facil
    when 'justo'    then p_carga + v_justo
    when 'me_costo' then p_carga * (1 + v_me_costo / 100)
  end;

  if v_bruta is null then
    raise exception 'valor_invalido' using detail = 'El feedback debe ser facil, justo o me_costo.';
  end if;

  return greatest(round(v_bruta / v_paso) * v_paso, 0);
end;
$$;

-- 7. Generar la rutina desde la plantilla (RF12, CA12) -----------------------------------
-- Lógica sin chequeo de sesión, para probarla; el chequeo está en public.generar_rutina.
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

-- Solo el dueño (alumnos.perfil_id = auth.uid()) puede generar su rutina.
create or replace function public.generar_rutina(p_alumno uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.alumnos a
    where a.id = p_alumno and a.perfil_id = (select auth.uid())
  ) then
    raise exception 'sin_permiso' using detail = 'Solo el alumno dueño puede generar su rutina.';
  end if;

  return privado.generar_rutina_de(p_alumno);
end;
$$;

-- 8. Registrar el feedback y ajustar las cargas (RF18, regla 8, CA14) --------------------
-- El feedback se asocia a la última visita del alumno (abierta o recién cerrada), una sola vez.
-- Si la visita se cerró sola (regla 6) no se pide feedback (diagrama de estados de la visita).
-- Si la rutina no es de origen 'sistema' (D15, próxima versión) se registra sin cambiar cargas.
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

create or replace function public.registrar_feedback(p_rutina uuid, p_valor text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.rutinas r
    join public.alumnos a on a.id = r.alumno_id
    where r.id = p_rutina and a.perfil_id = (select auth.uid())
  ) then
    raise exception 'sin_permiso' using detail = 'Solo el alumno dueño puede responder por su rutina.';
  end if;

  return privado.registrar_feedback_en(p_rutina, p_valor, now());
end;
$$;

-- 9. Rutina del día con la advertencia de mantención (RF16, RF17, regla 7, CA13) ---------
-- La advertencia no se guarda: se calcula con maquinas.estado al leer, así el cambio de estado
-- del profesor (B5) se ve de inmediato. Sin p_alumno, devuelve la del alumno con la sesión.
-- Sin rutina activa devuelve cero filas (la pantalla ofrece generarla, CU04 1a).
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

-- 10. Seguridad por filas ----------------------------------------------------------------
-- Nadie escribe directo desde el cliente: rutinas, ejercicios y feedback cambian solo con
-- generar_rutina y registrar_feedback, que verifican que el alumno sea el dueño.
alter table public.plantillas           enable row level security;
alter table public.plantilla_ejercicios enable row level security;
alter table public.rutinas              enable row level security;
alter table public.rutina_ejercicios    enable row level security;
alter table public.feedback             enable row level security;

revoke all on public.plantillas, public.plantilla_ejercicios, public.rutinas,
              public.rutina_ejercicios, public.feedback
  from public, anon, authenticated;

-- Plantillas: catálogo de solo lectura para cualquier usuario con sesión.
drop policy if exists "plantillas_leer" on public.plantillas;
create policy "plantillas_leer"
  on public.plantillas for select to authenticated using (true);

drop policy if exists "plantilla_ejercicios_leer" on public.plantilla_ejercicios;
create policy "plantilla_ejercicios_leer"
  on public.plantilla_ejercicios for select to authenticated using (true);

-- Rutinas: la política de alumnos (007) ya filtra «lo propio, o todo si es profesor o admin».
drop policy if exists "rutinas_leer" on public.rutinas;
create policy "rutinas_leer"
  on public.rutinas for select to authenticated
  using (alumno_id in (select a.id from public.alumnos a));

-- Ejercicios y feedback: heredan el filtro de rutinas.
drop policy if exists "rutina_ejercicios_leer" on public.rutina_ejercicios;
create policy "rutina_ejercicios_leer"
  on public.rutina_ejercicios for select to authenticated
  using (rutina_id in (select r.id from public.rutinas r));

drop policy if exists "feedback_leer" on public.feedback;
create policy "feedback_leer"
  on public.feedback for select to authenticated
  using (rutina_id in (select r.id from public.rutinas r));

grant select on public.plantillas, public.plantilla_ejercicios, public.rutinas,
                public.rutina_ejercicios, public.feedback
  to authenticated;

-- 11. Realtime para F-02: cómo se entera el celular de la entrada (D13, CA11) -------------
-- El kiosco registra la entrada con registrar_ingreso, que inserta una fila en public.visitas.
-- El celular del alumno (sesión abierta en /alumno) se suscribe a esa tabla con su propio id:
--   supabase.channel('mi-visita').on('postgres_changes',
--     { event: '*', schema: 'public', table: 'visitas', filter: `alumno_id=eq.${alumnoId}` }, …)
-- · INSERT (entrada) → llama a rutina_del_dia() y muestra la rutina.
-- · UPDATE con salida (salida) → muestra la pregunta fácil / justo / me costó (registrar_feedback).
-- Realtime aplica RLS a cada suscriptor: la política visitas_leer (007) deja al alumno leer solo
-- sus visitas, abierta o cerrada, así que nunca recibe las de otros. Profesor y admin, que pueden
-- leer todas, recibirían todas si se suscriben. Para UPDATE basta la identidad de réplica por
-- defecto: el evento trae la fila nueva completa.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'visitas'
  ) then
    alter publication supabase_realtime add table public.visitas;
  end if;
end;
$$;

-- 12. Permisos de ejecución --------------------------------------------------------------
revoke all on function privado.nueva_carga(numeric, text, jsonb) from public, anon, authenticated;
revoke all on function privado.generar_rutina_de(uuid) from public, anon, authenticated;
revoke all on function privado.registrar_feedback_en(uuid, text, timestamptz) from public, anon, authenticated;

revoke execute on function public.generar_rutina(uuid) from public, anon;
grant execute on function public.generar_rutina(uuid) to authenticated;

revoke execute on function public.registrar_feedback(uuid, text) from public, anon;
grant execute on function public.registrar_feedback(uuid, text) to authenticated;

revoke execute on function public.rutina_del_dia(uuid) from public, anon;
grant execute on function public.rutina_del_dia(uuid) to authenticated;

-- Verificación: debería mostrar 6 plantillas, entre 4 y 6 ejercicios cada una, todas con máquina.
select p.nombre, count(e.id) as ejercicios
from public.plantillas p
left join public.plantilla_ejercicios e on e.plantilla_id = p.id
group by p.id, p.nombre
order by p.id;
