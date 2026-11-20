// Estado de ocupación que muestra la pantalla pública. Función pura para probarla con Vitest.
export type EstadoAforo = { etiqueta: "Disponible" | "Casi lleno" | "Lleno"; porcentaje: number };

// Umbral desde el que se avisa "Casi lleno" (80 % de la capacidad).
const UMBRAL_CASI_LLENO = 0.8;

export function estadoAforo(ocupacion: number, capacidad: number): EstadoAforo {
  if (capacidad <= 0) return { etiqueta: "Lleno", porcentaje: 100 };
  const proporcion = Math.min(ocupacion / capacidad, 1);
  const porcentaje = Math.round(proporcion * 100);
  if (ocupacion >= capacidad) return { etiqueta: "Lleno", porcentaje: 100 };
  if (proporcion >= UMBRAL_CASI_LLENO) return { etiqueta: "Casi lleno", porcentaje };
  return { etiqueta: "Disponible", porcentaje };
}
