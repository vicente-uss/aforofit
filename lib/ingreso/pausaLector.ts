type EventoLector = "sin_foco" | "oculta" | "visible" | "lector_reactivado";

// Volver a la pestaña conserva el aviso hasta confirmar el foco con el botón.
export function pausaLector(enPausa: boolean, evento: EventoLector): boolean {
  if (evento === "lector_reactivado") return false;
  return enPausa || evento === "sin_foco" || evento === "oculta";
}
