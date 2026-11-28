import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { requerirAdministracion } from "@/lib/auth/perfil";
import { Catalogo } from "../catalogo";

export const metadata = { title: "Implementos · AforoFit" };

async function Contenido() {
  await requerirAdministracion();
  return <Catalogo tipo="implementos" />;
}

export default function PaginaImplementos() {
  return <Suspense fallback={<CargandoPanel />}><Contenido /></Suspense>;
}
