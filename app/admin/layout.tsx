import { Suspense, type ReactNode } from "react";
import { MarcoPanel } from "@/components/marca/marco-panel";
import { SalidaAdministracion } from "@/components/marca/modo-admin";
import { CargandoPanel } from "@/components/cargando-panel";
import { requerirAdministracion } from "@/lib/auth/perfil";

async function MarcoAdministracion({ children }: { children: ReactNode }) {
  const { perfil, venceEn } = await requerirAdministracion();
  return (
    <MarcoPanel
      rol="admin"
      usuario={perfil.nombre}
      controlModo={venceEn ? <SalidaAdministracion venceEn={venceEn} /> : null}
    >
      {children}
    </MarcoPanel>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <MarcoAdministracion>{children}</MarcoAdministracion>
    </Suspense>
  );
}
