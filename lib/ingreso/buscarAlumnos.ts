// Apoyo del buscador de alumnos del kiosco: funciones puras, probadas con Vitest.

// Escapa los comodines de LIKE y el `*`, que PostgREST trata como comodín en ilike.
export function patronContiene(texto: string): string {
  return `%${texto.replace(/[\\%_*]/g, "\\$&")}%`;
}

// Une los resultados de varias búsquedas sin duplicados y los ordena por nombre.
export function unirAlumnos<T extends { id: string; nombre: string }>(
  listas: T[][],
  limite: number,
): T[] {
  const porId = new Map<string, T>();
  for (const alumno of listas.flat()) porId.set(alumno.id, alumno);
  return [...porId.values()]
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    .slice(0, limite);
}
