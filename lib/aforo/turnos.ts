// Normaliza las filas de `turnos` que lee la lista de espera. Función pura, probada con Vitest.

export type Turno = {
  numero: number;
  estado: "esperando" | "llamado";
  creado_en: string;
  alumnos: { nombre: string } | null;
};

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

// Según la relación detectada, Supabase entrega `alumnos` como objeto o como array.
function normalizarAlumno(valor: unknown): Turno["alumnos"] {
  const alumno = Array.isArray(valor) ? valor[0] : valor;
  return esObjeto(alumno) && typeof alumno.nombre === "string" ? { nombre: alumno.nombre } : null;
}

// Descarta las filas que no tengan los campos esperados.
export function normalizarTurnos(data: unknown): Turno[] {
  if (!Array.isArray(data)) return [];
  const turnos: Turno[] = [];
  for (const fila of data) {
    if (
      esObjeto(fila) &&
      typeof fila.numero === "number" &&
      Number.isInteger(fila.numero) &&
      (fila.estado === "esperando" || fila.estado === "llamado") &&
      typeof fila.creado_en === "string"
    ) {
      turnos.push({
        numero: fila.numero,
        estado: fila.estado,
        creado_en: fila.creado_en,
        alumnos: normalizarAlumno(fila.alumnos),
      });
    } else {
      console.warn("Se descartó un turno con un formato inesperado.");
    }
  }
  return turnos;
}
