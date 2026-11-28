"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Tarjeta } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizarRut } from "@/lib/ingreso/rut";
import { BUCKET_CERTIFICADOS, TIPOS_CERTIFICADO, errorCertificado } from "@/lib/inscripciones/certificados";
import { textoVigencia, type VigenciaCertificado } from "@/lib/inscripciones/vigencia";
import { createClient } from "@/lib/supabase/client";

const TIPOS = {
  estudiante: "Estudiante",
  funcionario_colaborador: "Funcionario o colaborador",
  deportista_destacado: "Deportista destacado",
};

type TipoPersona = keyof typeof TIPOS;
type Documento = "medico" | "alumno_regular";
type Persona = { id: string; nombre: string; rut: string | null };
type Ficha = Persona & VigenciaCertificado & {
  tipo_persona: TipoPersona;
  carrera: string | null;
  correo?: string;
  nacimiento?: string;
  telefono?: string;
  contacto_emergencia?: string;
  telefono_emergencia?: string;
  antecedentes?: string;
  medico?: string | null;
  alumno_regular?: string | null;
  version?: string;
};

const CAMPOS = [
  { nombre: "nombre", etiqueta: "Nombre completo", max: 160 },
  { nombre: "rut", etiqueta: "RUT sin puntos y con guion", max: 10 },
  { nombre: "correo", etiqueta: "Correo institucional", tipo: "email", placeholder: "nombre@correo.uss.cl" },
  { nombre: "nacimiento", etiqueta: "Fecha de nacimiento", tipo: "date" },
  { nombre: "telefono", etiqueta: "Teléfono", tipo: "tel", placeholder: "+56912345678" },
  { nombre: "contacto_emergencia", etiqueta: "Contacto de emergencia", max: 160 },
  { nombre: "telefono_emergencia", etiqueta: "Teléfono de emergencia", tipo: "tel", placeholder: "+56912345678" },
] as const satisfies ReadonlyArray<{
  nombre: keyof Ficha; etiqueta: string; max?: number; tipo?: string; placeholder?: string;
}>;

const ERRORES: Record<string, string> = {
  rut_duplicado: "Ya hay una persona inscrita con ese RUT.",
  rut_invalido: "Ingresa un RUT válido, sin puntos y con guion.",
  correo_invalido: "Usa un correo @uss.cl o @correo.uss.cl.",
  nacimiento_invalido: "La fecha de nacimiento debe ser anterior a hoy.",
  emision_invalida: "Ingresa una fecha de emisión válida, hasta hoy.",
  telefono_invalido: "Usa el formato +569 seguido de ocho dígitos en ambos teléfonos.",
  ficha_desactualizada: "Otra sesión modificó esta ficha. Búscala nuevamente antes de guardar.",
  archivo_invalido: "No se pudo asociar el archivo. Selecciónalo nuevamente.",
};

async function retirarCertificados(supabase: ReturnType<typeof createClient>) {
  try {
    const { data: rutas, error } = await supabase.rpc("certificados_pendientes_de_retiro");
    if (error) return false;
    if (!rutas?.length) return true;
    const { error: errorRetiro } = await supabase.storage.from(BUCKET_CERTIFICADOS).remove(rutas);
    return !errorRetiro;
  } catch {
    return false;
  }
}

export function Inscripciones({ profesorId }: { profesorId: string }) {
  const [supabase] = useState(createClient);
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [tipo, setTipo] = useState<TipoPersona>("estudiante");
  const [rutBusqueda, setRutBusqueda] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState("");
  const [error, setError] = useState("");
  const [claveFormulario, setClaveFormulario] = useState(0);
  const [archivoMedicoSeleccionado, setArchivoMedicoSeleccionado] = useState(false);
  const bucket = supabase.storage.from(BUCKET_CERTIFICADOS);

  useEffect(() => {
    void retirarCertificados(supabase);
  }, [supabase]);

  function abrir(datos: Ficha | null) {
    setFicha(datos);
    setTipo(datos?.tipo_persona ?? "estudiante");
    setArchivoMedicoSeleccionado(false);
    setClaveFormulario((clave) => clave + 1);
  }

  async function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError("");
    setAviso("");
    setOcupado(true);
    try {
      const texto = rutBusqueda.trim().toUpperCase();
      const rut = normalizarRut(texto.replaceAll(".", ""));
      const variantes = [texto];
      if (rut) {
        variantes.push(rut, rut.replace(/\B(?=(\d{3})+-)/g, "."));
      }
      const { data: personas, error: errorBusqueda } = await supabase.from("alumnos")
        .select("id,nombre,rut").in("rut", [...new Set(variantes)]).limit(2);
      if (errorBusqueda) throw errorBusqueda;
      if (personas.length !== 1) {
        setError(personas.length ? "Hay más de una ficha con ese RUT." : "No se encontró una ficha con ese RUT.");
        return;
      }
      const { data, error: errorFicha } = await supabase.rpc("leer_inscripcion", { p_persona: personas[0].id });
      if (errorFicha || !data) throw errorFicha ?? new Error();
      abrir(data);
    } catch {
      setError("No se pudo cargar la ficha. Intenta nuevamente.");
    } finally {
      setOcupado(false);
    }
  }

  async function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError("");
    setAviso("");
    const formulario = new FormData(evento.currentTarget);
    const rut = normalizarRut(String(formulario.get("rut")));
    if (!rut) {
      setError(ERRORES.rut_invalido);
      return;
    }
    const documentos: Documento[] = [];
    if (tipo !== "deportista_destacado") documentos.push("medico");
    if (tipo === "estudiante") documentos.push("alumno_regular");
    const archivos = documentos.flatMap((documento) => {
      const archivo = formulario.get(documento);
      return archivo instanceof File && archivo.name ? [{ documento, archivo }] : [];
    });
    for (const { archivo } of archivos) {
      const problema = errorCertificado(archivo);
      if (problema) {
        setError(problema);
        return;
      }
    }
    if (archivos.some(({ documento }) => documento === "medico") && !formulario.get("certificado_emision")) {
      setError("Indica la fecha de emisión del certificado médico.");
      return;
    }

    setOcupado(true);
    const nuevasRutas: string[] = [];
    const datos = {
      ...Object.fromEntries(formulario),
      rut,
      tipo_persona: tipo,
      medico: ficha?.medico ?? null,
      alumno_regular: ficha?.alumno_regular ?? null,
      version: ficha?.version,
    };
    let guardadoEnviado = false;
    let rechazoConfirmado = false;
    try {
      for (const { documento, archivo } of archivos) {
        const ruta = `${profesorId}/${crypto.randomUUID()}`;
        nuevasRutas.push(ruta);
        const { error: errorCarga } = await bucket.upload(ruta, archivo, { contentType: archivo.type });
        if (errorCarga) throw new Error("No se pudo subir el certificado. Intenta nuevamente.");
        datos[documento] = ruta;
      }
      guardadoEnviado = true;
      const { data, error: errorGuardar } = await supabase.rpc("guardar_inscripcion", {
        p_persona: ficha?.id ?? null, p_ficha: datos,
      });
      if (errorGuardar) {
        rechazoConfirmado = /^[0-9A-Z]{5}$/.test(errorGuardar.code);
        throw new Error(ERRORES[errorGuardar.message] ?? "No se pudo confirmar el guardado. Busca el RUT antes de reintentar.");
      }
      abrir(data);
      const retiroCompletado = await retirarCertificados(supabase);
      setAviso(retiroCompletado ? "Inscripción guardada."
        : "Inscripción guardada. El retiro de archivos se reintentará al volver a Inscripciones.");
    } catch (problema) {
      if (nuevasRutas.length && (!guardadoEnviado || rechazoConfirmado)) {
        try {
          const { error: errorDescarte } = await supabase.rpc("descartar_cargas_certificados", { p_rutas: nuevasRutas });
          if (!errorDescarte) await retirarCertificados(supabase);
        } catch {
          // La falla original se informa aunque Storage esté temporalmente indisponible.
        }
      }
      setError(problema instanceof Error && problema.message ? problema.message : "No se pudo guardar la inscripción.");
    } finally {
      setOcupado(false);
    }
  }

  async function descargar(ruta: string) {
    setError("");
    const { data, error: errorDescarga } = await bucket.download(ruta);
    if (errorDescarga) {
      setError("No se pudo descargar el certificado.");
      return;
    }
    const url = URL.createObjectURL(data);
    const extension = data.type === "image/jpeg" ? "jpg" : data.type === "image/png" ? "png" : "pdf";
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `certificado.${extension}`;
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const hoy = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Santiago" }).format(new Date());
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <h1 className="text-2xl font-bold text-navy-900">Inscripciones al gimnasio</h1>
      <Tarjeta className="p-4 sm:p-5">
        <form onSubmit={buscar} className="flex flex-wrap items-end gap-2">
          <label className="min-w-0 flex-1 basis-52 space-y-1 text-sm font-medium">
            <span>Buscar inscripción por RUT</span>
            <Input value={rutBusqueda} onChange={(e) => setRutBusqueda(e.target.value)} required disabled={ocupado} />
          </label>
          <Button type="submit" variant="secondary" disabled={ocupado}>Buscar</Button>
          <Button type="button" variant="outline" disabled={ocupado} onClick={() => {
            abrir(null);
            setAviso("");
            setError("");
          }}>Nueva inscripción</Button>
        </form>
      </Tarjeta>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {aviso && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{aviso}</p>}
      <Tarjeta className="p-4 sm:p-5">
        <h2 className="mb-4 text-lg font-semibold text-navy-900">{ficha ? "Editar inscripción" : "Nueva inscripción"}</h2>
        <form key={claveFormulario} onSubmit={guardar}>
          <fieldset disabled={ocupado} className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            {CAMPOS.map(({ nombre, etiqueta, ...config }) => {
              const valor = ficha?.[nombre];
              const inicial = nombre === "rut" && typeof valor === "string" ? valor.replaceAll(".", "") : valor;
              return (
                <label key={nombre} className="min-w-0 space-y-1 text-sm font-medium">
                  <span>{etiqueta}</span>
                  <Input name={nombre} required defaultValue={typeof inicial === "string" ? inicial : ""}
                    type={"tipo" in config ? config.tipo : "text"}
                    placeholder={"placeholder" in config ? config.placeholder : undefined}
                    max={nombre === "nacimiento" ? hoy : undefined}
                    maxLength={"max" in config ? config.max : undefined} />
                </label>
              );
            })}
            <label className="space-y-1 text-sm font-medium">
              <span>Tipo de persona</span>
              <select value={tipo} onChange={(e) => {
                const elegido = e.target.value as TipoPersona;
                if (elegido === "deportista_destacado") setArchivoMedicoSeleccionado(false);
                setTipo(elegido);
              }}
                className="block h-10 w-full rounded-md border border-line bg-white px-3">
                {Object.entries(TIPOS).map(([valor, etiqueta]) => <option key={valor} value={valor}>{etiqueta}</option>)}
              </select>
            </label>
            {tipo === "estudiante" && (
              <label className="space-y-1 text-sm font-medium">
                <span>Carrera</span>
                <Input name="carrera" defaultValue={ficha?.carrera ?? ""} required maxLength={160} />
              </label>
            )}
            <label className="space-y-1 text-sm font-medium sm:col-span-2">
              <span>Enfermedades, lesiones y observaciones</span>
              <textarea name="antecedentes" rows={3} maxLength={4000} defaultValue={ficha?.antecedentes ?? ""}
                className="block w-full rounded-md border border-line p-3" />
            </label>
            <div className="min-w-0 space-y-3 rounded-lg border border-line p-3 sm:col-span-2">
              <p className="text-sm text-tinta-suave">PDF, JPG o PNG de hasta 10 MB por archivo.</p>
              {tipo === "deportista_destacado" ? (
                <p className="text-sm font-medium">Exento de certificado médico.</p>
              ) : (
                <>
                  <label className="block space-y-1 text-sm font-medium">
                    <span>Certificado médico</span>
                    <Input type="file" name="medico" accept={TIPOS_CERTIFICADO.join(",")} className="min-w-0 max-w-full"
                      onChange={(e) => setArchivoMedicoSeleccionado(Boolean(e.currentTarget.files?.length))} />
                  </label>
                  <label className="block space-y-1 text-sm font-medium">
                    <span>Fecha de emisión del certificado médico</span>
                    <Input type="date" name="certificado_emision" max={hoy} defaultValue={ficha?.certificado_emision ?? ""}
                      disabled={!archivoMedicoSeleccionado && !ficha?.medico} />
                  </label>
                  <p className="text-sm">
                    {ficha && ficha.estado_certificado !== "exento" ? textoVigencia(ficha) : "Certificado médico pendiente"}
                  </p>
                  {ficha?.medico && (
                    <Button type="button" variant="outline" className="h-auto min-h-10 max-w-full whitespace-normal py-2"
                      onClick={() => void descargar(ficha.medico!)}>Descargar certificado médico</Button>
                  )}
                </>
              )}
              {tipo === "estudiante" && (
                <>
                  <label className="block space-y-1 text-sm font-medium">
                    <span>Certificado de alumno regular</span>
                    <Input type="file" name="alumno_regular" accept={TIPOS_CERTIFICADO.join(",")} className="min-w-0 max-w-full" />
                  </label>
                  {ficha?.alumno_regular
                    ? <Button type="button" variant="outline" className="h-auto min-h-10 max-w-full whitespace-normal py-2"
                      onClick={() => void descargar(ficha.alumno_regular!)}>Descargar certificado de alumno regular</Button>
                    : <p className="text-sm">Certificado de alumno regular pendiente</p>}
                </>
              )}
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">{ocupado ? "Procesando…" : "Guardar inscripción"}</Button>
            </div>
          </fieldset>
        </form>
      </Tarjeta>
      <Tarjeta className="space-y-2 p-4 sm:p-5">
        <h2 className="font-semibold text-navy-900">Reglamento de ingreso y entrenamiento</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-tinta-suave">
          <li>Indica tu RUT al ingresar.</li>
          <li>Lleva toalla de mano y usa ropa y calzado deportivo. Evita jeans y ropa clínica.</li>
          <li>Ingresa sin acompañantes y mantén el orden en la sala.</li>
          <li>Consulta al profesor y avisa si detectas desperfectos.</li>
        </ul>
      </Tarjeta>
    </div>
  );
}
