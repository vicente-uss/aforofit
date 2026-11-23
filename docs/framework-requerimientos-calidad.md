# Framework de Ingeniería de Requerimientos y Aseguramiento de la Calidad

**Guía de trabajo reutilizable para proyectos de software**  
**Base académica:** asignatura *Ingeniería de Requerimientos y Aseguramiento de la Calidad*, Universidad San Sebastián (USS).  
**Docente responsable de las clases:** Prof. **Rodrigo Caballero Vivanco**.  
**Edición del framework:** noviembre de 2026.

> **Propósito.** Este documento transforma los contenidos prácticos de las clases en un procedimiento de trabajo autónomo. No es un apunte de diapositivas ni una exigencia de usar todas las técnicas. Explica **qué hacer, cuándo elegir cada opción, qué producir, qué validar y cuándo avanzar**. Los ejemplos son hipotéticos y sirven para cualquier dominio. Las plantillas, criterios de selección y «puertas de salida» constituyen una organización operativa del contenido docente, no un estándar oficial de la USS.

**Auditoría:** contrastado lámina por lámina con los PDF oficiales de los capítulos 01 a 09 el 23 de noviembre de 2026. Cada sección indica su **fuente** (capítulo y diapositivas); lo que no sale de una lámina se marca como *criterio del framework*. La transcripción citable del material está en [ingenieria-de-requerimientos.md](ingenieria-de-requerimientos.md). Para diseñar, construir, probar y estimar, el complemento es el [Framework de Ingeniería de Software](framework-ingenieria-de-software.md).

**Alcance:** identificar y delimitar un problema; comprender los procesos y sus participantes; obtener, analizar, especificar, priorizar, validar y gestionar requisitos; establecer atributos de calidad; planificar su comprobación; medir resultados y gestionar cambios. **Fuera de alcance:** prescribir un lenguaje, arquitectura, plataforma o metodología de construcción.

---

## 0. Cómo utilizar este framework

*Fuente: criterio del framework; roles de 0.4 inspirados en el capítulo 02, diapositiva 21.*

### 0.1. Regla principal

Trabaja sobre **necesidades demostrables**, no sobre funciones imaginadas. No declares un requisito aprobado porque parezca razonable. Distingue siempre:

- **Hecho comprobado:** respaldado por una entrevista, documento, observación, medición o decisión formal.
- **Necesidad expresada:** lo que una parte interesada pide, todavía sujeto a análisis.
- **Hipótesis:** explicación o solución propuesta que falta contrastar.
- **Decisión:** opción elegida, con motivo, responsable y fecha.
- **Requisito:** condición acordada que el sistema deberá satisfacer.
- **Criterio de aceptación:** condición observable para decidir si un requisito se cumple.
- **Evidencia de prueba:** resultado real de una ejecución; no se debe confundir con el criterio esperado.

### 0.2. Flujo de trabajo textual

El recorrido de referencia es:

```text
Necesidad o problema detectado
  ↓
[1] Iniciar y elegir el enfoque de trabajo
  ↓
[2] Diagnosticar el problema y definir objetivos medibles
  ↓
[3] Identificar interesados y levantar evidencia
  ↓
[4] Describir el proceso actual y el proceso deseado
  ↓
[5] Analizar, clasificar y resolver conflictos entre necesidades
  ↓
[6] Modelar las interacciones y los escenarios
  ↓
[7] Priorizar y delimitar el alcance realizable
  ↓
[8] Especificar requisitos y criterios de aceptación
  ↓
[9] Verificar requisitos y validarlos con interesados
  ↓
[10] Definir atributos, mediciones y plan de calidad
  ↓
[11] Alinear decisiones mediante sesiones de revisión (Playbacks)
  ↓
[12] Entregar una línea base para diseño, desarrollo y pruebas
  ↓
[13] Gestionar cambios, desviaciones y resultados
  ↺ Volver a las etapas afectadas cada vez que cambie una necesidad.
```

**No es una cascada obligatoria.** En un proyecto incremental, se recorre este circuito por incremento; en Scrum, por objetivo de producto e historias refinadas; con prototipos, por ciclo de aprendizaje; y en un trabajo de requisitos estables puede ejecutarse de manera más secuencial.

### 0.3. Qué producir según el tamaño del proyecto

| Situación | Mínimo útil | Ampliar si corresponde |
|---|---|---|
| Prototipo exploratorio | Problema, interesados, hipótesis, escenarios, decisiones y feedback | ERS completa cuando se confirme el alcance |
| Producto pequeño | Alcance, lista de requisitos, criterios, prioridades, casos críticos, trazabilidad y plan de verificación | BPMN, riesgos, catálogos y métricas detalladas |
| Producto mediano con varias áreas | Diagnóstico, procesos actual/futuro, matriz de interesados, ERS, trazabilidad, validación y control de cambios | Revisiones periódicas, catálogo de atributos y plan formal de calidad |
| Sistema crítico, contractual o regulado | Todo lo anterior, evidencias, responsables, restricciones, aprobaciones y control de versiones más estrictos | Evaluaciones independientes y procedimientos específicos de la organización |

La profundidad documental la determina el **riesgo de equivocarse**, no el número de páginas que se desea escribir.

### 0.4. Roles; una persona puede asumir más de uno

| Rol | Responsabilidad en este framework |
|---|---|
| Patrocinador o dueño del problema | Define el resultado que necesita y autoriza las decisiones de negocio |
| Usuarios y otros interesados | Describen necesidades, restricciones y escenarios; validan lo que les corresponde |
| Responsable de requisitos | Conduce el análisis, elimina ambigüedades y administra la especificación y la trazabilidad |
| Responsable de producto o prioridad | Ordena el valor del trabajo y resuelve prioridades junto a los interesados |
| Diseño y desarrollo | Evalúan factibilidad, interfaces, dependencias y consecuencias de requisitos |
| Responsable de calidad/pruebas | Traduce criterios a verificaciones, define métricas y conserva evidencia |
| Responsable de cambios | Decide o canaliza cambios según el nivel de impacto y las reglas acordadas |

**Regla de responsabilidad:** cada requisito debe tener al menos una fuente, un responsable de resolver dudas y una persona o rol con autoridad para validarlo.

---

## 1. Elegir el enfoque de desarrollo antes de profundizar

*Fuente: capítulo 02, diapositivas 9–20.*

**Pregunta:** ¿con qué frecuencia necesitamos revisar las necesidades y tomar decisiones?

### 1.1. Matriz de selección

| Enfoque visto en clases | Elegir cuando… | Cómo trabajar los requisitos | Principal precaución |
|---|---|---|---|
| **Cascada** | Alcance relativamente estable, dependencias secuenciales o compromisos de aprobación definidos | Analizar y especificar ampliamente antes de construir; según la lámina, la ingeniería de requerimientos se realiza al inicio y una sola vez (02-12) | Cambios tardíos pueden generar mucho retrabajo; tratarlos con control de cambios es criterio del framework |
| **Incremental** | Se conoce el objetivo global, pero es conveniente entregar capacidades útiles por etapas | Mantener visión general y refinar antes de cada incremento | No descuidar dependencias entre incrementos |
| **Prototipado** | Usuarios o equipo no logran describir adecuadamente flujos, interfaces o comportamientos | Proponer, mostrar, observar, modificar y confirmar requisitos | Un prototipo no demuestra que la implementación final ya funciona |
| **Modelo en V** | La trazabilidad entre especificación y comprobación es decisiva | Planificar verificaciones desde el refinamiento de necesidades | No confiar en una prueba final como único control |
| **Espiral** | Existen riesgos técnicos o de negocio importantes que requieren análisis iterativo | Revisar requisitos y riesgos en cada ciclo | Evitar iterar sin criterios de salida ni reducción de incertidumbre |
| **Scrum** | Hay un producto evolutivo, retroalimentación frecuente y capacidad de priorizar trabajo por ciclos | Mantener un backlog; refinar necesidades e historias antes de seleccionarlas para el sprint | Una historia corta no sustituye criterios, reglas ni dependencias |
| **Design Thinking** | El problema o la experiencia del usuario aún se comprende insuficientemente | Empatizar, definir, idear, prototipar y probar hipótesis antes de comprometer una solución | No confundir una idea validada parcialmente con una especificación completa |

La elección no es necesariamente exclusiva: es válido **descubrir mediante Design Thinking**, **aclarar con prototipos**, **entregar incrementalmente** y **usar trazabilidad de pruebas al estilo del modelo V**. Documenta la combinación elegida.

### 1.2. Pasos de decisión

1. Determina cuán estable es el problema y cuán probable es que cambien las necesidades.
2. Identifica el costo de un defecto, de un retraso y de modificar una decisión.
3. Estima cada cuánto tiempo puede dar feedback un usuario real.
4. Comprueba si hay compromisos formales de alcance, fechas o aceptación.
5. Escoge el enfoque y anota por qué descartaste las alternativas relevantes.
6. Define **cuándo volverás a evaluar** el enfoque (por ejemplo, después de un prototipo o incremento).

**Entregable:** registro de decisión con enfoque, condiciones que justifican la elección, ciclo de revisión y responsable.

### 1.3. Traducción textual de los ciclos visuales de clase

**Scrum — secuencia de trabajo representada en la lámina:**

```text
Objetivo / necesidades del producto
  → Backlog de producto ordenado
  → Planificación de sprint (selección y aclaración)
  → Backlog del sprint
  → Trabajo coordinado y revisión diaria
  → Incremento del producto
  → Revisión con interesados y retroalimentación
  → Retrospectiva sobre cómo trabaja el equipo
  ↺ Actualización del backlog para el siguiente sprint
```

El orden del backlog puede cambiar al aprender; el alcance del sprint debe gestionarse según los compromisos del equipo. Una revisión de producto y una retrospectiva responden preguntas distintas: **qué producto se consiguió** frente a **cómo mejorar el trabajo**.

**Design Thinking — esquema de descubrimiento de la lámina:**

```text
EMPATIZAR (conocer experiencia de usuarios)
   → DEFINIR (formular problema)
   → IDEAR (proponer alternativas)
   → PROTOTIPAR (hacer tangible una idea)
   → TESTEAR (probar con usuarios y aprender)
   ↺ Regresar a la fase necesaria según lo descubierto
```

Estas representaciones se incluyen para entender las **decisiones y realimentaciones** de los diagramas originales. No convierten el documento en una implementación completa de Scrum o Design Thinking.

**Puerta de salida 1:** sabemos cómo se revisarán, aprobarán y modificarán los requisitos. No hace falta decidir toda la arquitectura.

---

## 2. Diagnosticar el problema antes de proponer funciones

*Fuente: capítulo 05, diapositivas 3–15; capítulo 06, diapositivas 3–4.*

**Entrada:** demanda inicial, síntoma observado o solicitud de solución.  
**Salida:** problema central, evidencia, causas y consecuencias, objetivos y límites iniciales.

### 2.1. Formular el problema

Escribe el problema sin presuponer una tecnología:

```text
En [proceso o contexto], [grupo afectado] experimenta [problema observable],
según [fuente o medición], lo que ocasiona [consecuencia].
Se desconoce o debe comprobarse [hipótesis o causa].
```

**Evitar:** «No existe una aplicación móvil». Eso describe la ausencia de una solución.  
**Preferir:** «Las solicitudes llegan por varios canales y no pueden seguirse de manera consistente, lo que dificulta conocer su estado». La aplicación, si resulta apropiada, vendrá después.

Registrar:

| Campo | Qué responder |
|---|---|
| Contexto | ¿Dónde y cuándo ocurre? |
| Afectados | ¿A quién perjudica y de qué manera? |
| Magnitud | ¿Frecuencia, volumen, duración o costo? |
| Situación actual | ¿Cómo se intenta resolver hoy? |
| Evidencia | ¿Quién lo indicó o qué dato lo muestra? |
| Consecuencias | ¿Qué ocurre si no se hace nada? |
| Supuestos | ¿Qué afirmaciones aún debemos comprobar? |
| Límites | ¿Qué parte del problema sí puede abordar el proyecto? |

### 2.2. Elegir una técnica de análisis causal

| Técnica | Cuándo elegirla | Qué produce | Riesgo a evitar |
|---|---|---|---|
| **Diagrama causa-efecto / Ishikawa** | Hay varios factores que podrían explicar un síntoma | Causas agrupadas por categorías y subcausas | Tratar como comprobada una relación meramente sospechada |
| **Modelo 4M** | Se necesita un primer ordenamiento sencillo de causas | Personas, máquinas, materiales y métodos | Forzar causas que no encajan; renombrar categorías si ayuda |
| **Modelo 6M** | Es útil examinar además el ambiente y la medición | Personas, máquinas, materiales, métodos, medición y medioambiente/entorno | Llenar todas las ramas por obligación |
| **Árbol de problemas** | Importa mostrar la relación *causas → problema → efectos* | Jerarquía de causas y consecuencias | Confundir un efecto con una causa |
| **Focus group** | Diferentes usuarios comparten experiencias que se necesitan contrastar | Percepciones, acuerdos, diferencias e hipótesis | Considerar la opinión del grupo como medición objetiva |

Estas técnicas son **opciones**, no entregables obligatorios simultáneos.

### 2.3. Convertir el Ishikawa a un formato textual reutilizable

La imagen de las «espinas de pescado» se puede expresar sin dibujo:

```text
EFECTO / PROBLEMA CENTRAL: [enunciado observable]
|
+-- PERSONAS: [causa A] → [subcausa A.1]; [causa B]
+-- MÉTODOS: [procedimiento A] → [subcausa]; [procedimiento B]
+-- MÁQUINAS / TECNOLOGÍA: [equipo o sistema A]
+-- MATERIALES / INSUMOS: [dato o recurso insuficiente]
+-- MEDICIÓN: [métrica inexistente, registro incompleto]
+-- MEDIOAMBIENTE / ENTORNO: [condiciones físicas u organizacionales]
```

**Lectura del esquema:** las ramas representan *familias de posibles causas* y sus subramas representan *causas secundarias y terciarias*. Ninguna flecha causal queda demostrada solo por aparecer en el esquema.

Procedimiento:

1. Escribe el efecto de forma específica.
2. Selecciona 4M, 6M o categorías ajustadas al contexto.
3. Recoge causas candidatas, evitando juzgarlas prematuramente.
4. Relaciona cada causa con evidencia existente o una comprobación pendiente.
5. Separa **causa raíz**, **factor contribuyente** y **síntoma** cuando haya información suficiente.
6. Delimita qué causas están dentro de las posibilidades reales del proyecto.

### 2.4. Convertir el árbol de problemas a relaciones textuales

```text
CAUSAS RAÍZ
  ├─ Causa 1 ──┐
  ├─ Causa 2 ──┼──> PROBLEMA CENTRAL
  └─ Causa 3 ──┘          │
                          ├──> Efecto directo 1 ──> Consecuencia 1
                          └──> Efecto directo 2 ──> Consecuencia 2
```

**Parte inferior del árbol:** raíces = causas.  
**Tronco:** problema central.  
**Parte superior:** ramas = efectos.  

Si el proyecto solo puede intervenir sobre una de varias causas, hazlo explícito: **alcance del proyecto ≠ totalidad del problema organizacional**.

### 2.5. Formular objetivos generales y específicos

El **objetivo general** expresa el cambio buscado. Los **objetivos específicos** indican resultados parciales que contribuyen al general. La estructura del material de clase se puede usar así:

```text
OBJETIVO = X (qué se quiere lograr) + Y (mediante qué enfoque) + Z (para qué fin)
```

Ejemplo ilustrativo: «Reducir el tiempo de seguimiento de solicitudes mediante un proceso digital centralizado, para que los responsables puedan conocer su estado sin depender de consultas manuales».

No es obligatorio prometer un medio tecnológico en el objetivo si todavía se está comparando soluciones: en ese caso, deja «mediante qué» como hipótesis a validar.

Usualmente, aunque no de forma obligatoria, el **objetivo general** se deriva del efecto o problema central del Ishikawa y los **objetivos específicos**, de las causas que el proyecto abordará (05-11, 05-13).

**Comprobación SMART** (05-12):

| Criterio | Pregunta para revisar el objetivo |
|---|---|
| S · Específico (¿qué?) | ¿Qué se cambiará exactamente? |
| M · Medible (¿cuánto?) | ¿Con qué variable y procedimiento se medirá? |
| A · Alcanzable (¿cómo?) | ¿Es viable con las restricciones conocidas? |
| R · Realista (¿con qué?) | ¿Con qué recursos, herramientas y equipo se logrará? |
| T · Tiempo (¿cuándo?) | ¿En qué periodo se espera el resultado? |

### 2.6. Convertir el esquema visual de medición a tabla

| Situación actual | Objetivo específico | Situación esperada | Métrica | Criterio de éxito |
|---|---|---|---|---|
| Un trámite demora 60 minutos en una muestra inicial | Reducir el tiempo de tramitación | Máximo 15 minutos en el escenario acordado | Minutos entre inicio y cierre | Mediana ≤ 15 minutos en una muestra definida, bajo condiciones comparables |

En el ejemplo de clase, el tiempo deseado de 15 minutos equivale al **25 % del tiempo original** de 60 minutos. Esto significa **una reducción del 75 %**, no del 25 %. La muestra, el periodo y el estadístico deben definirse para que el criterio sea comprobable.

**Orden para construir la tabla:** primero preguntar «¿qué voy a medir?»; después medir la situación actual; definir situación esperada; y finalmente fijar el umbral de éxito. No confundir un **objetivo de negocio** con un **requisito específico del sistema**.

**Puerta de salida 2:** existe una definición de problema respaldada por evidencia o marcada como hipótesis; hay objetivos medibles y el alcance inicial no promete resolver causas fuera del control del proyecto.

---

## 3. Identificar interesados y realizar el levantamiento de información

*Fuente: capítulo 03, diapositivas 4–9; capítulo 05, diapositiva 8; capítulo 02, diapositiva 21.*

**Entrada:** problema y objetivos iniciales.  
**Salida:** mapa de interesados, plan de consulta y registro de hallazgos trazables.

### 3.1. Mapear quién aporta información y quién valida

Considera al menos: quienes usan el producto, quienes reciben sus resultados, administradores del proceso, responsables de negocio, operadores, equipo de desarrollo, personal de pruebas, mantenimiento y, si corresponde, interesados externos o regulatorios.

| Interesado / rol | Interés o necesidad | Evidencia disponible | Poder para decidir | Cómo participará |
|---|---|---|---|---|
| [rol A] | [necesidad] | [fuente] | [sobre qué puede aprobar] | Entrevista y validación |
| [rol B] | [necesidad] | [fuente] | [sobre qué puede aprobar] | Observación y revisión |

**No equiparar poder jerárquico y conocimiento del uso real.** Una persona puede aprobar presupuesto sin conocer las excepciones diarias del proceso.

### 3.2. Elegir la técnica de elicitación según la pregunta

| Necesitas averiguar… | Técnica preferente | Evidencia que conservar | Complementar con… |
|---|---|---|---|
| Por qué alguien realiza una actividad o qué espera | **Entrevista** individual | Preguntas, respuestas, contexto, fecha | Observación si el relato y la práctica difieren |
| Opiniones de muchas personas sobre preguntas comunes | **Cuestionario** | Formulario, universo, respuestas y limitaciones de muestra | Entrevistas para explicar resultados |
| Cómo ocurre realmente el trabajo | **Observación** | Pasos, tiempos, excepciones, roles y condiciones | Entrevista posterior para aclarar intenciones |
| Qué hace un sistema actual | **Análisis de sistemas existentes** | Interfaces, entradas, salidas, reglas, restricciones y pruebas exploratorias | Entrevistas y documentación disponible |
| Alternativas posibles ante un problema abierto | **Lluvia de ideas** | Ideas sin filtrar y criterios usados al seleccionarlas | Investigación de factibilidad |
| Qué significa una interacción difícil de describir | **Prototipo** | Versión mostrada, tareas del usuario, comentarios y cambios | Casos de uso y criterios de aceptación |
| Cómo interactúan roles y sistema para cumplir un objetivo | **Casos de uso** | Actores, disparador, flujo y resultados | BPMN si interesa el proceso completo |
| Tensiones y diferencias entre grupos | **Focus group / taller** | Puntos comunes, desacuerdos y evidencia | Entrevistas individuales para temas sensibles |

Las láminas presentan **cinco técnicas tradicionales**: entrevistas y cuestionarios, análisis de sistemas existentes, lluvia de ideas, prototipos y casos de uso (03-4 a 03-9); el focus group viene del capítulo 05 (05-8). La **observación** es un agregado del framework.

No es necesario entrevistar a todos con el mismo cuestionario; cada técnica debe responder una incertidumbre concreta.

### 3.3. Procedimiento de entrevista

1. Define qué decisión debe permitir tomar la entrevista.
2. Selecciona participantes por su relación con el problema, no solo por disponibilidad.
3. Prepara preguntas abiertas y un escenario que la persona conozca.
4. Diferencia «lo que ocurre» de «lo que debería ocurrir».
5. Solicita ejemplos de casos excepcionales, errores y situaciones poco frecuentes.
6. Resume los hallazgos al final para comprobar que entendiste.
7. Registra fecha, rol, evidencia y dudas sin resolver. Si se graba, respeta los permisos y reglas aplicables.

**Preguntas reutilizables:** «¿Qué inicia el proceso?», «¿Quién interviene?», «¿Qué información ingresa?», «¿Qué resultado se espera?», «¿Qué ocurre si falta un dato?», «¿Qué pasos duplican trabajo?», «¿Cómo se detecta un error?», «¿Qué cambiarías primero y por qué?». Evita inducir: «¿Te ayudaría nuestra aplicación?».

### 3.4. Manejar evidencia y contradicciones

Usa un registro:

| ID | Afirmación o hallazgo | Fuente / fecha | Tipo | Estado de comprobación | Pregunta pendiente |
|---|---|---|---|---|---|
| EV-001 | [hecho observado] | [observación, fecha] | Hecho | Confirmado | — |
| EV-002 | [lo que alguien propone] | [entrevista, fecha] | Necesidad | Por contrastar | [pregunta] |
| EV-003 | [posible causa] | [análisis] | Hipótesis | Sin comprobar | [cómo probarla] |

Si dos participantes discrepan, **no fusiones las versiones**. Registra los dos escenarios, identifica el origen de la discrepancia y pide a la autoridad competente resolverla o valida mediante observación.

### 3.5. Protocolo breve para un focus group

El esquema del curso tiene cuatro etapas (05-8): **Definir** (objetivos) → **Transmitir** (motivación) → **Generar** (diálogo) → **Validar** (apreciaciones). Su objetivo es dar protagonismo al entrevistado y escucharlo en su lenguaje natural. En práctica *(criterio del framework, no de la lámina)*:

1. Formula una pregunta común que varias perspectivas puedan discutir.
2. Invita a participantes que conozcan la experiencia; evita que una autoridad silencie otras voces.
3. Define un moderador, un relator y reglas de intervención.
4. Pide ejemplos y situaciones, no solo preferencias generales.
5. Anota consensos, desacuerdos, ideas y hechos que requieren comprobación posterior.
6. Cierra con un resumen que puedan corregir los asistentes.
7. Integra los hallazgos al registro de evidencia **sin convertir automáticamente la opinión mayoritaria en un requisito**.

**Puerta de salida 3:** están representados los usuarios principales, los casos excepcionales relevantes y las fuentes de las necesidades importantes. Los vacíos siguen marcados como vacíos.

---

## 4. Comprender y especificar procesos mediante BPMN

*Fuente: capítulo 06, diapositivas 5–14.*

**Objetivo:** describir quién hace qué, en qué orden, con qué información y ante qué decisiones, **antes** de confundir el proceso organizacional con las pantallas del software.

### 4.1. Cuándo usar BPMN y cuándo no

**Usarlo** si el problema incluye transferencias entre roles, aprobaciones, excepciones, esperas, mensajes o procedimientos entre organizaciones. **No forzarlo** para una función pequeña cuya interacción se describe claramente con un caso de uso o una regla.

Primero modela el proceso **AS-IS** (actual) y luego el **TO-BE** (propuesto) cuando necesitas demostrar qué cambiará. Si el proceso no existe, identifica ese hecho y modela directamente el diseño propuesto, sin inventar un estado anterior.

### 4.2. Traducción textual de los elementos visuales BPMN de las clases

| Elemento | Significado | Cómo describirlo sin imagen |
|---|---|---|
| **Piscina (pool)** | Participante u organización principal | `PARTICIPANTE: [nombre]` |
| **Carril (lane)** | Función o rol dentro de una piscina | `ROL: [nombre]` |
| **Evento de inicio** | Disparador del proceso | `INICIO: [hecho que inicia]` |
| **Evento intermedio** | Algo que ocurre, se espera o se comunica durante el flujo | `EVENTO: [mensaje recibido / tiempo cumplido]` |
| **Evento de fin** | Condición que termina una ruta | `FIN: [resultado o estado]` |
| **Tarea** | Unidad de trabajo | `TAREA [rol]: [verbo + objeto]` |
| **Subproceso** | Conjunto de pasos con detalle separado | `SUBPROCESO: [nombre]` |
| **Transacción** | Actividades tratadas como una unidad lógica | `TRANSACCIÓN: [conjunto de actividades]` |
| **Compuerta (gateway)** | Bifurcación o convergencia de rutas | `DECISIÓN: ¿[condición]? SÍ → ... / NO → ...` |
| **Flujo de secuencia** | Orden de actividades dentro de un proceso/piscina | `Paso A → Paso B` |
| **Flujo de mensaje** | Comunicación entre participantes/piscinas distintos | `MENSAJE: [origen] → [destino]: [contenido]` |
| **Asociación** | Vínculo explicativo con información o anotación | `ASOCIADO A [tarea]: [dato/nota]` |
| **Objeto de datos** | Dato requerido o producido | `ENTRADA: [...]` / `SALIDA: [...]` |
| **Grupo** | Agrupa actividades sin cambiar el flujo | `GRUPO INFORMATIVO: [...]` |
| **Anotación** | Explicación adicional | `NOTA: [...]` |

**Importante:** esta sintaxis textual es un formato de **documentación legible inspirado en BPMN**, no un reemplazo ejecutable ni una representación formalmente equivalente a todos los símbolos de BPMN. La notación BPMN real distingue tipos de compuertas y eventos que una flecha ASCII simplificada no expresa automáticamente.

### 4.3. Ejemplo genérico de proceso en texto

```text
PISCINA: Organización
  CARRIL: Solicitante
    INICIO: Se detecta una necesidad
    TAREA: Registra solicitud
    SALIDA: Solicitud enviada

  CARRIL: Responsable de revisión
    EVENTO: Se recibe una solicitud
    TAREA: Comprueba información
    DECISIÓN: ¿Los datos están completos?
      NO → TAREA: Solicita antecedentes → EVENTO: Espera respuesta
            → TAREA: Comprueba nuevamente
      SÍ → TAREA: Evalúa solicitud
    DECISIÓN: ¿Se aprueba?
      SÍ → TAREA: Comunica aprobación → FIN: Solicitud aprobada
      NO → TAREA: Comunica motivo de rechazo → FIN: Solicitud rechazada

OBJETO DE DATOS: Formulario de solicitud
REGLA: Toda decisión de aprobación o rechazo conserva responsable y fecha
EXCEPCIÓN: Si se cancela antes de decidir, cerrar como cancelada
```

La lectura del proceso debe permitir responder **quién participa, qué tareas ejecuta y qué decisiones toma**, que son precisamente las preguntas utilizadas en el ejemplo visual de las clases.

### 4.4. Procedimiento de modelado

1. Fija el inicio y los posibles finales.
2. Identifica participantes externos, piscinas y carriles.
3. Ordena tareas y define sus entradas/salidas; inicia los nombres con un verbo en 3.ª persona singular.
4. Registra las decisiones con **condiciones mutuamente comprensibles**; explicita rutas alternativas.
5. Modela esperas, mensajes y excepciones importantes.
6. Relaciona reglas de negocio y datos usados.
7. Recorre un caso normal y al menos un caso excepcional con un participante conocedor del proceso.
8. Compara AS-IS y TO-BE y escribe los cambios propuestos y sus razones.

**Buenas prácticas de la lámina (06-14):** identificar todos los actores; cada actor corresponde a un carril; la lectura comienza arriba a la izquierda; el flujo es trazable de inicio a fin; el diagrama es autoexplicativo; las tareas comienzan con un **verbo en 3.ª persona singular** («Registra», «Completa»); la redacción es objetiva y sin juicios de valor; se incluyen todas las tareas, eventos y compuertas necesarias.

**Precauciones:** un flujo de mensaje sirve para relacionar participantes/piscinas distintos; no se usa en sustitución del flujo de secuencia dentro de la misma piscina. Una línea de asociación tampoco representa orden de ejecución.

**Puerta de salida 4:** cada paso importante tiene responsable; cada decisión tiene salida explícita; se puede seguir el proceso desde su inicio hasta sus finales; los participantes han revisado el modelo que les corresponde.

---
## 5. Analizar necesidades y transformarlas en requisitos

*Fuente: capítulo 02, diapositivas 5–7; capítulo 03, diapositiva 12.*

**Entrada:** hallazgos, problemas, objetivos y procesos modelados.  
**Salida:** catálogo de necesidades depuradas, restricciones, reglas y requisitos candidatos.

### 5.1. No convertir literalmente cada deseo en requisito

El análisis responde a cinco preguntas por cada necesidad:

1. **Origen:** ¿quién lo necesita y qué evidencia lo respalda?
2. **Valor:** ¿qué problema u objetivo aborda?
3. **Alcance:** ¿corresponde al sistema, al proceso organizacional o a una actividad manual?
4. **Factibilidad:** ¿existen limitaciones técnicas, legales, temporales o de operación?
5. **Comprobación:** ¿cómo demostraríamos que se cumplió?

Una petición como «quiero un tablero con muchos colores» necesita indagar qué decisión debe facilitar ese tablero. Puede terminar convirtiéndose en un requisito funcional, de usabilidad o en una preferencia no vinculante; el diagnóstico decide cuál.

### 5.2. Clasificación operativa de los requisitos

| Clase | Responde a… | Ejemplo hipotético | Cómo se comprueba |
|---|---|---|---|
| **Objetivo de negocio** | ¿Para qué se desarrolla? | Reducir el tiempo de respuesta a solicitudes | Medida comparativa del proceso |
| **Funcional (RF)** | ¿Qué debe hacer el sistema? | Registrar una solicitud con identificador único | Prueba de entradas, procesamiento y resultado |
| **No funcional (RNF)** | ¿Con qué propiedades o restricciones debe operar? | Mostrar un resultado en un tiempo límite bajo una carga definida | Medición reproducible |
| **Regla de negocio (RN)** | ¿Qué política condiciona la actuación? | Solo una solicitud autorizada puede pasar a estado «aprobada» | Casos positivos, negativos y excepcionales |
| **Restricción / dependencia** | ¿Qué condición externa limita la solución? | Integrarse con un directorio ya existente | Revisión de interfaz, contrato y entorno |
| **Requisito de interfaz** | ¿Con quién intercambia información? | Enviar estado a un servicio externo bajo reglas acordadas | Prueba de integración y errores |

**No confundir:** una decisión de tecnología («usar determinada base de datos») no se convierte en necesidad del usuario por escribirla con «debe». Solo se documenta como restricción si está realmente impuesta, o como decisión de diseño si aún puede elegirse.

### 5.3. Traducción textual del árbol visual de requisitos no funcionales

El material docente (02-7, Sommerville 2011, p. 88) divide los requisitos no funcionales en tres grandes familias:

```text
REQUISITOS NO FUNCIONALES
|
+-- DEL PRODUCTO
|     +-- Usabilidad
|     +-- Eficiencia
|     |     +-- Rendimiento
|     |     +-- Espacio / recursos
|     +-- Confiabilidad
|     +-- Seguridad
|
+-- DE LA ORGANIZACIÓN
|     +-- Ambientales
|     +-- Operacionales
|     +-- De desarrollo
|
+-- EXTERNOS
      +-- Regulatorios
      +-- Éticos
      +-- Legales
            +-- Contables
            +-- Protección / seguridad
```

La jerarquía ayuda a descubrir requisitos omitidos. Es una **clasificación de necesidades y restricciones**; el modelo de calidad del producto de la sección 10 sirve después para definir atributos y métricas. No son árboles idénticos y no necesitan coincidir palabra por palabra.

### 5.4. Resolver duplicidades, conflictos y ausencias

Ante requisitos aparentemente repetidos, verifica si describen la misma función, roles distintos o condiciones distintas. Ante contradicciones, documenta:

```text
Conflicto: [enunciados o IDs involucrados]
Origen: [fuentes de cada postura]
Impacto: [qué decisión o función queda bloqueada]
Alternativas: [opción A / opción B / ...]
Decisión: [alternativa aprobada y motivo]
Responsable y fecha: [...]
Requisitos afectados: [...]
```

**No borrar los requisitos descartados sin conservar la decisión:** podrían volver a discutirse. Si falta información, mantén el estado «pendiente de aclaración», no rellenes el vacío con supuestos inadvertidos.

### 5.5. Calidad mínima de un requisito

Un requisito redactado debe ser:

- **Escrito y localizable:** un identificador estable permite citarlo.
- **Claro y conciso:** una lectura razonable no debería producir interpretaciones diferentes.
- **Completo para su nivel:** incluye actor o condición, comportamiento y resultado suficientes.
- **Consistente:** no contradice otras reglas o requisitos.
- **Viable:** respeta las restricciones conocidas.
- **Verificable:** permite preparar al menos una comprobación objetiva.

Rechaza o devuelve a análisis expresiones como «rápido», «fácil», «seguro», «moderno», «óptimo» y «en tiempo real» **sin condiciones de medición ni significado acordado**.

**Puerta de salida 5:** los requisitos candidatos tienen propósito, fuente y tipo; las contradicciones están resueltas o declaradas; las dudas tienen responsable.

---

## 6. Modelar interacciones y escenarios del sistema

*Fuente: capítulo 03, diapositivas 8–11; capítulo 02, diapositiva 17 (historias de usuario en el backlog).*

**Objetivo:** completar las frases de los requisitos con situaciones de uso reales o previstas, antes de diseñar pantallas o escribir pruebas.

### 6.1. Decidir qué modelo usar

| Pregunta que necesitas responder | Modelo/documento útil |
|---|---|
| ¿Quién interactúa con el sistema para conseguir qué? | Casos de uso y lista de actores |
| ¿Cómo se desarrolla una interacción paso a paso? | Descripción textual de caso de uso |
| ¿Cómo trabajan varias áreas a través de un proceso? | BPMN AS-IS / TO-BE |
| ¿Qué aspecto de una interfaz genera dudas? | Prototipo navegable o de baja fidelidad |
| ¿Qué comportamiento debe validarse en un ciclo corto? | Historia de usuario con criterios de aceptación |
| ¿Qué ocurre cuando hay datos inválidos o falla un servicio? | Escenarios alternativos, excepciones y criterios |

Ningún documento sustituye automáticamente a todos los demás: elige el que aclara la pregunta con menos esfuerzo.

### 6.2. Casos de uso: conversión de los elementos visuales a texto

El diagrama visto en clases combina:

- **Actor:** rol o sistema externo que interactúa con el sistema; en los ejemplos docentes se muestra mediante una figura humana. No tiene que corresponder siempre a una persona autenticada.
- **Caso de uso:** objetivo o funcionalidad que se expresa con un verbo, generalmente dentro de un óvalo en UML.
- **Asociación:** indica participación de un actor en un caso de uso.
- **Límite del sistema:** separa lo que el sistema ofrece de lo que realiza su entorno.

Representación textual simple:

```text
SISTEMA: [nombre genérico]
ACTOR: Solicitante
  → Crear solicitud
  → Consultar estado
ACTOR: Revisor
  → Evaluar solicitud
  → Comunicar resolución
SISTEMA EXTERNO: Servicio de notificaciones
  ↔ Enviar notificación
```

El texto anterior **explica** las asociaciones, pero no equivale a un diagrama UML completo ni sustituye todas sus relaciones formales. Utiliza descripciones separadas cuando haya condiciones complejas.

### 6.3. Plantilla de especificación de un caso de uso

```markdown
#### CU-[NNN] — [Verbo + objetivo]
- Objetivo:
- Actor principal:
- Actores secundarios / sistemas externos:
- Requisito(s) vinculado(s):
- Disparador:
- Precondiciones:
- Flujo principal:
  1. [Actor realiza acción]
  2. [Sistema responde]
  3. [...]
- Flujos alternativos:
  - A1: [condición] → [respuesta del sistema]
- Excepciones:
  - E1: [fallo] → [respuesta y estado final]
- Postcondiciones de éxito:
- Postcondiciones de fallo:
- Reglas de negocio aplicables:
- Datos de entrada y salida:
- Pendientes de validación:
```

**Ejemplo:** «Consultar estado de una solicitud». Flujo principal: el usuario entrega un identificador válido; el sistema localiza la solicitud que tiene permiso de ver; muestra su estado. Alternativa: identificador inexistente. Excepción: servicio temporalmente no disponible. Regla: no exponer solicitudes ajenas. Cada ruta puede generar un caso de prueba diferente.

### 6.4. Historias de usuario: alternativa para trabajo iterativo

Formato operativo cuando el equipo trabaje con backlog:

```text
Como [rol], quiero [capacidad] para [beneficio observable].
```

Acompañar con:

```text
Criterios de aceptación:
- Dado [contexto], cuando [acción], entonces [resultado].
- Dado [error o excepción], cuando [acción], entonces [respuesta].
Reglas: [IDs] | Dependencias: [IDs] | Fuente: [EV-...] | Estado: [...]
```

No conviertas automáticamente un objetivo extenso en una sola historia. Divide por resultados utilizables, manteniendo las reglas comunes y evitando duplicar requisitos contradictorios.

### 6.5. Validación temprana con prototipos

1. Define la hipótesis que se desea comprobar («el usuario entiende cómo identificar el estado»).
2. Construye solo las pantallas o transiciones necesarias.
3. Pide a usuarios representativos realizar tareas sin guiarlos hacia la respuesta.
4. Registra observaciones, errores y lo que interpretaron.
5. Actualiza requisitos, casos de uso y decisiones.
6. Repite si persiste una incertidumbre importante.

**Un prototipo es evidencia de comprensión o interacción, no de seguridad, integridad transaccional ni rendimiento de la implementación final.**

**Puerta de salida 6:** los casos críticos tienen actor, ruta normal, excepciones y resultados; el modelo de interacción no contradice el proceso ni las reglas de negocio.

---

## 7. Priorizar y fijar el alcance

*Fuente: capítulo 04, diapositiva 13.*

**Objetivo:** acordar qué es indispensable ahora, qué puede esperar y qué no forma parte del proyecto.

### 7.1. Convertir la matriz visual de impacto-complejidad a una decisión

El material docente muestra una matriz con **impacto en el negocio (escala 1 a 5)** y **complejidad de desarrollo (baja, media, alta)**. Su uso operativo:

| Impacto para el objetivo | Complejidad baja | Complejidad media | Complejidad alta |
|---|---|---|---|
| Alto (4–5) | Candidato a entrega temprana | Planificar y validar dependencias | Analizar alternativas, dividir y gestionar riesgos |
| Medio (3) | Elegir según capacidad disponible | Comparar costo y beneficio | Posponer salvo obligación o dependencia crítica |
| Bajo (1–2) | Incorporar solo si aporta valor claro | Posponer | Normalmente fuera del alcance inicial |

La lámina solo muestra la matriz coloreada con ejemplos RF1–RF4; el texto de cada celda es *(criterio del framework, no de la lámina)*.

**Advertencia:** esta tabla es una **guía de decisión**, no una fórmula que genera prioridades automáticamente. Un requisito legal, de seguridad o de continuidad puede ser obligatorio aunque no tenga una puntuación de impacto alta.

### 7.2. Secuencia para priorizar

1. Separa requisitos **obligatorios** por contrato, operación o restricciones externas.
2. Evalúa el impacto previsto de cada requisito en los objetivos.
3. Estima complejidad con quienes conocen la implementación.
4. Identifica dependencias y requisitos que desbloquean otros.
5. Define un conjunto realizable para la siguiente entrega o línea base.
6. Registra lo **incluido**, lo **excluido** y lo **pendiente de decisión**.
7. Revisa las prioridades cuando cambie la evidencia o la disponibilidad.

### 7.3. Estados recomendados del catálogo

`Propuesto → En análisis → Listo para validar → Validado → Aprobado para entrega → Implementado → Verificado`.

Alternativas: `Bloqueado`, `Pospuesto`, `Descartado`, `Sustituido`. Un requisito puede estar implementado y **no** verificado; esos estados no se deben fusionar.

**Puerta de salida 7:** el alcance está vinculado a objetivos; las prioridades tienen responsables; el equipo sabe qué trabajo corresponde a la próxima entrega y qué no corresponde.

---

## 8. Especificar los requisitos en una ERS

*Fuente: capítulo 04, diapositivas 3–12.*

**ERS:** Especificación de Requisitos de Software. Las clases utilizan la estructura de **IEEE 830-1998** como referencia de organización documental. Aquí se conserva **su estructura pedagógica**: no se afirma que sea la norma más reciente ni que todas las secciones requieran el mismo nivel de detalle. En un proyecto real se ajusta a compromisos documentales o normativos vigentes.

### 8.1. Índice maestro de una ERS reutilizable

```text
1. Introducción
   1.1 Propósito del documento y audiencia
   1.2 Ámbito del sistema: qué incluye y qué excluye
   1.3 Definiciones, acrónimos y abreviaturas
   1.4 Referencias pertinentes al proyecto
   1.5 Organización del documento

2. Descripción general
   2.1 Perspectiva del producto y relación con otros sistemas
   2.2 Funciones principales del producto
   2.3 Características de los usuarios
   2.4 Restricciones
   2.5 Suposiciones y dependencias
   2.6 Requisitos futuros (separados del alcance aprobado)

3. Requisitos específicos
   3.1 Interfaces externas
   3.2 Requisitos funcionales detallados
   3.3 Rendimiento y capacidad
   3.4 Restricciones de diseño
   3.5 Atributos de calidad del sistema
   3.6 Otros requisitos pertinentes

4. Apéndices
   - Glosario extendido
   - Reglas de negocio
   - Catálogo de escenarios
   - Descripción textual de procesos
   - Acuerdos y decisiones
   - Matriz de trazabilidad
   - Registro de cambios
```

El índice es la **transcripción organizada de los bloques de las diapositivas 5–11** de documentación de requisitos; los ejemplos y anexos son una forma práctica de aplicarlo a proyectos distintos.

### 8.2. Qué debe tener cada requisito individual

La diapositiva sobre **gestión, seguimiento y trazabilidad** describe ocho campos esenciales: **código, nombre, descripción, actor vinculado, entrada, proceso, salida y estatus**. Para trabajo real, se recomienda complementarlos con **fuente, objetivo, prioridad, criterios de aceptación, dependencias, versión y responsable**.

Ficha completa:

```markdown
### RF-[NNN] — [Nombre preciso]
- Tipo: Funcional | No funcional | Interfaz | Restricción
- Estado: Propuesto | En análisis | Validado | ...
- Versión y fecha:
- Fuente (EV-...):
- Objetivo de negocio vinculado (OBJ-...):
- Actor(es) / sistemas externos:
- Descripción: El sistema debe [comportamiento concreto] cuando [condición].
- Disparador y precondiciones:
- Entrada: [datos, formato, obligatoriedad]
- Proceso / reglas aplicables: [transformación necesaria, sin imponer diseño interno arbitrario]
- Salida / resultado observable:
- Alternativas y errores:
- Criterios de aceptación:
  - CA-1: Dado ..., cuando ..., entonces ...
  - CA-2: Dado ..., cuando ..., entonces ...
- Prioridad y justificación:
- Impacto / complejidad:
- Restricciones y dependencias:
- Responsable de aclarar o validar:
- Casos de uso o historias relacionadas:
- Casos de prueba y evidencia de ejecución:
- Observaciones / pendientes:
```

**Ejemplo conciso de RF:** «Cuando un usuario autorizado envía una solicitud con los campos obligatorios válidos, el sistema debe registrarla y devolver un identificador único». **Ejemplo de criterio:** «Dada una solicitud válida, al enviarla se almacena una vez y se muestra un identificador recuperable». La prueba confirmará el resultado, no la mera presencia de un botón.

### 8.3. Cómo redactar un RNF medible

```markdown
### RNF-[NNN] — [Atributo de calidad]
- Atributo:
- Escenario de operación:
- Condiciones / entorno:
- Carga o volumen:
- Métrica y unidad:
- Umbral de aceptación:
- Procedimiento de medición:
- Frecuencia o momento de medición:
- Herramienta posible:
- Excepciones admitidas:
- Fuente / responsable / estado:
```

**Ejemplo ilustrativo, no valor universal:** «Con 100 usuarios virtuales concurrentes y una base de datos de prueba acordada, al menos el 95 % de las consultas deberá responder en menos de 2 segundos durante 15 minutos». Debe justificarse el umbral para ese producto: no debe copiarse indiscriminadamente.

### 8.4. Reglas, glosario y restricciones

Mantén separados:

- **Glosario:** significado inequívoco de términos, estados y actores.
- **Regla de negocio:** política que puede condicionar varios requisitos (`RN-...`).
- **Restricción:** limitación impuesta, con su fuente y vigencia.
- **Suposición:** condición aún no confirmada cuya modificación puede cambiar el alcance.
- **Dependencia:** aquello que otro actor, sistema o entrega debe proporcionar.

El documento puede ser **un archivo** o una **colección enlazada de archivos**. Importa la coherencia, no la cantidad de documentos. Si usas varias páginas, cada requisito y decisión conserva un identificador estable y un enlace válido.

**Puerta de salida 8:** la ERS permite comprender qué se construirá sin depender de la memoria de quien la escribió; ningún requisito aprobado carece de fuente, actor o contexto, resultado verificable y estado.

---

## 9. Verificar y validar los requisitos antes de construir

*Fuente: capítulo 03, diapositiva 12; capítulo 02, diapositiva 9.*

**Verificar requisitos:** comprobar su calidad interna y que se puedan desarrollar y probar.  
**Validar requisitos:** confirmar con las partes interesadas que representan la necesidad correcta.

### 9.1. Cinco comprobaciones de las clases, convertidas a controles

| Control | Preguntas de revisión | Evidencia de cierre |
|---|---|---|
| **Validez** | ¿Es realmente lo que necesitan los interesados? ¿Faltan perfiles o funciones relevantes? | Revisión y observaciones resueltas por los roles pertinentes |
| **Consistencia** | ¿Hay reglas, umbrales o definiciones que se contradicen? | Comparación cruzada de requisitos y glosario |
| **Totalidad** | ¿Están las funciones, restricciones, excepciones e interfaces significativas? | Matriz de cobertura de procesos/escenarios/requisitos |
| **Realismo** | ¿Puede realizarse con tecnología, costo, equipo y plazo conocidos? | Evaluación de factibilidad y decisiones sobre riesgos |
| **Verificabilidad** | ¿Podemos escribir una prueba que lo apruebe o rechace objetivamente? | Criterios de aceptación y casos de prueba planeados |

### 9.2. Revisión por roles

- **Usuarios:** flujos reales, lenguaje, casos excepcionales y necesidades cubiertas.
- **Responsable de negocio:** prioridad, alcance y resultado esperado.
- **Desarrollo:** contradicciones, ambigüedad técnica e interfaces.
- **Calidad/pruebas:** verificabilidad, datos de prueba y observabilidad.
- **Mantenimiento/operación:** cambios, fallos, recuperación y condiciones de soporte.

Un requisito **no se vuelve válido porque un único participante haya dicho «sí»** si afecta significativamente a otros grupos no consultados.

### 9.3. Matriz de revisión

| ID de requisito | Validez | Consistencia | Totalidad | Realismo | Verificabilidad | Pendiente / responsable |
|---|---|---|---|---|---|---|
| RF-001 | Sí | Sí | Sí | Sí | No | Definir respuesta ante error / [rol] |

Valores permitidos: `Sí`, `No`, `Pendiente`, `No aplica` (justificado). **No convertir `Pendiente` en `Sí` por defecto**.

**Puerta de salida 9:** ninguna contradicción crítica ni condición de aceptación ambigua permanece sin responsable y decisión; se conserva evidencia de validación.

---
## 10. Definir y evaluar la calidad del producto

*Fuente: capítulo 08, diapositivas 4–18; capítulo 09, diapositivas 3–16.*

La calidad no empieza cuando se ejecutan pruebas. Desde el problema y los requisitos se deben decidir **qué atributos importan, qué se medirá y bajo qué condiciones se considerará aceptable**.

### 10.1. Distinguir dos ámbitos que suelen confundirse

| Calidad del proyecto (proceso) | Calidad del producto (software) |
|---|---|
| Se ocupa de planificación, acuerdos, comunicación, documentación, revisión y seguimiento | Se ocupa de las características y el comportamiento del sistema resultante |
| Ejemplo de problema: un cambio no fue comunicado | Ejemplo de problema: la modificación causa un acceso no autorizado |
| Evidencia: decisiones, registros, revisiones, tareas y aprobaciones | Evidencia: pruebas, mediciones, análisis del producto y resultados observados |

**Necesitamos ambas.** Un proceso ordenado no garantiza automáticamente un buen producto; un producto que funciona en una demostración no prueba que el proyecto haya gestionado sus riesgos.

### 10.2. Clasificación traducida de las imágenes de atributos

Las clases presentan dos grupos complementarios:

- **Observables vía ejecución** (tabla 1, 08-8): disponibilidad, confidencialidad, funcionalidad, desempeño, confiabilidad, seguridad externa (*safety*) y seguridad interna (*security*). Se determinan del comportamiento: se comprueban con un sistema funcionando, pruebas o monitoreo.
- **No observables vía ejecución** (tabla 2, 08-9): configurabilidad, integrabilidad, integridad, interoperabilidad, modificabilidad, mantenibilidad, portabilidad, reusabilidad, escalabilidad y capacidad de prueba. Se establecen durante el desarrollo: requieren inspección del diseño, código, documentación y, cuando corresponda, pruebas específicas.

Clasificación tomada de Bass, Clements y Kazman (1998), *Software Architecture in Practice*, según la lámina 08-7.

La clasificación ayuda a **elegir una técnica de evaluación**; no significa que un atributo solo pueda valorarse de una forma.

### 10.3. Modelos de calidad: cuándo elegir

Los materiales presentan **McCall, Dromey, FURPS, ISO/IEC 9126** y la familia **ISO/IEC 25000**. En este framework:

| Modelo | Uso práctico aconsejable | Nota de selección |
|---|---|---|
| McCall | Analizar factores y criterios históricos de calidad | Útil para comprender relaciones entre factores; no es requisito documentar todos |
| Dromey | Relacionar propiedades de componentes y producto con la calidad | Conveniente si se está estudiando el efecto del diseño en atributos |
| FURPS | Clasificar rápidamente funcionalidad, usabilidad, confiabilidad, rendimiento y soporte | Es un punto de partida simple; ampliar si faltan atributos críticos |
| ISO/IEC 9126 | Comprender una clasificación histórica de calidad del producto | No confundir un esquema histórico con una edición actual |
| **ISO/IEC 25000 / 25010** | Estructurar un catálogo más amplio de características y mediciones | Opción de referencia para la matriz de calidad de este framework |

**Decisión:** escoge el modelo cuyo vocabulario permita **especificar y evaluar mejor el producto**; no es necesario combinar todas las taxonomías ni prometer cumplimiento normativo solo por usar sus nombres.

### 10.4. Traducción de la tabla visual ISO/IEC 25010 de las clases

La lámina del curso presenta **nueve características de calidad del producto**, con las siguientes subcaracterísticas. Se listan en texto para conservar su utilidad sin depender de la imagen:

| Característica | Subcaracterísticas presentes en la lámina | Pregunta operativa para el proyecto |
|---|---|---|
| **Adecuación funcional** | Completitud funcional, corrección funcional, pertinencia funcional | ¿Hace correctamente lo que deben lograr los usuarios? |
| **Eficiencia de desempeño** | Comportamiento temporal, utilización de recursos, capacidad | ¿Cumple tiempos y capacidad bajo carga acordada? |
| **Compatibilidad** | Coexistencia, interoperabilidad | ¿Convive e intercambia información con otros sistemas? |
| **Capacidad de interacción** | Reconocibilidad de adecuación, aprendibilidad, operabilidad, protección frente a errores de usuario, involucración del usuario, inclusividad, asistencia al usuario, autodescriptividad | ¿Los usuarios pueden aprenderlo, comprenderlo y operarlo con seguridad y accesibilidad? |
| **Fiabilidad** | Ausencia de fallos, disponibilidad, tolerancia a fallos, recuperabilidad | ¿Funciona de forma consistente y se recupera de problemas? |
| **Seguridad** | Confidencialidad, integridad, no repudio, responsabilidad, autenticidad, resistencia | ¿Protege accesos, datos y acciones frente a amenazas relevantes? |
| **Mantenibilidad** | Modularidad, reusabilidad, analizabilidad, capacidad de ser modificado, capacidad de ser probado | ¿Puede diagnosticarse, corregirse y evolucionar sin riesgo desproporcionado? |
| **Flexibilidad** | Adaptabilidad, escalabilidad, instalabilidad, reemplazabilidad | ¿Puede adaptarse a nuevas condiciones y volúmenes? |
| **Protección** | Restricción operativa, identificación de riesgos, protección ante fallos, advertencia de peligro, integración segura | ¿Evita que un funcionamiento peligroso cause daños en su contexto de uso? |

Esta es una **transcripción textual de categorías de la lámina**, no una reproducción del texto íntegro de una norma. El vocabulario se emplea como referencia de análisis; si el proyecto exige una certificación o cumplimiento formal, debe usar el documento normativo aplicable a ese caso.

### 10.5. Seleccionar atributos con criterio

1. Revisa objetivos, procesos, datos tratados, usuarios y riesgos.
2. Identifica consecuencias de fallas: indisponibilidad, filtraciones, lentitud, resultados incorrectos, problemas de acceso, daños, etc.
3. Prioriza las características afectadas por esos riesgos.
4. Por cada atributo priorizado, define **un escenario**, **una métrica** y **una condición de aprobación**.
5. Elige cómo medir y quién aceptará el resultado.
6. Registra atributos no prioritarios con justificación cuando corresponda.

No es obligatorio crear nueve RNF solo porque la tabla tenga nueve características. En un sistema sencillo puede bastar un subconjunto razonado; en uno crítico podrían requerirse muchas subcaracterísticas.

### 10.6. Matriz de atributos, métricas y evidencias

| Atributo | Escenario o riesgo | Métrica / condición | Técnica posible | Evidencia esperada |
|---|---|---|---|---|
| Adecuación funcional | Registrar una operación con datos válidos e inválidos | Resultados esperados en los casos previstos | Pruebas funcionales | Casos ejecutados y sus resultados |
| Desempeño | Uso simultáneo bajo volumen definido | Percentiles de latencia, errores, capacidad o consumo | Prueba de carga | Informe reproducible con entorno y datos |
| Seguridad | Acceso a un recurso ajeno | Solicitudes no autorizadas denegadas y registradas según política | Pruebas de autorización y análisis | Casos negativos, registros y hallazgos |
| Fiabilidad | Caída controlada de un servicio dependiente | Recuperación o respuesta degradada en condiciones acordadas | Pruebas de fallo/recuperación | Estado antes/después, tiempos y registros |
| Capacidad de interacción | Usuario nuevo ejecuta una tarea | Éxito, errores, asistencia necesaria y tiempo | Sesión de uso observada | Registro de observación y tareas |
| Mantenibilidad | Modificación localizada de una regla | Impacto rastreable, pruebas relacionadas identificadas | Revisión y análisis estático | Informe de cambios, cobertura y revisión |

**Las métricas anteriores son ejemplos.** Cada valor umbral y situación de prueba debe acordarse para el contexto del producto.

### 10.7. Familia ISO/IEC 25000: lectura operativa del diagrama

La lámina sobre SQuaRE descompone la familia en divisiones relacionadas con:

```text
FAMILIA ISO/IEC 25000
  ├─ ISO/IEC 2500n · Gestión de calidad: orientación y términos comunes
  ├─ ISO/IEC 2501n · Modelo de calidad: qué características evaluar
  ├─ ISO/IEC 2502n · Medición de calidad: con qué medidas cuantificar
  ├─ ISO/IEC 2503n · Requisitos de calidad: qué condiciones pedir
  └─ ISO/IEC 2504n · Evaluación de calidad: cómo valorar el resultado
```

**Aplicación:** no empieces por escoger una herramienta. Primero define el atributo y su requisito; después selecciona la medición, el procedimiento y el instrumento que mejor respondan a la pregunta.

### 10.8. Elegir técnicas y herramientas de control de calidad

Las herramientas aparecidas en clases se ordenan aquí **por finalidad**:

| Necesidad | Opciones vistas en el curso | Cuándo convienen | Qué NO demuestran por sí solas *(criterio del framework, no de la lámina)* |
|---|---|---|---|
| Examinar código sin ejecutarlo | Kiuwan; SonarQube; SonarCloud | Inspección continua y detección de hallazgos de calidad o seguridad en código | No sustituyen pruebas de comportamiento real ni revisión humana |
| Automatizar interacción de aplicaciones web | Selenium | Repetir flujos de usuario y comprobar funciones en navegador | No cubre automáticamente todos los niveles ni toda la seguridad |
| Simular carga programática | Locust | Definir usuarios y escenarios mediante programación, particularmente en Python | No define por sí mismo qué carga representa producción |
| Probar carga y rendimiento | Apache JMeter | Ejecutar escenarios de carga sobre servicios y aplicaciones compatibles | Una sola ejecución no prueba escalabilidad ilimitada |
| Auditar aspectos de calidad de una página web | Google Lighthouse | Revisar rendimiento web y otras categorías evaluadas por la herramienta, comparar resultados | Una buena puntuación no prueba que se cumplan todos los requisitos de calidad o negocio |

**SonarQube/SonarCloud:** en la explicación del curso, el primero se presenta como instalación propia y el segundo como servicio en la nube. La forma de despliegue y las capacidades comerciales pueden cambiar: seleccionar según entorno, permisos y objetivos actuales.

**Regla de selección:** atributo → riesgo → requisito medible → escenario → herramienta → evidencia. Nunca invertirlo a «tenemos una herramienta, por lo tanto esta será nuestra calidad».

### 10.9. Ejecución de una evaluación: antes y después

1. Selecciona atributo y escenario reproducible.
2. Especifica versión del sistema, entorno, datos, configuración, fecha y herramienta.
3. Ejecuta una **medición inicial**; guarda valores y hallazgos.
4. Clasifica problemas por impacto, no solamente por puntuación.
5. Define una corrección concreta y su responsable.
6. Repite **la misma evaluación bajo condiciones comparables**.
7. Compara la medición inicial con la posterior; verifica regresiones.
8. Conserva evidencias y decide si pasa el umbral acordado.

#### Caso práctico de Lighthouse adaptado a una guía general

Para una aplicación web, las diapositivas muestran el procedimiento: abrir la página en Chrome, acceder a las herramientas de desarrollador mediante **Inspeccionar**, elegir **Lighthouse**, seleccionar las categorías correspondientes y ejecutar el análisis. Registrar el informe inicial, aplicar cambios y repetir la evaluación.

Formato de registro:

| Versión / entorno | Categoría o métrica | Valor inicial | Cambio aplicado | Valor posterior | Umbral | Veredicto |
|---|---|---|---|---|---|---|
| [versión] | [métrica] | [valor] | [acción] | [valor] | [acuerdo] | Aprobado / Falló / Inconcluso |

Si el resultado varía por red, equipo o datos, la conclusión debe señalarlo. Un informe sin entorno reproducible es evidencia débil.

### 10.10. Seleccionar el nivel y tipo de prueba

La evaluación de calidad puede combinar comprobaciones diferentes. La selección también debe responder al riesgo:

| Comprobación | Pregunta que responde | Ejemplo de evidencia |
|---|---|---|
| **Unitaria** | ¿La lógica aislada cumple lo previsto? | Resultado de casos sobre una unidad |
| **Integración** | ¿Componentes o servicios intercambian datos correctamente, incluso ante errores? | Trazas y verificaciones de interfaz |
| **Sistema** | ¿El conjunto satisface el escenario completo? | Flujo ejecutado de extremo a extremo |
| **Aceptación** | ¿El resultado entregado resuelve la necesidad acordada? | Criterios aprobados y observaciones de usuarios |
| **Funcional** | ¿La función produce las salidas previstas? | Casos positivos, negativos y límites |
| **No funcional** | ¿Cumple propiedades como rendimiento, seguridad, capacidad de interacción o fiabilidad? | Medición en escenario y entorno definidos |

Los **niveles** (unitaria, integración, sistema, aceptación) describen la amplitud de lo evaluado; los **tipos** (funcional, rendimiento, seguridad, etc.) describen qué se comprueba. Pueden combinarse. No son categorías mutuamente excluyentes.

Para cada prueba conserva **versión, precondiciones, datos, pasos, esperado, observado, veredicto y evidencia**. Si el resultado es incierto por un entorno defectuoso, clasifícalo como inconcluso o bloqueado; no como aprobado.

**Puerta de salida 10:** los atributos importantes tienen requisitos medibles, plan de evaluación y criterios de aprobación. No se afirma que el producto ya los cumple antes de ejecutarlos.

---

## 11. Alinear al equipo e interesados mediante Playbacks

*Fuente: capítulo 07, diapositivas 2–14.*

Un **Playback** es una sesión de alineación en la que se presenta lo descubierto, las decisiones y una historia centrada en la experiencia futura del usuario. En las clases se distingue entre presentaciones **formales** en hitos importantes y revisiones **informales** cuando se necesita ajustar el rumbo.

### 11.1. Cuándo convocar uno

- Después de comprender el problema y antes de validar el alcance.
- Tras un prototipo o una revisión importante de requisitos.
- Ante conflictos entre usuarios y responsables de decisión.
- Al cerrar un incremento o presentar cambios relevantes.
- Siempre que aparezca información nueva que pueda afectar acuerdos anteriores.

**No programarlo solo porque «toca la reunión».** Debe haber una pregunta, decisión o alineación que justifique reunir a los participantes.

### 11.2. Procedimiento de la sesión

Las láminas ordenan la sesión en tres momentos: **invita a los interesados** (07-11), **céntrate en el usuario** contando una historia (07-12) y **escucha el feedback** tomando nota sin juzgar (07-13, 07-14). El tiempo sugerido es **30 minutos, «¡pero tú decides!»** (07-8). Reglas de la sesión (07-8): habla menos y escribe más; no hay ideas malas; mantente enfocado en el usuario; todos participan; mantén a todos atentos y usa un *parking lot* para lo que sale del tema; atente a la agenda; «Sí, y…» en vez de descartar ideas.

El siguiente procedimiento detallado es *(criterio del framework, no de la lámina)*:

```text
PREPARAR → INVITAR → CONTAR → ESCUCHAR → REGISTRAR → AJUSTAR / VALIDAR
```

1. **Preparar:** define audiencia, objetivo, material y decisiones necesarias.
2. **Invitar:** incluye a las personas afectadas y a quienes pueden resolver incertidumbres.
3. **Contar:** parte de una situación de usuario, problema y evidencia; muestra la propuesta o avance y sus límites.
4. **Escuchar:** pide comentarios, desacuerdos, riesgos y aspectos faltantes; evita defender cada propuesta antes de comprender la observación.
5. **Registrar:** separa acuerdos, sugerencias, objeciones y pendientes.
6. **Ajustar:** modifica requisitos o modelos afectados y comunica el resultado.

Una agenda práctica *(criterio del framework, no de la lámina)*: 5 minutos para objetivo y contexto, 10–12 para mostrar historia y evidencia, 10 para preguntas y decisiones y 3–5 para recapitular; no es una distribución rígida.

### 11.3. Preguntas que debe responder la presentación

Según la lámina 07-4, un buen Playback **presenta una historia, crea una conexión emocional, provee un argumento convincente y presenta una solución**. Su estilo y contenido se ajustan a la audiencia: no es lo mismo exponer al equipo que a ejecutivos o interesados externos (07-7). Las preguntas siguientes son *(criterio del framework, no de la lámina)*:

- ¿Quién es el usuario o destinatario principal?
- ¿Qué problema se observó y cómo se sabe?
- ¿Qué se propone cambiar y qué queda fuera?
- ¿Qué alternativas se consideraron y por qué?
- ¿Qué requisitos o atributos de calidad se ven afectados?
- ¿Qué decisión necesitamos de las personas asistentes?
- ¿Qué queda pendiente después de escuchar el feedback?

Si aparecen desacuerdos, la sesión **ha aportado información**: registrar la divergencia y el mecanismo para resolverla es mejor que declarar un consenso inexistente.

### 11.4. Resultado obligatorio de la sesión

```markdown
## Acta de Playback — [fecha]
- Objetivo:
- Versión o material revisado:
- Participantes y roles:
- Evidencia / escenario presentado:
- Acuerdos confirmados:
- Observaciones:
- Desacuerdos no resueltos:
- Decisiones y sus responsables:
- Requisitos, procesos o métricas afectados:
- Acciones, responsables y fecha objetivo:
- Próxima comprobación:
```

**Puerta de salida 11:** las observaciones no quedan únicamente en una presentación o conversación; se convierten en decisiones, preguntas asignadas o cambios controlados.

---

## 12. Mantener trazabilidad y controlar cambios

*Fuente: capítulo 04, diapositivas 12–14.*

La gestión de requisitos **continúa durante todo el ciclo de vida**. Se inicia en el primer hallazgo y se mantiene a través de diseño, desarrollo, pruebas y operación.

### 12.1. Matriz de trazabilidad de extremo a extremo

| Objetivo | Fuente | Proceso/escenario | Requisito | Regla / atributo | Criterio de aceptación | Prueba | Resultado / evidencia |
|---|---|---|---|---|---|---|---|
| OBJ-01 | EV-003 | CU-001 | RF-001 | RN-002 | CA-001 | CP-001 | Pendiente |
| OBJ-01 | EV-005 | Escenario de carga | RNF-001 | Desempeño | CA-002 | CP-002 | Pendiente |

La matriz permite navegar en ambos sentidos:

- **Hacia adelante:** de una necesidad a la comprobación que demostrará que se atendió.
- **Hacia atrás:** desde una función, prueba o cambio hasta el problema y decisión que lo justifican.

**Criterio importante:** un resultado `Pendiente` significa que todavía no existe evidencia de ejecución. No escribir «cumplido» solo porque el caso de prueba está redactado.

### 12.2. Proceso de control de cambios de las clases

La lámina 04-14 presenta un ciclo de cuatro etapas: **identificación** (captura y registro de solicitudes de usuarios, clientes, desarrolladores u otros interesados), **evaluación** (impacto en costo, tiempo, recursos y otros requisitos, de forma colaborativa), **aprobación** (comité, criterios claros, solo cambios beneficiosos y justificados) y **seguimiento** (actualizar documentación y planes, comunicar al equipo y monitorear la implementación). Operado como flujo *(criterio del framework, no de la lámina)*:

```text
SOLICITUD DE CAMBIO
  ↓
Identificación y registro
  ↓
Análisis de impacto y alternativas
  ↓
Decisión autorizada
  ├─ Rechazado → registrar motivo y comunicar
  ├─ Pospuesto → registrar condición para reconsiderar
  └─ Aprobado
        ↓
     Actualizar requisitos, modelos, prioridades y pruebas
        ↓
     Comunicar, implementar y verificar
        ↓
     Cerrar con evidencia y versión
```

### 12.3. Evaluar el impacto antes de aprobar

Para cada solicitud, revisar como mínimo:

| Dimensión | Pregunta |
|---|---|
| Negocio | ¿Qué objetivo cambia o qué nuevo beneficio aporta? |
| Alcance | ¿Qué se agrega, modifica o elimina? |
| Requisitos | ¿Qué IDs y criterios quedan afectados? |
| Procesos | ¿Cambian tareas, roles, excepciones o reglas? |
| Interfaces y datos | ¿Se altera el contrato con otro sistema o el significado de información? |
| Calidad | ¿Qué riesgos o atributos empeoran o mejoran? |
| Pruebas | ¿Qué casos deben crearse, revisarse o repetirse? |
| Entrega | ¿Qué ocurre con esfuerzo, fecha, costo y dependencias? |
| Decisión | ¿Quién puede aprobar y con qué fundamento? |

La lámina indica que la aprobación la **realiza un comité de control de cambios**, con criterios claros y objetivos, y que **solo se aprueban cambios beneficiosos y justificados** (04-14). Como adaptación *(criterio del framework, no de la lámina)*: en proyectos pequeños, ese rol puede asumirlo el responsable del producto; lo que no se permite son cambios de alcance sin autoridad reconocida.

### 12.4. Registro de cambio reutilizable

```markdown
### CR-[NNN] — [Título]
- Solicitante, rol y fecha:
- Descripción y motivo:
- Evidencia que originó el cambio:
- Necesidad / objetivo asociado:
- Elementos actuales afectados (IDs y versiones):
- Alternativas evaluadas:
- Riesgos, dependencias y costo o plazo:
- Atributos de calidad impactados:
- Pruebas y criterios que deben modificarse:
- Decisión: Aprobado | Rechazado | Pospuesto
- Responsable de la decisión y fecha:
- Nueva versión o línea base:
- Acciones y responsables:
- Evidencia de implementación y verificación:
- Estado de cierre:
```

### 12.5. Reglas de versionado documental

- Nunca reutilices un ID para un requisito diferente.
- Conserva el historial de modificaciones relevantes.
- Diferencia la **última versión editada** de la **última versión aprobada**.
- Al modificar un requisito, revisa criterios, escenarios, prototipos, procesos y pruebas vinculados.
- Registra cuándo un supuesto fue confirmado o refutado.
- Incluye quién aprobó el cambio, no solo quién editó el archivo.
- Si un criterio aún no está resuelto, registra el bloqueo; no ocultes el riesgo en una nota general.

**Puerta de salida 12:** cualquier persona puede reconstruir por qué existe un requisito, qué versión está aprobada, qué cambió y qué debe volver a probarse.

---

## 13. Preparar el traspaso a diseño, desarrollo y pruebas

*Fuente: capítulo 04, diapositiva 15; el resto es criterio del framework.*

El trabajo de requisitos se considera **listo para una entrega concreta** cuando existe información suficiente para comenzar esa entrega responsablemente; esto no significa que se hayan cerrado todas las necesidades futuras del producto.

### 13.1. Paquete de entrega

| Componente | Contenido mínimo |
|---|---|
| Problema y objetivos | Situación comprobada, resultado esperado y métricas |
| Alcance | Incluido, excluido, futuro y restricciones |
| Personas y evidencia | Interesados y hallazgos que originan decisiones |
| Proceso | AS-IS / TO-BE o explicación de por qué no aplica |
| Catálogo de requisitos | IDs, versiones, tipos, fuentes, estados y prioridades |
| Comportamiento | Casos de uso o historias con escenarios normales y excepciones |
| Calidad | RNF, atributos, riesgos, métricas y plan de comprobación |
| Validación | Observaciones resueltas, acuerdos y pendientes explícitos |
| Trazabilidad | Relación entre objetivos, requisitos, criterios y pruebas |
| Cambio | Procedimiento y autoridad para aprobar modificaciones |

### 13.2. Semáforo textual de preparación

- **LISTO:** las condiciones críticas están claras y verificables para el alcance de la entrega.
- **CONDICIONADO:** existe un supuesto o decisión pendiente que no impide comenzar tareas independientes; tiene responsable y límite.
- **BLOQUEADO:** falta una decisión que impide definir una función crítica, un contrato de interfaz, un riesgo o una condición de aceptación.

**Nunca convertir «bloqueado» en «listo» cambiando solamente una etiqueta.** Resuelve el impedimento o reduce formalmente el alcance.

### 13.3. Durante implementación y pruebas

1. Si diseño descubre una ambigüedad, devuelve el requisito a análisis o registra aclaración aprobada.
2. Si una prueba falla, conserva el resultado observado y vincúlalo al criterio esperado.
3. Si el comportamiento esperado cambia, controla el cambio antes de «adaptar» las pruebas para que pasen.
4. Si un nuevo riesgo aparece, reevalúa atributos y escenarios de calidad.
5. Al aceptar una entrega, documenta lo aprobado, lo no cumplido y las excepciones autorizadas.

---
## 14. Plantillas mínimas para ejecutar el framework

*Fuente: criterio del framework, a partir de las secciones anteriores.*

Las siguientes plantillas son alternativas compactas para proyectos que no necesitan mantener todas las fichas extensas de las secciones anteriores. Puedes copiarlas dentro de un repositorio, una wiki o un único documento; conserva los mismos identificadores entre archivos.

### P01. Ficha de inicio y alcance

```markdown
# Ficha de inicio — [proyecto]
- Problema central:
- Evidencia inicial y fecha:
- Afectados:
- Objetivo general:
- Objetivos específicos y métricas:
- Proceso o contexto afectado:
- Incluye:
- No incluye:
- Restricciones:
- Suposiciones por validar:
- Riesgos iniciales:
- Interesados y responsables de decisión:
- Enfoque de trabajo elegido y razón:
- Frecuencia de revisión:
- Condiciones para comenzar la siguiente etapa:
```

### P02. Ficha de levantamiento de información

```markdown
# Registro de sesión / evidencia — EV-[NNN]
- Fecha y técnica: Entrevista | Observación | Taller | Cuestionario | Otra
- Objetivo de la consulta:
- Roles participantes:
- Preguntas o tareas realizadas:
- Hechos observados:
- Necesidades expresadas:
- Alternativas sugeridas:
- Excepciones o problemas relevantes:
- Evidencia conservada:
- Afirmaciones contradictorias:
- Pendientes y responsable:
- Requisitos candidatos derivados:
- Validación del resumen: Sí | Pendiente
```

### P03. Diagnóstico y objetivo medible

```markdown
# Diagnóstico — PROB-[NNN]
- Problema observable:
- Síntomas:
- Causas candidatas y evidencia:
- Efectos:
- Causas que abordará el proyecto:
- Causas expresamente fuera de alcance:
- Objetivo general (qué, mediante qué, para qué):
- Objetivos específicos:
- Métrica y unidad:
- Línea base / método de medición:
- Situación esperada:
- Umbral y plazo:
- Fuente de la meta y responsable de aprobarla:
- Supuestos y comprobaciones pendientes:
```

### P04. Tabla de proceso textual

| Paso | Rol / carril | Disparador o entrada | Actividad (verbo + objeto) | Decisión / alternativa | Resultado | Regla relacionada |
|---|---|---|---|---|---|---|
| 1 | [rol] | [evento] | [actividad] | [condición] | [dato/estado] | [RN-...] |

**Control:** comprobar que cada ruta llega a un resultado, que hay ruta de rechazo/errores y que el rol que decide puede hacerlo realmente.

### P05. Catálogo compacto de requisitos

| ID | Nombre | Tipo | Descripción verificable | Fuente | Prioridad | Criterio de aceptación | Estado | Responsable |
|---|---|---|---|---|---|---|---|---|
| RF-001 | [nombre] | RF | [comportamiento condicionado] | EV-001 | [valor] | CA-001 | En análisis | [rol] |

Para requisitos complejos, usar la **ficha completa de la sección 8.2** en vez de comprimir excepciones, entradas y salidas en una sola celda.

### P06. Catálogo de reglas de negocio

| ID | Regla | Fuente | Aplica a | Excepción | Forma de comprobarla | Estado |
|---|---|---|---|---|---|---|
| RN-001 | [política clara] | [EV-...] | [RF, proceso] | [excepción] | [CA o CP] | Validar |

### P07. Matriz de decisión de requisitos

| ID | Impacto de negocio (1–5) | Complejidad (B/M/A) | Riesgo | Obligatorio | Dependencias | Entrega propuesta | Motivo |
|---|---|---|---|---|---|---|---|
| RF-001 | 5 | M | Medio | No | RN-001 | Primera | [motivo] |

La prioridad debe revisarse con quien representa la necesidad y con quien conoce el costo de implementación.

### P08. Plan de verificación y aceptación

| Caso | Requisito y criterio | Tipo de prueba | Precondiciones y datos | Pasos resumidos | Resultado esperado | Resultado observado | Estado y evidencia |
|---|---|---|---|---|---|---|---|
| CP-001 | RF-001 / CA-001 | Funcional | [datos] | [pasos] | [resultado] | Sin ejecutar | Pendiente |

**Estados recomendados:** `No ejecutado`, `Aprobado`, `Fallido`, `Bloqueado`, `No concluyente`. Si la prueba requiere ambiente, integración o credenciales que no existen, registra el bloqueo, no escribas un éxito hipotético.

### P09. Matriz de calidad

| Atributo | Riesgo | RNF | Escenario | Métrica | Umbral | Instrumento | Evidencia |
|---|---|---|---|---|---|---|---|
| Desempeño | [riesgo] | RNF-001 | [carga y datos] | [unidad] | [criterio] | [herramienta] | Pendiente |

### P10. Registro de decisiones

```markdown
# DEC-[NNN] — [título]
- Fecha:
- Problema o pregunta:
- Contexto y evidencia:
- Opciones consideradas:
- Criterios para elegir:
- Decisión adoptada:
- Motivo:
- Responsable de aprobar:
- Requisitos / procesos / pruebas afectados:
- Riesgos aceptados y mitigaciones:
- Condición para revisar la decisión:
```

### P11. Registro de pendientes y supuestos

| ID | Tipo | Descripción | Consecuencia si no se resuelve | Responsable | Acción de comprobación | Fecha objetivo | Estado |
|---|---|---|---|---|---|---|---|
| PEN-001 | Supuesto | [descripción] | [impacto] | [rol] | [actividad] | [fecha] | Abierto |

### P12. Registro de revisión y aprobación

```markdown
# Revisión de línea base — [versión]
- Alcance y artefactos revisados:
- Participantes y responsabilidades:
- Requisitos aprobados:
- Requisitos pendientes o excluidos:
- Conflictos y riesgos aún abiertos:
- Verificación de trazabilidad:
- Verificación de criterios de aceptación:
- Atributos y métricas de calidad revisados:
- Decisiones y reservas explícitas:
- Autoridad de aprobación y fecha:
- Próxima revisión prevista:
```

---

## 15. Ejemplo de aplicación transversal: sistema de solicitudes genérico

*Fuente: criterio del framework (ejemplo didáctico).*

> **Ejemplo únicamente didáctico.** No es un proyecto real ni una especificación que deba copiarse literalmente.

**Necesidad inicial:** una organización quiere ordenar solicitudes y conocer su estado sin consultar a varias personas.

**Paso 1 — Problema.** Se detectan demoras de respuesta y estados desconocidos. La causa todavía debe investigarse.

**Paso 2 — Evidencia.** Se entrevista a solicitantes y revisores, se observa cómo reciben peticiones y se analizan los registros actuales. Se diferencia el hecho «no hay un registro consolidado» de la hipótesis «un nuevo software reducirá el tiempo».

**Paso 3 — Diagnóstico.** Un esquema causal puede revelar: métodos distintos, registros incompletos, responsabilidades no definidas y falta de medición. El equipo elige cuáles puede abordar.

**Paso 4 — Objetivo.** Se acuerda medir el tiempo de respuesta inicial y el porcentaje de solicitudes cuyo estado puede consultarse. Los umbrales se definirán con los interesados después de obtener una línea base.

**Paso 5 — Proceso.** Se modelan roles: solicitante, revisor y, si aplica, servicio externo de notificaciones. Se distinguen registro, revisión, solicitud de antecedentes, aprobación, rechazo y cierre.

**Paso 6 — Requisitos.** Se redacta `RF-001: registrar solicitud`, `RF-002: consultar estado`, `RF-003: solicitar antecedentes` y las reglas correspondientes. No se presupone una app móvil, una plataforma o una tecnología sin justificación.

**Paso 7 — Validación.** Se revisan rutas alternativas y un prototipo de la consulta de estado con usuarios. Se modifica lo que no entienden antes de prometer la interfaz definitiva.

**Paso 8 — Calidad.** Se seleccionan, entre otros, exactitud del estado, permisos de consulta, capacidad de interacción y desempeño en condiciones especificadas. Se redactan criterios medibles.

**Paso 9 — Priorización.** Se evalúan impacto y complejidad. El equipo puede entregar primero registro y consulta, pero solo si ambas funciones forman un flujo coherente y se controlan permisos y errores indispensables.

**Paso 10 — Pruebas y cambio.** Cada criterio se vincula a una comprobación. Si los revisores solicitan un estado nuevo, se registra el cambio, se revisan procesos, requisitos y casos de prueba, y se decide antes de implementarlo.

**Resultado:** se puede rastrear el problema inicial hasta cada requisito, la razón de su prioridad y la forma de demostrar su cumplimiento.

---

## 16. Lista de verificación de principio a fin

*Fuente: criterio del framework.*

Marca cada casilla con evidencia o registra explícitamente `No aplica` y su motivo. No necesitas cumplir tareas que tu proyecto no requiere; sí necesitas justificar las omisiones importantes.

### Comprensión del problema

- [ ] Problema expresado sin presuponer la solución.
- [ ] Hechos, hipótesis y deseos separados.
- [ ] Causas, consecuencias y límites revisados.
- [ ] Objetivos generales y específicos acordados.
- [ ] Línea base y métricas propuestas o pendientes con responsable.

### Levantamiento y modelado

- [ ] Interesados importantes identificados.
- [ ] Técnicas elegidas según las preguntas a responder.
- [ ] Hallazgos asociados a fuentes y fechas.
- [ ] Contradicciones registradas y tratadas.
- [ ] Procesos o interacciones necesarios modelados.
- [ ] Rutas excepcionales importantes consideradas.

### Especificación y priorización

- [ ] Requisitos con IDs, tipo y fuente.
- [ ] RF expresan comportamientos; RNF expresan condiciones medibles.
- [ ] Reglas de negocio y restricciones separadas.
- [ ] Priorización justificada y alcance acordado.
- [ ] ERS o especificación equivalente coherente y accesible.
- [ ] Pendientes y supuestos están visibles.

### Validación y calidad

- [ ] Requisitos verificados por validez, consistencia, totalidad, realismo y verificabilidad.
- [ ] Personas competentes han revisado el contenido que les corresponde.
- [ ] Criterios de aceptación distinguidos de resultados observados.
- [ ] Atributos de calidad relevantes seleccionados por riesgo.
- [ ] Métricas, escenarios y umbrales acordados o marcados pendientes.
- [ ] Herramientas de evaluación elegidas por finalidad, no por popularidad.

### Continuidad

- [ ] Hay matriz de trazabilidad de objetivos a pruebas.
- [ ] Existe procedimiento de aprobación de cambios.
- [ ] Revisiones o Playbacks generan actas y acciones.
- [ ] Se conserva versión vigente y versión aprobada.
- [ ] La entrega al equipo de implementación identifica bloqueos y riesgos.

---

## 17. Guía rápida para decidir qué hacer si surge una duda

*Fuente: criterio del framework.*

| Situación encontrada | Acción recomendada | Volver a… |
|---|---|---|
| «Tenemos una idea de software, pero no sabemos si resuelve algo» | Definir problema, evidencia y objetivo; contrastar hipótesis | Secciones 2–3 |
| «Distintos usuarios explican el flujo de manera incompatible» | Observar el proceso, documentar versiones y revisar con interesados | Secciones 3–4 |
| «No sabemos qué técnica utilizar» | Partir de la pregunta a responder y seleccionar el método más directo | Secciones 2.2, 3.2, 6.1 o 10.8 |
| «Tenemos tareas, pero no está claro quién decide» | Revisar carriles, autoridad y puntos de decisión | Secciones 0.4 y 4 |
| «Un requisito se puede interpretar de dos formas» | Separar escenarios y completar entrada, condición, salida y regla | Secciones 5, 6 y 8 |
| «No sabemos qué implementar primero» | Comparar valor, complejidad, obligaciones y dependencias | Sección 7 |
| «El usuario aprobó una pantalla; ¿ya validó el sistema?» | Diferenciar prototipo, requisito, criterio y prueba real | Secciones 6, 9 y 10 |
| «Nos piden mejor rendimiento o seguridad» | Convertirlo en un RNF medible y evaluar riesgos | Secciones 8.3 y 10 |
| «Cambió una política mientras desarrollábamos» | Registrar CR, evaluar impacto, decidir y actualizar trazabilidad | Sección 12 |
| «La prueba falla, pero queremos cerrar la entrega» | Mantener resultado real, evaluar importancia y registrar la aceptación o excepción autorizada | Secciones 10 y 13 |

---

## 18. Reglas para usar este documento con personas o asistentes de IA

*Fuente: criterio del framework.*

Este framework también puede ser utilizado como referencia para orientar trabajo asistido por IA, siempre bajo revisión humana:

1. **Consultar el estado real del proyecto antes de sugerir artefactos.** El framework describe qué conviene hacer; no acredita que ya se haya hecho.
2. **No inventar fuentes, entrevistas, métricas, aprobaciones, decisiones o resultados de prueba.** Marcar `Pendiente` cuando falten.
3. **No crear un documento por inercia.** Explicar qué decisión habilita y si otro artefacto ya cumple esa función.
4. **No confundir recomendaciones del framework con obligaciones de una institución, empresa o contrato.** Las exigencias reales del proyecto prevalecen.
5. **Diferenciar evidencia de elaboración.** Una tabla escrita es un artefacto preparado; no prueba que el interesado la aprobó.
6. **Actualizar relaciones entre artefactos.** Si se modifica un requisito, considerar objetivos, modelos, reglas, criterios, pruebas y decisiones relacionadas.
7. **Respetar la elección de opciones.** Si hay dos técnicas posibles, proponer una y explicar cuándo usar la otra, en vez de emplear ambas por defecto.
8. **Mantener el contenido comprensible sin imágenes.** Si un proceso no puede explicarse en texto, añadir detalle de actores, decisiones, entradas, salidas y excepciones; no remitir a una figura ausente.

---

## 19. Criterio final de terminación

*Fuente: criterio del framework.*

La ingeniería de requerimientos de una entrega está preparada cuando el equipo puede responder **sin suposiciones ocultas**:

1. ¿Qué problema se resuelve, para quién y con qué evidencia?
2. ¿Qué resultado medible significa éxito?
3. ¿Qué está dentro y fuera del alcance?
4. ¿Qué hace el sistema y qué no hace?
5. ¿Qué ocurre en los escenarios normales y excepcionales?
6. ¿Qué restricciones, reglas y dependencias se deben respetar?
7. ¿Qué atributos de calidad son importantes y cómo se medirán?
8. ¿Quién validó las necesidades y quién autoriza cambios?
9. ¿Cómo se rastrea cada requisito hasta una comprobación?
10. ¿Qué decisiones o riesgos permanecen abiertos y quién los resolverá?

La aprobación del documento **no reemplaza** la implementación, la ejecución de pruebas o la validación del producto terminado. El framework sigue utilizándose durante las iteraciones y cuando aparezcan nuevas necesidades.

---

## Historial

- 23 de noviembre de 2026: auditoría contra los PDF oficiales; corregidos SMART (R = Realista), etapas del focus group, rama legal de los RNF y listas de atributos observables y no observables; agregadas buenas prácticas BPMN, características y reglas del Playback, fuentes por sección y marcas de criterio propio.

## Créditos académicos

**Universidad San Sebastián (USS).**  
**Prof. Rodrigo Caballero Vivanco**, docente de *Ingeniería de Requerimientos y Aseguramiento de la Calidad*.

Este framework reutilizable está elaborado a partir del contenido práctico de las nueve unidades de clase proporcionadas, reorganizado por decisiones y flujo de trabajo. Los esquemas seleccionados se explican en texto y tablas; no se insertan ni se enlazan imágenes.
