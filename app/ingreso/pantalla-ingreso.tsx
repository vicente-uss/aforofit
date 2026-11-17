"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { normalizarUid } from "@/lib/ingreso/normalizarUid";

type Lectura = { uid: string; hora: Date; origen: "lector" | "manual" };

const MAX_LECTURAS = 10; // historial solo en memoria
const VENTANA_REPETIDA_MS = 3000; // se ignora la misma tarjeta si se repite antes de 3 s
const INTERVALO_FOCO_MS = 2000; // cada cuánto se recupera el foco del lector

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

  const lectorRef = useRef<HTMLInputElement>(null);
  const manualAbiertoRef = useRef(false);
  const ultimaAceptadaRef = useRef<{ uid: string; ms: number } | null>(null);

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
      return false;
    }

    const ahora = Date.now();
    const anterior = ultimaAceptadaRef.current;
    if (anterior && anterior.uid === resultado.uid && ahora - anterior.ms < VENTANA_REPETIDA_MS) {
      // Lectura repetida de la misma tarjeta: se ignora sin mostrar nada.
      return true;
    }
    ultimaAceptadaRef.current = { uid: resultado.uid, ms: ahora };

    const lectura: Lectura = { uid: resultado.uid, hora: new Date(ahora), origen };
    setError(null);
    setUltima(lectura);
    setLecturas((previas) => [lectura, ...previas].slice(0, MAX_LECTURAS));

    // TODO (Avance 3): llamar a la función registrar_ingreso(uid) de Supabase con resultado.uid.
    // Debe validar según AGENTS.md, sección 4: credencial única (regla 1), habilitación (2),
    // horario (3), capacidad y lista de espera (4) y una visita abierta por alumno (5),
    // y mostrar aquí el resultado (entrada, salida, turno de espera o rechazo).
    return true;
  }, []);

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
        <Card>
          <CardContent className="flex min-h-[18rem] flex-col items-center justify-center gap-4 p-8 text-center">
            {error ? (
              <>
                <p className="text-4xl font-bold text-destructive md:text-5xl">No se pudo leer</p>
                <p className="text-2xl text-muted-foreground">{error}</p>
                <p className="text-2xl">Acerca tu TNE al lector</p>
              </>
            ) : ultima ? (
              <>
                <p className="text-4xl font-bold text-green-700 dark:text-green-400 md:text-5xl">
                  Tarjeta leída
                </p>
                <p className="font-mono text-6xl font-bold tracking-wider md:text-7xl">
                  {ultima.uid}
                </p>
                <p className="text-3xl text-muted-foreground">{formatoHora(ultima.hora)}</p>
              </>
            ) : (
              <p className="text-5xl font-bold md:text-6xl">Acerca tu TNE al lector</p>
            )}
          </CardContent>
        </Card>

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
                    key={lectura.hora.getTime()}
                    className="flex items-center justify-between gap-4 py-2 text-lg"
                  >
                    <span className="text-muted-foreground">{formatoHora(lectura.hora)}</span>
                    <span className="font-mono font-semibold">{lectura.uid}</span>
                    <span className="w-16 text-right text-sm text-muted-foreground">
                      {lectura.origen === "manual" ? "Manual" : "Lector"}
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
