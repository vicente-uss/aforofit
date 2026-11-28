# CR-02 fase 2 · Modo administrador

La cuenta principal de la demo es `profesor.demo@aforofit.cl`. Desde el final del menú lateral, abre **Administración**, ingresa el PIN de seis dígitos y activa el modo. El panel permite consultar y gestionar habilitación, máquinas, implementos y configuración. La tarjeta de Reportes sigue marcada como «Próxima versión», tal como en el PR #31.

**Volver al modo profesor** revoca el permiso y mantiene la sesión de Auth. La autorización dura 30 minutos, permanece al recargar y corresponde a la sesión que la activó. Si otra sesión de la misma cuenta activa el modo, la autorización pasa a esa sesión. Cinco intentos fallidos bloquean nuevos intentos durante cinco minutos, incluso desde otra sesión. Las cuentas con rol `admin` conservan el acceso de siempre.

## Preparación de la demostración

1. Usa un proyecto Supabase separado con datos ficticios. Aplica [028](../supabase/sql/028_modo_administrador.sql) después de 027 y verifica que `profesor.demo@aforofit.cl` tenga rol `profesor`.
2. En Vault, crea el secreto `aforofit_demo_pin_admin` con el PIN acordado para la demostración. Ingresa el valor directamente en Vault y compártelo por el canal privado del equipo.
3. Ejecuta esta configuración en el proyecto de demostración. Vincula el permiso al UUID de la cuenta y guarda solo la referencia al secreto.

```sql
insert into privado.modo_admin (profesor_id, secreto_id)
select u.id, s.id
from auth.users u
join public.perfiles p on p.id = u.id and p.rol = 'profesor'
join vault.secrets s on s.name = 'aforofit_demo_pin_admin'
where u.email = 'profesor.demo@aforofit.cl';
```

El comando debe insertar una fila. Para apagar el modo, elimina esa fila en el entorno de demostración y retira el secreto de Vault.

## Autorización y pruebas

Next.js valida el acceso a `/admin` y PostgreSQL valida cada operación administrativa mediante las políticas RLS y los RPC existentes. PostgreSQL vincula el permiso al usuario y al `session_id` de Supabase Auth, comprueba su vencimiento y exige que la sesión siga activa. Las inscripciones y certificados adjuntos siguen bajo los permisos del profesor definidos en 025–027. [Sesiones de Supabase Auth](https://supabase.com/docs/guides/auth/sessions) · [Supabase Vault](https://supabase.com/docs/guides/database/vault).

La línea base es de 297 Vitest y 574 comprobaciones SQL. La certificación vuelve a correr las suites previas, verifica los registros antes y después de aplicar 028 y añade [pruebas SQL de permisos](../supabase/pruebas/cr02/modo_admin.sql) y [pruebas en Chromium a 360 y 1280 px](../.github/qa-cr02-modo-admin.mjs). Chromium prueba el PIN incorrecto y correcto, las rutas directas, recarga, salida, vencimiento y cierre de sesión. El PIN de QA se genera en el entorno desechable.
