"use client";

import { ShieldCheck } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { activarAdministracion, desactivarAdministracion } from "@/lib/auth/acciones-modo-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function FormularioPin() {
  const [mensaje, activar, pendiente] = useActionState(activarAdministracion, "");

  return (
    <form id="formulario-pin-admin" action={activar} className="mt-3 space-y-2">
      <label htmlFor="pin-admin" className="block text-sm text-white">PIN de seis dígitos</label>
      <Input
        id="pin-admin"
        name="pin"
        type="password"
        inputMode="numeric"
        pattern="[0-9]{6}"
        maxLength={6}
        autoComplete="off"
        required
        className="bg-white text-navy-900"
      />
      <Button type="submit" variant="secondary" size="sm" className="w-full" disabled={pendiente}>
        {pendiente ? "Verificando…" : "Activar modo administrador"}
      </Button>
      {mensaje && <p role="alert" className="text-sm text-red-200">{mensaje}</p>}
    </form>
  );
}

export function EntradaAdministracion() {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="px-4 pb-3 pt-2">
      <Button
        type="button"
        className="w-full justify-start bg-red-700 text-white hover:bg-red-800"
        aria-expanded={abierto}
        aria-controls={abierto ? "formulario-pin-admin" : undefined}
        onClick={() => setAbierto(!abierto)}
      >
        <ShieldCheck aria-hidden className="mr-2 h-4 w-4" />
        Administración
      </Button>
      {abierto && <FormularioPin />}
    </div>
  );
}

export function SalidaAdministracion({ venceEn }: { venceEn: string }) {
  const [mensaje, desactivar, pendiente] = useActionState(desactivarAdministracion, "");

  useEffect(() => {
    const temporizador = window.setTimeout(
      () => window.location.replace("/profesor"),
      Math.max(0, new Date(venceEn).getTime() - Date.now()),
    );
    return () => window.clearTimeout(temporizador);
  }, [venceEn]);

  return (
    <form action={desactivar} className="px-4 pb-3 pt-2">
      <Button type="submit" variant="secondary" className="w-full" disabled={pendiente}>
        Volver al modo profesor
      </Button>
      {mensaje && <p role="alert" className="mt-2 text-sm text-red-200">{mensaje}</p>}
    </form>
  );
}
