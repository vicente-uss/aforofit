import { describe, expect, it } from "vitest";
import { estadoAforo } from "../../lib/aforo/estado";
import { esActivo, iniciales, segmentos, TEXTO_NIVEL, TRAZO_NIVEL } from "./nivel";

describe("colores por nivel", () => {
  it("usa el nivel que calcula estadoAforo con el umbral de la base", () => {
    expect(TRAZO_NIVEL[estadoAforo(10, 20, 0.8).etiqueta]).toBe("#16A34A");
    expect(TRAZO_NIVEL[estadoAforo(16, 20, 0.8).etiqueta]).toBe("#F59E0B");
    expect(TRAZO_NIVEL[estadoAforo(20, 20, 0.8).etiqueta]).toBe("#DC2626");
    // Con umbral 0,5 en la base, 10 de 20 ya es ámbar (no el 80 % fijo del prototipo).
    expect(TRAZO_NIVEL[estadoAforo(10, 20, 0.5).etiqueta]).toBe("#F59E0B");
  });
  it("texto con contraste suficiente sobre blanco", () => {
    expect(TEXTO_NIVEL.Disponible).toBe("text-green-700");
    expect(TEXTO_NIVEL["Casi lleno"]).toBe("text-amber-700");
  });
});

describe("iniciales", () => {
  it("nombre y primer apellido", () => {
    expect(iniciales("Antonia Fictia Rivas")).toBe("AF");
    expect(iniciales("zoe")).toBe("Z");
    expect(iniciales("  ")).toBe("?");
  });
});

describe("segmentos", () => {
  it("un segmento por persona hasta 40 de capacidad", () => {
    expect(segmentos(12, 20)).toEqual({ llenos: 12, total: 20 });
    expect(segmentos(25, 20)).toEqual({ llenos: 20, total: 20 });
    expect(segmentos(-1, 2)).toEqual({ llenos: 0, total: 2 });
  });
  it("sobre 40, o capacidad 0: barra continua", () => {
    expect(segmentos(30, 41)).toBeNull();
    expect(segmentos(0, 0)).toBeNull();
  });
});

describe("esActivo (menú lateral)", () => {
  it("Inicio solo en la raíz del rol", () => {
    expect(esActivo("/profesor", "/profesor", "/profesor")).toBe(true);
    expect(esActivo("/profesor/maquinas", "/profesor", "/profesor")).toBe(false);
  });
  it("las demás pantallas, también en sus subrutas", () => {
    expect(esActivo("/profesor/maquinas", "/profesor/maquinas", "/profesor")).toBe(true);
    expect(esActivo("/profesor/maquinas/2", "/profesor/maquinas", "/profesor")).toBe(true);
    expect(esActivo("/profesor/maquinasx", "/profesor/maquinas", "/profesor")).toBe(false);
  });
});
