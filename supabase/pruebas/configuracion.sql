-- configuracion.sql
-- AforoFit · Pruebas de F-09 (actualizar_configuracion, D24, RNF08) y del horario con cierre (014).
-- Corre dentro de begin; … rollback; y no deja cambios. Requiere 001 a 014 y las cuentas admin.demo,
-- profesor.demo y alumno.demo. Ejecutar completo en Supabase → SQL Editor.
-- Usa una fecha futura fija (lunes 7 de diciembre de 2026) para no depender de la hora real.
-- Cada caso imprime OK; el primero que falle detiene todo con raise exception.

begin;

create temp table resultado_pruebas (
  n serial primary key,
  criterio text not null,
  caso text not null,
  estado text not null
) on commit drop;

create function pg_temp.h(p_fecha_hora text) returns timestamptz language sql as $$
  select p_fecha_hora::timestamp at time zone 'America/Santiago'
$$;

create function pg_temp.ok(p_criterio text, p_caso text, p_condicion boolean) returns void
language plpgsql as $$
begin
  if p_condicion is not true then
    raise exception 'FALLÓ [%] %', p_criterio, p_caso;
  end if;
  insert into resultado_pruebas (criterio, caso, estado) values (p_criterio, p_caso, 'OK');
  raise notice 'OK [%] %', p_criterio, p_caso;
end;
$$;

create function pg_temp.error_de(p_sql text) returns text
language plpgsql as $$
begin
  execute p_sql;
  return null;
exception when others then
  return sqlerrm;
end;
$$;

create function pg_temp.sesion(p_usuario uuid) returns void
language plpgsql as $$
begin
  perform set_config('request.jwt.claims',
    case when p_usuario is null then ''
         else jsonb_build_object('sub', p_usuario, 'role', 'authenticated')::text end, true);
end;
$$;

-- Horario real del gimnasio (AGENTS.md 1), con un cambio opcional en un día.
create function pg_temp.horario(p_dia text default null, p_franja jsonb default null) returns jsonb
language sql as $$
  select jsonb_build_object(
    'lunes',     '{"apertura": "08:00", "cierre": "22:00", "ultimo_ingreso": "21:00"}'::jsonb,
    'martes',    '{"apertura": "08:00", "cierre": "22:00", "ultimo_ingreso": "21:00"}'::jsonb,
    'miercoles', '{"apertura": "08:00", "cierre": "22:00", "ultimo_ingreso": "21:00"}'::jsonb,
    'jueves',    '{"apertura": "08:00", "cierre": "22:00", "ultimo_ingreso": "21:00"}'::jsonb,
    'viernes',   '{"apertura": "08:00", "cierre": "22:00", "ultimo_ingreso": "21:00"}'::jsonb,
    'sabado',    '{"apertura": "08:00", "cierre": "14:00", "ultimo_ingreso": "13:00"}'::jsonb,
    'domingo',   'null'::jsonb
  ) || case when p_dia is null then '{}'::jsonb else jsonb_build_object(p_dia, p_franja) end
$$;

do $$
declare
  c_lunes constant text := '2026-12-07 ';
  v_admin     uuid;
  v_profesor  uuid;
  v_uid_demo  uuid;
  v_config    public.configuracion%rowtype;
  r           jsonb;
  v_msg       text;
  v_n         integer;
  v_escribio  boolean;
  v_filas     integer;
begin
  select p.id into strict v_admin from public.perfiles p where p.rol = 'admin' order by p.id limit 1;
  select p.id into strict v_profesor from public.perfiles p where p.rol = 'profesor' order by p.id limit 1;
  select u.id into strict v_uid_demo from auth.users u where u.email = 'alumno.demo@aforofit.cl';

  -- Estado conocido: nadie adentro y configuración inicial.
  update public.visitas set salida = entrada where salida is null;
  update public.configuracion
  set capacidad = 20, cierre_automatico_horas = 3, turno_expira_minutos = 10, horario = pg_temp.horario();

  insert into public.alumnos (nombre, rut, certificado_hasta)
  select 'Prueba ' || g, 'PRUEBA-' || g, date '2027-11-25' from generate_series(1, 4) g;
  insert into public.tarjetas (uid, alumno_id)
  select 'FB:00:00:0' || substr(a.rut, 8), a.id from public.alumnos a where a.rut like 'PRUEBA-_';

  -- 014 · El horario guardado tiene cierre en los días abiertos y el domingo cerrado ------------
  perform pg_temp.ok('014', 'El horario tiene apertura, cierre y último ingreso; domingo cerrado',
    (select horario -> 'lunes' ->> 'cierre' = '22:00' and horario -> 'sabado' ->> 'cierre' = '14:00'
            and jsonb_typeof(horario -> 'domingo') = 'null'
     from public.configuracion where id = 1));

  -- El admin cambia y la base guarda (CA34, parcial) ----------------------------------------
  perform pg_temp.sesion(v_admin);
  execute 'set local role authenticated';
  r := public.actualizar_configuracion(30,
    pg_temp.horario('sabado', '{"apertura": "09:00", "cierre": "15:00", "ultimo_ingreso": "14:00", "nota": "x"}'), 4);
  execute 'reset role';
  select * into v_config from public.configuracion where id = 1;
  perform pg_temp.ok('CA34', 'El admin guarda capacidad, horario y cierre automático',
    v_config.capacidad = 30 and v_config.cierre_automatico_horas = 4
    and v_config.horario -> 'sabado' ->> 'apertura' = '09:00'
    and (r->>'capacidad')::int = 30);
  perform pg_temp.ok('CA34', 'El horario se guarda limpio (sin claves extra)',
    not (v_config.horario -> 'sabado' ? 'nota'));
  perform pg_temp.ok('RNF08', 'El aforo público copia la capacidad nueva',
    (select capacidad from public.aforo where id = 1) = 30);

  -- Validación en la base ------------------------------------------------------------------
  perform pg_temp.sesion(v_admin);
  v_msg := pg_temp.error_de(format('select public.actualizar_configuracion(0, %L, 3)', pg_temp.horario()));
  perform pg_temp.ok('D24', 'Capacidad 0: error', v_msg = 'capacidad_invalida');
  v_msg := pg_temp.error_de(format('select public.actualizar_configuracion(101, %L, 3)', pg_temp.horario()));
  perform pg_temp.ok('D24', 'Capacidad 101: error', v_msg = 'capacidad_invalida');
  v_msg := pg_temp.error_de(format('select public.actualizar_configuracion(20, %L, 0)', pg_temp.horario()));
  perform pg_temp.ok('D24', 'Cierre automático 0 h: error', v_msg = 'cierre_invalido');
  v_msg := pg_temp.error_de(format('select public.actualizar_configuracion(20, %L, 13)', pg_temp.horario()));
  perform pg_temp.ok('D24', 'Cierre automático 13 h: error', v_msg = 'cierre_invalido');
  v_msg := pg_temp.error_de(format('select public.actualizar_configuracion(20, %L, 3)', pg_temp.horario() - 'martes'));
  perform pg_temp.ok('D24', 'Falta un día: error', v_msg = 'horario_invalido');
  v_msg := pg_temp.error_de(format('select public.actualizar_configuracion(20, %L, 3)',
    pg_temp.horario('feriado', '{"apertura": "08:00", "cierre": "22:00", "ultimo_ingreso": "21:00"}')));
  perform pg_temp.ok('D24', 'Día desconocido: error', v_msg = 'horario_invalido');
  v_msg := pg_temp.error_de(format('select public.actualizar_configuracion(20, %L, 3)',
    pg_temp.horario('lunes', '{"apertura": "8:00", "cierre": "22:00", "ultimo_ingreso": "21:00"}')));
  perform pg_temp.ok('D24', 'Hora sin formato HH:MM: error', v_msg = 'horario_invalido');
  v_msg := pg_temp.error_de(format('select public.actualizar_configuracion(20, %L, 3)',
    pg_temp.horario('lunes', '{"apertura": "08:00", "cierre": "20:00", "ultimo_ingreso": "21:00"}')));
  perform pg_temp.ok('D24', 'Último ingreso después del cierre: error', v_msg = 'horario_invalido');
  v_msg := pg_temp.error_de(format('select public.actualizar_configuracion(20, %L, 3)',
    pg_temp.horario('lunes', '{"apertura": "21:00", "cierre": "22:00", "ultimo_ingreso": "21:00"}')));
  perform pg_temp.ok('D24', 'Apertura igual al último ingreso: error', v_msg = 'horario_invalido');
  v_msg := pg_temp.error_de(format('select public.actualizar_configuracion(20, %L, 3)',
    pg_temp.horario('lunes', '{"apertura": "08:00", "ultimo_ingreso": "21:00"}')));
  perform pg_temp.ok('D24', 'Día abierto sin hora de cierre: error', v_msg = 'horario_invalido');
  v_msg := pg_temp.error_de('select public.actualizar_configuracion(20, null, 3)');
  perform pg_temp.ok('D24', 'Horario nulo: error', v_msg = 'horario_invalido');
  perform pg_temp.ok('D24', 'Ningún error cambió lo guardado',
    (select capacidad = 30 and cierre_automatico_horas = 4 from public.configuracion where id = 1));
  perform pg_temp.sesion(null);

  -- Profesor, alumno y anon no pueden --------------------------------------------------------
  perform pg_temp.sesion(v_profesor);
  execute 'set local role authenticated';
  v_msg := pg_temp.error_de(format('select public.actualizar_configuracion(10, %L, 3)', pg_temp.horario()));
  execute 'reset role';
  perform pg_temp.ok('Permiso', 'El profesor no cambia la configuración', v_msg = 'sin_permiso');

  perform pg_temp.sesion(v_uid_demo);
  execute 'set local role authenticated';
  v_msg := pg_temp.error_de(format('select public.actualizar_configuracion(10, %L, 3)', pg_temp.horario()));
  execute 'reset role';
  perform pg_temp.ok('Permiso', 'El alumno no cambia la configuración', v_msg = 'sin_permiso');

  -- Ni siquiera el admin escribe directo en la tabla: todo pasa por la función.
  perform pg_temp.sesion(v_admin);
  v_escribio := false;
  v_filas := 0;
  execute 'set local role authenticated';
  begin
    update public.configuracion set capacidad = 99;
    get diagnostics v_filas = row_count;
    v_escribio := v_filas > 0;
  exception when insufficient_privilege then null;
  end;
  select count(*) into v_n from public.configuracion;
  execute 'reset role';
  perform pg_temp.ok('Permiso', 'Sin update directo en configuracion, pero se puede leer',
    not v_escribio and v_n = 1 and (select capacidad from public.configuracion where id = 1) = 30);

  perform pg_temp.sesion(null);
  v_escribio := false;
  execute 'set local role anon';
  begin
    perform public.actualizar_configuracion(10, pg_temp.horario(), 3);
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  execute 'reset role';
  perform pg_temp.ok('Permiso', 'anon no ejecuta actualizar_configuracion', not v_escribio);

  -- Bajar la capacidad con gente adentro no saca a nadie ------------------------------------
  perform privado.actualizar_configuracion_en(3, pg_temp.horario(), 3, pg_temp.h(c_lunes || '09:55'));
  perform privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h(c_lunes || '10:00'));
  perform privado.registrar_ingreso_en('FB:00:00:02', pg_temp.h(c_lunes || '10:01'));
  perform privado.registrar_ingreso_en('FB:00:00:03', pg_temp.h(c_lunes || '10:02'));
  r := privado.actualizar_configuracion_en(2, pg_temp.horario(), 3, pg_temp.h(c_lunes || '10:05'));
  perform pg_temp.ok('D24', 'Bajar a 2 con 3 adentro: nadie sale',
    (select count(*) from public.visitas v join public.alumnos a on a.id = v.alumno_id
     where a.rut like 'PRUEBA-_' and v.salida is null) = 3);
  perform pg_temp.ok('D24', 'El aforo queda 3 / 2, sin romperse',
    (select ocupacion = 3 and capacidad = 2 from public.aforo where id = 1) and (r->>'ocupacion')::int = 3);
  r := privado.registrar_ingreso_en('FB:00:00:04', pg_temp.h(c_lunes || '10:06'));
  perform pg_temp.ok('D24', 'Con capacidad 2, el que llega recibe el turno 1 (demo)',
    r->>'resultado' = 'turno' and (r->>'turno')::int = 1);

  -- Subir la capacidad llama al turno al tiro ------------------------------------------------
  r := privado.actualizar_configuracion_en(5, pg_temp.horario(), 3, pg_temp.h(c_lunes || '10:10'));
  perform pg_temp.ok('RNF08', 'Subir a 5 llama al turno 1 sin esperar otra tarjeta',
    (select turno_llamado = 1 and en_espera = 0 and capacidad = 5 from public.aforo where id = 1)
    and (r->>'turno_llamado')::int = 1);
  r := privado.registrar_ingreso_en('FB:00:00:04', pg_temp.h(c_lunes || '10:11'));
  perform pg_temp.ok('RNF08', 'El alumno llamado entra', r->>'resultado' = 'entrada');

  -- Los cambios se aplican en el ingreso -----------------------------------------------------
  perform privado.actualizar_configuracion_en(20,
    pg_temp.horario('lunes', '{"apertura": "08:00", "cierre": "21:00", "ultimo_ingreso": "20:00"}'), 1,
    pg_temp.h(c_lunes || '10:15'));
  perform privado.registrar_ingreso_en('FB:FF:FF:FF', pg_temp.h(c_lunes || '11:02'));
  perform pg_temp.ok('R6', 'Con cierre automático de 1 h, las visitas de las 10:00 se cierran solas',
    (select count(*) from public.visitas v join public.alumnos a on a.id = v.alumno_id
     where a.rut in ('PRUEBA-1', 'PRUEBA-2', 'PRUEBA-3') and v.cierre_automatico) = 3);
  r := privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h(c_lunes || '20:30'));
  perform pg_temp.ok('R3', 'Con último ingreso a las 20:00, el lunes 20:30 queda fuera de horario',
    r->>'motivo' = 'fuera_de_horario');
end;
$$;

select n, criterio, caso, estado from resultado_pruebas order by n;

rollback;
