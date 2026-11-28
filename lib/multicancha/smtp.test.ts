import { afterEach, describe, expect, it, vi } from "vitest";
import { configuracionSmtp, enviarConfirmacionSmtp } from "./smtp";

const { crear, enviar } = vi.hoisted(() => ({ crear: vi.fn(), enviar: vi.fn() }));
vi.mock("nodemailer", () => ({ default: { createTransport: crear } }));
const adjunto = { nombre: "reglamento-provisional.pdf", mime: "application/pdf", contenido: Buffer.from("PDF ficticio QA") };
const config = { user: "demo@example.test", pass: "fixture", autorizados: new Set(["destino@example.test"]) };

afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllEnvs();
});

describe("Confirmación por Gmail", () => {
  it("autoriza el buzón remitente y las direcciones configuradas explícitamente", () => {
    vi.stubEnv("SMTP_USER", "demo@example.test");
    vi.stubEnv("SMTP_PASS", "fixture");
    vi.stubEnv("SMTP_DESTINATARIOS_AUTORIZADOS", " destino@example.test, dirección inválida");
    expect(configuracionSmtp()?.autorizados).toEqual(new Set(["demo@example.test", "destino@example.test"]));
  });
  it("requiere credenciales e impide iniciar SMTP con destinatarios ajenos a la demo", async () => {
    vi.stubEnv("SMTP_USER", "");
    expect(configuracionSmtp()).toBeNull();
    expect(await enviarConfirmacionSmtp(config, "otro@example.test", "Reserva", adjunto)).toBe(false);
    expect(crear).not.toHaveBeenCalled();
  });
  it("usa puerto 465 con TLS y adjunta los bytes antes de confirmar la aceptación", async () => {
    crear.mockReturnValue({ sendMail: enviar });
    enviar.mockResolvedValue({ accepted: ["destino@example.test"] });
    expect(await enviarConfirmacionSmtp(config, "destino@example.test", "Reserva", adjunto)).toBe(true);
    expect(crear).toHaveBeenCalledWith(expect.objectContaining({ host: "smtp.gmail.com", port: 465, secure: true }));
    expect(enviar).toHaveBeenCalledWith(expect.objectContaining({
      to: "destino@example.test", attachments: [{ filename: adjunto.nombre, contentType: adjunto.mime, content: adjunto.contenido }],
    }));
  });
  it("rechaza respuestas sin aceptación y propaga errores del proveedor sin confirmar", async () => {
    crear.mockReturnValue({ sendMail: enviar });
    enviar.mockResolvedValueOnce({ accepted: [] }).mockRejectedValueOnce(new Error("Conexión interrumpida"));
    await expect(enviarConfirmacionSmtp(config, "destino@example.test", "Reserva", adjunto)).resolves.toBe(false);
    await expect(enviarConfirmacionSmtp(config, "destino@example.test", "Reserva", adjunto)).rejects.toThrow("Conexión interrumpida");
  });
});
