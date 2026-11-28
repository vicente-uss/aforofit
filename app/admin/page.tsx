import { ChartColumn, Dumbbell, Package, ScanLine, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { CargandoPanel } from "@/components/cargando-panel";
import { PanelRol } from "@/components/panel-rol";
import { requerirAdministracion } from "@/lib/auth/perfil";
import { Suspense } from "react";

async function Contenido() {
  // La validación del rol se hace en el servidor.
  const { perfil } = await requerirAdministracion();

  return (
    <PanelRol
      perfil={{ ...perfil, rol: "admin" }}
      secciones={[
        {
          titulo: "Kiosco de ingreso",
          descripcion: "Pantalla del lector: entrada, salida, turno y vinculación de credenciales.",
          href: "/ingreso",
          icono: ScanLine,
          color: "navy",
        },
        {
          titulo: "Máquinas",
          descripcion: "Administra las fichas, fotos y estados de las máquinas.",
          href: "/admin/maquinas",
          icono: Dumbbell,
          color: "blue",
        },
        {
          titulo: "Implementos",
          descripcion: "Administra el inventario y consulta las unidades prestadas.",
          href: "/admin/implementos",
          icono: Package,
          color: "navy",
        },
        {
          titulo: "Habilitación de personas",
          descripcion: "Certificado vigente: un año desde su emisión (D20).",
          href: "/admin/habilitacion",
          icono: ShieldCheck,
          color: "green",
        },
        {
          titulo: "Configuración",
          descripcion: "Capacidad, horario y cierre automático.",
          href: "/admin/configuracion",
          icono: SlidersHorizontal,
          color: "blue",
        },
        {
          titulo: "Reportes",
          descripcion: "Asistencia, horas peak y uso de máquinas.",
          icono: ChartColumn,
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
