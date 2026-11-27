export const CAMPOS = [
  { clave: "peso_kg", etiqueta: "Peso", unidad: "kg", min: 20, max: 400, ejemplo: "70,5" },
  { clave: "estatura_cm", etiqueta: "Estatura", unidad: "cm", min: 80, max: 250, ejemplo: "175" },
  { clave: "cintura_cm", etiqueta: "Cintura", unidad: "cm", min: 20, max: 300, ejemplo: "82" },
] as const;

export const METRICAS = [...CAMPOS, { clave: "imc", etiqueta: "IMC", unidad: "kg/m²" }] as const;
export type Metrica = (typeof METRICAS)[number]["clave"];
export type DatosMedicion = { fecha: string; peso_kg: number; estatura_cm: number; cintura_cm: number | null };
export type Medicion = DatosMedicion & { id: string; imc: number };

const numero = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 2 });
const cambio = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 2, signDisplay: "exceptZero" });
const dia = new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeZone: "UTC" });
const santiago = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Santiago" });

export function hoyEnSantiago(ahora = new Date()) {
  return santiago.format(ahora);
}

export function fechaVisible(fecha: string) {
  return dia.format(new Date(fecha + "T00:00:00Z"));
}

export function valorVisible(valor: number, unidad: string) {
  return numero.format(valor) + " " + unidad;
}

export function calcularImc(pesoKg: number, estaturaCm: number) {
  return pesoKg / (estaturaCm / 100) ** 2;
}

export function leerValor(texto: string, campo: (typeof CAMPOS)[number]) {
  const limpio = texto.trim();
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(limpio)) return null;
  const valor = Number(limpio.replace(",", "."));
  return valor >= campo.min && valor <= campo.max ? valor : null;
}

export function leerMedicion(formulario: FormData, hoy: string): DatosMedicion | string {
  const fecha = String(formulario.get("fecha") ?? "");
  const instante = new Date(fecha + "T00:00:00Z");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || fecha.startsWith("0000") ||
      !Number.isFinite(instante.getTime()) || instante.toISOString().slice(0, 10) !== fecha || fecha > hoy) {
    return "Ingresa una fecha válida, hasta hoy.";
  }

  const valores = CAMPOS.map((campo) => leerValor(String(formulario.get(campo.clave) ?? ""), campo));
  const [peso_kg, estatura_cm, cintura_cm] = valores;
  const indice = valores.findIndex((valor, i) =>
    valor === null && (i !== 2 || String(formulario.get("cintura_cm") ?? "").trim() !== ""),
  );
  if (indice !== -1) {
    const campo = CAMPOS[indice];
    return `${campo.etiqueta}: ingresa un valor entre ${campo.min} y ${campo.max} ${campo.unidad}, con hasta dos decimales.`;
  }
  if (peso_kg === null || estatura_cm === null) return "Completa el peso y la estatura.";
  return { fecha, peso_kg, estatura_cm, cintura_cm };
}

export function diferenciaVisible(desde: number | null, hasta: number | null, unidad: string) {
  if (desde === null || hasta === null) return "Sin comparación";
  return cambio.format(Math.round((hasta - desde) * 100) / 100) + " " + unidad;
}

export function ordenarHistorial(mediciones: Medicion[]) {
  return [...mediciones].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));
}

export function serieCronologica(historial: Medicion[], metrica: Metrica) {
  return ordenarHistorial(historial).reverse().flatMap((medicion) => {
    const valor = medicion[metrica];
    return valor === null ? [] : [{ id: medicion.id, fecha: medicion.fecha, valor }];
  });
}
