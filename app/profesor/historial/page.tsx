import type { Metadata } from "next";
import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { requerirRol } from "@/lib/auth/perfil";
import { HistorialProfesor } from "./historial-profesor";

export const metadata: Metadata = {
  title: "Historial · AforoFit",
};

async function Contenido() {
  // La validación del rol se hace en el servidor, como en las demás pantallas del profesor.
  await requerirRol("profesor");
  return <HistorialProfesor />;
}

export default function PaginaHistorialProfesor() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Contenido />
    </Suspense>
  );
}
