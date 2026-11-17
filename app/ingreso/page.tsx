import type { Metadata } from "next";
import { PantallaIngreso } from "./pantalla-ingreso";

export const metadata: Metadata = {
  title: "Ingreso · AforoFit",
};

// Pantalla pública tipo kiosco del computador de la entrada (ruta pública en lib/supabase/proxy.ts).
export default function PaginaIngreso() {
  return <PantallaIngreso />;
}
