import { CargandoPanel } from "@/components/cargando-panel";
import { PanelRol } from "@/components/panel-rol";
import { requerirRol } from "@/lib/auth/perfil";
import { Suspense } from "react";

async function Contenido() {
  // La validación del rol se hace en el servidor.
  const perfil = await requerirRol("profesor");

  return (
    <PanelRol
      perfil={perfil}
      secciones={[
        {
          titulo: "Aforo en vivo",
          descripcion: "Quiénes están dentro y cuántos cupos quedan.",
        },
        {
          titulo: "Lista de espera",
          descripcion: "Turnos en espera y llamado del siguiente.",
        },
        {
          titulo: "Préstamos",
          descripcion: "Entrega y devolución de implementos con la TNE.",
        },
        {
          titulo: "Asignar rutinas",
          descripcion: "Crea o asigna rutinas a los alumnos.",
        },
        {
          titulo: "Mantención",
          descripcion: "Marca máquinas como disponibles o en mantención.",
        },
      ]}
    />
  );
}

export default function PanelProfesor() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Contenido />
    </Suspense>
  );
}
