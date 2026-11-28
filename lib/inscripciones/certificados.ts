export const BUCKET_CERTIFICADOS = "certificados";
export const MAX_CERTIFICADO = 10 * 1024 * 1024;
export const TIPOS_CERTIFICADO = ["application/pdf", "image/jpeg", "image/png"];

export function errorCertificado(archivo: Pick<File, "size" | "type">): string | null {
  if (archivo.size === 0) return "El archivo está vacío.";
  if (archivo.size > MAX_CERTIFICADO) return "El archivo supera los 10 MB.";
  if (!TIPOS_CERTIFICADO.includes(archivo.type)) return "Elige un PDF, JPG o PNG.";
  return null;
}
