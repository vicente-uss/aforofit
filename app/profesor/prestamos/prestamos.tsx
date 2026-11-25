"use client";

import { Package, RefreshCw, UserRound } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BuscadorAlumno } from "@/components/buscador-alumno";
import { Aviso } from "@/components/marca/aviso";
import { Avatar } from "@/components/marca/avatar";
import { EstadoVacio } from "@/components/marca/estado-vacio";
import { Insignia } from "@/components/marca/insignia";
import { EncabezadoPagina, EncabezadoTarjeta, Tarjeta } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { armarItems, type Alumno, type Stock } from "@/lib/prestamos/formulario";
import { m, mensajeError } from "@/lib/prestamos/mensajes";
import { createClient } from "@/lib/supabase/client";

type Pendiente = {
  id: string; alumno_id: string; alumno: string; implementos: string;
  entregado_en: string; devuelto_en: string | null; pendientes: Stock[];
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

  async function registrar(accion: "prestar" | "devolver" | "garantia", id?: string, detalle?: ReturnType<typeof armarItems>) {
    if (guardando || estado !== "listo") return;
    if (accion === "prestar" && (!alumno || !items || pendiente)) return;
    if (accion === "devolver" && !window.confirm(detalle ? "¿Registrar las cantidades indicadas?" : "¿Devolver todos los implementos pendientes?")) return;
    if (accion === "garantia" && !window.confirm("¿Entregaste la TNE al alumno?")) return;
    setGuardando(true);
    const { error } = accion === "prestar"
      ? await db.rpc("registrar_prestamo", { p_alumno: alumno?.id, p_items: items })
      : accion === "garantia"
        ? await db.rpc("entregar_tne", { p_prestamo: id })
        : await db.rpc("registrar_devolucion", { p_prestamo: id, p_items: detalle ?? null });
    setAviso(error ? mensajeError(error.message) : accion === "devolver" ? m.devuelto : accion === "garantia" ? m.tneEntregada : m.prestado);
    if (!error) setCantidades({});
    await cargar();
    setGuardando(false);
  }

  // Solo presentación: el aviso de éxito va en verde y los errores en rojo.
  const avisoExito = aviso === m.prestado || aviso === m.devuelto || aviso === m.tneEntregada;

  return <div className="mx-auto max-w-5xl space-y-6">
    <EncabezadoPagina eyebrow="Profesor encargado" titulo={m.prestamos} subtitulo={m.garantia} />
    {aviso && <Aviso tono={avisoExito ? "green" : "red"} role="status" className="animate-pop-in">
      <span className="font-semibold">{aviso}</span>
    </Aviso>}
    <div className="grid gap-6 lg:grid-cols-2">
      <Tarjeta>
        <EncabezadoTarjeta titulo="Nuevo préstamo" subtitulo={m.lector} />
        <fieldset disabled={guardando} className="min-w-0 space-y-4 px-5 pb-5 pt-4">
          <BuscadorAlumno lector elegir={a => { setAlumno(a); setCantidades({}); setAviso(""); }} />
          {alumno && <div className="flex items-center gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3">
            <Avatar nombre={alumno.nombre} />
            <div className="min-w-0"><p className="text-xs text-tinta-suave">{m.seleccion}</p>
              <p className="truncate font-semibold text-navy-900">{alumno.nombre}</p></div>
          </div>}
          {estado === "listo" && <>
            {pendiente && <Aviso tono="amber" role="status">{mensajeError(pendiente.devuelto_en ? "tne_pendiente" : "prestamo_abierto")}</Aviso>}
            <fieldset disabled={!alumno || !!pendiente} className="min-w-0 space-y-3 rounded-xl border border-line p-4 disabled:opacity-60">
              <legend className="px-1 text-[13px] font-semibold text-navy-900">{m.implementos}</legend>
              {stock.map(i => <label key={i.id} className="flex items-center justify-between gap-3">
                <span className="min-w-0"><span className="block text-sm font-medium text-navy-900">{i.nombre}</span>
                  <small className="tnum block text-xs text-tinta-suave">{m.disponible}: {i.disponible}</small></span>
                <Input aria-label={`${m.cantidad} · ${i.nombre}`} className="tnum w-20 text-center" type="number" min="0"
                  max={i.disponible} step="1" disabled={!i.disponible} placeholder="0" value={cantidades[i.id] ?? ""}
                  onChange={e => setCantidades({ ...cantidades, [i.id]: e.target.value })} />
              </label>)}
              <Button className="w-full" disabled={!items} onClick={() => void registrar("prestar")}>{m.prestar}</Button>
            </fieldset>
          </>}
          {!alumno && <EstadoVacio icono={UserRound} titulo="Busca al alumno" className="py-6">
            Pasa su TNE por el lector o búscalo por nombre.
          </EstadoVacio>}
        </fieldset>
      </Tarjeta>
      <Tarjeta>
        <EncabezadoTarjeta titulo={m.abiertos} subtitulo={estado === "listo" ? `${pendientes.length} abiertos` : undefined}
          accion={<Button variant="secondary" size="sm" disabled={guardando || estado === "cargando"} onClick={() => void cargar()}>
            <RefreshCw aria-hidden />{m.cargar}</Button>} />
        <div className="px-5 pb-5 pt-3">
          {estado !== "listo" ? <p role="status" className={estado === "error" ? "text-sm font-medium text-red-600" : "text-sm text-tinta-suave"}>
            {estado === "error" ? m.fallo : m.cargando}</p>
            : pendientes.length === 0 ? <EstadoVacio icono={Package} titulo={m.ninguno} />
            : <ul className="space-y-3">{pendientes.map(p =>
              <li className="space-y-2 rounded-xl border border-line p-4" key={p.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <strong className="font-semibold text-navy-900">{p.alumno}</strong>
                  {p.devuelto_en ? <Insignia tono="amber" punto>TNE en el gimnasio</Insignia> : <Insignia tono="blue" punto>TNE en el gimnasio</Insignia>}
                </div>
                <p className="text-sm text-slate-700">{p.implementos}</p>
                <time className="tnum block text-xs text-tinta-suave" dateTime={p.entregado_en}>{new Date(p.entregado_en).toLocaleString("es-CL", { timeZone: "America/Santiago" })}</time>
                {p.devuelto_en
                  ? <Button size="sm" onClick={() => void registrar("garantia", p.id)} disabled={guardando}>Entregar TNE</Button>
                  : <Devolucion pendientes={p.pendientes} ocupado={guardando} confirmar={detalle => void registrar("devolver", p.id, detalle)} />}

              </li>)}</ul>}
        </div>
      </Tarjeta>
    </div>
  </div>;
}

function Devolucion({ pendientes, ocupado, confirmar }: {
  pendientes: Stock[]; ocupado: boolean; confirmar: (items: ReturnType<typeof armarItems>) => void;
}) {
  const [cantidades, cambiar] = useState<Record<number, string>>({});
  const items = armarItems(pendientes, cantidades);
  return <fieldset disabled={ocupado} className="space-y-3">
    {pendientes.filter(i => i.disponible > 0).map(i => <label key={i.id} className="flex items-center justify-between gap-2">
      <span className="text-sm">{i.nombre} · pendientes: {i.disponible}</span>
      <Input type="number" min="0" max={i.disponible} step="1" placeholder="0" className="w-16"
        aria-label={`Devolver ${i.nombre}`} value={cantidades[i.id] ?? ""}
        onChange={e => cambiar({ ...cantidades, [i.id]: e.target.value })} />
    </label>)}
    <div className="flex flex-wrap gap-2">
      <Button size="sm" disabled={!items} onClick={() => items && confirmar(items)}>Registrar devolución</Button>
      <Button size="sm" variant="secondary" onClick={() => confirmar(null)}>Devolver todo</Button>
    </div>
  </fieldset>;
}
