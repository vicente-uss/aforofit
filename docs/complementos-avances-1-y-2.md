# Complementos de los avances 1 y 2

Lunes 23 de noviembre de 2026. Este documento cierra las brechas de los avances 1 y 2 que encontró la
[auditoría integral](auditoria-proyecto-frameworks-2026-11-23.md) (secciones 2 y 3). No se presenta en el Avance 3;
queda en el repositorio como respaldo para la entrega final y la defensa.

**Cómo leerlo.** Cada sección dice qué brecha cierra y de qué framework sale. Los datos vienen de la
[entrevista del 12 de noviembre](entrevista-encargado-2026-11-12.md), de AGENTS.md y de las entregas. Lo que se
propone y todavía nadie validó está marcado como **propuesta** o **pendiente**. Por regla del framework, nada aquí
inventa aprobaciones ni resultados (FW-IR 18.2).

| Sección | Brecha que cierra | Hito de origen | Referencia |
|---|---|---|---|
| [1. Árbol de problemas](#1-árbol-de-problemas) | Diagnóstico sin una técnica causal | Avance 1 | FW-IR 2.2 y 2.4 |
| [2. Objetivos medibles](#2-objetivos-medibles) | Objetivos específicos sin indicador ni meta | Avance 1 | FW-IR 2.5 y 2.6 |
| [3. Interesados y validación](#3-interesados-y-validación) | No se dijo quién valida ni cuándo | Avance 1 | FW-IR 0.4 y 3.1 |
| [4. Decisión de enfoque](#4-decisión-de-enfoque-dec-met) | Enfoque no justificado | Avance 1 | FW-IS 2 y P02 |
| [5. Plan semana a semana](#5-plan-semana-a-semana) | Plan sin calendario | Avance 1 | FW-IS 13.1 |
| [6. Verificación de requisitos](#6-verificación-de-requisitos) | Realismo sin verificar | Avance 2 | FW-IR 9.1 y 9.3 |
| [7. Plan de calidad](#7-plan-de-calidad) | Umbrales sin responsable, herramienta ni fecha de medición | Avance 2 | FW-IR 10.6 y P09 |
| [8. Decisiones técnicas (ADR)](#8-decisiones-técnicas-adr) | Decisiones técnicas sin alternativas registradas | Avance 2 | FW-IS 4.4 y P05 |
| [9. Validación con el encargado](#9-validación-con-el-encargado-playback) | El encargado no vio el prototipo | Avance 2 | FW-IR 11 y P12 |

El cuadro «objetivo del Avance 1 → estado actual», que también faltaba en el Avance 2, está en la
[sección 6 del CR-01](cr-01-linea-base-entrega-final.md#6-objetivos-específicos-del-avance-1-frente-a-esta-línea-base).

## 1. Árbol de problemas

Técnica: árbol de problemas en texto (FW-IR 2.4), elegido sobre el Ishikawa porque el problema tiene un núcleo
claro y causas que se encadenan. Cada causa cita el problema observado en la entrevista (P1 a P7).

**Problema central:** el gimnasio no sabe en tiempo real quién está adentro ni cuántos cupos quedan, y cada alumno
entrena sin un plan coordinado con el estado del gimnasio.

```text
CAUSAS (por qué ocurre)
├─ C1. El registro es en papel y se traspasa a Excel después            (P1)
│    └─ C1.1 No existe un identificador que el alumno ya tenga y se lea rápido
├─ C2. Solo se registra la entrada, nunca la salida                      (P2)
├─ C3. Dos profesores atienden gimnasio, cancha y tareas administrativas (dato de la entrevista)
│    └─ C3.1 El control del aforo depende de mirar la sala               (P3)
├─ C4. La habilitación se revisa a mano y la vigencia vive en Excel      (P6)
├─ C5. Los préstamos dependen de la memoria del profesor                 (P5)
└─ C6. No hay rutinas ni orientación sistematizada; cada alumno arma la suya

          ▼
PROBLEMA CENTRAL
          ▼

EFECTOS (qué produce)
├─ E1. Nadie sabe cuántas personas hay adentro; el límite de 20 se controla a ojo   (P3)
├─ E2. La espera se maneja a mano, a veces con un número de papel                    (P4)
├─ E3. Datos de asistencia tardíos y poco confiables para decidir                    (P1)
├─ E4. Esperas en poleas y press banca en horas peak (09:00 a 13:00)                 (P7)
├─ E5. Implementos sin devolver y TNE de garantía olvidadas                          (P5)
└─ E6. Tiempo de los profesores en tareas administrativas en vez de orientar         (C3)
```

**Lectura para la solución:** C1, C2 y C3.1 se atacan en el mismo momento, la entrada; por eso el flujo central parte
en el kiosco. C6 conecta con E4 y explica la rutina activada por la credencial. C4 y C5 tienen solución propia
(habilitación y préstamos). Esto respalda el orden del [CR-01](cr-01-linea-base-entrega-final.md): ingreso y
aforo primero, rutina después, préstamos al final.

## 2. Objetivos medibles

El objetivo general del Avance 1 sigue vigente en su sentido. Los específicos se reformulan como resultados
medibles (FW-IR 2.5), según la [línea base del CR-01](cr-01-linea-base-entrega-final.md).

**Objetivo general (reformulado):** desarrollar un sistema web que, a partir del ingreso con la credencial del
alumno, registre entradas y salidas, muestre el aforo en vivo y entregue a cada alumno su rutina del día ajustada a su
feedback, en el gimnasio de la USS Bellavista.

| # | Objetivo específico | Indicador | Línea base (entrevista) | Meta en el prototipo | Cómo se mide | Estado |
|---|---|---|---|---|---|---|
| OE1 | Registrar entradas y salidas sin papel | Porcentaje de visitas de la demo con entrada y salida registradas | 0 salidas registradas; entradas en papel | 100 % de las visitas de prueba | Prueba de sistema: entradas, salidas y cierre automático | Implementado; falta la hoja de pruebas |
| OE2 | Saber en todo momento cuántos alumnos hay adentro | Tiempo entre la entrada o salida y la actualización de `/aforo` | Conteo a ojo | 2 s o menos (RNF02) | Cronómetro en la prueba de CA10 | Implementado; medición formal pendiente |
| OE3 | Ordenar la espera cuando el gimnasio está lleno | Turnos atendidos en orden de llegada | Número de papel, a veces | 100 % en orden en las pruebas | Pruebas SQL de turnos y prueba de sistema | Implementado (42 pruebas SQL) |
| OE4 | Registrar el ingreso rápido en la entrada | Tiempo desde la credencial hasta el registro | Anotar nombre, RUT, carrera, fecha y hora a mano | 3 s o menos (RNF01) | Cronómetro en CA29 con el lector | Medición en curso (Pau) |
| OE5 | Entregar la rutina del día al entrar | Alumnos con sesión que reciben la rutina al pasar la credencial | No existe | 100 % en las pruebas; 2 s o menos | CA11 y CA12 | En línea base (CR-01) |
| OE6 | Ajustar la rutina según el feedback | Cargas de la próxima sesión según la regla R8 | No existe | 100 % de los casos de CA14 | Pruebas unitarias de la progresión | En línea base (CR-01) |
| OE7 | Avisar las máquinas en mantención | Rutinas con la advertencia cuando la máquina está En mantención | El alumno improvisa | 100 % en CA13 y CA26 | Prueba de sistema | En línea base (CR-01) |
| OE8 | Controlar préstamos y garantías | Préstamos con devolución y TNE registradas | Memoria del profesor | Próxima versión | CA19 a CA21 | Pospuesto (CR-01) |

**Límite de la medición:** el prototipo no opera en el gimnasio real (fuera del alcance), así que las metas se
miden en pruebas con datos ficticios. El efecto en la operación real (por ejemplo, menos tiempo administrativo de
los profesores) queda como medición futura de un piloto.

## 3. Interesados y validación

Mapa de interesados (FW-IR 3.1) y regla de responsabilidad: cada requisito tiene una fuente, alguien que resuelve
dudas y alguien que valida (FW-IR 0.4).

| Interesado | Interés | Aporta | Valida | Cuándo |
|---|---|---|---|---|
| Profesores encargados del gimnasio (dos) | Controlar ingreso, aforo, espera, préstamos y habilitación con menos trabajo manual | Problema, reglas, horarios, capacidad, inventario | Que el flujo resuelve su operación (Playback, sección 9) | Martes 24 nov, 17:00, y antes de la expo |
| Alumnos | Entrar rápido, saber si hay cupo, recibir una rutina | Uso y feedback | Usabilidad en el celular (CA32) | Pruebas de usabilidad con integrantes como alumnos ficticios; usuarios reales en la expo |
| Profesor del curso | Que el proyecto cumpla las bases y aplique el método | Bases, rúbricas, observaciones | Cada avance y la entrega final | 24 nov, 26 nov (afiche) y 1 a 3 dic |
| Equipo (5 integrantes) | Entregar a tiempo un prototipo defendible | Requisitos, diseño, código y pruebas | Revisión cruzada de cada pull request; comité de cambios | Continuo |
| Universidad (sede Bellavista) | Mejor uso de sus instalaciones; sin riesgo con los datos | Contexto institucional | Implícito: datos ficticios y sin conexión a sus sistemas (D11) | No aplica en el prototipo |

**Quién valida qué:**

| Área | Fuente | Resuelve dudas | Valida |
|---|---|---|---|
| Ingreso, aforo y espera | Entrevista (P1 a P4) | Vicente | Encargado |
| Rutinas y progresión | Entrevista (pregunta 11) y D12 | Isidora y Benjamín | Encargado y alumnos en la expo |
| Préstamos | Entrevista (pregunta 12) | Pau | Encargado |
| Habilitación y certificados | Entrevista (P6) | Bastián | Encargado |
| Calidad y pruebas | RNF01 a RNF11 | Bastián | Equipo y profesor del curso |

## 4. Decisión de enfoque (DEC-MET)

Formato de la plantilla FW-IS P02.

| Campo | Contenido |
|---|---|
| Problema | Cómo organizar 4 semanas de trabajo de 5 estudiantes, con requisitos que se iban a precisar en la entrevista |
| Opciones evaluadas | Cascada, RAD, RUP/AUP, Scrum y desarrollo incremental con prototipos |
| Elección | **Incremental con prototipos**: un incremento por avance (propuesta → análisis y prototipo → flujo de ingreso → rutina) y un prototipo de Figma Make para validar antes de programar |
| Por qué no cascada | Los requisitos cambiaron después de la propuesta (entrevista del 12 nov: D01 a D11) y cada martes hay una entrega que muestra avance |
| Por qué no Scrum completo | Con 4 semanas y 10 h por persona a la semana, sprints, ceremonias y roles formales consumen tiempo que no hay; se toman ideas sueltas (incrementos cortos, revisión cada martes, lista de pendientes priorizada) |
| Por qué no RUP/AUP | Pide más artefactos y fases de lo que justifica un producto pequeño (FW-IR 0.3) |
| Por qué no RAD puro | Sirve para la idea de prototipar rápido, pero no da la disciplina de requisitos y trazabilidad que pide el curso |
| Roles | Los de AGENTS.md 8; el jefe de proyecto actúa como responsable de producto y prioridades |
| Señal para revisarla | Si un incremento no se puede demostrar el martes que corresponde. Pasó en el Avance 3 con la rutina y se resolvió con el CR-01 |
| Estado | Aplicada desde el 10 de noviembre; registrada el 23 de noviembre |

## 5. Plan semana a semana

Reconstruido el 23 de noviembre a partir de AGENTS.md, las entregas y el historial del repositorio. La columna
«Planificado» es lo que exigían las bases y lo que se había comprometido; «Real» es lo que pasó.

| Semana | Planificado | Real | Desviación |
|---|---|---|---|
| 1 (hasta el mar 10 nov) | Propuesta, problema, objetivos, alcance, riesgos y roles (Avance 1) | Avance 1 presentado y aprobado con 7,0 | Ninguna |
| 2 (11 al 17 nov) | Levantamiento, requisitos, casos de uso, criterios, modelo de datos, arquitectura y prototipo (Avance 2) | Entrevista (12 nov), requisitos y criterios, prototipo en Figma revisado (16 nov), prueba de tarjetas con NFC Tools (16 nov), repositorio, Supabase y Vercel, login con roles y catálogo. Avance 2 con 7,0 | El objetivo de reparto se volvió experimental (D08) y el reemplazo automático pasó a una advertencia (D06) |
| 3 (18 al 24 nov) | Estimación, construcción del flujo central con rutina, pruebas iniciales y borrador del afiche (Avance 3) | Lector comprado y probado (20 nov); base del flujo de ingreso y pantallas en producción (22 nov); estimación con el método de clase (23 nov); auditoría y correcciones de interfaces (23 nov) | La rutina en el celular no se alcanzó; se registra el CR-01 |
| 4 (25 al 30 nov) | Terminar el alcance y congelar | Según el [CR-01](cr-01-linea-base-entrega-final.md#7-acciones-y-responsables): rutina mínima, afiche el 26, pruebas el 28 y 29, congelamiento el 30 | Por confirmar |
| Expo (1 al 3 dic) | Demo en vivo, afiche instalado y defensa | Pendiente | — |

**Lección para la estimación (FW-IS P17):** el plan inicial no se contrastó con la capacidad del equipo. La
estimación del Avance 3 debió hacerse antes o, al menos, con un primer bottom-up en la semana 2.

## 6. Verificación de requisitos

Las cinco comprobaciones de la clase (FW-IR 9.1) aplicadas por módulo. **Revisión preparada por Vicente con apoyo de
IA; falta la revisión de otro integrante** (FW-IR 9.2).

| Módulo | Validez (responde a un problema real) | Consistencia (sin contradicciones) | Totalidad (no falta nada clave) | Realismo (cabe en el tiempo y la tecnología) | Verificabilidad (se puede probar) |
|---|---|---|---|---|---|
| Ingreso, espera y aforo (RF01 a RF10) | ✅ P1 a P4 | ✅ | 🟡 Faltaba un criterio directo para una visita abierta por alumno (R5); lo cubren las pruebas SQL | ✅ Construido | ✅ CA01 a CA10, CA29 y CA31 |
| Rutinas (RF11 a RF18) | ✅ C6, P7 y entrevista | 🟡 R8 dice que manda la versión del profesor, pero RF14 queda pospuesto | ✅ | 🔴 Los tres orígenes no caben; se reduce a la rutina generada (CR-01) | ✅ CA11 a CA16, CA24 y CA38 |
| Catálogo y máquinas (RF19 a RF21) | ✅ P7 y entrevista | ✅ | 🟡 Faltan los ajustes de algunas máquinas | 🟡 Datos por SQL sí; pantallas de edición no | ✅ CA25 a CA27 |
| Préstamos (RF22 a RF24) | ✅ P5 | 🟡 R9: falta confirmar si una TNE pendiente bloquea otro préstamo | ✅ | 🔴 No cabe esta semana; básico opcional (CR-01) | ✅ CA19 a CA21 |
| Administración (RF25 y RF26) | ✅ P6 | ✅ | ✅ | 🟡 La regla se valida en la base; sin pantalla | 🟡 CA34 pide edición «desde el panel» (ver RNF08 en la sección 7) |
| Registro corporal (RF27) | 🟡 No salió de la entrevista; viene del alcance del Avance 1 | ✅ | ✅ | 🔴 Pospuesto (CR-01) | ✅ CA22 y CA39 |
| Prioridad media (RF28 a RF31) | 🟡 RF28 con factibilidad en duda (D08) | ✅ | 🟡 Faltan la métrica del reparto y el umbral de inasistencia | ➖ Condicionados al núcleo desde el inicio | 🟡 CA40 y CA43 dependen de esa métrica |
| No funcionales (RNF01 a RNF11) | ✅ | 🟡 RNF04 incluye el QR, que el CR-01 reemplaza por el ingreso manual | ✅ | ✅ | ✅ Todos con medida |

**Acciones que salen de esta verificación:**
1. ✅ Agregar un criterio para R5 (una visita abierta por alumno): **CA44**, agregado el 23 de noviembre en
   `requisitos-casos-uso-criterios.md`, respaldado por el índice único y la prueba R5 de las pruebas SQL.
2. Decidir R9 con el encargado el martes (sección 9).
3. Ajustar RNF04 y CA31: el respaldo es el ingreso manual mientras el QR esté pospuesto.
4. Decidir RNF08: o se hace una pantalla mínima para la capacidad (una sola cifra editable), o se acepta la edición
   por SQL como limitación declarada.

## 7. Plan de calidad

Matriz de atributos, métricas y evidencias (FW-IR 10.6 y P09). Atributos elegidos por riesgo según ISO/IEC 25010.

| RNF | Atributo | Métrica y umbral | Herramienta | Responsable | Cuándo | Criterio | Evidencia o estado |
|---|---|---|---|---|---|---|---|
| RNF01 | Eficiencia: tiempo de respuesta | Ingreso en 3 s o menos | Cronómetro y los milisegundos de «Últimas lecturas» del kiosco | Pau | 23 nov y 30 nov | CA29 | ✅ 1,2 s o menos en 4 lecturas, medido desde el video ([medición](medicion-ca29-2026-11-23.md)); repetir en la red de la universidad |
| RNF02 | Eficiencia: tiempo real | Aforo y rutina en 2 s o menos | Cronómetro entre dos pantallas | Pau y Benjamín | 22 nov (aforo), 29 nov (rutina) | CA10 y CA11 | `/profesor/espera` medida el 22 nov (turno 1.011 ms, llamado 454 ms); falta `/aforo` formal y la rutina |
| RNF03 | Compatibilidad | Funciona en el computador, Android y iPhone sin instalar nada | Prueba manual en los tres equipos | Bastián | 29 nov | CA30 | Pendiente |
| RNF04 | Compatibilidad | Lector como teclado sin drivers; respaldo | Lector comprado | Pau | 20 nov | CA31 | Lector probado con TNE y TUI; respaldo según el CR-01 |
| RNF05 | Usabilidad | Desde 360 px; acciones principales en 2 toques o menos | Herramientas de desarrollo del navegador y un celular | Benjamín | 23 nov y 29 nov | CA32 | Parcial (auditoría de interfaces); repetir con la rutina |
| RNF06 | Seguridad | RLS en todas las tablas; un alumno no ve datos de otro | Pruebas SQL y advertencias de seguridad de Supabase | Isidora | 22 nov y 29 nov | CA23 | RLS activo; falta el caso con dos alumnos y activar la protección contra claves filtradas |
| RNF07 | Privacidad | Solo datos ficticios; del certificado solo la vigencia | Revisión de los datos de prueba | Bastián | 29 nov | CA33 | 25 alumnos ficticios; revisar las capturas antes de publicarlas |
| RNF08 | Mantenibilidad: configuración | Parámetros editables desde el panel | Prueba manual | Isidora | 29 nov | CA34 | 🔴 Hoy solo por SQL (ver la acción 4 de la sección 6) |
| RNF09 | Disponibilidad | URL pública y video de respaldo | Vercel y el video | Pau | 30 nov | CA35 | URL activa; video en curso |
| RNF10 | Mantenibilidad: historial | Cambios por pull request revisado y SQL en el repositorio | GitHub | Vicente | Continuo | CA36 | Pull requests #7, #8 y #9; SQL 001 a 009 |
| RNF11 | Usabilidad: idioma | Interfaz en español | Recorrido de las pantallas | Benjamín | 23 nov | CA37 | ✅ Cumple (auditoría de interfaces) |
| — | Desempeño general | Puntaje de Lighthouse en `/aforo` e `/ingreso` | Lighthouse | Bastián | 23 nov | Complementario | ✅ `/aforo` 88 · 94 · 100 · 100; `/ingreso` 88 · 100 · 100 · 100 |

## 8. Decisiones técnicas (ADR)

Formato de la plantilla FW-IS P05. Resumen de decisiones ya tomadas que estaban repartidas en las PPT.

### ADR-01 — Next.js, Supabase y Vercel

| Campo | Contenido |
|---|---|
| Contexto | Hace falta una app web para tres roles, con base de datos, inicio de sesión, tiempo real y una URL pública para la demo, construida en 3 semanas |
| Alternativas | (a) Next.js + Supabase + Vercel; (b) backend propio (Node y Express) con PostgreSQL en un servidor; (c) Firebase; (d) app nativa (fuera del alcance) |
| Decisión | (a) |
| Motivos | Supabase da PostgreSQL, Auth, Row Level Security y Realtime sin servidor propio; Vercel publica cada push y una vista previa por pull request; la plantilla oficial `with-supabase` resuelve el inicio de sesión. Todo con planes gratuitos |
| Consecuencias | Dependencia de dos servicios externos y de internet en la demo (riesgo R05, con hotspot y video). Las reglas se escriben en SQL (ADR-02) |
| Estado | Vigente desde el Avance 1 |

### ADR-02 — Reglas de ingreso en la base de datos

| Campo | Contenido |
|---|---|
| Contexto | Las reglas 1 a 6 deben cumplirse igual con el lector, el ingreso manual y el QR futuro, y no pueden saltarse desde el navegador |
| Alternativas | (a) Validar en el navegador; (b) validar en rutas de servidor de Next.js; (c) una función de PostgreSQL (`registrar_ingreso`) que valida y registra en una sola transacción |
| Decisión | (c) |
| Motivos | Un solo lugar para las reglas; la transacción evita que dos ingresos simultáneos superen la capacidad; se prueba con SQL (42 casos); solo la ejecutan profesor y administrador |
| Consecuencias | Más lógica en SQL, que el equipo conoce menos. Se mitiga con el [contrato del flujo](contrato-flujo-ingreso.md) y las pruebas |
| Estado | Vigente desde el 22 de noviembre (pull request #8) |

### ADR-03 — Tiempo real con Supabase Realtime y respaldo periódico

| Campo | Contenido |
|---|---|
| Contexto | `/aforo`, `/profesor/espera` y la rutina deben actualizarse en 2 s o menos (RNF02) |
| Alternativas | (a) Recargar la página cada pocos segundos; (b) WebSockets propios; (c) Supabase Realtime sobre la tabla `aforo`, con una relectura de respaldo cada 15 s |
| Decisión | (c) |
| Motivos | Cambios al instante sin servidor propio; el respaldo cubre una desconexión del canal (riesgo R04) |
| Consecuencias | La pantalla puede quedar hasta 15 s atrasada si se cae Realtime. Lectura compartida en `lib/aforo/useAforo.ts` |
| Estado | Vigente desde el 22 de noviembre; reutilizado en el kiosco el 23 de noviembre (pull request #9) |

### ADR-04 — Lector USB en modo teclado

| Campo | Contenido |
|---|---|
| Contexto | Hay que leer la TNE y la TUI (13,56 MHz) desde el computador del gimnasio, sin instalar software |
| Alternativas | (a) Web NFC en un celular Android; (b) lector USB de 13,56 MHz en modo teclado (HID); (c) lector de pared de control de acceso; (d) lector de 125 kHz |
| Decisión | (b) |
| Motivos | Funciona como un teclado en cualquier navegador, sin drivers; cuesta $18.980; (a) obliga a usar un celular Android con Chrome; (c) es caro y está pensado para su propio software; (d) no lee la TNE. Detalle en [pruebas de tarjetas](pruebas-tarjetas.md) |
| Consecuencias | El UID llega en decimal con los bytes invertidos y hay que normalizarlo (`normalizarUid`, con pruebas); el campo de lectura debe tener el foco |
| Estado | Vigente; probado el 20 de noviembre |

## 9. Validación con el encargado (Playback)

**Estado: pendiente.** Nadie del equipo ha mostrado el prototipo programado al encargado. Esta sección deja
preparada la sesión del martes 24 de noviembre, cerca de las 17:00 (FW-IR 11), y el acta para completarla después.

### Guion de la sesión (unos 20 minutos)

1. **Contexto (2 min):** recordar los problemas que él describió (P1 a P7) y qué se decidió en la entrevista.
2. **Demo (8 min):** entrada con la TNE, rechazo por certificado vencido, gimnasio lleno con turno, salida que llama
   el turno y `/aforo` actualizándose.
3. **Línea base (5 min):** qué se construye esta semana (rutina con feedback y advertencia de mantención) y qué se
   pospone (préstamos completos, rutinas del profesor y del alumno, registro corporal), según el CR-01.
4. **Preguntas abiertas (5 min):**
   - ¿El flujo de ingreso le sirve tal como está? ¿Qué cambiaría?
   - ¿Prefiere que el turno se llame solo (D14) o un botón para llamarlo?
   - R9: si un alumno devolvió todos los implementos pero no retiró su TNE, ¿puede pedir otro préstamo?
   - Cantidades reales de implementos para préstamo.
   - Fechas oficiales del período académico.
   - ¿Está de acuerdo con priorizar la rutina sobre los préstamos?

### Acta (completar después de la sesión)

```markdown
## Acta de Playback — martes 24 de noviembre de 2026
- Asistentes:
- Qué se mostró:
- Qué validó el encargado (con sus palabras):
- Qué pidió cambiar:
- Respuestas a las preguntas abiertas:
  - Turno automático o con botón:
  - R9 (TNE pendiente):
  - Cantidades de implementos:
  - Período académico:
  - Prioridad rutina frente a préstamos:
- Decisiones nuevas (D19 en adelante):
- Acciones, responsables y fechas:
```

Si la sesión no se puede hacer el martes, el plan B es enviarle el video del flujo y las preguntas por escrito, y
anotar la respuesta en la misma acta.

## 10. Qué actualizar cuando se use este documento

- **AGENTS.md 10:** marcar como hechas las brechas de los avances 1 y 2 de la auditoría y dejar como pendientes la
  revisión cruzada de la sección 6, las cuatro acciones de verificación y el acta de la sección 9.
- **Auditoría integral:** cambiar a ✅ las filas de diagnóstico, objetivos, interesados, enfoque, plan, ADR y plan de
  calidad cuando otro integrante revise este documento.
