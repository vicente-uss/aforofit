"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { patronContiene } from "@/lib/ingreso/buscarAlumnos";
import { capturarLectura } from "@/lib/ingreso/capturarLectura";
import { normalizarUid } from "@/lib/ingreso/normalizarUid";
import type { Alumno } from "@/lib/prestamos/formulario";
import { m } from "@/lib/prestamos/mensajes";
import { createClient } from "@/lib/supabase/client";

export function BuscadorAlumno({ lector, elegir }: { lector?: boolean; elegir: (a: Alumno | null) => void }) {
  const [nombre, setNombre] = useState("");
  const [lista, setLista] = useState<Alumno[]>([]);
  const [aviso, setAviso] = useState("");
  const peticion = useRef(0);

  function limpiar() {
    elegir(null);
    setLista([]);
    setAviso("");
    return ++peticion.current;
  }

  async function buscar(codigo?: string) {
    const turno = limpiar();
    const db = createClient();
    let consulta = db.from("alumnos").select("id,nombre,certificado_hasta");
    if (codigo) {
      const uid = normalizarUid(codigo);
      if (!uid.ok) { setAviso(uid.error); return; }
      const tarjeta = await db.from("tarjetas").select("alumno_id").eq("uid", uid.uid).maybeSingle();
      if (turno !== peticion.current) return;
      if (!tarjeta.data || tarjeta.error) { setAviso(tarjeta.error ? m.fallo : m.sinTarjeta); return; }
      consulta = consulta.eq("id", tarjeta.data.alumno_id);
    } else {
      if (!nombre.trim()) return;
      consulta = consulta.ilike("nombre", patronContiene(nombre.trim()));
    }
    const { data, error } = await consulta.order("nombre").limit(12);
    if (turno !== peticion.current) return;
    if (error || !data?.length) { setAviso(error ? m.fallo : m.sinResultados); return; }
    if (codigo) elegir(data[0]);
    else setLista(data);
  }

  return <div className="space-y-3">
    {lector && <label className="block">{m.lector}
      <Input autoFocus autoComplete="off" onKeyDown={e => capturarLectura(e, buscar)} />
    </label>}
    <form className="flex items-end gap-2" onSubmit={e => { e.preventDefault(); void buscar(); }}>
      <label className="min-w-0 flex-1">{m.nombre}
        <Input value={nombre} onChange={e => { limpiar(); setNombre(e.target.value); }} />
      </label>
      <Button disabled={!nombre.trim()}>{m.buscar}</Button>
    </form>
    <p role="status">{aviso}</p>
    <ul className="space-y-1">{lista.map(a => <li key={a.id}>
      <Button variant="outline" onClick={() => { elegir(a); setLista([]); }}>{a.nombre}</Button>
    </li>)}</ul>
  </div>;
}
