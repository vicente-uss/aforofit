import { CargandoPanel } from "@/components/cargando-panel";
import { PanelRol } from "@/components/panel-rol";
import { requerirRol } from "@/lib/auth/perfil";
import { Suspense } from "react";
import { RutinaAlumno } from "./rutina-alumno";

async function Contenido() {
  // La validación del rol se hace en el servidor.
  const perfil = await requerirRol("alumno");

  return (
    <PanelRol
      perfil={perfil}
      tituloSecciones="Próxima versión"
      secciones={[
        // Pospuestas por el CR-01 (sección 4.4): se muestran como «Próximamente».
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
    >
      {/* B1, B3 y B4 del CR-01: objetivo y nivel, rutina del día en tiempo real y feedback. */}
      <RutinaAlumno />
    </PanelRol>
  );
}

export default function PanelAlumno() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Contenido />
    </Suspense>
  );
}
