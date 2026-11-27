"use client";

import { useEffect, useState } from "react";
import { Aviso } from "@/components/marca/aviso";
import { m } from "@/lib/prestamos/mensajes";
import { createClient } from "@/lib/supabase/client";

export function AvisoTne() {
  const [pendiente, setPendiente] = useState(false);

  useEffect(() => {
    const db = createClient();
    const control = new AbortController();
    let consultando = false;

    async function consultar() {
      if (consultando || document.visibilityState !== "visible") return;
      consultando = true;
      const { data } = await db.rpc("mi_aviso_tne").abortSignal(control.signal);
      if (!control.signal.aborted) setPendiente(data === true);
      consultando = false;
    }

    void consultar();
    // Actualiza también cuando se entrega la TNE con el perfil abierto.
    const intervalo = window.setInterval(consultar, 15_000);
    document.addEventListener("visibilitychange", consultar);
    return () => {
      control.abort();
      window.clearInterval(intervalo);
      document.removeEventListener("visibilitychange", consultar);
    };
  }, []);

  return pendiente && (
    <Aviso tono="amber" role="status" titulo={m.avisoTne}>
      Puedes retirarla con el profesor encargado del gimnasio.
    </Aviso>
  );
}
