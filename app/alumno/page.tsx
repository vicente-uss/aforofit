import { CargandoPanel } from "@/components/cargando-panel";
import { PanelRol } from "@/components/panel-rol";
import { requerirRol } from "@/lib/auth/perfil";
import { Suspense } from "react";

async function Contenido() {
  // La validación del rol se hace en el servidor.
  const perfil = await requerirRol("alumno");

  return (
    <PanelRol
      perfil={perfil}
      secciones={[
        {
          titulo: "Mi rutina",
          descripcion: "Tu rutina del día con pesos, ajustes y avisos de máquinas.",
        },
        {
          titulo: "Mis rutinas",
          descripcion: "Elige tu rutina activa o crea una propia.",
        },
        {
          titulo: "Registro corporal",
          descripcion: "Anota tu peso y perímetros y revisa tu evolución.",
        },
        {
          titulo: "Historial",
          descripcion: "Tus visitas al gimnasio y tu feedback.",
        },
      ]}
    />
  );
}

export default function PanelAlumno() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Contenido />
    </Suspense>
  );
}
