import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TonoInsignia = "neutral" | "blue" | "green" | "amber" | "red" | "navy";

const ESTILO: Record<TonoInsignia, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-500/20",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
  green: "bg-green-50 text-green-700 ring-green-600/20",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/25",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  navy: "bg-navy-900 text-white ring-navy-900",
};

const PUNTO: Record<TonoInsignia, string> = {
  neutral: "bg-slate-400",
  blue: "bg-blue-500",
  green: "bg-green-600",
  amber: "bg-amber-500",
  red: "bg-red-600",
  navy: "bg-blue-400",
};

// Insignia del prototipo: píldora con borde interior y punto opcional.
export function Insignia({
  tono = "neutral",
  punto = false,
  tamano = "md",
  children,
  className,
}: {
  tono?: TonoInsignia;
  punto?: boolean;
  tamano?: "sm" | "md";
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium ring-1 ring-inset",
        tamano === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-0.5 text-xs",
        ESTILO[tono],
        className,
      )}
    >
      {punto && <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", PUNTO[tono])} />}
      {children}
    </span>
  );
}
