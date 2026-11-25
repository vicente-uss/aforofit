// Visitas abiertas para /profesor/adentro (F-28, D21). Funciones puras, probadas en visitas.test.ts.

export type VisitaAbierta = {
  id: string;
  entrada: string;
  nombre: string; // nombre completo: esta pantalla es solo para el profesor
};

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

// Supabase entrega la relación `alumnos` como objeto o como array, según cómo la detecte.
function nombreDeAlumno(valor: unknown): string | null {
  const alumno = Array.isArray(valor) ? valor[0] : valor;
  return esObjeto(alumno) && typeof alumno.nombre === "string" ? alumno.nombre : null;
}

// Filas de visitas con salida null y alumnos(nombre). Ordena por entrada, de la más antigua a la más nueva.
export function normalizarVisitasAbiertas(data: unknown): VisitaAbierta[] {
  if (!Array.isArray(data)) return [];
  const visitas: VisitaAbierta[] = [];
  for (const f of data) {
    if (!esObjeto(f) || typeof f.id !== "string" || typeof f.entrada !== "string") continue;
    if (f.salida !== undefined && f.salida !== null) continue; // solo abiertas
    visitas.push({ id: f.id, entrada: f.entrada, nombre: nombreDeAlumno(f.alumnos) ?? "Alumno" });
  }
  return visitas.sort((a, b) => Date.parse(a.entrada) - Date.parse(b.entrada));
}

// Nombre e inicial del apellido paterno (estilo de D22): «Antonia Fictia Rivas» → «Antonia F.».
// Con tres palabras o más, el apellido paterno es la penúltima; con dos, la última.
export function nombreCorto(nombre: string): string {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return "Alumno";
  if (palabras.length === 1) return palabras[0];
  const apellido = palabras.length >= 3 ? palabras[palabras.length - 2] : palabras[1];
  return `${palabras[0]} ${apellido.charAt(0).toUpperCase()}.`;
}

export function textoConfirmarCierre(nombre: string): string {
  return `¿Marcar la salida de ${nombreCorto(nombre)}?`;
}

// Hora de entrada en Santiago, «10:05».
export function horaEntrada(entrada: string): string {
  return new Date(entrada).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23", // 24 horas: sin esto, algunos navegadores muestran «10:05 a. m.»
    timeZone: "America/Santiago",
  });
}

// «25 min» o «1 h 05 min». Nunca negativo.
export function tiempoAdentro(entrada: string, ahora: Date): string {
  const minutos = Math.max(Math.floor((ahora.getTime() - Date.parse(entrada)) / 60000), 0);
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  return `${horas} h ${String(minutos % 60).padStart(2, "0")} min`;
}

// true si la visita ya superó el cierre automático (regla 6) y solo falta que alguien pase una tarjeta
// para que se cierre sola. Sirve para resaltarla en la lista.
export function superaCierreAutomatico(entrada: string, ahora: Date, horas: number): boolean {
  return ahora.getTime() - Date.parse(entrada) >= horas * 3600000;
}
