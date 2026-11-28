// Traduce las respuestas de las funciones de Supabase a lo que muestra el kiosco.
// Son funciones puras para poder probar cada caso con Vitest (mensajes.test.ts).
//
// Contrato con la base de datos: docs/contrato-flujo-ingreso.md

const RESULTADOS = ["entrada", "salida", "turno", "rechazo"] as const;

export type ResultadoIngreso = {
  resultado: (typeof RESULTADOS)[number];
  motivo: string | null;
  alumno: { id: string; nombre: string } | null;
  turno: number | null;
  ocupacion: number;
  capacidad: number;
  estado_certificado?: "pendiente" | "vencido";
};

export type RespuestaVinculacion = { ok: boolean; motivo: string | null };

export type TonoMensaje = "exito" | "info" | "espera" | "error";

// Tipo de resultado que muestra el historial, sin datos del alumno.
export type TipoLectura = "Entrada" | "Salida" | "Turno" | "Rechazo" | "Vinculación" | "Error";

export type MensajeKiosco = {
  tono: TonoMensaje;
  tipo: TipoLectura;
  titulo: string;
  detalle: string;
  // true solo cuando la credencial no está vinculada: el kiosco ofrece vincularla (regla 1, CA02).
  ofrecerVincular: boolean;
};

// Lista cerrada del contrato: motivos de registrar_ingreso y de vincular_credencial.
const MOTIVOS: Record<string, string> = {
  credencial_no_registrada: "Credencial no registrada", // CA02
  certificado_no_vigente: "Certificado no vigente", // CA04
  // «fuera_de_periodo» se quitó con D20 (014): registrar_ingreso ya no lo envía.
  fuera_de_horario: "Fuera del horario de ingreso", // CA05
  gimnasio_cerrado: "El gimnasio está cerrado hoy",
  sin_permiso: "Esta pantalla requiere la sesión de un profesor",
  credencial_de_otro_alumno: "La credencial ya pertenece a otro alumno", // CA03
  uid_invalido: "Formato de credencial inválido",
  tipo_invalido: "Elige TNE o TUI",
  alumno_no_encontrado: "Alumno no encontrado",
  rut_no_registrado: "RUT no registrado",
  rut_duplicado: "Más de una inscripción tiene ese RUT",
  rut_invalido: "RUT inválido",
  persona_no_encontrada: "Inscripción no encontrada",
  visita_ya_abierta: "La persona ya tiene una visita abierta",
  autorizacion_no_requerida: "La persona está habilitada para ingresar",
};

const TEXTO_GENERICO = "No se pudo registrar el ingreso";

export function textoMotivo(motivo: string | null): string {
  if (!motivo) return TEXTO_GENERICO;
  // Object.hasOwn evita que un motivo como "constructor" encuentre algo heredado.
  if (Object.hasOwn(MOTIVOS, motivo)) return MOTIVOS[motivo];
  console.warn(`Motivo desconocido recibido de la base de datos: ${motivo}`);
  return TEXTO_GENERICO;
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function esTextoONulo(valor: unknown): valor is string | null {
  return valor === null || typeof valor === "string";
}

// Valida la respuesta de registrar_ingreso. Si no cumple el contrato devuelve null.
// Un motivo desconocido no invalida la respuesta: lo informa textoMotivo.
export function interpretarRespuesta(data: unknown): ResultadoIngreso | null {
  if (!esObjeto(data)) return null;
  const { resultado, motivo, alumno, turno, ocupacion, capacidad, estado_certificado } = data;

  const resultadoValido = RESULTADOS.find((opcion) => opcion === resultado);
  if (!resultadoValido || !esTextoONulo(motivo)) return null;
  if (turno !== null && !Number.isInteger(turno)) return null;
  if (!Number.isInteger(ocupacion) || !Number.isInteger(capacidad)) return null;

  let alumnoValido: ResultadoIngreso["alumno"] = null;
  if (alumno !== null) {
    if (!esObjeto(alumno) || typeof alumno.id !== "string" || typeof alumno.nombre !== "string") {
      return null;
    }
    alumnoValido = { id: alumno.id, nombre: alumno.nombre };
  }

  return {
    resultado: resultadoValido,
    motivo,
    alumno: alumnoValido,
    turno: turno as number | null,
    ocupacion: ocupacion as number,
    capacidad: capacidad as number,
    ...(estado_certificado === "pendiente" || estado_certificado === "vencido" ? { estado_certificado } : {}),
  };
}

// Valida la respuesta de vincular_credencial. Si no cumple el contrato devuelve null.
export function interpretarVinculacion(data: unknown): RespuestaVinculacion | null {
  if (!esObjeto(data) || typeof data.ok !== "boolean" || !esTextoONulo(data.motivo)) return null;
  return { ok: data.ok, motivo: data.motivo };
}

// Mensaje cuando la respuesta llega, pero no tiene la forma del contrato.
export function mensajeRespuestaInvalida(): MensajeKiosco {
  return {
    tono: "error",
    tipo: "Error",
    titulo: "Respuesta inválida",
    detalle: "La base de datos respondió en un formato inesperado. Avisa al equipo.",
    ofrecerVincular: false,
  };
}

export function mensajeIngreso(respuesta: ResultadoIngreso): MensajeKiosco {
  const nombre = respuesta.alumno?.nombre ?? "";
  const aforo = `Aforo: ${respuesta.ocupacion} / ${respuesta.capacidad}`;

  switch (respuesta.resultado) {
    case "entrada":
      return {
        tono: "exito",
        tipo: "Entrada",
        titulo: nombre ? `Bienvenido/a, ${nombre}` : "Entrada registrada",
        detalle: aforo,
        ofrecerVincular: false,
      };
    case "salida":
      return {
        tono: "info",
        tipo: "Salida",
        titulo: nombre ? `Hasta luego, ${nombre}` : "Salida registrada",
        detalle: aforo,
        ofrecerVincular: false,
      };
    case "turno":
      return {
        tono: "espera",
        tipo: "Turno",
        titulo: respuesta.turno !== null ? `Gimnasio lleno · tu turno es el ${respuesta.turno}` : "Gimnasio lleno",
        detalle: "Vuelve a identificarte cuando la pantalla llame tu turno",
        ofrecerVincular: false,
      };
    case "rechazo":
    default:
      return {
        tono: "error",
        tipo: "Rechazo",
        titulo: respuesta.estado_certificado === "pendiente" ? "Certificado médico pendiente"
          : respuesta.estado_certificado === "vencido" ? "Certificado médico vencido" : textoMotivo(respuesta.motivo),
        detalle: respuesta.motivo === "credencial_no_registrada" ? "Puedes vincularla a un alumno" : aforo,
        ofrecerVincular: respuesta.motivo === "credencial_no_registrada",
      };
  }
}

// Distingue el error de Supabase por su código (punto 5 de la revisión).
export function textoErrorRpc(error: { code?: string | null }): { titulo: string; detalle: string } {
  if (error.code === "PGRST202") {
    return { titulo: "Falta la base de datos del ingreso", detalle: "La función aún no está instalada. Avisa al equipo." };
  }
  if (error.code === "42501" || error.code === "PGRST301") {
    return { titulo: "Sin permiso", detalle: "Inicia sesión con una cuenta de profesor o administrador." };
  }
  return { titulo: "Sin conexión", detalle: "Intenta de nuevo o usa el ingreso manual." };
}

export function mensajeErrorRpc(error: { code?: string | null }): MensajeKiosco {
  return { tono: "error", tipo: "Error", ...textoErrorRpc(error), ofrecerVincular: false };
}

// Muestra solo los 2 últimos bytes del UID (ej. ••:••:7F:2B).
export function enmascararUid(uid: string): string {
  const bytes = uid.split(":");
  return bytes.map((byte, i) => (i < bytes.length - 2 ? "••" : byte)).join(":");
}
