import type { Metadata } from "next";
import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { requerirRol } from "@/lib/auth/perfil";
import { EstadoMaquinas } from "./estado-maquinas";

export const metadata: Metadata = {
  title: "Estado de máquinas · AforoFit",
};

async function Contenido() {
  // La validación del rol se hace en el servidor; la base vuelve a validarlo en cambiar_estado_maquina.
  await requerirRol("profesor");
  return <EstadoMaquinas />;
}

export default function PaginaMaquinas() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Contenido />
    </Suspense>
  );
}
