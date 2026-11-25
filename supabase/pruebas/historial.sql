-- historial.sql
-- AforoFit · F-33: lo que leen /alumno/historial y /profesor/historial, con los permisos que ya existen
-- (007, 011, 012 y 015). Solo lectura: no hay SQL nuevo. Corre dentro de begin; … rollback; y no deja
-- cambios. Usa usuarios y alumnos propios: no depende de los datos reales. Requiere 001 a 015.
-- Cada caso imprime OK; el primero que falle detiene todo con raise exception.

begin;

create function pg_temp.ok(p_caso text, p_condicion boolean) returns void
language plpgsql as $$
begin
  if p_condicion is not true then
    raise exception 'FALLÓ: %', p_caso;
  end if;
  raise notice 'OK: %', p_caso;
end;
$$;

create function pg_temp.sesion(p_usuario uuid) returns void language sql as $$
  select set_config('request.jwt.claims',
    case when p_usuario is null then ''
         else jsonb_build_object('sub', p_usuario, 'role', 'authenticated')::text end, true)
$$;

do $$
declare
  v_prof     uuid := gen_random_uuid();
  v_est1     uuid := gen_random_uuid();
  v_est2     uuid := gen_random_uuid();
  v_a        uuid;   -- alumno con cuenta v_est1
  v_b        uuid;   -- alumno con cuenta v_est2
  v_rutina   uuid;
  v_v1       uuid;   -- visita de A con feedback
  v_v2       uuid;   -- visita de A cerrada por el profesor
  v_vb       uuid;   -- visita de B
  v_imp      bigint;
  v_prestamo uuid;
  n          integer;
  m          integer;
  v_texto    text;
  v_items    text;
  v_bloqueado boolean;
begin
  insert into auth.users (id, email) values
    (v_prof, v_prof || '@example.invalid'), (v_est1, v_est1 || '@example.invalid'), (v_est2, v_est2 || '@example.invalid');
  update public.perfiles set rol = 'profesor' where id = v_prof;
  insert into public.alumnos (nombre, perfil_id, objetivo, nivel)
  values ('Historial Uno Prueba', v_est1, 'salud', 'principiante') returning id into v_a;
  insert into public.alumnos (nombre, perfil_id) values ('Historial Dos Prueba', v_est2) returning id into v_b;
  v_rutina := privado.generar_rutina_de(v_a);

  insert into public.visitas (alumno_id, entrada, salida)
  values (v_a, '2026-12-07 13:00Z', '2026-12-07 14:00Z') returning id into v_v1;
  insert into public.feedback (visita_id, rutina_id, valor) values (v_v1, v_rutina, 'justo');
  insert into public.visitas (alumno_id, entrada, salida, cerrada_por)
  values (v_a, '2026-12-08 13:00Z', '2026-12-08 13:40Z', v_prof) returning id into v_v2;
  insert into public.visitas (alumno_id, entrada, salida)
  values (v_b, '2026-12-07 13:10Z', '2026-12-07 14:10Z') returning id into v_vb;

  insert into public.implementos (nombre, cantidad_total) values ('Implemento historial ' || v_prof, 2) returning id into v_imp;
  insert into public.prestamos (alumno_id, profesor_id, entregado_en, devuelto_en, tne_devuelta)
  values (v_a, v_prof, '2026-12-07 15:00Z', '2026-12-07 16:00Z', true) returning id into v_prestamo;
  insert into public.prestamo_items (prestamo_id, implemento_id, cantidad) values (v_prestamo, v_imp, 2);

  -- Alumno: /alumno/historial ---------------------------------------------------------------
  perform pg_temp.sesion(v_est1);
  execute 'set local role authenticated';
  select count(*) filter (where alumno_id = v_a), count(*) filter (where alumno_id = v_b)
    into n, m from public.visitas where id in (v_v1, v_v2, v_vb);
  execute 'reset role';
  perform pg_temp.ok('El alumno lee sus 2 visitas y ninguna ajena', n = 2 and m = 0);

  execute 'set local role authenticated';
  select count(*) into n from public.visitas
  where id = v_v2 and cerrada_por is not null and not cierre_automatico;
  execute 'reset role';
  perform pg_temp.ok('El alumno ve cómo se cerró su visita (cerrada_por y cierre_automatico)', n = 1);

  execute 'set local role authenticated';
  select valor into v_texto from public.feedback where visita_id = v_v1;
  execute 'reset role';
  perform pg_temp.ok('El alumno lee el feedback de su visita', v_texto = 'justo');

  execute 'set local role authenticated';
  select count(*) into n from public.prestamos where id = v_prestamo;
  select count(*) into m from public.prestamo_items where prestamo_id = v_prestamo;
  execute 'reset role';
  perform pg_temp.ok('El alumno no ve préstamos ni sus implementos (015)', n = 0 and m = 0);

  perform pg_temp.sesion(v_est2);
  execute 'set local role authenticated';
  select count(*) into n from public.feedback where visita_id = v_v1;
  select count(*) into m from public.visitas where alumno_id = v_a;
  execute 'reset role';
  perform pg_temp.ok('Otro alumno no ve las visitas ni el feedback ajenos', n = 0 and m = 0);

  -- Profesor: /profesor/historial ---------------------------------------------------------
  perform pg_temp.sesion(v_prof);
  execute 'set local role authenticated';
  select count(*) into n
  from public.visitas v join public.alumnos a on a.id = v.alumno_id
  where v.id in (v_v1, v_v2, v_vb)
    and v.entrada >= '2026-12-07 03:00Z' and v.entrada < '2026-12-08 03:00Z';
  execute 'reset role';
  perform pg_temp.ok('El profesor lee las visitas del día de todos, con el nombre', n = 2);

  execute 'set local role authenticated';
  select string_agg(i.nombre || ' × ' || d.cantidad, ', '), max(a.nombre) into v_items, v_texto
  from public.prestamos p
  join public.alumnos a on a.id = p.alumno_id
  join public.prestamo_items d on d.prestamo_id = p.id
  join public.implementos i on i.id = d.implemento_id
  where p.id = v_prestamo and p.devuelto_en is not null;
  execute 'reset role';
  perform pg_temp.ok('El profesor lee un préstamo cerrado con su alumno e implementos',
    v_texto = 'Historial Uno Prueba' and v_items = 'Implemento historial ' || v_prof || ' × 2');

  -- anon no ve nada ---------------------------------------------------------------------------
  perform pg_temp.sesion(null);
  v_bloqueado := true;
  execute 'set local role anon';
  begin
    perform 1 from public.visitas limit 1;
    v_bloqueado := false;
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.feedback limit 1;
    v_bloqueado := false;
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.prestamos limit 1;
    v_bloqueado := false;
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.prestamo_items limit 1;
    v_bloqueado := false;
  exception when insufficient_privilege then null;
  end;
  execute 'reset role';
  perform pg_temp.ok('anon no lee visitas, feedback, préstamos ni implementos prestados', v_bloqueado);
end;
$$;

rollback;
