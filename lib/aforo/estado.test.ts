import { describe, expect, it } from "vitest";
import { estadoAforo } from "./estado";

describe("estadoAforo", () => {
  it("bajo el 80 %: Disponible", () => {
    expect(estadoAforo(12, 20)).toEqual({ etiqueta: "Disponible", porcentaje: 60 });
  });
  it("desde el 80 %: Casi lleno", () => {
    expect(estadoAforo(16, 20)).toEqual({ etiqueta: "Casi lleno", porcentaje: 80 });
  });
  it("en la capacidad o sobre ella: Lleno", () => {
    expect(estadoAforo(20, 20).etiqueta).toBe("Lleno");
    expect(estadoAforo(22, 20)).toEqual({ etiqueta: "Lleno", porcentaje: 100 });
  });
  it("capacidad configurada en 2 (demo): el segundo llena", () => {
    expect(estadoAforo(1, 2).etiqueta).toBe("Disponible");
    expect(estadoAforo(2, 2).etiqueta).toBe("Lleno");
  });
});
