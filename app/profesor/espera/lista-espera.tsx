"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

type Turno = {
  numero: number;
  estado: "esperando" | "llamado";
  creado_en: string;
  alumnos: { nombre: string } | null;
};

type Aforo = { ocupacion: number; capacidad: number };

// Respaldo por si Realtime se desconecta (riesgo R04).
const INTERVALO_RESPALDO_MS = 15000;

function inicioDelDia() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy.toISOString();
}

export function ListaEspera() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [aforo, setAforo] = useState<Aforo | null>(null);
  const [error, setError] = useState(false);
  const supabaseRef = useRef(createClient());

  const leer = useCallback(async () => {
    const supabase = supabaseRef.current;
    const [respuestaTurnos, respuestaAforo] = await Promise.all([
      supabase
        .from("turnos")
        .select("numero, estado, creado_en, alumnos(nombre)")
        .in("estado", ["esperando", "llamado"])
        .gte("creado_en", inicioDelDia())
        .order("numero"),
      supabase.from("aforo").select("ocupacion, capacidad").eq("id", 1).maybeSingle(),
    ]);
    setError(Boolean(respuestaTurnos.error));
    if (!respuestaTurnos.error) setTurnos((respuestaTurnos.data ?? []) as unknown as Turno[]);
    if (respuestaAforo.data) setAforo(respuestaAforo.data as Aforo);
  }, []);

  useEffect(() => {
    const supabase = supabaseRef.current;
    void leer();
    // Cualquier cambio en turnos o en el aforo vuelve a leer la lista.
    const canal = supabase
      .channel("lista-espera")
      .on("postgres_changes", { event: "*", schema: "public", table: "turnos" }, () => void leer())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "aforo" }, () => void leer())
      .subscribe();
    const intervalo = setInterval(leer, INTERVALO_RESPALDO_MS);
    return () => {
      clearInterval(intervalo);
      void supabase.removeChannel(canal);
    };
  }, [leer]);

  return (
    <div className="min-h-svh w-full">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 p-4">
          <Link href="/profesor" className="text-xl font-bold tracking-tight">
            AforoFit
          </Link>
          <Badge variant="secondary">Lista de espera</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <span className="text-muted-foreground">Aforo actual</span>
            <span className="text-3xl font-bold tabular-nums">
              {aforo ? `${aforo.ocupacion} / ${aforo.capacidad}` : "—"}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Turnos de hoy</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-sm text-destructive">No se pudo leer la lista. Reintentando…</p>
            ) : turnos.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay nadie en espera.</p>
            ) : (
              <ul className="divide-y">
                {turnos.map((turno) => (
                  <li
                    key={turno.numero}
                    className={`flex items-center justify-between gap-4 py-3 ${
                      turno.estado === "llamado" ? "font-semibold" : ""
                    }`}
                  >
                    <span className="w-16 text-2xl tabular-nums">#{turno.numero}</span>
                    <span className="flex-1">{turno.alumnos?.nombre ?? "Alumno"}</span>
                    {turno.estado === "llamado" ? (
                      <Badge className="bg-yellow-400 text-black hover:bg-yellow-400">Llamado</Badge>
                    ) : (
                      <Badge variant="outline">Esperando</Badge>
                    )}
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
