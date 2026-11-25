import { describe, expect, it } from "vitest";
import { pausaLector } from "./pausaLector";

describe("pausa del lector", () => {
  it.each(["sin_foco", "oculta"] as const)("avisa por %s y espera la reactivación", (evento) => {
    const pausa = pausaLector(false, evento);
    expect(pausa).toBe(true);
    expect(pausaLector(pausa, "visible")).toBe(true);
    expect(pausaLector(pausa, "lector_reactivado")).toBe(false);
  });

  it("mantiene el lector listo al mostrar una pestaña que ya tenía foco", () => {
    expect(pausaLector(false, "visible")).toBe(false);
  });
});
