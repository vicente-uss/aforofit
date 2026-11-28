import { fechaTexto, horarioTexto, type Horario } from "./agenda";

export const ASUNTO_CONFIRMACION = "Confirmación de reserva de multicancha";

export function confirmacionReserva(reserva: Horario & { responsable: string }, conReglamento: boolean, provisional = false) {
  return [
    `Hola, ${reserva.responsable}:`,
    "",
    "Tu reserva de la multicancha USS Bellavista está confirmada.",
    `${fechaTexto(reserva.fecha)} · ${horarioTexto(reserva)} (hora de Santiago).`,
    "Si tienes tu cuenta vinculada, puedes completar la nómina de tu equipo en Mis reservas.",
    ...(conReglamento ? [provisional
      ? "Adjuntamos el reglamento provisional de la multicancha para la demostración del prototipo."
      : "Adjuntamos el reglamento oficial de la multicancha."] : []),
    "",
    "Saludos,",
    "Equipo del gimnasio",
  ].join("\r\n");
}

function base64(bloque: string | Buffer) {
  const texto = (typeof bloque === "string" ? Buffer.from(bloque, "utf8") : bloque).toString("base64");
  return texto.match(/.{1,76}/g)?.join("\r\n") ?? "";
}

export function borradorCorreo(
  destinatario: string,
  cuerpo: string,
  adjunto?: { nombre: string; mime: string; contenido: Buffer },
) {
  const bordes = `aforofit-${crypto.randomUUID()}`;
  const cabecera = [
    `To: ${destinatario}`,
    "Subject: =?UTF-8?B?" + base64(ASUNTO_CONFIRMACION) + "?=",
    "MIME-Version: 1.0",
    "X-Unsent: 1",
  ];
  const texto = ["Content-Type: text/plain; charset=UTF-8", "Content-Transfer-Encoding: base64", "", base64(cuerpo)];
  if (!adjunto) return [...cabecera, ...texto, ""].join("\r\n");
  return [
    ...cabecera,
    `Content-Type: multipart/mixed; boundary="${bordes}"`,
    "",
    `--${bordes}`,
    ...texto,
    `--${bordes}`,
    `Content-Type: ${adjunto.mime}; name="${adjunto.nombre}"`,
    "Content-Transfer-Encoding: base64",
    `Content-Disposition: attachment; filename="${adjunto.nombre}"`,
    "",
    base64(adjunto.contenido),
    `--${bordes}--`,
    "",
  ].join("\r\n");
}
