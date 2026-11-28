import nodemailer from "nodemailer";
import { CORREO } from "./agenda";
import { ASUNTO_CONFIRMACION } from "./correo";

// Este módulo solo se importa desde acciones de servidor.
export function configuracionSmtp() {
  const user = process.env.SMTP_USER?.trim().toLowerCase();
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !CORREO.test(user) || !pass) return null;
  const autorizados = (process.env.SMTP_DESTINATARIOS_AUTORIZADOS ?? "")
    .split(",").map((correo) => correo.trim().toLowerCase()).filter((correo) => CORREO.test(correo));
  return { user, pass, autorizados: new Set([user, ...autorizados]) };
}

export async function enviarConfirmacionSmtp(
  config: NonNullable<ReturnType<typeof configuracionSmtp>>,
  destinatario: string, texto: string, adjunto: { nombre: string; mime: string; contenido: Buffer },
) {
  if (!config.autorizados.has(destinatario)) return false;
  const transporte = nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000,
  });
  const respuesta = await transporte.sendMail({
    from: config.user,
    to: destinatario,
    subject: ASUNTO_CONFIRMACION,
    text: texto,
    attachments: [{ filename: adjunto.nombre, contentType: adjunto.mime, content: adjunto.contenido }],
  });
  return respuesta.accepted.some((correo) => String(correo).toLowerCase() === destinatario);
}
