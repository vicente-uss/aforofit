"use server";

import { revalidatePath } from "next/cache";
import { requerirAlgunRol, requerirRol } from "@/lib/auth/perfil";
import { createClient } from "@/lib/supabase/server";
import { CORREO, fechaValida, HORA, RUTA_ALUMNO, RUTA_PROFESOR, rutIntegrante, UUID } from "./agenda";

type Resultado = { error?: string; exito?: string };

const MENSAJES: Record<string, string> = {
  sin_permiso: "No tienes permiso para realizar esta operación.",
  multicancha_version: "La reserva cambió. Actualiza el calendario o Mis reservas y vuelve a intentar.",
  multicancha_superposicion: "Hay un bloque activo que coincide con ese horario. Para registrar una actividad institucional, primero reprograma o cancela la reserva que coincide.",
  multicancha_modulo: "Selecciona un módulo habilitado para esa fecha.",
  multicancha_horario: "Indica un horario válido dentro del mismo día.",
  multicancha_pasado: "El nuevo horario debe comenzar en el futuro.",
  multicancha_cambio_hora: "Ese horario coincide con una hora inexistente o repetida en Santiago. Elige otra hora.",
  multicancha_datos: "Revisa los campos de la reserva.",
  multicancha_nomina: "Revisa el nombre, el RUT y la carrera de cada integrante.",
  multicancha_rut_repetido: "Hay un RUT repetido en la nómina.",
};

function campo(datos: FormData, clave: string) {
  const valor = datos.get(clave);
  return typeof valor === "string" ? valor.trim() : "";
}

function textoValido(valor: string) {
  return valor.length > 0 && valor.length <= 160;
}

function resultado(error: { message: string } | null, exito: string): Resultado {
  if (error) return { error: Object.hasOwn(MENSAJES, error.message)
    ? MENSAJES[error.message] : "No se pudo guardar el cambio. Vuelve a intentar." };
  revalidatePath(RUTA_PROFESOR);
  revalidatePath(RUTA_ALUMNO);
  return { exito };
}

export async function guardarReserva(_: Resultado, datos: FormData): Promise<Resultado> {
  await requerirRol("profesor");
  const id = campo(datos, "id");
  const version = campo(datos, "version");
  const fecha = campo(datos, "fecha");
  const tipo = campo(datos, "tipo");
  if ((id && (!UUID.test(id) || !UUID.test(version))) || !fechaValida(fecha)) {
    return { error: "Selecciona una fecha válida y vuelve a intentar." };
  }

  const comunes = { p_fecha: fecha, p_tipo: tipo, p_id: id || null, p_version: version || null };
  const supabase = await createClient();
  if (tipo === "ordinaria") {
    const modulo = campo(datos, "modulo");
    const responsable = campo(datos, "responsable");
    const carrera = campo(datos, "carrera");
    const correo = campo(datos, "correo").toLowerCase();
    if ((!modulo && !id) || (modulo && (!/^\d{1,5}$/.test(modulo) || Number(modulo) < 1 || Number(modulo) > 32767))) {
      return { error: MENSAJES.multicancha_modulo };
    }
    if (!textoValido(responsable) || !textoValido(carrera) || correo.length > 254 || !CORREO.test(correo)) {
      return { error: "Completa el nombre, la carrera y un correo válido." };
    }
    const { error } = await supabase.rpc("guardar_multicancha", {
      ...comunes, p_modulo: modulo ? Number(modulo) : null,
      p_responsable: responsable, p_carrera: carrera, p_correo: correo,
    });
    return resultado(error, id ? "Reserva actualizada." : "Reserva creada.");
  }

  if (tipo !== "institucional" && tipo !== "bloqueo") return { error: MENSAJES.multicancha_datos };
  const inicio = campo(datos, "inicio");
  const fin = campo(datos, "fin");
  const titulo = campo(datos, "titulo");
  if (!HORA.test(inicio) || (!HORA.test(fin) && fin !== "24:00") || inicio >= fin) {
    return { error: MENSAJES.multicancha_horario };
  }
  if (!textoValido(titulo)) return { error: "Indica el nombre de la actividad o el motivo del bloqueo." };
  const { error } = await supabase.rpc("guardar_multicancha", {
    ...comunes, p_hora_inicio: inicio, p_hora_fin: fin, p_titulo: titulo,
  });
  return resultado(error, id ? "Bloque actualizado." : "Bloque creado.");
}

export async function cancelarReserva(_: Resultado, datos: FormData): Promise<Resultado> {
  await requerirRol("profesor");
  const id = campo(datos, "id");
  const version = campo(datos, "version");
  if (!UUID.test(id) || !UUID.test(version)) return { error: MENSAJES.multicancha_version };
  const supabase = await createClient();
  const { error } = await supabase.rpc("cancelar_multicancha", { p_id: id, p_version: version });
  return resultado(error, "Bloque cancelado. Puedes consultarlo en el historial.");
}

export async function guardarNomina(_: Resultado, datos: FormData): Promise<Resultado> {
  await requerirAlgunRol(["profesor", "alumno"]);
  const id = campo(datos, "id");
  const version = campo(datos, "version");
  if (!UUID.test(id) || !UUID.test(version)) return { error: MENSAJES.multicancha_version };
  const nombres = datos.getAll("nombre");
  const ruts = datos.getAll("rut");
  const carreras = datos.getAll("carrera");
  if (nombres.length !== ruts.length || nombres.length !== carreras.length) return { error: MENSAJES.multicancha_nomina };
  const integrantes = [];
  const usados = new Set<string>();
  for (const [indice, nombre] of nombres.entries()) {
    const rut = ruts[indice];
    const carrera = carreras[indice];
    if (typeof nombre !== "string" || typeof rut !== "string" || typeof carrera !== "string") {
      return { error: MENSAJES.multicancha_nomina };
    }
    const normalizado = rutIntegrante(rut);
    if (!normalizado || !textoValido(nombre.trim()) || !textoValido(carrera.trim())) {
      return { error: `Revisa los datos del integrante ${indice + 1}. Ingresa un RUT válido con guion.` };
    }
    if (usados.has(normalizado)) return { error: MENSAJES.multicancha_rut_repetido };
    usados.add(normalizado);
    integrantes.push({ nombre: nombre.trim(), rut: normalizado, carrera: carrera.trim() });
  }
  const supabase = await createClient();
  const { error } = await supabase.rpc("guardar_nomina_multicancha", {
    p_id: id, p_version: version, p_integrantes: integrantes,
  });
  return resultado(error, "Nómina actualizada.");
}
