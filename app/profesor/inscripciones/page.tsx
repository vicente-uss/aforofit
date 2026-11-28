import type { Metadata } from "next";
import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { requerirRol } from "@/lib/auth/perfil";
import { Inscripciones } from "./inscripciones";

export const metadata: Metadata = { title: "Inscripciones · AforoFit" };

async function Contenido() {
  const perfil = await requerirRol("profesor");
  return <Inscripciones profesorId={perfil.id} />;
}

export default function PaginaInscripciones() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Contenido />
    </Suspense>
  );
}
