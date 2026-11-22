import { afterEach, describe, expect, it, vi } from "vitest";
import { normalizarTurnos } from "./turnos";

const fila = { numero: 3, estado: "esperando", creado_en: "2026-11-24T12:00:00Z" };

afterEach(() => {
  vi.restoreAllMocks();
});

describe("normalizarTurnos", () => {
  it("acepta alumnos como objeto", () => {
    const [turno] = normalizarTurnos([{ ...fila, alumnos: { nombre: "Camila Rojas" } }]);
    expect(turno.alumnos).toEqual({ nombre: "Camila Rojas" });
  });

  it("acepta alumnos como array", () => {
    const [turno] = normalizarTurnos([{ ...fila, alumnos: [{ nombre: "Camila Rojas" }] }]);
    expect(turno.alumnos).toEqual({ nombre: "Camila Rojas" });
  });

  it("alumno ausente o mal formado: queda en null", () => {
    expect(normalizarTurnos([{ ...fila, alumnos: null }])[0].alumnos).toBeNull();
    expect(normalizarTurnos([{ ...fila, alumnos: [] }])[0].alumnos).toBeNull();
    expect(normalizarTurnos([{ ...fila, alumnos: { nombre: 5 } }])[0].alumnos).toBeNull();
  });

  it("descarta filas inválidas", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(normalizarTurnos([{ ...fila, numero: "3" }, { ...fila, estado: "usado" }, null])).toEqual([]);
  });

  it("si no recibe un array devuelve una lista vacía", () => {
    expect(normalizarTurnos(null)).toEqual([]);
    expect(normalizarTurnos({})).toEqual([]);
  });
});
