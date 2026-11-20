import type { Metadata } from "next";
import { PantallaAforo } from "./pantalla-aforo";

export const metadata: Metadata = {
  title: "Aforo · AforoFit",
};

// Pantalla pública del televisor del gimnasio (ruta pública en lib/supabase/proxy.ts).
// Solo muestra cifras: no expone datos de alumnos.
export default function PaginaAforo() {
  return <PantallaAforo />;
}
