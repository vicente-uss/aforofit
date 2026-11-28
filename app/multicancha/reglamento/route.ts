import { requerirAlgunRol } from "@/lib/auth/perfil";
import { cargarReglamento } from "@/lib/multicancha/reglamento";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  await requerirAlgunRol(["profesor", "alumno"]);
  const reglamento = await cargarReglamento(await createClient()).catch(() => null);
  if (!reglamento) return new Response("No se pudo descargar el reglamento.", { status: 503 });
  return new Response(new Blob([new Uint8Array(reglamento.contenido)]).stream(), {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": reglamento.mime,
      "Content-Disposition": `attachment; filename="${reglamento.nombre}"`,
    },
  });
}
