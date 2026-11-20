// Traduce la respuesta de la función `registrar_ingreso` de Supabase al mensaje que muestra el kiosco.
// Es una función pura para poder probar cada caso con Vitest (mensajes.test.ts).
//
// Contrato acordado con la base de datos (supabase/sql, función registrar_ingreso):
// { resultado, motivo, alumno: { id, nombre } | null, turno, ocupacion, capacidad }

export type ResultadoIngreso = {
  resultado: "entrada" | "salida" | "turno" | "rechazo";
  motivo: string | null;
  alumno: { id: string; nombre: string } | null;
  turno: number | null;
  ocupacion: number;
  capacidad: number;
};

export type TonoMensaje = "exito" | "info" | "espera" | "error";

export type MensajeKiosco = {
  tono: TonoMensaje;
  titulo: string;
  detalle: string;
  // true solo cuando la credencial no está vinculada: el kiosco ofrece vincularla (regla 1, CA02).
  ofrecerVincular: boolean;
};

// Textos de cada rechazo. Los tres primeros son los de los criterios CA02, CA04 y CA05.
const MOTIVOS: Record<string, string> = {
  credencial_no_registrada: "Credencial no registrada",
  certificado_no_vigente: "Certificado no vigente",
  fuera_de_horario: "Fuera del horario de ingreso",
  gimnasio_cerrado: "El gimnasio está cerrado hoy",
  fuera_de_periodo: "Fuera del período académico",
  sin_permiso: "Esta pantalla requiere la sesión de un profesor",
};

export function textoMotivo(motivo: string | null): string {
  if (!motivo) return "No se pudo registrar el ingreso";
  return MOTIVOS[motivo] ?? "No se pudo registrar el ingreso";
}

export function mensajeIngreso(respuesta: ResultadoIngreso): MensajeKiosco {
  const nombre = respuesta.alumno?.nombre ?? "";
  const aforo = `Aforo: ${respuesta.ocupacion} / ${respuesta.capacidad}`;

  switch (respuesta.resultado) {
    case "entrada":
      return {
        tono: "exito",
        titulo: nombre ? `Bienvenido/a, ${nombre}` : "Entrada registrada",
        detalle: aforo,
        ofrecerVincular: false,
      };
    case "salida":
      return {
        tono: "info",
        titulo: nombre ? `Hasta luego, ${nombre}` : "Salida registrada",
        detalle: aforo,
        ofrecerVincular: false,
      };
    case "turno":
      return {
        tono: "espera",
        titulo: respuesta.turno !== null ? `Gimnasio lleno · tu turno es el ${respuesta.turno}` : "Gimnasio lleno",
        detalle: "Vuelve a pasar tu credencial cuando la pantalla llame tu turno",
        ofrecerVincular: false,
      };
    case "rechazo":
    default:
      return {
        tono: "error",
        titulo: textoMotivo(respuesta.motivo),
        detalle: respuesta.motivo === "credencial_no_registrada" ? "Puedes vincularla a un alumno" : aforo,
        ofrecerVincular: respuesta.motivo === "credencial_no_registrada",
      };
  }
}
