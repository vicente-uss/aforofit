import { describe, expect, it } from "vitest";
import { leerProgresion, nuevaCarga, textoCarga, type ParametrosProgresion } from "./progresion";

// Valores iniciales de configuracion.progresion (005 y 011).
const INICIAL: ParametrosProgresion = {
  facil_kg: 2.5,
  justo_kg: 0,
  me_costo_porcentaje: -5,
  redondeo_kg: 2.5,
};

describe("nuevaCarga (regla 8, CA14)", () => {
  it("40 kg con fácil → 42,5 kg", () => {
    expect(nuevaCarga(40, "facil", INICIAL)).toBe(42.5);
  });
  it("40 kg con justo → 40 kg", () => {
    expect(nuevaCarga(40, "justo", INICIAL)).toBe(40);
  });
  it("40 kg con me costó → 37,5 kg", () => {
    expect(nuevaCarga(40, "me_costo", INICIAL)).toBe(37.5);
  });
  it("37 kg con me costó → 35,15 → 35 kg (redondeo a 2,5)", () => {
    expect(nuevaCarga(37, "me_costo", INICIAL)).toBe(35);
  });
  it("39 kg con me costó → 37,05 → 37,5 kg (al más cercano, no hacia abajo)", () => {
    expect(nuevaCarga(39, "me_costo", INICIAL)).toBe(37.5);
  });
  it("D25: me costó siempre baja al menos un paso (20, 25, 10, 2,5 y 0)", () => {
    expect(nuevaCarga(20, "me_costo", INICIAL)).toBe(17.5);
    expect(nuevaCarga(25, "me_costo", INICIAL)).toBe(22.5);
    expect(nuevaCarga(10, "me_costo", INICIAL)).toBe(7.5);
    expect(nuevaCarga(2.5, "me_costo", INICIAL)).toBe(0);
    expect(nuevaCarga(0, "me_costo", INICIAL)).toBe(0);
  });
  it("D25 no cambia fácil ni justo con cargas bajas", () => {
    expect(nuevaCarga(20, "facil", INICIAL)).toBe(22.5);
    expect(nuevaCarga(20, "justo", INICIAL)).toBe(20);
    expect(nuevaCarga(0, "justo", INICIAL)).toBe(0);
  });
  it("cardio (carga null) no cambia", () => {
    expect(nuevaCarga(null, "facil", INICIAL)).toBeNull();
    expect(nuevaCarga(null, "me_costo", INICIAL)).toBeNull();
  });
  it("nunca queda negativa", () => {
    expect(nuevaCarga(1, "me_costo", { ...INICIAL, me_costo_porcentaje: -100 })).toBe(0);
  });
  it("usa los parámetros configurados (facil_kg = 5)", () => {
    expect(nuevaCarga(40, "facil", { ...INICIAL, facil_kg: 5 })).toBe(45);
  });
});

describe("leerProgresion", () => {
  it("acepta el jsonb de configuracion", () => {
    expect(leerProgresion({ ...INICIAL })).toEqual(INICIAL);
  });
  it("falta un parámetro o es inválido: null", () => {
    expect(leerProgresion({ facil_kg: 2.5, justo_kg: 0, me_costo_porcentaje: -5 })).toBeNull();
    expect(leerProgresion({ ...INICIAL, redondeo_kg: 0 })).toBeNull();
    expect(leerProgresion({ ...INICIAL, facil_kg: "2.5" })).toBeNull();
    expect(leerProgresion(null)).toBeNull();
    expect(leerProgresion([])).toBeNull();
  });
});

describe("textoCarga", () => {
  it("usa coma decimal", () => {
    expect(textoCarga(42.5)).toBe("42,5 kg");
    expect(textoCarga(40)).toBe("40 kg");
  });
  it("cardio: sin carga", () => {
    expect(textoCarga(null)).toBe("sin carga");
  });
});
