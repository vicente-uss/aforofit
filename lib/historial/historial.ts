// Historial de visitas y préstamos (F-33, «consulta verificable» del flujo central).
// Funciones puras, sin React ni Supabase, probadas en historial.test.ts. Solo leen datos ya guardados.

export const ZONA = "America/Santiago";

export type TipoCierre = "abierta" | "normal" | "profesor" | "automatico";

export type VisitaHistorial = {
  id: string;
  entrada: string;
  salida: string | null;
  cierre_automatico: boolean;
  cerrada_por: string | null;
  nombre?: string; // solo en el historial del profesor
};

export type PrestamoHistorial = {
  id: string;
  alumno: string;
  implementos: string; // «Balón de fútbol × 1, Paleta × 2»
  entregado_en: string;
  devuelto_en: string | null;
  tne_devuelta: boolean;
};

export function estadoPrestamo(p: Pick<PrestamoHistorial, "devuelto_en" | "tne_devuelta">) {
  if (p.devuelto_en === null) return "implementos";
  return p.tne_devuelta ? "cerrado" : "tne";
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

// Supabase entrega una relación como objeto o como array, según cómo la detecte.
function primero(valor: unknown): Record<string, unknown> | null {
  const v = Array.isArray(valor) ? valor[0] : valor;
  return esObjeto(v) ? v : null;
}

// Cómo se cerró la visita: el automático (regla 6) y el manual del profesor (D21) no piden feedback.
export function tipoCierre(v: Pick<VisitaHistorial, "salida" | "cierre_automatico" | "cerrada_por">): TipoCierre {
  if (v.salida === null) return "abierta";
  if (v.cierre_automatico) return "automatico";
  if (v.cerrada_por !== null) return "profesor";
  return "normal";
}

// Minutos entre entrada y salida (o hasta `ahora` si sigue abierta). Nunca negativo.
export function duracionMinutos(v: Pick<VisitaHistorial, "entrada" | "salida">, ahora: Date): number {
  const fin = v.salida ? Date.parse(v.salida) : ahora.getTime();
  return Math.max(Math.floor((fin - Date.parse(v.entrada)) / 60000), 0);
}

// «45 min» o «1 h 05 min».
export function textoDuracion(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  return `${Math.floor(minutos / 60)} h ${String(minutos % 60).padStart(2, "0")} min`;
}

// Hora en 24 h y zona de Santiago: «09:05».
export function hora(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: ZONA,
  });
}

// Fecha en es-CL y zona de Santiago: «lunes 7 de diciembre».
export function fechaLarga(iso: string): string {
  const texto = new Date(iso).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: ZONA,
  });
  return texto.replace(",", "");
}

// Día del calendario de Santiago (AAAA-MM-DD).
const formatoDia = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA });

export function diaSantiago(fecha: Date): string {
  return formatoDia.format(fecha);
}

// Primer instante que pertenece a la fecha local, aunque el reloj se salte la medianoche.
function inicioDiaSantiago(dia: string): number {
  const referencia = Date.parse(dia + "T00:00:00Z");
  const margen = 12 * 60 * 60 * 1000;
  let antes = referencia - margen;
  let despues = referencia + margen;
  while (despues - antes > 1) {
    const medio = Math.floor((antes + despues) / 2);
    if (diaSantiago(new Date(medio)) < dia) antes = medio;
    else despues = medio;
  }
  return despues;
}

export function esDiaValido(dia: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dia)) return false;
  const [a, m, d] = dia.split("-").map(Number);
  const f = new Date(Date.UTC(a, m - 1, d));
  return f.getUTCFullYear() === a && f.getUTCMonth() === m - 1 && f.getUTCDate() === d;
}

// Rango [desde, hasta) en ISO UTC que cubre el día completo de Santiago, para filtrar en Supabase.
export function rangoDia(dia: string): { desde: string; hasta: string } {
  const [a, m, d] = dia.split("-").map(Number);
  const siguiente = new Date(Date.UTC(a, m - 1, d + 1)).toISOString().slice(0, 10);
  return {
    desde: new Date(inicioDiaSantiago(dia)).toISOString(),
    hasta: new Date(inicioDiaSantiago(siguiente)).toISOString(),
  };
}

export type ResumenDia = {
  total: number;
  abiertas: number;
  automaticos: number;
  manuales: number;
  promedioMinutos: number | null; // sin visitas cerradas con hora real: null
};

// Resumen del día para el profesor. El promedio usa solo las visitas con salida real (normal o
// cerrada por el profesor): el cierre automático registra una salida al cumplirse el plazo configurado (regla 6).
export function resumenDia(visitas: VisitaHistorial[], ahora: Date): ResumenDia {
  const tipos = visitas.map(tipoCierre);
  const conSalidaReal = visitas.filter((_, i) => tipos[i] === "normal" || tipos[i] === "profesor");
  const promedio =
    conSalidaReal.length === 0
      ? null
      : Math.round(conSalidaReal.reduce((suma, v) => suma + duracionMinutos(v, ahora), 0) / conSalidaReal.length);
  return {
    total: visitas.length,
    abiertas: tipos.filter((t) => t === "abierta").length,
    automaticos: tipos.filter((t) => t === "automatico").length,
    manuales: tipos.filter((t) => t === "profesor").length,
    promedioMinutos: promedio,
  };
}

// --- Validación de lo que llega de Supabase ------------------------------------------------

export function normalizarVisitas(data: unknown): VisitaHistorial[] {
  if (!Array.isArray(data)) return [];
  const visitas: VisitaHistorial[] = [];
  for (const f of data) {
    if (!esObjeto(f) || typeof f.id !== "string" || typeof f.entrada !== "string") continue;
    if (f.salida !== null && typeof f.salida !== "string") continue;
    if (typeof f.cierre_automatico !== "boolean") continue;
    const cerradaPor = f.cerrada_por ?? null;
    if (cerradaPor !== null && typeof cerradaPor !== "string") continue;
    const alumno = primero(f.alumnos);
    visitas.push({
      id: f.id,
      entrada: f.entrada,
      salida: f.salida as string | null,
      cierre_automatico: f.cierre_automatico,
      cerrada_por: cerradaPor as string | null,
      ...(alumno && typeof alumno.nombre === "string" ? { nombre: alumno.nombre } : {}),
    });
  }
  return visitas;
}

// Feedback por visita: { visita_id: valor }.
export function feedbackPorVisita(data: unknown): Record<string, string> {
  if (!Array.isArray(data)) return {};
  const mapa: Record<string, string> = {};
  for (const f of data) {
    if (esObjeto(f) && typeof f.visita_id === "string" && typeof f.valor === "string") mapa[f.visita_id] = f.valor;
  }
  return mapa;
}

// Préstamos con alumnos(nombre) y prestamo_items(cantidad, implementos(nombre)).
export function normalizarPrestamos(data: unknown): PrestamoHistorial[] {
  if (!Array.isArray(data)) return [];
  const prestamos: PrestamoHistorial[] = [];
  for (const f of data) {
    if (!esObjeto(f) || typeof f.id !== "string" || typeof f.entregado_en !== "string") continue;
    if (f.devuelto_en !== null && typeof f.devuelto_en !== "string") continue;
    const alumno = primero(f.alumnos);
    if (typeof f.tne_devuelta !== "boolean") continue;
    const items = Array.isArray(f.prestamo_items) ? f.prestamo_items : [];
    const implementos = items
      .map((it) => {
        if (!esObjeto(it) || !Number.isInteger(it.cantidad)) return null;
        const imp = primero(it.implementos);
        return imp && typeof imp.nombre === "string" ? `${imp.nombre} × ${it.cantidad}` : null;
      })
      .filter((t): t is string => t !== null)
      .sort((a, b) => a.localeCompare(b, "es-CL"));
    prestamos.push({
      id: f.id,
      alumno: alumno && typeof alumno.nombre === "string" ? alumno.nombre : "Alumno",
      implementos: implementos.join(", "),
      entregado_en: f.entregado_en,
      devuelto_en: f.devuelto_en as string | null,
      tne_devuelta: f.tne_devuelta,
    });
  }
  return prestamos.sort((a, b) => Date.parse(a.entregado_en) - Date.parse(b.entregado_en));
}
