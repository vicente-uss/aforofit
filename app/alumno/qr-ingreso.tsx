"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Tarjeta } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function QrIngreso() {
  const [actual, setActual] = useState<{ codigo: string; vence_en: string } | null>(null);
  const [ahora, setAhora] = useState(0);
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false);
  useEffect(() => {
    if (!actual) return;
    const id = setInterval(() => setAhora(Date.now()), 500);
    return () => clearInterval(id);
  }, [actual]);
  const segundos = actual ? Math.max(0, Math.ceil((Date.parse(actual.vence_en) - ahora) / 1000)) : 0;
  async function generar() {
    setOcupado(true);
    setError("");
    const respuesta = await createClient().rpc("generar_codigo_ingreso");
    setOcupado(false);
    if (respuesta.error) {
      setError(respuesta.error.message === "sin_tarjeta" ? "Pide al profesor que vincule una credencial." : "No se pudo generar el código.");
      return;
    }
    setAhora(Date.now());
    setActual(respuesta.data);
  }
  return <Tarjeta className="space-y-3 p-4 text-center">
    {actual && segundos > 0 && <>
      <QRCodeSVG value={actual.codigo} size={220} marginSize={4} title="Código de ingreso" className="mx-auto max-w-full" />
      <p className="font-mono text-3xl tracking-widest">{actual.codigo}</p>
      <p>Un solo uso · vence en {Math.floor(segundos / 60)}:{String(segundos % 60).padStart(2,"0")}</p>
    </>}
    {actual && !segundos && <p>El código venció.</p>}
    {error && <p role="alert">{error}</p>}
    <Button variant="secondary" disabled={ocupado} onClick={generar}>{actual ? "Generar otro código" : "Mostrar QR de ingreso"}</Button>
  </Tarjeta>;
}
