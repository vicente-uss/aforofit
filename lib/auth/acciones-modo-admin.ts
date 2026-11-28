"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requerirRol } from "./perfil";

export async function activarAdministracion(_estado: string, formulario: FormData) {
  await requerirRol("profesor");
  const pin = formulario.get("pin");
  if (typeof pin !== "string" || !/^[0-9]{6}$/.test(pin)) {
    return "Ingresa un PIN de seis dígitos.";
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("activar_modo_admin", { p_pin: pin });
  if (error) return "No se pudo activar Administración. Intenta nuevamente.";
  if (data === "pin_incorrecto") return "PIN incorrecto.";
  if (data === "bloqueado") return "Demasiados intentos. Vuelve a intentar en 5 minutos.";
  if (data !== "activado") return "Administración no está disponible para esta cuenta.";

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function desactivarAdministracion() {
  await requerirRol("profesor");
  const supabase = await createClient();
  const { error } = await supabase.rpc("desactivar_modo_admin");
  if (error) return "No se pudo volver al modo profesor. Intenta nuevamente.";

  revalidatePath("/admin", "layout");
  redirect("/profesor");
}
