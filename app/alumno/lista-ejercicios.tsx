"use client";

import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TEXTOS } from "@/lib/rutina/mensajes";
import { textoVolumen, urlFotoMaquina, type EjercicioDelDia } from "@/lib/rutina/pantalla";
import { textoCarga } from "@/lib/rutina/progresion";

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;

function FotoMaquina({ ruta, nombre }: { ruta: string | null; nombre: string }) {
  const [fallo, setFallo] = useState(false);
  const url = urlFotoMaquina(URL_SUPABASE, ruta);
  if (!url || fallo) return null;
  return (
    // Foto del bucket público «maquinas»; <img> simple para no configurar dominios en next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={nombre}
      loading="lazy"
      onError={() => setFallo(true)}
      className="h-20 w-20 shrink-0 rounded-md border object-cover"
    />
  );
}

function TarjetaEjercicio({ e }: { e: EjercicioDelDia }) {
  return (
    <Card className={e.en_mantencion ? "border-2 border-yellow-500" : undefined}>
      <div className="space-y-3 p-4">
        <div className="flex gap-3">
          <span
            aria-label={`Ejercicio ${e.orden}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
          >
            {e.orden}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold leading-tight">{e.ejercicio}</p>
            <p className="text-sm text-muted-foreground">{e.maquina}</p>
          </div>
          <FotoMaquina ruta={e.foto_url} nombre={e.maquina} />
        </div>

        {/* Regla 7: advertencia visible, sin reemplazo automático. */}
        {e.en_mantencion && (
          <div
            role="alert"
            className="flex gap-2 rounded-md bg-yellow-400 p-3 text-black"
          >
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <div>
              <p className="font-bold">{TEXTOS.mantencionTitulo}</p>
              <p className="text-sm">{TEXTOS.mantencionDetalle}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-base">
          <span className="rounded-md bg-muted px-3 py-1 font-semibold tabular-nums">{textoVolumen(e)}</span>
          {e.carga_kg !== null && (
            <span className="rounded-md bg-muted px-3 py-1 font-semibold tabular-nums">{textoCarga(e.carga_kg)}</span>
          )}
        </div>

        {(e.nota_ajuste || e.ajustes_maquina) && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Ajuste: </span>
            {[e.nota_ajuste, e.ajustes_maquina].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </Card>
  );
}

// Rutina del día (RF16, RF17, CU04).
export function ListaEjercicios({ ejercicios }: { ejercicios: EjercicioDelDia[] }) {
  const enMantencion = ejercicios.filter((e) => e.en_mantencion).length;
  return (
    <div className="space-y-3">
      {enMantencion > 0 && (
        <p className="rounded-md bg-yellow-400 p-3 font-semibold text-black">
          {enMantencion === 1
            ? "1 ejercicio de tu rutina usa una máquina en mantención."
            : `${enMantencion} ejercicios de tu rutina usan máquinas en mantención.`}
        </p>
      )}
      <ol className="space-y-3">
        {ejercicios.map((e) => (
          <li key={e.orden}>
            <TarjetaEjercicio e={e} />
          </li>
        ))}
      </ol>
    </div>
  );
}
