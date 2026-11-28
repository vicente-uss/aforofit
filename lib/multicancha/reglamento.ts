import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { createClient } from "@/lib/supabase/server";

export const ARCHIVOS = {
  "reglamento.pdf": "application/pdf",
  "reglamento.docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;

type Cliente = Awaited<ReturnType<typeof createClient>>;

export async function buscarReglamento(supabase: Cliente) {
  const bucket = supabase.storage.from("multicancha");
  const { data, error } = await bucket.list("", { search: "reglamento" });
  const nombre = (Object.keys(ARCHIVOS) as (keyof typeof ARCHIVOS)[])
    .find((archivo) => data?.some((objeto) => objeto.name === archivo && objeto.id));
  return { bucket, nombre, error };
}

export async function cargarReglamento(supabase: Cliente) {
  const { bucket, nombre, error } = await buscarReglamento(supabase);
  if (error) throw new Error("reglamento_no_disponible");
  if (nombre) {
    const archivo = await bucket.download(nombre);
    if (!archivo.data) throw new Error("reglamento_no_disponible");
    return { nombre, mime: ARCHIVOS[nombre], contenido: Buffer.from(await archivo.data.arrayBuffer()), provisional: false };
  }
  const contenido = await readFile(join(process.cwd(), "lib/multicancha/recursos/reglamento-provisional.pdf"));
  return { nombre: "reglamento-provisional.pdf", mime: "application/pdf", contenido, provisional: true };
}
