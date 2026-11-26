"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { esCodigoIngreso } from "@/lib/ingreso/codigoQr";

type Detector = {
  new(options: { formats: string[] }): { detect(video: HTMLVideoElement): Promise<{rawValue: string}[]> };
  getSupportedFormats(): Promise<string[]>;
};
function detector() {
  return (window as Window & { BarcodeDetector?: Detector }).BarcodeDetector;
}

export function CamaraQr({ leer }: { leer: (codigo: string) => void }) {
  const [disponible, setDisponible] = useState(false);
  const [activa, setActiva] = useState(false);
  const [error, setError] = useState("");
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const api = detector();
    if (api && navigator.mediaDevices) void api.getSupportedFormats().then(f => setDisponible(f.includes("qr_code"))).catch(() => {});
  }, []);
  useEffect(() => {
    if (!activa) return;
    let vigente = true;
    let flujo: MediaStream | undefined;
    let temporizador: ReturnType<typeof setTimeout>;
    async function iniciar() {
      const Api = detector();
      if (!Api) return;
      try {
        const lector = new Api({ formats: ["qr_code"] });
        flujo = await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});
        if (!vigente || !video.current) { flujo.getTracks().forEach(t => t.stop()); return; }
        video.current.srcObject = flujo;
        await video.current.play();
        async function detectar() {
          if (!vigente || !video.current) return;
          const resultados = await lector.detect(video.current);
          if (!vigente) return;
          const qr = resultados.find(r => esCodigoIngreso(r.rawValue));
          if (qr) { setActiva(false); leer(qr.rawValue); return; }
          temporizador = setTimeout(() => void detectar().catch(fallar), 250);
        }
        await detectar();
      } catch { fallar(); }
    }
    function fallar() {
      if (vigente) { setActiva(false); setError("No se pudo leer con la cámara. Escribe el código."); }
    }
    void iniciar();
    return () => { vigente=false; clearTimeout(temporizador); flujo?.getTracks().forEach(t => t.stop()); };
  }, [activa, leer]);
  if (!disponible) return null;
  return <div className="space-y-2">
    {activa && <video ref={video} muted playsInline className="w-full rounded-xl" />}
    <Button type="button" variant="secondary" onClick={() => { setError(""); setActiva(!activa); }}>
      {activa ? "Cerrar cámara" : "Leer QR con la cámara"}
    </Button>
    {error && <p role="alert">{error}</p>}
  </div>;
}
