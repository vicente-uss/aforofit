import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { segmentos } from "./nivel";

// Anillo de ocupación: dos círculos, el de progreso girado -90° para partir arriba.
// `lado` acepta cualquier medida CSS (px, vh o min(...)) para que la TV lo vea grande.
export function AnilloOcupacion({
  valor,
  maximo,
  color,
  lado,
  grosor = 8,
  fondo = "#e4e9f2",
  children,
  className,
}: {
  valor: number;
  maximo: number;
  color: string;
  lado: string | number;
  grosor?: number;
  fondo?: string;
  children?: ReactNode;
  className?: string;
}) {
  const radio = 50 - grosor / 2;
  const circunferencia = 2 * Math.PI * radio;
  const proporcion = maximo > 0 ? Math.min(Math.max(valor / maximo, 0), 1) : 1;
  const estilo: CSSProperties = { width: lado, height: lado };
  return (
    <div className={cn("relative shrink-0", className)} style={estilo}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={radio} fill="none" stroke={fondo} strokeWidth={grosor} />
        <circle
          cx="50"
          cy="50"
          r={radio}
          fill="none"
          stroke={color}
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={circunferencia * (1 - proporcion)}
          style={{ transition: "stroke-dashoffset 600ms ease, stroke 600ms ease" }}
        />
      </svg>
      {children && <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>}
    </div>
  );
}

// Barra de ocupación: un segmento por persona cuando la capacidad es 40 o menos; si no, continua.
export function BarraOcupacion({
  ocupacion,
  capacidad,
  color,
  vacio = "bg-slate-200",
  alto = "h-2.5",
  className,
}: {
  ocupacion: number;
  capacidad: number;
  color: string;
  vacio?: string;
  alto?: string;
  className?: string;
}) {
  const s = segmentos(ocupacion, capacidad);
  if (!s) {
    const porcentaje = capacidad > 0 ? Math.min(Math.max(ocupacion / capacidad, 0), 1) * 100 : 100;
    return (
      <div className={cn("w-full overflow-hidden rounded-full", vacio, alto, className)} aria-hidden>
        <div className="h-full rounded-full" style={{ width: `${porcentaje}%`, background: color, transition: "width 600ms ease" }} />
      </div>
    );
  }
  return (
    <div className={cn("flex w-full gap-1", alto, className)} aria-hidden>
      {Array.from({ length: s.total }, (_, i) => (
        <span
          key={i}
          className={cn("h-full flex-1 rounded-full", i < s.llenos ? "" : vacio)}
          style={i < s.llenos ? { background: color, transition: "background 600ms ease" } : undefined}
        />
      ))}
    </div>
  );
}
