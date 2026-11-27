-- Reversión de código. Conserva configuración, rutinas, visitas, turnos y feedback.
begin;

drop function if exists public.actualizar_configuracion_completa(jsonb);

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

  v_nueva := round(v_bruta / v_paso) * v_paso;

  -- D25: si «me costó» no bajó la carga después de redondear, baja un paso.
  if p_valor = 'me_costo' and v_nueva >= p_carga then
    v_nueva := p_carga - v_paso;
  end if;

  return greatest(v_nueva, 0);
end;
$$;

commit;
