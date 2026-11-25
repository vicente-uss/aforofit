"use client";

import {
  CircleCheck,
  CircleX,
  Keyboard,
  Link2,
  LoaderCircle,
  LogIn,
  LogOut,
  Nfc,
  Ticket,
  TriangleAlert,
  UserX,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Avatar } from "@/components/marca/avatar";
import { EstadoVacio } from "@/components/marca/estado-vacio";
import { Insignia, type TonoInsignia } from "@/components/marca/insignia";
import { Logo } from "@/components/marca/logo";
import { TEXTO_NIVEL, TRAZO_NIVEL } from "@/components/marca/nivel";
import { AnilloOcupacion, BarraOcupacion } from "@/components/marca/ocupacion";
import { EncabezadoTarjeta, Tarjeta } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { estadoAforo, textoCupos } from "@/lib/aforo/estado";
import { useAforo } from "@/lib/aforo/useAforo";
import { patronContiene, unirAlumnos } from "@/lib/ingreso/buscarAlumnos";
import { pausaLector } from "@/lib/ingreso/pausaLector";
import { capturarLectura } from "@/lib/ingreso/capturarLectura";
import { normalizarUid } from "@/lib/ingreso/normalizarUid";
import {
  enmascararUid,
  interpretarRespuesta,
  interpretarVinculacion,
  mensajeErrorRpc,
  mensajeIngreso,
  mensajeRespuestaInvalida,
  textoErrorRpc,
  textoMotivo,
  type MensajeKiosco,
  type TipoLectura,
} from "@/lib/ingreso/mensajes";
import { createClient } from "@/lib/supabase/client";

// No guarda el UID: el historial del kiosco queda a la vista de quien pase por la entrada.
type Lectura = {
  id: number;
  hora: Date;
  mensaje: MensajeKiosco | null; // null mientras se espera la respuesta
  ms: number | null; // tiempo de respuesta de registrar_ingreso (para medir CA29)
  // Solo para mostrar (Avatar y recuadro del turno): vienen en la misma respuesta de registrar_ingreso.
  nombre: string | null;
  turno: number | null;
};

type AlumnoBuscado = { id: string; nombre: string; rut: string | null; carrera: string | null };

const MAX_LECTURAS = 10; // historial solo en memoria
const MAX_ALUMNOS_BUSCADOS = 8;
const VENTANA_REPETIDA_MS = 3000; // se ignora la misma tarjeta si se repite antes de 3 s
const INTERVALO_FOCO_MS = 2000; // cada cuánto se recupera el foco del lector
const DURACION_MENSAJE_MS = 6000; // cuánto queda visible el resultado antes de volver a "Acerca tu TNE"

// Banda de color de la tarjeta de resultado, legible a 2 metros (contraste 4,5:1 o más):
// verde entrada, navy salida, ámbar turno (texto navy) y rojo rechazo.
const BANDA: Record<TipoLectura, { clase: string; icono: LucideIcon; insignia: TonoInsignia }> = {
  Entrada: { clase: "bg-green-700 text-white", icono: LogIn, insignia: "green" },
  Salida: { clase: "bg-navy-900 text-white", icono: LogOut, insignia: "navy" },
  Turno: { clase: "bg-amber-400 text-navy-950", icono: Ticket, insignia: "amber" },
  Rechazo: { clase: "bg-red-600 text-white", icono: CircleX, insignia: "red" },
  Vinculación: { clase: "bg-blue-600 text-white", icono: Link2, insignia: "blue" },
  Error: { clase: "bg-red-600 text-white", icono: TriangleAlert, insignia: "red" },
};

function formatoHora(fecha: Date) {
  return fecha.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
}

export function PantallaIngreso() {
  // Aforo en vivo solo para mostrarlo: no participa en la validación ni bloquea el ingreso.
  const { aforo, sinConexion: sinAforo } = useAforo("aforo-kiosco");
  const [enPausa, avisarFoco] = useReducer(pausaLector, false);
  const [ultima, setUltima] = useState<Lectura | null>(null);
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [manualAbierto, setManualAbierto] = useState(false);
  const [textoManual, setTextoManual] = useState("");

  // Vinculación de una credencial no registrada (regla 1, CA02 y CA03).
  const [uidPorVincular, setUidPorVincular] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [alumnos, setAlumnos] = useState<AlumnoBuscado[]>([]);
  const [avisoVincular, setAvisoVincular] = useState<string | null>(null);
  const [busquedaAbierta, setBusquedaAbierta] = useState(false);

  const supabaseRef = useRef(createClient());
  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lectorRef = useRef<HTMLInputElement>(null);
  const manualAbiertoRef = useRef(false);
  const ultimaAceptadaRef = useRef<{ uid: string; ms: number } | null>(null);
  const siguienteIdRef = useRef(1);

  const cancelarLimpieza = useCallback(() => {
    if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
    temporizadorRef.current = null;
  }, []);

  // Único temporizador del kiosco: al reprogramarlo, un mensaje anterior no borra el nuevo.
  // No borra una lectura en validación ni una credencial que espera ser vinculada.
  const programarLimpieza = useCallback(() => {
    cancelarLimpieza();
    temporizadorRef.current = setTimeout(() => {
      setError(null);
      setUltima((actual) => (actual && (!actual.mensaje || actual.mensaje.ofrecerVincular) ? actual : null));
    }, DURACION_MENSAJE_MS);
  }, [cancelarLimpieza]);

  useEffect(() => cancelarLimpieza, [cancelarLimpieza]);

  // El campo del lector debe tener siempre el foco, salvo mientras se usa el ingreso manual.
  const enfocarLector = useCallback(() => {
    if (manualAbiertoRef.current || document.hidden || !document.hasFocus()) return;
    if (document.activeElement !== lectorRef.current) {
      lectorRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    const alPerderFoco = () => avisarFoco("sin_foco");
    const alCambiarVisibilidad = () => avisarFoco(document.hidden ? "oculta" : "visible");
    if (!document.hasFocus() || document.hidden) alPerderFoco();
    enfocarLector();
    window.addEventListener("blur", alPerderFoco);
    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    const intervalo = setInterval(enfocarLector, INTERVALO_FOCO_MS);
    // Un clic en cualquier parte de la pantalla devuelve el foco al lector.
    const alHacerClic = () => setTimeout(enfocarLector, 0);
    window.addEventListener("click", alHacerClic);
    window.addEventListener("focus", enfocarLector);
    return () => {
      clearInterval(intervalo);
      window.removeEventListener("blur", alPerderFoco);
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
      window.removeEventListener("click", alHacerClic);
      window.removeEventListener("focus", enfocarLector);
    };
  }, [enfocarLector]);

  // Procesa un código (del lector o manual). Devuelve true si el formato es válido.
  const procesar = useCallback((texto: string) => {
    const resultado = normalizarUid(texto);
    if (!resultado.ok) {
      setError(resultado.error);
      programarLimpieza();
      return false;
    }

    const ahora = Date.now();
    const anterior = ultimaAceptadaRef.current;
    if (anterior && anterior.uid === resultado.uid && ahora - anterior.ms < VENTANA_REPETIDA_MS) {
      // Lectura repetida de la misma tarjeta: se ignora sin mostrar nada.
      return true;
    }
    ultimaAceptadaRef.current = { uid: resultado.uid, ms: ahora };

    const lectura: Lectura = {
      id: siguienteIdRef.current++,
      hora: new Date(ahora),
      mensaje: null,
      ms: null,
      nombre: null,
      turno: null,
    };
    cancelarLimpieza();
    setError(null);
    setUltima(lectura);
    setUidPorVincular(null);

    // Las reglas 1 a 6 se validan en la base de datos (registrar_ingreso), no aquí:
    // así el lector, el ingreso manual y el QR pasan por el mismo lugar.
    const inicio = performance.now();
    const terminar = (mensaje: MensajeKiosco, datos?: { nombre: string | null; turno: number | null }) => {
      const completa: Lectura = {
        ...lectura,
        mensaje,
        ms: Math.round(performance.now() - inicio),
        nombre: datos?.nombre ?? null,
        turno: datos?.turno ?? null,
      };
      setUltima(completa);
      setLecturas((previas) => [completa, ...previas].slice(0, MAX_LECTURAS));
      if (mensaje.ofrecerVincular) setUidPorVincular(resultado.uid);

      // El mensaje queda unos segundos y la pantalla vuelve a esperar otra tarjeta.
      if (mensaje.ofrecerVincular) cancelarLimpieza();
      else programarLimpieza();
    };

    // Promise.resolve porque el constructor de Supabase es "thenable" y no tiene .catch().
    void Promise.resolve(supabaseRef.current.rpc("registrar_ingreso", { p_uid: resultado.uid }))
      .then(({ data, error: errorRpc }) => {
        if (errorRpc) {
          console.error("Error en registrar_ingreso:", errorRpc);
          terminar(mensajeErrorRpc(errorRpc));
          return;
        }
        const respuesta = interpretarRespuesta(data);
        if (!respuesta) {
          console.error("registrar_ingreso respondió fuera del contrato.");
          terminar(mensajeRespuestaInvalida());
          return;
        }
        terminar(mensajeIngreso(respuesta), { nombre: respuesta.alumno?.nombre ?? null, turno: respuesta.turno });
      })
      .catch((errorInesperado: unknown) => {
        console.error("Falló la llamada a registrar_ingreso:", errorInesperado);
        terminar(mensajeErrorRpc({}));
      });
    return true;
  }, [cancelarLimpieza, programarLimpieza]);

  // Busca alumnos ficticios por nombre o RUT para vincular la credencial (el profesor puede leerlos).
  const buscarAlumnos = async (evento: React.FormEvent) => {
    evento.preventDefault();
    const texto = busqueda.trim();
    if (texto.length < 2) return;
    // Dos consultas en vez de .or(): el texto del usuario no se interpola en el filtro.
    const patron = patronContiene(texto);
    const consultar = (columna: "nombre" | "rut") =>
      supabaseRef.current
        .from("alumnos")
        .select("id, nombre, rut, carrera")
        .ilike(columna, patron)
        .order("nombre")
        .limit(MAX_ALUMNOS_BUSCADOS);
    const [porNombre, porRut] = await Promise.all([consultar("nombre"), consultar("rut")]);
    const errorBusqueda = porNombre.error ?? porRut.error;
    if (errorBusqueda) {
      console.error("Error al buscar alumnos:", errorBusqueda);
      setAvisoVincular("No se pudo buscar alumnos.");
      return;
    }
    const encontrados = unirAlumnos([porNombre.data ?? [], porRut.data ?? []], MAX_ALUMNOS_BUSCADOS);
    setAlumnos(encontrados);
    setAvisoVincular(encontrados.length === 0 ? "No se encontraron alumnos." : null);
  };

  const vincular = async (alumno: AlumnoBuscado) => {
    if (!uidPorVincular) return;
    const { data, error: errorVincular } = await supabaseRef.current.rpc("vincular_credencial", {
      p_uid: uidPorVincular,
      p_alumno_id: alumno.id,
    });
    if (errorVincular) {
      console.error("Error en vincular_credencial:", errorVincular);
      setAvisoVincular(textoErrorRpc(errorVincular).titulo);
      return;
    }
    const respuesta = interpretarVinculacion(data);
    if (!respuesta) {
      console.error("vincular_credencial respondió fuera del contrato.");
      setAvisoVincular("Respuesta inválida de la base de datos.");
      return;
    }
    // La función puede rechazar (ej. el UID ya pertenece a otro alumno, CA03).
    if (!respuesta.ok) {
      setAvisoVincular(textoMotivo(respuesta.motivo));
      return;
    }
    cerrarVincular();
    setUltima({
      id: siguienteIdRef.current++,
      hora: new Date(),
      ms: null,
      nombre: alumno.nombre,
      turno: null,
      mensaje: {
        tono: "info",
        tipo: "Vinculación",
        titulo: `Credencial vinculada a ${alumno.nombre}`,
        detalle: "Pasa la tarjeta otra vez para entrar",
        ofrecerVincular: false,
      },
    });
    programarLimpieza();
  };

  const abrirVincular = () => {
    manualAbiertoRef.current = true; // el buscador necesita el teclado
    setBusqueda("");
    setAlumnos([]);
    setAvisoVincular(null);
    setManualAbierto(false);
    setBusquedaAbierta(true);
  };

  const cerrarVincular = () => {
    manualAbiertoRef.current = false;
    setBusquedaAbierta(false);
    setUidPorVincular(null);
    setUltima(null);
    setTimeout(enfocarLector, 0);
  };

  const reactivarLector = () => {
    manualAbiertoRef.current = false;
    setManualAbierto(false);
    setBusquedaAbierta(false);
    enfocarLector();
    if (document.hasFocus() && document.activeElement === lectorRef.current) {
      avisarFoco("lector_reactivado");
    }
  };

  const abrirManual = () => {
    manualAbiertoRef.current = true;
    setManualAbierto(true);
  };

  const cerrarManual = () => {
    manualAbiertoRef.current = false;
    setManualAbierto(false);
    setTextoManual("");
    setTimeout(enfocarLector, 0);
  };

  const enviarManual = (evento: React.FormEvent) => {
    evento.preventDefault();
    if (procesar(textoManual)) cerrarManual();
  };

  const nivel = aforo ? estadoAforo(aforo.ocupacion, aforo.capacidad, aforo.umbral_casi_lleno).etiqueta : null;
  const mensaje = ultima?.mensaje ?? null;
  const banda = mensaje ? BANDA[mensaje.tipo] : null;

  return (
    <div className="min-h-svh w-full bg-canvas">
      {/* Campo discreto que recibe lo que "teclea" el lector USB (modo HID) seguido de Enter. */}
      <input
        ref={lectorRef}
        aria-label="Lector de credenciales"
        autoComplete="off"
        inputMode="none"
        onKeyDown={(evento) => capturarLectura(evento, procesar)}
        onBlur={() => setTimeout(enfocarLector, 0)}
        className="absolute h-px w-px opacity-0"
      />

      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Logo tamano="md" />
          <div className="flex items-center gap-2">
            <Insignia tono="blue" punto>
              Ingreso al gimnasio
            </Insignia>
            <span className="hidden text-sm text-tinta-suave sm:inline">Gimnasio USS Bellavista</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 p-4 md:p-6">
        {enPausa && (
          <button
            type="button"
            onClick={reactivarLector}
            className="w-full rounded-2xl bg-amber-400 p-6 text-3xl font-bold text-navy-950 shadow-lift md:text-5xl"
          >
            Lector en pausa: haz clic aquí
          </button>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Columna izquierda: lector e ingreso manual. */}
          <div className="space-y-5">
            <Tarjeta className="overflow-hidden p-3">
              <div className="flex flex-col items-center gap-5 rounded-xl bg-gradient-to-br from-navy-900 to-navy-800 px-6 py-10 text-center text-white">
                <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 animate-pulse-ring">
                  <Nfc className="h-10 w-10" aria-hidden />
                </span>
                <div>
                  <p className="text-2xl font-semibold md:text-3xl">Acerque la credencial al lector</p>
                  <p className="mt-1.5 text-sm text-slate-300">TNE o TUI · lector USB de 13,56 MHz</p>
                </div>
              </div>

              <div className="px-2 pb-2 pt-4">
                {manualAbierto ? (
                  <form onSubmit={enviarManual} className="space-y-2">
                    <Label htmlFor="uid-manual" className="text-[13px] font-semibold text-navy-900">
                      Ingreso manual
                    </Label>
                    <Input
                      id="uid-manual"
                      autoFocus
                      value={textoManual}
                      onChange={(e) => setTextoManual(e.target.value)}
                      placeholder="UID en hexadecimal, ej. 04:A3:7F:2B"
                      aria-label="UID en hexadecimal"
                      className="h-12 font-mono text-base uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button type="submit">Registrar</Button>
                      <Button type="button" variant="ghost" onClick={cerrarManual}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button variant="secondary" onClick={abrirManual}>
                      <Keyboard aria-hidden />
                      Ingreso manual
                    </Button>
                    <span className="text-[13px] text-tinta-suave">QR: próximamente</span>
                  </div>
                )}
              </div>
            </Tarjeta>

          </div>

          {/* Columna derecha: aforo, resultado de la lectura y vinculación. */}
          <div className="space-y-5">
            {/* Aforo visible en reposo: el profesor ve el cupo sin pasar una tarjeta. */}
            <Tarjeta className="flex items-center gap-5 p-5">
              {aforo && nivel ? (
                <>
                  <AnilloOcupacion
                    valor={aforo.ocupacion}
                    maximo={aforo.capacidad}
                    color={TRAZO_NIVEL[nivel]}
                    lado={104}
                    grosor={10}
                  >
                    <span className="tnum text-2xl font-bold text-navy-900">{aforo.ocupacion}</span>
                  </AnilloOcupacion>
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <p className="tnum text-xl font-semibold text-navy-900">
                      {aforo.ocupacion}/{aforo.capacidad} personas
                    </p>
                    <BarraOcupacion
                      ocupacion={aforo.ocupacion}
                      capacidad={aforo.capacidad}
                      color={TRAZO_NIVEL[nivel]}
                    />
                    <p className={`text-sm font-semibold ${TEXTO_NIVEL[nivel]}`}>
                      {textoCupos(aforo.ocupacion, aforo.capacidad)}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-tinta-suave">{sinAforo ? "Aforo no disponible" : "Cargando aforo…"}</p>
              )}
            </Tarjeta>

            <Tarjeta className="min-h-[18rem] overflow-hidden">
              {error ? (
                <div key="error" className="animate-pop-in">
                  <div className="flex items-center gap-4 bg-red-600 px-5 py-5 text-white">
                    <CircleX className="h-10 w-10 shrink-0" aria-hidden />
                    <p className="text-3xl font-bold">No se pudo leer</p>
                  </div>
                  <div className="space-y-1 p-5">
                    <p className="text-lg text-navy-900">{error}</p>
                    <p className="text-tinta-suave">Acerca tu TNE al lector</p>
                  </div>
                </div>
              ) : ultima && !mensaje ? (
                <div className="flex min-h-[18rem] flex-col items-center justify-center gap-3">
                  <LoaderCircle className="h-10 w-10 animate-spin text-blue-600" aria-hidden />
                  <p className="text-3xl font-bold text-navy-900">Validando…</p>
                </div>
              ) : ultima && mensaje && banda ? (
                <div key={ultima.id} className="animate-pop-in">
                  <div className={`flex items-center gap-4 px-5 py-5 ${banda.clase}`}>
                    <banda.icono className="h-11 w-11 shrink-0" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="text-2xl font-bold leading-tight md:text-3xl">{mensaje.titulo}</p>
                      <p className="tnum mt-1 text-sm opacity-90">{formatoHora(ultima.hora)}</p>
                    </div>
                    {mensaje.tipo === "Turno" && ultima.turno !== null && (
                      <div className="shrink-0 rounded-xl bg-white/50 px-4 py-2 text-center">
                        <p className="text-[11px] font-bold uppercase tracking-wider">Turno</p>
                        <p className="tnum text-4xl font-bold leading-none">{String(ultima.turno).padStart(2, "0")}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4 p-5">
                    <p className="text-lg text-navy-900 md:text-xl">{mensaje.detalle}</p>

                    {ultima.nombre && !mensaje.ofrecerVincular && (
                      <div className="flex items-center gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3">
                        <Avatar nombre={ultima.nombre} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-navy-900">{ultima.nombre}</p>
                          <p className="text-xs text-tinta-suave">Alumno identificado</p>
                        </div>
                      </div>
                    )}

                    {mensaje.ofrecerVincular && (
                      <div className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <UserX className="h-5 w-5" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-navy-900">Alumno no identificado</p>
                          <p className="text-xs text-tinta-suave">La credencial no está vinculada a ningún alumno.</p>
                        </div>
                        {!busquedaAbierta && (
                          <div className="flex flex-wrap gap-2">
                            <Button onClick={abrirVincular}>
                              <Link2 aria-hidden />
                              Vincular credencial
                            </Button>
                            <Button variant="ghost" onClick={cerrarVincular}>
                              Cancelar
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <EstadoVacio icono={Nfc} titulo="Esperando lectura" className="min-h-[18rem]">
                  El resultado de cada lectura aparece aquí: entrada, salida, turno o rechazo.
                </EstadoVacio>
              )}
            </Tarjeta>

            {busquedaAbierta && uidPorVincular && (
              <Tarjeta className="animate-pop-in">
                <EncabezadoTarjeta
                  titulo={
                    <>
                      Vincular la credencial <span className="font-mono">{enmascararUid(uidPorVincular)}</span>
                    </>
                  }
                  subtitulo="Una credencial pertenece a un solo alumno. No vincules tarjetas bancarias."
                />
                <div className="space-y-3 px-5 pb-5 pt-4">
                  <form onSubmit={buscarAlumnos} className="flex flex-wrap items-center gap-2">
                    <Input
                      autoFocus
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="Nombre o RUT del alumno"
                      aria-label="Buscar alumno"
                      className="min-w-0 flex-1 basis-56"
                    />
                    <Button type="submit">Buscar</Button>
                    <Button type="button" variant="ghost" onClick={cerrarVincular}>
                      Cancelar
                    </Button>
                  </form>
                  {avisoVincular && <p className="text-sm font-medium text-red-600">{avisoVincular}</p>}
                  {alumnos.length > 0 && (
                    <ul className="divide-y divide-line rounded-xl border border-line">
                      {alumnos.map((alumno) => (
                        <li key={alumno.id} className="flex items-center justify-between gap-3 p-3">
                          <span className="flex min-w-0 items-center gap-3">
                            <Avatar nombre={alumno.nombre} className="h-8 w-8 text-xs" />
                            <span className="min-w-0">
                              <span className="block truncate font-medium text-navy-900">{alumno.nombre}</span>
                              <span className="block truncate text-xs text-tinta-suave">
                                {[alumno.rut, alumno.carrera].filter(Boolean).join(" · ")}
                              </span>
                            </span>
                          </span>
                          <Button size="sm" onClick={() => vincular(alumno)}>
                            <CircleCheck aria-hidden />
                            Vincular
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Tarjeta>
            )}
          </div>
        </div>

        {/* Últimas lecturas al final: en celular, el resultado queda antes que el historial. */}
        <Tarjeta>
          <EncabezadoTarjeta titulo="Últimas lecturas" subtitulo="Solo en este computador; no guarda el UID." />
          <div className="px-5 pb-4 pt-3">
            {lecturas.length === 0 ? (
              <p className="text-sm text-tinta-suave">Todavía no hay lecturas.</p>
            ) : (
              <ul className="divide-y divide-line">
                {lecturas.map((lectura) => (
                  <li key={lectura.id} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="tnum text-sm text-tinta-suave">{formatoHora(lectura.hora)}</span>
                    <span className="flex-1">
                      {lectura.mensaje && (
                        <Insignia tono={BANDA[lectura.mensaje.tipo].insignia} punto>
                          {lectura.mensaje.tipo}
                        </Insignia>
                      )}
                    </span>
                    <span className="tnum w-20 text-right text-xs text-tinta-suave">
                      {lectura.ms !== null && `${lectura.ms} ms`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Tarjeta>
      </main>
    </div>
  );
}
