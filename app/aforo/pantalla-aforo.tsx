"use client";

import { CircleCheck, CircleX, Maximize, TriangleAlert, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/marca/logo";
import { TRAZO_NIVEL, type Nivel } from "@/components/marca/nivel";
import { AnilloOcupacion, BarraOcupacion } from "@/components/marca/ocupacion";
import { estadoAforo } from "@/lib/aforo/estado";
import { useAforo } from "@/lib/aforo/useAforo";
import { cn } from "@/lib/utils";

// Píldora del estado bajo el anillo. El nivel lo decide estadoAforo con el umbral de la base.
const PILDORA: Record<Nivel, { texto: string; icono: LucideIcon; clase: string }> = {
  Disponible: { texto: "Disponible", icono: CircleCheck, clase: "bg-green-500/15 text-green-300 ring-green-400/30" },
  "Casi lleno": { texto: "Quedan pocos cupos", icono: TriangleAlert, clase: "bg-amber-400/15 text-amber-200 ring-amber-300/30" },
  Lleno: { texto: "Lleno · lista de espera activa", icono: CircleX, clase: "bg-red-500/15 text-red-300 ring-red-400/30" },
};

const ZONA = "America/Santiago";

// Hora en vivo (HH:MM) y fecha larga en español, con la zona del gimnasio.
function Reloj() {
  const [ahora, setAhora] = useState<Date | null>(null);
  useEffect(() => {
    setAhora(new Date());
    const intervalo = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);
  if (!ahora) return null;
  const hora = ahora.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: ZONA });
  const fecha = ahora.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long", timeZone: ZONA });
  // Solo la primera letra en mayúscula («Miércoles, 25 de noviembre»); `capitalize` subiría cada palabra.
  const fechaTexto = fecha.charAt(0).toUpperCase() + fecha.slice(1);
  return (
    <div className="text-right">
      <p className="tnum text-2xl font-semibold leading-none text-white sm:text-[clamp(1.75rem,5vh,3.5rem)]">{hora}</p>
      <p className="mt-1 text-xs text-slate-400 sm:text-[clamp(0.875rem,2vh,1.25rem)]">{fechaTexto}</p>
    </div>
  );
}

function Indicador({ etiqueta, valor, clase }: { etiqueta: string; valor: number; clase?: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/[0.04] p-[clamp(0.75rem,2vh,1.5rem)] ring-1 ring-inset ring-white/10">
      {/* En celular la etiqueta baja de tamaño y puede cortar palabra para no salirse del recuadro. */}
      <p className="text-[10px] font-medium uppercase leading-tight tracking-wide text-slate-400 [overflow-wrap:anywhere] sm:text-[clamp(0.75rem,1.7vh,1.125rem)] sm:tracking-wider">
        {etiqueta}
      </p>
      <p className={cn("tnum mt-1 text-[clamp(2rem,7vh,5rem)] font-bold leading-none text-white", clase)}>{valor}</p>
    </div>
  );
}

export function PantallaAforo() {
  const { aforo, sinConexion } = useAforo("aforo-publico");

  const estado = aforo ? estadoAforo(aforo.ocupacion, aforo.capacidad, aforo.umbral_casi_lleno) : null;
  const cupos = aforo ? Math.max(aforo.capacidad - aforo.ocupacion, 0) : 0;

  function pantallaCompleta() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  }

  return (
    <div
      className="relative flex min-h-svh w-full flex-col overflow-hidden bg-navy-950 px-[clamp(1rem,4vw,4rem)] py-[clamp(1rem,4vh,3rem)] text-white"
      style={{
        backgroundImage:
          "radial-gradient(60% 50% at 15% 10%, rgb(37 99 235 / 0.18), transparent 70%), radial-gradient(50% 45% at 90% 95%, rgb(59 130 246 / 0.12), transparent 70%)",
      }}
    >
      <header className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-[clamp(0.75rem,1.5vw,1.25rem)]">
          <LogoMark lado={56} className="h-[clamp(2.75rem,7vh,4.5rem)] w-[clamp(2.75rem,7vh,4.5rem)]" />
          <div className="min-w-0">
            <p className="text-[clamp(1.25rem,3.6vh,2.5rem)] font-bold leading-none tracking-tight">
              Aforo<span className="text-blue-400">Fit</span>
            </p>
            <p className="mt-1 text-xs text-slate-400 sm:text-[clamp(0.875rem,2vh,1.25rem)]">Gimnasio USS Bellavista</p>
          </div>
        </div>
        <Reloj />
      </header>

      <main className="flex flex-1 items-center py-[clamp(1rem,3vh,2.5rem)]">
        {!aforo || !estado ? (
          <p className="w-full text-center text-[clamp(1.5rem,5vh,3rem)] text-slate-400">
            {sinConexion ? "Sin conexión, reintentando…" : "Cargando aforo…"}
          </p>
        ) : (
          <div className="grid w-full grid-cols-1 items-center gap-[clamp(1.5rem,4vw,4rem)] lg:grid-cols-[auto_minmax(0,1fr)]">
            <div className="flex min-w-0 flex-col items-center gap-[clamp(1rem,3vh,2rem)]">
              <AnilloOcupacion
                valor={aforo.ocupacion}
                maximo={aforo.capacidad}
                color={TRAZO_NIVEL[estado.etiqueta]}
                fondo="rgb(255 255 255 / 0.08)"
                grosor={7}
                lado="var(--anillo)"
                className="[--anillo:min(78vw,46vh)] lg:[--anillo:min(40vw,58vh)]"
              >
                <p className="text-[calc(var(--anillo)*0.05)] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Personas dentro
                </p>
                <p className="tnum text-[calc(var(--anillo)*0.34)] font-bold leading-none">{aforo.ocupacion}</p>
                <p className="tnum text-[calc(var(--anillo)*0.065)] text-slate-400">de {aforo.capacidad}</p>
              </AnilloOcupacion>
              {(() => {
                const { texto, icono: Icono, clase } = PILDORA[estado.etiqueta];
                return (
                  <p
                    className={cn(
                      "inline-flex max-w-full items-center justify-center gap-2 rounded-full px-[clamp(1rem,2vw,1.75rem)] text-center py-[clamp(0.4rem,1vh,0.75rem)] text-[clamp(1rem,2.6vh,1.75rem)] font-semibold ring-1 ring-inset",
                      clase,
                    )}
                  >
                    <Icono className="h-[1.1em] w-[1.1em] shrink-0" aria-hidden />
                    {texto}
                  </p>
                );
              })()}
            </div>

            <div className="min-w-0 space-y-[clamp(0.75rem,2vh,1.5rem)]">
              <div className="grid grid-cols-3 gap-[clamp(0.5rem,1.5vw,1.25rem)]">
                <Indicador etiqueta="Personas dentro" valor={aforo.ocupacion} />
                <Indicador etiqueta="Capacidad máxima" valor={aforo.capacidad} />
                <Indicador
                  etiqueta="Cupos disponibles"
                  valor={cupos}
                  clase={cupos === 0 ? "text-red-400" : "text-green-400"}
                />
              </div>

              <div className="rounded-2xl bg-white/[0.04] p-[clamp(1rem,2.5vh,2rem)] ring-1 ring-inset ring-white/10">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="text-[clamp(1rem,2.6vh,1.75rem)] font-semibold">Lista de espera</p>
                  <p className="tnum text-[clamp(0.875rem,2.2vh,1.5rem)] text-slate-400">
                    {aforo.en_espera === 0 ? "Nadie en espera" : `${aforo.en_espera} en espera`}
                  </p>
                </div>
                <div className="mt-[clamp(0.75rem,2vh,1.5rem)] flex items-center gap-[clamp(1rem,2vw,2rem)]">
                  <div
                    className={cn(
                      "flex shrink-0 flex-col items-center justify-center rounded-2xl px-[clamp(1rem,2vw,2rem)] py-[clamp(0.5rem,1.5vh,1.25rem)]",
                      aforo.turno_llamado !== null ? "animate-pulse-ring bg-blue-600" : "bg-white/[0.06]",
                    )}
                  >
                    <p className="text-[clamp(0.75rem,1.8vh,1.25rem)] font-semibold uppercase tracking-[0.2em] text-blue-100">
                      Turno
                    </p>
                    <p className="tnum text-[clamp(2.5rem,9vh,6.5rem)] font-bold leading-none">
                      {aforo.turno_llamado !== null ? String(aforo.turno_llamado).padStart(2, "0") : "—"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    {aforo.turno_llamado !== null ? (
                      <>
                        <p className="text-[clamp(1rem,2.6vh,1.75rem)] text-slate-300">Acércate a la entrada</p>
                        {/* D22: solo nombre e inicial del apellido, nunca el nombre completo ni el RUT. */}
                        {aforo.turno_llamado_nombre && (
                          <p className="truncate text-[clamp(1.5rem,5vh,3.5rem)] font-bold leading-tight">
                            {aforo.turno_llamado_nombre}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-[clamp(1rem,2.6vh,1.75rem)] text-slate-400">Sin turnos llamados</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="space-y-[clamp(0.5rem,1.5vh,1rem)]">
        {aforo && estado && (
          <BarraOcupacion
            ocupacion={aforo.ocupacion}
            capacidad={aforo.capacidad}
            color={TRAZO_NIVEL[estado.etiqueta]}
            vacio="bg-white/10"
            alto="h-[clamp(0.6rem,1.6vh,1.25rem)]"
          />
        )}
        <div className="flex items-center justify-between gap-3 text-[clamp(0.75rem,1.6vh,1rem)] text-slate-400">
          <span className="tnum">
            {aforo &&
              `Actualizado ${new Date(aforo.actualizado_en).toLocaleTimeString("es-CL", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hourCycle: "h23",
              })}`}
            {sinConexion && aforo && " · sin conexión, reintentando…"}
          </span>
          <button
            type="button"
            onClick={pantallaCompleta}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/10"
          >
            <Maximize className="h-4 w-4" aria-hidden />
            Pantalla completa
          </button>
        </div>
      </footer>
    </div>
  );
}
