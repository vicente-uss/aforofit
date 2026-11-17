# Pendientes de inicio del Avance 3 · AforoFit

El documento maestro incorpora esta sección en el [copia del checklist al inicio del hito](cierre-avances-1-y-2.md#checklist-íntegro-del-avance-3).

El hito está calendarizado para el **24 de noviembre de 2026**. Esta lista parte del [cierre de los avances 1 y 2](cierre-avances-1-y-2.md) y de la [pauta docente](bases-proyecto-integrador.md). Las casillas corresponden a trabajo pendiente o por confirmar. La asignación de cada tarea se propone a partir de los roles de [AGENTS.md](../AGENTS.md).

## 1. Entregables evaluados

| Pendiente | Responsable propuesto | Evidencia de cierre |
|---|---|---|
| [ ] Estimar el tamaño del software | Vicente, con apoyo de Benjamín | Cálculo con LOC, puntos de función o ambos. Indicar alcance contado, método, fuentes y supuestos. |
| [ ] Estimar esfuerzo, duración, recursos y riesgos | Vicente y equipo | Horas-persona, duración con la disponibilidad real, recursos y riesgos con mitigación. Explicar cómo se llegó a los valores. |
| [ ] Preparar una demostración del prototipo programado | Pau, Benjamín e Isidora | Guion con un recorrido ejecutable, datos ficticios y evidencia de lo demostrado. |
| [ ] Registrar pruebas iniciales, dificultades y correcciones | Bastián y responsables de cada función | Matriz con criterio, resultado esperado y observado, versión probada, evidencia y acción correctiva. |
| [ ] Elaborar el borrador del pendón y su plan de cierre | Bastián y Vicente | Borrador de contenido y estructura, con responsables y fechas para concluirlo en noviembre. Identificar como futuras las funciones aún pendientes. |
| [ ] Preparar la PPT y ensayar la defensa | Vicente y equipo | Diapositivas con estimaciones, avance técnico, pruebas y pendón. Guion con participación de los integrantes. |

## 2. Construcción y verificación de la demo

| Pendiente | Responsable propuesto | Dependencia y evidencia de cierre |
|---|---|---|
| [ ] Confirmar adquisición del lector y probar TNE y TUI por USB | Pau | Comparar con NFC Tools el UID que entrega cada tarjeta y comprobar el formato, comportamiento como teclado y tecla Enter. Registrar los resultados sin exponer identificadores reales. [Pruebas de tarjetas](pruebas-tarjetas.md) |
| [ ] Vincular credenciales y completar el modelo físico | Benjamín y Pau | Tablas de credenciales, visitas y turnos con migración reproducible. Probar una credencial ligada a un solo alumno y una visita abierta por alumno. Actualizar el [modelo de datos](diagramas.md#2-modelo-entidad-relación) según lo implementado. |
| [ ] Implementar ingreso y salida a partir del kiosco | Pau y Benjamín | Usar el UID normalizado, validar habilitación, horario y capacidad, registrar entrada y salida y devolver un resultado claro para cada rechazo. Definir acceso autorizado a la operación de registro. |
| [ ] Implementar turnos y cierre automático de visitas | Benjamín y Pau | Coordinar la regla de vencimiento de turno. Demostrar cola ordenada, revalidación al llamar el turno, liberación del cupo y cierre automático. Comprobar que dos ingresos simultáneos con un cupo no superan la capacidad. |
| [ ] Mostrar aforo y turno llamado en la pantalla pública | Pau, Benjamín e Isidora | La vista pública refleja entradas, salidas y turnos según la configuración, sin mostrar información privada. Depende del registro de visitas y turnos. |
| [ ] Preparar el respaldo QR | Pau y Benjamín | Un QR válido permite identificar al alumno con las mismas reglas de ingreso. Registrar el estado en la PPT si aún está en desarrollo. |
| [ ] Completar las seis plantillas base de rutina | Benjamín | Plantillas para tres objetivos y dos niveles, con máquinas del catálogo. Registrar los supuestos y validar la progresión y el redondeo de cargas. |
| [ ] Integrar rutina en el celular y feedback | Isidora y Benjamín | La rutina activa aparece tras registrar el ingreso y se guarda el feedback al salir. Son funciones anunciadas para el hito en la PPT del Avance 2. Registrar con precisión el estado alcanzado. |
| [ ] Verificar compilación, pruebas y lint de la versión de demo | Bastián y equipo | Guardar la versión y el resultado. La referencia de partida son las 14 pruebas aprobadas del normalizador UID. Revisar el error de lint en la configuración de Tailwind. |

**Orden técnico sugerido:** contrato de datos y reglas de ingreso → credenciales y visitas → turnos y aforo → prueba integrada. El lector, las estimaciones, la PPT y el pendón pueden prepararse en paralelo. La entrada manual del kiosco sirve para ensayar el software mientras se valida el lector.

## 3. Decisiones, datos y alcance que siguen abiertos

| Pendiente | Responsable propuesto | Qué registrar |
|---|---|---|
| [ ] Definir el vencimiento del turno llamado | Benjamín y Vicente | Plazo, comportamiento al vencer y forma de llamar al siguiente. Actualizar regla, caso, diagrama y criterio afectados. |
| [ ] Confirmar fechas oficiales del período académico | Vicente | Fuente y fechas confirmadas. Mientras tanto, conservar como supuesto el 3 de marzo al 23 de diciembre. |
| [ ] Confirmar cantidades de implementos | Bastián y Vicente | Inventario validado con el encargado. Las cantidades actuales del catálogo son preliminares. |
| [ ] Completar ajustes de máquinas y verificar fotos en Figma | Bastián | Fichas con los ajustes que falten y confirmación de qué fotos aparecen en Figma. El inventario inicial y las fotos ya están en el repositorio. |
| [ ] Resolver la cobertura de las funciones de prioridad media | Vicente y Benjamín | Acordar una métrica para evaluar el reparto experimental y un umbral de inasistencia para las alertas. Incidencias y reportes permanecen identificados como prioridad media. |
| [ ] Planificar las funciones restantes del alcance vigente | Equipo | Registrar estado y siguiente paso de préstamos y devoluciones, catálogo y gestión administrativa, habilitación y configuración, y registro corporal privado. |
| [ ] Confirmar si el equipo hará un tríptico | Vicente y equipo | Decisión y responsable si se realiza. La pauta docente pide el pendón. |

## 4. Evidencia para cerrar el hito

- [ ] Priorizar pruebas del flujo que se vaya a demostrar. Usar los [CA01–CA22 y los criterios complementarios](requisitos-casos-uso-criterios.md#6-criterios-de-aceptación). Distinguir pruebas de Figma, unitarias, integración, hardware y sistema.
- [ ] Probar identificación válida y desconocida, habilitación, horario, cupo, entrada y salida, espera y cambio de aforo. Agregar QR, rutina y feedback según el avance ejecutable.
- [ ] Registrar qué se ejecutó, qué pasó, qué falló y qué quedó pendiente. Un criterio escrito define el resultado esperado y la ejecución aporta la evidencia.
- [ ] Alinear PPT, demo y pendón con las [decisiones vigentes](../AGENTS.md#decisiones-vigentes-d01d17), los [requisitos](requisitos-casos-uso-criterios.md#8-matriz-de-cobertura) y los [diagramas](diagramas.md#trazabilidad-del-diseño).
