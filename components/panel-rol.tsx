import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/logout-button";
import { ETIQUETA_ROL } from "@/lib/auth/roles";
import type { Perfil } from "@/lib/auth/perfil";

export type SeccionPanel = {
  titulo: string;
  descripcion: string;
  href?: string; // si existe, la tarjeta abre esa pantalla; si no, muestra "Próximamente"
};

// Panel base de cada rol: encabezado con el usuario y una tarjeta por sección.
export function PanelRol({
  perfil,
  secciones,
}: {
  perfil: Perfil;
  secciones: SeccionPanel[];
}) {
  return (
    <div className="min-h-svh w-full">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 p-4">
          <span className="text-xl font-bold tracking-tight">AforoFit</span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right text-sm leading-tight">
              <p className="font-medium">{perfil.nombre}</p>
              <p className="text-muted-foreground">{ETIQUETA_ROL[perfil.rol]}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-4 md:p-6">
        <h1 className="mb-1 text-2xl font-semibold">
          Hola, {perfil.nombre}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Panel de {ETIQUETA_ROL[perfil.rol].toLowerCase()}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {secciones.map((seccion) => {
            const tarjeta = (
              <Card
                className={seccion.href ? "h-full transition-colors hover:border-foreground/40" : "h-full"}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{seccion.titulo}</CardTitle>
                    {seccion.href ? <Badge>Abrir</Badge> : <Badge variant="secondary">Próximamente</Badge>}
                  </div>
                  <CardDescription>{seccion.descripcion}</CardDescription>
                </CardHeader>
              </Card>
            );
            return seccion.href ? (
              <Link key={seccion.titulo} href={seccion.href}>
                {tarjeta}
              </Link>
            ) : (
              <div key={seccion.titulo}>{tarjeta}</div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
