import { describe, expect, it } from "vitest";
import { bloquesDelDia, calendario, columnasParalelas, estadoModulo, fechaAgenda, fechaValida, hayConflicto, horarioTexto,
  modulosDelDia, periodoAgenda, rutIntegrante, seSuperponen, type Modulo, type Reserva, type Serie } from "./agenda";

const modulo: Modulo = { id: 1, dias: [1, 2, 3, 4, 5], hora_inicio: "08:00:00", hora_fin: "09:20:00", reservable: true };
const bloques = (tipo: Reserva["tipo"], cancelada = false): Reserva[] => [{
  id: "reserva", tipo, titulo: null, inicio: "", fin: "", fecha: "2026-12-07", version: "",
  hora_inicio: "09:00:00", hora_fin: "09:15:00", cancelada_en: cancelada ? "2026-11-28" : null,
  responsable: null, carrera: null, correo: null, responsable_id: null, multicancha_integrantes: [],
  espacio: "multicancha",
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
  it("agrupa series por semana civil de lunes a domingo, aunque cambie el mes", () => {
    expect(periodoAgenda("2026-12-02", "semana")).toMatchObject({
      dias: ["2026-11-30", "2026-12-01", "2026-12-02", "2026-12-03", "2026-12-04", "2026-12-05", "2026-12-06"],
      anterior: "2026-11-25", siguiente: "2026-12-09",
    });
    expect(periodoAgenda("2026-12-01", "mes").dias).toHaveLength(31);
  });
  it("expande solo ocurrencias dentro de la vigencia de la serie", () => {
    const serie: Serie = { id: "judo", titulo: "Judo", espacio: "multicancha", dia: 1, hora_inicio: "08:30",
      hora_fin: "10:00", vigente_desde: "2026-12-07", vigente_hasta: "2026-12-14", version: "1" };
    expect(bloquesDelDia("2026-12-07", [], [serie])[0].serie).toBe(serie);
    expect(bloquesDelDia("2026-12-14", [], [serie])).toHaveLength(1);
    expect(bloquesDelDia("2026-12-15", [], [serie])).toHaveLength(0);
    expect(bloquesDelDia("2026-12-21", [], [serie])).toHaveLength(0);
  });
  it("coloca eventos simultáneos en paralelo y distingue el conflicto de espacio", () => {
    const eventos = bloquesDelDia("2026-12-07", [
      ...bloques("ordinaria"), { ...bloques("institucional")[0], id: "espejo", espacio: "sala_espejo" },
    ], []);
    expect(columnasParalelas(eventos)[0].columnas).toHaveLength(2);
    expect(hayConflicto(eventos[0], eventos)).toBe(false);
    eventos[1].espacio = "multicancha";
    expect(hayConflicto(eventos[0], eventos)).toBe(true);
  });
  it("omite la sala espejo al calcular disponibilidad y conserva las franjas no reservables", () => {
    const eventos = [{ ...bloques("institucional")[0], espacio: "sala_espejo" as const }];
    expect(estadoModulo(modulo, eventos, "2026-12-07", "2026-12-06", "10:00")).toBe("disponible");
    expect(estadoModulo({ ...modulo, reservable: false }, eventos, "2026-12-07", "2026-12-06", "10:00")).toBe("no_reservable");
  });
});
