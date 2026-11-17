import { CargandoPanel } from "@/components/cargando-panel";
import { PanelRol } from "@/components/panel-rol";
import { requerirRol } from "@/lib/auth/perfil";
import { Suspense } from "react";

async function Contenido() {
  // La validación del rol se hace en el servidor.
  const perfil = await requerirRol("admin");

  return (
    <PanelRol
      perfil={perfil}
      secciones={[
        {
          titulo: "Máquinas e implementos",
          descripcion: "Catálogo con fotos y cantidades.",
        },
        {
          titulo: "Habilitación de alumnos",
          descripcion: "Certificado vigente según el período académico.",
        },
        {
          titulo: "Configuración",
          descripcion: "Capacidad, horario, período y parámetros.",
        },
        {
          titulo: "Reportes",
          descripcion: "Asistencia, horas peak y uso de máquinas.",
        },
      ]}
    />
  );
}

export default function PanelAdmin() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Contenido />
    </Suspense>
  );
}
