import { describe, expect, it } from "vitest";
import {
  aFormulario,
  sumarUnaHora,
  textoErrorConfiguracion,
  validarConfiguracion,
  type FormularioConfiguracion,
} from "./configuracion";

// Fila de configuracion como la deja 014.
const FILA = {
  capacidad: 20,
  cierre_automatico_horas: 3,
  horario: {
    lunes: { apertura: "08:00", cierre: "22:00", ultimo_ingreso: "21:00" },
    martes: { apertura: "08:00", cierre: "22:00", ultimo_ingreso: "21:00" },
    miercoles: { apertura: "08:00", cierre: "22:00", ultimo_ingreso: "21:00" },
    jueves: { apertura: "08:00", cierre: "22:00", ultimo_ingreso: "21:00" },
    viernes: { apertura: "08:00", cierre: "22:00", ultimo_ingreso: "21:00" },
    sabado: { apertura: "08:00", cierre: "14:00", ultimo_ingreso: "13:00" },
    domingo: null,
  },
};

function formulario(): FormularioConfiguracion {
  return aFormulario(FILA)!;
}

describe("aFormulario", () => {
  it("lee la fila con el domingo cerrado", () => {
    const f = formulario();
    expect(f.capacidad).toBe("20");
    expect(f.horario.sabado).toEqual({ abierto: true, apertura: "08:00", cierre: "14:00", ultimo_ingreso: "13:00" });
    expect(f.horario.domingo.abierto).toBe(false);
  });
  it("sin «cierre» (base antes de 014) propone una hora después del último ingreso", () => {
    const f = aFormulario({ ...FILA, horario: { ...FILA.horario, lunes: { apertura: "08:00", ultimo_ingreso: "21:00" } } });
    expect(f!.horario.lunes.cierre).toBe("22:00");
  });
  it("fila inválida: null", () => {
    expect(aFormulario(null)).toBeNull();
    expect(aFormulario({ capacidad: "20", cierre_automatico_horas: 3 })).toBeNull();
  });
});

describe("validarConfiguracion (D24)", () => {
  it("la configuración inicial es válida y se envía con el domingo en null", () => {
    const r = validarConfiguracion(formulario());
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.capacidad).toBe(20);
      expect(r.cierre_automatico_horas).toBe(3);
      expect(r.horario.domingo).toBeNull();
      expect(r.horario.lunes).toEqual({ apertura: "08:00", cierre: "22:00", ultimo_ingreso: "21:00" });
    }
  });
  it("capacidad de 1 a 100, entera", () => {
    for (const valor of ["1", "100", "2"]) {
      expect(validarConfiguracion({ ...formulario(), capacidad: valor }).ok).toBe(true);
    }
    for (const valor of ["0", "101", "20.5", "", "veinte", "-3", "2e1"]) {
      const r = validarConfiguracion({ ...formulario(), capacidad: valor });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.errores.capacidad).toContain("entre 1 y 100");
    }
  });
  it("cierre automático de 1 a 12 horas", () => {
    expect(validarConfiguracion({ ...formulario(), cierre_automatico_horas: "12" }).ok).toBe(true);
    for (const valor of ["0", "13", "1.5"]) {
      const r = validarConfiguracion({ ...formulario(), cierre_automatico_horas: valor });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.errores.cierre_automatico_horas).toContain("entre 1 y 12");
    }
  });
  it("cada día: apertura < último ingreso <= cierre", () => {
    const f = formulario();
    f.horario.lunes = { abierto: true, apertura: "08:00", cierre: "20:00", ultimo_ingreso: "21:00" };
    f.horario.martes = { abierto: true, apertura: "21:00", cierre: "22:00", ultimo_ingreso: "21:00" };
    f.horario.miercoles = { abierto: true, apertura: "08:00", cierre: "21:00", ultimo_ingreso: "21:00" };
    const r = validarConfiguracion(f);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errores.lunes).toBeDefined();
      expect(r.errores.martes).toBeDefined();
      expect(r.errores.miercoles).toBeUndefined(); // último ingreso igual al cierre se acepta
    }
  });
  it("hora vacía o mal escrita en un día abierto: error", () => {
    const f = formulario();
    f.horario.jueves = { abierto: true, apertura: "", cierre: "22:00", ultimo_ingreso: "21:00" };
    f.horario.viernes = { abierto: true, apertura: "8:00", cierre: "22:00", ultimo_ingreso: "21:00" };
    const r = validarConfiguracion(f);
    expect(!r.ok && r.errores.jueves && r.errores.viernes).toBeTruthy();
  });
  it("un día cerrado no se valida: sus horas se ignoran", () => {
    const f = formulario();
    f.horario.sabado = { abierto: false, apertura: "", cierre: "", ultimo_ingreso: "" };
    const r = validarConfiguracion(f);
    expect(r.ok && r.horario.sabado === null).toBe(true);
  });
  it("se puede abrir el domingo", () => {
    const f = formulario();
    f.horario.domingo = { abierto: true, apertura: "09:00", cierre: "13:00", ultimo_ingreso: "12:00" };
    const r = validarConfiguracion(f);
    expect(r.ok && r.horario.domingo).toEqual({ apertura: "09:00", cierre: "13:00", ultimo_ingreso: "12:00" });
  });
});

describe("sumarUnaHora", () => {
  it("suma una hora y no pasa de 23:59", () => {
    expect(sumarUnaHora("21:00")).toBe("22:00");
    expect(sumarUnaHora("09:30")).toBe("10:30");
    expect(sumarUnaHora("23:10")).toBe("23:59");
  });
});

describe("textoErrorConfiguracion", () => {
  it("usa el detalle de la base cuando dice qué día falla", () => {
    expect(
      textoErrorConfiguracion({ message: "horario_invalido", details: "El lunes debe cumplir apertura < último ingreso <= cierre." }),
    ).toEqual({ titulo: "Horario no válido", detalle: "El lunes debe cumplir apertura < último ingreso <= cierre." });
  });
  it("errores conocidos sin detalle, función no instalada y sin conexión", () => {
    expect(textoErrorConfiguracion({ message: "sin_permiso" }).titulo).toBe("Sin permiso");
    expect(textoErrorConfiguracion({ message: "capacidad_invalida" }).detalle).toContain("1 y 100");
    expect(textoErrorConfiguracion({ message: "x", code: "PGRST202" }).titulo).toBe("Falta la base de datos");
    expect(textoErrorConfiguracion({ message: "constructor" }).titulo).toBe("Sin conexión");
  });
});
