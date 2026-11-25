"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  aFormulario,
  CAPACIDAD_MAX,
  CAPACIDAD_MIN,
  CIERRE_MAX_HORAS,
  CIERRE_MIN_HORAS,
  DIAS,
  ETIQUETA_DIA,
  textoErrorConfiguracion,
  validarConfiguracion,
  type Dia,
  type Errores,
  type FormularioConfiguracion as Formulario,
  type FranjaFormulario,
} from "@/lib/admin/configuracion";
import { createClient } from "@/lib/supabase/client";

type Aviso = { tono: "exito" | "error"; titulo: string; detalle: string };

const ESTILO_AVISO = { exito: "bg-green-600 text-white", error: "bg-red-600 text-white" } as const;

/**
 * F-09 (D24, RNF08): el admin edita capacidad, horario por día y horas del cierre automático.
 * Valida en el formulario (lib/admin/configuracion.ts) y la base vuelve a validar en
 * actualizar_configuracion (014), que además recalcula el aforo si cambia la capacidad.
 * Período académico (ya no se usa, D20), progresión y modalidades no se editan aquí (D24).
 */
export function FormularioConfiguracion() {
  const supabaseRef = useRef(createClient());
  const [form, setForm] = useState<Formulario | null>(null);
  const [errorLectura, setErrorLectura] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<Aviso | null>(null);

  const leer = useCallback(async () => {
    const { data, error } = await supabaseRef.current
      .from("configuracion")
      .select("capacidad, horario, cierre_automatico_horas")
      .eq("id", 1)
      .maybeSingle();
    const leido = error ? null : aFormulario(data);
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

  async function guardar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!form) return;
    setAviso(null);
    const validacion = validarConfiguracion(form);
    if (!validacion.ok) {
      setErrores(validacion.errores);
      setAviso({ tono: "error", titulo: "Revisa los campos marcados", detalle: "No se guardó ningún cambio." });
      return;
    }
    setErrores({});
    setGuardando(true);
    try {
      const { data, error } = await supabaseRef.current.rpc("actualizar_configuracion", {
        p_capacidad: validacion.capacidad,
        p_horario: validacion.horario,
        p_cierre_automatico_horas: validacion.cierre_automatico_horas,
      });
      if (error) {
        setAviso({ tono: "error", ...textoErrorConfiguracion(error) });
        return;
      }
      const r = (data ?? {}) as { ocupacion?: number; turno_llamado?: number | null; en_espera?: number };
      const turno = typeof r.turno_llamado === "number" ? ` · turno llamado: ${r.turno_llamado}` : "";
      setAviso({
        tono: "exito",
        titulo: "Configuración guardada",
        detalle: `Aforo: ${r.ocupacion ?? "—"} / ${validacion.capacidad}${turno}. La pantalla /aforo ya lo muestra.`,
      });
      await leer();
    } catch {
      setAviso({ tono: "error", ...textoErrorConfiguracion({}) });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="min-h-svh w-full">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 p-4">
          <Link href="/admin" className="text-xl font-bold tracking-tight">
            AforoFit
          </Link>
          <Badge variant="secondary">Configuración</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-semibold">Configuración del gimnasio</h1>
          <p className="text-sm text-muted-foreground">
            Los cambios se aplican al tiro en el ingreso y en la pantalla de aforo.
          </p>
        </div>

        {aviso && (
          <div role={aviso.tono === "error" ? "alert" : "status"} className={`rounded-lg p-4 ${ESTILO_AVISO[aviso.tono]}`}>
            <p className="font-bold">{aviso.titulo}</p>
            <p className="text-sm">{aviso.detalle}</p>
          </div>
        )}

        {!form ? (
          <p className="text-muted-foreground">
            {errorLectura ? "No se pudo leer la configuración. Recarga la página." : "Cargando…"}
          </p>
        ) : (
          <form onSubmit={guardar} noValidate className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aforo y cierre automático</CardTitle>
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
                  <p className={`text-xs ${errores.capacidad ? "text-destructive" : "text-muted-foreground"}`}>
                    {errores.capacidad ?? `Entre ${CAPACIDAD_MIN} y ${CAPACIDAD_MAX}. Bajarla no saca a nadie.`}
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
                    className={`text-xs ${errores.cierre_automatico_horas ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    {errores.cierre_automatico_horas ??
                      `Entre ${CIERRE_MIN_HORAS} y ${CIERRE_MAX_HORAS}. Una visita sin salida se cierra sola (regla 6).`}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Horario</CardTitle>
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
                          <div className="grid grid-cols-3 gap-2">
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

            <Button type="submit" size="lg" className="h-12 w-full text-base sm:w-auto" disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar configuración"}
            </Button>

            {/* D24: lo que no se edita en esta versión queda declarado como limitación. */}
            <p className="text-xs text-muted-foreground">
              No se editan aquí: el período académico (ya no se usa, D20: el certificado dura un año desde su
              emisión), la progresión de cargas y las modalidades de rutina. En esta versión se cambian por SQL
              (limitación declarada, D24).
            </p>
          </form>
        )}
      </main>
    </div>
  );
}
