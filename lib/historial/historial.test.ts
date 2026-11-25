import { describe, expect, it } from "vitest";
import {
  diaSantiago,
  duracionMinutos,
  esDiaValido,
  fechaLarga,
  feedbackPorVisita,
  hora,
  normalizarPrestamos,
  normalizarVisitas,
  rangoDia,
  resumenDia,
  textoDuracion,
  tipoCierre,
  type VisitaHistorial,
} from "./historial";
import { ETIQUETA_CIERRE, plural } from "./mensajes";

const AHORA = new Date("2026-12-07T15:00:00Z"); // lunes 7 de diciembre, 12:00 en Santiago

function v(parcial: Partial<VisitaHistorial>): VisitaHistorial {
  return { id: "v", entrada: "2026-12-07T13:00:00Z", salida: null, cierre_automatico: false, cerrada_por: null, ...parcial };
}

describe("tipoCierre", () => {
  it("abierta, normal, profesor (D21) y automático (regla 6)", () => {
    expect(tipoCierre(v({}))).toBe("abierta");
    expect(tipoCierre(v({ salida: "2026-12-07T14:00:00Z" }))).toBe("normal");
    expect(tipoCierre(v({ salida: "2026-12-07T14:00:00Z", cerrada_por: "p1" }))).toBe("profesor");
    expect(tipoCierre(v({ salida: "2026-12-07T16:00:00Z", cierre_automatico: true }))).toBe("automatico");
  });
  it("etiquetas en palabras", () => {
    expect(ETIQUETA_CIERRE.automatico).toBe("Cierre automático (3 h)");
  });
});

describe("duración", () => {
  it("entre entrada y salida, o hasta ahora si está abierta", () => {
    expect(duracionMinutos(v({ salida: "2026-12-07T14:05:00Z" }), AHORA)).toBe(65);
    expect(duracionMinutos(v({}), AHORA)).toBe(120);
  });
  it("nunca negativa", () => {
    expect(duracionMinutos(v({ entrada: "2026-12-07T16:00:00Z" }), AHORA)).toBe(0);
  });
  it("texto", () => {
    expect(textoDuracion(45)).toBe("45 min");
    expect(textoDuracion(65)).toBe("1 h 05 min");
  });
});

describe("hora y fecha en Santiago", () => {
  it("24 h y zona de Santiago", () => {
    expect(hora("2026-12-07T13:05:00Z")).toBe("10:05"); // verano, UTC−3
    expect(hora("2026-07-06T13:05:00Z")).toBe("09:05"); // invierno, UTC−4
    expect(hora("2026-12-08T01:30:00Z")).toBe("22:30");
  });
  it("fecha larga en es-CL", () => {
    expect(fechaLarga("2026-12-07T13:05:00Z")).toBe("lunes 7 de diciembre");
  });
  it("el día se cuenta en Santiago, no en UTC", () => {
    expect(diaSantiago(new Date("2026-12-08T02:30:00Z"))).toBe("2026-12-07");
  });
});

describe("rangoDia", () => {
  it("verano: medianoche de Santiago es las 03:00 UTC", () => {
    expect(rangoDia("2026-12-07")).toEqual({ desde: "2026-12-07T03:00:00.000Z", hasta: "2026-12-08T03:00:00.000Z" });
  });
  it("invierno: medianoche de Santiago es las 04:00 UTC", () => {
    expect(rangoDia("2026-07-06")).toEqual({ desde: "2026-07-06T04:00:00.000Z", hasta: "2026-07-07T04:00:00.000Z" });
  });
  it("cruza fin de mes y de año", () => {
    expect(rangoDia("2026-12-31").hasta).toBe("2027-01-01T03:00:00.000Z");
  });
  it("valida el formato del día", () => {
    expect(esDiaValido("2026-12-07")).toBe(true);
    expect(esDiaValido("2026-02-30")).toBe(false);
    expect(esDiaValido("07-12-2026")).toBe(false);
    expect(esDiaValido("")).toBe(false);
  });
});

describe("resumenDia", () => {
  it("cuenta tipos y promedia solo las salidas reales", () => {
    const r = resumenDia(
      [
        v({ id: "1", salida: "2026-12-07T14:00:00Z" }), // 60 min, normal
        v({ id: "2", salida: "2026-12-07T13:30:00Z", cerrada_por: "p" }), // 30 min, profesor
        v({ id: "3", salida: "2026-12-07T16:00:00Z", cierre_automatico: true }), // 180, no cuenta
        v({ id: "4" }), // abierta
      ],
      AHORA,
    );
    expect(r).toEqual({ total: 4, abiertas: 1, automaticos: 1, manuales: 1, promedioMinutos: 45 });
  });
  it("sin salidas reales: promedio null", () => {
    expect(resumenDia([v({})], AHORA).promedioMinutos).toBeNull();
    expect(resumenDia([], AHORA)).toEqual({ total: 0, abiertas: 0, automaticos: 0, manuales: 0, promedioMinutos: null });
  });
});

describe("normalizar lo que llega de Supabase", () => {
  it("visitas con alumno como objeto o array; descarta filas inválidas", () => {
    const r = normalizarVisitas([
      { id: "a", entrada: "x", salida: null, cierre_automatico: false, cerrada_por: null, alumnos: { nombre: "Antonia" } },
      { id: "b", entrada: "x", salida: "y", cierre_automatico: false, alumnos: [{ nombre: "Benjamín" }] },
      { id: "c", entrada: "x", salida: 3, cierre_automatico: false },
      { id: "d", entrada: "x", salida: null, cierre_automatico: "no" },
      null,
    ]);
    expect(r.map((x) => [x.id, x.nombre, x.cerrada_por])).toEqual([
      ["a", "Antonia", null],
      ["b", "Benjamín", null],
    ]);
    expect(normalizarVisitas({})).toEqual([]);
  });
  it("feedback por visita", () => {
    expect(feedbackPorVisita([{ visita_id: "a", valor: "facil" }, { visita_id: 3 }])).toEqual({ a: "facil" });
  });
  it("préstamos con implementos, ordenados por entrega", () => {
    const r = normalizarPrestamos([
      {
        id: "p2",
        entregado_en: "2026-12-07T15:00:00Z",
        devuelto_en: null,
        alumnos: { nombre: "Benjamín" },
        prestamo_items: [{ cantidad: 1, implementos: { nombre: "Paleta" } }],
      },
      {
        id: "p1",
        entregado_en: "2026-12-07T13:00:00Z",
        devuelto_en: "2026-12-07T14:00:00Z",
        alumnos: [{ nombre: "Antonia" }],
        prestamo_items: [
          { cantidad: 2, implementos: { nombre: "Balón de vóleibol" } },
          { cantidad: 1, implementos: [{ nombre: "Balón de básquetbol" }] },
        ],
      },
      { id: "malo", entregado_en: 5 },
    ]);
    expect(r.map((p) => p.id)).toEqual(["p1", "p2"]);
    expect(r[0].implementos).toBe("Balón de básquetbol × 1, Balón de vóleibol × 2");
  });
});

describe("plural", () => {
  it("singular y plural", () => {
    expect(plural(1, "visita", "visitas")).toBe("1 visita");
    expect(plural(3, "visita", "visitas")).toBe("3 visitas");
  });
});
