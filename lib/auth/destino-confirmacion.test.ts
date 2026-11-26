import { describe, expect, it } from "vitest";
import { destinoConfirmacion } from "./destino-confirmacion";

describe("destino después de confirmar el correo", () => {
  it.each([
    [null, "email", "/"],
    ["/", "recovery", "/"],
    [null, "recovery", "/auth/update-password"],
    ["/auth/update-password", "recovery", "/auth/update-password"],
  ])("resuelve %s con tipo %s", (ruta, tipo, destino) => {
    expect(destinoConfirmacion(ruta, tipo)).toBe(destino);
  });

  it.each(["https://example.invalid", "//example.invalid", "/\\example.invalid",
    "/%2fexample.invalid", "%252f%252fexample.invalid", "/auth/update-password?next=otro",
    "/auth/update-password#otro", "/admin", "/\texample.invalid"])(
    "usa el inicio para %j", (ruta) => expect(destinoConfirmacion(ruta, "email")).toBe("/"),
  );
});
