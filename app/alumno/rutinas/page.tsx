import Link from "next/link";
import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { MarcoAlumno } from "@/components/marca/marco-alumno";
import { GestorRutinas } from "@/components/rutinas/gestor-rutinas";
import { requerirRol } from "@/lib/auth/perfil";
import { createClient } from "@/lib/supabase/server";

async function Contenido() {
  const perfil = await requerirRol("alumno");
  const supabase = await createClient();
  const { data: alumno, error } = await supabase.from("alumnos").select("id").eq("perfil_id", perfil.id).maybeSingle();

  return (
    <MarcoAlumno titulo="Mis rutinas">
      <Link className="inline-block text-sm font-medium text-blue-700 underline" href="/alumno">Volver a mi rutina del día</Link>
      {alumno ? <GestorRutinas rol="alumno" alumnoId={alumno.id} /> :
        <p role="status">{error ? "No pudimos cargar tu cuenta." : "Pide al profesor que vincule tu cuenta con el gimnasio."}</p>}
    </MarcoAlumno>
  );
}

export default function Pagina() {
  return <Suspense fallback={<CargandoPanel />}><Contenido /></Suspense>;
}
