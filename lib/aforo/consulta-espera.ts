import { diaSantiago } from "../historial/historial";

// Una respuesta anterior o de un día distinto no puede reemplazar el estado actual.
export function consultaEsperaVigente(peticion: number, ultima: number, dia: string, ahora: Date): boolean {
  return peticion === ultima && dia === diaSantiago(ahora);
}
