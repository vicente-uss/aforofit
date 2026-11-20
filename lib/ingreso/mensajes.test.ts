import { describe, expect, it } from "vitest";
import { mensajeIngreso, textoMotivo, type ResultadoIngreso } from "./mensajes";

// Respuesta base con datos ficticios; cada prueba cambia lo que necesita.
const base: ResultadoIngreso = {
  resultado: "entrada",
  motivo: null,
  alumno: { id: "a1", nombre: "Camila Rojas" },
  turno: null,
  ocupacion: 12,
  capacidad: 20,
};

describe("mensajeIngreso", () => {
  it("entrada: saluda al alumno y muestra el aforo (CA01)", () => {
    const m = mensajeIngreso(base);
    expect(m.tono).toBe("exito");
    expect(m.titulo).toBe("Bienvenido/a, Camila Rojas");
    expect(m.detalle).toBe("Aforo: 12 / 20");
    expect(m.ofrecerVincular).toBe(false);
  });

  it("salida: se despide (CA08)", () => {
    const m = mensajeIngreso({ ...base, resultado: "salida", ocupacion: 11 });
    expect(m.tono).toBe("info");
    expect(m.titulo).toBe("Hasta luego, Camila Rojas");
    expect(m.detalle).toBe("Aforo: 11 / 20");
  });

  it("turno: muestra el número asignado (CA06)", () => {
    const m = mensajeIngreso({ ...base, resultado: "turno", turno: 7, ocupacion: 20 });
    expect(m.tono).toBe("espera");
    expect(m.titulo).toBe("Gimnasio lleno · tu turno es el 7");
  });

  it("credencial no registrada: ofrece vincular (CA02)", () => {
    const m = mensajeIngreso({ ...base, resultado: "rechazo", motivo: "credencial_no_registrada", alumno: null });
    expect(m.tono).toBe("error");
    expect(m.titulo).toBe("Credencial no registrada");
    expect(m.ofrecerVincular).toBe(true);
  });

  it("certificado vencido: rechaza con el texto del criterio (CA04)", () => {
    const m = mensajeIngreso({ ...base, resultado: "rechazo", motivo: "certificado_no_vigente" });
    expect(m.titulo).toBe("Certificado no vigente");
    expect(m.ofrecerVincular).toBe(false);
  });

  it("fuera de horario: rechaza con el texto del criterio (CA05)", () => {
    const m = mensajeIngreso({ ...base, resultado: "rechazo", motivo: "fuera_de_horario" });
    expect(m.titulo).toBe("Fuera del horario de ingreso");
  });

  it("entrada sin nombre: usa un texto genérico", () => {
    const m = mensajeIngreso({ ...base, alumno: null });
    expect(m.titulo).toBe("Entrada registrada");
  });
});

describe("textoMotivo", () => {
  it("motivo desconocido o nulo: mensaje genérico", () => {
    expect(textoMotivo("algo_nuevo")).toBe("No se pudo registrar el ingreso");
    expect(textoMotivo(null)).toBe("No se pudo registrar el ingreso");
  });
});
