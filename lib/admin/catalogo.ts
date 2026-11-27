const extensiones: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const TIPOS_FOTO = Object.keys(extensiones).join(",");
export const MAX_BYTES_FOTO = 2 * 1024 * 1024;

export async function extensionFoto(archivo: File): Promise<string | null> {
  if (!Object.hasOwn(extensiones, archivo.type) || archivo.size === 0 || archivo.size > MAX_BYTES_FOTO) {
    return null;
  }
  const bytes = new Uint8Array(await archivo.slice(0, 12).arrayBuffer());
  const comienzaCon = (firma: number[], desde = 0) =>
    firma.every((byte, indice) => bytes[desde + indice] === byte);
  const extension = extensiones[archivo.type];
  const valida = {
    jpg: comienzaCon([0xff, 0xd8, 0xff]),
    png: comienzaCon([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    webp: comienzaCon([82, 73, 70, 70]) && comienzaCon([87, 69, 66, 80], 8),
  };
  return valida[extension as keyof typeof valida] ? extension : null;
}

export function cantidadInventario(valor: string): number | null {
  if (!/^\d+$/.test(valor)) return null;
  const cantidad = Number(valor);
  return cantidad <= 2_147_483_647 ? cantidad : null;
}

export function mensajeCatalogo(error: { code: string; message: string }, maquinas: boolean) {
  if (error.code === "23503") return maquinas
    ? "Esta máquina está asociada a una plantilla o rutina. Puedes editarla o dejarla en mantención."
    : "Este implemento está asociado al historial de préstamos y se debe conservar.";
  if (error.code === "23505") return "Ya existe un implemento con ese nombre.";
  if (error.message === "inventario_menor_que_prestado") {
    return "La cantidad total debe cubrir las unidades que siguen prestadas.";
  }
  if (error.code === "42501") return "Tu sesión no puede gestionar el catálogo.";
  return "No pudimos completar la operación. Actualiza el catálogo antes de volver a intentar.";
}
