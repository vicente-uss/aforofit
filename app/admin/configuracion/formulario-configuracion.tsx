"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Aviso } from "@/components/marca/aviso";
import { EncabezadoPagina } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CAPACIDAD_MAX,
  CAPACIDAD_MIN,
  CIERRE_MAX_HORAS,
  CIERRE_MIN_HORAS,
  DIAS,
  ETIQUETA_DIA,
  textoErrorConfiguracion,
  type Dia,
  type FranjaFormulario,
} from "@/lib/admin/configuracion";
import {
  aFormularioCompleto,
  CAMPOS,
  MODALIDADES,
  validarConfiguracionCompleta,
  type Campo,
  type ErroresCompletos,
  type FormularioCompleto,
} from "@/lib/admin/configuracion-completa";
import { createClient } from "@/lib/supabase/client";

type AvisoFormulario = { tono: "exito" | "error"; titulo: string; detalle: string };

export function FormularioConfiguracion() {
  const supabaseRef = useRef(createClient());
  const [form, setForm] = useState<FormularioCompleto | null>(null);
  const [errorLectura, setErrorLectura] = useState(false);
  const [errores, setErrores] = useState<ErroresCompletos>({});
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<AvisoFormulario | null>(null);

  const leer = useCallback(async () => {
    const { data, error } = await supabaseRef.current
      .from("configuracion")
      .select("capacidad, horario, cierre_automatico_horas, umbral_casi_lleno, turno_expira_minutos, modalidades_rutina, progresion")
      .eq("id", 1)
      .maybeSingle();
    const leido = error ? null : aFormularioCompleto(data);
    setErrorLectura(leido === null);
    if (leido) setForm(leido);
  }, []);

  useEffect(() => {
    void leer();
  }, [leer]);

  function cambiarDia(dia: Dia, cambio: Partial<FranjaFormulario>) {
    setForm((previo) =>
      previo ? { ...previo, horario: { ...previo.horario, [dia]: { ...previo.horario[dia], ...cambio } } } : previo,
    );
  }

  function campoNumerico(campo: Campo) {
    if (!form) return null;
    const { etiqueta, ayuda, decimales } = CAMPOS[campo];
    return (
      <div className="space-y-1">
        <Label htmlFor={campo}>{etiqueta}</Label>
        <Input
          id={campo}
          inputMode={decimales ? "decimal" : "numeric"}
          value={form[campo]}
          aria-invalid={Boolean(errores[campo])}
          aria-describedby={`${campo}-ayuda`}
          onChange={(e) => setForm({ ...form, [campo]: e.target.value })}
        />
        <p id={`${campo}-ayuda`} className={`text-xs ${errores[campo] ? "text-destructive" : "text-tinta-suave"}`}>
          {errores[campo] ?? ayuda}
        </p>
      </div>
    );
  }

  async function guardar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!form || guardando) return;
    setAviso(null);
    const validacion = validarConfiguracionCompleta(form);
    if (!validacion.ok) {
      setErrores(validacion.errores);
      setAviso({ tono: "error", titulo: "Revisa los campos marcados", detalle: "No se guardó ningún cambio." });
      return;
    }
    setErrores({});
    setGuardando(true);
    try {
      const { data, error } = await supabaseRef.current.rpc("actualizar_configuracion_completa", { p_parametros: validacion.parametros });
      if (error) {
        setAviso({ tono: "error", ...textoErrorConfiguracion(error) });
        return;
      }
      const r = (data ?? {}) as { ocupacion?: number; capacidad?: number };
      setAviso({
        tono: "exito",
        titulo: "Configuración guardada",
        detalle: `Aforo: ${r.ocupacion ?? "—"} / ${r.capacidad ?? validacion.parametros.capacidad} personas.`,
      });
      await leer();
    } catch {
      setAviso({ tono: "error", ...textoErrorConfiguracion({}) });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="space-y-5">
        <EncabezadoPagina
          eyebrow="Administración"
          titulo="Configuración del gimnasio"
          subtitulo="Los cambios se aplican al tiro en el ingreso y en la pantalla de aforo."
        />

        {aviso && (
          <Aviso
            tono={aviso.tono === "error" ? "red" : "green"}
            role={aviso.tono === "error" ? "alert" : "status"}
            titulo={aviso.titulo}
            className="animate-pop-in"
          >
            {aviso.detalle}
          </Aviso>
        )}

        {!form ? (
          <p className="text-sm text-tinta-suave">
            {errorLectura ? "No se pudo leer la configuración. Recarga la página." : "Cargando…"}
          </p>
        ) : (
          <form onSubmit={guardar} noValidate>
            <fieldset disabled={guardando} className="min-w-0 space-y-4">
              <Card data-slot="card">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Capacidad y aforo</h2>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="capacidad">Capacidad (personas)</Label>
                    <Input
                      id="capacidad"
                      type="number"
                      inputMode="numeric"
                      min={CAPACIDAD_MIN}
                      max={CAPACIDAD_MAX}
                      value={form.capacidad}
                      aria-invalid={Boolean(errores.capacidad)}
                      onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
                    />
                    <p className={`text-xs ${errores.capacidad ? "text-destructive" : "text-tinta-suave"}`}>
                      {errores.capacidad ?? `Entre ${CAPACIDAD_MIN} y ${CAPACIDAD_MAX}. Los cupos se liberan a medida que salen alumnos al reducir la capacidad.`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="cierre">Cierre automático (horas)</Label>
                    <Input
                      id="cierre"
                      type="number"
                      inputMode="numeric"
                      min={CIERRE_MIN_HORAS}
                      max={CIERRE_MAX_HORAS}
                      value={form.cierre_automatico_horas}
                      aria-invalid={Boolean(errores.cierre_automatico_horas)}
                      onChange={(e) => setForm({ ...form, cierre_automatico_horas: e.target.value })}
                    />
                    <p
                      className={`text-xs ${errores.cierre_automatico_horas ? "text-destructive" : "text-tinta-suave"}`}
                    >
                      {errores.cierre_automatico_horas ??
                        `Entre ${CIERRE_MIN_HORAS} y ${CIERRE_MAX_HORAS}. Una visita sin salida se cierra sola (regla 6).`}
                    </p>
                  </div>
                  {campoNumerico("umbral")}
                </CardContent>
              </Card>

              <Card data-slot="card">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Horarios de funcionamiento</h2>
                  <CardDescription>
                    Se puede entrar hasta el último ingreso (regla 3). El cierre es la hora en que el gimnasio cierra.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {DIAS.map((dia) => {
                      const f = form.horario[dia];
                      return (
                        <li key={dia} className="space-y-2 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold">{ETIQUETA_DIA[dia]}</span>
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={f.abierto}
                                onChange={(e) => cambiarDia(dia, { abierto: e.target.checked })}
                              />
                              {f.abierto ? "Abierto" : "Cerrado"}
                            </label>
                          </div>
                          {f.abierto && (
                            <div className="grid gap-2 sm:grid-cols-3">
                              {(
                                [
                                  ["apertura", "Apertura"],
                                  ["ultimo_ingreso", "Último ingreso"],
                                  ["cierre", "Cierre"],
                                ] as const
                              ).map(([campo, etiqueta]) => (
                                <div key={campo} className="space-y-1">
                                  <Label htmlFor={`${dia}-${campo}`} className="text-xs">
                                    {etiqueta}
                                  </Label>
                                  <Input
                                    id={`${dia}-${campo}`}
                                    type="time"
                                    value={f[campo]}
                                    aria-invalid={Boolean(errores[dia])}
                                    onChange={(e) => cambiarDia(dia, { [campo]: e.target.value })}
                                    className="px-2"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          {errores[dia] && <p className="text-xs text-destructive">{errores[dia]}</p>}
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>

              <Card data-slot="card">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Gestión de turnos</h2>
                  <CardDescription>Los cupos se reservan por orden de llegada.</CardDescription>
                </CardHeader>
                <CardContent>{campoNumerico("expiracion")}</CardContent>
              </Card>

              <Card data-slot="card">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Modalidades de rutinas</h2>
                  <CardDescription>
                    Las visitas abiertas conservan su rutina. Al rehabilitar una modalidad se recupera su disponibilidad.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {(Object.keys(MODALIDADES) as Array<keyof typeof MODALIDADES>).map((modalidad) => (
                    <label key={modalidad} className="flex min-h-9 items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        className="size-4 shrink-0"
                        checked={form.modalidades[modalidad]}
                        onChange={(e) => setForm({
                          ...form,
                          modalidades: { ...form.modalidades, [modalidad]: e.target.checked },
                        })}
                      />
                      {MODALIDADES[modalidad]}
                    </label>
                  ))}
                </CardContent>
              </Card>

              <Card data-slot="card">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Progresión de cargas</h2>
                  <CardDescription>Se aplica al próximo feedback en rutinas generadas por el sistema.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {campoNumerico("facil_kg")}
                  {campoNumerico("justo_kg")}
                  {campoNumerico("me_costo_porcentaje")}
                  {campoNumerico("redondeo_kg")}
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="h-12 w-full text-base sm:w-auto" disabled={guardando}>
                {guardando ? "Guardando…" : "Guardar configuración"}
              </Button>

            </fieldset>
          </form>
        )}
      </div>
    </div>
  );
}
