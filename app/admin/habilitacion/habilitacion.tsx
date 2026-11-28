"use client";

import { ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { BuscadorAlumno } from "@/components/buscador-alumno";
import { Aviso } from "@/components/marca/aviso";
import { Avatar } from "@/components/marca/avatar";
import { EstadoVacio } from "@/components/marca/estado-vacio";
import { Insignia } from "@/components/marca/insignia";
import { EncabezadoPagina, EncabezadoTarjeta, Tarjeta } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hoyEnChile, type Alumno } from "@/lib/prestamos/formulario";
import { m, mensajeError } from "@/lib/prestamos/mensajes";
import { textoVigencia, type VigenciaCertificado } from "@/lib/inscripciones/vigencia";
import { createClient } from "@/lib/supabase/client";

type HabilitacionPersona = VigenciaCertificado & { editable_admin: boolean };

async function consultar(id: string): Promise<HabilitacionPersona | null> {
  const { data, error } = await createClient().rpc("leer_habilitacion", { p_alumno: id });
  return error ? null : data;
}

export function Habilitacion() {
  const [alumno, elegir] = useState<Alumno | null>(null);
  const [vigencia, setVigencia] = useState<HabilitacionPersona | null>(null);
  const [consultando, setConsultando] = useState(false);
  const [emision, setEmision] = useState("");
  const [aviso, setAviso] = useState("");
  const [guardando, setGuardando] = useState(false);
  const solicitud = useRef(0);
  const hoy = hoyEnChile();

  async function seleccionar(persona: Alumno | null) {
    const turno = ++solicitud.current;
    elegir(persona);
    setVigencia(null);
    setEmision("");
    setAviso("");
    setConsultando(Boolean(persona));
    if (!persona) return;
    const estado = await consultar(persona.id);
    if (turno !== solicitud.current) return;
    setVigencia(estado);
    setEmision(estado?.certificado_emision ?? "");
    if (!estado) setAviso("No se pudo consultar la vigencia. Selecciona a la persona nuevamente.");
    setConsultando(false);
  }

  async function guardar() {
    if (!alumno || !vigencia?.editable_admin || guardando) return;
    setGuardando(true);
    const { error } = await createClient().rpc("registrar_habilitacion", { p_alumno: alumno.id, p_emision: emision });
    const estado = await consultar(alumno.id);
    setVigencia(estado);
    if (estado) setEmision(estado.certificado_emision ?? "");
    const problema = error?.message === "certificado_gestionado_en_inscripcion"
      ? "El profesor gestiona esta vigencia en Inscripciones."
      : error?.message === "certificado_exento"
        ? "Esta persona está exenta de certificado médico."
        : error ? mensajeError(error.message) : null;
    setAviso(problema ?? (estado ? m.guardado : "La vigencia se guardó. Selecciona a la persona nuevamente para consultarla."));
    setGuardando(false);
  }

  const estadoVigencia = vigencia?.estado_certificado;

  return <div className="mx-auto max-w-3xl space-y-6">
    <EncabezadoPagina eyebrow="Administración" titulo="Habilitación de personas"
      subtitulo="Consulta el estado del certificado médico y actualiza la fecha de emisión de los registros históricos." />
    {aviso && <Aviso tono={aviso === m.guardado ? "green" : "red"} role="status" className="animate-pop-in">
      <span className="font-semibold">{aviso}</span>
    </Aviso>}
    <Tarjeta>
      <EncabezadoTarjeta titulo="Buscar persona" />
      <fieldset disabled={guardando} className="min-w-0 space-y-5 px-5 pb-5 pt-4">
        <BuscadorAlumno elegir={a => { void seleccionar(a); }} />
        {alumno ? <form className="space-y-4 rounded-xl border border-line p-4 animate-pop-in" onSubmit={e => { e.preventDefault(); void guardar(); }}>
          <div className="flex flex-wrap items-center gap-3">
            <Avatar nombre={alumno.nombre} />
            <h2 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-navy-900">{alumno.nombre}</h2>
            {vigencia && <Insignia tono={estadoVigencia === "vigente" || estadoVigencia === "exento" ? "green" : estadoVigencia === "vencido" ? "red" : "neutral"} punto>
              {textoVigencia(vigencia)}
            </Insignia>}
          </div>
          {consultando && <p role="status" className="text-sm text-tinta-suave">Consultando vigencia…</p>}
          {vigencia?.editable_admin && <><label className="block space-y-1.5"><span className="text-[13px] font-semibold text-navy-900">{m.emision}</span>
            <Input type="date" required max={hoy} value={emision} onChange={e => setEmision(e.target.value)} className="tnum" />
          </label>
          <Button disabled={!emision || emision > hoy}>{m.guardar}</Button></>}
          {vigencia && !vigencia.editable_admin && estadoVigencia !== "exento" &&
            <p className="text-sm text-tinta-suave">El profesor gestiona el certificado en Inscripciones.</p>}
        </form> : <EstadoVacio icono={ShieldCheck} titulo="Elige una persona" className="py-6">
          Busca por nombre para consultar el estado de su certificado.
        </EstadoVacio>}
      </fieldset>
    </Tarjeta>
  </div>;
}
