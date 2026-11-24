# Auditoría integral de AforoFit con los frameworks del curso

Fecha: lunes 23 de noviembre de 2026, víspera del Avance 3. Preparada por Vicente Galleguillos (jefe de proyecto)
con apoyo de IA; el equipo la revisa y decide.

> **Actualización del 23 de noviembre, 22:00:** después de esta auditoría la estimación se rehízo (versión 0.3 de
> [`estimacion.md`](estimacion.md)). El tamaño ahora se mide por separado en LOC (5.350, por componentes) y en PF
> (207), con la regla de conteo declarada; COCOMO bajó de 27,9 a 14,0 PM y la brecha frente a lo disponible, de unas
> 21 a unas 10 veces. Las cifras de 27,9 PM, 10,35 KLOC y 21 veces que aparecen abajo son las de la versión 0.2.

## 0. Alcance y método

**Qué se audita:** todo el proyecto, desde la propuesta hasta la entrega final, con tres referencias:

| Referencia | Qué aporta | Archivo |
|---|---|---|
| Bases y rúbricas del Proyecto Integrador | Lo **obligatorio**: contenido de cada avance y criterios con puntaje | [`bases-proyecto-integrador.md`](bases-proyecto-integrador.md) |
| Framework de Ingeniería de Requerimientos y Calidad (FW-IR) | Lo **recomendado** para requisitos, validación, calidad y cambios (secciones 0 a 19) | [`framework-requerimientos-calidad.md`](framework-requerimientos-calidad.md) |
| Framework de Ingeniería de Software (FW-IS) | Lo **recomendado** para enfoque, modelos, diseño, construcción, QA, entrega y estimación (hitos H1 a H9) | [`framework-ingenieria-de-software.md`](framework-ingenieria-de-software.md) |

**Regla de la auditoría** (FW-IR 18 y FW-IS 18.3): un punto cuenta como cumplido solo si hay **evidencia en el
repositorio**, en producción o en una entrega. Un documento escrito prueba que el artefacto existe; no prueba que un
interesado lo aprobó. Cuando las bases y un framework chocan, mandan las bases (FW-IR 18.4).

**Escala:** ✅ cumple · 🟡 parcial · 🔴 falta · ➖ no aplica (con motivo).

## 1. Resumen

**Lo fuerte.** La ingeniería de requerimientos de los avances 1 y 2 está sobre el estándar del curso (ambos con 7,0):
problema con evidencia de entrevista, 17 decisiones trazadas, 31 RF y 11 RNF con origen, 16 casos de uso,
criterios de aceptación en formato Dado-Cuando-Entonces, matriz de cobertura y diagramas UML. La estimación del
Avance 3 aplica exactamente el método de clase (PF con matrices, COCOMO 81, segundo método y costos) y el flujo
central de ingreso está **en producción** con 57 pruebas unitarias y 42 pruebas SQL.

**Lo crítico.** Cinco hallazgos deciden la nota final (70 %):

| # | Hallazgo | Por qué importa | Referencia |
|---|---|---|---|
| H-1 | **El alcance comprometido no cabe en el tiempo que queda.** De los 12 grupos de prioridad alta, hay en producción 3 completos (ingreso y salida, aforo, lista de espera) y 1 parcial (roles). Faltan rutina, feedback y progresión, préstamos, estado de máquinas, catálogo y habilitación con pantalla, registro corporal y QR. COCOMO pide unas 21 veces el esfuerzo disponible; con el ritmo real del equipo faltan unos 120 PF y en la última semana caben unos 30 (ver [CR-01](cr-01-linea-base-entrega-final.md)). | Rúbrica 4, «Cumplimiento de alcance»: implementar **íntegramente el alcance mínimo aprobado**. Sin una nueva línea base acordada, se mide contra lo prometido en los avances 1 y 2. | FW-IS 13.4 (decidir ante inviabilidad), FW-IR 7 y 12 |
| H-2 | **La rutina activada por la credencial, que es la innovación (★) y parte del flujo central aprobado, aún no existe.** | La demo final y el afiche se apoyan en ella. El flujo central de las bases (AGENTS 5) incluye rutina y feedback. | Bases 3, FW-IS H5 |
| H-3 | **No hay registro de ejecución de pruebas contra los criterios de aceptación.** Existen pruebas automáticas y una prueba de punta a punta, pero falta la hoja que diga qué criterio (CA) se ejecutó, con qué resultado y qué defectos quedaron. | Rúbrica 3 «Pruebas y correcciones» y Rúbrica 4 «Validaciones y pruebas». | FW-IR 9 y 10.9, FW-IS 6.5 y 6.8 |
| H-4 | **Nunca se validó el producto con el encargado después de la entrevista.** El prototipo de Figma se contrastó con lo que dijo la entrevista, pero el encargado no lo vio, y no hay acta de esa revisión. | Para el framework, validar es que el interesado confirme que el producto le sirve; contrastarlo con los propios requisitos es verificar. | FW-IR 9, 11 (Playbacks) y 16 |
| H-5 | **Los cambios de alcance desde el Avance 1 no tienen un registro de cambio.** Los objetivos 3, 4 y 5 del Avance 1 cambiaron: el reparto pasó a experimental, el reemplazo automático a futuro y las reservas de clases desaparecieron. Las decisiones D06 y D08 lo explican, pero no hay un CR que muestre qué objetivo cambió y qué se aprobó en su lugar. | Rúbrica 4, «Coherencia con ingeniería de software»: trazabilidad entre etapas. El profesor puede contrastar el Avance 1 con el producto final. | FW-IR 12.2 a 12.4 |

**Recomendación central** (desarrollada en [CR-01](cr-01-linea-base-entrega-final.md)): antes del afiche (jueves 26), fijar una **línea base de alcance para la entrega final**
con un registro de cambio (CR-01). Ahí se decide qué se construye esta semana (rutina mínima con feedback como
prioridad), qué queda como «implementado parcial» y qué pasa a trabajo futuro. Después, presentarla al profesor y
al encargado. El plan está en la sección 7.

## 2. Opciones de cada framework: qué elegimos y si está justificado

Los dos frameworks dan alternativas en cada etapa. La auditoría revisa si el proyecto **eligió** una de ellas y la
justificó (FW-IR 18.7: elegir una opción en vez de usar todas por defecto).

| Decisión | Opciones del framework | Elegido en AforoFit | Evaluación |
|---|---|---|---|
| Tamaño y profundidad documental | FW-IR 0.3: prototipo exploratorio, producto pequeño, mediano o crítico. FW-IS 0.3: iniciativa pequeña o grande | Producto pequeño (alcance, requisitos, criterios, prioridades, casos críticos, trazabilidad y plan de verificación) | ✅ Adecuado. Se produjo incluso más de lo mínimo (ER, secuencia, estados). Falta el **plan de verificación ejecutado** (H-3) |
| Enfoque de desarrollo | FW-IR 1 y FW-IS 2: cascada, RAD, RUP/AUP, Scrum, prototipos | Incremental con prototipos («trabajamos por incrementos y validamos cada paso con prototipos», Avance 2) | 🟡 Elegido y dicho en la PPT, pero sin una ficha de decisión (FW-IS P02) que diga por qué no Scrum ni cascada. Basta un párrafo en la defensa: 3 semanas, requisitos que cambiaron tras la entrevista, prototipo como validación |
| Diagnóstico del problema | FW-IR 2.2: Ishikawa, árbol de problemas, 5 porqués | Lista de problemas observados P1 a P7, sin una técnica causal | 🟡 Suficiente para un producto pequeño. Un árbol de problemas en texto (causa → problema → efecto) reforzaría el contexto del afiche |
| Objetivos | FW-IR 2.5 y 2.6: objetivos medibles con línea base, meta e indicador | Objetivo general y 7 específicos (Avance 1). Requerimiento de negocio «100 % de entradas y salidas sin papel» (Avance 2) | 🟡 Los específicos describen funciones, no resultados medibles, y 3 de los 7 ya no rigen (H-5). La línea base sí existe gracias a la entrevista (papel, 0 salidas, 20 a ojo) |
| Elicitación | FW-IR 3.2: entrevista, observación, focus group, cuestionario, análisis de documentos | Entrevista semiestructurada a los dos profesores (12 nov), con transcripción | ✅ Bien elegida y con evidencia. **Observación** sería la segunda técnica natural (ver la entrada en hora peak) y sirve también para validar |
| Proceso | FW-IR 4: BPMN del proceso actual y del deseado | Proceso actual en texto (P1 a P7) y diagrama de actividades UML del flujo deseado | ✅ Válido: el FW-IS 3.3 acepta actividad o BPMN. El proceso actual no tiene diagrama, pero en un producto pequeño no es obligatorio |
| Requisitos | FW-IR 5 y 8: RF, RNF medibles (ISO/IEC 25010), reglas de negocio separadas | 31 RF, 11 RNF por categoría ISO/IEC 25010, 9 reglas de negocio con parámetros | ✅ Muy bien. Los RNF tienen umbral (3 s, 2 s, 360 px) |
| Interacciones | FW-IR 6: casos de uso o historias de usuario | Casos de uso (16) con especificación de los principales | ✅ Coherente con el enfoque y con lo que pide la rúbrica 2 |
| Priorización | FW-IR 7: matriz impacto-complejidad, MoSCoW, valor y dependencias | Tres niveles: alta (comprometido), media (si hay tiempo) y trabajo futuro | 🟡 La regla está clara, pero la prioridad alta se fijó **sin contrastarla con la capacidad**. La estimación posterior (1,32 PM disponibles) muestra que alta no es realizable completa (H-1). Falta repriorizar dentro de lo alto |
| Modelos | FW-IS 3: elegir el modelo según la pregunta | Casos de uso, actividades, ER, secuencia del ingreso, estados de visita y préstamo, componentes y despliegue | ✅ Cada modelo responde una pregunta concreta. Hay que mantener la nota de diseño frente a lo implementado (ya en `diagramas.md`) |
| Decisiones técnicas | FW-IS 4.4: ADR con alternativas | D01 a D17 en tabla; alternativas registradas para el lector y las tarjetas | 🟡 Las decisiones técnicas grandes (Next.js + Supabase, Realtime con respaldo cada 15 s, lector HID en vez de Web NFC) tienen justificación, pero repartida en las PPT. Un ADR corto de cada una ayuda en la defensa |
| Contratos | FW-IS P06: contrato de componente | `contrato-flujo-ingreso.md` para `registrar_ingreso` | ✅ Bien hecho antes de programar |
| Estimación de tamaño | FW-IS 11: LOC, PF o ambos | PF no ajustados (207) convertidos a LOC (50 LOC/PF) | ✅ Con matrices y justificación por función. Falta fijar la **regla de conteo LOC** (FW-IS 11.2): las dos mediciones del repo incluyen la plantilla `with-supabase` |
| Estimación de esfuerzo | FW-IS 10 y 12: COCOMO, productividad, analogía, bottom-up, juicio experto | COCOMO 81 orgánico y productividad (de clase y observada) | ✅ Dos métodos y contraste con la realidad del equipo. Recomendado: un **bottom-up de la semana final** (FW-IS 10.4) para la línea base de H-1 |
| Calidad | FW-IR 10: elegir atributos por riesgo; FW-IS 6: niveles y tipos de prueba | RNF por ISO/IEC 25010; pruebas unitarias (Vitest), de integración en base de datos (SQL), de sistema manual y hardware | 🟡 Buena variedad de niveles. Falta el **registro de resultados** frente a los CA y la medición de los RNF clave (CA29: ingreso en 3 s o menos; CA32: celular de 360 px; Lighthouse) |
| Alineación | FW-IR 11: Playbacks con interesados | Revisiones internas del equipo y presentación al profesor | 🔴 Ningún Playback con el encargado después de la entrevista (H-4) |
| Cambios | FW-IR 12: solicitud, impacto, decisión y trazabilidad | Decisiones D01 a D17 y actualización de AGENTS.md en cada pull request | 🟡 Cambios registrados como decisiones, sin un registro de cambio que muestre el efecto sobre los objetivos aprobados (H-5) |

## 3. Cronología: qué debíamos tener listo en cada hito

Cada fila cruza lo que piden las bases con lo que el framework recomienda para ese momento, y lo compara con lo que
el proyecto efectivamente tenía. Las referencias del framework son las etapas de FW-IR 0.2 y los hitos de FW-IS 15.

### Avance 1 — martes 10 de noviembre (10 % de la Solemne)

**Framework:** FW-IR etapas 1 a 3 y FW-IS H1 (comprensión) y H2 (enfoque). Pregunta de salida: *¿sabemos cuál es el
problema y quién valida la solución?*

| Debía estar listo | Fuente | Qué tuvimos | Estado |
|---|---|---|---|
| Contexto y área elegida | Bases 6, Rúbrica 1 | Gimnasio USS Bellavista, cómo funciona hoy | ✅ |
| Problema concreto y usuarios afectados | Bases 6; FW-IR 2.1 | 4 problemas y 3 usuarios (alumno, encargado, administrador) | ✅ |
| Problema basado en evidencia, no en la solución | FW-IR 0.1 y 2.1 | La propuesta se hizo **antes** de la entrevista (12 nov): los problemas eran hipótesis razonables | 🟡 Aceptable en el Avance 1; lo corrigió la entrevista |
| Estado del arte y justificación | Rúbrica 1 (problema y necesidad) | Comparación con SmartGym, GymTime, EGYM y control de acceso; «no encontramos» | ✅ |
| Objetivo general y específicos | Bases 6; FW-IR 2.5 | 1 general y 7 específicos | 🟡 Específicos como funciones, sin indicador ni meta |
| Alcance mínimo, exclusiones y prioridades | Bases 6; FW-IR 7 | Flujo central, prioridad alta, media, futuro y fuera del alcance | ✅ |
| Reglas de negocio iniciales | FW-IR 8.4 | 8 reglas | ✅ |
| Factibilidad, recursos, tecnologías y riesgos | Bases 6; FW-IS 1 | Tabla de tecnologías, costo $0 en software, 5 riesgos con mitigación | ✅ |
| Plan de 4 semanas y responsables | Bases 6; FW-IS 0.4 | Roles por integrante | 🟡 Había responsables, pero no un calendario semana a semana en la PPT |
| Interesados que validan | FW-IR 3.1; FW-IS H1 | Encargado identificado como usuario | 🟡 No se dijo quién valida ni cuándo |
| Decisión de enfoque | FW-IS H2 | No explícita en el Avance 1 | 🔴 Apareció recién en el Avance 2 |

**Resultado real:** 7,0, aprobado sin observaciones. Las brechas eran normales para una propuesta, pero dos de ellas
(objetivos sin indicador y plan sin calendario) se arrastran hasta hoy.

### Avance 2 — martes 17 de noviembre (10 %)

**Framework:** FW-IR etapas 3 a 9 y FW-IS H3 (modelo) y H4 (diseño). Pregunta de salida: *¿podemos implementar sin
inventar contratos ni reglas?*

| Debía estar listo | Fuente | Qué tuvimos | Estado |
|---|---|---|---|
| Levantamiento con evidencia | FW-IR 3.3 y 3.4 | Entrevista transcrita, 11 decisiones con fuente | ✅ |
| RF y RNF priorizados | Bases 6, Rúbrica 2 | 31 RF (27 altos, 4 medios) y 11 RNF con métrica | ✅ |
| Actores, casos de uso y criterios de aceptación | Bases 6; FW-IR 6 | 16 casos de uso, especificación de los principales, criterios CA01 a CA22 (más los complementarios) | ✅ |
| Modelo de datos | Bases 6, Rúbrica 2 | Diagrama entidad-relación completo | ✅ |
| Arquitectura, componentes e interfaces | Bases 6; FW-IS 4 | Componentes y despliegue, prototipo en Figma Make revisado (8 ajustes) | ✅ |
| Reglas de negocio con parámetros | FW-IR 8.4 | 9 reglas con valores configurables | ✅ |
| Evidencia de avance técnico | Bases 6, Rúbrica 2 | Repositorio, Supabase, Vercel, login con roles, catálogo y kiosco con `normalizarUid` | ✅ |
| Ajustes desde el Avance 1 | Bases 6 | Ajustes por la entrevista (D01 a D17) | 🟡 Presentados como decisiones, sin un cuadro «antes y después» de los objetivos del Avance 1 (H-5) |
| Verificación de requisitos (validez, consistencia, totalidad, realismo, verificabilidad) | FW-IR 9.1 | Revisión documental con criterios complementarios | 🟡 Hecha en lo formal. **Realismo** no se verificó contra la capacidad del equipo (origen de H-1) |
| Validación con interesados | FW-IR 9.2 y 11 | Prototipo contrastado con la entrevista, por el equipo | 🔴 El encargado no vio el prototipo (H-4) |
| Atributos de calidad y plan de medición | FW-IR 10.5 y 10.6 | RNF con umbral por categoría ISO/IEC 25010 | 🟡 Umbrales definidos, pero sin decir quién mide, con qué herramienta ni cuándo |
| Línea base para construir | FW-IR 13; FW-IS H4 | AGENTS.md como fuente única y contrato del flujo de ingreso | ✅ |

**Resultado real:** 7,0. El profesor destacó el prototipo. La brecha que importa es de realismo y validación, no de
documentación.

### Avance 3 — martes 24 de noviembre (10 %)

**Framework:** FW-IS H5 (construcción), H6 (QA) y H9 (estimación), y FW-IR 10 (calidad). Preguntas de salida: *¿se
integró una capacidad útil y verificable? ¿sabemos qué se probó, qué pasó y qué no? ¿la cifra se puede reproducir?*

| Debía estar listo | Fuente | Qué tenemos hoy | Estado |
|---|---|---|---|
| Estimación de tamaño con LOC y/o PF y supuestos | Bases 6, Rúbrica 3 | 207 PF con matrices de clase, 10,35 KLOC, supuestos declarados | ✅ |
| Regla de conteo LOC declarada | FW-IS 11.2 | Mediciones del repo que incluyen la plantilla | 🟡 Declarar qué se excluye (plantilla, pruebas, SQL) |
| Esfuerzo, duración, recursos y riesgos | Bases 6; FW-IS 9 y 12 | COCOMO 27,9 PM, 8,9 meses, 3,2 personas; productividad; 1,32 PM disponibles; costos por rol; 16 riesgos | ✅ |
| Distinguir estimación, presupuesto y compromiso | FW-IS 9.1b | Costo «teórico» separado del gasto real ($18.980) | ✅ |
| Decisión ante inviabilidad | FW-IS 13.4 | La PPT muestra la brecha (unas 21 veces), pero el alcance no se ajustó | 🔴 **Falta la decisión** (H-1). Es la pregunta más probable del profesor |
| Prototipo con funciones ejecutables | Bases 6, Rúbrica 3 | Flujo de ingreso en producción: kiosco con lector, validaciones, entrada, salida, turnos, aforo en vivo y lista de espera | ✅ Flujo de ingreso completo |
| Progreso consistente con lo comprometido | Rúbrica 3 («progreso consistente») | La rutina y el feedback, anunciados para este hito en el Avance 2, no están | 🟡 Decir con precisión qué falta y cuándo llega |
| Pruebas iniciales con resultados | Bases 6; FW-IS 6.5 | 57 pruebas Vitest, 42 SQL, prueba de punta a punta del 22 nov, auditoría de interfaces | 🟡 Falta la hoja de pruebas por CA (en curso: Bastián) y CA29 medido (en curso: Pau) |
| Dificultades y medidas correctivas | Bases 6, Rúbrica 3 | Corrección de `/profesor/espera` (menos de 2 s), pull request #9 por la auditoría | ✅ Con evidencia |
| Registro de defectos | FW-IS P09 | Dos «detalles menores aceptados» en AGENTS.md | 🟡 Sirve; conviene una tabla de defectos con severidad y decisión |
| Borrador del pendón (afiche) y plan para noviembre | Bases 6, Rúbrica 3 | Contenido del afiche y plan al 26 nov | 🟡 Falta el diseño (Bastián) y el formato del profesor |
| Trabajo de todos visible | Rúbrica 3 | Presentadores por lámina en el guion | ✅ |

**Estado previsto:** fuerte en estimación y en prototipo; el riesgo está en «Pruebas y correcciones» y en responder
bien la pregunta del alcance.

### Afiche definitivo — jueves 26 de noviembre (sin nota propia, incluido en la final)

| Debía estar listo | Fuente | Estado hoy |
|---|---|---|
| Contenido y diseño terminados y aprobados | Bases 4 y 7 | 🟡 Contenido redactado; diseño y formato pendientes |
| Solo funciones implementadas o marcadas como futuras | Bases 7 | 🔴 Depende de la línea base de H-1: sin ella no se sabe qué decir de la rutina |
| Evidencias reales del prototipo (capturas, resultados) | Bases 7 | 🟡 Las capturas nuevas llegan hoy (Benjamín) |
| Resultados, limitaciones y conclusiones | Bases 7 | 🔴 Requiere los resultados de pruebas (H-3) |

### Entrega final y exposición — 1 a 3 de diciembre (70 %)

**Framework:** FW-IS H6, H7 (entrega) y H8 (evolución); FW-IR 12, 13 y 19. Pregunta de salida: *¿la versión se
puede operar y entender sin depender de conocimiento oral?*

| Debe estar listo | Fuente | Estado hoy | Qué falta |
|---|---|---|---|
| Alcance mínimo aprobado implementado | Rúbrica 4 | 🔴 | Línea base CR-01 y construir lo que quede en ella (H-1, H-2) |
| Flujo central estable de principio a fin | Rúbrica 4; Bases 3 | 🟡 | El ingreso es estable; falta cerrar el flujo con rutina y feedback, o redefinirlo en CR-01 |
| Código, datos y arquitectura coherentes y defendibles | Rúbrica 4 | ✅ | Mantener `diagramas.md` alineado con lo implementado |
| Validaciones y pruebas verificables con resultados | Rúbrica 4; FW-IS 6.8 | 🟡 | Hoja de pruebas por CA, defectos, RNF medidos y riesgo residual |
| Trazabilidad requisitos → diseño → estimación → producto | Rúbrica 4; FW-IR 12.1 | 🟡 | Agregar a la matriz de cobertura la columna «resultado de la prueba» y el estado de implementación |
| Prototipo ejecutable y medio de acceso | Bases 8 | ✅ | https://aforofit.vercel.app |
| Código con instrucciones para ejecutarlo | Bases 8; FW-IS 7.2 | 🟡 | El README explica `npm run dev`, pero no cómo recrear la base (correr `supabase/sql/001` a `009` en orden), cómo correr las pruebas SQL ni qué usuarios de prueba existen (sin contraseñas) |
| Recuperación ante una falla en la demo | FW-IS 7.2 punto 9 | 🟡 | Documentar el respaldo: video, hotspot, entrada manual del kiosco y volver a la versión anterior en Vercel |
| Aceptación con evidencia | FW-IS 7.3; FW-IR 19 | 🔴 | Una revisión con el encargado (H-4), con acta breve |
| Limitaciones y pendientes visibles | FW-IR 19; FW-IS 7.2 | ✅ | Ya están en AGENTS.md; pasarlas al afiche y a la defensa |
| Afiche impreso e instalado | Bases 7 y 8 | 🟡 | Según el formato del profesor |
| Defensa por todos | Rúbrica 4 | 🟡 | Cada integrante debe explicar su parte y responder sobre la estimación y el alcance |

## 4. Lista de control de requisitos (FW-IR 16) aplicada

| Punto | Estado | Evidencia o motivo |
|---|---|---|
| Problema sin presuponer la solución | ✅ | P1 a P7 en AGENTS.md 1 |
| Hechos, hipótesis y deseos separados | ✅ | Datos de la entrevista frente a supuestos con responsable |
| Causas, consecuencias y límites revisados | 🟡 | Sin técnica causal; límites claros (fuera del alcance) |
| Objetivos acordados | 🟡 | Objetivos del Avance 1 parcialmente vigentes (H-5) |
| Línea base y métricas | 🟡 | Línea base de la entrevista; métricas de éxito sin medir |
| Interesados identificados | ✅ | Alumno, profesor encargado y administrador |
| Hallazgos con fuente y fecha | ✅ | Entrevista del 12 nov y pruebas de tarjetas |
| Contradicciones tratadas | ✅ | Reparto experimental (D08), credencial USS frente a TNE (D17) |
| Procesos e interacciones modelados | ✅ | Actividades, casos de uso, secuencia y estados |
| Rutas excepcionales | ✅ | Rechazos, turno, cierre automático y credencial no registrada |
| Requisitos con ID, tipo y fuente | ✅ | RF y RNF con origen P, D o R |
| RNF medibles | ✅ | 3 s, 2 s, 360 px, RLS |
| Reglas y restricciones separadas | ✅ | R1 a R9 y sección «fuera del alcance» |
| Priorización justificada | 🟡 | Justificada por valor, no por capacidad (H-1) |
| Especificación accesible | ✅ | `requisitos-casos-uso-criterios.md` y documento maestro |
| Pendientes y supuestos visibles | ✅ | AGENTS.md 10 |
| Verificación de requisitos (5 comprobaciones) | 🟡 | Falta el realismo |
| Revisión por personas competentes | 🟡 | Revisión cruzada en el equipo; sin el encargado |
| Criterios distintos de resultados | 🔴 | Hay criterios, faltan los resultados registrados (H-3) |
| Atributos de calidad por riesgo | ✅ | Desempeño, compatibilidad, usabilidad y seguridad |
| Métricas y umbrales acordados | 🟡 | Definidos, sin responsable de medición |
| Herramientas por finalidad | ✅ | Vitest para reglas, SQL para la base, Lighthouse para desempeño |
| Matriz de trazabilidad de objetivos a pruebas | 🟡 | Llega hasta los criterios, no hasta los resultados |
| Procedimiento de cambios | 🟡 | Pull request con revisión y actualización de AGENTS.md; sin un registro de cambio de alcance |
| Revisiones con actas | 🟡 | Revisión del prototipo (16 nov) y auditoría de interfaces (23 nov); sin acta con el encargado |
| Versión vigente y aprobada | ✅ | PDF de los avances en `docs/entregas/avances/` y AGENTS.md vigente |
| Traspaso con bloqueos y riesgos | ✅ | `pendientes-avance-3.md` y contrato del flujo |

## 5. Hitos del framework de software (FW-IS 15)

| Hito | Pregunta | Estado | Evidencia o brecha |
|---|---|---|---|
| H1 Comprensión | ¿Problema y quién valida? | 🟡 | Problema sólido; validador no formalizado |
| H2 Enfoque | ¿Proceso ajustado a cambio y riesgo? | 🟡 | Incremental con prototipos, sin ficha de decisión |
| H3 Modelo | ¿Modelos que responden preguntas? | ✅ | 7 diagramas con nota de diseño frente a implementación |
| H4 Diseño | ¿Implementable sin inventar contratos? | ✅ | Contrato del flujo de ingreso, ER, RLS |
| H5 Construcción | ¿Capacidad útil integrada? | 🟡 | Ingreso integrado (pull requests #7, #8 y #9); rutina sin construir |
| H6 QA | ¿Qué se probó, qué pasó y qué no? | 🟡 | Pruebas automáticas sí; registro por criterio no |
| H7 Entrega | ¿Se puede operar y entender? | 🟡 | En producción; faltan la recuperación de la base y la aceptación |
| H8 Evolución | ¿Cambios priorizados y estimados? | 🔴 | Sin estimación por función de lo que queda (bottom-up) |
| H9 Estimación | ¿Reproducible y revisable? | ✅ | Método, tablas, supuestos y versión en `estimacion.md` |

## 6. Autoevaluación preliminar con las rúbricas

Lectura del equipo para decidir dónde poner el esfuerzo; **no reemplaza la nota del profesor**.

### Rúbrica 3 (Avance 3, máximo 18)

| Criterio | Nivel probable | Qué lo sube a 3 |
|---|---|---|
| Estimación de tamaño | 3 | Ya está; declarar la regla de conteo LOC |
| Esfuerzo, recursos y plazos | 3 | Responder qué decidimos ante la brecha de 21 veces |
| Prototipo programado | 2 a 3 | Demo fluida del ingreso y decir con precisión qué falta del flujo |
| Pruebas y correcciones | 2 | Hoja de pruebas por CA con resultados y CA29 medido |
| Afiche y preparación final | 2 | Borrador visual y plan al 26 nov |
| PPT y defensa | 3 | Todos presentan; ensayo a las 11:30 |

### Rúbrica 4 (entrega final, máximo 27): riesgos

| Criterio | Riesgo | Motivo |
|---|---|---|
| Cumplimiento de alcance | **Alto** | H-1 y H-2 |
| Funcionamiento del prototipo | Bajo | El ingreso es estable y está en producción |
| Calidad técnica | Bajo | Arquitectura coherente, RLS y pruebas |
| Validaciones y pruebas | Medio | H-3 |
| Coherencia con ingeniería de software | Medio | H-5 y la matriz sin resultados |
| Afiche: contenido | Medio | Depende de la línea base |
| Afiche: diseño y confección | Medio | Formato aún no informado |
| Demostración y defensa | Bajo a medio | Depende de la conexión en la expo |
| Participación grupal | Bajo | Roles claros y presentadores por lámina |

## 7. Plan de acción

Ordenado por impacto en la nota. Los responsables siguen los roles de AGENTS.md 8; el equipo puede reasignar.

| # | Acción | Responde a | Responsable | Fecha |
|---|---|---|---|---|
| 1 | Preparar la respuesta a «¿cómo cierran la brecha de esfuerzo?» para la defensa: se prioriza el flujo central y el resto se redefine en una nueva línea base | H-1 | Vicente | Mar 24, antes del ensayo |
| 2 | Escribir el **CR-01, línea base de la entrega final**: qué se construye (propuesta: rutina mínima por plantilla con feedback y progresión, estado de máquinas con advertencia y préstamo básico), qué queda parcial y qué pasa a futuro; con un bottom-up de las horas de la semana | H-1, H-5, H8 | Vicente con todo el equipo | Mar 24, tras el avance |
| 3 | Incluir en el CR-01 la tabla «objetivo del Avance 1 → estado» (vigente, cambiado por D06 u D08, o futuro) | H-5 | Vicente | Mar 24 |
| 4 | Presentar el prototipo y el CR-01 al encargado el martes cerca de las 17:00 y dejar un acta breve (qué vio, qué validó, qué pidió) | H-4 | Vicente y quien demuestre | Mar 24, 17:00 |
| 5 | Construir la rutina mínima (6 plantillas por objetivo y nivel) y el feedback al salir | H-2 | Isidora y Benjamín | Antes del congelamiento (lun 30) |
| 6 | Completar la hoja de pruebas por CA: criterio, pasos, resultado esperado, resultado obtenido, fecha y defectos | H-3 | Bastián, con los casos de Pau | Hoy (avance) y actualizar hasta el 30 |
| 7 | Medir los RNF clave: CA29 (ingreso), CA10 (aforo en 2 s), CA32 (360 px) y Lighthouse | H-3 | Pau y Bastián | Hoy y repetir el 30 |
| 8 | Agregar a la matriz de cobertura las columnas «implementado» y «resultado de prueba» | Rúbrica 4 (coherencia) | Vicente | Jue 26 |
| 9 | Cerrar el afiche solo con lo que el CR-01 deje como implementado o futuro | Bases 7 | Bastián y Vicente | Jue 26 |
| 10 | Completar el README: recrear la base (orden de los SQL), correr las pruebas SQL, usuarios de prueba sin contraseñas y plan de respaldo de la demo | FW-IS 7.2 | Vicente | Lun 30 |
| 11 | Escribir ADR cortos de Next.js + Supabase, Realtime con respaldo y lector HID | FW-IS 4.4 | Isidora y Pau | Lun 30 |
| 12 | Ensayar la demo final con el respaldo (hotspot, video y entrada manual) | Rúbrica 4 (demo) | Todo el equipo | 1 dic |

## 8. Qué actualizar en otros documentos

> **Actualización del 23 de noviembre:** las brechas de los avances 1 y 2 quedaron trabajadas en
> [complementos de los avances 1 y 2](complementos-avances-1-y-2.md) y la línea base en el
> [CR-01](cr-01-linea-base-entrega-final.md). Las filas de esta auditoría pasan a ✅ cuando otro integrante los revise.

- **AGENTS.md, sección 10:** agregar en «Pendiente» las acciones 2 (CR-01), 4 (acta con el encargado) y 6 (hoja de
  pruebas por CA), con un enlace a esta auditoría.
- **`pendientes-avance-3.md`:** enlazar esta auditoría en la sección 4, «Evidencia para cerrar el hito».
- **Guion de la PPT:** agregar la respuesta de la acción 1 a las preguntas probables.
