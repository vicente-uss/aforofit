// Regla 8 (progresión de cargas), la misma de privado.nueva_carga en supabase/sql/024_configuracion_completa.sql.
// La base de datos es la que guarda la carga; esta copia sirve para que la pantalla de F-02 muestre
// «tu próxima carga» antes o después de responder. Función pura, probada con Vitest.

export type ValorFeedback = "facil" | "justo" | "me_costo";

// Mismas claves que configuracion.progresion (jsonb). Los valores vienen de la tabla, no del código.
export type ParametrosProgresion = {
  facil_kg: number;
  justo_kg: number;
  me_costo_porcentaje: number;
  redondeo_kg: number;
};

export const VALORES_FEEDBACK: readonly ValorFeedback[] = ["facil", "justo", "me_costo"];

// Valida el jsonb leído de configuracion.progresion. Devuelve null si falta algún parámetro.
export function leerProgresion(datos: unknown): ParametrosProgresion | null {
  if (typeof datos !== "object" || datos === null || Array.isArray(datos)) return null;
  const d = datos as Record<string, unknown>;
  const claves = ["facil_kg", "justo_kg", "me_costo_porcentaje", "redondeo_kg"] as const;
  if (!claves.every((c) => typeof d[c] === "number" && Number.isFinite(d[c]))) return null;
  if ((d.redondeo_kg as number) <= 0) return null;
  return {
    facil_kg: d.facil_kg as number,
    justo_kg: d.justo_kg as number,
    me_costo_porcentaje: d.me_costo_porcentaje as number,
    redondeo_kg: d.redondeo_kg as number,
  };
}

// Quita el ruido de los decimales binarios (ej. 37 * 0.95 = 35.150000000000006) para redondear
// igual que PostgreSQL, que calcula con decimales exactos.
function limpiar(n: number): number {
  return Number(n.toFixed(6));
}

// Nueva carga según el feedback. Con los valores iniciales: fácil = +2,5 kg, justo = igual,
// me costó = −5 %; luego se redondea al múltiplo de 2,5 kg más cercano y nunca queda negativa.
// Ejemplo CA14: 40 kg → 42,5 / 40 / 37,5. Cardio (carga null) no cambia.
// D25: «me costó» siempre baja al menos un paso de redondeo (20 → 17,5; 2,5 → 0; 0 → 0).
export function nuevaCarga(
  carga: number | null,
  valor: ValorFeedback,
  parametros: ParametrosProgresion,
): number | null {
  if (carga === null) return null;
  if (valor === "justo" && parametros.justo_kg === 0) return carga;
  const bruta =
    valor === "facil"
      ? carga + parametros.facil_kg
      : valor === "justo"
        ? carga + parametros.justo_kg
        : carga * (1 + parametros.me_costo_porcentaje / 100);
  const pasos = Math.round(limpiar(limpiar(bruta) / parametros.redondeo_kg));
  let nueva = limpiar(pasos * parametros.redondeo_kg);
  // D25: si «me costó» no bajó la carga después de redondear, baja un paso.
  if (valor === "me_costo" && nueva >= carga) nueva = limpiar(carga - parametros.redondeo_kg);
  if (valor === "facil" && nueva <= carga) nueva = limpiar(carga + parametros.redondeo_kg);
  if (valor === "justo") {
    nueva = parametros.justo_kg > 0 ? Math.max(nueva, carga) : Math.min(nueva, carga);
  }
  return Math.min(Math.max(nueva, 0), 9999.9);
}

// Texto para la pantalla, con coma decimal (es-CL): 42.5 → «42,5 kg». Cardio: «sin carga».
export function textoCarga(carga: number | null): string {
  if (carga === null) return "sin carga";
  return `${carga.toLocaleString("es-CL", { maximumFractionDigits: 1 })} kg`;
}
