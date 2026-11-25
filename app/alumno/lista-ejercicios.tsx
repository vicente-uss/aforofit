"use client";

import { Dumbbell, Settings2, TriangleAlert, Wrench } from "lucide-react";
import { useState } from "react";
import { Aviso } from "@/components/marca/aviso";
import { Tarjeta } from "@/components/marca/tarjeta";
import { TEXTOS } from "@/lib/rutina/mensajes";
import { urlFotoMaquina, type EjercicioDelDia } from "@/lib/rutina/pantalla";
import { textoCarga } from "@/lib/rutina/progresion";
import { cn } from "@/lib/utils";

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Foto de 88 px con el número de orden en una etiqueta navy. En mantención: gris, translúcida y
// con un círculo ámbar con una llave.
function FotoMaquina({ e }: { e: EjercicioDelDia }) {
  const [fallo, setFallo] = useState(false);
  const url = urlFotoMaquina(URL_SUPABASE, e.foto_url);
  return (
    <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-slate-100">
      {url && !fallo ? (
        // Foto del bucket público «maquinas»; <img> simple para no configurar dominios en next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={e.maquina}
          loading="lazy"
          onError={() => setFallo(true)}
          className={cn("h-full w-full object-cover", e.en_mantencion && "opacity-50 grayscale")}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-slate-400">
          <Dumbbell className="h-7 w-7" aria-hidden />
        </span>
      )}
      <span
        aria-label={`Ejercicio ${e.orden}`}
        className="tnum absolute left-1.5 top-1.5 rounded-md bg-navy-900 px-1.5 py-0.5 text-[11px] font-bold text-white"
      >
        {e.orden}
      </span>
      {e.en_mantencion && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-navy-950 shadow-lift">
            <Wrench className="h-[18px] w-[18px]" aria-hidden />
          </span>
        </span>
      )}
    </div>
  );
}

function Dato({ etiqueta, valor, destacado = false }: { etiqueta: string; valor: string; destacado?: boolean }) {
  return (
    <div className={cn("rounded-lg px-2 py-1.5 text-center", destacado ? "bg-blue-50" : "bg-slate-50")}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">{etiqueta}</p>
      <p className={cn("tnum text-[15px] font-semibold", destacado ? "text-blue-700" : "text-navy-900")}>{valor}</p>
    </div>
  );
}

function TarjetaEjercicio({ e }: { e: EjercicioDelDia }) {
  const cardio = e.carga_kg === null;
  return (
    <Tarjeta className={cn("overflow-hidden", e.en_mantencion && "border-amber-300")}>
      {/* Regla 7: advertencia visible, sin reemplazo automático. */}
      {e.en_mantencion && (
        <div role="alert" className="flex gap-2 bg-amber-50 px-4 py-2.5 text-[13px] text-amber-900">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
          <p>
            <b>{TEXTOS.mantencionTitulo}</b> {TEXTOS.mantencionDetalle}
          </p>
        </div>
      )}
      <div className="space-y-3 p-3.5">
        <div className="flex gap-3">
          <FotoMaquina e={e} />
          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <p className="text-[15px] font-semibold leading-tight text-navy-900">{e.ejercicio}</p>
              <p className="text-[13px] text-tinta-suave">{e.maquina}</p>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <Dato etiqueta="Series" valor={String(e.series)} />
              {e.minutos !== null ? (
                <Dato etiqueta="Minutos" valor={String(e.minutos)} />
              ) : (
                <Dato etiqueta="Reps" valor={String(e.repeticiones ?? "—")} />
              )}
              <Dato etiqueta="Peso" valor={cardio ? "—" : textoCarga(e.carga_kg)} destacado={!cardio} />
            </div>
          </div>
        </div>

        {(e.nota_ajuste || e.ajustes_maquina) && (
          <p className="flex gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[13px] text-slate-700">
            <Settings2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            <span>{[e.nota_ajuste, e.ajustes_maquina].filter(Boolean).join(" · ")}</span>
          </p>
        )}
      </div>
    </Tarjeta>
  );
}

// Rutina del día (RF16, RF17, CU04).
export function ListaEjercicios({ ejercicios }: { ejercicios: EjercicioDelDia[] }) {
  const enMantencion = ejercicios.filter((e) => e.en_mantencion).length;
  return (
    <div className="space-y-3">
      {enMantencion > 0 && (
        <Aviso tono="amber">
          {enMantencion === 1
            ? "1 ejercicio de tu rutina usa una máquina en mantención."
            : `${enMantencion} ejercicios de tu rutina usan máquinas en mantención.`}
        </Aviso>
      )}
      <ol className="space-y-3">
        {ejercicios.map((e) => (
          <li key={e.orden} className="animate-slide-up">
            <TarjetaEjercicio e={e} />
          </li>
        ))}
      </ol>
    </div>
  );
}
