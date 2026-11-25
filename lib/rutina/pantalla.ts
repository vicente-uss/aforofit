// Lógica pura de la pantalla de rutina del alumno (/alumno). Sin React ni Supabase, para probarla con
// Vitest (pantalla.test.ts). Contrato con la base: supabase/sql/011_rutinas.sql.

export type Objetivo = "fuerza" | "hipertrofia" | "salud";
export type Nivel = "principiante" | "intermedio";

export const OBJETIVOS: readonly Objetivo[] = ["fuerza", "hipertrofia", "salud"];
export const NIVELES: readonly Nivel[] = ["principiante", "intermedio"];

// Fila de public.rutina_del_dia().
export type EjercicioDelDia = {
  rutina_id: string;
  origen: string;
  orden: number;
  ejercicio: string;
  maquina_id: number;
  maquina: string;
  foto_url: string | null;
  series: number;
  repeticiones: number | null;
  minutos: number | null;
  carga_kg: number | null;
  nota_ajuste: string | null;
  ajustes_maquina: string | null;
  estado_maquina: string;
  en_mantencion: boolean;
};

export type Visita = {
  id: string;
  entrada: string;
  salida: string | null;
  cierre_automatico: boolean;
  cerrada_por: string | null; // profesor que la cerró a mano (D21, 012); null en salidas normales
};

export type AlumnoPropio = {
  id: string;
  nombre: string;
  objetivo: Objetivo | null;
  nivel: Nivel | null;
};

// Pantallas posibles, en el orden en que se evalúan.
export type Pantalla =
  | "sin_alumno" // la cuenta no está ligada a un alumno
  | "elegir_objetivo" // B1: falta objetivo o nivel, o el alumno pidió cambiarlos
  | "sin_rutina" // CU04 1a: ofrecer generarla
  | "adentro" // D13: «Ya entraste» y la rutina del día
  | "esperando_feedback" // B4: salió hoy y no ha respondido
  | "feedback_enviado" // B4: «Tu próxima sesión»
  | "fuera"; // rutina del día, sin visita en curso

export type EstadoAlumno = {
  alumno: AlumnoPropio | null;
  hayRutina: boolean;
  ultimaVisita: Visita | null;
  feedbackUltimaVisita: boolean; // ya existe feedback para la última visita
  feedbackOmitido: boolean; // el alumno tocó «Ahora no» para la última visita
  cambiandoObjetivo: boolean;
  ahora: Date;
};

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

// Fecha del calendario de Santiago (AAAA-MM-DD), para comparar días sin depender de la zona del celular.
export function diaSantiago(fecha: Date): string {
  return fecha.toLocaleDateString("en-CA", { timeZone: "America/Santiago" });
}

// Cierre automático (regla 6) o manual del profesor (D21): no se pide feedback.
export function cerradaSinFeedback(visita: Visita): boolean {
  return visita.cierre_automatico || visita.cerrada_por !== null;
}

export function estaAdentro(visita: Visita | null): boolean {
  return visita !== null && visita.salida === null;
}

// El feedback se pide solo después de la salida, el mismo día y si la visita no se cerró sola
// (regla 6) ni la cerró un profesor a mano (D21): ninguno de esos cierres pide feedback.
// Una visita antigua no vuelve a preguntar.
export function salioHoy(visita: Visita | null, ahora: Date): boolean {
  if (visita === null || visita.salida === null) return false;
  return diaSantiago(new Date(visita.salida)) === diaSantiago(ahora);
}

export function pantallaAlumno(estado: EstadoAlumno): Pantalla {
  const { alumno, ultimaVisita } = estado;
  if (alumno === null) return "sin_alumno";
  if (alumno.objetivo === null || alumno.nivel === null || estado.cambiandoObjetivo) return "elegir_objetivo";
  if (!estado.hayRutina) return "sin_rutina";
  if (estaAdentro(ultimaVisita)) return "adentro";
  if (salioHoy(ultimaVisita, estado.ahora) && !cerradaSinFeedback(ultimaVisita!)) {
    if (estado.feedbackUltimaVisita) return "feedback_enviado";
    if (!estado.feedbackOmitido) return "esperando_feedback";
  }
  return "fuera";
}

// --- Validación de lo que llega de Supabase ------------------------------------------------

function numeroONulo(valor: unknown): number | null | undefined {
  if (valor === null) return null;
  // PostgREST entrega numeric como número, pero se acepta texto numérico por si acaso.
  const n = typeof valor === "string" ? Number(valor) : valor;
  return typeof n === "number" && Number.isFinite(n) ? n : undefined;
}

function textoONulo(valor: unknown): string | null | undefined {
  return valor === null || typeof valor === "string" ? valor : undefined;
}

// Descarta las filas que no cumplen el contrato y devuelve las válidas en orden.
export function normalizarEjercicios(data: unknown): EjercicioDelDia[] {
  if (!Array.isArray(data)) return [];
  const ejercicios: EjercicioDelDia[] = [];
  for (const f of data) {
    if (!esObjeto(f)) continue;
    const carga = numeroONulo(f.carga_kg);
    const repeticiones = numeroONulo(f.repeticiones);
    const minutos = numeroONulo(f.minutos);
    const foto = textoONulo(f.foto_url);
    const nota = textoONulo(f.nota_ajuste);
    const ajustes = textoONulo(f.ajustes_maquina);
    if (
      typeof f.rutina_id !== "string" ||
      typeof f.origen !== "string" ||
      !Number.isInteger(f.orden) ||
      typeof f.ejercicio !== "string" ||
      !Number.isInteger(f.maquina_id) ||
      typeof f.maquina !== "string" ||
      !Number.isInteger(f.series) ||
      typeof f.estado_maquina !== "string" ||
      typeof f.en_mantencion !== "boolean" ||
      carga === undefined ||
      repeticiones === undefined ||
      minutos === undefined ||
      foto === undefined ||
      nota === undefined ||
      ajustes === undefined
    ) {
      continue;
    }
    ejercicios.push({
      rutina_id: f.rutina_id,
      origen: f.origen,
      orden: f.orden as number,
      ejercicio: f.ejercicio,
      maquina_id: f.maquina_id as number,
      maquina: f.maquina,
      foto_url: foto,
      series: f.series as number,
      repeticiones,
      minutos,
      carga_kg: carga,
      nota_ajuste: nota,
      ajustes_maquina: ajustes,
      estado_maquina: f.estado_maquina,
      en_mantencion: f.en_mantencion,
    });
  }
  return ejercicios.sort((a, b) => a.orden - b.orden);
}

export function normalizarVisita(data: unknown): Visita | null {
  if (!esObjeto(data)) return null;
  const { id, entrada, salida, cierre_automatico } = data;
  // cerrada_por existe desde 012; si falta (base sin 012) se trata como null.
  const cerradaPor = data.cerrada_por ?? null;
  if (cerradaPor !== null && typeof cerradaPor !== "string") return null;
  if (typeof id !== "string" || typeof entrada !== "string") return null;
  if (salida !== null && typeof salida !== "string") return null;
  if (typeof cierre_automatico !== "boolean") return null;
  return { id, entrada, salida, cierre_automatico, cerrada_por: cerradaPor };
}

export function normalizarAlumno(data: unknown): AlumnoPropio | null {
  if (!esObjeto(data) || typeof data.id !== "string" || typeof data.nombre !== "string") return null;
  const objetivo = OBJETIVOS.find((o) => o === data.objetivo) ?? null;
  const nivel = NIVELES.find((n) => n === data.nivel) ?? null;
  return { id: data.id, nombre: data.nombre, objetivo, nivel };
}

// --- Presentación ---------------------------------------------------------------------------

// «3 × 12» para fuerza; «5 min» para cardio.
export function textoVolumen(e: Pick<EjercicioDelDia, "series" | "repeticiones" | "minutos">): string {
  if (e.minutos !== null) return e.series > 1 ? `${e.series} × ${e.minutos} min` : `${e.minutos} min`;
  return `${e.series} × ${e.repeticiones ?? "?"}`;
}

// foto_url guarda la ruta dentro del bucket público «maquinas» (004). Si ya es una URL, se usa tal cual.
export function urlFotoMaquina(baseSupabase: string | undefined, foto: string | null): string | null {
  if (!foto) return null;
  if (/^https?:\/\//.test(foto)) return foto;
  if (!baseSupabase) return null;
  const base = baseSupabase.replace(/\/+$/, "");
  const ruta = foto.replace(/^\/+/, "").split("/").map(encodeURIComponent).join("/");
  return `${base}/storage/v1/object/public/maquinas/${ruta}`;
}

export type CambioCarga = {
  orden: number;
  ejercicio: string;
  antes: number | null;
  ahora: number | null;
  cambio: "sube" | "igual" | "baja" | "sin_carga" | "sin_dato";
};

// Cargas de la rutina antes de enviar el feedback, por orden del ejercicio.
export function cargasPorOrden(ejercicios: EjercicioDelDia[]): Record<number, number | null> {
  return Object.fromEntries(ejercicios.map((e) => [e.orden, e.carga_kg]));
}

// «Tu próxima sesión»: compara la carga anterior con la nueva que devolvió rutina_del_dia.
export function compararCargas(
  antes: Record<number, number | null> | null,
  despues: EjercicioDelDia[],
): CambioCarga[] {
  return despues.map((e) => {
    const previa = antes && Object.hasOwn(antes, e.orden) ? antes[e.orden] : undefined;
    let cambio: CambioCarga["cambio"];
    if (e.carga_kg === null) cambio = "sin_carga";
    else if (previa === undefined || previa === null) cambio = "sin_dato";
    else if (e.carga_kg > previa) cambio = "sube";
    else if (e.carga_kg < previa) cambio = "baja";
    else cambio = "igual";
    return { orden: e.orden, ejercicio: e.ejercicio, antes: previa ?? null, ahora: e.carga_kg, cambio };
  });
}
