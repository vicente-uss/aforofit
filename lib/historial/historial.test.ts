import { describe, expect, it } from "vitest";
import {
  diaSantiago,
  duracionMinutos,
  esDiaValido,
  estadoPrestamo,
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
import { actualizarConsulta, type ConsultaDia } from "./consulta-dia";
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
  it("el cierre automático histórico no presupone un plazo", () => {
    expect(ETIQUETA_CIERRE.automatico).toBe("Cierre automático");
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
  it.each([
    ["2026-04-04", "2026-04-04T03:00:00.000Z", "2026-04-05T04:00:00.000Z", 25],
    ["2026-04-05", "2026-04-05T04:00:00.000Z", "2026-04-06T04:00:00.000Z", 24],
    ["2026-09-06", "2026-09-06T04:00:00.000Z", "2026-09-07T03:00:00.000Z", 23],
  ] as const)("límites del día local %s", (dia, desde, hasta, horas) => {
    expect(rangoDia(dia)).toEqual({ desde, hasta });
    expect(Date.parse(hasta) - Date.parse(desde)).toBe(horas * 3600000);
    expect(diaSantiago(new Date(Date.parse(desde) - 1))).not.toBe(dia);
    expect(diaSantiago(new Date(desde))).toBe(dia);
    expect(diaSantiago(new Date(Date.parse(hasta) - 1))).toBe(dia);
    expect(diaSantiago(new Date(hasta))).not.toBe(dia);
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
        tne_devuelta: false,
        alumnos: { nombre: "Benjamín" },
        prestamo_items: [{ cantidad: 1, implementos: { nombre: "Paleta" } }],
      },
      {
        id: "p1",
        entregado_en: "2026-12-07T13:00:00Z",
        devuelto_en: "2026-12-07T14:00:00Z",
        tne_devuelta: true,
        alumnos: [{ nombre: "Antonia", rut: "00.000.001-F" }],
        prestamo_items: [
          { cantidad: 2, implementos: { nombre: "Balón de vóleibol" } },
          { cantidad: 1, implementos: [{ nombre: "Balón de básquetbol" }] },
        ],
      },
      { id: "malo", entregado_en: 5 },
    ]);
    expect(r.map((p) => p.id)).toEqual(["p1", "p2"]);
    expect(r.map((p) => [p.solicitante, p.detalleSolicitante])).toEqual([
      ["Antonia", "00.000.001-F"], ["Benjamín", null],
    ]);
    expect(r[0].implementos).toBe("Balón de básquetbol × 1, Balón de vóleibol × 2");
  });

  it.each([
    { numero: 42, referencia: "Equipo A", devuelto: null, tne: false, estado: "implementos", detalle: "Externo #42 · Equipo A" },
    { numero: 43, referencia: "Equipo B", devuelto: "2026-12-07T15:00:00Z", tne: false, estado: "tne", detalle: "Externo #43 · Equipo B" },
    { numero: 44, referencia: null, devuelto: "2026-12-07T15:00:00Z", tne: true, estado: "cerrado", detalle: "Externo #44" },
  ])("identifica al solicitante externo con estado $estado", ({ numero, referencia, devuelto, tne, estado, detalle }) => {
    const externo = { nombre: "Sofía Soto", numero, referencia };
    const [prestamo] = normalizarPrestamos([{
      id: "prestamo", externo_id: "ficha-externa", entregado_en: "2026-12-07T13:00:00Z",
      devuelto_en: devuelto, tne_devuelta: tne, alumnos: null,
      solicitantes_externos: tne ? [externo] : externo,
      prestamo_items: [{ cantidad: 1, implementos: { nombre: "Paleta" } }],
    }]);
    expect(prestamo).toMatchObject({ solicitante: "Sofía Soto", detalleSolicitante: detalle, implementos: "Paleta × 1" });
    expect(estadoPrestamo(prestamo)).toBe(estado);
  });
});

describe("plural", () => {
  it("singular y plural", () => {
    expect(plural(1, "visita", "visitas")).toBe("1 visita");
    expect(plural(3, "visita", "visitas")).toBe("3 visitas");
  });
});

describe("estado del préstamo (D19 y CA21)", () => {
  it("solo está cerrado cuando volvieron los implementos y la garantía", () => {
    const base = { id: "p", entregado_en: "2026-04-05T15:00:00Z", devuelto_en: null, tne_devuelta: false };
    const devuelto = { ...base, devuelto_en: "2026-04-05T17:00:00Z" };
    const filas = normalizarPrestamos([base, devuelto, { ...devuelto, tne_devuelta: true }, { ...devuelto, tne_devuelta: null }]);
    expect(filas.map(estadoPrestamo)).toEqual(["implementos", "tne", "cerrado"]);
    expect(filas.map((p) => p.tne_devuelta)).toEqual([false, false, true]);
  });
});

describe("cambio de fecha del historial", () => {
  const anterior: ConsultaDia = { dia: "2026-04-04", peticion: 1, tipo: "listo",
    datos: { visitas: [v({})], prestamos: [], ahora: AHORA } };
  const carga: ConsultaDia = { dia: "2026-04-05", peticion: 2, tipo: "cargando" };
  const error: ConsultaDia = { ...carga, tipo: "error" };

  it("retira los datos anteriores desde la selección y también si falla la nueva lectura", () => {
    const enCurso = actualizarConsulta(anterior, carga);
    expect(enCurso).toEqual(carga);
    expect(actualizarConsulta(enCurso, error)).toEqual(error);
  });

  it("descarta éxitos y errores atrasados, incluso si el profesor vuelve a la fecha inicial", () => {
    const regreso = actualizarConsulta(carga, { ...anterior, peticion: 3, tipo: "cargando" });
    expect(actualizarConsulta(regreso, anterior)).toBe(regreso);
    expect(actualizarConsulta(regreso, error)).toBe(regreso);
    expect(actualizarConsulta(error, anterior)).toBe(error);
  });
});
