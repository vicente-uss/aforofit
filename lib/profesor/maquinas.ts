// Estado de máquinas para /profesor/maquinas (F-03, B5). Funciones puras, probadas en maquinas.test.ts.

// Valores exactos del check de supabase/sql/002_maquinas.sql.
export type EstadoMaquina = "disponible" | "en_mantencion";

export type Maquina = {
  id: number;
  nombre: string;
  cantidad: number;
  estado: EstadoMaquina;
  foto_url: string | null;
};

export const ETIQUETA_ESTADO: Record<EstadoMaquina, string> = {
  disponible: "Disponible",
  en_mantencion: "En mantención",
};

// Colores del estado, iguales a los de /aforo (verde disponible, amarillo aviso).
export const COLOR_ESTADO: Record<EstadoMaquina, string> = {
  disponible: "bg-green-600 text-white",
  en_mantencion: "bg-yellow-400 text-black",
};

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

export function esEstadoMaquina(valor: unknown): valor is EstadoMaquina {
  return valor === "disponible" || valor === "en_mantencion";
}

// Descarta filas que no cumplen el contrato y ordena por nombre (es-CL).
export function normalizarMaquinas(data: unknown): Maquina[] {
  if (!Array.isArray(data)) return [];
  const maquinas: Maquina[] = [];
  for (const f of data) {
    if (
      esObjeto(f) &&
      Number.isInteger(f.id) &&
      typeof f.nombre === "string" &&
      Number.isInteger(f.cantidad) &&
      esEstadoMaquina(f.estado) &&
      (f.foto_url === null || typeof f.foto_url === "string")
    ) {
      maquinas.push({
        id: f.id as number,
        nombre: f.nombre,
        cantidad: f.cantidad as number,
        estado: f.estado,
        foto_url: f.foto_url as string | null,
      });
    }
  }
  return maquinas.sort((a, b) => a.nombre.localeCompare(b.nombre, "es-CL"));
}

export function estadoOpuesto(estado: EstadoMaquina): EstadoMaquina {
  return estado === "disponible" ? "en_mantencion" : "disponible";
}

// Texto del botón que alterna el estado.
export function textoBotonCambio(estado: EstadoMaquina): string {
  return estado === "disponible" ? "Marcar en mantención" : "Marcar disponible";
}

// «¿Marcar «Máquina Smith» como En mantención? …»
export function textoConfirmarCambio(maquina: Pick<Maquina, "nombre" | "estado">): string {
  const nuevo = estadoOpuesto(maquina.estado);
  const efecto =
    nuevo === "en_mantencion"
      ? "Los alumnos verán una advertencia en los ejercicios que la usan."
      : "La advertencia desaparecerá de las rutinas.";
  return `¿Marcar «${maquina.nombre}» como ${ETIQUETA_ESTADO[nuevo]}? ${efecto}`;
}

// «Todas disponibles» o «2 en mantención».
export function resumenMantencion(maquinas: Maquina[]): string {
  const n = maquinas.filter((m) => m.estado === "en_mantencion").length;
  if (n === 0) return "Todas disponibles";
  return n === 1 ? "1 en mantención" : `${n} en mantención`;
}
