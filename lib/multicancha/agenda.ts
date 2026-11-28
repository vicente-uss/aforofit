import { diaSantiago, esDiaValido } from "../historial/historial";
import { normalizarRut } from "../ingreso/rut";

export const TIPOS = {
  ordinaria: "Reservado",
  institucional: "Actividad institucional",
  bloqueo: "Bloqueado",
} as const;

export type Tipo = keyof typeof TIPOS;
export type Modulo = { id: number; dias: number[]; hora_inicio: string; hora_fin: string };
export type Integrante = { nombre: string; rut: string; carrera: string };
export type Horario = { fecha: string; hora_inicio: string; hora_fin: string };
export type Reserva = Horario & {
  id: string;
  tipo: Tipo;
  titulo: string | null;
  inicio: string;
  fin: string;
  version: string;
  cancelada_en: string | null;
  responsable: string | null;
  carrera: string | null;
  correo: string | null;
  responsable_id: string | null;
  multicancha_integrantes: Integrante[];
};
export type Evento = {
  id: number;
  fecha: string;
  accion: "creacion" | "modificacion" | "cancelacion" | "nomina";
  actor_nombre: string;
  momento: string;
  detalle: Partial<DatosEvento> & { antes?: DatosEvento; despues?: DatosEvento; cantidad?: number };
};

type DatosEvento = Horario & { responsable?: string; titulo?: string };

export const CAMPOS_RESERVA = "id, tipo, titulo, inicio, fin, fecha, hora_inicio, hora_fin, version, cancelada_en, responsable, carrera, correo, responsable_id, multicancha_integrantes(nombre, rut, carrera)";
export const RUTA_PROFESOR = "/profesor/multicancha";
export const RUTA_ALUMNO = "/alumno/reservas";
export const RUTA_REGLAMENTO = "/multicancha/reglamento";
export const UUID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
export const CORREO = /^[a-z0-9_%+-]+(\.[a-z0-9_%+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)+$/;
export const HORA = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
export const INICIO_CALENDARIO = "2000-01-01";
export const FIN_CALENDARIO = "9999-12-31";

export function fechaValida(fecha: string) {
  return esDiaValido(fecha) && fecha >= INICIO_CALENDARIO && fecha <= FIN_CALENDARIO;
}

export function fechaAgenda(valor: string | string[] | undefined, ahora: Date) {
  return typeof valor === "string" && fechaValida(valor) ? valor : diaSantiago(ahora);
}

function fechaCivil(fecha: string) {
  return new Date(`${fecha}T12:00:00Z`);
}

const mesLargo = new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric", timeZone: "UTC" });
const diaLargo = new Intl.DateTimeFormat("es-CL", {
  weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
});

export function fechaTexto(fecha: string) {
  return diaLargo.format(fechaCivil(fecha));
}

export function calendario(fecha: string) {
  const f = fechaCivil(fecha);
  const anio = f.getUTCFullYear();
  const mes = f.getUTCMonth();
  const primerDia = new Date(Date.UTC(anio, mes, 1));
  const cantidad = new Date(Date.UTC(anio, mes + 1, 0)).getUTCDate();
  const relleno = (primerDia.getUTCDay() + 6) % 7;
  return {
    titulo: mesLargo.format(f),
    anterior: mes === 0 && anio === 2000 ? null : new Date(Date.UTC(anio, mes - 1, 1)).toISOString().slice(0, 10),
    siguiente: mes === 11 && anio === 9999 ? null : new Date(Date.UTC(anio, mes + 1, 1)).toISOString().slice(0, 10),
    relleno,
    dias: Array.from({ length: cantidad }, (_, indice) => `${fecha.slice(0, 7)}-${String(indice + 1).padStart(2, "0")}`),
  };
}

export function modulosDelDia(modulos: Modulo[], fecha: string) {
  const diaIso = fechaCivil(fecha).getUTCDay() || 7;
  return modulos.filter(({ dias }) => dias.includes(diaIso));
}

export function horarioTexto(horario: Pick<Horario, "hora_inicio" | "hora_fin">) {
  return `${horario.hora_inicio.slice(0, 5)}–${horario.hora_fin.slice(0, 5)}`;
}

export function seSuperponen(a: Pick<Horario, "hora_inicio" | "hora_fin">, b: Pick<Horario, "hora_inicio" | "hora_fin">) {
  return a.hora_inicio.slice(0, 5) < b.hora_fin.slice(0, 5) && b.hora_inicio.slice(0, 5) < a.hora_fin.slice(0, 5);
}

export function estadoModulo(modulo: Modulo, reservas: Reserva[], fecha: string, hoy: string, horaActual: string) {
  const ocupadas = reservas.filter((r) => !r.cancelada_en && seSuperponen(modulo, r));
  if (ocupadas.some((r) => r.tipo === "institucional")) return "institucional";
  if (ocupadas.some((r) => r.tipo === "bloqueo")) return "bloqueo";
  if (ocupadas.length) return "ordinaria";
  if (fecha < hoy || (fecha === hoy && modulo.hora_inicio.slice(0, 5) <= horaActual)) return "transcurrido";
  return "disponible";
}

export function rutIntegrante(rut: string) {
  return normalizarRut(rut.replaceAll(".", ""));
}
