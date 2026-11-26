import { ClipboardList, History, ListOrdered, Monitor, Package, ScanLine, Users, Wrench } from "lucide-react";
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
          icono: ScanLine,
          color: "navy",
        },
        {
          titulo: "Aforo en vivo",
          descripcion: "Pantalla pública con la ocupación y el turno llamado.",
          href: "/aforo",
          icono: Monitor,
          color: "blue",
        },
        {
          titulo: "Lista de espera",
          descripcion: "Turnos en espera y llamado del siguiente.",
          href: "/profesor/espera",
          icono: ListOrdered,
          color: "amber",
        },
        {
          titulo: "Quiénes están adentro",
          descripcion: "Visitas abiertas y cierre a mano para quien no marcó la salida.",
          href: "/profesor/adentro",
          icono: Users,
          color: "green",
        },
        {
          titulo: "Préstamos",
          descripcion: "Entrega y devolución de implementos con la TNE.",
          href: "/profesor/prestamos",
          icono: Package,
          color: "violet",
        },
        {
          titulo: "Asignar rutinas",
          descripcion: "Crea o asigna rutinas a los alumnos.",
          icono: ClipboardList,
        },
        {
          titulo: "Mantención",
          descripcion: "Marca máquinas como disponibles o en mantención.",
          href: "/profesor/maquinas",
          icono: Wrench,
          color: "amber",
        },
        {
          titulo: "Historial",
          descripcion: "Visitas y préstamos de un día, con el tipo de cierre. Solo lectura.",
          href: "/profesor/historial",
          icono: History,
          color: "blue",
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
