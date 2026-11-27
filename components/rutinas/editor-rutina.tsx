"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tarjeta } from "@/components/marca/tarjeta";
import type { EjercicioEditable, MaquinaRutina, RutinaDisponible } from "@/lib/rutina/personalizadas";

const CONTROL = "w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm";

function nuevoEjercicio(maquina: MaquinaRutina): EjercicioEditable {
  return { ejercicio: "", maquina_id: maquina.id, series: 3, repeticiones: 10, minutos: null, carga_kg: null, nota_ajuste: null };
}

export function EditorRutina({ rutina, maquinas, ocupado, guardar, cancelar }: {
  rutina: RutinaDisponible | null;
  maquinas: MaquinaRutina[];
  ocupado: boolean;
  guardar: (nombre: string, ejercicios: EjercicioEditable[]) => void;
  cancelar: () => void;
}) {
  const [nombre, setNombre] = useState(rutina?.nombre ?? "");
  const [filas, setFilas] = useState(() => {
    const previas = rutina?.rutina_ejercicios.toSorted((a, b) => a.orden - b.orden);
    if (previas?.length) return previas;
    return maquinas.length ? [{ ...nuevoEjercicio(maquinas[0]), id: crypto.randomUUID() }] : [];
  });

  function cambiar(id: string, cambio: Partial<EjercicioEditable>) {
    setFilas((previas) => previas.map((fila) => fila.id === id ? { ...fila, ...cambio } : fila));
  }

  function mover(indice: number, destino: number) {
    setFilas((previas) => {
      const siguientes = [...previas];
      [siguientes[indice], siguientes[destino]] = [siguientes[destino], siguientes[indice]];
      return siguientes;
    });
  }

  return (
    <Tarjeta className="p-4">
      <form className="space-y-4" onSubmit={(evento) => { evento.preventDefault(); guardar(nombre.trim(), filas); }}>
        <fieldset disabled={ocupado} className="min-w-0 space-y-4">
          <legend className="mb-3 text-lg font-semibold">{rutina ? "Editar rutina" : "Nueva rutina"}</legend>
          <label className="block space-y-1 text-sm font-medium">
            Nombre de la rutina
            <Input maxLength={100} required value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </label>
          {filas.map((fila, i) => (
            <fieldset key={fila.id} className="min-w-0 space-y-3 rounded-lg border p-3 text-sm">
              <legend className="px-1 font-semibold">Ejercicio {i + 1}</legend>
              <label className="block space-y-1">
                Nombre del ejercicio
                <Input required maxLength={100} value={fila.ejercicio} onChange={(e) => cambiar(fila.id, { ejercicio: e.target.value })} />
              </label>
              <label className="block space-y-1">
                Máquina
                <select className={CONTROL} value={fila.maquina_id} onChange={(e) => cambiar(fila.id, { maquina_id: Number(e.target.value) })}>
                  {maquinas.map((m) => <option key={m.id} value={m.id}>{m.nombre}{m.estado === "en_mantencion" ? " (en mantención)" : ""}</option>)}
                </select>
              </label>
              <label className="block space-y-1">
                Medir por
                <select className={CONTROL} value={fila.minutos === null ? "repeticiones" : "minutos"} onChange={(e) => cambiar(fila.id,
                  e.target.value === "minutos" ? { minutos: 5, repeticiones: null, carga_kg: null } : { minutos: null, repeticiones: 10 })}>
                  <option value="repeticiones">Repeticiones</option>
                  <option value="minutos">Minutos</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1">
                  Series
                  <Input type="number" required min={1} max={2147483647} value={fila.series || ""} onChange={(e) => cambiar(fila.id, { series: Number(e.target.value) })} />
                </label>
                {fila.minutos !== null ? (
                  <label className="space-y-1">
                    Minutos
                    <Input type="number" required min={1} max={2147483647} value={fila.minutos || ""} onChange={(e) => cambiar(fila.id, { minutos: Number(e.target.value) })} />
                  </label>
                ) : (
                  <label className="space-y-1">
                    Repeticiones
                    <Input type="number" required min={1} max={2147483647} value={fila.repeticiones || ""} onChange={(e) => cambiar(fila.id, { repeticiones: Number(e.target.value) })} />
                  </label>
                )}
              </div>
              {fila.minutos === null && (
                <label className="block space-y-1">
                  Carga (kg)
                  <Input type="number" min={0} max={9999.9} step={0.1} value={fila.carga_kg ?? ""} onChange={(e) => cambiar(fila.id, { carga_kg: e.target.value === "" ? null : Number(e.target.value) })} />
                </label>
              )}
              <label className="block space-y-1">
                Ajustes o notas
                <textarea className={CONTROL} maxLength={500} value={fila.nota_ajuste ?? ""} onChange={(e) => cambiar(fila.id, { nota_ajuste: e.target.value })} />
              </label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" type="button" disabled={i === 0}
                  aria-label={`Subir ejercicio ${i + 1}`} onClick={() => mover(i, i - 1)}>Subir</Button>
                <Button variant="outline" size="sm" type="button" disabled={i === filas.length - 1}
                  aria-label={`Bajar ejercicio ${i + 1}`} onClick={() => mover(i, i + 1)}>Bajar</Button>
                <Button variant="outline" size="sm" type="button" disabled={filas.length === 1}
                  aria-label={`Quitar ejercicio ${i + 1}`} onClick={() => setFilas((previas) => previas.filter((f) => f.id !== fila.id))}>Quitar</Button>
              </div>
            </fieldset>
          ))}
          <Button type="button" variant="outline" disabled={!maquinas.length || filas.length >= 50}
            onClick={() => {
              const nueva = { ...nuevoEjercicio(maquinas[0]), id: crypto.randomUUID() };
              setFilas((previas) => [...previas, nueva]);
            }}>
            Agregar ejercicio
          </Button>
        </fieldset>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={ocupado || !filas.length || !nombre.trim()}>Guardar rutina</Button>
          <Button type="button" variant="ghost" disabled={ocupado} onClick={cancelar}>Cancelar</Button>
        </div>
      </form>
    </Tarjeta>
  );
}
