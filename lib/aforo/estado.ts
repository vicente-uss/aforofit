// Estado de ocupación que muestra la pantalla pública. Función pura para probarla con Vitest.
export type EstadoAforo = { etiqueta: "Disponible" | "Casi lleno" | "Lleno"; porcentaje: number };

// Solo es un respaldo: el valor real viene de aforo.umbral_casi_lleno (copiado de configuracion).
// Se usa si ese valor falta o no está entre 0 (excluido) y 1.
export const UMBRAL_CASI_LLENO_RESPALDO = 0.8;

export function estadoAforo(
  ocupacion: number,
  capacidad: number,
  umbral: number | null | undefined,
): EstadoAforo {
  const umbralUsado =
    typeof umbral === "number" && umbral > 0 && umbral <= 1 ? umbral : UMBRAL_CASI_LLENO_RESPALDO;
  if (capacidad <= 0) return { etiqueta: "Lleno", porcentaje: 100 };
  const proporcion = Math.min(ocupacion / capacidad, 1);
  const porcentaje = Math.round(proporcion * 100);
  if (ocupacion >= capacidad) return { etiqueta: "Lleno", porcentaje: 100 };
  if (proporcion >= umbralUsado) return { etiqueta: "Casi lleno", porcentaje };
  return { etiqueta: "Disponible", porcentaje };
}
