import { describe, expect, it } from "vitest";
import {
  esEstadoMaquina,
  estadoOpuesto,
  normalizarMaquinas,
  resumenMantencion,
  textoBotonCambio,
  textoConfirmarCambio,
} from "./maquinas";

const SMITH = { id: 3, nombre: "Máquina Smith", cantidad: 1, estado: "disponible", foto_url: "maquina-smith.jpg" };
const POLEA = { id: 2, nombre: "Máquina de poleas cruzadas (DAP)", cantidad: 1, estado: "en_mantencion", foto_url: null };

describe("normalizarMaquinas", () => {
  it("acepta las filas válidas y ordena por nombre", () => {
    expect(normalizarMaquinas([SMITH, POLEA]).map((m) => m.id)).toEqual([2, 3]);
  });
  it("descarta estados fuera del check de 002 y filas incompletas", () => {
    expect(normalizarMaquinas([{ ...SMITH, estado: "rota" }, { ...SMITH, id: "3" }, null])).toEqual([]);
    expect(normalizarMaquinas({})).toEqual([]);
  });
});

describe("estado", () => {
  it("solo disponible y en_mantencion son válidos", () => {
    expect(esEstadoMaquina("disponible")).toBe(true);
    expect(esEstadoMaquina("en_mantencion")).toBe(true);
    expect(esEstadoMaquina("En mantención")).toBe(false);
  });
  it("alterna entre los dos estados", () => {
    expect(estadoOpuesto("disponible")).toBe("en_mantencion");
    expect(estadoOpuesto("en_mantencion")).toBe("disponible");
  });
  it("texto del botón según el estado actual", () => {
    expect(textoBotonCambio("disponible")).toBe("Marcar en mantención");
    expect(textoBotonCambio("en_mantencion")).toBe("Marcar disponible");
  });
  it("la confirmación nombra la máquina, el estado nuevo y el efecto", () => {
    expect(textoConfirmarCambio({ nombre: "Máquina Smith", estado: "disponible" })).toBe(
      "¿Marcar «Máquina Smith» como En mantención? Los alumnos verán una advertencia en los ejercicios que la usan.",
    );
    expect(textoConfirmarCambio({ nombre: "Máquina Smith", estado: "en_mantencion" })).toContain("como Disponible?");
  });
});

describe("resumenMantencion", () => {
  it("cuenta las máquinas en mantención", () => {
    const lista = normalizarMaquinas([SMITH, POLEA]);
    expect(resumenMantencion(lista)).toBe("1 en mantención");
    expect(resumenMantencion(normalizarMaquinas([SMITH]))).toBe("Todas disponibles");
    expect(resumenMantencion(normalizarMaquinas([POLEA, { ...POLEA, id: 9, nombre: "Otra" }]))).toBe("2 en mantención");
  });
});
