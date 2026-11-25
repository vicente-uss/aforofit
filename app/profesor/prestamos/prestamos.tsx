"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BuscadorAlumno } from "@/components/buscador-alumno";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { armarItems, type Alumno, type Stock } from "@/lib/prestamos/formulario";
import { m, mensajeError } from "@/lib/prestamos/mensajes";
import { createClient } from "@/lib/supabase/client";

type Pendiente = {
  id: string; alumno_id: string; alumno: string; implementos: string;
  entregado_en: string; devuelto_en: string | null;
};

export function Prestamos() {
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [stock, setStock] = useState<Stock[]>([]);
  const [pendientes, setPendientes] = useState<Pendiente[]>([]);
  const [cantidades, setCantidades] = useState<Record<number, string>>({});
  const [aviso, setAviso] = useState("");
  const [estado, setEstado] = useState<"cargando" | "error" | "listo">("cargando");
  const [guardando, setGuardando] = useState(false);
  const db = useRef(createClient()).current;

  const cargar = useCallback(async () => {
    setEstado("cargando");
    const [inventario, lista] = await Promise.all([
      db.from("stock_prestamos").select("id,nombre,disponible").order("nombre"),
      db.from("prestamos_pendientes").select("*").order("entregado_en"),
    ]);
    if (inventario.error || lista.error) { setEstado("error"); return; }
    setStock(inventario.data);
    setPendientes(lista.data as Pendiente[]);
    setEstado("listo");
  }, [db]);
  useEffect(() => { void cargar(); }, [cargar]);

  const items = armarItems(stock, cantidades);
  const pendiente = pendientes.find(p => p.alumno_id === alumno?.id);

  async function registrar(devolucion?: string) {
    if (guardando || estado !== "listo") return;
    if (devolucion && !window.confirm(m.confirmar)) return;
    if (!devolucion && (!alumno || !items || pendiente)) return;
    setGuardando(true);
    const { error } = devolucion
      ? await db.rpc("registrar_devolucion", { p_prestamo: devolucion })
      : await db.rpc("registrar_prestamo", { p_alumno: alumno?.id, p_items: items });
    setAviso(error ? mensajeError(error.message) : devolucion ? m.devuelto : m.prestado);
    if (!error) setCantidades({});
    await cargar();
    setGuardando(false);
  }

  return <main className="mx-auto max-w-xl space-y-5 p-4">
    <Link href="/profesor" className="underline">{m.profesor}</Link>
    <h1 className="text-2xl font-bold">{m.prestamos}</h1>
    <fieldset disabled={guardando} className="min-w-0 space-y-4">
      <BuscadorAlumno lector elegir={a => { setAlumno(a); setCantidades({}); setAviso(""); }} />
      {alumno && <p className="font-semibold">{m.seleccion} · {alumno.nombre}</p>}
      {estado === "listo" && <>
        {pendiente && <p role="status">{mensajeError(pendiente.devuelto_en ? "tne_pendiente" : "prestamo_abierto")}</p>}
        <fieldset disabled={!alumno || !!pendiente} className="min-w-0 space-y-3 rounded-lg border p-3">
          <legend className="font-semibold">{m.implementos}</legend>
          {stock.map(i => <label key={i.id} className="flex items-center justify-between gap-3">
            <span>{i.nombre}<small className="block">{m.disponible}: {i.disponible}</small></span>
            <Input aria-label={`${m.cantidad} · ${i.nombre}`} className="w-20" type="number" min="0"
              max={i.disponible} step="1" disabled={!i.disponible} placeholder="0" value={cantidades[i.id] ?? ""}
              onChange={e => setCantidades({ ...cantidades, [i.id]: e.target.value })} />
          </label>)}
          <p>{m.garantia}</p>
          <Button disabled={!items} onClick={() => void registrar()}>{m.prestar}</Button>
        </fieldset>
      </>}
    </fieldset>
    <p role="status">{aviso}</p>
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{m.abiertos}</h2>
      <Button variant="outline" disabled={guardando || estado === "cargando"} onClick={() => void cargar()}>{m.cargar}</Button>
      {estado !== "listo" ? <p role="status">{estado === "error" ? m.fallo : m.cargando}</p>
        : pendientes.length === 0 ? <p>{m.ninguno}</p> : <ul className="space-y-3">{pendientes.map(p =>
          <li className="space-y-2 rounded-lg border p-3" key={p.id}>
            <strong>{p.alumno}</strong><p>{p.implementos}</p>
            <time dateTime={p.entregado_en}>{new Date(p.entregado_en).toLocaleString("es-CL", { timeZone: "America/Santiago" })}</time>
            <div>{p.devuelto_en ? mensajeError("tne_pendiente")
              : <Button disabled={guardando} onClick={() => void registrar(p.id)}>{m.devolver}</Button>}</div>
          </li>)}</ul>}
    </section>
  </main>;
}
