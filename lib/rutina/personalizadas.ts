export type OrigenRutina = "sistema" | "profesor" | "alumno";

export type ModalidadesRutina = Record<OrigenRutina, boolean>;

export const ORIGEN_RUTINA: Record<OrigenRutina, string> = {
  sistema: "Sistema",
  profesor: "Profesor",
  alumno: "Alumno",
};

export type EjercicioEditable = {
  ejercicio: string;
  maquina_id: number;
  series: number;
  repeticiones: number | null;
  minutos: number | null;
  carga_kg: number | null;
  nota_ajuste: string | null;
};

export type MaquinaRutina = { id: number; nombre: string; estado: string };

export type RutinaDisponible = {
  id: string;
  nombre: string | null;
  origen: OrigenRutina;
  activa: boolean;
  plantillas: { nombre: string } | null;
  rutina_ejercicios: (EjercicioEditable & { orden: number; id: string })[];
};

export function nombreRutina(rutina: RutinaDisponible) {
  return rutina.nombre ?? rutina.plantillas?.nombre ?? `Rutina de ${ORIGEN_RUTINA[rutina.origen].toLowerCase()}`;
}
