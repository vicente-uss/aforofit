"use client";

import { estadoAforo, textoCupos } from "@/lib/aforo/estado";
import { useAforo } from "@/lib/aforo/useAforo";

// Color de la barra según el estado de ocupación.
const COLOR_ESTADO = {
  Disponible: "bg-green-500",
  "Casi lleno": "bg-yellow-400",
  Lleno: "bg-red-500",
} as const;

// Texto sobre ese mismo color en la insignia del estado: negro sobre los fondos claros.
const TEXTO_SOBRE_ESTADO = {
  Disponible: "text-black",
  "Casi lleno": "text-black",
  Lleno: "text-white",
} as const;

export function PantallaAforo() {
  const { aforo, sinConexion } = useAforo("aforo-publico");

  const estado = aforo ? estadoAforo(aforo.ocupacion, aforo.capacidad, aforo.umbral_casi_lleno) : null;

  return (
    <div className="flex min-h-svh w-full flex-col bg-zinc-950 p-6 text-white md:p-12">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
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
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl uppercase tracking-widest text-zinc-400 md:text-3xl">
                Personas adentro
              </p>
              <p className="text-7xl font-bold tabular-nums sm:text-8xl md:text-[12rem] md:leading-none">
                {aforo.ocupacion} / {aforo.capacidad}
              </p>
              {/* Cupos libres en palabras: lo que el alumno mira al llegar (auditoría del 23 de noviembre). */}
              <p className="text-4xl font-semibold text-zinc-100 md:text-6xl">
                {textoCupos(aforo.ocupacion, aforo.capacidad)}
              </p>
            </div>

            <div className="h-12 w-full max-w-3xl overflow-hidden rounded-full bg-zinc-800 md:h-16">
              <div
                className={`h-full transition-all duration-500 ${COLOR_ESTADO[estado.etiqueta]}`}
                style={{ width: `${estado.porcentaje}%` }}
              />
            </div>
            <p
              className={`rounded-full px-8 py-3 text-4xl font-semibold md:px-10 md:py-4 md:text-5xl ${
                COLOR_ESTADO[estado.etiqueta]
              } ${TEXTO_SOBRE_ESTADO[estado.etiqueta]}`}
            >
              {estado.etiqueta}
            </p>

            {aforo.turno_llamado !== null && (
              <div className="rounded-2xl bg-yellow-400 px-8 py-6 text-black md:px-16 md:py-8">
                <p className="text-3xl uppercase tracking-widest md:text-4xl">Turno llamado</p>
                <p className="text-7xl font-bold tabular-nums md:text-9xl md:leading-none">
                  {aforo.turno_llamado}
                </p>
                <p className="text-2xl md:text-3xl">pasa tu credencial</p>
              </div>
            )}

            <p className="text-4xl font-semibold text-zinc-100 md:text-5xl">
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
