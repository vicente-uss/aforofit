// Textos del historial (F-33). Los nombres del feedback vienen de lib/rutina/mensajes.ts.
import type { TipoInsignia } from "./tipos";
import type { TipoCierre } from "./historial";

export const ETIQUETA_CIERRE: Record<TipoCierre, string> = {
  abierta: "En el gimnasio",
  normal: "Salida normal",
  profesor: "Cerrada por el profesor",
  automatico: "Cierre automático",
};

// Tono de la insignia de cada tipo de cierre (components/marca/insignia).
export const TONO_CIERRE: Record<TipoCierre, TipoInsignia> = {
  abierta: "blue",
  normal: "green",
  profesor: "neutral",
  automatico: "amber",
};

export const TEXTOS = {
  alumnoTitulo: "Mi historial",
  alumnoDetalle: "Tus últimas 20 visitas al gimnasio y cómo te fue.",
  alumnoVacioTitulo: "Todavía no tienes visitas",
  alumnoVacioDetalle: "Cuando pases tu credencial en la entrada, tus visitas aparecerán aquí.",
  enGimnasioDesde: "En el gimnasio desde las",
  sinFeedback: "Sin feedback",
  volver: "Volver a mi rutina",
  profesorTitulo: "Historial del día",
  profesorDetalle: "Visitas y préstamos registrados. Solo lectura.",
  visitasTitulo: "Visitas",
  visitasVacio: "No hay visitas este día",
  visitasVacioDetalle: "Elige otra fecha o revisa que el kiosco haya registrado entradas.",
  prestamosTitulo: "Préstamos",
  prestamosVacio: "No hay préstamos este día",
  prestamosVacioDetalle: "Se muestran los préstamos entregados en la fecha elegida.",
  fecha: "Fecha",
  actualizar: "Actualizar",
  sinConexion: "No se pudo leer el historial. Revisa la conexión e inténtalo de nuevo.",
  cargando: "Cargando…",
} as const;

// «3 visitas», «1 visita».
export function plural(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

export const ETIQUETA_PRESTAMO = {
  implementos: "Implementos pendientes",
  tne: "TNE pendiente",
  cerrado: "Cerrado",
} as const;

export const TONO_PRESTAMO = { implementos: "blue", tne: "amber", cerrado: "green" } as const;
