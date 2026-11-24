"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EFECTO_FEEDBACK, ETIQUETA_FEEDBACK, TEXTOS } from "@/lib/rutina/mensajes";
import type { CambioCarga } from "@/lib/rutina/pantalla";
import { textoCarga, VALORES_FEEDBACK, type ValorFeedback } from "@/lib/rutina/progresion";

const COLOR_BOTON: Record<ValorFeedback, string> = {
  facil: "bg-green-600 text-white hover:bg-green-700",
  justo: "bg-blue-600 text-white hover:bg-blue-700",
  me_costo: "bg-orange-600 text-white hover:bg-orange-700",
};

// B4 (RF18, CU03): se muestra solo después de la salida.
export function PreguntaFeedback({
  ocupado,
  onResponder,
  onOmitir,
}: {
  ocupado: boolean;
  onResponder: (valor: ValorFeedback) => void;
  onOmitir: () => void;
}) {
  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <CardTitle className="text-2xl">{TEXTOS.feedbackTitulo}</CardTitle>
        <CardDescription>{TEXTOS.feedbackDetalle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {VALORES_FEEDBACK.map((valor) => (
          <button
            key={valor}
            type="button"
            disabled={ocupado}
            onClick={() => onResponder(valor)}
            className={`flex h-16 w-full flex-col items-center justify-center rounded-lg text-xl font-bold transition-colors disabled:opacity-50 ${COLOR_BOTON[valor]}`}
          >
            {ETIQUETA_FEEDBACK[valor]}
            <span className="text-xs font-normal opacity-90">{EFECTO_FEEDBACK[valor]}</span>
          </button>
        ))}
        <Button variant="ghost" className="w-full" disabled={ocupado} onClick={onOmitir}>
          Ahora no
        </Button>
      </CardContent>
    </Card>
  );
}

const FLECHA: Record<CambioCarga["cambio"], string> = {
  sube: "↑",
  baja: "↓",
  igual: "=",
  sin_carga: "",
  sin_dato: "",
};

// «Tu próxima sesión»: carga nueva de cada ejercicio, leída otra vez de rutina_del_dia (CA14).
export function ProximaSesion({ cambios, respuesta }: { cambios: CambioCarga[]; respuesta: ValorFeedback | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{TEXTOS.proximaTitulo}</CardTitle>
        <CardDescription>
          {respuesta ? `Respondiste «${ETIQUETA_FEEDBACK[respuesta]}». ` : "Ya respondiste por tu visita de hoy. "}
          {TEXTOS.proximaDetalle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {cambios.map((c) => (
            <li key={c.orden} className="flex items-center justify-between gap-3 py-2">
              <span className="min-w-0">{c.ejercicio}</span>
              <span className="shrink-0 text-right font-semibold tabular-nums">
                {c.cambio === "sin_carga" ? (
                  <span className="font-normal text-muted-foreground">sin carga</span>
                ) : c.cambio === "sin_dato" || c.antes === null ? (
                  textoCarga(c.ahora)
                ) : (
                  <>
                    <span className="font-normal text-muted-foreground">{textoCarga(c.antes)} → </span>
                    {textoCarga(c.ahora)} {FLECHA[c.cambio]}
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
