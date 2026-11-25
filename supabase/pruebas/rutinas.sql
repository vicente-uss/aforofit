-- rutinas.sql
-- AforoFit · Pruebas de F-01: plantillas, generar_rutina, elegir_objetivo_nivel (B1), registrar_feedback
-- (regla 8 y D25), rutina_del_dia (regla 7), RLS y Realtime. Corre dentro de begin; … rollback; y no deja cambios.
-- Requiere 001 a 011 y la cuenta alumno.demo ligada al alumno 1 (008). Ejecutar completo en
-- Supabase → SQL Editor. Cada caso imprime OK; el primero que falle detiene todo con raise exception.

begin;

create temp table resultado_pruebas (
  n serial primary key,
  criterio text not null,
  caso text not null,
  estado text not null
) on commit drop;

-- Hora de Santiago en el día de prueba.
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

do $$
declare
  c_lunes constant text := '2026-12-07 ';
  v_uid_demo   uuid;
  v_profesor   uuid;
  v_demo       uuid;     -- alumno 1, ligado a alumno.demo
  v_otro       uuid;     -- alumno 2, sin cuenta
  v_plantilla  bigint;
  v_rutina     uuid;
  v_rutina2    uuid;
  v_rutina_otro uuid;
  v_visita     uuid;
  v_prog       jsonb;
  r            jsonb;
  v_msg        text;
  v_msg2       text;
  v_n          integer;
  v_m          integer;
  v_escribio   boolean;
  v_ajenos     boolean;
  v_propios    boolean;
  v_plantillas boolean;
begin
  select u.id into strict v_uid_demo from auth.users u where u.email = 'alumno.demo@aforofit.cl';
  select a.id into strict v_demo from public.alumnos a where a.perfil_id = v_uid_demo;
  select a.id into strict v_otro from public.alumnos a where a.rut = '00.000.002-F';
  select p.id into v_profesor from public.perfiles p where p.rol = 'profesor' limit 1;
  select c.progresion into strict v_prog from public.configuracion c where c.id = 1;

  -- Estado conocido: parámetros iniciales de la regla 8 y todas las máquinas disponibles.
  update public.configuracion
  set progresion = '{"facil_kg": 2.5, "justo_kg": 0, "me_costo_porcentaje": -5, "redondeo_kg": 2.5}'::jsonb;
  update public.maquinas set estado = 'disponible';
  update public.alumnos set objetivo = null, nivel = null where id in (v_demo, v_otro);
  -- Las pruebas parten sin rutinas ni visitas abiertas de estos dos alumnos, aunque la base real ya tenga datos de
  -- pruebas de punta a punta (por ejemplo, alumno.demo usado en /alumno). Todo se deshace con el rollback final.
  delete from public.rutinas where alumno_id in (v_demo, v_otro);   -- borra también ejercicios y feedback (cascade)
  update public.visitas set salida = entrada where salida is null and alumno_id in (v_demo, v_otro);

  -- Plantillas (D12) ------------------------------------------------------------------
  perform pg_temp.ok('D12', 'Hay 6 plantillas: 3 objetivos × 2 niveles',
    (select count(*) from public.plantillas) = 6
    and (select count(distinct (objetivo, nivel)) from public.plantillas) = 6);
  perform pg_temp.ok('D12', 'Cada plantilla tiene entre 4 y 6 ejercicios',
    not exists (
      select 1 from public.plantillas p
      where (select count(*) from public.plantilla_ejercicios e where e.plantilla_id = p.id) not between 4 and 6));
  perform pg_temp.ok('D12', 'Todas las plantillas usan solo máquinas registradas',
    not exists (
      select 1 from public.plantilla_ejercicios e
      where not exists (select 1 from public.maquinas m where m.id = e.maquina_id)));
  perform pg_temp.ok('D12', 'Cardio va en minutos y sin carga',
    not exists (
      select 1 from public.plantilla_ejercicios e join public.maquinas m on m.id = e.maquina_id
      where m.patron_movimiento = 'cardio' and (e.minutos is null or e.carga_inicial_kg is not null)));
  perform pg_temp.ok('D12', 'Fuerza: 6 repeticiones o menos; hipertrofia: 8 a 12',
    not exists (
      select 1 from public.plantilla_ejercicios e join public.plantillas p on p.id = e.plantilla_id
      where e.repeticiones is not null
        and ((p.objetivo = 'fuerza' and e.repeticiones > 6)
          or (p.objetivo = 'hipertrofia' and e.repeticiones not between 8 and 12))));

  -- Alumno sin objetivo o nivel → error -------------------------------------------------
  v_msg := pg_temp.error_de(format('select privado.generar_rutina_de(%L)', v_demo));
  perform pg_temp.ok('RF12', 'Sin objetivo ni nivel: error sin_objetivo_nivel', v_msg = 'sin_objetivo_nivel');
  update public.alumnos set objetivo = 'hipertrofia' where id = v_demo;
  v_msg := pg_temp.error_de(format('select privado.generar_rutina_de(%L)', v_demo));
  perform pg_temp.ok('RF12', 'Con objetivo pero sin nivel: error sin_objetivo_nivel', v_msg = 'sin_objetivo_nivel');
  perform pg_temp.ok('RF12', 'El error no deja rutinas a medias',
    not exists (select 1 from public.rutinas where alumno_id = v_demo));

  -- CA12: hipertrofia + principiante, generada por el dueño con su sesión ---------------
  update public.alumnos set nivel = 'principiante' where id = v_demo;
  select id into strict v_plantilla from public.plantillas where objetivo = 'hipertrofia' and nivel = 'principiante';

  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_uid_demo, 'role', 'authenticated')::text, true);
  v_rutina := public.generar_rutina(v_demo);
  perform set_config('request.jwt.claims', '', true);

  perform pg_temp.ok('CA12', 'Rutina activa, origen sistema, desde la plantilla hipertrofia · principiante',
    exists (select 1 from public.rutinas
            where id = v_rutina and alumno_id = v_demo and activa and origen = 'sistema' and plantilla_id = v_plantilla));
  perform pg_temp.ok('CA12', 'Los ejercicios son exactamente los de la plantilla',
    not exists (
      (select orden, ejercicio, maquina_id, series, repeticiones, minutos, carga_inicial_kg, nota_ajuste
       from public.plantilla_ejercicios where plantilla_id = v_plantilla)
      except
      (select orden, ejercicio, maquina_id, series, repeticiones, minutos, carga_kg, nota_ajuste
       from public.rutina_ejercicios where rutina_id = v_rutina))
    and (select count(*) from public.rutina_ejercicios where rutina_id = v_rutina)
      = (select count(*) from public.plantilla_ejercicios where plantilla_id = v_plantilla));
  perform pg_temp.ok('CA12', 'La rutina usa solo máquinas registradas',
    not exists (
      select 1 from public.rutina_ejercicios e
      where e.rutina_id = v_rutina and not exists (select 1 from public.maquinas m where m.id = e.maquina_id)));

  -- Volver a generar: una sola activa y la anterior queda como historial ---------------
  v_rutina2 := privado.generar_rutina_de(v_demo);
  perform pg_temp.ok('RF12', 'Volver a generar deja una sola rutina activa',
    (select count(*) from public.rutinas where alumno_id = v_demo and activa) = 1
    and (select activa from public.rutinas where id = v_rutina2));
  perform pg_temp.ok('RF12', 'La rutina anterior queda inactiva y no se borra',
    exists (select 1 from public.rutinas where id = v_rutina and not activa)
    and exists (select 1 from public.rutina_ejercicios where rutina_id = v_rutina));
  v_escribio := false;
  begin
    insert into public.rutinas (alumno_id, activa) values (v_demo, true);
    v_escribio := true;
  exception when unique_violation then null;
  end;
  perform pg_temp.ok('RF12', 'El índice impide dos rutinas activas', not v_escribio);
  v_rutina := v_rutina2;

  -- CA14: regla 8 como función pura ----------------------------------------------------
  perform pg_temp.ok('CA14', '40 kg con fácil → 42,5 kg', privado.nueva_carga(40, 'facil', v_prog || '{"facil_kg": 2.5, "justo_kg": 0, "me_costo_porcentaje": -5, "redondeo_kg": 2.5}') = 42.5);
  perform pg_temp.ok('CA14', '40 kg con justo → 40 kg', privado.nueva_carga(40, 'justo', v_prog || '{"facil_kg": 2.5, "justo_kg": 0, "me_costo_porcentaje": -5, "redondeo_kg": 2.5}') = 40);
  perform pg_temp.ok('CA14', '40 kg con me costó → 37,5 kg', privado.nueva_carga(40, 'me_costo', v_prog || '{"facil_kg": 2.5, "justo_kg": 0, "me_costo_porcentaje": -5, "redondeo_kg": 2.5}') = 37.5);
  perform pg_temp.ok('R8', '37 kg con me costó → 35,15 → 35 kg (redondeo a 2,5)', privado.nueva_carga(37, 'me_costo', v_prog || '{"facil_kg": 2.5, "justo_kg": 0, "me_costo_porcentaje": -5, "redondeo_kg": 2.5}') = 35);
  perform pg_temp.ok('R8', '39 kg con me costó → 37,05 → 37,5 kg (al más cercano, no hacia abajo)', privado.nueva_carga(39, 'me_costo', v_prog || '{"facil_kg": 2.5, "justo_kg": 0, "me_costo_porcentaje": -5, "redondeo_kg": 2.5}') = 37.5);
  perform pg_temp.ok('D25', '20 kg con me costó → 19 → 20 → baja un paso: 17,5 kg', privado.nueva_carga(20, 'me_costo', v_prog || '{"facil_kg": 2.5, "justo_kg": 0, "me_costo_porcentaje": -5, "redondeo_kg": 2.5}') = 17.5);
  perform pg_temp.ok('D25', '25 kg con me costó → 23,75 → 25 → baja un paso: 22,5 kg', privado.nueva_carga(25, 'me_costo', v_prog || '{"facil_kg": 2.5, "justo_kg": 0, "me_costo_porcentaje": -5, "redondeo_kg": 2.5}') = 22.5);
  perform pg_temp.ok('D25', '10 kg con me costó → 9,5 → 10 → baja un paso: 7,5 kg', privado.nueva_carga(10, 'me_costo', v_prog || '{"facil_kg": 2.5, "justo_kg": 0, "me_costo_porcentaje": -5, "redondeo_kg": 2.5}') = 7.5);
  perform pg_temp.ok('D25', '2,5 kg con me costó → 0 kg', privado.nueva_carga(2.5, 'me_costo', v_prog || '{"facil_kg": 2.5, "justo_kg": 0, "me_costo_porcentaje": -5, "redondeo_kg": 2.5}') = 0);
  perform pg_temp.ok('D25', '0 kg con me costó → 0 kg (nunca negativa)', privado.nueva_carga(0, 'me_costo', v_prog || '{"facil_kg": 2.5, "justo_kg": 0, "me_costo_porcentaje": -5, "redondeo_kg": 2.5}') = 0);
  perform pg_temp.ok('D25', 'Fácil y justo no cambian: 20 kg → 22,5 y 20 kg', privado.nueva_carga(20, 'facil', v_prog || '{"facil_kg": 2.5, "justo_kg": 0, "me_costo_porcentaje": -5, "redondeo_kg": 2.5}') = 22.5 and privado.nueva_carga(20, 'justo', v_prog || '{"facil_kg": 2.5, "justo_kg": 0, "me_costo_porcentaje": -5, "redondeo_kg": 2.5}') = 20);
  perform pg_temp.ok('R8', 'Cardio (carga null) no cambia', privado.nueva_carga(null, 'facil', v_prog) is null);

  -- CA14 de punta a punta: feedback del dueño después de cada visita ---------------------
  -- Press de pecho sentado (orden 2) con 40 kg y prensa (orden 3) con 37 kg.
  update public.rutina_ejercicios set carga_kg = 40 where rutina_id = v_rutina and orden = 2;
  update public.rutina_ejercicios set carga_kg = 37 where rutina_id = v_rutina and orden = 3;

  insert into public.visitas (alumno_id, entrada, salida)
  values (v_demo, pg_temp.h(c_lunes || '09:00'), pg_temp.h(c_lunes || '10:00')) returning id into v_visita;

  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_uid_demo, 'role', 'authenticated')::text, true);
  r := public.registrar_feedback(v_rutina, 'facil');
  perform set_config('request.jwt.claims', '', true);
  perform pg_temp.ok('CA14', 'Feedback fácil por el dueño: 40 kg → 42,5 kg',
    (select carga_kg from public.rutina_ejercicios where rutina_id = v_rutina and orden = 2) = 42.5
    and (r->>'cargas_ajustadas')::boolean);
  perform pg_temp.ok('RF18', 'El feedback queda registrado con visita, rutina, valor y fecha',
    exists (select 1 from public.feedback
            where visita_id = v_visita and rutina_id = v_rutina and valor = 'facil' and creado_en is not null));
  perform pg_temp.ok('R8', 'Cardio no cambia con el feedback',
    (select carga_kg is null and minutos = 5 from public.rutina_ejercicios where rutina_id = v_rutina and orden = 1));

  v_msg := pg_temp.error_de(format('select privado.registrar_feedback_en(%L, %L)', v_rutina, 'facil'));
  perform pg_temp.ok('RF18', 'Un segundo feedback para la misma visita: error', v_msg = 'feedback_ya_registrado');

  update public.rutina_ejercicios set carga_kg = 40 where rutina_id = v_rutina and orden = 2;
  insert into public.visitas (alumno_id, entrada, salida)
  values (v_demo, pg_temp.h(c_lunes || '11:00'), pg_temp.h(c_lunes || '12:00'));
  perform privado.registrar_feedback_en(v_rutina, 'justo');
  perform pg_temp.ok('CA14', 'Feedback justo: 40 kg → 40 kg',
    (select carga_kg from public.rutina_ejercicios where rutina_id = v_rutina and orden = 2) = 40);

  update public.rutina_ejercicios set carga_kg = 37 where rutina_id = v_rutina and orden = 3;
  insert into public.visitas (alumno_id, entrada, salida)
  values (v_demo, pg_temp.h(c_lunes || '13:00'), pg_temp.h(c_lunes || '14:00'));
  perform privado.registrar_feedback_en(v_rutina, 'me_costo');
  perform pg_temp.ok('CA14', 'Feedback me costó: 40 kg → 37,5 kg',
    (select carga_kg from public.rutina_ejercicios where rutina_id = v_rutina and orden = 2) = 37.5);
  perform pg_temp.ok('R8', 'Feedback me costó: 37 kg → 35 kg',
    (select carga_kg from public.rutina_ejercicios where rutina_id = v_rutina and orden = 3) = 35);
  perform pg_temp.ok('R8', 'Cardio sigue sin carga después de tres feedback',
    (select carga_kg is null and minutos = 5 from public.rutina_ejercicios where rutina_id = v_rutina and orden = 1));

  -- Los parámetros se leen de configuracion, no están fijos en el código.
  update public.configuracion set progresion = progresion || '{"facil_kg": 5}'::jsonb;
  update public.rutina_ejercicios set carga_kg = 40 where rutina_id = v_rutina and orden = 2;
  insert into public.visitas (alumno_id, entrada, salida)
  values (v_demo, pg_temp.h(c_lunes || '15:00'), pg_temp.h(c_lunes || '16:00'));
  perform privado.registrar_feedback_en(v_rutina, 'facil');
  perform pg_temp.ok('D07', 'Con facil_kg = 5 en configuracion: 40 kg → 45 kg',
    (select carga_kg from public.rutina_ejercicios where rutina_id = v_rutina and orden = 2) = 45);
  update public.configuracion set progresion = progresion || '{"facil_kg": 2.5}'::jsonb;

  -- Validaciones del feedback.
  insert into public.visitas (alumno_id, entrada, salida)
  values (v_demo, pg_temp.h(c_lunes || '17:00'), pg_temp.h(c_lunes || '18:00'));
  v_msg := pg_temp.error_de(format('select privado.registrar_feedback_en(%L, %L)', v_rutina, 'regular'));
  perform pg_temp.ok('RF18', 'Valor distinto de facil, justo o me_costo: error', v_msg = 'valor_invalido');
  v_msg := pg_temp.error_de(format('select privado.registrar_feedback_en(%L, %L)', v_rutina, 'me_costo'));
  perform pg_temp.ok('RF18', 'Un error de valor no consume la visita', v_msg is null);

  insert into public.visitas (alumno_id, entrada, salida, cierre_automatico)
  values (v_demo, pg_temp.h(c_lunes || '18:30'), pg_temp.h(c_lunes || '21:30'), true);
  v_msg := pg_temp.error_de(format('select privado.registrar_feedback_en(%L, %L)', v_rutina, 'facil'));
  perform pg_temp.ok('R6', 'Visita con cierre automático: no se pide feedback', v_msg = 'visita_cierre_automatico');

  -- En una rutina que no es del sistema (D15, próxima versión) el feedback no cambia cargas.
  v_rutina_otro := privado.generar_rutina_de(v_demo);  -- nueva rutina activa
  update public.rutinas set origen = 'profesor' where id = v_rutina_otro;
  insert into public.visitas (alumno_id, entrada, salida)
  values (v_demo, pg_temp.h('2026-12-08 09:00'), pg_temp.h('2026-12-08 10:00'));
  select count(*) into v_n from public.rutina_ejercicios where rutina_id = v_rutina_otro;
  r := privado.registrar_feedback_en(v_rutina_otro, 'facil');
  perform pg_temp.ok('R8', 'Rutina del profesor: se registra el feedback sin cambiar cargas',
    not (r->>'cargas_ajustadas')::boolean
    and exists (select 1 from public.feedback where rutina_id = v_rutina_otro)
    and not exists (
      select 1 from public.rutina_ejercicios e
      join public.plantilla_ejercicios p on p.plantilla_id = v_plantilla and p.orden = e.orden
      where e.rutina_id = v_rutina_otro and e.carga_kg is distinct from p.carga_inicial_kg));
  v_msg := pg_temp.error_de(format('select privado.registrar_feedback_en(%L, %L)', v_rutina, 'facil'));
  perform pg_temp.ok('RF18', 'Feedback a una rutina inactiva: error', v_msg = 'rutina_inactiva');
  update public.rutinas set origen = 'sistema' where id = v_rutina_otro;
  v_rutina := v_rutina_otro;

  -- R7 y CA13: la polea en mantención aparece marcada en rutina_del_dia ---------------
  update public.maquinas set estado = 'en_mantencion' where nombre = 'Máquina de poleas cruzadas (DAP)';
  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_uid_demo, 'role', 'authenticated')::text, true);
  select count(*) filter (where en_mantencion), count(*) filter (where not en_mantencion)
    into v_n, v_m from public.rutina_del_dia();
  perform pg_temp.ok('CA13', 'Los ejercicios con la polea en mantención salen marcados',
    v_n = 2 and not exists (
      select 1 from public.rutina_del_dia()
      where en_mantencion <> (maquina = 'Máquina de poleas cruzadas (DAP)')));
  perform pg_temp.ok('CA13', 'Los demás ejercicios no tienen advertencia', v_m = 4);
  perform pg_temp.ok('RF16', 'rutina_del_dia trae la rutina activa en orden, con carga y ajustes',
    (select array_agg(orden order by orden) from public.rutina_del_dia()) = array[1, 2, 3, 4, 5, 6]
    and (select bool_and(rutina_id = v_rutina) from public.rutina_del_dia()));
  perform set_config('request.jwt.claims', '', true);

  update public.maquinas set estado = 'disponible' where nombre = 'Máquina de poleas cruzadas (DAP)';
  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_uid_demo, 'role', 'authenticated')::text, true);
  perform pg_temp.ok('CA26', 'Al volver a Disponible desaparece la advertencia',
    not exists (select 1 from public.rutina_del_dia() where en_mantencion));
  perform set_config('request.jwt.claims', '', true);

  -- Dueño: un alumno no genera, responde ni ve la rutina de otro --------------------------
  update public.alumnos set objetivo = 'fuerza', nivel = 'intermedio' where id = v_otro;
  v_rutina_otro := privado.generar_rutina_de(v_otro);
  with v as (
    insert into public.visitas (alumno_id, entrada, salida)
    values (v_otro, pg_temp.h(c_lunes || '09:00'), pg_temp.h(c_lunes || '10:00')) returning id
  )
  insert into public.feedback (visita_id, rutina_id, valor)
  select v.id, v_rutina_otro, 'justo' from v;

  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_uid_demo, 'role', 'authenticated')::text, true);
  v_msg := pg_temp.error_de(format('select public.generar_rutina(%L)', v_otro));
  perform pg_temp.ok('Dueño', 'Un alumno no genera la rutina de otro', v_msg = 'sin_permiso');
  v_msg := pg_temp.error_de(format('select public.registrar_feedback(%L, %L)', v_rutina_otro, 'facil'));
  perform pg_temp.ok('Dueño', 'Un alumno no da feedback a la rutina de otro', v_msg = 'sin_permiso');
  v_msg := pg_temp.error_de(format('select * from public.rutina_del_dia(%L)', v_otro));
  perform pg_temp.ok('Dueño', 'Un alumno no pide rutina_del_dia de otro', v_msg = 'sin_permiso');

  -- RLS con el rol authenticated y la sesión de alumno.demo. Se mide con el rol y se verifica después.
  execute 'set local role authenticated';
  select count(*) filter (where alumno_id = v_demo), count(*) filter (where alumno_id <> v_demo)
    into v_n, v_m from public.rutinas;
  v_ajenos := exists (select 1 from public.rutina_ejercicios where rutina_id = v_rutina_otro)
    or exists (select 1 from public.feedback where rutina_id = v_rutina_otro);
  v_propios := exists (select 1 from public.rutina_ejercicios where rutina_id = v_rutina);
  v_plantillas := (select count(*) from public.plantillas) = 6
    and (select count(*) from public.plantilla_ejercicios) >= 24;
  execute 'reset role';
  perform pg_temp.ok('RLS', 'El alumno ve sus rutinas y ninguna ajena', v_n >= 1 and v_m = 0);
  perform pg_temp.ok('RLS', 'El alumno no ve ejercicios ni feedback de otra rutina', not v_ajenos and v_propios);
  perform pg_temp.ok('RLS', 'Cualquier usuario con sesión lee las 6 plantillas', v_plantillas);

  execute 'set local role authenticated';
  v_escribio := false;
  begin
    insert into public.rutinas (alumno_id) values (v_demo);
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  begin
    update public.rutina_ejercicios set carga_kg = 999;
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.feedback (visita_id, rutina_id, valor) values (v_visita, v_rutina, 'facil');
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  begin
    update public.plantilla_ejercicios set carga_inicial_kg = 999;
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  begin
    perform privado.nueva_carga(40, 'facil', v_prog);
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  execute 'reset role';
  perform pg_temp.ok('RLS', 'El alumno no escribe directo en rutinas, feedback ni plantillas', not v_escribio);

  -- Realtime (D13): el alumno lee su propia visita abierta, que es lo que escucha el celular.
  update public.visitas set salida = pg_temp.h(c_lunes || '09:30')
  where alumno_id in (v_demo, v_otro) and salida is null;
  insert into public.visitas (alumno_id, entrada) values (v_demo, pg_temp.h('2026-12-09 10:00'));
  insert into public.visitas (alumno_id, entrada) values (v_otro, pg_temp.h('2026-12-09 10:00'));
  execute 'set local role authenticated';
  select count(*) filter (where alumno_id = v_demo), count(*) filter (where alumno_id <> v_demo)
    into v_n, v_m from public.visitas where salida is null;
  execute 'reset role';
  perform pg_temp.ok('D13', 'El alumno lee su visita abierta y no la de otro', v_n = 1 and v_m = 0);
  perform pg_temp.ok('D13', 'visitas está en la publicación supabase_realtime',
    exists (select 1 from pg_publication_tables
            where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'visitas'));
  perform set_config('request.jwt.claims', '', true);

  -- Profesor: lee la rutina de un alumno (supervisión) ----------------------------------
  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_profesor, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  select count(*) into v_n from public.rutinas where alumno_id in (v_demo, v_otro);
  select count(*) into v_m from public.rutina_del_dia(v_otro);
  execute 'reset role';
  perform pg_temp.ok('RLS', 'El profesor lee las rutinas de los alumnos y su rutina del día', v_n >= 2 and v_m = 6);
  perform set_config('request.jwt.claims', '', true);

  -- B1 (RF11, CA24): elegir_objetivo_nivel con la sesión de alumno.demo y el rol authenticated --
  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_uid_demo, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  v_rutina2 := public.elegir_objetivo_nivel('fuerza', 'principiante');
  v_msg := pg_temp.error_de($q$select public.elegir_objetivo_nivel('cardio', 'principiante')$q$);
  v_msg2 := pg_temp.error_de($q$select public.elegir_objetivo_nivel('salud', 'avanzado')$q$);
  execute 'reset role';
  perform set_config('request.jwt.claims', '', true);

  perform pg_temp.ok('CA24', 'Objetivo y nivel quedan guardados en el alumno',
    exists (select 1 from public.alumnos where id = v_demo and objetivo = 'fuerza' and nivel = 'principiante'));
  select id into strict v_plantilla from public.plantillas where objetivo = 'fuerza' and nivel = 'principiante';
  perform pg_temp.ok('B1', 'Genera la rutina activa de la plantilla fuerza · principiante',
    (select count(*) from public.rutinas where alumno_id = v_demo and activa) = 1
    and exists (select 1 from public.rutinas
                where id = v_rutina2 and alumno_id = v_demo and activa and plantilla_id = v_plantilla)
    and (select count(*) from public.rutina_ejercicios where rutina_id = v_rutina2)
      = (select count(*) from public.plantilla_ejercicios where plantilla_id = v_plantilla));
  perform pg_temp.ok('B1', 'La rutina anterior queda inactiva', exists (select 1 from public.rutinas where id = v_rutina and not activa));
  perform pg_temp.ok('B1', 'Objetivo o nivel inválido: error valor_invalido', v_msg = 'valor_invalido' and v_msg2 = 'valor_invalido');
  perform pg_temp.ok('B1', 'Un valor inválido no cambia lo guardado',
    exists (select 1 from public.alumnos where id = v_demo and objetivo = 'fuerza' and nivel = 'principiante'));
  perform pg_temp.ok('B1', 'Un alumno no cambia el objetivo de otro (solo actúa sobre el propio)',
    exists (select 1 from public.alumnos where id = v_otro and objetivo = 'fuerza' and nivel = 'intermedio')
    and exists (select 1 from public.rutinas where id = v_rutina_otro and activa));

  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_profesor, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  v_msg := pg_temp.error_de($q$select public.elegir_objetivo_nivel('salud', 'principiante')$q$);
  execute 'reset role';
  perform set_config('request.jwt.claims', '', true);
  perform pg_temp.ok('B1', 'Sesión sin alumno asociado (profesor): error sin_permiso', v_msg = 'sin_permiso');

  -- Sin sesión (anon) no se lee nada ni se ejecuta nada.
  v_escribio := false;
  execute 'set local role anon';
  begin
    perform 1 from public.plantillas limit 1;
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.rutinas limit 1;
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  begin
    perform * from public.rutina_del_dia(v_demo);
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.generar_rutina(v_demo);
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.elegir_objetivo_nivel('salud', 'principiante');
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  execute 'reset role';
  perform pg_temp.ok('RLS', 'anon no lee plantillas ni rutinas ni ejecuta las funciones (incluida elegir_objetivo_nivel)', not v_escribio);
end;
$$;

select n, criterio, caso, estado from resultado_pruebas order by n;

rollback;
