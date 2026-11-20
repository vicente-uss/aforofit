import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { esRol, panelDeRol, ROLES } from "../auth/roles";
import { hasEnvVars } from "../utils";

// Ruta pública: la pantalla de aforo (/aforo), que solo muestra cifras.
// El kiosco /ingreso exige sesión de profesor o admin, porque registra ingresos (lo valida su página).
const RUTAS_PUBLICAS = ["/aforo"];

// Páginas de /auth que se pueden abrir con o sin sesión (recuperar clave, errores, confirmación).
const RUTAS_AUTH_LIBRES = [
  "/auth/confirm",
  "/auth/error",
  "/auth/forgot-password",
  "/auth/update-password",
];

function coincide(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Sin variables de entorno no se puede validar la sesión.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const pathname = request.nextUrl.pathname;

  // Redirige conservando las cookies de sesión que Supabase pudo haber renovado.
  const redirigir = (destino: string) => {
    const url = request.nextUrl.clone();
    url.pathname = destino;
    url.search = "";
    const respuesta = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      respuesta.cookies.set(cookie);
    });
    return respuesta;
  };

  // Rutas públicas: se dejan pasar siempre (la pantalla de aforo).
  if (RUTAS_PUBLICAS.some((ruta) => coincide(pathname, ruta))) {
    return supabaseResponse;
  }

  // Sin sesión: todo va al login, salvo las páginas de /auth.
  if (!claims) {
    const esAuth =
      coincide(pathname, "/auth/login") ||
      RUTAS_AUTH_LIBRES.some((ruta) => coincide(pathname, ruta));
    return esAuth ? supabaseResponse : redirigir("/auth/login");
  }

  // Con sesión: se lee el rol en el servidor (RLS: solo devuelve el perfil propio).
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", claims.sub)
    .maybeSingle();

  if (!perfil || !esRol(perfil.rol)) {
    // Sesión sin perfil válido: se muestra el error (página libre, evita bucles).
    if (coincide(pathname, "/auth/error")) return supabaseResponse;
    const url = request.nextUrl.clone();
    url.pathname = "/auth/error";
    url.search = "?error=Tu usuario no tiene un perfil asignado";
    const respuesta = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      respuesta.cookies.set(cookie);
    });
    return respuesta;
  }

  const miPanel = panelDeRol(perfil.rol);

  // "/" y el login llevan al panel del rol.
  if (pathname === "/" || coincide(pathname, "/auth/login")) {
    return redirigir(miPanel);
  }

  // Un usuario solo entra a su propio panel (un alumno no puede abrir /admin).
  const panelAjeno = ROLES.some(
    (rol) => rol !== perfil.rol && coincide(pathname, panelDeRol(rol)),
  );
  if (panelAjeno) {
    return redirigir(miPanel);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
