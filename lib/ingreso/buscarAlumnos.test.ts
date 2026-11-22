import { describe, expect, it } from "vitest";
import { patronContiene, unirAlumnos } from "./buscarAlumnos";

describe("patronContiene", () => {
  it("envuelve el texto en comodines", () => {
    expect(patronContiene("rojas")).toBe("%rojas%");
  });

  it("escapa los comodines escritos por el usuario", () => {
    expect(patronContiene("50%_a")).toBe("%50\\%\\_a%");
  });
});

describe("unirAlumnos", () => {
  const ana = { id: "1", nombre: "Ana" };
  const bruno = { id: "2", nombre: "Bruno" };
  const camila = { id: "3", nombre: "Camila" };

  it("une sin duplicados y ordena por nombre", () => {
    expect(unirAlumnos([[camila, ana], [ana, bruno]], 8)).toEqual([ana, bruno, camila]);
  });

  it("respeta el límite", () => {
    expect(unirAlumnos([[camila, ana], [bruno]], 2)).toEqual([ana, bruno]);
  });
});
