import { describe, expect, it } from "vitest";
import { estadoAforo } from "./estado";

describe("estadoAforo", () => {
  it("bajo el umbral: Disponible", () => {
    expect(estadoAforo(12, 20, 0.8)).toEqual({ etiqueta: "Disponible", porcentaje: 60 });
  });
  it("desde el umbral: Casi lleno", () => {
    expect(estadoAforo(16, 20, 0.8)).toEqual({ etiqueta: "Casi lleno", porcentaje: 80 });
  });
  it("en la capacidad o sobre ella: Lleno", () => {
    expect(estadoAforo(20, 20, 0.8).etiqueta).toBe("Lleno");
    expect(estadoAforo(22, 20, 0.8)).toEqual({ etiqueta: "Lleno", porcentaje: 100 });
  });
  it("capacidad configurada en 2 (demo): el segundo llena", () => {
    expect(estadoAforo(1, 2, 0.8).etiqueta).toBe("Disponible");
    expect(estadoAforo(2, 2, 0.8).etiqueta).toBe("Lleno");
  });
  it("usa el umbral configurado", () => {
    expect(estadoAforo(12, 20, 0.5).etiqueta).toBe("Casi lleno");
    expect(estadoAforo(16, 20, 0.9).etiqueta).toBe("Disponible");
  });
  it("umbral ausente o inválido: usa el respaldo de 0,8", () => {
    expect(estadoAforo(16, 20, null).etiqueta).toBe("Casi lleno");
    expect(estadoAforo(15, 20, undefined).etiqueta).toBe("Disponible");
    expect(estadoAforo(15, 20, 0).etiqueta).toBe("Disponible");
    expect(estadoAforo(15, 20, 1.5).etiqueta).toBe("Disponible");
  });
});
