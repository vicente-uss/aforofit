-- 005_tablas_flujo_ingreso.sql
-- AforoFit · Avance 3 · Tablas del flujo central: alumnos, tarjetas, configuracion, visitas, turnos y aforo.
-- Requiere 001_perfiles_roles.sql. Contrato: docs/contrato-flujo-ingreso.md.
-- Ejecutar en Supabase → SQL Editor. Se puede ejecutar más de una vez.

-- 1. Esquema privado: funciones internas que la API de Supabase no expone -------
create schema if not exists privado;
revoke all on schema privado from public, anon, authenticated;

-- 2. Alumnos --------------------------------------------------------------------
-- perfil_id es opcional para cargar alumnos ficticios sin crear usuarios en Auth.
create table if not exists public.alumnos (
  id                 uuid primary key default gen_random_uuid(),
  perfil_id          uuid unique references public.perfiles (id) on delete set null,
  nombre             text not null,
  rut                text unique,                    -- siempre ficticio
  carrera            text,
  certificado_hasta  date,                           -- solo la vigencia, sin datos médicos
  objetivo           text check (objetivo in ('fuerza', 'hipertrofia', 'salud')),
  nivel              text check (nivel in ('principiante', 'intermedio')),
  creado_en          timestamptz not null default now()
);

comment on table public.alumnos is 'Alumnos ficticios del prototipo y vigencia de su certificado.';

-- 3. Tarjetas (regla 1: el UID es la clave primaria, por lo tanto es único) -----
create table if not exists public.tarjetas (
  uid        text primary key
             check (uid ~ '^[0-9A-F]{2}(:[0-9A-F]{2}){3}$'
                 or uid ~ '^[0-9A-F]{2}(:[0-9A-F]{2}){6}$'
                 or uid ~ '^[0-9A-F]{2}(:[0-9A-F]{2}){9}$'),  -- formato de normalizarUid
  alumno_id  uuid not null references public.alumnos (id) on delete cascade,
  tipo       text not null default 'tne' check (tipo in ('tne', 'credencial_uss')),
  creado_en  timestamptz not null default now()
);

create index if not exists tarjetas_alumno_idx on public.tarjetas (alumno_id);

comment on table public.tarjetas is 'Credenciales (TNE o TUI) vinculadas a un solo alumno.';

-- 4. Configuración: una sola fila con todos los parámetros ------------------------
create table if not exists public.configuracion (
  id                       integer primary key default 1 check (id = 1),
  capacidad                integer not null default 20 check (capacidad > 0),
  horario                  jsonb not null check (jsonb_typeof(horario) = 'object'),
  periodo_inicio           date not null,
  periodo_fin              date not null,
  cierre_automatico_horas  integer not null default 3 check (cierre_automatico_horas > 0),
  turno_expira_minutos     integer not null default 10 check (turno_expira_minutos > 0),
  umbral_casi_lleno        numeric not null default 0.8
                           check (umbral_casi_lleno > 0 and umbral_casi_lleno <= 1),
  progresion               jsonb not null,
  modalidades_rutina       jsonb not null,
  check (periodo_fin >= periodo_inicio)
);

comment on table public.configuracion is 'Parámetros editables por el administrador (una sola fila, id = 1).';

insert into public.configuracion (
  id, capacidad, horario, periodo_inicio, periodo_fin, cierre_automatico_horas,
  turno_expira_minutos, umbral_casi_lleno, progresion, modalidades_rutina
) values (
  1, 20,
  '{
    "lunes":     {"apertura": "08:00", "ultimo_ingreso": "21:00"},
    "martes":    {"apertura": "08:00", "ultimo_ingreso": "21:00"},
    "miercoles": {"apertura": "08:00", "ultimo_ingreso": "21:00"},
    "jueves":    {"apertura": "08:00", "ultimo_ingreso": "21:00"},
    "viernes":   {"apertura": "08:00", "ultimo_ingreso": "21:00"},
    "sabado":    {"apertura": "08:00", "ultimo_ingreso": "13:00"},
    "domingo":   null
  }'::jsonb,
  date '2026-03-03', date '2026-12-23', 3, 10, 0.8,
  '{"facil_kg": 2.5, "justo_kg": 0, "me_costo_porcentaje": -5}'::jsonb,
  '{"sistema": true, "profesor": true, "alumno": true}'::jsonb
)
on conflict (id) do nothing;

-- 5. Visitas (regla 5: una visita abierta por alumno) -----------------------------
create table if not exists public.visitas (
  id                 uuid primary key default gen_random_uuid(),
  alumno_id          uuid not null references public.alumnos (id) on delete cascade,
  entrada            timestamptz not null default now(),
  salida             timestamptz,                    -- null mientras está adentro
  cierre_automatico  boolean not null default false,
  check (salida is null or salida >= entrada)
);

create unique index if not exists visitas_una_abierta_por_alumno
  on public.visitas (alumno_id) where salida is null;
create index if not exists visitas_alumno_idx on public.visitas (alumno_id);

comment on table public.visitas is 'Entradas y salidas del gimnasio.';

-- 6. Turnos de la lista de espera -------------------------------------------------
create table if not exists public.turnos (
  id          uuid primary key default gen_random_uuid(),
  alumno_id   uuid not null references public.alumnos (id) on delete cascade,
  numero      integer not null check (numero > 0),   -- correlativo del día
  estado      text not null default 'esperando'
              check (estado in ('esperando', 'llamado', 'usado', 'expirado')),
  creado_en   timestamptz not null default now(),
  llamado_en  timestamptz,
  check (estado <> 'llamado' or llamado_en is not null)
);

-- El número no se repite en el mismo día de Santiago.
create unique index if not exists turnos_numero_por_dia
  on public.turnos (((creado_en at time zone 'America/Santiago')::date), numero);

-- Un alumno tiene como máximo un turno activo por día.
create unique index if not exists turnos_uno_activo_por_alumno
  on public.turnos (alumno_id, ((creado_en at time zone 'America/Santiago')::date))
  where estado in ('esperando', 'llamado');

comment on table public.turnos is 'Lista de espera con número de turno por día.';

-- 7. Aforo: una sola fila pública, sin datos de alumnos ---------------------------
create table if not exists public.aforo (
  id                 integer primary key default 1 check (id = 1),
  ocupacion          integer not null default 0 check (ocupacion >= 0),
  capacidad          integer not null,
  turno_llamado      integer,
  en_espera          integer not null default 0 check (en_espera >= 0),
  umbral_casi_lleno  numeric not null,
  actualizado_en     timestamptz not null default now()
);

comment on table public.aforo is 'Resumen público del aforo. Solo lo escriben las funciones de la base.';

insert into public.aforo (id, capacidad, umbral_casi_lleno)
select 1, c.capacidad, c.umbral_casi_lleno from public.configuracion c where c.id = 1
on conflict (id) do nothing;

-- 8. Cerrado por defecto ----------------------------------------------------------
-- Los permisos por defecto del proyecto dan todo a anon y authenticated: se quitan aquí.
-- Las políticas y los permisos de lectura se agregan en 007_permisos_flujo_ingreso.sql.
alter table public.alumnos       enable row level security;
alter table public.tarjetas      enable row level security;
alter table public.configuracion enable row level security;
alter table public.visitas       enable row level security;
alter table public.turnos        enable row level security;
alter table public.aforo         enable row level security;

revoke all on public.alumnos, public.tarjetas, public.configuracion,
              public.visitas, public.turnos, public.aforo
  from public, anon, authenticated;
