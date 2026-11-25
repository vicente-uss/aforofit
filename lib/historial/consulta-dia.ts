import type { PrestamoHistorial, VisitaHistorial } from "./historial";

type Datos = { visitas: VisitaHistorial[]; prestamos: PrestamoHistorial[]; ahora: Date };

export type ConsultaDia = { dia: string; peticion: number } & (
  | { tipo: "cargando" | "error" }
  | { tipo: "listo"; datos: Datos }
);

// Fecha, indicadores y filas cambian juntos. Incluso al volver a la misma fecha
// una respuesta de una petición anterior queda descartada.
export function actualizarConsulta(actual: ConsultaDia, nueva: ConsultaDia): ConsultaDia {
  return nueva.peticion < actual.peticion ? actual : nueva;
}
