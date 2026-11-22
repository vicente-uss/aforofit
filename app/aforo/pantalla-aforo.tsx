"use client";

import { useEffect, useRef, useState } from "react";
import { estadoAforo } from "@/lib/aforo/estado";
import { createClient } from "@/lib/supabase/client";

// Fila única de la tabla `aforo` (la actualiza registrar_ingreso en cada entrada y salida).
type FilaAforo = {
  ocupacion: number;
  capacidad: number;
  turno_llamado: number | null;
  en_espera: number;
  umbral_casi_lleno: number | null;
  actualizado_en: string;
};

// Respaldo por si Realtime se desconecta (riesgo R04): se vuelve a leer la tabla cada 15 s.
const INTERVALO_RESPALDO_MS = 15000;

const COLOR_ESTADO = {
  Disponible: "bg-green-500",
  "Casi lleno": "bg-yellow-400",
  Lleno: "bg-red-500",
} as const;

export function PantallaAforo() {
  const [aforo, setAforo] = useState<FilaAforo | null>(null);
  const [sinConexion, setSinConexion] = useState(false);
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    const supabase = supabaseRef.current;

    const leer = async () => {
      const { data, error } = await supabase
        .from("aforo")
        .select("ocupacion, capacidad, turno_llamado, en_espera, umbral_casi_lleno, actualizado_en")
        .eq("id", 1)
        .maybeSingle();
      if (error || !data) {
        setSinConexion(true);
        return;
      }
      setSinConexion(false);
      setAforo(data as FilaAforo);
    };

    void leer();

    // Cambios en vivo: el número cambia sin recargar (CA10, 2 segundos o menos).
    const canal = supabase
      .channel("aforo-publico")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "aforo", filter: "id=eq.1" },
        (cambio) => {
          // Un DELETE no trae fila nueva: se vuelve a leer la tabla.
          if (cambio.eventType === "DELETE") {
            void leer();
            return;
          }
          setSinConexion(false);
          setAforo(cambio.new as FilaAforo);
        },
      )
      .subscribe();

    const intervalo = setInterval(leer, INTERVALO_RESPALDO_MS);
    return () => {
      clearInterval(intervalo);
      void supabase.removeChannel(canal);
    };
  }, []);

  const estado = aforo ? estadoAforo(aforo.ocupacion, aforo.capacidad, aforo.umbral_casi_lleno) : null;

  return (
    <div className="flex min-h-svh w-full flex-col bg-zinc-950 p-6 text-white md:p-12">
      <header className="flex items-center justify-between">
        <span className="text-3xl font-bold tracking-tight md:text-4xl">AforoFit</span>
        <span className="text-xl text-zinc-400 md:text-2xl">Gimnasio USS Bellavista</span>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        {!aforo || !estado ? (
          <p className="text-4xl text-zinc-400">
            {sinConexion ? "Sin conexión, reintentando…" : "Cargando aforo…"}
          </p>
        ) : (
          <>
            <p className="text-2xl uppercase tracking-widest text-zinc-400 md:text-3xl">Personas adentro</p>
            <p className="text-8xl font-bold tabular-nums md:text-[12rem] md:leading-none">
              {aforo.ocupacion} / {aforo.capacidad}
            </p>

            <div className="h-6 w-full max-w-3xl overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full transition-all duration-500 ${COLOR_ESTADO[estado.etiqueta]}`}
                style={{ width: `${estado.porcentaje}%` }}
              />
            </div>
            <p className="text-4xl font-semibold md:text-5xl">{estado.etiqueta}</p>

            {aforo.turno_llamado !== null && (
              <div className="rounded-2xl bg-yellow-400 px-10 py-6 text-black">
                <p className="text-5xl font-bold md:text-7xl">Turno {aforo.turno_llamado}</p>
                <p className="text-2xl md:text-3xl">pasa tu credencial</p>
              </div>
            )}

            <p className="text-2xl text-zinc-300 md:text-3xl">
              {aforo.en_espera === 0 ? "Nadie en espera" : `${aforo.en_espera} en espera`}
            </p>
          </>
        )}
      </main>

      <footer className="text-right text-lg text-zinc-500">
        {aforo &&
          `Actualizado ${new Date(aforo.actualizado_en).toLocaleTimeString("es-CL", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}`}
        {sinConexion && aforo && " · sin conexión, reintentando…"}
      </footer>
    </div>
  );
}
