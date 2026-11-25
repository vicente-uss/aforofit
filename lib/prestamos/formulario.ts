export type Alumno = { id: string; nombre: string; certificado_hasta: string | null };
export type Stock = { id: number; nombre: string; disponible: number };

export function armarItems(stock: Stock[], cantidades: Record<number, string>) {
  const items: { implemento_id: number; cantidad: number }[] = [];
  for (const implemento of stock) {
    const texto = cantidades[implemento.id];
    if (!texto || texto === "0") continue;
    const cantidad = Number(texto);
    if (!/^\d+$/.test(texto) || !Number.isSafeInteger(cantidad) || cantidad > implemento.disponible || cantidad < 1) return null;
    items.push({ implemento_id: implemento.id, cantidad });
  }
  return items.length ? items : null;
}

export function hoyEnChile(fecha = new Date()) {
  return fecha.toLocaleDateString("sv-SE", { timeZone: "America/Santiago" });
}

export function vigencia(hasta: string | null, hoy: string) {
  if (!hasta) return "sinFecha";
  return hasta >= hoy ? "vigente" : "vencido";
}

export function fechaChilena(iso: string) {
  return iso.split("-").reverse().join("-");
}
