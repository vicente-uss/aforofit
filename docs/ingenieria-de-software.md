# Ingeniería de Software

Base de conocimiento del ramo Taller de Ingeniería de Software, aplicable a cualquier proyecto de software. Integra siete semanas sobre requisitos, modelamiento, calidad, documentación, ciclo de vida, estimación de tamaño y estimación de esfuerzo con COCOMO.

## Cómo usar este documento

Sirve para estudiar y para decidir qué modelo elaborar, qué probar y cómo justificar una estimación. El índice vincula cada tema con la **semana y diapositiva** de origen; para citar el material, indica semana y diapositiva. Las exigencias de cada entrega las fija su pauta, y las decisiones y el estado de cada proyecto se registran en su propia documentación, separados de la teoría.

Cada diapositiva incluye su texto y, al final, un bloque **Contenido visual de la lámina** que transcribe sus infografías, tablas, diagramas y capturas, para que el documento se entienda sin las imágenes.

## Índice por tema

| Semana | Temas y diapositivas |
|---|---|
| [1. Fundamentos y requisitos](#semana-1) | Ingeniería de software y proceso integral (4–17), ingeniería de requisitos (18–30), calidad de un requisito (31–39), caso integrador y desafío (39–46). |
| [2. Modelamiento, UML y diseño](#semana-2) | Qué modelar y diagramas UML (5–28), casos de uso y relaciones (29–45), ejemplos UML (46–52), del modelo al diseño y arquitectura (53–63). |
| [3. Calidad y pruebas](#semana-3) | Calidad y QA (5–19), verificación y validación (20–28), error, defecto y falla (29–32), niveles de prueba (33–44), tipos de prueba y QA transversal (45–52). |
| [4. Documentación, evolución y ciclo de vida](#semana-4) | Documentación y mantenimiento (5–16), SDLC y enfoques (17–27), cascada, RAD, RUP y AUP (28–44), agilidad y Scrum (45–83). |
| [5. Estimación de proyectos](#semana-5) | Proyecto y estimación (3–14), tamaño, esfuerzo, duración, recursos y costo (15–25), métricas (26–31), estimación, supuestos e incertidumbre (32–42), descomposición (43–52), juicio experto, analogía y bottom-up (53–64), de la estimación al costo (65–70). |
| [6. Estimación con LOC y FP](#semana-6) | Tamaño del software (3–6), LOC y sus límites (7–17), puntos de función: EI, EO, EQ, ILF y EIF (18–35), complejidad, DET, FTR, RET y pesos (36–53), LOC frente a FP (54–58). |
| [7. COCOMO](#semana-7) | De LOC y PF a COCOMO (4–9), modos y coeficientes (11–13), ejemplo guiado orgánico (14–19), semiacoplado y empotrado (20–22), errores y costo (23–24), sensibilidad y limitaciones (25–29), ejercicio, rúbrica y síntesis (30–36). |

## Guía de aplicación

1. **Definir requisitos.** Identificar usuarios, necesidad y alcance. Registrar requisitos funcionales y no funcionales y cómo se comprobará cada uno. Semana 1.
2. **Modelar y diseñar.** Elegir el diagrama según la pregunta: casos de uso para actores y objetivos, secuencia para interacciones, actividades para flujos, clases para estructura y componentes o despliegue para arquitectura. Semana 2.
3. **Planificar la calidad.** Verificar el cumplimiento de la especificación y validar que la solución satisface la necesidad. Elegir el nivel de prueba (unitaria, integración, sistema o aceptación) y el tipo según lo que se comprueba. Semana 3.
4. **Documentar y evolucionar.** Registrar cómo ejecutar el sistema, qué decisiones de diseño se tomaron y qué impacto tiene cada cambio. Organizar el trabajo según la incertidumbre y la frecuencia de retroalimentación. Semana 4.
5. **Estimar y planificar.** Medir el tamaño (LOC o puntos de función) con supuestos explícitos; pasar a esfuerzo por productividad histórica o COCOMO; luego a duración, recursos y costo, contrastando con más de una estrategia. Semanas 5, 6 y 7.

### Ficha de trazabilidad y pruebas

| Requisito | Modelo o decisión | Nivel de prueba | Condición y resultado esperado | Resultado observado | Evidencia |
|---|---|---|---|---|---|
| RF-01 · Registrar una solicitud | Flujo de registro | Integración | Con datos válidos, registrar la solicitud debe guardarla una vez y devolver su identificador. | Por ejecutar | Pendiente |

### Ficha de estimación

| Dato | Qué registrar |
|---|---|
| Alcance y técnica | Funciones incluidas y criterio para elegir LOC o puntos de función. |
| Tamaño | Cálculo, unidad (LOC, KLOC o PF) y supuestos. |
| Esfuerzo | Persona-mes estimados, modelo o productividad usada y su fuente. |
| Duración | Tiempo calendario según disponibilidad y dependencias. |
| Recursos y costo | Personas, dedicación, herramientas, infraestructura y costo. |
| Riesgos | Causas de variación y efecto sobre la estimación. |

### Cómo usar esta referencia como contexto

- Elegir un artefacto por la pregunta que debe responder: un diagrama de secuencia permite revisar interacciones y un caso de prueba permite comprobar el resultado.
- Registrar el nivel de prueba, las condiciones de ejecución, el resultado esperado y lo observado. El estado «por ejecutar» identifica una prueba pendiente.
- Al estimar, documentar por separado tamaño, esfuerzo y duración, y citar las diapositivas que respaldan cada paso.

### Ejemplo genérico

Para revisar el flujo de registro de una solicitud, un diagrama de secuencia muestra la interacción entre la interfaz, la aplicación y la base de datos. Una prueba de integración comprueba que la solicitud quede guardada y una prueba de sistema recorre el flujo completo hasta la confirmación al usuario. Cada resultado registra la versión probada y su evidencia.

## Material de clase por semana

> Las semanas 1 a 6 provienen de la transcripción de texto del curso, completada con el contenido visual de cada lámina a partir de los PDF oficiales. La semana 7 se transcribió directamente del PDF.

<a id="semana-1"></a>

## Ingeniería de Software — Semana 1

Fuente del ZIP: `Ingenieria_de_Software_Semana_01.md`.

### Diapositiva 1

CLASE 1

SEMANA 1

Introducción a la Ingeniería Informática

Taller de Ingeniería de Software

Alfredo Pereira

Prof. Dr. Rodrigo Correa R.

**Contenido visual de la lámina:** Portada con fotografía de un edificio patrimonial de la universidad y logo USS. Texto: *Semana 1 · Taller de Ingeniería de Software · Prof. Dr. Rodrigo Correa R.*

### Diapositiva 2

#### OBJETIVO DE LA CLASE

❑Visión General ❑Aspectos introductorios ❑Conceptos

**Contenido visual de la lámina:** Lista con casillas (Visión general, Aspectos introductorios, Conceptos). Imagen ilustrativa: escalera con íconos que sube hacia una diana con un dardo.

### Diapositiva 3

#### ¿Qué aprenderemos hoy?

- Comprender qué es la Ingeniería de

Software. ✓Conocer por qué nació esta disciplina. ✓Analizar las causas del fracaso de

proyectos. ✓Comprender el proceso integral de

desarrollo. ✓Introducir la Ingeniería de Requerimientos.

**Contenido visual de la lámina:** Lista con marcas de verificación. Imagen ilustrativa: silueta de una persona pensando, rodeada de íconos de ciencia y tecnología.

### Diapositiva 4

#### ¿Qué es desarrollar software?

No es solamente programar.

"El código representa solo una

parte del desarrollo de

software."

**Contenido visual de la lámina:** Diagrama vertical en bucle con siete etapas unidas por flechas: **Necesidad → Análisis → Diseño → Programación → Pruebas → Entrega → Mejoras**, y una flecha de retorno desde Mejoras a Necesidad.

### Diapositiva 5

#### ¿Qué hace un Ingeniero de Software?

**Contenido visual de la lámina:**

Infografía **Ciclo de desarrollo de software – Parte 1 (1 al 4)**, con cuatro roles unidos por flechas y la pregunta *¿Dónde participa?*:
1. **Cliente** — inicia el proceso: comunica sus necesidades y objetivos; da retroalimentación y valida resultados; prioriza requerimientos y define el valor del producto.
2. **Analista** — convierte la necesidad en requisitos: realiza entrevistas, talleres y análisis; documenta casos de uso e historias de usuario; valida con el cliente que los requisitos sean correctos y completos.
3. **Arquitecto** — diseña la solución a alto nivel: define la arquitectura del sistema; selecciona tecnologías y patrones; establece estándares y lineamientos técnicos.
4. **Desarrollador** — construye el software: diseña en detalle y escribe código limpio y mantenible; realiza pruebas unitarias; integra módulos y corrige defectos.

### Diapositiva 6

#### ¿Qué hace un Ingeniero de Software?

**Contenido visual de la lámina:**

Infografía **Ciclo de desarrollo de software – Parte 2 (5 al 7)**:
5. **QA** — asegura la calidad del producto: diseña planes y casos de prueba; ejecuta pruebas manuales y automáticas; reporta defectos y valida correcciones.
6. **DevOps** — lleva el software a producción y lo mantiene disponible: configura pipelines de integración y despliegue continuo (CI/CD); administra servidores, contenedores y nubes; monitorea el sistema y asegura su disponibilidad.
7. **Usuario** — es quien usa el sistema y recibe el valor: usa el sistema en su día a día; entrega feedback que permite mejorar continuamente; se beneficia del valor generado por todo el equipo.

Mensaje final: *El ingeniero de software participa en todo el ciclo de vida del producto, desde entender la necesidad hasta entregar valor al usuario final, asegurando calidad, eficiencia y mejora continua.*

### Diapositiva 7

#### Definición de Ingeniería de Software

IEEE (Institute of Electrical and Electronics Engineers) "La Ingeniería de Software es la aplicación de un enfoque sistemático, disciplinado y cuantificable para el desarrollo, operación, mantenimiento y evolución del software; es decir, la aplicación de la ingeniería al software."

Esta es probablemente la definición más utilizada en ámbitos académicos y profesionales.

**Contenido visual de la lámina:** Lámina de texto con la definición de la IEEE, sin imágenes con contenido adicional.

### Diapositiva 8

#### Definición de Ingeniería de Software

Roger S. Pressman y Bruce Maxim (2020) "La Ingeniería de Software es una tecnología en capas que integra procesos, métodos y herramientas para desarrollar software de calidad, considerando tanto los aspectos técnicos como la gestión del proyecto."

Pressman destaca la importancia de los procesos de desarrollo y de la mejora continua de la calidad.

**Contenido visual de la lámina:** Lámina de texto con la definición de Pressman y Maxim (2020), sin imágenes con contenido adicional.

### Diapositiva 9

#### Definición de Ingeniería de Software

La Ingeniería de Software es la disciplina que aplica principios, métodos, procesos y herramientas de ingeniería para analizar, diseñar, desarrollar, probar, implementar y mantener sistemas de software de manera sistemática, asegurando calidad, confiabilidad, seguridad, eficiencia y satisfacción de las necesidades de los usuarios durante todo su ciclo de vida.

**Contenido visual de la lámina:** Lámina de texto, con *satisfacción de las necesidades de los usuarios* destacado en negrita.

### Diapositiva 10

#### ¿Por qué existe la Ingeniería de Software?

**Contenido visual de la lámina:** Imagen ilustrativa: figura humana blanca pensativa junto a un gran signo de interrogación rojo.

### Diapositiva 11

#### ¿Por qué existe la Ingeniería de Software?

Porque desarrollar software es una actividad compleja. Problemas: • Costos • Calidad • Tiempo • Riesgo • Personas

**Contenido visual de la lámina:** Imagen ilustrativa: dibujo de una habitación desordenada (herramientas, papeles y objetos en el suelo), como metáfora de la complejidad.

### Diapositiva 12

#### La Crisis del Software

**Contenido visual de la lámina:**

Infografía **La crisis del software**: *En la década del 60, el desarrollo de software enfrentó grandes problemas que motivaron el nacimiento de una nueva disciplina: la Ingeniería de Software.* Línea de tiempo de cinco hitos:
- **1960 · Década del 60 (contexto):** el software comenzó a crecer rápidamente junto al hardware; los programas eran grandes, complejos y difíciles de mantener.
- **1960–1965 · Proyectos atrasados (problema):** los proyectos se entregaban frecuentemente fuera de plazo; las estimaciones iniciales eran poco realistas.
- **1960–1970 · Costos elevados (consecuencia):** los costos se disparaban y los presupuestos se excedían constantemente, afectando a organizaciones y gobiernos.
- **1960–1970 · Software que no cumplía (impacto):** el software entregado no cumplía con los requerimientos, tenía muchos errores, era difícil de modificar y poco confiable.
- **1968 en adelante · Nacimiento de la Ingeniería de Software (solución):** surge la necesidad de aplicar métodos, procesos y herramientas de ingeniería para desarrollar software de calidad de forma planificada y controlada.

Mensaje: *La Crisis del Software fue el punto de inflexión que llevó a reconocer que el software debía desarrollarse con la misma disciplina y rigor que otras áreas de la ingeniería.*

### Diapositiva 13

#### Casos emblemáticos de fracaso

**Contenido visual de la lámina:**

Tabla **Fracasos de proyectos de software — lecciones aprendidas de casos reales que generaron grandes impactos**:

| Proyecto | Año | Problema principal | Impacto | Lección aprendida |
|---|---|---|---|---|
| Ariane 5 | 1996 | Error de conversión de datos (64 bits a 16 bits) que provocó una excepción en el sistema de navegación | El cohete explotó 37 segundos después del lanzamiento | Validar supuestos y realizar pruebas rigurosas al reutilizar software en nuevos entornos |
| Denver International Airport | 1995 | Fallos de integración y sincronización en el sistema automatizado de manejo de equipaje | 16 meses de retraso y sobrecostos > US$500 millones | Planificación realista, integración gradual y validación continua del sistema |
| Knight Capital Group | 2012 | Una actualización defectuosa activó código antiguo en producción | Pérdidas cercanas a US$460 millones en solo 45 minutos | Cambios en producción requieren pruebas automatizadas y despliegues seguros |
| Healthcare.gov | 2013 | Problemas de integración, rendimiento y escalabilidad en el portal de salud | Millones de usuarios sin acceso durante las primeras semanas | Validación funcional, pruebas de carga y coordinación entre equipos son críticas |
| Boeing 737 MAX (software) | 2018–2019 | El software MCAS dependía de un único sensor y activaba correcciones incorrectas | Dos accidentes fatales e inmovilización mundial de la flota | En sistemas críticos, la seguridad requiere redundancia y diseño basado en riesgos |

Lección central: *Los fracasos de software se deben, principalmente, a deficiencias en requisitos, diseño, arquitectura, gestión, pruebas o despliegue. La ingeniería de software es la clave para prevenirlos.*

### Diapositiva 14

#### ¿Por qué fracasan los proyectos?

Principales causas.

Requerimientos deficientes Mala planificación Cambios de alcance Comunicación Gestión

**Contenido visual de la lámina:**

Gráfico circular **¿Por qué fracasan los proyectos? — principales causas identificadas en la industria del software**:
1. **Requerimientos deficientes — 30 %:** requisitos incompletos, ambiguos o mal entendidos que generan soluciones incorrectas.
2. **Mala planificación — 25 %:** estimaciones irreales, falta de recursos, cronogramas poco realistas y riesgos no considerados.
3. **Cambios de alcance — 20 %:** modificaciones constantes en los requisitos o prioridades que desvían el proyecto.
4. **Comunicación — 15 %:** falta de comunicación efectiva entre equipos, stakeholders y clientes.
5. **Gestión — 10 %:** falta de liderazgo, monitoreo inadecuado, control deficiente y toma de decisiones tardía.

### Diapositiva 15

#### El costo de corregir un error

Detectar temprano cuesta mucho menos.

**Contenido visual de la lámina:** Gráfico **El costo de corregir un error** — *cuanto más tarde se detecta un error, mucho más caro es corregirlo*. Eje vertical: costo relativo (escala 1, 10, 100, 1000); eje horizontal: etapa del proyecto. Barras crecientes: **Análisis $1 → Diseño $10 → Implementación $100 → Producción $1000**. Regla general: *corregir un error en producción puede costar hasta 1000 veces más que corregirlo en la etapa de análisis.*

### Diapositiva 16

#### Proceso Integral del Desarrollo de Software

**Contenido visual de la lámina:**

Infografía **Proceso integral de desarrollo de software — de la necesidad a la evolución continua**, con diez etapas numeradas:
1. **Necesidad:** identificación del problema u oportunidad.
2. **Requerimientos:** elicitación y definición de lo que el sistema debe hacer.
3. **Modelamiento:** representación del sistema y sus procesos.
4. **Diseño:** definición de la arquitectura y componentes.
5. **Implementación:** construcción del código y componentes.
6. **QA (aseguramiento de la calidad):** pruebas para validar calidad y cumplimiento de requisitos.
7. **Documentación:** generación de manuales y documentación del proyecto.
8. **Despliegue:** puesta en producción del sistema.
9. **Mantenimiento:** corrección de errores y mejoras continuas.
10. **Evolución:** nuevas funcionalidades y adaptación al cambio.

Franja inferior que agrupa las etapas en fases: **Análisis → Diseño → Construcción → Operación → Mejora continua.** Mensaje: *Un proceso disciplinado permite desarrollar software de calidad, reducir riesgos y generar valor de forma sostenible.*

### Diapositiva 17

#### Proceso Integral de Desarrollo de Software

¿Dónde estamos hoy?

REQUERIMIENTOS.

**Contenido visual de la lámina:** Miniatura de la infografía del proceso integral (diez etapas, con la franja *Proceso continuo: el software evoluciona constantemente para generar valor y responder a los cambios del entorno y del negocio*) y una flecha roja que señala la etapa **02 · Requerimientos**.

### Diapositiva 18

#### Ingeniería del Requerimiento, ¿qué es?

La Ingeniería de Requerimientos es el proceso sistemático de identificar, analizar, documentar, validar y gestionar las necesidades y expectativas de los interesados (stakeholders), asegurando que el sistema desarrollado responda efectivamente a los objetivos del negocio y de los usuarios.

**Contenido visual de la lámina:** Imagen ilustrativa: equipo de profesionales frente a pantallas, con el rótulo *Ingeniería de requisitos*.

### Diapositiva 19

#### Ingeniería del Requerimiento, ¿qué es?

"Los errores en los requerimientos son la principal causa de fracaso en proyectos de software."

Objetivos • Comprender el problema antes de desarrollar la solución. • Identificar necesidades reales de clientes y usuarios. • Reducir riesgos, costos y retrabajos. • Establecer una base sólida para el diseño y desarrollo.

“Construir correctamente el software comienza por comprender correctamente

el problema.”

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 20

#### Proceso de Ingeniería de Requerimientos

Etapas principales

1. Elicitación Obtención de información desde clientes, usuarios y expertos del dominio. 2. Análisis Comprensión, clasificación y resolución de conflictos entre requerimientos.

**Contenido visual de la lámina:** Imagen ilustrativa: persona escribiendo en una libreta, con el rótulo *5 tips para tomar requerimientos de software*.

### Diapositiva 21

#### Proceso de Ingeniería de Requerimientos

Etapas principales 3. Especificación Documentación formal de los requerimientos mediante modelos y descripciones. 4. Validación Verificación de que los requerimientos representan correctamente las necesidades del cliente.

**Contenido visual de la lámina:** Imagen ilustrativa: la misma imagen *5 tips para tomar requerimientos de software*.

### Diapositiva 22

#### Proceso de Ingeniería de Requerimientos

Etapas principales

5. Gestión Control de cambios y trazabilidad durante todo el ciclo de vida del proyecto.

“Los requerimientos evolucionan durante el proyecto; por ello deben

gestionarse continuamente.”

**Contenido visual de la lámina:** Imagen ilustrativa: la misma imagen *5 tips para tomar requerimientos de software*.

### Diapositiva 23

#### Tipos de Requerimientos

❑Funcionales ❑No funcionales

**Contenido visual de la lámina:** Imagen ilustrativa: profesionales junto a un servidor y un escudo de seguridad, con el rótulo *Requerimientos funcionales y no funcionales*.

### Diapositiva 24

#### Tipos de Requerimientos

Requerimientos Funcionales Describen qué debe hacer el sistema. Ejemplos • Registrar usuarios. • Emitir facturas. • Buscar productos. • Generar reportes. • Procesar pagos.

**Contenido visual de la lámina:** Imagen ilustrativa: persona tocando una pantalla digital. Los ejemplos de la lámina son: registrar usuarios, emitir facturas, buscar productos, generar reportes y procesar pagos.

### Diapositiva 25

#### Tipos de Requerimientos

Requerimientos No Funcionales Describen cómo debe comportarse el sistema. Ejemplos • Seguridad • Rendimiento • Escalabilidad • Disponibilidad • Usabilidad • Mantenibilidad • Portabilidad

**Contenido visual de la lámina:** Imagen ilustrativa: manos en un teclado con íconos digitales. Los ejemplos de la lámina son: seguridad, rendimiento, escalabilidad, disponibilidad, usabilidad, mantenibilidad y portabilidad.

### Diapositiva 26

#### Tipos de Requerimientos

Requerimientos del Negocio Definen los objetivos organizacionales que justifican el desarrollo del sistema. Ejemplo: "Reducir en un 30% los tiempos de atención al cliente."

“Un software exitoso satisface tanto los requerimientos

funcionales como los no funcionales.”

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 27

#### Tipos de Requerimientos

Caso práctico Sistema Hospitalario.

¿Qué funcionalidades necesitaría?

**Contenido visual de la lámina:** Imagen ilustrativa: grupo de personas con signos de interrogación sobre sus cabezas.

### Diapositiva 28

#### Tipos de Requerimientos

Caso práctico Sistema Hospitalario.

Ahora identifiquemos requerimientos ❑Funcionales. ❑No funcionales. ❑Negocio.

**Contenido visual de la lámina:** Imagen ilustrativa: dos personas analizando pantallas con gráficos y una lupa.

### Diapositiva 29

#### Técnicas para toma de requerimientos

- Entrevistas

Permiten obtener información detallada de usuarios y expertos. • Talleres (Workshops)

Favorecen la construcción colaborativa de requerimientos. • Observación

Analiza cómo trabajan realmente los usuarios. • Cuestionarios

Recolectan información de grandes grupos. • Análisis documental

Revisión de reglamentos, procedimientos y documentación existente. • Prototipos

Permiten validar ideas antes del desarrollo.

**Contenido visual de la lámina:** Lista de seis técnicas, cada una con su explicación; sin imágenes con contenido adicional.

### Diapositiva 30

#### Técnicas para toma de requerimientos

Comparación

Técnica Mejor uso Entrevistas Profundizar necesidades Observación Comprender procesos reales Talleres Lograr consenso Encuestas Obtener información masiva Prototipos Validar requisitos tempranamente

“La mejor estrategia consiste en combinar diversas técnicas para obtener

una visión integral del problema.”

**Contenido visual de la lámina:**

Tabla **Comparación**:

| Técnica | Mejor uso |
|---|---|
| Entrevistas | Profundizar necesidades |
| Observación | Comprender procesos reales |
| Talleres | Lograr consenso |
| Encuestas | Obtener información masiva |
| Prototipos | Validar requisitos tempranamente |

### Diapositiva 31

#### Calidad de un Buen Requerimiento

Un requerimiento debe ser:

Claro Completo Consistente Verificable Factible Necesario Trazable No ambiguo Priorizado

**Contenido visual de la lámina:** Lista de nueve atributos con marcas de verificación. Imagen ilustrativa: manos que sostienen una tableta con íconos de documento y engranajes.

### Diapositiva 32

#### Calidad de un Buen Requerimiento

Ejemplo

Mal requerimiento "El sistema debe ser rápido."

Buen requerimiento "El sistema deberá responder a cualquier consulta en menos de 2 segundos para el 95% de las solicitudes realizadas simultáneamente por hasta 500 usuarios."

**Contenido visual de la lámina:** Ejemplo con una ✗ roja para el mal requerimiento y una ✓ para el bueno (el bueno agrega «por hasta 500 usuarios»). Imagen ilustrativa: persona con lentes junto a íconos de calidad y una medalla.

### Diapositiva 33

#### Calidad de un Buen Requerimiento

Un requerimiento bien definido reduce significativamente los

errores, los costos de desarrollo y el riesgo de fracaso del

proyecto.

**Contenido visual de la lámina:** Imagen ilustrativa: mano marcando casillas de una lista de verificación en una pantalla.

### Diapositiva 34

#### Calidad de un Buen Requerimiento

Errores frecuentes al levantar requerimientos Ejemplos.

Hablar sólo con el gerente. No entrevistar usuarios. No validar. No documentar. No gestionar cambios.

**Contenido visual de la lámina:** Cinco errores marcados con ✗ roja. Imagen ilustrativa: la palabra *Error* escrita en rojo y borrada con un lápiz.

### Diapositiva 35

#### Calidad de un Buen Requerimiento

Deficiente Correcto

El sistema será seguro.

Todo usuario deberá autenticarse mediante credenciales y las contraseñas deberán almacenarse utilizando algoritmos de hash seguros.

El sistema será fácil de usar.

Un usuario nuevo deberá completar el proceso de registro en menos de 3 minutos sin capacitación previa.

El sistema deberá enviar notificaciones.

El sistema deberá enviar un correo electrónico de confirmación dentro de los 30 segundos posteriores al registro exitoso del usuario.

“La calidad de un proyecto comienza con la calidad de sus requerimientos.”

**Contenido visual de la lámina:** Tabla de dos columnas *Deficiente* (✗) y *Correcto* (✓) con tres pares de ejemplos (seguridad, facilidad de uso y notificaciones).

### Diapositiva 36

#### Calidad de un Buen Requerimiento

**Contenido visual de la lámina:**

Infografía **Ejemplo de un buen levantamiento de requerimientos — caso: Sistema de Gestión Hospitalaria**, con la fotografía de un hospital y la tabla de *stakeholders*:
- **Médicos:** necesitan acceder al historial clínico, registrar diagnósticos, indicar tratamientos y solicitar exámenes.
- **Enfermeras:** requieren registrar signos vitales, administrar medicamentos y dar seguimiento a pacientes.
- **Administración:** necesita gestionar citas, camas, facturación, seguros y recursos del hospital.
- **Farmacia:** requiere controlar inventario, dispensación de medicamentos y alertas de stock.
- **Pacientes:** necesitan agendar citas, ver resultados, recibir indicaciones y pagos en línea.
- **Dirección:** requiere reportes e indicadores, análisis de gestión y toma de decisiones estratégicas.

Mensaje lateral: *«Cada actor posee necesidades distintas.»*

### Diapositiva 37

#### Calidad de un Buen Requerimiento

**Contenido visual de la lámina:**

Infografía **Ejemplo de requerimientos correctamente documentados — Sistema de Gestión Hospitalaria**:
- **Requerimientos funcionales:** registrar pacientes; agendar consultas; emitir recetas; gestionar hospitalizaciones; consultar historial clínico.
- **Requerimientos no funcionales:** disponibilidad 99,9 %; tiempo de respuesta < 2 segundos; cumplimiento normativa sanitaria; respaldo automático diario; acceso mediante autenticación multifactor.

### Diapositiva 38

#### Calidad de un Buen Requerimiento

**Contenido visual de la lámina:** Infografía **Buenas prácticas en Ingeniería de Requerimientos** — *Un buen Ingeniero de Software…*: escucha antes de proponer soluciones; formula preguntas abiertas; valida cada requerimiento con el cliente; documenta todas las decisiones; gestiona los cambios; mantiene trazabilidad; prioriza junto al negocio; piensa siempre en el usuario final. Fotografía de un equipo en reunión frente a una pizarra. Mensaje: *Buenas prácticas en requerimientos = proyectos exitosos, clientes satisfechos y software de valor.*

### Diapositiva 39

#### Calidad de un Buen Requerimiento

**Contenido visual de la lámina:** Infografía **Caso integrador — ¿Cómo abordaríamos este proyecto?**, con la fotografía de un hospital (señalética: urgencias, consultas, hospitalización, imágenes, laboratorio, farmacia) y cinco preguntas: ¿Qué problema debemos resolver? ¿Quiénes utilizarán el sistema? ¿Qué información debemos recopilar? ¿Qué requerimientos funcionales identificar? ¿Qué requerimientos no funcionales serían críticos?

### Diapositiva 40

#### Proceso Integral de Desarrollo de Software

¿Dónde estamos hoy?

REQUERIMIENTOS.

La próxima semana avanzaremos hacia la

siguiente etapa del

proceso: el Modelamiento del

Sistema

**Contenido visual de la lámina:** Miniatura de la infografía del proceso integral con una flecha roja que señala la etapa **03 · Modelamiento** como la siguiente.

### Diapositiva 41

#### Desafío Final

**Contenido visual de la lámina:** Infografía **¿Aceptarían desarrollar este proyecto?** Fotografía de una ciudad con buses, ciclovía y pantallas de información, con etiquetas: transporte en tiempo real, análisis de demanda, semáforos inteligentes, movilidad sostenible, datos en la nube, seguridad y confianza. **Escenario:** la Municipalidad de una gran ciudad desea implementar un **Sistema Inteligente de Transporte Público**. En una reunión de 15 minutos, el alcalde les dice únicamente: *«Queremos una aplicación moderna que mejore el transporte de la ciudad y sea la mejor del país.»* Al terminar la reunión, el alcalde se retira y les pide comenzar el desarrollo la próxima semana. Pregunta final: *¿Qué preguntas harían? ¿Qué información necesitan? ¿Cómo abordarían este proyecto?*

### Diapositiva 42

#### Desafío Final – Trabajo en Equipo

1. ¿Aceptarían comenzar el desarrollo inmediatamente? ¿Por qué? 2. ¿Qué información consideran indispensable obtener antes de iniciar el

proyecto? 3. ¿Quiénes serían los principales stakeholders? 4. Identifiquen al menos cinco requerimientos funcionales. 5. Identifiquen al menos cinco requerimientos no funcionales. 6. ¿Qué riesgos tendría el proyecto si comenzara a desarrollarse con la

información disponible? 7. ¿Qué técnicas de Ingeniería de Requerimientos utilizarían para

comprender realmente el problema?

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 43

#### Desafío Final – Trabajo en Equipo

Desafío adicional Al finalizar, cada grupo deberá responder una pregunta final: ¿Cuál creen que sería la principal causa del fracaso de este proyecto si se desarrollara a partir de la información entregada por el alcalde?

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 44

#### Desafío Final – Trabajo en Equipo

"Si ustedes fueran el jefe del proyecto, ¿firmarían hoy el compromiso de desarrollar este sistema con la información disponible? Justifiquen su respuesta."

"Hoy no aprendimos a programar. Hoy aprendimos cuándo un ingeniero responsable debe decir: 'Todavía

no podemos comenzar'."

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 45

#### Desafío Final – Trabajo en Equipo

Reflexión Final Un Ingeniero de Software no comienza escribiendo código. Comienza comprendiendo el problema, identificando a los actores involucrados y transformando necesidades ambiguas en requerimientos claros, verificables y medibles.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 46

#### Desafío Final – Trabajo en Equipo

Próxima Clase – Semana 2 Del problema... al diseño de la solución

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 47

UNIVERSIDAD SAN SEBASTIAN

YOCACIÓN POR LA 6XC6L6ł•fClA

Fin Semana 1

N U1 ST RA /Ví l S10 N ES E D U CAR EN LA

RAZÓ N , LA VE RDA D Y LA V I RTU D.

---

**Contenido visual de la lámina:** Lámina de cierre: *Fin Semana 1*, con la franja *Nuestra misión es educar en la razón, la verdad y la virtud.*

<a id="semana-2"></a>

## Ingeniería de Software — Semana 2

Fuente del ZIP: `Ingenieria_de_Software_Semana_02.md`.

### Diapositiva 1

CLASE 1

SEMANA 2

Introducción a la Ingeniería Informática

Taller de Ingeniería de Software

Alfredo Pereira

Prof. Dr. Rodrigo Correa R.

**Contenido visual de la lámina:** Portada con fotografía de un edificio patrimonial de la universidad y logo USS. Texto: *Semana 2 · Taller de Ingeniería de Software · Prof. Dr. Rodrigo Correa R.*

### Diapositiva 2

#### OBJETIVO DE LA CLASE

❑COMPRENDER EL PROPÓSITO DEL MODELAMIENTO

DE SISTEMAS. ❑ANALIZAR CÓMO EL DISEÑO, LA IMPLEMENTACIÓN,

EL ASEGURAMIENTO DE LA CALIDAD, LA DOCUMENTACIÓN Y LA EVOLUCIÓN CONTRIBUYEN A LA CONSTRUCCIÓN DE SOFTWARE DE CALIDAD. ❑RELACIONAR CADA ETAPA CON EL CICLO DE VIDA DEL

DESARROLLO DE SOFTWARE Y CON LAS METODOLOGÍAS UTILIZADAS EN LA INDUSTRIA.

**Contenido visual de la lámina:** Lista de tres objetivos con casillas. Imagen ilustrativa: escalera con íconos que sube hacia una diana.

### Diapositiva 3

#### ¿Qué aprenderemos hoy?

Hoy continuaremos avanzando en el

Proceso Integral de Desarrollo de Software, comprendiendo cómo una vez definidos los requerimientos, estos se transforman progresivamente en una solución tecnológica.

**Contenido visual de la lámina:** Imagen ilustrativa: silueta de una persona pensando, rodeada de íconos de ciencia y tecnología.

### Diapositiva 4

#### Proceso Integral de Desarrollo de Software

¿Dónde estamos hoy?

MODELAMIENTO.

"Una vez comprendido el problema, el siguiente desafío consiste en representar la

solución antes de construirla."

**Contenido visual de la lámina:** Miniatura de la infografía del proceso integral de desarrollo de software (diez etapas, de Necesidad a Evolución) con una flecha roja que señala la etapa **03 · Modelamiento**.

### Diapositiva 5

#### ¿Por qué modelamos un sistema?

**Contenido visual de la lámina:** Infografía con tres preguntas encadenadas: *Imaginen construir un edificio… sin planos.* · *¿O fabricar un avión… sin diseños?* · **Entonces:** *¿Por qué muchas veces pretendemos desarrollar software sin modelarlo?* A la derecha, fotografía de un profesional revisando planos junto a la maqueta de un edificio.

### Diapositiva 6

#### ¿Qué es un modelo?

Ejemplos:

Un modelo es una representación simplificada de la realidad que permite comprender, analizar, comunicar y validar una solución antes de implementarla.

**Contenido visual de la lámina:** Cuatro ejemplos de modelos, cada uno con su imagen: **plano de una casa** (planta con habitaciones y medidas), **mapa** (calles con puntos de interés), **maqueta** (modelo 3D de una casa) y **diagrama UML** (diagrama de clases con cajas y relaciones).

### Diapositiva 7

#### Beneficios del Modelamiento

**Contenido visual de la lámina:**

Infografía **El valor del modelamiento — un buen modelo hoy, mejores resultados siempre**, con seis beneficios unidos por flechas:
1. **Comprender:** entendemos las necesidades y el problema real del negocio y de los usuarios → enfoque claro en lo importante.
2. **Comunicar:** representamos visualmente las ideas para que todos hablen el mismo idioma → mejor comunicación entre todos los involucrados.
3. **Validar:** verificamos que el modelo cumpla con las necesidades del usuario y del negocio → mayor calidad desde el inicio y usuarios más satisfechos.
4. **Reducir errores:** detectamos problemas a tiempo, antes de escribir código → menos errores, menos retrabajo y menos riesgos.
5. **Facilitar desarrollo:** guiamos al equipo con claridad, mejorando la planificación, la implementación y las pruebas → desarrollo más ágil, organizado y predecible.
6. **Reducir costos:** menos retrabajo, menos fallos en producción y mejor uso de los recursos → proyectos más rentables y sostenibles en el tiempo.

Mensaje: *Modelar bien hoy es construir mejor mañana. Menos incertidumbre, más calidad y mejores resultados.*

### Diapositiva 8

#### ¿Qué ocurre si no modelamos?

**Contenido visual de la lámina:**

Infografía **¿Qué ocurre si no modelamos? — modelar antes de desarrollar hace la diferencia**. **Equipo A** (programa inmediatamente): muchos errores, cambios constantes, retrabajo continuo, frustración del equipo y cliente insatisfecho. **Equipo B** (modela primero): menos errores, cambios controlados, menos retrabajo, equipo enfocado y cliente satisfecho.

| Criterio | Equipo A (sin modelar) | Equipo B (con modelado) | Resultado |
|---|---|---|---|
| Tiempo | Largo | Más corto | Gana Equipo B |
| Errores | Muchos | Pocos | Menos errores con modelado |
| Retrabajo | Alto | Bajo | Menos retrabajo |
| Costo | Alto | Bajo | Menor costo total |
| Calidad | Baja | Alta | Mayor calidad del producto |

Mensajes: *Modelar no es perder tiempo, es ahorrar tiempo, dinero y problemas.* · *Un buen modelo es la mejor inversión del proyecto.*

### Diapositiva 9

#### ¿Qué aspectos podemos modelar en un sistema?

Un sistema puede representarse desde distintas perspectivas. Cada modelo responde a una pregunta diferente y aporta información específica para comprender la solución.

**Contenido visual de la lámina:** Imagen ilustrativa: mano que sostiene un globo terráqueo conectado a íconos en red.

### Diapositiva 10

#### ¿Qué aspectos podemos modelar en un sistema?

👥Actores y usuarios • ¿Quién utilizará el sistema? ⚙️Procesos del negocio • ¿Cómo funciona actualmente la organización? 🔄Interacciones • ¿Cómo se relacionan los usuarios con el sistema? 🗂️Información • ¿Qué datos deben almacenarse y gestionarse? 🏗️Arquitectura • ¿Cómo estarán organizados los componentes del

software?

“No existe un único modelo. Un sistema complejo requiere diferentes modelos para

comprenderlo desde distintas perspectivas.”

**Contenido visual de la lámina:** Lista de cinco aspectos (actores y usuarios, procesos del negocio, interacciones, información, arquitectura), cada uno con su ícono y pregunta. Imagen ilustrativa: dos profesionales frente a pantallas, con el rótulo *Análisis y diseño de sistemas*.

### Diapositiva 11

#### Modelamiento de Sistemas

**Contenido visual de la lámina:** Infografía de un rompecabezas: **Cada vista aporta una pieza clave — solo juntas forman el sistema completo.** Piezas y preguntas: **Vista de casos de uso** (¿qué necesita el usuario?), **Vista lógica** (¿qué necesita hacer el sistema?), **Vista de procesos** (¿qué procesos se ejecutan?), **Vista de despliegue** (¿dónde se ejecuta el sistema?), **Vista integrada** (el sistema completo y consistente), **Vista de datos** (¿qué información usa y almacena?), **Vista de implementación** (¿cómo se organiza y construye?), **Vista de interfaz de usuario** (¿cómo interactúa el usuario con el sistema?) y **Vista de seguridad** (¿cómo protegemos el sistema y los datos?). Una mano coloca la pieza de casos de uso con la nota *«Sin una pieza, el sistema no está completo»*; otra nota indica *«Cuando todas las vistas encajan, se logra el éxito»*, con una flecha hacia **Sistema completo: valor, calidad y éxito para el negocio y los usuarios**. Una ✓ verde grande a la izquierda. Mensaje: *Modelar es integrar perspectivas para entender, comunicar y construir mejor.*

### Diapositiva 12

#### ¿Qué herramientas utiliza un Ingeniero de

Software para modelar?

El modelamiento puede realizarse mediante diferentes herramientas, dependiendo del objetivo del proyecto y del nivel de detalle requerido.

**Contenido visual de la lámina:** Imagen ilustrativa: persona frente a un escritorio con pantallas de gráficos e íconos flotantes.

### Diapositiva 13

#### ¿Qué herramientas utiliza un Ingeniero

de Software para modelar?

Herramienta ¿Para qué se utiliza?

Diagramas UML Representar la estructura y el comportamiento del sistema.

BPMN Modelar procesos de negocio. Wireframes Diseñar la estructura de las interfaces de usuario. Mockups Visualizar el aspecto final de las pantallas.

Prototipos Validar ideas con el cliente antes del desarrollo.

“Cada herramienta cumple un propósito específico; no existe una herramienta

única para modelar un sistema.”

**Contenido visual de la lámina:**

Tabla:

| Herramienta | ¿Para qué se utiliza? |
|---|---|
| Diagramas UML | Representar la estructura y el comportamiento del sistema |
| BPMN | Modelar procesos de negocio |
| Wireframes | Diseñar la estructura de las interfaces de usuario |
| Mockups | Visualizar el aspecto final de las pantallas |
| Prototipos | Validar ideas con el cliente antes del desarrollo |

### Diapositiva 14

#### UML: El lenguaje universal del modelamiento

¿Qué es UML? UML (Unified Modeling Language) es un lenguaje de modelado estandarizado que permite representar gráficamente un sistema antes de su implementación. Su objetivo es facilitar la comunicación entre clientes, analistas, arquitectos y desarrolladores.

**Contenido visual de la lámina:** Imagen ilustrativa: cuatro miniaturas de diagramas UML (casos de uso, secuencia, clases y actividades).

### Diapositiva 15

#### UML: El lenguaje universal del modelamiento

UML SÍ es... ✅Un lenguaje gráfico. ✅Un estándar internacional. ✅Una herramienta de comunicación.

UML NO es... ❌Un lenguaje de programación. ❌Una metodología de desarrollo. ❌Un software.

“Modelar no significa programar; significa comunicar una

solución antes de construirla.”

**Contenido visual de la lámina:** Dos listas: *UML NO es…* (✗) y *UML SÍ es…* (☑). Sin imágenes con contenido adicional.

### Diapositiva 16

#### Principales diagramas UML

No todos los diagramas UML tienen el mismo propósito.

Diagrama ¿Qué representa?

Casos de Uso Funcionalidades del sistema vistas por el usuario.

Clases Estructura estática del sistema.

Secuencia Interacción entre objetos a lo largo del tiempo. Actividades Flujo de procesos o tareas.

Estados Cambios de estado de un objeto. Componentes Organización física del software.

Despliegue Infraestructura donde se ejecutará el sistema.

Cada diagrama responde una pregunta diferente sobre el sistema.

**Contenido visual de la lámina:**

Tabla:

| Diagrama | ¿Qué representa? |
|---|---|
| Casos de uso | Funcionalidades del sistema vistas por el usuario |
| Clases | Estructura estática del sistema |
| Secuencia | Interacción entre objetos a lo largo del tiempo |
| Actividades | Flujo de procesos o tareas |
| Estados | Cambios de estado de un objeto |
| Componentes | Organización física del software |
| Despliegue | Infraestructura donde se ejecutará el sistema |

### Diapositiva 17

#### ¿Cuál diagrama UML utilizarías?

Caso 1 Un cliente desea representar los procesos que realiza un usuario al comprar un producto en una tienda virtual.

- ¿Qué diagrama utilizarías? • ¿Por qué?

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 18

#### ¿Cuál diagrama UML utilizarías?

Caso 1 Un cliente desea representar los procesos que realiza un usuario al comprar un producto en una tienda virtual.

Respuesta ✅Diagrama de Casos de Uso ¿Por qué? Porque el objetivo es representar las funcionalidades que el sistema ofrece al usuario y cómo este interactúa con ellas. No interesa todavía saber cómo está construido el sistema, sino responder preguntas como: • ¿Qué puede hacer el cliente? • ¿Qué acciones realizará? • ¿Qué servicios ofrecerá el sistema?

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 19

#### ¿Cuál diagrama UML utilizarías?

Caso 2 Necesitas mostrar cómo interactúan un cliente, el sistema y la base de datos durante una compra.

- ¿Qué diagrama utilizarías? • ¿Por qué?

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 20

#### ¿Cuál diagrama UML utilizarías?

Caso 2 Necesitas mostrar cómo interactúan un cliente, el sistema y la base de datos durante una compra.

Respuesta ✅Diagrama de Secuencia ¿Por qué? Porque interesa representar el orden cronológico de las interacciones entre los distintos participantes. Es decir:

Cliente ↓ Sistema Web ↓ Servidor ↓ Base de Datos ↓ Pasarela de Pago ↓ Sistema ↓ Cliente

**Contenido visual de la lámina:** La respuesta incluye, a la derecha, la secuencia vertical de participantes unidos por flechas: **Cliente → Sistema Web → Servidor → Base de Datos → Pasarela de Pago → Sistema → Cliente.**

### Diapositiva 21

#### ¿Cuál diagrama UML utilizarías?

Caso 3 Quieres representar las entidades principales de un sistema académico y sus relaciones.

- ¿Qué diagrama utilizarías? • ¿Por qué?

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 22

#### ¿Cuál diagrama UML utilizarías?

Caso 3 Quieres representar las entidades principales de un sistema académico y sus relaciones.

Por ejemplo:

Respuesta ✅Diagrama de Clases ¿Por qué? Porque el objetivo es modelar la estructura estática del sistema.

Alumno ↓ Curso ↓ Profesor ↓ Asignatura ↓ Matrícula ↓ Evaluación

Y definir: • atributos • métodos • asociaciones • herencias • multiplicidades Aquí no interesa el tiempo. No interesa el comportamiento. Interesa responder: ¿Cómo está organizado el sistema?

**Contenido visual de la lámina:** La respuesta incluye la secuencia vertical de entidades de ejemplo: **Alumno → Curso → Profesor → Asignatura → Matrícula → Evaluación.**

### Diapositiva 23

#### ¿Cuál diagrama UML utilizarías?

Caso 4 Una empresa desea representar el flujo de aprobación de una solicitud de vacaciones, indicando todas las decisiones posibles hasta llegar a la aprobación o rechazo.

- ¿Qué diagrama utilizarías? • ¿Por qué?

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 24

#### ¿Cuál diagrama UML utilizarías?

Caso 4 Una empresa desea representar el flujo de aprobación de una solicitud de vacaciones, indicando todas las decisiones posibles hasta llegar a la aprobación o rechazo.

Respuesta ✅Diagrama de Actividades ¿Por qué? Porque queremos representar un flujo de trabajo, mostrando: • actividades, • decisiones, • caminos alternativos, • procesos paralelos.

No modelamos clases ni actores. Modelamos un proceso.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 25

#### ¿Cuál diagrama UML utilizarías?

Caso 5 Una empresa necesita mostrar cómo estarán distribuidos físicamente sus servidores, bases de datos y aplicaciones en la nube.

- ¿Qué diagrama utilizarías? • ¿Por qué?

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 26

#### ¿Cuál diagrama UML utilizarías?

Caso 5 Una empresa necesita mostrar cómo estarán distribuidos físicamente sus servidores, bases de datos y aplicaciones en la nube.

No explica qué hace el sistema ni cómo está construido internamente, sino dónde será desplegado y cómo se distribuyen sus componentes en el entorno operativo.

Respuesta ✅Diagrama de Despliegue (Deployment Diagram) ¿Por qué? Porque interesa representar la infraestructura física donde se ejecutará el sistema: • Servidores • Nube • Bases de datos • Balanceadores de carga • Redes • Contenedores Este diagrama responde a la pregunta: ¿Dónde funcionará el software?

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 27

#### Pensando como un Ingeniero de Software

Antes de dibujar un diagrama... Un Ingeniero de Software debe responder preguntas fundamentales sobre el sistema que va a construir.

Preguntas clave 👥¿Quién utilizará el sistema? ⚙️¿Qué necesita hacer cada usuario? 📄¿Qué información manejará el sistema? 🔄¿Cómo interactúan los distintos componentes? 🏗️¿Cómo estará organizado el software? 🔒¿Qué restricciones de seguridad, rendimiento o disponibilidad existen?

“Los diagramas son el resultado del análisis; nunca reemplazan el análisis.”

**Contenido visual de la lámina:** Lista de seis preguntas clave, cada una con su ícono (usuarios, engranaje, documento, interacción, arquitectura y candado).

### Diapositiva 28

#### Del problema al modelo

“No modelamos porque UML exista; modelamos para comprender mejor la solución antes de construirla.”

**Contenido visual de la lámina:**

Infografía **Del cliente al software de calidad — un proceso lógico y estructurado para construir soluciones que generan valor**, con seis etapas unidas por flechas:
1. **Necesidad del cliente** (problemas, objetivos, expectativas, restricciones): *entendemos qué necesita realmente el cliente.*
2. **Ingeniería de requerimientos** (elicitación, documentación, validación, gestión): *convertimos la necesidad en requerimientos claros y verificables.*
3. **Análisis del problema** (comprender el dominio, identificar actores, reglas del negocio, casos de uso): *profundizamos y comprendemos el problema y su contexto.*
4. **Modelamiento** (modelos UML, diagramas, estructura del sistema, validación del modelo): *representamos el sistema desde diferentes perspectivas antes de construirlo.*
5. **Diseño** (arquitectura, diseño de componentes, diseño de datos, interfaces): *definimos cómo se construirá el sistema en detalle.*
6. **Implementación** (codificación, pruebas, integración, despliegue): *construimos, probamos y entregamos la solución al cliente.*

### Diapositiva 29

#### Caso Integrador

Plataforma de Venta de Entradas para Conciertos

El cliente solicita: • Venta de entradas en línea. • Selección de asientos. • Pago electrónico. • Emisión de código QR. • Control de acceso al evento.

Pregunta: Si ustedes fueran los Ingenieros de Software... 👉¿Qué diagrama UML desarrollarían primero?

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 30

#### Del problema al modelo

Respuesta: Diagrama de Casos de Uso Porque primero debemos comprender: ¿Qué funcionalidades ofrecerá el sistema y quién interactuará con ellas?

**Contenido visual de la lámina:** **Diagrama de casos de uso — Plataforma de Venta de Entradas para Conciertos.** Dentro del límite del sistema: *Venta de entradas en línea*, *Selección de asientos*, *Pago electrónico*, *Emisión de código QR* y *Control de acceso al evento*. El actor **Cliente (comprador)** se asocia con los cinco casos; el actor **Personal de acceso (validador)** se asocia con *Control de acceso al evento*.

### Diapositiva 31

#### Del problema al modelo

**Contenido visual de la lámina:** **Diagrama de casos de uso — Plataforma de Venta de Entradas para Conciertos** (versión ampliada). El actor **Cliente** se asocia con *Registrarse*, *Buscar eventos*, *Comprar entradas*, *Seleccionar asiento*, *Pagar* y *Descargar QR*. El actor **Administrador** se asocia con *Crear evento*, *Modificar evento* y *Generar reportes*.

### Diapositiva 32

**Contenido visual de la lámina:**

Infografía **Elementos del diagrama de casos de uso (UML)**.

**Elementos básicos:**

| Elemento | Descripción | Representación |
|---|---|---|
| Actor | Entidad externa que interactúa con el sistema para lograr un objetivo | Figura humana con su nombre |
| Caso de uso | Funcionalidad o servicio que el sistema ofrece al actor | Óvalo con el nombre del caso |
| Límite del sistema (*subject*) | Delimita el alcance del sistema y contiene los casos de uso | Rectángulo con el nombre del sistema |
| Nota / comentario | Permite agregar aclaraciones o información adicional | Hoja con esquina doblada unida por línea discontinua |

**Relaciones:**

| Relación | Descripción | Representación |
|---|---|---|
| Asociación (comunicación) | Comunica al actor con un caso de uso | Línea continua entre actor y caso |
| Inclusión «include» | Un caso de uso incluye obligatoriamente el comportamiento de otro | Flecha discontinua de A hacia B con «include» |
| Extensión «extend» | Un caso de uso extiende de manera opcional el comportamiento de otro | Flecha discontinua de B hacia A con «extend» |
| Generalización (actor) | Un actor especializado hereda los casos de uso de un actor general | Línea continua con triángulo hueco hacia el actor general |
| Generalización (caso de uso) | Un caso de uso especializado hereda el comportamiento de otro general | Línea continua con triángulo hueco hacia el caso general |

**Notas generales:** los actores siempre están fuera del límite del sistema; los casos de uso siempre están dentro; usar nombres claros que expresen acciones (verbos) desde la perspectiva del actor; el diagrama muestra **qué** hace el sistema, no **cómo** lo hace. **Ejemplo simple:** el Cliente se asocia, dentro de *Sistema de Venta de Entradas*, con *Buscar eventos*, *Comprar entradas* y *Pagar*, con la nota *«Este diagrama muestra las funcionalidades principales que el cliente puede realizar en el sistema.»*

### Diapositiva 33

#### Actividad de 10 minutos

Identificando Casos de Uso Escenario. Aplicación para un Gimnasio. Identificar: ✔Actores ✔Casos de uso ✔Relaciones No dibujar Solo identifican.

**Contenido visual de la lámina:** Diagrama de ejemplo **Restaurante (simplificado)**: el actor *Crítico de comidas* se asocia con *Probar la comida*, *Pagar la comida* y *Beber vino*; el actor *Chef* se asocia con *Preparar la comida*.

### Diapositiva 34

#### Buenas prácticas al construir Casos de Uso

- Pensar desde la perspectiva del usuario. ✔Utilizar verbos de acción. ✔Evitar detalles técnicos. ✔No describir procesos internos. ✔Mantener nombres simples. ✔Un caso de uso debe aportar valor al usuario.

**Contenido visual de la lámina:** Lista de seis buenas prácticas con marcas de verificación.

### Diapositiva 35

#### Buenas prácticas al construir Casos de Uso

❌

Errores frecuentes ❌"Base de Datos" ❌"Guardar Variable" ❌"Actualizar Tabla“

Eso NO son casos de uso.

**Contenido visual de la lámina:** Tres errores frecuentes marcados con ✗ y una ✗ grande al lado.

### Diapositiva 36

#### Relaciones entre Casos de Uso

**Contenido visual de la lámina:**

Tabla de relaciones entre casos de uso:

| Relación | Explicación | Ejemplo |
|---|---|---|
| Asociación | Relaciona un actor con un caso de uso; indica que el actor inicia o participa en él para alcanzar un objetivo | Cliente — *Comprar entradas* |
| «include» | El caso de uso origen (A) reutiliza obligatoriamente el comportamiento del caso incluido (B); flecha discontinua que apunta al caso incluido | *Realizar compra* «include» *Procesar pago* |
| «extend» | El caso de uso extensión (B) agrega comportamiento adicional y opcional al caso base (A); flecha discontinua que apunta al caso base | *Aplicar descuento* «extend» *Comprar entradas* |
| Generalización | Un elemento general (actor o caso de uso) define aspectos comunes que heredan los elementos específicos; línea continua y triángulo blanco que apunta al elemento general | Actores: *Usuario* general con *Cliente* y *Administrador*; casos: *Gestionar evento* general con *Crear evento* y *Modificar evento* |

### Diapositiva 37

#### Casos de Uso - Relaciones

Relación <<include>>

¿Cuándo utilizarla? Cuando un comportamiento es obligatorio y siempre forma parte de otro caso de uso.

Ejemplo Comprar Entrada ↓ <<include>> Pagar Porque no existe compra sin pago.

El caso incluido SIEMPRE se ejecuta.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 38

#### Casos de Uso - Relaciones

**Contenido visual de la lámina:** **Diagrama de casos de uso — Sistema de Venta de Entradas:** el Cliente se asocia con *Comprar entrada*, que «include» *Seleccionar asiento*, que a su vez «include» *Pagar*.

### Diapositiva 39

#### Casos de Uso - Relaciones

Relación <<Extend>>

¿Cuándo utilizarla? Cuando una funcionalidad es opcional y ocurre solamente bajo ciertas condiciones.

Ejemplo Comprar Entrada ↓ <<extend>> Aplicar Cupón de Descuento No siempre existe cupón.

El comportamiento extendido solamente ocurre si se cumple una condición.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 40

#### Casos de Uso - Relaciones

**Contenido visual de la lámina:** **Ejemplo gráfico de «extend»:** el Cliente se asocia con *Comprar entrada*; *Solicitar factura* la extiende con una flecha discontinua «extend» que apunta al caso base. Nota: *«Porque algunos clientes la necesitan. Otros no.»* Leyenda: óvalo = caso de uso; línea = asociación; flecha discontinua = relación de extensión; nota = condición o razón (opcional). Explicación: la relación «extend» indica que *Solicitar factura* agrega un comportamiento opcional al caso base *Comprar entrada*; se ejecuta solo si se cumple la condición.

### Diapositiva 41

#### Casos de Uso - Relaciones

Include vs Extend

<<include>> <<extend>> Obligatorio Opcional Siempre ocurre Ocurre bajo condición Reutiliza funcionalidad común Agrega comportamiento adicional Forma parte del flujo principal Amplía el flujo principal

**Contenido visual de la lámina:**

Tabla **Include vs Extend**:

| «include» | «extend» |
|---|---|
| Obligatorio | Opcional |
| Siempre ocurre | Ocurre bajo condición |
| Reutiliza funcionalidad común | Agrega comportamiento adicional |
| Forma parte del flujo principal | Amplía el flujo principal |

### Diapositiva 42

#### Casos de Uso – Relaciones, ejemplos

**Contenido visual de la lámina:** **Caso de uso: Compra de entrada.** El Cliente inicia *Comprar entrada*, que «include» *Seleccionar asiento*, que «include» *Pagar*. *Solicitar factura* «extend» *Comprar entrada*, con la nota *«Extensión opcional: algunos clientes pueden solicitar factura. Otros no.»* Recuadros explicativos: **Inclusión** — comportamiento obligatorio que siempre se ejecuta como parte del caso base; línea discontinua con flecha abierta que apunta al caso incluido. **Extensión** — comportamiento opcional que agrega funcionalidad al caso base bajo ciertas condiciones; línea discontinua con flecha abierta que apunta al caso base. **Resumen:** el cliente inicia *Comprar entrada*; el sistema siempre debe *Seleccionar asiento* y luego *Pagar* (inclusiones); opcionalmente, el cliente puede *Solicitar factura* (extensión), solo si lo necesita.

### Diapositiva 43

#### Caso de Uso: ¿Include o Extend?

Caso 1 Retirar Dinero ↓ Validar PIN

Caso 3 Reservar Hotel ↓ Pagar

Caso 2 Comprar Producto ↓ Aplicar Cupón

Caso 4 Reservar Hotel ↓ Contratar Seguro

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 44

#### Caso de Uso: Ejercicio Práctico

Sistema de Gestión para una Biblioteca Universitaria Contexto La Universidad desea reemplazar su actual sistema de biblioteca, ya que presenta numerosos problemas: • El préstamo de libros se realiza de forma lenta. • No existe una reserva en línea. • Los estudiantes no saben si un libro está disponible. • Los préstamos atrasados generan multas que actualmente se calculan manualmente. • Los bibliotecarios dedican mucho tiempo a tareas administrativas. • Los docentes desean recomendar bibliografía obligatoria para cada asignatura. • La universidad quiere disponer de estadísticas sobre los libros más solicitados. Por ello, se les ha contratado como equipo de Ingenieros de Software para desarrollar un nuevo sistema.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 45

#### Caso de Uso: Ejercicio Práctico

Tiempo 20 minutos

🎯Actividad En equipos de trabajo, elaboren un Diagrama de Casos de Uso UML que represente el funcionamiento general del sistema. Su diagrama deberá considerar, al menos: Actores Identifiquen los actores principales del sistema. (Mínimo 3 actores.)

Casos de uso Identifiquen las funcionalidades más importantes. (Entre 8 y 12 casos de uso.)

Relaciones Cuando corresponda, utilicen correctamente: • Asociación • <<include>> • <<extend>>

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 46

#### Diagramas UML más utilizados

¿Cuándo utilizar cada uno?

Diagrama UML ¿Qué representa? Ejemplo de uso

👤Casos de Uso Funcionalidades del sistema desde la perspectiva del usuario.

Sistema de ventas: Comprar producto, Pagar, Emitir boleta.

🏛️Clases Estructura del sistema: clases, atributos, métodos y relaciones.

Sistema académico: Alumno, Curso, Profesor, Asignatura.

🔄Secuencia Interacción entre objetos siguiendo un orden temporal.

Cliente → Sistema → Base de Datos → Pasarela de Pago → Confirmación.

🔀Actividades Flujo de trabajo o proceso de negocio. Proceso de aprobación de una solicitud de vacaciones.

⚙️Componentes Organización física o lógica de los componentes del software.

Aplicación Web, API, Base de Datos y Servicio de Autenticación.

🌐Despliegue Infraestructura donde se ejecutará el sistema.

Aplicación desplegada en servidores web, base de datos y servicios en la nube.

**Contenido visual de la lámina:**

Tabla **¿Cuándo utilizar cada uno?**:

| Diagrama UML | ¿Qué representa? | Ejemplo de uso |
|---|---|---|
| Casos de uso | Funcionalidades del sistema desde la perspectiva del usuario | Sistema de ventas: comprar producto, pagar, emitir boleta |
| Clases | Estructura del sistema: clases, atributos, métodos y relaciones | Sistema académico: Alumno, Curso, Profesor, Asignatura |
| Secuencia | Interacción entre objetos siguiendo un orden temporal | Cliente → Sistema → Base de Datos → Pasarela de Pago → Confirmación |
| Actividades | Flujo de trabajo o proceso de negocio | Proceso de aprobación de una solicitud de vacaciones |
| Componentes | Organización física o lógica de los componentes del software | Aplicación web, API, base de datos y servicio de autenticación |
| Despliegue | Infraestructura donde se ejecutará el sistema | Aplicación desplegada en servidores web, base de datos y servicios en la nube |

### Diapositiva 47

#### Diagramas UML más utilizados

¿Qué preguntas realizar?

Diagrama UML Pregunta que responde

👤Casos de Uso ¿Qué hace el sistema?

🏛️Clases ¿Cómo está organizado el sistema?

🔄Secuencia ¿Cómo interactúan los componentes?

🔀Actividades ¿Cómo fluye un proceso?

⚙️Componentes ¿Cómo está construido el software?

🌐Despliegue ¿Dónde se ejecuta el sistema?

**Contenido visual de la lámina:**

Tabla **¿Qué preguntas realizar?**:

| Diagrama UML | Pregunta que responde |
|---|---|
| Casos de uso | ¿Qué hace el sistema? |
| Clases | ¿Cómo está organizado el sistema? |
| Secuencia | ¿Cómo interactúan los componentes? |
| Actividades | ¿Cómo fluye un proceso? |
| Componentes | ¿Cómo está construido el software? |
| Despliegue | ¿Dónde se ejecuta el sistema? |

### Diapositiva 48

#### Ejemplo de Diagrama de Clases

**Contenido visual de la lámina:**

Diagrama de clases de ejemplo:
- **Alumno:** − rut : String; − nombre : String; − carrera : String; + matricular() : void; + pagar() : void.
- **Curso:** − codigo : String; − nombre : String; − creditos : int; + abrir() : void; + cerrar() : void.
- **Profesor:** − rut : String; − nombre : String; + evaluar() : void.

Relaciones: asociación **Alumno 1 — 1..\* Curso**; **Profesor** se une a **Curso** con una línea terminada en triángulo hueco (generalización en el dibujo).

### Diapositiva 49

#### Ejemplo de Diagrama de Secuencia

**Contenido visual de la lámina:** **Diagrama de secuencia — Proceso de compra**, con cuatro líneas de vida: *Cliente*, *Sistema*, *BD* y *Pasarela pago*. Mensajes en orden: 1. *Comprar* (Cliente → Sistema); 2. *Registrar compra* (Sistema → BD); 3. *Confirmación registro* (BD → Sistema, respuesta discontinua); 4. *Solicitar pago* (Sistema → Pasarela); 5. *Respuesta de pago (aprobado)* (Pasarela → Sistema, discontinua); 6. *Confirmación de compra (éxito)* (Sistema → Cliente, discontinua).

### Diapositiva 50

#### Ejemplo de Diagrama de Actividades

**Contenido visual de la lámina:**

**Diagrama de actividades — Ejemplo: solicitud de préstamo de un libro**, con tres carriles: *Usuario (estudiante)*, *Sistema de biblioteca* y *Base de datos*. Flujo: nodo inicial → *Solicitar préstamo de libro* (usuario) → *Buscar libro* (sistema) → *Consultar disponibilidad del libro* (BD) → *Mostrar resultado de búsqueda* (sistema) → decisión **¿Disponible?**:
- [No] → *Mostrar mensaje: libro no disponible* (BD) → *Recibir mensaje de no disponibilidad* (usuario).
- [Sí] → *Registrar préstamo* (sistema) → *Guardar préstamo en BD* (BD) → *Confirmar préstamo exitoso* (sistema) → *Notificar préstamo realizado* (usuario) → nodo final.

Leyenda: nodo inicial, nodo final, acción, decisión, *fork* (paralelo), *join* (sincronización) y flujo de control.

### Diapositiva 51

#### Ejemplo de Diagrama de Componentes

**Contenido visual de la lámina:** **Diagrama de componentes — Ejemplo: Sistema de tienda en línea.** Componentes: *Interfaz web* (ofrece la interfaz *IUsuario*), *API de negocio*, *Servicio de pagos* (requiere *IPasarelaPago*, externa), *Servicio de inventario* (requiere *IProveedor*, externa) y *Base de datos* (ofrece *IPersistencia*). La Interfaz web depende de la API de negocio; la API usa *IPagos* del Servicio de pagos e *IInventario* del Servicio de inventario; ambos servicios dependen de la Base de datos. Leyenda: componente, interfaz proporcionada (círculo), interfaz requerida (semicírculo) y dependencia (flecha discontinua).

### Diapositiva 52

#### Ejemplo de Diagrama de Despliegue

**Contenido visual de la lámina:** **Diagrama de despliegue — Ejemplo: aplicación web.** *Internet* → (HTTPS) → nodo **Servidor web** «nodo» Apache/Nginx, que contiene *Aplicación web (HTML/CSS/JS)* → (HTTP) → nodo **Servidor APP** «nodo» Tomcat/Gunicorn, con *API de negocio (Java/Python)* → (TCP/IP) → nodo **Base de datos** «nodo» PostgreSQL Server, con *Gestor de BD (PostgreSQL)*. Leyenda: nodo (dispositivo), componente desplegado y conexión de comunicación.

### Diapositiva 53

#### Proceso Integral de Desarrollo de Software

¿Dónde estamos ahora?

DISEÑO

“Ya sabemos qué debe hacer el sistema y lo hemos representado mediante modelos UML. El siguiente

desafío consiste en definir cómo construiremos esa solución.”

**Contenido visual de la lámina:** Miniatura de la infografía del proceso integral de desarrollo de software (diez etapas, de Necesidad a Evolución) con una flecha roja que señala la etapa **04 · Diseño**.

### Diapositiva 54

#### Del Modelo al Diseño

¿Qué significa diseñar un software?

Antes de escribir una sola línea de código, debemos responder preguntas fundamentales sobre la solución. Un Ingeniero de Software debe decidir: 🏗️¿Cómo estará organizado el sistema? 📂¿Cuántos módulos tendrá? 🔗¿Cómo se comunicarán entre sí? 💾¿Cómo se almacenarán los datos? 🔒¿Cómo se protegerá la información? ⚡¿Cómo garantizar el rendimiento y la escalabilidad?

El diseño de software es el proceso de transformar los requerimientos y modelos en una

solución técnica que servirá como guía para la implementación del sistema.

**Contenido visual de la lámina:** Lista de seis decisiones de diseño, cada una con su ícono.

### Diapositiva 55

#### Del Modelo al Diseño

**Contenido visual de la lámina:** Infografía **¿Por qué es importante el diseño?**: dos fotografías, *Arquitecto revisando planos* y *Maestros construyendo un edificio*, seguidas de *¿Comenzarías la construcción de un edificio sin planos?* → **Entonces… ¿Por qué comenzaríamos un software sin diseño?**

### Diapositiva 56

#### Del Modelo al Diseño

Diseño vs Implementación

Diseño Implementación Planifica la solución Construye la solución Define arquitectura Escribe código Es independiente del lenguaje Depende del lenguaje elegido Se centra en el "cómo" Se centra en el desarrollo del software

**Contenido visual de la lámina:**

Tabla **Diseño vs Implementación**:

| Diseño | Implementación |
|---|---|
| Planifica la solución | Construye la solución |
| Define arquitectura | Escribe código |
| Es independiente del lenguaje | Depende del lenguaje elegido |
| Se centra en el «cómo» | Se centra en el desarrollo del software |

### Diapositiva 57

#### Del Modelo al Diseño

Ejemplo Diseño: El sistema utilizará una arquitectura de tres capas. Implementación: Programar dicha arquitectura utilizando Java, Python o C#.

“Un buen diseño facilita una buena implementación; una mala

implementación puede corregirse, pero un mal diseño suele

afectar todo el proyecto.”

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 58

#### Del Modelo al Diseño

Arquitectura de Software

¿Qué es? La arquitectura representa la estructura de alto nivel del sistema, definiendo los principales componentes y la forma en que interactúan.

**Contenido visual de la lámina:** Imagen ilustrativa: persona frente a una visualización 3D de servidores, con el rótulo *Arquitectura de software*.

### Diapositiva 59

#### Del Modelo al Diseño

Arquitectura de Software de 4 capas

“La arquitectura constituye el plano general sobre el cual se construye todo el software.”

**Contenido visual de la lámina:** Diagrama **Arquitectura de software** de cuatro capas apiladas, unidas por flechas hacia abajo: **Usuario** (persona que utiliza el sistema) → **Interfaz web / app** (pantalla con la que el usuario interactúa; *frontend*) → **Lógica de negocio** (procesa las solicitudes, aplica reglas y coordina las operaciones; *backend*) → **Base de datos** (almacena y organiza la información).

### Diapositiva 60

#### Del Modelo al Diseño

Ventajas ✔Modularidad. ✔Mantenibilidad. ✔Escalabilidad. ✔Reutilización. ✔Facilidad para realizar pruebas.

**Contenido visual de la lámina:** El mismo diagrama de arquitectura de cuatro capas de la lámina 59, junto a la lista de ventajas.

### Diapositiva 61

#### Del Modelo al Diseño

**Contenido visual de la lámina:** Infografía **Arquitectura: ejemplo real — aplicación bancaria. ¿Qué ocurre cuando un cliente consulta su saldo?** Seis pasos: 1. **Cliente:** inicia la consulta de su saldo desde su dispositivo. 2. **Aplicación móvil:** captura la solicitud y la envía de forma segura al servidor (pantalla «Saldo disponible $1.250.000»). 3. **Servidor:** recibe la solicitud, valida al usuario y la redirecciona al módulo correspondiente. 4. **Lógica bancaria:** aplica las reglas del negocio bancario (verificación de cuenta, permisos, límites, auditoría, etc.). 5. **Base de datos:** consulta la información relevante y obtiene el saldo actual de la cuenta. 6. **Respuesta:** la información regresa por el mismo camino y se muestra al cliente. Una línea discontinua marca el *flujo de respuesta* hacia el cliente. **En resumen:** la arquitectura separa responsabilidades; cada capa tiene una función específica, lo que hace el sistema más seguro, escalable, mantenible y confiable.

### Diapositiva 62

#### Del Modelo al Diseño

Buenas prácticas de diseño

- Diseñar antes de programar. ✔Dividir el sistema en módulos. ✔Reducir el acoplamiento. ✔Favorecer la reutilización. ✔Diseñar pensando en el mantenimiento. ✔Mantener una arquitectura simple. ✔Documentar las decisiones de diseño.

**Contenido visual de la lámina:** Lista de siete buenas prácticas con marcas de verificación.

### Diapositiva 63

#### Del Modelo al Diseño

Pensando como Arquitectos de Software

"¿Qué creen que falta entre la interfaz y la base de datos? ¿Por qué no sería una buena idea que la aplicación accediera directamente a la base de datos?"

**Contenido visual de la lámina:** Diagrama **Pregunta de arquitectura — ¿Qué componente falta en esta arquitectura?**: *Cliente* (usuario final que utiliza el sistema) → *Sistema web* (interfaz que permite al usuario interactuar) → **?** (*¿Qué componente falta aquí? ¿Cuál es la capa o componente que debe ir entre el sistema web y la base de datos?*) → *Base de datos* (almacena la información del sistema).

### Diapositiva 64

#### Reflexión Final

"La Ingeniería de Software no consiste en escribir más código; consiste en construir mejores soluciones. Cada

decisión tomada durante el análisis, el modelamiento

y el diseño determina la calidad del software que

finalmente llegará a sus usuarios."

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 65

#### Próxima Clase

🚀Lo que veremos en la próxima clase

Del Diseño... a la Calidad del Software

**Contenido visual de la lámina:** Lámina de texto con un ícono de cohete; sin imágenes con contenido adicional.

### Diapositiva 66

UNIVERSIDAD SAN SEBASTIAN

YOCACIÓN POR LA 6XC6L6ł•fClA

Fin Semana 2

NU1STRA /VílS10 N ES EDUCAR EN LA

RAZÓ N, LA VERDA D Y LA VIRTU D.

---

**Contenido visual de la lámina:** Lámina de cierre: *Fin Semana 2*, con la franja *Nuestra misión es educar en la razón, la verdad y la virtud.*

<a id="semana-3"></a>

## Ingeniería de Software — Semana 3

Fuente del ZIP: `Ingenieria_de_Software_Semana_03.md`.

### Diapositiva 1

CLASE 1

SEMANA 3

Introducción a la Ingeniería Informática

Taller de Ingeniería de Software

Alfredo Pereira

Prof. Dr. Rodrigo Correa R.

**Contenido visual de la lámina:** Portada con fotografía de un edificio patrimonial de la universidad y logo USS. Texto: *Semana 3 · Taller de Ingeniería de Software · Prof. Dr. Rodrigo Correa R.*

### Diapositiva 2

#### OBJETIVO DE LA CLASE

❑Comprender la importancia del Aseguramiento de la Calidad (QA) dentro del proceso de desarrollo de software. ❑Diferenciar los conceptos de Verificación,

Validación y Pruebas de Software. ❑Reconocer la importancia de la documentación y de la evolución continua para garantizar software mantenible y de calidad.

**Contenido visual de la lámina:** Lista de tres objetivos con casillas. Imagen ilustrativa: escalera con íconos que sube hacia una diana.

### Diapositiva 3

#### ¿Qué aprenderemos hoy?

Hasta ahora aprendimos a comprender el problema, modelar la solución y diseñar el software.

Durante esta clase abordaremos:

Aseguramiento de la Calidad (QA) Verificación y Validación Introducción a las Pruebas de Software Documentación Evolución del Software

**Contenido visual de la lámina:** Lista con marcas de verificación. Imagen ilustrativa: silueta de una persona pensando, rodeada de íconos de ciencia y tecnología.

### Diapositiva 4

#### Proceso Integral de Desarrollo de Software

¿Dónde estamos hoy?

QA

"Un buen diseño no garantiza un buen software. Es necesario verificar y validar

continuamente que el sistema cumple los requerimientos definidos."

**Contenido visual de la lámina:** Miniatura de la infografía del proceso integral de desarrollo de software (diez etapas) con una flecha roja que señala la etapa **06 · QA (aseguramiento de la calidad)**.

### Diapositiva 5

#### ¿Qué entendemos por Calidad del Software?

¿Qué características debería tener un software para que

ustedes dijeran: "Este sistema tiene calidad"?

Funciona correctamente. Es seguro. Es rápido. Es fácil de utilizar. Es confiable. Es mantenible. Cumple los requerimientos del cliente.

**Contenido visual de la lámina:** Lista de siete características con marcas de verificación; sin imágenes con contenido adicional.

### Diapositiva 6

#### ¿Qué entendemos por Calidad del Software?

La calidad del software es el grado en que un sistema satisface los requerimientos establecidos, cumple las necesidades de sus usuarios y funciona de manera confiable, eficiente y mantenible.

**Contenido visual de la lámina:** Imagen ilustrativa: indicador tipo velocímetro sobre una pantalla tecnológica, con el rótulo *Calidad de software*.

### Diapositiva 7

#### ¿Por qué es tan importante la calidad?

**Contenido visual de la lámina:** Cuatro fotografías con rótulos: **Ariane 5** (despegue de un cohete), **Boeing 737 MAX** (avión en vuelo), **Knight Capital** (edificio corporativo) y **Healthcare.gov** (portal *The Health Insurance Marketplace is Open!*). Pregunta: *¿Qué tenían en común estos proyectos?* **Respuesta:** todos presentaron problemas relacionados con fallas de software que generaron **pérdidas económicas**, **interrupciones del servicio** o incluso pusieron **en riesgo vidas humanas**.

### Diapositiva 8

#### ¿Por qué es tan importante la calidad?

**Contenido visual de la lámina:** Infografía: **La calidad del software no es un lujo; es una responsabilidad profesional y ética del ingeniero de software.** Lista a la izquierda con marcas: código de calidad, pruebas rigurosas, seguridad, rendimiento y mantenibilidad. A la derecha: *Nuestro código impacta vidas reales*, con seguridad, confianza e impacto positivo en la sociedad. Al centro, un escudo *Ingeniero de software* sobre una balanza con **Hacer bien** y **Hacer el bien**. Franja inferior: *Calidad no es opcional. Es nuestro compromiso.* · Profesionalismo · Ética · Responsabilidad.

### Diapositiva 9

#### ¿Qué es QA (Quality Assurance)?

Aseguramiento de la Calidad del Software QA (Quality Assurance) es el conjunto de actividades, procesos y buenas prácticas que tienen como objetivo prevenir defectos y garantizar que el software cumpla los requisitos de calidad definidos durante todo su ciclo de desarrollo.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 10

#### ¿Qué es QA (Quality Assurance)?

QA busca responder preguntas como: ✓¿Estamos desarrollando el software

correctamente? ✓¿Estamos siguiendo el proceso definido? ✓¿Podemos prevenir errores antes de que

ocurran? ✓¿El producto cumplirá las expectativas del

cliente?

“QA no busca encontrar errores; busca evitar que los errores ocurran.”

**Contenido visual de la lámina:** Lista de cuatro preguntas con marcas. Imagen ilustrativa: rótulo *Implementing QA in enterprise software* con el logo *QA*.

### Diapositiva 11

#### QA vs Testing

QA (Quality Assurance) Testing (Pruebas)

Previene defectos. Detecta defectos. Se aplica durante todo el proyecto. Se ejecuta sobre el software desarrollado. Mejora procesos. Evalúa el producto.

Es preventivo. Es correctivo. Participa todo el equipo. Principalmente QA/Testers y desarrolladores.

“Todo proyecto necesita pruebas, pero un proyecto de calidad comienza

mucho antes de ejecutar la primera prueba.”

**Contenido visual de la lámina:**

Tabla **QA vs Testing**:

| QA (Quality Assurance) | Testing (pruebas) |
|---|---|
| Previene defectos | Detecta defectos |
| Se aplica durante todo el proyecto | Se ejecuta sobre el software desarrollado |
| Mejora procesos | Evalúa el producto |
| Es preventivo | Es correctivo |
| Participa todo el equipo | Principalmente QA/testers y desarrolladores |

### Diapositiva 12

#### La Calidad comienza desde el primer día

**Contenido visual de la lámina:** Diagrama de siete etapas, cada una con una ✓ verde encima: **Necesidad → Requerimientos → Modelamiento → Diseño → Implementación → Pruebas → Entrega**, con una línea discontinua de retorno de Entrega a Necesidad. Texto: *Cada etapa es clave para construir software de calidad que responda a las necesidades reales.*

### Diapositiva 13

#### QA en un proyecto de software

¿Qué creen que es más económico: prevenir un error durante el diseño o descubrirlo cuando el sistema ya está en producción?

¿Por qué?

**Contenido visual de la lámina:** Imagen ilustrativa: globos de diálogo de colores entrelazados con signos de interrogación.

### Diapositiva 14

#### Caso práctico

Dos equipos de desarrollo

Equipo B

Equipo A

Programa inmediatamente. No documenta. No revisa. Prueba solamente al finalizar.

Levanta requerimientos. Modela. Diseña. Realiza revisiones. Ejecuta pruebas continuamente.

¿Cuál proyecto creen que tendrá mayores probabilidades de éxito? ¿Por qué?

**Contenido visual de la lámina:** Dos listas con marcas de verificación (Equipo A y Equipo B); sin imágenes con contenido adicional.

### Diapositiva 15

#### Calidad de Software

La calidad del software no depende únicamente de los programadores; depende del compromiso de todo el equipo con un proceso de desarrollo bien definido.

**Contenido visual de la lámina:** Imagen ilustrativa: manos en un teclado con íconos de calidad y una ✓ dentro de un engranaje.

### Diapositiva 16

#### ACTIVIDAD

"¿Quién tiene la culpa?" Una empresa acaba de entregar un software a un banco. El primer día de funcionamiento comienzan los problemas: • algunos clientes no pueden ingresar; • otros ven saldos incorrectos; • las transferencias fallan; • el sistema se vuelve lento. El gerente dice inmediatamente: "Los programadores hicieron un mal trabajo."

**Contenido visual de la lámina:** Ícono de detective junto al título *Actividad*. Imagen ilustrativa: dos personas frustradas frente a un monitor con pantalla azul.

### Diapositiva 17

#### ACTIVIDAD

Deben decidir ¿Quién o quiénes podrían ser responsables? Pueden elegir más de uno.

Cada grupo debe justificar solamente tres responsables y explicar ¿Por qué?

Pregunta ¿Están de acuerdo? Cada grupo tiene 5 minutos para responder.

□Cliente □Analista □Ingeniero de Requerimientos □Arquitecto □Diseñador □Programador □Tester □QA □Gerente de Proyecto □Usuario

**Contenido visual de la lámina:** Ícono de detective junto al título. Lista de roles con casillas: Cliente, Analista, Ingeniero de Requerimientos, Arquitecto, Diseñador, Programador, Tester, QA, Gerente de Proyecto y Usuario.

### Diapositiva 18

#### ACTIVIDAD

¿Quién tiene realmente la culpa?

Respuesta. Probablemente todos.

Porque la calidad del software NO depende de una sola persona. Depende de todo el proceso. Un error puede originarse en cualquiera de

estas etapas.

**Contenido visual de la lámina:** Diagrama de seis etapas numeradas: **Requerimientos → Modelamiento → Diseño → Implementación → QA → Entrega**, con el texto *Un error puede originarse en cualquiera de estas etapas.*

### Diapositiva 19

#### ACTIVIDAD

“QA no consiste en encontrar culpables. Consiste en construir procesos que reduzcan la probabilidad

de cometer errores.”

"Después de más de 30 años trabajando en proyectos tecnológicos, les puedo asegurar algo: cuando un proyecto fracasa, casi nunca es culpa de

una sola persona. Los proyectos fracasan porque falló el proceso de

ingeniería."

**Contenido visual de la lámina:** Ícono de detective junto al título; cita en texto, sin imágenes con contenido adicional.

### Diapositiva 20

#### Verificación vs. Validación

Dos conceptos que todo Ingeniero de Software debe conocer Aunque suelen confundirse, Verificación y Validación tienen objetivos distintos dentro del aseguramiento de la calidad.

Verificación Validación

¿Estamos construyendo correctamente el producto?

¿Estamos construyendo el producto correcto? Evalúa el proceso y los artefactos generados.

Evalúa si el software satisface las necesidades del usuario. Se realiza durante todo el desarrollo. Se realiza sobre el producto desarrollado.

“Verificar significa comprobar que estamos haciendo bien el trabajo. Validar significa comprobar que estamos resolviendo el problema correcto.”

**Contenido visual de la lámina:**

Tabla:

| Verificación | Validación |
|---|---|
| ¿Estamos construyendo correctamente el producto? | ¿Estamos construyendo el producto correcto? |
| Evalúa el proceso y los artefactos generados | Evalúa si el software satisface las necesidades del usuario |
| Se realiza durante todo el desarrollo | Se realiza sobre el producto desarrollado |

### Diapositiva 21

#### Verificación

¿Qué significa verificar? La verificación consiste en revisar cada etapa del desarrollo para asegurar que cumple con las especificaciones definidas. No requiere que el software esté terminado.

Ejemplos

Revisar un documento de requerimientos. Revisar un diagrama UML. Revisar la arquitectura propuesta. Realizar una inspección de código. Revisar la documentación técnica.

¿Es posible verificar un sistema antes de escribir una sola línea de código?

**Contenido visual de la lámina:** Lista de ejemplos con marcas. Imagen ilustrativa: mano tocando un notebook con íconos de verificación.

### Diapositiva 22

#### Verificación

¿Es posible verificar un sistema antes de escribir una sola línea de código?

Sí. Porque también verificamos documentos, modelos y diseños.

La verificación busca prevenir errores antes de que lleguen al producto final.

**Contenido visual de la lámina:** Imagen ilustrativa: rótulo *Verification* con una lista de casillas y engranajes.

### Diapositiva 23

#### Validación

¿Qué significa validar? La validación consiste en comprobar que el software desarrollado satisface las necesidades del cliente y resuelve correctamente el problema para el cual fue construido.

Ejemplos

El cliente prueba el sistema. Se ejecutan pruebas de aceptación. El usuario confirma que el sistema cumple sus expectativas. El software funciona correctamente en el entorno real.

¿Podemos validar un software que aún no ha sido construido?

**Contenido visual de la lámina:** Lista de ejemplos con marcas. Imagen ilustrativa: computador con íconos de nube, reloj y herramientas.

### Diapositiva 24

#### Validación

¿Podemos validar un software que aún no ha sido construido?

No. Porque la validación requiere un producto o prototipo funcional.

La validación demuestra que desarrollamos el software que el cliente realmente necesitaba.

**Contenido visual de la lámina:** Imagen ilustrativa: monitor con engranajes y una lupa, con el rótulo *Validation Testing*.

### Diapositiva 25

#### Verificación vs. Validación

Ejemplo práctico Proyecto Sistema de Agenda Médica

Verificación ✓Revisar que los requerimientos

Validación ✓El médico agenda una consulta. ✓El paciente recibe la

estén completos. ✓Revisar el Diagrama de Casos de

confirmación. ✓El sistema funciona

Uso. ✓Revisar la arquitectura. ✓Revisar el código fuente.

correctamente. ✓El cliente acepta el producto.

**Contenido visual de la lámina:** Dos listas con marcas de verificación (verificación y validación del Sistema de Agenda Médica); sin imágenes con contenido adicional.

### Diapositiva 26

#### Verificación vs. Validación

“Es posible verificar correctamente un proyecto y aun así desarrollar un sistema

que el cliente no necesita.”

**Contenido visual de la lámina:** Imagen ilustrativa: notebook, monitor, tablet y celular con íconos verdes y el rótulo *Validation*.

### Diapositiva 27

#### ¿Verificación o Validación?

Juego rápido: Indicar V o VAL

Verificación

Caso 1 Revisar el documento de requerimientos.

Validación

Caso 2 El cliente prueba el sistema antes de aceptarlo.

Verificación

Caso 3 Un arquitecto revisa el diseño del software.

**Contenido visual de la lámina:** Juego con cada caso seguido de un ícono de mano que señala la respuesta: Caso 1 *Verificación*, Caso 2 *Validación*, Caso 3 *Verificación*.

### Diapositiva 28

#### ¿Verificación o Validación?

Juego rápido: Indicar V o VAL

Validación

Caso 4 Los usuarios utilizan el sistema durante una semana piloto.

Verificación

Caso 5 Un desarrollador realiza una revisión de código con otro integrante del equipo.

“Un proyecto exitoso requiere tanto verificar continuamente el proceso

como validar que el producto final cumple las expectativas del cliente.”

**Contenido visual de la lámina:** Continuación del juego: Caso 4 *Validación*, Caso 5 *Verificación*.

### Diapositiva 29

#### ¿Qué son las Pruebas de Software?

Las pruebas de software son actividades destinadas a evaluar el comportamiento de un sistema, detectar defectos y comprobar que cumple los requerimientos establecidos.

Las pruebas buscan responder: ✓¿El software hace lo que debería hacer? ✓¿Produce los resultados esperados? ✓¿Responde correctamente ante errores? ✓¿Funciona adecuadamente cuando sus

componentes interactúan? ✓¿Satisface las necesidades del usuario?

**Contenido visual de la lámina:** Lista de preguntas con marcas. Imagen ilustrativa: lupa sobre documentos digitales frente a un notebook.

### Diapositiva 30

#### ¿Qué entendemos por Calidad del Software?

“Las pruebas pueden

demostrar la

presencia de defectos, pero no garantizar su ausencia

absoluta.”

**Contenido visual de la lámina:** Imagen ilustrativa: lupa sobre un panel de software con alertas de error, validación, rendimiento, seguridad y datos, y una libreta con las palabras *Testear, validar, mejorar* y *Calidad, confianza, éxito*.

### Diapositiva 31

#### No todos los errores son iguales

Error Una acción humana incorrecta. Ejemplo: Un programador interpreta incorrectamente una regla de cálculo.

Defecto (Bug) El error queda incorporado en el software. Ejemplo: La fórmula fue programada incorrectamente.

Falla El defecto se manifiesta cuando el sistema se ejecuta. Ejemplo: El sistema cobra $190.000 cuando debería cobrar $19.000.

**Contenido visual de la lámina:** Tres conceptos con íconos de color: rojo (*Error*), naranjo (*Defecto*) y estrella roja (*Falla*).

### Diapositiva 32

#### No todos los errores son iguales

**Contenido visual de la lámina:** Infografía de tres paneles unidos por flechas: **Error humano** — el desarrollador comete un error al escribir el código (en `if (total = 0)` usa «=» en lugar de «==»). → **Defecto en el software** — el software contiene un defecto, no hace lo que se esperaba (en *Calculos.java*, línea 11, la condición siempre será verdadera). → **Falla en ejecución** — en tiempo de ejecución, bajo ciertas condiciones, el defecto causa una falla visible (ventana *Sistema de Cálculos: Error en el sistema. Se produjo un resultado inválido*). **Mensaje clave:** *No todo defecto produce inmediatamente una falla; puede permanecer oculto hasta que determinadas condiciones lo activen.*

### Diapositiva 33

#### Niveles de Pruebas de Software

Ahora se presenta mapa completo antes de entrar en cada nivel.

1️⃣Pruebas Unitarias Evalúan componentes individuales. ↓ 2️⃣Pruebas de Integración Evalúan la interacción entre componentes. ↓ 3️⃣Pruebas de Sistema Evalúan el sistema completo. ↓ 4️⃣Pruebas de Aceptación Evalúan si el sistema satisface las necesidades del cliente.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 34

#### Niveles de Pruebas de Software

**Contenido visual de la lámina:** Pirámide **Niveles de pruebas de software**, de la base a la cima: **Unitarias** (probamos las funciones o componentes más pequeños de manera aislada) → **Integración** (comprobamos que los módulos e interfaces funcionan juntos correctamente) → **Sistema** (verificamos el comportamiento del sistema completo como una solución) → **Aceptación** (validamos que el sistema cumple con las necesidades del usuario y del negocio). Mensaje: *A medida que avanzamos, dejamos de probar pequeñas partes y comenzamos a evaluar el sistema como una solución completa.*

### Diapositiva 35

#### Niveles de Pruebas de Software

❑Pruebas Unitarias

Probamos una pequeña parte del software Las pruebas unitarias verifican el funcionamiento de componentes individuales, como funciones, métodos o clases. Ejemplo Tenemos una función: calcularDescuento(precio, porcentaje) Si: Precio = $100.000 Descuento = 20% Resultado esperado: $80.000

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 36

#### Niveles de Pruebas de Software

❑Pruebas Unitarias

Entonces podemos probar:

Entrada Resultado esperado

$100.000 – 20% $80.000

$50.000 – 10% $45.000

$25.000 – 0% $25.000

¿Qué ocurriría si ingresamos un descuento de -10% o de 150%?

“Una prueba no consiste solamente en comprobar que algo funciona

cuando todo está bien.”

**Contenido visual de la lámina:**

Tabla de casos de prueba de `calcularDescuento`:

| Entrada | Resultado esperado |
|---|---|
| $100.000 – 20 % | $80.000 |
| $50.000 – 10 % | $45.000 |
| $25.000 – 0 % | $25.000 |

### Diapositiva 37

#### Niveles de Pruebas de Software

❑Pruebas de Integración

¿Qué ocurre cuando juntamos las piezas? Un componente puede funcionar perfectamente de manera independiente... pero fallar cuando se comunica con otros. Ejemplo: Compra por Internet:

Tienda Web ↓ Sistema de Inventario ↓ Pasarela de Pago ↓ Sistema de Despacho ↓ Correo de Confirmación

**Contenido visual de la lámina:** Secuencia vertical del ejemplo de compra por internet: **Tienda web → Sistema de inventario → Pasarela de pago → Sistema de despacho → Correo de confirmación.**

### Diapositiva 38

#### Niveles de Pruebas de Software

❑Pruebas de Integración

Todos podrían funcionar correctamente de manera individual. Pero...

El pago se realiza y el inventario no se actualiza. El pedido se registra, pero despacho nunca lo recibe. La compra termina correctamente, pero no se envía la confirmación. Entonces... Las pruebas de integración comprueban que los diferentes módulos o servicios se comuniquen correctamente entre sí.

“Que todas las piezas funcionen por separado no significa que el

sistema funcione cuando las conectamos.”

**Contenido visual de la lámina:** Tres problemas marcados con ✗ roja; sin imágenes con contenido adicional.

### Diapositiva 39

#### Niveles de Pruebas de Software

**Contenido visual de la lámina:** Infografía con la analogía del automóvil. Tres fotografías con su prueba unitaria aprobada (✓): *el motor funciona* (el motor arranca y genera potencia), *los frenos funcionan* (los frenos detienen el automóvil) y *la dirección funciona* (la dirección responde y permite girar). **Pero…** *¿Significa eso que el automóvil completo funciona correctamente?* **No necesariamente:** las partes pueden funcionar bien por separado… Fotografía de un auto con el capó abierto y humo, con la advertencia *Pueden existir problemas al trabajar juntas*: fugas, fallos de comunicación, sincronización, errores de integración, etc. Mensaje: *La prueba del sistema completo es la única que puede confirmarlo.*

### Diapositiva 40

#### Niveles de Pruebas de Software

❑Pruebas del Sistema

¿Funciona el sistema completo? Después de comprobar componentes individuales y su integración, debemos evaluar el software como una solución completa. ¿Qué evaluamos?

Funcionamiento de extremo a extremo. Cumplimiento de requerimientos. Interacción entre todos los módulos. Comportamiento en condiciones similares a producción. Respuesta ante situaciones normales y excepcionales.

Ejemplo: Comercio Electrónico Ya no probamos solamente "Pagar" o "Inventario". Probamos el proceso completo: Cliente → Busca producto → Agrega al carrito → Compra → Paga → Actualiza inventario → Genera pedido → Despacho → Confirmación

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 41

#### Niveles de Pruebas de Software

❑Pruebas del Sistema

Una prueba podría ser: Un cliente compra el último notebook disponible utilizando tarjeta de crédito. El sistema debería: 1. Autorizar el pago. 2. Registrar la venta. 3. Actualizar el stock a 0. 4. Generar el pedido. 5. Enviar la confirmación. 6. Impedir una segunda venta del mismo producto.

“En las pruebas de sistema dejamos de preguntar si cada pieza funciona y comenzamos a

preguntar si la solución completa funciona correctamente.”

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 42

#### Niveles de Pruebas de Software

❑Pruebas de Aceptación

¿El cliente acepta el sistema? Aquí llegamos al nivel más cercano al usuario y al negocio. Las pruebas de aceptación permiten comprobar si el sistema satisface las necesidades del cliente y está preparado para ser utilizado en un contexto real. Aquí cambia la pregunta: Ya no solamente preguntamos: ¿Funciona técnicamente?

Ahora preguntamos: ¿Sirve realmente para lo que fue construido?

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 43

#### Niveles de Pruebas de Software

❑Pruebas de Aceptación

Ejemplo: Sistema de Inscripción de Asignaturas El sistema podría técnicamente:

Iniciar sesión. Mostrar asignaturas. Registrar inscripciones. Guardar correctamente los datos. Pero los estudiantes descubren que:

No muestra los cupos disponibles. No informa choques de horario. No advierte incumplimiento de prerrequisitos. Entonces... El software funciona técnicamente, pero podría NO ser aceptado por el usuario.

**Contenido visual de la lámina:** Lista de funciones técnicas con ✓ y de problemas descubiertos por los estudiantes con ✗ roja; sin imágenes con contenido adicional.

### Diapositiva 44

#### Niveles de Pruebas de Software

**Contenido visual de la lámina:** Pirámide con **alcance creciente** (más completo a medida que subimos de nivel): **Unitarias** — ¿funciona cada parte? (función, método, clase) → **Integración** — ¿funcionan juntas las partes? (módulos, servicios, API) → **Sistema** — ¿funciona todo el sistema? (aplicación completa) → **Aceptación** — ¿satisface al usuario? (necesidad del usuario). **Mensaje clave:** *A medida que avanzamos en los niveles de prueba, aumenta el alcance: pasamos de comprobar pequeñas unidades de código a validar una solución completa para el usuario.*

### Diapositiva 45

#### Nivel de prueba ≠ Tipo de prueba

Una distinción importante Aquí hay una confusión frecuente que debemos evitar.

NIVEL DE PRUEBA Responde: ¿En qué nivel del software estamos probando? • Unitaria • Integración • Sistema • Aceptación

TIPO DE PRUEBA Responde: ¿Qué característica queremos evaluar? Por ejemplo: • Funcionalidad • Rendimiento • Seguridad • Usabilidad • Compatibilidad

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 46

#### Nivel de prueba ≠ Tipo de prueba

Ejemplo Podemos realizar una: Prueba de Sistema para evaluar el: Rendimiento de una plataforma cuando ingresan simultáneamente 10.000 usuarios. Por tanto: Sistema = nivel Rendimiento = tipo

“El nivel indica dónde probamos; el tipo indica qué

queremos comprobar.”

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 47

#### Pruebas Funcionales y No Funcionales

No basta con comprobar que "funciona" Aquí conectamos directamente con los requerimientos vistos en la Semana 1. Pruebas Funcionales Comprueban QUÉ hace el sistema. Ejemplos:

¿Permite iniciar sesión? ¿Calcula correctamente un descuento? ¿Registra una compra? ¿Permite reservar una hora? ¿Genera correctamente una factura?

**Contenido visual de la lámina:** Lista de preguntas con marcas de verificación; sin imágenes con contenido adicional.

### Diapositiva 48

#### Pruebas Funcionales y No Funcionales

Pruebas No Funcionales Comprueban CÓMO se comporta el sistema. Ejemplos:

¿Responde en menos de 2 segundos? ¿Protege adecuadamente los datos? ¿Soporta 5.000 usuarios simultáneos? ¿Funciona correctamente en distintos dispositivos? ¿Es accesible y fácil de utilizar?

**Contenido visual de la lámina:** Lista de cinco preguntas, cada una con su ícono: rayo (rendimiento), candado (seguridad), personas (carga), celular (compatibilidad) y silla de ruedas (accesibilidad).

### Diapositiva 49

#### Pruebas Funcionales y No Funcionales

Ejemplo muy simple Una aplicación bancaria permite realizar una transferencia. Funcional: ¿La transferencia se realiza correctamente? No funcional: ¿Puede realizarla de forma segura, en menos de 3 segundos y soportando miles de usuarios simultáneos?

“Que un sistema haga lo que debe hacer no significa necesariamente que

lo haga con la calidad necesaria.”

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 50

#### ¿Cuándo termina QA?

Nunca es una etapa aislada. La calidad acompaña al software durante todo su ciclo de vida.

**Contenido visual de la lámina:** Infografía **Proceso de desarrollo de software con QA transversal**: siete etapas — **1. Requerimientos** (entendemos las necesidades del usuario) → **2. Modelamiento** (representamos y estructuramos el problema) → **3. Diseño** (definimos la solución y su arquitectura) → **4. Implementación** (construimos el software) → **5. Pruebas** (verificamos que el software cumpla con lo esperado) → **6. Despliegue** (ponemos el software en producción) → **7. Evolución** (mejoramos continuamente según el uso y nuevas necesidades). Bajo ellas, una franja **QA transversal — aseguramos calidad en cada etapa**, con flechas hacia cada etapa: revisión de requerimientos, validación de modelos, revisión de diseño, revisión de código, pruebas continuas, verificación de despliegue y monitoreo y retroalimentación. Cita: *La calidad no se inspecciona al final; se construye durante todo el proceso.*

### Diapositiva 51

#### Reflexión Final

"QA no comienza cuando terminamos de programar. La calidad se construye desde el

primer requerimiento hasta la evolución del

software."

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 52

#### ¿Qué aprendimos?

“Un software de calidad no es simplemente aquel que funciona.”

Es aquel que hace lo que debe hacer, lo hace correctamente,

responde a las necesidades de sus usuarios y puede seguir

siendo confiable cuando el sistema cambia y evoluciona.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 53

#### Próxima Clase

¿Qué ocurre después de construir el software?

Documentación Evolución del Software Ciclo de Vida Metodologías de Desarrollo Enfoques de Desarrollo

**Contenido visual de la lámina:** Lista de cinco temas, cada uno con su ícono: documento, flechas circulares, reciclaje, brújula y cohete.

### Diapositiva 54

UNIVERSIDAD SAN SEBASTIAN

YOCACIÓN POR LA 6XC6L6ł•fClA

Fin Semana 3

N U1 ST RA /Ví l S10 N ES E D U CAR EN LA

RAZÓ N , LA VE RDA D Y LA V I RTU D.

---

**Contenido visual de la lámina:** Lámina de cierre: *Fin Semana 3*, con la franja *Nuestra misión es educar en la razón, la verdad y la virtud.*

<a id="semana-4"></a>

## Ingeniería de Software — Semana 4

Fuente del ZIP: `Ingenieria_de_Software_Semana_04.md`.

### Diapositiva 1

CLASE 1

SEMANA 4

Introducción a la Ingeniería Informática

Taller de Ingeniería de Software

Alfredo Pereira

Prof. Dr. Rodrigo Correa R.

**Contenido visual de la lámina:** Portada con fotografía de un edificio patrimonial de la universidad y logo USS. Texto: *Semana 4 · Taller de Ingeniería de Software · Prof. Dr. Rodrigo Correa R.*

### Diapositiva 2

#### OBJETIVO DE LA CLASE

❑Comprender la importancia de la

documentación y evolución del software como elementos fundamentales para su mantenimiento y continuidad. ❑Analizar el Ciclo de Vida del Desarrollo de

Software (SDLC) y reconocer sus principales etapas. ❑Comparar diferentes metodologías y

enfoques de desarrollo, identificando sus características, ventajas y contextos de aplicación.

**Contenido visual de la lámina:** Lista de tres objetivos con casillas. Imagen ilustrativa: escalera con íconos que sube hacia una diana.

### Diapositiva 3

#### ¿Qué aprenderemos hoy?

Hasta ahora hemos recorrido gran parte del proceso: Necesidad → Requerimientos → Modelamiento → Diseño → Implementación → QA Hoy avanzaremos hacia una visión completa del desarrollo de software. Veremos:

Documentación del Software Evolución del Software Ciclo de Vida del Desarrollo de Software (SDLC) Metodologías de Desarrollo • Estructurada • RAD • RUP • AUP

Enfoques de Desarrollo y dedicaremos especial atención a: SCRUM como uno de los marcos ágiles más utilizados actualmente.

**Contenido visual de la lámina:** Lista de temas con íconos (documento, flechas circulares, reciclaje, brújula y cohete); sin imágenes con contenido adicional.

### Diapositiva 4

#### Proceso Integral de Desarrollo de Software

¿Dónde estamos hoy?

Documentación

“El software puede funcionar perfectamente hoy. El verdadero desafío es que

pueda ser comprendido, mantenido y evolucionado mañana.”

**Contenido visual de la lámina:** Miniatura de la infografía del proceso integral de desarrollo de software (diez etapas) con una flecha roja que señala la etapa **07 · Documentación**.

### Diapositiva 5

#### EL EXPERIMENTO

Imaginen esta situación... Una empresa posee un sistema crítico desarrollado durante 8 años. Funciona correctamente. Miles de clientes lo utilizan diariamente. Pero... El desarrollador principal renuncia. Y descubre la empresa que:

Casi no existe documentación. Nadie conoce completamente la arquitectura. Algunas reglas de negocio existen solamente en el código. Nadie sabe por qué se tomaron determinadas decisiones técnicas.

Entonces aparece una solicitud aparentemente sencilla: “Necesitamos agregar una nueva funcionalidad.” ¿Tenemos un problema?

**Contenido visual de la lámina:** Lista de hallazgos marcados con ✗ roja. Imagen ilustrativa: persona con una lupa frente a un archivador y documentos.

### Diapositiva 6

#### EL CÓDIGO NO CUENTA TODA LA HISTORIA

Un sistema puede funcionar perfectamente y, sin embargo, convertirse en un enorme problema cuando debe ser:

mantenido, modificado, actualizado, transferido a otro equipo, escalado, o integrado con nuevas tecnologías. Porque el código puede mostrarnos: QUÉ hace el sistema. Pero no siempre explica: POR QUÉ fue construido de esa manera.

**Contenido visual de la lámina:** Lista de acciones con íconos (llave, persona, flechas, personas, cohete). Imagen ilustrativa: computador con un circuito iluminado en la pantalla.

### Diapositiva 7

#### Documentación del Software

La documentación conserva el conocimiento necesario para comprender, utilizar, mantener y evolucionar un sistema a lo largo del tiempo.

“El software puede sobrevivir a su creador; el conocimiento sobre él también debería hacerlo.”

**Contenido visual de la lámina:** Imagen ilustrativa: rótulo *Documentación del software* sobre fragmentos de diagramas.

### Diapositiva 8

#### ¿QUÉ DOCUMENTAMOS?

No existe una única documentación Durante un proyecto se genera información para distintos usuarios y diferentes propósitos.

Tipo ¿Qué documenta? Ejemplo

Requerimientos Qué debe hacer el sistema Historias, requisitos, casos de uso

Técnica Cómo está construido Arquitectura, componentes, BD

Código / API Cómo utilizar o mantener componentes Funciones, endpoints, parámetros

Usuario Cómo utilizar el sistema Manuales, ayuda, tutoriales

Operación Cómo instalar y operar Configuración, despliegue, respaldos

Documentamos para que el conocimiento del sistema no dependa exclusivamente de las personas que lo construyeron.

**Contenido visual de la lámina:**

Tabla **No existe una única documentación**:

| Tipo | ¿Qué documenta? | Ejemplo |
|---|---|---|
| Requerimientos | Qué debe hacer el sistema | Historias, requisitos, casos de uso |
| Técnica | Cómo está construido | Arquitectura, componentes, base de datos |
| Código / API | Cómo utilizar o mantener componentes | Funciones, endpoints, parámetros |
| Usuario | Cómo utilizar el sistema | Manuales, ayuda, tutoriales |
| Operación | Cómo instalar y operar | Configuración, despliegue, respaldos |

### Diapositiva 9

#### ¿DEBEMOS DOCUMENTAR TODO?

NO!

Documentar demasiado puede generar:

Burocracia. Información que nadie utiliza. Documentos difíciles de mantener. Documentación rápidamente desactualizada.

Pero documentar demasiado poco provoca:

Documentar lo necesario, útil y mantenible.

Dependencia de personas específicas. Mayor dificultad de mantenimiento. Pérdida de conocimiento. Mayor riesgo al modificar el sistema.

“Una buena documentación no se mide por su cantidad, sino por el valor que aporta

durante la vida del software.”

**Contenido visual de la lámina:** Dos listas de consecuencias marcadas con ✗ roja y un recuadro verde: *Documentar lo necesario, útil y mantenible.*

### Diapositiva 10

#### EL SOFTWARE NO TERMINA CUANDO SE ENTREGA

Imagina que desarrollamos una aplicación bancaria. La entregamos hoy. ¿Funcionará exactamente igual durante los próximos 10 años? Obviamente no. Cambiarán:

Los dispositivos. Las amenazas de seguridad. Las regulaciones. Las necesidades de los usuarios. El negocio. Las tecnologías. Entonces... El software debe cambiar porque el mundo para el cual fue construido también cambia.

**Contenido visual de la lámina:** Lista de cambios con íconos (celular, candado, balanza, personas, edificio, computador). Imagen ilustrativa: persona programando entre números flotantes.

### Diapositiva 11

#### ¿QUÉ ES LA EVOLUCIÓN DEL SOFTWARE?

La Evolución del Software corresponde al proceso continuo mediante el cual un sistema es modificado, adaptado y mejorado después de su puesta en funcionamiento, con el propósito de mantener su utilidad y responder a nuevas necesidades.

¿Por qué evoluciona?

Corregir defectos. Responder a nuevas amenazas. Adaptarse a nuevos entornos. Mejorar rendimiento. Incorporar funcionalidades. Cumplir nuevas regulaciones.

“La primera versión de un software rara vez es su versión definitiva.”

**Contenido visual de la lámina:** Lista de motivos con íconos (insecto, candado, engranaje, gráfico, ampolleta, balanza). Imagen ilustrativa: cubos y pantallas en movimiento, con el rótulo *Evolution kit*.

### Diapositiva 12

#### ¿POR QUÉ CAMBIA EL SOFTWARE?

**Contenido visual de la lámina:** Infografía **Un sistema exitoso inevitablemente deberá cambiar**: seis causas con flechas hacia un monitor rotulado *Software*: (1) **Cambia el negocio** — la empresa incorpora nuevos servicios. (2) **Cambian los usuarios** — aparecen nuevas necesidades. (3) **Cambia la tecnología** — surgen nuevas plataformas y dispositivos. (4) **Cambian las regulaciones** — el sistema debe cumplir nuevas normas. (5) **Aparecen defectos** — es necesario corregirlos. (6) **Aparecen nuevas amenazas** — la seguridad debe actualizarse. **Pregunta para hacernos pensar:** *si un software nunca cambia durante años, ¿significa que fue perfectamente diseñado… o que probablemente dejó de responder a su entorno?*

### Diapositiva 13

#### TIPOS DE MANTENIMIENTO DEL SOFTWARE

No todos los cambios tienen el mismo propósito Cuando un software evoluciona, las modificaciones pueden clasificarse según la razón que las origina.

Tipo Propósito Ejemplo

Correctivo Corregir defectos encontrados Corregir un cálculo incorrecto en una factura

Adaptativo Adaptarse a cambios externos Adecuar el sistema a una nueva versión del sistema operativo

Perfectivo Mejorar o ampliar el sistema Incorporar pagos mediante una nueva plataforma

Preventivo Evitar problemas futuros Refactorizar código difícil de mantener

**Contenido visual de la lámina:**

Tabla **No todos los cambios tienen el mismo propósito**:

| Tipo | Propósito | Ejemplo |
|---|---|---|
| Correctivo | Corregir defectos encontrados | Corregir un cálculo incorrecto en una factura |
| Adaptativo | Adaptarse a cambios externos | Adecuar el sistema a una nueva versión del sistema operativo |
| Perfectivo | Mejorar o ampliar el sistema | Incorporar pagos mediante una nueva plataforma |
| Preventivo | Evitar problemas futuros | Refactorizar código difícil de mantener |

### Diapositiva 14

#### ¿QUÉ DOCUMENTAMOS?

**Contenido visual de la lámina:** Infografía **Regla fácil de recordar**, con cuatro columnas: **Correctivo** — algo falla (notebook con alerta): *corregimos el problema para que vuelva a funcionar* (caja de herramientas). **Adaptativo** — algo afuera cambió (globo con edificio, personas y celular): *adaptamos el sistema a su nuevo entorno* (piezas de rompecabezas). **Perfectivo** — queremos algo mejor (gráfico ascendente): *mejoramos el rendimiento, la usabilidad o la calidad* (cohete). **Preventivo** — evitamos problemas futuros (escudo con ✓): *detectamos riesgos y tomamos acciones para prevenirlos* (lupa con engranajes). Mensaje: *Mantener software no es solo arreglar errores; es asegurar que siga aportando valor hoy y en el futuro.*

### Diapositiva 15

#### ¿QUÉ TIPO DE MANTENIMIENTO ES?

Juego rápido

CASO 1 Una aplicación bancaria calcula incorrectamente los intereses.

Correctivo

CASO 2 Una nueva regulación exige modificar la información de las facturas electrónicas.

Adaptativo

CASO 3 Los usuarios solicitan autenticación mediante huella digital.

Perfectivo

**Contenido visual de la lámina:** Juego rápido con cada caso seguido de un ícono de mano que señala la respuesta: Caso 1 *Correctivo*, Caso 2 *Adaptativo*, Caso 3 *Perfectivo*.

### Diapositiva 16

#### ¿QUÉ TIPO DE MANTENIMIENTO ES?

Juego rápido

CASO 4 El equipo reorganiza un módulo antiguo para reducir su complejidad antes de futuras modificaciones.

Preventivo

CASO 5 La empresa migra su aplicación porque la tecnología utilizada dejará de tener soporte.

Adaptativo / Preventivo

**Contenido visual de la lámina:** Continuación del juego: Caso 4 *Preventivo*, Caso 5 *Adaptativo / Preventivo*.

### Diapositiva 17

#### DEL PROCESO AL CICLO DE VIDA

**Contenido visual de la lámina:** Infografía **Ya conocemos las piezas…** — durante estas semanas hemos estudiado, en orden: Necesidad → Requerimientos → Modelamiento → Diseño → Implementación → QA → Documentación → Despliegue → Evolución. **Pero ahora aparece una nueva pregunta:** *¿Cómo organizamos todas estas actividades dentro de un proyecto real?* **Respuesta: Ciclo de vida del desarrollo de software**, con un ciclo de flechas rodeado de íconos. Nota: *Conocer las actividades necesarias no basta; también debemos decidir cómo, cuándo y en qué orden realizarlas.*

### Diapositiva 18

#### ¿QUÉ ES EL SDLC?

Software Development Life Cycle El Ciclo de Vida del Desarrollo de Software (SDLC) representa el conjunto organizado de etapas por las que atraviesa un sistema desde que surge una necesidad hasta su operación, mantenimiento y eventual reemplazo.

**Contenido visual de la lámina:** Rueda **Software Development Life Cycle** con siete segmentos en orden: **1 Planning → 2 Analysis → 3 Design → 4 Implementation → 5 Testing → 6 Deployment → 7 Maintenance**.

### Diapositiva 19

#### ¿QUÉ ES EL SDLC?

**Contenido visual de la lámina:** Infografía **Una representación general**, con ocho etapas en cascada y su descripción: **Planificación** (definimos objetivos, alcance, recursos, tiempo y riesgos) → **Requerimientos** (entendemos y documentamos lo que el sistema debe hacer) → **Análisis / modelamiento** (analizamos el problema y modelamos procesos y datos) → **Diseño** (definimos la arquitectura, componentes e interfaces) → **Implementación** (convertimos el diseño en código funcional) → **Pruebas** (verificamos que el sistema cumpla con los requisitos y sea de calidad) → **Despliegue** (entregamos el sistema al entorno productivo) → **Mantenimiento / evolución** (evolucionamos el sistema para adaptarlo y mejorarlo continuamente). Recuadro **Importante:** *el SDLC define qué actividades deben realizarse durante la vida del software; la forma de organizarlas puede variar según el enfoque utilizado.*

### Diapositiva 20

#### ¿QUÉ ES EL SDLC?

NO.

Consideremos dos proyectos:

PROYECTO B Nueva aplicación móvil para una startup. • Requerimientos cambiantes. • Necesidad de llegar rápidamente al mercado. • Retroalimentación constante de usuarios. • Nuevas versiones frecuentes.

PROYECTO A Software para controlar un dispositivo médico crítico. • Requerimientos muy regulados. • Alta necesidad de documentación. • Cambios cuidadosamente controlados. • Un error puede tener consecuencias graves.

¿Tendría sentido gestionar ambos proyectos exactamente de la misma

manera?

**Contenido visual de la lámina:** Dos proyectos con íconos de dispositivo médico (Proyecto A) y celular (Proyecto B), cada uno con su lista de características; sin imágenes con contenido adicional.

### Diapositiva 21

MODELOS, METODOLOGÍAS Y ENFOQUES DE DESARROLLO

**Contenido visual de la lámina:** Infografía **Modelos, metodologías y enfoques de desarrollo**, con cuatro conceptos alrededor de un computador: **Modelos** — representan el ciclo de vida del software en diferentes etapas y actividades. **Metodologías** — definen cómo se organizan y gestionan las actividades del desarrollo. **Enfoques** — indican la filosofía y principios que guían las decisiones del desarrollo. **Objetivo común** — entregar valor al usuario con calidad, dentro del tiempo y presupuesto esperado. Nota: *No existe una única forma correcta de desarrollar software. La estrategia debe responder a las características, riesgos y necesidades de cada proyecto.*

### Diapositiva 22

#### ¿MODELO, METODOLOGÍA O ENFOQUE?

Conceptos relacionados, pero NO idénticos En Ingeniería de Software utilizamos estos términos con frecuencia, y muchas veces se mezclan.

MODELO DE CICLO DE VIDA

Representa cómo se organizan y relacionan las etapas del desarrollo. Ejemplo: Modelo en Cascada

**Contenido visual de la lámina:** Lámina de texto con un ícono junto al concepto; sin imágenes con contenido adicional.

### Diapositiva 23

#### ¿MODELO, METODOLOGÍA O ENFOQUE?

METODOLOGÍA

Define de manera más concreta cómo desarrollar y gestionar el proyecto, incluyendo procesos, prácticas, técnicas, roles y artefactos.

Ejemplos: RUP · AUP · RAD

**Contenido visual de la lámina:** Lámina de texto con un ícono junto al concepto; sin imágenes con contenido adicional.

### Diapositiva 24

#### ¿MODELO, METODOLOGÍA O ENFOQUE?

ENFOQUE

Representa una filosofía o forma general de abordar el desarrollo. Ejemplos: Predictivo · Iterativo · Incremental · Ágil

“El SDLC nos dice qué actividades debemos realizar; los modelos,

metodologías y enfoques ayudan a decidir cómo organizarlas y

ejecutarlas.”

**Contenido visual de la lámina:** Lámina de texto con un ícono junto al concepto; sin imágenes con contenido adicional.

### Diapositiva 25

#### DOS GRANDES FORMAS DE ORGANIZAR EL DESARROLLO

¿Planificar primero o adaptarnos continuamente?

ENFOQUE PREDICTIVO Planificar → Definir → Diseñar → Construir → Entregar

Busca anticipar gran parte del proyecto desde el comienzo. Funciona mejor cuando:

Los requerimientos son relativamente estables. Existe alta necesidad de planificación. Los cambios deben ser controlados. Existe regulación o documentación formal.

**Contenido visual de la lámina:** Lámina de texto con un ícono de portapapeles junto al enfoque predictivo; sin imágenes con contenido adicional.

### Diapositiva 26

#### DOS GRANDES FORMAS DE ORGANIZAR EL DESARROLLO

ENFOQUE ADAPTATIVO

Construir → Entregar → Aprender → Adaptar → Construir nuevamente Acepta que el proyecto y sus requerimientos pueden cambiar. Funciona especialmente bien cuando:

Existe incertidumbre. Los requerimientos evolucionan. Necesitamos retroalimentación frecuente. Podemos entregar valor progresivamente.

**Contenido visual de la lámina:** Lámina de texto con un ícono de flechas circulares junto al enfoque adaptativo; sin imágenes con contenido adicional.

### Diapositiva 27

#### DOS GRANDES FORMAS DE ORGANIZAR EL DESARROLLO

ENFOQUE PREDICTIVO Planificar → Definir → Diseñar → Construir → Entregar

ENFOQUE ADAPTATIVO Construir → Entregar → Aprender → Adaptar → Construir nuevamente

Pregunta ¿Cuál es mejor? ✓DEPENDE DEL PROYECTO.

**Contenido visual de la lámina:** Comparación de los dos enfoques y un recuadro verde con la respuesta: *✓ Depende del proyecto.*

### Diapositiva 28

#### DESARROLLO ESTRUCTURADO

Una forma clásica de construir software El desarrollo estructurado busca abordar sistemas complejos mediante una descomposición ordenada del problema, utilizando procesos, datos y funciones claramente definidos. Históricamente tuvo gran relevancia en el desarrollo de sistemas de información. Características

Análisis sistemático del problema. Descomposición funcional. Documentación formal. Etapas claramente definidas. Énfasis en planificación y control. Herramientas clásicas asociadas • Diagramas de Flujo de Datos (DFD). • Diccionario de Datos. • Diagramas de procesos. • Especificaciones funcionales.

**Contenido visual de la lámina:** Listas de características y herramientas. Imagen ilustrativa: manos sosteniendo una esfera luminosa con el rótulo *Análisis estructurado de sistema*.

### Diapositiva 29

#### MODELO EN CASCADA

**Contenido visual de la lámina:** Infografía **Modelo en cascada — una representación secuencial del desarrollo**: ilustración de una cascada junto a siete etapas escalonadas: **Requerimientos → Análisis → Diseño → Implementación → Pruebas → Despliegue → Mantenimiento**. Recuadros: **¿Cuál es su lógica?** — cada etapa se desarrolla de manera predominantemente secuencial, utilizando los resultados de la etapa anterior como entrada para la siguiente. **Ventajas** — fácil de comprender; etapas y entregables claramente definidos; facilita planificación y seguimiento; útil cuando los requerimientos son muy estables. **Limitación principal** — los cambios tardíos pueden resultar difíciles y costosos.

### Diapositiva 30

#### ¿CASCADA ESTÁ MUERTA?

NO necesariamente. Existe una tendencia a pensar: Tradicional = Malo Ágil = Bueno

PROYECTO A Una startup desarrolla una nueva red social. Los requerimientos cambian constantemente.

PROYECTO B Software para un sistema altamente regulado, con requisitos contractuales, trazabilidad y documentación exhaustiva.

Un proceso rígidamente secuencial probablemente no sea la mejor alternativa.

Un enfoque con mayor planificación, control y formalidad puede ser perfectamente razonable.

**Contenido visual de la lámina:** Dos proyectos, cada uno con una flecha azul hacia su conclusión. Imagen ilustrativa: diagrama escalonado de un *proceso de desarrollo* (análisis, diseño, implementación, verificación y mantenimiento).

### Diapositiva 31

#### ¿Y SI NO PODEMOS ESPERAR HASTA EL FINAL?

El problema del tiempo Imaginemos este proyecto:

Una empresa necesita una aplicación para gestionar pedidos de sus clientes. El proyecto completo tardará aproximadamente 12 meses.

Con un desarrollo predominantemente secuencial: Requerimientos → Análisis → Diseño → Desarrollo → Pruebas → Entrega El cliente podría esperar muchos meses antes de utilizar una versión operativa. Pero el negocio necesita resultados mucho antes.

Entonces surge otra pregunta: ¿Podemos construir y entregar software útil más rápidamente sin esperar a tener todo el sistema terminado?

Aquí comienza a cambiar la forma de desarrollar. VELOCIDAD + PROTOTIPOS + PARTICIPACIÓN DEL USUARIO + ITERACIÓN

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 32

#### RAD (Rapid Application Development)

RAD es un enfoque de desarrollo que busca reducir los tiempos de construcción mediante:

Desarrollo rápido. Prototipos. Participación frecuente del usuario. Iteraciones. Reutilización de componentes. Entregas rápidas.

**Contenido visual de la lámina:** Lista de seis características con íconos (rayo, piezas, personas, flechas, reciclaje, cohete); sin imágenes con contenido adicional.

### Diapositiva 33

#### RAD (Rapid Application Development)

La lógica cambia En lugar de intentar especificar completamente el sistema antes de construir: Construimos rápidamente → mostramos → recibimos retroalimentación → ajustamos → volvemos a construir. Idea clave RAD busca aprender rápidamente mediante versiones funcionales y retroalimentación frecuente del usuario.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 34

#### RAD

**Contenido visual de la lámina:** Infografía **¿Cómo funciona RAD? — un ciclo mucho más dinámico**: **Requerimientos → Diseño rápido → Prototipo → Usuario → Feedback → Ajustes → Nueva versión (v2)**, con una flecha de retorno al inicio. **Ejemplo:** un sistema de reservas para un hotel. *Primera versión*: habitaciones + disponibilidad → el cliente la prueba → *«Necesitamos visualizar también las características de cada habitación»* → se modifica → *nueva versión*: habitaciones + disponibilidad + características → el cliente vuelve a probar. **Resultado:** *el usuario participa activamente en la construcción de la solución, no solamente en su definición inicial y aceptación final.*

### Diapositiva 35

#### ¿CUÁNDO UTILIZAR RAD?

Pero puede ser problemático cuando... El sistema es extremadamente grande

o complejo. Existen fuertes restricciones

RAD puede ser una excelente alternativa cuando... ✓Necesitamos resultados rápidamente. ✓Los usuarios pueden participar

regulatorias. El cliente no puede participar. La arquitectura requiere una

planificación considerable. Los prototipos rápidos terminan

frecuentemente. ✓Los requerimientos pueden evolucionar. ✓El sistema puede dividirse en módulos. ✓Es posible construir prototipos. ✓El equipo dispone de experiencia y

herramientas apropiadas.

convirtiéndose sin suficiente control en el producto definitivo.

“La velocidad aporta valor solo cuando no compromete la calidad ni la

sostenibilidad de la solución.”

**Contenido visual de la lámina:** Dos listas: cuándo usar RAD (✓) y cuándo es problemático (✗ roja); sin imágenes con contenido adicional.

### Diapositiva 36

#### ITERATIVO ≠ INCREMENTAL

**Contenido visual de la lámina:** Infografía **Los conceptos suelen utilizarse juntos, pero significan cosas diferentes**: (1) **Desarrollo iterativo** — construimos una solución y la mejoramos repetidamente: versión inicial → mejorar → mejorar → mejorar. Ejemplo: primera versión del buscador → mejoramos resultados → mejoramos filtros → mejoramos rendimiento. (2) **Desarrollo incremental** — construimos el sistema agregando nuevas partes funcionales: parte A → + parte B → + parte C → sistema más completo. Ejemplo: versión 1 buscar productos → versión 2 + carrito → versión 3 + pagos → versión 4 + despacho. (3) **¿Pueden combinarse? Sí:** un proyecto puede ser *iterativo + incremental*: cada incremento agrega nuevas funcionalidades y, al mismo tiempo, las existentes pueden mejorarse en sucesivas iteraciones. **Regla para recordar:** iterar = mejorar lo existente; incrementar = agregar algo nuevo.

### Diapositiva 37

#### ¿QUÉ ES RUP?

RUP — Rational Unified Process RUP es un proceso de desarrollo de software iterativo e incremental, orientado a organizar proyectos mediante fases, disciplinas, roles y artefactos claramente definidos. Sus características principales

Iterativo El producto se desarrolla y mejora mediante sucesivas iteraciones.

Incremental Cada iteración puede incorporar nuevas capacidades al sistema.

Dirigido por riesgos Los riesgos importantes se enfrentan tempranamente.

Centrado en la arquitectura La arquitectura constituye una base fundamental del proyecto.

Guiado por casos de uso Los requerimientos funcionales orientan buena parte del desarrollo.

**Contenido visual de la lámina:** Lista de cinco características con íconos (flechas, pieza, advertencia, grúa, persona); sin imágenes con contenido adicional.

### Diapositiva 38

#### RUP

**Contenido visual de la lámina:** Infografía **Las 4 fases de RUP — ¿Cómo organiza RUP un proyecto?** (Rational Unified Process: Inicio → Elaboración → Construcción → Transición): (1) **Inicio** — ¿qué vamos a construir y por qué?: alcance, objetivos, viabilidad, riesgos iniciales. (2) **Elaboración** — ¿cómo construiremos la solución?: requerimientos principales, arquitectura, riesgos críticos. (3) **Construcción** — construimos el producto: desarrollo, integración, pruebas, incrementos funcionales. (4) **Transición** — llevamos el producto a sus usuarios: despliegue, capacitación, correcciones, aceptación. Franja inferior: RUP es iterativo e incremental → cada fase contiene iteraciones que producen incrementos del sistema → permite gestionar riesgos temprano y entregar valor en forma evolutiva → enfoca el proyecto en el negocio y en la satisfacción del usuario.

### Diapositiva 39

#### RUP NO ES CASCADA

Cuidado con esta interpretación Al observar: Inicio → Elaboración → Construcción → Transición podríamos pensar: “Entonces RUP es simplemente otra forma de Cascada.” NO. CASCADA Requisitos → Diseño → Código → Pruebas → Entrega Predomina una progresión secuencial entre etapas. RUP

ITERACIÓN 1

──────────── INICIO → ELABORACIÓN → CONSTRUCCIÓN → TRANSICIÓN

──────────── ITERACIÓN 2...

**Contenido visual de la lámina:** Diagrama circular con **RUP** al centro y las fases Inicio → Elaboración → Construcción → Transición alrededor. En el texto, un esquema muestra que las iteraciones recorren las cuatro fases varias veces (*Iteración 1*, *Iteración 2*…).

### Diapositiva 40

#### RUP EN UN PROYECTO REAL

Ejemplo: Plataforma de Comercio Electrónico

INICIO Definimos: • Comprar productos. • Administrar clientes. • Procesar pagos. • Gestionar despachos. Identificamos alcance y riesgos iniciales.

CONSTRUCCIÓN Desarrollamos progresivamente: Incremento 1: Catálogo. Incremento 2: Carrito. Incremento 3: Pagos. Incremento 4: Despacho. Y realizamos pruebas durante el desarrollo.

ELABORACIÓN Diseñamos la arquitectura. Analizamos especialmente riesgos como: Pagos · Seguridad · Inventario · Integraciones Construimos una base arquitectónica estable.

TRANSICIÓN Desplegamos el sistema. Usuarios reales lo utilizan. Corregimos problemas. Capacitamos. Liberamos la versión productiva.

**Contenido visual de la lámina:** Cuatro fases con un punto de color cada una (azul, amarillo, naranjo y verde); sin imágenes con contenido adicional.

### Diapositiva 41

#### ¿CUÁNDO PODRÍA UTILIZARSE RUP?

RUP resulta especialmente interesante cuando... ✓El proyecto tiene una complejidad importante. ✓Existen riesgos técnicos relevantes. ✓Necesitamos una arquitectura sólida. ✓Requerimos trazabilidad y documentación. ✓Participan diferentes roles o equipos. ✓Queremos desarrollar de manera iterativa e

incremental manteniendo una estructura formal.

¿Cuál puede ser el problema? Si se implementa de manera excesivamente rígida: Demasiados artefactos. Exceso de documentación. Procesos pesados. Mayor esfuerzo de gestión.

**Contenido visual de la lámina:** Lista de condiciones con ✓ y de problemas con ✗ roja. Imagen ilustrativa: anillo de cuatro colores con el rótulo *Fases del método RUP* (inicio, elaboración, construcción y transición).

### Diapositiva 42

#### AUP (Agile Unified Process)

Pero busca reducir:

AUP surge como una alternativa más simple y ligera inspirada en RUP. Mantiene ideas importantes como:

Desarrollo iterativo. Desarrollo incremental. Importancia de la arquitectura. Gestión de riesgos. Calidad durante el desarrollo.

Complejidad. Exceso de documentación. Cantidad de artefactos. Formalidad innecesaria. En términos simples: RUP Estructurado + completo + formal ↓ AUP Iterativo + estructurado + simplificado + ágil

AUP intenta conservar la disciplina de RUP reduciendo su complejidad y acercándolo a los principios ágiles.

**Contenido visual de la lámina:** Listas con íconos (ideas que mantiene) y ✗ roja (lo que busca reducir), un recuadro verde y una comparación *RUP: estructurado + completo + formal → AUP: iterativo + estructurado + simplificado + ágil*.

### Diapositiva 43

#### DE RUP A AUP

RUP AUP Proceso más completo Proceso simplificado Mayor cantidad de artefactos Menos artefactos Mayor formalidad Mayor flexibilidad Iterativo e incremental Iterativo e incremental Orientado a arquitectura Mantiene foco arquitectónico Puede resultar pesado Busca ser más ligero

**Contenido visual de la lámina:**

Tabla **De RUP a AUP**:

| RUP | AUP |
|---|---|
| Proceso más completo | Proceso simplificado |
| Mayor cantidad de artefactos | Menos artefactos |
| Mayor formalidad | Mayor flexibilidad |
| Iterativo e incremental | Iterativo e incremental |
| Orientado a arquitectura | Mantiene foco arquitectónico |
| Puede resultar pesado | Busca ser más ligero |

### Diapositiva 44

#### AUP (Agile Unified Process)

Pero aparece una pregunta mucho mayor... • Si los requerimientos cambian constantemente... • Si necesitamos entregar valor rápidamente... • Si necesitamos conversar frecuentemente con el cliente... • Si debemos adaptarnos durante el proyecto... ¿Necesitamos cambiar solamente el proceso... o nuestra forma de pensar el desarrollo? Y aquí aparece:

AGILIDAD

**Contenido visual de la lámina:** Lámina de texto con un ícono de cohete junto a *Agilidad*; sin imágenes con contenido adicional.

### Diapositiva 45

#### UN CAMBIO DE PARADIGMA

El problema ya no es solamente construir software Imaginemos un proyecto de 18 meses. Durante el primer mes el cliente define lo que necesita. El equipo trabaja durante meses. Finalmente entrega exactamente lo solicitado. Pero... 18 meses después, el negocio cambió. El software cumple perfectamente el documento original... pero ya no resuelve completamente la necesidad actual.

Pregunta ¿El proyecto fue exitoso porque cumplió exactamente el plan inicial?

“En entornos de alta incertidumbre, seguir perfectamente un plan

equivocado no garantiza el éxito.”

**Contenido visual de la lámina:** Imagen ilustrativa: notebook con personas trabajando sobre su pantalla.

### Diapositiva 46

#### EL MANIFIESTO ÁGIL

MUY IMPORTANTE Agilidad NO significa:

2001 — Una nueva forma de pensar el desarrollo Aquí sí presentaría los cuatro valores fundamentales. Valoramos:

Individuos e interacciones sobre procesos y herramientas.

Software funcionando sobre documentación extensiva.

Colaboración con el cliente sobre negociación contractual.

No documentar. No planificar. No diseñar. No tener procesos. Cambiar todo permanentemente. El propio Manifiesto establece que los elementos de la derecha también tienen valor, pero se valoran más los de la izquierda.

Respuesta ante el cambio sobre seguir un plan.

“Ser ágil no significa trabajar sin disciplina; significa adaptarse

rápidamente sin perder el propósito.”

**Contenido visual de la lámina:** Cuatro valores con íconos (personas, computador, apretón de manos, flechas) y lista de lo que agilidad *no significa*, marcada con ✗ roja.

### Diapositiva 47

#### ¿QUÉ SIGNIFICA DESARROLLAR DE FORMA ÁGIL?

**Contenido visual de la lámina:** Infografía **¿Qué significa desarrollar de forma ágil? — cambiamos la lógica del proyecto.** **Enfoque predominantemente predictivo:** planificar todo → construir → probar → entregar; su gráfico muestra que el valor aparece principalmente hacia el final. **Enfoque ágil:** priorizar → construir → probar → entregar → aprender → adaptar (en ciclo); su gráfico muestra que el valor aparece progresivamente. **Tres conceptos fundamentales:** iteración (trabajamos en ciclos cortos), incremento (generamos producto utilizable progresivamente) y feedback (aprendemos de usuarios, cliente y equipo). **Distinción fundamental: Ágil ≠ Scrum** — ágil es una filosofía basada en valores y principios; Scrum es un framework (marco de trabajo) que permite abordar problemas complejos mediante un enfoque iterativo e incremental. **Transición:** Scrum no inventó la agilidad; Scrum proporciona una estructura para aplicarla. **Idea clave:** ágil busca flexibilidad, colaboración y entrega continua de valor; Scrum es una forma concreta de lograrlo.

### Diapositiva 48

#### SCRUM

Un marco de trabajo para problemas complejos ¿Qué es Scrum? Scrum es un framework ligero que ayuda a personas, equipos y organizaciones a generar valor mediante soluciones adaptativas para problemas complejos.

**Contenido visual de la lámina:** Diagrama circular **Scrum Methodology**: *Scope → Product Backlog → Design*, y un ciclo con *Sprint Planning Meeting*, *Sprint Backlog*, *Sprint Automation*, *Daily Scrum*, *Sprint Execution*, *Sprint Review Meeting* y *Sprint Retrospective*, que termina en *Usable Software*.

### Diapositiva 49

#### SCRUM

**Contenido visual de la lámina:** Infografía **Scrum — su lógica fundamental es sencilla**: ciclo **(1) Product Backlog** (lista priorizada de todo lo que podemos construir) → **(2) Sprint** (período corto de trabajo, 1 a 4 semanas, con un objetivo claro) → **(3) Incremento** (producto utilizable que agrega valor al cliente) → **(4) Feedback** (recibimos opiniones del cliente, usuarios y del equipo) → **(5) Adaptación** (aprendemos y ajustamos el plan, el backlog y la forma de trabajar). **Scrum se caracteriza por ser:** iterativo (ciclos cortos que se repiten), incremental (incrementos de producto funcional en cada ciclo), orientado a generar valor, colaborativo, transparente y adaptativo. **Idea clave:** Scrum no intenta predecir todo lo que ocurrirá en el proyecto; crea ciclos cortos que permiten aprender y adaptarse continuamente.

### Diapositiva 50

#### ¿POR QUÉ EXISTE SCRUM?

Porque desarrollar software implica incertidumbre En muchos proyectos no podemos conocer completamente desde el comienzo: • todos los requerimientos; • todos los problemas técnicos; • cómo reaccionarán los usuarios; • qué funcionalidades aportarán realmente valor; • qué cambios aparecerán durante el desarrollo.

Enfoque tradicional Intentamos reducir la incertidumbre planificando.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 51

#### ¿POR QUÉ EXISTE SCRUM?

Scrum agrega otra estrategia: Reducir la incertidumbre aprendiendo. ¿Cómo? Construir → Inspeccionar → Aprender → Adaptar Ejemplo Desarrollamos una aplicación durante 12 meses y descubrimos al final que el usuario quería algo diferente. vs. Cada pocas semanas entregamos algo utilizable, recibimos feedback y ajustamos lo siguiente.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 52

#### SCRUM - EL EMPIRISMO

**Contenido visual de la lámina:** Infografía **El empirismo — el corazón de Scrum**: *el conocimiento surge de la experiencia y de tomar decisiones basadas en lo que observamos.* En lugar de asumir que conocemos todo desde el comienzo: (1) **construimos algo** (una solución o una parte de ella) → (2) **observamos qué ocurre** (cómo funciona en la práctica) → (3) **aprendemos** (información real sobre qué funciona y qué no) → (4) **adaptamos nuestras decisiones** (repriorizamos, ajustamos el plan y decidimos qué hacer a continuación) → (5) **volvemos a construir** (implementamos los cambios y generamos un nuevo incremento). **Ejemplo sencillo:** hipótesis (*«los usuarios necesitan esta funcionalidad»*) → incremento (la desarrollamos) → feedback (los usuarios la prueban) → aprendizaje (descubrimos qué funciona y qué debemos cambiar). **Mensaje clave:** en Scrum, aprender no es una consecuencia accidental del proyecto; forma parte del proceso.

### Diapositiva 53

#### SCRUM

**Contenido visual de la lámina:** Infografía **Los 3 pilares de Scrum — el empirismo se sostiene sobre tres pilares**: **Transparencia** — el proceso y el trabajo deben ser visibles para quienes participan (tablero *por hacer / en curso / hecho*, progreso y problemas); todos deben comprender qué estamos haciendo, qué hemos logrado y qué problemas existen. **Inspección** — debemos revisar frecuentemente el producto, el progreso, los resultados y los problemas; pero inspeccionar sin actuar no aporta suficiente valor. **Adaptación** — cuando descubrimos desviaciones o nuevas necesidades, ajustamos el producto, el plan, las prioridades y la forma de trabajar. Secuencia: transparencia → inspección → adaptación. **Mensaje clave:** no podemos inspeccionar correctamente aquello que no es transparente, ni tiene sentido inspeccionar si después no estamos dispuestos a adaptarnos.

### Diapositiva 54

#### SCRUM

**Contenido visual de la lámina:** Infografía **Los 5 valores de Scrum — Scrum no funciona solamente con reuniones y artefactos.** El Scrum Team debe vivir cinco valores: **compromiso** (con los objetivos y con el equipo), **foco** (concentrarse en el trabajo necesario para alcanzar el objetivo), **apertura** (ser transparentes respecto del trabajo, los problemas y los desafíos), **respeto** (reconocer las capacidades, conocimientos y aportes de los demás) y **coraje** (tener la valentía de enfrentar problemas difíciles y tomar decisiones correctas). **Pregunta para los estudiantes:** *¿qué ocurriría con Scrum si un equipo oculta sus problemas para aparentar que todo marcha bien?* → falta de apertura → falta de transparencia → mala inspección → mala adaptación. Cita: *Scrum no funciona porque exista un Sprint o una Daily Scrum; funciona cuando las personas utilizan esos elementos para hacer visible la realidad, aprender y adaptarse.*

### Diapositiva 55

#### EL SCRUM TEAM

¿Quién hace que Scrum funcione? La unidad fundamental de Scrum es un pequeño equipo de personas denominado: SCRUM TEAM

Está compuesto por:

PRODUCT OWNER Maximiza el valor del producto.

SCRUM MASTER Ayuda al equipo y a la organización a comprender y aplicar Scrum correctamente.

DEVELOPERS Crean un Incremento utilizable durante cada Sprint.

**Contenido visual de la lámina:** Tres roles con íconos (diana, brújula y computador); sin imágenes con contenido adicional.

### Diapositiva 56

#### EL SCRUM TEAM

Una característica fundamental NO son tres equipos separados. Son UN SOLO EQUIPO. Product Owner + Scrum Master + Developers El Scrum Team es:

Multifuncional. Autogestionado. Orientado a un objetivo común. Responsable de generar valor. Importante La Scrum Guide establece que un Scrum Team suele ser de 10 personas o menos. Scrum busca equipos pequeños, cohesionados y capaces de transformar una necesidad en valor.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 57

#### SCRUM TEAMS

**Contenido visual de la lámina:** Infografía **Product Owner — ¿qué debemos construir primero?** El Product Owner es responsable de maximizar el valor del producto resultante del trabajo del Scrum Team. Entre sus responsabilidades está la gestión efectiva del **Product Backlog**; debe asegurar que exista un *Product Goal* claro, que los elementos sean comprensibles, que el backlog esté correctamente ordenado y que las prioridades sean transparentes para el equipo. Ilustración de un backlog numerado del 1 al 5 con prioridades alto, alto, medio, bajo y bajo, que el Product Owner ordena para maximizar el valor. **Ejemplo:** con recursos para una sola funcionalidad en el próximo Sprint — A) nuevo sistema de recomendaciones, B) recuperación de contraseña, C) modo oscuro, D) exportación de reportes — *¿quién decide qué tiene mayor prioridad?* **El Product Owner.** **Pero atención:** el Product Owner decide qué aporta mayor valor y cómo ordenar el Product Backlog (qué y en qué orden ✓); no le dice a los Developers cómo programarlo (cómo hacerlo ✗).

### Diapositiva 58

#### SCRUM

**Contenido visual de la lámina:** Infografía **Scrum Master — ¿el jefe del equipo? No.** Esta confusión es muy frecuente (ilustración de un jefe gritando *«¡Haz esto!»*, tachada): el Scrum Master no es el jefe de los Developers ni un gerente que distribuye tareas; es responsable de promover Scrum tal como se define en la Scrum Guide y de ayudar a mejorar la efectividad del Scrum Team. **¿Qué hace?** Ayuda al equipo a comprender Scrum; facilita la eliminación de impedimentos; promueve la autogestión; ayuda al equipo a mejorar su forma de trabajar; facilita eventos cuando es necesario; ayuda también al Product Owner y a la organización. **Ejemplo:** un Developer dice *«Llevamos dos días esperando acceso al servidor y no podemos continuar»*; el Scrum Master responde *«Voy a ayudar a que ese impedimento sea abordado y eliminado»*: impedimento identificado → se aborda con las personas adecuadas → se elimina → el equipo puede continuar y entregar valor. **Idea clave:** el Scrum Master no dirige a las personas; ayuda a crear las condiciones para que el Scrum Team pueda ser efectivo.

### Diapositiva 59

#### SCRUM

**Contenido visual de la lámina:** Infografía **Developers — quienes construyen el incremento.** Los Developers son las personas del Scrum Team comprometidas con crear cualquier aspecto de un incremento utilizable en cada Sprint. Según el producto, pueden tener conocimientos en desarrollo, testing, UX/UI, datos, DevOps y arquitectura, pero Scrum **no** crea subequipos separados. Son responsables de: crear el plan del Sprint (*Sprint Backlog*), mantener la calidad mediante la *Definition of Done*, adaptar diariamente su plan hacia el *Sprint Goal* y responsabilizarse profesionalmente unos frente a otros. **Concepto fundamental: autogestión** — el equipo decide internamente quién hace qué, cuándo y cómo, para lograr un incremento utilizable en cada Sprint. **Idea clave:** Scrum reemplaza la asignación permanente de tareas desde arriba por responsabilidad y autogestión del equipo.

### Diapositiva 60

#### SCRUM - ACTIVIDAD 10 MINUTOS

“¿QUIÉN SE HACE CARGO?”

Imaginen este Scrum Team Una universidad está desarrollando una nueva aplicación móvil para sus estudiantes. Durante el Sprint ocurren las siguientes situaciones:

CASO 1 Existen 15 funcionalidades pendientes, pero solo pueden abordar 5 próximamente. ¿Quién es responsable de ordenar el Product Backlog buscando maximizar valor?

**Contenido visual de la lámina:** Lámina de texto con un ícono de sirena junto al título; sin imágenes con contenido adicional.

### Diapositiva 61

#### SCRUM - ACTIVIDAD 10 MINUTOS

CASO 2 El equipo lleva tres días sin poder acceder al ambiente de pruebas. ¿Quién debería ayudar a que el impedimento sea abordado?

CASO 3 Hay que decidir técnicamente cómo implementar el nuevo módulo de autenticación. ¿Quién decide cómo realizar el trabajo?

CASO 4 El Rector solicita directamente a un Developer: “Agrega esta funcionalidad ahora. Es urgente.” ¿Qué problema observan desde la perspectiva de Scrum?

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 62

#### SCRUM - ACTIVIDAD 10 MINUTOS

CASO 5 Una funcionalidad fue terminada, pero presenta errores y no cumple la Definition of Done.

El Product Owner dice: “No importa. Yo la apruebo igual.” ¿Puede considerarse parte del Incremento terminado?

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 63

#### SCRUM - ACTIVIDAD 10 MINUTOS

INSTRUCCIONES Cada grupo tiene:

5 minutos Para responder los cinco casos. Luego:

5 minutos Los discutimos entre todos. Pero deben responder siempre: PRODUCT OWNER SCRUM MASTER DEVELOPERS o TODO EL SCRUM TEAM y justificar brevemente el porqué.

**Contenido visual de la lámina:** Ilustración de los roles y su relación: **Cliente** (genera las ideas y da sugerencias) entrega *requisitos* al **Product Owner** (es la voz del cliente), que entrega el *backlog del producto y los criterios de aceptación* al **Scrum Master** (50 % desarrollador, responsable de Scrum) y al **Equipo Scrum** (desarrollan el servicio o producto); el equipo devuelve *pequeños incrementos del producto* y el cliente recibe *incremental product releases*. Íconos de cronómetro junto a los tiempos de la actividad.

### Diapositiva 64

#### SCRUM

“Scrum no elimina las responsabilidades. Las hace explícitas.”

¿Quién es entonces el jefe del Scrum Team?

¡¡ Scrum no define un “jefe del equipo”. Define

responsabilidades claras dentro de un equipo

autogestionado!!

**Contenido visual de la lámina:** Pregunta en azul y un recuadro verde con la respuesta: *¡¡Scrum no define un “jefe del equipo”. Define responsabilidades claras dentro de un equipo autogestionado!!*

### Diapositiva 65

#### SCRUM

**Contenido visual de la lámina:** Infografía **Los artefactos de Scrum — ¿cómo hacemos visible el trabajo?** Scrum define tres artefactos principales: (1) **Product Backlog** — representa lo que podría necesitar el producto; contiene todas las ideas, requisitos y mejoras; está ordenado por valor de negocio; puede cambiar y evolucionar. (2) **Sprint Backlog** — representa qué intentaremos lograr durante el Sprint y cómo pensamos hacerlo (tablero objetivo / tareas / cómo lo haremos); es comprometido por el Scrum Team, tiene un objetivo claro (el *Sprint Goal*) y define las tareas y el plan para alcanzarlo. (3) **Increment** — representa el resultado utilizable generado durante el Sprint; es la suma de todos los incrementos anteriores, cumple la *Definition of Done* y entrega valor real a los usuarios. Mensaje: *Juntos hacen el trabajo visible, inspeccionable y adaptable.*

### Diapositiva 66

#### LOS ARTEFACTOS DE SCRUM

Artefacto Compromiso

Product Backlog Product Goal Sprint Backlog Sprint Goal Increment Definition of Done

Los artefactos hacen transparente el trabajo; sus compromisos permiten medir el progreso hacia objetivos concretos.

**Contenido visual de la lámina:**

Tabla:

| Artefacto | Compromiso |
|---|---|
| Product Backlog | Product Goal |
| Sprint Backlog | Sprint Goal |
| Increment | Definition of Done |

### Diapositiva 67

#### LOS ARTEFACTOS DE SCRUM

**Contenido visual de la lámina:** Infografía **Product Backlog — todo comienza con una necesidad.** El Product Backlog es una lista emergente y ordenada de aquello que se necesita para mejorar el producto. **Ejemplo: app universitaria**, que podría contener: 1 consultar horario, 2 visualizar calificaciones, 3 inscribir asignaturas, 4 recibir notificaciones, 5 solicitar certificados, 6 consultar asistencia, 7 reservar salas de estudio…; está ordenado por valor de negocio, refleja lo que hoy conocemos y lo que podría ser necesario en el futuro, y es visible y comprensible para el Scrum Team y los stakeholders. **Pero… no es una lista congelada:** a medida que aprendemos aparecen nuevas necesidades, cambian prioridades, se refinan elementos y algunas necesidades pueden desaparecer. **Responsable:** el Product Owner, de la gestión efectiva del Product Backlog. **Compromiso:** el *Product Goal*, que describe un objetivo futuro del producto que sirve como referencia para la planificación. Mensaje: *El Product Backlog evoluciona porque el producto y las necesidades también evolucionan.*

### Diapositiva 68

#### SCRUM

**Contenido visual de la lámina:** Infografía **Sprint Backlog — ¿qué haremos ahora?** Comienza un nuevo Sprint: no intentamos desarrollar todo el Product Backlog; los Developers seleccionan trabajo para contribuir al objetivo del Sprint y construyen un plan para realizarlo. El Sprint Backlog contiene: **¿por qué?** el Sprint Goal; **¿qué?** los elementos del Product Backlog seleccionados; **¿cómo?** el plan para entregar el incremento. **Ejemplo:** Sprint Goal *«Permitir que el estudiante consulte su información académica básica desde el celular»*; trabajo seleccionado: iniciar sesión, consultar horario, consultar calificaciones y visualizar asistencia; plan del equipo: iniciar sesión (diseño UI + API + pruebas), consultar horario (servicio + integración + pruebas), consultar calificaciones (consulta BD + API + pruebas) y visualizar asistencia (reglas de negocio + API + pruebas). **Importante:** el Sprint Backlog pertenece a los Developers y puede adaptarse durante el Sprint a medida que aprenden más, sin poner en riesgo el Sprint Goal. Mensaje: *El Sprint Backlog es nuestro compromiso del Sprint, pero no es rígido: aprendemos, adaptamos y entregamos valor* (plan → aprender → adaptar → entregar incremento).

### Diapositiva 69

#### SCRUM

**Contenido visual de la lámina:** Infografía **El incremento — ¿qué entregamos?** Al finalizar el trabajo necesitamos algo más que código parcialmente terminado, pantallas sin integrar, funcionalidades que «casi funcionan» o software que todavía no cumple los criterios de calidad. **Necesitamos un incremento utilizable:** cada incremento debe agregar valor a los incrementos anteriores y estar completamente verificado para asegurar que todos funcionen juntos (incremento 1 → 2 → 3); cada incremento entrega valor real y está listo para ser usado. **Ejemplo:** después del Sprint, la aplicación permite iniciar sesión, consultar horario y consultar calificaciones, y esas funcionalidades están integradas, probadas, funcionando y cumpliendo la calidad acordada. **Pregunta:** *¿cómo sabemos cuándo algo está realmente terminado?* → cumple la *Definition of Done*, probado por el equipo, integrado sin problemas, aporta valor real al usuario y listo para ser usado.

### Diapositiva 70

#### SCRUM

**Contenido visual de la lámina:** Infografía **Definition of Done — «terminado» debe significar lo mismo para todos.** La *Definition of Done* (DoD) es una descripción formal del estado que debe alcanzar un incremento cuando cumple las medidas de calidad requeridas para el producto. **Ejemplo simplificado:** una funcionalidad está *done* cuando el código está terminado, fue revisado, las pruebas requeridas fueron superadas, está integrada con el sistema, cumple los criterios de calidad establecidos y la documentación necesaria fue actualizada. **Situación:** el Developer dice *«Ya terminé la funcionalidad»*; QA responde *«Tiene tres errores»*; el Product Owner dice *«Pero necesito mostrarla mañana»*. **¿Está done? No:** si no cumple la Definition of Done, el trabajo no puede considerarse parte de un incremento terminado. **Idea clave:** la DoD transforma el concepto subjetivo de «terminado» en un estándar compartido de calidad. **¿Por qué es importante?** Alinea expectativas entre todos, asegura calidad en cada entrega, evita retrabajo y sorpresas, y entrega valor real al usuario. Mensaje: *la Definition of Done no es una barrera; es una garantía de calidad para el producto y para el equipo* (planificamos → construimos → verificamos → cumple DoD → incremento utilizable).

### Diapositiva 71

EL SPRINT EL CORAZÓN DE SCRUM

El Sprint es un período de duración fija de un mes o menos durante el cual el Scrum Team trabaja para alcanzar un Sprint Goal y generar valor. Un nuevo Sprint comienza inmediatamente después de finalizar el anterior. Dentro del Sprint ocurren: SPRINT PLANNING ↓ DAILY SCRUM ↓ TRABAJO PARA CREAR EL INCREMENTO ↓ SPRINT REVIEW ↓ SPRINT RETROSPECTIVE ↺

**Contenido visual de la lámina:** Ícono de una persona corriendo junto al título; secuencia de eventos en texto, sin imágenes con contenido adicional.

### Diapositiva 72

EL SPRINT EL CORAZÓN DE SCRUM

Durante el Sprint...

No se realizan cambios que pongan en peligro el Sprint Goal. La calidad no disminuye. El Product Backlog se refina cuando es necesario. El alcance puede aclararse y renegociarse con el Product Owner a medida que se aprende. Idea clave El Sprint crea un ciclo corto en el que planificamos, construimos, inspeccionamos, aprendemos y nos adaptamos.

**Contenido visual de la lámina:** Ícono de una persona corriendo junto al título; lista con marcas de verificación, sin imágenes con contenido adicional.

### Diapositiva 73

#### SCRUM

**Contenido visual de la lámina:** Infografía **Sprint Planning — ¿qué queremos lograr en este Sprint?** La Sprint Planning inicia el Sprint; todo el Scrum Team participa para definir el trabajo que se realizará. **Objetivo:** definir qué haremos y cómo lo haremos para entregar valor al final del Sprint. Tres preguntas: (1) **¿Por qué?** — ¿por qué este Sprint aporta valor? Se establece el *Sprint Goal*, que da dirección y enfoque al trabajo del equipo. Ejemplo: *permitir que los estudiantes consulten su información académica desde la aplicación móvil.* (2) **¿Qué?** — ¿qué elementos del Product Backlog pueden realizarse? Se selecciona trabajo para el Sprint; ejemplo: iniciar sesión (8), consultar horario (13), consultar calificaciones (13) y visualizar asistencia (8), con 42 puntos estimados totales. (3) **¿Cómo?** — los Developers construyen el plan necesario; ejemplo de plan del Sprint con tareas, responsable, estimación en horas y dependencias (por ejemplo, diseñar flujo de login, desarrollar API de autenticación, desarrollar pantallas, integrar y probar, revisión y preparación de la demo). **Resultado: Sprint Backlog** = Sprint Goal + elementos seleccionados + plan; *este es nuestro compromiso para el Sprint.* **Mensaje clave:** un Sprint no comienza preguntando *«¿qué tareas hacemos?»*, sino *«¿qué objetivo queremos alcanzar?»* (objetivo → seleccionar → planificar → compromiso → inicia el Sprint).

### Diapositiva 74

#### SCRUM

**Contenido visual de la lámina:** Infografía **Daily Scrum — 15 minutos para inspeccionar y adaptar.** La Daily Scrum es un evento de 15 minutos para los Developers y se realiza cada día hábil del Sprint. **Su propósito:** inspeccionar el progreso hacia el *Sprint Goal* y adaptar el Sprint Backlog cuando sea necesario. **No es:** una reunión para rendir cuentas al jefe; una reunión dirigida obligatoriamente por el Scrum Master; una extensa reunión para solucionar todos los problemas; simplemente «contar qué hice ayer». **Sí es:** sincronizarse, identificar dificultades, revisar el progreso, adaptar el plan y mantener el foco en el Sprint Goal. **¿Cómo funciona?** Los Developers responden tres preguntas clave: (1) ¿qué hice ayer para ayudar al equipo a alcanzar el Sprint Goal?; (2) ¿qué haré hoy para ayudar al equipo a alcanzar el Sprint Goal?; (3) ¿veo algún impedimento que me impida o le impida al equipo avanzar? **Salida:** decisiones y ajustes para adaptar el Sprint Backlog. **Recuerda:** el foco de la Daily Scrum siempre es el avance hacia el Sprint Goal; no resolvemos todo en la reunión, identificamos y acordamos qué hacer para seguir avanzando. **Pregunta para la clase:** *si una Daily Scrum dura todos los días 45 minutos, ¿qué sospecharían que está ocurriendo?*

### Diapositiva 75

#### SCRUM

**Contenido visual de la lámina:** Infografía **Sprint Review — ¿qué construimos y qué aprendimos?** Al finalizar el Sprint, el Scrum Team y los stakeholders relevantes inspeccionan el resultado obtenido. **Durante la Sprint Review:** se inspecciona el incremento; se analiza el progreso hacia el Product Goal; los stakeholders entregan feedback; se revisan posibles cambios en el entorno; el Product Backlog puede adaptarse. **Ejemplo:** el equipo presenta la nueva aplicación académica; los estudiantes la prueban y comentan *«Podemos consultar las notas, pero necesitamos visualizar también el promedio del curso»*; ese feedback puede generar nuevas necesidades para el Product Backlog (se agrega *consultar promedio de curso* como **nuevo**). **Sprint Review ≠ presentación formal:** no se trata simplemente de hacer una «demo»; es una instancia de inspección y adaptación del producto junto con los stakeholders. No es una presentación para impresionar, mostrar solo lo «bonito», vender el producto ni una reunión pasiva de espectadores; sí es mostrar el incremento real, dialogar y recibir feedback, revisar el progreso y tomar decisiones juntos sobre el futuro. **Idea clave:** revisamos el producto para decidir qué conviene hacer después (inspeccionamos el incremento → aprendemos con el feedback → adaptamos el Product Backlog → decidimos el siguiente paso). *El valor de Scrum está en inspeccionar con frecuencia y adaptar rápidamente.*

### Diapositiva 76

#### SCRUM

**Contenido visual de la lámina:** Infografía **Sprint Retrospective — ahora inspeccionamos al equipo.** **Comparación directa:** la Sprint Review pregunta *¿cómo podemos mejorar el producto?* (inspeccionamos el incremento con los stakeholders y adaptamos el Product Backlog); la Sprint Retrospective pregunta *¿cómo podemos mejorar nuestra forma de trabajar?* (inspeccionamos nuestro trabajo como equipo y definimos mejoras en nuestra forma de trabajar). **Durante la retrospectiva, el Scrum Team analiza:** ¿qué funcionó bien?, ¿qué problemas encontramos?, ¿cómo colaboramos?, ¿qué ocurrió con nuestras herramientas y procesos?, ¿qué deberíamos cambiar? **Ejemplo:** descubrimiento *«Durante este Sprint perdimos mucho tiempo porque revisábamos el código solamente al final»* → acción de mejora *«En el próximo Sprint realizaremos revisiones de código durante todo el desarrollo»*. Posibles mejoras: comunicación, Definition of Done, procesos, herramientas y aprendizaje. **El ciclo de mejora:** trabajamos (realizamos el trabajo del Sprint) → observamos (inspeccionamos cómo fue nuestro trabajo) → aprendemos (identificamos aprendizajes y oportunidades) → mejoramos (aplicamos mejoras en el próximo Sprint). **Mensaje clave:** la Sprint Review busca mejorar el **producto** y la Sprint Retrospective busca mejorar la **forma de trabajar**. *Un equipo que reflexiona, aprende y se adapta… entrega mejores productos de manera sostenible.*

### Diapositiva 77

#### Comparación: Review vs Retrospective

“Tenemos una aplicación excelente, pero un equipo completamente desorganizado. ¿Review o Retrospective?”

Retrospective!

“El equipo trabaja extraordinariamente bien, pero los usuarios dicen que la funcionalidad desarrollada no les sirve. ¿Review o Retrospective?”

Review.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 78

#### SCRUM

**Contenido visual de la lámina:** Infografía **Scrum en una sola imagen**: flujo vertical **Product Goal → Product Backlog → Sprint Planning** (¿por qué?, ¿qué?, ¿cómo?) → **Sprint Backlog** (Sprint Goal + trabajo + plan) → **Sprint** (duración de 1 a 4 semanas, con la **Daily Scrum** de 15 minutos y el trabajo de los Developers) → **Incremento** («done» y con valor) → **Sprint Review** (inspeccionamos el incremento; los stakeholders dan feedback) → **Feedback** → **Product Backlog actualizado** → **Sprint Retrospective** (¿qué mejorar en nuestra forma de trabajar?) → **Mejoramos la forma de trabajar** (acciones de mejora) → **nuevo Sprint** (¡ciclo continuo!). Nuevas ideas, cambios, prioridades y aprendizajes vuelven al Product Backlog. **Roles:** Product Owner (representa al negocio y gestiona el Product Backlog), Developers (construyen el producto) y Scrum Master (facilita Scrum y elimina obstáculos). **Siempre presentes:** transparencia (información visible para todos), inspección (revisamos lo que hacemos y el resultado) y adaptación (ajustamos el plan y nuestra forma de trabajar). Mensaje: *Scrum convierte el desarrollo en un ciclo continuo de entrega, aprendizaje y adaptación.*

### Diapositiva 79

#### SCRUM

**Contenido visual de la lámina:** Infografía **Un Sprint paso a paso — caso: nueva app universitaria** (la universidad quiere desarrollar una aplicación móvil para sus estudiantes): (1) **Product Backlog** — entre las necesidades aparecen consultar horario, ver notas, asistencia, certificados, inscribir asignaturas y notificaciones. (2) **Sprint Planning** — el equipo establece el Sprint Goal *«Permitir al estudiante consultar su información académica principal desde el celular»* y selecciona horario + notas + asistencia. (3) **Sprint** — durante las semanas siguientes los Developers construyen, prueban, realizan la Daily Scrum e inspeccionan continuamente el progreso hacia el Sprint Goal. (4) **Incremento** — la aplicación permite consultar horario, notas y asistencia, y todo cumple la Definition of Done. (5) **Sprint Review** — los estudiantes prueban el incremento y solicitan *«Queremos recibir una notificación cuando se publique una nueva calificación»*. (6) **Adaptación** — la necesidad se incorpora al Product Backlog y se ordena según su valor (notificaciones aparece como **nuevo**, entre mayor y menor valor). (7) **Retrospective** — el equipo identifica cómo mejorar su forma de trabajo (qué funcionó bien, qué problemas tuvimos, cómo colaboramos, qué podemos mejorar). → **Nuevo Sprint.** **Reflexión:** no intentamos construir toda la aplicación de una vez; entregamos valor, aprendemos y continuamos.

### Diapositiva 80

#### SCRUM

**Contenido visual de la lámina:** Infografía **Scrum no es… rompamos algunos mitos**: (1) **Scrum = hacer reuniones todos los días.** No: la Daily Scrum es solo uno de sus eventos (Sprint Planning, Daily Scrum, Sprint Review y Sprint Retrospective). (2) **Scrum significa no planificar.** No: existe planificación continua en distintos niveles — visión (Product Goal), planificación del producto (Product Backlog) y planificación del Sprint (Sprint Backlog). (3) **Scrum significa no documentar.** No: se documenta aquello que aporta valor y resulta necesario (decisiones clave, requerimientos, diseño relevante, documentación técnica útil y guías de uso). (4) **El Scrum Master es el jefe del equipo.** No: el Scrum Team es autogestionado. (5) **El Product Owner asigna tareas.** No: los Developers deciden internamente cómo realizar el trabajo (el Product Owner define qué es lo más valioso; los Developers deciden cómo hacerlo). (6) **Todo debe terminarse al final del proyecto.** No: Scrum busca generar incrementos utilizables durante el desarrollo (Sprint 1, Sprint 2, Sprint 3…). **Mensaje clave:** Scrum no elimina la disciplina; cambia la manera en que planificamos, colaboramos, inspeccionamos y nos adaptamos (planificamos → colaboramos → inspeccionamos → nos adaptamos → ¡mejoramos siempre!).

### Diapositiva 81

#### ¿CUÁL UTILIZARÍAS?

NO EXISTE UNA ÚNICA RESPUESTA

Cascada RAD RUP/AUP Scrum

Requerimientos estables

Cambios frecuentes

Entregas frecuentes

Formalidad / trazabilidad

Participación frecuente del cliente/stakeholders

Gestión de incertidumbre

Desarrollo iterativo Baja Alta Alta Alta

“Las estrellas son orientativas, no una regla universal. La elección depende del contexto concreto del proyecto

y de cómo se implemente cada enfoque.”

**Contenido visual de la lámina:**

Tabla **No existe una única respuesta** (más estrellas = más adecuado):

| Criterio | Cascada | RAD | RUP/AUP | Scrum |
|---|---|---|---|---|
| Requerimientos estables | ★★★ | ★★ | ★★★ | ★★ |
| Cambios frecuentes | ★ | ★★★ | ★★ | ★★★ |
| Entregas frecuentes | ★ | ★★★ | ★★ | ★★★ |
| Formalidad / trazabilidad | ★★★ | ★ | ★★★ | ★★ |
| Participación frecuente del cliente / stakeholders | ★ | ★★★ | ★★ | ★★★ |
| Gestión de incertidumbre | ★ | ★★ | ★★ | ★★★ |
| Desarrollo iterativo | Baja | Alta | Alta | Alta |

### Diapositiva 82

#### ¿CUÁL UTILIZARÍAS?

“Un buen Ingeniero de Software no elige una

metodología porque sea popular; la elige porque responde adecuadamente al problema

que debe resolver.”

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 83

#### SCRUM

**Contenido visual de la lámina:** Infografía **Unidad 1 completada — el camino que recorrimos**: lista con ✓ — necesidad, ingeniería de requerimientos, modelamiento, diseño, implementación, QA y pruebas, documentación, despliegue, mantenimiento y evolución, ciclo de vida, metodologías y enfoques → **software que entrega valor**. Cita central: *«Programar construye código. La Ingeniería de Software construye soluciones.»* Texto: *el desafío de un ingeniero no es solamente lograr que el software funcione, sino construirlo de manera que pueda entregar valor, mantener su calidad y evolucionar frente al cambio.*

### Diapositiva 84

#### Próxima Clase

PRÓXIMA CLASE COMENZAMOS LA UNIDAD 2 ¿QUÉ VEREMOS?

Fundamentos de Gestión de Proyectos Alcance y objetivos del proyecto Planificación y organización del trabajo Tiempo, actividades e hitos Roles y responsabilidades del equipo Introducción a la Gestión de Riesgos

Pregunta para la próxima clase ¿Por qué un proyecto puede tener un buen software y aun así fracasar?

**Contenido visual de la lámina:** Lista de temas de la Unidad 2 con íconos (cohete, diana, escuadra, piezas, cronómetro, personas, advertencia).

### Diapositiva 85

UNIVERSIDAD SAN SEBASTIAN

YOCACIÓN POR LA 6XC6L6ł•fClA

Fin Semana 4

N U1 ST RA /Ví l S10 N ES E D U CAR EN LA

RAZÓ N , LA VE RDA D Y LA V I RTU D.

---

**Contenido visual de la lámina:** Lámina de cierre: *Fin Semana 4*, con la franja *Nuestra misión es educar en la razón, la verdad y la virtud.*

<a id="semana-5"></a>

## Ingeniería de Software — Semana 5

Fuente del ZIP: `Ingenieria_de_Software_Semana_05.md`.

### Diapositiva 1

CLASE 1

SEMANA 5

Introducción a la Ingeniería Informática

Taller de Ingeniería de Software

Alfredo Pereira

Prof. Dr. Rodrigo Correa R.

**Contenido visual de la lámina:** Portada con fotografía de un edificio patrimonial de la universidad y logo USS. Texto: *Semana 5 · Taller de Ingeniería de Software · Prof. Dr. Rodrigo Correa R.*

### Diapositiva 2

#### OBJETIVO DE LA CLASE

- Comprender el papel de la estimación dentro de

la administración de un proyecto de software. • Identificar las características que hacen

especialmente difícil estimar proyectos de software. • Diferenciar los conceptos de tamaño, esfuerzo,

duración, recursos y costo. • Reconocer los principales recursos que intervienen

en el desarrollo de software. • Utilizar métricas básicas para apoyar decisiones

iniciales de estimación.

**Contenido visual de la lámina:** Lista de cinco objetivos. Imagen ilustrativa: escalera con íconos que sube hacia una diana.

### Diapositiva 3

#### OBJETIVO DE LA CLASE

**Contenido visual de la lámina:** Infografía: **Antes de desarrollar un proyecto necesitamos responder una pregunta incómoda: ¿cuánto necesitaremos para construirlo?** Ilustración de un equipo frente a una pizarra *Plan del proyecto* (requerimientos, diseño, desarrollo, pruebas y despliegue, con una carta Gantt, tiempo, personas, presupuesto, alcance y el objetivo de entregar valor, cumplir plazos, optimizar recursos y satisfacer al usuario). Nota: *Buenos proyectos comienzan con buenas preguntas.* Franja inferior con la cadena **Tamaño → Esfuerzo → Duración → Recursos → Costo**.

### Diapositiva 4

#### ¿Qué aprenderemos hoy?

**Contenido visual de la lámina:** Infografía **¿Qué aprenderemos hoy? — un recorrido para entender cómo estimar un proyecto de software** (de las ideas a la realidad), como un sendero de montaña con seis paradas: (1) **Del software al proyecto** — ¿qué significa administrar un proyecto de software? (2) **El problema de estimar** — ¿por qué resulta tan difícil anticipar cuánto necesitaremos? (3) **¿Qué estamos estimando?** — tamaño, esfuerzo, duración, recursos y costo. (4) **Recursos del proyecto** — personas, tecnología, infraestructura y otros recursos. (5) **Medir para estimar** — métricas de proceso y de producto. (6) **Primeras estrategias de estimación** — descomposición, supuestos e incertidumbre → proyectos con valor. Mensaje: *Hoy no buscamos adivinar cuánto cuesta un software. Aprenderemos qué información necesitamos para construir una estimación defendible.*

### Diapositiva 5

#### ¿Qué aprenderemos hoy?

**Contenido visual de la lámina:** Infografía **De la Unidad 1 a la Unidad 2 — mismo propósito, una mirada más completa.** **Unidad 1, cómo desarrollarlo:** necesidad → requerimientos → modelamiento → diseño → implementación → QA → despliegue → evolución; además aprendimos a seleccionar y organizar el trabajo mediante distintos modelos, metodologías y enfoques. **Ya sabemos cómo desarrollarlo…** (*«Perfecto. Entiendo cómo lo van a desarrollar…»*), pero el cliente pregunta **¿cuánto va a costar?** y aparecen otras preguntas: ¿cuánto trabajo requiere?, ¿cuántas personas necesitamos?, ¿cuánto demoraremos?, ¿qué otros recursos necesitamos? Se pasa de **ingeniería del software** (construimos la solución) a **gestión del proyecto** (planificamos para hacerlo realidad). Mensaje: *Una solución técnicamente correcta también debe ser viable en términos de esfuerzo, tiempo y recursos.*

### Diapositiva 6

#### EL PRIMER DESAFÍO

**Contenido visual de la lámina:** Infografía **Ahora ustedes — 5 minutos: ¿cuánto costaría desarrollar esta app?** Una empresa solicita desarrollar una aplicación para reservar horas médicas (ilustración de las pantallas *Salud en tus manos*: reservar hora, mis reservas, buscar médicos y especialidades). Debe permitir: registrar pacientes, consultar médicos y especialidades, consultar horas disponibles, reservar una hora, cancelar una reserva y enviar recordatorios. **El cliente pregunta: «¿Cuánto costará?»** En parejas o grupos pequeños respondan: (1) ¿podrían entregar un valor ahora mismo?; (2) ¿qué información adicional necesitarían?; (3) escriban al menos cinco preguntas que harían al cliente antes de entregar una estimación. **Regla:** no necesitan calcular nada; *«solo quiero saber qué necesitarían conocer antes de atreverse a entregar un precio»*.

### Diapositiva 7

#### EL PRIMER DESAFÍO

**Contenido visual de la lámina:** Infografía **Revisemos: ¿qué nos faltaba saber?** (mejores preguntas hoy, mejores proyectos), junto a la app *SaludContigo*: **Funcionalidad** — ¿solo pacientes o también médicos y administradores?, ¿habrá pagos?, ¿videoconsulta?, ¿reprogramaciones? **Tecnología** — ¿web, móvil o ambas?, ¿Android e iOS?, ¿se integrará con sistemas existentes? **Calidad y seguridad** — ¿qué disponibilidad necesita?, ¿qué requisitos de seguridad existen?, ¿qué volumen de usuarios tendrá? **Recursos** — ¿qué perfiles profesionales necesitaremos?, ¿disponemos del equipo o debemos contratar?, ¿necesitamos servicios o infraestructura adicional? **Plazos** — ¿cuándo debe estar disponible?, ¿existen entregas parciales? **Contexto** — ¿los requerimientos están definidos?, ¿cuánto podrían cambiar? Más información → mejores estimaciones. Mensaje: *Las buenas estimaciones comienzan con buenas preguntas.*

### Diapositiva 8

**Contenido visual de la lámina:** Infografía **¿Cuánto cuesta? — depende de**: **¿qué vamos a construir?** (funcionalidades, alcance, complejidad, requerimientos), **¿con qué recursos?** (perfiles profesionales, equipo disponible, herramientas, infraestructura y servicios), **¿bajo qué condiciones?** (calidad y seguridad, normativas, integraciones, riesgos e incertidumbre) y **¿en cuánto tiempo?** (fecha objetivo, entregas parciales, urgencia, tiempo de aprobación). **Primer aprendizaje de la Unidad 2:** *estimar no es adivinar un número; es construir una predicción utilizando información, supuestos y evidencia disponible.* Pregunta: *si dos empresas entregan valores distintos para desarrollar exactamente la misma aplicación, ¿significa necesariamente que una de ellas está equivocada?* **No:** puede deberse a distintos enfoques, supuestos, equipos, niveles de calidad, riesgos o condiciones.

### Diapositiva 9

**Contenido visual de la lámina:** Infografía **¿Qué es un proyecto?** Un proyecto es un esfuerzo **temporal** realizado para crear un producto, servicio o resultado **único**. Tres características fundamentales: **temporal** (tiene un inicio y un término), **objetivo** (busca alcanzar un resultado específico) y **único** (aunque existan proyectos similares, cada proyecto posee características y condiciones particulares). **Ejemplo:** desarrollar una nueva aplicación bancaria (tiene un objetivo definido, un período de ejecución y produce una solución particular) es un **proyecto**; **pero** mantener diariamente funcionando la aplicación corresponde principalmente a una **operación continua**. **Pregunta rápida:** ¿implementar un nuevo sistema ERP en una empresa es un proyecto o una operación? **Proyecto.** ¿Administrar diariamente ese ERP una vez implementado? **Operación.** **Mensaje clave:** *un proyecto crea o transforma algo; una operación mantiene funcionando algo de manera continua.*

### Diapositiva 10

**Contenido visual de la lámina:** Infografía **Administrar un proyecto de software — no basta con programar.** Supongamos que tenemos un excelente equipo técnico, pero: el proyecto demora el doble de lo previsto, el presupuesto se agota, faltan personas especializadas, los requerimientos cambian, el cliente espera funcionalidades diferentes y aparecen problemas de calidad. *¿Podemos decir que el proyecto fue bien administrado?* **No necesariamente.** Al centro, **proyecto de software** (ideas + personas + procesos = resultados), rodeado por sus dimensiones: **alcance** (¿qué se va a entregar?), **tiempo** (¿cuándo se entrega?), **costo** (¿cuánto costará?), **recursos** (¿con qué personas y recursos?), **calidad** (¿cumple con lo esperado?), **riesgos** (¿qué puede salir mal?) y **comunicación** (¿cómo nos coordinamos?). **Idea fundamental:** administrar un proyecto significa tomar decisiones para transformar objetivos y restricciones en un resultado viable. **Un buen proyecto equilibra:** lo que se necesita, lo que se puede hacer, con los recursos disponibles, en el tiempo acordado, con la calidad esperada, gestionando los riesgos y con una comunicación efectiva.

### Diapositiva 11

**Contenido visual de la lámina:** Infografía **¿Qué hace diferente a un proyecto de software?** El software tiene una particularidad: **un edificio** puede observarse mientras se construye (vemos el avance físico); **una carretera** puede medirse físicamente (su extensión); **un automóvil** tiene piezas visibles (sus componentes). **¿Y el software?** Gran parte del producto que estamos construyendo es **intangible**: no podemos observar directamente cuánto falta, cuánto esfuerzo queda, cuánta complejidad existe ni cuántos problemas todavía no conocemos. **Además:** los requerimientos pueden cambiar; el trabajo depende fuertemente del conocimiento; existen dependencias e integraciones; pueden aparecer defectos inesperados; la productividad entre equipos puede variar; la tecnología puede ser nueva para el equipo. **Mensaje:** que el software no sea físicamente visible no significa que su construcción sea fácil de medir. **Pregunta:** *¿qué creen que resulta más difícil estimar: construir por segunda vez una casa conocida o desarrollar por primera vez un sistema cuyo alcance todavía está cambiando? ¿Por qué?*

### Diapositiva 12

**Contenido visual de la lámina:** Infografía **¿Por qué fallan las estimaciones? — estimar software es estimar bajo incertidumbre.** Al centro, un monitor *Proyecto: $50.000.000* (idea inicial, estimación), rodeado por fuentes de cambio: **cliente** (*«Necesitamos cambiar el proceso…»*), **requerimientos** (*«Olvidamos mencionar una funcionalidad…»*), **tecnología** (*«La integración resultó más compleja…»*), **equipo** (*«El especialista que necesitábamos no está disponible…»*), **calidad** (*«Las pruebas encontraron problemas importantes…»*), **plazo** (*«Necesitamos entregarlo dos meses antes…»*) y **dependencias** (*«La API externa no funciona como esperábamos…»*). El resultado: *Proyecto: ~~$50.000.000~~ ¿?* (más requisitos, más tiempo, más costo, más incertidumbre). **Conclusión:** *una estimación se construye con la información disponible en un momento determinado. Si cambian sus supuestos, la estimación también puede cambiar.*

### Diapositiva 13

**Contenido visual de la lámina:** Infografía **Mini ejercicio — Ahora ustedes, 5 minutos: ¿cuál proyecto es más fácil de estimar?** **Proyecto A:** una empresa solicita desarrollar nuevamente un sistema similar a otros cinco sistemas que el equipo ya ha construido; los requerimientos están definidos y se utilizará tecnología conocida (experiencia previa, requerimientos claros, tecnología conocida). **Proyecto B:** una universidad solicita una aplicación móvil; existe una definición general, pero varias funcionalidades serán definidas durante el proyecto junto con estudiantes (definición general, requerimientos evolutivos, trabajo con estudiantes). **Proyecto C:** una startup quiere utilizar una tecnología nueva para el equipo para desarrollar un producto que todavía está validando en el mercado; los requerimientos cambiarán según la respuesta de los usuarios (tecnología nueva, requerimientos cambiantes, validación en el mercado). **Respondan:** (1) ordenen los proyectos desde el más fácil hasta el más difícil de estimar; (2) identifiquen al menos tres factores que justifican su decisión; (3) ¿en cuál confiarían menos en una estimación realizada hoy? ¿Por qué?

### Diapositiva 14

**Contenido visual de la lámina:**

Infografía **Discusión — una respuesta razonable sería: A → B → C.**

| Proyecto | Experiencia previa | Requerimientos | Tecnología | Incertidumbre |
|---|---|---|---|---|
| A | Alta | Estables | Conocida | Baja |
| B | Media | Parciales | Relativamente conocida | Media |
| C | Baja | Cambiantes | Nueva | Alta |

**Pero aquí viene lo importante:** *no estamos diciendo que A sea necesariamente más fácil de desarrollar. Estamos diciendo que disponemos de mejores condiciones para estimarlo.* Nota: *no se trata solo de desarrollar, sino de estimar con información disponible.*

### Diapositiva 15

**Contenido visual de la lámina:** Infografía **¿Qué estamos estimando? — «¿Cuánto costará?» no es la primera pregunta.** Podríamos sentir la tentación de responder inmediatamente con dinero, pero antes necesitamos responder otras preguntas. **La cadena de estimación:** **tamaño** (¿qué tan grande es lo que debemos construir?) → **esfuerzo** (¿cuánto trabajo será necesario?) → **duración** (¿cuánto tiempo calendario necesitaremos?) → **recursos** (¿qué personas, herramientas e infraestructura necesitaremos?) → **costo** (¿cuánto costará disponer de esos recursos?). **Ejemplo sencillo:** supongamos que debemos desarrollar una plataforma de reservas; antes de decir *«Costará $30 millones»* deberíamos poder explicar qué debemos construir, cuánto trabajo estimamos, durante cuánto tiempo, con qué equipo y qué otros recursos necesitaremos. **Mensaje clave:** *el costo es el resultado de varias estimaciones anteriores.*

### Diapositiva 16

**Contenido visual de la lámina:** Infografía **Tamaño del software — ¿cómo medimos algo que no podemos tocar?** En productos físicos podemos utilizar metros, kilogramos, litros y unidades. **Pero… ¿cómo medimos el tamaño de un software?** Podemos aproximarlo desde distintas perspectivas: **código** — cantidad estimada de líneas de código (**LOC, Lines of Code**; ejemplo de una función `calcular_total` en cinco líneas); **funcionalidad** — cantidad y complejidad de las funciones que debe proporcionar al usuario (registrar usuario, buscar productos, generar reportes, procesar pagos; **FP, Function Points**); **componentes** — pantallas, módulos, interfaces, servicios, clases u otros elementos; **trabajo** — historias de usuario, funcionalidades del backlog (por ejemplo *«Como usuario quiero registrarme en la plataforma»*, *«Como usuario quiero buscar productos»*, *«Como administrador quiero generar reportes de ventas»*). **Importante:** tamaño no significa cantidad de megabytes que ocupa la aplicación (¡error común!; esa es una medida de almacenamiento, no de tamaño funcional). **Idea clave:** *tamaño = magnitud del software que debemos construir.*

### Diapositiva 17

**Contenido visual de la lámina:** Infografía **Esfuerzo ≠ duración — no son lo mismo.** **Esfuerzo:** cantidad total de trabajo necesario para desarrollar el proyecto; puede expresarse como horas-persona, días-persona o meses-persona. **Duración:** tiempo calendario que transcurre desde el inicio hasta el término del proyecto; puede expresarse en días, semanas o meses (calendario de marzo a mayo, inicio 1 de marzo y término 31 de mayo). **Ejemplo:** un proyecto requiere **1.000 horas-persona** (eso representa esfuerzo); si comienza el 1 de marzo y termina el 31 de mayo dura **3 meses** (eso representa duración). Mismo proyecto, dos formas de medirlo; por lo tanto, **1.000 horas-persona ≠ 3 meses**: miden cosas diferentes. **Mensaje clave:** *el esfuerzo mide trabajo; la duración mide calendario.*

### Diapositiva 18

**Contenido visual de la lámina:** Infografía **Mini ejercicio — Ahora ustedes, 5 minutos: ¿10 personas = 10 veces más rápido?** **Escenario:** una empresa estima que un proyecto requiere **1.000 horas-persona**. El gerente propone: *«Perfecto. Si una persona demoraría 1.000 horas, contratemos 10 personas y lo terminaremos en 100 horas.»* **¿Está en lo correcto?** Sí / No / Depende. **En parejas discutan:** (1) ¿es matemáticamente correcto?; (2) ¿es necesariamente correcto en un proyecto de software?; (3) identifiquen al menos tres razones por las cuales agregar personas podría **no** reducir proporcionalmente la duración. Nota: *no siempre más personas significa terminar antes.*

### Diapositiva 19

**Contenido visual de la lámina:** Infografía **Revisemos — más personas no significa proporcionalmente menos tiempo.** La operación matemática **1.000 / 10 = 100** es correcta, **pero el supuesto puede ser incorrecto**: en un proyecto de software, agregar personas no siempre reduce proporcionalmente la duración. **¿Por qué?** (1) **Dependencias:** algunas tareas no pueden comenzar hasta que otras terminen (A → B → C; no todo se puede hacer en paralelo). (2) **Comunicación:** más personas requieren mayor coordinación (aumentan las reuniones, aclaraciones y posibles malentendidos). (3) **Aprendizaje:** una nueva persona necesita tiempo para comprender el proyecto (código, arquitectura, estándares, dominio del negocio). (4) **Divisibilidad:** no todas las tareas pueden repartirse entre muchas personas (existen tareas inherentemente secuenciales o difíciles de dividir). (5) **Integración:** el trabajo realizado separadamente debe integrarse (puede generar conflictos y trabajo adicional). (6) **Productividad:** las personas no producen exactamente al mismo ritmo (diferencias en experiencia, habilidades y ritmo de trabajo). Cita: *«Construir software no es como construir 10 paredes iguales a la vez.»* **Mensaje clave:** agregar personas puede reducir la duración, pero no de forma proporcional, debido a múltiples factores que afectan un proyecto de software.

### Diapositiva 20

**Contenido visual de la lámina:** Infografía **Pensemos en algo todavía más evidente: ¿más personas = menos tiempo?** **Caso 1, una funcionalidad:** si desarrollar una funcionalidad requiere 1 desarrollador × 10 días, ¿podemos contratar 10 desarrolladores × 1 día? **No necesariamente:** aunque tengamos más personas, la funcionalidad no se termina en un día en la mayoría de los casos. **Llevémoslo al extremo:** ¿y si contratamos 1.000 desarrolladores? ¿Terminaríamos el proyecto en una hora? **Evidentemente no.** **¿Por qué?** Dependencias (muchas tareas no pueden comenzar hasta que otras terminen), comunicación (más personas requieren mayor coordinación, lo que puede generar retrasos), aprendizaje (una nueva persona necesita tiempo para comprender el proyecto y el contexto), integración (el trabajo realizado separadamente debe integrarse, lo que puede generar conflictos y trabajo adicional) y productividad (las personas no producen exactamente al mismo ritmo). **Dos ideas fundamentales:** esfuerzo ≠ duración; más personas ≠ menos duración proporcionalmente. **Mensaje clave:** *el desarrollo de software contiene dependencias, comunicación, aprendizaje e integración; por eso el esfuerzo no puede convertirse mecánicamente en duración.*

### Diapositiva 21

**Contenido visual de la lámina:** Infografía **¿Qué recursos necesita un proyecto? — el software no se construye solo con programadores.** *Si conocemos las horas de desarrollo, ¿ya conocemos el costo del proyecto?* **No:** un proyecto puede requerir distintos tipos de recursos. Al centro, **proyecto de software** (personas + herramientas + infraestructura + otros = valor). **Recursos humanos** (las personas hacen posible el proyecto): analistas, arquitectos, diseñadores UX/UI, desarrolladores, QA/testing, DevOps, especialistas en seguridad, jefe de proyecto / Product Owner y soporte especializado. **Software y servicios** (herramientas que potencian el desarrollo): licencias, herramientas de desarrollo, herramientas de gestión, servicios cloud, bases de datos, APIs de terceros y servicios de seguridad (logos de VS Code, PyCharm, GitHub, AWS, Google Cloud, Azure, PostgreSQL, Docker, Trello). **Infraestructura** (el entorno donde se construye y ejecuta): equipamiento, servidores, redes, ambientes de desarrollo, ambientes de pruebas y dispositivos para testing (ambientes DEV, QA y PROD). **Otros recursos** (elementos que también generan valor): capacitación, consultoría, viajes, certificaciones, servicios externos y contingencias. **Mensaje clave:** *estimar costos significa identificar todos los recursos necesarios para desarrollar y entregar el software, no solamente escribir código.*

### Diapositiva 22

**Contenido visual de la lámina:** Infografía **El costo humano — las personas son un recurso fundamental.** En muchos proyectos de software, una parte importante del costo está asociada al esfuerzo humano. **Persona ≠ costo únicamente de sueldo:** para estimar el costo de una persona debemos considerar, según el contexto, remuneración (sueldo o salario), costos asociados al empleador (cotizaciones, impuestos, seguros), beneficios (salud, bonos, permisos), equipamiento (computador, accesorios, mobiliario), licencias y herramientas (IDE, software, servicios), capacitación (cursos, certificaciones) y otros costos asociados (administrativos, espacio físico). **Ejemplo 1:** un desarrollador con costo total para el proyecto de **$2.500.000 / mes**, participación de 4 meses (100 % de dedicación): $2.500.000 × 4 = **$10.000.000**. **Ejemplo 2:** la misma persona, pero con 50 % de dedicación durante 4 meses: $2.500.000 × 4 × 0,5 = **$5.000.000**. Nota: *la dedicación impacta directamente en el costo.* **Concepto importante — dedicación:** no todas las personas necesariamente trabajan el 100 % de su jornada en un único proyecto (100 % tiempo completo, 75 % tres cuartos de jornada, 50 % media jornada, 25 % un cuarto de jornada). **Mensaje clave:** para estimar recursos humanos necesitamos conocer quién participa, durante cuánto tiempo y con qué nivel de dedicación.

### Diapositiva 23

**Contenido visual de la lámina:**

Infografía **Ejemplo — construyamos el costo del equipo: un proyecto de 4 meses.**

| Rol | Costo mensual | Dedicación | Meses | Cálculo | Costo |
|---|---:|---:|---:|---|---:|
| Jefe de proyecto | $3.000.000 | 50 % | 4 | $3.000.000 × 4 × 0,5 | $6.000.000 |
| Analista | $2.500.000 | 50 % | 2 | $2.500.000 × 2 × 0,5 | $2.500.000 |
| Desarrollador 1 | $2.500.000 | 100 % | 4 | $2.500.000 × 4 | $10.000.000 |
| Desarrollador 2 | $2.500.000 | 100 % | 4 | $2.500.000 × 4 | $10.000.000 |
| QA | $2.000.000 | 50 % | 2 | $2.000.000 × 2 × 0,5 | $2.000.000 |

**Fórmula simplificada:** costo = costo mensual × meses × dedicación. Recuerda: quién participa, durante cuánto tiempo y con qué nivel de dedicación. **Resultado:** costo humano estimado **$30.500.000**. *¿Entonces el proyecto cuesta $30.500.000?* **No. Todavía no:** este valor considera solo el costo del equipo humano; aún debemos considerar otros recursos, como software y servicios, infraestructura y otros costos asociados.

### Diapositiva 24

**Contenido visual de la lámina:** Infografía **Mini ejercicio — Ahora ustedes, 6 minutos: el presupuesto incompleto. ¿Realmente ya sabemos cuánto costará?** (1) **Contexto:** una empresa debe desarrollar una plataforma de comercio electrónico durante 6 meses (*«Suena bien… ¿pero es todo lo que se necesita?»*). (2) **El presupuesto presentado:** 3 desarrolladores, $36.000.000; total proyecto $36.000.000 (*«Ya sabemos cuánto costará desarrollar el sistema»*). (3) **El sistema deberá:** vender productos online, procesar pagos, operar en infraestructura cloud, enviar correos y notificaciones, proteger información de clientes, ser probado antes de producción y almacenar información del negocio. (4) **Desafío:** ¿qué recursos probablemente faltan en este presupuesto?; clasifíquenlos como humanos, software/servicios, infraestructura u otros; identifiquen al menos seis elementos omitidos; ¿considerarían confiable el presupuesto de $36 millones? ¿Por qué? **Regla:** no calculen todavía nuevos valores; el desafío es descubrir qué se olvidó considerar.

### Diapositiva 25

**Contenido visual de la lámina:** Infografía **Revisemos el presupuesto: ¿qué podría haber faltado?** Un proyecto de software requiere muchos más recursos. **Recursos humanos** (más roles, más competencias, mejor resultado): analista / requerimientos, UX/UI, QA / testing, gestión del proyecto, DevOps y seguridad. **Software y servicios:** licencias, API / plataforma de pagos, servicio de correos, servicios de monitoreo y herramientas especializadas. **Infraestructura:** cloud, base de datos, almacenamiento, backups y ambientes de pruebas. **Otros recursos:** capacitación, consultoría especializada, servicios externos y contingencias. **Comparamos:** presupuesto original **$36.000.000** (solo 3 desarrolladores) vs. costo real del proyecto **¿?** (todavía no podemos determinarlo); $36 millones no representa necesariamente el costo total, representa solamente los recursos que fueron considerados. **Una idea muy importante:** *lo que no identificamos no lo estimamos; lo que no estimamos puede aparecer después como sobrecosto.*

### Diapositiva 26

**Contenido visual de la lámina:** Infografía **¿Podemos estimar sin medir? — la experiencia del pasado puede ayudarnos a predecir** (los datos históricos son una fuente valiosa para estimar mejor). (1) **El escenario:** una empresa ha desarrollado 50 proyectos de software y de cada uno conoce el tamaño, el esfuerzo utilizado, la duración, la cantidad de personas, los defectos encontrados, el costo final y la productividad obtenida (planilla de *histórico de proyectos*). (2) **Un nuevo proyecto:** ¿qué sería más razonable? *Opción A:* «partamos desde cero y tratemos de adivinar cuánto costará» (**no recomendado**); *opción B:* «analicemos qué ocurrió en proyectos anteriores similares» (**la mejor opción**). (3) **Métricas:** una métrica permite cuantificar algún atributo relevante del producto, del proceso o del proyecto (*«lo que no se mide, no se puede mejorar»*); ejemplos: horas utilizadas, tiempo de desarrollo, tamaño del software, defectos detectados, productividad y costo. (4) **Análisis y estimación:** con los datos históricos podemos identificar proyectos similares, calcular promedios y rangos, analizar productividad por tipo de proyecto, detectar factores que influyen en el esfuerzo y costo, construir modelos de estimación y reducir la incertidumbre (gráfico de dispersión *esfuerzo vs. tamaño en líneas de código*). **Mensaje clave:** *medir el pasado no garantiza predecir el futuro, pero nos entrega evidencia para estimar mejor.*

### Diapositiva 27

**Contenido visual de la lámina:** Infografía **¿Qué podemos medir? — no todas las métricas miden lo mismo.** **Métricas de producto** (describen características del software producido): tamaño del software (líneas de código, puntos de función, etc.), número de defectos (por versión, por módulo, etc.), complejidad (ciclomática, etc.), rendimiento (tiempo de respuesta, uso de recursos, etc.) y características de calidad (seguridad, usabilidad, mantenibilidad, etc.). **Métricas de proceso** (información sobre cómo se está realizando el desarrollo): tiempo utilizado en determinadas actividades (análisis, diseño, desarrollo, pruebas, etc.), defectos detectados durante determinadas etapas, retrabajo (esfuerzo adicional por correcciones, etc.), eficacia de actividades de revisión o prueba (porcentaje de defectos encontrados, etc.) y comportamiento histórico del proceso (productividad, estabilidad, cumplimiento, etc.). **Para esta unidad nos interesan porque…** producto (¿qué estamos construyendo?) → proceso (¿cómo lo estamos construyendo?) → estimación (¿qué evidencia podemos utilizar para anticipar esfuerzo, tiempo y costo?). **Mensaje clave:** *las métricas transforman observaciones del proyecto en información que puede apoyar decisiones.*

### Diapositiva 28

**Contenido visual de la lámina:** Infografía **Un número no siempre dice lo que parece: ¿cuál software tiene mayor calidad?** (para interpretar una métrica necesitamos contexto). (1) **Dos proyectos:** proyecto A con 10 defectos y proyecto B con 30 defectos. (2) **Primera pregunta:** ¿cuál tiene mayor calidad? Probablemente muchos responderán: proyecto A. (3) **Ahora con más información:** A tiene 10 defectos en 1.000 LOC y B tiene 30 defectos en 10.000 LOC. ¿Siguen pensando lo mismo? (4) **Calculemos la densidad de defectos:** densidad = n.º de defectos / tamaño del software (LOC); A: 10 / 1.000 = 0,010 defectos/LOC (**10 defectos/KLOC**); B: 30 / 10.000 = 0,003 defectos/LOC (**3 defectos/KLOC**). (5) **¿Cambió nuestra interpretación? Sí:** con esta métrica, el proyecto B tiene menos defectos por línea de código. **Pero cuidado:** esto tampoco demuestra por sí solo que B sea de mayor calidad; todavía podríamos necesitar saber la gravedad de los defectos, cómo fueron detectados, qué partes se midieron, el período considerado y el tipo de software. (6) **Idea clave:** *una métrica necesita contexto para transformarse en información útil. Las métricas no son buenas ni malas por sí solas; lo importante es cómo se interpretan y en qué contexto.*

### Diapositiva 29

**Contenido visual de la lámina:** Infografía **Mini ejercicio — Ahora ustedes, 6 minutos: ¿quién fue más productivo?** (los mismos datos pueden contarnos distintas historias). (1) **Contexto:** dos equipos desarrollaron sistemas similares. (2) **Datos de los equipos:** equipo A, software desarrollado 12.000 LOC con un esfuerzo de 8 meses-persona; equipo B, 15.000 LOC con 12 meses-persona; ambos equipos desarrollaron sistemas similares. (3) **Desafío 1, calculen** con la fórmula **productividad = tamaño / esfuerzo**: equipo A 12.000 / 8 = ¿?; equipo B 15.000 / 12 = ¿? (LOC por mes-persona). (4) **Desafío 2, respondan en su grupo:** ¿qué equipo presenta mayor productividad según esta métrica?; ¿podemos concluir inmediatamente que ese equipo «trabaja mejor»? ¿Por qué?; ¿qué información adicional necesitaríamos antes de llegar a esa conclusión? **Pistas para la reflexión:** un mayor valor de productividad indica que se produjo más software por cada mes-persona; pero una métrica por sí sola no cuenta toda la historia; existen múltiples factores que pueden influir en el resultado; es importante analizar el contexto del proyecto; las métricas son un punto de partida para la discusión. **Tiempo:** 6 minutos.

### Diapositiva 30

**Contenido visual de la lámina:** Infografía **Revisemos: ¿quién fue más productivo?** (1) **Cálculo de la productividad** (productividad = tamaño / esfuerzo): equipo A, 12.000 LOC / 8 meses-persona = **1.500 LOC/mes-persona**; equipo B, 15.000 LOC / 12 meses-persona = **1.250 LOC/mes-persona**. (2) **Resultado:** el equipo A presenta mayor productividad según esta métrica específica (gráfico de barras: A 1.500, B 1.250 LOC/mes-persona). (3) **¿Podemos decir que A es «mejor equipo»? No:** una métrica aislada no es suficiente para determinar cuál equipo es mejor. Todavía desconocemos: complejidad (¿ambos sistemas tenían dificultad comparable?), calidad (¿cuántos defectos produjo cada uno?), tecnología (¿utilizaron los mismos lenguajes y herramientas?), experiencia (¿los equipos tenían capacidades similares?), reutilización (¿alguno pudo reutilizar componentes existentes?) y requerimientos (¿tuvieron la misma estabilidad y claridad?). (4) **Conclusión:** una métrica aislada puede decirnos *«A produjo más LOC por unidad de esfuerzo»*, pero no necesariamente *«A desarrolló mejor software»*.

### Diapositiva 31

**Contenido visual de la lámina:**

Infografía **Medir ≠ comprender — los datos necesitan contexto + interpretación para apoyar una decisión.** (1) **La regla que quiero que recuerden:** *medir ≠ comprender*; los datos necesitan contexto + interpretación para apoyar una decisión. (2) **Ejemplo de estimación:** nuestra organización observa históricamente una productividad aproximada de **1.500 LOC/mes-persona**, y estimamos que un nuevo sistema tendrá **30.000 LOC**; primera aproximación: 30.000 / 1.500 = **20 meses-persona**. (3) **¿Demorará 20 meses? No:** 20 meses-persona es **esfuerzo**, no necesariamente **duración**. (4) **Esfuerzo vs. duración:** el esfuerzo es la cantidad total de trabajo realizado y se mide en meses-persona (por ejemplo, 20); la duración es el tiempo calendario en que se ejecuta el proyecto y se mide en meses (por ejemplo, 5, 8 o 12). (5) **Un mismo esfuerzo, distintas duraciones:** el esfuerzo requerido (20 meses-persona) puede ejecutarse en distintas duraciones, dependiendo del número de personas.

| Personas en el equipo | Esfuerzo total | Duración estimada (aproximada) |
|---:|---|---|
| 1 | 20 meses-persona | 20 meses |
| 2 | 20 meses-persona | 10 meses |
| 4 | 20 meses-persona | 5 meses |
| 5 | 20 meses-persona | 4 meses |

A mayor número de personas, la duración puede disminuir, pero pueden aparecer otros desafíos (coordinación, comunicación, eficiencia, etc.). (6) **Idea clave:** una estimación inicial nos da un punto de partida, pero siempre debe analizarse con su contexto: la productividad varía según el tipo de proyecto; el tamaño es solo una parte de la estimación; debemos considerar complejidad, calidad, equipo, tecnología y otros factores; estimar es un proceso, no un cálculo único. **Mensaje final:** *una buena estimación no depende solo de números, sino de comprender qué hay detrás de ellos.*

### Diapositiva 32

**Contenido visual de la lámina:** Infografía **¿Qué es estimar? Estimar no es adivinar** — utilizamos la información disponible hoy para anticipar lo que probablemente necesitaremos mañana. (1) **El problema:** cuando todavía no hemos construido el software, no conocemos exactamente cuánto esfuerzo requerirá (*«¿Cuánto tardaremos? ¿Y cuánto costará?»*); no podemos saberlo con exactitud, porque el proyecto aún no existe. (2) **¿Qué utiliza una estimación?** Información disponible (requerimientos, funcionalidades, restricciones, etc.), experiencia histórica (proyectos anteriores similares), métricas (productividad, tamaño, esfuerzo, costo, defectos, etc.), supuestos (decisiones sobre lo que aún no se conoce) y técnicas o modelos (métodos de estimación, por ejemplo basados en métricas, juicio experto, etc.) → **estimación**: una aproximación fundamentada del esfuerzo, tiempo y costo. (3) **Un ejemplo:** un cliente solicita una plataforma de reservas; todavía no conocemos su costo real porque el proyecto aún no existe, pero podemos analizar funcionalidades, tamaño esperado, proyectos anteriores, productividad histórica, equipo necesario, tecnología, restricciones y riesgos. (4) **Con una estimación podemos…** planificar mejor, tomar decisiones, identificar riesgos y definir recursos. (5) **Pero debemos recordar que…** sí es una aproximación basada en evidencia, sujeta a incertidumbre, revisable y actualizable; no es un número exacto, una adivinanza, una garantía ni un compromiso inamovible. (6) **Mensaje clave:** *«Estimar significa anticipar utilizando evidencia y supuestos explícitos, no inventar un número.»*

### Diapositiva 33

**Contenido visual de la lámina:** Infografía **Estimación ≠ presupuesto ≠ compromiso — tres conceptos que no debemos confundir** (se relacionan, pero no significan lo mismo). (1) **Estimación:** predicción del esfuerzo, duración o costo esperado según la información disponible (ejemplo: 12 meses-persona de esfuerzo, 8 a 12 meses de duración y un costo aproximado de $25 a $40 millones; *«Estimamos aproximadamente 12 meses-persona de esfuerzo»*). (2) **Presupuesto:** recursos económicos asignados o autorizados para realizar el proyecto (ejemplo: $35.000.000 en recursos asignados, con límite financiero y aprobación organizacional; *«Disponemos de $35 millones para ejecutar el proyecto»*). (3) **Compromiso:** meta o acuerdo que la organización asume respecto de una entrega (fecha de entrega comprometida, acuerdo interno o con el cliente, puede estar en un contrato; *«Nos comprometimos contractualmente a entregar el 30 de noviembre»*). (4) **Y pueden ser diferentes:** en un mismo proyecto podemos tener una estimación de 8 meses de esfuerzo, un presupuesto disponible de $30 millones y un compromiso comercial de entregar en 6 meses. (5) **Preguntas para la clase:** A) ¿que el cliente tenga $30 millones significa que el proyecto cuesta $30 millones? **No:** el cliente puede tener un presupuesto máximo, pero el costo real puede ser mayor o menor. B) ¿que ventas haya prometido 6 meses significa que técnicamente necesitemos 6 meses? **Tampoco:** el compromiso comercial puede ser más exigente que la estimación técnica. **Mensaje clave:** *una decisión comercial no modifica automáticamente el esfuerzo técnico necesario.*

### Diapositiva 34

**Contenido visual de la lámina:** Infografía **Toda estimación tiene supuestos: ¿qué estamos dando por cierto?** (todas nuestras estimaciones se basan en supuestos; si estos cambian, la estimación también). (1) **Supongamos que estimamos** *«El proyecto requerirá 6 meses»*, pero esa estimación supone que los requerimientos permanecerán relativamente estables, que tendremos 4 integrantes disponibles, que el equipo conoce la tecnología, que la API externa estará disponible, que el cliente responderá oportunamente y que no existirán cambios importantes de alcance. (2) **Ahora imaginemos…** que el especialista abandona el proyecto, la API presenta problemas, el cliente incorpora nuevas funcionalidades o cambia una regulación. (3) **¿Qué ocurre con nuestra estimación?** *6 meses* queda **en riesgo**: debemos revisarla. (4) **Una práctica profesional importante:** en vez de decir solamente *«El proyecto demorará 6 meses»* (✗), es mucho más defendible decir *«Estimamos 6 meses bajo los siguientes supuestos…»* (✓). (5) **En resumen:** las estimaciones son más confiables y útiles cuando se explicitan los supuestos que las sustentan (transparencia hoy, menos sorpresas mañana). (6) **Mensaje clave:** *«Una estimación sin supuestos explícitos puede parecer precisa, pero esconder una gran incertidumbre.»*

### Diapositiva 35

**Contenido visual de la lámina:** Infografía **La incertidumbre cambia con el tiempo — al principio sabemos menos** (a medida que avanza el proyecto, contamos con más información y nuestras estimaciones pueden ser más precisas). (1) **El proceso del proyecto:** inicio del proyecto (poca información, muchos supuestos, alta incertidumbre) → requerimientos más claros (conocemos mejor el alcance, menos supuestos, la incertidumbre disminuye) → diseño / arquitectura (comprendemos mejor la solución, podemos analizar alternativas, estimaciones más fundamentadas) → desarrollo (tenemos productividad real, identificamos dificultades, ajustamos estimaciones) → proyecto avanzado (disponemos de mucha más evidencia, estimaciones más precisas, **mayor confianza**). (2) **La incertidumbre se reduce:** embudo que va de *incertidumbre alta* (inicio del proyecto) a *incertidumbre menor* (proyecto avanzado); al principio sabemos menos y existen muchas posibilidades; con el tiempo tenemos más evidencia y nuestras estimaciones son más confiables. (3) **Evolución típica de la incertidumbre:** gráfico decreciente del nivel de incertidumbre a lo largo de las etapas (*más información a lo largo del tiempo permite estimaciones más precisas*). (4) **Pero cuidado…** menor incertidumbre ≠ certeza absoluta; siempre pueden aparecer cambios en los requerimientos, nuevos riesgos, restricciones externas, problemas técnicos y decisiones del cliente. (5) **Pregunta para la clase:** *¿qué estimación debería ser más confiable: la realizada el primer día o la realizada cuando ya conocemos requerimientos, arquitectura y desempeño real del equipo?* **La segunda**, porque se basa en más información y menos incertidumbre. **Conclusión:** *las estimaciones deben revisarse a medida que aparece nueva información.*

### Diapositiva 36

**Contenido visual de la lámina:** Infografía **Desafío: ¿mantienes tu precio? — el cliente no les contó todo… (confidencial).** (1) **El proyecto:** una cafetería universitaria necesita una aplicación para que los estudiantes puedan consultar el menú y realizar pedidos desde su celular (ver menú, realizar pedidos, desde su celular; app *Café U* con café americano $1.200, sándwich $3.500, ensalada césar $4.000 y brownie $2.000). (2) **Etapa 1, la apuesta (60 segundos):** cada equipo debe escribir **¿cuánto cobrarían?**; no importa que todavía no sepan estimarlo formalmente; deben entregar un valor; no pueden cambiarlo todavía. Ejemplo: **$8.000.000** (*confíen en su criterio inicial, ¡hagan su apuesta!*).

### Diapositiva 37

**Contenido visual de la lámina:** **Desafío: ¿mantienes tu precio? Ahora comienza el juego** (se va revelando nueva información… ¿seguimos con el mismo precio?). **Información 1:** la aplicación debe funcionar para **Android, iOS y web** (más plataformas, más desarrollo, más pruebas). Ilustración de la app *Café U* en celular, tablet y notebook. **¿Mantienen su precio o cambian?**

### Diapositiva 38

**Contenido visual de la lámina:** **Desafío: ¿mantienes tu precio? Información 2:** la universidad tiene **35.000 estudiantes** y espera alta demanda entre las **12:00 y 14:00 horas**: debe soportar muchos usuarios simultáneos (más usuarios implica mayor infraestructura, rendimiento y pruebas). Fotografía del campus lleno de estudiantes. **¿Mantienen su precio o cambian?**

### Diapositiva 39

**Contenido visual de la lámina:** **Desafío: ¿mantienes tu precio? Información 3:** debe incorporar **pago online** mediante integración con un proveedor externo: pagos con tarjeta de crédito y débito, integración con proveedor de pagos (externo) y seguridad de transacciones y datos de usuarios (logos de Webpay, Mercado Pago y Stripe; pantalla *Resumen del pedido* con total $6.500 y botón *Pagar ahora*). Nuevas funcionalidades implican más complejidad, pruebas y riesgos. **¿Mantienen su precio o cambian?**

### Diapositiva 40

**Contenido visual de la lámina:** **Desafío: ¿mantienes tu precio? Información 4:** la cafetería quiere incorporar también **delivery dentro del campus con seguimiento del pedido**: seguimiento en tiempo real, gestión de pedidos y estados, asignación de repartidores y entrega en zonas del campus (pantalla *Tu pedido va en camino*; nuevos procesos, más módulos, más integración, más pruebas). **¿Mantienen su precio o cambian?**

### Diapositiva 41

**Contenido visual de la lámina:** **Desafío: ¿mantienes tu precio? Última información:** el Rector quiere tener la primera versión funcionando en **6 semanas** (*«Necesitamos la primera versión funcionando en 6 semanas»*): desarrollo acelerado, más recursos del equipo, mayor riesgo de errores y priorización de funcionalidades (MVP). Notas: *el tiempo también cuesta… ¿vale la pena acelerar?*; *mismo proyecto + menos tiempo = ¿es viable?* **¿Mantienen su precio o cambian?**

### Diapositiva 42

**Contenido visual de la lámina:** **Desafío: ¿mantienes tu precio? ¿Quién gana?** **No gana** el equipo que haya dado el precio más cercano a algo que nosotros inventemos. **Gana** el equipo que pueda explicar mejor **¿por qué cambió su estimación?** Cada equipo tiene **30 segundos** para defender: (1) precio inicial → precio final; (2) las dos informaciones que más cambiaron su estimación. Fotografía de estudiantes presentando *Nuestro proyecto: Café U* (Android, iOS y web; 35.000 estudiantes; pago online; delivery en el campus; primera versión en 6 semanas). Mensajes: *¡Expliquen su razonamiento!*; *no se trata solo del número… se trata de cómo piensan.*

### Diapositiva 43

**Contenido visual de la lámina:** Infografía **¿Cómo comenzamos a estimar? No comenzamos por el precio.** Después del juego anterior podríamos pensar: *«Necesitamos calcular cuánto cuesta.»* Pero antes debemos construir una base para esa estimación. Un proceso inicial podría ser: (1) **comprender el alcance** — ¿qué debemos construir?; (2) **identificar supuestos** — ¿qué estamos considerando como cierto?; (3) **descomponer el problema** — ¿podemos dividirlo en partes más pequeñas?; (4) **estimar las partes** — ¿qué esfuerzo y recursos requiere cada una?; (5) **integrar** — ¿cuál es la estimación global?; (6) **revisar** — ¿es coherente con nuestra experiencia y evidencia? Ilustración de una caja *Desarrollar sistema* descompuesta en cajas más pequeñas: aplicación móvil, sistema web, backend y API, base de datos, pago online, delivery y seguimiento, seguridad, pruebas, despliegue y soporte y mantención. **Mensaje clave:** *«Un problema grande y ambiguo es difícil de estimar. Varios problemas pequeños y comprendidos suelen ser más manejables.»*

### Diapositiva 44

**Contenido visual de la lámina:** Infografía **Dividir para estimar — descomposición.** Imaginemos que nos solicitan *«Desarrollar una tienda online»*. ¿Cuánto cuesta? Difícil responder así (un problema grande y ambiguo). Pero podemos comenzar a descomponerla: **usuarios** (registro, login, recuperación de contraseña, perfil), **catálogo** (productos, categorías, búsqueda, filtros), **compra** (carrito, checkout, pago, confirmación), **pedidos** (registro, estado, historial, seguimiento) y **administración** (productos, stock, pedidos, usuarios) → **componentes que podemos analizar**. **Idea fundamental:** *descomponer no significa que automáticamente sepamos el costo. Significa que transformamos un problema grande en partes que podemos comprender y estimar mejor.*

### Diapositiva 45

**Contenido visual de la lámina:** Infografía **¿Hasta dónde descomponemos? Cuidado: dividir también tiene un límite.** Podríamos continuar dividiendo *Login → pantalla → formulario → campo usuario → campo contraseña → botón → validación…* y seguir indefinidamente… *¿tiene sentido?* **No necesariamente.** La descomposición debe llegar a un nivel donde los elementos sean **comprensibles** (sabemos qué debemos construir), **estimables** (podemos aproximar su tamaño o esfuerzo), **relacionables** (entendemos sus dependencias) y **controlables** (podemos verificar posteriormente su avance). **Demasiado general:** *«Construir sistema bancario»* — muy amplio, no permite una estimación realista (difícil de estimar). **Nivel útil:** gestión de clientes, transferencias, pagos, notificaciones y reportes — componentes claros, comprensibles y estimables (mucho más manejable). **Demasiado detallado:** *«Crear botón verde de 120 × 40 píxeles»* — demasiado específico; no es necesario para una estimación de alto nivel (puede aportar poco a una estimación inicial). **Mensaje:** *descomponer hasta que podamos razonar sobre el trabajo. No existe necesariamente un único nivel correcto para todos los proyectos.*

### Diapositiva 46

**Contenido visual de la lámina:** Infografía **Dos caminos para descomponer: ¿qué podemos dividir?** (podemos mirar el proyecto desde perspectivas diferentes). **A. Descomponer el producto — ¿qué debemos construir?** Por ejemplo, un *sistema de reservas*: usuarios, agenda, reservas, pagos, notificaciones y reportes (nos concentramos en **el software**). **B. Descomponer el trabajo — ¿qué debemos hacer?** Por ejemplo, el *proyecto*: levantamiento, análisis, diseño, desarrollo, pruebas e implementación (nos concentramos en **las actividades**). Al centro, un letrero *mismo proyecto*: producto (¿qué?) y trabajo (¿cómo?) — distintas miradas, mejores estimaciones. **¿Cuál es mejor?** Depende del propósito y de la información disponible; incluso podemos utilizar ambas perspectivas para contrastar nuestra estimación. **Una pregunta rápida:** si olvidamos completamente las pruebas al descomponer el trabajo, ¿qué ocurriría con nuestra estimación? Probablemente: **subestimaremos el esfuerzo**. **Mensaje clave:** *«Lo que no identificamos, difícilmente podremos estimarlo.»*

### Diapositiva 47

**Contenido visual de la lámina:** Infografía **Actividad: el proyecto imposible — desafío express, 8 minutos: ¿quién logra domar al monstruo?** Un monstruo peludo sostiene el cartel *¡¡Proyecto gigante!!*, rodeado de notas (matrículas, asignaturas, notas, horarios, titulación, estudiantes, docentes, certificados…) y preguntas (*¿por dónde empezamos?*, *¿cuánto puede costar?*, *¡es enorme!*, *¿será posible?*). **Universidad:** *«Una universidad quiere desarrollar una plataforma digital para administrar toda la vida académica de sus estudiantes.»* Y nada más. El rector exige: *«Necesito el presupuesto mañana.»* **Objetivo:** discutan en equipo y entreguen una estimación de presupuesto. **No hay respuesta correcta…** lo importante es cómo razonan.

### Diapositiva 48

**Contenido visual de la lámina:** Infografía **Primer desafío — 60 segundos. Cada equipo debe escribir rápidamente:** universidad: *«Una universidad quiere desarrollar una plataforma digital para administrar toda la vida académica de sus estudiantes.»* **¿Qué incluye «toda la vida académica»?** Temporizador *01:00*: tienen solamente **1 minuto**; anoten todas las ideas que se les ocurran. **En equipo:** piensen en grande; incluyan procesos, personas, datos y servicios; no se preocupen aún del costo; escriban en palabras simples. Notas: *misma solicitud… diferentes miradas*; *no existen respuestas incorrectas en esta etapa*; *«Las mejores soluciones comienzan con buenas preguntas.»*

### Diapositiva 49

**Contenido visual de la lámina:** Infografía **El proyecto imposible — segundo desafío, 3 minutos.** Ahora cada equipo debe seleccionar **5 componentes** y descomponer cada uno en funcionalidades (temporizador *03:00*). **Recuerden:** seleccionen 5 componentes relevantes; descompongan cada componente en funcionalidades; sean concretos y realistas; no se preocupen aún del esfuerzo. **Ejemplo (solo un componente): Matrícula** → seleccionar asignaturas, validar prerrequisitos, confirmar inscripción, modificar inscripción y cancelar inscripción. Notas: *un componente puede tener varias funcionalidades*; *pequeñas partes, grandes estimaciones*; *grandes proyectos se construyen en equipo*.

### Diapositiva 50

**Contenido visual de la lámina:** Infografía **El proyecto imposible — pero aparece el cliente…** (*«Disculpen, olvidamos algo…»*). La plataforma también debe funcionar para **estudiantes** (inscriben, consultan, solicitan, etc.), **docentes** (registran, gestionan, reportan, etc.), **directores de carrera** (supervisan, analizan, deciden, etc.) y **administrativos** (gestionan, procesan, controlan, etc.). Reacciones de los estudiantes: *¡Ahh!*, *¿debemos cambiar algo?*, *¿qué implica esto?*, *¿revisamos nuestra descomposición?* **1 minuto adicional** para corregir su descomposición: ¿cambia su descomposición? Notas: *misma plataforma, más perspectivas*; *un mismo sistema puede tener múltiples usuarios con distintas necesidades*; *los requisitos también evolucionan*; *los requisitos no siempre son estáticos*.

### Diapositiva 51

**Contenido visual de la lámina:** Infografía **El proyecto imposible — desafío final, 20 segundos:** *¿Cuál fue el componente que inicialmente parecía simple y después descubrieron que era más complejo?* (temporizador *00:20*). Notas: *compartan su respuesta*; *a veces, lo simple solo parece simple*; *pequeñas preguntas, grandes aprendizajes*; *la estimación mejora cuando miramos más allá*.

### Diapositiva 52

**Contenido visual de la lámina:** Infografía **El proyecto imposible — ¿qué acabamos de descubrir?** Primero teníamos: **plataforma académica** (parecía una cosa). Pero al descomponer apareció: plataforma (el sistema general) → componentes (grandes módulos) → funcionalidades (lo que debe hacer) → usuarios (estudiantes, docentes, directivos, administrativos) → reglas (políticas, validaciones, excepciones): **mucho más trabajo del que veíamos al principio.** Notas: *lo que no vemos también cuenta*; *descomponer para entender, entender para estimar*; *la complejidad no desaparece, solo estaba oculta*. **Frase final:** *«La complejidad que no vemos al comienzo no desaparece: simplemente todavía no la hemos descubierto.»* Pregunta: **¿cómo convertimos ahora esa descomposición en una estimación?**

### Diapositiva 53

**Contenido visual de la lámina:** Infografía **El proyecto imposible — ¿de dónde sale una estimación?** Ya descompusimos el proyecto… **¿ahora qué?** Tenemos una nueva plataforma dividida en componentes (usuarios, reservas, pagos, notificaciones y reportes): **¿cuánto esfuerzo requerirá?** No existe una única forma de construir esa estimación; podemos apoyarnos en distintas fuentes de información: **experiencia** (¿qué opinan personas que han realizado proyectos similares?), **proyectos anteriores** (¿hemos construido algo parecido antes?) y **componentes** (¿podemos estimar las partes y después integrarlas?). De estas preguntas aparecen tres estrategias: (1) **juicio experto** — estimación basada en la opinión de personas con experiencia; (2) **analogía** — usar datos de proyectos similares ya realizados; (3) **descomposición / bottom-up** — estimar cada componente y luego sumar el total. **Mensaje clave:** *«Una estimación es más defendible cuando podemos explicar de dónde proviene.»*

### Diapositiva 54

**Contenido visual de la lámina:** Infografía **Juicio experto — «ya hemos hecho algo parecido».** Una organización debe estimar una integración entre su sistema de ventas y una nueva plataforma de pagos (sistema de ventas ↔ integración ↔ plataforma de pagos). El experto dice: *«Por las características de esta integración, considero que necesitaremos aproximadamente **6 semanas** de trabajo.»* (requerimientos: datos a integrar, volumen, seguridad, pruebas, puesta en producción). **Esto es juicio experto:** la estimación se apoya en experiencia, conocimiento técnico, proyectos anteriores y contexto del nuevo proyecto. **Ventaja:** puede ser muy útil cuando existe experiencia relevante y todavía disponemos de poca información cuantitativa. **Riesgo: ¿y si el experto se equivoca?** La experiencia también puede contener sesgos, exceso de confianza, recuerdos incompletos y experiencias poco comparables. En lugar de preguntar *«¿Cuánto crees que demorará?»* (✗), podemos preguntar *«¿Cuánto estimas y en qué evidencia o supuestos fundamentas esa estimación?»* (✓). **Mensaje clave:** *«La experiencia es valiosa, pero debe poder explicarse y contrastarse.»*

### Diapositiva 55

**Contenido visual de la lámina:** Infografía **Estimación por analogía — «este proyecto se parece a…».** Tenemos que estimar una nueva aplicación; buscamos proyectos anteriores con características similares. **Proyecto anterior:** aplicación de reservas médicas (esfuerzo 18 meses-persona, duración 5 meses, equipo de 4 personas). **Nuevo proyecto:** aplicación de reservas odontológicas; posee características similares (usuarios similares, agenda, reserva de horas, cancelaciones y notificaciones), pero además incorpora pagos online e integración con aseguradoras. **Razonamiento:** podríamos utilizar el proyecto anterior como **punto de referencia**, pero no simplemente copiar: *18 meses-persona ≠ automáticamente 18 meses-persona*; debemos ajustar la estimación por las diferencias. **Para utilizar analogía debemos preguntar:** ¿en qué se parecen?, ¿en qué se diferencian?, ¿qué impacto podrían tener esas diferencias? **Mensaje clave:** *«Analogía no significa copiar una estimación anterior; significa utilizarla como referencia y ajustarla al nuevo contexto.»*

### Diapositiva 56

**Contenido visual de la lámina:**

Infografía **Estimación bottom-up — de las partes hacia el total.** Recordemos nuestra tienda online; la descompusimos en componentes y ahora podríamos estimar cada uno:

| Componente | Esfuerzo estimado |
|---|---|
| Gestión de usuarios | 2 semanas-persona |
| Catálogo | 3 semanas-persona |
| Carrito | 2 semanas-persona |
| Pagos | 4 semanas-persona |
| Pedidos | 3 semanas-persona |
| Administración | 4 semanas-persona |
| **Total** | **18 semanas-persona** |

Esta primera suma representa una aproximación al **esfuerzo**; no significa necesariamente **18 semanas de duración**. **¿Terminamos? Todavía no:** podrían existir elementos transversales (integración, pruebas, seguridad, despliegue, gestión, documentación y coordinación); por eso debemos revisar si nuestra descomposición realmente representa todo el trabajo necesario. **La lógica bottom-up:** proyecto → descomponer → estimar cada parte → integrar estimaciones → estimación global. **Mensaje clave:** *«Bottom-up reduce el riesgo de esconder trabajo dentro de una única cifra global, pero depende de que la descomposición sea suficientemente completa.»*

### Diapositiva 57

**Contenido visual de la lámina:** Infografía **El proyecto imposible — la batalla de los estimadores (desafío express, 8 minutos).** Cada grupo será una **consultora de software**: deberán asesorar a distintos clientes y proponer la estrategia de estimación más adecuada para cada caso. Tienen tres posibles herramientas: **juicio experto** (basada en la experiencia de personas con conocimiento), **analogía** (usa proyectos anteriores similares como referencia) y **bottom-up** (descompone y estima cada parte del proyecto). **Pero…** no pueden elegir la misma estrategia para todos los casos; deberán utilizar al menos dos estrategias distintas. Pasos: discutan en su equipo → analicen cada caso → elijan la estrategia más adecuada → justifiquen su decisión.

### Diapositiva 58

**Contenido visual de la lámina:** **La batalla de los estimadores — caso 1 de 3: «Ya lo hicimos».** Su empresa desarrolló durante los últimos años **12 sistemas de inventario muy similares**; ahora un nuevo cliente solicita otro, con algunas modificaciones (captura de un sistema de inventario con su lista de productos). **¿Qué utilizarían?** Juicio experto, analogía o bottom-up. Tienen **1 minuto**.

### Diapositiva 59

**Contenido visual de la lámina:** **La batalla de los estimadores — caso 2 de 3: «El especialista».** La empresa debe realizar una integración muy particular con una **tecnología que casi nadie conoce**; sin embargo, tienen un ingeniero que ha implementado varias integraciones utilizando precisamente esa tecnología (ilustración de una API y código). **¿Qué utilizarían?** Juicio experto, analogía o bottom-up. Tienen **1 minuto**.

### Diapositiva 60

**Contenido visual de la lámina:** **La batalla de los estimadores — caso 3 de 3: «El monstruo».** Un cliente solicita una plataforma **completamente nueva**; no tenemos un proyecto anterior suficientemente comparable, pero los requerimientos permiten dividirla claramente en **8 módulos y 32 funcionalidades** (pizarra con *Plataforma nueva* descompuesta en ocho módulos). **¿Qué utilizarían?** Juicio experto, analogía o bottom-up. Tienen **1 minuto**.

### Diapositiva 61

**Contenido visual de la lámina:** **La batalla de los estimadores — pero ahora viene la sorpresa (2 minutos para discutir en su equipo).** El gerente no confía completamente en una estimación obtenida utilizando **una sola estrategia**. Recuerden las tres estrategias: juicio experto, analogía y bottom-up. **Completen en su equipo:** *«Estimaría principalmente mediante ______ y contrastaría el resultado utilizando ______ porque…»*

### Diapositiva 62

**Contenido visual de la lámina:** Infografía **Revelemos — primera decisión: ¿qué estrategia utilizaríamos principalmente?** **Caso 1, «Ya lo hicimos»** (12 sistemas de inventario muy similares; nuevo cliente con algunas modificaciones): estrategia principal **analogía**, porque tenemos abundante información de proyectos anteriores comparables (proyecto anterior similar → diferencias y ajustes → nueva estimación). **Caso 2, «El especialista»** (integración muy particular con una tecnología que casi nadie conoce, pero con un ingeniero que ha hecho varias integraciones con ella): estrategia principal **juicio experto**, porque disponemos de experiencia especializada directamente relacionada con el problema que debemos estimar. **Caso 3, «El monstruo»** (plataforma completamente nueva, sin proyecto anterior comparable, pero divisible en 8 módulos y 32 funcionalidades): estrategia principal **bottom-up**, porque podemos descomponer el proyecto, estimar las partes e integrar las estimaciones.

### Diapositiva 63

**Contenido visual de la lámina:** Infografía **¿Y qué hacemos con la sorpresa?** El gerente había dicho: *«No confío completamente en una estimación obtenida utilizando una sola estrategia»*; entonces necesitamos **una segunda estimación para contrastar**. **Caso 1, «Ya lo hicimos»:** principal **analogía** + para contrastar **bottom-up**. Primero utilizamos los 12 proyectos anteriores como referencia; luego descomponemos el nuevo sistema y estimamos sus componentes. *¿La suma de las partes resulta razonablemente cercana a lo que indican nuestros proyectos históricos?* Si ambas aproximaciones son similares, **aumenta nuestra confianza**. **Caso 2, «El especialista»:** principal **juicio experto** + para contrastar **bottom-up**. Primero aprovechamos el conocimiento del especialista; no aceptamos simplemente *«Yo creo que demorará 3 meses»*: también descomponemos la integración en tareas o componentes y construimos otra estimación. *¿La estimación obtenida desde las partes respalda la opinión del experto?* Si ambas son similares, **aumenta nuestra confianza**. **Caso 3, «El monstruo»:** principal **bottom-up** + para contrastar **juicio experto**. Comenzamos descomponiendo el sistema en 8 módulos y 32 funcionalidades; luego solicitamos a personas con experiencia que revisen los supuestos, las estimaciones parciales, los elementos posiblemente omitidos y los riesgos técnicos. Utilizamos el juicio experto como **revisión de la estimación**.

### Diapositiva 64

**Contenido visual de la lámina:** Infografía **Lo importante no es memorizar, sino aprender a elegir la mejor estrategia según la evidencia disponible.** **Caso 1, «Ya lo hicimos»** (12 sistemas de inventario muy similares): evidencia disponible, proyectos anteriores comparables → principal **analogía**, para contrastar **bottom-up**. **Caso 2, «El especialista»** (tecnología poco conocida, pero con un especialista): evidencia disponible, experiencia del especialista en esta tecnología → principal **juicio experto**, para contrastar **bottom-up**. **Caso 3, «El monstruo»** (sin proyectos comparables, pero divisible en 8 módulos y 32 funcionalidades): evidencia disponible, requerimientos descomponibles en módulos y funcionalidades → principal **bottom-up**, para contrastar **juicio experto**. Proceso: (1) ¿qué evidencia tengo disponible? → (2) ¿qué estrategia aprovecha mejor esa evidencia? → (3) ¿cómo puedo contrastar el resultado?

### Diapositiva 65

**Contenido visual de la lámina:** Infografía **El proyecto imposible — de una idea a una estimación.** El cliente dice: *«Necesito una aplicación para administrar las reservas de un centro deportivo.»* La aplicación permitirá registrar usuarios, consultar canchas disponibles, reservar una cancha, cancelar reservas, pagar online, recibir confirmaciones y consultar historial. **¿Podemos dar un precio inmediatamente? Todavía no:** primero necesitamos recorrer nuestro camino: (1) **¿qué debemos construir?** (tamaño / alcance: definir y entender los requerimientos del proyecto) → (2) **¿cuánto trabajo requerirá?** (esfuerzo: estimar el esfuerzo necesario para desarrollarlo) → (3) **¿cuánto tiempo necesitaremos?** (duración: determinar la duración del proyecto) → (4) **¿qué necesitaremos?** (recursos: definir el equipo, perfiles y otros recursos necesarios) → (5) **¿cuánto costará?** (costo: calcular el costo del proyecto). **Mensaje:** *el precio no debería ser el punto de partida de la estimación; es una consecuencia de comprender el proyecto.*

### Diapositiva 66

**Contenido visual de la lámina:** Infografía **El proyecto imposible — construyamos la estimación** (*«Necesito una aplicación para administrar las reservas de un centro deportivo»*). **Paso 1, comprender y descomponer:** primero identificamos los principales componentes de la aplicación: usuarios (registro, login, perfil), canchas (consulta, disponibilidad, horarios), reservas (crear, modificar, cancelar), pagos (pago online, confirmación, registro), notificaciones (confirmación, recordatorio, cancelación) y administración (canchas, horarios, reservas, usuarios). **Paso 2, elegir la estrategia de estimación:** con la información que tenemos, ¿qué estrategia aprovecha mejor nuestra evidencia? **Analogía** (¿tenemos experiencia desarrollando algo parecido? Usamos proyectos anteriores similares como referencia), **juicio experto** (¿tenemos especialistas con experiencia relevante? Aprovechamos el conocimiento de personas con experiencia) o **bottom-up** (¿podemos estimar cada componente? Descomponemos en partes y estimamos cada una). **Podemos combinar estrategias:** en la práctica, es recomendable utilizar más de una estrategia para contrastar los resultados. **Paso 3, obtener la estimación:** aplicamos las estrategias seleccionadas para estimar tamaño / alcance (¿qué debemos construir?) → esfuerzo (¿cuánto trabajo requerirá?) → duración (¿cuánto tiempo necesitaremos?) → recursos (¿qué necesitaremos?) → costo (¿cuánto costará?). **Idea central:** *primero comprendemos, después estimamos. No al revés.*

### Diapositiva 67

**Contenido visual de la lámina:**

Infografía **El proyecto imposible — de la estimación al costo: ahora sí podemos construir el presupuesto.** (1) **Esfuerzo estimado:** **16 meses-persona** ≠ 16 meses de duración; ahora debemos definir cómo organizaremos ese esfuerzo. (2) **Equipo y recursos:** equipo de trabajo (jefe de proyecto, desarrolladores, UX/UI, QA y DevOps) y otros recursos (cloud/infraestructura, servicio de pago, notificaciones, herramientas y seguridad). (3) **De la estimación al costo:** esfuerzo (16 meses-persona) → organización del equipo (perfiles, roles y dedicación) → duración (plan de trabajo y cronograma) → recursos (cloud, servicios, herramientas, seguridad, etc.) → costo estimado (suma de costos de personas y otros recursos). (4) **Ejemplo ilustrativo (referencial):**

| Concepto | Cantidad / meses | Costo mensual (CLP) | Subtotal (CLP) |
|---|---|---:|---:|
| Jefe de proyecto | 1 × 6 meses | $2.000.000 | $12.000.000 |
| Desarrolladores | 3 × 6 meses | $1.500.000 | $27.000.000 |
| UX/UI | 1 × 3 meses | $1.200.000 | $3.600.000 |
| QA | 1 × 4 meses | $1.200.000 | $4.800.000 |
| DevOps | 1 × 2 meses | $1.500.000 | $3.000.000 |
| **Subtotal personas** | | | **$50.400.000** |
| Otros recursos (cloud, pago, notificaciones, herramientas, seguridad) | | | $7.600.000 |
| **Costo estimado del proyecto** | | | **$58.000.000** |

(5) **Supuestos:** alcance relativamente estable, equipo disponible, tecnología conocida, integración de pago disponible, cliente responde oportunamente, entre otros. (6) **Preguntas clave:** ¿cuánto estimamos? ¿Cómo llegamos a ese valor y bajo qué supuestos?

### Diapositiva 68

**Contenido visual de la lámina:**

Infografía **El proyecto imposible — desafío final: «¿Aceptamos los $20 millones?»** **Escenario:** una empresa necesita desarrollar un sistema web para gestionar las reservas de sus salas de reuniones. **El sistema debe permitir:** registrar usuarios, consultar salas disponibles, reservar una sala, modificar y cancelar reservas, enviar confirmaciones por correo, consultar historial de reservas y administrar salas y horarios. **Equipo disponible:**

| Recurso | Costo mensual | Participación |
|---|---:|---:|
| Jefe de proyecto | $3.000.000 | 25 % |
| Desarrollador 1 | $2.500.000 | 100 % |
| Desarrollador 2 | $2.500.000 | 100 % |
| QA | $2.000.000 | 50 % |

**Duración inicial estimada: 4 meses.** El cliente dice: *«Tengo **$20.000.000**. ¿Podemos hacerlo?»* **Ahora les toca a ustedes — misión de 5 minutos:** cada equipo deberá decidir si con la información disponible puede responder responsablemente al cliente. (1) **Calculen:** ¿cuál sería el costo humano estimado durante los 4 meses? (2) **Detecten:** ¿qué costos o recursos todavía no aparecen? Identifiquen al menos 3 elementos. (3) **Identifiquen:** ¿qué supuesto importante podría hacer cambiar la estimación? (4) **Elijan:** ¿qué estrategia utilizarían para contrastar su estimación (juicio experto, analogía o bottom-up)? (5) **Respondan al cliente:** tienen solamente 2 frases para responder *«Tengo $20 millones. ¿Podemos hacerlo?»*.

### Diapositiva 69

**Contenido visual de la lámina:**

Infografía **El proyecto imposible — revelemos.** (1) **Costo humano estimado (4 meses):**

| Recurso | Costo mensual | Meses | Participación | Subtotal |
|---|---:|---:|---:|---:|
| Jefe de proyecto | $3.000.000 | 4 | 25 % | $3.000.000 |
| Desarrollador 1 | $2.500.000 | 4 | 100 % | $10.000.000 |
| Desarrollador 2 | $2.500.000 | 4 | 100 % | $10.000.000 |
| QA | $2.000.000 | 4 | 50 % | $4.000.000 |
| **Costo humano total** | | | | **$27.000.000** |

(2) **¿Qué otros costos pueden existir?** Cloud (infraestructura), licencias (software), correo / notificaciones, infraestructura (servidores, dominios), seguridad (certificados, backup), UX/UI (diseño), implementación (despliegue y soporte) y otros según la solución. (3) **¿Alcanza el presupuesto del cliente?** Costo humano estimado **$27.000.000** > presupuesto del cliente **$20.000.000**: **los $20 millones no cubren ni siquiera el costo humano estimado.** (4) **¿Significa que debemos decir simplemente «no»? No necesariamente:** podemos analizar alternativas para ajustar la propuesta y hacerla viable, pero cualquier cambio obliga a volver a estimar. (5) **Posibles alternativas:** reducir alcance, construir una primera versión (MVP), revisar composición / dedicación del equipo, revisar duración y replantear la solución técnica. **Mensaje final:** *antes de entregar un número, debemos comprender el proyecto, estimar de forma responsable y declarar nuestros supuestos.*

### Diapositiva 70

**Contenido visual de la lámina:** Infografía **¿Qué nos llevamos de esta clase? Estimar software no es adivinar.** Al centro, la cadena **tamaño → esfuerzo → duración → recursos → costo**, rodeada de cinco prácticas: (1) **comprender** — ¿qué debemos construir?; (2) **utilizar evidencia** — métricas, experiencia y proyectos anteriores; (3) **descomponer** — transformar un problema grande en partes estimables; (4) **explicitar supuestos** — ¿qué estamos considerando como cierto?; (5) **revisar** — si cambia la información, puede cambiar la estimación. Mensaje: *una buena estimación no es solo un número; es un número que podemos explicar, justificar y revisar.*

### Diapositiva 71

#### PRÓXIMA CLASE

¿CÓMO MEDIMOS EL TAMAÑO DEL SOFTWARE?

PASAREMOS DE ESTIMAR A MEDIR Hasta ahora aprendimos que:

TAMAÑO → ESFUERZO → DURACIÓN → RECURSOS → COSTO

**Contenido visual de la lámina:** Lámina de texto con un ícono de regla junto a *Pasaremos de estimar a medir*; sin imágenes con contenido adicional.

### Diapositiva 72

UNIVERSIDAD SAN SEBASTIAN

YOCACIÓN POR LA 6XC6L6ł•fClA

Fin Semana 5

N U1 ST RA /Ví l S10 N ES E D U CAR EN LA

RAZÓ N , LA VE RDA D Y LA V I RTU D.

---

**Contenido visual de la lámina:** Lámina de cierre: *Fin Semana 5*, con la franja *Nuestra misión es educar en la razón, la verdad y la virtud.*

<a id="semana-6"></a>

## Ingeniería de Software — Semana 6

Fuente del ZIP: `Ingenieria_de_Software_Semana_06.md`.

### Diapositiva 1

CLASE 1

SEMANA 6

Introducción a la Ingeniería Informática

Taller de Ingeniería de Software

Alfredo Pereira

Prof. Dr. Rodrigo Correa R.

**Contenido visual de la lámina:** Portada con fotografía de un edificio patrimonial de la universidad y logo USS. Texto: *Semana 6 · Taller de Ingeniería de Software · Prof. Dr. Rodrigo Correa R.*

### Diapositiva 2

#### OBJETIVO DE LA CLASE

Comprender y aplicar técnicas para estimar el tamaño de un software, utilizando Líneas de Código (LOC) y Puntos de Función (FP) como base para posteriormente estimar esfuerzo, duración, recursos y costos.

Al finalizar la clase podremos:

- Explicar qué significa tamaño del software. • Utilizar LOC como medida de tamaño. • Comprender sus ventajas y limitaciones. • Identificar los elementos utilizados en Puntos de Función. • Realizar una estimación mediante FP. • Comparar LOC y FP para determinar cuándo resulta más apropiado utilizar cada técnica.

**Contenido visual de la lámina:** Objetivo y lista de logros esperados. Imagen ilustrativa: escalera con íconos que sube hacia una diana.

### Diapositiva 3

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **¿Qué aprenderemos hoy?** (1) **El problema del tamaño** — ¿qué significa realmente que un software sea «grande»? (2) **Líneas de código (LOC)** — ¿cómo podemos medir el software utilizando su código? (3) **¿Qué problemas presenta LOC?** — lenguaje, productividad, momento de la estimación y comparabilidad. (4) **Puntos de función (FP)** — ¿cómo podemos medir el software desde las funcionalidades que entrega? (5) **Aprenderemos a calcularlos** — identificaremos y clasificaremos las funciones del sistema. (6) **LOC vs. FP** — ¿qué técnica utilizaríamos en diferentes escenarios? **Hoy pasaremos de** *«Creo que este software es grande»* **a** *«Puedo explicar cómo estimé su tamaño»*.

### Diapositiva 4

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Recordemos la semana anterior.** **¿Dónde estamos?** La semana pasada aprendimos que no deberíamos comenzar una estimación preguntándonos directamente cuánto costará el proyecto. **Construimos esta secuencia:** tamaño → esfuerzo → duración → recursos → costo. **Pero dejamos una pregunta pendiente: ¿cómo determinamos el tamaño?** **Por ejemplo:** una empresa solicita desarrollar *«Un sistema para administrar 10.000 clientes»*. ¿Es grande? **No lo sabemos todavía.** Necesitamos conocer: ¿qué podrá hacer el sistema?, ¿qué información administrará?, ¿con qué otros sistemas interactuará?, ¿qué entradas y salidas tendrá?, ¿qué funcionalidades deberá proporcionar? **Mensaje clave:** *antes de estimar cuánto trabajo necesitamos, debemos comprender cuánto software debemos construir.*

### Diapositiva 5

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Ahora ustedes — 5 minutos: ¿cuál software es más grande?** Tenemos dos proyectos; analicen la información y respondan en grupo. **Proyecto A — 50.000 usuarios.** Permite solamente iniciar sesión, consultar saldo y cerrar sesión. **Proyecto B — 100 usuarios.** Permite administrar clientes, gestionar contratos, registrar órdenes, controlar inventario, gestionar proveedores, generar facturas, realizar pagos, administrar documentos, generar reportes e integrarse con otros sistemas. **En grupos respondan:** (1) ¿cuál consideran que tiene mayor tamaño?; (2) ¿el número de usuarios determina necesariamente el tamaño del software?; (3) ¿qué información utilizarían para medir ese tamaño?; (4) propongan al menos tres elementos que podrían utilizarse para comparar ambos proyectos. **No buscamos todavía una fórmula.** Buscamos determinar: **¿qué significa «tamaño» en software?**

### Diapositiva 6

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **¿50.000 usuarios significa más software? No necesariamente.** El número de usuarios puede afectar infraestructura, rendimiento, disponibilidad, arquitectura y capacidad requerida, pero no determina por sí solo **el tamaño funcional del software**: el proyecto B podría requerir mucho más trabajo de desarrollo aunque tenga considerablemente menos usuarios. **¿Cómo podríamos observar el tamaño?** Podríamos considerar, por ejemplo: **código necesario** (¿cuánto software debemos programar?), **funcionalidades** (¿cuánto puede hacer el sistema para sus usuarios?), **información** (¿qué información debe mantener y administrar?) e **interacciones** (¿con cuántos sistemas o servicios debe comunicarse?). **Y aquí aparecen dos formas diferentes de mirar el problema:** **LOC** (líneas de código: ¿cuánto código tenemos que construir?) versus **FP** (puntos de función: ¿cuánta funcionalidad debemos entregar?). **Decisión rápida — 2 minutos:** dos equipos desarrollan un programa que realiza exactamente las mismas funciones: el **equipo A** escribe 5.000 líneas de código y el **equipo B** escribe 15.000. Cada pareja debe elegir solamente una respuesta: A) el software B es necesariamente más grande; B) el software A es necesariamente mejor; C) con esa información no podemos concluir ninguna de las dos cosas; y deben justificar su elección en una frase. Después preguntamos a mano alzada: ¿quién eligió A?, ¿B?, ¿C? **¿Entonces para qué sirven las líneas de código?** Eso lo descubriremos ahora.

### Diapositiva 7

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **¿Qué son las líneas de código?** (1) **LOC — lines of code:** una de las formas más tradicionales de medir el tamaño de un software consiste en contar **¿cuántas líneas de código tiene?** (ejemplo de un programa en Python de 11 líneas con la función `calcular_total(precio, cantidad)`); a esta medida se le denomina **LOC = lines of code**. (2) **Ejemplo de tamaño en LOC:** sistema A 4.500 LOC; sistema B 12.000 LOC; sistema C 35.000 LOC. (3) **KLOC — thousand lines of code:** cuando los proyectos son mayores podemos utilizar **KLOC**; es decir, **1 KLOC = 1.000 LOC** (5.000 LOC = 5 KLOC; 25.000 LOC = 25 KLOC; 120.000 LOC = 120 KLOC). (4) **Idea central:** LOC utiliza la cantidad de código desarrollado como una aproximación al tamaño del software. (5) **Pero… una pregunta importante:** *¿todas las líneas deberían contarse?*

### Diapositiva 8

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **¿Qué significa «contar líneas»?** (1) **Parece fácil… pero no tanto.** Consideremos este pequeño código: la función `calcular_total(precio, cantidad)` con un comentario *«Calcula el total de la compra»*, la instrucción `total = precio * cantidad`, `return total` y líneas en blanco. (2) **¿Qué podríamos contar?** Líneas físicas (todas las líneas que ocupa el código), líneas ejecutables (solo las instrucciones que se ejecutan), comentarios (líneas que explican el código), líneas en blanco (líneas vacías), declaraciones (por ejemplo, la definición de la función) e instrucciones (por ejemplo, asignaciones o retornos). (3) **Entonces… ¿cuántas LOC tiene este programa?** Dependiendo de la regla utilizada, podríamos obtener resultados diferentes. (4) **Por eso…** antes de comparar proyectos mediante LOC debemos establecer **una regla de conteo consistente**; por ejemplo: *«Contaremos solamente líneas que contengan instrucciones o declaraciones del programa.»* (5) **Mensaje clave:** *una métrica solamente es comparable cuando sabemos exactamente cómo fue medida.*

### Diapositiva 9

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **¿Para qué puede servir LOC?** (1) **LOC no es solo «contar código»:** si una organización mantiene información histórica de sus proyectos, LOC puede relacionarse con otras variables. (2) **Productividad histórica:** una empresa observa que históricamente desarrolla aproximadamente **1.500 LOC/persona-mes**. (3) **Estimación del esfuerzo:** y debe construir un proyecto estimado en **30.000 LOC**; entonces podría realizar una primera aproximación: 30.000 LOC ÷ 1.500 LOC/persona-mes = **20 persona-mes de esfuerzo**. (4) **Pero recordemos…** 20 persona-mes ≠ 20 meses de duración; LOC nos ayudó a pasar de tamaño (LOC) a esfuerzo (persona-mes); todavía debemos analizar el equipo, las dependencias, la duración y los recursos necesarios (cadena tamaño → esfuerzo → duración → recursos → costo). (5) **Idea clave:** *LOC adquiere mayor utilidad cuando podemos relacionarlo con información histórica de productividad.*

### Diapositiva 10

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Un ejemplo completo — de LOC a una primera estimación.** (1) **Datos históricos de la empresa:** productividad promedio **2.000 LOC/persona-mes**; para un nuevo proyecto se estima un tamaño de **24.000 LOC**. (2) **Paso 1, convertir el tamaño:** 24.000 LOC = **24 KLOC**. (3) **Paso 2, estimar el esfuerzo** con la productividad histórica: 24.000 LOC ÷ 2.000 LOC/persona-mes = **12 persona-mes**. (4) **Estimación de duración (primera aproximación):** si el proyecto utiliza **3 desarrolladores**, una primera aproximación puramente matemática sería 12 persona-mes ÷ 3 personas = **4 meses**. (5) **Pero cuidado:** ¿podemos afirmar inmediatamente que el proyecto durará exactamente cuatro meses? **No**, porque todavía no hemos considerado dependencias entre tareas, análisis y diseño, pruebas, integración, coordinación, perfiles diferentes y actividades que no pueden paralelizarse completamente. (6) **Mensaje clave:** *la productividad histórica ayuda a estimar; no transforma el desarrollo de software en una división automática.*

### Diapositiva 11

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Desafío grupal: ¿quién tiene razón?** (1) **Información del proyecto:** una empresa debe desarrollar un sistema estimado en **40.000 LOC**. (2) **Productividad histórica y esfuerzo:** su información histórica indica una productividad promedio de **2.000 LOC/persona-mes**; por lo tanto, **esfuerzo estimado = 20 persona-mes**. (3) **Tres propuestas en la reunión:** *propuesta A*, «contratemos 2 desarrolladores: 20 ÷ 2 = 10 meses»; *propuesta B*, «contratemos 5 desarrolladores: 20 ÷ 5 = 4 meses»; *propuesta C*, «contratemos 20 desarrolladores: 20 ÷ 20 = 1 mes». (4) **Misión del grupo (6 minutos):** cada grupo (1, 2, 3, 5 y 6) debe consensuar una respuesta: matemáticamente, ¿cuál de las tres operaciones es correcta?; desde ingeniería de software, ¿podemos asegurar que esas duraciones serán reales?; ¿qué propuesta les genera mayor desconfianza y por qué?; ¿qué información adicional necesitarían antes de comprometer una fecha?

### Diapositiva 12

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Pregunta sorpresa.** (1) **Nuevo requerimiento del cliente:** el cliente informa que necesita el sistema funcionando en **2 meses**. ¿Basta con aumentar el equipo a **10 personas**? (2) **Discusión rápida — 30 segundos:** cada grupo dispone de 30 segundos para preparar su respuesta (grupo 1, decisión; grupo 2, puede apoyar o desafiar al grupo 1; grupo 3, agrega un argumento diferente; grupo 5, decisión; grupo 6, cierre). (3) **Conclusión:** matemáticamente, 20 ÷ 2 = 10, 20 ÷ 5 = 4 y 20 ÷ 20 = 1; las tres divisiones son correctas. **Pero: una división correcta ≠ una estimación realista.** (4) **¿Qué pasa si aumentamos personas?** Aumentar personas introduce o incrementa coordinación, comunicación, integración, aprendizaje y dependencias, y no todas las actividades pueden ejecutarse paralelamente. (5) **Frase de cierre:** *«LOC puede ayudarnos a estimar el esfuerzo. El esfuerzo, por sí solo, no determina automáticamente la duración.»* (6) **Pregunta final:** *si LOC puede ser útil… ¿por qué no estimamos todos los proyectos simplemente contando líneas de código?*

### Diapositiva 13

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **El primer problema de LOC.** (1) **Misma funcionalidad, diferentes tecnologías:** supongamos que dos equipos deben desarrollar **exactamente la misma funcionalidad**. (2) **Código en dos tecnologías diferentes:** el equipo A usa **Python (framework)**, con un fragmento en Flask que define la ruta `/saldo` (necesita **10.000 LOC**); el equipo B usa **Java (framework)**, con un controlador Spring equivalente (necesita **25.000 LOC**). (3) **Comparación utilizando solo LOC:** gráfico de barras 10.000 vs. 25.000 LOC: **B parece 2,5 veces más grande.** (4) **Pero… ¿significa eso que el usuario recibe 2,5 veces más funcionalidad? No necesariamente:** un lenguaje, framework o biblioteca puede permitir expresar una funcionalidad utilizando menos código que otro. (5) **Idea clave:** LOC mide código producido, no directamente funcionalidad entregada al usuario. (6) **Conclusión:** por eso, comparar LOC entre tecnologías diferentes puede conducir a conclusiones incorrectas.

### Diapositiva 14

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Menos LOC: ¿significa mayor productividad?** (1) **Cuidado con la interpretación:** consideremos dos equipos que desarrollaron una funcionalidad equivalente: equipo A, tamaño 8.000 LOC con esfuerzo de 8 persona-mes; equipo B, 16.000 LOC con 8 persona-mes. (2) **Cálculo de la productividad** (LOC / persona-mes): equipo A, 8.000 ÷ 8 = **1.000 LOC/persona-mes**; equipo B, 16.000 ÷ 8 = **2.000 LOC/persona-mes**. (3) **Resultado según LOC:** el equipo B parece el doble de productivo. (4) **Pero ambos…** entregaron funcionalidad equivalente, utilizaron el mismo esfuerzo y podrían haber utilizado tecnologías diferentes. (5) **Entonces…** ¿realmente B fue más productivo? (6) **Mensaje clave:** *una métrica puede estar matemáticamente correcta y, aun así, ser interpretada incorrectamente.*

### Diapositiva 15

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Segundo problema: ¿cuándo conocemos las LOC?** (1) **Un nuevo proyecto:** un cliente llega hoy y solicita desarrollar un nuevo sistema: ¿cuánto esfuerzo requerirá? (2) **Nuestra respuesta inicial:** podríamos responder *«Necesitamos estimar su tamaño»* y decidimos utilizar LOC como medida de tamaño. (3) **Pero hay una paradoja:** el software todavía no existe: **¿cómo sabemos cuántas líneas de código tendrá?** Esta es una limitación importante de LOC como técnica de estimación temprana. (4) **Podemos estimar las LOC:** sí, podemos utilizar proyectos anteriores, experiencia, analogía, descomposición e información histórica. (5) **Una estimación sobre otra estimación:** LOC estimadas → esfuerzo estimado → duración estimada → costo estimado. (6) **Idea clave:** *mientras más temprano estamos en el proyecto, mayor puede ser la incertidumbre de una estimación basada en LOC.*

### Diapositiva 16

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Entonces… ¿LOC no sirve?** (1) **LOC puede ser muy útil cuando…** existe información histórica comparable (proyectos similares, misma organización, tecnologías semejantes); la tecnología está definida (conocemos lenguaje, framework y entorno); existen proyectos anteriores (podemos utilizar productividad histórica); el software ya está avanzado o construido (podemos medir el código real); queremos observar tendencias internas (por ejemplo LOC/persona-mes, defectos/KLOC, esfuerzo/KLOC). (2) **El problema no es LOC:** el problema aparece cuando **utilizamos LOC sin considerar el contexto**. (3) **Mensaje clave:** *una técnica de estimación no es buena o mala por sí sola. Su utilidad depende del problema, la información disponible y el momento del proyecto.*

### Diapositiva 17

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Desafío grupal: ¿confiarían en esta estimación? (7 minutos).** (1) **Contexto general:** una empresa debe evaluar tres proyectos; su gerente quiere utilizar LOC para estimar el esfuerzo de todos ellos. **Proyecto A, sistema interno:** la empresa desarrolló durante los últimos años 6 sistemas muy similares, todos con el mismo lenguaje, el mismo framework y equipos de características semejantes; además dispone de LOC reales, esfuerzo real, duración real y productividad histórica. **Proyecto B, nuevo producto:** la empresa nunca ha desarrollado un sistema similar; la tecnología acaba de ser seleccionada; los requisitos todavía están evolucionando; no existen datos históricos comparables. **Proyecto C, modernización:** existe un sistema antiguo de **80.000 LOC** que debe reconstruirse utilizando un nuevo lenguaje, un nuevo framework y una nueva arquitectura; las funcionalidades principales se mantendrán. (2) **Misión del grupo:** para A, B y C, clasifiquen el uso de LOC como *confiaríamos bastante*, *utilizaríamos con precaución* o *no lo utilizaríamos como medida principal*; cada decisión debe incluir una justificación técnica. (3) **Segunda parte, la trampa:** cuando hayan terminado, revelar: *«El gerente propone utilizar las 80.000 LOC del sistema antiguo del proyecto C como tamaño estimado del nuevo sistema.»* ¿Lo aceptan? Tienen 1 minuto para construir una respuesta grupal. (4) **Revisión (una clasificación razonable):** **A → confiaríamos bastante:** LOC puede resultar bastante útil porque existen datos históricos y condiciones comparables. **B → no como medida principal:** existe demasiada incertidumbre y poca evidencia para que LOC sea la medida principal en esta etapa. **C → con precaución:** las 80.000 LOC antiguas entregan información, pero no deberían trasladarse directamente al nuevo desarrollo porque cambian lenguaje, framework y arquitectura. (5) **Y ahora la pregunta importante:** los tres proyectos presentan un problema común: **necesitamos medir el software antes de tener todo el código.** Entonces, ¿podríamos medir lo que el sistema hace para el usuario, en lugar de medir cuánto código utilizamos para construirlo? → **Aquí aparecen los puntos de función.**

### Diapositiva 18

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Puntos de función: cambiemos la mirada.** (1) **De LOC a los puntos de función:** con LOC preguntábamos *«¿Cuánto código tendremos que construir?»*; ahora cambiaremos la pregunta: **«¿Qué funcionalidad debe entregar el software?»** (2) **¿Qué son los puntos de función?** Los puntos de función (FP) buscan medir el **tamaño funcional** del software a partir de aquello que el sistema **recibe** (información que ingresa al sistema), **entrega** (información que el sistema produce hacia el exterior), **permite consultar** (información que un usuario solicita), **mantiene** (información administrada por el propio sistema) y **utiliza desde otros sistemas** (información externa necesaria para su funcionamiento). (3) **Diferencia fundamental:** LOC mira principalmente **el código**; FP mira principalmente **la funcionalidad**. (4) **Idea clave:** *los puntos de función permiten aproximarnos al tamaño del software sin depender directamente del lenguaje de programación utilizado.*

### Diapositiva 19

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **¿Por qué FP puede ayudarnos antes de programar?** (1) **El software todavía no existe…** supongamos que un cliente solicita un sistema para administrar cursos de capacitación (*«Necesitamos un sistema para administrar cursos de capacitación»*). (2) **Sabemos que deberá permitir:** registrar participantes, registrar cursos, inscribir participantes, consultar inscripciones, emitir certificados y consultar información proveniente de un sistema externo. (3) **Pero todavía…** no hemos programado, no conocemos las LOC finales e incluso podríamos no haber decidido completamente la tecnología. Sin embargo, **ya conocemos parte de lo que el sistema debe hacer**; por lo tanto podemos comenzar a analizar su **tamaño funcional**. (4) **La lógica es:** requisitos (necesidades del cliente) → funciones del sistema (identificamos lo que el sistema deberá hacer) → clasificación (según su tipo: entradas, salidas, consultas, archivos, interfaces) → puntos de función (se asignan pesos y se calcula el total) → tamaño funcional estimado (resultado en FP). (5) **Mensaje clave:** *FP permite trabajar con información disponible mucho antes de que exista el código definitivo.*

### Diapositiva 20

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **Las 5 piezas que debemos aprender.** (1) **Los cinco tipos de funciones:**

| Sigla | Nombre | Pregunta sencilla | Descripción |
|---|---|---|---|
| EI | External Input | ¿Entra información que mantiene o modifica datos? | Información que ingresa al sistema para crear, actualizar o eliminar datos |
| EO | External Output | ¿El sistema genera información procesada hacia afuera? | Información que el sistema produce y envía hacia el exterior (por ejemplo, informes o certificados) |
| EQ | External Inquiry | ¿Se consulta información sin modificarla? | Información que un usuario solicita al sistema y se muestra sin modificar datos |
| ILF | Internal Logical File | ¿El sistema mantiene esta información? | Conjunto lógico de datos que el propio sistema almacena y administra |
| EIF | External Interface File | ¿Utilizamos información mantenida por otro sistema? | Conjunto lógico de datos que es mantenido por otro sistema y que nuestro sistema utiliza |

(2) **Dos grandes familias:** **funciones transaccionales**, que representan interacciones con el sistema (EI, EO, EQ), y **funciones de datos**, que representan conjuntos lógicos de información (ILF, EIF). (3) **Importante:** no queremos que memoricen solamente las siglas; quiero que puedan mirar un requerimiento y preguntarse **¿qué tipo de función estoy observando?**

### Diapositiva 21

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Primer acercamiento: miremos un sistema muy simple.** Una empresa necesita administrar sus capacitaciones. El sistema permite: (1) **registrar un participante** — el usuario ingresa los datos y el sistema los almacena (formulario *Nuevo participante* con nombre, RUT, correo y empresa) → **EI, entrada externa**; (2) **consultar un participante** — el usuario proporciona un criterio y obtiene información almacenada (búsqueda *Juan Pérez* con sus datos) → **EQ, consulta externa**; (3) **generar un informe de participantes por curso** — el sistema procesa información y genera un resultado (informe con participantes por curso: Excel básico 25, Python 18, Gestión de proyectos 12, Ciberseguridad 20) → **EO, salida externa**; (4) **mantener información de participantes** — los participantes son registrados y administrados por nuestro sistema (tabla de participantes) → **ILF, archivo lógico interno**; (5) **consultar datos de empresas desde otro sistema** — nuestra aplicación utiliza esa información, pero no la mantiene (consulta a un sistema corporativo externo por RUT de empresa) → **EIF, archivo de interfaz externa**. (6) **Observen algo importante:** en un mismo sistema podemos tener EI + EO + EQ + ILF + EIF… **y todavía no hemos escrito una sola línea de código.**

### Diapositiva 22

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Desafío grupal: los 5 detectives FP (7 minutos).** (1) **Situaciones a clasificar:** cada grupo (1, 2, 3, 5 y 6) deberá clasificar las siguientes situaciones; no basta con la sigla: deben poder explicar **¿por qué?** — **A)** un trabajador ingresa sus datos y el sistema los almacena (formulario *Nuevo trabajador*); **B)** un supervisor solicita visualizar los datos de un trabajador sin modificarlos; **C)** el sistema genera un informe mensual calculando cantidad de trabajadores por área (finanzas 25, operaciones 38, comercial 20, TI 15); **D)** el sistema mantiene permanentemente los datos de los trabajadores (datos personales, laborales, historial, etc.); **E)** el sistema consulta información de sucursales que pertenece a otra plataforma corporativa y que nuestra aplicación no puede modificar. (2) **Tu misión:** completen la tabla *situación / clasificación (EI, EO, EQ, ILF o EIF) / ¿por qué?*; deben llegar a una respuesta consensuada como grupo. (3) **Una regla importante:** cada grupo deberá elegir a un integrante diferente del que normalmente expone; ese estudiante será quien deberá defender una de las clasificaciones cuando yo la solicite.

### Diapositiva 23

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **Revisión, después de escuchar primero a los grupos:**

| Situación | Clasificación | ¿Por qué? | Elemento principal |
|---|---|---|---|
| A. Un trabajador ingresa sus datos y el sistema los almacena | EI, entrada externa | Ingresa información que mantiene/modifica datos internos | Datos ingresados y almacenados |
| B. Un supervisor solicita visualizar los datos de un trabajador sin modificarlos | EQ, consulta externa | Solicita y recupera información sin modificarla | Información mostrada en pantalla |
| C. El sistema genera un informe mensual calculando cantidad de trabajadores por área | EO, salida externa | Genera información de salida con procesamiento | Informe generado y enviado al usuario (exterior) |
| D. El sistema mantiene permanentemente los datos de los trabajadores | ILF, archivo lógico interno | Es información mantenida por nuestro propio sistema | Datos de trabajadores almacenados y administrados por nuestro sistema |
| E. El sistema consulta información de sucursales que pertenece a otra plataforma | EIF, archivo de interfaz externa | La información es utilizada por nuestra aplicación, pero es mantenida externamente | Datos de sucursales desde el sistema corporativo (externo) |

**Idea clave:** FP no consiste en contar pantallas, tablas o botones; consiste primero en **identificar correctamente las funciones del sistema**. **FP no consiste en…** contar pantallas, contar tablas ni contar botones.

### Diapositiva 24

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **EI: entrada externa (external input).** (1) **¿Qué es una entrada externa?** Una entrada externa (EI) ocurre cuando información proveniente desde fuera de la aplicación **entra al sistema** y su propósito principal es **mantener o modificar información interna**. Por ejemplo: registrar un cliente, modificar los datos de un cliente, registrar una solicitud, ingresar una orden, actualizar un producto o eliminar un registro. (2) **Ejemplo:** un usuario completa el formulario *Nuevo cliente* (nombre Ana Pérez, RUT 15.234.567-8, correo ana@email.cl) y presiona *Guardar*; el sistema registra esa información → **EI**. (3) **Cuidado:** que exista información ingresada por el usuario **no significa automáticamente que sea EI**. Por ejemplo, escribir un RUT solamente para buscar una persona (*Buscar cliente* → se muestra su información): RUT → buscar → mostrar información **no necesariamente** representa una EI. (4) **Pregunta clave:** *¿la información ingresada mantiene o modifica datos?* Si la respuesta es sí, probablemente estamos frente a una **EI**.

### Diapositiva 25

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **EQ: consulta externa (external inquiry).** (1) **¿Qué es una consulta externa?** Una consulta externa (EQ) permite recuperar información del sistema **sin modificar los datos**; normalmente existe solicitud → búsqueda → respuesta. Otros ejemplos: consultar una orden, buscar un trabajador, visualizar los datos de un producto, consultar el estado de una solicitud. (2) **Ejemplo:** el usuario ingresa un RUT (15.234.567-8) y selecciona *Buscar*; el resultado muestra nombre Ana Pérez, RUT, correo y estado activo: se muestra información almacenada y no se modificó ningún dato → **EQ**. (3) **Importante:** la consulta recupera información existente en el sistema y no mantiene ni modifica datos. **No es EQ:** si el usuario ingresa información para modificar o actualizar datos, no estamos frente a una consulta, sino posiblemente a una EI. (4) **Pregunta clave:** *¿solamente recuperamos información sin alterarla?* Si es así, podemos estar frente a una **EQ**.

### Diapositiva 26

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **EO: salida externa (external output).** (1) **¿Qué es una salida externa?** Una salida externa (EO) entrega información hacia fuera del sistema, pero existe algo adicional: **el sistema procesa la información para producir el resultado**. Puede involucrar, por ejemplo, cálculos, totales, agrupaciones, información derivada y procesamiento de datos. (2) **Ejemplo:** el usuario solicita un **informe mensual de ventas**; el sistema procesa las operaciones y entrega un *Informe mensual de ventas (abril 2025)*: 384 operaciones, ventas totales $28.450.000, venta promedio $74.089 y producto más vendido *Producto X*, con gráficos de barras y circular. Aquí no estamos simplemente recuperando un registro: **estamos generando información** → **EO**. (3) **Importante:** el sistema procesa la información antes de entregarla; puede incluir cálculos, totales y agrupaciones, y generar información derivada; el resultado se entrega al usuario o a otro sistema. **No es** simplemente mostrar un registro existente. (4) **Pregunta clave:** *¿el sistema procesa información para generar el resultado?* Si la respuesta es sí, probablemente estamos frente a una **EO**.

### Diapositiva 27

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **El gran problema: EO vs. EQ — ambas entregan información… entonces, ¿cómo las distinguimos?** **EQ (consulta externa):** principalmente recupera información existente; ejemplo *«Mostrar los datos del cliente 123»* (búsqueda por RUT que muestra datos que ya existen en el sistema; no se modificó información). **EO (salida externa):** produce una salida que implica procesamiento o información derivada; ejemplo *«Mostrar el total de compras realizadas por el cliente durante el año»* (*Informe anual de compras por cliente* 2025: 28 compras, total $3.450.000, compra promedio $123.214, mes con mayor compra noviembre; el sistema procesa la información para generar un resultado). **Comparación:**

| Pregunta | EQ (consulta externa) | EO (salida externa) |
|---|---|---|
| ¿Entrega información? | Sí | Sí |
| ¿Modifica información? | No | No |
| ¿Recupera principalmente datos existentes? | Sí | Puede hacerlo |
| ¿Genera información derivada/procesada? | No | Sí |
| ¿Puede involucrar cálculos? | Normalmente no | Sí |

**Truco conceptual:** preguntémonos *¿el sistema está principalmente **mostrando** información o está **produciendo** información?* Mostrar → EQ; producir / procesar → EO. Es una simplificación pedagógica, pero les ayudará mucho en este primer aproximación.

### Diapositiva 28

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Batalla FP: EI, EO o EQ (8 minutos).** Ahora ya no serán ejemplos tan evidentes. Los grupos 1, 2, 3, 5 y 6 deberán clasificar las siguientes situaciones como EI, EO o EQ; pero cada respuesta debe ser justificada. **Caso A:** un usuario ingresa el código de una encomienda y el sistema muestra fecha de recepción, estado y lugar donde se encuentra. **Caso B:** un supervisor modifica el estado de una encomienda desde *recibida* a *entregada* y guarda el cambio. **Caso C:** el administrador solicita *«Cantidad de encomiendas recibidas durante septiembre, agrupadas por día»*; el sistema procesa los registros y muestra los resultados (gráfico con un total de 1.245). **Caso D:** el usuario selecciona una fecha y el sistema muestra todas las encomiendas registradas ese día, con código, destinatario, hora y estado. **Caso E:** el administrador modifica el correo electrónico de un usuario. **Primera misión, 4 minutos:** cada grupo debe construir la tabla *caso / clasificación / razón* para los casos A a E. **Pero no pueden dividirse los casos:** todos los integrantes deben discutir los cinco y llegar a una respuesta común.

### Diapositiva 29

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **Solución** (hasta ahora hemos clasificado lo que entra y sale del sistema… pero…):

| Caso | Clasificación | Razón |
|---|---|---|
| A | EQ | Recupera información existente sin modificarla |
| B | EI | Información entra al sistema y modifica el estado almacenado |
| C | EO | Existe procesamiento y agrupación para producir el resultado |
| D | EQ | Recupera información existente de acuerdo con un criterio |
| E | EI | La operación modifica información mantenida por el sistema |

Pregunta siguiente: **¿dónde está la información que estamos registrando, consultando y procesando?** (registramos, consultamos y procesamos alrededor de una base de datos).

### Diapositiva 30

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **ILF: archivo lógico interno (internal logical file).** Un archivo lógico interno (ILF) representa un conjunto lógico de información que **nuestro sistema mantiene**; es decir, nuestra aplicación puede realizar operaciones que permiten administrar esa información (por ejemplo: crear, modificar, eliminar, mantener). **Ejemplo:** en un sistema de gestión de capacitaciones mantenemos **participantes** (tabla con RUT, nombre, correo, teléfono, fecha de nacimiento y estado); nuestro sistema permite registrar, modificar, eliminar y mantener; por lo tanto, **participantes = ILF**. **Otros posibles ILF** en el mismo sistema: cursos (información de los cursos que se imparten), inscripciones (relación de participantes con cursos), relatores (información de los docentes o relatores) y certificados (información de los certificados emitidos). **Pregunta clave:** *¿nuestro sistema es responsable de mantener esta información?* Si la respuesta es sí, probablemente estamos frente a un **ILF**.

### Diapositiva 31

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **EIF: archivo de interfaz externa (external interface file).** Un archivo de interfaz externa (EIF) representa un conjunto lógico de información que **nuestro sistema utiliza**, pero que **es mantenido por otro sistema**. Nuestra aplicación puede consultar la empresa, utilizar su nombre, su RUT y conocer su dirección, **pero no mantiene esa información**: si la empresa cambia de dirección, la modificación se realiza en el otro sistema; nuestra aplicación solamente utiliza esa información. **Ejemplo:** nuestro sistema de gestión de capacitaciones necesita información de empresas que envían participantes a los cursos; nuestro sistema consulta información del *sistema corporativo de empresas* (otro sistema), que mantiene RUT, nombre, dirección y otros datos. Entonces, **empresas = EIF**. **Pregunta clave:** *¿nuestro sistema utiliza esta información, pero otro sistema es responsable de mantenerla?* Si la respuesta es sí, probablemente estamos frente a un **EIF**. **Idea central:** ILF = lo mantenemos nosotros; EIF = lo mantiene otro sistema. **Resumen comparativo:**

| Elemento | ¿Quién mantiene la información? | ¿Nuestro sistema la administra? | Ejemplo |
|---|---|---|---|
| ILF | Nuestro sistema | Sí | Participantes, inscripciones, cursos, relatores |
| EIF | Otro sistema | No | Empresas (consultadas desde un sistema corporativo) |

**Importante:** un EIF también es un conjunto lógico de información, al igual que un ILF, pero la diferencia está en quién es responsable de mantener esos datos.

### Diapositiva 32

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **ILF vs. EIF: el mismo dato puede cambiar.** **No clasificamos por el nombre del dato:** un mismo dato puede ser ILF o EIF, dependiendo de quién es responsable de mantener esa información. Supongamos que tenemos **información de empleados**. **Escenario A:** nuestro sistema permite registrar empleados, modificar sus datos, cambiar su estado y eliminar empleados (pantalla *Gestión de empleados*); entonces **empleados → ILF**. **Escenario B:** los empleados son administrados por el sistema corporativo de recursos humanos; nuestra aplicación solamente consulta RUT, nombre, cargo y unidad; entonces **empleados → EIF**. **¡Es la misma información!** Pero su clasificación cambia según **¿quién la mantiene?** **Mensaje clave:** *ILF y EIF no describen qué tipo de información es; describen la relación de nuestro sistema con esa información.*

### Diapositiva 33

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Ahora conectemos las 5 piezas: ¿cómo se relacionan EI, EO, EQ, ILF y EIF?** Imaginemos un sistema que administra **solicitudes de mantención de equipos industriales**: (1) **registrar solicitud** — el usuario ingresa una nueva solicitud de mantención (formulario *Nueva solicitud* con equipo, descripción y prioridad) → **EI**; la información queda almacenada en **solicitudes (ILF)**. (2) **Consultar solicitud** — el usuario ingresa el número de solicitud (2025-0045) y visualiza su estado → **EQ**; consulta **solicitudes (ILF)**. (3) **Informe mensual** — el sistema calcula solicitudes recibidas (124), solicitudes resueltas (98) y tiempo promedio de resolución (3,4 días) → **EO**; procesa información de **solicitudes (ILF)**. (4) **Información de equipos** — los datos maestros de los equipos provienen de otra plataforma corporativa; nuestro sistema los utiliza, pero no los mantiene (el sistema corporativo mantiene la información de equipos; nuestro sistema solo la utiliza) → **EIF**. **Funciones transaccionales** (EI, EO, EQ) representan **¿qué hace el sistema?**; **funciones de datos** (ILF, EIF) representan **¿con qué información trabaja?**

### Diapositiva 34

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Desafío grupal: ¿de quién son los datos? (8 minutos).** Una empresa desarrolla un sistema para administrar **operaciones de un terminal portuario**; el sistema trabaja con cinco conjuntos de información y los grupos 1, 2, 3, 5 y 6 deberán determinar **¿ILF o EIF?** (pero por ahora deberán leer cuidadosamente cada situación): **A. Operaciones** — el sistema permite crear una operación, modificarla, cambiar su estado y cerrarla. **B. Trabajadores** — la información oficial de trabajadores pertenece al sistema corporativo de Recursos Humanos; nuestro sistema solamente consulta RUT, nombre, cargo y empresa. **C. Vehículos** — nuestro sistema registra los vehículos autorizados, permite modificar sus antecedentes y desactivarlos. **D. Empresas transportistas** — la información es mantenida por una plataforma externa de proveedores; nuestro sistema la consulta para asociarla a una operación. **E. Incidencias** — los usuarios de nuestro sistema registran incidencias, modifican su estado y agregan observaciones. **Primera misión, 4 minutos:** construyan una sola respuesta grupal en la tabla *información / ILF o EIF / ¿quién la mantiene?*; todos los integrantes deben discutir los cinco casos y llegar a una respuesta común.

### Diapositiva 35

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **Solución del desafío — operaciones de un terminal portuario:**

| Información | ILF / EIF | ¿Quién la mantiene? |
|---|---|---|
| A. Operaciones | ILF | Nuestro sistema registra, modifica, cambia el estado y cierra las operaciones |
| B. Trabajadores | EIF | Otro sistema (Recursos Humanos) mantiene la información; nuestro sistema solo la consulta |
| C. Vehículos | ILF | Nuestro sistema registra, modifica los antecedentes y desactiva los vehículos |
| D. Transportistas | EIF | Otro sistema (plataforma de proveedores) mantiene la información; nuestro sistema solo la consulta |
| E. Incidencias | ILF | Nuestro sistema registra incidencias, modifica su estado y agrega observaciones |

**Mensaje final:** *cuando cambia quién mantiene los datos, puede cambiar también el tamaño funcional del software.* **Ejemplo, transportistas:** antes era **EIF** (otro sistema mantenía la información); ahora es **ILF** (nuestro sistema pasa a ser responsable de mantenerla). **Ya sabemos identificar las 5 piezas…** (EI, EO, EQ, ILF, EIF), pero hasta ahora solamente las hemos **identificado y clasificado**: **¿todas valen lo mismo?**

### Diapositiva 36

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **¿Todas las funciones tienen el mismo tamaño? No todas las funciones son iguales** (ya podemos identificar EI, EO, EQ, ILF y EIF). **EI, caso A: registrar una categoría** — formulario *Nueva categoría* con código (CAT001) y nombre (Repuestos); datos que se registran: código y nombre. Esta función es una **EI**. **EI, caso B: registrar una orden** — formulario *Nueva orden* con cliente, fecha, productos (cantidad, precio, descuento), dirección, forma de pago y observaciones; datos que se registran: cliente, fecha, productos, cantidades, precios, descuentos, dirección, forma de pago y observaciones. Esta función también es una **EI**. **Las dos son EI, pero… ¿representan la misma complejidad funcional? No necesariamente:** ambas son entradas externas, pero tienen distinta cantidad y tipo de datos, por lo que pueden tener diferente complejidad. Por eso, en el análisis de puntos de función, las funciones pueden clasificarse según su complejidad como **baja, media o alta**. **Idea clave:** *no basta con contar cuántas funciones existen; también debemos considerar su complejidad.*

### Diapositiva 37

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **Los pesos de los puntos de función — cada tipo de función tiene un peso, según su complejidad:**

| Tipo de función | Baja | Media | Alta |
|---|---:|---:|---:|
| EI (entrada externa) | 3 | 4 | 6 |
| EO (salida externa) | 4 | 5 | 7 |
| EQ (consulta externa) | 3 | 4 | 6 |
| ILF (archivo lógico interno) | 7 | 10 | 15 |
| EIF (archivo de interfaz externa) | 5 | 7 | 10 |

**Ejemplos de cálculo:** una EI de complejidad baja (*Nueva categoría*): 1 × 3 = **3 PF**; una EO de complejidad alta (*Informe de ventas*): 1 × 7 = **7 PF**; un ILF de complejidad media (*Productos*): 1 × 10 = **10 PF**. **Proceso general:** (1) identificar las funciones del sistema → (2) clasificar el tipo de función (EI, EO, EQ, ILF, EIF) → (3) ponderar según su complejidad (baja, media, alta) → (4) sumar los puntos de función (PF) totales. **Importante:** no es necesario memorizar esta tabla; la tabla se consulta cuando se realiza el análisis.

### Diapositiva 38

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **¿Cómo determinamos la complejidad? No se decide «a ojo»:** la complejidad funcional se determina considerando características de la función. **Funciones transaccionales (EI, EO, EQ):** se consideran principalmente (1) **DET — data element types**: datos elementales reconocibles por el usuario que atraviesan la frontera de la aplicación (ejemplos: código, nombre, fecha, monto, estado, dirección, tipo de documento, cantidad, precio, observaciones…); (2) **FTR — file types referenced**: archivos lógicos (ILF o EIF) que la transacción utiliza o mantiene (ejemplos: ILF clientes, ILF órdenes, ILF productos, EIF empresas externo, EIF empleados externo). **Funciones de datos (ILF, EIF):** se utilizan (1) **DET**: datos elementales reconocibles por el usuario que forman parte del archivo lógico (ejemplos: código, nombre, fecha de creación, estado, tipo…); (2) **RET — record element types**: subgrupos lógicos reconocibles dentro del archivo (ejemplos: datos generales, información de contacto, dirección, datos financieros, historial…). **Resumen:**

| Tipo de función | Complejidad según |
|---|---|
| EI (entrada externa) | DET + FTR |
| EO (salida externa) | DET + FTR |
| EQ (consulta externa) | DET + FTR |
| ILF (archivo lógico interno) | DET + RET |
| EIF (archivo de interfaz externa) | DET + RET |

**Mensaje clave:** *la complejidad no depende de cuánto código creemos que se necesitará, sino de la estructura funcional que estamos midiendo.* **Ejemplos de aplicación:** EI *registrar una orden* — DET: cliente, fecha, productos, cantidades, precios, descuentos, dirección, forma de pago…; FTR: ILF órdenes, ILF clientes, ILF productos, EIF transportistas; se determina la complejidad según la cantidad de DET y FTR. ILF *productos* — DET: código, nombre, precio, stock, estado…; RET: datos generales, información adicional, datos comerciales, datos de stock, historial; se determina la complejidad según la cantidad de DET y RET.

### Diapositiva 39

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **Primer cálculo de puntos de función — construyamos nuestro primer resultado.** **Resultado del análisis funcional:**

| Tipo | Cantidad | Complejidad | Peso (según tabla) | Resultado (cantidad × peso) |
|---|---:|---|---:|---:|
| EI | 4 | Baja | 3 | 12 |
| EO | 2 | Media | 5 | 10 |
| EQ | 3 | Baja | 3 | 9 |
| ILF | 2 | Media | 10 | 20 |
| EIF | 1 | Baja | 5 | 5 |

**Cálculo total:** 12 + 10 + 9 + 20 + 5 = **56 PF**. **¿Qué significa?** El resultado se denomina **puntos de función no ajustados**; significa que el tamaño funcional calculado del sistema es 56 PF. **No significa:** 56 horas, 56 días, 56 personas ni $56 millones; los PF no se traducen directamente en tiempo, personas o dinero. **Para estimar esfuerzo o costo** se necesita información adicional, como productividad histórica del equipo, modelos de estimación y factores propios del proyecto. **Conexión con la semana 5:** 56 PF es **tamaño funcional**; aún no es costo, esfuerzo, plazo ni presupuesto.

### Diapositiva 40

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Desafío grupal: construyan el tamaño (8 minutos).** (1) **Datos del ejercicio:** una empresa analizó funcionalmente un nuevo sistema y obtuvo: **EI** (entradas externas): 5 EI de complejidad baja y 2 EI de complejidad media; **EO** (salidas externas): 2 EO de complejidad media y 1 EO de complejidad alta; **EQ** (consultas externas): 4 EQ de complejidad baja; **ILF** (archivos lógicos internos): 2 ILF de complejidad media; **EIF** (archivos de interfaz externa): 1 EIF de complejidad baja. (2) **Misión 1, calculen:** cada grupo debe construir su propia tabla (tipo, cantidad, complejidad, peso según tabla y PF = cantidad × peso) utilizando la tabla de pesos de puntos de función vista en clases. **Regla:** no pueden dar solamente el resultado final; debe quedar visible cómo llegaron a él. (3) **Misión 2, interpreten:** cuando obtengan el resultado deben responder en su grupo: ¿qué representa ese número?; ¿podemos transformarlo inmediatamente en meses?; ¿podemos transformarlo inmediatamente en pesos?; ¿qué información adicional necesitaríamos?

### Diapositiva 41

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **Solución del desafío grupal — construyan el tamaño (cálculo de puntos de función).** (1) **Datos del ejercicio:** 5 EI de complejidad baja y 2 EI media; 2 EO media y 1 EO alta; 4 EQ baja; 2 ILF media; 1 EIF baja. (2) **Tabla de cálculo de puntos de función:**

| Tipo | Cantidad | Complejidad | Peso | PF (cantidad × peso) |
|---|---:|---|---:|---:|
| EI | 5 | Baja | 3 | 5 × 3 = 15 |
| EI | 2 | Media | 4 | 2 × 4 = 8 |
| EO | 2 | Media | 5 | 2 × 5 = 10 |
| EO | 1 | Alta | 7 | 1 × 7 = 7 |
| EQ | 4 | Baja | 3 | 4 × 3 = 12 |
| ILF | 2 | Media | 10 | 2 × 10 = 20 |
| EIF | 1 | Baja | 5 | 1 × 5 = 5 |
| **Total** | | | | **77 PF** |

(3) **Desglose del cálculo:** EI (5 × 3) + (2 × 4) = 15 + 8 = **23 PF**; EO (2 × 5) + (1 × 7) = 10 + 7 = **17 PF**; EQ 4 × 3 = **12 PF**; ILF 2 × 10 = **20 PF**; EIF 1 × 5 = **5 PF**; total = 23 + 17 + 12 + 20 + 5 = **77 PF**. (4) **Interpretación del resultado:** ¿qué representa ese número? El tamaño funcional del sistema, calculado en puntos de función no ajustados; en este caso, el tamaño es de 77 PF. ¿Podemos transformarlo inmediatamente en meses? **No**: los puntos de función no se pueden transformar directamente en meses. ¿Inmediatamente en pesos? **No**: no se pueden transformar directamente en pesos. ¿Qué información adicional necesitaríamos? Productividad histórica del equipo (PF por mes), modelo de estimación de esfuerzo (por ejemplo, PF → horas), costos de recursos (personas, infraestructura, herramientas) y otros factores del proyecto (complejidad técnica, riesgos, etc.).

### Diapositiva 42

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **DET: ¿cuántos datos reconoce el usuario?** (1) **DET — data element type:** un DET es un dato elemental, reconocible por el usuario y no repetido, que participa en la función que estamos analizando. (2) **Ejemplo: registrar proveedor** — el usuario ingresa RUT, razón social, dirección, teléfono, correo electrónico y categoría (formulario *Registrar proveedor*): tenemos **6 DET**. (3) **No contamos** elementos técnicos que el usuario no reconoce como parte de su información funcional: variables internas, índices técnicos, campos auxiliares creados por programación ni información de control puramente técnica. (4) **Otro ejemplo, consulta:** una consulta solicita el *RUT del proveedor* y entrega razón social, dirección, teléfono, correo y estado (tabla *Resultado de la consulta*). (5) **Idea clave:** *«DET nos ayuda a observar cuánta información funcional participa en una operación o conjunto de datos.»* **No es contar variables del programa**: es analizar los datos desde una perspectiva **funcional**.

### Diapositiva 43

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **FTR: ¿con cuántos archivos lógicos interactúa?** (1) **FTR — file type referenced:** para EI, EO y EQ, además de los DET, debemos identificar los FTR; un FTR corresponde a un ILF o EIF referenciado por la transacción. (2) **Ejemplo: registrar orden de compra** — la operación trabaja con los archivos lógicos **órdenes (ILF)**, **productos (ILF)** y **proveedores (EIF)**: la transacción referencia **3 FTR**. (3) **Entonces…** para analizar la complejidad de una función transaccional observamos **DET** (datos elementales reconocibles por el usuario) + **FTR** (archivos lógicos internos o externos referenciados, ILF o EIF). (4) **Preguntas que debemos hacernos:** ¿cuántos datos funcionales participan? → DET; ¿cuántos archivos lógicos internos o externos son referenciados? → FTR. (5) **Mensaje clave:** *«No estamos midiendo código. Estamos midiendo la estructura funcional de la transacción.»*

### Diapositiva 44

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **¿Cómo clasificamos una EI?** (1) **Complejidad de una entrada externa:** para una EI combinamos FTR (archivos lógicos referenciados, ILF o EIF) + DET (datos elementales reconocibles por el usuario), con la siguiente matriz:

| FTR (ILF o EIF referenciados) | 1–4 DET | 5–15 DET | 16 o más DET |
|---|---|---|---|
| 0–1 FTR | Baja | Baja | Media |
| 2 FTR | Baja | Media | Alta |
| 3 o más FTR | Media | Alta | Alta |

(2) **Ejemplo:** una EI tiene 9 DET y 2 FTR: buscamos 9 DET → columna 5–15; 2 FTR → segunda fila; resultado: **complejidad media**. (3) **Ponderación de una EI:** baja 3, media 4, alta 6; por lo tanto, **esa EI aporta 4 PF**. (4) **Secuencia para clasificar una EI:** identificar la EI → contar DET → contar FTR → consultar matriz → obtener complejidad → asignar peso.

### Diapositiva 45

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **EO y EQ: misma lógica, distintos umbrales.** (1) **Matriz de complejidad para EO y EQ:** EO y EQ también utilizan DET + FTR, pero su matriz de complejidad es:

| FTR (ILF o EIF referenciados) | 1–5 DET | 6–19 DET | 20 o más DET |
|---|---|---|---|
| 0–1 FTR | Baja | Baja | Media |
| 2–3 FTR | Baja | Media | Alta |
| 4 o más FTR | Media | Alta | Alta |

(2) **Ejemplo, un informe:** utiliza 14 DET y referencia 3 FTR: buscamos 14 DET → columna 6–19; 3 FTR → fila 2–3; resultado: **complejidad media**. (3) **Ponderación según el tipo de función:** una vez obtenida la complejidad, aplicamos el peso que corresponda: EO (salidas externas) baja 4, media 5, alta 7; EQ (consultas externas) baja 3, media 4, alta 6. (4) **Resultado del ejemplo:** si es **EO media**, su peso será **5 PF**; si es **EQ media**, su peso será **4 PF**. (5) **Observen:** tener los mismos DET + FTR no significa necesariamente aportar los mismos PF, porque EO ≠ EQ y cada tipo posee su propia ponderación. (6) **Idea central:** *«Primero determinamos el tipo de función; después su complejidad; finalmente aplicamos su peso.»*

### Diapositiva 46

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Desafío grupal: ahora ustedes deciden la complejidad (8 minutos).** Esta vez **no** les entregaré la complejidad; los grupos 1, 2, 3, 5 y 6 deberán determinarla. **Función A — EI, registrar solicitud de compra:** posee 12 DET y 2 FTR: ¿baja, media o alta? ¿Cuántos PF aporta? **Función B — EO, generar resumen de operaciones:** posee 22 DET y 3 FTR: ¿baja, media o alta? ¿Cuántos PF aporta? **Función C — EQ, consultar datos de una solicitud:** posee 5 DET y 1 FTR: ¿baja, media o alta? ¿Cuántos PF aporta? La lámina incluye la matriz de complejidad de EI, la de EO y EQ, y la ponderación según tipo y complejidad (EI 3/4/6; EO 4/5/7; EQ 3/4/6). **Completen la tabla** *función / DET / FTR / complejidad / peso / PF* (A–EI: 12 y 2; B–EO: 22 y 3; C–EQ: 5 y 1). **No basta con el resultado:** cuando un grupo responda deberá indicar *«Utilizamos esta fila y esta columna de la matriz porque…»*.

### Diapositiva 47

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **Revisión — solución paso a paso.** **Función A — EI, registrar solicitud de compra** (12 DET, 2 FTR): en la matriz de complejidad de EI, 12 DET → columna 5–15 DET y 2 FTR → fila 2 FTR; resultado **complejidad media**; ponderación EI media = 4; resultado función A: **EI media → 4 PF**. **Función B — EO, generar resumen de operaciones** (22 DET, 3 FTR): en la matriz de EO y EQ, 22 DET → columna 20 o más DET y 3 FTR → fila 2–3 FTR; resultado **complejidad alta**; ponderación EO alta = 7; resultado función B: **EO alta → 7 PF**. **Función C — EQ, consultar datos de una solicitud** (5 DET, 1 FTR): en la matriz de EO y EQ, 5 DET → columna 1–5 DET y 1 FTR → fila 0–1 FTR; resultado **complejidad baja**; ponderación EQ baja = 3; resultado función C: **EQ baja → 3 PF**. **Resumen de resultados:**

| Función | Tipo | DET | FTR | Complejidad | Peso | PF |
|---|---|---:|---:|---|---:|---:|
| A — Registrar solicitud de compra | EI | 12 | 2 | Media | 4 | 4 |
| B — Generar resumen de operaciones | EO | 22 | 3 | Alta | 7 | 7 |
| C — Consultar datos de una solicitud | EQ | 5 | 1 | Baja | 3 | 3 |

**Total de puntos de función:** 4 + 7 + 3 = **14 PF**.

### Diapositiva 48

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **RET: la pieza que nos faltaba.** (1) **¿Qué es RET?** RET (record element type): un RET representa un subgrupo lógico de datos reconocible por el usuario dentro de un ILF o EIF. (2) **¿Cuándo se utiliza?** Para determinar la complejidad de ILF y EIF; en ILF y EIF ya no utilizamos FTR (✗), sino **DET + RET** (✓). (3) **¿Qué es un DET?** Un DET es un dato elemental, reconocible por el usuario, que participa en la función que estamos analizando. (4) **Ejemplo, ILF personas:** supongamos un ILF llamado *personas* que contiene información diferenciada en los siguientes subgrupos lógicos: **datos personales** (RUT, nombre, fecha de nacimiento) → 1 RET; **datos de contacto** (teléfono, correo, dirección) → 2 RET; **datos laborales** (cargo, unidad, fecha de ingreso) → 3 RET. En este ejemplo identificamos 3 subgrupos lógicos de datos; por lo tanto, **3 RET**. (5) **¿Qué no es un RET?** Un RET no significa cantidad de registros, cantidad de filas de una tabla ni cantidad de personas almacenadas. (6) **Idea clave:** *RET representa agrupaciones lógicas de datos, no cantidad de registros almacenados.* **En resumen:** DET = datos elementales reconocibles por el usuario; RET = subgrupo lógico de datos reconocible por el usuario.

### Diapositiva 49

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **Complejidad de ILF y EIF — utilizamos DET + RET.** (1) **¿Qué utilizamos?** Para determinar la complejidad de un ILF o EIF utilizamos DET (datos elementales) + RET (subgrupos lógicos). (2) **Matriz de complejidad (ILF y EIF):**

| RET (subgrupos lógicos) | 1–19 DET | 20–50 DET | 51 o más DET |
|---|---|---|---|
| 1 RET | Baja | Baja | Media |
| 2–5 RET | Baja | Media | Alta |
| 6 o más RET | Media | Alta | Alta |

(3) **Ejemplo:** tenemos un ILF (archivo lógico de personas) con 35 DET y 3 RET: 35 DET → columna 20–50; 3 RET → fila 2–5; resultado: **complejidad media**. (4) **Ponderación (ILF):** baja 7, media 10, alta 15; por lo tanto, **este ILF aporta 10 PF**. (5) **Secuencia para determinar la complejidad:** identificar ILF o EIF → contar DET → identificar RET → consultar matriz → determinar complejidad → asignar peso.

### Diapositiva 50

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Misma complejidad, distinto peso — ILF y EIF no pesan igual.** (1) **Archivo A — ILF:** 35 DET y 3 RET. (2) **Archivo B — EIF:** 35 DET y 3 RET. (3) **Matriz de complejidad (ILF y EIF):** la misma matriz RET × DET de la lámina anterior. (4) **Determinación de la complejidad:** archivo A, 35 DET → columna 20–50 y 3 RET → fila 2–5: **complejidad media**; archivo B, 35 DET → columna 20–50 y 3 RET → fila 2–5: **complejidad media**. (5) **Ponderación según tipo y complejidad:** ILF (archivos lógicos internos) baja 7, media 10, alta 15; EIF (archivos lógicos externos) baja 5, media 7, alta 10. (6) **Resultado para cada archivo:** ILF archivo A, complejidad media → **10 PF**; EIF archivo B, complejidad media → **7 PF**. (7) **¿Por qué?** En el ILF, nuestro sistema es responsable de mantener la información; en el EIF, nuestro sistema utiliza la información, pero su mantenimiento corresponde a otro sistema. (8) **Idea clave:** complejidad y ponderación son conceptos relacionados, pero diferentes: primero determinamos la complejidad; después aplicamos el peso según el tipo de función.

### Diapositiva 51

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Procedimiento completo para estimar puntos de función — de requisitos a tamaño funcional.** (1) **Identificar las funciones:** analizar los requisitos y seleccionar las funciones de tipo EI (entrada externa: ingresa datos o mantiene información), EO (salida externa: genera salidas con lógica de negocio), EQ (consulta externa: recupera datos sin lógica compleja), ILF (archivo lógico interno: información mantenida por nuestro sistema) y EIF (archivo lógico externo: información utilizada por nuestro sistema, pero mantenida por otro sistema). (2) **Determinar su complejidad:** utilizamos distintas matrices según el tipo de función: matriz para EI (usa DET + FTR), matriz para EO y EQ (usa DET + FTR) y matriz para ILF y EIF (usa DET + RET). (3) **Determinar el peso:** según el tipo de función y su complejidad aplicamos el peso de la tabla (EI 3/4/6, EO 4/5/7, EQ 3/4/6, ILF 7/10/15, EIF 5/7/10). (4) **Multiplicar cantidad × peso:** para cada tipo de función multiplicamos la cantidad identificada por su peso; ejemplo: EI 3 × 4 = 12; EO 2 × 5 = 10; EQ 4 × 4 = 16; ILF 2 × 10 = 20; EIF 1 × 7 = 7. (5) **Sumar:** sumamos los puntos de función de todas las funciones para obtener el tamaño funcional no ajustado: 12 + 10 + 16 + 20 + 7 = **65 puntos de función no ajustados (PFNA)**. **Resumen del procedimiento:** requisitos (analizar los requisitos del sistema) → funciones (identificar EI, EO, EQ, ILF y EIF) → complejidad (determinarla usando las matrices correspondientes) → pesos (aplicar el peso según el tipo de función) → PF (multiplicar cantidad × peso y sumar) → tamaño funcional (obtener los puntos de función no ajustados).

### Diapositiva 52

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Desafío grupal: integremos todo (10 minutos).** Ahora los grupos 1, 2, 3, 5 y 6 deberán resolver un pequeño análisis completo. Una plataforma para administrar **producciones teatrales** presenta las siguientes funciones: **función A** — registrar una nueva producción (tipo EI, 8 DET, 2 FTR); **función B** — generar un informe de costos de una producción, incluyendo totales y diferencias respecto del presupuesto (tipo EO, 18 DET, 3 FTR); **función C** — consultar los antecedentes de una producción sin realizar cálculos (tipo EQ, 5 DET, 1 FTR); **función D** — la información de producciones es mantenida por nuestra aplicación (tipo ILF, 32 DET, 3 RET); **función E** — la información oficial de recintos pertenece a una plataforma externa y nuestro sistema solamente la consulta (tipo EIF, 18 DET, 1 RET). **Misión 1:** determinen la complejidad, el peso y los PF de cada función completando la tabla *función / tipo / DET / FTR o RET / complejidad / peso / PF*. **¿Cuál es el tamaño funcional total?**

### Diapositiva 53

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **Solución: desafío grupal — producciones teatrales (tamaño funcional total 27 PF).** **Resultado del análisis:**

| Función | Tipo | DET | FTR / RET | Cómo se determina la complejidad (fila y columna de la matriz) | Complejidad | Peso | PF |
|---|---|---:|---|---|---|---:|---:|
| A | EI | 8 | 2 FTR | EI → 2 FTR (fila 2–3); 8 DET (columna 5–15) | Media | 4 | 4 |
| B | EO | 18 | 3 FTR | EO → 3 FTR (fila 2–3); 18 DET (columna 6–19) | Media | 5 | 5 |
| C | EQ | 5 | 1 FTR | EQ → 1 FTR (fila 0–1); 5 DET (columna 1–5) | Baja | 3 | 3 |
| D | ILF | 32 | 3 RET | ILF → 3 RET (fila 2–5); 32 DET (columna 20–50) | Media | 10 | 10 |
| E | EIF | 18 | 1 RET | EIF → 1 RET (fila 1); 18 DET (columna 1–19) | Baja | 5 | 5 |

**Tamaño funcional total (puntos de función no ajustados): 27 PF.** En la lámina, la fila de la función A dice «fila 2–3», aunque en la matriz de EI la fila de 2 FTR es simplemente «2 FTR»; el resultado (media) no cambia.

### Diapositiva 54

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Dos formas de mirar el tamaño.** **LOC, líneas de código** — pregunta principalmente **¿cuánto código?**: mide el tamaño utilizando líneas de código y normalmente se expresa en KLOC (miles de líneas de código). **Puntos de función** — pregunta principalmente **¿cuánta funcionalidad?**: analiza las funciones del sistema (EI, EO, EQ, ILF y EIF), considerando además su **complejidad**. **Diferencia fundamental:** LOC va de código → tamaño y se basa en la cantidad de líneas de código escritas; FP va de requisitos → funciones → tamaño funcional y se basa en los requisitos del sistema, las funciones identificadas y su complejidad. **Mensaje clave:** *ambas técnicas intentan ayudarnos a estimar tamaño, pero observan el software desde perspectivas diferentes.*

### Diapositiva 55

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **LOC vs. FP: comparemos — ¿cuándo puede ser más útil cada uno?**

| Característica | LOC (líneas de código) | FP (puntos de función) |
|---|---|---|
| Se basa directamente en código | Sí | No |
| Se basa en funcionalidad | No | Sí |
| Depende del lenguaje/tecnología | Sí | Mucho menos |
| Puede aplicarse antes de programar | Debemos estimar LOC | Sí |
| Facilita usar productividad histórica | Sí | Sí |
| Permite comparar tecnologías diferentes | Limitado | Mejor |
| Requiere identificar funciones | No | Sí |
| Requiere criterios de clasificación | No | Sí |

**Pero cuidado:** no debemos concluir *«FP es bueno y LOC es malo»*; la pregunta correcta es **¿qué técnica es más adecuada para este contexto?** **Por ejemplo, LOC puede ser muy útil cuando** una organización posee muchos proyectos históricos desarrollados con tecnologías similares, equipos comparables y reglas de conteo consistentes. **FP puede ser más conveniente cuando** necesitamos estimar y todavía no existe código, tenemos requisitos funcionales y la tecnología podría cambiar. **Idea central:** *el método debe ser coherente con la información disponible.*

### Diapositiva 56

#### CONTENIDOS

**Contenido visual de la lámina:**

Infografía **¿Podemos utilizar ambos? LOC y FP no tienen que ser rivales.** (1) **Información histórica de la organización:** una organización puede mantener información histórica como:

| Proyecto | FP | LOC reales | Esfuerzo real |
|---|---:|---:|---|
| A | 120 | 18.000 | 12 persona-mes |
| B | 150 | 23.000 | 16 persona-mes |
| C | 100 | 15.500 | 10 persona-mes |

(2) **Podemos obtener productividad:** a partir de los datos históricos es posible calcular indicadores de productividad, por ejemplo **PF/persona-mes** (mide cuántos puntos de función puede desarrollar un equipo) y **LOC/persona-mes** (mide cuántas líneas de código puede desarrollar un equipo). (3) **También podemos analizar relaciones históricas:** con la información de varios proyectos podemos observar relaciones entre FP (tamaño funcional), LOC (líneas de código) y esfuerzo (persona-mes). (4) **Ejemplo de estimación:** si proyectos comparables muestran aproximadamente **10 PF/persona-mes** y un nuevo proyecto tiene **150 PF**, podríamos obtener una primera aproximación: 150 PF ÷ 10 PF/persona-mes = **15 persona-mes**. (5) **Pero… aspectos importantes:** 15 persona-mes ≠ 15 meses: el esfuerzo expresado en persona-mes corresponde a la cantidad total de trabajo, sin considerar la cantidad de personas ni la duración del proyecto; tampoco significa automáticamente que 5 personas = 3 meses: la combinación de personas y duración depende de múltiples factores (organización, disponibilidad, restricciones, etc.). (6) **Del tamaño al costo, una cadena de análisis:** el tamaño (en LOC o en FP) es solo el primer paso; luego se requiere analizar tamaño (¿cuánto vamos a construir?) → esfuerzo (persona-mes: ¿cuánto trabajo se requiere?) → duración (meses: ¿en cuánto tiempo?) → recursos (personas: ¿cuántas personas?) → costo (US$ / CLP: ¿cuál es el presupuesto?). **Idea central:** *cada método entrega información valiosa y puede utilizarse de manera complementaria.*

### Diapositiva 57

#### CONTENIDOS

**Contenido visual de la lámina:** Infografía **Lo que deben saber hacer al terminar esta clase** — frente a un proyecto de software deberían ser capaces de: (1) **comprender el problema** — ¿qué debe hacer realmente el sistema?; (2) **identificar funciones** — EI, EO, EQ, ILF y EIF; (3) **analizar complejidad** — para EI, EO y EQ con DET + FTR, y para ILF y EIF con DET + RET; (4) **aplicar los pesos** — baja, media o alta; (5) **calcular** puntos de función; (6) **interpretar** — ¿qué significa el resultado?; (7) **comparar** LOC vs. FP; (8) **decidir** — ¿qué técnica resulta más apropiada para el contexto? **Pero sobre todo…** no quiero que aprendan *«una tabla y una fórmula»*; quiero que sean capaces de explicar **por qué tomaron cada decisión**. Porque en ingeniería de software: *«Un número sin supuestos, contexto y justificación puede producir una estimación engañosa.»*

### Diapositiva 58

**Contenido visual de la lámina:** Infografía **No estimamos para adivinar. Estimamos para tomar mejores decisiones.** Seis pasos: (1) **requisitos** — ¿qué debe hacer el sistema? ¿Qué funcionalidades se requieren?; (2) **tamaño** — se estima el tamaño del software (por ejemplo: puntos de función o líneas de código); (3) **esfuerzo** — se estima el esfuerzo necesario (por ejemplo: persona-mes); (4) **duración** — se define la duración estimada del proyecto (por ejemplo: meses); (5) **recursos** — se determinan los recursos necesarios (por ejemplo: cantidad de personas y sus perfiles); (6) **costo** — se obtiene una estimación del costo total del proyecto. Mensaje: *una estimación bien fundamentada nos permite planificar, priorizar y gestionar mejor.*

### Diapositiva 59

#### PRÓXIMA CLASE

¿CÓMO MEDIMOS EL TAMAÑO DEL SOFTWARE?

PASAREMOS DE ESTIMAR A MEDIR Hasta ahora aprendimos que:

TAMAÑO → ESFUERZO → DURACIÓN → RECURSOS → COSTO

**Contenido visual de la lámina:** Lámina de texto con un ícono de regla junto a *Pasaremos de estimar a medir*; sin imágenes con contenido adicional.

### Diapositiva 60

UNIVERSIDAD SAN SEBASTIAN

YOCACIÓN POR LA 6XC6L6ł•fClA

Fin Semana 6

N U1 ST RA /Ví l S10 N ES E D U CAR EN LA

RAZÓ N , LA VE RDA D Y LA V I RTU D.

**Contenido visual de la lámina:** Lámina de cierre: *Fin Semana 6*, con la franja *Nuestra misión es educar en la razón, la verdad y la virtud.*

<a id="semana-7"></a>

## Ingeniería de Software — Semana 7

Fuente: `Ingenieria_Software_Semana7.pdf` (COCOMO: estimación de esfuerzo).

### Diapositiva 1

SEMANA 7
COCOMO: ESTIMACIÓN DE ESFUERZO
Taller de Ingeniería de Software
Prof. Dr. Rodrigo Correa R.

**Contenido visual de la lámina:** Portada con fotografía de un edificio patrimonial de la universidad y logo USS. Texto: *Semana 7 · Taller de Ingeniería de Software · Prof. Dr. Rodrigo Correa R.*

### Diapositiva 2

#### OBJETIVO DE LA CLASE

Comprender cómo COCOMO transforma una estimación del tamaño del software en esfuerzo, duración y dotación promedio.
Aplicar las fórmulas del modelo COCOMO básico e interpretar sus resultados.
Reconocer supuestos, límites y riesgos de las estimaciones.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 3

#### ¿QUÉ APRENDEREMOS HOY?

- 01 ¿Por qué estimamos? Tamaño versus esfuerzo.
- 02 ¿Qué es COCOMO y qué información necesita?
- 03 Modos de proyecto y ecuaciones del modelo básico.
- 04 Ejercicios numéricos y análisis de escenarios.
- 05 Cómo comunicar estimaciones responsables.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 4

#### DE LOC Y PF A COCOMO

- **LOC / KLOC:** tamaño del código estimado. 1 KLOC = 1.000 líneas de código.
- **PF:** tamaño funcional desde la perspectiva del usuario. No es una medida directa de esfuerzo.
- **COCOMO:** modelo empírico que estima esfuerzo y duración a partir de tamaño y supuestos.

**Contenido visual de la lámina:** Lámina con 3 tarjetas de encabezado azul oscuro, una por concepto, con el texto transcrito arriba; sin imágenes con contenido adicional.

### Diapositiva 5

#### ACTIVIDAD · DIAGNÓSTICO

Dos proyectos tienen 20.000 LOC estimadas. ¿Necesitan necesariamente el mismo esfuerzo?
- Debatan durante 4 minutos.
- Identifiquen tres factores que podrían cambiar la estimación.
- Compartan una conclusión técnica.

**Contenido visual de la lámina:** Lámina de actividad (rótulo *Trabajo en equipo*) con la consigna destacada en un recuadro y las instrucciones en viñetas; sin imágenes con contenido adicional.

### Diapositiva 6

#### ¿QUÉ ES COCOMO?

COCOMO = Constructive Cost Model.
Modelo de estimación de proyectos de software propuesto por Barry Boehm (1981).
Utiliza relaciones empíricas entre tamaño y esfuerzo para generar estimaciones.
Hoy estudiaremos COCOMO 81 BÁSICO; no confundir con COCOMO II.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 7

#### TRES RESULTADOS DIFERENTES

- **Tamaño:** ¿cuánto software se estima construir? KLOC.
- **Esfuerzo:** ¿cuánto trabajo acumulado se requiere? Persona-mes (PM).
- **Duración:** ¿cuánto tiempo calendario podría tomar? Meses.

**Contenido visual de la lámina:** Lámina con 3 tarjetas de encabezado azul oscuro, una por concepto, con el texto transcrito arriba; sin imágenes con contenido adicional.

### Diapositiva 8

#### PERSONA-MES NO ES MES CALENDARIO

1 persona × 6 meses = 6 persona-mes de esfuerzo.
3 personas × 2 meses = 6 persona-mes (idealizado).
Pero agregar personas NO garantiza reducir el plazo proporcionalmente: coordinación, dependencias y capacitación importan.
COCOMO estima dotación PROMEDIO = esfuerzo / duración.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 9

#### ¿QUÉ DATOS NECESITAMOS?

1. Tamaño estimado en KLOC.
2. Modo de desarrollo (orgánico, semiacoplado o empotrado).
3. Coeficientes del modelo correspondientes al modo.
4. Supuestos explícitos sobre alcance, tecnología y equipo.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 10

#### ACTIVIDAD · TAMAÑO Y ESFUERZO

Proyecto A: 12.000 LOC. Proyecto B: 28.000 LOC. ¿Qué podemos afirmar sin calcular COCOMO?
- Conviertan ambos tamaños a KLOC.
- Expliquen por qué tamaño y esfuerzo no son equivalentes.
- Identifiquen información faltante para estimar.

**Contenido visual de la lámina:** Lámina de actividad (rótulo *Trabajo en equipo*) con la consigna destacada en un recuadro y las instrucciones en viñetas; sin imágenes con contenido adicional.

### Diapositiva 11

#### MODOS DE DESARROLLO EN COCOMO BÁSICO

- **Orgánico:** equipo familiarizado con el dominio; requisitos relativamente conocidos; complejidad moderada.
- **Semiacoplado:** experiencia y complejidad intermedias; mayor heterogeneidad del equipo o sistema.
- **Empotrado:** restricciones fuertes de hardware, software, operación o tiempo real.

**Contenido visual de la lámina:** Lámina con 3 tarjetas de encabezado azul oscuro, una por concepto, con el texto transcrito arriba; sin imágenes con contenido adicional.

### Diapositiva 12

#### FÓRMULAS DE COCOMO BÁSICO

ESFUERZO (PM) = a × (KLOC)^b DURACIÓN (meses) = c × (PM)^d PERSONAS PROMEDIO = PM / duración Los valores de a, b, c y d dependen del modo de desarrollo.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 13

#### TABLA DE COEFICIENTES · COCOMO 81 BÁSICO

La tabla de coeficientes se transcribe en el contenido visual de la lámina.

**Contenido visual de la lámina:**

Tabla de coeficientes del modelo COCOMO 81 básico:

| Modo | a | b | c | d |
|---|---:|---:|---:|---:|
| Orgánico | 2,4 | 1,05 | 2,5 | 0,38 |
| Semiacoplado | 3,0 | 1,12 | 2,5 | 0,35 |
| Empotrado | 3,6 | 1,20 | 2,5 | 0,32 |

Nota al pie: *coeficientes del modelo histórico COCOMO 81 básico; no son los de COCOMO II.*

### Diapositiva 14

#### EJEMPLO GUIADO · PASO 1

Proyecto: sistema administrativo de 20.000 LOC.
Supuesto docente: modo ORGÁNICO.
KLOC = 20.000 / 1.000 = 20.
Coeficientes: a = 2,4; b = 1,05; c = 2,5; d = 0,38.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 15

#### EJEMPLO GUIADO · PASO 2

PM = 2,4 × (20)^1,05 PM ≈ 55,76 persona-mes.
Interpretación: volumen de trabajo acumulado estimado, NO duración calendario.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 16

#### ACTIVIDAD · CÁLCULO INTERMEDIO

Con PM = 55,76, estimen duración y dotación promedio.
- Duración = 2,5 × (55,76)^0,38.
- Personas promedio = 55,76 / duración.
- Redondeen a dos decimales e interpreten ambos valores.

**Contenido visual de la lámina:** Lámina de actividad (rótulo *Trabajo en equipo*) con la consigna destacada en un recuadro y las instrucciones en viñetas; sin imágenes con contenido adicional.

### Diapositiva 17

#### EJEMPLO GUIADO · PASO 3

Duración = 2,5 × (55,76)^0,38 Duración ≈ 11,52 meses.
Dotación promedio = 55,76 / 11,52 ≈ 4,84 personas.
La dotación es un promedio matemático; no significa asignar 4,84 personas reales.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 18

#### INTERPRETACIÓN DEL RESULTADO

Tamaño: 20 KLOC.
Esfuerzo estimado: 55,76 persona-mes.
Duración estimada: 11,52 meses.
Dotación promedio: 4,84 personas.
Son estimaciones sujetas a supuestos, incertidumbre y calibración histórica.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 19

#### ¿POR QUÉ EL ESFUERZO NO CRECE LINEALMENTE?

En COCOMO básico: PM = a × KLOC^b.
Como b > 1, duplicar tamaño produce más del doble de esfuerzo estimado (manteniendo el modo).
Ejemplo orgánico: 10 KLOC ≈ 26,93 PM; 20 KLOC ≈ 55,76 PM.
La fórmula modela economías/deseconomías de escala según los parámetros.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 20

#### EJEMPLO 2 · SEMIACOPLADO

Proyecto: 32.000 LOC → 32 KLOC.
PM = 3,0 × (32)^1,12 ≈ 145,51 persona-mes.
Duración = 2,5 × (145,51)^0,35 ≈ 14,29 meses.
Dotación promedio ≈ 10,18 personas.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 21

#### ACTIVIDAD · COMPARAR ESTIMACIONES

Dos equipos proponen la misma solución de 32 KLOC, pero clasifican distinto el modo.
- Equipo A: orgánico; Equipo B: semiacoplado.
- ¿Qué argumentos justificarían cada elección?
- ¿Por qué no basta con seleccionar el modo que da menos PM?

**Contenido visual de la lámina:** Lámina de actividad (rótulo *Trabajo en equipo*) con la consigna destacada en un recuadro y las instrucciones en viñetas; sin imágenes con contenido adicional.

### Diapositiva 22

#### EJEMPLO 3 · EMPOTRADO

Proyecto con restricciones estrictas: 50 KLOC.
PM = 3,6 × (50)^1,20 ≈ 393,61 persona-mes.
Duración = 2,5 × (393,61)^0,32 ≈ 16,92 meses.
Dotación promedio ≈ 23,27 personas.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 23

#### ERRORES FRECUENTES

- **Error 1:** ingresar 20.000 como KLOC en lugar de 20.
- **Error 2:** confundir PM con meses calendario.
- **Error 3:** tratar la dotación promedio como equipo fijo exacto.
- **Error 4:** elegir el modo por conveniencia y no por características.

**Contenido visual de la lámina:** Lámina con 4 tarjetas de encabezado azul oscuro, una por concepto, con el texto transcrito arriba; sin imágenes con contenido adicional.

### Diapositiva 24

#### CÓMO CALCULAR EL COSTO

COCOMO básico estima esfuerzo y duración, no un presupuesto monetario completo.
Costo laboral aproximado = PM × costo por persona-mes.
Ejemplo hipotético: 55,76 PM × $2.000.000 CLP/PM ≈ $111.520.000 CLP.
No incluye automáticamente licencias, infraestructura, contingencias ni otros gastos.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 25

#### SENSIBILIDAD: ¿QUÉ PASA SI CAMBIA EL TAMAÑO?

Proyecto orgánico, estimación inicial: 20 KLOC → 55,76 PM.
Si aumenta a 25 KLOC: PM = 2,4 × (25)^1,05 ≈ 70,48 PM.
Variación aproximada: +26,4% de esfuerzo por +25% de tamaño.
Reestimar ante cambios relevantes de alcance es una buena práctica.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 26

#### ACTIVIDAD · CAMBIO DE ALCANCE

Un proyecto orgánico pasa de 20 KLOC a 25 KLOC.
- Calculen el nuevo esfuerzo con la fórmula.
- Calculen la diferencia absoluta y porcentual de PM.
- Expliquen si se debería mantener el cronograma original sin revisión.

**Contenido visual de la lámina:** Lámina de actividad (rótulo *Trabajo en equipo*) con la consigna destacada en un recuadro y las instrucciones en viñetas; sin imágenes con contenido adicional.

### Diapositiva 27

#### LIMITACIONES DE COCOMO BÁSICO

Depende de una estimación de tamaño que puede ser incierta.
Sus coeficientes provienen de datos históricos; requieren cuidado en contextos modernos.
No incorpora explícitamente factores detallados de personal, producto, plataforma y proyecto.
No reemplaza juicio experto, datos propios ni análisis de riesgos.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 28

#### ¿QUÉ VIENE DESPUÉS?

- **COCOMO intermedio:** incorpora factores de costo mediante multiplicadores de esfuerzo.
- **COCOMO detallado:** distribuye la estimación considerando fases del desarrollo.
- **COCOMO II:** familia posterior, con modelos y parámetros diferentes para contextos más recientes.

**Contenido visual de la lámina:** Lámina con 3 tarjetas de encabezado azul oscuro, una por concepto, con el texto transcrito arriba; sin imágenes con contenido adicional.

### Diapositiva 29

#### COMPARACIÓN CON LOC Y PF

LOC y PF son métricas de tamaño, no medidas directas de esfuerzo.
COCOMO transforma una estimación de tamaño en esfuerzo y duración según un modelo.
PF puede apoyar una conversión a LOC mediante supuestos de lenguaje/productividad; esa conversión introduce incertidumbre.
Ningún método produce una fecha garantizada.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 30

#### EJERCICIO APLICADO · GRUPOS

- G1 MUSEOGEST: 12 KLOC · orgánico.
- G2 CINEPROD: 16 KLOC · semiacoplado.
- G3 LABTRACK: 15 KLOC · semiacoplado.
- G5 ORQUESTA360: 14 KLOC · orgánico.
- G6 AEROGROUND: 18 KLOC · empotrado (supuesto de ejercicio).

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 31

#### ACTIVIDAD · DESAFÍO POR EQUIPOS

Calculen PM, duración, personas promedio y costo laboral hipotético.
- Usen los KLOC y modos asignados en la diapositiva anterior.
- Supongan $2.000.000 CLP por persona-mes.
- Muestren fórmula, sustitución, resultado y una limitación.
- Tiempo: 12 minutos; presentación: 2 minutos por equipo.

**Contenido visual de la lámina:** Lámina de actividad (rótulo *Trabajo en equipo*) con la consigna destacada en un recuadro y las instrucciones en viñetas; sin imágenes con contenido adicional.

### Diapositiva 32

#### ¿QUÉ DEBE INCLUIR UNA ESTIMACIÓN SERIA?

Tamaño y fuente de la estimación.
Modelo y versión utilizados; modo y coeficientes.
Procedimiento numérico reproducible.
Supuestos, exclusiones e incertidumbres.
Escenarios y revisión ante cambios.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 33

**Contenido visual de la lámina:**

Lámina sin título con la **rúbrica de evaluación** del ejercicio aplicado y la **escala de notas**.

| Criterio de evaluación | 3 puntos — Excelente | 2 puntos — Adecuado | 1 punto — Insuficiente | 0 puntos — No logrado |
|---|---|---|---|---|
| Comprensión del proyecto y datos de entrada | Identifica correctamente el tamaño del software, los antecedentes, supuestos y datos necesarios para realizar la estimación | Identifica los datos principales, con omisiones menores | Identifica parcialmente los datos o presenta confusiones conceptuales | No identifica los datos necesarios o utiliza información incorrecta |
| Selección y justificación del modelo COCOMO | Selecciona correctamente el modo o modelo COCOMO correspondiente y justifica técnicamente su elección según las características del proyecto | Selecciona correctamente el modelo, pero presenta una justificación limitada | Selecciona el modelo con errores o presenta una justificación superficial | No selecciona un modelo apropiado ni fundamenta su decisión |
| Aplicación de fórmulas y parámetros | Aplica correctamente las fórmulas, coeficientes, exponentes y unidades del modelo seleccionado, mostrando el procedimiento | Aplica correctamente la mayoría de las fórmulas y parámetros, con errores menores | Presenta errores importantes en fórmulas, parámetros o unidades | No aplica las fórmulas o utiliza procedimientos incorrectos |
| Cálculo del esfuerzo y duración | Calcula correctamente el esfuerzo en persona-mes y la duración estimada, mostrando todas las operaciones y resultados | Obtiene resultados mayoritariamente correctos, con errores menores de cálculo o presentación | Presenta errores significativos o procedimientos incompletos | No realiza los cálculos o presenta resultados sin fundamento |
| Interpretación de resultados y recursos | Interpreta correctamente esfuerzo, duración y dotación promedio, diferenciando persona-mes de meses calendario y justificando sus conclusiones | Interpreta correctamente los resultados principales, con algunas imprecisiones | Confunde parcialmente esfuerzo, duración o cantidad de personas | No interpreta los resultados o presenta errores conceptuales graves |
| Análisis crítico y conclusiones técnicas | Analiza los resultados, reconoce supuestos y limitaciones del modelo y formula conclusiones y recomendaciones técnicamente fundamentadas | Presenta conclusiones pertinentes, aunque con análisis o fundamentación limitada | Presenta conclusiones superficiales o poco relacionadas con los resultados obtenidos | No presenta conclusiones o estas carecen de fundamento técnico |
| Presentación, participación y cumplimiento de instrucciones | Presentación PPT profesional, ordenada y legible, con buena ortografía, cálculos claros, participación equilibrada y cumplimiento completo de las instrucciones | Presentación clara, con errores menores de formato, redacción, ortografía o participación | Presentación desorganizada, errores frecuentes, dificultades de legibilidad o participación desigual | Presentación deficiente, incumplimiento importante de instrucciones o ausencia de participación |

Escala de notas (puntaje máximo 21): 0 → 1,0 · 1 → 1,2 · 2 → 1,5 · 3 → 1,7 · 4 → 2,0 · 5 → 2,2 · 6 → 2,4 · 7 → 2,7 · 8 → 2,9 · 9 → 3,1 · 10 → 3,4 · 11 → 3,6 · 12 → 3,9 · 13 → 4,1 · 14 → 4,5 · 15 → 4,9 · 16 → 5,2 · 17 → 5,6 · 18 → 5,9 · 19 → 6,3 · 20 → 6,6 · 21 → 7,0 (las notas bajo 4,0 aparecen en rojo).

### Diapositiva 34

#### SÍNTESIS DE LA SEMANA 7

TAMAÑO (LOC/KLOC) → COCOMO → ESFUERZO (PM)
ESFUERZO → DURACIÓN ESTIMADA → DOTACIÓN PROMEDIO La estimación es una herramienta de planificación, no una promesa exacta.
Un ingeniero debe justificar los supuestos, no solo entregar números.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 35

#### ACTIVIDAD · CIERRE REFLEXIVO

¿Puede un gerente prometer entregar un sistema en seis meses solo porque COCOMO estimó seis meses?
- Responder SÍ o NO, con fundamento.
- Mencionar dos incertidumbres que deben comunicarse.
- Proponer cómo revisarían la estimación durante el proyecto.

**Contenido visual de la lámina:** Lámina de actividad (rótulo *Trabajo en equipo*) con la consigna destacada en un recuadro y las instrucciones en viñetas; sin imágenes con contenido adicional.

### Diapositiva 36

#### PRÓXIMA CLASE

Profundizaremos en estimación y planificación de proyectos de software.
Retomaremos cómo el esfuerzo estimado se transforma en decisiones de recursos, calendario y presupuesto.
Preparación: repasar LOC, PF, KLOC, persona-mes y las ecuaciones de COCOMO básico.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

