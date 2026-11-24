"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ETIQUETA_NIVEL, ETIQUETA_OBJETIVO, TEXTOS } from "@/lib/rutina/mensajes";
import { NIVELES, OBJETIVOS, type Nivel, type Objetivo } from "@/lib/rutina/pantalla";

// Botón grande de opción (fácil de tocar en un celular de 360 px).
function Opcion({
  activa,
  titulo,
  detalle,
  onClick,
}: {
  activa: boolean;
  titulo: string;
  detalle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={onClick}
      className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
        activa ? "border-primary bg-primary text-primary-foreground" : "border-input hover:border-foreground/40"
      }`}
    >
      <span className="block text-lg font-semibold">{titulo}</span>
      <span className={`block text-sm ${activa ? "opacity-90" : "text-muted-foreground"}`}>{detalle}</span>
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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{TEXTOS.elegirTitulo}</CardTitle>
        <CardDescription>{TEXTOS.elegirDetalle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <fieldset className="space-y-2">
          <legend className="mb-2 font-medium">Objetivo</legend>
          {OBJETIVOS.map((o) => (
            <Opcion
              key={o}
              activa={objetivo === o}
              titulo={ETIQUETA_OBJETIVO[o].titulo}
              detalle={ETIQUETA_OBJETIVO[o].detalle}
              onClick={() => setObjetivo(o)}
            />
          ))}
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="mb-2 font-medium">Nivel</legend>
          {NIVELES.map((n) => (
            <Opcion
              key={n}
              activa={nivel === n}
              titulo={ETIQUETA_NIVEL[n].titulo}
              detalle={ETIQUETA_NIVEL[n].detalle}
              onClick={() => setNivel(n)}
            />
          ))}
        </fieldset>

        {cambiando && (
          <p className="rounded-lg bg-yellow-100 p-3 text-sm text-yellow-950 dark:bg-yellow-950 dark:text-yellow-100">
            {TEXTOS.cambiarAviso}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            className="h-12 w-full text-base"
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
        </div>
      </CardContent>
    </Card>
  );
}
