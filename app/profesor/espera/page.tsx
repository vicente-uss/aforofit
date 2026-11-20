import type { Metadata } from "next";
import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { requerirRol } from "@/lib/auth/perfil";
import { ListaEspera } from "./lista-espera";

export const metadata: Metadata = {
  title: "Lista de espera · AforoFit",
};

async function Contenido() {
  // La validación del rol se hace en el servidor.
  await requerirRol("profesor");
  return <ListaEspera />;
}

export default function PaginaEspera() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Contenido />
    </Suspense>
  );
}
