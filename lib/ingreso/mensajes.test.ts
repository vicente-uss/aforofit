import { afterEach, describe, expect, it, vi } from "vitest";
import {
  enmascararUid,
  interpretarRespuesta,
  interpretarVinculacion,
  mensajeErrorRpc,
  mensajeIngreso,
  textoMotivo,
  type ResultadoIngreso,
} from "./mensajes";

afterEach(() => {
  vi.restoreAllMocks();
});

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
  it("motivo desconocido: mensaje genérico y console.warn", () => {
    const aviso = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(textoMotivo("algo_nuevo")).toBe("No se pudo registrar el ingreso");
    expect(textoMotivo("constructor")).toBe("No se pudo registrar el ingreso");
    expect(aviso).toHaveBeenCalledTimes(2);
  });

  it("motivo nulo: mensaje genérico sin aviso", () => {
    const aviso = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(textoMotivo(null)).toBe("No se pudo registrar el ingreso");
    expect(aviso).not.toHaveBeenCalled();
  });

  it("D20: fuera_de_periodo ya no es un motivo del contrato", () => {
    const aviso = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(textoMotivo("fuera_de_periodo")).toBe("No se pudo registrar el ingreso");
    expect(aviso).toHaveBeenCalledTimes(1);
  });

  it("incluye los motivos de vincular_credencial (CA03)", () => {
    expect(textoMotivo("credencial_de_otro_alumno")).toBe("La credencial ya pertenece a otro alumno");
    expect(textoMotivo("alumno_no_encontrado")).toBe("Alumno no encontrado");
  });
});

describe("interpretarRespuesta", () => {
  it("acepta una respuesta con la forma del contrato", () => {
    expect(interpretarRespuesta(base)).toEqual(base);
  });

  it("acepta alumno nulo en un rechazo", () => {
    const rechazo = { ...base, resultado: "rechazo", motivo: "credencial_no_registrada", alumno: null };
    expect(interpretarRespuesta(rechazo)).toEqual(rechazo);
  });

  it("rechaza null", () => {
    expect(interpretarRespuesta(null)).toBeNull();
  });

  it("rechaza un array", () => {
    expect(interpretarRespuesta([base])).toBeNull();
  });

  it("rechaza un objeto incompleto", () => {
    expect(interpretarRespuesta({ resultado: "entrada" })).toBeNull();
  });

  it("rechaza un resultado fuera de la lista o un alumno mal formado", () => {
    expect(interpretarRespuesta({ ...base, resultado: "otro" })).toBeNull();
    expect(interpretarRespuesta({ ...base, alumno: { id: "a1" } })).toBeNull();
    expect(interpretarRespuesta({ ...base, ocupacion: "12" })).toBeNull();
  });
});

describe("interpretarVinculacion", () => {
  it("acepta la forma del contrato", () => {
    expect(interpretarVinculacion({ ok: true, motivo: null })).toEqual({ ok: true, motivo: null });
  });

  it("rechaza null y objetos incompletos", () => {
    expect(interpretarVinculacion(null)).toBeNull();
    expect(interpretarVinculacion({ motivo: null })).toBeNull();
  });
});

describe("mensajeErrorRpc", () => {
  it("función inexistente", () => {
    expect(mensajeErrorRpc({ code: "PGRST202" }).titulo).toBe("Falta la base de datos del ingreso");
  });

  it("errores de permiso", () => {
    expect(mensajeErrorRpc({ code: "42501" }).titulo).toBe("Sin permiso");
    expect(mensajeErrorRpc({ code: "PGRST301" }).titulo).toBe("Sin permiso");
  });

  it("cualquier otro error: sin conexión", () => {
    expect(mensajeErrorRpc({ code: "" }).titulo).toBe("Sin conexión");
    expect(mensajeErrorRpc({}).titulo).toBe("Sin conexión");
  });
});

describe("enmascararUid", () => {
  it("muestra solo los 2 últimos bytes", () => {
    expect(enmascararUid("04:A3:7F:2B")).toBe("••:••:7F:2B");
    expect(enmascararUid("04:11:22:33:44:7F:2B")).toBe("••:••:••:••:••:7F:2B");
  });
});
