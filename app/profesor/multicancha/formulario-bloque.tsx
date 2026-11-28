"use client";

import { useState } from "react";
import { BOTON, CAMPO } from "@/components/multicancha/estilos";
import { Campo, Formulario, VersionReserva } from "@/components/multicancha/formularios";
import { cancelarReserva, guardarReserva } from "@/lib/multicancha/acciones";
import {
  FIN_CALENDARIO, INICIO_CALENDARIO, horarioTexto, modulosDelDia, type Modulo, type Reserva, type Tipo,
} from "@/lib/multicancha/agenda";

type PropsBloque = {
  modulos: Modulo[];
  dia: string;
  moduloInicial?: string;
  reserva?: Reserva;
};

export function FormularioBloque(props: PropsBloque) {
  return (
    <Formulario accion={guardarReserva}>
      {(pendiente) => <CamposBloque key={props.reserva?.version} {...props} pendiente={pendiente} />}
    </Formulario>
  );
}

function CamposBloque({ modulos, dia, moduloInicial, reserva, pendiente }: PropsBloque & { pendiente: boolean }) {
  const [fecha, setFecha] = useState(dia);
  const [tipo, setTipo] = useState<Tipo>(reserva?.tipo ?? "ordinaria");
  const [hastaMedianoche, setHastaMedianoche] = useState(reserva?.hora_fin.startsWith("24:00") ?? false);
  const disponibles = modulosDelDia(modulos, fecha);
  const mantieneHorario = reserva && fecha === reserva.fecha;

  return (
    <fieldset disabled={pendiente} className="min-w-0 space-y-3">
          <VersionReserva reserva={reserva} />
          {reserva ? <input type="hidden" name="tipo" value={tipo} /> : (
            <Campo etiqueta="Tipo de bloque">
              <select name="tipo" className={CAMPO} value={tipo} onChange={(evento) => setTipo(evento.target.value as Tipo)}>
                <option value="ordinaria">Reserva ordinaria</option>
                <option value="institucional">Actividad institucional</option>
                <option value="bloqueo">Bloqueo</option>
              </select>
            </Campo>
          )}
          <Campo etiqueta="Fecha">
            <input name="fecha" className={CAMPO} type="date" required min={INICIO_CALENDARIO} max={FIN_CALENDARIO}
              value={fecha} onChange={(evento) => setFecha(evento.target.value)} />
          </Campo>
          {tipo === "ordinaria" ? (
            <>
              <Campo etiqueta="Módulo">
                <select key={fecha} name="modulo" className={CAMPO} required={!mantieneHorario}
                  defaultValue={fecha === dia ? moduloInicial ?? "" : ""}>
                  <option value="">{mantieneHorario
                    ? `Mantener ${horarioTexto(reserva)}`
                    : disponibles.length ? "Selecciona un módulo" : "Sin módulos para ese día"}</option>
                  {disponibles.map((modulo) => (
                    <option key={modulo.id} value={modulo.id}>{horarioTexto(modulo)}</option>
                  ))}
                </select>
              </Campo>
              <Campo etiqueta="Nombre del responsable">
                <input name="responsable" className={CAMPO} required maxLength={160} defaultValue={reserva?.responsable ?? ""} />
              </Campo>
              <Campo etiqueta="Carrera del responsable">
                <input name="carrera" className={CAMPO} required maxLength={160} defaultValue={reserva?.carrera ?? ""} />
              </Campo>
              <Campo etiqueta="Correo electrónico">
                <input name="correo" className={CAMPO} type="email" required maxLength={254} defaultValue={reserva?.correo ?? ""} />
              </Campo>
            </>
          ) : (
            <>
              <Campo etiqueta={tipo === "institucional" ? "Nombre de la actividad" : "Motivo del bloqueo"}>
                <input name="titulo" className={CAMPO} required maxLength={160} defaultValue={reserva?.titulo ?? ""} />
              </Campo>
              <div className="grid grid-cols-2 gap-2">
                <Campo etiqueta="Hora de inicio">
                  <input name="inicio" className={CAMPO} type="time" required defaultValue={reserva?.hora_inicio.slice(0, 5)} />
                </Campo>
                <Campo etiqueta="Hora de término">
                  {hastaMedianoche ? (
                    <>
                      <input className={CAMPO} value="24:00" readOnly />
                      <input name="fin" type="hidden" value="24:00" />
                    </>
                  ) : <input name="fin" className={CAMPO} type="time" required
                    defaultValue={reserva?.hora_fin.startsWith("24:00") ? "" : reserva?.hora_fin.slice(0, 5)} />}
                </Campo>
              </div>
              <label className="flex items-center gap-2 text-sm text-navy-900">
                <input type="checkbox" checked={hastaMedianoche} onChange={(evento) => setHastaMedianoche(evento.target.checked)} />
                Termina a medianoche
              </label>
            </>
          )}
          <button type="submit" className={BOTON}>
            {pendiente ? "Guardando…" : reserva ? "Guardar cambios" : tipo === "ordinaria" ? "Crear reserva" : "Crear bloque"}
          </button>
    </fieldset>
  );
}

export function CancelarBloque({ reserva }: { reserva: Reserva }) {
  return (
    <Formulario accion={cancelarReserva}>
      {(pendiente) => (
        <>
          <VersionReserva reserva={reserva} />
          <p className="text-sm text-slate-600">El horario se libera y el bloque queda registrado en el historial.</p>
          <button type="submit" disabled={pendiente}
            className="min-h-10 rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50">
            {pendiente ? "Cancelando…" : "Confirmar cancelación"}
          </button>
        </>
      )}
    </Formulario>
  );
}
