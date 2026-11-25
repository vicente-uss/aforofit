import { describe, expect, it } from "vitest";
import {
  horaEntrada,
  nombreCorto,
  normalizarVisitasAbiertas,
  superaCierreAutomatico,
  textoConfirmarCierre,
  tiempoAdentro,
} from "./visitas";

describe("nombreCorto (estilo D22)", () => {
  it("nombre + apellido paterno + materno: inicial del paterno", () => {
    expect(nombreCorto("Antonia Fictia Rivas")).toBe("Antonia F.");
  });
  it("dos nombres y dos apellidos: inicial del paterno (penúltima palabra)", () => {
    expect(nombreCorto("María José Prueba Soto")).toBe("María P.");
  });
  it("nombre y un apellido", () => {
    expect(nombreCorto("Zoe fictia")).toBe("Zoe F.");
  });
  it("una palabra o vacío", () => {
    expect(nombreCorto("Zoe")).toBe("Zoe");
    expect(nombreCorto("   ")).toBe("Alumno");
  });
});

describe("textoConfirmarCierre", () => {
  it("pregunta con nombre e inicial", () => {
    expect(textoConfirmarCierre("Antonia Fictia Rivas")).toBe("¿Marcar la salida de Antonia F.?");
  });
});

describe("normalizarVisitasAbiertas", () => {
  it("acepta alumnos como objeto o array y ordena por entrada", () => {
    const r = normalizarVisitasAbiertas([
      { id: "b", entrada: "2026-12-07T13:10:00Z", salida: null, alumnos: [{ nombre: "Benjamín Prueba Soto" }] },
      { id: "a", entrada: "2026-12-07T13:00:00Z", salida: null, alumnos: { nombre: "Antonia Fictia Rivas" } },
    ]);
    expect(r.map((v) => v.id)).toEqual(["a", "b"]);
    expect(r[1].nombre).toBe("Benjamín Prueba Soto");
  });
  it("descarta visitas cerradas o incompletas; sin nombre usa «Alumno»", () => {
    expect(
      normalizarVisitasAbiertas([
        { id: "c", entrada: "x", salida: "y", alumnos: { nombre: "A" } },
        { id: 5, entrada: "x" },
        { id: "d", entrada: "2026-12-07T13:00:00Z", alumnos: null },
      ]),
    ).toEqual([{ id: "d", entrada: "2026-12-07T13:00:00Z", nombre: "Alumno" }]);
  });
});

describe("hora y tiempo adentro", () => {
  it("hora de entrada en Santiago", () => {
    // 13:05 UTC = 10:05 en Santiago (verano, UTC−3).
    expect(horaEntrada("2026-12-07T13:05:00Z")).toBe("10:05");
  });
  it("minutos y horas adentro, nunca negativo", () => {
    const entrada = "2026-12-07T13:00:00Z";
    expect(tiempoAdentro(entrada, new Date("2026-12-07T13:25:00Z"))).toBe("25 min");
    expect(tiempoAdentro(entrada, new Date("2026-12-07T14:05:00Z"))).toBe("1 h 05 min");
    expect(tiempoAdentro(entrada, new Date("2026-12-07T12:00:00Z"))).toBe("0 min");
  });
  it("marca las visitas que superaron el cierre automático (regla 6)", () => {
    const entrada = "2026-12-07T13:00:00Z";
    expect(superaCierreAutomatico(entrada, new Date("2026-12-07T15:59:00Z"), 3)).toBe(false);
    expect(superaCierreAutomatico(entrada, new Date("2026-12-07T16:00:00Z"), 3)).toBe(true);
  });
});
