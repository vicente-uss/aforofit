-- profesor.sql
-- AforoFit · Pruebas de F-03 (cambiar_estado_maquina, B5) y F-28 (cerrar_visita, D21).
-- Corre dentro de begin; … rollback; y no deja cambios. Requiere 001 a 012, la cuenta alumno.demo
-- ligada al alumno 1 (008) y una cuenta con rol profesor. Ejecutar completo en Supabase → SQL Editor.
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

-- Ejecuta una sentencia y devuelve el mensaje de error (null si no falla).
create function pg_temp.error_de(p_sql text) returns text
language plpgsql as $$
begin
  execute p_sql;
  return null;
exception when others then
  return sqlerrm;
end;
$$;

-- Fija la sesión simulada (claims de Supabase Auth); null deja la sesión vacía.
create function pg_temp.sesion(p_usuario uuid) returns void
language plpgsql as $$
begin
  perform set_config('request.jwt.claims',
    case when p_usuario is null then ''
         else jsonb_build_object('sub', p_usuario, 'role', 'authenticated')::text end, true);
end;
$$;

do $$
declare
  c_lunes constant text := '2026-12-07 ';
  v_uid_demo  uuid;
  v_profesor  uuid;
  v_demo      uuid;
  v_polea     bigint;
  v_rutina    uuid;
  v_visita1   uuid;
  v_visita2   uuid;
  v_visita3   uuid;
  v_carga     numeric;
  r           jsonb;
  v_msg       text;
  v_n         integer;
  v_m         integer;
  v_escribio  boolean;
begin
  select u.id into strict v_uid_demo from auth.users u where u.email = 'alumno.demo@aforofit.cl';
  select a.id into strict v_demo from public.alumnos a where a.perfil_id = v_uid_demo;
  select p.id into strict v_profesor from public.perfiles p where p.rol = 'profesor' order by p.id limit 1;
  select m.id into strict v_polea from public.maquinas m where m.nombre = 'Máquina de poleas cruzadas (DAP)';

  -- Estado conocido: nadie adentro, capacidad 2 y todas las máquinas disponibles.
  update public.visitas set salida = entrada where salida is null;
  update public.configuracion set capacidad = 2, turno_expira_minutos = 10, cierre_automatico_horas = 3;
  update public.maquinas set estado = 'disponible';
  update public.alumnos set objetivo = 'hipertrofia', nivel = 'principiante' where id = v_demo;
  v_rutina := privado.generar_rutina_de(v_demo);

  insert into public.alumnos (nombre, rut, certificado_hasta)
  select 'Prueba ' || g, 'PRUEBA-' || g, date '2026-12-23' from generate_series(1, 3) g;
  insert into public.tarjetas (uid, alumno_id)
  select 'FB:00:00:0' || substr(a.rut, 8), a.id from public.alumnos a where a.rut like 'PRUEBA-_';

  -- F-03 · El profesor cambia el estado (B5, RF20) ------------------------------------
  perform pg_temp.sesion(v_profesor);
  execute 'set local role authenticated';
  r := public.cambiar_estado_maquina(v_polea, 'en_mantencion');
  execute 'reset role';
  perform pg_temp.ok('RF20', 'El profesor marca la polea En mantención',
    (select estado from public.maquinas where id = v_polea) = 'en_mantencion'
    and r->>'estado' = 'en_mantencion' and (r->>'id')::bigint = v_polea);

  perform pg_temp.sesion(v_uid_demo);
  select count(*) filter (where en_mantencion) into v_n from public.rutina_del_dia();
  perform pg_temp.ok('CA13', 'rutina_del_dia del alumno marca los 2 ejercicios de polea', v_n = 2);

  perform pg_temp.sesion(v_profesor);
  r := public.cambiar_estado_maquina(v_polea, 'disponible');
  perform pg_temp.sesion(v_uid_demo);
  select count(*) filter (where en_mantencion) into v_n from public.rutina_del_dia();
  perform pg_temp.ok('CA26', 'Al volver a Disponible la advertencia desaparece', v_n = 0);
  perform pg_temp.ok('CA26', 'El estado persiste en la tabla',
    (select estado from public.maquinas where id = v_polea) = 'disponible');

  perform pg_temp.sesion(v_profesor);
  v_msg := pg_temp.error_de(format('select public.cambiar_estado_maquina(%s, %L)', v_polea, 'rota'));
  perform pg_temp.ok('RF20', 'Estado distinto de disponible o en_mantencion: error', v_msg = 'valor_invalido');
  v_msg := pg_temp.error_de(format('select public.cambiar_estado_maquina(%s, %L)', v_polea, 'En mantención'));
  perform pg_temp.ok('RF20', 'La etiqueta de pantalla no es un valor válido', v_msg = 'valor_invalido');
  v_msg := pg_temp.error_de(format('select public.cambiar_estado_maquina(%s, %L)', 999999, 'disponible'));
  perform pg_temp.ok('RF20', 'Máquina inexistente: error', v_msg = 'maquina_no_encontrada');

  perform pg_temp.sesion(v_uid_demo);
  v_msg := pg_temp.error_de(format('select public.cambiar_estado_maquina(%s, %L)', v_polea, 'en_mantencion'));
  perform pg_temp.ok('Permiso', 'Un alumno no cambia el estado de una máquina',
    v_msg = 'sin_permiso' and (select estado from public.maquinas where id = v_polea) = 'disponible');

  -- F-28 · Cerrar una visita a mano (D21) ---------------------------------------------
  -- Prueba 1 y 2 adentro (capacidad 2); Prueba 3 recibe el turno 1.
  perform privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h(c_lunes || '10:00'));
  perform privado.registrar_ingreso_en('FB:00:00:02', pg_temp.h(c_lunes || '10:05'));
  r := privado.registrar_ingreso_en('FB:00:00:03', pg_temp.h(c_lunes || '10:10'));
  perform pg_temp.ok('Preparación', 'Gimnasio lleno: Prueba 3 recibe el turno 1',
    r->>'resultado' = 'turno' and (r->>'turno')::int = 1);

  select v.id into strict v_visita1 from public.visitas v join public.alumnos a on a.id = v.alumno_id
  where a.rut = 'PRUEBA-1' and v.salida is null;
  select v.id into strict v_visita2 from public.visitas v join public.alumnos a on a.id = v.alumno_id
  where a.rut = 'PRUEBA-2' and v.salida is null;

  r := privado.cerrar_visita_en(v_visita1, pg_temp.h(c_lunes || '10:20'), v_profesor);
  perform pg_temp.ok('D21', 'La visita queda cerrada a mano, con la hora y quién la cerró',
    exists (select 1 from public.visitas
            where id = v_visita1 and salida = pg_temp.h(c_lunes || '10:20')
              and cerrada_por = v_profesor and not cierre_automatico));
  perform pg_temp.ok('D21', 'Cerrar libera el cupo', (select ocupacion from public.aforo where id = 1) = 1
    and (r->>'ocupacion')::int = 1);
  perform pg_temp.ok('D21', 'Cerrar llama al turno 1, como la salida normal',
    (select turno_llamado from public.aforo where id = 1) = 1
    and (select en_espera from public.aforo where id = 1) = 0
    and (r->>'turno_llamado')::int = 1);
  r := privado.registrar_ingreso_en('FB:00:00:03', pg_temp.h(c_lunes || '10:21'));
  perform pg_temp.ok('D21', 'El alumno llamado entra con su credencial', r->>'resultado' = 'entrada');

  v_msg := pg_temp.error_de(format('select privado.cerrar_visita_en(%L, now(), %L)', v_visita1, v_profesor));
  perform pg_temp.ok('D21', 'Cerrar dos veces la misma visita: error', v_msg = 'visita_ya_cerrada');
  v_msg := pg_temp.error_de(format('select privado.cerrar_visita_en(%L, now(), %L)', gen_random_uuid(), v_profesor));
  perform pg_temp.ok('D21', 'Visita inexistente: error', v_msg = 'visita_no_encontrada');

  -- Permisos: el alumno no cierra visitas; el profesor sí, con la función pública.
  perform pg_temp.sesion(v_uid_demo);
  execute 'set local role authenticated';
  v_msg := pg_temp.error_de(format('select public.cerrar_visita(%L)', v_visita2));
  execute 'reset role';
  perform pg_temp.ok('Permiso', 'Un alumno no cierra visitas',
    v_msg = 'sin_permiso' and exists (select 1 from public.visitas where id = v_visita2 and salida is null));

  perform pg_temp.sesion(v_profesor);
  execute 'set local role authenticated';
  r := public.cerrar_visita(v_visita2);
  execute 'reset role';
  perform pg_temp.ok('D21', 'public.cerrar_visita guarda al profesor de la sesión en cerrada_por',
    exists (select 1 from public.visitas where id = v_visita2 and salida is not null and cerrada_por = v_profesor));

  -- La salida normal y el cierre automático no cambian: cerrada_por queda en null.
  perform privado.registrar_ingreso_en('FB:00:00:03', pg_temp.h(c_lunes || '10:30'));
  perform pg_temp.ok('R5', 'La salida normal deja cerrada_por en null',
    exists (select 1 from public.visitas v join public.alumnos a on a.id = v.alumno_id
            where a.rut = 'PRUEBA-3' and v.salida = pg_temp.h(c_lunes || '10:30') and v.cerrada_por is null));
  perform privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h(c_lunes || '11:00'));
  perform privado.registrar_ingreso_en('FB:FF:FF:FF', pg_temp.h(c_lunes || '14:00'));
  perform pg_temp.ok('R6', 'El cierre automático deja cerrada_por en null',
    exists (select 1 from public.visitas v join public.alumnos a on a.id = v.alumno_id
            where a.rut = 'PRUEBA-1' and v.cierre_automatico and v.cerrada_por is null));
  v_escribio := false;
  begin
    update public.visitas set cerrada_por = v_profesor
    where id = (select v.id from public.visitas v join public.alumnos a on a.id = v.alumno_id
                where a.rut = 'PRUEBA-1' and v.cierre_automatico limit 1);
    v_escribio := true;
  exception when check_violation then null;
  end;
  perform pg_temp.ok('D21', 'Un cierre no puede ser manual y automático a la vez', not v_escribio);

  -- Feedback: una visita cerrada a mano no lo acepta ------------------------------------
  r := privado.registrar_ingreso_en('04:A3:7F:2B', pg_temp.h(c_lunes || '15:00'));
  perform pg_temp.ok('Preparación', 'alumno.demo entra', r->>'resultado' = 'entrada');
  select v.id into strict v_visita3 from public.visitas v where v.alumno_id = v_demo and v.salida is null;
  perform privado.cerrar_visita_en(v_visita3, pg_temp.h(c_lunes || '15:30'), v_profesor);
  select carga_kg into v_carga from public.rutina_ejercicios where rutina_id = v_rutina and orden = 2;

  v_msg := pg_temp.error_de(format('select privado.registrar_feedback_en(%L, %L)', v_rutina, 'facil'));
  perform pg_temp.ok('D21', 'La visita cerrada a mano no acepta feedback', v_msg = 'visita_cierre_manual');
  perform pg_temp.sesion(v_uid_demo);
  execute 'set local role authenticated';
  v_msg := pg_temp.error_de(format('select public.registrar_feedback(%L, %L)', v_rutina, 'me_costo'));
  execute 'reset role';
  perform pg_temp.ok('D21', 'Tampoco por la función pública, y las cargas no cambian',
    v_msg = 'visita_cierre_manual'
    and (select carga_kg from public.rutina_ejercicios where rutina_id = v_rutina and orden = 2) = v_carga
    and not exists (select 1 from public.feedback where visita_id = v_visita3));

  -- Lectura para /profesor/adentro: el profesor ve a todos los que están adentro --------
  perform privado.registrar_ingreso_en('FB:00:00:02', pg_temp.h(c_lunes || '16:00'));
  perform privado.registrar_ingreso_en('04:A3:7F:2B', pg_temp.h(c_lunes || '16:05'));
  perform pg_temp.sesion(v_profesor);
  execute 'set local role authenticated';
  select count(*) into v_n
  from public.visitas v join public.alumnos a on a.id = v.alumno_id
  where v.salida is null;
  execute 'reset role';
  perform pg_temp.sesion(v_uid_demo);
  execute 'set local role authenticated';
  select count(*) into v_m from public.visitas v where v.salida is null;
  execute 'reset role';
  perform pg_temp.ok('RLS', 'El profesor ve las 2 visitas abiertas con el nombre; el alumno solo la suya',
    v_n = 2 and v_m = 1);

  -- anon no ejecuta ninguna de las dos funciones.
  perform pg_temp.sesion(null);
  v_escribio := false;
  execute 'set local role anon';
  begin
    perform public.cambiar_estado_maquina(v_polea, 'en_mantencion');
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.cerrar_visita(v_visita2);
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  execute 'reset role';
  perform pg_temp.ok('Permiso', 'anon no ejecuta cambiar_estado_maquina ni cerrar_visita', not v_escribio);
end;
$$;

select n, criterio, caso, estado from resultado_pruebas order by n;

rollback;
