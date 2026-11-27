// Textos de la pantalla de rutina del alumno y traducción de los errores de las funciones de
// supabase/sql/011_rutinas.sql. Funciones puras, probadas en mensajes.test.ts.

import type { ValorFeedback } from "./progresion";
import type { Nivel, Objetivo } from "./pantalla";

export const ETIQUETA_OBJETIVO: Record<Objetivo, { titulo: string; detalle: string }> = {
  fuerza: { titulo: "Fuerza", detalle: "Pocas repeticiones con más peso" },
  hipertrofia: { titulo: "Hipertrofia", detalle: "Ganar masa muscular, 8 a 12 repeticiones" },
  salud: { titulo: "Salud", detalle: "Más cardio y cargas bajas" },
};

export const ETIQUETA_NIVEL: Record<Nivel, { titulo: string; detalle: string }> = {
  principiante: { titulo: "Principiante", detalle: "Estoy empezando o volviendo" },
  intermedio: { titulo: "Intermedio", detalle: "Entreno hace varios meses" },
};

export const ETIQUETA_FEEDBACK: Record<ValorFeedback, string> = {
  facil: "Fácil",
  justo: "Justo",
  me_costo: "Me costó",
};

// Qué le pasa a la carga con cada respuesta (regla 8 y D25), para explicarlo bajo los botones.
export const EFECTO_FEEDBACK: Record<ValorFeedback, string> = {
  facil: "Sube la carga",
  justo: "Se mantiene",
  me_costo: "Baja la carga",
};

// Pista corta bajo cada botón de feedback (prototipo de Figma Make).
export const PISTA_FEEDBACK: Record<ValorFeedback, string> = {
  facil: "Podría con más carga",
  justo: "La carga fue adecuada",
  me_costo: "Me costó completar las series",
};

export const TEXTOS = {
  sinAlumnoTitulo: "Tu cuenta no está ligada a un alumno",
  sinAlumnoDetalle: "Pide al profesor del gimnasio que la vincule. Mientras tanto no podemos mostrar tu rutina.",
  elegirTitulo: "¿Cuál es tu objetivo?",
  elegirDetalle: "Con tu objetivo y nivel armamos tu rutina con las máquinas del gimnasio.",
  cambiarAviso:
    "Al cambiar tu objetivo o nivel se genera una rutina nueva con las cargas iniciales. Tu rutina actual queda guardada en el historial.",
  sinRutinaTitulo: "Todavía no tienes rutina",
  sinRutinaDetalle: "La generamos con tu objetivo y nivel, solo con máquinas del gimnasio.",
  adentroTitulo: "Ya entraste",
  adentroDetalle: "Esta es tu rutina de hoy. Al salir, pasa tu credencial y cuéntanos cómo te fue.",
  fueraTitulo: "Tu rutina del día",
  fueraDetalle: "Cuando pases tu credencial en la entrada, aparecerá aquí sola.",
  feedbackTitulo: "¿Cómo estuvo tu entrenamiento de hoy?",
  feedbackDetalle: "Con tu respuesta ajustamos las cargas de tu próxima sesión.",
  proximaTitulo: "Tu próxima sesión",
  proximaDetalle: "Así quedaron tus cargas para la próxima vez.",
  mantencionTitulo: "Máquina en mantención · no disponible hoy.",
  mantencionDetalle: "Consulta al profesor encargado antes de realizar este ejercicio.",
  sinConexion: "Sin conexión, reintentando…",
} as const;

export type ErrorRutina = { titulo: string; detalle: string };

// Errores conocidos: las funciones los lanzan con el código en error.message (011_rutinas.sql).
const ERRORES: Record<string, ErrorRutina> = {
  modalidad_deshabilitada: { titulo: "Modalidad deshabilitada", detalle: "Elige una modalidad habilitada." },
  rutina_modificada: { titulo: "La rutina ya cambió", detalle: "Abre la versión actual para editarla." },
  rutina_invalida: { titulo: "Rutina incompleta", detalle: "Ingresa un nombre y agrega entre 1 y 50 ejercicios." },
  ejercicios_invalidos: { titulo: "Revisa los ejercicios", detalle: "Verifica los nombres, las máquinas, la carga, las series y las repeticiones o minutos." },
  visita_abierta: { titulo: "Tu visita sigue abierta", detalle: "Pasa tu credencial al salir para responder." },
  feedback_ya_registrado: {
    titulo: "Ya respondiste por esta visita",
    detalle: "Tu respuesta quedó guardada. Vuelve a responder después de tu próxima visita.",
  },
  visita_cierre_automatico: {
    titulo: "Tu visita se cerró sola",
    detalle: "No marcaste la salida y la visita se cerró automáticamente, así que no pedimos feedback.",
  },
  visita_cierre_manual: {
    titulo: "El profesor cerró tu visita",
    detalle: "Tu salida la marcó el profesor, así que esta vez no pedimos feedback.",
  },
  sin_visita: {
    titulo: "No encontramos tu visita",
    detalle: "Pasa tu credencial al entrar y al salir del gimnasio para poder responder.",
  },
  sin_permiso: {
    titulo: "Sin permiso",
    detalle: "Esta acción es solo para tu propia rutina. Cierra sesión y vuelve a entrar.",
  },
  valor_invalido: {
    titulo: "Opción no válida",
    detalle: "Elige una de las opciones que aparecen en pantalla.",
  },
  sin_objetivo_nivel: {
    titulo: "Falta tu objetivo y nivel",
    detalle: "Elige tu objetivo y nivel para generar tu rutina.",
  },
  sin_plantilla: {
    titulo: "No hay rutina para esa combinación",
    detalle: "Avisa al profesor del gimnasio.",
  },
  rutina_inactiva: {
    titulo: "Tu rutina cambió",
    detalle: "Recarga la página para ver tu rutina actual.",
  },
  rutina_no_encontrada: {
    titulo: "No encontramos tu rutina",
    detalle: "Recarga la página para ver tu rutina actual.",
  },
};

const SIN_CONEXION: ErrorRutina = {
  titulo: "Sin conexión",
  detalle: "Revisa tu internet e inténtalo de nuevo.",
};

// Traduce el error de supabase-js. Lo que no se reconoce se trata como falta de conexión.
export function textoErrorRutina(error: { message?: string | null; code?: string | null }): ErrorRutina {
  const codigo = error.message?.trim() ?? "";
  if (Object.hasOwn(ERRORES, codigo)) return ERRORES[codigo];
  if (error.code === "PGRST202") {
    return { titulo: "Falta la base de datos de la rutina", detalle: "Avisa al equipo: la función no está instalada." };
  }
  return SIN_CONEXION;
}

export function esErrorConocido(error: { message?: string | null }, codigo: string): boolean {
  return (error.message?.trim() ?? "") === codigo;
}

// «Fuerza · principiante»
export function textoObjetivoNivel(objetivo: Objetivo | null, nivel: Nivel | null): string {
  if (!objetivo || !nivel) return "Sin objetivo";
  return `${ETIQUETA_OBJETIVO[objetivo].titulo} · ${ETIQUETA_NIVEL[nivel].titulo.toLowerCase()}`;
}
