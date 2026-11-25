import { describe, expect, it } from "vitest";
import { textoErrorProfesor } from "./mensajes";

describe("textoErrorProfesor", () => {
  it("errores de 012", () => {
    expect(textoErrorProfesor({ message: "visita_ya_cerrada" }).titulo).toBe("Esa visita ya estaba cerrada");
    expect(textoErrorProfesor({ message: "visita_no_encontrada" }).titulo).toBe("No encontramos esa visita");
    expect(textoErrorProfesor({ message: "maquina_no_encontrada" }).titulo).toBe("No encontramos esa máquina");
    expect(textoErrorProfesor({ message: "valor_invalido" }).titulo).toBe("Estado no válido");
    expect(textoErrorProfesor({ message: "sin_permiso" }).titulo).toBe("Sin permiso");
  });
  it("función no instalada", () => {
    expect(textoErrorProfesor({ message: "x", code: "PGRST202" }).titulo).toBe("Falta la base de datos");
  });
  it("red o desconocido: sin conexión, sin propiedades heredadas", () => {
    expect(textoErrorProfesor({ message: "TypeError: Failed to fetch" }).titulo).toBe("Sin conexión");
    expect(textoErrorProfesor({ message: "constructor" }).titulo).toBe("Sin conexión");
    expect(textoErrorProfesor({}).titulo).toBe("Sin conexión");
  });
});
