"use client";

import { DoorOpen, Package, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Aviso } from "@/components/marca/aviso";
import { Avatar } from "@/components/marca/avatar";
import { EstadoVacio } from "@/components/marca/estado-vacio";
import { Insignia } from "@/components/marca/insignia";
import { EncabezadoPagina, EncabezadoTarjeta, Tarjeta } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  diaSantiago,
  duracionMinutos,
  esDiaValido,
  fechaLarga,
  hora,
  normalizarPrestamos,
  normalizarVisitas,
  rangoDia,
  resumenDia,
  textoDuracion,
  tipoCierre,
  type PrestamoHistorial,
  type VisitaHistorial,
} from "@/lib/historial/historial";
import { ETIQUETA_CIERRE, plural, TEXTOS, TONO_CIERRE } from "@/lib/historial/mensajes";
import { createClient } from "@/lib/supabase/client";

type Datos = { visitas: VisitaHistorial[]; prestamos: PrestamoHistorial[]; ahora: Date };

function Indicador({ etiqueta, valor, detalle }: { etiqueta: string; valor: string; detalle?: string }) {
  return (
    <Tarjeta className="p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-tinta-suave">{etiqueta}</p>
      <p className="tnum mt-1 text-2xl font-bold text-navy-900">{valor}</p>
      {detalle && <p className="mt-0.5 text-xs text-tinta-suave">{detalle}</p>}
    </Tarjeta>
  );
}

/**
 * Historial del día (F-33): visitas con su tipo de cierre y préstamos entregados ese día.
 * Solo lectura: el profesor ya puede leer visitas (007) y préstamos con sus implementos (015).
 */
export function HistorialProfesor() {
  const supabaseRef = useRef(createClient());
  const [dia, setDia] = useState(() => diaSantiago(new Date()));
  const [datos, setDatos] = useState<Datos | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const peticion = useRef(0);

  const leer = useCallback(async (diaElegido: string) => {
    if (!esDiaValido(diaElegido)) return;
    const turno = ++peticion.current; // una fecha nueva descarta la respuesta de la anterior
    setCargando(true);
    const { desde, hasta } = rangoDia(diaElegido);
    const supabase = supabaseRef.current;
    const [visitas, prestamos] = await Promise.all([
      supabase
        .from("visitas")
        .select("id, entrada, salida, cierre_automatico, cerrada_por, alumnos(nombre)")
        .gte("entrada", desde)
        .lt("entrada", hasta)
        .order("entrada"),
      supabase
        .from("prestamos")
        .select("id, entregado_en, devuelto_en, alumnos(nombre), prestamo_items(cantidad, implementos(nombre))")
        .gte("entregado_en", desde)
        .lt("entregado_en", hasta)
        .order("entregado_en"),
    ]);
    if (turno !== peticion.current) return;
    setCargando(false);
    if (visitas.error || prestamos.error) {
      setError(true);
      return;
    }
    setError(false);
    setDatos({
      visitas: normalizarVisitas(visitas.data),
      prestamos: normalizarPrestamos(prestamos.data),
      ahora: new Date(),
    });
  }, []);

  useEffect(() => {
    void leer(dia);
  }, [dia, leer]);

  const resumen = datos ? resumenDia(datos.visitas, datos.ahora) : null;
  // Mediodía UTC cae dentro del mismo día en Santiago (UTC−3 o −4). Primera letra en mayúscula.
  const fechaLargaDia = esDiaValido(dia) ? fechaLarga(`${dia}T16:00:00Z`) : "";
  const fechaTexto = fechaLargaDia.charAt(0).toUpperCase() + fechaLargaDia.slice(1);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <EncabezadoPagina
        eyebrow="Profesor encargado"
        titulo={TEXTOS.profesorTitulo}
        subtitulo={TEXTOS.profesorDetalle}
        accion={
          <div className="flex items-end gap-2">
            <div className="space-y-1">
              <Label htmlFor="dia" className="text-[13px] font-semibold text-navy-900">
                {TEXTOS.fecha}
              </Label>
              <Input
                id="dia"
                type="date"
                value={dia}
                onChange={(e) => e.target.value && setDia(e.target.value)}
                className="tnum w-44"
              />
            </div>
            <Button variant="secondary" onClick={() => void leer(dia)} disabled={cargando} aria-label={TEXTOS.actualizar}>
              <RefreshCw aria-hidden />
              <span className="hidden sm:inline">{TEXTOS.actualizar}</span>
            </Button>
          </div>
        }
      />

      {fechaTexto && <p className="-mt-3 text-sm font-medium text-slate-700">{fechaTexto}</p>}

      {error && (
        <Aviso tono="red" role="alert">
          {TEXTOS.sinConexion}
        </Aviso>
      )}

      {resumen && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Indicador
            etiqueta="Visitas"
            valor={String(resumen.total)}
            detalle={resumen.abiertas > 0 ? `${resumen.abiertas} en el gimnasio` : undefined}
          />
          <Indicador
            etiqueta="Duración promedio"
            valor={resumen.promedioMinutos === null ? "—" : textoDuracion(resumen.promedioMinutos)}
            detalle="Solo salidas con hora real"
          />
          <Indicador etiqueta="Cierres automáticos" valor={String(resumen.automaticos)} detalle="A las 3 h (regla 6)" />
          <Indicador etiqueta="Cierres manuales" valor={String(resumen.manuales)} detalle="Por el profesor (D21)" />
        </div>
      )}

      <Tarjeta>
        <EncabezadoTarjeta
          titulo={TEXTOS.visitasTitulo}
          subtitulo={datos ? plural(datos.visitas.length, "visita", "visitas") : TEXTOS.cargando}
        />
        <div className="px-5 pb-3 pt-2">
          {datos && datos.visitas.length === 0 ? (
            <EstadoVacio icono={DoorOpen} titulo={TEXTOS.visitasVacio}>
              {TEXTOS.visitasVacioDetalle}
            </EstadoVacio>
          ) : (
            <ul className="divide-y divide-line">
              {(datos?.visitas ?? []).map((v) => {
                const tipo = tipoCierre(v);
                return (
                  // Grilla con columnas fijas en escritorio para que horas y duraciones queden alineadas.
                  <li
                    key={v.id}
                    className="grid grid-cols-2 items-center gap-x-4 gap-y-1.5 py-3 sm:grid-cols-[minmax(0,1fr)_8.5rem_6rem_12.5rem]"
                  >
                    <span className="col-span-2 flex min-w-0 items-center gap-3 sm:col-span-1">
                      <Avatar nombre={v.nombre ?? "Alumno"} className="h-9 w-9 text-xs" />
                      <span className="truncate font-semibold text-navy-900">{v.nombre ?? "Alumno"}</span>
                    </span>
                    <span className="tnum text-sm text-slate-700">
                      {hora(v.entrada)} – {v.salida ? hora(v.salida) : "…"}
                    </span>
                    <span className="tnum text-right text-sm text-slate-600 sm:text-left">
                      {textoDuracion(duracionMinutos(v, datos!.ahora))}
                    </span>
                    <span className="col-span-2 sm:col-span-1 sm:justify-self-end">
                      <Insignia tono={TONO_CIERRE[tipo]} punto tamano="sm">
                        {ETIQUETA_CIERRE[tipo]}
                      </Insignia>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Tarjeta>

      <Tarjeta>
        <EncabezadoTarjeta
          titulo={TEXTOS.prestamosTitulo}
          subtitulo={
            datos
              ? `${plural(datos.prestamos.length, "préstamo", "préstamos")} · ${plural(
                  datos.prestamos.filter((p) => p.devuelto_en === null).length,
                  "abierto",
                  "abiertos",
                )}`
              : TEXTOS.cargando
          }
        />
        <div className="px-5 pb-3 pt-2">
          {datos && datos.prestamos.length === 0 ? (
            <EstadoVacio icono={Package} titulo={TEXTOS.prestamosVacio}>
              {TEXTOS.prestamosVacioDetalle}
            </EstadoVacio>
          ) : (
            <ul className="divide-y divide-line">
              {(datos?.prestamos ?? []).map((p) => (
                <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-3">
                  <span className="min-w-0 flex-1 basis-56">
                    <span className="block truncate font-semibold text-navy-900">{p.alumno}</span>
                    <span className="block text-sm text-slate-600">{p.implementos}</span>
                  </span>
                  <span className="tnum text-sm text-slate-700">
                    Entrega {hora(p.entregado_en)}
                    {p.devuelto_en && ` · Devolución ${hora(p.devuelto_en)}`}
                  </span>
                  {p.devuelto_en ? (
                    <Insignia tono="green" punto tamano="sm">
                      Cerrado
                    </Insignia>
                  ) : (
                    <Insignia tono="blue" punto tamano="sm">
                      Abierto
                    </Insignia>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Tarjeta>
    </div>
  );
}
