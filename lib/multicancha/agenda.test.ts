import { describe, expect, it } from "vitest";
import { calendario, estadoModulo, fechaAgenda, fechaValida, horarioTexto, modulosDelDia, rutIntegrante, seSuperponen, type Modulo, type Reserva } from "./agenda";

const modulo: Modulo = { id: 1, dias: [1, 2, 3, 4, 5], hora_inicio: "08:00:00", hora_fin: "09:20:00" };
const bloques = (tipo: Reserva["tipo"], cancelada = false): Reserva[] => [{
  id: "reserva", tipo, titulo: null, inicio: "", fin: "", fecha: "2026-12-07", version: "",
  hora_inicio: "09:00:00", hora_fin: "09:15:00", cancelada_en: cancelada ? "2026-11-28" : null,
  responsable: null, carrera: null, correo: null, responsable_id: null, multicancha_integrantes: [],
}];

describe("Calendario de multicancha", () => {
  it.each(["2026-02-29", "2026-11-31", "1999-12-31", "10000-01-01", "2026-1-01"])("rechaza %s", (dia) => {
    expect(fechaValida(dia)).toBe(false);
  });
  it("parte en el día civil de Santiago aunque UTC ya haya cambiado de día", () => {
    expect(fechaAgenda(undefined, new Date("2026-11-29T01:30:00Z"))).toBe("2026-11-28");
  });
  it.each([
    ["2026-04-05T03:59:59Z", "2026-04-04"],
    ["2026-04-05T04:00:00Z", "2026-04-05"],
    ["2026-09-06T03:59:59Z", "2026-09-05"],
    ["2026-09-06T04:00:00Z", "2026-09-06"],
  ])("resuelve la fecha alrededor del cambio de hora (%s)", (instante, dia) => {
    expect(fechaAgenda(undefined, new Date(instante))).toBe(dia);
  });
  it("navega entre años y muestra febrero bisiesto", () => {
    expect(calendario("2028-01-19")).toMatchObject({ anterior: "2027-12-01", siguiente: "2028-02-01", relleno: 5 });
    expect(calendario("2028-02-29").dias).toHaveLength(29);
  });
  it("respeta los límites de fechas consultables", () => {
    expect(calendario("2000-01-01").anterior).toBeNull();
    expect(calendario("9999-12-31").siguiente).toBeNull();
  });
  it("usa días ISO y formato de 24 horas", () => {
    expect(modulosDelDia([modulo], "2026-12-06")).toEqual([]);
    expect(modulosDelDia([modulo], "2026-12-07")).toEqual([modulo]);
    expect(horarioTexto(modulo)).toBe("08:00–09:20");
  });
  it("distingue límites contiguos y superposiciones parciales", () => {
    expect(seSuperponen(modulo, { hora_inicio: "09:20", hora_fin: "09:30" })).toBe(false);
    expect(seSuperponen(modulo, { hora_inicio: "09:19", hora_fin: "09:30" })).toBe(true);
  });
  it.each(["ordinaria", "institucional", "bloqueo"] as const)("muestra el estado %s aunque la ocupación sea parcial", (tipo) => {
    expect(estadoModulo(modulo, bloques(tipo), "2026-12-07", "2026-12-06", "10:00")).toBe(tipo);
  });
  it("libera un módulo cancelado y diferencia un horario que ya comenzó", () => {
    const canceladas = bloques("ordinaria", true);
    expect(estadoModulo(modulo, canceladas, "2026-12-07", "2026-12-07", "07:59")).toBe("disponible");
    expect(estadoModulo(modulo, canceladas, "2026-12-07", "2026-12-07", "08:00")).toBe("transcurrido");
    expect(estadoModulo(modulo, [], "2026-12-06", "2026-12-07", "07:00")).toBe("transcurrido");
  });
  it("normaliza RUT con puntos y verifica el dígito", () => {
    expect(rutIntegrante("12.345.678-5")).toBe("12345678-5");
    expect(rutIntegrante("12.345.678-0")).toBeNull();
  });
});
