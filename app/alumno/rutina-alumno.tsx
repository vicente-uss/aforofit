"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleCheck, Sparkles, UserX } from "lucide-react";
import { Aviso } from "@/components/marca/aviso";
import { EstadoVacio } from "@/components/marca/estado-vacio";
import { Tarjeta } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import {
  esErrorConocido,
  textoErrorRutina,
  textoObjetivoNivel,
  TEXTOS,
  type ErrorRutina,
} from "@/lib/rutina/mensajes";
import {
  cargasPorOrden,
  compararCargas,
  pantallaAlumno,
  type Nivel,
  type Objetivo,
} from "@/lib/rutina/pantalla";
import type { ValorFeedback } from "@/lib/rutina/progresion";
import { useRutinaAlumno } from "@/lib/rutina/useRutinaAlumno";
import { ElegirObjetivo } from "./elegir-objetivo";
import { PreguntaFeedback, ProximaSesion } from "./feedback";
import { ListaEjercicios } from "./lista-ejercicios";

// Errores después de los cuales conviene releer: la pantalla cambia sola a lo que corresponde.
const ERRORES_QUE_RELEEN = [
  "feedback_ya_registrado",
  "visita_cierre_automatico",
  "visita_cierre_manual",
  "sin_visita",
  "rutina_inactiva",
  "visita_abierta",
  "modalidad_deshabilitada",
];

/**
 * Pantalla de rutina del alumno (CR-01: B1, B3 y B4). Qué se muestra lo decide pantallaAlumno
 * (lib/rutina/pantalla.ts) con los datos de useRutinaAlumno, que escucha la entrada y la salida
 * en tiempo real (D13).
 */
export function RutinaAlumno() {
  const { datos, sinConexion, recargar, supabase } = useRutinaAlumno();
  const [cambiandoObjetivo, setCambiandoObjetivo] = useState(false);
  const [omitidas, setOmitidas] = useState<string[]>([]); // visitas con «Ahora no»
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<ErrorRutina | null>(null);
  // Cargas antes de responder, para mostrar «antes → ahora» en «Tu próxima sesión».
  const [cargasAntes, setCargasAntes] = useState<Record<number, number | null> | null>(null);
  const [respuesta, setRespuesta] = useState<{ valor: ValorFeedback; visitaId: string } | null>(null);

  if (!datos) {
    return (
      <p className="py-10 text-center text-sm text-tinta-suave">
        {sinConexion ? TEXTOS.sinConexion : "Cargando tu rutina…"}
      </p>
    );
  }

  const { alumno, ejercicios, ultimaVisita, generacionHabilitada, nombreRutina } = datos;
  const respuestaActual = respuesta?.visitaId === ultimaVisita?.id ? respuesta : null;
  const pantalla = pantallaAlumno({
    alumno,
    hayRutina: ejercicios.length > 0,
    ultimaVisita,
    feedbackUltimaVisita: datos.feedbackRutinaId !== null,
    feedbackOmitido: ultimaVisita !== null && omitidas.includes(ultimaVisita.id),
    cambiandoObjetivo,
    generacionHabilitada,
    ahora: new Date(),
  });

  // Ejecuta una función de la base y muestra su error en palabras (lib/rutina/mensajes.ts).
  async function ejecutar(accion: () => PromiseLike<{ error: { message?: string; code?: string } | null }>) {
    setOcupado(true);
    setError(null);
    try {
      const { error: errorRpc } = await accion();
      if (errorRpc) {
        setError(textoErrorRutina(errorRpc));
        if (ERRORES_QUE_RELEEN.some((codigo) => esErrorConocido(errorRpc, codigo))) await recargar();
        return false;
      }
      await recargar();
      return true;
    } catch {
      setError(textoErrorRutina({}));
      return false;
    } finally {
      setOcupado(false);
    }
  }

  async function guardarObjetivo(objetivo: Objetivo, nivel: Nivel) {
    const ok = await ejecutar(() =>
      supabase.rpc("elegir_objetivo_nivel", { p_objetivo: objetivo, p_nivel: nivel }),
    );
    if (ok) {
      setCambiandoObjetivo(false);
      setCargasAntes(null);
      setRespuesta(null);
    }
  }

  async function generarRutina() {
    if (!alumno) return;
    await ejecutar(() => supabase.rpc("generar_rutina", { p_alumno: alumno.id }));
  }

  async function responder(valor: ValorFeedback) {
    const rutinaId = ejercicios[0]?.rutina_id;
    if (!rutinaId || !ultimaVisita) return;
    const antes = cargasPorOrden(ejercicios);
    const ok = await ejecutar(async () => {
      const nueva = await supabase.rpc("registrar_feedback_visita", {
        p_visita: ultimaVisita.id, p_rutina: rutinaId, p_valor: valor,
      });
      return nueva.error?.code === "PGRST202"
        ? supabase.rpc("registrar_feedback", { p_rutina: rutinaId, p_valor: valor })
        : nueva;
    });
    if (ok) {
      setCargasAntes(antes);
      setRespuesta({ valor, visitaId: ultimaVisita.id });
    }
  }

  const botonCambiar = generacionHabilitada && alumno?.objetivo && alumno.nivel && pantalla !== "elegir_objetivo" && (
    <Tarjeta className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
      <span className="text-sm">
        <span className="text-tinta-suave">Objetivo: </span>
        <span className="font-semibold text-navy-900">{textoObjetivoNivel(alumno.objetivo, alumno.nivel)}</span>
      </span>
      <Button variant="secondary" size="sm" onClick={() => setCambiandoObjetivo(true)}>
        Cambiar objetivo
      </Button>
    </Tarjeta>
  );

  return (
    <section aria-label="Mi rutina" className="space-y-4">
      {sinConexion && (
        <Aviso tono="slate" role="status">
          {TEXTOS.sinConexion}
        </Aviso>
      )}

      {error && (
        <Aviso tono="red" role="alert" titulo={error.titulo} className="animate-pop-in">
          {error.detalle}
        </Aviso>
      )}

      {pantalla === "sin_alumno" && (
        <Tarjeta>
          <EstadoVacio icono={UserX} titulo={TEXTOS.sinAlumnoTitulo}>
            {TEXTOS.sinAlumnoDetalle}
          </EstadoVacio>
        </Tarjeta>
      )}

      {pantalla === "elegir_objetivo" && alumno && (
        <ElegirObjetivo
          objetivoInicial={alumno.objetivo}
          nivelInicial={alumno.nivel}
          cambiando={cambiandoObjetivo}
          ocupado={ocupado}
          onGuardar={guardarObjetivo}
          onCancelar={cambiandoObjetivo ? () => setCambiandoObjetivo(false) : undefined}
        />
      )}

      {pantalla === "sin_rutina" && (
        <Tarjeta className="pb-5">
          <EstadoVacio icono={Sparkles} titulo={TEXTOS.sinRutinaTitulo} className="pb-5">
            Elige una rutina disponible{generacionHabilitada ? " o genera una con tu objetivo y nivel." : "."}
          </EstadoVacio>
          <div className="space-y-2 px-5">
            <Button asChild variant="outline" className="w-full"><Link href="/alumno/rutinas">Elegir rutina</Link></Button>
            {generacionHabilitada && (
              <Button size="lg" className="w-full" disabled={ocupado} onClick={generarRutina}>
                {ocupado ? "Generando…" : "Generar mi rutina"}
              </Button>
            )}
          </div>
        </Tarjeta>
      )}

      {pantalla === "adentro" && (
        // D13: aparece solo, sin recargar, cuando el kiosco registra la entrada.
        <Aviso tono="green" role="status" icono={CircleCheck} titulo={TEXTOS.adentroTitulo} className="animate-pop-in">
          {TEXTOS.adentroDetalle}
        </Aviso>
      )}

      {pantalla === "esperando_feedback" && (
        <PreguntaFeedback
          ocupado={ocupado}
          ajustaCargas={ejercicios[0]?.origen === "sistema"}
          onResponder={responder}
          onOmitir={() => ultimaVisita && setOmitidas((previas) => [...previas, ultimaVisita.id])}
        />
      )}

      {pantalla === "feedback_enviado" && (
        ejercicios[0]?.origen === "sistema" && datos.feedbackRutinaId === ejercicios[0].rutina_id
          ? <ProximaSesion cambios={compararCargas(respuestaActual ? cargasAntes : null, ejercicios)} respuesta={respuestaActual?.valor ?? null} />
          : <Aviso tono="green" role="status" titulo="Feedback registrado" />
      )}

      {pantalla === "fuera" && (
        <div>
          <h2 className="text-[22px] font-semibold leading-tight text-navy-900">{TEXTOS.fueraTitulo}</h2>
          <p className="mt-1 text-sm text-slate-600">{TEXTOS.fueraDetalle}</p>
        </div>
      )}

      {(pantalla === "adentro" || pantalla === "fuera" || pantalla === "esperando_feedback") && (
        <>
          {pantalla === "esperando_feedback" && (
            <h2 className="pt-2 text-[15px] font-semibold text-navy-900">Tu rutina de hoy</h2>
          )}
          {nombreRutina && <p className="break-words text-lg font-semibold text-navy-900">{nombreRutina}</p>}
          <ListaEjercicios ejercicios={ejercicios} />
        </>
      )}

      {botonCambiar}
    </section>
  );
}
