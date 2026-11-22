"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { normalizarUid } from "@/lib/ingreso/normalizarUid";
import {
  mensajeIngreso,
  textoMotivo,
  type MensajeKiosco,
  type ResultadoIngreso,
  type TonoMensaje,
} from "@/lib/ingreso/mensajes";
import { createClient } from "@/lib/supabase/client";

type Lectura = {
  uid: string;
  hora: Date;
  origen: "lector" | "manual";
  mensaje: MensajeKiosco | null; // null mientras se espera la respuesta
  ms: number | null; // tiempo de respuesta de registrar_ingreso (para medir CA29)
};

type AlumnoBuscado = { id: string; nombre: string; rut: string | null; carrera: string | null };

const MAX_LECTURAS = 10; // historial solo en memoria
const VENTANA_REPETIDA_MS = 3000; // se ignora la misma tarjeta si se repite antes de 3 s
const INTERVALO_FOCO_MS = 2000; // cada cuánto se recupera el foco del lector
const DURACION_MENSAJE_MS = 6000; // cuánto queda visible el resultado antes de volver a "Acerca tu TNE"

// Colores de cada tipo de mensaje, legibles a 2 metros.
const ESTILO_TONO: Record<TonoMensaje, string> = {
  exito: "bg-green-600 text-white",
  info: "bg-blue-600 text-white",
  espera: "bg-yellow-400 text-black",
  error: "bg-red-600 text-white",
};

function formatoHora(fecha: Date) {
  return fecha.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function PantallaIngreso() {
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
    if (manualAbiertoRef.current) return;
    if (document.activeElement !== lectorRef.current) {
      lectorRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    enfocarLector();
    const intervalo = setInterval(enfocarLector, INTERVALO_FOCO_MS);
    // Un clic en cualquier parte de la pantalla devuelve el foco al lector.
    const alHacerClic = () => setTimeout(enfocarLector, 0);
    window.addEventListener("click", alHacerClic);
    window.addEventListener("focus", enfocarLector);
    return () => {
      clearInterval(intervalo);
      window.removeEventListener("click", alHacerClic);
      window.removeEventListener("focus", enfocarLector);
    };
  }, [enfocarLector]);

  // Procesa un código (del lector o manual). Devuelve true si el formato es válido.
  const procesar = useCallback((texto: string, origen: Lectura["origen"]) => {
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

    const lectura: Lectura = { uid: resultado.uid, hora: new Date(ahora), origen, mensaje: null, ms: null };
    cancelarLimpieza();
    setError(null);
    setUltima(lectura);
    setUidPorVincular(null);

    // Las reglas 1 a 6 se validan en la base de datos (registrar_ingreso), no aquí:
    // así el lector, el ingreso manual y el QR pasan por el mismo lugar.
    const inicio = performance.now();
    void supabaseRef.current
      .rpc("registrar_ingreso", { p_uid: resultado.uid })
      .then(({ data, error: errorRpc }) => {
        const ms = Math.round(performance.now() - inicio);
        const mensaje: MensajeKiosco = errorRpc
          ? {
              tono: "error",
              titulo: "No se pudo registrar",
              detalle: "Sin conexión con el servidor. Intenta de nuevo o usa el ingreso manual.",
              ofrecerVincular: false,
            }
          : mensajeIngreso(data as ResultadoIngreso);
        const completa: Lectura = { ...lectura, mensaje, ms };
        setUltima(completa);
        setLecturas((previas) => [completa, ...previas].slice(0, MAX_LECTURAS));
        if (mensaje.ofrecerVincular) setUidPorVincular(resultado.uid);

        // El mensaje queda unos segundos y la pantalla vuelve a esperar otra tarjeta.
        if (mensaje.ofrecerVincular) cancelarLimpieza();
        else programarLimpieza();
      });
    return true;
  }, [cancelarLimpieza, programarLimpieza]);

  // Busca alumnos ficticios por nombre o RUT para vincular la credencial (el profesor puede leerlos).
  const buscarAlumnos = async (evento: React.FormEvent) => {
    evento.preventDefault();
    const texto = busqueda.trim();
    if (texto.length < 2) return;
    const { data, error: errorBusqueda } = await supabaseRef.current
      .from("alumnos")
      .select("id, nombre, rut, carrera")
      .or(`nombre.ilike.%${texto}%,rut.ilike.%${texto}%`)
      .order("nombre")
      .limit(8);
    if (errorBusqueda) {
      setAvisoVincular("No se pudo buscar alumnos.");
      return;
    }
    setAlumnos(data ?? []);
    setAvisoVincular(data && data.length === 0 ? "No se encontraron alumnos." : null);
  };

  const vincular = async (alumno: AlumnoBuscado) => {
    if (!uidPorVincular) return;
    const { data, error: errorVincular } = await supabaseRef.current.rpc("vincular_credencial", {
      p_uid: uidPorVincular,
      p_alumno_id: alumno.id,
    });
    // La función puede rechazar (ej. el UID ya pertenece a otro alumno, CA03).
    const respuesta = data as { ok?: boolean; motivo?: string | null } | null;
    if (errorVincular || respuesta?.ok === false) {
      setAvisoVincular(
        respuesta?.motivo ? textoMotivo(respuesta.motivo) : errorVincular?.message ?? "No se pudo vincular.",
      );
      return;
    }
    cerrarVincular();
    setUltima({
      uid: uidPorVincular,
      hora: new Date(),
      origen: "manual",
      ms: null,
      mensaje: {
        tono: "info",
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

  const alPresionarTeclaLector = (evento: React.KeyboardEvent<HTMLInputElement>) => {
    if (evento.key !== "Enter") return;
    evento.preventDefault();
    const texto = evento.currentTarget.value;
    evento.currentTarget.value = "";
    if (texto.trim() !== "") procesar(texto, "lector");
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
    if (procesar(textoManual, "manual")) cerrarManual();
  };

  return (
    <div className="min-h-svh w-full">
      {/* Campo discreto que recibe lo que "teclea" el lector USB (modo HID) seguido de Enter. */}
      <input
        ref={lectorRef}
        aria-label="Lector de credenciales"
        autoComplete="off"
        inputMode="none"
        onKeyDown={alPresionarTeclaLector}
        onBlur={() => setTimeout(enfocarLector, 0)}
        className="absolute h-px w-px opacity-0"
      />

      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 p-4">
          <span className="text-xl font-bold tracking-tight">AforoFit</span>
          <Badge variant="secondary">Ingreso al gimnasio</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
        <Card className="overflow-hidden">
          <CardContent
            className={`flex min-h-[18rem] flex-col items-center justify-center gap-4 p-8 text-center ${
              ultima?.mensaje ? ESTILO_TONO[ultima.mensaje.tono] : ""
            }`}
          >
            {error ? (
              <>
                <p className="text-4xl font-bold text-destructive md:text-5xl">No se pudo leer</p>
                <p className="text-2xl text-muted-foreground">{error}</p>
                <p className="text-2xl">Acerca tu TNE al lector</p>
              </>
            ) : ultima && !ultima.mensaje ? (
              <p className="text-4xl font-bold md:text-5xl">Validando…</p>
            ) : ultima?.mensaje ? (
              <>
                <p className="text-4xl font-bold md:text-6xl">{ultima.mensaje.titulo}</p>
                <p className="text-2xl md:text-3xl">{ultima.mensaje.detalle}</p>
                {ultima.mensaje.ofrecerVincular && !busquedaAbierta && (
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button size="lg" variant="secondary" onClick={abrirVincular}>
                      Vincular credencial
                    </Button>
                    <Button size="lg" variant="ghost" onClick={cerrarVincular}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-5xl font-bold md:text-6xl">Acerca tu TNE al lector</p>
            )}
          </CardContent>
        </Card>

        {busquedaAbierta && uidPorVincular && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Vincular la credencial <span className="font-mono">{uidPorVincular}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Una credencial pertenece a un solo alumno. No vincules tarjetas bancarias.
              </p>
              <form onSubmit={buscarAlumnos} className="flex flex-wrap items-center gap-2">
                <Input
                  autoFocus
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre o RUT del alumno"
                  aria-label="Buscar alumno"
                  className="w-72"
                />
                <Button type="submit" size="sm">
                  Buscar
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={cerrarVincular}>
                  Cancelar
                </Button>
              </form>
              {avisoVincular && <p className="text-sm text-destructive">{avisoVincular}</p>}
              {alumnos.length > 0 && (
                <ul className="divide-y rounded-md border">
                  {alumnos.map((alumno) => (
                    <li key={alumno.id} className="flex items-center justify-between gap-4 p-2">
                      <span>
                        <span className="font-medium">{alumno.nombre}</span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {[alumno.rut, alumno.carrera].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                      <Button size="sm" onClick={() => vincular(alumno)}>
                        Vincular
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          {manualAbierto ? (
            <form onSubmit={enviarManual} className="flex flex-wrap items-center gap-2">
              <Input
                autoFocus
                value={textoManual}
                onChange={(e) => setTextoManual(e.target.value)}
                placeholder="UID en hexadecimal, ej. 04:A3:7F:2B"
                aria-label="UID en hexadecimal"
                className="w-72 font-mono"
              />
              <Button type="submit" size="sm">
                Registrar
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={cerrarManual}>
                Cancelar
              </Button>
            </form>
          ) : (
            <Button size="sm" variant="outline" onClick={abrirManual}>
              Ingreso manual
            </Button>
          )}
          <span className="text-sm text-muted-foreground">QR: próximamente</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Últimas lecturas</CardTitle>
          </CardHeader>
          <CardContent>
            {lecturas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Todavía no hay lecturas.</p>
            ) : (
              <ul className="divide-y">
                {lecturas.map((lectura) => (
                  <li
                    key={`${lectura.hora.getTime()}-${lectura.uid}`}
                    className="flex items-center justify-between gap-4 py-2 text-lg"
                  >
                    <span className="text-muted-foreground">{formatoHora(lectura.hora)}</span>
                    <span className="font-mono font-semibold">{lectura.uid}</span>
                    <span className="flex-1 truncate text-base">{lectura.mensaje?.titulo}</span>
                    <span className="w-32 text-right text-sm text-muted-foreground">
                      {lectura.origen === "manual" ? "Manual" : "Lector"}
                      {lectura.ms !== null && ` · ${lectura.ms} ms`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
