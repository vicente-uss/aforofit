"use client";

import { Check, Dumbbell, Flame, HeartPulse, Sprout, TrendingUp, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Aviso } from "@/components/marca/aviso";
import { Tarjeta } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import { ETIQUETA_NIVEL, ETIQUETA_OBJETIVO, TEXTOS } from "@/lib/rutina/mensajes";
import { NIVELES, OBJETIVOS, type Nivel, type Objetivo } from "@/lib/rutina/pantalla";
import { cn } from "@/lib/utils";

const ICONO_OBJETIVO: Record<Objetivo, LucideIcon> = { fuerza: Dumbbell, hipertrofia: Flame, salud: HeartPulse };
const ICONO_NIVEL: Record<Nivel, LucideIcon> = { principiante: Sprout, intermedio: TrendingUp };

// Tarjeta seleccionable (fácil de tocar en un celular de 360 px): borde blue-600 y anillo al elegirla.
function Opcion({
  activa,
  titulo,
  detalle,
  icono: Icono,
  onClick,
}: {
  activa: boolean;
  titulo: string;
  detalle: string;
  icono: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border bg-white p-3.5 text-left transition-all",
        activa ? "border-blue-600 ring-4 ring-blue-600/15" : "border-line hover:border-slate-300",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          activa ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600",
        )}
      >
        <Icono className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-navy-900">{titulo}</span>
        <span className="block text-[13px] text-tinta-suave">{detalle}</span>
      </span>
      <span
        aria-hidden
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          activa ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300",
        )}
      >
        {activa && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
    </button>
  );
}

// B1 (RF11, CA24): el alumno elige objetivo y nivel; al guardar se genera su rutina.
export function ElegirObjetivo({
  objetivoInicial,
  nivelInicial,
  cambiando,
  ocupado,
  onGuardar,
  onCancelar,
}: {
  objetivoInicial: Objetivo | null;
  nivelInicial: Nivel | null;
  cambiando: boolean; // ya tenía objetivo: se avisa que se genera una rutina nueva
  ocupado: boolean;
  onGuardar: (objetivo: Objetivo, nivel: Nivel) => void;
  onCancelar?: () => void;
}) {
  const [objetivo, setObjetivo] = useState<Objetivo | null>(objetivoInicial);
  const [nivel, setNivel] = useState<Nivel | null>(nivelInicial);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-[22px] font-semibold leading-tight text-navy-900">{TEXTOS.elegirTitulo}</h2>
        <p className="mt-1 text-sm text-slate-600">{TEXTOS.elegirDetalle}</p>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">Objetivo</legend>
        {OBJETIVOS.map((o) => (
          <Opcion
            key={o}
            activa={objetivo === o}
            titulo={ETIQUETA_OBJETIVO[o].titulo}
            detalle={ETIQUETA_OBJETIVO[o].detalle}
            icono={ICONO_OBJETIVO[o]}
            onClick={() => setObjetivo(o)}
          />
        ))}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">Nivel</legend>
        {NIVELES.map((n) => (
          <Opcion
            key={n}
            activa={nivel === n}
            titulo={ETIQUETA_NIVEL[n].titulo}
            detalle={ETIQUETA_NIVEL[n].detalle}
            icono={ICONO_NIVEL[n]}
            onClick={() => setNivel(n)}
          />
        ))}
      </fieldset>

      {cambiando && <Aviso tono="amber">{TEXTOS.cambiarAviso}</Aviso>}

      <Tarjeta className="flex flex-col gap-2 p-3">
        <Button
          size="lg"
          className="w-full"
          disabled={!objetivo || !nivel || ocupado}
          onClick={() => objetivo && nivel && onGuardar(objetivo, nivel)}
        >
          {ocupado ? "Generando tu rutina…" : cambiando ? "Guardar y generar rutina nueva" : "Guardar y generar mi rutina"}
        </Button>
        {onCancelar && (
          <Button variant="ghost" className="w-full" disabled={ocupado} onClick={onCancelar}>
            Cancelar
          </Button>
        )}
      </Tarjeta>
    </div>
  );
}
