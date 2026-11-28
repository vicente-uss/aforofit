import { describe, expect, it } from "vitest";
import { borradorCorreo, confirmacionReserva } from "./correo";

const reserva = { fecha: "2026-12-07", hora_inicio: "08:00", hora_fin: "09:20", responsable: "Sofía Demo" };

describe("Borrador de confirmación", () => {
  it("incluye horario local y evita afirmar que hay un reglamento cuando falta", () => {
    const mensaje = confirmacionReserva(reserva, false);
    expect(mensaje).toContain("08:00–09:20 (hora de Santiago)");
    expect(mensaje).toContain("Hola, Sofía Demo:");
    expect(mensaje).not.toContain("Adjuntamos");
  });
  it("genera un EML sin adjunto listo para envío manual", () => {
    const mensaje = confirmacionReserva(reserva, false);
    const archivo = borradorCorreo("sofia@example.test", mensaje);
    const [cabecera, texto] = archivo.split("\r\n\r\n");
    expect(cabecera).toContain("To: sofia@example.test");
    expect(cabecera).toContain("X-Unsent: 1");
    expect(cabecera).not.toContain("multipart");
    expect(Buffer.from(texto, "base64").toString("utf8")).toBe(mensaje);
  });
  it("incluye exactamente el archivo provisto y declara el adjunto en el cuerpo", () => {
    const datos = Buffer.from([0, 255, 10, 201]);
    const archivo = borradorCorreo("sofia@example.test", confirmacionReserva(reserva, true),
      { nombre: "reglamento.pdf", mime: "application/pdf", contenido: datos });
    expect(archivo).toContain('Content-Disposition: attachment; filename="reglamento.pdf"');
    expect(archivo).toContain(datos.toString("base64"));
    expect(confirmacionReserva(reserva, true)).toContain("Adjuntamos el reglamento oficial");
  });
});
