import { ArrowRight, ClipboardList, History, Ruler } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { Insignia } from "@/components/marca/insignia";
import { MarcoAlumno } from "@/components/marca/marco-alumno";
import { Tarjeta } from "@/components/marca/tarjeta";
import { requerirRol } from "@/lib/auth/perfil";
import { QrIngreso } from "./qr-ingreso";
import { RutinaAlumno } from "./rutina-alumno";

// Pospuestas por el CR-01 (sección 4.4): se muestran como «Próxima versión».
const PROXIMAS = [
  { titulo: "Mis rutinas", descripcion: "Elige tu rutina activa o crea una propia.", icono: ClipboardList },
];

async function Contenido() {
  // La validación del rol se hace en el servidor.
  const perfil = await requerirRol("alumno");

  return (
    <MarcoAlumno titulo="Mi rutina" subtitulo={`Hola, ${perfil.nombre}`}>
      {/* B1, B3 y B4 del CR-01: objetivo y nivel, rutina del día en tiempo real y feedback. */}
      <QrIngreso />
      <RutinaAlumno />

      {/* F-33: consulta verificable de lo que quedó guardado (visitas, cierres y feedback). */}
      <Link href="/alumno/historial" className="block rounded-2xl">
        <Tarjeta className="flex items-center gap-3 p-3 transition-shadow hover:shadow-lift">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <History className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-navy-900">Mi historial</p>
            <p className="text-xs text-tinta-suave">Tus visitas al gimnasio y tu feedback.</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-blue-600" aria-hidden />
        </Tarjeta>
      </Link>

      <Link href="/alumno/medidas" className="block rounded-2xl">
        <Tarjeta className="flex items-center gap-3 p-3 transition-shadow hover:shadow-lift">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Ruler className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-navy-900">Registro corporal</p>
            <p className="text-xs text-tinta-suave">Anota tus medidas y revisa tu evolución.</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-blue-600" aria-hidden />
        </Tarjeta>
      </Link>

      <section aria-label="Próxima versión" className="space-y-2 pt-4">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-600">Próxima versión</h2>
        {PROXIMAS.map(({ titulo, descripcion, icono: Icono }) => (
          <Tarjeta key={titulo} className="flex items-center gap-3 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Icono className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-navy-900">{titulo}</p>
              <p className="text-xs text-tinta-suave">{descripcion}</p>
            </div>
            <Insignia tono="neutral" tamano="sm">
              Próximamente
            </Insignia>
          </Tarjeta>
        ))}
      </section>
    </MarcoAlumno>
  );
}

export default function PanelAlumno() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Contenido />
    </Suspense>
  );
}
