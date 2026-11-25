// Colores por nivel de ocupación. El nivel lo decide estadoAforo (lib/aforo/estado.ts) con el
// umbral_casi_lleno de la base; aquí solo se elige el color. Función pura, probada en nivel.test.ts.
import type { EstadoAforo } from "@/lib/aforo/estado";

export type Nivel = EstadoAforo["etiqueta"];

// Trazos del anillo y la barra (colores del prototipo).
export const TRAZO_NIVEL: Record<Nivel, string> = {
  Disponible: "#16A34A",
  "Casi lleno": "#F59E0B",
  Lleno: "#DC2626",
};

// Texto en el color del nivel sobre fondo blanco, con contraste suficiente (4,5:1 o más).
export const TEXTO_NIVEL: Record<Nivel, string> = {
  Disponible: "text-green-700",
  "Casi lleno": "text-amber-700",
  Lleno: "text-red-600",
};

// Iniciales para el Avatar: «Antonia Fictia Rivas» → «AF». Una palabra → su primera letra.
export function iniciales(nombre: string): string {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return "?";
  const letras = palabras.length === 1 ? [palabras[0][0]] : [palabras[0][0], palabras[1][0]];
  return letras.join("").toUpperCase();
}

// Segmentos de la barra: uno por persona hasta 40 de capacidad; sobre eso, barra continua (null).
export const MAX_SEGMENTOS = 40;
export function segmentos(ocupacion: number, capacidad: number): { llenos: number; total: number } | null {
  if (capacidad <= 0 || capacidad > MAX_SEGMENTOS) return null;
  return { llenos: Math.min(Math.max(ocupacion, 0), capacidad), total: capacidad };
}

// Ítem activo del menú lateral: «Inicio» solo en la raíz del rol; el resto también en sus subrutas.
export function esActivo(ruta: string, href: string, raiz: string): boolean {
  return href === raiz ? ruta === raiz : ruta === href || ruta.startsWith(`${href}/`);
}
