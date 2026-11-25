"use client";

import Link from "next/link";
import { useState } from "react";
import { BuscadorAlumno } from "@/components/buscador-alumno";
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

  return <main className="mx-auto max-w-lg space-y-5 p-4">
    <Link href="/admin" className="underline">{m.admin}</Link>
    <h1 className="text-2xl font-bold">{m.habilitacion}</h1>
    <fieldset disabled={guardando} className="min-w-0 space-y-5">
      <BuscadorAlumno elegir={a => { elegir(a); setEmision(""); setAviso(""); }} />
      {alumno && <form className="space-y-4 rounded-lg border p-4" onSubmit={e => { e.preventDefault(); void guardar(); }}>
        <h2 className="text-lg font-semibold">{alumno.nombre}</h2>
        <p>{m[vigencia(alumno.certificado_hasta, hoy)]} {alumno.certificado_hasta && fechaChilena(alumno.certificado_hasta)}</p>
        <label className="block">{m.emision}
          <Input type="date" required max={hoy} value={emision} onChange={e => setEmision(e.target.value)} />
        </label>
        <Button disabled={!emision || emision > hoy}>{m.guardar}</Button>
      </form>}
    </fieldset>
    <p role="status">{aviso}</p>
  </main>;
}
