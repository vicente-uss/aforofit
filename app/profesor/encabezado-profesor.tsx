import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Encabezado de las pantallas del profesor: vuelve al panel y muestra dónde se está.
export function EncabezadoProfesor({ seccion }: { seccion: string }) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 p-4">
        <Link href="/profesor" className="text-xl font-bold tracking-tight">
          AforoFit
        </Link>
        <Badge variant="secondary">{seccion}</Badge>
      </div>
    </header>
  );
}
