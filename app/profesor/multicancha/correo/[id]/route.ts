import { requerirRol } from "@/lib/auth/perfil";
import { CORREO, UUID } from "@/lib/multicancha/agenda";
import { borradorCorreo, confirmacionReserva } from "@/lib/multicancha/correo";
import { cargarReglamento } from "@/lib/multicancha/reglamento";
import { createClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requerirRol("profesor");
  const { id } = await params;
  if (!UUID.test(id)) return new Response("Reserva inválida.", { status: 400 });
  const supabase = await createClient();
  const { data, error } = await supabase.from("multicancha_reservas")
    .select("fecha, hora_inicio, hora_fin, responsable, correo")
    .eq("id", id).eq("tipo", "ordinaria").is("cancelada_en", null).maybeSingle();
  if (error) return new Response("No se pudo consultar la reserva.", { status: 503 });
  if (!data?.responsable || !data.correo || !CORREO.test(data.correo)) {
    return new Response("Reserva activa no encontrada.", { status: 404 });
  }
  const adjunto = await cargarReglamento(supabase).catch(() => null);
  if (!adjunto) return new Response("No se pudo adjuntar el reglamento.", { status: 503 });
  const borrador = borradorCorreo(data.correo,
    confirmacionReserva({ ...data, responsable: data.responsable }, true, adjunto.provisional), adjunto);
  return new Response(new Blob([borrador]).stream(), {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": "message/rfc822",
      "Content-Disposition": 'attachment; filename="confirmacion-multicancha.eml"',
    },
  });
}
