"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// `oscuro`: versión para la barra lateral navy del profesor y el admin (solo cambia el estilo).
export function LogoutButton({ oscuro = false }: { oscuro?: boolean }) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <Button
      variant={oscuro ? "ghost" : "secondary"}
      size="sm"
      onClick={logout}
      className={oscuro ? "text-slate-300 hover:bg-white/10 hover:text-white" : undefined}
    >
      Cerrar sesión
    </Button>
  );
}
