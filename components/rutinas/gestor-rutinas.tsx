"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tarjeta } from "@/components/marca/tarjeta";
import { Aviso } from "@/components/marca/aviso";
import { createClient } from "@/lib/supabase/client";
import { textoErrorRutina } from "@/lib/rutina/mensajes";
import { textoVolumen } from "@/lib/rutina/pantalla";
import { nombreRutina, ORIGEN_RUTINA, type EjercicioEditable, type MaquinaRutina, type ModalidadesRutina, type RutinaDisponible } from "@/lib/rutina/personalizadas";
import { EditorRutina } from "./editor-rutina";

type Alumno = { id: string; nombre: string; carrera: string };
type Rol = "alumno" | "profesor";

export function BuscarRutinasAlumno() {
  const supabase = useMemo(() => createClient(), []);
  const [buscar, setBuscar] = useState("");
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [elegido, setElegido] = useState<Alumno | null>(null);
  const [resultado, setResultado] = useState("");
  const [buscando, setBuscando] = useState(false);

  async function consultar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setBuscando(true);
    setElegido(null);
    setResultado("");
    setAlumnos([]);
    const patron = buscar.trim().replace(/[\\%_]/g, "\\$&");
    const { data, error } = await supabase.from("alumnos").select("id,nombre,carrera")
      .ilike("nombre", `%${patron}%`).order("nombre").limit(30);
    setBuscando(false);
    if (error) setResultado("No pudimos buscar alumnos. Inténtalo de nuevo.");
    else if (data.length === 0) setResultado("No encontramos alumnos con ese nombre.");
    else setAlumnos(data);
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Rutinas de alumnos</h1>
      <form className="flex flex-wrap items-end gap-2" onSubmit={consultar}>
        <label className="w-full max-w-sm space-y-1 text-sm font-medium">
          Nombre del alumno
          <Input value={buscar} required maxLength={100} onChange={(e) => setBuscar(e.target.value)} />
        </label>
        <Button disabled={buscando || !buscar.trim()}>{buscando ? "Buscando…" : "Buscar"}</Button>
      </form>
      {resultado && <p role="status">{resultado}</p>}
      <ul className="flex flex-wrap gap-2">
        {alumnos.map((alumno) => (
          <li className="max-w-full" key={alumno.id}>
            <Button variant="outline" className="h-auto whitespace-normal text-left"
              aria-pressed={elegido?.id === alumno.id} onClick={() => setElegido(alumno)}>
              {alumno.nombre} · {alumno.carrera}
            </Button>
          </li>
        ))}
      </ul>
      {elegido && (
        <section aria-label={`Rutinas de ${elegido.nombre}`} className="space-y-4">
          <h2 className="text-xl font-semibold">{elegido.nombre}</h2>
          <GestorRutinas key={elegido.id} rol="profesor" alumnoId={elegido.id} />
        </section>
      )}
    </section>
  );
}

export function GestorRutinas({ rol, alumnoId }: { rol: Rol; alumnoId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [datos, setDatos] = useState<{ modalidades: ModalidadesRutina; rutinas: RutinaDisponible[]; maquinas: MaquinaRutina[] }>();
  const [editor, setEditor] = useState<RutinaDisponible | "nueva" | null>(null);
  const [archivo, setArchivo] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");
  const [estado, setEstado] = useState("");

  const cargar = useCallback(async () => {
    const [modalidades, rutinas, maquinas] = await Promise.all([
      supabase.rpc("modalidades_de_rutina"),
      supabase.from("rutinas")
        .select("id,nombre,origen,activa,plantillas(nombre),rutina_ejercicios(id,orden,ejercicio,maquina_id,series,repeticiones,minutos,carga_kg,nota_ajuste)")
        .returns<RutinaDisponible[]>()
        .eq("alumno_id", alumnoId).is("archivada_en", null)
        .order("activa", { ascending: false }).order("creada_en", { ascending: false }),
      supabase.from("maquinas").select("id,nombre,estado").order("nombre"),
    ]);
    if (modalidades.error || rutinas.error || maquinas.error) {
      setError("No pudimos cargar las rutinas. Inténtalo de nuevo.");
      return;
    }
    setDatos({ modalidades: modalidades.data, rutinas: rutinas.data, maquinas: maquinas.data });
  }, [alumnoId, supabase]);

  useEffect(() => { void cargar(); }, [cargar]);

  async function ejecutar(
    accion: () => PromiseLike<{ error: { message?: string; code?: string } | null }>,
    mensaje: string,
  ) {
    setOcupado(true);
    setError("");
    setEstado("");
    try {
      const respuesta = await accion();
      if (respuesta.error) {
        const detalle = textoErrorRutina(respuesta.error);
        setError(detalle.titulo + ". " + detalle.detalle);
        if (["rutina_modificada", "modalidad_deshabilitada"].includes(respuesta.error.message ?? "")) {
          setEditor(null);
          await cargar();
        }
        return;
      }
      setEditor(null);
      setArchivo(null);
      setEstado(mensaje);
      await cargar();
    } finally {
      setOcupado(false);
    }
  }

  function guardar(nombre: string, ejercicios: EjercicioEditable[]) {
    void ejecutar(() => supabase.rpc("guardar_rutina_personalizada", {
      p_alumno: alumnoId, p_rutina: editor && editor !== "nueva" ? editor.id : null,
      p_nombre: nombre, p_ejercicios: ejercicios,
    }), rol === "profesor" ? "Rutina guardada y asignada." : "Rutina guardada.");
  }

  return (
    <div className="min-w-0 space-y-4">
      {error && <Aviso tono="red" role="alert">{error}</Aviso>}
      {estado && <p role="status" className="font-medium text-green-800">{estado}</p>}
      {!datos && (error ? <Button onClick={() => { setError(""); void cargar(); }}>Reintentar</Button> : <p role="status">Cargando rutinas…</p>)}
      {datos && (
        <>
          {datos.modalidades[rol] && !editor && (
            <Button disabled={ocupado} onClick={() => { setArchivo(null); setEditor("nueva"); }}>
              {rol === "profesor" ? "Crear y asignar rutina" : "Crear mi rutina"}
            </Button>
          )}
          {editor && <EditorRutina key={editor === "nueva" ? editor : editor.id}
            rutina={editor === "nueva" ? null : editor} maquinas={datos.maquinas} ocupado={ocupado}
            guardar={guardar} cancelar={() => setEditor(null)} />}
          {datos.rutinas.length === 0 && <p className="text-sm text-tinta-suave">Todavía no hay rutinas guardadas.</p>}
          {datos.rutinas.map((rutina) => (
            <Tarjeta key={rutina.id} className="space-y-3 p-4">
              <div>
                <h3 className="break-words font-semibold">{nombreRutina(rutina)}</h3>
                <p className="text-sm text-tinta-suave">
                  {ORIGEN_RUTINA[rutina.origen]} · {datos.modalidades[rutina.origen] ? (rutina.activa ? "Activa" : "Disponible") : "Modalidad deshabilitada"}
                </p>
                {rol === "alumno" && rutina.origen === "profesor" && !rutina.activa && datos.modalidades.profesor &&
                  <p className="mt-1 text-sm">Asignada por el profesor. Puedes activarla para tu próximo ingreso.</p>}
              </div>
              <details className="text-sm">
                <summary className="cursor-pointer font-medium">Ver ejercicios</summary>
                <ol className="list-decimal space-y-1 pl-5 pt-2">
                  {rutina.rutina_ejercicios.toSorted((a, b) => a.orden - b.orden).map((e) => (
                    <li key={e.id} className="break-words">
                      {e.ejercicio} · {datos.maquinas.find((m) => m.id === e.maquina_id)?.nombre} · {textoVolumen(e)}
                      {e.carga_kg !== null && ` · ${e.carga_kg} kg`}{e.nota_ajuste && ` · ${e.nota_ajuste}`}
                    </li>
                  ))}
                </ol>
              </details>
              <div className="flex flex-wrap gap-2">
                {rol === "alumno" && !rutina.activa && datos.modalidades[rutina.origen] && (
                  <Button size="sm" disabled={ocupado || editor !== null}
                    onClick={() => void ejecutar(() => supabase.rpc("activar_rutina", { p_rutina: rutina.id }), "Rutina activa para tu próximo ingreso.")}>Activar</Button>
                )}
                {rutina.origen === rol && datos.modalidades[rol] && (
                  <Button size="sm" variant="outline" disabled={ocupado || editor !== null}
                    onClick={() => { setArchivo(null); setEditor(rutina); }}>Editar</Button>
                )}
                {rol === "alumno" && rutina.origen === "alumno" && archivo !== rutina.id && (
                  <Button size="sm" variant="ghost" disabled={ocupado || editor !== null} onClick={() => setArchivo(rutina.id)}>Eliminar</Button>
                )}
              </div>
              {archivo === rutina.id && (
                <div className="space-y-2">
                  <p className="text-sm">Se quitará de tus rutinas disponibles. Tus visitas y respuestas se conservan.</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="destructive" disabled={ocupado}
                      onClick={() => void ejecutar(() => supabase.rpc("archivar_rutina_propia", { p_rutina: rutina.id }), "Rutina eliminada de tu lista.")}>Confirmar eliminación</Button>
                    <Button size="sm" variant="ghost" disabled={ocupado} onClick={() => setArchivo(null)}>Cancelar eliminación</Button>
                  </div>
                </div>
              )}
            </Tarjeta>
          ))}
        </>
      )}
    </div>
  );
}
