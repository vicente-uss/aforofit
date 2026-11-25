"use client";

import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { BuscadorAlumno } from "@/components/buscador-alumno";
import { Aviso } from "@/components/marca/aviso";
import { Avatar } from "@/components/marca/avatar";
import { EstadoVacio } from "@/components/marca/estado-vacio";
import { Insignia } from "@/components/marca/insignia";
import { EncabezadoPagina, EncabezadoTarjeta, Tarjeta } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fechaChilena, hoyEnChile, vigencia, type Alumno } from "@/lib/prestamos/formulario";
import { m, mensajeError } from "@/lib/prestamos/mensajes";
import { createClient } from "@/lib/supabase/client";

export function Habilitacion() {
  const [alumno, elegir] = useState<Alumno | null>(null);
  const [emision, setEmision] = useState("");
  const [aviso, setAviso] = useState("");
  const [guardando, setGuardando] = useState(false);
  const hoy = hoyEnChile();

  async function guardar() {
    if (!alumno || guardando) return;
    setGuardando(true);
    const { data, error } = await createClient().rpc("registrar_habilitacion", { p_alumno: alumno.id, p_emision: emision });
    if (!error) elegir({ ...alumno, certificado_hasta: data });
    setAviso(error ? mensajeError(error.message) : m.guardado);
    setGuardando(false);
  }

  // Solo presentación: tono de la insignia según la vigencia que ya calcula vigencia().
  const estadoVigencia = alumno ? vigencia(alumno.certificado_hasta, hoy) : null;

  return <div className="mx-auto max-w-3xl space-y-6">
    <EncabezadoPagina eyebrow="Administración" titulo={m.habilitacion}
      subtitulo="El certificado dura un año desde su fecha de emisión (D20). Solo se registra la vigencia, nunca datos médicos." />
    {aviso && <Aviso tono={aviso === m.guardado ? "green" : "red"} role="status" className="animate-pop-in">
      <span className="font-semibold">{aviso}</span>
    </Aviso>}
    <Tarjeta>
      <EncabezadoTarjeta titulo="Buscar alumno" subtitulo="Por nombre." />
      <fieldset disabled={guardando} className="min-w-0 space-y-5 px-5 pb-5 pt-4">
        <BuscadorAlumno elegir={a => { elegir(a); setEmision(""); setAviso(""); }} />
        {alumno ? <form className="space-y-4 rounded-xl border border-line p-4 animate-pop-in" onSubmit={e => { e.preventDefault(); void guardar(); }}>
          <div className="flex flex-wrap items-center gap-3">
            <Avatar nombre={alumno.nombre} />
            <h2 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-navy-900">{alumno.nombre}</h2>
            {estadoVigencia && <Insignia tono={estadoVigencia === "vigente" ? "green" : estadoVigencia === "vencido" ? "red" : "neutral"} punto>
              {m[estadoVigencia]} {alumno.certificado_hasta && fechaChilena(alumno.certificado_hasta)}
            </Insignia>}
          </div>
          <label className="block space-y-1.5"><span className="text-[13px] font-semibold text-navy-900">{m.emision}</span>
            <Input type="date" required max={hoy} value={emision} onChange={e => setEmision(e.target.value)} className="tnum" />
          </label>
          <Button disabled={!emision || emision > hoy}>{m.guardar}</Button>
        </form> : <EstadoVacio icono={ShieldCheck} titulo="Elige un alumno" className="py-6">
          Busca por nombre para ver y registrar la vigencia de su certificado.
        </EstadoVacio>}
      </fieldset>
    </Tarjeta>
  </div>;
}
