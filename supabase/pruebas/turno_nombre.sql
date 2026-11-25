-- F-29. Ejecutar tras 001 a 013 en la base de pruebas con los alumnos de 008.
begin;

create function pg_temp.ok(caso text, correcto boolean) returns void
language plpgsql as $$
begin
  if correcto is not true then raise exception 'FALLÓ: %', caso; end if;
  raise notice 'OK: %', caso;
end;
$$;

select pg_temp.ok('Nombre compuesto, tildes y espacios',
  privado.nombre_para_turno(E'  María\tJosé   Pérez Soto ') = 'María P.');
select pg_temp.ok('Un solo apellido', privado.nombre_para_turno('Inés ávila') = 'Inés Á.');
select pg_temp.ok('Sin apellido', privado.nombre_para_turno('Inés') is null);
select pg_temp.ok('Sin nombre', privado.nombre_para_turno('   ') is null);

-- Aísla la demostración del estado previo. El rollback repone visitas, turnos y capacidad.
set local time zone 'America/Santiago';
update public.visitas set salida = entrada where salida is null;
delete from public.turnos where creado_en::date = date '2026-12-07';
update public.configuracion set capacidad = 1, turno_expira_minutos = 10 where id = 1;

select privado.registrar_ingreso_en('04:A3:7F:2B', '2026-12-07 10:00');
select privado.registrar_ingreso_en('1C:5E:90:D4', '2026-12-07 10:01');
select privado.registrar_ingreso_en('B2:07:6A:3F', '2026-12-07 10:02');
select pg_temp.ok('En espera aún no se publica el nombre',
  (select en_espera = 2 and turno_llamado is null and turno_llamado_nombre is null from public.aforo where id = 1));

select privado.registrar_ingreso_en('04:A3:7F:2B', '2026-12-07 10:03');
set local role anon;
select pg_temp.ok('Anon ve el turno de Benjamín y solo el texto recortado',
  (select turno_llamado = 1 and turno_llamado_nombre = 'Benjamín P.' from public.aforo where id = 1));
do $$
begin
  perform nombre from public.alumnos;
  raise exception 'Anon pudo consultar alumnos';
exception when insufficient_privilege then
  raise notice 'OK: anon no puede consultar alumnos';
end;
$$;
reset role;

select privado.registrar_ingreso_en('1C:5E:90:D4', '2026-12-07 10:04');
select pg_temp.ok('Al usar el turno desaparecen número y nombre',
  (select ocupacion = 1 and turno_llamado is null and turno_llamado_nombre is null from public.aforo where id = 1));
select privado.registrar_ingreso_en('1C:5E:90:D4', '2026-12-07 10:05');
select pg_temp.ok('Al liberar el siguiente cupo se publica Catalina',
  (select turno_llamado = 2 and turno_llamado_nombre = 'Catalina D.' from public.aforo where id = 1));

-- Una lectura posterior al plazo dispara la expiración, según 006.
select privado.registrar_ingreso_en('FF:FE:FD:FC', '2026-12-07 10:16');
select pg_temp.ok('Al expirar el último llamado se borran número y nombre',
  (select turno_llamado is null and turno_llamado_nombre is null from public.aforo where id = 1));

rollback;
