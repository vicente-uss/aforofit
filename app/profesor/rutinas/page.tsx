import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { BuscarRutinasAlumno } from "@/components/rutinas/gestor-rutinas";
import { requerirRol } from "@/lib/auth/perfil";

async function Contenido() {
  await requerirRol("profesor");
  return <BuscarRutinasAlumno />;
}

export default function Pagina() {
  return <Suspense fallback={<CargandoPanel />}><Contenido /></Suspense>;
}
