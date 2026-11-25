import type { Metadata } from "next";
import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { requerirRol } from "@/lib/auth/perfil";
import { ListaAdentro } from "./lista-adentro";

export const metadata: Metadata = {
  title: "Quiénes están adentro · AforoFit",
};

async function Contenido() {
  // La validación del rol se hace en el servidor; la base vuelve a validarlo en cerrar_visita.
  await requerirRol("profesor");
  return <ListaAdentro />;
}

export default function PaginaAdentro() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Contenido />
    </Suspense>
  );
}
