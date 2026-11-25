import type { ReactNode } from "react";
import { LogoutButton } from "@/components/logout-button";
import { LogoMark } from "./logo";

// Contenedor del celular del alumno: columna centrada de 440 px como máximo sobre #e9eef6,
// con encabezado fijo. Sin barra inferior: las pantallas del prototipo que la usan no existen aún.
export function MarcoAlumno({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-svh bg-[#e9eef6]">
      <div className="mx-auto flex min-h-svh w-full max-w-[440px] flex-col bg-canvas shadow-lift">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-white/90 px-4 py-3 backdrop-blur">
          <LogoMark tamano="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[17px] font-semibold leading-tight text-navy-900">{titulo}</p>
            {subtitulo && <p className="truncate text-xs text-tinta-suave">{subtitulo}</p>}
          </div>
          <LogoutButton />
        </header>
        <main className="flex-1 space-y-4 p-4">{children}</main>
      </div>
    </div>
  );
}
