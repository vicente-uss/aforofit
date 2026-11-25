import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { requerirRol } from "@/lib/auth/perfil";
import { Habilitacion } from "./habilitacion";

async function Contenido() {
  await requerirRol("admin");
  return <Habilitacion />;
}

export default function Pagina() {
  return <Suspense fallback={<CargandoPanel />}><Contenido /></Suspense>;
}
