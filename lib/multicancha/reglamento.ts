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
