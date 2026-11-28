"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { createClient } from "@/lib/supabase/client";

export type Solicitante = {
  id: string;
  nombre: string;
  externo: boolean;
  referencia: string | null;
  nuevo?: boolean;
};

export function BuscadorSolicitante({ db, elegir }: {
  db: ReturnType<typeof createClient>;
  elegir: (solicitante: Solicitante) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [resultado, setResultado] = useState<{ consulta: string; personas: Solicitante[]; error: boolean }>();
  const consulta = nombre.trim().replace(/\s+/g, " ");
  const actual = resultado?.consulta === consulta ? resultado : undefined;

  useEffect(() => {
    let vigente = true;
    const espera = window.setTimeout(async () => {
      const { data, error } = await db.rpc("buscar_solicitantes", { p_nombre: consulta });
      if (vigente) setResultado({ consulta, personas: data ?? [], error: Boolean(error) });
    }, consulta ? 180 : 0);
    return () => {
      vigente = false;
      window.clearTimeout(espera);
    };
  }, [db, consulta]);

  return <div className="space-y-2">
    <label className="grid gap-1 text-sm font-medium">Nombre del solicitante
      <Input type="search" autoComplete="off" value={nombre} maxLength={120}
        onChange={e => setNombre(e.target.value)} />
    </label>
    {!actual && <p role="status" className="text-sm text-tinta-suave">Buscando solicitantes…</p>}
    {actual?.error && <p role="alert" className="text-sm text-red-700">No pudimos buscar solicitantes. Vuelve a abrir la búsqueda.</p>}
    {actual && !actual.error && <>
      {actual.personas.length > 0 && <>
        <p className="text-xs font-semibold text-tinta-suave">{consulta ? "Coincidencias" : "Solicitantes recientes"}</p>
        <ul aria-label={consulta ? "Coincidencias" : "Solicitantes recientes"} className="max-h-56 space-y-1 overflow-auto rounded-lg border border-line p-1">
          {actual.personas.map(persona => <li key={`${persona.externo}-${persona.id}`}>
            <button type="button" className="w-full rounded-md px-3 py-2 text-left hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2"
              onClick={() => elegir(persona)}>
              <span className="block text-sm font-medium [overflow-wrap:anywhere]">{persona.nombre}</span>
              <span className="block text-xs text-tinta-suave [overflow-wrap:anywhere]">{persona.referencia || `Ficha · ${persona.id.slice(0, 8)}`}</span>
            </button>
          </li>)}
        </ul>
      </>}
      {consulta && <Button type="button" variant="outline" className="h-auto min-h-9 max-w-full whitespace-normal text-left"
        onClick={() => elegir({ id: crypto.randomUUID(), nombre: consulta, externo: true, referencia: null, nuevo: true })}>
        {actual.personas.length > 0 ? "Registrar otro solicitante con este nombre" : "Registrar solicitante externo"}
      </Button>}
    </>}
  </div>;
}
