import { CalendarDays, ChevronLeft, ChevronRight, Download, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { EncabezadoPagina, Tarjeta } from "@/components/marca/tarjeta";
import { CAMPO, SECUNDARIO } from "@/components/multicancha/estilos";
import { Nomina } from "@/components/multicancha/formularios";
import { requerirRol } from "@/lib/auth/perfil";
import { diaSantiago, hora, ZONA } from "@/lib/historial/historial";
import {
  calendario, CAMPOS_RESERVA, estadoModulo, fechaAgenda, fechaTexto, FIN_CALENDARIO, horarioTexto,
  INICIO_CALENDARIO, modulosDelDia, RUTA_PROFESOR, RUTA_REGLAMENTO, TIPOS, type Evento, type Modulo, type Reserva,
} from "@/lib/multicancha/agenda";
import { buscarReglamento } from "@/lib/multicancha/reglamento";
import { confirmacionReserva, ASUNTO_CONFIRMACION } from "@/lib/multicancha/correo";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { CancelarBloque, FormularioBloque } from "./formulario-bloque";

const ESTADOS = { ...TIPOS, disponible: "Disponible", transcurrido: "Transcurrido", cancelado: "Cancelado" };
const COLORES: Record<keyof typeof ESTADOS, string> = {
  disponible: "bg-emerald-50 text-emerald-800",
  transcurrido: "bg-slate-100 text-slate-700",
  ordinaria: "bg-blue-50 text-blue-800",
  institucional: "bg-violet-50 text-violet-800",
  bloqueo: "bg-amber-50 text-amber-900",
  cancelado: "bg-slate-100 text-slate-700",
};
const ACCIONES = { creacion: "Creación", modificacion: "Modificación", cancelacion: "Cancelación", nomina: "Nómina" };
const formatoMomento = new Intl.DateTimeFormat("es-CL", { dateStyle: "short", timeStyle: "short", timeZone: ZONA });

function ruta(fecha: string) {
  return `${RUTA_PROFESOR}?fecha=${fecha}`;
}

function Estado({ estado }: { estado: keyof typeof ESTADOS }) {
  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", COLORES[estado])}>{ESTADOS[estado]}</span>;
}

function Calendario({ fecha, hoy }: { fecha: string; hoy: string }) {
  const mes = calendario(fecha);
  return (
    <Tarjeta className="min-w-0 space-y-4 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex min-w-0 items-center gap-2 text-base font-semibold capitalize text-navy-900">
          <CalendarDays size={19} className="shrink-0 text-blue-700" aria-hidden />{mes.titulo}
        </h2>
        <div className="flex shrink-0 items-center gap-1">
          {mes.anterior && <Link href={ruta(mes.anterior)} aria-label="Mes anterior" className={cn(SECUNDARIO, "px-2.5")}><ChevronLeft size={18} aria-hidden /></Link>}
          {mes.siguiente && <Link href={ruta(mes.siguiente)} aria-label="Mes siguiente" className={cn(SECUNDARIO, "px-2.5")}><ChevronRight size={18} aria-hidden /></Link>}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center" aria-label="Días del mes">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((dia) => (
          <span className="py-1 text-xs font-medium text-slate-600" key={dia}>{dia}</span>
        ))}
        {Array.from({ length: mes.relleno }, (_, i) => <span key={i} aria-hidden />)}
        {mes.dias.map((dia) => (
          <Link key={dia} href={ruta(dia)} prefetch={false} aria-label={fechaTexto(dia)} aria-current={dia === fecha ? "date" : undefined}
            className={cn(
              "grid min-h-9 place-items-center rounded-lg text-sm font-medium",
              dia === fecha ? "bg-blue-700 text-white" : "text-navy-900 hover:bg-blue-50",
              dia === hoy && dia !== fecha && "ring-1 ring-inset ring-blue-600",
            )}>
            {Number(dia.slice(-2))}
          </Link>
        ))}
      </div>
      <form action={RUTA_PROFESOR} className="flex flex-wrap items-end gap-2 border-t border-line pt-3">
        <label className="grid min-w-0 flex-1 gap-1 text-sm font-medium text-navy-900">
          Ir a fecha
          <input type="date" name="fecha" defaultValue={fecha} min={INICIO_CALENDARIO} max={FIN_CALENDARIO} required className={CAMPO} />
        </label>
        <button className={SECUNDARIO}>Ir</button>
        <Link href={ruta(hoy)} className={SECUNDARIO}>Hoy</Link>
      </form>
    </Tarjeta>
  );
}

function DetalleBloque({ reserva, modulos, reglamento }: {
  reserva: Reserva; modulos: Modulo[]; reglamento: Awaited<ReturnType<typeof buscarReglamento>>;
}) {
  const ordinaria = reserva.tipo === "ordinaria";
  const correoManual = reserva.correo && reserva.responsable
    ? `mailto:${encodeURIComponent(reserva.correo)}?subject=${encodeURIComponent(ASUNTO_CONFIRMACION)}&body=${encodeURIComponent(confirmacionReserva({ ...reserva, responsable: reserva.responsable }, Boolean(reglamento.nombre)))}`
    : null;
  return (
    <div className="min-w-0 rounded-xl border border-line p-3" data-bloque={reserva.id}>
      <details>
        <summary className="cursor-pointer break-words text-sm font-semibold text-navy-900">
          {horarioTexto(reserva)} · {reserva.responsable ?? reserva.titulo}
          <span className="ml-2 align-middle"><Estado estado={reserva.cancelada_en ? "cancelado" : reserva.tipo} /></span>
        </summary>
        <div className="mt-3 space-y-3 text-sm">
          {ordinaria && (
            <>
              <div className="space-y-0.5 break-words text-slate-700">
                <p>{reserva.carrera} · {reserva.correo}</p>
                <p>{reserva.responsable_id ? "Cuenta de alumno vinculada" : "Sin cuenta vinculada"}</p>
              </div>
              <details className="rounded-lg border border-line p-3">
                <summary className="cursor-pointer font-semibold text-navy-900">Nómina ({reserva.multicancha_integrantes.length})</summary>
                <div className="pt-3"><Nomina reserva={reserva} /></div>
              </details>
              {!reserva.cancelada_en && (
                <div className="space-y-2 rounded-lg bg-slate-50 p-3">
                  <a href={`${RUTA_PROFESOR}/correo/${reserva.id}`} className={SECUNDARIO}>
                    <Download size={16} aria-hidden /> Descargar borrador de correo
                  </a>
                  <p className="text-slate-700">
                    Abre el archivo EML en tu correo para enviarlo manualmente.
                    {reglamento.nombre ? " Incluye el reglamento adjunto." : !reglamento.error ? " El reglamento oficial está pendiente." : ""}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {correoManual && <a className="font-medium text-blue-700 underline" href={correoManual}>Abrir cliente de correo</a>}
                    {reglamento.nombre && <a className="font-medium text-blue-700 underline" href={RUTA_REGLAMENTO}>Descargar reglamento</a>}
                  </div>
                  {reglamento.nombre && <p className="text-slate-700">Si abres tu cliente de correo, adjunta el reglamento antes de enviar.</p>}
                </div>
              )}
            </>
          )}
          {reserva.cancelada_en ? (
            <p className="text-slate-600">Cancelado el {formatoMomento.format(new Date(reserva.cancelada_en))}.</p>
          ) : (
            <>
              <details className="rounded-lg border border-line p-3">
                <summary className="cursor-pointer font-semibold text-navy-900">Editar {ordinaria ? "reserva" : "bloque"}</summary>
                <div className="pt-3"><FormularioBloque modulos={modulos} dia={reserva.fecha} reserva={reserva} /></div>
              </details>
              <details className="rounded-lg border border-line p-3">
                <summary className="cursor-pointer font-semibold text-red-700">Cancelar {ordinaria ? "reserva" : "bloque"}</summary>
                <div className="pt-3"><CancelarBloque reserva={reserva} /></div>
              </details>
            </>
          )}
        </div>
      </details>
    </div>
  );
}

function Historial({ eventos, fecha, pagina }: { eventos: Evento[]; fecha: string; pagina: number }) {
  return (
    <details className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5" open={pagina > 0 || undefined}>
      <summary className="cursor-pointer font-semibold text-navy-900">Historial de cambios</summary>
      {eventos.length === 0 ? <p className="mt-3 text-sm text-slate-600">Sin movimientos para este día.</p> : (
        <ol className="mt-3 divide-y divide-line">
          {eventos.slice(0, 15).map(({ id, accion, actor_nombre, momento, detalle }) => {
            const actual = detalle.despues ?? detalle;
            const anterior = detalle.antes;
            return (
              <li key={id} className="space-y-1 break-words py-2.5 text-sm text-slate-700">
                <p className="font-medium text-navy-900">
                  {ACCIONES[accion]} · {actual.responsable ?? actual.titulo} · {actor_nombre}
                </p>
                {anterior && detalle.despues && (
                  <p>{anterior.fecha} {horarioTexto(anterior)} → {detalle.despues.fecha} {horarioTexto(detalle.despues)}</p>
                )}
                <p>{formatoMomento.format(new Date(momento))}{detalle.cantidad !== undefined ? ` · ${detalle.cantidad} integrante(s)` : ""}</p>
              </li>
            );
          })}
        </ol>
      )}
      <div className="flex flex-wrap gap-2">
        {pagina > 0 && <Link href={`${ruta(fecha)}&movimientos=${pagina - 1}#historial-multicancha`} className={SECUNDARIO}>Cambios más recientes</Link>}
        {eventos.length > 15 && <Link href={`${ruta(fecha)}&movimientos=${pagina + 1}#historial-multicancha`} className={SECUNDARIO}>Cambios anteriores</Link>}
      </div>
    </details>
  );
}

type Parametros = Promise<Record<string, string | string[] | undefined>>;

async function Contenido({ searchParams }: { searchParams: Parametros }) {
  await requerirRol("profesor");
  const parametros = await searchParams;
  const ahora = new Date();
  const hoy = diaSantiago(ahora);
  const fecha = fechaAgenda(parametros.fecha, ahora);
  const pagina = typeof parametros.movimientos === "string" && /^\d{1,6}$/.test(parametros.movimientos) ? Number(parametros.movimientos) : 0;
  const supabase = await createClient();
  const [consultaModulos, agenda, historial, reglamento] = await Promise.all([
    supabase.from("multicancha_modulos").select("id, dias, hora_inicio, hora_fin").order("hora_inicio"),
    supabase.from("multicancha_reservas").select(CAMPOS_RESERVA).eq("fecha", fecha).order("hora_inicio").order("id"),
    supabase.from("multicancha_historial").select("id, fecha, accion, actor_nombre, momento, detalle")
      .or(`fecha.eq.${fecha},fecha_anterior.eq.${fecha}`).order("id", { ascending: false }).range(pagina * 15, pagina * 15 + 15),
    buscarReglamento(supabase),
  ]);

  if (consultaModulos.error || agenda.error || historial.error) {
    return <div className="space-y-4"><EncabezadoPagina titulo="Multicancha" />
      <p role="alert" className="text-sm text-red-700">No se pudo cargar el calendario. Vuelve a intentar.</p>
    </div>;
  }

  const modulos = consultaModulos.data as Modulo[];
  const reservas = agenda.data as Reserva[];
  const modulosDia = modulosDelDia(modulos, fecha);
  const activos = reservas.filter((reserva) => !reserva.cancelada_en);
  const cancelados = reservas.filter((reserva) => reserva.cancelada_en);
  const moduloInicial = modulosDia.find((modulo) => String(modulo.id) === parametros.modulo)?.id.toString();
  const horaActual = hora(ahora.toISOString());

  return (
    <div className="space-y-5">
      <EncabezadoPagina titulo="Multicancha" subtitulo="Reservas presenciales y actividades de la sede Bellavista · Hora de Santiago"
        accion={fecha >= hoy && <a href="#nuevo-bloque" className={SECUNDARIO}><Plus size={17} aria-hidden /> Nuevo bloque</a>} />
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className="grid min-w-0 items-start gap-4 md:grid-cols-2 xl:grid-cols-1">
          <Calendario key={fecha} fecha={fecha} hoy={hoy} />
          {fecha >= hoy && (
            <Tarjeta id="nuevo-bloque" className="min-w-0 scroll-mt-20 space-y-3 p-4 sm:p-5">
              <h2 className="font-semibold text-navy-900">Nuevo bloque</h2>
              <FormularioBloque key={`${fecha}-${moduloInicial}`} modulos={modulos} dia={fecha} moduloInicial={moduloInicial} />
            </Tarjeta>
          )}
        </div>
        <div className="min-w-0 space-y-4">
          <Tarjeta className="space-y-4 p-4 sm:p-5">
            <h2 className="text-lg font-semibold capitalize text-navy-900">{fechaTexto(fecha)}</h2>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-navy-900">Módulos ordinarios</h3>
              {modulosDia.length === 0 ? <p className="text-sm text-slate-600">Sin módulos ordinarios para este día.</p> : (
                <ul className="divide-y divide-line rounded-xl border border-line px-3">
                  {modulosDia.map((modulo) => {
                    const estado = estadoModulo(modulo, activos, fecha, hoy, horaActual);
                    return (
                      <li key={modulo.id} className="flex flex-wrap items-center justify-between gap-1 py-2 text-sm">
                        <span className="font-medium text-navy-900">{horarioTexto(modulo)}</span>
                        {estado === "disponible"
                          ? <Link href={`${ruta(fecha)}&modulo=${modulo.id}#nuevo-bloque`}
                              prefetch={false} aria-label={`Preparar reserva de ${horarioTexto(modulo)}`}><Estado estado={estado} /></Link>
                          : <Estado estado={estado} />}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-navy-900">Reservas y actividades</h3>
              {activos.length === 0 ? <p className="text-sm text-slate-600">Sin bloques registrados para este día.</p>
                : activos.map((reserva) => <DetalleBloque key={reserva.id} reserva={reserva} modulos={modulos} reglamento={reglamento} />)}
            </div>
            {cancelados.length > 0 && (
              <details>
                <summary className="cursor-pointer text-sm font-semibold text-navy-900">Bloques cancelados ({cancelados.length})</summary>
                <div className="mt-2 space-y-2">{cancelados.map((reserva) => (
                  <DetalleBloque key={reserva.id} reserva={reserva} modulos={modulos} reglamento={reglamento} />
                ))}</div>
              </details>
            )}
          </Tarjeta>
          <div id="historial-multicancha" className="scroll-mt-20">
            <Historial pagina={pagina} eventos={historial.data as Evento[]} fecha={fecha} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Pagina({ searchParams }: { searchParams: Parametros }) {
  return <Suspense fallback={<CargandoPanel />}><Contenido searchParams={searchParams} /></Suspense>;
}
