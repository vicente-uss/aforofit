import { describe, expect, it } from "vitest";
import { consultaEsperaVigente } from "./consulta-espera";
import { diaSantiago, rangoDia } from "../historial/historial";

describe("EST-04: consulta de espera", () => {
  it("descarta respuestas anteriores aunque consulten el mismo día", () => {
    const ahora = new Date("2026-11-26T15:00:00Z");
    expect(consultaEsperaVigente(1, 2, diaSantiago(ahora), ahora)).toBe(false);
    expect(consultaEsperaVigente(2, 2, diaSantiago(ahora), ahora)).toBe(true);
  });
  it("descarta respuestas del día anterior al cruzar medianoche de Santiago", () => {
    expect(consultaEsperaVigente(1, 1, "2026-11-26", new Date("2026-11-27T03:00:00Z"))).toBe(false);
  });
  it("usa el rango de Santiago, incluyendo días de 23 y 25 horas", () => {
    for (const [dia, horas] of [["2026-04-05", 24], ["2026-04-04", 25], ["2026-09-06", 23]] as const) {
      const { desde, hasta } = rangoDia(dia);
      expect((Date.parse(hasta) - Date.parse(desde)) / 3600000).toBe(horas);
    }
    expect(rangoDia("2026-09-06").desde).toBe("2026-09-06T04:00:00.000Z");
  });
});
