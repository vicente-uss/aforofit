"use client";

import { Dumbbell, Wrench } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Aviso } from "@/components/marca/aviso";
import { EstadoVacio } from "@/components/marca/estado-vacio";
import { Insignia } from "@/components/marca/insignia";
import { EncabezadoPagina, EncabezadoTarjeta, Tarjeta } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import {
  ETIQUETA_ESTADO,
  estadoOpuesto,
  normalizarMaquinas,
  resumenMantencion,
  textoBotonCambio,
  textoConfirmarCambio,
  type Maquina,
} from "@/lib/profesor/maquinas";
import { TEXTOS, textoErrorProfesor, type ErrorProfesor } from "@/lib/profesor/mensajes";
import { urlFotoMaquina } from "@/lib/rutina/pantalla";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// Respaldo: otro profesor puede cambiar un estado desde otro computador.
const INTERVALO_RESPALDO_MS = 15000;
const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * F-03 (B5, RF20): el profesor alterna cada máquina entre Disponible y En mantención, con confirmación.
 * El cambio se hace con cambiar_estado_maquina (012); la advertencia en la rutina del alumno la calcula
 * rutina_del_dia al leer (regla 7), sin guardar nada más.
 */
export function EstadoMaquinas() {
  const supabaseRef = useRef(createClient());
  const [maquinas, setMaquinas] = useState<Maquina[] | null>(null);
  const [errorLectura, setErrorLectura] = useState(false);
  const [porConfirmar, setPorConfirmar] = useState<number | null>(null); // id con la confirmación abierta
  const [guardando, setGuardando] = useState<number | null>(null);
  const [error, setError] = useState<ErrorProfesor | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const leer = useCallback(async () => {
    const { data, error: errorSelect } = await supabaseRef.current
      .from("maquinas")
      .select("id, nombre, cantidad, estado, foto_url");
    setErrorLectura(Boolean(errorSelect));
    if (!errorSelect) setMaquinas(normalizarMaquinas(data));
  }, []);

  useEffect(() => {
    void leer();
    const intervalo = setInterval(leer, INTERVALO_RESPALDO_MS);
    return () => clearInterval(intervalo);
  }, [leer]);

  async function cambiar(maquina: Maquina) {
    const nuevo = estadoOpuesto(maquina.estado);
    setGuardando(maquina.id);
    setError(null);
    setAviso(null);
    try {
      const { error: errorRpc } = await supabaseRef.current.rpc("cambiar_estado_maquina", {
        p_maquina: maquina.id,
        p_estado: nuevo,
      });
      if (errorRpc) {
        setError(textoErrorProfesor(errorRpc));
      } else {
        setAviso(`«${maquina.nombre}» quedó ${ETIQUETA_ESTADO[nuevo]}.`);
        setPorConfirmar(null);
      }
    } catch {
      setError(textoErrorProfesor({}));
    } finally {
      setGuardando(null);
      await leer();
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <EncabezadoPagina eyebrow="Profesor encargado" titulo={TEXTOS.maquinasTitulo} subtitulo={TEXTOS.maquinasDetalle} />

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
          titulo="Máquinas"
          subtitulo={maquinas ? resumenMantencion(maquinas) : "Cargando…"}
          accion={
            maquinas && (
              <Insignia tono={maquinas.some((m) => m.estado === "en_mantencion") ? "amber" : "green"} punto>
                {resumenMantencion(maquinas)}
              </Insignia>
            )
          }
        />
        <div className="px-5 pb-3 pt-2">
          {errorLectura && <p className="mb-3 text-sm font-medium text-red-600">{TEXTOS.lecturaFallida}</p>}
          {maquinas && maquinas.length === 0 && (
            <EstadoVacio icono={Wrench} titulo="No hay máquinas registradas">
              El catálogo se carga por SQL en esta versión.
            </EstadoVacio>
          )}
          <ul className="divide-y divide-line">
            {(maquinas ?? []).map((m) => {
              const foto = urlFotoMaquina(URL_SUPABASE, m.foto_url);
              const confirmando = porConfirmar === m.id;
              const enMantencion = m.estado === "en_mantencion";
              return (
                <li key={m.id} className="space-y-3 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {foto ? (
                        // Foto del bucket público «maquinas»; <img> simple, como en /alumno.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={foto}
                          alt={m.nombre}
                          loading="lazy"
                          className={cn("h-full w-full object-cover", enMantencion && "opacity-60 grayscale")}
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-slate-400">
                          <Dumbbell className="h-6 w-6" aria-hidden />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 basis-40">
                      <p className="font-semibold leading-tight text-navy-900">{m.nombre}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Insignia tono={enMantencion ? "amber" : "green"} punto>
                          {ETIQUETA_ESTADO[m.estado]}
                        </Insignia>
                        {m.cantidad > 1 && <span className="text-xs text-tinta-suave">{m.cantidad} equipos</span>}
                      </div>
                    </div>
                    {!confirmando && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full sm:w-auto"
                        disabled={guardando !== null}
                        onClick={() => {
                          setPorConfirmar(m.id);
                          setAviso(null);
                          setError(null);
                        }}
                      >
                        {textoBotonCambio(m.estado)}
                      </Button>
                    )}
                  </div>

                  {confirmando && (
                    <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-3 animate-pop-in">
                      <p className="text-sm text-amber-900">{textoConfirmarCambio(m)}</p>
                      <div className="flex flex-wrap gap-2">
                        {/* Pasar a mantención es una advertencia; volver a disponible, una confirmación positiva. */}
                        <Button
                          variant={estadoOpuesto(m.estado) === "en_mantencion" ? "warning" : "success"}
                          size="sm"
                          disabled={guardando !== null}
                          onClick={() => cambiar(m)}
                        >
                          {guardando === m.id ? "Guardando…" : TEXTOS.confirmar}
                        </Button>
                        <Button variant="ghost" size="sm" disabled={guardando !== null} onClick={() => setPorConfirmar(null)}>
                          {TEXTOS.cancelar}
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Tarjeta>
    </div>
  );
}
