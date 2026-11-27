"use client";

import { useState } from "react";
import { Tarjeta } from "@/components/marca/tarjeta";
import {
  METRICAS, diferenciaVisible, fechaVisible, serieCronologica, valorVisible, type Metrica, type Medicion,
} from "@/lib/medidas/mediciones";

const selector = "min-h-10 w-full rounded-xl border border-line bg-white px-2 text-sm text-navy-900";

export function EvolucionMedidas({ mediciones }: { mediciones: Medicion[] }) {
  const [metrica, setMetrica] = useState<Metrica>("peso_kg");
  const { etiqueta, unidad } = METRICAS.find(({ clave }) => clave === metrica)!;
  const serie = serieCronologica(mediciones, metrica);
  const primera = serie[0];
  const ultima = serie.at(-1);

  return (
    <Tarjeta className="space-y-3 p-4">
      <h2 className="font-semibold text-navy-900">Evolución</h2>
      <label className="block space-y-1 text-sm font-medium text-navy-900">
        <span>Medida del gráfico</span>
        <select className={selector} value={metrica} onChange={(evento) => setMetrica(evento.target.value as Metrica)}>
          {METRICAS.map(({ clave, etiqueta, unidad }) => <option key={clave} value={clave}>{etiqueta} ({unidad})</option>)}
        </select>
      </label>
      {primera && ultima ? (
        <figure className="space-y-2">
          <Grafico serie={serie} etiqueta={etiqueta} />
          <figcaption className="flex flex-wrap justify-between gap-x-3 text-xs text-slate-600">
            <span>{fechaVisible(primera.fecha)} · {valorVisible(primera.valor, unidad)}</span>
            {serie.length > 1 && <span>{fechaVisible(ultima.fecha)} · {valorVisible(ultima.valor, unidad)}</span>}
          </figcaption>
        </figure>
      ) : <p className="text-sm text-slate-600">Todavía no hay registros de esta medida.</p>}
    </Tarjeta>
  );
}

function Grafico({ serie, etiqueta }: { serie: ReturnType<typeof serieCronologica>; etiqueta: string }) {
  let minimo = serie[0].valor;
  let maximo = minimo;
  for (const { valor } of serie) {
    minimo = Math.min(minimo, valor);
    maximo = Math.max(maximo, valor);
  }
  const inicio = Date.parse(serie[0].fecha);
  const plazo = Date.parse(serie[serie.length - 1].fecha) - inicio;
  const puntos = serie.map(({ id, fecha, valor }, indice) => ({
    id,
    x: serie.length === 1 ? 150 : 12 + 276 * (plazo ? (Date.parse(fecha) - inicio) / plazo : indice / (serie.length - 1)),
    y: maximo === minimo ? 55 : 98 - 86 * (valor - minimo) / (maximo - minimo),
  }));

  const cantidad = serie.length === 1 ? "1 medición" : `${serie.length} mediciones`;

  return (
    <svg viewBox="0 0 300 110" role="img" aria-label={`Evolución de ${etiqueta}, ${cantidad}`} className="w-full rounded-xl bg-slate-50">
      <path d="M12 12H288 M12 55H288 M12 98H288" className="stroke-slate-200" fill="none" />
      <polyline points={puntos.map(({ x, y }) => `${x},${y}`).join(" ")} className="stroke-blue-600" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      {puntos.map(({ id, x, y }) => <circle key={id} cx={x} cy={y} r="3.5" className="fill-blue-600" />)}
    </svg>
  );
}

export function CompararMedidas({ mediciones }: { mediciones: Medicion[] }) {
  const [desdeId, setDesde] = useState("");
  const [hastaId, setHasta] = useState("");
  if (mediciones.length < 2) return null;

  const desde = mediciones.find((m) => m.id === desdeId) ?? mediciones[1];
  const hasta = mediciones.find((m) => m.id === hastaId) ?? mediciones[0];
  const opciones = mediciones.map((m, indice) => (
    <option key={m.id} value={m.id}>N.º {mediciones.length - indice} · {fechaVisible(m.fecha)}</option>
  ));

  return (
    <Tarjeta className="space-y-3 p-4">
      <h2 className="font-semibold text-navy-900">Comparar mediciones</h2>
      <div className="grid gap-2 min-[400px]:grid-cols-2">
        <label className="min-w-0 space-y-1 text-sm font-medium text-navy-900">
          <span>Desde</span>
          <select className={selector} value={desde.id} onChange={(evento) => setDesde(evento.target.value)}>{opciones}</select>
        </label>
        <label className="min-w-0 space-y-1 text-sm font-medium text-navy-900">
          <span>Hasta</span>
          <select className={selector} value={hasta.id} onChange={(evento) => setHasta(evento.target.value)}>{opciones}</select>
        </label>
      </div>
      <dl aria-label="Diferencias de las mediciones" className="grid grid-cols-2 gap-2 text-sm">
        {METRICAS.map(({ clave, etiqueta, unidad }) => (
          <div key={clave} className="rounded-lg bg-slate-50 px-2.5 py-2">
            <dt className="text-slate-600">{etiqueta}</dt>
            <dd className="font-semibold text-navy-900">{diferenciaVisible(desde[clave], hasta[clave], unidad)}</dd>
          </div>
        ))}
      </dl>
    </Tarjeta>
  );
}
