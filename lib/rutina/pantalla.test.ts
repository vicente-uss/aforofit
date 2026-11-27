import { describe, expect, it } from "vitest";
import {
  cargasPorOrden,
  compararCargas,
  diaSantiago,
  normalizarAlumno,
  normalizarEjercicios,
  normalizarVisita,
  pantallaAlumno,
  textoVolumen,
  urlFotoMaquina,
  type EstadoAlumno,
  type Visita,
} from "./pantalla";

// Lunes 7 de diciembre de 2026, 12:00 en Santiago (UTC−3 en verano).
const AHORA = new Date("2026-12-07T15:00:00Z");

const ALUMNO = { id: "a1", nombre: "Antonia Fictia Rivas", objetivo: "hipertrofia", nivel: "principiante" } as const;

function visita(parcial: Partial<Visita> = {}): Visita {
  return {
    id: "v1",
    entrada: "2026-12-07T12:00:00Z",
    salida: null,
    cierre_automatico: false,
    cerrada_por: null,
    ...parcial,
  };
}

function estado(parcial: Partial<EstadoAlumno> = {}): EstadoAlumno {
  return {
    alumno: { ...ALUMNO },
    hayRutina: true,
    ultimaVisita: null,
    feedbackUltimaVisita: false,
    feedbackOmitido: false,
    cambiandoObjetivo: false,
    ahora: AHORA,
    ...parcial,
  };
}

describe("pantallaAlumno", () => {
  it("cuenta sin alumno ligado", () => {
    expect(pantallaAlumno(estado({ alumno: null }))).toBe("sin_alumno");
  });
  it("sin objetivo o sin nivel: elegir objetivo (B1)", () => {
    expect(pantallaAlumno(estado({ hayRutina: false, alumno: { ...ALUMNO, objetivo: null } }))).toBe("elegir_objetivo");
    expect(pantallaAlumno(estado({ hayRutina: false, alumno: { ...ALUMNO, nivel: null } }))).toBe("elegir_objetivo");
  });
  it("«Cambiar objetivo» vuelve a elegir aunque ya tenga rutina", () => {
    expect(pantallaAlumno(estado({ cambiandoObjetivo: true, ultimaVisita: visita() }))).toBe("elegir_objetivo");
  });
  it("con objetivo pero sin rutina activa: ofrecer generarla", () => {
    expect(pantallaAlumno(estado({ hayRutina: false }))).toBe("sin_rutina");
  });
  it("una rutina personalizada aparece aunque el alumno no haya elegido objetivo", () => {
    expect(pantallaAlumno(estado({
      alumno: { ...ALUMNO, objetivo: null, nivel: null }, ultimaVisita: visita(),
    }))).toBe("adentro");
  });
  it("omite el generador si la modalidad del sistema está deshabilitada", () => {
    expect(pantallaAlumno(estado({
      generacionHabilitada: false, hayRutina: false, alumno: { ...ALUMNO, nivel: null },
    }))).toBe("sin_rutina");
  });
  it("recuerda el feedback guardado si se archivó la rutina activa", () => {
    expect(pantallaAlumno(estado({
      hayRutina: false, feedbackUltimaVisita: true, ultimaVisita: visita({ salida: "2026-12-07T13:30:00Z" }),
    }))).toBe("feedback_enviado");
  });
  it("sin visitas: fuera del gimnasio", () => {
    expect(pantallaAlumno(estado())).toBe("fuera");
  });
  it("visita abierta: adentro (D13)", () => {
    expect(pantallaAlumno(estado({ ultimaVisita: visita() }))).toBe("adentro");
  });
  it("salió hoy sin feedback: esperando feedback (B4)", () => {
    expect(pantallaAlumno(estado({ ultimaVisita: visita({ salida: "2026-12-07T13:30:00Z" }) }))).toBe(
      "esperando_feedback",
    );
  });
  it("salió hoy y ya respondió: feedback enviado", () => {
    expect(
      pantallaAlumno(
        estado({ ultimaVisita: visita({ salida: "2026-12-07T13:30:00Z" }), feedbackUltimaVisita: true }),
      ),
    ).toBe("feedback_enviado");
  });
  it("«Ahora no»: no vuelve a preguntar por esa visita", () => {
    expect(
      pantallaAlumno(estado({ ultimaVisita: visita({ salida: "2026-12-07T13:30:00Z" }), feedbackOmitido: true })),
    ).toBe("fuera");
  });
  it("cierre automático: no pide feedback (regla 6)", () => {
    expect(
      pantallaAlumno(
        estado({ ultimaVisita: visita({ salida: "2026-12-07T15:00:00Z", cierre_automatico: true }) }),
      ),
    ).toBe("fuera");
  });
  it("cierre manual del profesor: no pide feedback (D21)", () => {
    expect(
      pantallaAlumno(estado({ ultimaVisita: visita({ salida: "2026-12-07T15:00:00Z", cerrada_por: "p1" }) })),
    ).toBe("fuera");
  });
  it("salida de otro día: no pide feedback", () => {
    expect(pantallaAlumno(estado({ ultimaVisita: visita({ salida: "2026-12-04T20:00:00Z" }) }))).toBe("fuera");
  });
  it("el día se mide en Santiago, no en UTC", () => {
    // 23:30 del domingo 6 en Santiago = 02:30 UTC del lunes 7.
    expect(diaSantiago(new Date("2026-12-07T02:30:00Z"))).toBe("2026-12-06");
    expect(
      pantallaAlumno(estado({ ultimaVisita: visita({ salida: "2026-12-07T02:30:00Z" }) })),
    ).toBe("fuera");
  });
});

const FILA = {
  rutina_id: "r1",
  origen: "sistema",
  orden: 2,
  ejercicio: "Press de pecho sentado",
  maquina_id: 1,
  maquina: "Máquina de press de pecho sentado (SportsArt)",
  foto_url: "press-pecho-sentado.jpg",
  series: 3,
  repeticiones: 12,
  minutos: null,
  carga_kg: 25,
  nota_ajuste: "Asiento con las manillas a la altura del pecho",
  ajustes_maquina: null,
  estado_maquina: "disponible",
  en_mantencion: false,
};

const CARDIO = {
  ...FILA,
  orden: 1,
  ejercicio: "Calentamiento en bicicleta",
  maquina_id: 10,
  maquina: "Bicicleta estática (LifeFitness)",
  series: 1,
  repeticiones: null,
  minutos: 5,
  carga_kg: null,
};

describe("normalizarEjercicios", () => {
  it("acepta las filas de rutina_del_dia y las ordena", () => {
    const r = normalizarEjercicios([FILA, CARDIO]);
    expect(r.map((e) => e.orden)).toEqual([1, 2]);
    expect(r[1].carga_kg).toBe(25);
  });
  it("acepta numeric como texto", () => {
    expect(normalizarEjercicios([{ ...FILA, carga_kg: "42.5" }])[0].carga_kg).toBe(42.5);
  });
  it("descarta filas incompletas o con tipos incorrectos", () => {
    expect(normalizarEjercicios([{ ...FILA, en_mantencion: "si" }, { ...FILA, orden: "2" }, null, 3])).toEqual([]);
    expect(normalizarEjercicios({ filas: [] })).toEqual([]);
  });
});

describe("normalizarVisita y normalizarAlumno", () => {
  it("visita válida y abierta", () => {
    expect(normalizarVisita({ id: "v", entrada: "x", salida: null, cierre_automatico: false })).toEqual({
      id: "v",
      entrada: "x",
      salida: null,
      cierre_automatico: false,
      cerrada_por: null,
    });
  });
  it("visita cerrada a mano trae cerrada_por", () => {
    expect(
      normalizarVisita({ id: "v", entrada: "x", salida: "y", cierre_automatico: false, cerrada_por: "p1" })?.cerrada_por,
    ).toBe("p1");
    expect(normalizarVisita({ id: "v", entrada: "x", salida: "y", cierre_automatico: false, cerrada_por: 5 })).toBeNull();
  });
  it("visita inválida: null", () => {
    expect(normalizarVisita({ id: "v", entrada: "x", salida: 3, cierre_automatico: false })).toBeNull();
    expect(normalizarVisita(null)).toBeNull();
  });
  it("alumno con objetivo desconocido queda sin objetivo", () => {
    expect(normalizarAlumno({ id: "a", nombre: "A", objetivo: "cardio", nivel: "intermedio" })).toEqual({
      id: "a",
      nombre: "A",
      objetivo: null,
      nivel: "intermedio",
    });
    expect(normalizarAlumno({ nombre: "A" })).toBeNull();
  });
});

describe("textoVolumen", () => {
  it("fuerza: series × repeticiones", () => {
    expect(textoVolumen({ series: 3, repeticiones: 12, minutos: null })).toBe("3 × 12");
  });
  it("cardio: minutos", () => {
    expect(textoVolumen({ series: 1, repeticiones: null, minutos: 5 })).toBe("5 min");
  });
});

describe("urlFotoMaquina", () => {
  it("arma la URL pública del bucket maquinas", () => {
    expect(urlFotoMaquina("https://x.supabase.co/", "press-pecho-sentado.jpg")).toBe(
      "https://x.supabase.co/storage/v1/object/public/maquinas/press-pecho-sentado.jpg",
    );
  });
  it("sin foto o sin URL base: null", () => {
    expect(urlFotoMaquina("https://x.supabase.co", null)).toBeNull();
    expect(urlFotoMaquina(undefined, "a.jpg")).toBeNull();
  });
  it("una URL completa se usa tal cual", () => {
    expect(urlFotoMaquina("https://x.supabase.co", "https://otra/a.jpg")).toBe("https://otra/a.jpg");
  });
});

describe("compararCargas («Tu próxima sesión», CA14)", () => {
  const despues = normalizarEjercicios([CARDIO, { ...FILA, carga_kg: 42.5 }, { ...FILA, orden: 3, carga_kg: 37.5 }]);
  it("marca sube, baja y cardio sin carga", () => {
    const antes = { 1: null, 2: 40, 3: 40 };
    expect(compararCargas(antes, despues).map((c) => c.cambio)).toEqual(["sin_carga", "sube", "baja"]);
  });
  it("justo: igual", () => {
    expect(compararCargas({ 2: 42.5 }, despues)[1]).toMatchObject({ antes: 42.5, ahora: 42.5, cambio: "igual" });
  });
  it("sin las cargas anteriores (página recargada): sin dato", () => {
    expect(compararCargas(null, despues)[1].cambio).toBe("sin_dato");
  });
  it("cargasPorOrden guarda la carga de cada ejercicio", () => {
    expect(cargasPorOrden(despues)).toEqual({ 1: null, 2: 42.5, 3: 37.5 });
  });
});
