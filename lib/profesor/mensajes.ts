// Textos de /profesor/maquinas y /profesor/adentro, y traducción de los errores de
// supabase/sql/012_mantencion_y_cierre_manual.sql. Funciones puras, probadas en mensajes.test.ts.

export const TEXTOS = {
  maquinasTitulo: "Estado de máquinas",
  maquinasDetalle:
    "Una máquina En mantención aparece con advertencia en las rutinas de los alumnos. No se reemplaza el ejercicio.",
  adentroTitulo: "Quiénes están adentro",
  adentroDetalle:
    "Si alguien se fue sin pasar su credencial, marca su salida aquí: se libera el cupo y se llama al siguiente turno.",
  adentroVacio: "No hay nadie adentro.",
  confirmar: "Confirmar",
  cancelar: "Cancelar",
  cerrarVisita: "Cerrar visita",
  sinConexion: "Sin conexión, reintentando…",
  lecturaFallida: "No se pudo leer la lista. Reintentando…",
} as const;

export type ErrorProfesor = { titulo: string; detalle: string };

const ERRORES: Record<string, ErrorProfesor> = {
  sin_permiso: {
    titulo: "Sin permiso",
    detalle: "Inicia sesión con una cuenta de profesor o administrador.",
  },
  maquina_no_encontrada: {
    titulo: "No encontramos esa máquina",
    detalle: "Puede que la hayan quitado del catálogo. La lista se actualizó.",
  },
  valor_invalido: {
    titulo: "Estado no válido",
    detalle: "Usa los botones de la pantalla para cambiar el estado.",
  },
  visita_no_encontrada: {
    titulo: "No encontramos esa visita",
    detalle: "La lista se actualizó.",
  },
  visita_ya_cerrada: {
    titulo: "Esa visita ya estaba cerrada",
    detalle: "El alumno ya marcó su salida o otro profesor la cerró. La lista se actualizó.",
  },
};

const SIN_CONEXION: ErrorProfesor = {
  titulo: "Sin conexión",
  detalle: "Revisa la conexión del computador e inténtalo de nuevo.",
};

// Traduce el error de supabase-js. Las funciones mandan el código en error.message.
export function textoErrorProfesor(error: { message?: string | null; code?: string | null }): ErrorProfesor {
  const codigo = error.message?.trim() ?? "";
  if (Object.hasOwn(ERRORES, codigo)) return ERRORES[codigo];
  if (error.code === "PGRST202") {
    return { titulo: "Falta la base de datos", detalle: "Avisa al equipo: la función no está instalada (012)." };
  }
  return SIN_CONEXION;
}
