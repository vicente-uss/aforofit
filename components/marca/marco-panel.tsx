"use client";

import {
  ClipboardList,
  Dumbbell,
  ExternalLink,
  History,
  LayoutDashboard,
  ListOrdered,
  Menu,
  Package,
  ScanLine,
  ShieldCheck,
  SlidersHorizontal,
  UserRoundPlus,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LogoutButton } from "@/components/logout-button";
import { estadoAforo } from "@/lib/aforo/estado";
import { useAforo } from "@/lib/aforo/useAforo";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { esActivo, TRAZO_NIVEL } from "./nivel";

type Item = { href: string; etiqueta: string; icono: LucideIcon };

// Solo pantallas que existen en app/. Las de «Próxima versión» no van en el menú.
const MENU: Record<"profesor" | "admin", { titulo: string; items: Item[] }> = {
  profesor: {
    titulo: "Profesor encargado",
    items: [
      { href: "/profesor", etiqueta: "Inicio", icono: LayoutDashboard },
      { href: "/ingreso", etiqueta: "Kiosco de ingreso", icono: ScanLine },
      { href: "/profesor/inscripciones", etiqueta: "Inscripciones", icono: UserRoundPlus },
      { href: "/profesor/espera", etiqueta: "Lista de espera", icono: ListOrdered },
      { href: "/profesor/adentro", etiqueta: "Quiénes están adentro", icono: Users },
      { href: "/profesor/prestamos", etiqueta: "Préstamos", icono: Package },
      { href: "/profesor/maquinas", etiqueta: "Mantención", icono: Wrench },
      { href: "/profesor/rutinas", etiqueta: "Rutinas de alumnos", icono: ClipboardList },
      { href: "/profesor/historial", etiqueta: "Historial", icono: History },
    ],
  },
  admin: {
    titulo: "Administración",
    items: [
      { href: "/admin", etiqueta: "Inicio", icono: LayoutDashboard },
      { href: "/ingreso", etiqueta: "Kiosco de ingreso", icono: ScanLine },
      { href: "/admin/maquinas", etiqueta: "Máquinas", icono: Dumbbell },
      { href: "/admin/implementos", etiqueta: "Implementos", icono: Package },
      { href: "/admin/habilitacion", etiqueta: "Habilitación", icono: ShieldCheck },
      { href: "/admin/configuracion", etiqueta: "Configuración", icono: SlidersHorizontal },
    ],
  },
};


// Píldora de la barra superior con el aforo en vivo (mismo hook que /aforo y el kiosco).
function PildoraAforo() {
  const { aforo, sinConexion } = useAforo("aforo-panel");
  const estado = aforo ? estadoAforo(aforo.ocupacion, aforo.capacidad, aforo.umbral_casi_lleno) : null;
  return (
    <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium text-navy-900 shadow-sm">
      <span
        aria-hidden
        className="h-2 w-2 rounded-full"
        style={{ background: estado ? TRAZO_NIVEL[estado.etiqueta] : "#94a3b8" }}
      />
      <span className="tnum">
        {aforo ? `${aforo.ocupacion}/${aforo.capacidad} personas` : sinConexion ? "Aforo sin conexión" : "Aforo…"}
      </span>
    </span>
  );
}

/**
 * Contenedor del profesor y del admin: barra lateral navy de 256 px (en celular se abre con un botón),
 * barra superior con el aforo en vivo y el contenido sobre el fondo canvas. Solo presentación: el
 * rol lo sigue validando cada página en el servidor (requerirRol).
 */
export function MarcoPanel({
  rol,
  usuario,
  children,
}: {
  rol: "profesor" | "admin";
  usuario: ReactNode;
  children: ReactNode;
}) {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const menu = MENU[rol];
  const raiz = `/${rol}`;

  // Al navegar en celular, el menú se cierra.
  useEffect(() => setAbierto(false), [ruta]);

  return (
    <div className="min-h-svh bg-canvas">
      {abierto && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-30 bg-navy-950/50 lg:hidden"
          onClick={() => setAbierto(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-900 text-slate-300 transition-transform duration-200 lg:translate-x-0",
          abierto ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Menú principal"
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href={raiz}>
            <Logo tamano="sm" oscuro />
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 lg:hidden"
            aria-label="Cerrar menú"
            onClick={() => setAbierto(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-4 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-inset ring-white/10">
          <p className="text-sm font-semibold text-white">{menu.titulo}</p>
          <p className="text-xs text-slate-400">Gimnasio USS Bellavista</p>
        </div>

        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3">
          {menu.items.map(({ href, etiqueta, icono: Icono }) => {
            const activo = esActivo(ruta, href, raiz);
            return (
              <Link
                key={href}
                href={href}
                aria-current={activo ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  activo ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white",
                )}
              >
                {activo && <span aria-hidden className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-blue-500" />}
                <Icono className="h-[18px] w-[18px]" aria-hidden />
                {etiqueta}
              </Link>
            );
          })}
          <a
            href="/aforo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-[18px] w-[18px]" aria-hidden />
            Pantalla pública
          </a>
        </nav>

        <div className="flex items-center justify-between gap-2 border-t border-white/10 px-4 py-4">
          <span className="min-w-0 truncate text-sm font-medium text-white">{usuario}</span>
          <LogoutButton oscuro />
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-line bg-white/80 px-4 backdrop-blur md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-navy-900 hover:bg-slate-100 lg:hidden"
              aria-label="Abrir menú"
              aria-expanded={abierto}
              onClick={() => setAbierto(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="min-w-0 truncate text-sm">
              <span className="font-semibold text-navy-900">Gimnasio USS Bellavista</span>
              <span className="hidden text-tinta-suave sm:inline"> · Sala de musculación</span>
            </p>
          </div>
          <PildoraAforo />
        </header>
        <main className="mx-auto w-full max-w-[1400px] p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
