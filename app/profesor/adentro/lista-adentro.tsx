"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { EncabezadoProfesor } from "../encabezado-profesor";

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
    <div className="min-h-svh w-full">
      <EncabezadoProfesor seccion="Adentro" />

      <main className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-semibold">{TEXTOS.adentroTitulo}</h1>
          <p className="text-sm text-muted-foreground">{TEXTOS.adentroDetalle}</p>
        </div>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <span className="text-muted-foreground">Aforo actual</span>
            <span className="text-3xl font-bold tabular-nums">
              {aforo ? `${aforo.ocupacion} / ${aforo.capacidad}` : "—"}
            </span>
          </CardContent>
        </Card>

        {error && (
          <div role="alert" className="rounded-lg bg-red-600 p-4 text-white">
            <p className="font-bold">{error.titulo}</p>
            <p className="text-sm">{error.detalle}</p>
          </div>
        )}
        {aviso && (
          <p role="status" className="rounded-lg bg-green-600 p-4 font-semibold text-white">
            {aviso}
          </p>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visitas abiertas</CardTitle>
            <CardDescription>
              Se cierran solas a las {horasCierre} h si nadie marca la salida (regla 6).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorLectura && <p className="mb-3 text-sm text-destructive">{TEXTOS.lecturaFallida}</p>}
            {visitas && visitas.length === 0 ? (
              <p className="text-sm text-muted-foreground">{TEXTOS.adentroVacio}</p>
            ) : (
              <ul className="divide-y">
                {(visitas ?? []).map((v) => {
                  const confirmando = porConfirmar === v.id;
                  const vencida = superaCierreAutomatico(v.entrada, ahora, horasCierre);
                  return (
                    <li key={v.id} className="space-y-3 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold">{v.nombre}</p>
                          <p className="text-sm text-muted-foreground tabular-nums">
                            Entró a las {horaEntrada(v.entrada)} · {tiempoAdentro(v.entrada, ahora)}
                          </p>
                        </div>
                        {vencida && (
                          <Badge className="bg-yellow-400 text-black hover:bg-yellow-400">Más de {horasCierre} h</Badge>
                        )}
                      </div>

                      {confirmando ? (
                        <div className="space-y-2 rounded-md border-2 border-yellow-500 p-3">
                          <p className="font-medium">{textoConfirmarCierre(v.nombre)}</p>
                          <div className="flex flex-wrap gap-2">
                            <Button disabled={cerrando !== null} onClick={() => cerrar(v)}>
                              {cerrando === v.id ? "Cerrando…" : TEXTOS.confirmar}
                            </Button>
                            <Button variant="ghost" disabled={cerrando !== null} onClick={() => setPorConfirmar(null)}>
                              {TEXTOS.cancelar}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
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
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
