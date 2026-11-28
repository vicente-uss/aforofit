import { ChevronLeft, Download } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { MarcoAlumno } from "@/components/marca/marco-alumno";
import { Tarjeta } from "@/components/marca/tarjeta";
import { SECUNDARIO } from "@/components/multicancha/estilos";
import { Nomina } from "@/components/multicancha/formularios";
import { requerirRol } from "@/lib/auth/perfil";
import { CAMPOS_RESERVA, fechaTexto, horarioTexto, RUTA_ALUMNO, RUTA_REGLAMENTO, type Reserva } from "@/lib/multicancha/agenda";
import { buscarReglamento } from "@/lib/multicancha/reglamento";
import { createClient } from "@/lib/supabase/server";

type Parametros = Promise<Record<string, string | string[] | undefined>>;
const TAMANO_PAGINA = 10;

async function Contenido({ searchParams }: { searchParams: Parametros }) {
  const perfil = await requerirRol("alumno");
  const parametros = await searchParams;
  const historial = parametros.vista === "historial";
  const pagina = typeof parametros.pagina === "string" && /^\d{1,6}$/.test(parametros.pagina) ? Number(parametros.pagina) : 0;
  const ahora = new Date().toISOString();
  const supabase = await createClient();
  const base = supabase.from("multicancha_reservas").select(CAMPOS_RESERVA).eq("responsable_id", perfil.id);
  const filtro = historial
    ? base.or(`cancelada_en.not.is.null,fin.lte.${ahora}`)
    : base.is("cancelada_en", null).gt("fin", ahora);
  const [consulta, reglamento, configuracion] = await Promise.all([
    filtro.order("inicio", { ascending: !historial }).order("id")
      .range(pagina * TAMANO_PAGINA, pagina * TAMANO_PAGINA + TAMANO_PAGINA),
    buscarReglamento(supabase),
    supabase.from("multicancha_configuracion").select("max_participantes").single(),
  ]);
  const reservas = (consulta.data ?? []) as Reserva[];
  const ruta = (numero: number) => `${RUTA_ALUMNO}?vista=${historial ? "historial" : "proximas"}&pagina=${numero}`;

  return (
    <MarcoAlumno titulo="Mis reservas" subtitulo="Multicancha · Hora de Santiago">
      <Link href="/alumno" className="inline-flex items-center gap-1 text-sm font-medium text-blue-700">
        <ChevronLeft size={18} aria-hidden /> Volver a mi panel
      </Link>
      <Tarjeta className="space-y-2 p-4">
        <h1 className="text-xl font-semibold text-navy-900">Mis reservas</h1>
        <p className="text-sm text-slate-700">Solicita las reservas y los cambios de horario presencialmente con el profesor.</p>
        {reglamento.error
          ? <p className="text-sm text-slate-600">No se pudo consultar el reglamento.</p>
          : <a href={RUTA_REGLAMENTO} className={SECUNDARIO}>
            <Download size={16} aria-hidden /> Descargar reglamento {reglamento.nombre ? "oficial" : "provisional"}
          </a>}
      </Tarjeta>
      <nav className="flex gap-2" aria-label="Estado de las reservas">
        <Link href={RUTA_ALUMNO} className={SECUNDARIO} aria-current={!historial ? "page" : undefined}>Próximas</Link>
        <Link href={`${RUTA_ALUMNO}?vista=historial`} className={SECUNDARIO} aria-current={historial ? "page" : undefined}>Historial</Link>
      </nav>
      {consulta.error && <p role="alert" className="text-sm text-red-700">No se pudieron cargar tus reservas. Vuelve a intentar.</p>}
      {!consulta.error && reservas.length === 0 && (
        <p className="text-sm text-slate-600">{historial ? "Sin reservas en el historial." : "No tienes reservas próximas."}</p>
      )}
      {reservas.slice(0, TAMANO_PAGINA).map((reserva) => (
        <Tarjeta className="min-w-0 space-y-2 p-4" key={reserva.id} data-reserva={reserva.id}>
          <h2 className="font-semibold capitalize text-navy-900">{fechaTexto(reserva.fecha)}</h2>
          <p className="text-sm text-slate-700">
            {horarioTexto(reserva)} · {reserva.cancelada_en ? "Cancelada" : historial ? "Horario transcurrido" : "Confirmada"}
          </p>
          <details className="rounded-lg border border-line p-3">
            <summary className="cursor-pointer text-sm font-semibold text-navy-900">
              Nómina ({reserva.multicancha_integrantes.length})
            </summary>
            <div className="pt-3"><Nomina reserva={reserva} maximo={configuracion.data?.max_participantes ?? null} /></div>
          </details>
        </Tarjeta>
      ))}
      <div className="flex flex-wrap gap-2">
        {pagina > 0 && <Link href={ruta(pagina - 1)} className={SECUNDARIO}>Página anterior</Link>}
        {reservas.length > TAMANO_PAGINA && <Link href={ruta(pagina + 1)} className={SECUNDARIO}>Página siguiente</Link>}
      </div>
    </MarcoAlumno>
  );
}

export default function Pagina({ searchParams }: { searchParams: Parametros }) {
  return <Suspense fallback={<CargandoPanel />}><Contenido searchParams={searchParams} /></Suspense>;
}
