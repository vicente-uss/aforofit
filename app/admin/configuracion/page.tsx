import type { Metadata } from "next";
import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { requerirRol } from "@/lib/auth/perfil";
import { FormularioConfiguracion } from "./formulario-configuracion";

export const metadata: Metadata = {
  title: "Configuración · AforoFit",
};

async function Contenido() {
  // Solo el admin (D24); la base vuelve a validarlo en actualizar_configuracion.
  await requerirRol("admin");
  return <FormularioConfiguracion />;
}

export default function PaginaConfiguracion() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Contenido />
    </Suspense>
  );
}
