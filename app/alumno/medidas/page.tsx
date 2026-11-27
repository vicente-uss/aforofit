import type { Metadata } from "next";
import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { MarcoAlumno } from "@/components/marca/marco-alumno";
import { requerirRol } from "@/lib/auth/perfil";
import { hoyEnSantiago } from "@/lib/medidas/mediciones";
import { RegistroCorporal } from "./registro-corporal";

export const metadata: Metadata = { title: "Registro corporal · AforoFit" };

async function Contenido() {
  const perfil = await requerirRol("alumno");
  return (
    <MarcoAlumno titulo="Registro corporal" subtitulo="Mediciones privadas">
      <RegistroCorporal key={perfil.id} hoy={hoyEnSantiago()} />
    </MarcoAlumno>
  );
}

export default function PaginaMedidas() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Contenido />
    </Suspense>
  );
}
