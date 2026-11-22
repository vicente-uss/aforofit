-- 008_datos_prueba_flujo_ingreso.sql
-- AforoFit · Avance 3 · 25 alumnos inventados para llenar el gimnasio y probar la lista de espera.
-- Todo es ficticio: los RUT terminan en "F" (no existen) y los UID no son de tarjetas reales.
-- Casos especiales: el alumno 24 tiene el certificado vencido y el 25 no tiene tarjeta.
-- Requiere 005. Se puede ejecutar más de una vez.

with datos (n, nombre, carrera, certificado_hasta, uid) as (
  values
    ( 1, 'Antonia Fictia Rivas',     'Ingeniería Civil Informática', date '2026-12-23', '04:A3:7F:2B'),
    ( 2, 'Benjamín Prueba Soto',     'Kinesiología',                 date '2026-12-23', '1C:5E:90:D4'),
    ( 3, 'Catalina Demo Fuentes',    'Enfermería',                   date '2026-12-23', 'B2:07:6A:3F'),
    ( 4, 'Diego Ficticio Muñoz',     'Derecho',                      date '2026-12-23', 'FA:10:00:04'),
    ( 5, 'Emilia Prueba Castro',     'Psicología',                   date '2026-12-23', 'FA:10:00:05'),
    ( 6, 'Felipe Demo Araya',        'Arquitectura',                 date '2026-12-23', 'FA:10:00:06'),
    ( 7, 'Gabriela Fictia Tapia',    'Nutrición y Dietética',        date '2026-12-23', 'FA:10:00:07'),
    ( 8, 'Hernán Prueba Vera',       'Ingeniería Comercial',         date '2026-12-23', 'FA:10:00:08'),
    ( 9, 'Isabel Demo Reyes',        'Odontología',                  date '2026-12-23', 'FA:10:00:09'),
    (10, 'Joaquín Ficticio Lagos',   'Medicina',                     date '2026-12-23', 'FA:10:00:0A'),
    (11, 'Karla Prueba Olivares',    'Tecnología Médica',            date '2026-12-23', 'FA:10:00:0B'),
    (12, 'Lucas Demo Navarro',       'Periodismo',                   date '2026-12-23', 'FA:10:00:0C'),
    (13, 'Martina Fictia Pizarro',   'Pedagogía en Educación Física',date '2026-12-23', 'FA:10:00:0D'),
    (14, 'Nicolás Prueba Campos',    'Ingeniería Civil Industrial',  date '2026-12-23', 'FA:10:00:0E'),
    (15, 'Olivia Demo Sepúlveda',    'Fonoaudiología',               date '2026-12-23', 'FA:10:00:0F'),
    (16, 'Pablo Ficticio Espinoza',  'Terapia Ocupacional',          date '2026-12-23', 'FA:10:00:10'),
    (17, 'Renata Prueba Cortés',     'Obstetricia',                  date '2026-12-23', 'FA:10:00:11'),
    (18, 'Sebastián Demo Bravo',     'Contador Auditor',             date '2026-12-23', 'FA:10:00:12'),
    (19, 'Trinidad Fictia Molina',   'Diseño',                       date '2026-12-23', 'FA:10:00:13'),
    (20, 'Tomás Prueba Herrera',     'Ingeniería Civil Informática', date '2026-12-23', 'FA:10:00:14'),
    (21, 'Valentina Demo Paredes',   'Kinesiología',                 date '2026-12-23', 'FA:10:00:15'),
    (22, 'Vicente Ficticio Salinas', 'Derecho',                      date '2026-12-23', 'FA:10:00:16'),
    (23, 'Ximena Prueba Contreras',  'Psicología',                   date '2026-12-23', 'FA:10:00:17'),
    (24, 'Yerko Demo Vencido',       'Enfermería',                   date '2026-06-30', 'FA:10:00:18'),
    (25, 'Zoe Fictia Sintarjeta',    'Medicina',                     date '2026-12-23', null)
),
insertados as (
  insert into public.alumnos (nombre, rut, carrera, certificado_hasta)
  select d.nombre, '00.000.' || lpad(d.n::text, 3, '0') || '-F', d.carrera, d.certificado_hasta
  from datos d
  on conflict (rut) do nothing
  returning id, rut
),
alumnos_con_rut as (
  select id, rut from insertados
  union
  select a.id, a.rut from public.alumnos a
  where a.rut in (select '00.000.' || lpad(d.n::text, 3, '0') || '-F' from datos d)
)
insert into public.tarjetas (uid, alumno_id, tipo)
select d.uid, a.id, 'tne'
from datos d
join alumnos_con_rut a on a.rut = '00.000.' || lpad(d.n::text, 3, '0') || '-F'
where d.uid is not null
on conflict (uid) do nothing;

-- La cuenta alumno.demo queda ligada al alumno 1 para probar la lectura de lo propio.
update public.alumnos a
set perfil_id = u.id
from auth.users u
where u.email = 'alumno.demo@aforofit.cl'
  and a.rut = '00.000.001-F'
  and a.perfil_id is null;
