-- F-29 (D22). Requiere 001 a 012. La pantalla pública solo lee aforo.
begin;

alter table public.aforo add column if not exists turno_llamado_nombre text;

-- 008 guarda nombre(s) y dos apellidos en un campo. Con dos palabras hay un
-- solo apellido. Con tres se prefiere el patrón de 008 (un nombre, dos apellidos).
create or replace function privado.nombre_para_turno(p_nombre text)
returns text language sql immutable strict set search_path = ''
as $$
  select case when cardinality(partes) >= 2 then
    partes[1] || ' ' || upper(left(partes[greatest(2, cardinality(partes) - 1)], 1)) || '.'
  end
  from (select regexp_split_to_array(btrim(regexp_replace(p_nombre, '[[:space:]]+', ' ', 'g')), ' ') as partes) n
$$;

revoke all on function privado.nombre_para_turno(text) from public, anon, authenticated;

create or replace function privado.sincronizar_aforo(p_ahora timestamptz default now())
returns public.aforo
language plpgsql
set search_path = ''
as $$
declare
  v_config    public.configuracion%rowtype;
  v_fila      public.aforo%rowtype;
  v_hoy       date := (p_ahora at time zone 'America/Santiago')::date;
  v_ocupacion integer;
  v_llamados  integer;
begin
  -- El bloqueo ordena las lecturas simultáneas: nadie toma el mismo cupo ni el mismo número.
  perform 1 from public.aforo where id = 1 for update;
  select * into strict v_config from public.configuracion where id = 1;

  select count(*) into v_ocupacion from public.visitas where salida is null;
  select count(*) into v_llamados from public.turnos
  where estado = 'llamado' and (creado_en at time zone 'America/Santiago')::date = v_hoy;

  -- Cada cupo libre llama al siguiente turno, en orden de llegada (regla 4).
  update public.turnos t
  set estado = 'llamado', llamado_en = p_ahora
  where t.id in (
    select s.id from public.turnos s
    where s.estado = 'esperando'
      and (s.creado_en at time zone 'America/Santiago')::date = v_hoy
    order by s.numero
    limit greatest(v_config.capacidad - v_ocupacion - v_llamados, 0)
  );

  update public.aforo a
  set ocupacion = v_ocupacion,
      capacidad = v_config.capacidad,
      -- Si hay varios llamados, la pantalla muestra el más antiguo.
      (turno_llamado, turno_llamado_nombre) = (
        select t.numero, privado.nombre_para_turno(al.nombre)
        from public.turnos t join public.alumnos al on al.id = t.alumno_id
        where t.estado = 'llamado' and (t.creado_en at time zone 'America/Santiago')::date = v_hoy
        order by t.numero limit 1
      ),
      en_espera = (
        select count(*) from public.turnos t
        where t.estado = 'esperando' and (t.creado_en at time zone 'America/Santiago')::date = v_hoy
      ),
      umbral_casi_lleno = v_config.umbral_casi_lleno,
      actualizado_en = p_ahora
  where a.id = 1
  returning * into strict v_fila;

  return v_fila;
end;
$$;

-- Completa la fila que ya está publicada sin provocar un nuevo llamado.
update public.aforo a set turno_llamado_nombre = (
  select privado.nombre_para_turno(al.nombre)
  from public.turnos t join public.alumnos al on al.id = t.alumno_id
  where t.numero = a.turno_llamado and t.estado = 'llamado'
    and (t.creado_en at time zone 'America/Santiago')::date =
        (a.actualizado_en at time zone 'America/Santiago')::date
) where a.id = 1;

commit;
