import { requerirAlgunRol } from "@/lib/auth/perfil";
import { ARCHIVOS, buscarReglamento } from "@/lib/multicancha/reglamento";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  await requerirAlgunRol(["profesor", "alumno"]);
  const { bucket, nombre, error } = await buscarReglamento(await createClient());
  if (error) return new Response("No se pudo consultar el reglamento.", { status: 503 });
  if (!nombre) return new Response("El reglamento oficial aún no está disponible.", { status: 404 });
  const descarga = await bucket.download(nombre);
  if (!descarga.data) return new Response("No se pudo descargar el reglamento.", { status: 503 });
  return new Response(descarga.data.stream(), {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": ARCHIVOS[nombre],
      "Content-Disposition": `attachment; filename="${nombre}"`,
    },
  });
}
