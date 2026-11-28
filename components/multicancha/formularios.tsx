"use client";

import { Plus, X } from "lucide-react";
import { startTransition, useActionState, useRef, useState, type FormEvent, type ReactNode } from "react";
import { guardarNomina } from "@/lib/multicancha/acciones";
import type { Reserva } from "@/lib/multicancha/agenda";
import { BOTON, CAMPO, SECUNDARIO } from "./estilos";

type Resultado = { error?: string; exito?: string };
type Accion = (estado: Resultado, datos: FormData) => Promise<Resultado>;

export function Campo({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return <label className="grid min-w-0 gap-1 text-sm font-medium text-navy-900">{etiqueta}{children}</label>;
}

export function VersionReserva({ reserva }: { reserva?: Pick<Reserva, "id" | "version"> }) {
  return reserva ? (
    <>
      <input type="hidden" name="id" value={reserva.id} />
      <input type="hidden" name="version" value={reserva.version} />
    </>
  ) : null;
}

export function Formulario({ accion, children }: {
  accion: Accion;
  children: (pendiente: boolean) => ReactNode;
}) {
  const [estado, ejecutar, pendiente] = useActionState(accion, {});
  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    startTransition(() => ejecutar(datos));
  }

  return (
    <form method="post" onSubmit={enviar} className="space-y-3">
      {children(pendiente)}
      {estado.error && <p role="alert" className="text-sm font-medium text-red-700">{estado.error}</p>}
      {estado.exito && <p role="status" className="text-sm font-medium text-emerald-800">{estado.exito}</p>}
    </form>
  );
}

export function Nomina({ reserva, maximo }: { reserva: Reserva; maximo: number | null }) {
  const { multicancha_integrantes: integrantes, cancelada_en: cancelada } = reserva;
  if (cancelada) {
    return integrantes.length === 0 ? <p className="text-sm text-slate-600">Sin integrantes registrados.</p> : (
      <ul className="space-y-2 text-sm">
        {integrantes.map((integrante) => (
          <li key={integrante.rut} className="break-words">
            <p className="font-medium text-navy-900">{integrante.nombre}</p>
            <p className="text-slate-600">{integrante.rut} · {integrante.carrera}</p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Formulario accion={guardarNomina}>
      {(pendiente) => <CamposNomina key={reserva.version} reserva={reserva} maximo={maximo} pendiente={pendiente} />}
    </Formulario>
  );
}

function CamposNomina({ reserva, maximo, pendiente }: { reserva: Reserva; maximo: number | null; pendiente: boolean }) {
  const integrantes = reserva.multicancha_integrantes;
  const contador = useRef(integrantes.length);
  const [filas, setFilas] = useState(() => integrantes.map((integrante, id) => ({ ...integrante, id })));
  return (
    <fieldset disabled={pendiente} className="min-w-0 space-y-3">
          <VersionReserva reserva={reserva} />
          {maximo !== null && <p className="text-sm text-slate-600">Máximo {maximo} participantes, incluido el responsable.</p>}
          {filas.length === 0 && <p className="text-sm text-slate-600">Sin integrantes registrados.</p>}
          {filas.map((fila, indice) => (
            <fieldset key={fila.id} className="min-w-0 space-y-2 rounded-xl border border-line p-3">
              <legend className="px-1 text-sm font-semibold text-navy-900">Integrante {indice + 1}</legend>
              <Campo etiqueta="Nombre">
                <input name="nombre" required maxLength={160} defaultValue={fila.nombre} className={CAMPO} />
              </Campo>
              <Campo etiqueta="RUT">
                <input name="rut" required maxLength={12} defaultValue={fila.rut} placeholder="12345678-5" className={CAMPO} />
              </Campo>
              <Campo etiqueta="Carrera">
                <input name="carrera" required maxLength={160} defaultValue={fila.carrera} className={CAMPO} />
              </Campo>
              <button type="button" className={SECUNDARIO} aria-label={`Quitar integrante ${indice + 1}`}
                onClick={() => setFilas(filas.filter(({ id }) => id !== fila.id))}>
                <X size={16} aria-hidden /> Quitar
              </button>
            </fieldset>
          ))}
          <div className="flex flex-wrap gap-2">
            <button type="button" className={SECUNDARIO} disabled={maximo !== null && filas.length + 1 >= maximo} onClick={() => {
              const id = contador.current++;
              setFilas([...filas, { id, nombre: "", rut: "", carrera: "" }]);
            }}>
              <Plus size={16} aria-hidden /> Agregar integrante
            </button>
            <button className={BOTON} type="submit">{pendiente ? "Guardando…" : "Guardar nómina"}</button>
          </div>
    </fieldset>
  );
}
