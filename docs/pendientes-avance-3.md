# Pendientes de inicio del Avance 3 · AforoFit

El documento maestro incorpora esta sección en el [copia del checklist al inicio del hito](cierre-avances-1-y-2.md#checklist-íntegro-del-avance-3).

El hito está calendarizado para el **24 de noviembre de 2026**. Esta lista parte del [cierre de los avances 1 y 2](cierre-avances-1-y-2.md) y de la [pauta docente](bases-proyecto-integrador.md). Las casillas corresponden a trabajo pendiente o por confirmar. La asignación de cada tarea se propone a partir de los roles de [AGENTS.md](../AGENTS.md).

## 1. Entregables evaluados

| Pendiente | Responsable propuesto | Evidencia de cierre |
|---|---|---|
| [x] Estimar el tamaño del software | Vicente | Hecho el 20 de noviembre: 207 PF no ajustados y 10,35 KLOC, con alcance, método y supuestos en [estimacion.md](estimacion.md). |
| [x] Estimar esfuerzo, duración, recursos y riesgos | Vicente | Hecho el 20 de noviembre: COCOMO orgánico, contraste con la disponibilidad real, recursos, costos y 16 riesgos en [estimacion.md](estimacion.md). Falta confirmar las horas por semana del equipo. |
| [ ] Preparar una demostración del prototipo programado | Pau, Benjamín e Isidora | Flujo central en producción desde el 22 de noviembre y guion de demo en la lámina 13. Falta el video de respaldo (Pau y Benjamín, 23 nov). |
| [ ] Registrar pruebas iniciales, dificultades y correcciones | Bastián y responsables de cada función | Hoja "Pruebas" de la planilla con 30 casos ligados a los CA; la llena Bastián el 23 de noviembre. Ya pasan 52 pruebas de Vitest y 42 SQL. |
| [ ] Elaborar la propuesta de afiche y su plan de cierre (contenido listo en [afiche-contenido.md](afiche-contenido.md)) | Bastián y Vicente | Propuesta de contenido y diseño del afiche (reemplaza al pendón y al tríptico), con el formato que el profesor enviará por Blackboard y fechas para concluirlo en noviembre. Identificar como futuras las funciones aún pendientes. |
| [ ] Preparar la PPT y ensayar la defensa | Vicente y equipo | Guion y diseño listos (borrador de 18 láminas en PowerPoint con notas del orador). Faltan la evidencia de las láminas 12 a 17 y el ensayo del 24 de noviembre a las 11:30. |

## 2. Construcción y verificación de la demo

| Pendiente | Responsable propuesto | Dependencia y evidencia de cierre |
|---|---|---|
| [x] Confirmar adquisición del lector y probar TNE y TUI por USB | Pau | Comparar con NFC Tools el UID que entrega cada tarjeta y comprobar el formato, comportamiento como teclado y tecla Enter. Registrar los resultados sin exponer identificadores reales. [Pruebas de tarjetas](pruebas-tarjetas.md) |
| [x] Vincular credenciales y completar el modelo físico (pull request #8) | Isidora y Pau | Tablas de credenciales, visitas y turnos con migración reproducible. Probar una credencial ligada a un solo alumno y una visita abierta por alumno. Actualizar el [modelo de datos](diagramas.md#2-modelo-entidad-relación) según lo implementado. |
| [x] Implementar ingreso y salida a partir del kiosco (pull requests #7 y #8) | Pau e Isidora | Usar el UID normalizado, validar habilitación, horario y capacidad, registrar entrada y salida y devolver un resultado claro para cada rechazo. Definir acceso autorizado a la operación de registro. |
| [x] Implementar turnos y cierre automático de visitas (pull request #8, 42 pruebas SQL) | Isidora y Pau | Coordinar la regla de vencimiento de turno. Demostrar cola ordenada, revalidación al llamar el turno, liberación del cupo y cierre automático. Comprobar que dos ingresos simultáneos con un cupo no superan la capacidad. |
| [x] Mostrar aforo y turno llamado en la pantalla pública (en producción, menos de 2 s) | Benjamín, Pau e Isidora | La vista pública refleja entradas, salidas y turnos según la configuración, sin mostrar información privada. Depende del registro de visitas y turnos. |
| [ ] Preparar el respaldo QR | Pau e Isidora | Un QR válido permite identificar al alumno con las mismas reglas de ingreso. Registrar el estado en la PPT si aún está en desarrollo. |
| [ ] Completar las seis plantillas base de rutina | Isidora | Plantillas para tres objetivos y dos niveles, con máquinas del catálogo. Registrar los supuestos y validar la progresión y el redondeo de cargas. |
| [ ] Integrar rutina en el celular y feedback | Benjamín e Isidora | La rutina activa aparece tras registrar el ingreso y se guarda el feedback al salir. Son funciones anunciadas para el hito en la PPT del Avance 2. Registrar con precisión el estado alcanzado. |
| [x] Verificar compilación, pruebas y lint de la versión de demo | Bastián y equipo | Versión en producción: commit `54a36d5`. Lint, tipos, build, 52 pruebas de Vitest y 42 SQL en verde. |

**Orden técnico sugerido:** contrato de datos y reglas de ingreso → credenciales y visitas → turnos y aforo → prueba integrada. El lector, las estimaciones, la PPT y el afiche pueden prepararse en paralelo. La entrada manual del kiosco sirve para ensayar el software mientras se valida el lector.

## 3. Decisiones, datos y alcance que siguen abiertos

| Pendiente | Responsable propuesto | Qué registrar |
|---|---|---|
| [x] Definir el vencimiento del turno llamado (10 minutos, configurable; ver el [contrato](contrato-flujo-ingreso.md)) | Isidora y Vicente | Plazo, comportamiento al vencer y forma de llamar al siguiente. Actualizar regla, caso, diagrama y criterio afectados. |
| [ ] Confirmar fechas oficiales del período académico | Vicente | Fuente y fechas confirmadas. Mientras tanto, conservar como supuesto el 3 de marzo al 23 de diciembre. |
| [ ] Confirmar cantidades de implementos | Bastián y Vicente | Inventario validado con el encargado. Las cantidades actuales del catálogo son preliminares. |
| [ ] Completar ajustes de máquinas y verificar fotos en Figma | Bastián | Fichas con los ajustes que falten y confirmación de qué fotos aparecen en Figma. El inventario inicial y las fotos ya están en el repositorio. |
| [ ] Resolver la cobertura de las funciones de prioridad media | Vicente e Isidora | Acordar una métrica para evaluar el reparto experimental y un umbral de inasistencia para las alertas. Incidencias y reportes permanecen identificados como prioridad media. |
| [ ] Planificar las funciones restantes del alcance vigente | Equipo | Registrar estado y siguiente paso de préstamos y devoluciones, catálogo y gestión administrativa, habilitación y configuración, y registro corporal privado. |
| [ ] Revisar en Blackboard el formato del afiche | Vicente | Medidas, soporte y fecha que indique el profesor. Ajustar la propuesta a ese formato. |

## 4. Evidencia para cerrar el hito

- [ ] Priorizar pruebas del flujo que se vaya a demostrar. Usar los [CA01–CA22 y los criterios complementarios](requisitos-casos-uso-criterios.md#6-criterios-de-aceptación). Distinguir pruebas de Figma, unitarias, integración, hardware y sistema.
- [ ] Probar identificación válida y desconocida, habilitación, horario, cupo, entrada y salida, espera y cambio de aforo. Agregar QR, rutina y feedback según el avance ejecutable.
- [ ] Registrar qué se ejecutó, qué pasó, qué falló y qué quedó pendiente. Un criterio escrito define el resultado esperado y la ejecución aporta la evidencia.
- [ ] Alinear PPT, demo y afiche con las [decisiones vigentes](../AGENTS.md#decisiones-vigentes-d01d17), los [requisitos](requisitos-casos-uso-criterios.md#8-matriz-de-cobertura) y los [diagramas](diagramas.md#trazabilidad-del-diseño).
