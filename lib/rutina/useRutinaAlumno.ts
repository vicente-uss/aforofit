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
  nombreRutina: string | null;
  generacionHabilitada: boolean;
  ultimaVisita: Visita | null;
  feedbackRutinaId: string | null;
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
  const revision = useRef(0);
  const supabaseRef = useRef(createClient());

  const leer = useCallback(async () => {
    const lectura = ++revision.current;
    const supabase = supabaseRef.current;

    // RLS de alumnos (007): el alumno solo ve su propia fila.
    const respuestaAlumno = await supabase.from("alumnos").select("id, nombre, objetivo, nivel").maybeSingle();
    if (lectura !== revision.current) return;
    if (respuestaAlumno.error) {
      setSinConexion(true);
      return;
    }
    const alumno = normalizarAlumno(respuestaAlumno.data);
    if (!alumno) {
      setSinConexion(false);
      setDatos({ alumno: null, ejercicios: [], nombreRutina: null, generacionHabilitada: false, ultimaVisita: null, feedbackRutinaId: null });
      return;
    }

    const [respuestaRutina, respuestaVisita, modalidades] = await Promise.all([
      supabase.rpc("rutina_del_dia"),
      supabase
        .from("visitas")
        // «*» en vez de la lista de columnas: así la pantalla sigue funcionando aunque 012 (cerrada_por)
        // se aplique en Supabase después del despliegue. RLS limita las filas a las del propio alumno.
        .select("*")
        .eq("alumno_id", alumno.id)
        .order("entrada", { ascending: false })
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.rpc("modalidades_de_rutina"),
    ]);
    if (lectura !== revision.current) return;
    if (respuestaRutina.error || respuestaVisita.error || (modalidades.error && modalidades.error.code !== "PGRST202")) {
      setSinConexion(true);
      return;
    }

    const ultimaVisita = normalizarVisita(respuestaVisita.data);
    const ejercicios = normalizarEjercicios(respuestaRutina.data);
    const idRutina = ejercicios[0]?.rutina_id;
    const nombreRutina = idRutina && ejercicios[0].origen !== "sistema"
      ? (await supabase.from("rutinas").select("nombre").eq("id", idRutina).maybeSingle()).data?.nombre ?? null
      : null;
    let feedbackRutinaId: string | null = null;
    if (ultimaVisita) {
      const respuestaFeedback = await supabase
        .from("feedback")
        .select("rutina_id")
        .eq("visita_id", ultimaVisita.id)
        .maybeSingle();
      if (lectura !== revision.current) return;
      if (respuestaFeedback.error) {
        setSinConexion(true);
        return;
      }
      feedbackRutinaId = respuestaFeedback.data?.rutina_id ?? null;
    }

    if (lectura !== revision.current) return;
    setSinConexion(false);
    setAlumnoId(alumno.id);
    setDatos({
      alumno,
      ejercicios,
      nombreRutina,
      generacionHabilitada: modalidades.data?.sistema === true || modalidades.error?.code === "PGRST202",
      ultimaVisita,
      feedbackRutinaId,
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
        () => { void leer(); },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(canal);
    };
  }, [alumnoId, leer]);

  return { datos, sinConexion, recargar: leer, supabase: supabaseRef.current };
}
