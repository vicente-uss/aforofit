import type { KeyboardEvent } from "react";

// Los lectores HID terminan cada código con Enter.
export function capturarLectura(evento: KeyboardEvent<HTMLInputElement>, procesar: (texto: string) => void) {
  if (evento.key !== "Enter") return;
  evento.preventDefault();
  const texto = evento.currentTarget.value.trim();
  evento.currentTarget.value = "";
  if (texto) procesar(texto);
}
