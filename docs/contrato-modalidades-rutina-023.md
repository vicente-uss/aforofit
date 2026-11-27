# Contrato de modalidades de rutina · migración 023

## Integración con `configuracion-completa`

`public.configuracion` conserva la fila `id = 1` y la columna JSONB `modalidades_rutina`. Sus claves son `sistema`, `profesor` y `alumno`, iguales a los valores de `rutinas.origen`. Solo el booleano JSON `true` habilita una modalidad. Las claves ausentes, `false`, `null` y los tipos distintos de booleano se interpretan como deshabilitados. La instalación histórica ya inicializa las tres claves con `true`. La migración 023 conserva la configuración existente.

La futura RPC de administración debe validar un objeto con las tres claves booleanas y exigir rol `admin`. Debe mantener la escritura de `configuracion` restringida y conservar el orden de bloqueos de 019 al actualizarla. Las pantallas leen el objeto normalizado con `public.modalidades_de_rutina()`, disponible para usuarios autenticados, sin exponer el resto de la configuración.

| Modalidad | Escritura | Selección y uso |
| --- | --- | --- |
| `sistema` | El alumno genera desde la plantilla por objetivo y nivel. La generación conserva su comportamiento de activar la nueva rutina. | El alumno puede volver a elegir una generada anterior. La progresión se aplica al registrar feedback. |
| `profesor` | El profesor crea y asigna a un alumno o edita rutinas de origen profesor. La asignación nueva queda inactiva. | Solo el alumno destinatario la puede activar. El feedback se guarda con las cargas originales. |
| `alumno` | El alumno crea, edita y archiva sus propias rutinas. | Solo el alumno destinatario la puede activar. El feedback se guarda con las cargas originales. |

Deshabilitar una modalidad bloquea generación, creación, edición y activación según el origen. La selección almacenada se conserva y vuelve a ser utilizable al rehabilitar su modalidad si el alumno no eligió otra. Los ingresos nuevos omiten una rutina deshabilitada y continúan su flujo normal. Una visita iniciada conserva la versión habilitada al entrar y puede registrar su feedback aunque cambie la selección o la configuración. El alumno puede archivar sus rutinas propias incluso con la modalidad deshabilitada.

## Permisos y persistencia

- El editor usa las tablas existentes. Las operaciones de escritura se hacen por RPC y el acceso de lectura conserva las políticas de 011. El alumno lee lo propio. Profesor y administrador tienen la lectura operativa existente, con mutaciones de rutinas restringidas al rol y origen de cada RPC.
- Activar, editar, archivar, generar y fijar la rutina en el ingreso serializan sobre la fila del alumno. El índice único parcial de 011 sigue garantizando una única activa. Las ediciones obsoletas fallan con `rutina_modificada`.
- Cada edición archiva la versión anterior y crea una nueva. Si la anterior era la activa, la nueva toma su lugar. El nombre, ejercicios y feedback de versiones anteriores permanecen registrados.
- Credencial y QR usan la misma inserción en `visitas`. El disparador fija la rutina en esa fila y una clave foránea compuesta impide asociar una rutina de otro alumno. Las visitas anteriores conservan el comportamiento anterior. La advertencia de mantención se calcula con el estado vigente de la máquina.
- El editor envía de 1 a 50 ejercicios en el orden deseado. Cada ejercicio tiene una máquina registrada y series positivas. Mantiene el formato de 011 para fuerza (repeticiones y carga opcional) y cardio (minutos).

## Aplicación y reversión

Aplica `supabase/sql/023_rutinas_personalizadas.sql` después de las migraciones de `main` hasta 022 y antes de desplegar las pantallas. La reversión operativa de `supabase/reversion/023_rutinas_personalizadas.sql` se ejecuta junto con la vuelta al código anterior. Recupera la lógica anterior y conserva las columnas y restricciones que protegen nombres, versiones y referencias. La 023 se puede reaplicar. Durante la reversión, las visitas nuevas se registran con el comportamiento anterior y quedan sin rutina fijada. Evita revertir durante una sesión de uso del gimnasio si necesitas que sus visitas queden vinculadas desde el ingreso.

La certificación reproducible corre contra un Supabase desechable en [GitHub Actions](https://github.com/vicente-uss/aforofit/actions/workflows/certificacion-023.yml). El navegador simula la entrada HID y canjea el código QR usando el campo manual. La cámara y el lector físico requieren verificación en el gimnasio.
