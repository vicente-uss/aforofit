import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { esRol, panelDeRol, type Rol } from "./roles";

export type Perfil = {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
};

/**
 * Lee el perfil del usuario con sesión (solo en el servidor).
 * Devuelve null si no hay sesión o no existe su perfil.
 */
export async function obtenerPerfil(): Promise<Perfil | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("id, nombre, rol")
    .eq("id", claims.sub)
    .maybeSingle();

  if (!perfil || !esRol(perfil.rol)) return null;

  return {
    id: perfil.id,
    nombre: perfil.nombre ?? claims.email ?? "Usuario",
    email: claims.email ?? "",
    rol: perfil.rol,
  };
}

/**
 * Valida en el servidor que el usuario tenga el rol exigido.
 * Sin sesión va al login; con otro rol va a su propio panel.
 */
export async function requerirRol(rol: Rol): Promise<Perfil> {
  const perfil = await obtenerPerfil();
  if (!perfil) redirect("/auth/login");
  if (perfil.rol !== rol) redirect(panelDeRol(perfil.rol));
  return perfil;
}
