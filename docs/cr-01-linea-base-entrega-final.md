# CR-01 — Línea base de alcance para la entrega final

Registro de cambio con el formato del framework de requisitos (FW-IR 12.4), con el análisis de impacto de
FW-IR 12.3 y FW-IS 8.3. Responde a los hallazgos H-1, H-2 y H-5 de la
[auditoría integral](auditoria-proyecto-frameworks-2026-11-23.md).

| Campo | Valor |
|---|---|
| Estado | **Aprobado** por el equipo el lunes 23 de noviembre de 2026, sin cambios (capacidad de 5 integrantes × 10 h por semana). Se informa al profesor en el Avance 3 y al encargado el martes 24 |
| Solicitante | Vicente Galleguillos, jefe de proyecto, lunes 23 de noviembre de 2026 |
| Aprueba | El equipo de los 5 integrantes, que actúa como comité de cambios (FW-IR 12.3). Se informa al profesor en el Avance 3 y al encargado el martes cerca de las 17:00 |
| Versión que reemplaza | Alcance de prioridad alta de AGENTS.md 3 (Avance 2, 17 nov) |
| Nueva versión | Línea base de la entrega final, v1 (vigente desde el 23 de noviembre) |

## 1. Descripción y motivo

El alcance de prioridad alta (RF01 a RF27) **no cabe** en lo que queda hasta el congelamiento del lunes 30 de
noviembre. Este cambio fija qué se construye esta semana, qué queda implementado en parte y qué se pospone a una
próxima versión, para que la demo, el afiche y la defensa prometan solo lo que existe (bases, sección 7).

**Criterio de selección:** se construye primero lo que **cierra el flujo central aprobado**: credencial → rutina
del día → feedback → próxima rutina ajustada (AGENTS.md 5). Es también la innovación del proyecto (★) y fue el
objetivo específico 2 del Avance 1.

## 2. Evidencia que origina el cambio

| Evidencia | Dato | Fuente |
|---|---|---|
| Tamaño total de la prioridad alta | 207 PF | `estimacion.md` 2 |
| Tamaño ya construido | Unos 87 PF (ingreso y aforo, acceso y usuarios, tablas del catálogo) | `estimacion.md` 5 |
| Tamaño que falta | Unos **120 PF**: rutinas (51), catálogo con pantallas (resto de 32), préstamos (25), administración (16), registro corporal (14) | Descomposición por módulo de `estimacion.md` |
| Ritmo observado del equipo | 87 PF en unas 100 h (5 integrantes × 10 h × 2 semanas): **unas 1,15 h por PF** | `estimacion.md` 5 (productividad B) |
| Horas para programar esta semana | 5 × 10 h = 50 h, menos unas 15 h de afiche, pruebas, ensayo y documentación: **unas 35 h** | Supuesto de la estimación (10 h por semana por integrante) |
| Capacidad de esta semana | 35 h ÷ 1,15 h por PF ≈ **30 PF** | Cálculo |
| Brecha | 120 PF que faltan frente a unos 30 posibles: **cabe un cuarto** de lo pendiente | Cálculo |

Con el ritmo real del equipo, la brecha no es de 21 veces (esa cifra es la de COCOMO), sino de unas **4 veces en la
última semana**. Igual obliga a elegir.

## 3. Alternativas evaluadas

| Alternativa | Qué entrega | A favor | En contra | Decisión |
|---|---|---|---|---|
| **A. Rutina primero** | Rutina por plantilla en el celular, feedback, progresión y advertencia de mantención | Cierra el flujo central aprobado; es la innovación; reutiliza Realtime y el ingreso | Préstamos y registro corporal se posponen | **Recomendada** |
| B. Préstamos primero | Préstamo y devolución con la TNE como garantía | Resuelve P5 y vuelve a usar el lector | El flujo central queda sin rutina ni feedback; se pierde la innovación | Descartada |
| C. Un poco de todo | Pantallas iniciales de cada módulo | Muestra amplitud | Nada queda completo ni probado; contradice FW-IS 5.2 (unidades verificables) | Descartada |
| D. No cambiar el alcance | Mantener RF01 a RF27 | Sin cambios documentales | Imposible en el tiempo; el afiche y la defensa prometerían funciones inexistentes | Descartada |

## 4. Línea base aprobada

### 4.1 Construir esta semana (comprometido)

Estimación bottom-up (FW-IS 10.4). Los PF salen de las matrices de clase y las horas del ritmo observado; son
estimaciones, no compromisos de horas.

| # | Requisito | Qué se construye | Tipo y complejidad | PF | Horas |
|---|---|---|---|---:|---:|
| B1 | RF11 | El alumno elige objetivo (fuerza, hipertrofia, salud) y nivel (principiante, intermedio) | EI baja | 3 | 3,5 |
| B2 | RF12 | Seis plantillas (3 objetivos × 2 niveles) que usan solo máquinas registradas; generar la rutina del alumno | ILF baja (rutinas y ejercicios) + EI media | 11 | 12,5 |
| B3 | RF16 y RF17 | Rutina del día en el celular al registrar la entrada (Realtime, como el aforo), con advertencia si una máquina está En mantención | EO media | 5 | 6 |
| B4 | RF18 | Feedback al salir (fácil, justo, me costó) y ajuste de cargas de la próxima sesión con los parámetros (R8, redondeo a 2,5 kg) | EI media | 4 | 4,5 |
| B5 | RF20 | El profesor cambia el estado de una máquina entre Disponible y En mantención | EI baja | 3 | 3,5 |
| | | **Total** | | **26** | **30** |

Quedan unas 5 h de margen sobre las 35 disponibles.

### 4.2 Si la base está lista el viernes 27 (opcional, en este orden)

| # | Requisito | Qué se construye | PF | Horas |
|---|---|---|---:|---:|
| S1 | RF22 y RF23 (parcial) | Préstamo básico: el profesor pasa la TNE, marca implementos y registra la devolución completa; con pendientes no se abre otro préstamo. Sin devoluciones parciales | Unos 10 | 11,5 |
| S2 | RF25 | Pantalla del administrador para registrar la vigencia del certificado | 3 | 3,5 |

Si no se alcanzan, pasan a la sección 4.4 sin otro registro de cambio.

### 4.3 Ya implementado o implementado en parte

| Requisito | Estado | Qué se dice en la defensa y el afiche |
|---|---|---|
| RF01 a RF10 (ingreso, validaciones, visitas, cierre automático, aforo y turnos) | ✅ Implementado y en producción | Funciones principales |
| RF03, respaldo QR | 🟡 Reemplazado por el ingreso manual del kiosco | «Respaldo: ingreso manual por el profesor». El QR pasa a próxima versión |
| RF19 y RF21 (catálogo de máquinas e implementos) | 🟡 Datos reales cargados por SQL, con fotos en el almacenamiento; sin pantalla de edición | «Catálogo cargado con el inventario real del gimnasio» |
| RF25 (habilitación) | 🟡 La regla R2 se valida en la base; la vigencia se carga por SQL | «La habilitación se valida al ingresar» |
| RF26 (configuración) | 🟡 Parámetros en la tabla `configuracion`, editables por SQL | «Parámetros configurables sin tocar el código» |

### 4.4 Pospuesto a una próxima versión

Quedan **diseñados** (requisitos, casos de uso, criterios, ER y diagramas de estado) pero **no implementados**. En
el afiche van como «próxima versión», nunca como implementados.

| Requisito | Función | Motivo |
|---|---|---|
| RF13, RF14 y RF15 | Rutinas creadas por el alumno o asignadas por el profesor y elección de la rutina activa (D09, D15) | La rutina generada cubre el flujo central; los otros orígenes suman pantallas sin cambiar la demo |
| RF22, RF23 y RF24 | Préstamos completos con devoluciones parciales y garantías pendientes (D04, D16) | Salvo el préstamo básico S1 si alcanza |
| RF27 | Registro corporal privado con IMC | Independiente del flujo central |
| RF19, RF21, RF25 y RF26 (pantallas) | Edición desde el panel del administrador | Los datos ya existen por SQL |
| RF28 a RF31 | Prioridad media | Sin cambio: seguían condicionadas a que el núcleo estuviera listo |

## 5. Análisis de impacto

| Dimensión | Impacto |
|---|---|
| Negocio y objetivos | Ver la sección 6. Se cumplen los objetivos 1 y 2 del Avance 1 y parte del 4 y del 5. Se posponen el 6 y el 7 |
| Requisitos | RF11, RF12, RF16, RF17, RF18 y RF20 pasan a construirse. RF13 a RF15, RF22 a RF24 y RF27 pasan a próxima versión. Las prioridades del documento de requisitos no cambian; se agrega la columna «línea base de la entrega final» |
| Reglas | R7 y R8 pasan a implementarse. R9 queda sin implementar, salvo el bloqueo básico de S1. En R8, «si el profesor ajustó la rutina, manda su versión» no aplica todavía porque RF14 se pospone |
| Decisiones | D12 y D13 se implementan. D09, D15 y D16 quedan diseñadas y pospuestas. Se agrega **D18**: línea base de la entrega final según CR-01 |
| Datos | Nuevas tablas `rutinas`, `rutina_ejercicios` (o equivalente) y registro del feedback, con RLS (el alumno solo ve lo suyo). No cambian `visitas`, `turnos` ni `aforo` |
| Interfaces | Nueva pantalla de rutina en `/alumno`; selector de estado de máquina en `/profesor`. El kiosco y `/aforo` no cambian |
| Calidad | Se mide RNF02 para la rutina (llega en 2 s o menos) y RNF05 en celular de 360 px |
| Pruebas | Se activan CA11, CA12, CA13, CA14, CA24 y CA26. Quedan como «no aplica en esta versión» CA15, CA16, CA38 (rutinas del profesor y del alumno), CA19 a CA21 (préstamos), CA22 y CA39 (registro corporal). Si se hace S1, se activan CA19 y CA20 |
| Entrega | La fecha no cambia: congelamiento el lunes 30 y expo del 1 al 3 de diciembre |
| Riesgos | Nuevo riesgo: que la rutina no esté estable el lunes 30. Respuesta: demo con la entrada y la rutina generada aunque falte el feedback, y video de respaldo |

## 6. Objetivos específicos del Avance 1 frente a esta línea base

| Objetivo del Avance 1 | Estado | Cambio que lo explica |
|---|---|---|
| 1. Registrar ingreso y salida con la credencial, con QR de respaldo | ✅ Cumplido; el respaldo es el ingreso manual | CR-01 (QR a próxima versión) |
| 2. Generar automáticamente la rutina del día con progresión de cargas | En línea base (B1 a B4) | — |
| 3. Repartir el orden de los ejercicios | Prioridad media, experimental | D08 (entrevista del 12 nov) |
| 4. Reemplazar automáticamente los ejercicios de máquinas en mantención | Cambiado a una advertencia, en línea base (B3 y B5) | D06 (entrevista del 12 nov) |
| 5. Gestionar reservas de clases y mostrar el aforo en tiempo real | Aforo cumplido; las reservas se reemplazaron por la lista de espera con turno | D14 (diseño, Avance 2) |
| 6. Gestionar el préstamo de implementos con la credencial | Diseñado; básico opcional (S1); completo pospuesto | CR-01 |
| 7. Registrar medidas corporales y su evolución | Diseñado y pospuesto | CR-01 |

## 7. Acciones y responsables

Responsables según AGENTS.md 8. Como préstamos y registro corporal se posponen, Pau y Bastián quedan disponibles
para apoyar la rutina y las pruebas.

| Fecha | Acción | Responsable |
|---|---|---|
| Mar 24 | El equipo aprueba, ajusta o rechaza este CR; se anuncia en el Avance 3 como respuesta a la brecha de esfuerzo | Vicente y equipo |
| Mar 24, 17:00 | Se muestra al encargado el ingreso en vivo y esta línea base, con un acta breve | Vicente |
| Mié 25 | Tablas de rutinas con RLS, seis plantillas, generador y progresión (B2 y B4 en la base) | Isidora |
| Mié 25 a vie 27 | Pantallas de objetivo y nivel, rutina del día en tiempo real y feedback (B1, B3 y B4) | Benjamín, con apoyo de Pau en Realtime |
| Jue 26 | Estado de máquina desde el panel del profesor (B5) | Bastián |
| Jue 26 | Afiche cerrado con las secciones 4.3 y 4.4 | Bastián y Vicente |
| Vie 27 | Revisión: si la base está lista, empieza S1 | Equipo |
| Sáb 28 a dom 29 | Pruebas de los CA activos y registro de los resultados | Bastián, con todo el equipo |
| Lun 30 | Congelamiento: actualizar AGENTS.md, requisitos y matriz de cobertura, y cerrar este CR con su evidencia | Vicente |

## 8. Documentos que hay que actualizar al aprobarse

- **AGENTS.md:** sección 3 (marcar la línea base de la entrega final y lo pospuesto), sección 10 (agregar D18 y
  este CR) y el «Estado actual».
- **`requisitos-casos-uso-criterios.md`:** una columna «Línea base de la entrega final» en la tabla de RF y la
  marca «no aplica en esta versión» en los CA de la sección 5.
- **`afiche-contenido.md`:** la tabla de funciones mencionables según las secciones 4.3 y 4.4.
- **`estimacion.md`:** agregar el bottom-up de la sección 4 como reestimación del 23 de noviembre (FW-IS 13.5).
- **Guion de la PPT:** la respuesta a «¿cómo cierran la brecha?» con las alternativas de la sección 3.

## 9. Cierre

| Campo | Valor |
|---|---|
| Decisión | **Aprobado**, sin cambios |
| Fecha de la decisión | Lunes 23 de noviembre de 2026, por los 5 integrantes |
| Evidencia de implementación | Pull requests de B1 a B5 y resultados de los CA activos |
| Estado de cierre | Abierto: en implementación hasta el congelamiento del lunes 30 |
