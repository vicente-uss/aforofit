import type { Metadata } from "next";
import { Suspense } from "react";
import { CargandoPanel } from "@/components/cargando-panel";
import { MarcoAlumno } from "@/components/marca/marco-alumno";
import { requerirRol } from "@/lib/auth/perfil";
import { TEXTOS } from "@/lib/historial/mensajes";
import { HistorialAlumno } from "./historial-alumno";

export const metadata: Metadata = {
  title: "Mi historial · AforoFit",
};

async function Contenido() {
  // La validación del rol se hace en el servidor; RLS (007 y 011) deja leer solo lo propio.
  const perfil = await requerirRol("alumno");
  return (
    <MarcoAlumno titulo={TEXTOS.alumnoTitulo} subtitulo={`Hola, ${perfil.nombre}`}>
      <HistorialAlumno />
    </MarcoAlumno>
  );
}

export default function PaginaHistorialAlumno() {
  return (
    <Suspense fallback={<CargandoPanel />}>
      <Contenido />
    </Suspense>
  );
}
