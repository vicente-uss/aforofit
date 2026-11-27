"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Fila única de la tabla `aforo` (la actualiza registrar_ingreso en cada entrada y salida).
export type FilaAforo = {
  ocupacion: number;
  capacidad: number;
  turno_llamado: number | null;
  turno_llamado_nombre: string | null;
  en_espera: number;
  umbral_casi_lleno: number | null;
  actualizado_en: string;
};

// Respaldo por si Realtime se desconecta (riesgo R04): se vuelve a leer la tabla cada 15 s.
const INTERVALO_RESPALDO_MS = 15000;

const COLUMNAS = "ocupacion, capacidad, turno_llamado, turno_llamado_nombre, en_espera, umbral_casi_lleno, actualizado_en";

/**
 * Lee la fila de aforo (id = 1) y la mantiene al día: una lectura inicial, los cambios en vivo por
 * Realtime y una relectura de respaldo cada 15 s. La usan la pantalla pública (/aforo) y el kiosco
 * (/ingreso); `nombreCanal` evita que ambas compartan el mismo canal de Supabase.
 */
export function useAforo(nombreCanal: string) {
  const [aforo, setAforo] = useState<FilaAforo | null>(null);
  const [sinConexion, setSinConexion] = useState(false);
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    const supabase = supabaseRef.current;
    let vigente = 0;
    let activo = true;

    const leer = async () => {
      if (!activo) return;
      const peticion = ++vigente;
      const { data, error } = await supabase.from("aforo").select(COLUMNAS).eq("id", 1).maybeSingle();
      if (!activo || peticion !== vigente) return;
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
      .channel(nombreCanal)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "aforo", filter: "id=eq.1" },
        (cambio) => {
          if (!activo) return;
          // Un DELETE no trae fila nueva: se vuelve a leer la tabla.
          if (cambio.eventType === "DELETE") {
            void leer();
            return;
          }
          ++vigente;
          setSinConexion(false);
          setAforo(cambio.new as FilaAforo);
        },
      )
      .subscribe();

    const intervalo = setInterval(leer, INTERVALO_RESPALDO_MS);
    return () => {
      activo = false;
      clearInterval(intervalo);
      void supabase.removeChannel(canal);
    };
  }, [nombreCanal]);

  return { aforo, sinConexion };
}
