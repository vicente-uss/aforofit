import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Tarjeta del prototipo: borde line, fondo blanco y sombra suave.
export function Tarjeta({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-line bg-white shadow-card", className)} {...props} />;
}

// Encabezado dentro de una tarjeta: título, subtítulo y una acción a la derecha.
export function EncabezadoTarjeta({
  titulo,
  subtitulo,
  accion,
  className,
}: {
  titulo: ReactNode;
  subtitulo?: ReactNode;
  accion?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 px-5 pt-5", className)}>
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold leading-tight text-navy-900">{titulo}</h2>
        {subtitulo && <p className="mt-1 text-[13px] text-tinta-suave">{subtitulo}</p>}
      </div>
      {accion && <div className="shrink-0">{accion}</div>}
    </div>
  );
}

// Encabezado de página: eyebrow azul en mayúsculas, título y subtítulo.
// El subtítulo va en slate-600: sobre el fondo canvas, el gris tinta-suave no alcanza 4,5:1.
export function EncabezadoPagina({
  eyebrow,
  titulo,
  subtitulo,
  accion,
}: {
  eyebrow?: ReactNode;
  titulo: ReactNode;
  subtitulo?: ReactNode;
  accion?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-semibold leading-7 tracking-tight text-navy-900">{titulo}</h1>
        {subtitulo && <p className="mt-1.5 max-w-2xl text-sm text-slate-600">{subtitulo}</p>}
      </div>
      {accion && <div className="shrink-0">{accion}</div>}
    </div>
  );
}
