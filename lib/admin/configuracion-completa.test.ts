import { describe, expect, it } from "vitest";
import { aFormularioCompleto, validarConfiguracionCompleta, type Campo } from "./configuracion-completa";

const fila = {
  capacidad: 20,
  cierre_automatico_horas: 3,
  horario: {},
  umbral_casi_lleno: 0.57,
  turno_expira_minutos: 10,
  modalidades_rutina: { sistema: true, profesor: "true", alumno: false },
  progresion: { facil_kg: 2.5, justo_kg: 0, me_costo_porcentaje: -5, redondeo_kg: 2.5 },
};

describe("configuración completa (RF26)", () => {
  it("lee el umbral sin artefactos, invierte el signo de la reducción y normaliza modalidades", () => {
    const form = aFormularioCompleto(fila)!;
    expect(form.umbral).toBe("57");
    expect(form.me_costo_porcentaje).toBe("5");
    expect(form.modalidades).toEqual({ sistema: true, profesor: false, alumno: false });
  });

  it("envía cambios como números y booleanos con las claves de 023", () => {
    const form = aFormularioCompleto(fila)!;
    const resultado = validarConfiguracionCompleta({ ...form, facil_kg: "2,6", justo_kg: "-1.2", redondeo_kg: "0,1" });
    expect(resultado.ok && resultado.parametros).toMatchObject({
      umbral_casi_lleno: 0.57,
      turno_expira_minutos: 10,
      modalidades_rutina: { sistema: true, profesor: false, alumno: false },
      progresion: { facil_kg: 2.6, justo_kg: -1.2, me_costo_porcentaje: -5, redondeo_kg: 0.1 },
    });
  });

  it.each([
    ["umbral", "101"], ["umbral", "0"], ["umbral", "0.5"], ["expiracion", "1.5"],
    ["expiracion", "121"], ["expiracion", "2e1"], ["facil_kg", "-1"], ["facil_kg", "0"],
    ["facil_kg", "99"], ["facil_kg", "0.01"], ["justo_kg", "-3"], ["justo_kg", "3"],
    ["me_costo_porcentaje", "-5"], ["me_costo_porcentaje", "100.1"], ["redondeo_kg", "0"],
    ["redondeo_kg", "Infinity"], ["redondeo_kg", ""],
  ] satisfies [Campo, string][])("rechaza %s = %s", (campo, valor) => {
    const resultado = validarConfiguracionCompleta({ ...aFormularioCompleto(fila)!, [campo]: valor });
    expect(!resultado.ok && resultado.errores[campo]).toEqual(expect.any(String));
  });
});
