import { describe, expect, it } from "vitest";
import { esErrorConocido, textoErrorRutina, textoObjetivoNivel } from "./mensajes";

describe("textoErrorRutina", () => {
  it("feedback ya registrado", () => {
    expect(textoErrorRutina({ message: "feedback_ya_registrado", code: "P0001" }).titulo).toBe(
      "Ya respondiste por esta visita",
    );
  });
  it("visita con cierre automático", () => {
    expect(textoErrorRutina({ message: "visita_cierre_automatico", code: "P0001" }).titulo).toBe(
      "Tu visita se cerró sola",
    );
  });
  it("sin visita", () => {
    expect(textoErrorRutina({ message: "sin_visita", code: "P0001" }).titulo).toBe("No encontramos tu visita");
  });
  it("función no instalada", () => {
    expect(textoErrorRutina({ message: "Could not find the function", code: "PGRST202" }).titulo).toBe(
      "Falta la base de datos de la rutina",
    );
  });
  it("error de red o desconocido: sin conexión", () => {
    expect(textoErrorRutina({ message: "TypeError: Failed to fetch", code: "" }).titulo).toBe("Sin conexión");
    expect(textoErrorRutina({}).titulo).toBe("Sin conexión");
  });
  it("no encuentra propiedades heredadas", () => {
    expect(textoErrorRutina({ message: "constructor" }).titulo).toBe("Sin conexión");
  });
});

describe("esErrorConocido", () => {
  it("compara el código del mensaje", () => {
    expect(esErrorConocido({ message: "feedback_ya_registrado" }, "feedback_ya_registrado")).toBe(true);
    expect(esErrorConocido({ message: "sin_visita" }, "feedback_ya_registrado")).toBe(false);
  });
});

describe("textoObjetivoNivel", () => {
  it("objetivo y nivel", () => {
    expect(textoObjetivoNivel("hipertrofia", "principiante")).toBe("Hipertrofia · principiante");
  });
  it("incompleto", () => {
    expect(textoObjetivoNivel(null, "intermedio")).toBe("Sin objetivo");
  });
});

describe("textoErrorRutina con cierre manual (D21)", () => {
  it("visita cerrada por el profesor", () => {
    expect(textoErrorRutina({ message: "visita_cierre_manual", code: "P0001" }).titulo).toBe(
      "El profesor cerró tu visita",
    );
  });
});
