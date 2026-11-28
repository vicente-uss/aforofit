import { Suspense, type ReactNode } from "react";
import { MarcoPanel } from "@/components/marca/marco-panel";
import { NombreUsuario } from "@/components/marca/nombre-usuario";
import { EntradaAdministracion } from "@/components/marca/modo-admin";
import { obtenerPerfil } from "@/lib/auth/perfil";

async function ControlAdministracion() {
  const perfil = await obtenerPerfil();
  return perfil?.rol === "profesor" && perfil.email === "profesor.demo@aforofit.cl"
    ? <EntradaAdministracion />
    : null;
}

// Contenedor visual de /profesor/*. La validación del rol sigue en cada página (requerirRol).
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <MarcoPanel
      rol="profesor"
      controlModo={<Suspense><ControlAdministracion /></Suspense>}
      usuario={
        <Suspense fallback="…">
          <NombreUsuario />
        </Suspense>
      }
    >
      {children}
    </MarcoPanel>
  );
}
