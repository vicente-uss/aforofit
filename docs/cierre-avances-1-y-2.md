# AforoFit al cierre del Avance 2

**Corte: 17 de noviembre de 2026.** Documento de continuidad para incorporar a una persona al equipo o dar contexto a una IA antes del Avance 3. Se lee en orden: propuesta original, análisis y diseño, evidencia técnica y trabajo siguiente.

Los avances 1 y 2 obtuvieron **7,0**, según el registro del equipo. La [pauta docente](bases-proyecto-integrador.md) define lo evaluado. Los PDF muestran lo presentado y [AGENTS.md](../AGENTS.md) recoge las decisiones y reglas vigentes. Para retomar una tarea, consulta también el artefacto enlazado y revisa el código de la rama donde trabajarás.

| Estado | Qué significa aquí |
|---|---|
| **Documentado** | Existe una definición, modelo, decisión o evidencia escrita. |
| **Simulado** | El comportamiento se puede recorrer en Figma con datos de prueba. |
| **Implementado al Avance 2** | Hay código o scripts disponibles para esa parte. El alcance de la comprobación se detalla en el punto 9 del Avance 2. |
| **Pendiente de confirmar** | La evidencia disponible no permite cerrar el punto. |

## Avance 1 — Propuesta y aprobación

**Entrega:** PPT y exposición en clases. **Ponderación:** 10% de la Solemne. **Rúbrica:** 18 puntos. [Presentación del Avance 1](entregas/avances/AforoFit-Avance1-Grupo6.pdf).

1. **Contexto y elección del área.** Se eligió el gimnasio de la USS, sede Bellavista, para mejorar una operación que dependía de registros manuales y aprovechar las máquinas existentes. La entrevista posterior precisó el funcionamiento del recinto y sustentó las decisiones del Avance 2.
2. **Problema y necesidad.** El gimnasio registraba ingresos en papel y luego los pasaba a Excel. Sin registro de salidas, el encargado controlaba la ocupación a ojo. También había esperas en algunas máquinas. El equipo propuso usar el ingreso como punto de conexión entre el control del gimnasio y el entrenamiento de cada alumno.
3. **Usuarios afectados.** El alumno necesita ingresar y disponer de su rutina. El profesor encargado necesita controlar entradas, aforo y préstamos. El administrador necesita gestionar habilitaciones, catálogos y parámetros. El prototipo se acotó al uso por alumnos y al personal que opera el gimnasio.
4. **Solución propuesta y justificación.** Aplicación web que usa la lectura de una credencial para identificar al alumno y activar su rutina. El mismo registro sirve para gestionar el aforo. El panel del encargado reúne información de ingreso, ocupación y préstamos.
5. **Objetivo general.** Desarrollar un sistema web que entregue a cada alumno una rutina generada automáticamente a partir del ingreso con tarjeta y coordine el uso de las máquinas del gimnasio.
6. **Objetivos específicos presentados.** Registrar entradas y salidas con tarjeta y QR de respaldo. Generar la rutina del día con progresión de cargas. Repartir el orden de los ejercicios. Reemplazar ejercicios de máquinas en mantención. Gestionar reservas de clases y aforo en tiempo real. Gestionar préstamos con credencial. Permitir el registro privado de medidas y su evolución. Estos objetivos corresponden a la propuesta original. Los ajustes se registran debajo.
7. **Alcance mínimo funcional.** La propuesta conectaba identificación por credencial, preparación de la rutina, entrega al celular, registro de feedback al salir, progresión y consulta del aforo. La presentación describe el flujo previsto.
8. **Prioridades y exclusiones.** La prioridad alta incluía credencial, rutina, reparto de ejercicios, feedback, reemplazo por mantención, catálogo, préstamos, roles, clases, aforo y registro corporal. La prioridad media incluía incidencias, pronóstico por zona, reportes y alertas de inasistencia. Se dejaron como trabajo futuro la limpieza y mantención según uso, las notificaciones, la gamificación y el informe PDF. Quedaron fuera usuarios externos, integración con sistemas reales de la USS, app nativa en otras sedes, accesos automáticos, sensores o modificaciones a máquinas y registro de series.
9. **Factibilidad, recursos y tecnologías.** Se propuso una web responsiva con React o Next.js, Supabase para datos y autenticación, y Vercel para la demo. Se consideró un lector NFC USB o Android con Web NFC, además de computador o tablet y monitor. La estimación inicial contemplaba planes gratuitos y la compra del lector.
10. **Riesgos.** La PPT identificó cinco riesgos: credencial incompatible o con UID variable, lector incompatible con el navegador, falla de tiempo real o wifi en la expo, complejidad del reparto y crecimiento del alcance. Las mitigaciones fueron probar credenciales y prever QR, elegir un lector HID o evaluar Android con Web NFC, preparar hotspot, actualización periódica y video, probar reglas simples de reparto y priorizar el flujo principal.
11. **Plan de cuatro semanas y responsables.** No se elaboró un plan de cuatro semanas para el Avance 1, según confirmó el equipo. La PPT registra las responsabilidades de los integrantes. El calendario y los hitos posteriores están en [AGENTS.md](../AGENTS.md).
12. **Exposición y defensa.** El [PDF](entregas/avances/AforoFit-Avance1-Grupo6.pdf) respalda el contenido presentado. El equipo registró que la propuesta fue aprobada sin observaciones y que obtuvo 7,0. La aprobación y la nota son resultados distintos según la pauta.

## Avance 2 — Análisis, diseño e inicio del desarrollo

**Entrega:** PPT, evidencia de inicio del desarrollo y exposición en clases. **Ponderación:** 10% de la Solemne. **Rúbrica:** 18 puntos. [Presentación del Avance 2](entregas/avances/AforoFit-Avance2-Grupo6.pdf).

1. **Requisitos funcionales priorizados.** Se documentaron RF01–RF31 con prioridad y origen. Cubren credenciales, habilitación, visitas, capacidad, espera, rutinas, mantención, catálogo, préstamos, configuración y registro corporal. Las incidencias, el reparto experimental, los reportes y las alertas quedan en prioridad media. [Requisitos](requisitos-casos-uso-criterios.md).
2. **Requisitos no funcionales priorizados.** Se documentaron RNF01–RNF11, con criterios como tiempo de respuesta, actualización en tiempo real, compatibilidad, usabilidad, seguridad, privacidad, configuración, disponibilidad, mantenibilidad e idioma. El documento de requisitos clasifica RNF10 como prioridad media. La PPT afirma que todos son de prioridad alta. La diferencia queda registrada para usar la prioridad de la matriz al planificar. [Requisitos](requisitos-casos-uso-criterios.md).
3. **Actores.** Se detallaron el alumno, el profesor encargado y el administrador, y se diseñó la pantalla pública de aforo. El alumno consulta su rutina y registra sus medidas. El profesor opera el gimnasio. El administrador configura el sistema, gestiona catálogos y habilita alumnos. [Actores y casos de uso](requisitos-casos-uso-criterios.md).
4. **Casos de uso y flujos principales.** Se documentaron CU01–CU16 y se desarrollaron los escenarios principales de entrada, espera, salida, rutinas y préstamos. Se incluyeron alternativas como credencial desconocida, habilitación vencida, fuera de horario, gimnasio lleno y devolución parcial. [Especificación](requisitos-casos-uso-criterios.md) · [Diagramas](diagramas.md).
5. **Criterios de aceptación.** Se formularon CA01–CA22 con condiciones, acciones y resultados esperados. Sirven para derivar los casos de prueba del Avance 3. Para ampliar cobertura, la auditoría encontró seis requisitos de prioridad alta sin criterio directo en la matriz. Registrar la evidencia de ejecución por separado. [Matriz de aceptación](requisitos-casos-uso-criterios.md).
6. **Modelo de datos.** Se diseñó el modelo entidad-relación con perfiles, alumnos, credenciales, visitas, turnos, datos de rutinas y préstamos, entre otros. Al cierre había scripts para perfiles, máquinas, implementos y carga del catálogo. Las tablas centrales de credenciales, visitas y turnos quedaron para la siguiente iteración. [Modelo](diagramas.md) · [Scripts SQL](../supabase/sql).
7. **Arquitectura y componentes.** Se definió Next.js con TypeScript y Tailwind para la app, Supabase para PostgreSQL, autenticación y actualizaciones en tiempo real, y Vercel para el despliegue. El diseño conecta el lector HID con el kiosco en el navegador, la app del alumno y la pantalla pública. [Arquitectura y secuencia](diagramas.md).
8. **Diseño de interfaces.** El prototipo navegable de Figma mostró los flujos de alumno, profesor y administrador y la pantalla pública con datos de prueba. Las láminas 18–20 incluyen capturas. La revisión documentó ajustes como asignación de rutinas y orden de turnos. [Revisión de Figma](revision-prototipo-2026-11-16.md) · [Presentación](entregas/avances/AforoFit-Avance2-Grupo6.pdf).
9. **Evidencia de inicio del desarrollo.** Se configuró el repositorio y el despliegue en Vercel. Se implementaron el login, los paneles base por rol y la captura y normalización del UID en el kiosco, con entrada manual. El catálogo quedó respaldado por SQL y registra 11 tipos de máquina, 12 equipos y 4 tipos de implementos con cantidades preliminares. La prueba con NFC Tools leyó tres TNE y una TUI en un celular. Quedó pendiente probar el lector USB con ambas credenciales. En la revisión del cierre pasaron la compilación y 14 pruebas unitarias del normalizador. El lint de esa revisión falló en la configuración de Tailwind. Faltaba conectar la lectura con la identificación, las visitas y el aforo. [Kiosco](../app/ingreso/pantalla-ingreso.tsx) · [Pruebas de UID](../lib/ingreso/normalizarUid.test.ts) · [Catálogo](../supabase/sql/004_datos_catalogo.sql) · [Pruebas de tarjetas](pruebas-tarjetas.md).
10. **Ajustes derivados del Avance 1.** El profesor no dejó observaciones al Avance 1. Los cambios de diseño surgieron de la entrevista y la revisión del prototipo. Se fijó una capacidad inicial configurable de 20 personas, habilitación por período académico y salida independiente de las rutinas. Se separaron los préstamos del aforo y se admitieron varios implementos por solicitud y devoluciones parciales. Se cambió el reemplazo automático por una advertencia de mantención. El reparto de ejercicios quedó experimental, las reservas de clases dejaron de figurar en el alcance vigente y el pronóstico por zona pasó a trabajo futuro. Se eligió la TNE como credencial principal, con TUI y QR previstos. [Entrevista y decisiones](entrevista-encargado-2026-11-12.md) · [Alcance vigente](../AGENTS.md).
11. **Exposición y defensa.** El equipo presentó el análisis, diseño, prototipo navegable y evidencia inicial. El resultado registrado fue 7,0. El PDF conserva el contenido expuesto. [Presentación](entregas/avances/AforoFit-Avance2-Grupo6.pdf).

## Punto de partida para el Avance 3

| Entregable de la pauta | Insumos listos | Qué falta completar |
|---|---|---|
| Estimación de tamaño con LOC, puntos de función o ambos | Alcance y requisitos priorizados, modelo y código inicial | Elegir y justificar el método, delimitar lo que se cuenta, calcular y explicitar supuestos. |
| Estimación de esfuerzo, duración, recursos y riesgos | Equipo, stack, lector seleccionado y calendario | Justificar esfuerzo, fechas, disponibilidad, recursos y riesgos de ejecución. |
| Demo de software en desarrollo | Login, catálogo en base de datos y kiosco que normaliza UID | Conectar credencial, alumno habilitado, visita y salida con aforo verificable. Cubrir horario, cupo lleno y turnos. La PPT también anunció rutina en el celular y feedback para este hito. |
| Pruebas iniciales, dificultades y correcciones | 14 pruebas del normalizador y matriz CA01–CA22 | Ejecutar pruebas del flujo implementado y del lector físico. Registrar resultado esperado, resultado real, evidencia, problema y corrección. |
| Borrador del pendón y plan de cierre | Problema, flujo, arquitectura y capturas ya preparadas | Preparar contenido y estructura del pendón, con evidencia del prototipo y estado de cada función. La pauta exige además planificar el cierre en noviembre. |

El equipo calendarizó el Avance 3 para el **24 de noviembre**. [AGENTS.md](../AGENTS.md) también menciona un tríptico en el plan interno. La [pauta adjunta](bases-proyecto-integrador.md) especifica el pendón.

**Validaciones abiertas:** lector USB y formato emitido para TNE y TUI, cantidades de implementos, fechas oficiales del período académico, factibilidad del reparto automático y regla de vencimiento de un turno llamado.

### Responsables de referencia

| Integrante | Foco documentado |
|---|---|
| Vicente Galleguillos | Coordinación, requisitos, estimación, plan de pruebas, documentación y PPT. |
| Benjamín Velásquez | Modelo de datos y reglas de negocio, capacidad, turnos y rutinas. |
| Pau Urzúa | Lector, credenciales, ingreso, salida, aforo y préstamos. |
| Isidora Moscoso | Interfaces del alumno y encargado, rutinas, feedback y registro corporal. |
| Bastián González | Catálogo, administración, QA, evidencia de pruebas y pendón. |

Para metodología y ejemplos, consultar [Ingeniería de Requerimientos](ingenieria-de-requerimientos.md) e [Ingeniería de Software](ingenieria-de-software.md). Para operar o modificar AforoFit, partir por el [README](../README.md) y las reglas vigentes en [AGENTS.md](../AGENTS.md).
