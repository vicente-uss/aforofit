# Ingeniería de Software

Base de conocimiento del ramo para estudiar y tomar decisiones durante el desarrollo. Integra seis semanas sobre requisitos, modelamiento, calidad, documentación, ciclo de vida y estimación.

## Uso en el proyecto

Para estudiantes y asistentes de IA, esta referencia ayuda a decidir qué modelo elaborar, qué probar y cómo justificar una estimación. El índice vincula cada tema con la **semana y diapositiva** de origen.

En AforoFit, la pauta docente determina qué se entrega y `AGENTS.md` y los documentos del proyecto describen las decisiones y el estado vigente. Al aplicar la teoría, cita la diapositiva pertinente y registra el supuesto, la decisión técnica o la evidencia del proyecto por separado.

## Índice por tema

| Semana | Temas y diapositivas |
|---|---|
| [1. Fundamentos y requisitos](#semana-1) | Ingeniería de software y proceso integral (4–17), ingeniería de requisitos (18–30), calidad de un requisito (31–39), desafío grupal (41–46). |
| [2. Modelamiento, UML y diseño](#semana-2) | Qué modelar y diagramas UML (5–28), casos de uso y relaciones (29–45), ejemplos UML (46–52), del modelo al diseño (54–63). |
| [3. Calidad y pruebas](#semana-3) | Calidad y QA (5–19), verificación y validación (20–28), niveles de prueba (33–44), niveles y tipos de prueba (45–49). |
| [4. Documentación, evolución y ciclo de vida](#semana-4) | Documentación y mantenimiento (5–16), SDLC y enfoques (17–27), cascada, RAD, RUP y AUP (28–44), agilidad y Scrum (45–83). |
| [5. Estimación de proyectos](#semana-5) | La diapositiva 2 distingue tamaño, esfuerzo, duración, recursos y costo como objetivos de aprendizaje. |
| [6. Estimación con LOC y FP](#semana-6) | La diapositiva 2 presenta LOC y puntos de función como técnicas de estimación de tamaño. |

## Guía de aplicación para el equipo

Esta guía resume cómo usar el material en un proyecto. Las plantillas y el ejemplo son apoyos para el equipo.

1. **Definir requisitos.** Identificar usuarios, necesidad y alcance. Registrar requisitos funcionales y no funcionales y cómo se comprobará cada uno. Semana 1.
2. **Modelar y diseñar.** Elegir el diagrama según la pregunta. Casos de uso para actores y objetivos, secuencia para interacciones, actividades para flujos, clases para estructura y componentes o despliegue para arquitectura. Semana 2.
3. **Planificar la calidad.** Verificar el cumplimiento de la especificación y validar que la solución satisface la necesidad. Elegir el nivel de prueba (unitaria, integración, sistema o aceptación) y el tipo según lo que se comprueba. Semana 3.
4. **Documentar y evolucionar.** Registrar cómo ejecutar el sistema, qué decisiones de diseño se tomaron y qué impacto tiene cada cambio. Organizar el trabajo según el nivel de incertidumbre y la frecuencia con que el equipo necesita recibir retroalimentación. Semana 4.
5. **Estimar y planificar.** Definir el alcance medido y justificar la técnica de tamaño. Explicitar los supuestos antes de pasar del tamaño al esfuerzo y del esfuerzo a la duración, considerando la capacidad y disponibilidad del equipo. Semanas 5 y 6.

### Ficha de trazabilidad y pruebas

| Requisito | Modelo o decisión | Nivel de prueba | Condición y resultado esperado | Resultado observado | Evidencia |
|---|---|---|---|---|---|
| RF-01 · Registrar salida | Flujo de salida de una visita | Integración | Con una visita abierta, registrar la salida debe guardar la hora y liberar un cupo. | Por ejecutar | Pendiente |

### Ficha de estimación

| Dato | Qué registrar |
|---|---|
| Alcance y técnica | Funciones incluidas y criterio para elegir LOC o puntos de función. |
| Tamaño | Cálculo, unidad y supuestos. |
| Esfuerzo | Horas-persona estimadas y base de cálculo. |
| Duración | Tiempo calendario según disponibilidad y dependencias. |
| Recursos y costo | Personas, herramientas, infraestructura y costo si corresponde. |
| Riesgos | Causas de variación y efecto sobre la estimación. |

### Cómo usar esta referencia como contexto

- Elegir un artefacto por la pregunta que debe responder. Un diagrama de secuencia permite revisar interacciones y un caso de prueba permite comprobar el resultado.
- Registrar el nivel de prueba, las condiciones de ejecución, el resultado esperado y lo observado. El estado «por ejecutar» identifica una prueba pendiente.
- Al estimar, documentar por separado tamaño, esfuerzo y duración. Citar las diapositivas que contienen el contenido usado y señalar cuando la copia del curso solo contiene el encabezado.

### Ejemplo aplicado a AforoFit

Para revisar el flujo de salida, un diagrama de secuencia puede mostrar la interacción entre el kiosco, la aplicación y la base de datos. La prueba de integración puede comprobar el cierre de la visita. Una prueba de sistema puede recorrer el flujo completo y comprobar si la pantalla de aforo refleja el cambio. Cada resultado debe registrar la versión probada y su evidencia.

## Material de clase por semana

> El ZIP es de solo texto. Las diapositivas sin desarrollo se conservan con su encabezado y numeración. En la semana 5 hay 68 de 72 en esa condición y en la semana 6 hay 56 de 60. La guía de aplicación aporta plantillas propias y el material de clase se reproduce abajo.

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

### Diapositiva 2

#### OBJETIVO DE LA CLASE

❑Visión General ❑Aspectos introductorios ❑Conceptos

### Diapositiva 3

#### ¿Qué aprenderemos hoy?

- Comprender qué es la Ingeniería de

Software. ✓Conocer por qué nació esta disciplina. ✓Analizar las causas del fracaso de

proyectos. ✓Comprender el proceso integral de

desarrollo. ✓Introducir la Ingeniería de Requerimientos.

### Diapositiva 4

#### ¿Qué es desarrollar software?

No es solamente programar.

"El código representa solo una

parte del desarrollo de

software."

### Diapositiva 5

#### ¿Qué hace un Ingeniero de Software?

### Diapositiva 6

#### ¿Qué hace un Ingeniero de Software?

### Diapositiva 7

#### Definición de Ingeniería de Software

IEEE (Institute of Electrical and Electronics Engineers) "La Ingeniería de Software es la aplicación de un enfoque sistemático, disciplinado y cuantificable para el desarrollo, operación, mantenimiento y evolución del software; es decir, la aplicación de la ingeniería al software."

Esta es probablemente la definición más utilizada en ámbitos académicos y profesionales.

### Diapositiva 8

#### Definición de Ingeniería de Software

Roger S. Pressman y Bruce Maxim (2020) "La Ingeniería de Software es una tecnología en capas que integra procesos, métodos y herramientas para desarrollar software de calidad, considerando tanto los aspectos técnicos como la gestión del proyecto."

Pressman destaca la importancia de los procesos de desarrollo y de la mejora continua de la calidad.

### Diapositiva 9

#### Definición de Ingeniería de Software

La Ingeniería de Software es la disciplina que aplica principios, métodos, procesos y herramientas de ingeniería para analizar, diseñar, desarrollar, probar, implementar y mantener sistemas de software de manera sistemática, asegurando calidad, confiabilidad, seguridad, eficiencia y satisfacción de las necesidades de los usuarios durante todo su ciclo de vida.

### Diapositiva 10

#### ¿Por qué existe la Ingeniería de Software?

### Diapositiva 11

#### ¿Por qué existe la Ingeniería de Software?

Porque desarrollar software es una actividad compleja. Problemas: • Costos • Calidad • Tiempo • Riesgo • Personas

### Diapositiva 12

#### La Crisis del Software

### Diapositiva 13

#### Casos emblemáticos de fracaso

### Diapositiva 14

#### ¿Por qué fracasan los proyectos?

Principales causas.

Requerimientos deficientes Mala planificación Cambios de alcance Comunicación Gestión

### Diapositiva 15

#### El costo de corregir un error

Detectar temprano cuesta mucho menos.

### Diapositiva 16

#### Proceso Integral del Desarrollo de Software

### Diapositiva 17

#### Proceso Integral de Desarrollo de Software

¿Dónde estamos hoy?

REQUERIMIENTOS.

### Diapositiva 18

#### Ingeniería del Requerimiento, ¿qué es?

La Ingeniería de Requerimientos es el proceso sistemático de identificar, analizar, documentar, validar y gestionar las necesidades y expectativas de los interesados (stakeholders), asegurando que el sistema desarrollado responda efectivamente a los objetivos del negocio y de los usuarios.

### Diapositiva 19

#### Ingeniería del Requerimiento, ¿qué es?

"Los errores en los requerimientos son la principal causa de fracaso en proyectos de software."

Objetivos • Comprender el problema antes de desarrollar la solución. • Identificar necesidades reales de clientes y usuarios. • Reducir riesgos, costos y retrabajos. • Establecer una base sólida para el diseño y desarrollo.

“Construir correctamente el software comienza por comprender correctamente

el problema.”

### Diapositiva 20

#### Proceso de Ingeniería de Requerimientos

Etapas principales

1. Elicitación Obtención de información desde clientes, usuarios y expertos del dominio. 2. Análisis Comprensión, clasificación y resolución de conflictos entre requerimientos.

### Diapositiva 21

#### Proceso de Ingeniería de Requerimientos

Etapas principales 3. Especificación Documentación formal de los requerimientos mediante modelos y descripciones. 4. Validación Verificación de que los requerimientos representan correctamente las necesidades del cliente.

### Diapositiva 22

#### Proceso de Ingeniería de Requerimientos

Etapas principales

5. Gestión Control de cambios y trazabilidad durante todo el ciclo de vida del proyecto.

“Los requerimientos evolucionan durante el proyecto; por ello deben

gestionarse continuamente.”

### Diapositiva 23

#### Tipos de Requerimientos

❑Funcionales ❑No funcionales

### Diapositiva 24

#### Tipos de Requerimientos

Requerimientos Funcionales Describen qué debe hacer el sistema. Ejemplos • Registrar usuarios. • Emitir facturas. • Buscar productos. • Generar reportes. • Procesar pagos.

### Diapositiva 25

#### Tipos de Requerimientos

Requerimientos No Funcionales Describen cómo debe comportarse el sistema. Ejemplos • Seguridad • Rendimiento • Escalabilidad • Disponibilidad • Usabilidad • Mantenibilidad • Portabilidad

### Diapositiva 26

#### Tipos de Requerimientos

Requerimientos del Negocio Definen los objetivos organizacionales que justifican el desarrollo del sistema. Ejemplo: "Reducir en un 30% los tiempos de atención al cliente."

“Un software exitoso satisface tanto los requerimientos

funcionales como los no funcionales.”

### Diapositiva 27

#### Tipos de Requerimientos

Caso práctico Sistema Hospitalario.

¿Qué funcionalidades necesitaría?

### Diapositiva 28

#### Tipos de Requerimientos

Caso práctico Sistema Hospitalario.

Ahora identifiquemos requerimientos ❑Funcionales. ❑No funcionales. ❑Negocio.

### Diapositiva 29

#### Técnicas para toma de requerimientos

- Entrevistas

Permiten obtener información detallada de usuarios y expertos. • Talleres (Workshops)

Favorecen la construcción colaborativa de requerimientos. • Observación

Analiza cómo trabajan realmente los usuarios. • Cuestionarios

Recolectan información de grandes grupos. • Análisis documental

Revisión de reglamentos, procedimientos y documentación existente. • Prototipos

Permiten validar ideas antes del desarrollo.

### Diapositiva 30

#### Técnicas para toma de requerimientos

Comparación

Técnica Mejor uso Entrevistas Profundizar necesidades Observación Comprender procesos reales Talleres Lograr consenso Encuestas Obtener información masiva Prototipos Validar requisitos tempranamente

“La mejor estrategia consiste en combinar diversas técnicas para obtener

una visión integral del problema.”

### Diapositiva 31

#### Calidad de un Buen Requerimiento

Un requerimiento debe ser:

Claro Completo Consistente Verificable Factible Necesario Trazable No ambiguo Priorizado

### Diapositiva 32

#### Calidad de un Buen Requerimiento

Ejemplo

Mal requerimiento "El sistema debe ser rápido."

Buen requerimiento "El sistema deberá responder a cualquier consulta en menos de 2 segundos para el 95% de las solicitudes realizadas simultáneamente por hasta 500 usuarios."

### Diapositiva 33

#### Calidad de un Buen Requerimiento

Un requerimiento bien definido reduce significativamente los

errores, los costos de desarrollo y el riesgo de fracaso del

proyecto.

### Diapositiva 34

#### Calidad de un Buen Requerimiento

Errores frecuentes al levantar requerimientos Ejemplos.

Hablar sólo con el gerente. No entrevistar usuarios. No validar. No documentar. No gestionar cambios.

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

### Diapositiva 36

#### Calidad de un Buen Requerimiento

### Diapositiva 37

#### Calidad de un Buen Requerimiento

### Diapositiva 38

#### Calidad de un Buen Requerimiento

### Diapositiva 39

#### Calidad de un Buen Requerimiento

### Diapositiva 40

#### Proceso Integral de Desarrollo de Software

¿Dónde estamos hoy?

REQUERIMIENTOS.

La próxima semana avanzaremos hacia la

siguiente etapa del

proceso: el Modelamiento del

Sistema

### Diapositiva 41

#### Desafío Final

### Diapositiva 42

#### Desafío Final – Trabajo en Equipo

1. ¿Aceptarían comenzar el desarrollo inmediatamente? ¿Por qué? 2. ¿Qué información consideran indispensable obtener antes de iniciar el

proyecto? 3. ¿Quiénes serían los principales stakeholders? 4. Identifiquen al menos cinco requerimientos funcionales. 5. Identifiquen al menos cinco requerimientos no funcionales. 6. ¿Qué riesgos tendría el proyecto si comenzara a desarrollarse con la

información disponible? 7. ¿Qué técnicas de Ingeniería de Requerimientos utilizarían para

comprender realmente el problema?

### Diapositiva 43

#### Desafío Final – Trabajo en Equipo

Desafío adicional Al finalizar, cada grupo deberá responder una pregunta final: ¿Cuál creen que sería la principal causa del fracaso de este proyecto si se desarrollara a partir de la información entregada por el alcalde?

### Diapositiva 44

#### Desafío Final – Trabajo en Equipo

"Si ustedes fueran el jefe del proyecto, ¿firmarían hoy el compromiso de desarrollar este sistema con la información disponible? Justifiquen su respuesta."

"Hoy no aprendimos a programar. Hoy aprendimos cuándo un ingeniero responsable debe decir: 'Todavía

no podemos comenzar'."

### Diapositiva 45

#### Desafío Final – Trabajo en Equipo

Reflexión Final Un Ingeniero de Software no comienza escribiendo código. Comienza comprendiendo el problema, identificando a los actores involucrados y transformando necesidades ambiguas en requerimientos claros, verificables y medibles.

### Diapositiva 46

#### Desafío Final – Trabajo en Equipo

Próxima Clase – Semana 2 Del problema... al diseño de la solución

### Diapositiva 47

UNIVERSIDAD SAN SEBASTIAN

YOCACIÓN POR LA 6XC6L6ł•fClA

Fin Semana 1

N U1 ST RA /Ví l S10 N ES E D U CAR EN LA

RAZÓ N , LA VE RDA D Y LA V I RTU D.

---

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

### Diapositiva 2

#### OBJETIVO DE LA CLASE

❑COMPRENDER EL PROPÓSITO DEL MODELAMIENTO

DE SISTEMAS. ❑ANALIZAR CÓMO EL DISEÑO, LA IMPLEMENTACIÓN,

EL ASEGURAMIENTO DE LA CALIDAD, LA DOCUMENTACIÓN Y LA EVOLUCIÓN CONTRIBUYEN A LA CONSTRUCCIÓN DE SOFTWARE DE CALIDAD. ❑RELACIONAR CADA ETAPA CON EL CICLO DE VIDA DEL

DESARROLLO DE SOFTWARE Y CON LAS METODOLOGÍAS UTILIZADAS EN LA INDUSTRIA.

### Diapositiva 3

#### ¿Qué aprenderemos hoy?

Hoy continuaremos avanzando en el

Proceso Integral de Desarrollo de Software, comprendiendo cómo una vez definidos los requerimientos, estos se transforman progresivamente en una solución tecnológica.

### Diapositiva 4

#### Proceso Integral de Desarrollo de Software

¿Dónde estamos hoy?

MODELAMIENTO.

"Una vez comprendido el problema, el siguiente desafío consiste en representar la

solución antes de construirla."

### Diapositiva 5

#### ¿Por qué modelamos un sistema?

### Diapositiva 6

#### ¿Qué es un modelo?

Ejemplos:

Un modelo es una representación simplificada de la realidad que permite comprender, analizar, comunicar y validar una solución antes de implementarla.

### Diapositiva 7

#### Beneficios del Modelamiento

### Diapositiva 8

#### ¿Qué ocurre si no modelamos?

### Diapositiva 9

#### ¿Qué aspectos podemos modelar en un sistema?

Un sistema puede representarse desde distintas perspectivas. Cada modelo responde a una pregunta diferente y aporta información específica para comprender la solución.

### Diapositiva 10

#### ¿Qué aspectos podemos modelar en un sistema?

👥Actores y usuarios • ¿Quién utilizará el sistema? ⚙️Procesos del negocio • ¿Cómo funciona actualmente la organización? 🔄Interacciones • ¿Cómo se relacionan los usuarios con el sistema? 🗂️Información • ¿Qué datos deben almacenarse y gestionarse? 🏗️Arquitectura • ¿Cómo estarán organizados los componentes del

software?

“No existe un único modelo. Un sistema complejo requiere diferentes modelos para

comprenderlo desde distintas perspectivas.”

### Diapositiva 11

#### Modelamiento de Sistemas

### Diapositiva 12

#### ¿Qué herramientas utiliza un Ingeniero de

Software para modelar?

El modelamiento puede realizarse mediante diferentes herramientas, dependiendo del objetivo del proyecto y del nivel de detalle requerido.

### Diapositiva 13

#### ¿Qué herramientas utiliza un Ingeniero

de Software para modelar?

Herramienta ¿Para qué se utiliza?

Diagramas UML Representar la estructura y el comportamiento del sistema.

BPMN Modelar procesos de negocio. Wireframes Diseñar la estructura de las interfaces de usuario. Mockups Visualizar el aspecto final de las pantallas.

Prototipos Validar ideas con el cliente antes del desarrollo.

“Cada herramienta cumple un propósito específico; no existe una herramienta

única para modelar un sistema.”

### Diapositiva 14

#### UML: El lenguaje universal del modelamiento

¿Qué es UML? UML (Unified Modeling Language) es un lenguaje de modelado estandarizado que permite representar gráficamente un sistema antes de su implementación. Su objetivo es facilitar la comunicación entre clientes, analistas, arquitectos y desarrolladores.

### Diapositiva 15

#### UML: El lenguaje universal del modelamiento

UML SÍ es... ✅Un lenguaje gráfico. ✅Un estándar internacional. ✅Una herramienta de comunicación.

UML NO es... ❌Un lenguaje de programación. ❌Una metodología de desarrollo. ❌Un software.

“Modelar no significa programar; significa comunicar una

solución antes de construirla.”

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

### Diapositiva 17

#### ¿Cuál diagrama UML utilizarías?

Caso 1 Un cliente desea representar los procesos que realiza un usuario al comprar un producto en una tienda virtual.

- ¿Qué diagrama utilizarías? • ¿Por qué?

### Diapositiva 18

#### ¿Cuál diagrama UML utilizarías?

Caso 1 Un cliente desea representar los procesos que realiza un usuario al comprar un producto en una tienda virtual.

Respuesta ✅Diagrama de Casos de Uso ¿Por qué? Porque el objetivo es representar las funcionalidades que el sistema ofrece al usuario y cómo este interactúa con ellas. No interesa todavía saber cómo está construido el sistema, sino responder preguntas como: • ¿Qué puede hacer el cliente? • ¿Qué acciones realizará? • ¿Qué servicios ofrecerá el sistema?

### Diapositiva 19

#### ¿Cuál diagrama UML utilizarías?

Caso 2 Necesitas mostrar cómo interactúan un cliente, el sistema y la base de datos durante una compra.

- ¿Qué diagrama utilizarías? • ¿Por qué?

### Diapositiva 20

#### ¿Cuál diagrama UML utilizarías?

Caso 2 Necesitas mostrar cómo interactúan un cliente, el sistema y la base de datos durante una compra.

Respuesta ✅Diagrama de Secuencia ¿Por qué? Porque interesa representar el orden cronológico de las interacciones entre los distintos participantes. Es decir:

Cliente ↓ Sistema Web ↓ Servidor ↓ Base de Datos ↓ Pasarela de Pago ↓ Sistema ↓ Cliente

### Diapositiva 21

#### ¿Cuál diagrama UML utilizarías?

Caso 3 Quieres representar las entidades principales de un sistema académico y sus relaciones.

- ¿Qué diagrama utilizarías? • ¿Por qué?

### Diapositiva 22

#### ¿Cuál diagrama UML utilizarías?

Caso 3 Quieres representar las entidades principales de un sistema académico y sus relaciones.

Por ejemplo:

Respuesta ✅Diagrama de Clases ¿Por qué? Porque el objetivo es modelar la estructura estática del sistema.

Alumno ↓ Curso ↓ Profesor ↓ Asignatura ↓ Matrícula ↓ Evaluación

Y definir: • atributos • métodos • asociaciones • herencias • multiplicidades Aquí no interesa el tiempo. No interesa el comportamiento. Interesa responder: ¿Cómo está organizado el sistema?

### Diapositiva 23

#### ¿Cuál diagrama UML utilizarías?

Caso 4 Una empresa desea representar el flujo de aprobación de una solicitud de vacaciones, indicando todas las decisiones posibles hasta llegar a la aprobación o rechazo.

- ¿Qué diagrama utilizarías? • ¿Por qué?

### Diapositiva 24

#### ¿Cuál diagrama UML utilizarías?

Caso 4 Una empresa desea representar el flujo de aprobación de una solicitud de vacaciones, indicando todas las decisiones posibles hasta llegar a la aprobación o rechazo.

Respuesta ✅Diagrama de Actividades ¿Por qué? Porque queremos representar un flujo de trabajo, mostrando: • actividades, • decisiones, • caminos alternativos, • procesos paralelos.

No modelamos clases ni actores. Modelamos un proceso.

### Diapositiva 25

#### ¿Cuál diagrama UML utilizarías?

Caso 5 Una empresa necesita mostrar cómo estarán distribuidos físicamente sus servidores, bases de datos y aplicaciones en la nube.

- ¿Qué diagrama utilizarías? • ¿Por qué?

### Diapositiva 26

#### ¿Cuál diagrama UML utilizarías?

Caso 5 Una empresa necesita mostrar cómo estarán distribuidos físicamente sus servidores, bases de datos y aplicaciones en la nube.

No explica qué hace el sistema ni cómo está construido internamente, sino dónde será desplegado y cómo se distribuyen sus componentes en el entorno operativo.

Respuesta ✅Diagrama de Despliegue (Deployment Diagram) ¿Por qué? Porque interesa representar la infraestructura física donde se ejecutará el sistema: • Servidores • Nube • Bases de datos • Balanceadores de carga • Redes • Contenedores Este diagrama responde a la pregunta: ¿Dónde funcionará el software?

### Diapositiva 27

#### Pensando como un Ingeniero de Software

Antes de dibujar un diagrama... Un Ingeniero de Software debe responder preguntas fundamentales sobre el sistema que va a construir.

Preguntas clave 👥¿Quién utilizará el sistema? ⚙️¿Qué necesita hacer cada usuario? 📄¿Qué información manejará el sistema? 🔄¿Cómo interactúan los distintos componentes? 🏗️¿Cómo estará organizado el software? 🔒¿Qué restricciones de seguridad, rendimiento o disponibilidad existen?

“Los diagramas son el resultado del análisis; nunca reemplazan el análisis.”

### Diapositiva 28

#### Del problema al modelo

“No modelamos porque UML exista; modelamos para comprender mejor la solución antes de construirla.”

### Diapositiva 29

#### Caso Integrador

Plataforma de Venta de Entradas para Conciertos

El cliente solicita: • Venta de entradas en línea. • Selección de asientos. • Pago electrónico. • Emisión de código QR. • Control de acceso al evento.

Pregunta: Si ustedes fueran los Ingenieros de Software... 👉¿Qué diagrama UML desarrollarían primero?

### Diapositiva 30

#### Del problema al modelo

Respuesta: Diagrama de Casos de Uso Porque primero debemos comprender: ¿Qué funcionalidades ofrecerá el sistema y quién interactuará con ellas?

### Diapositiva 31

#### Del problema al modelo

### Diapositiva 32

### Diapositiva 33

#### Actividad de 10 minutos

Identificando Casos de Uso Escenario. Aplicación para un Gimnasio. Identificar: ✔Actores ✔Casos de uso ✔Relaciones No dibujar Solo identifican.

### Diapositiva 34

#### Buenas prácticas al construir Casos de Uso

- Pensar desde la perspectiva del usuario. ✔Utilizar verbos de acción. ✔Evitar detalles técnicos. ✔No describir procesos internos. ✔Mantener nombres simples. ✔Un caso de uso debe aportar valor al usuario.

### Diapositiva 35

#### Buenas prácticas al construir Casos de Uso

❌

Errores frecuentes ❌"Base de Datos" ❌"Guardar Variable" ❌"Actualizar Tabla“

Eso NO son casos de uso.

### Diapositiva 36

#### Relaciones entre Casos de Uso

### Diapositiva 37

#### Casos de Uso - Relaciones

Relación <<include>>

¿Cuándo utilizarla? Cuando un comportamiento es obligatorio y siempre forma parte de otro caso de uso.

Ejemplo Comprar Entrada ↓ <<include>> Pagar Porque no existe compra sin pago.

El caso incluido SIEMPRE se ejecuta.

### Diapositiva 38

#### Casos de Uso - Relaciones

### Diapositiva 39

#### Casos de Uso - Relaciones

Relación <<Extend>>

¿Cuándo utilizarla? Cuando una funcionalidad es opcional y ocurre solamente bajo ciertas condiciones.

Ejemplo Comprar Entrada ↓ <<extend>> Aplicar Cupón de Descuento No siempre existe cupón.

El comportamiento extendido solamente ocurre si se cumple una condición.

### Diapositiva 40

#### Casos de Uso - Relaciones

### Diapositiva 41

#### Casos de Uso - Relaciones

Include vs Extend

<<include>> <<extend>> Obligatorio Opcional Siempre ocurre Ocurre bajo condición Reutiliza funcionalidad común Agrega comportamiento adicional Forma parte del flujo principal Amplía el flujo principal

### Diapositiva 42

#### Casos de Uso – Relaciones, ejemplos

### Diapositiva 43

#### Caso de Uso: ¿Include o Extend?

Caso 1 Retirar Dinero ↓ Validar PIN

Caso 3 Reservar Hotel ↓ Pagar

Caso 2 Comprar Producto ↓ Aplicar Cupón

Caso 4 Reservar Hotel ↓ Contratar Seguro

### Diapositiva 44

#### Caso de Uso: Ejercicio Práctico

Sistema de Gestión para una Biblioteca Universitaria Contexto La Universidad desea reemplazar su actual sistema de biblioteca, ya que presenta numerosos problemas: • El préstamo de libros se realiza de forma lenta. • No existe una reserva en línea. • Los estudiantes no saben si un libro está disponible. • Los préstamos atrasados generan multas que actualmente se calculan manualmente. • Los bibliotecarios dedican mucho tiempo a tareas administrativas. • Los docentes desean recomendar bibliografía obligatoria para cada asignatura. • La universidad quiere disponer de estadísticas sobre los libros más solicitados. Por ello, se les ha contratado como equipo de Ingenieros de Software para desarrollar un nuevo sistema.

### Diapositiva 45

#### Caso de Uso: Ejercicio Práctico

Tiempo 20 minutos

🎯Actividad En equipos de trabajo, elaboren un Diagrama de Casos de Uso UML que represente el funcionamiento general del sistema. Su diagrama deberá considerar, al menos: Actores Identifiquen los actores principales del sistema. (Mínimo 3 actores.)

Casos de uso Identifiquen las funcionalidades más importantes. (Entre 8 y 12 casos de uso.)

Relaciones Cuando corresponda, utilicen correctamente: • Asociación • <<include>> • <<extend>>

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

### Diapositiva 48

#### Ejemplo de Diagrama de Clases

### Diapositiva 49

#### Ejemplo de Diagrama de Secuencia

### Diapositiva 50

#### Ejemplo de Diagrama de Actividades

### Diapositiva 51

#### Ejemplo de Diagrama de Componentes

### Diapositiva 52

#### Ejemplo de Diagrama de Despliegue

### Diapositiva 53

#### Proceso Integral de Desarrollo de Software

¿Dónde estamos ahora?

DISEÑO

“Ya sabemos qué debe hacer el sistema y lo hemos representado mediante modelos UML. El siguiente

desafío consiste en definir cómo construiremos esa solución.”

### Diapositiva 54

#### Del Modelo al Diseño

¿Qué significa diseñar un software?

Antes de escribir una sola línea de código, debemos responder preguntas fundamentales sobre la solución. Un Ingeniero de Software debe decidir: 🏗️¿Cómo estará organizado el sistema? 📂¿Cuántos módulos tendrá? 🔗¿Cómo se comunicarán entre sí? 💾¿Cómo se almacenarán los datos? 🔒¿Cómo se protegerá la información? ⚡¿Cómo garantizar el rendimiento y la escalabilidad?

El diseño de software es el proceso de transformar los requerimientos y modelos en una

solución técnica que servirá como guía para la implementación del sistema.

### Diapositiva 55

#### Del Modelo al Diseño

### Diapositiva 56

#### Del Modelo al Diseño

Diseño vs Implementación

Diseño Implementación Planifica la solución Construye la solución Define arquitectura Escribe código Es independiente del lenguaje Depende del lenguaje elegido Se centra en el "cómo" Se centra en el desarrollo del software

### Diapositiva 57

#### Del Modelo al Diseño

Ejemplo Diseño: El sistema utilizará una arquitectura de tres capas. Implementación: Programar dicha arquitectura utilizando Java, Python o C#.

“Un buen diseño facilita una buena implementación; una mala

implementación puede corregirse, pero un mal diseño suele

afectar todo el proyecto.”

### Diapositiva 58

#### Del Modelo al Diseño

Arquitectura de Software

¿Qué es? La arquitectura representa la estructura de alto nivel del sistema, definiendo los principales componentes y la forma en que interactúan.

### Diapositiva 59

#### Del Modelo al Diseño

Arquitectura de Software de 4 capas

“La arquitectura constituye el plano general sobre el cual se construye todo el software.”

### Diapositiva 60

#### Del Modelo al Diseño

Ventajas ✔Modularidad. ✔Mantenibilidad. ✔Escalabilidad. ✔Reutilización. ✔Facilidad para realizar pruebas.

### Diapositiva 61

#### Del Modelo al Diseño

### Diapositiva 62

#### Del Modelo al Diseño

Buenas prácticas de diseño

- Diseñar antes de programar. ✔Dividir el sistema en módulos. ✔Reducir el acoplamiento. ✔Favorecer la reutilización. ✔Diseñar pensando en el mantenimiento. ✔Mantener una arquitectura simple. ✔Documentar las decisiones de diseño.

### Diapositiva 63

#### Del Modelo al Diseño

Pensando como Arquitectos de Software

"¿Qué creen que falta entre la interfaz y la base de datos? ¿Por qué no sería una buena idea que la aplicación accediera directamente a la base de datos?"

### Diapositiva 64

#### Reflexión Final

"La Ingeniería de Software no consiste en escribir más código; consiste en construir mejores soluciones. Cada

decisión tomada durante el análisis, el modelamiento

y el diseño determina la calidad del software que

finalmente llegará a sus usuarios."

### Diapositiva 65

#### Próxima Clase

🚀Lo que veremos en la próxima clase

Del Diseño... a la Calidad del Software

### Diapositiva 66

UNIVERSIDAD SAN SEBASTIAN

YOCACIÓN POR LA 6XC6L6ł•fClA

Fin Semana 2

NU1STRA /VílS10 N ES EDUCAR EN LA

RAZÓ N, LA VERDA D Y LA VIRTU D.

---

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

### Diapositiva 2

#### OBJETIVO DE LA CLASE

❑Comprender la importancia del Aseguramiento de la Calidad (QA) dentro del proceso de desarrollo de software. ❑Diferenciar los conceptos de Verificación,

Validación y Pruebas de Software. ❑Reconocer la importancia de la documentación y de la evolución continua para garantizar software mantenible y de calidad.

### Diapositiva 3

#### ¿Qué aprenderemos hoy?

Hasta ahora aprendimos a comprender el problema, modelar la solución y diseñar el software.

Durante esta clase abordaremos:

Aseguramiento de la Calidad (QA) Verificación y Validación Introducción a las Pruebas de Software Documentación Evolución del Software

### Diapositiva 4

#### Proceso Integral de Desarrollo de Software

¿Dónde estamos hoy?

QA

"Un buen diseño no garantiza un buen software. Es necesario verificar y validar

continuamente que el sistema cumple los requerimientos definidos."

### Diapositiva 5

#### ¿Qué entendemos por Calidad del Software?

¿Qué características debería tener un software para que

ustedes dijeran: "Este sistema tiene calidad"?

Funciona correctamente. Es seguro. Es rápido. Es fácil de utilizar. Es confiable. Es mantenible. Cumple los requerimientos del cliente.

### Diapositiva 6

#### ¿Qué entendemos por Calidad del Software?

La calidad del software es el grado en que un sistema satisface los requerimientos establecidos, cumple las necesidades de sus usuarios y funciona de manera confiable, eficiente y mantenible.

### Diapositiva 7

#### ¿Por qué es tan importante la calidad?

### Diapositiva 8

#### ¿Por qué es tan importante la calidad?

### Diapositiva 9

#### ¿Qué es QA (Quality Assurance)?

Aseguramiento de la Calidad del Software QA (Quality Assurance) es el conjunto de actividades, procesos y buenas prácticas que tienen como objetivo prevenir defectos y garantizar que el software cumpla los requisitos de calidad definidos durante todo su ciclo de desarrollo.

### Diapositiva 10

#### ¿Qué es QA (Quality Assurance)?

QA busca responder preguntas como: ✓¿Estamos desarrollando el software

correctamente? ✓¿Estamos siguiendo el proceso definido? ✓¿Podemos prevenir errores antes de que

ocurran? ✓¿El producto cumplirá las expectativas del

cliente?

“QA no busca encontrar errores; busca evitar que los errores ocurran.”

### Diapositiva 11

#### QA vs Testing

QA (Quality Assurance) Testing (Pruebas)

Previene defectos. Detecta defectos. Se aplica durante todo el proyecto. Se ejecuta sobre el software desarrollado. Mejora procesos. Evalúa el producto.

Es preventivo. Es correctivo. Participa todo el equipo. Principalmente QA/Testers y desarrolladores.

“Todo proyecto necesita pruebas, pero un proyecto de calidad comienza

mucho antes de ejecutar la primera prueba.”

### Diapositiva 12

#### La Calidad comienza desde el primer día

### Diapositiva 13

#### QA en un proyecto de software

¿Qué creen que es más económico: prevenir un error durante el diseño o descubrirlo cuando el sistema ya está en producción?

¿Por qué?

### Diapositiva 14

#### Caso práctico

Dos equipos de desarrollo

Equipo B

Equipo A

Programa inmediatamente. No documenta. No revisa. Prueba solamente al finalizar.

Levanta requerimientos. Modela. Diseña. Realiza revisiones. Ejecuta pruebas continuamente.

¿Cuál proyecto creen que tendrá mayores probabilidades de éxito? ¿Por qué?

### Diapositiva 15

#### Calidad de Software

La calidad del software no depende únicamente de los programadores; depende del compromiso de todo el equipo con un proceso de desarrollo bien definido.

### Diapositiva 16

#### ACTIVIDAD

"¿Quién tiene la culpa?" Una empresa acaba de entregar un software a un banco. El primer día de funcionamiento comienzan los problemas: • algunos clientes no pueden ingresar; • otros ven saldos incorrectos; • las transferencias fallan; • el sistema se vuelve lento. El gerente dice inmediatamente: "Los programadores hicieron un mal trabajo."

### Diapositiva 17

#### ACTIVIDAD

Deben decidir ¿Quién o quiénes podrían ser responsables? Pueden elegir más de uno.

Cada grupo debe justificar solamente tres responsables y explicar ¿Por qué?

Pregunta ¿Están de acuerdo? Cada grupo tiene 5 minutos para responder.

□Cliente □Analista □Ingeniero de Requerimientos □Arquitecto □Diseñador □Programador □Tester □QA □Gerente de Proyecto □Usuario

### Diapositiva 18

#### ACTIVIDAD

¿Quién tiene realmente la culpa?

Respuesta. Probablemente todos.

Porque la calidad del software NO depende de una sola persona. Depende de todo el proceso. Un error puede originarse en cualquiera de

estas etapas.

### Diapositiva 19

#### ACTIVIDAD

“QA no consiste en encontrar culpables. Consiste en construir procesos que reduzcan la probabilidad

de cometer errores.”

"Después de más de 30 años trabajando en proyectos tecnológicos, les puedo asegurar algo: cuando un proyecto fracasa, casi nunca es culpa de

una sola persona. Los proyectos fracasan porque falló el proceso de

ingeniería."

### Diapositiva 20

#### Verificación vs. Validación

Dos conceptos que todo Ingeniero de Software debe conocer Aunque suelen confundirse, Verificación y Validación tienen objetivos distintos dentro del aseguramiento de la calidad.

Verificación Validación

¿Estamos construyendo correctamente el producto?

¿Estamos construyendo el producto correcto? Evalúa el proceso y los artefactos generados.

Evalúa si el software satisface las necesidades del usuario. Se realiza durante todo el desarrollo. Se realiza sobre el producto desarrollado.

“Verificar significa comprobar que estamos haciendo bien el trabajo. Validar significa comprobar que estamos resolviendo el problema correcto.”

### Diapositiva 21

#### Verificación

¿Qué significa verificar? La verificación consiste en revisar cada etapa del desarrollo para asegurar que cumple con las especificaciones definidas. No requiere que el software esté terminado.

Ejemplos

Revisar un documento de requerimientos. Revisar un diagrama UML. Revisar la arquitectura propuesta. Realizar una inspección de código. Revisar la documentación técnica.

¿Es posible verificar un sistema antes de escribir una sola línea de código?

### Diapositiva 22

#### Verificación

¿Es posible verificar un sistema antes de escribir una sola línea de código?

Sí. Porque también verificamos documentos, modelos y diseños.

La verificación busca prevenir errores antes de que lleguen al producto final.

### Diapositiva 23

#### Validación

¿Qué significa validar? La validación consiste en comprobar que el software desarrollado satisface las necesidades del cliente y resuelve correctamente el problema para el cual fue construido.

Ejemplos

El cliente prueba el sistema. Se ejecutan pruebas de aceptación. El usuario confirma que el sistema cumple sus expectativas. El software funciona correctamente en el entorno real.

¿Podemos validar un software que aún no ha sido construido?

### Diapositiva 24

#### Validación

¿Podemos validar un software que aún no ha sido construido?

No. Porque la validación requiere un producto o prototipo funcional.

La validación demuestra que desarrollamos el software que el cliente realmente necesitaba.

### Diapositiva 25

#### Verificación vs. Validación

Ejemplo práctico Proyecto Sistema de Agenda Médica

Verificación ✓Revisar que los requerimientos

Validación ✓El médico agenda una consulta. ✓El paciente recibe la

estén completos. ✓Revisar el Diagrama de Casos de

confirmación. ✓El sistema funciona

Uso. ✓Revisar la arquitectura. ✓Revisar el código fuente.

correctamente. ✓El cliente acepta el producto.

### Diapositiva 26

#### Verificación vs. Validación

“Es posible verificar correctamente un proyecto y aun así desarrollar un sistema

que el cliente no necesita.”

### Diapositiva 27

#### ¿Verificación o Validación?

Juego rápido: Indicar V o VAL

Verificación

Caso 1 Revisar el documento de requerimientos.

Validación

Caso 2 El cliente prueba el sistema antes de aceptarlo.

Verificación

Caso 3 Un arquitecto revisa el diseño del software.

### Diapositiva 28

#### ¿Verificación o Validación?

Juego rápido: Indicar V o VAL

Validación

Caso 4 Los usuarios utilizan el sistema durante una semana piloto.

Verificación

Caso 5 Un desarrollador realiza una revisión de código con otro integrante del equipo.

“Un proyecto exitoso requiere tanto verificar continuamente el proceso

como validar que el producto final cumple las expectativas del cliente.”

### Diapositiva 29

#### ¿Qué son las Pruebas de Software?

Las pruebas de software son actividades destinadas a evaluar el comportamiento de un sistema, detectar defectos y comprobar que cumple los requerimientos establecidos.

Las pruebas buscan responder: ✓¿El software hace lo que debería hacer? ✓¿Produce los resultados esperados? ✓¿Responde correctamente ante errores? ✓¿Funciona adecuadamente cuando sus

componentes interactúan? ✓¿Satisface las necesidades del usuario?

### Diapositiva 30

#### ¿Qué entendemos por Calidad del Software?

“Las pruebas pueden

demostrar la

presencia de defectos, pero no garantizar su ausencia

absoluta.”

### Diapositiva 31

#### No todos los errores son iguales

Error Una acción humana incorrecta. Ejemplo: Un programador interpreta incorrectamente una regla de cálculo.

Defecto (Bug) El error queda incorporado en el software. Ejemplo: La fórmula fue programada incorrectamente.

Falla El defecto se manifiesta cuando el sistema se ejecuta. Ejemplo: El sistema cobra $190.000 cuando debería cobrar $19.000.

### Diapositiva 32

#### No todos los errores son iguales

### Diapositiva 33

#### Niveles de Pruebas de Software

Ahora se presenta mapa completo antes de entrar en cada nivel.

1️⃣Pruebas Unitarias Evalúan componentes individuales. ↓ 2️⃣Pruebas de Integración Evalúan la interacción entre componentes. ↓ 3️⃣Pruebas de Sistema Evalúan el sistema completo. ↓ 4️⃣Pruebas de Aceptación Evalúan si el sistema satisface las necesidades del cliente.

### Diapositiva 34

#### Niveles de Pruebas de Software

### Diapositiva 35

#### Niveles de Pruebas de Software

❑Pruebas Unitarias

Probamos una pequeña parte del software Las pruebas unitarias verifican el funcionamiento de componentes individuales, como funciones, métodos o clases. Ejemplo Tenemos una función: calcularDescuento(precio, porcentaje) Si: Precio = $100.000 Descuento = 20% Resultado esperado: $80.000

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

### Diapositiva 37

#### Niveles de Pruebas de Software

❑Pruebas de Integración

¿Qué ocurre cuando juntamos las piezas? Un componente puede funcionar perfectamente de manera independiente... pero fallar cuando se comunica con otros. Ejemplo: Compra por Internet:

Tienda Web ↓ Sistema de Inventario ↓ Pasarela de Pago ↓ Sistema de Despacho ↓ Correo de Confirmación

### Diapositiva 38

#### Niveles de Pruebas de Software

❑Pruebas de Integración

Todos podrían funcionar correctamente de manera individual. Pero...

El pago se realiza y el inventario no se actualiza. El pedido se registra, pero despacho nunca lo recibe. La compra termina correctamente, pero no se envía la confirmación. Entonces... Las pruebas de integración comprueban que los diferentes módulos o servicios se comuniquen correctamente entre sí.

“Que todas las piezas funcionen por separado no significa que el

sistema funcione cuando las conectamos.”

### Diapositiva 39

#### Niveles de Pruebas de Software

### Diapositiva 40

#### Niveles de Pruebas de Software

❑Pruebas del Sistema

¿Funciona el sistema completo? Después de comprobar componentes individuales y su integración, debemos evaluar el software como una solución completa. ¿Qué evaluamos?

Funcionamiento de extremo a extremo. Cumplimiento de requerimientos. Interacción entre todos los módulos. Comportamiento en condiciones similares a producción. Respuesta ante situaciones normales y excepcionales.

Ejemplo: Comercio Electrónico Ya no probamos solamente "Pagar" o "Inventario". Probamos el proceso completo: Cliente → Busca producto → Agrega al carrito → Compra → Paga → Actualiza inventario → Genera pedido → Despacho → Confirmación

### Diapositiva 41

#### Niveles de Pruebas de Software

❑Pruebas del Sistema

Una prueba podría ser: Un cliente compra el último notebook disponible utilizando tarjeta de crédito. El sistema debería: 1. Autorizar el pago. 2. Registrar la venta. 3. Actualizar el stock a 0. 4. Generar el pedido. 5. Enviar la confirmación. 6. Impedir una segunda venta del mismo producto.

“En las pruebas de sistema dejamos de preguntar si cada pieza funciona y comenzamos a

preguntar si la solución completa funciona correctamente.”

### Diapositiva 42

#### Niveles de Pruebas de Software

❑Pruebas de Aceptación

¿El cliente acepta el sistema? Aquí llegamos al nivel más cercano al usuario y al negocio. Las pruebas de aceptación permiten comprobar si el sistema satisface las necesidades del cliente y está preparado para ser utilizado en un contexto real. Aquí cambia la pregunta: Ya no solamente preguntamos: ¿Funciona técnicamente?

Ahora preguntamos: ¿Sirve realmente para lo que fue construido?

### Diapositiva 43

#### Niveles de Pruebas de Software

❑Pruebas de Aceptación

Ejemplo: Sistema de Inscripción de Asignaturas El sistema podría técnicamente:

Iniciar sesión. Mostrar asignaturas. Registrar inscripciones. Guardar correctamente los datos. Pero los estudiantes descubren que:

No muestra los cupos disponibles. No informa choques de horario. No advierte incumplimiento de prerrequisitos. Entonces... El software funciona técnicamente, pero podría NO ser aceptado por el usuario.

### Diapositiva 44

#### Niveles de Pruebas de Software

### Diapositiva 45

#### Nivel de prueba ≠ Tipo de prueba

Una distinción importante Aquí hay una confusión frecuente que debemos evitar.

NIVEL DE PRUEBA Responde: ¿En qué nivel del software estamos probando? • Unitaria • Integración • Sistema • Aceptación

TIPO DE PRUEBA Responde: ¿Qué característica queremos evaluar? Por ejemplo: • Funcionalidad • Rendimiento • Seguridad • Usabilidad • Compatibilidad

### Diapositiva 46

#### Nivel de prueba ≠ Tipo de prueba

Ejemplo Podemos realizar una: Prueba de Sistema para evaluar el: Rendimiento de una plataforma cuando ingresan simultáneamente 10.000 usuarios. Por tanto: Sistema = nivel Rendimiento = tipo

“El nivel indica dónde probamos; el tipo indica qué

queremos comprobar.”

### Diapositiva 47

#### Pruebas Funcionales y No Funcionales

No basta con comprobar que "funciona" Aquí conectamos directamente con los requerimientos vistos en la Semana 1. Pruebas Funcionales Comprueban QUÉ hace el sistema. Ejemplos:

¿Permite iniciar sesión? ¿Calcula correctamente un descuento? ¿Registra una compra? ¿Permite reservar una hora? ¿Genera correctamente una factura?

### Diapositiva 48

#### Pruebas Funcionales y No Funcionales

Pruebas No Funcionales Comprueban CÓMO se comporta el sistema. Ejemplos:

¿Responde en menos de 2 segundos? ¿Protege adecuadamente los datos? ¿Soporta 5.000 usuarios simultáneos? ¿Funciona correctamente en distintos dispositivos? ¿Es accesible y fácil de utilizar?

### Diapositiva 49

#### Pruebas Funcionales y No Funcionales

Ejemplo muy simple Una aplicación bancaria permite realizar una transferencia. Funcional: ¿La transferencia se realiza correctamente? No funcional: ¿Puede realizarla de forma segura, en menos de 3 segundos y soportando miles de usuarios simultáneos?

“Que un sistema haga lo que debe hacer no significa necesariamente que

lo haga con la calidad necesaria.”

### Diapositiva 50

#### ¿Cuándo termina QA?

Nunca es una etapa aislada. La calidad acompaña al software durante todo su ciclo de vida.

### Diapositiva 51

#### Reflexión Final

"QA no comienza cuando terminamos de programar. La calidad se construye desde el

primer requerimiento hasta la evolución del

software."

### Diapositiva 52

#### ¿Qué aprendimos?

“Un software de calidad no es simplemente aquel que funciona.”

Es aquel que hace lo que debe hacer, lo hace correctamente,

responde a las necesidades de sus usuarios y puede seguir

siendo confiable cuando el sistema cambia y evoluciona.

### Diapositiva 53

#### Próxima Clase

¿Qué ocurre después de construir el software?

Documentación Evolución del Software Ciclo de Vida Metodologías de Desarrollo Enfoques de Desarrollo

### Diapositiva 54

UNIVERSIDAD SAN SEBASTIAN

YOCACIÓN POR LA 6XC6L6ł•fClA

Fin Semana 3

N U1 ST RA /Ví l S10 N ES E D U CAR EN LA

RAZÓ N , LA VE RDA D Y LA V I RTU D.

---

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

### Diapositiva 2

#### OBJETIVO DE LA CLASE

❑Comprender la importancia de la

documentación y evolución del software como elementos fundamentales para su mantenimiento y continuidad. ❑Analizar el Ciclo de Vida del Desarrollo de

Software (SDLC) y reconocer sus principales etapas. ❑Comparar diferentes metodologías y

enfoques de desarrollo, identificando sus características, ventajas y contextos de aplicación.

### Diapositiva 3

#### ¿Qué aprenderemos hoy?

Hasta ahora hemos recorrido gran parte del proceso: Necesidad → Requerimientos → Modelamiento → Diseño → Implementación → QA Hoy avanzaremos hacia una visión completa del desarrollo de software. Veremos:

Documentación del Software Evolución del Software Ciclo de Vida del Desarrollo de Software (SDLC) Metodologías de Desarrollo • Estructurada • RAD • RUP • AUP

Enfoques de Desarrollo y dedicaremos especial atención a: SCRUM como uno de los marcos ágiles más utilizados actualmente.

### Diapositiva 4

#### Proceso Integral de Desarrollo de Software

¿Dónde estamos hoy?

Documentación

“El software puede funcionar perfectamente hoy. El verdadero desafío es que

pueda ser comprendido, mantenido y evolucionado mañana.”

### Diapositiva 5

#### EL EXPERIMENTO

Imaginen esta situación... Una empresa posee un sistema crítico desarrollado durante 8 años. Funciona correctamente. Miles de clientes lo utilizan diariamente. Pero... El desarrollador principal renuncia. Y descubre la empresa que:

Casi no existe documentación. Nadie conoce completamente la arquitectura. Algunas reglas de negocio existen solamente en el código. Nadie sabe por qué se tomaron determinadas decisiones técnicas.

Entonces aparece una solicitud aparentemente sencilla: “Necesitamos agregar una nueva funcionalidad.” ¿Tenemos un problema?

### Diapositiva 6

#### EL CÓDIGO NO CUENTA TODA LA HISTORIA

Un sistema puede funcionar perfectamente y, sin embargo, convertirse en un enorme problema cuando debe ser:

mantenido, modificado, actualizado, transferido a otro equipo, escalado, o integrado con nuevas tecnologías. Porque el código puede mostrarnos: QUÉ hace el sistema. Pero no siempre explica: POR QUÉ fue construido de esa manera.

### Diapositiva 7

#### Documentación del Software

La documentación conserva el conocimiento necesario para comprender, utilizar, mantener y evolucionar un sistema a lo largo del tiempo.

“El software puede sobrevivir a su creador; el conocimiento sobre él también debería hacerlo.”

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

### Diapositiva 10

#### EL SOFTWARE NO TERMINA CUANDO SE ENTREGA

Imagina que desarrollamos una aplicación bancaria. La entregamos hoy. ¿Funcionará exactamente igual durante los próximos 10 años? Obviamente no. Cambiarán:

Los dispositivos. Las amenazas de seguridad. Las regulaciones. Las necesidades de los usuarios. El negocio. Las tecnologías. Entonces... El software debe cambiar porque el mundo para el cual fue construido también cambia.

### Diapositiva 11

#### ¿QUÉ ES LA EVOLUCIÓN DEL SOFTWARE?

La Evolución del Software corresponde al proceso continuo mediante el cual un sistema es modificado, adaptado y mejorado después de su puesta en funcionamiento, con el propósito de mantener su utilidad y responder a nuevas necesidades.

¿Por qué evoluciona?

Corregir defectos. Responder a nuevas amenazas. Adaptarse a nuevos entornos. Mejorar rendimiento. Incorporar funcionalidades. Cumplir nuevas regulaciones.

“La primera versión de un software rara vez es su versión definitiva.”

### Diapositiva 12

#### ¿POR QUÉ CAMBIA EL SOFTWARE?

### Diapositiva 13

#### TIPOS DE MANTENIMIENTO DEL SOFTWARE

No todos los cambios tienen el mismo propósito Cuando un software evoluciona, las modificaciones pueden clasificarse según la razón que las origina.

Tipo Propósito Ejemplo

Correctivo Corregir defectos encontrados Corregir un cálculo incorrecto en una factura

Adaptativo Adaptarse a cambios externos Adecuar el sistema a una nueva versión del sistema operativo

Perfectivo Mejorar o ampliar el sistema Incorporar pagos mediante una nueva plataforma

Preventivo Evitar problemas futuros Refactorizar código difícil de mantener

### Diapositiva 14

#### ¿QUÉ DOCUMENTAMOS?

### Diapositiva 15

#### ¿QUÉ TIPO DE MANTENIMIENTO ES?

Juego rápido

CASO 1 Una aplicación bancaria calcula incorrectamente los intereses.

Correctivo

CASO 2 Una nueva regulación exige modificar la información de las facturas electrónicas.

Adaptativo

CASO 3 Los usuarios solicitan autenticación mediante huella digital.

Perfectivo

### Diapositiva 16

#### ¿QUÉ TIPO DE MANTENIMIENTO ES?

Juego rápido

CASO 4 El equipo reorganiza un módulo antiguo para reducir su complejidad antes de futuras modificaciones.

Preventivo

CASO 5 La empresa migra su aplicación porque la tecnología utilizada dejará de tener soporte.

Adaptativo / Preventivo

### Diapositiva 17

#### DEL PROCESO AL CICLO DE VIDA

### Diapositiva 18

#### ¿QUÉ ES EL SDLC?

Software Development Life Cycle El Ciclo de Vida del Desarrollo de Software (SDLC) representa el conjunto organizado de etapas por las que atraviesa un sistema desde que surge una necesidad hasta su operación, mantenimiento y eventual reemplazo.

### Diapositiva 19

#### ¿QUÉ ES EL SDLC?

### Diapositiva 20

#### ¿QUÉ ES EL SDLC?

NO.

Consideremos dos proyectos:

PROYECTO B Nueva aplicación móvil para una startup. • Requerimientos cambiantes. • Necesidad de llegar rápidamente al mercado. • Retroalimentación constante de usuarios. • Nuevas versiones frecuentes.

PROYECTO A Software para controlar un dispositivo médico crítico. • Requerimientos muy regulados. • Alta necesidad de documentación. • Cambios cuidadosamente controlados. • Un error puede tener consecuencias graves.

¿Tendría sentido gestionar ambos proyectos exactamente de la misma

manera?

### Diapositiva 21

MODELOS, METODOLOGÍAS Y ENFOQUES DE DESARROLLO

### Diapositiva 22

#### ¿MODELO, METODOLOGÍA O ENFOQUE?

Conceptos relacionados, pero NO idénticos En Ingeniería de Software utilizamos estos términos con frecuencia, y muchas veces se mezclan.

MODELO DE CICLO DE VIDA

Representa cómo se organizan y relacionan las etapas del desarrollo. Ejemplo: Modelo en Cascada

### Diapositiva 23

#### ¿MODELO, METODOLOGÍA O ENFOQUE?

METODOLOGÍA

Define de manera más concreta cómo desarrollar y gestionar el proyecto, incluyendo procesos, prácticas, técnicas, roles y artefactos.

Ejemplos: RUP · AUP · RAD

### Diapositiva 24

#### ¿MODELO, METODOLOGÍA O ENFOQUE?

ENFOQUE

Representa una filosofía o forma general de abordar el desarrollo. Ejemplos: Predictivo · Iterativo · Incremental · Ágil

“El SDLC nos dice qué actividades debemos realizar; los modelos,

metodologías y enfoques ayudan a decidir cómo organizarlas y

ejecutarlas.”

### Diapositiva 25

#### DOS GRANDES FORMAS DE ORGANIZAR EL DESARROLLO

¿Planificar primero o adaptarnos continuamente?

ENFOQUE PREDICTIVO Planificar → Definir → Diseñar → Construir → Entregar

Busca anticipar gran parte del proyecto desde el comienzo. Funciona mejor cuando:

Los requerimientos son relativamente estables. Existe alta necesidad de planificación. Los cambios deben ser controlados. Existe regulación o documentación formal.

### Diapositiva 26

#### DOS GRANDES FORMAS DE ORGANIZAR EL DESARROLLO

ENFOQUE ADAPTATIVO

Construir → Entregar → Aprender → Adaptar → Construir nuevamente Acepta que el proyecto y sus requerimientos pueden cambiar. Funciona especialmente bien cuando:

Existe incertidumbre. Los requerimientos evolucionan. Necesitamos retroalimentación frecuente. Podemos entregar valor progresivamente.

### Diapositiva 27

#### DOS GRANDES FORMAS DE ORGANIZAR EL DESARROLLO

ENFOQUE PREDICTIVO Planificar → Definir → Diseñar → Construir → Entregar

ENFOQUE ADAPTATIVO Construir → Entregar → Aprender → Adaptar → Construir nuevamente

Pregunta ¿Cuál es mejor? ✓DEPENDE DEL PROYECTO.

### Diapositiva 28

#### DESARROLLO ESTRUCTURADO

Una forma clásica de construir software El desarrollo estructurado busca abordar sistemas complejos mediante una descomposición ordenada del problema, utilizando procesos, datos y funciones claramente definidos. Históricamente tuvo gran relevancia en el desarrollo de sistemas de información. Características

Análisis sistemático del problema. Descomposición funcional. Documentación formal. Etapas claramente definidas. Énfasis en planificación y control. Herramientas clásicas asociadas • Diagramas de Flujo de Datos (DFD). • Diccionario de Datos. • Diagramas de procesos. • Especificaciones funcionales.

### Diapositiva 29

#### MODELO EN CASCADA

### Diapositiva 30

#### ¿CASCADA ESTÁ MUERTA?

NO necesariamente. Existe una tendencia a pensar: Tradicional = Malo Ágil = Bueno

PROYECTO A Una startup desarrolla una nueva red social. Los requerimientos cambian constantemente.

PROYECTO B Software para un sistema altamente regulado, con requisitos contractuales, trazabilidad y documentación exhaustiva.

Un proceso rígidamente secuencial probablemente no sea la mejor alternativa.

Un enfoque con mayor planificación, control y formalidad puede ser perfectamente razonable.

### Diapositiva 31

#### ¿Y SI NO PODEMOS ESPERAR HASTA EL FINAL?

El problema del tiempo Imaginemos este proyecto:

Una empresa necesita una aplicación para gestionar pedidos de sus clientes. El proyecto completo tardará aproximadamente 12 meses.

Con un desarrollo predominantemente secuencial: Requerimientos → Análisis → Diseño → Desarrollo → Pruebas → Entrega El cliente podría esperar muchos meses antes de utilizar una versión operativa. Pero el negocio necesita resultados mucho antes.

Entonces surge otra pregunta: ¿Podemos construir y entregar software útil más rápidamente sin esperar a tener todo el sistema terminado?

Aquí comienza a cambiar la forma de desarrollar. VELOCIDAD + PROTOTIPOS + PARTICIPACIÓN DEL USUARIO + ITERACIÓN

### Diapositiva 32

#### RAD (Rapid Application Development)

RAD es un enfoque de desarrollo que busca reducir los tiempos de construcción mediante:

Desarrollo rápido. Prototipos. Participación frecuente del usuario. Iteraciones. Reutilización de componentes. Entregas rápidas.

### Diapositiva 33

#### RAD (Rapid Application Development)

La lógica cambia En lugar de intentar especificar completamente el sistema antes de construir: Construimos rápidamente → mostramos → recibimos retroalimentación → ajustamos → volvemos a construir. Idea clave RAD busca aprender rápidamente mediante versiones funcionales y retroalimentación frecuente del usuario.

### Diapositiva 34

#### RAD

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

### Diapositiva 36

#### ITERATIVO ≠ INCREMENTAL

### Diapositiva 37

#### ¿QUÉ ES RUP?

RUP — Rational Unified Process RUP es un proceso de desarrollo de software iterativo e incremental, orientado a organizar proyectos mediante fases, disciplinas, roles y artefactos claramente definidos. Sus características principales

Iterativo El producto se desarrolla y mejora mediante sucesivas iteraciones.

Incremental Cada iteración puede incorporar nuevas capacidades al sistema.

Dirigido por riesgos Los riesgos importantes se enfrentan tempranamente.

Centrado en la arquitectura La arquitectura constituye una base fundamental del proyecto.

Guiado por casos de uso Los requerimientos funcionales orientan buena parte del desarrollo.

### Diapositiva 38

#### RUP

### Diapositiva 39

#### RUP NO ES CASCADA

Cuidado con esta interpretación Al observar: Inicio → Elaboración → Construcción → Transición podríamos pensar: “Entonces RUP es simplemente otra forma de Cascada.” NO. CASCADA Requisitos → Diseño → Código → Pruebas → Entrega Predomina una progresión secuencial entre etapas. RUP

ITERACIÓN 1

──────────── INICIO → ELABORACIÓN → CONSTRUCCIÓN → TRANSICIÓN

──────────── ITERACIÓN 2...

### Diapositiva 40

#### RUP EN UN PROYECTO REAL

Ejemplo: Plataforma de Comercio Electrónico

INICIO Definimos: • Comprar productos. • Administrar clientes. • Procesar pagos. • Gestionar despachos. Identificamos alcance y riesgos iniciales.

CONSTRUCCIÓN Desarrollamos progresivamente: Incremento 1: Catálogo. Incremento 2: Carrito. Incremento 3: Pagos. Incremento 4: Despacho. Y realizamos pruebas durante el desarrollo.

ELABORACIÓN Diseñamos la arquitectura. Analizamos especialmente riesgos como: Pagos · Seguridad · Inventario · Integraciones Construimos una base arquitectónica estable.

TRANSICIÓN Desplegamos el sistema. Usuarios reales lo utilizan. Corregimos problemas. Capacitamos. Liberamos la versión productiva.

### Diapositiva 41

#### ¿CUÁNDO PODRÍA UTILIZARSE RUP?

RUP resulta especialmente interesante cuando... ✓El proyecto tiene una complejidad importante. ✓Existen riesgos técnicos relevantes. ✓Necesitamos una arquitectura sólida. ✓Requerimos trazabilidad y documentación. ✓Participan diferentes roles o equipos. ✓Queremos desarrollar de manera iterativa e

incremental manteniendo una estructura formal.

¿Cuál puede ser el problema? Si se implementa de manera excesivamente rígida: Demasiados artefactos. Exceso de documentación. Procesos pesados. Mayor esfuerzo de gestión.

### Diapositiva 42

#### AUP (Agile Unified Process)

Pero busca reducir:

AUP surge como una alternativa más simple y ligera inspirada en RUP. Mantiene ideas importantes como:

Desarrollo iterativo. Desarrollo incremental. Importancia de la arquitectura. Gestión de riesgos. Calidad durante el desarrollo.

Complejidad. Exceso de documentación. Cantidad de artefactos. Formalidad innecesaria. En términos simples: RUP Estructurado + completo + formal ↓ AUP Iterativo + estructurado + simplificado + ágil

AUP intenta conservar la disciplina de RUP reduciendo su complejidad y acercándolo a los principios ágiles.

### Diapositiva 43

#### DE RUP A AUP

RUP AUP Proceso más completo Proceso simplificado Mayor cantidad de artefactos Menos artefactos Mayor formalidad Mayor flexibilidad Iterativo e incremental Iterativo e incremental Orientado a arquitectura Mantiene foco arquitectónico Puede resultar pesado Busca ser más ligero

### Diapositiva 44

#### AUP (Agile Unified Process)

Pero aparece una pregunta mucho mayor... • Si los requerimientos cambian constantemente... • Si necesitamos entregar valor rápidamente... • Si necesitamos conversar frecuentemente con el cliente... • Si debemos adaptarnos durante el proyecto... ¿Necesitamos cambiar solamente el proceso... o nuestra forma de pensar el desarrollo? Y aquí aparece:

AGILIDAD

### Diapositiva 45

#### UN CAMBIO DE PARADIGMA

El problema ya no es solamente construir software Imaginemos un proyecto de 18 meses. Durante el primer mes el cliente define lo que necesita. El equipo trabaja durante meses. Finalmente entrega exactamente lo solicitado. Pero... 18 meses después, el negocio cambió. El software cumple perfectamente el documento original... pero ya no resuelve completamente la necesidad actual.

Pregunta ¿El proyecto fue exitoso porque cumplió exactamente el plan inicial?

“En entornos de alta incertidumbre, seguir perfectamente un plan

equivocado no garantiza el éxito.”

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

### Diapositiva 47

#### ¿QUÉ SIGNIFICA DESARROLLAR DE FORMA ÁGIL?

### Diapositiva 48

#### SCRUM

Un marco de trabajo para problemas complejos ¿Qué es Scrum? Scrum es un framework ligero que ayuda a personas, equipos y organizaciones a generar valor mediante soluciones adaptativas para problemas complejos.

### Diapositiva 49

#### SCRUM

### Diapositiva 50

#### ¿POR QUÉ EXISTE SCRUM?

Porque desarrollar software implica incertidumbre En muchos proyectos no podemos conocer completamente desde el comienzo: • todos los requerimientos; • todos los problemas técnicos; • cómo reaccionarán los usuarios; • qué funcionalidades aportarán realmente valor; • qué cambios aparecerán durante el desarrollo.

Enfoque tradicional Intentamos reducir la incertidumbre planificando.

### Diapositiva 51

#### ¿POR QUÉ EXISTE SCRUM?

Scrum agrega otra estrategia: Reducir la incertidumbre aprendiendo. ¿Cómo? Construir → Inspeccionar → Aprender → Adaptar Ejemplo Desarrollamos una aplicación durante 12 meses y descubrimos al final que el usuario quería algo diferente. vs. Cada pocas semanas entregamos algo utilizable, recibimos feedback y ajustamos lo siguiente.

### Diapositiva 52

#### SCRUM - EL EMPIRISMO

### Diapositiva 53

#### SCRUM

### Diapositiva 54

#### SCRUM

### Diapositiva 55

#### EL SCRUM TEAM

¿Quién hace que Scrum funcione? La unidad fundamental de Scrum es un pequeño equipo de personas denominado: SCRUM TEAM

Está compuesto por:

PRODUCT OWNER Maximiza el valor del producto.

SCRUM MASTER Ayuda al equipo y a la organización a comprender y aplicar Scrum correctamente.

DEVELOPERS Crean un Incremento utilizable durante cada Sprint.

### Diapositiva 56

#### EL SCRUM TEAM

Una característica fundamental NO son tres equipos separados. Son UN SOLO EQUIPO. Product Owner + Scrum Master + Developers El Scrum Team es:

Multifuncional. Autogestionado. Orientado a un objetivo común. Responsable de generar valor. Importante La Scrum Guide establece que un Scrum Team suele ser de 10 personas o menos. Scrum busca equipos pequeños, cohesionados y capaces de transformar una necesidad en valor.

### Diapositiva 57

#### SCRUM TEAMS

### Diapositiva 58

#### SCRUM

### Diapositiva 59

#### SCRUM

### Diapositiva 60

#### SCRUM - ACTIVIDAD 10 MINUTOS

“¿QUIÉN SE HACE CARGO?”

Imaginen este Scrum Team Una universidad está desarrollando una nueva aplicación móvil para sus estudiantes. Durante el Sprint ocurren las siguientes situaciones:

CASO 1 Existen 15 funcionalidades pendientes, pero solo pueden abordar 5 próximamente. ¿Quién es responsable de ordenar el Product Backlog buscando maximizar valor?

### Diapositiva 61

#### SCRUM - ACTIVIDAD 10 MINUTOS

CASO 2 El equipo lleva tres días sin poder acceder al ambiente de pruebas. ¿Quién debería ayudar a que el impedimento sea abordado?

CASO 3 Hay que decidir técnicamente cómo implementar el nuevo módulo de autenticación. ¿Quién decide cómo realizar el trabajo?

CASO 4 El Rector solicita directamente a un Developer: “Agrega esta funcionalidad ahora. Es urgente.” ¿Qué problema observan desde la perspectiva de Scrum?

### Diapositiva 62

#### SCRUM - ACTIVIDAD 10 MINUTOS

CASO 5 Una funcionalidad fue terminada, pero presenta errores y no cumple la Definition of Done.

El Product Owner dice: “No importa. Yo la apruebo igual.” ¿Puede considerarse parte del Incremento terminado?

### Diapositiva 63

#### SCRUM - ACTIVIDAD 10 MINUTOS

INSTRUCCIONES Cada grupo tiene:

5 minutos Para responder los cinco casos. Luego:

5 minutos Los discutimos entre todos. Pero deben responder siempre: PRODUCT OWNER SCRUM MASTER DEVELOPERS o TODO EL SCRUM TEAM y justificar brevemente el porqué.

### Diapositiva 64

#### SCRUM

“Scrum no elimina las responsabilidades. Las hace explícitas.”

¿Quién es entonces el jefe del Scrum Team?

¡¡ Scrum no define un “jefe del equipo”. Define

responsabilidades claras dentro de un equipo

autogestionado!!

### Diapositiva 65

#### SCRUM

### Diapositiva 66

#### LOS ARTEFACTOS DE SCRUM

Artefacto Compromiso

Product Backlog Product Goal Sprint Backlog Sprint Goal Increment Definition of Done

Los artefactos hacen transparente el trabajo; sus compromisos permiten medir el progreso hacia objetivos concretos.

### Diapositiva 67

#### LOS ARTEFACTOS DE SCRUM

### Diapositiva 68

#### SCRUM

### Diapositiva 69

#### SCRUM

### Diapositiva 70

#### SCRUM

### Diapositiva 71

EL SPRINT EL CORAZÓN DE SCRUM

El Sprint es un período de duración fija de un mes o menos durante el cual el Scrum Team trabaja para alcanzar un Sprint Goal y generar valor. Un nuevo Sprint comienza inmediatamente después de finalizar el anterior. Dentro del Sprint ocurren: SPRINT PLANNING ↓ DAILY SCRUM ↓ TRABAJO PARA CREAR EL INCREMENTO ↓ SPRINT REVIEW ↓ SPRINT RETROSPECTIVE ↺

### Diapositiva 72

EL SPRINT EL CORAZÓN DE SCRUM

Durante el Sprint...

No se realizan cambios que pongan en peligro el Sprint Goal. La calidad no disminuye. El Product Backlog se refina cuando es necesario. El alcance puede aclararse y renegociarse con el Product Owner a medida que se aprende. Idea clave El Sprint crea un ciclo corto en el que planificamos, construimos, inspeccionamos, aprendemos y nos adaptamos.

### Diapositiva 73

#### SCRUM

### Diapositiva 74

#### SCRUM

### Diapositiva 75

#### SCRUM

### Diapositiva 76

#### SCRUM

### Diapositiva 77

#### Comparación: Review vs Retrospective

“Tenemos una aplicación excelente, pero un equipo completamente desorganizado. ¿Review o Retrospective?”

Retrospective!

“El equipo trabaja extraordinariamente bien, pero los usuarios dicen que la funcionalidad desarrollada no les sirve. ¿Review o Retrospective?”

Review.

### Diapositiva 78

#### SCRUM

### Diapositiva 79

#### SCRUM

### Diapositiva 80

#### SCRUM

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

### Diapositiva 82

#### ¿CUÁL UTILIZARÍAS?

“Un buen Ingeniero de Software no elige una

metodología porque sea popular; la elige porque responde adecuadamente al problema

que debe resolver.”

### Diapositiva 83

#### SCRUM

### Diapositiva 84

#### Próxima Clase

PRÓXIMA CLASE COMENZAMOS LA UNIDAD 2 ¿QUÉ VEREMOS?

Fundamentos de Gestión de Proyectos Alcance y objetivos del proyecto Planificación y organización del trabajo Tiempo, actividades e hitos Roles y responsabilidades del equipo Introducción a la Gestión de Riesgos

Pregunta para la próxima clase ¿Por qué un proyecto puede tener un buen software y aun así fracasar?

### Diapositiva 85

UNIVERSIDAD SAN SEBASTIAN

YOCACIÓN POR LA 6XC6L6ł•fClA

Fin Semana 4

N U1 ST RA /Ví l S10 N ES E D U CAR EN LA

RAZÓ N , LA VE RDA D Y LA V I RTU D.

---

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

### Diapositiva 2

#### OBJETIVO DE LA CLASE

- Comprender el papel de la estimación dentro de

la administración de un proyecto de software. • Identificar las características que hacen

especialmente difícil estimar proyectos de software. • Diferenciar los conceptos de tamaño, esfuerzo,

duración, recursos y costo. • Reconocer los principales recursos que intervienen

en el desarrollo de software. • Utilizar métricas básicas para apoyar decisiones

iniciales de estimación.

### Diapositiva 3

#### OBJETIVO DE LA CLASE

### Diapositiva 4

#### ¿Qué aprenderemos hoy?

### Diapositiva 5

#### ¿Qué aprenderemos hoy?

### Diapositiva 6

#### EL PRIMER DESAFÍO

### Diapositiva 7

#### EL PRIMER DESAFÍO

### Diapositiva 8

### Diapositiva 9

### Diapositiva 10

### Diapositiva 11

### Diapositiva 12

### Diapositiva 13

### Diapositiva 14

### Diapositiva 15

### Diapositiva 16

### Diapositiva 17

### Diapositiva 18

### Diapositiva 19

### Diapositiva 20

### Diapositiva 21

### Diapositiva 22

### Diapositiva 23

### Diapositiva 24

### Diapositiva 25

### Diapositiva 26

### Diapositiva 27

### Diapositiva 28

### Diapositiva 29

### Diapositiva 30

### Diapositiva 31

### Diapositiva 32

### Diapositiva 33

### Diapositiva 34

### Diapositiva 35

### Diapositiva 36

### Diapositiva 37

### Diapositiva 38

### Diapositiva 39

### Diapositiva 40

### Diapositiva 41

### Diapositiva 42

### Diapositiva 43

### Diapositiva 44

### Diapositiva 45

### Diapositiva 46

### Diapositiva 47

### Diapositiva 48

### Diapositiva 49

### Diapositiva 50

### Diapositiva 51

### Diapositiva 52

### Diapositiva 53

### Diapositiva 54

### Diapositiva 55

### Diapositiva 56

### Diapositiva 57

### Diapositiva 58

### Diapositiva 59

### Diapositiva 60

### Diapositiva 61

### Diapositiva 62

### Diapositiva 63

### Diapositiva 64

### Diapositiva 65

### Diapositiva 66

### Diapositiva 67

### Diapositiva 68

### Diapositiva 69

### Diapositiva 70

### Diapositiva 71

#### PRÓXIMA CLASE

¿CÓMO MEDIMOS EL TAMAÑO DEL SOFTWARE?

PASAREMOS DE ESTIMAR A MEDIR Hasta ahora aprendimos que:

TAMAÑO → ESFUERZO → DURACIÓN → RECURSOS → COSTO

### Diapositiva 72

UNIVERSIDAD SAN SEBASTIAN

YOCACIÓN POR LA 6XC6L6ł•fClA

Fin Semana 5

N U1 ST RA /Ví l S10 N ES E D U CAR EN LA

RAZÓ N , LA VE RDA D Y LA V I RTU D.

---

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

### Diapositiva 2

#### OBJETIVO DE LA CLASE

Comprender y aplicar técnicas para estimar el tamaño de un software, utilizando Líneas de Código (LOC) y Puntos de Función (FP) como base para posteriormente estimar esfuerzo, duración, recursos y costos.

Al finalizar la clase podremos:

- Explicar qué significa tamaño del software. • Utilizar LOC como medida de tamaño. • Comprender sus ventajas y limitaciones. • Identificar los elementos utilizados en Puntos de Función. • Realizar una estimación mediante FP. • Comparar LOC y FP para determinar cuándo resulta más apropiado utilizar cada técnica.

### Diapositiva 3

#### CONTENIDOS

### Diapositiva 4

#### CONTENIDOS

### Diapositiva 5

#### CONTENIDOS

### Diapositiva 6

#### CONTENIDOS

### Diapositiva 7

#### CONTENIDOS

### Diapositiva 8

#### CONTENIDOS

### Diapositiva 9

#### CONTENIDOS

### Diapositiva 10

#### CONTENIDOS

### Diapositiva 11

#### CONTENIDOS

### Diapositiva 12

#### CONTENIDOS

### Diapositiva 13

#### CONTENIDOS

### Diapositiva 14

#### CONTENIDOS

### Diapositiva 15

#### CONTENIDOS

### Diapositiva 16

#### CONTENIDOS

### Diapositiva 17

#### CONTENIDOS

### Diapositiva 18

#### CONTENIDOS

### Diapositiva 19

#### CONTENIDOS

### Diapositiva 20

#### CONTENIDOS

### Diapositiva 21

#### CONTENIDOS

### Diapositiva 22

#### CONTENIDOS

### Diapositiva 23

#### CONTENIDOS

### Diapositiva 24

#### CONTENIDOS

### Diapositiva 25

#### CONTENIDOS

### Diapositiva 26

#### CONTENIDOS

### Diapositiva 27

#### CONTENIDOS

### Diapositiva 28

#### CONTENIDOS

### Diapositiva 29

#### CONTENIDOS

### Diapositiva 30

#### CONTENIDOS

### Diapositiva 31

#### CONTENIDOS

### Diapositiva 32

#### CONTENIDOS

### Diapositiva 33

#### CONTENIDOS

### Diapositiva 34

#### CONTENIDOS

### Diapositiva 35

#### CONTENIDOS

### Diapositiva 36

#### CONTENIDOS

### Diapositiva 37

#### CONTENIDOS

### Diapositiva 38

#### CONTENIDOS

### Diapositiva 39

#### CONTENIDOS

### Diapositiva 40

#### CONTENIDOS

### Diapositiva 41

#### CONTENIDOS

### Diapositiva 42

#### CONTENIDOS

### Diapositiva 43

#### CONTENIDOS

### Diapositiva 44

#### CONTENIDOS

### Diapositiva 45

#### CONTENIDOS

### Diapositiva 46

#### CONTENIDOS

### Diapositiva 47

#### CONTENIDOS

### Diapositiva 48

#### CONTENIDOS

### Diapositiva 49

#### CONTENIDOS

### Diapositiva 50

#### CONTENIDOS

### Diapositiva 51

#### CONTENIDOS

### Diapositiva 52

#### CONTENIDOS

### Diapositiva 53

#### CONTENIDOS

### Diapositiva 54

#### CONTENIDOS

### Diapositiva 55

#### CONTENIDOS

### Diapositiva 56

#### CONTENIDOS

### Diapositiva 57

#### CONTENIDOS

### Diapositiva 58

### Diapositiva 59

#### PRÓXIMA CLASE

¿CÓMO MEDIMOS EL TAMAÑO DEL SOFTWARE?

PASAREMOS DE ESTIMAR A MEDIR Hasta ahora aprendimos que:

TAMAÑO → ESFUERZO → DURACIÓN → RECURSOS → COSTO

### Diapositiva 60

UNIVERSIDAD SAN SEBASTIAN

YOCACIÓN POR LA 6XC6L6ł•fClA

Fin Semana 6

N U1 ST RA /Ví l S10 N ES E D U CAR EN LA

RAZÓ N , LA VE RDA D Y LA V I RTU D.
