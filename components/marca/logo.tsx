"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type Tamano = "sm" | "md" | "lg";

const LADO: Record<Tamano, number> = { sm: 28, md: 36, lg: 44 };
const TEXTO: Record<Tamano, string> = { sm: "text-base", md: "text-lg", lg: "text-2xl" };

// Marca del prototipo de Figma Make: cuadrado azul con un medidor de aforo.
// useId da un id de degradé único aunque haya varios logos en la página.
export function LogoMark({ tamano = "md", lado, className }: { tamano?: Tamano; lado?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  const medida = lado ?? LADO[tamano];
  return (
    <svg
      viewBox="0 0 40 40"
      width={medida}
      height={medida}
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={`marca-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#marca-${id})`} />
      <path
        d="M11.5 26.5a10 10 0 1 1 17 0"
        fill="none"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path d="M11.5 26.5A10 10 0 0 1 24.07 12.09" fill="none" stroke="white" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="20" cy="21.4" r="3.1" fill="white" />
    </svg>
  );
}

// «Aforo» + «Fit» en azul. Sobre fondo oscuro, «Aforo» va en blanco y «Fit» en blue-400.
export function Logo({
  tamano = "md",
  oscuro = false,
  className,
}: {
  tamano?: Tamano;
  oscuro?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tamano={tamano} />
      <span className={cn("font-bold tracking-tight", TEXTO[tamano], oscuro ? "text-white" : "text-navy-900")}>
        Aforo<span className={oscuro ? "text-blue-400" : "text-blue-600"}>Fit</span>
      </span>
    </span>
  );
}
