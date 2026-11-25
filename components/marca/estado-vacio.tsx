import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Estado vacío del prototipo: ícono en un cuadrado slate-100 de 48 px, título y texto.
export function EstadoVacio({
  icono: Icono,
  titulo,
  children,
  className,
}: {
  icono: LucideIcon;
  titulo: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-10 text-center", className)}>
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <Icono className="h-6 w-6" aria-hidden />
      </span>
      <p className="mt-3 text-[15px] font-semibold text-navy-900">{titulo}</p>
      {children && <div className="mt-1 max-w-sm text-sm text-tinta-suave">{children}</div>}
    </div>
  );
}
