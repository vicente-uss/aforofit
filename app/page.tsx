import { CargandoPanel } from "@/components/cargando-panel";
import { obtenerPerfil } from "@/lib/auth/perfil";
import { panelDeRol } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Redireccion(): Promise<React.ReactNode> {
  const perfil = await obtenerPerfil();
  return redirect(perfil ? panelDeRol(perfil.rol) : "/auth/login");
}

// "/" no muestra contenido: sin sesión va al login, con sesión al panel del rol.
export default function Home() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Redireccion />
    </Suspense>
  );
}
