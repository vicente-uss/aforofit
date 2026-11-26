# 019 — aplicación, reversión y validación pendiente

**Candidato no certificado.** No aplicar a producción ni fusionar hasta ejecutar todas las pruebas y auditar. No se ha ejecutado PostgreSQL ni Vitest en el entorno de autoría.

## Decisiones

- Un trabajo PostgreSQL `aforofit-reconciliar-aforo` cada minuto. El cierre se registra en entrada + plazo, no en la hora del barrido. Retraso normal hasta un intervalo más tiempo de ejecución/contención; una pausa del proyecto impide ejecutar tareas.
- El mismo reconciliador se usa desde el ingreso, la configuración, el cierre manual y Cron. Bloqueo de aforo antes de configuración; reservas sobrantes vuelven a espera con el número original y un nuevo plazo cuando se llamen otra vez. Se vencen turnos de días anteriores. Se respeta el minuto del último ingreso.
- Realtime sigue usando la fila de aforo; se publica el nombre abreviado según 013. No se publica turnos ni se agregan permisos públicos.
- UID estricto: 4, 7 o 10 bytes hexadecimales mayúsculos separados por dos puntos. Se devuelve `uid_invalido` dentro del contrato existente.
- Las pruebas previas de SQL que usan horas fijas deben ejecutarse aisladas; para Cron real se requiere pg_cron cargado en PostgreSQL, database correcta, permisos del propietario y configuración de workers.

## Aplicación (exclusivamente entorno de pruebas antes de aprobación)

1. Usar una instalación local desechable con el mismo propietario que ejecuta las migraciones. Preparar roles Auth/Realtime y usuarios ficticios, aplicar 001–015, 017, 018 en el orden del repositorio. Confirmar `select * from pg_available_extensions where name='pg_cron';` y `show shared_preload_libraries;`.
2. Ejecutar `supabase/sql/019_estabilidad_final.sql` con psql y ON_ERROR_STOP. Repetir en otra base desde 018 y reaplicar 019 en la primera. Verificar el trabajo único:
   ```sql
   select jobid, jobname, schedule, command, username, active
   from cron.job where jobname='aforofit-reconciliar-aforo';
   ```
3. Ejecutar todas las suites Vitest y SQL (incluida la prueba de migración 017 en base separada), lint, build, auditorías npm completa y producción. Reproducir primero los defectos desde main, registrar los resultados.
4. Ejecutar `psql -v ON_ERROR_STOP=1 -f supabase/pruebas/estabilidad_019.sql` en la base local; ejecutar `bash supabase/pruebas/cron_concurrencia_019.sh` únicamente con URL local desechable y confirmación `AFOROFIT_TEST_DESTRUCTIVO=SI`. Destruir la base al terminar.
5. Verificar en navegador Realtime de /aforo y /profesor/espera, UTC y Santiago, cruces de fecha y carreras con configuración; cubrir también feedback, QR, historial, préstamos, roles, TNE y TUI.
6. Revisar historial del trabajo, sin errores ni duplicados:
   ```sql
   select d.status,d.start_time,d.end_time,d.return_message
   from cron.job_run_details d join cron.job j using(jobid)
   where j.jobname='aforofit-reconciliar-aforo' order by d.start_time desc limit 10;
   ```

## Reversión

En una base de prueba, ejecutar `supabase/reversion/019_estabilidad_final.sql` con el mismo propietario de 019. Desprograma solamente el trabajo de AforoFit, repone las funciones anteriores y conserva los datos cerrados. No elimina pg_cron para no afectar otros trabajos. Revertir el commit de la interfaz mediante un PR independiente si la aplicación hubiese sido desplegada. Verificar que el trabajo no existe, ejecutar nuevamente las suites 018 y comprobar que la función de ingreso anterior funciona. No reabrir visitas históricas.

## Costos y riesgos

Cron usa pg_cron dentro de Postgres, sin Vercel Cron, Edge Functions o servicios externos. La documentación oficial no lista un cobro específico por trabajo; el proyecto Free está sujeto a sus límites de CPU, almacenamiento y a pausas por inactividad. Un trabajo por minuto produce hasta 1.440 ejecuciones diarias y sus registros operativos ocupan espacio aunque no cambie el dominio. Revisar periódicamente el historial y, previa decisión del responsable, limpiar exclusivamente registros propios antiguos; no borrar los de otros trabajos. No considerar el cron como garantía de mantener activo el proyecto Free.

- https://supabase.com/docs/guides/cron
- https://supabase.com/docs/guides/cron/quickstart
- https://supabase.com/pricing
- https://supabase.com/docs/guides/platform/free-project-pausing

Bloqueantes: instalación limpia/reaplicación, concurrencia real, permisos efectivos, ejecución real del trabajo, regresiones y Realtime aún sin validar. El resultado previo 497/497 corresponde a 018, no a 019.
