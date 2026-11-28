# CR-02 fase 4 · Multicancha y reservas

La [migración 030](../supabase/sql/030_multicancha_reservas.sql) del PR #34 se amplió antes de su aplicación en producción. Cubre CR02-07 a CR02-09. La certificación usa Supabase desechable y cuentas ficticias.

## Operación

- **Profesor → Multicancha** ofrece vistas de día, semana y mes en hora de Santiago. Los eventos simultáneos aparecen en columnas paralelas. El aviso «Conflicto de espacio» identifica actividades que comparten espacio y horario. Selecciona una fecha en las vistas semanal o mensual para ver sus detalles.
- En un módulo disponible, registra nombre, carrera y correo del responsable. Un correo que coincide con una única cuenta de alumno confirmada vincula esa cuenta sin exigir ficha de gimnasio. Para mover o cancelar, abre el bloque. El historial conserva autor y cambios de las reservas.
- Registra una actividad institucional única, un bloqueo o una serie semanal. Abre una ocurrencia y selecciona **Editar serie semanal** para cambiar horario, espacio, día o vigencia. El cambio se refleja en todas las fechas de la serie. Para conservar la programación anterior desde una fecha de corte, finaliza la serie anterior y crea otra a partir de esa fecha.
- El alumno vinculado abre **Mis reservas** y edita la nómina de una reserva activa. El profesor puede completarla presencialmente. El máximo inicial es de **14 personas contando al responsable**, por lo que admite 13 integrantes adicionales. Un operador autorizado puede ajustar `public.multicancha_configuracion.max_participantes` mediante SQL. El valor rige las próximas ediciones.

## Horarios confirmados

| Uso | Franjas de lunes a viernes |
|---|---|
| Módulos ordinarios | 08:00–09:20 · 09:30–10:50 · 11:00–12:20 · 12:30–13:50 · 14:30–15:50 |
| Franjas no reservables | 16:00–17:20 · 17:30–18:50 · 19:00–20:20 · 20:25–21:45 |

Las 17 series comienzan la semana del 23 de noviembre de 2026 y quedan vigentes hasta que se indique una fecha de término. La agenda asigna a Multicancha las actividades sin espacio indicado y marca el solapamiento de vóleibol y Gym USS el miércoles. PEFI danza urbana ocupa Sala espejo.

| Día | Programación |
|---|---|
| Lunes | Judo 12:30–13:50 · Básquetbol varones selección 17:30–18:50 · Vóleibol varones selección 19:00–20:20 · Gym USS 20:25–21:45 |
| Martes | Básquetbol mixto 12:30–13:50 · Tenis de mesa selección 17:00–18:30 · Vóleibol damas selección 18:30–20:00 · Básquetbol varones selección 20:00–21:30 |
| Miércoles | Vóleibol mixto 11:00–12:20 · PEFI danza urbana, sala espejo 14:40–16:00 · Tenis de mesa taller 16:10–17:20 · Tenis de mesa selección 17:30–18:45 · Vóleibol varones selección 19:00–20:30 · Gym USS 20:25–21:45 |
| Jueves | Vóleibol damas LDES 16:00–21:45 |
| Viernes | Vóleibol varones LDES 16:00–21:45 |
| Sábado | PEPE 11:00–13:50 |

## Confirmación y reglamento

El profesor puede pulsar **Enviar confirmación por Gmail** en una reserva activa. Next.js lee `SMTP_USER` y `SMTP_PASS` en el servidor y espera la respuesta de `smtp.gmail.com:465` con TLS. La demo permite el buzón remitente y, opcionalmente, direcciones separadas por comas en `SMTP_DESTINATARIOS_AUTORIZADOS`. Usa cuentas de prueba autorizadas. La aceptación SMTP indica que Gmail aceptó el mensaje para ese destinatario. [Configuración de Gmail](https://knowledge.workspace.google.com/admin/gmail/send-email-from-a-printer-scanner-or-app) · [SMTP en Vercel](https://vercel.com/kb/guide/serverless-functions-and-smtp).

El profesor puede descargar el **EML** con destinatario, horario y adjunto. El PDF incluido está identificado como reglamento provisional del prototipo. Cuando el encargado entregue el oficial, un operador autorizado puede subirlo al bucket privado `multicancha` como `reglamento.pdf` o `reglamento.docx`. En ese caso se usa el documento oficial en descargas y confirmaciones.

## Integridad y certificación

- Una exclusión GiST protege reservas y bloqueos activos por espacio. Una fila de control transaccional serializa las verificaciones cruzadas con actividades únicas y series semanales. Dos actividades institucionales se pueden traslapar. Las ocupaciones que incluyen una reserva ordinaria o un bloqueo se rechazan si comparten espacio. Los intervalos contiguos son válidos. RLS conserva el acceso privado a reservas y nóminas.
- La base certificada en `de8e13c` tuvo 998 comprobaciones. Se conservan las suites de regresión. Las comprobaciones que esperaban un catálogo provisional de cinco filas, cuatro tablas o un EML sin adjunto se actualizaron para la nueva regla. Se agregaron pruebas de franjas, series, espacios, concurrencia, nómina y SMTP con transporte simulado. [Flujo de GitHub Actions](../.github/workflows/certificacion-cr02-fase-1.yml).
- Pendientes operativos: entrega del reglamento oficial, traspaso de las reservas vigentes de Outlook, plazo de nómina y verificación de entrega real SMTP a un destinatario autorizado en la vista previa.
