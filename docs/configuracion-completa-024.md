# Configuración completa · RF26

La migración 024 habilita el panel `/admin/configuracion` para CA17, CA18 y CA34. El certificado mantiene su vigencia de un año desde la emisión (D20).

## Comportamiento

- Capacidad de 1 a 100 personas y umbral de casi lleno de 1 a 100 %. Bajar la capacidad conserva las visitas abiertas. Las reservas que exceden los cupos vuelven a esperar con su número. Subirla llama los primeros turnos dentro del horario de ingreso.
- La expiración admite de 1 a 120 minutos. El nuevo plazo se calcula desde el llamado de los turnos activos. Reducirlo puede hacerlos expirar al guardar. Aumentarlo da más tiempo a los turnos aún llamados. Los turnos expirados conservan su estado.
- Los horarios rigen desde el guardado, en hora de Santiago. Los llamados vigentes conservan su reserva dentro de los nuevos límites de capacidad y expiración. Entrar y llamar turnos exige estar en el horario de ingreso. La hora de cierre se guarda como límite del horario publicado. El cierre de visitas usa las horas de cierre automático contadas desde la entrada. Acortar ese plazo puede cerrar visitas al guardar.
- Cada modalidad se puede deshabilitar por separado. Las selecciones guardadas vuelven a estar disponibles cuando se rehabilita su modalidad. Las visitas abiertas y cerradas conservan la rutina fijada y aplican el contrato 023. Archivar una rutina propia sigue disponible.
- Fácil y el paso admiten 0,1 a 50 kg. Justo admite un ajuste en ambos sentidos, hasta el incremento de Fácil. Cero conserva incluso una carga que quedó fuera del múltiplo tras cambiar el paso. La reducción admite 0,1 a 100 %. Los cuatro valores se editan con hasta un decimal. Si el redondeo anula un incremento de Fácil o una reducción de Me costó, se aplica un paso. El resultado queda entre 0 y 9999,9 kg, el rango representable en la columna de cargas. Los cambios rigen para feedback futuro de rutinas del sistema.

La RPC toma el bloqueo de aforo antes de escribir configuración. La misma transacción reconcilia reservas y aforo usando los disparadores de 019. El Cron y las publicaciones Realtime permanecen vigentes. Los guardados administrativos completos aplican la última escritura confirmada.

## Aplicación y reversión

En un Supabase desechable, aplica los archivos versionados de `supabase/sql/` en orden hasta 023 y luego `024_configuracion_completa.sql`. Para actualizar desde 023, aplica solo 024. Despliega el panel después de la migración. Comprueba el acceso con los tres roles ficticios y vuelve a cargar la pantalla tras guardar.

Para volver al código anterior, usa `supabase/reversion/024_configuracion_completa.sql` y la versión anterior del panel. La reversión quita la nueva RPC y restaura la fórmula anterior. La configuración, el historial y las cargas ya registradas se conservan. Puedes reaplicar 024.

El workflow [Certificación desechable 024](https://github.com/vicente-uss/aforofit/actions/workflows/certificacion-024.yml) ejecuta las suites y publica las capturas Chromium. La cámara para QR y el lector físico de TNE/TUI requieren evidencia en el gimnasio.
