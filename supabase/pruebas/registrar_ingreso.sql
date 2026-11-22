-- registrar_ingreso.sql
-- AforoFit · Pruebas de las reglas 1 a 6. Corre dentro de begin; … rollback; y no deja cambios.
-- Requiere 005 a 008. Ejecutar completo en Supabase → SQL Editor.
-- Usa una fecha futura fija (lunes 7 de diciembre de 2026) para no depender de la hora real.
-- Cada caso imprime OK; el primero que falle detiene todo con raise exception.

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

do $$
declare
  c_lunes constant text := '2026-12-07 ';
  r jsonb;
  r2 jsonb;
  v_ana uuid;
  v_otro uuid;
  v_id uuid;
  v_alumno_demo uuid;
  v_profesor uuid;
  v_visitas integer;
  v_ajenas integer;
  v_filas integer;
  v_escribio boolean;
  i integer;
begin
  -- Datos propios de la prueba, con capacidad 2 para llenar el gimnasio rápido.
  update public.configuracion set capacidad = 2, turno_expira_minutos = 10, cierre_automatico_horas = 3;

  insert into public.alumnos (nombre, rut, certificado_hasta)
  select 'Prueba ' || g, 'PRUEBA-' || g, date '2026-12-23' from generate_series(1, 6) g;
  insert into public.alumnos (nombre, rut, certificado_hasta) values ('Prueba vencido', 'PRUEBA-V', date '2026-06-30');
  insert into public.tarjetas (uid, alumno_id)
  select 'FB:00:00:0' || substr(a.rut, 8), a.id from public.alumnos a where a.rut like 'PRUEBA-_' and a.rut <> 'PRUEBA-V';
  insert into public.tarjetas (uid, alumno_id)
  select 'FB:00:00:0F', a.id from public.alumnos a where a.rut = 'PRUEBA-V';
  select id into v_ana from public.alumnos where rut = 'PRUEBA-1';

  -- Regla 1 · Credencial no registrada (CA02).
  r := privado.registrar_ingreso_en('FB:FF:FF:FF', pg_temp.h(c_lunes || '10:00'));
  perform pg_temp.ok('CA02', 'Credencial no registrada: rechazo sin alumno',
    r->>'resultado' = 'rechazo' and r->>'motivo' = 'credencial_no_registrada' and r->'alumno' = 'null'::jsonb);
  perform pg_temp.ok('CA02', 'Credencial no registrada: no crea visita',
    (r->>'ocupacion')::int = 0);

  -- Regla 2 · Certificado vencido (CA04) y período.
  r := privado.registrar_ingreso_en('FB:00:00:0F', pg_temp.h(c_lunes || '10:00'));
  perform pg_temp.ok('CA04', 'Certificado vencido: rechazo', r->>'motivo' = 'certificado_no_vigente');

  r := privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h('2026-12-28 10:00'));
  perform pg_temp.ok('R2', 'Fuera del período académico: rechazo',
    r->>'motivo' = 'certificado_no_vigente' or r->>'motivo' = 'fuera_de_periodo');
  update public.alumnos set certificado_hasta = date '2027-03-31' where id = v_ana;
  r := privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h('2026-12-28 10:00'));
  perform pg_temp.ok('R2', 'Certificado vigente, pero fuera del período', r->>'motivo' = 'fuera_de_periodo');
  update public.alumnos set certificado_hasta = date '2026-12-23' where id = v_ana;

  -- Regla 3 · Horario (CA05) y domingo.
  r := privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h(c_lunes || '21:05'));
  perform pg_temp.ok('CA05', 'Lunes 21:05: fuera de horario', r->>'motivo' = 'fuera_de_horario');
  r := privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h(c_lunes || '07:59'));
  perform pg_temp.ok('R3', 'Lunes 07:59: antes de la apertura', r->>'motivo' = 'fuera_de_horario');
  r := privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h('2026-12-12 13:01'));
  perform pg_temp.ok('R3', 'Sábado 13:01: fuera de horario', r->>'motivo' = 'fuera_de_horario');
  r := privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h('2026-12-06 10:00'));
  perform pg_temp.ok('R3', 'Domingo: gimnasio cerrado', r->>'motivo' = 'gimnasio_cerrado');
  r := privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h(c_lunes || '21:00'));
  perform pg_temp.ok('R3', 'Lunes 21:00: último ingreso aceptado', r->>'resultado' = 'entrada');
  r := privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h(c_lunes || '21:01'));
  perform pg_temp.ok('CA08', 'La salida se permite después del último ingreso', r->>'resultado' = 'salida');

  -- Reglas 4 y 5 · Entrada normal y salida (CA01 y CA08).
  r := privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h(c_lunes || '10:00'));
  perform pg_temp.ok('CA01', 'Entrada normal con alumno y aforo',
    r->>'resultado' = 'entrada' and r->'alumno'->>'id' = v_ana::text and (r->>'ocupacion')::int = 1 and r->>'motivo' is null);
  perform pg_temp.ok('CA01', 'La fila de aforo sube en la entrada',
    (select ocupacion from public.aforo where id = 1) = 1);

  r := privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h(c_lunes || '10:05'));
  perform pg_temp.ok('CA08', 'Segunda pasada: salida', r->>'resultado' = 'salida' and (r->>'ocupacion')::int = 0);
  perform pg_temp.ok('CA08', 'La fila de aforo baja en la salida',
    (select ocupacion from public.aforo where id = 1) = 0);

  -- Regla 5 · El índice impide dos visitas abiertas.
  perform privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h(c_lunes || '10:10'));
  v_escribio := false;
  begin
    insert into public.visitas (alumno_id, entrada) values (v_ana, pg_temp.h(c_lunes || '10:11'));
    v_escribio := true;
  exception when unique_violation then null;
  end;
  perform pg_temp.ok('R5', 'No se permiten dos visitas abiertas', not v_escribio);

  -- Regla 4 · Gimnasio lleno (capacidad 2): Prueba 1 y 2 adentro (CA06).
  perform privado.registrar_ingreso_en('FB:00:00:02', pg_temp.h(c_lunes || '10:12'));
  r := privado.registrar_ingreso_en('FB:00:00:03', pg_temp.h(c_lunes || '10:13'));
  perform pg_temp.ok('CA06', 'Gimnasio lleno: turno 1 sin entrada',
    r->>'resultado' = 'turno' and (r->>'turno')::int = 1 and (r->>'ocupacion')::int = 2);

  r2 := privado.registrar_ingreso_en('FB:00:00:03', pg_temp.h(c_lunes || '10:14'));
  perform pg_temp.ok('CA06', 'Mismo alumno lleno dos veces: mismo turno', (r2->>'turno')::int = 1);
  perform pg_temp.ok('CA06', 'No se duplica el turno',
    (select count(*) from public.turnos t join public.alumnos a on a.id = t.alumno_id where a.rut = 'PRUEBA-3') = 1);

  r := privado.registrar_ingreso_en('FB:00:00:04', pg_temp.h(c_lunes || '10:15'));
  perform pg_temp.ok('CA06', 'El siguiente alumno recibe el turno 2', (r->>'turno')::int = 2);
  perform pg_temp.ok('R4', 'Aforo informa 2 en espera', (select en_espera from public.aforo where id = 1) = 2);

  -- Salida: se llama al primer turno (CA07).
  perform privado.registrar_ingreso_en('FB:00:00:01', pg_temp.h(c_lunes || '10:20'));
  perform pg_temp.ok('CA07', 'La salida llama al turno 1',
    (select turno_llamado from public.aforo where id = 1) = 1
    and (select en_espera from public.aforo where id = 1) = 1);

  -- CA07: el turno 2 debe esperar aunque haya un cupo reservado para el turno 1.
  r := privado.registrar_ingreso_en('FB:00:00:04', pg_temp.h(c_lunes || '10:21'));
  perform pg_temp.ok('CA07', 'El turno 2 sigue esperando', r->>'resultado' = 'turno' and (r->>'turno')::int = 2);

  r := privado.registrar_ingreso_en('FB:00:00:05', pg_temp.h(c_lunes || '10:21'));
  perform pg_temp.ok('R4', 'Quien llega sin turno no toma el cupo reservado',
    r->>'resultado' = 'turno' and (r->>'turno')::int = 3);

  r := privado.registrar_ingreso_en('FB:00:00:03', pg_temp.h(c_lunes || '10:22'));
  perform pg_temp.ok('CA07', 'El alumno llamado entra', r->>'resultado' = 'entrada' and (r->>'ocupacion')::int = 2);
  perform pg_temp.ok('CA07', 'Su turno queda usado',
    (select t.estado from public.turnos t join public.alumnos a on a.id = t.alumno_id where a.rut = 'PRUEBA-3') = 'usado');

  -- Turno llamado sin reclamar: expira y llama al siguiente.
  perform privado.registrar_ingreso_en('FB:00:00:02', pg_temp.h(c_lunes || '10:30')); -- sale Prueba 2: llama al turno 2
  perform pg_temp.ok('R4', 'Se llama al turno 2', (select turno_llamado from public.aforo where id = 1) = 2);
  r := privado.registrar_ingreso_en('FB:FF:FF:FF', pg_temp.h(c_lunes || '10:40'));
  perform pg_temp.ok('R4', 'El turno 2 expira a los 10 minutos',
    (select t.estado from public.turnos t join public.alumnos a on a.id = t.alumno_id where a.rut = 'PRUEBA-4') = 'expirado');
  perform pg_temp.ok('R4', 'La expiración llama al turno 3', (select turno_llamado from public.aforo where id = 1) = 3);

  -- Regla 6 · Cierre automático (CA09): Prueba 3 entró a las 10:22.
  r := privado.registrar_ingreso_en('FB:FF:FF:FF', pg_temp.h(c_lunes || '13:21'));
  perform pg_temp.ok('CA09', 'Antes de 3 horas la visita sigue abierta',
    exists (select 1 from public.visitas v join public.alumnos a on a.id = v.alumno_id where a.rut = 'PRUEBA-3' and v.salida is null));
  r := privado.registrar_ingreso_en('FB:FF:FF:FF', pg_temp.h(c_lunes || '13:22'));
  perform pg_temp.ok('CA09', 'A las 3 horas se cierra con cierre_automatico',
    exists (select 1 from public.visitas v join public.alumnos a on a.id = v.alumno_id
            where a.rut = 'PRUEBA-3' and v.cierre_automatico and v.salida = pg_temp.h(c_lunes || '13:22')));
  perform pg_temp.ok('CA09', 'El cierre automático libera el cupo', (r->>'ocupacion')::int = 0);

  -- Regla 1 · vincular_credencial con sesión simulada.
  select p.id into v_profesor from public.perfiles p where p.rol = 'profesor' limit 1;
  select u.id into v_alumno_demo from auth.users u where u.email = 'alumno.demo@aforofit.cl';
  select id into v_otro from public.alumnos where rut = 'PRUEBA-2';

  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_profesor, 'role', 'authenticated')::text, true);
  r := public.vincular_credencial('FB:00:00:01', v_otro);
  perform pg_temp.ok('CA03', 'Credencial de otro alumno: rechazo', r = '{"ok": false, "motivo": "credencial_de_otro_alumno"}'::jsonb);
  r := public.vincular_credencial('FB:AA:AA:AA', gen_random_uuid());
  perform pg_temp.ok('R1', 'Alumno inexistente: rechazo', r = '{"ok": false, "motivo": "alumno_no_encontrado"}'::jsonb);
  r := public.vincular_credencial('FB:AA:AA:AA', v_otro);
  perform pg_temp.ok('R1', 'Vincula una credencial libre', r = '{"ok": true, "motivo": null}'::jsonb);
  r := public.registrar_ingreso('FB:FF:FF:FF');
  perform pg_temp.ok('R1', 'El profesor puede llamar registrar_ingreso', r->>'motivo' = 'credencial_no_registrada');

  -- Permisos con la sesión de alumno.demo.
  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_alumno_demo, 'role', 'authenticated')::text, true);
  r := public.registrar_ingreso('FB:00:00:01');
  perform pg_temp.ok('Contrato', 'Alumno en registrar_ingreso: sin_permiso',
    r->>'resultado' = 'rechazo' and r->>'motivo' = 'sin_permiso' and r ? 'ocupacion' and r ? 'capacidad');
  r := public.vincular_credencial('FB:BB:BB:BB', v_otro);
  perform pg_temp.ok('Contrato', 'Alumno en vincular_credencial: sin_permiso', r = '{"ok": false, "motivo": "sin_permiso"}'::jsonb);

  -- RLS: una visita del alumno.demo y otra ajena; solo debe ver la propia.
  select id into v_id from public.alumnos where perfil_id = v_alumno_demo;
  insert into public.visitas (alumno_id, entrada, salida)
  values (v_id, pg_temp.h(c_lunes || '09:00'), pg_temp.h(c_lunes || '09:30'));

  execute 'set local role authenticated';
  select count(*), count(*) filter (where alumno_id <> v_id) into v_visitas, v_ajenas from public.visitas;
  execute 'reset role';
  perform pg_temp.ok('RNF', 'alumno.demo ve solo su visita', v_visitas >= 1 and v_ajenas = 0);

  v_escribio := false;
  execute 'set local role authenticated';
  begin
    insert into public.visitas (alumno_id) values (v_id);
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  begin
    update public.aforo set ocupacion = 99;
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.turnos (alumno_id, numero) values (v_id, 999);
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.tarjetas;
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  begin
    update public.alumnos set nombre = 'x';
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  update public.configuracion set capacidad = 99;
  get diagnostics v_filas = row_count;
  execute 'reset role';
  perform pg_temp.ok('RNF', 'alumno.demo no escribe en ninguna tabla', not v_escribio and v_filas = 0);

  perform set_config('request.jwt.claims', '', true);
  execute 'set local role anon';
  select count(*) into i from public.aforo;
  execute 'reset role';
  perform pg_temp.ok('Contrato', 'La pantalla pública (anon) lee aforo', i = 1);

  v_escribio := false;
  execute 'set local role anon';
  begin
    perform 1 from public.alumnos limit 1;
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.registrar_ingreso('FB:00:00:01');
    v_escribio := true;
  exception when insufficient_privilege then null;
  end;
  execute 'reset role';
  perform pg_temp.ok('Contrato', 'anon no lee alumnos ni ejecuta registrar_ingreso', not v_escribio);
end;
$$;

select n, criterio, caso, estado from resultado_pruebas order by n;

rollback;
