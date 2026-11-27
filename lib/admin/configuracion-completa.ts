import { leerProgresion } from "../rutina/progresion";
import {
  aFormulario,
  validarConfiguracion,
  type Errores,
  type FormularioConfiguracion,
} from "./configuracion";

export const MODALIDADES = {
  sistema: "Generadas por el sistema",
  profesor: "Asignadas por profesores",
  alumno: "Personalizadas por alumnos",
} as const;

type Modalidad = keyof typeof MODALIDADES;
type Modalidades = Record<Modalidad, boolean>;

export const CAMPOS = {
  umbral: { etiqueta: "Umbral de aforo casi lleno (%)", min: 1, max: 100, decimales: 0, ayuda: "Al alcanzar este porcentaje se muestra «Casi lleno»." },
  expiracion: { etiqueta: "Expiración de turnos (minutos)", min: 1, max: 120, decimales: 0, ayuda: "El plazo se cuenta desde el llamado, incluso si el turno ya estaba llamado al guardar." },
  facil_kg: { etiqueta: "Incremento con «Fácil» (kg)", min: 0.1, max: 50, decimales: 1, ayuda: "Si el redondeo deja la carga igual o menor, se suma un paso." },
  justo_kg: { etiqueta: "Variación con «Justo» (kg)", min: -50, max: 50, decimales: 1, ayuda: "Cero conserva la carga. Puedes sumar o restar hasta el incremento de «Fácil»." },
  me_costo_porcentaje: { etiqueta: "Reducción con «Me costó» (%)", min: 0.1, max: 100, decimales: 1, ayuda: "Si el redondeo no baja la carga, se resta un paso." },
  redondeo_kg: { etiqueta: "Paso de redondeo (kg)", min: 0.1, max: 50, decimales: 1, ayuda: "Las cargas se redondean al múltiplo más cercano." },
} as const;

export type Campo = keyof typeof CAMPOS;
export type ErroresCompletos = Errores & Partial<Record<Campo, string>>;
export type FormularioCompleto = FormularioConfiguracion & Record<Campo, string> & { modalidades: Modalidades };

export function aFormularioCompleto(fila: Record<string, unknown> | null): FormularioCompleto | null {
  const base = aFormulario(fila);
  if (!base || !fila || typeof fila.umbral_casi_lleno !== "number" || typeof fila.turno_expira_minutos !== "number") return null;
  const progresion = leerProgresion(fila.progresion);
  if (!progresion) return null;
  const modalidades = fila.modalidades_rutina as Partial<Record<Modalidad, unknown>> | null;
  return {
    ...base,
    umbral: String(Number((fila.umbral_casi_lleno * 100).toFixed(10))),
    expiracion: String(fila.turno_expira_minutos),
    facil_kg: String(progresion.facil_kg),
    justo_kg: String(progresion.justo_kg),
    me_costo_porcentaje: String(-progresion.me_costo_porcentaje),
    redondeo_kg: String(progresion.redondeo_kg),
    modalidades: {
      sistema: modalidades?.sistema === true,
      profesor: modalidades?.profesor === true,
      alumno: modalidades?.alumno === true,
    },
  };
}

const CLAVES = Object.keys(CAMPOS) as Campo[];

export function validarConfiguracionCompleta(form: FormularioCompleto) {
  const base = validarConfiguracion(form);
  const errores: ErroresCompletos = base.ok ? {} : { ...base.errores };
  const valores = {} as Record<Campo, number>;

  for (const campo of CLAVES) {
    const { min, max, decimales } = CAMPOS[campo];
    const formato = decimales === 0 ? /^\d+$/ : /^-?\d+(?:[.,]\d)?$/;
    const texto = form[campo].trim();
    const valor = Number(texto.replace(",", "."));
    if (!formato.test(texto) || valor < min || valor > max) {
      errores[campo] = `Ingresa un valor entre ${min.toLocaleString("es-CL")} y ${max.toLocaleString("es-CL")}${decimales ? " con hasta un decimal" : ", sin decimales"}.`;
    } else {
      valores[campo] = valor;
    }
  }

  if (Math.abs(valores.justo_kg) > valores.facil_kg) {
    errores.justo_kg = "La variación absoluta debe ser menor o igual al incremento de «Fácil».";
  }
  if (!base.ok || Object.keys(errores).length > 0) return { ok: false, errores } as const;

  return {
    ok: true,
    parametros: {
      capacidad: base.capacidad,
      cierre_automatico_horas: base.cierre_automatico_horas,
      horario: base.horario,
      umbral_casi_lleno: valores.umbral / 100,
      turno_expira_minutos: valores.expiracion,
      modalidades_rutina: form.modalidades,
      progresion: {
        facil_kg: valores.facil_kg,
        justo_kg: valores.justo_kg,
        me_costo_porcentaje: -valores.me_costo_porcentaje,
        redondeo_kg: valores.redondeo_kg,
      },
    },
  } as const;
}
