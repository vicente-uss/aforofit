"use client";

import { ArrowRight, Frown, Meh, Smile, type LucideIcon } from "lucide-react";
import { Insignia } from "@/components/marca/insignia";
import { Tarjeta } from "@/components/marca/tarjeta";
import { ETIQUETA_FEEDBACK, PISTA_FEEDBACK, TEXTOS } from "@/lib/rutina/mensajes";
import type { CambioCarga } from "@/lib/rutina/pantalla";
import { textoCarga, VALORES_FEEDBACK, type ValorFeedback } from "@/lib/rutina/progresion";
import { cn } from "@/lib/utils";

const CARA: Record<ValorFeedback, { icono: LucideIcon; circulo: string; borde: string }> = {
  facil: { icono: Smile, circulo: "bg-green-50 text-green-700", borde: "hover:border-green-600" },
  justo: { icono: Meh, circulo: "bg-blue-50 text-blue-700", borde: "hover:border-blue-600" },
  me_costo: { icono: Frown, circulo: "bg-amber-50 text-amber-700", borde: "hover:border-amber-500" },
};

// B4 (RF18, CU03): se muestra solo después de la salida.
export function PreguntaFeedback({
  ocupado,
  ajustaCargas,
  onResponder,
  onOmitir,
}: {
  ocupado: boolean;
  ajustaCargas: boolean;
  onResponder: (valor: ValorFeedback) => void;
  onOmitir: () => void;
}) {
  return (
    <Tarjeta className="space-y-4 p-5 animate-pop-in">
      <div className="space-y-2">
        <Insignia tono="green" punto>
          Salida registrada
        </Insignia>
        <h2 className="text-[22px] font-semibold leading-tight text-navy-900">{TEXTOS.feedbackTitulo}</h2>
        <p className="text-sm text-tinta-suave">{ajustaCargas ? TEXTOS.feedbackDetalle : "Tu respuesta queda guardada en el historial de la visita."}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {VALORES_FEEDBACK.map((valor) => {
          const { icono: Icono, circulo, borde } = CARA[valor];
          return (
            <button
              key={valor}
              type="button"
              disabled={ocupado}
              onClick={() => onResponder(valor)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border border-line bg-white px-1.5 py-3 text-center transition-colors disabled:opacity-50",
                borde,
              )}
            >
              <span className={cn("flex h-14 w-14 items-center justify-center rounded-full", circulo)}>
                <Icono className="h-7 w-7" aria-hidden />
              </span>
              <span className="text-[15px] font-semibold text-navy-900">{ETIQUETA_FEEDBACK[valor]}</span>
              <span className="text-[11px] leading-tight text-tinta-suave">{PISTA_FEEDBACK[valor]}</span>
            </button>
          );
        })}
      </div>
      <div className="text-center">
        <button
          type="button"
          disabled={ocupado}
          onClick={onOmitir}
          className="text-sm font-medium text-tinta-suave underline-offset-4 hover:text-navy-900 hover:underline disabled:opacity-50"
        >
          Ahora no
        </button>
      </div>
    </Tarjeta>
  );
}

const COLOR_CAMBIO: Record<CambioCarga["cambio"], string> = {
  sube: "text-green-700",
  baja: "text-amber-700",
  igual: "text-navy-900",
  sin_carga: "text-tinta-suave",
  sin_dato: "text-navy-900",
};

// «Tu próxima sesión»: carga nueva de cada ejercicio, leída otra vez de rutina_del_dia (CA14).
export function ProximaSesion({ cambios, respuesta }: { cambios: CambioCarga[]; respuesta: ValorFeedback | null }) {
  return (
    <Tarjeta className="space-y-4 p-5 animate-pop-in">
      <div>
        <h2 className="text-[22px] font-semibold leading-tight text-navy-900">{TEXTOS.proximaTitulo}</h2>
        <p className="mt-1 text-sm text-tinta-suave">
          {respuesta ? `Respondiste «${ETIQUETA_FEEDBACK[respuesta]}». ` : "Ya respondiste por tu visita de hoy. "}
          {TEXTOS.proximaDetalle}
        </p>
      </div>
      <ul className="space-y-2">
        {cambios.map((c) => (
          <li
            key={c.orden}
            className="flex items-center justify-between gap-3 rounded-xl border border-line px-3.5 py-2.5"
          >
            <span className="min-w-0 text-sm font-medium text-navy-900">{c.ejercicio}</span>
            <span className={cn("tnum flex shrink-0 items-center gap-1.5 text-sm font-semibold", COLOR_CAMBIO[c.cambio])}>
              {c.cambio === "sin_carga" ? (
                <span className="font-normal">sin carga</span>
              ) : c.cambio === "sin_dato" || c.antes === null ? (
                textoCarga(c.ahora)
              ) : (
                <>
                  <span className="font-normal text-tinta-suave">{textoCarga(c.antes)}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-tinta-suave" aria-label="pasa a" />
                  {textoCarga(c.ahora)}
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    </Tarjeta>
  );
}
