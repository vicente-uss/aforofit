import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { requerirRol } from "@/lib/auth/perfil";
import { Prestamos } from "./prestamos";

async function Contenido() {
  await requerirRol("profesor");
  return <Prestamos />;
}

export default function Pagina() {
  return <Suspense fallback={<CargandoPanel />}><Contenido /></Suspense>;
}
