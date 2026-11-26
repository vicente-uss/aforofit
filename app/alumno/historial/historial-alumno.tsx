"use client";

import { ArrowLeft, DoorOpen, History, UserX } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Aviso } from "@/components/marca/aviso";
import { EstadoVacio } from "@/components/marca/estado-vacio";
import { Insignia, type TonoInsignia } from "@/components/marca/insignia";
import { Tarjeta } from "@/components/marca/tarjeta";
import {
  duracionMinutos,
  fechaLarga,
  feedbackPorVisita,
  hora,
  normalizarVisitas,
  textoDuracion,
  tipoCierre,
  type VisitaHistorial,
} from "@/lib/historial/historial";
import { ETIQUETA_CIERRE, TEXTOS, TONO_CIERRE } from "@/lib/historial/mensajes";
import { ETIQUETA_FEEDBACK, TEXTOS as TEXTOS_RUTINA } from "@/lib/rutina/mensajes";
import type { ValorFeedback } from "@/lib/rutina/progresion";
import { createClient } from "@/lib/supabase/client";

const MAX_VISITAS = 20;

const TONO_FEEDBACK: Record<ValorFeedback, TonoInsignia> = { facil: "green", justo: "blue", me_costo: "amber" };

function esValor(valor: string): valor is ValorFeedback {
  return valor === "facil" || valor === "justo" || valor === "me_costo";
}

// «Lunes 7 de diciembre» con la primera letra en mayúscula.
function fechaTitulo(iso: string) {
  const f = fechaLarga(iso);
  return f.charAt(0).toUpperCase() + f.slice(1);
}

type Estado =
  | { tipo: "cargando" }
  | { tipo: "error" }
  | { tipo: "sin_alumno" }
  | { tipo: "listo"; visitas: VisitaHistorial[]; feedback: Record<string, string>; ahora: Date };

/**
 * «Mi historial» (F-33): las últimas 20 visitas del alumno, cómo se cerró cada una y su feedback.
 * Solo lectura. RLS (visitas_leer en 007 y feedback_leer en 011) devuelve solo lo propio.
 */
export function HistorialAlumno() {
  const supabaseRef = useRef(createClient());
  const [estado, setEstado] = useState<Estado>({ tipo: "cargando" });

  useEffect(() => {
    let vigente = true;
    void (async () => {
      const supabase = supabaseRef.current;
      const alumno = await supabase.from("alumnos").select("id").maybeSingle();
      if (!vigente) return;
      if (alumno.error) return setEstado({ tipo: "error" });
      if (!alumno.data) return setEstado({ tipo: "sin_alumno" });

      const visitas = await supabase
        .from("visitas")
        .select("id, entrada, salida, cierre_automatico, cerrada_por")
        .eq("alumno_id", alumno.data.id)
        .order("entrada", { ascending: false })
        .limit(MAX_VISITAS);
      if (!vigente) return;
      if (visitas.error) return setEstado({ tipo: "error" });
      const lista = normalizarVisitas(visitas.data);

      let feedback: Record<string, string> = {};
      if (lista.length > 0) {
        const respuesta = await supabase
          .from("feedback")
          .select("visita_id, valor")
          .in(
            "visita_id",
            lista.map((v) => v.id),
          );
        if (!vigente) return;
        if (respuesta.error) return setEstado({ tipo: "error" });
        feedback = feedbackPorVisita(respuesta.data);
      }
      setEstado({ tipo: "listo", visitas: lista, feedback, ahora: new Date() });
    })();
    return () => {
      vigente = false;
    };
  }, []);

  const abierta = estado.tipo === "listo" ? estado.visitas.find((v) => v.salida === null) : undefined;

  return (
    <section aria-label={TEXTOS.alumnoTitulo} className="space-y-4">
      <Link href="/alumno" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {TEXTOS.volver}
      </Link>

      {/* El título «Mi historial» ya está en el encabezado fijo (MarcoAlumno). */}
      <p className="text-sm text-slate-600">{TEXTOS.alumnoDetalle}</p>

      {estado.tipo === "cargando" && <p className="py-6 text-center text-sm text-tinta-suave">{TEXTOS.cargando}</p>}
      {estado.tipo === "error" && (
        <Aviso tono="red" role="alert">
          {TEXTOS.sinConexion}
        </Aviso>
      )}
      {estado.tipo === "sin_alumno" && (
        <Tarjeta>
          <EstadoVacio icono={UserX} titulo={TEXTOS_RUTINA.sinAlumnoTitulo}>
            {TEXTOS_RUTINA.sinAlumnoDetalle}
          </EstadoVacio>
        </Tarjeta>
      )}

      {abierta && (
        <Aviso tono="blue" role="status" icono={DoorOpen} titulo={`${TEXTOS.enGimnasioDesde} ${hora(abierta.entrada)}`}>
          {fechaTitulo(abierta.entrada)}
        </Aviso>
      )}

      {estado.tipo === "listo" && estado.visitas.length === 0 && (
        <Tarjeta>
          <EstadoVacio icono={History} titulo={TEXTOS.alumnoVacioTitulo}>
            {TEXTOS.alumnoVacioDetalle}
          </EstadoVacio>
        </Tarjeta>
      )}

      {estado.tipo === "listo" && (
        <ol className="space-y-2.5">
          {estado.visitas
            .filter((v) => v.salida !== null)
            .map((v) => {
              const tipo = tipoCierre(v);
              const valor = estado.feedback[v.id];
              return (
                <li key={v.id}>
                  <Tarjeta className="space-y-2.5 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[15px] font-semibold text-navy-900">{fechaTitulo(v.entrada)}</p>
                      <span className="tnum shrink-0 text-sm font-medium text-slate-600">
                        {textoDuracion(duracionMinutos(v, estado.ahora))}
                      </span>
                    </div>
                    <p className="tnum text-sm text-slate-700">
                      Entrada {hora(v.entrada)} · Salida {v.salida && hora(v.salida)}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <Insignia tono={TONO_CIERRE[tipo]} punto tamano="sm">
                        {ETIQUETA_CIERRE[tipo]}
                      </Insignia>
                      {valor && esValor(valor) ? (
                        <Insignia tono={TONO_FEEDBACK[valor]} tamano="sm">
                          {ETIQUETA_FEEDBACK[valor]}
                        </Insignia>
                      ) : (
                        <Insignia tono="neutral" tamano="sm">
                          {TEXTOS.sinFeedback}
                        </Insignia>
                      )}
                    </div>
                  </Tarjeta>
                </li>
              );
            })}
        </ol>
      )}
    </section>
  );
}
