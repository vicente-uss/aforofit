import { describe, expect, it } from "vitest";
import { armarItems, hoyEnChile, vigencia } from "./formulario";

const stock = [{ id: 1, nombre: "Balón", disponible: 2 }, { id: 2, nombre: "Paleta", disponible: 1 }];
describe("solicitud de implementos", () => {
  it("incluye varios implementos y respeta las cantidades", () => {
    expect(armarItems(stock, { 1: "2", 2: "1" })).toEqual([
      { implemento_id: 1, cantidad: 2 }, { implemento_id: 2, cantidad: 1 },
    ]);
  });
  it.each(["", "0", "-1", "1.5", "3", "abc"])("rechaza una solicitud inválida (%s)", valor => {
    expect(armarItems(stock, { 1: valor })).toBeNull();
  });
});
describe("vigencia en Chile", () => {
  it("incluye el día de vencimiento", () => {
    expect(vigencia("2026-11-25", "2026-11-25")).toBe("vigente");
    expect(vigencia("2026-11-24", "2026-11-25")).toBe("vencido");
    expect(vigencia(null, "2026-11-25")).toBe("sinFecha");
  });
  it("usa el día de Santiago aunque UTC ya cambió de fecha", () => {
    expect(hoyEnChile(new Date("2026-11-26T01:00:00Z"))).toBe("2026-11-25");
  });
});
