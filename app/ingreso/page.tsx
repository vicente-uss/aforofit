import type { Metadata } from "next";
import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { requerirAlgunRol } from "@/lib/auth/perfil";
import { ROLES_KIOSCO } from "@/lib/auth/roles";
import { PantallaIngreso } from "./pantalla-ingreso";

export const metadata: Metadata = {
  title: "Ingreso · AforoFit",
};

// Kiosco del computador de la entrada. Exige la sesión de un profesor o admin, porque solo ellos
// pueden ejecutar registrar_ingreso en la base de datos. El computador del gimnasio queda con la
// sesión del profesor abierta.
async function Contenido() {
  await requerirAlgunRol(ROLES_KIOSCO);
  return <PantallaIngreso />;
}

export default function PaginaIngreso() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Contenido />
    </Suspense>
  );
}
