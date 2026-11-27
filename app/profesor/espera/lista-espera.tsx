"use client";

import { ListOrdered } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EstadoVacio } from "@/components/marca/estado-vacio";
import { Insignia } from "@/components/marca/insignia";
import { EncabezadoPagina, EncabezadoTarjeta, Tarjeta } from "@/components/marca/tarjeta";
import { normalizarTurnos, type Turno } from "@/lib/aforo/turnos";
import { diaSantiago, rangoDia } from "@/lib/historial/historial";
import { consultaEsperaVigente } from "@/lib/aforo/consulta-espera";
import { createClient } from "@/lib/supabase/client";

type Aforo = { ocupacion: number; capacidad: number };

// Respaldo por si Realtime se desconecta (riesgo R04).
const INTERVALO_RESPALDO_MS = 15000;

export function ListaEspera() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [aforo, setAforo] = useState<Aforo | null>(null);
  const [errorTurnos, setErrorTurnos] = useState(false);
  const [sinDatosAforo, setSinDatosAforo] = useState(false);
  const supabaseRef = useRef(createClient());
  const [diaTurnos, setDiaTurnos] = useState<string | null>(null);

  useEffect(() => {
    const supabase = supabaseRef.current;
    let peticionVigente = 0;
    let diaVigente: string | null = null;
    let activo = true;

    const leer = async () => {
      if (!activo) return;
      const peticion = ++peticionVigente;
      const dia = diaSantiago(new Date());
      const { desde, hasta } = rangoDia(dia);
      if (diaVigente !== dia) {
        diaVigente = dia;
        setDiaTurnos(dia);
        setTurnos([]);
        setErrorTurnos(false);
      }
      const [respuestaTurnos, respuestaAforo] = await Promise.all([
        supabase
          .from("turnos")
          .select("numero, estado, creado_en, alumnos(nombre)")
          .in("estado", ["esperando", "llamado"])
          .gte("creado_en", desde)
          .lt("creado_en", hasta)
          .order("numero"),
        supabase.from("aforo").select("ocupacion, capacidad").eq("id", 1).maybeSingle(),
      ]);
      if (!activo || !consultaEsperaVigente(peticion, peticionVigente, dia, new Date())) return;
      if (respuestaTurnos.error) console.error("Error al leer turnos:", respuestaTurnos.error);
      if (respuestaAforo.error) console.error("Error al leer el aforo:", respuestaAforo.error);
      // Cada lectura informa su propio error: si falla el aforo, los turnos se siguen mostrando.
      setErrorTurnos(Boolean(respuestaTurnos.error));
      setSinDatosAforo(Boolean(respuestaAforo.error) || !respuestaAforo.data);
      setTurnos(respuestaTurnos.error ? [] : normalizarTurnos(respuestaTurnos.data));
      setAforo(respuestaAforo.error ? null : respuestaAforo.data as Aforo | null);
    };

    void leer();
    // La reconciliación de aforo notifica cambios de turnos, también desde Cron.
    // No se publica la tabla turnos en Realtime.
    const canal = supabase
      .channel("lista-espera")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "aforo", filter: "id=eq.1" },
        () => void leer(),
      )
      .subscribe();
    const intervalo = setInterval(leer, INTERVALO_RESPALDO_MS);
    return () => {
      activo = false;
      clearInterval(intervalo);
      void supabase.removeChannel(canal);
    };
  }, []);

  const turnosHoy = diaTurnos === diaSantiago(new Date()) ? turnos : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <EncabezadoPagina
        eyebrow="Profesor encargado"
        titulo="Lista de espera"
        subtitulo="Cuando se libera un cupo, el sistema llama solo al siguiente turno (D14)."
      />

      <Tarjeta className="flex items-center justify-between p-5">
        <span className="text-sm font-medium text-tinta-suave">Aforo actual</span>
        <span className="tnum text-3xl font-bold text-navy-900">
          {sinDatosAforo ? "Sin datos del aforo" : aforo ? `${aforo.ocupacion} / ${aforo.capacidad}` : "—"}
        </span>
      </Tarjeta>

      <Tarjeta>
        <EncabezadoTarjeta titulo="Turnos de hoy" subtitulo="En orden de llegada." />
        <div className="px-5 pb-4 pt-2">
          {errorTurnos ? (
            <p className="py-3 text-sm font-medium text-red-600">No se pudo leer la lista. Reintentando…</p>
          ) : turnosHoy.length === 0 ? (
            <EstadoVacio icono={ListOrdered} titulo="No hay nadie en espera">
              Los turnos aparecen aquí cuando el gimnasio está lleno.
            </EstadoVacio>
          ) : (
            <ul className="divide-y divide-line">
              {turnosHoy.map((turno) => (
                <li key={turno.numero} className="flex items-center gap-4 py-3">
                  <span
                    className={`tnum flex h-12 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${
                      turno.estado === "llamado" ? "bg-blue-600 text-white" : "bg-slate-100 text-navy-900"
                    }`}
                  >
                    {String(turno.numero).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium uppercase tracking-wider text-tinta-suave">
                      Turno {turno.numero}
                    </span>
                    <span className="block truncate font-semibold text-navy-900">{turno.alumnos?.nombre ?? "—"}</span>
                  </span>
                  {turno.estado === "llamado" ? (
                    <Insignia tono="amber" punto>
                      Llamado
                    </Insignia>
                  ) : (
                    <Insignia tono="neutral">Esperando</Insignia>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Tarjeta>
    </div>
  );
}
