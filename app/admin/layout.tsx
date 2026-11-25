import { Suspense, type ReactNode } from "react";
import { MarcoPanel } from "@/components/marca/marco-panel";
import { NombreUsuario } from "@/components/marca/nombre-usuario";

// Contenedor visual de /admin/*. La validación del rol sigue en cada página (requerirRol).
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <MarcoPanel
      rol="admin"
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
