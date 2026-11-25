import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Insignia } from "@/components/marca/insignia";
import { EncabezadoPagina, Tarjeta } from "@/components/marca/tarjeta";
import { ETIQUETA_ROL } from "@/lib/auth/roles";
import type { Perfil } from "@/lib/auth/perfil";
import { cn } from "@/lib/utils";

export type ColorSeccion = "blue" | "green" | "amber" | "navy" | "violet";

export type SeccionPanel = {
  titulo: string;
  descripcion: string;
  href?: string; // si existe, la tarjeta abre esa pantalla; si no, muestra «Próxima versión»
  icono?: LucideIcon;
  color?: ColorSeccion;
};

const CUADRO: Record<ColorSeccion, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-700",
  amber: "bg-amber-50 text-amber-700",
  navy: "bg-navy-900 text-white",
  violet: "bg-violet-50 text-violet-700",
};

// Panel de inicio del profesor y del admin: encabezado de página y una tarjeta por sección.
// El encabezado con el usuario y el cierre de sesión ahora los pone el contenedor (MarcoPanel).
export function PanelRol({
  perfil,
  secciones,
  children,
  tituloSecciones,
}: {
  perfil: Perfil;
  secciones: SeccionPanel[];
  children?: ReactNode;
  tituloSecciones?: string;
}) {
  return (
    <div className="space-y-6">
      <EncabezadoPagina
        eyebrow={`Panel de ${ETIQUETA_ROL[perfil.rol].toLowerCase()}`}
        titulo={`Hola, ${perfil.nombre}`}
        subtitulo="Elige una pantalla para empezar."
      />

      {children}

      {tituloSecciones && <h2 className="text-[15px] font-semibold text-navy-900">{tituloSecciones}</h2>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {secciones.map((seccion) => {
          const Icono = seccion.icono;
          const disponible = Boolean(seccion.href);
          const tarjeta = (
            <Tarjeta
              className={cn(
                "flex h-full gap-4 p-5",
                disponible ? "transition-shadow hover:shadow-lift" : "bg-white/70",
              )}
            >
              {Icono && (
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    disponible ? CUADRO[seccion.color ?? "blue"] : "bg-slate-100 text-slate-500",
                  )}
                >
                  <Icono className="h-5 w-5" aria-hidden />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-semibold text-navy-900">{seccion.titulo}</h3>
                  {disponible ? (
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden />
                  ) : (
                    <Insignia tono="neutral" tamano="sm">
                      Próxima versión
                    </Insignia>
                  )}
                </div>
                <p className="mt-1 text-[13px] text-tinta-suave">{seccion.descripcion}</p>
              </div>
            </Tarjeta>
          );
          return seccion.href ? (
            <Link key={seccion.titulo} href={seccion.href} className="rounded-2xl">
              {tarjeta}
            </Link>
          ) : (
            <div key={seccion.titulo}>{tarjeta}</div>
          );
        })}
      </div>
    </div>
  );
}
