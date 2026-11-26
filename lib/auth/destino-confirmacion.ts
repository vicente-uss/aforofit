// Son los dos destinos del flujo de correo. Se devuelve una ruta constante.
export function destinoConfirmacion(next: string | null, tipo: string | null) {
  if (next === "/auth/update-password" || (next === null && tipo === "recovery")) {
    return "/auth/update-password";
  }
  return "/";
}
