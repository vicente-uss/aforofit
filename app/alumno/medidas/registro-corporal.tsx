"use client";

import { ArrowLeft, Pencil, Plus, Ruler, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Aviso } from "@/components/marca/aviso";
import { EstadoVacio } from "@/components/marca/estado-vacio";
import { Tarjeta } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CAMPOS, METRICAS, calcularImc, fechaVisible, hoyEnSantiago, leerMedicion, leerValor,
  ordenarHistorial, valorVisible, type Medicion,
} from "@/lib/medidas/mediciones";
import { createClient } from "@/lib/supabase/client";
import { EvolucionMedidas, CompararMedidas } from "./evolucion-medidas";

const COLUMNAS = "id, fecha, peso_kg, estatura_cm, cintura_cm, imc";
const TAMANO_PAGINA = 200;

type Operacion = { tipo: "nueva" } | { tipo: "editar" | "eliminar"; medicion: Medicion };
type Carga = "cargando" | "error" | "lista";

export function RegistroCorporal({ hoy }: { hoy: string }) {
  const [mediciones, setMediciones] = useState<Medicion[]>([]);
  const [carga, setCarga] = useState<Carga>("cargando");
  const [intento, setIntento] = useState(0);
  const [operacion, setOperacion] = useState<Operacion | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const dialogo = useRef<HTMLDialogElement>(null);
  const guardando = useRef(false);

  useEffect(() => {
    const abortar = new AbortController();
    void (async () => {
      try {
        const supabase = createClient();
        const historial: Medicion[] = [];
        for (let inicio = 0; ; inicio += TAMANO_PAGINA) {
          const { data, error } = await supabase.from("mediciones")
            .select(COLUMNAS).order("fecha", { ascending: false }).order("id", { ascending: false })
            .range(inicio, inicio + TAMANO_PAGINA - 1).abortSignal(abortar.signal);
          if (error) throw error;
          historial.push(...data);
          if (data.length < TAMANO_PAGINA) break;
        }
        if (abortar.signal.aborted) return;
        setMediciones(historial);
        setCarga("lista");
      } catch {
        if (!abortar.signal.aborted) setCarga("error");
      }
    })();
    return () => abortar.abort();
  }, [intento]);

  useEffect(() => {
    if (operacion && !dialogo.current?.open) dialogo.current?.showModal();
  }, [operacion]);

  function abrir(siguiente: Operacion) {
    setMensaje("");
    setError("");
    setOperacion(siguiente);
  }

  async function confirmar(formulario: FormData) {
    if (!operacion || guardando.current) return;
    const datos = operacion.tipo === "eliminar" ? null : leerMedicion(formulario, hoyEnSantiago());
    if (typeof datos === "string") return setError(datos);

    guardando.current = true;
    setOcupado(true);
    setError("");
    try {
      const tabla = createClient().from("mediciones");
      if (operacion.tipo === "eliminar") {
        const { data, error } = await tabla.delete().eq("id", operacion.medicion.id).select("id").single();
        if (error) throw error;
        setMediciones((actuales) => actuales.filter((m) => m.id !== data.id));
        setMensaje("Medición eliminada.");
      } else if (datos) {
        const consulta = operacion.tipo === "nueva"
          ? tabla.insert(datos)
          : tabla.update(datos).eq("id", operacion.medicion.id);
        const { data, error } = await consulta.select(COLUMNAS).single();
        if (error) throw error;
        setMediciones((actuales) => ordenarHistorial([...actuales.filter((m) => m.id !== data.id), data]));
        setMensaje(operacion.tipo === "nueva" ? "Medición registrada." : "Cambios guardados.");
      }
      dialogo.current?.close();
    } catch {
      setError("No pudimos completar la acción. Revisa tu conexión y vuelve a intentar.");
    } finally {
      guardando.current = false;
      setOcupado(false);
    }
  }

  const actual = operacion && "medicion" in operacion ? operacion.medicion : undefined;

  return (
    <>
      <Link href="/alumno" className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Volver a mi rutina
      </Link>

      {carga === "cargando" && <p role="status" className="text-sm text-slate-600">Cargando tus mediciones…</p>}
      {carga === "error" && (
        <Aviso tono="red" role="alert">
          <p>No pudimos cargar tus mediciones.</p>
          <Button className="mt-2" variant="secondary" onClick={() => {
            setCarga("cargando");
            setIntento((n) => n + 1);
          }}>Reintentar</Button>
        </Aviso>
      )}

      {carga === "lista" && (
        <>
          <Button size="lg" className="w-full" onClick={() => abrir({ tipo: "nueva" })}>
            <Plus aria-hidden /> Registrar medición
          </Button>
          {mensaje && <Aviso tono="green" role="status">{mensaje}</Aviso>}
          {mediciones.length === 0 ? (
            <Tarjeta>
              <EstadoVacio icono={Ruler} titulo="Sin mediciones todavía">
                Registra tu primera medición para seguir tu evolución.
              </EstadoVacio>
            </Tarjeta>
          ) : (
            <>
              <EvolucionMedidas mediciones={mediciones} />
              <CompararMedidas mediciones={mediciones} />
              <section aria-labelledby="titulo-historial-medidas" className="space-y-2">
                <h2 id="titulo-historial-medidas" className="font-semibold text-navy-900">Historial</h2>
                <ol className="space-y-2">
                  {mediciones.map((medicion) => (
                    <li key={medicion.id}>
                      <Tarjeta className="space-y-3 p-4">
                        <time dateTime={medicion.fecha} className="font-semibold text-navy-900">{fechaVisible(medicion.fecha)}</time>
                        <dl className="grid grid-cols-2 gap-3 text-sm">
                          {METRICAS.map(({ clave, etiqueta, unidad }) => {
                            const valor = medicion[clave];
                            return (
                              <div key={clave}>
                                <dt className="text-slate-600">{etiqueta}</dt>
                                <dd className="font-medium text-navy-900">{valor === null ? "Sin registro" : valorVisible(valor, unidad)}</dd>
                              </div>
                            );
                          })}
                        </dl>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="secondary" onClick={() => abrir({ tipo: "editar", medicion })}><Pencil aria-hidden /> Editar</Button>
                          <Button variant="ghost" className="text-red-700" onClick={() => abrir({ tipo: "eliminar", medicion })}><Trash2 aria-hidden /> Eliminar</Button>
                        </div>
                      </Tarjeta>
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )}
        </>
      )}

      <dialog
        ref={dialogo}
        aria-labelledby="titulo-dialogo-medidas"
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-2xl border border-line bg-white p-5 text-navy-900 shadow-lift backdrop:bg-navy-950/50"
        onClose={() => setOperacion(null)}
        onCancel={(evento) => { if (guardando.current) evento.preventDefault(); }}
      >
        {operacion && (
          <div className="space-y-4">
            <h2 id="titulo-dialogo-medidas" className="text-lg font-semibold">
              {operacion.tipo === "nueva" ? "Registrar medición" : operacion.tipo === "editar" ? "Editar medición" : "¿Eliminar esta medición?"}
            </h2>
            {operacion.tipo === "eliminar" ? (
              <form action={confirmar} className="space-y-4">
                <p className="text-sm text-slate-600">Se eliminará la medición del {fechaVisible(operacion.medicion.fecha)} de tu historial.</p>
                {error && <Aviso tono="red" role="alert">{error}</Aviso>}
                <div className="flex flex-wrap justify-end gap-2">
                  <Button type="button" variant="secondary" disabled={ocupado} onClick={() => dialogo.current?.close()}>Cancelar</Button>
                  <Button variant="danger" disabled={ocupado}>{ocupado ? "Eliminando…" : "Sí, eliminar"}</Button>
                </div>
              </form>
            ) : (
              <FormularioMedicion actual={actual} hoy={hoy} error={error} ocupado={ocupado} confirmar={confirmar} cancelar={() => dialogo.current?.close()} />
            )}
          </div>
        )}
      </dialog>
    </>
  );
}

function FormularioMedicion({ actual, hoy, error, ocupado, confirmar, cancelar }: {
  actual?: Medicion;
  hoy: string;
  error: string;
  ocupado: boolean;
  confirmar: (formulario: FormData) => Promise<void>;
  cancelar: () => void;
}) {
  const [peso, setPeso] = useState(() => String(actual?.peso_kg ?? ""));
  const [estatura, setEstatura] = useState(() => String(actual?.estatura_cm ?? ""));
  const pesoKg = leerValor(peso, CAMPOS[0]);
  const estaturaCm = leerValor(estatura, CAMPOS[1]);
  const imc = pesoKg === null || estaturaCm === null ? null : calcularImc(pesoKg, estaturaCm);

  return (
    <form className="space-y-3" onSubmit={(evento) => {
      evento.preventDefault();
      void confirmar(new FormData(evento.currentTarget));
    }}>
      <label className="block space-y-1 text-sm font-medium">
        <span>Fecha de medición</span>
        <Input name="fecha" type="date" max={hoy} defaultValue={actual?.fecha ?? hoy} required />
      </label>
      {CAMPOS.map(({ clave, etiqueta, unidad, ejemplo }) => (
        <label key={clave} className="block space-y-1 text-sm font-medium">
          <span>{etiqueta} ({unidad}){clave === "cintura_cm" && <span className="font-normal text-slate-600"> · opcional</span>}</span>
          <Input
            name={clave}
            inputMode="decimal"
            placeholder={ejemplo}
            maxLength={12}
            required={clave !== "cintura_cm"}
            defaultValue={actual?.[clave] ?? undefined}
            onChange={(evento) => {
              if (clave === "peso_kg") setPeso(evento.target.value);
              if (clave === "estatura_cm") setEstatura(evento.target.value);
            }}
          />
        </label>
      ))}
      <p className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-navy-900">
        IMC <output>{imc === null ? "· Ingresa peso y estatura" : valorVisible(imc, "kg/m²")}</output>
      </p>
      {error && <Aviso tono="red" role="alert">{error}</Aviso>}
      <div className="flex flex-wrap justify-end gap-2 pt-1">
        <Button type="button" variant="secondary" disabled={ocupado} onClick={cancelar}>Cancelar</Button>
        <Button disabled={ocupado}>{ocupado ? "Guardando…" : actual ? "Confirmar cambios" : "Guardar medición"}</Button>
      </div>
    </form>
  );
}
