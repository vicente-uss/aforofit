"use client";

import { Package, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Aviso } from "@/components/marca/aviso";
import { Avatar } from "@/components/marca/avatar";
import { EstadoVacio } from "@/components/marca/estado-vacio";
import { Insignia } from "@/components/marca/insignia";
import { EncabezadoPagina, EncabezadoTarjeta, Tarjeta } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { armarItems, type Stock } from "@/lib/prestamos/formulario";
import { m, mensajeError } from "@/lib/prestamos/mensajes";
import { createClient } from "@/lib/supabase/client";
import { BuscadorSolicitante, type Solicitante } from "./buscador-solicitante";

type Pendiente = {
  id: string; solicitante_id: string; alumno: string; implementos: string;
  externo: boolean; referencia: string | null; cuenta_vinculada: boolean;
  entregado_en: string; devuelto_en: string | null; pendientes: Stock[];
  aviso_tne_en?: string | null;
};
type Inventario = Stock & { categoria: string | null };

const EXITO = {
  prestar: m.prestado,
  devolver: m.devuelto,
  garantia: m.tneEntregada,
  avisar: m.avisoTneEnviado,
};

export function Prestamos() {
  const [solicitante, setSolicitante] = useState<Solicitante | null>(null);
  const [stock, setStock] = useState<Inventario[]>([]);
  const [buscarImplemento, setBuscarImplemento] = useState("");
  const [tneRecibida, setTneRecibida] = useState(false);
  const [pendientes, setPendientes] = useState<Pendiente[]>([]);
  const [cantidades, setCantidades] = useState<Record<number, string>>({});
  const [aviso, setAviso] = useState("");
  const [estado, setEstado] = useState<"cargando" | "error" | "listo">("cargando");
  const [guardando, setGuardando] = useState(false);
  const [db] = useState(createClient);
  const operacionEnCurso = useRef(false);

  const cargar = useCallback(async () => {
    setEstado("cargando");
    const [inventario, lista] = await Promise.all([
      db.from("stock_prestamos").select("id,nombre,disponible,categoria").eq("prestable", true).order("nombre"),
      db.from("prestamos_pendientes").select("*").order("entregado_en"),
    ]);
    if (inventario.error || lista.error) { setEstado("error"); return; }
    setStock(inventario.data);
    setPendientes(lista.data as Pendiente[]);
    setEstado("listo");
  }, [db]);
  useEffect(() => { void cargar(); }, [cargar]);

  const items = armarItems(stock, cantidades);
  const pendiente = solicitante && pendientes.find(p => p.solicitante_id === solicitante.id && p.externo === solicitante.externo);
  const filtro = buscarImplemento.trim().toLocaleLowerCase("es-CL");
  const stockVisible = stock.filter(i => cantidades[i.id] || `${i.nombre} ${i.categoria ?? ""}`.toLocaleLowerCase("es-CL").includes(filtro));

  function elegir(persona: Solicitante | null) {
    setSolicitante(persona);
    setCantidades({});
    setBuscarImplemento("");
    setTneRecibida(false);
  }

  async function registrar(accion: keyof typeof EXITO, id?: string, detalle?: ReturnType<typeof armarItems>) {
    if (operacionEnCurso.current || estado !== "listo") return;
    if (accion === "prestar" && (!solicitante || !items || pendiente || !tneRecibida)) return;
    if (accion === "devolver" && !window.confirm(detalle ? "¿Registrar las cantidades indicadas?" : "¿Devolver todos los implementos pendientes?")) return;
    if (accion === "garantia" && !window.confirm("¿Entregaste la TNE al solicitante?")) return;
    operacionEnCurso.current = true;
    setGuardando(true);
    const operaciones = {
      prestar: () => db.rpc("registrar_prestamo_por_nombre", {
        p_solicitante: solicitante?.id, p_externo: solicitante?.externo,
        p_nombre: solicitante?.nuevo ? solicitante.nombre : null,
        p_referencia: solicitante?.nuevo ? solicitante.referencia : null,
        p_items: items, p_tne_recibida: tneRecibida,
      }),
      devolver: () => db.rpc("registrar_devolucion", { p_prestamo: id, p_items: detalle ?? null }),
      garantia: () => db.rpc("entregar_tne", { p_prestamo: id }),
      avisar: () => db.rpc("enviar_aviso_tne", { p_prestamo: id }),
    };
    try {
      const { error } = await operaciones[accion]();
      setAviso(error ? mensajeError(error.message) : EXITO[accion]);
      if (!error && accion === "prestar") elegir(null);
      await cargar();
    } catch {
      setAviso(m.fallo);
    } finally {
      operacionEnCurso.current = false;
      setGuardando(false);
    }
  }

  // Solo presentación: el aviso de éxito va en verde y los errores en rojo.
  const avisoExito = Object.values(EXITO).includes(aviso);

  return <div className="mx-auto max-w-5xl space-y-6">
    <EncabezadoPagina eyebrow="Profesor encargado" titulo={m.prestamos} subtitulo={m.garantia} />
    {aviso && <Aviso tono={avisoExito ? "green" : "red"} role="status" className="animate-pop-in">
      <span className="font-semibold">{aviso}</span>
    </Aviso>}
    <div className="grid gap-6 lg:grid-cols-2">
      <Tarjeta>
        <EncabezadoTarjeta titulo="Nuevo préstamo" />
        <fieldset disabled={guardando} className="min-w-0 space-y-4 px-5 pb-5 pt-4">
          {!solicitante && <BuscadorSolicitante db={db} elegir={persona => { elegir(persona); setAviso(""); }} />}
          {solicitante && <div className="space-y-3 rounded-xl border border-line bg-slate-50 px-3 py-3">
            <div className="flex min-w-0 items-start gap-3">
              <Avatar nombre={solicitante.nombre} />
              <div className="min-w-0 break-words">
                <p className="text-xs text-tinta-suave">{solicitante.nuevo ? "Nuevo solicitante externo" : solicitante.referencia || "Ficha seleccionada"}</p>
                <p className="font-semibold text-navy-900">{solicitante.nombre}</p>
              </div>
            </div>
            {solicitante.nuevo && <label className="grid gap-1 text-sm">Referencia para distinguir homónimos (opcional)
              <Input maxLength={80} placeholder="Por ejemplo, equipo o carrera" value={solicitante.referencia ?? ""}
                onChange={e => setSolicitante({ ...solicitante, referencia: e.target.value })} />
            </label>}
            <Button size="sm" variant="outline" onClick={() => elegir(null)}>Cambiar solicitante</Button>
          </div>}
          {solicitante && estado === "listo" && <>
            {pendiente && <Aviso tono="amber" role="status">{mensajeError(pendiente.devuelto_en ? "tne_pendiente" : "prestamo_abierto")}</Aviso>}
            {!pendiente && <fieldset className="min-w-0 space-y-3 rounded-xl border border-line p-4">
              <legend className="px-1 text-[13px] font-semibold text-navy-900">{m.implementos}</legend>
              <Input type="search" aria-label="Buscar implementos" placeholder="Buscar implementos" value={buscarImplemento}
                onChange={e => setBuscarImplemento(e.target.value)} />
              {stockVisible.length === 0 && <p className="text-sm text-tinta-suave">No hay implementos para mostrar.</p>}
              {stockVisible.map(i => <label key={i.id} className="flex items-center justify-between gap-3">
                <span className="min-w-0 break-words"><span className="block text-sm font-medium text-navy-900">{i.nombre}</span>
                  <small className="tnum block text-xs text-tinta-suave">{i.categoria && `${i.categoria} · `}{m.disponible}: {i.disponible}</small></span>
                <Input aria-label={`${m.cantidad} · ${i.nombre}`} className="tnum w-16 shrink-0 text-center sm:w-20" type="number" min="0"
                  max={i.disponible} step="1" disabled={!i.disponible} placeholder="0" value={cantidades[i.id] ?? ""}
                  onChange={e => setCantidades({ ...cantidades, [i.id]: e.target.value })} />
              </label>)}
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-blue-700" checked={tneRecibida}
                  onChange={e => setTneRecibida(e.target.checked)} />
                Recibí la TNE física como garantía
              </label>
              <Button className="w-full" disabled={!items || !tneRecibida} onClick={() => void registrar("prestar")}>{m.prestar}</Button>
            </fieldset>}
          </>}
        </fieldset>
      </Tarjeta>
      <Tarjeta>
        <EncabezadoTarjeta titulo={m.abiertos} subtitulo={estado === "listo" ? `${pendientes.length} pendientes` : undefined}
          accion={<Button variant="secondary" size="sm" disabled={guardando || estado === "cargando"} onClick={() => void cargar()}>
            <RefreshCw aria-hidden />{m.cargar}</Button>} />
        <div className="px-5 pb-5 pt-3">
          {estado !== "listo" ? <p role="status" className={estado === "error" ? "text-sm font-medium text-red-600" : "text-sm text-tinta-suave"}>
            {estado === "error" ? m.fallo : m.cargando}</p>
            : pendientes.length === 0 ? <EstadoVacio icono={Package} titulo={m.ninguno} />
            : <ul aria-label={m.abiertos} className="space-y-3">{pendientes.map(p =>
              <li className="space-y-2 rounded-xl border border-line p-4" key={p.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 break-words">
                    <strong className="font-semibold text-navy-900">{p.alumno}</strong>
                    {p.referencia && <p className="text-xs text-tinta-suave">{p.referencia}</p>}
                  </div>
                  {p.devuelto_en ? <Insignia tono="amber" punto>TNE sin retirar</Insignia> : <Insignia tono="blue" punto>Implementos pendientes</Insignia>}
                </div>
                <p className="break-words text-sm text-slate-700">{p.implementos}</p>
                <time className="tnum block text-xs text-tinta-suave" dateTime={p.entregado_en}>{new Date(p.entregado_en).toLocaleString("es-CL", { timeZone: "America/Santiago" })}</time>
                {p.devuelto_en
                  ? <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" onClick={() => void registrar("garantia", p.id)} disabled={guardando}>Entregar TNE</Button>
                    {p.aviso_tne_en && <Insignia tono="green">{m.avisoTneEnviado}</Insignia>}
                    {p.cuenta_vinculada && p.aviso_tne_en === null && <Button size="sm" variant="secondary" disabled={guardando}
                      onClick={() => void registrar("avisar", p.id)}>{m.avisarTne}</Button>}
                  </div>
                  : <Devolucion key={p.pendientes.map(i => i.disponible).join(",")} pendientes={p.pendientes} ocupado={guardando} confirmar={detalle => void registrar("devolver", p.id, detalle)} />}

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
      <span className="min-w-0 break-words text-sm">{i.nombre} · pendientes: {i.disponible}</span>
      <Input type="number" min="0" max={i.disponible} step="1" placeholder="0" className="w-16 shrink-0"
        aria-label={`Devolver ${i.nombre}`} value={cantidades[i.id] ?? ""}
        onChange={e => cambiar({ ...cantidades, [i.id]: e.target.value })} />
    </label>)}
    <div className="flex flex-wrap gap-2">
      <Button size="sm" className="h-auto min-h-8 max-w-full whitespace-normal" disabled={!items} onClick={() => items && confirmar(items)}>Devolver cantidades indicadas</Button>
      <Button size="sm" variant="secondary" onClick={() => confirmar(null)}>Devolver todo</Button>
    </div>
  </fieldset>;
}
