// Configuración mínima del admin (F-09, D24, RNF08). Funciones puras, probadas en configuracion.test.ts.
// La base valida lo mismo en actualizar_configuracion (supabase/sql/014_vigencia_y_configuracion.sql);
// esta copia sirve para avisar en el formulario antes de enviar.

export const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] as const;
export type Dia = (typeof DIAS)[number];

export const ETIQUETA_DIA: Record<Dia, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

// Rangos de D24 (los mismos check de 014).
export const CAPACIDAD_MIN = 1;
export const CAPACIDAD_MAX = 100;
export const CIERRE_MIN_HORAS = 1;
export const CIERRE_MAX_HORAS = 12;

export type FranjaFormulario = { abierto: boolean; apertura: string; cierre: string; ultimo_ingreso: string };

// Lo que edita el formulario: textos tal como los escribe el admin.
export type FormularioConfiguracion = {
  capacidad: string;
  cierre_automatico_horas: string;
  horario: Record<Dia, FranjaFormulario>;
};

export type FranjaGuardada = { apertura: string; cierre: string; ultimo_ingreso: string } | null;
export type HorarioGuardado = Record<Dia, FranjaGuardada>;

export type Errores = Partial<Record<"capacidad" | "cierre_automatico_horas" | Dia, string>>;

export type ResultadoValidacion =
  | { ok: true; capacidad: number; cierre_automatico_horas: number; horario: HorarioGuardado }
  | { ok: false; errores: Errores };

const HORA = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
// Horas por defecto al abrir un día que estaba cerrado (las del gimnasio de lunes a viernes).
const FRANJA_POR_DEFECTO = { apertura: "08:00", cierre: "22:00", ultimo_ingreso: "21:00" };

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function hora(valor: unknown, respaldo: string): string {
  return typeof valor === "string" && HORA.test(valor) ? valor : respaldo;
}

// Convierte la fila de configuracion en el estado del formulario. Un día sin datos queda cerrado.
// Si falta «cierre» (base antes de 014), se propone una hora después del último ingreso.
export function aFormulario(fila: unknown): FormularioConfiguracion | null {
  if (!esObjeto(fila) || !Number.isInteger(fila.capacidad) || !Number.isInteger(fila.cierre_automatico_horas)) {
    return null;
  }
  const horario = esObjeto(fila.horario) ? fila.horario : {};
  const franjas = {} as Record<Dia, FranjaFormulario>;
  for (const dia of DIAS) {
    const f = horario[dia];
    if (!esObjeto(f)) {
      franjas[dia] = { abierto: false, ...FRANJA_POR_DEFECTO };
      continue;
    }
    const ultimo = hora(f.ultimo_ingreso, FRANJA_POR_DEFECTO.ultimo_ingreso);
    franjas[dia] = {
      abierto: true,
      apertura: hora(f.apertura, FRANJA_POR_DEFECTO.apertura),
      ultimo_ingreso: ultimo,
      cierre: hora(f.cierre, sumarUnaHora(ultimo)),
    };
  }
  return {
    capacidad: String(fila.capacidad),
    cierre_automatico_horas: String(fila.cierre_automatico_horas),
    horario: franjas,
  };
}

// «21:00» → «22:00»; nunca pasa de «23:59».
export function sumarUnaHora(valor: string): string {
  const [h, m] = valor.split(":").map(Number);
  if (h >= 23) return "23:59";
  return `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Entero dentro del rango, escrito solo con dígitos («20», no «20.5» ni «2e1»).
function enteroEnRango(texto: string, min: number, max: number): number | null {
  if (!/^\d+$/.test(texto.trim())) return null;
  const n = Number(texto.trim());
  return n >= min && n <= max ? n : null;
}

export function validarConfiguracion(form: FormularioConfiguracion): ResultadoValidacion {
  const errores: Errores = {};

  const capacidad = enteroEnRango(form.capacidad, CAPACIDAD_MIN, CAPACIDAD_MAX);
  if (capacidad === null) errores.capacidad = `Escribe un número entero entre ${CAPACIDAD_MIN} y ${CAPACIDAD_MAX}.`;

  const cierre = enteroEnRango(form.cierre_automatico_horas, CIERRE_MIN_HORAS, CIERRE_MAX_HORAS);
  if (cierre === null) {
    errores.cierre_automatico_horas = `Escribe un número entero de horas entre ${CIERRE_MIN_HORAS} y ${CIERRE_MAX_HORAS}.`;
  }

  const horario = {} as HorarioGuardado;
  for (const dia of DIAS) {
    const f = form.horario[dia];
    if (!f.abierto) {
      horario[dia] = null;
      continue;
    }
    if (![f.apertura, f.cierre, f.ultimo_ingreso].every((h) => HORA.test(h))) {
      errores[dia] = "Completa las tres horas en formato HH:MM.";
      continue;
    }
    // Las horas HH:MM se pueden comparar como texto.
    if (!(f.apertura < f.ultimo_ingreso && f.ultimo_ingreso <= f.cierre)) {
      errores[dia] = "Debe cumplirse: apertura antes del último ingreso, y último ingreso hasta el cierre.";
      continue;
    }
    horario[dia] = { apertura: f.apertura, cierre: f.cierre, ultimo_ingreso: f.ultimo_ingreso };
  }

  if (Object.keys(errores).length > 0) return { ok: false, errores };
  return { ok: true, capacidad: capacidad!, cierre_automatico_horas: cierre!, horario };
}

// Errores de actualizar_configuracion (014), en palabras.
const ERRORES: Record<string, { titulo: string; detalle: string }> = {
  sin_permiso: { titulo: "Sin permiso", detalle: "Solo una cuenta de administrador cambia la configuración." },
  capacidad_invalida: { titulo: "Capacidad no válida", detalle: "Debe estar entre 1 y 100 personas." },
  cierre_invalido: { titulo: "Cierre automático no válido", detalle: "Debe estar entre 1 y 12 horas." },
  horario_invalido: { titulo: "Horario no válido", detalle: "Revisa las horas de cada día." },
};

export function textoErrorConfiguracion(error: {
  message?: string | null;
  details?: string | null;
  code?: string | null;
}): { titulo: string; detalle: string } {
  const codigo = error.message?.trim() ?? "";
  if (Object.hasOwn(ERRORES, codigo)) {
    // El detalle de la base dice qué día falla («El lunes debe cumplir…»): se muestra si viene.
    return { titulo: ERRORES[codigo].titulo, detalle: error.details?.trim() || ERRORES[codigo].detalle };
  }
  if (error.code === "PGRST202") {
    return { titulo: "Falta la base de datos", detalle: "Avisa al equipo: la función no está instalada (014)." };
  }
  return { titulo: "Sin conexión", detalle: "Revisa la conexión e inténtalo de nuevo." };
}
