import { describe, expect, it } from "vitest";
import {
  CAMPOS, calcularImc, diferenciaVisible, hoyEnSantiago, leerMedicion, leerValor,
  ordenarHistorial, serieCronologica, type Medicion,
} from "./mediciones";

const formulario = (cambios: Record<string, string> = {}) => {
  const datos = new FormData();
  for (const [clave, valor] of Object.entries({
    fecha: "2026-11-24", peso_kg: "70,5", estatura_cm: "175", cintura_cm: "80.25", ...cambios,
  })) datos.set(clave, valor);
  return datos;
};

const historial: Medicion[] = [
  { id: "a", fecha: "2026-11-24", peso_kg: 70.5, estatura_cm: 175, cintura_cm: 80.25, imc: 23.02 },
  { id: "b", fecha: "2026-11-02", peso_kg: 72, estatura_cm: 175, cintura_cm: null, imc: 23.51 },
];

describe("registro corporal", () => {
  it("convierte la estatura a metros antes de calcular el IMC", () => {
    expect(calcularImc(70.5, 175)).toBeCloseTo(23.02, 2);
  });

  it("acepta coma o punto decimal y conserva hasta dos decimales", () => {
    expect(leerMedicion(formulario(), "2026-11-24")).toEqual({
      fecha: "2026-11-24", peso_kg: 70.5, estatura_cm: 175, cintura_cm: 80.25,
    });
  });

  it("permite dejar la cintura en blanco", () => {
    expect(leerMedicion(formulario({ cintura_cm: "" }), "2026-11-24")).toMatchObject({ cintura_cm: null });
  });

  it.each(["", "NaN", "Infinity", "70 kg", "-70", "7e1", "70,555", "0", "401"])("rechaza el peso %s", (entrada) => {
    expect(leerValor(entrada, CAMPOS[0])).toBeNull();
  });

  it.each(["2026-02-30", "2026-11-25", "", "0000-01-01"])("rechaza la fecha %s", (fecha) => {
    expect(leerMedicion(formulario({ fecha }), "2026-11-24")).toBe("Ingresa una fecha válida, hasta hoy.");
  });

  it("rechaza la estatura en metros y los perímetros inválidos", () => {
    expect(leerMedicion(formulario({ estatura_cm: "1,75" }), "2026-11-24")).toMatch(/^Estatura/);
    expect(leerMedicion(formulario({ cintura_cm: "401" }), "2026-11-24")).toMatch(/^Cintura/);
  });

  it("usa el día civil de Santiago cuando UTC ya cambió de fecha", () => {
    expect(hoyEnSantiago(new Date("2026-11-25T02:59:59Z"))).toBe("2026-11-24");
  });

  it("ordena el historial descendente con desempate estable y conserva la entrada", () => {
    const segunda = { ...historial[0], id: "c" };
    const entrada = [...historial, segunda];
    expect(ordenarHistorial(entrada).map(({ id }) => id)).toEqual(["c", "a", "b"]);
    expect(entrada.map(({ id }) => id)).toEqual(["a", "b", "c"]);
  });

  it("grafica del registro más antiguo al reciente y omite perímetros ausentes", () => {
    expect(serieCronologica(historial, "peso_kg").map(({ valor }) => valor)).toEqual([72, 70.5]);
    expect(serieCronologica(historial, "cintura_cm")).toEqual([{ id: "a", fecha: "2026-11-24", valor: 80.25 }]);
  });

  it("presenta diferencias con signo y distingue datos ausentes", () => {
    expect(diferenciaVisible(72, 70.5, "kg")).toBe("-1,5 kg");
    expect(diferenciaVisible(70.5, 72, "kg")).toBe("+1,5 kg");
    expect(diferenciaVisible(70.5, 70.5, "kg")).toBe("0 kg");
    expect(diferenciaVisible(null, 80.25, "cm")).toBe("Sin comparación");
  });
});
