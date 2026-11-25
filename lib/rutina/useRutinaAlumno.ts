"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  normalizarAlumno,
  normalizarEjercicios,
  normalizarVisita,
  type AlumnoPropio,
  type EjercicioDelDia,
  type Visita,
} from "./pantalla";

export type DatosAlumno = {
  alumno: AlumnoPropio | null;
  ejercicios: EjercicioDelDia[];
  ultimaVisita: Visita | null;
  feedbackUltimaVisita: boolean;
};

// Respaldo por si Realtime se desconecta (riesgo R04), igual que /aforo.
const INTERVALO_RESPALDO_MS = 15000;

/**
 * Datos de la pantalla del alumno: su fila de alumnos, su rutina del día, su última visita y si ya
 * respondió el feedback de esa visita. Se mantienen al día con:
 * - Realtime sobre public.visitas filtrado por su alumno_id (D13): la entrada y la salida llegan
 *   en vivo. RLS (visitas_leer) hace que el alumno reciba solo sus propias visitas.
 * - Una relectura completa cada 15 s como respaldo.
 * La suscripción y el intervalo se cancelan al salir de la página.
 */
export function useRutinaAlumno() {
  const [datos, setDatos] = useState<DatosAlumno | null>(null);
  const [sinConexion, setSinConexion] = useState(false);
  const [alumnoId, setAlumnoId] = useState<string | null>(null);
  const supabaseRef = useRef(createClient());

  const leer = useCallback(async () => {
    const supabase = supabaseRef.current;

    // RLS de alumnos (007): el alumno solo ve su propia fila.
    const respuestaAlumno = await supabase.from("alumnos").select("id, nombre, objetivo, nivel").maybeSingle();
    if (respuestaAlumno.error) {
      setSinConexion(true);
      return;
    }
    const alumno = normalizarAlumno(respuestaAlumno.data);
    if (!alumno) {
      setSinConexion(false);
      setDatos({ alumno: null, ejercicios: [], ultimaVisita: null, feedbackUltimaVisita: false });
      return;
    }

    const [respuestaRutina, respuestaVisita] = await Promise.all([
      supabase.rpc("rutina_del_dia"),
      supabase
        .from("visitas")
        // «*» en vez de la lista de columnas: así la pantalla sigue funcionando aunque 012 (cerrada_por)
        // se aplique en Supabase después del despliegue. RLS limita las filas a las del propio alumno.
        .select("*")
        .eq("alumno_id", alumno.id)
        .order("entrada", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    if (respuestaRutina.error || respuestaVisita.error) {
      setSinConexion(true);
      return;
    }

    const ultimaVisita = normalizarVisita(respuestaVisita.data);
    let feedbackUltimaVisita = false;
    if (ultimaVisita) {
      const respuestaFeedback = await supabase
        .from("feedback")
        .select("id")
        .eq("visita_id", ultimaVisita.id)
        .maybeSingle();
      if (respuestaFeedback.error) {
        setSinConexion(true);
        return;
      }
      feedbackUltimaVisita = respuestaFeedback.data !== null;
    }

    setSinConexion(false);
    setAlumnoId(alumno.id);
    setDatos({
      alumno,
      ejercicios: normalizarEjercicios(respuestaRutina.data),
      ultimaVisita,
      feedbackUltimaVisita,
    });
  }, []);

  // Lectura inicial y respaldo cada 15 s.
  useEffect(() => {
    void leer();
    const intervalo = setInterval(leer, INTERVALO_RESPALDO_MS);
    return () => clearInterval(intervalo);
  }, [leer]);

  // Realtime: se suscribe cuando ya se conoce el id del alumno.
  useEffect(() => {
    if (!alumnoId) return;
    const supabase = supabaseRef.current;
    const canal = supabase
      .channel(`visitas-alumno-${alumnoId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "visitas", filter: `alumno_id=eq.${alumnoId}` },
        (cambio) => {
          // La fila nueva se aplica al tiro para cambiar de pantalla sin esperar (CA11, 2 s o menos);
          // después se relee todo para traer la rutina y el feedback al día.
          const visita = cambio.eventType === "DELETE" ? null : normalizarVisita(cambio.new);
          if (visita) {
            setDatos((previos) =>
              previos
                ? {
                    ...previos,
                    ultimaVisita: visita,
                    feedbackUltimaVisita:
                      previos.ultimaVisita?.id === visita.id ? previos.feedbackUltimaVisita : false,
                  }
                : previos,
            );
          }
          void leer();
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(canal);
    };
  }, [alumnoId, leer]);

  return { datos, sinConexion, recargar: leer, supabase: supabaseRef.current };
}
