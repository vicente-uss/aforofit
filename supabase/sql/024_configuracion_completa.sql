-- 024 · RF26 / CA17, CA18 y CA34. Requiere 019 y 023.
begin;

create or replace function public.actualizar_configuracion_completa(p_parametros jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_key text;
  v_horario jsonb;
  v_modalidades jsonb := p_parametros -> 'modalidades_rutina';
  v_progresion jsonb := p_parametros -> 'progresion';
  v_capacidad numeric;
  v_cierre numeric;
  v_umbral numeric;
  v_expira numeric;
  v_facil numeric;
  v_justo numeric;
  v_reduccion numeric;
  v_paso numeric;
  v_aforo public.aforo%rowtype;
begin
  if not exists (
    select 1 from public.perfiles where id = (select auth.uid()) and rol = 'admin'
  ) then
    raise exception 'sin_permiso';
  end if;

  if jsonb_typeof(p_parametros) is distinct from 'object' then
    raise exception 'parametros_invalidos';
  end if;
  if p_parametros - array['capacidad','horario','cierre_automatico_horas',
      'umbral_casi_lleno','turno_expira_minutos','modalidades_rutina','progresion'] <> '{}'::jsonb then
    raise exception 'parametros_invalidos';
  end if;

  foreach v_key in array array['capacidad','cierre_automatico_horas','umbral_casi_lleno','turno_expira_minutos'] loop
    if jsonb_typeof(p_parametros -> v_key) is distinct from 'number' then
      raise exception 'parametros_invalidos' using detail = 'Capacidad, cierre automático, umbral y expiración deben ser números.';
    end if;
  end loop;
  v_capacidad := (p_parametros ->> 'capacidad')::numeric;
  v_cierre := (p_parametros ->> 'cierre_automatico_horas')::numeric;
  v_umbral := (p_parametros ->> 'umbral_casi_lleno')::numeric;
  v_expira := (p_parametros ->> 'turno_expira_minutos')::numeric;

  if v_capacidad not between 1 and 100 or v_capacidad <> trunc(v_capacidad) then
    raise exception 'capacidad_invalida';
  end if;
  if v_cierre not between 1 and 12 or v_cierre <> trunc(v_cierre) then
    raise exception 'cierre_invalido';
  end if;
  if v_umbral not between 0.01 and 1 or v_umbral <> round(v_umbral, 2) then
    raise exception 'umbral_invalido';
  end if;
  if v_expira not between 1 and 120 or v_expira <> trunc(v_expira) then
    raise exception 'expiracion_invalida';
  end if;
  v_horario := privado.validar_horario(p_parametros -> 'horario');

  if jsonb_typeof(v_modalidades) is distinct from 'object'
    or v_modalidades - array['sistema','profesor','alumno'] <> '{}'::jsonb
    or jsonb_typeof(v_modalidades -> 'sistema') is distinct from 'boolean'
    or jsonb_typeof(v_modalidades -> 'profesor') is distinct from 'boolean'
    or jsonb_typeof(v_modalidades -> 'alumno') is distinct from 'boolean' then
    raise exception 'modalidades_invalidas';
  end if;

  if jsonb_typeof(v_progresion) is distinct from 'object'
    or v_progresion - array['facil_kg','justo_kg','me_costo_porcentaje','redondeo_kg'] <> '{}'::jsonb then
    raise exception 'progresion_invalida';
  end if;
  foreach v_key in array array['facil_kg','justo_kg','me_costo_porcentaje','redondeo_kg'] loop
    if jsonb_typeof(v_progresion -> v_key) is distinct from 'number' then
      raise exception 'progresion_invalida';
    end if;
  end loop;
  v_facil := (v_progresion ->> 'facil_kg')::numeric;
  v_justo := (v_progresion ->> 'justo_kg')::numeric;
  v_reduccion := (v_progresion ->> 'me_costo_porcentaje')::numeric;
  v_paso := (v_progresion ->> 'redondeo_kg')::numeric;
  if v_facil not between 0.1 and 50 or v_facil <> round(v_facil, 1)
    or abs(v_justo) > v_facil or v_justo <> round(v_justo, 1)
    or v_reduccion not between -100 and -0.1 or v_reduccion <> round(v_reduccion, 1)
    or v_paso not between 0.1 and 50 or v_paso <> round(v_paso, 1) then
    raise exception 'progresion_invalida';
  end if;

  -- Orden de 019. El trigger reconcilia una vez, con todos los valores nuevos.
  perform 1 from public.aforo where id = 1 for update;
  update public.configuracion
  set capacidad = v_capacidad,
      horario = v_horario,
      cierre_automatico_horas = v_cierre,
      umbral_casi_lleno = v_umbral,
      turno_expira_minutos = v_expira,
      modalidades_rutina = v_modalidades,
      progresion = v_progresion
  where id = 1;
  if not found then
    raise exception 'configuracion_no_disponible';
  end if;

  select * into strict v_aforo from public.aforo where id = 1;
  return jsonb_build_object('ocupacion', v_aforo.ocupacion, 'capacidad', v_aforo.capacidad);
end;
$$;

revoke all on function public.actualizar_configuracion_completa(jsonb)
  from public, anon, authenticated, service_role;
grant execute on function public.actualizar_configuracion_completa(jsonb) to authenticated;

-- La carga persistida tiene un decimal y un máximo de 9999,9 kg (011).
-- «Justo» en cero conserva la carga, incluso si se cambió el paso.
-- «Fácil» sube un paso si redondear no produjo un incremento.
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
  v_nueva      numeric;
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

  if p_valor = 'justo' and v_justo = 0 then
    return p_carga;
  end if;

  v_nueva := round(v_bruta / v_paso) * v_paso;
  if p_valor = 'facil' and v_nueva <= p_carga then
    v_nueva := p_carga + v_paso;
  elsif p_valor = 'justo' then
    -- Un cambio de paso puede dejar la carga anterior fuera de la cuadrícula.
    if v_justo > 0 then
      v_nueva := greatest(v_nueva, p_carga);
    else
      v_nueva := least(v_nueva, p_carga);
    end if;
  end if;

  -- D25: si «me costó» no bajó la carga después de redondear, baja un paso.
  if p_valor = 'me_costo' and v_nueva >= p_carga then
    v_nueva := p_carga - v_paso;
  end if;

  return least(greatest(v_nueva, 0), 9999.9);
end;
$$;

commit;
