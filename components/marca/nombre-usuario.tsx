import { obtenerPerfil } from "@/lib/auth/perfil";

// Nombre del usuario con sesión, para la barra lateral (lectura en el servidor, sin cambios de lógica).
export async function NombreUsuario() {
  const perfil = await obtenerPerfil();
  return <>{perfil?.nombre ?? "Usuario"}</>;
}
