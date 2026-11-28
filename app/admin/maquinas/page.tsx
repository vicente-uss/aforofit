import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { requerirAdministracion } from "@/lib/auth/perfil";
import { Catalogo } from "../catalogo";

export const metadata = { title: "Máquinas · AforoFit" };

async function Contenido() {
  await requerirAdministracion();
  return <Catalogo tipo="maquinas" />;
}

export default function PaginaMaquinas() {
  return <Suspense fallback={<CargandoPanel />}><Contenido /></Suspense>;
}
