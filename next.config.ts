import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  outputFileTracingIncludes: {
    "/profesor/multicancha": ["./lib/multicancha/recursos/reglamento-provisional.pdf"],
    "/profesor/multicancha/correo/*": ["./lib/multicancha/recursos/reglamento-provisional.pdf"],
    "/multicancha/reglamento": ["./lib/multicancha/recursos/reglamento-provisional.pdf"],
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
        // Estas directivas no restringen scripts de Next, imágenes ni conexiones Realtime.
        { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'" },
      ],
    }];
  },
};

export default nextConfig;
