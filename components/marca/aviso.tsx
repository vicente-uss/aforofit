import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TonoAviso = "blue" | "amber" | "red" | "green" | "slate";

const ESTILO: Record<TonoAviso, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  red: "border-red-200 bg-red-50 text-red-800",
  green: "border-green-200 bg-green-50 text-green-800",
  slate: "border-line bg-slate-50 text-slate-700",
};

const ICONO: Record<TonoAviso, LucideIcon> = {
  blue: Info,
  amber: TriangleAlert,
  red: CircleAlert,
  green: CircleCheck,
  slate: Info,
};

// Aviso (callout) del prototipo. `role` lo decide quien lo usa (status o alert).
export function Aviso({
  tono = "blue",
  titulo,
  children,
  icono,
  role,
  className,
}: {
  tono?: TonoAviso;
  titulo?: ReactNode;
  children?: ReactNode;
  icono?: LucideIcon;
  role?: "status" | "alert";
  className?: string;
}) {
  const Icono = icono ?? ICONO[tono];
  return (
    <div role={role} className={cn("flex gap-3 rounded-xl border px-4 py-3 text-sm", ESTILO[tono], className)}>
      <Icono className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden />
      <div className="min-w-0">
        {titulo && <p className="font-semibold">{titulo}</p>}
        {children && <div className={titulo ? "mt-0.5" : undefined}>{children}</div>}
      </div>
    </div>
  );
}
