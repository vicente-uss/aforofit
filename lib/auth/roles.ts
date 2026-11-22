// Roles de AforoFit y sus paneles. Se usa en el servidor, el proxy y el cliente.
export type Rol = "alumno" | "profesor" | "admin";

export const ROLES: Rol[] = ["alumno", "profesor", "admin"];

// Roles que pueden usar el kiosco /ingreso (CU11: ambos vinculan credenciales).
export const ROLES_KIOSCO: Rol[] = ["profesor", "admin"];

export const ETIQUETA_ROL: Record<Rol, string> = {
  alumno: "Alumno",
  profesor: "Profesor encargado",
  admin: "Administrador",
};

export function esRol(valor: unknown): valor is Rol {
  return typeof valor === "string" && (ROLES as string[]).includes(valor);
}

export function panelDeRol(rol: Rol): string {
  return `/${rol}`;
}
