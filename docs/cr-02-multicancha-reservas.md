# CR-02 fase 4 · Multicancha y reservas

La migración [030](../supabase/sql/030_multicancha_reservas.sql) se desarrolló sobre `0b85c6e`, fusión del PR #33. Cubre CR02-07 a CR02-09. Aplica la migración en un Supabase desechable con las migraciones previas y cuentas ficticias para revisar el módulo. [Segunda validación](cr-02-segunda-validacion.md#3-operación-de-multicancha).

## Operación

1. Abre **Profesor → Multicancha** y elige un día del calendario. La agenda distingue módulos disponibles, reservados, bloqueados, institucionales y transcurridos.
2. En un módulo disponible, registra nombre, carrera y correo del responsable. Un correo que coincide con una única cuenta de alumno confirmada vincula esa cuenta sin exigir ficha de gimnasio. Si más adelante se confirma la cuenta, vuelve a guardar la reserva con el mismo correo para actualizar el vínculo.
3. Para mover o cancelar, abre el bloque. Una actividad institucional impide ocupar su horario con una reserva ordinaria. Si ya hay una reserva en el horario requerido, reprograma o cancélala explícitamente y registra la actividad. La agenda deja constancia de quién hizo cada cambio. El historial de una reprogramación aparece en ambas fechas.
4. El alumno vinculado abre **Mis reservas** para consultar sus próximos horarios, el historial y la nómina. Puede agregar, corregir o quitar integrantes de una reserva activa. La edición de nómina también está disponible para el profesor como respaldo presencial. Las reservas canceladas conservan su nómina para consulta.

### Horario provisional

| Días de la demo | Módulos ordinarios |
|---|---|
| Lunes a viernes | 08:00–09:20 · 09:30–10:50 · 11:00–12:20 · 12:30–13:50 · 14:30–15:50 |

La foto del horario original y los días habilitados siguen pendientes de validación. El catálogo se ajusta por SQL en una migración posterior, con días ISO del 1 al 7 y módulos de 80 minutos dentro de 08:00–16:00. El profesor puede registrar actividades y bloqueos por hora de Santiago cualquier día, incluso después de las 16:00 o hasta medianoche. Una actividad que continúa al día siguiente se registra en dos bloques. Las altas y los cambios de horario requieren un inicio futuro. A falta del plazo oficial de nómina, un bloque vigente conserva esa edición aunque su horario haya transcurrido.

## Confirmación y reglamento

Desde la reserva, descarga el borrador **EML** con destinatario, asunto y horario. Ábrelo en el cliente de correo para enviarlo manualmente. El enlace **Abrir cliente de correo** precarga el mensaje también. En ese caso, descarga y adjunta el reglamento manualmente cuando esté disponible.

Cuando el encargado entregue el reglamento oficial, un operador autorizado lo sube a la raíz del bucket privado `multicancha` como `reglamento.pdf` o `reglamento.docx` (máximo 10 MB, prioridad para PDF). Desde entonces se incluye en el borrador EML y lo pueden descargar profesor y alumno. Mientras falte, la interfaz informa el pendiente y prepara el borrador sin declarar un adjunto.

Gmail API permite el adjunto MIME con el scope `gmail.send`, que requiere una cuenta de prueba autorizada y configuración OAuth. Resend ofrece un plan gratuito y requiere verificar un dominio para usarlo como remitente. El proyecto sigue con envío manual mientras no tenga una cuenta remitente o dominio autorizado. Las descargas del módulo usan respuestas en streaming compatibles con Vercel. [Gmail y MIME](https://developers.google.com/workspace/gmail/api/guides/sending) · [Scopes de Gmail](https://developers.google.com/workspace/gmail/api/auth/scopes) · [Verificación de dominio en Resend](https://resend.com/docs/dashboard/domains/introduction) · [Streaming en Vercel](https://vercel.com/kb/guide/how-to-bypass-vercel-body-size-limit-serverless-functions).

## Datos, permisos e integridad

- La restricción de exclusión GiST sobre rangos `[inicio, fin)` impide superposiciones entre bloques activos incluso si se escriben desde sesiones simultáneas. Los intervalos contiguos son válidos. Se guardan la fecha y las horas civiles junto a los instantes UTC. Los extremos locales inexistentes o ambiguos por el cambio de hora se rechazan.
- RLS habilita lecturas por rol y vínculo. Las mutaciones pasan por acciones Next.js y RPC con validación de rol, propiedad y versión. El profesor conserva este permiso cuando activa su modo temporal de Administración. Los permisos de ese modo siguen separados de la agenda.
- La reserva y su historial guardan el tipo, fecha, horas, carrera, vínculo, cancelación y autor de cada cambio. La nómina normalizada permite agrupar por carrera. Esos datos permiten consultas futuras por mes, semestre o año y por tiempo de uso, cancelaciones y actividad institucional. La Fase 5 queda pendiente.

## Certificación

- La [certificación CR-02](../.github/workflows/certificacion-cr02-fase-1.yml) prueba la regresión del gimnasio y la actualización 029 → 030 con datos anteriores. Las pruebas nuevas cubren [integridad, horario, RLS e historial](../supabase/pruebas/cr02/multicancha_030.sql), [dos carreras entre sesiones](../.github/qa-cr02-multicancha-concurrencia.sh) y [los flujos Chromium de ambos roles](../.github/qa-cr02-multicancha.mjs). Chromium verifica adjuntos con un PDF ficticio y genera capturas de ambas pantallas a 360, 390, 768, 1280 y 1440 px en el artefacto `evidencia-chromium-cr02`.
- Quedan pendientes el horario y los días oficiales, el reglamento y la definición del límite y plazo de nómina. El reemplazo operativo de Outlook requerirá revisión del encargado y carga manual de los bloques vigentes autorizados. El prototipo se prueba con datos ficticios.
