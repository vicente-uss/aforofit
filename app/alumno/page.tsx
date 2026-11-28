import { ArrowRight, CalendarDays, ClipboardList, History, Ruler } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { MarcoAlumno } from "@/components/marca/marco-alumno";
import { Tarjeta } from "@/components/marca/tarjeta";
import { requerirRol } from "@/lib/auth/perfil";
import { AvisoTne } from "./aviso-tne";
import { QrIngreso } from "./qr-ingreso";
import { RutinaAlumno } from "./rutina-alumno";

async function Contenido() {
  // La validación del rol se hace en el servidor.
  const perfil = await requerirRol("alumno");

  return (
    <MarcoAlumno titulo="Mi rutina" subtitulo={`Hola, ${perfil.nombre}`}>
      <AvisoTne key={perfil.id} />
      {/* B1, B3 y B4 del CR-01: objetivo y nivel, rutina del día en tiempo real y feedback. */}
      <QrIngreso />
      <RutinaAlumno />

      <Link href="/alumno/rutinas" className="block rounded-2xl">
        <Tarjeta className="flex items-center gap-3 p-3 transition-shadow hover:shadow-lift">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <ClipboardList className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-navy-900">Mis rutinas</p>
            <p className="text-xs text-tinta-suave">Crea una rutina o elige cuál usar.</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-blue-600" aria-hidden />
        </Tarjeta>
      </Link>

      <Link href="/alumno/reservas" className="block rounded-2xl">
        <Tarjeta className="flex items-center gap-3 p-3 transition-shadow hover:shadow-lift">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <CalendarDays className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-navy-900">Mis reservas</p>
            <p className="text-xs text-tinta-suave">Consulta tus horarios y edita la nómina de tu equipo.</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-blue-600" aria-hidden />
        </Tarjeta>
      </Link>

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
