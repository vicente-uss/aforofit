import { describe, expect, it } from "vitest";
import { normalizarRut } from "./rut";

describe("RUT de inscripción y acceso", () => {
  it.each([
    ["1000000-9", "1000000-9"],
    [" 1000005-k ", "1000005-K"],
    ["14-0", "14-0"],
    ["6-K", "6-K"],
    ["1000000-1", null],
    ["1.000.000-9", null],
    ["10000009", null],
    ["01000000-9", null],
    ["00.000.001-F", null],
    ["00000000-0", null],
    ["1000000–9", null],
    ["", null],
  ])("normaliza %j", (entrada, esperado) => {
    expect(normalizarRut(entrada)).toBe(esperado);
  });
});
