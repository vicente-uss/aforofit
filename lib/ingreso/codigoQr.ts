export function esCodigoIngreso(texto: string) {
  return /^[GHJKMNPQRSTVWXYZ][A-HJ-NP-Z2-9]{5}$/.test(texto.trim().toUpperCase());
}
