"use client";

import { DoorOpen } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Aviso } from "@/components/marca/aviso";
import { Avatar } from "@/components/marca/avatar";
import { EstadoVacio } from "@/components/marca/estado-vacio";
import { Insignia } from "@/components/marca/insignia";
import { EncabezadoPagina, EncabezadoTarjeta, Tarjeta } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import { esErrorConocido } from "@/lib/rutina/mensajes";
import { TEXTOS, textoErrorProfesor, type ErrorProfesor } from "@/lib/profesor/mensajes";
import {
  horaEntrada,
  nombreCorto,
  normalizarVisitasAbiertas,
  superaCierreAutomatico,
  textoConfirmarCierre,
  tiempoAdentro,
  type VisitaAbierta,
} from "@/lib/profesor/visitas";
import { createClient } from "@/lib/supabase/client";

type Aforo = { ocupacion: number; capacidad: number };

// Respaldo por si Realtime se desconecta (riesgo R04), como /profesor/espera.
const INTERVALO_RESPALDO_MS = 15000;
const CIERRE_AUTOMATICO_RESPALDO_HORAS = 3; // solo si no se pudo leer configuracion

/**
 * F-28 (D21): quiénes están adentro y botón «Cerrar visita» para quien se fue sin pasar su credencial.
 * cerrar_visita (012) libera el cupo y llama al siguiente turno como la salida normal.
 * Se actualiza con la fila de aforo en tiempo real (toda entrada y salida la cambia) y cada 15 s.
 */
export function ListaAdentro() {
  const supabaseRef = useRef(createClient());
  const [visitas, setVisitas] = useState<VisitaAbierta[] | null>(null);
  const [aforo, setAforo] = useState<Aforo | null>(null);
  const [horasCierre, setHorasCierre] = useState(CIERRE_AUTOMATICO_RESPALDO_HORAS);
  const [errorLectura, setErrorLectura] = useState(false);
  const [porConfirmar, setPorConfirmar] = useState<string | null>(null);
  const [cerrando, setCerrando] = useState<string | null>(null);
  const [error, setError] = useState<ErrorProfesor | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const leer = useCallback(async () => {
    const supabase = supabaseRef.current;
    const [respuestaVisitas, respuestaAforo, respuestaConfig] = await Promise.all([
      supabase.from("visitas").select("id, entrada, salida, alumnos(nombre)").is("salida", null).order("entrada"),
      supabase.from("aforo").select("ocupacion, capacidad").eq("id", 1).maybeSingle(),
      supabase.from("configuracion").select("cierre_automatico_horas").eq("id", 1).maybeSingle(),
    ]);
    setErrorLectura(Boolean(respuestaVisitas.error));
    if (!respuestaVisitas.error) setVisitas(normalizarVisitasAbiertas(respuestaVisitas.data));
    if (respuestaAforo.data) setAforo(respuestaAforo.data as Aforo);
    const horas = respuestaConfig.data?.cierre_automatico_horas;
    if (typeof horas === "number" && horas > 0) setHorasCierre(horas);
  }, []);

  useEffect(() => {
    const supabase = supabaseRef.current;
    void leer();
    // Basta escuchar la fila de aforo: registrar_ingreso y cerrar_visita la actualizan siempre.
    const canal = supabase
      .channel("profesor-adentro")
      .on("postgres_changes", { event: "*", schema: "public", table: "aforo", filter: "id=eq.1" }, () => void leer())
      .subscribe();
    const intervalo = setInterval(leer, INTERVALO_RESPALDO_MS);
    return () => {
      clearInterval(intervalo);
      void supabase.removeChannel(canal);
    };
  }, [leer]);

  async function cerrar(visita: VisitaAbierta) {
    setCerrando(visita.id);
    setError(null);
    setAviso(null);
    try {
      const { data, error: errorRpc } = await supabaseRef.current.rpc("cerrar_visita", { p_visita: visita.id });
      if (errorRpc) {
        setError(textoErrorProfesor(errorRpc));
        if (esErrorConocido(errorRpc, "visita_ya_cerrada")) setPorConfirmar(null);
      } else {
        const turno = (data as { turno_llamado?: unknown } | null)?.turno_llamado;
        setAviso(
          `Salida de ${nombreCorto(visita.nombre)} registrada.` +
            (typeof turno === "number" ? ` Se llamó al turno ${turno}.` : ""),
        );
        setPorConfirmar(null);
      }
    } catch {
      setError(textoErrorProfesor({}));
    } finally {
      setCerrando(null);
      await leer();
    }
  }

  const ahora = new Date();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <EncabezadoPagina eyebrow="Profesor encargado" titulo={TEXTOS.adentroTitulo} subtitulo={TEXTOS.adentroDetalle} />

      <Tarjeta className="flex items-center justify-between p-5">
        <span className="text-sm font-medium text-tinta-suave">Aforo actual</span>
        <span className="tnum text-3xl font-bold text-navy-900">
          {aforo ? `${aforo.ocupacion} / ${aforo.capacidad}` : "—"}
        </span>
      </Tarjeta>

      {error && (
        <Aviso tono="red" role="alert" titulo={error.titulo} className="animate-pop-in">
          {error.detalle}
        </Aviso>
      )}
      {aviso && (
        <Aviso tono="green" role="status" className="animate-pop-in">
          <span className="font-semibold">{aviso}</span>
        </Aviso>
      )}

      <Tarjeta>
        <EncabezadoTarjeta
          titulo="Visitas abiertas"
          subtitulo={`Se cierran solas a las ${horasCierre} h si nadie marca la salida (regla 6).`}
        />
        <div className="px-5 pb-3 pt-2">
          {errorLectura && <p className="mb-3 text-sm font-medium text-red-600">{TEXTOS.lecturaFallida}</p>}
          {visitas && visitas.length === 0 ? (
            <EstadoVacio icono={DoorOpen} titulo={TEXTOS.adentroVacio}>
              Las entradas registradas en el kiosco aparecen aquí.
            </EstadoVacio>
          ) : (
            <ul className="divide-y divide-line">
              {(visitas ?? []).map((v) => {
                const confirmando = porConfirmar === v.id;
                const vencida = superaCierreAutomatico(v.entrada, ahora, horasCierre);
                return (
                  <li key={v.id} className="space-y-3 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Avatar nombre={v.nombre} />
                      <div className="min-w-0 flex-1 basis-40">
                        <p className="truncate font-semibold text-navy-900">{v.nombre}</p>
                        <p className="tnum text-sm text-tinta-suave">
                          Entró a las {horaEntrada(v.entrada)} · {tiempoAdentro(v.entrada, ahora)}
                        </p>
                      </div>
                      {vencida && (
                        <Insignia tono="amber" punto>
                          Más de {horasCierre} h
                        </Insignia>
                      )}
                      {!confirmando && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full sm:w-auto"
                          disabled={cerrando !== null}
                          onClick={() => {
                            setPorConfirmar(v.id);
                            setAviso(null);
                            setError(null);
                          }}
                        >
                          {TEXTOS.cerrarVisita}
                        </Button>
                      )}
                    </div>

                    {confirmando && (
                      <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-3 animate-pop-in">
                        <p className="font-medium text-red-900">{textoConfirmarCierre(v.nombre)}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="danger" size="sm" disabled={cerrando !== null} onClick={() => cerrar(v)}>
                            {cerrando === v.id ? "Cerrando…" : TEXTOS.confirmar}
                          </Button>
                          <Button variant="ghost" size="sm" disabled={cerrando !== null} onClick={() => setPorConfirmar(null)}>
                            {TEXTOS.cancelar}
                          </Button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Tarjeta>
    </div>
  );
}
