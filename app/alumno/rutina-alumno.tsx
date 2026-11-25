"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [respuesta, setRespuesta] = useState<ValorFeedback | null>(null);

  if (!datos) {
    return (
      <p className="py-10 text-center text-muted-foreground">
        {sinConexion ? TEXTOS.sinConexion : "Cargando tu rutina…"}
      </p>
    );
  }

  const { alumno, ejercicios, ultimaVisita } = datos;
  const pantalla = pantallaAlumno({
    alumno,
    hayRutina: ejercicios.length > 0,
    ultimaVisita,
    feedbackUltimaVisita: datos.feedbackUltimaVisita,
    feedbackOmitido: ultimaVisita !== null && omitidas.includes(ultimaVisita.id),
    cambiandoObjetivo,
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
    if (!rutinaId) return;
    const antes = cargasPorOrden(ejercicios);
    const ok = await ejecutar(() => supabase.rpc("registrar_feedback", { p_rutina: rutinaId, p_valor: valor }));
    if (ok) {
      setCargasAntes(antes);
      setRespuesta(valor);
    }
  }

  const botonCambiar = alumno?.objetivo && alumno.nivel && pantalla !== "elegir_objetivo" && (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
      <span className="text-sm">
        <span className="text-muted-foreground">Objetivo: </span>
        <span className="font-medium">{textoObjetivoNivel(alumno.objetivo, alumno.nivel)}</span>
      </span>
      <Button variant="outline" size="sm" onClick={() => setCambiandoObjetivo(true)}>
        Cambiar objetivo
      </Button>
    </div>
  );

  return (
    <section aria-label="Mi rutina" className="mx-auto max-w-md space-y-4">
      {sinConexion && (
        <p className="rounded-md bg-muted p-2 text-center text-sm text-muted-foreground">{TEXTOS.sinConexion}</p>
      )}

      {error && (
        <div role="alert" className="rounded-lg bg-red-600 p-4 text-white">
          <p className="font-bold">{error.titulo}</p>
          <p className="text-sm">{error.detalle}</p>
        </div>
      )}

      {pantalla === "sin_alumno" && (
        <Card>
          <CardHeader>
            <CardTitle>{TEXTOS.sinAlumnoTitulo}</CardTitle>
            <CardDescription>{TEXTOS.sinAlumnoDetalle}</CardDescription>
          </CardHeader>
        </Card>
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
        <Card>
          <CardHeader>
            <CardTitle>{TEXTOS.sinRutinaTitulo}</CardTitle>
            <CardDescription>{TEXTOS.sinRutinaDetalle}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="h-12 w-full text-base" disabled={ocupado} onClick={generarRutina}>
              {ocupado ? "Generando…" : "Generar mi rutina"}
            </Button>
          </CardContent>
        </Card>
      )}

      {pantalla === "adentro" && (
        // D13: aparece solo, sin recargar, cuando el kiosco registra la entrada.
        <div role="status" className="rounded-lg bg-green-600 p-4 text-white">
          <p className="text-2xl font-bold">{TEXTOS.adentroTitulo}</p>
          <p className="text-sm">{TEXTOS.adentroDetalle}</p>
        </div>
      )}

      {pantalla === "esperando_feedback" && (
        <PreguntaFeedback
          ocupado={ocupado}
          onResponder={responder}
          onOmitir={() => ultimaVisita && setOmitidas((previas) => [...previas, ultimaVisita.id])}
        />
      )}

      {pantalla === "feedback_enviado" && (
        <ProximaSesion cambios={compararCargas(cargasAntes, ejercicios)} respuesta={respuesta} />
      )}

      {pantalla === "fuera" && (
        <div>
          <h2 className="text-xl font-semibold">{TEXTOS.fueraTitulo}</h2>
          <p className="text-sm text-muted-foreground">{TEXTOS.fueraDetalle}</p>
        </div>
      )}

      {(pantalla === "adentro" || pantalla === "fuera" || pantalla === "esperando_feedback") && (
        <>
          {pantalla === "esperando_feedback" && <h2 className="pt-2 text-lg font-semibold">Tu rutina de hoy</h2>}
          <ListaEjercicios ejercicios={ejercicios} />
        </>
      )}

      {botonCambiar}
    </section>
  );
}
