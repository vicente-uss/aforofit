"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  COLOR_ESTADO,
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
import { EncabezadoProfesor } from "../encabezado-profesor";

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
    <div className="min-h-svh w-full">
      <EncabezadoProfesor seccion="Mantención" />

      <main className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-semibold">{TEXTOS.maquinasTitulo}</h1>
          <p className="text-sm text-muted-foreground">{TEXTOS.maquinasDetalle}</p>
        </div>

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
            <CardTitle className="text-lg">Máquinas</CardTitle>
            <CardDescription>{maquinas ? resumenMantencion(maquinas) : "Cargando…"}</CardDescription>
          </CardHeader>
          <CardContent>
            {errorLectura && <p className="mb-3 text-sm text-destructive">{TEXTOS.lecturaFallida}</p>}
            <ul className="divide-y">
              {(maquinas ?? []).map((m) => {
                const foto = urlFotoMaquina(URL_SUPABASE, m.foto_url);
                const confirmando = porConfirmar === m.id;
                return (
                  <li key={m.id} className="space-y-3 py-4">
                    <div className="flex items-center gap-3">
                      {foto && (
                        // Foto del bucket público «maquinas»; <img> simple, como en /alumno.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={foto}
                          alt={m.nombre}
                          loading="lazy"
                          className="h-16 w-16 shrink-0 rounded-md border object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-tight">{m.nombre}</p>
                        {m.cantidad > 1 && <p className="text-sm text-muted-foreground">{m.cantidad} equipos</p>}
                      </div>
                      <Badge className={`shrink-0 hover:opacity-100 ${COLOR_ESTADO[m.estado]}`}>
                        {ETIQUETA_ESTADO[m.estado]}
                      </Badge>
                    </div>

                    {confirmando ? (
                      <div className="space-y-2 rounded-md border-2 border-yellow-500 p-3">
                        <p className="text-sm">{textoConfirmarCambio(m)}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button disabled={guardando !== null} onClick={() => cambiar(m)}>
                            {guardando === m.id ? "Guardando…" : TEXTOS.confirmar}
                          </Button>
                          <Button variant="ghost" disabled={guardando !== null} onClick={() => setPorConfirmar(null)}>
                            {TEXTOS.cancelar}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
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
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
