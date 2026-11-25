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
          titulo: "Kiosco de ingreso",
          descripcion: "Pantalla del lector: entrada, salida, turno y vinculación de credenciales.",
          href: "/ingreso",
        },
        {
          titulo: "Aforo en vivo",
          descripcion: "Pantalla pública con la ocupación y el turno llamado.",
          href: "/aforo",
        },
        {
          titulo: "Lista de espera",
          descripcion: "Turnos en espera y llamado del siguiente.",
          href: "/profesor/espera",
        },
        {
          titulo: "Quiénes están adentro",
          descripcion: "Visitas abiertas y cierre a mano para quien no marcó la salida.",
          href: "/profesor/adentro",
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
          href: "/profesor/maquinas",
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
