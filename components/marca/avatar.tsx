import { cn } from "@/lib/utils";
import { iniciales } from "./nivel";

// Avatar con iniciales (el prototipo no usa fotos de alumnos).
export function Avatar({ nombre, className }: { nombre: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700",
        className,
      )}
    >
      {iniciales(nombre)}
    </span>
  );
}
