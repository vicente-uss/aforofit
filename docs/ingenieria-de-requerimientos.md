# Ingeniería de Requerimientos y Aseguramiento de la Calidad

Base de conocimiento del ramo **ICIF-H002** para estudiar y aplicar ingeniería de requerimientos. Reúne nueve capítulos del curso. Sirve para formular problemas, levantar necesidades, especificarlas y mantener el vínculo entre requisitos, criterios de aceptación y pruebas.

## Cómo usar este documento

Sirve como referencia para cualquier proyecto de software, sea académico o profesional. El punto de partida es la pregunta de trabajo: ¿qué necesidad está respaldada por evidencia y cómo sabremos que la solución responde a ella? Las decisiones y el estado de cada proyecto se registran en su propia documentación, y las exigencias de cada entrega las fija su pauta. Este documento aporta conceptos y métodos. Para citar el material, indica **capítulo y diapositiva**.

Cada diapositiva incluye su texto y, al final, un bloque **Contenido visual de la lámina** que transcribe sus diagramas, tablas, capturas y notas adhesivas, para que el documento se entienda sin las imágenes.

## Mapa de consulta

| Si necesitas… | Consulta |
|---|---|
| Revisar la organización, evaluación o bibliografía del ramo | 01 |
| Distinguir tipos de requisitos y entender el proceso de ingeniería | 02, diapositivas 3–10 |
| Comparar cascada, incremental, prototipado, modelo en V, espiral y Scrum | 02, diapositivas 11–20 |
| Elegir cómo levantar requisitos, modelar casos de uso o revisar su calidad | 03, diapositivas 4–12 |
| Escribir una ERS con la estructura IEEE 830-1998 enseñada en el curso | 04, diapositivas 3–11 |
| Mantener trazabilidad y gestionar cambios | 04, diapositivas 12–14 |
| Identificar el problema, sus causas y los objetivos | 05, diapositivas 3–15 |
| Modelar un proceso actual o futuro en BPMN | 06, diapositivas 5–14 |
| Preparar una sesión de Playback y recoger retroalimentación | 07, diapositivas 2–14 |
| Elegir atributos y modelos de calidad | 08, diapositivas 6–16 |
| Seleccionar herramientas de calidad o usar Lighthouse | 09, diapositivas 3–16 |

## Guía de aplicación para el equipo

El procedimiento de trabajo (qué hacer, cuándo elegir cada técnica, qué producir y cuándo avanzar), con plantillas y fuentes por sección, está en el [Framework de Ingeniería de Requerimientos y Aseguramiento de la Calidad](framework-requerimientos-calidad.md). Este documento se mantiene como la transcripción citable del material: para citar, indica **capítulo y diapositiva**.

## Material de clase por capítulo

- [01. Presentación del curso](#capitulo-01) · 12 diapositivas
- [02. Introducción a la ingeniería de requerimientos](#capitulo-02) · 23 diapositivas
- [03. Captura y análisis de requisitos](#capitulo-03) · 14 diapositivas
- [04. Documentación de requerimientos](#capitulo-04) · 17 diapositivas
- [05. Sistematización de problemas](#capitulo-05) · 17 diapositivas
- [06. Procesos de negocio con BPMN](#capitulo-06) · 16 diapositivas
- [07. IBM EDT Playbacks](#capitulo-07) · 15 diapositivas
- [08. Introducción a la calidad de software](#capitulo-08) · 20 diapositivas
- [09. Herramientas para la calidad de software](#capitulo-09) · 18 diapositivas

---

<a id="capitulo-01"></a>

## 01. Presentación del Curso

Fuente del ZIP: `01_Presentacion_del_Curso.md`.

### Diapositiva 1

Presentación del curso

ICIF H002 Ingeniería de Requerimiento

y Aseguramiento de la Calidad

Ingeniería Civil Informática

Prof. Rodrigo Caballero V.

3 DE AGOSTO, 2026

rcaballerov@docente.uss.cl

**Contenido visual de la lámina:** Portada con fotografía de la fachada de una sede de la universidad. Fecha en el margen izquierdo: **3 de agosto de 2026**. Texto: *Presentación del curso · ICIF H002 Ingeniería de Requerimiento y Aseguramiento de la Calidad · Ingeniería Civil Informática · Prof. Rodrigo Caballero V. · rcaballerov@docente.uss.cl*. Logo de la Universidad San Sebastián.

### Diapositiva 2

#### PROFESOR

ACERCA DE MÍ

Rodrigo Caballero Vivanco rcaballerov@docente.uss.cl

https://www.linkedin.com/in/rodrigo-caballero-vivanco/

Perfil Microsoft https://docs.microsoft.com/es-es/users/rodrigo-caballero-vivanco/achievements

Perfil Microsoft https://www.cloudskillsboost.google/public_profiles/f6a51a96-ea64-40c4-90f7-0560ca872d52

Perfil IBM https://www.credly.com/users/rodrigo-alejandro-caballero-vivanco/badges

**Contenido visual de la lámina:** Fotografía del profesor junto a sus datos de contacto y perfiles (LinkedIn, Microsoft, Google Cloud Skills Boost e IBM/Credly). En la parte inferior, logos de instituciones de su formación: Universidad de Chile, Universidad Andrés Bello, Georgetown University y Universidad Europea.

### Diapositiva 3

#### PROFESOR

ACERCA DE MÍ

**Contenido visual de la lámina:** Logos de organizaciones donde ha trabajado el profesor: **abastible**, **transbank** («creciendo juntos») y **Cencosud** (con las marcas de sus negocios), y banderas de Argentina, Chile, Brasil, Colombia, Perú, China y Estados Unidos (países donde ha trabajado).

### Diapositiva 4

#### ¡TU TURNO!

CUÉNTAME SOBRE TI EN MENOS DE UN MINUTO

¿Cuál es tu

¿Cómo te gusta

nombre?

que te llamen?

¿Algún pasatiempo interesante?

¿Qué libro, serie/película o

¿Cuál es tu área de

mayor interés?

¿En qué rol te imaginas a los 3 años de titulado?

juego me recomendarías?

**Contenido visual de la lámina:** Seis tarjetas de colores con preguntas para presentarse en menos de un minuto, en este orden: (1) ¿Cuál es tu nombre? (2) ¿Cómo te gusta que te llamen? (3) ¿Algún pasatiempo interesante? (4) ¿Qué libro, serie/película o juego me recomendarías? (5) ¿Cuál es tu área de mayor interés? (6) ¿En qué rol te imaginas a los 3 años de titulado? Nota adhesiva junto a la pregunta 5: *«Ejemplo: Desarrollo de Software, Bases de Datos, IA, ML, Ciberseguridad, Infraestructura, Redes, etc.»*

### Diapositiva 5

#### AVANCE CURRICULAR

ICIF H002 INGENIERÍA DE REQUERIMIENTO Y ASEGURAMIENTO DE LA CALIDAD

**Contenido visual de la lámina:** Malla curricular de Ingeniería Civil Informática en cinco años (10 semestres), con la asignatura **Ing. Requerimientos y Aseguramiento de Calidad** destacada con un recuadro rojo en el **semestre 8** y una flecha que la conecta con *Taller de Ingeniería de Software* y *Taller de Innovación*. Asignaturas por año:
- **Año 1:** Introducción al Cálculo, Álgebra, Cálculo Diferencial e Integral, Álgebra Lineal, Química General y su laboratorio, Introducción a la Programación, Introducción a la Informática, Taller de Introducción a la Ingeniería, Taller de Trabajo en Equipo, Estrategias para el Aprendizaje.
- **Año 2:** Cálculo Multivariable, Ecuaciones Diferenciales, Mecánica y su laboratorio, Electricidad y Magnetismo y su laboratorio, Probabilidades para Ingeniería, Tecnologías Digitales para la Ingeniería, Programación Orientada a Objetos, Taller de Programación Aplicada, Taller de Liderazgo y Negociación, Taller de Ingeniería y Sustentabilidad, Inglés I y II.
- **Año 3:** Optimización, Economía Financiera, Termofluidos, Arquitectura de Computadores, Matemáticas Discretas, Redes de Computadores, Estadística para Ingeniería, Programación Avanzada, Estructura de Datos y Algoritmos, Base de Datos, Taller de Emprendimiento e Innovación I y II, Inglés III, Inglés Técnico.
- **Año 4:** Sistemas Operativos, Formulación y Evaluación de Proyectos, Inteligencia Artificial, Aplicaciones y Tecnologías de la Web, Ing. Requerimientos y Aseguramiento de Calidad, Taller de Ingeniería de Software, Electivos de Profundización I y II, Antropología, Ética, Inglés de Especialidad; práctica industrial.
- **Año 5:** Gestión de Proyectos, Seguridad Informática, Gestión de Operaciones TI, Gestión Estratégica, Taller en Empresa I y II, Minería de Datos y Big Data, Electivo de Formación Integral, Electivos de Profundización III y IV, Proyecto de Título; práctica profesional.
- Franjas inferiores: Bachiller en Ciencias Básicas de la Ingeniería (años 1–2), Licenciado/a en Ciencias de la Ingeniería (años 1–4) y Título Profesional de Ingeniero/a Civil Informático (años 1–5).

### Diapositiva 6

#### ¿CÓMO CONTRIBUYE ESTE

CURSO AL PERFIL DE EGRESO?

INGENIERÍA CIVIL INFORMÁTICA

Diagnostica necesidades de usuarios, clientes y procesos con una visión integral para buscar oportunidades de mejora que

Diseña soluciones de software viables a problemas de la organización, utilizando

herramientas y metodologías de

Esta asignatura tributa

permitan dar respuesta a las problemáticas detectadas en sistemas de información, haciendo uso para ello de

modelamiento de sistemas.

sus habilidades de abstracción, síntesis,

directamente al área de

comunicación y trabajo en equipo.

desempeño Sistemas de

Información declarada en el perfil

de egreso, en los siguientes

Desarrolla soluciones de software para sistemas de información considerando su integración en la organización, normas de

Genera información a partir de la recolección y análisis de datos para agregar valor al negocio o a procesos, a través de la integración de las ciencias de

desempeños esperados:

calidad y seguridad, estándares y metodologías de desarrollo y las mejores

la ingeniería y la computación teórica y

prácticas de la industria, a partir del análisis de un equipo multidisciplinario.

práctica. Sistemas de Información

RES. N° P-26-2020

**Contenido visual de la lámina:** Orden correcto del texto: *«Esta asignatura tributa directamente al área de desempeño **Sistemas de Información** declarada en el perfil de egreso, en los siguientes desempeños esperados:»*, seguido de cuatro recuadros de colores:
1. Diagnostica necesidades de usuarios, clientes y procesos con una visión integral para buscar oportunidades de mejora que permitan dar respuesta a las problemáticas detectadas en sistemas de información, haciendo uso para ello de sus habilidades de abstracción, síntesis, comunicación y trabajo en equipo.
2. Diseña soluciones de software viables a problemas de la organización, utilizando herramientas y metodologías de modelamiento de sistemas.
3. Desarrolla soluciones de software para sistemas de información considerando su integración en la organización, normas de calidad y seguridad, estándares y metodologías de desarrollo y las mejores prácticas de la industria, a partir del análisis de un equipo multidisciplinario.
4. Genera información a partir de la recolección y análisis de datos para agregar valor al negocio o a procesos, a través de la integración de las ciencias de la ingeniería y la computación teórica y práctica.

Fuente: RES. N° P-26-2020.

### Diapositiva 7

#### DESCRIPCIÓN DEL CURSO

DE ACUERDO AL PROGRAMA DE ASIGNATURA ICIF-H002

Asignatura de carácter teórico y práctico donde el estudiante desarrolla las

habilidades para identificar y validar los requerimientos de los clientes de

sistemas de información y, por otra parte, el diseño y la gestión de planes

de pruebas, los procesos de revisión y auditoría de proyectos de software

aplicando para ello modelos de calidad y métricas.

El estudiante demuestra una actitud crítica, mostrando rigurosidad,

responsabilidad, disposición al trabajo en equipo y una conducta ética

respecto de los resultados de su trabajo. “

RES. N° P-26-2020

**Contenido visual de la lámina:** Cita textual del programa de la asignatura, con *identificar y validar*, *proyectos de software* y *calidad y métricas* destacados en color.

### Diapositiva 8

#### EVALUACIÓN DEL CURSO

CÁLCULO DE LA NOTA DE NOTA DE PRESENTACIÓN

- Solemne 1: 25%

- Solemne 2: 25%

- Taller práctico 1: 25%

- Taller práctico 2: 25%

Calificación igual o superior a 4,0 y asistencia igual o superior a 75%.

Existe una evaluación recuperativa, que se rinde posterior a la última

evaluación del curso y permite reemplazar una de las evaluaciones

indicadas como solemnes. Podrán optar a rendirla todos los estudiantes. RES. N° P-26-2020

**Contenido visual de la lámina:** Lista con marcas de verificación de las cuatro evaluaciones (25 % cada una) y notas en cursiva sobre aprobación y evaluación recuperativa.

### Diapositiva 9

#### BIBLIOGRAFÍA OBLIGATORIA

CÁLCULO DE LA NOTA DE NOTA DE PRESENTACIÓN

- Sommerville, I. (2002). Ingeniería de software, Pearson

Educación.

- Ralph, Y. (2004). The Requirements Engineering Handbook.

Artech House Technology Management and Professional

Development Library. Boston, Libro electrónico ebscohost.

RES. N° P-26-2020

**Contenido visual de la lámina:** Lista con marcas de verificación de la bibliografía obligatoria.

### Diapositiva 10

#### BIBLIOGRAFÍA OBLIGATORIA

CÁLCULO DE LA NOTA DE NOTA DE PRESENTACIÓN

https://biblioteca.uss.cl/

**Contenido visual de la lámina:** Portada del libro *Ingeniería de software*, de Ian Sommerville (6.ª edición, Addison-Wesley), y captura del visor de libros electrónicos de la biblioteca USS (https://biblioteca.uss.cl/) mostrando el libro abierto con su índice de capítulos a la izquierda.

### Diapositiva 11

#### NORMAS DE CONVIVENCIA

CÓMO RELACIONARNOS DURANTE EL SEMESTRE

Cortesía de 15 minutos

Al terminar la clase, despídase del profesor

para atrasos y registro

Al llegar a clases, salude a profesor y compañeros: “Buenas

y compañeros: “Hasta

de asistencia

tardes”

luego”

Si tiene alguna observación, no tenga

Al recibir un correo institucional, responda:

temor en levantar la

“Correo recibido,

mano y participar,

gracias por la

consultar u opinar

información”

**Contenido visual de la lámina:** Cinco recuadros azules con las normas, en este orden: (1) Cortesía de 15 minutos para atrasos y registro de asistencia. (2) Al llegar a clases, salude a profesor y compañeros: «Buenas tardes». (3) Al terminar la clase, despídase del profesor y compañeros: «Hasta luego». (4) Si tiene alguna observación, no tenga temor en levantar la mano y participar, consultar u opinar. (5) Al recibir un correo institucional, responda: «Correo recibido, gracias por la información».

### Diapositiva 12

#### INTRODUCCIÓN A LA INGENIERÍA DE REQUERIMIENTOS

¿EN QUÉ CONSISTE?

PRUEBAS

IMPLEMENTACIÓN

PRODUCTO

CONSTRUCCIÓN

(Software, Incremento,

DISEÑO

MVP, etc.) IDEA (Concepto,

necesidad, problemática)

ANÁLISIS

**Contenido visual de la lámina:** Diagrama de flecha curva ascendente que parte de una **IDEA** (concepto, necesidad, problemática; ícono de ampolleta) y pasa, en orden, por **ANÁLISIS → DISEÑO → CONSTRUCCIÓN → IMPLEMENTACIÓN → PRUEBAS**, hasta llegar al **PRODUCTO** (software, incremento, MVP, etc.; ícono de cubo).

---

<a id="capitulo-02"></a>

## 02. Introducción a la Ingeniería de Requerimientos

Fuente del ZIP: `02_Introduccion_a_la_Ingenieria_de_Requerimientos.md`.

### Diapositiva 1

INGENIERÍA DE REQUERIMIENTOS Y ASEGURAMIENTO DE LA CALIDAD Introducción a la Ingeniería de Requisitos

Prof. Rodrigo Caballero V.

rcaballerov@docente.uss.cl

**Contenido visual de la lámina:** Portada con fotografía nocturna de un patio con jardines de la universidad, logo USS, título de la sesión y datos del profesor.

### Diapositiva 2

#### Contenidos de esta sesión

Introducción a la Ingeniería de Requisitos

- Definición de ingeniería de requisitos

- Tipos de requisitos

- Características de los requisitos

- Importancia y beneficios de la ingeniería de requisitos

- Proceso de la ingeniería de requisitos

- Actividades y roles en la ingeniería de requisitos

**Contenido visual de la lámina:** Nota adhesiva amarilla: **Resultado de Aprendizaje** — *Explica la importancia de la ingeniería de requisitos, su necesidad y sus dificultades en el contexto de un proyecto de desarrollo de software.*

### Diapositiva 3

“Ingeniería de Requerimientos ayuda a los ingenieros

de software a entender mejor el problema en cuya

solución trabajarán. Incluye el conjunto de tareas que

conducen a comprender cuál será el impacto del

software sobre el negocio, qué es lo que el cliente

quiere y cómo interactuarán los usuarios finales con el

Definición

software”. (Pressman, 2010)

“La ingeniería de requerimientos es el proceso de

desarrollar una especificación de software. Las

Ingeniería de Requerimientos

especificaciones pretender comunicar las necesidades

del sistema del cliente a los desarrolladores del

sistema”. (Sommerville, 2011) “”

**Contenido visual de la lámina:** Lámina de definición con dos citas. En la primera (Pressman, 2010) se destacan *entender mejor el problema en cuya solución trabajarán*, *qué es lo que el cliente quiere* e *interactuarán los usuarios finales*; en la segunda (Sommerville, 2011), *pretender comunicar las necesidades del sistema del cliente*.

### Diapositiva 4

“Una condición o necesidad de un usuario para

resolver un problema o alcanzar un objetivo”. (Std

IEEE 610.12-1900)

“Una condición o capacidad que debe estar presente

en un sistema o componentes de sistema para

satisfacer un contrato, estándar, especificación u otro

documento formal”. (Std IEEE 610.12-1900)

Definición

“Un requerimiento es simplemente una declaración

Requerimiento

abstracta de alto nivel de un servicio que debe

proporcionar el sistema o una restricción de éste”.

(Sommerville, 2011)

**Contenido visual de la lámina:** Lámina de definición de **Requerimiento** con tres citas: «Una condición o necesidad de un usuario para resolver un problema o alcanzar un objetivo» (Std IEEE 610.12-1990); «Una condición o capacidad que debe estar presente en un sistema o componentes de sistema para satisfacer un contrato, estándar, especificación u otro documento formal» (Std IEEE 610.12-1990); «Un requerimiento es simplemente una declaración abstracta de alto nivel de un servicio que debe proporcionar el sistema o una restricción de éste» (Sommerville, 2011). En la lámina, el año del estándar aparece como «1900».

### Diapositiva 5

#### Características de un requerimiento

De acuerdo con Arias Chaves (2005), todo requerimiento debe ser:

Como todo contrato o acuerdo entre dos partes.

Especificado por escrito

Si un requerimiento no se puede comprobar, entonces ¿cómo se sabe si se cumplió con él o no?

Posible de probar o verificar

Conciso Un requerimiento es conciso si es fácil de leer y entender. Su redacción debe ser simple y clara para aquellos que vayan a consultarlo en un futuro.

Completo Un requerimiento está completo si no necesita ampliar detalles en su redacción, es decir, si se proporciona la información suficiente para su comprensión.

Consistente Un requerimiento es consistente si no es contradictorio con otro requerimiento.

No ambiguo Un requerimiento no es ambiguo cuando tiene una sola interpretación. El lenguaje usado en su definición, no debe causar confusiones al lector.

**Contenido visual de la lámina:** Tabla de dos columnas *(característica | explicación)* según Arias Chaves (2005):

| Característica | Explicación |
|---|---|
| Especificado por escrito | Como todo contrato o acuerdo entre dos partes. |
| Posible de probar o verificar | Si un requerimiento no se puede comprobar, entonces ¿cómo se sabe si se cumplió con él o no? |
| Conciso | Es conciso si es fácil de leer y entender; su redacción debe ser simple y clara para quienes lo consulten en el futuro. |
| Completo | Está completo si no necesita ampliar detalles en su redacción, es decir, si proporciona la información suficiente para su comprensión. |
| Consistente | Es consistente si no es contradictorio con otro requerimiento. |
| No ambiguo | No es ambiguo cuando tiene una sola interpretación; el lenguaje usado no debe causar confusiones al lector. |

### Diapositiva 6

#### Tipos de requerimientos de software

Requerimientos funcionales

- Especifican las funciones que el sistema debe

realizar • Describen las transformaciones que el sistema

Requerimientos no funcionales

efectúa sobre las entradas para generar salidas • Enfocarse en el "qué" se debe hacer en lugar del

- Están relacionados con las características que pueden

"cómo" se debe hacer • A medida que avanza el proyecto de software,

limitar el sistema • Tales como el rendimiento (en términos de tiempo y

estos requerimientos se transforman en algoritmos, lógica y una gran parte del código del sistema.

espacio), las interfaces de usuario, la fiabilidad (como la robustez del sistema y la disponibilidad del equipo), el mantenimiento, la seguridad, la portabilidad, los estándares, entre otros.

Arias Chaves, M., (2005). La ingeniería de requerimientos y su importancia en el desarrollo de proyectos de software

**Contenido visual de la lámina:** Dos flechas grandes en sentidos opuestos. **Requerimientos funcionales:** especifican las funciones que el sistema debe realizar; describen las transformaciones que el sistema efectúa sobre las entradas para generar salidas; se enfocan en el «qué» se debe hacer en lugar del «cómo»; a medida que avanza el proyecto se transforman en algoritmos, lógica y gran parte del código. **Requerimientos no funcionales:** están relacionados con las características que pueden limitar el sistema, tales como el rendimiento (tiempo y espacio), las interfaces de usuario, la fiabilidad (robustez y disponibilidad del equipo), el mantenimiento, la seguridad, la portabilidad y los estándares, entre otros. Fuente: Arias Chaves (2005).

### Diapositiva 7

#### Tipos de requerimientos no funcionales

Requerimientos

funcionales Requerimientos no

funcionales

Sommerville, I. (2011). Software Engineering 9th Ed. Pp. 88.

**Contenido visual de la lámina:** Árbol jerárquico de los requerimientos no funcionales (Sommerville, 2011, p. 88):

```text
Requerimientos no funcionales
├─ Requerimientos del producto
│   ├─ De usabilidad
│   ├─ De eficiencia
│   │   ├─ De rendimiento
│   │   └─ De espacio
│   ├─ De confiabilidad
│   └─ De seguridad
├─ Requerimientos de la organización
│   ├─ Ambientales
│   ├─ Operacionales
│   └─ De desarrollo
└─ Requerimientos externos
    ├─ Regulatorios
    ├─ Éticos
    └─ Legales
        ├─ Contables
        └─ De protección/seguridad
```

### Diapositiva 8

#### Importancia de la ingeniería de requerimientos

De acuerdo con Herrera (2003) en su publicación de ingeniería de requerimientos (IR):

Cada actividad de la IR consiste de una serie de pasos organizados y bien definidos.

Permite gestionar las necesidades del proyecto en forma estructurada

La IR proporciona un punto de partida para controles subsecuentes y actividades de mantenimiento, tales como estimación de costos, tiempo y recursos necesarios.

Mejora la capacidad de predecir cronogramas de proyectos, así como sus resultados

Disminuye los costos y retrasos del proyecto Reparar errores por un mal desarrollo no descubierto a tiempo, es sumamente caro; especialmente aquellas decisiones tomadas durante la IR, ya que es una de las etapas de mayor importancia en el ciclo de desarrollo de software y de las primeras en llevarse a cabo.

Mejora la calidad del software La calidad en el software tiene que ver con cumplir un conjunto de requerimientos (funcionalidad, facilidad de uso, confiabilidad, desempeño, etc.).

Mejora la comunicación entre equipos La especificación de requerimientos representa una forma de consenso entre clientes y desarrolladores. Si este consenso no ocurre, el proyecto no será exitoso.

Evita rechazos de usuarios finales La ingeniería de requerimientos obliga al cliente a considerar sus requerimientos cuidadosamente y revisarlos dentro del marco del problema, por lo que se le involucra durante todo el desarrollo del proyecto.

**Contenido visual de la lámina:** Tabla de dos columnas *(beneficio | explicación)* según Herrera (2003):

| Beneficio | Explicación |
|---|---|
| Permite gestionar las necesidades del proyecto en forma estructurada | Cada actividad de la IR consiste en una serie de pasos organizados y bien definidos. |
| Mejora la capacidad de predecir cronogramas de proyectos, así como sus resultados | La IR proporciona un punto de partida para controles subsecuentes y actividades de mantenimiento, como estimación de costos, tiempo y recursos. |
| Disminuye los costos y retrasos del proyecto | Reparar errores por un mal desarrollo no descubierto a tiempo es sumamente caro, especialmente las decisiones tomadas durante la IR, una de las etapas más importantes y de las primeras en llevarse a cabo. |
| Mejora la calidad del software | La calidad tiene que ver con cumplir un conjunto de requerimientos (funcionalidad, facilidad de uso, confiabilidad, desempeño, etc.). |
| Mejora la comunicación entre equipos | La especificación de requerimientos es una forma de consenso entre clientes y desarrolladores; si no ocurre, el proyecto no será exitoso. |
| Evita rechazos de usuarios finales | La IR obliga al cliente a considerar sus requerimientos cuidadosamente y revisarlos dentro del marco del problema, por lo que se le involucra durante todo el desarrollo. |

### Diapositiva 9

#### Proceso de la ingeniería de requerimientos

Principales actividades en un enfoque

tradición de ingeniería de Software.

Validación

- Se ratifican los

Especificación

requerimientos especificados •Se corrobora

- Se documentan y

consistencia y completitud

formalizan los requerimientos •Se genera

Análisis

documento de ERS para validación

- Contrastar

problemas con requerimientos •Bosquejo inicial del

documento de ERS

Extracción

- Actividades de

descubrimiento •Definición de la

problemática

Herrera J., L. J. (2003) “Ingeniería de Requerimientos, Ingeniería de Software”

**Contenido visual de la lámina:** Flecha curva ascendente con las cuatro actividades principales del enfoque tradicional (Herrera, 2003), en orden: **Extracción** (actividades de descubrimiento; definición de la problemática) → **Análisis** (contrastar problemas con requerimientos; bosquejo inicial del documento de ERS) → **Especificación** (se documentan y formalizan los requerimientos; se genera el documento de ERS para validación) → **Validación** (se ratifican los requerimientos especificados; se corrobora consistencia y completitud).

### Diapositiva 10

#### Proceso de la ingeniería de requerimientos

¿Cómo varía la ingeniería de requerimientos según los diferentes

modelos y metodologías de

desarrollo de software?

**Contenido visual de la lámina:** Lámina de pregunta, sin imágenes con contenido adicional.

### Diapositiva 11

#### Modelos y frameworks de desarrollo de software

PARADIGMA PROTOTIPADO

MODELO INCREMENTAL

MODELO CASCADA (WATERFALL)

MODELO EN V (V-MODEL)

ESPIRAL DE BOEHM

MARCO DE TRABAJO SCRUM

Pressman (2010). Software Engineering 7th Ed. Pp. 39-83.

**Contenido visual de la lámina:** Collage de seis diagramas (Pressman, 2010, pp. 39–83): Modelo cascada, Modelo incremental, Paradigma prototipado, Modelo en V, Espiral de Boehm y Marco de trabajo Scrum (cada uno se detalla en las láminas 12 a 18). Nota adhesiva: *«¡La ingeniería de requerimientos se adapta al modelo de desarrollo de software que defina el proyecto!»*

### Diapositiva 12

#### Modelo Cascada (Waterfall)

El modelo en cascada, a veces llamado ciclo de vida clásico, sugiere un enfoque sistemático y secuencial para el desarrollo de software que comienza con la especificación de los requisitos del

cliente y avanza a través de la planificación, el modelado, la construcción y la implementación,

culminando en el soporte continuo del software completo. La ingeniería de requerimientos se

realiza al inicio del proyecto y una sola vez; en la fase de análisis o comunicación.

Pressman (2010). Software Engineering 7th Ed. Pp. 39-40.

**Contenido visual de la lámina:** Diagrama de cajas en secuencia (Pressman, 2010, pp. 39–40): **Communication** (project initiation, requirements gathering) → **Planning** (estimating, scheduling, tracking) → **Modeling** (analysis, design) → **Construction** (code, test) → **Deployment** (delivery, support, feedback).

### Diapositiva 13

#### Modelo Incremental

Hay muchas situaciones en las que los

requisitos iniciales del software están razonablemente bien definidos, pero el

alcance general del esfuerzo de

desarrollo impide un proceso puramente lineal. Puede haber una necesidad apremiante de proporcionar un conjunto limitado de funcionalidades de software a los usuarios rápidamente y

luego perfeccionar y ampliar esa funcionalidad en versiones de software posteriores. En tales casos, puede elegir

un modelo de proceso diseñado para producir el software en incrementos. La

ingeniería de requerimientos se debe

realizar al inicio de cada incremento.

Pressman (2010). Software Engineering 7th Ed. Pp. 41-42.

**Contenido visual de la lámina:** Gráfico (Pressman, 2010, pp. 41–42): eje vertical *Software functionality and features*, eje horizontal *Project calendar time*. Muestra el *increment #1*, *#2* … *#n*, cada uno con la misma secuencia de cinco actividades (Communication, Planning, Modeling [analysis, design], Construction [code, test], Deployment [delivery, feedback]) y su respectiva entrega (*delivery of 1st increment*, *2nd increment*, *nth increment*), escalonados en el tiempo.

### Diapositiva 14

#### Paradigma Prototipado

El prototipado por definición es una técnica

que permite realizar y materializar diversas

ideas de soluciones propuestas en un proyecto de diseño o rediseño de productos y

servicios. El prototipado puede estar vinculado al recorrido completo de un servicio

o bien a un punto de contacto específico.

En la ingeniería de software, permite validar

de forma temprana los requerimientos con

diversas entregas prototipadas, ya sea no funcionales o semi-funcionales. Esto es, desde

dibujos, bocetos, hasta maquetas con navegación de fornt-end (Ej: Figma). En estos

casos la ingeniería de requerimientos debe ir

evolucionando con cada prototipo.

Pressman (2010). Software Engineering 7th Ed. Pp. 43-44.

**Contenido visual de la lámina:** Ciclo circular con flechas (Pressman, 2010, pp. 43–44): **Communication → Quick plan → Modeling / Quick design → Construction of prototype → Deployment, Delivery & Feedback →** de vuelta a Communication.

### Diapositiva 15

#### Modelo en “V”

Una variación en la representación del modelo en cascada se denomina modelo V. Describe la relación de

las acciones de aseguramiento de la calidad con las acciones asociadas con la comunicación, el modelado y

las actividades iniciales de construcción. A medida que un equipo de software avanza por el lado izquierdo de la

V, los requisitos básicos del problema se refinan en representaciones progresivamente más detalladas y técnicas del problema y su solución. Una vez que se ha generado el código, el equipo sube por el lado derecho de la V, esencialmente realizando una serie de pruebas

(acciones de control de calidad) que validan cada uno de los modelos creados a medida que el equipo baja por

el lado izquierdo. En realidad, no existe una diferencia fundamental entre el ciclo de vida clásico y el modelo V. El modelo V proporciona una forma de visualizar cómo se

verifica y valida la especificación de requerimientos.

Pressman (2010). Software Engineering 7th Ed. Pp. 39-40.

**Contenido visual de la lámina:** Diagrama en V (Pressman, 2010, pp. 39–40). Lado izquierdo, descendiendo: Requirements modeling → Architectural design → Component design → Code generation. Vértice: Executable software. Lado derecho, ascendiendo: Unit testing → Integration testing → System testing → Acceptance testing. Flechas horizontales unen cada nivel con su prueba: código con unitarias, componentes con integración, arquitectura con sistema y requisitos con aceptación.

### Diapositiva 16

#### Modelo espiral

Un modelo en espiral se divide en un conjunto

de actividades marco definidas por el equipo

de ingeniería de software. Cada una de las actividades marco representa un segmento del

camino en espiral. A medida que comienza este proceso evolutivo, el equipo de software realiza actividades que están implicadas en un circuito alrededor de la espiral en el sentido de

las agujas del reloj, comenzando en el centro. El riesgo se considera a medida que se realiza

cada revolución. Para cada paso evolutivo se

anotan los hitos del punto de anclaje, una

combinación de productos de trabajo y condiciones que se logran a lo largo del camino

de la espiral. Los requerimientos pueden ir evolucionando en cada iteración del espiral.

Pressman (2010). Software Engineering 7th Ed. Pp. 43-44.

**Contenido visual de la lámina:** Espiral (Pressman, 2010, pp. 43–44) que parte desde el centro (*Start*) y recorre en cada vuelta: **Communication → Planning** (estimation, scheduling, risk analysis) **→ Modeling** (analysis, design) **→ Construction** (code, test) **→ Deployment** (delivery, feedback).

### Diapositiva 17

#### Marco de trabajo Scrum

Los principios de Scrum son consistentes

con el manifiesto ágil (2001) y se utilizan

para guiar las actividades de desarrollo dentro de un proceso que incorpora las siguientes actividades marco: requisitos,

análisis, diseño, evolución y entrega. Dentro de cada actividad marco, las tareas de trabajo ocurren dentro de un patrón de

proceso (que se analiza en el siguiente párrafo) llamado sprint. El trabajo realizado

dentro de un sprint (el número de sprints necesarios para cada actividad del marco

variará según la complejidad y el tamaño

del producto) se adapta al problema en cuestión y el equipo Scrum lo define y, a

menudo, lo modifica en tiempo real. En este caso, los requerimientos se levantan

como historias de usuario en el backlog.

Pressman (2010). Software Engineering 7th Ed. Pp. 82-83.

**Contenido visual de la lámina:** Diagrama de Scrum (Pressman, 2010, pp. 82–83): *Product Backlog* (prioritized product features desired by the customer) → *Backlog items expanded by team* → *Sprint Backlog* (feature(s) assigned to sprint) → sprint de **30 days** con un ciclo diario de **every 24 hours** → *New functionality is demonstrated at end of sprint*. Recuadro de la reunión diaria: *Scrum: 15 minute daily meeting. Team members respond to basics: 1) What did you do since last Scrum meeting? 2) Do you have any obstacles? 3) What will you do before next meeting?*

### Diapositiva 18

#### ¿Cómo funciona Scrum?

**Contenido visual de la lámina:** Esquema del marco Scrum (Scrum Framework © 2020 Scrum.org): **Product Backlog → Sprint Planning → Sprint Backlog →** trabajo del **Scrum Team** con el **Daily Scrum → Increment → Sprint Review**, con retorno al Product Backlog y la **Sprint Retrospective** cerrando el ciclo. Nota adhesiva: *Roles: Scrum Master, Product Owner, Developer Team.*

### Diapositiva 19

#### Otros enfoques no tradicionales

Design Thinking: Un enfoque para descubrimiento, creatividad e innovación.

Etapas de Design Thinking

**Contenido visual de la lámina:** Cinco hexágonos de colores en secuencia (pymeup.org): **Empatizar** (entender cómo piensan, sus necesidades y lo que es realmente importante para los usuarios) → **Definir** (sintetizar la información construyendo un punto de partida desde un dolor significativo para el usuario) → **Idear** (generar muchas ideas, siendo disruptivo e innovador y construyendo en equipo una propuesta) → **Prototipar** (desarrollar prototipos rápidos y sencillos que permitan recibir retroalimentación sobre la propuesta) → **Testear** (simulando un contexto real, comprender mejor al usuario y con su retroalimentación mejorar la propuesta).

### Diapositiva 20

#### Otros enfoques no tradicionales

Design Thinking: Un framework para innovar de forma continua

“Un framework para innovar”. Mari, S. (s.f.). INTIVE.

**Contenido visual de la lámina:** Símbolo de infinito (Mari, s.f., INTIVE) con dos bucles: **Contexto** a la izquierda y **Forma** a la derecha. Etapas: **Empatizar** — ¿Cuál es el problema? Defina el desafío y explore el contexto humano. **Definir** — ¿Por qué es importante? Investigue, observe, comprenda y cree un punto de vista. **Idear** — ¿Cómo lo resolvemos? Haga un brainstorming de ideas, no se detenga en lo obvio. **Prototipar** — ¿Cómo lo creamos? Comience creando, experimente, falle de forma económica y veloz. **Testear** — ¿Funciona? Implemente el producto, muestre sin decir, empiece a refinar el producto.

### Diapositiva 21

#### Usuarios de un documento de requerimientos

Roles interesados:

Clientes del sistema

Administradores

Ingenieros del sistema

- Especifican los

- Usan el documento de

- Usan los requerimientos para

entender qué sistema debe desarrollarse.

requerimientos para planear una cotización para el sistema y el proceso de desarrollo del sistema.

requerimientos y los leen para comprobar que cubren sus necesidades. • Los clientes especifican los

cambios a los requerimientos.

Ingenieros de prueba del sistema

Ingenieros de mantenimiento del sistema

- Usan los requerimientos para

- Usan los requerimientos para

desarrollar pruebas de validación para el sistema.

comprender el sistema y las relaciones entre sus componentes.

Sommerville, I. (2011). Software Engineering 9th Ed. Pp. 92.

**Contenido visual de la lámina:** Cinco recuadros de colores (Sommerville, 2011, p. 92): **Clientes del sistema** — especifican los requerimientos y los leen para comprobar que cubren sus necesidades; especifican los cambios a los requerimientos. **Administradores** — usan el documento de requerimientos para planear una cotización para el sistema y el proceso de desarrollo. **Ingenieros del sistema** — usan los requerimientos para entender qué sistema debe desarrollarse. **Ingenieros de prueba del sistema** — usan los requerimientos para desarrollar pruebas de validación. **Ingenieros de mantenimiento del sistema** — usan los requerimientos para comprender el sistema y las relaciones entre sus componentes.

### Diapositiva 22

#### Referencias Bibliográficas

Para mayor información o profundizar los contenidos, puedes consultar:

- Arias Chaves, M., (2005). La ingeniería de requerimientos y su importancia en el desarrollo de proyectos de software. InterSedes: Revista de las Sedes Regionales, VI(10), 1-13.

- Herrera J., Lizka Johany (2003). Ingeniería de Requerimientos, Ingeniería de Software.

- IEEE 610.12-1900. Standard Glossary of Software Engineering Terminology.

- Mari, S. (s.f.). Las 5 etapas del Design Thinking y sus técnicas. INTIVE.

- Pressman, R. (2010). Software Engineering 7th Ed.

- Sommerville, I. (2011). Software Engineering 9th Ed.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 23

¡Tus consultas son importantes! Espacio para preguntas

**Contenido visual de la lámina:** Lámina de cierre con fotografía de fondo: *¡Tus consultas son importantes! Espacio para preguntas.*

---

<a id="capitulo-03"></a>

## 03. Captura y Análisis de Requisitos

Fuente del ZIP: `03_Captura_y_Analisis_de_Requisitos.md`.

### Diapositiva 1

INGENIERÍA DE REQUERIMIENTOS Y ASEGURAMIENTO DE LA CALIDAD Captura y Análisis de Requisitos

Prof. Rodrigo Caballero V.

rcaballerov@docente.uss.cl

**Contenido visual de la lámina:** Portada con fotografía de fondo, logo USS, título de la sesión y datos del profesor.

### Diapositiva 2

#### Contenidos de esta sesión

Captura y Análisis de Requisitos

- Técnicas de captura de requisitos (entrevistas, cuestionarios, observación, etc.)

- Análisis de requisitos funcionales y no funcionales

- Modelado de requisitos (casos de uso, diagramas de flujo, etc.)

- Verificación y validación de requisitos

**Contenido visual de la lámina:** Nota adhesiva amarilla: **Resultado de Aprendizaje** — *Explica la importancia de la ingeniería de requisitos, su necesidad y sus dificultades en el contexto de un proyecto de desarrollo de software.*

### Diapositiva 3

En español, dependiendo del país o

contexto, se utilizan indistintamente

los siguientes conceptos para

referirse al proceso de ingeniería de

requerimientos:

- Elicitación

- Levantamiento

Glosario: Ingeniería de Requerimientos

- Relevamiento

- Especificación “”

**Contenido visual de la lámina:** Lámina de glosario con lista de cuatro términos marcados con ✓.

### Diapositiva 4

#### Técnicas tradicionales de elicitación

¿Cuáles son las técnicas y herramientas más utilizadas en un proyecto tradicional de ingeniería de software?

Análisis de

Entrevistas y Cuestionarios

Lluvia de Ideas (Brainstorming) Prototipos Casos de Uso

Sistemas Existentes

Arias Chaves, M., (2005). La ingeniería de requerimientos y su importancia en el desarrollo de proyectos de software

**Contenido visual de la lámina:** Cinco círculos superpuestos de colores (Arias Chaves, 2005) que representan las técnicas tradicionales: **Entrevistas y Cuestionarios**, **Análisis de Sistemas Existentes**, **Lluvia de Ideas (Brainstorming)**, **Prototipos** y **Casos de Uso**. Las láminas 5 a 9 destacan uno a la vez.

### Diapositiva 5

#### Técnicas tradicionales de elicitación

Análisis de

Entrevistas y Cuestionarios

Lluvia de Ideas (Brainstorming) Prototipos Casos de Uso

Sistemas Existentes

Algunas herramientas de utilidad:

Constancia

Actas & minutas

vía E-Mail

de reunión

Son efectivos para recolectar información de individuos o grupos.

En una entrevista, el analista de requerimientos interactúa directamente con el entrevistado.

Entrevistas y Cuestionarios

Los cuestionarios consisten en un conjunto de preguntas relacionadas con varios aspectos del sistema.

Los encuestados suelen ser usuarios actuales o potenciales del sistema, así como gerentes o empleados que proporcionarán datos o serán impactados por el sistema propuesto.

El éxito de esta técnica depende en gran medida de la habilidad y preparación del entrevistador.

Arias Chaves, M., (2005). La ingeniería de requerimientos y su importancia en el desarrollo de proyectos de software

**Contenido visual de la lámina:** Círculo destacado: *Entrevistas y Cuestionarios*. Herramientas de utilidad (logos): Microsoft Teams, Google Meet, Zoom, Microsoft Forms, Google Forms, constancia vía e-mail y actas y minutas de reunión (Word).

### Diapositiva 6

#### Técnicas tradicionales de elicitación

Análisis de

Entrevistas y Cuestionarios

Lluvia de Ideas (Brainstorming) Prototipos Casos de Uso

Sistemas Existentes

Algunas herramientas de utilidad:

Documentación

Matrices de

Testing Test Case Input Test Case Output

del diseño actual Black Box

trazabilidad

Implica examinar sistemas ya desarrollados que estén relacionados con el sistema que se está construyendo.

El análisis de las interfaces de usuario y las salidas generadas por estos sistemas puede proporcionar valiosas ideas y mejoras.

Análisis de Sistemas Existentes

Observando cómo se maneja la información y los tipos de salidas producidas (listados, consultas, etc.), se pueden generar nuevas ideas y enfoques para el sistema en desarrollo.

Arias Chaves, M., (2005). La ingeniería de requerimientos y su importancia en el desarrollo de proyectos de software

**Contenido visual de la lámina:** Círculo destacado: *Análisis de Sistemas Existentes*. Herramientas de utilidad: esquema de **pruebas de caja negra** (*Test Case Input → Black Box Testing → Test Case Output*), Git, UML, matrices de trazabilidad (Excel) y documentación del diseño actual (Word).

### Diapositiva 7

#### Técnicas tradicionales de elicitación

Análisis de

Entrevistas y Cuestionarios

Lluvia de Ideas (Brainstorming) Prototipos Casos de Uso

Sistemas Existentes

Algunas herramientas de utilidad:

Técnica para generar la mayor cantidad posible de ideas sin juzgarlas inicialmente.

Lluvia de Ideas (Brainstorming)

Los participantes, que deben ser de diversas disciplinas y con experiencia, generan ideas libremente.

Este ambiente libre fomenta la creatividad y permite que ideas inusuales pero potencialmente útiles emerjan.

Posteriormente, las ideas se filtran y se seleccionan las más viables basándose en criterios como costo y practicabilidad.

Arias Chaves, M., (2005). La ingeniería de requerimientos y su importancia en el desarrollo de proyectos de software

**Contenido visual de la lámina:** Círculo destacado: *Lluvia de Ideas*. Herramientas de utilidad: XMind, Miro, draw.io, Lucidchart y MindManager, con una captura de ejemplo de un mapa mental (*Business Plan*) con ramas temáticas.

### Diapositiva 8

#### Técnicas tradicionales de elicitación

Análisis de

Entrevistas y Cuestionarios

Lluvia de Ideas (Brainstorming) Prototipos Casos de Uso

Sistemas Existentes

Algunas herramientas de utilidad:

Adobe XD

Es fundamental cuando los requerimientos no están claros o no se comprenden completamente.

Prototipos

Los prototipos son simulaciones del producto final que permiten a los usuarios interactuar con una versión preliminar del sistema.

Proporciona retroalimentación crucial sobre la funcionalidad y efectividad del sistema, permitiendo ajustar y validar los requerimientos antes del desarrollo completo.

El desarrollo del prototipo comienza con la captura de requerimientos, seguido de un diseño rápido enfocado en las interfaces visibles al usuario, culminando en la construcción del prototipo.

Arias Chaves, M., (2005). La ingeniería de requerimientos y su importancia en el desarrollo de proyectos de software

**Contenido visual de la lámina:** Círculo destacado: *Prototipos*. Herramientas de utilidad: Figma, Balsamiq, Adobe XD, Sketch, Marvel e InVision Studio, con una captura de un prototipo navegable de una app móvil (pantallas conectadas por flechas de navegación).

### Diapositiva 9

#### Técnicas tradicionales de elicitación

Análisis de

Entrevistas y Cuestionarios

Lluvia de Ideas (Brainstorming) Prototipos Casos de Uso

Sistemas Existentes

Algunas herramientas de utilidad:

Sommerville, I. (2011). Software Engineering 9th Ed. Pp 107.

Técnica para especificar el comportamiento del sistema mediante la descripción de secuencias de interacciones entre el sistema y uno o más actores en respuesta a un estímulo inicial.

Esta técnica permite detallar la funcionalidad y comportamiento del sistema de manera clara y estructurada.

Los casos de uso son esenciales en la notación UML (Lenguaje de Modelado Unificado).

Casos de Uso

Proporcionan una herramienta robusta para la obtención y documentación de requerimientos funcionales.

Arias Chaves, M., (2005). La ingeniería de requerimientos y su importancia en el desarrollo de proyectos de software

**Contenido visual de la lámina:** Círculo destacado: *Casos de Uso*. Herramientas de utilidad: UML, draw.io, Lucidchart y StarUML. Diagrama de ejemplo (Sommerville, 2011, p. 107) de un sistema de atención médica: el **Auxiliar médico** se asocia con *Registro de paciente* y *Ve inf. personal*; la **Enfermera**, con *Ve el registro* y *Edita el registro*; el **Médico**, con *Ve el registro*, *Edita el registro* y *Establece la consulta*; el **Administrador**, con *Ve inf. personal*, *Exporta estadísticas* y *Genera reporte*.

### Diapositiva 10

El estándar UML proporciona una notación para el

modelado gráfico, ampliamente utilizado en el desarrollo de

software para visualizar, especificar, construir y documentar

UML: Lenguaje de

los componentes de un sistema. Puedes contar con una

serie de diagramas estandarizados que representan diversos

Modelado

aspectos de un sistema (estructura, interacción, etc.).

Unificado

Al ofrecer una manera clara y consistente de visualizar los

diseños del sistema, UML facilita la comunicación entre los

miembros del equipo de desarrollo y con otros stakeholders,

mejora la comprensión del sistema y apoya la creación de

soluciones robustas y mantenibles.

**Contenido visual de la lámina:** Lámina de definición de UML con el logo *Unified Modeling Language*.

### Diapositiva 11

#### Elementos de un Diagrama de Casos de Uso

Actor

- Representa un perfil

específico que se autentifica dentro del sistema. • Usualmente cuando va a la

izquierda del caso de uso, corresponde a un actor principal, para quién está pensado el sistema. • A la derecha del caso de

uso, aparece un actor secundario, quien eventualmente puede ejecutar la funcionalidad.

Caso de uso

- Representa la funcionalidad

o acción ejercida por el actor dentro del sistema. • Su redacción debe

comenzar con un verbo.

Sommerville, I. (2011). Software Engineering 9th Ed. Pp. 107.

**Contenido visual de la lámina:** El mismo diagrama de casos de uso de la lámina 9 con dos elementos rodeados en rojo y una flecha a su explicación: el actor **Auxiliar médico** → recuadro *Actor*; el caso de uso **Establece la consulta** → recuadro *Caso de uso*.

### Diapositiva 12

#### Verificación y validación de requisitos

Verificabilidad

Comprobaciones de validez

Comprobaciones de consistencia

Comprobaciones de totalidad

Comprobaciones de realismo

- Un usuario

- Los

- El documento de

- Utilizando el

- Para reducir el

requerimientos debe incluir todos los requerimientos que definan las funciones y restricciones pretendidas por el usuario del sistema.

conocimiento de la tecnología existente, los requerimientos deben ser comprobados para asegurar que puedan implementarse. •Estas

potencial de disputas entre cliente y contratista, los requerimientos del sistema deben ser redactados de manera que sean verificables. •Debe ser posible

requerimientos en el documento no deben estar en conflicto, es decir, no debe haber restricciones contradictorias ni descripciones diferentes de la misma función del sistema.

puede pensar que necesita un sistema para realizar ciertas funciones, pero con un análisis más profundo se pueden identificar funciones adicionales o diferentes. •Los sistemas

comprobaciones también deben considerar el presupuesto y el calendario para el desarrollo del sistema.

escribir un conjunto de pruebas que demuestren que el sistema entregado cumple con cada requerimiento especificado.

tienen múltiples interesados con diversas necesidades, se debe corroborar que los requerimientos las cubran.

Sommerville, I. (2011). Software Engineering 9th Ed.

**Contenido visual de la lámina:** Cinco recuadros unidos por flechas, en este orden (Sommerville, 2011): **Comprobaciones de validez → Comprobaciones de consistencia → Comprobaciones de totalidad → Comprobaciones de realismo → Verificabilidad**, cada uno con su explicación.

### Diapositiva 13

#### Referencias Bibliográficas

Para mayor información o profundizar los contenidos, puedes consultar:

- Arias Chaves, M., (2005). La ingeniería de requerimientos y su importancia en el desarrollo de proyectos de software. InterSedes: Revista de las Sedes Regionales, VI(10), 1-13.

- Herrera J., L. J., (2003). Ingeniería de Requerimientos, Ingeniería de Software.

- IEEE 610.12-1900. Standard Glossary of Software Engineering Terminology.

- Pressman, R. (2010). Software Engineering 7th Ed.

- Sommerville, I. (2011). Software Engineering 9th Ed.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 14

¡Tus consultas son importantes! Espacio para preguntas

**Contenido visual de la lámina:** Lámina de cierre: *¡Tus consultas son importantes! Espacio para preguntas.*

---

<a id="capitulo-04"></a>

## 04. Documentación de Requerimientos

Fuente del ZIP: `04_Documentacion_de_Requerimientos.md`.

### Diapositiva 1

INGENIERÍA DE REQUERIMIENTOS Y ASEGURAMIENTO DE LA CALIDAD Documentación y gestión de requisitos

Prof. Rodrigo Caballero V.

rcaballerov@docente.uss.cl

**Contenido visual de la lámina:** Portada con fotografía de fondo, logo USS, título de la sesión y datos del profesor.

### Diapositiva 2

#### Contenidos de esta sesión

Documentación y gestión de requisitos:

- Principales riesgos en la obtención de requisitos

- Especificación de requisitos

- Documentación de requisitos: (especificaciones, prototipos, casos de prueba, etc.)

- Herramientas para la gestión de requisitos

- Control de cambios en los requisitos

- Relación entre la ingeniería de requisitos y el desarrollo de software

**Contenido visual de la lámina:** Nota adhesiva amarilla: **Resultado de Aprendizaje de la Unidad 3** — *Explica la importancia de la ingeniería de requisitos, su necesidad y sus dificultades en el contexto de un proyecto de desarrollo de software.*

### Diapositiva 3

Estándar IEEE

830-1998: Recommended

Practice for

Software Requirements

Specifications

**Contenido visual de la lámina:** Portada del documento *IEEE Std 830-1998 — IEEE Recommended Practice for Software Requirements Specifications* (IEEE Computer Society, 20 de octubre de 1998). Nota adhesiva: *«El estándar define los puntos esenciales que toda "Especificación de Requerimientos de Software" (ERS) debe tener.»*

### Diapositiva 4

#### Especificación de Requerimientos de Software

Estructura del estándar IEEE 830-1998 :

De acuerdo con IEEE, un Documento de Requisitos de calidad no necesariamente debe seguir estrictamente la estructura y el formato establecidos en el estándar 830, pero sí debe contener toda la información que dicho estándar propone. Este estándar establece un marco para documentar de manera clara y precisa los requisitos funcionales y no funcionales de un sistema, facilitando la comunicación entre desarrolladores, clientes y otros interesados. Al seguir el IEEE 830, se busca asegurar que todos los aspectos críticos del sistema estén bien definidos y comprendidos, lo que ayuda a prevenir errores y malentendidos durante el desarrollo del software.

**Contenido visual de la lámina:** Texto junto a la portada del estándar IEEE 830-1998, con *debe contener toda la información que dicho estándar propone*, *facilitando la comunicación* y *bien definidos y comprendidos* destacados en color.

### Diapositiva 5

#### Especificación de Requerimientos de Software

Estructura esencial para la documentación de toda Especificación de Requerimientos de Software:

1. Introducción: Se ofrece una presentación del documento de Especificación de Requisitos de Software (ERS) y contexto general.

1.1. Propósito: Esta sección define el objetivo principal del documento de especificación de requisitos del software (ERS) y especifica a quién está destinado. El propósito es establecer claramente el por qué del documento y para quién se ha creado, asegurando que los lectores comprendan la intención y el uso del ERS.

1.2. Ámbito del Sistema: Aquí se describe el sistema que se va a desarrollar, incluyendo el nombre del sistema si es apropiado. Se especifica qué funciones realizará el sistema y qué no, se enumeran los beneficios y objetivos esperados y se referencia cualquier documento de nivel superior que pueda influir en el ERS, como los documentos de especificación de requisitos globales del sistema.

**Contenido visual de la lámina:** Texto junto a la portada del estándar IEEE 830-1998 (imagen ilustrativa, sin contenido adicional).

### Diapositiva 6

#### Especificación de Requerimientos de Software

1.3. Definiciones, Acrónimos y Abreviaturas: Esta sección aclara los términos técnicos, acrónimos y abreviaturas utilizados en el ERS para garantizar que todos los lectores tengan una comprensión uniforme de la terminología empleada en el documento.

1.4. Referencias: Se proporciona una lista de documentos, estándares y otras fuentes que se han consultado o que son relevantes para la creación del ERS. Esto permite a los lectores seguir los antecedentes y fundamentos utilizados en la elaboración del documento.

1.5. Visión General del Documento: Esta subsección ofrece una visión general del contenido y la estructura del documento ERS. Explica brevemente cómo está organizado el documento y qué secciones contiene, proporcionando un resumen de la información que se desarrollará a continuación.

**Contenido visual de la lámina:** Texto junto a la portada del estándar IEEE 830-1998 (imagen ilustrativa, sin contenido adicional).

### Diapositiva 7

#### Especificación de Requerimientos de Software

2. Descripción General: Esta sección aborda todos los factores que impactan en el producto y sus requisitos.

2.1. Perspectiva del Producto: Describe cómo el sistema a desarrollar se relaciona con otros sistemas o productos. Se especifica si el producto es independiente o si forma parte de un sistema mayor, y se identifican las interfaces entre el sistema en cuestión y otros productos o sistemas, usando diagramas de bloques si es necesario.

2.2. Funciones del Producto: Resume las principales funciones y capacidades del sistema. Esta sección proporciona una visión general de lo que el sistema hará, describiendo las funciones de manera general sin entrar en detalles exhaustivos, y puede usar gráficos para ilustrar las relaciones entre funciones.

**Contenido visual de la lámina:** Texto junto a la portada del estándar IEEE 830-1998 (imagen ilustrativa, sin contenido adicional).

### Diapositiva 8

#### Especificación de Requerimientos de Software

2.3. Características de los Usuarios: Define las características de los usuarios del sistema, incluyendo su nivel educativo, experiencia previa y competencia técnica. Esto ayuda a diseñar el sistema de manera que se ajuste a las necesidades y capacidades de los usuarios finales.

2.4. Restricciones: Detalla las limitaciones que deben ser consideradas durante el diseño y desarrollo del sistema. Esto incluye políticas empresariales, limitaciones de hardware, requisitos de interfaz con otras aplicaciones, y otros factores que podrían restringir la implementación del sistema.

2.5. Suposiciones y Dependencias: Especifica los factores que, si cambian, podrían afectar los requisitos del sistema. Se detallan suposiciones sobre el entorno del sistema, como el sistema operativo o la estructura organizativa, y cómo estos factores podrían impactar en los requisitos si sufren modificaciones.

2.6. Requisitos Futuros: Anticipa mejoras o funcionalidades adicionales que se podrían considerar e implementar en el futuro. Esto permite una planificación a largo plazo y facilita la evolución del sistema a medida que surjan nuevas necesidades o oportunidades.

**Contenido visual de la lámina:** Texto junto a la portada del estándar IEEE 830-1998 (imagen ilustrativa, sin contenido adicional).

### Diapositiva 9

#### Especificación de Requerimientos de Software

2.3. Características de los Usuarios: Define las características de los usuarios del sistema, incluyendo su nivel educativo, experiencia previa y competencia técnica. Esto ayuda a diseñar el sistema de manera que se ajuste a las necesidades y capacidades de los usuarios finales.

2.4. Restricciones: Detalla las limitaciones que deben ser consideradas durante el diseño y desarrollo del sistema. Esto incluye políticas empresariales, limitaciones de hardware, requisitos de interfaz con otras aplicaciones, y otros factores que podrían restringir la implementación del sistema.

2.5. Suposiciones y Dependencias: Especifica los factores que, si cambian, podrían afectar los requisitos del sistema. Se detallan suposiciones sobre el entorno del sistema, como el sistema operativo o la estructura organizativa, y cómo estos factores podrían impactar en los requisitos si sufren modificaciones.

2.6. Requisitos Futuros: Anticipa mejoras o funcionalidades adicionales que se podrían considerar e implementar en el futuro. Esto permite una planificación a largo plazo y facilita la evolución del sistema a medida que surjan nuevas necesidades o oportunidades.

**Contenido visual de la lámina:** Texto junto a la portada del estándar IEEE 830-1998 (imagen ilustrativa, sin contenido adicional).

### Diapositiva 10

#### Especificación de Requerimientos de Software

3. Requisitos Específicos: Detalla los requisitos del sistema con un nivel de precisión que permite a los diseñadores desarrollar una solución que cumpla con estos requisitos y al equipo de pruebas, planificar y ejecutar pruebas para verificarlo.

3.1. Interfaces Externas: Describe los requisitos relacionados con las interfaces del sistema con los usuarios, otros sistemas y componentes externos. Incluye detalles sobre la interacción del sistema con otras aplicaciones y dispositivos.

3.2. Funciones: Especifica en detalle todas las funciones que el sistema debe llevar a cabo. Esta sección es una de las más extensas y puede incluir descripciones de alto nivel o más detalladas, utilizando gráficos o tablas para ayudar a explicar las funciones del sistema.

3.3. Requisitos de Rendimiento: Detalla las expectativas de rendimiento del sistema, incluyendo la carga esperada, como el número de usuarios simultáneos, la cantidad de transacciones por segundo, y los requisitos de almacenamiento de datos, como la frecuencia de acceso y el volumen de registros.

**Contenido visual de la lámina:** Texto junto a la portada del estándar IEEE 830-1998 (imagen ilustrativa, sin contenido adicional).

### Diapositiva 11

#### Especificación de Requerimientos de Software

3.4. Restricciones de Diseño: Enumera las limitaciones específicas que afectan al diseño del sistema, como restricciones normativas, limitaciones del hardware, o restricciones de otros estándares que deben ser consideradas durante el diseño.

3.5. Atributos del Sistema: Define los atributos de calidad del sistema, conocidos como "ilities", que incluyen fiabilidad, mantenibilidad, portabilidad, y seguridad. Especifica cómo se deben gestionar estos atributos, incluyendo la seguridad de acceso y los mecanismos de protección de datos.

3.6. Otros Requisitos: Incluye cualquier requisito adicional que no encaje en las secciones anteriores. Esta categoría permite documentar requisitos especiales o menos comunes que aún son relevantes para el sistema.

4. Apéndices: Contienen información adicional que no forma parte central del documento ERS pero que es útil para completar el entendimiento del mismo. Ejemplos incluyen formatos de entrada/salida de datos, análisis de costes, o restricciones relacionadas con el lenguaje de programación.

**Contenido visual de la lámina:** Texto junto a la portada del estándar IEEE 830-1998 (imagen ilustrativa, sin contenido adicional).

### Diapositiva 12

#### Especificación de Requerimientos de Software

Gestión, seguimiento y trazabilidad:

Al registrar un requerimiento de forma detallada, la buena práctica es que todo requerimiento contenga:

Código

Nombre

Descripción

Actor vinculado

- Una identificación única para referirnos

- Que haga referencia a la funcionalidad

- Una explicación detallada del

- Describe el rol, perfil o perfiles de

de forma precisa. • Ejemplo: • Actualización de campos en productos

requerimiento • Ejemplo: • Determinado usuario, en determinada

existentes • …

usuario que podrán realizar la acción • Ejemplo: • Supervisor • Administrador • …

interfaz gráfica, podrá actualizar los siguientes campos de productos existentes…

al requerimiento dentro del proyecto. • Ejemplo: • RF1 • RF2 • RF3 • …

Entrada

Proceso

Salida

Estatus

- Describe el o los campos que se

- Describe de forma técnica el proceso

- Describe el resultado esperado de la

- Describe el estado del requerimiento

requieren para ejecutar la acción. • Ejemplo: • Código del producto, nombre de

acción una vez que se realiza el proceso • Ejemplo: • Una vez se realiza la query de registro

producto, descripción del producto…

que se realizará con los datos de entrada • Ejemplo: • Se registran los datos de entrada en la

en la base de datos, se notifica al usuario resultado de la acción…

dentro de su ciclo de vida • Ejemplo: • Validado • Pendiente por validar • …

tabla ‘PRODUCTO’ de la base de datos. • …

**Contenido visual de la lámina:** Ocho tarjetas, una por campo, cada una con su descripción y ejemplo:

| Campo | Descripción | Ejemplo |
|---|---|---|
| Código | Una identificación única para referirnos al requerimiento dentro del proyecto | RF1, RF2, RF3… |
| Nombre | Que haga referencia a la funcionalidad de forma precisa | Actualización de campos en productos existentes |
| Descripción | Una explicación detallada del requerimiento | Determinado usuario, en determinada interfaz gráfica, podrá actualizar los siguientes campos de productos existentes… |
| Actor vinculado | Describe el rol, perfil o perfiles de usuario que podrán realizar la acción | Supervisor, Administrador… |
| Entrada | Describe el o los campos que se requieren para ejecutar la acción | Código del producto, nombre de producto, descripción del producto… |
| Proceso | Describe de forma técnica el proceso que se realizará con los datos de entrada | Se registran los datos de entrada en la tabla «PRODUCTO» de la base de datos |
| Salida | Describe el resultado esperado de la acción una vez que se realiza el proceso | Una vez que se realiza la query de registro en la base de datos, se notifica al usuario el resultado de la acción |
| Estatus | Describe el estado del requerimiento dentro de su ciclo de vida | Validado, Pendiente por validar… |

### Diapositiva 13

#### Especificación de Requerimientos de Software

Gestión, seguimiento y trazabilidad:

Ejemplo:

RF1

Una vez definidos los requerimientos, se puede pueden distribuir en la siguiente matriz para priorizar y categorizar nivel de complejidad:

RF2

Alta

RF3

Complejidad de

Media

desarrollo

Baja

1 2 3 4 5

RF4

Impacto para el negocio

**Contenido visual de la lámina:** Matriz de priorización: eje horizontal **Impacto para el negocio** (1 a 5) y eje vertical **Complejidad de desarrollo** (Baja, Media, Alta). Las celdas van del verde (baja complejidad e impacto bajo) al amarillo, naranjo y rojo (alta complejidad e impacto alto). Ejemplos ubicados con flechas: **RF1** en complejidad alta e impacto 2; **RF2** en complejidad alta e impacto 4; **RF3** en complejidad media e impacto 3; **RF4** en complejidad baja e impacto 4.

### Diapositiva 14

#### Control de cambios de los requerimientos

Identificación de Cambios:

Proceso de control de cambios

- Captura y documentación de solicitudes de

cambio. • Solicitudes pueden venir de usuarios, clientes,

Evolución del sistema en modelos tradicionales

desarrolladores o partes interesadas. • Registro detallado para entender

completamente el alcance y naturaleza del cambio.

Seguimiento de Cambios:

Evaluación de Cambios:

- Actualización de la documentación de

- Evaluación rigurosa del impacto en costo,

tiempo, recursos y otros requisitos del sistema. • Evaluación colaborativa con todas las partes

interesadas.

requisitos. • Ajuste de planes del proyecto. • Comunicación de los cambios a todo el equipo

y partes interesadas. • Monitoreo del progreso para asegurar correcta

implementación y evitar problemas imprevistos.

Aprobación de Cambios:

- Realizada por un comité de control de cambios. • Basada en criterios claros y objetivos. • Solo se aprueban cambios beneficiosos y

Sommerville, I. (2011). Software Engineering 9th Ed. Pp. 44.

justificados.

**Contenido visual de la lámina:** **Proceso de control de cambios**, ciclo circular de cuatro etapas:
1. **Identificación de cambios:** captura y documentación de solicitudes de cambio; las solicitudes pueden venir de usuarios, clientes, desarrolladores o partes interesadas; registro detallado para entender completamente el alcance y la naturaleza del cambio.
2. **Evaluación de cambios:** evaluación rigurosa del impacto en costo, tiempo, recursos y otros requisitos del sistema; evaluación colaborativa con todas las partes interesadas.
3. **Aprobación de cambios:** realizada por un comité de control de cambios; basada en criterios claros y objetivos; solo se aprueban cambios beneficiosos y justificados.
4. **Seguimiento de cambios:** actualización de la documentación de requisitos; ajuste de planes del proyecto; comunicación de los cambios a todo el equipo y partes interesadas; monitoreo del progreso para asegurar la correcta implementación y evitar problemas imprevistos.

A la derecha, **evolución del sistema en modelos tradicionales** (Sommerville, 2011, p. 44): *Definición de requerimientos del sistema → Valoración de sistemas existentes → Propuesta de cambios al sistema → Modificación de sistemas*, con *Sistemas existentes* como entrada de la valoración y *Nuevo sistema* como resultado de la modificación.

### Diapositiva 15

#### Ingeniería de Requerimientos & Desarrollo

Ingeniería de Requisitos (Ideación y análisis)

- Fundamento para el desarrollo de software • Definición clara de objetivos • Puente entre usuarios y desarrolladores • Recopilación y refinamiento de necesidades • Especificación de requisitos detallada • Guía para diseño e implementación • Gestión del cambio

¿Cuál es la relación entre la ingeniería de requisitos y el desarrollo de software?

Desarrollo de Software (Construcción)

- Dependencia de requisitos claros • Hoja de ruta orientando el diseño y la

implementación • Verificación y validación • Satisfacción del cliente

**Contenido visual de la lámina:** Dos flechas en sentidos opuestos ante la pregunta *¿Cuál es la relación entre la ingeniería de requisitos y el desarrollo de software?* Flecha azul hacia arriba: **Ingeniería de Requisitos (ideación y análisis)**. Flecha verde hacia abajo: **Desarrollo de Software (construcción)**. Cada una con su lista de aportes.

### Diapositiva 16

#### Referencias Bibliográficas

Para mayor información o profundizar los contenidos, puedes consultar:

- Arias Chaves, M., (2005). La ingeniería de requerimientos y su importancia en el desarrollo de proyectos de software. InterSedes: Revista de las Sedes Regionales, VI(10), 1-13.

- Herrera J., L. J., (2003). Ingeniería de Requerimientos, Ingeniería de Software.

- IEEE 830-1998. Recommended Practice for Software Requirements Specifications.

- Pressman, R. (2010). Software Engineering 7th Ed.

- Ralph, Y. (2004). The Requirements Engineering Handbook. Artech House Technology Management and Professional Development Library. Boston, Libro electrónico ebscohost

- Sommerville, I. (2011). Software Engineering 9th Ed.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 17

¡Tus consultas son importantes! Espacio para preguntas

**Contenido visual de la lámina:** Lámina de cierre: *¡Tus consultas son importantes! Espacio para preguntas.*

---

<a id="capitulo-05"></a>

## 05. Sistematización de problemas

Fuente del ZIP: `05_Sistematizacion_de_problemas.md`.

### Diapositiva 1

INGENIERÍA DE REQUERIMIENTOS Y ASEGURAMIENTO DE LA CALIDAD Sistematización de problemas y objetivos

Prof. Rodrigo Caballero V.

rcaballerov@docente.uss.cl

**Contenido visual de la lámina:** Portada con fotografía de fondo, logo USS, título de la sesión y datos del profesor.

### Diapositiva 2

#### Contenidos de esta sesión

Documentación y gestión de requisitos:

- Identificación de problemáticas

- Diagramas Causa-efecto

- Redacción de objetivos generales y específicos

- Métricas y directrices SMART

**Contenido visual de la lámina:** Nota adhesiva amarilla: **Resultado de Aprendizaje de la Unidad** — *Explica la importancia de la ingeniería de requisitos, su necesidad y sus dificultades en el contexto de un proyecto de desarrollo de software.*

### Diapositiva 3

Diagrama Causa-efecto:

Esta herramienta es conocida por diversos nombres:

- Diagrama causa-efecto.

Identificación de problemas

- Diagrama cola de pez

- Diagrama espinas de pescado

- Diagrama de Ishikawa

**Contenido visual de la lámina:** Ilustración de un pez payaso junto a la lista de nombres del diagrama.

### Diapositiva 4

#### Identificación del problema

Anavalón & Beltrán (2014) Diagrama causa efecto. Proyecto “Aplicación web para el monitoreo de indicadores de aprendizajes”.

**Contenido visual de la lámina:** Diagrama de Ishikawa de ejemplo (Anavalón y Beltrán, 2014, proyecto «Aplicación web para el monitoreo de indicadores de aprendizajes»). Efecto: *Deficiencia en el sistema de monitoreo de los aprendizajes académicos que contribuyen con la generación de medidas correctivas.* Categorías y causas: **Medición** — carencia de estándares aplicados a la medición de las evaluaciones de aprendizaje. **Proceso** — diversos procesos para el almacenamiento de resultados de las evaluaciones de aprendizaje. **Información** — ausencia de información histórica de las evaluaciones de aprendizaje; propenso a pérdida de información.

### Diapositiva 5

#### Identificación del problema

¿Cómo puedo tomar saber qué causas identificar? (1) El modelo de las 4M:

**Contenido visual de la lámina:** Plantilla del **modelo 4M** (techqualitypedia.com): espina central hacia el recuadro **PROBLEM or EFFECT**, con cuatro categorías: **MAN** y **MACHINE** arriba, **MATERIAL** y **METHOD** abajo. Cada rama tiene *Causes* y *Sub-Causes*; se rotulan los niveles **Primary Causes**, **Secondary Causes** y **Tertiary Causes**.

### Diapositiva 6

#### Identificación del problema

¿Cómo puedo tomar saber qué causas identificar? (2) El modelo de las 6M:

**Contenido visual de la lámina:** Ejemplo del **modelo 6M** (plantilla de XMind 8). Efecto: **MISSED DEADLINE**. Categorías y causas: **Measurement** — no progress tracking, no short term goals, no timesheet. **Method** — bureaucratic, poor prioritization, lack of planning. **People** — micro-managing boss, absent secretary, sick children. **Materials** — unstable desk, no printer paper, squeaky desk chair. **Environment** — fluorescent lights, small cubicle, office cold. **Machine** — coffee machine broken, broken truck, poor internet connection.

### Diapositiva 7

#### Otras herramientas

Árbol de problemas

**Contenido visual de la lámina:** **Árbol de problemas** sobre la imagen de un árbol. Abajo, en las raíces (franja *CAUSAS*): Causa 1, Causa 2 y Causa 3, que apuntan al **Problema Central** (tronco). Arriba, en las ramas (franja *EFECTOS*): dos **Problemas Secundarios** y Consecuencias 1 a 4, conectadas con flechas hacia arriba.

### Diapositiva 8

#### Otras herramientas

Focus Group

**Contenido visual de la lámina:** **Focus Group**, con una ilustración de personas sentadas y globos de diálogo. Proceso en cuatro etapas con flechas: **Definir** (objetivos) → **Transmitir** (motivación) → **Generar** (diálogo) → **Validar** (apreciaciones).

### Diapositiva 9

#### Redacción de Objetivos

Una vez que tenemos identificado nuestro problema ¿Cómo proponemos un objetivo

para cubrir la problemática?

**Contenido visual de la lámina:** Lámina de pregunta, sin imágenes con contenido adicional.

### Diapositiva 10

#### Redacción de Objetivos

Objetivo

¿Cuál es el objetivo principal del proyecto?

General

Objetivo Específico

¿Qué otros objetivos

1 (OE1)

Una vez que tenemos identificado nuestro problema ¿Cómo proponemos un objetivo

contribuyen al cumplimiento de mi

para cubrir la problemática?

objetivo general?

Objetivo Específico

¿Cómo se impacta al

2 (OE2)

negocio con el cumplimiento de mi

objetivo general?

Objetivo específico

n (OE..n)

**Contenido visual de la lámina:** Jerarquía de objetivos: **Objetivo General** (*¿Cuál es el objetivo principal del proyecto?*) arriba, y debajo **Objetivo Específico 1 (OE1)**, **Objetivo Específico 2 (OE2)** y **Objetivo específico n (OE..n)**, agrupados con una llave que remite a *¿Qué otros objetivos contribuyen al cumplimiento de mi objetivo general?* y *¿Cómo se impacta al negocio con el cumplimiento de mi objetivo general?*

### Diapositiva 11

#### Redacción de Objetivos

Objetivo

Usualmente, aunque no de forma obligatoria:

General

Objetivo Específico

1 (OE1)

Objetivo Específico

2 (OE2)

Objetivo específico

n (OE..n)

**Contenido visual de la lámina:** *Usualmente, aunque no de forma obligatoria:* el diagrama 6M de *Missed deadline* con tres zonas encerradas en rojo. Flechas indican que el **efecto** (*Missed deadline*) origina el **Objetivo General** y que las **causas** encerradas (*Measurement* y *Environment*) originan los **objetivos específicos**.

### Diapositiva 12

#### Redacción de Objetivos

**Contenido visual de la lámina:** Infografía **SMART** (monge­guerrero.com): **S** — Specific / Específico — ¿Qué? · **M** — Measurable / Medible — ¿Cuánto? · **A** — Attainable / Alcanzable — ¿Cómo? · **R** — Realistic / Realista — ¿Con qué? · **T** — Time / Tiempo — ¿Cuándo?

### Diapositiva 13

#### Redacción de Objetivos

**Contenido visual de la lámina:** Ícono de diana con dardos y esquema de tres dimensiones con flechas a notas: **X: Hacer** → *¿Qué voy a hacer?*; **Y: Mediante** → *¿Mediante qué herramienta?*; **Z: Finalidad** → *¿Para qué?*. En el ejemplo, cada parte del objetivo general aparece en el color de su dimensión.

### Diapositiva 14

#### Redacción de Objetivos

**Contenido visual de la lámina:** Miniatura del Ishikawa de la lámina 4 junto al recuadro de su efecto. En el objetivo resultante, cada parte aparece en el color de su dimensión: X *Apoyar el monitoreo de aprendizajes académicos*, Y *por medio de una plataforma web*, Z *para contribuir en las medidas correctivas de la institución durante el tercer trimestre 2020*.

### Diapositiva 15

#### Redacción de Objetivos

**Contenido visual de la lámina:** Tabla de medición con notas numeradas que indican el orden de llenado:

| Situación actual | Objetivo específico | Situación esperada | Métrica | Criterio de éxito |
|---|---|---|---|---|
| Actualmente el proceso demora 60 minutos | Disminuir el tiempo que tarda el proceso de monitoreo académico | De acuerdo a lo conversado con el cliente, se pretende realizar el proceso en a lo más 15 minutos | Tiempo en minutos | Tiempo posterior al proyecto <= 25 % del tiempo previo al proyecto |

Orden: **(1)** ¿Qué voy a medir? (Métrica) → **(2)** ¿Se puede medir actualmente? (Situación actual) → **(3)** ¿Lo podré medir al finalizar el proyecto? (Situación esperada) → **(4)** ¿Cómo lo consideraremos exitoso? (Criterio de éxito).

### Diapositiva 16

#### Referencias Bibliográficas

Para mayor información o profundizar los contenidos, puedes consultar:

- Doran, G.T. (1981) There’s a SMART Way to Write Management’s Goals and Objectives. Journal of Management Review, 70, 35-36.

- Herrera J., L. J., (2003). Ingeniería de Requerimientos, Ingeniería de Software.

- IEEE 830-1998. Recommended Practice for Software Requirements Specifications.

- Ishikawa, Kaoru (1968). Guide to Quality Control. Tokyo: JUSE.

- Pressman, R. (2010). Software Engineering 7th Ed.

- Sommerville, I. (2011). Software Engineering 9th Ed.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 17

¡Tus consultas son importantes! Espacio para preguntas

**Contenido visual de la lámina:** Lámina de cierre: *¡Tus consultas son importantes! Espacio para preguntas.*

---

<a id="capitulo-06"></a>

## 06. Procesos de Negocio con BPMN

Fuente del ZIP: `06_Procesos_de_Negocio_con_BPMN.md`.

### Diapositiva 1

INGENIERÍA DE REQUERIMIENTOS Y ASEGURAMIENTO DE LA CALIDAD Business Process Model and Notation (BPMN)

Prof. Rodrigo Caballero V.

rcaballerov@docente.uss.cl

**Contenido visual de la lámina:** Portada con fotografía de fondo, logo USS, título de la sesión y datos del profesor.

### Diapositiva 2

#### Contenidos de esta sesión

Documentación y gestión de requisitos:

- Contextualización de un proceso de negocio

- Business Process Model and Notation (BPMN)

- Registro de principales requerimientos de software

- Uso del estándar IEEE-830 para documentar

- Presentación de enunciado de Solemne 1

**Contenido visual de la lámina:** Nota adhesiva amarilla: **Resultado de Aprendizaje de la Unidad** — *Aplica los conceptos y herramientas de la ingeniería de requisitos a un caso práctico, incorporando aspectos de aseguramiento de calidad al proceso de ingeniería de desarrollo de software.*

### Diapositiva 3

(1) Identificar un problema con

sus respectivas causas.

(2) Delimitar el alcance sobre el

Recordamos: Principales uso

del diagrama

quehacer del proyecto. Ejemplo:

causa-efecto

**Contenido visual de la lámina:** Ilustración de un pez payaso y miniatura del Ishikawa del capítulo 05 con dos causas encerradas en rojo como ejemplo del alcance.

### Diapositiva 4

#### Usos del diagrama causa-efecto

Anavalón & Beltrán (2014) Diagrama causa efecto. Proyecto “Aplicación web para el monitoreo de indicadores de aprendizajes”.

**Contenido visual de la lámina:** Ishikawa de *Deficiencia en el sistema de monitoreo de los aprendizajes académicos…* (Anavalón y Beltrán, 2014) con dos causas encerradas en rojo: *Carencia de estándares aplicados a la medición de las evaluaciones de aprendizaje* (Medición) y *Propenso a pérdida de información* (Información). Nota adhesiva: **ALCANCE** — *Delimita qué hago y no hago dentro del proyecto, bajo mi rol de líder o ingeniero de software.*

### Diapositiva 5

#### Contextualización de un proyecto

Para la narrativa del proyecto ¿Cómo podemos contextualizar la situación actual o funcionamiento

de un proceso?

**Contenido visual de la lámina:** Lámina de pregunta, sin imágenes con contenido adicional.

### Diapositiva 6

BPMN: Business

Notación gráfica estandarizada que permite el modelado de procesos de negocio, en un formato de flujo de trabajo (workflow).

Process Model and

Notation

BPMN fue inicialmente desarrollada por la organización Business Process Management Initiative (BPMI), y es actualmente mantenida por el Object Management Group (OMG), después de la fusión de las dos organizaciones en el año 2005.

https://www.omg.org/bpmn/

**Contenido visual de la lámina:** Logos de **OMG** (Object Management Group) y **BPMN**.

### Diapositiva 7

#### Especificación en Object Management Group

https://www.omg.org/bpmn/

**Contenido visual de la lámina:** Capturas del sitio https://www.omg.org/bpmn: página *Business Process Model & Notation (BPMN)* con la descripción de la especificación y accesos a *Specifications*, *Data sheet*, *Certification* y *More information*.

### Diapositiva 8

#### Especificación en Object Management Group

https://www.omg.org/spec/BPMN

**Contenido visual de la lámina:** Capturas de https://www.omg.org/spec/BPMN: ficha *About the Business Process Model and Notation Specification Version 2.0.2* (acrónimo BPMN, versión 2.0.2, estado formal, publicación enero de 2014) y portada del documento *Business Process Model and Notation (BPMN) Version 2.0.2* (diciembre de 2013).

### Diapositiva 9

#### Ejemplo de Diagrama BPMN

Contexto de

negocio referente a nuevas cuentas

en AWS.

¿Quiénes participan?

¿Qué tareas

hacen?

¿Qué decisiones

toman?

**Contenido visual de la lámina:** Diagrama BPMN de ejemplo: **Solicitud de alta de cuentas en Amazon Web Services (AWS)**, con cuatro carriles:
- **Solicitante:** inicio *Solicita cuenta AWS* → *Completa formulario "Solicitud de Cuenta en AWS" en el Centro de Soluciones* (objeto de datos: https://soluciones.cencosud.com/) … *Recibe notificación de resolución en el Centro de Soluciones* → fin *Fin del proceso*.
- **Plataformas Cloud:** compuerta *¿Cuenta con toda la información requerida?* — NO → *Recaba información faltante con área solicitante* (vuelve al formulario); SÍ → *Creación del entorno y configuración base* (temporizador *1 día (SLA)*) … *Configuración final, línea base de gobierno cloud* (temporizador *2 a 3 días (SLA)*).
- **Seguridad:** *Configuración de usuarios root, CyberArk, creación de grupos AD para roles de usuarios finales* → *Aplicación de la línea base de seguridad y roles de cuenta* (temporizador *6 a 7 días (SLA)*), con un documento de referencia.
- **Networking:** *Creación de VPC y configuración del direccionamiento* (temporizador *1 a 2 días (SLA)*).

A la izquierda: *Contexto de negocio referente a nuevas cuentas en AWS* y las preguntas *¿Quiénes participan? ¿Qué tareas hacen? ¿Qué decisiones toman?*

### Diapositiva 10

#### Cómo diseñar un diagrama BPMN

Carriles de Nado: Son un mecanismo visual de actividades organizadas y categorizadas, basados en organigramas funcionales cruzados

Carril

Usado para organizar y categorizar las actividades dentro de una piscina de acuerdo a su función o rol; y se presenta como un rectángulo estrecho de ancho o de alto de la piscina. Un carril contiene objetos de flujo, objetos de conexión y artefactos.

Piscina

Representa los participantes principales de un proceso, por lo general, separados por las diferentes organizaciones. Una piscina contiene uno o más carriles (en la vida real, como una piscina olímpica). Una piscina puede ser abierta (por ejemplo, mostrar el detalle interno), cuando se presenta como un gran rectángulo que muestra uno o más carriles, o cerrada (por ejemplo, esconder el detalle interno), cuando se presenta como un rectángulo vacío que se extiende a lo ancho o alto del diagrama.

**Contenido visual de la lámina:** Dos recuadros: **Piscina** (texto de la lámina) y **Carril** (texto de la lámina), junto a una miniatura del diagrama de AWS con la piscina encerrada en un óvalo y los carriles marcados.

### Diapositiva 11

#### Cómo diseñar un diagrama BPMN

Objetos de Flujo son los elementos principales descritos dentro de BPMN.

Se representan por un rectángulo de vértices redondeados y describe el tipo de trabajo que será realizado.

Tarea

Se representan por un rombo y determinan si se bifurcan o se combinan las rutas dependiendo de las condiciones expresadas.

- Una tarea representa una sola

Representados gráficamente por un círculo y describen algo que sucede (a diferencia de las Actividades que son algo que se hace). Los eventos también pueden ser clasificados como “Capturado” o “Lanzado”.

Evento Inicial

Eventos

- Actúa como un disparador de un

Actividades

Compuertas

unidad de trabajo que no es o no se puede dividir a un mayor nivel de detalle de procesos de negocio sin diagramación de los pasos de un procedimiento. Subproceso

- Se utiliza para ocultar o mostrar

proceso. Se representa gráficamente por un círculo de línea delgada relleno de color verde. Este evento permite “Capturar”. Evento Final

- Indica el final de un proceso. Está

(Control de Flujo)

otros niveles de detalle de procesos de negocio. Transacción

- Subproceso donde todas las

actividades contenidas deben ser tratadas como un todo.

representado gráficamente por un círculo de línea gruesa relleno del color rojo. Este evento permite “Lanzar”. Evento Intermedio

- Indica que algo sucede entre el

evento inicial y el evento final. Está representado gráficamente por un círculo de doble línea simple relleno de color naranja. Este evento puede “Capturar” o “Lanzar”.

**Contenido visual de la lámina:** Tres recuadros: **Eventos**, **Actividades** y **Compuertas (Control de flujo)**, cada uno con una paleta de símbolos BPMN: eventos como círculos (inicio de línea delgada, fin de línea gruesa, intermedios de doble línea, con variantes de mensaje, temporizador y otros); actividades como rectángulos de vértices redondeados (tarea, subproceso, transacción y variantes); compuertas como rombos (exclusiva, paralela, inclusiva, basada en eventos, compleja y otras).

### Diapositiva 12

#### Cómo diseñar un diagrama BPMN

Objetos de conexión: Permitirán conectar cada uno de los objetos de flujo.

Está representado por una línea discontinua con un círculo no relleno al inicio y una punta de flecha no rellena al final. Esto nos dice, que el flujo de mensaje atraviesa la frontera organizativa (por ejemplo, entre piscinas). Un flujo de mensaje no puede ser utilizado para conectar actividades o eventos dentro de la misma piscina.

Asociaciones

Está representado por línea simple continua y flechada; y muestra el orden en que las actividades se llevarán a cabo. El flujo de secuencia puede tener un símbolo al inicio, un pequeño diamante indica uno de un número de flujos condicionales desde una actividad, mientras que una barra diagonal indica el flujo por defecto desde una decisión o actividad con flujos condicionales.

Flujo de Mensaje

Flujo de Secuencia

Se representan por una línea de puntos. Se suele usar para conectar artefactos o un texto a un objeto de flujo y puede indicar muchas direccionabilidades usando una punta de flecha no rellena (hacia el artefacto para representar a un resultado, desde el artefacto para representar una entrada, y los dos para indicar que se lee y se actualiza). La “no direccionabilidad” podría usarse con el artefacto o un texto está asociado con una secuencia o flujo de mensaje (como el flujo muestra la dirección).

**Contenido visual de la lámina:** Tres recuadros con su símbolo: **Flujo de secuencia** (línea continua con flecha rellena, *Sequence Flow*), **Flujo de mensaje** (línea discontinua con círculo al inicio y punta de flecha no rellena, *Message Flow*) y **Asociaciones** (línea punteada, *Association*).

### Diapositiva 13

#### Cómo diseñar un diagrama BPMN

Artefactos: Permiten a los desarrolladores llevar algo más de información al modelo o diagrama. De esta manera, el modelo o diagrama se hace más legible.

Datos

Grupos

Muestra al lector cuál es el dato que deberá ser requerido o producido en una actividad.

Se utiliza para darle al lector una descripción entendible del modelo o diagrama.

Anotación

Objetos de

Se representan por un rectángulo de líneas discontinuas y vértices redondeados. El Grupo se utiliza para agrupar diferentes actividades pero no afecta al flujo dentro de un diagrama.

**Contenido visual de la lámina:** Tres recuadros con su símbolo: **Objetos de datos** (hoja con esquina doblada, *Data*), **Grupos** (rectángulo de línea discontinua con vértices redondeados, *Group*) y **Anotación** (corchete abierto con texto, *Annotation*).

### Diapositiva 14

#### Cómo diseñar un diagrama BPMN

Buenas prácticas para elaborar un diagrama BPMN:

Identifique todos

El flujo de trabajo

los actores que

Cada actor corresponde a un

debe ser trazable

La lectura del proceso debe comenzar en la

participan del

carril (lane) del

desde el inicio al

parte superior

proceso

diagrama

fin del proceso

izquierda

Las redacciones

El diagrama debe

Todas las tareas deben comenzar

Incluir todas las tareas, eventos y

con un verbo en

deben ser objetivas y carecer

compuertas que

ser auto- explicativo

3ra persona

de juicios de valor

se requieran

singular

**Contenido visual de la lámina:** Ocho recuadros verdes con buenas prácticas para elaborar un diagrama BPMN: (1) Identifique todos los actores que participan del proceso. (2) Cada actor corresponde a un carril (lane) del diagrama. (3) La lectura del proceso debe comenzar en la parte superior izquierda. (4) El flujo de trabajo debe ser trazable desde el inicio al fin del proceso. (5) El diagrama debe ser autoexplicativo. (6) Todas las tareas deben comenzar con un verbo en 3.ª persona singular. (7) Las redacciones deben ser objetivas y carecer de juicios de valor. (8) Incluir todas las tareas, eventos y compuertas que se requieran.

### Diapositiva 15

#### Referencias Bibliográficas

Para mayor información o profundizar los contenidos, puedes consultar:

- Doran, G.T. (1981) There’s a SMART Way to Write Management’s Goals and Objectives. Journal of Management Review, 70, 35-36.

- Herrera J., L. J., (2003). Ingeniería de Requerimientos, Ingeniería de Software.

- IEEE 830-1998. Recommended Practice for Software Requirements Specifications.

- Ishikawa, Kaoru (1968). Guide to Quality Control. Tokyo: JUSE.

- Pressman, R. (2010). Software Engineering 7th Ed.

- Sommerville, I. (2011). Software Engineering 9th Ed.

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 16

¡Tus consultas son importantes! Espacio para preguntas

**Contenido visual de la lámina:** Lámina de cierre: *¡Tus consultas son importantes! Espacio para preguntas.*

---

<a id="capitulo-07"></a>

## 07. IBM EDT Playbacks

Fuente del ZIP: `07_IBM_EDT_Playbacks.md`.

### Diapositiva 1

TOOLKIT Playbacks

Traducción y contribución:

Juan Cruz Bruni

Method Expert - Innovation Team Argentina

Valeria Cremona

Method Expert - Innovation Team Argentina

Get the latest version of this deck.

Enterprise Design Thinking Toolkit • 2021 IBM Corporation

**Contenido visual de la lámina:** Portada del toolkit **Enterprise Design Thinking by IBM — Playbacks**. Traducción y contribución: Juan Cruz Bruni y Valeria Cremona (Method Experts, Innovation Team Argentina), con sus fotografías. Fotografía de fondo de una persona presentando frente a una pantalla. *Enterprise Design Thinking Toolkit · 2021 IBM Corporation.*

### Diapositiva 2

Intro Setup Invite Tell Listen 30 min Playbacks 30 min Playbacks

INTRODUCCIÓN

¿Por qué hacemos esto?

Los Playbacks son presentaciones distintas, contadas como una historia, que alinean al equipo, clientes y otros interesados en una experiencia de usuario futura.

Enterprise Design Thinking Toolkit • August 23, 2018 • © 2018 IBM Corporation

Enterprise Design Thinking Toolkit • 2021 IBM Corporation

**Contenido visual de la lámina:** Lámina de texto del toolkit (encabezado *Playbacks · 30 min · Introducción*), sin imágenes con contenido adicional.

### Diapositiva 3

Intro Setup Invite Tell Listen 30 min Playbacks 30 min Playbacks

INTRODUCCIÓN

¿Cuándo utilizar esta actividad?

Cuando el equipo necesite alinearse o en cualquier momento que se desee compartir algo nuevo que se haya descubierto o logrado. Haz Playbacks de rutina cuando se logren objetivos a lo largo del proyecto.

Enterprise Design Thinking Toolkit • August 23, 2018 • © 2018 IBM Corporation

Enterprise Design Thinking Toolkit • 2021 IBM Corporation

**Contenido visual de la lámina:** Lámina de texto del toolkit (encabezado *Playbacks · 30 min · Introducción*), sin imágenes con contenido adicional.

### Diapositiva 4

Intro Setup Invite Tell Listen 30 min Playbacks 30 min Playbacks

INTRODUCCIÓN

¿Cómo es un buen Playback?

- Presenta una historia

- Crea una conexión emocional

- Provee un argumento convincente

- Presenta una solución

Enterprise Design Thinking Toolkit • August 23, 2018 • © 2018 IBM Corporation

Enterprise Design Thinking Toolkit • 2021 IBM Corporation

**Contenido visual de la lámina:** Lámina de texto del toolkit (encabezado *Playbacks · 30 min · Introducción*), sin imágenes con contenido adicional.

### Diapositiva 5

30 min Playbacks

INTRODUCCIÓN

Los Playbacks -con mayúscula inicial-, son presentaciones formales para alinear al equipo e involucrados durante puntos clave del proceso.

Enterprise Design Thinking Toolkit • 2021 IBM Corporation

**Contenido visual de la lámina:** Ilustración tipográfica de una **P mayúscula** junto a una **p minúscula** sobre líneas guía, para diferenciar el Playback formal («con mayúscula inicial»).

### Diapositiva 6

30 min Playbacks

INTRODUCCIÓN

Otros playbacks mas informales –con p minúscula- pueden suceder en cualquier momento para alinear al equipo y asegurar que el rumbo es el correcto.

Enterprise Design Thinking Toolkit • 2021 IBM Corporation

**Contenido visual de la lámina:** La misma ilustración de **p** y **P**, para diferenciar los playbacks informales («con p minúscula»).

### Diapositiva 7

Intro Setup Invite Tell Listen 30 min Playbacks 30 min Playbacks

INTRODUCCIÓN

¿Cuán pulidos deberían ser los Playbacks?

Ajusta el estilo y contenido del Playback a la audiencia. Lo que expongas informalmente a tu equipo será distinto de lo que expongas a los ejecutivos y otros interesados externos.

Enterprise Design Thinking Toolkit • August 23, 2018 • © 2018 IBM Corporation

Enterprise Design Thinking Toolkit • 2021 IBM Corporation

**Contenido visual de la lámina:** Lámina de texto del toolkit (encabezado *Playbacks · 30 min · Introducción*), sin imágenes con contenido adicional.

### Diapositiva 8

#### 30 min

Playbacks

INTRODUCCIÓN

El tiempo sugerido para esta actividad es de 30 minutos, ¡pero tú decides!

- Todos participan. Todos tienen un marcador y un block de stickies. •Mantén a todos atentos. Evita conversaciones paralelas. Usa el “parking lot” para capturar puntos fuera del tema central. •Atente a los tiempos de la agenda. Para lograr los objetivos necesitamos mantenernos dentro del plan. •Sí, y… En lugar de descartar ideas, oblígate a construir sobre ellas.

- Habla menos, escribe más. Escribe o dibuja tus ideas en los stickies antes de contarlas. Durante las discusiones, captura los puntos clave en stickies y ponlos en la pared. •No hay ideas malas. Empieza por lo grande. Recolecta las ideas de todos, agrupa y busca patrones. Identifica las grandes ideas. •Mantente enfocado en el usuario. Cuenta historias acerca de tu usuario para mantenerlo como el foco de atención.

Enterprise Design Thinking Toolkit • August 23, 2018 • © 2018 IBM Corporation

Enterprise Design Thinking Toolkit •© 2021 IBM Corporation

**Contenido visual de la lámina:** Reglas de la actividad en dos columnas: **Habla menos, escribe más** (escribe o dibuja tus ideas en los stickies antes de contarlas; durante las discusiones, captura los puntos clave en stickies y ponlos en la pared). **No hay ideas malas** (empieza por lo grande; recolecta las ideas de todos, agrupa y busca patrones; identifica las grandes ideas). **Mantente enfocado en el usuario** (cuenta historias acerca de tu usuario para mantenerlo como el foco de atención). **Todos participan** (todos tienen un marcador y un block de stickies). **Mantén a todos atentos** (evita conversaciones paralelas; usa el «parking lot» para capturar puntos fuera del tema central). **Atente a los tiempos de la agenda** (para lograr los objetivos necesitamos mantenernos dentro del plan). **Sí, y…** (en lugar de descartar ideas, oblígate a construir sobre ellas).

### Diapositiva 9

Enterprise Design Thinking Toolkit • August 23, 2018 • © 2018 IBM Corporation

**Contenido visual de la lámina:** Fotografía de una persona presentando a un grupo sentado en una sala, frente a una pantalla.

### Diapositiva 10

Preparados…

Listos…

¡Ahora!

Enterprise Design Thinking Toolkit • 2021 IBM Corporation

**Contenido visual de la lámina:** Lámina de transición: *Preparados… Listos… ¡Ahora!*

### Diapositiva 11

30 min Playbacks

INVITA A LOS  INTERESADOS Los Playbacks reúnen a los interesados de los distintos niveles y grupos de la organización. También reúnen diversas perspectivas, y promueven una cultura de transparencia e inclusión.

Enterprise Design Thinking Toolkit • 2021 IBM Corporation

**Contenido visual de la lámina:** Fotografía de una presentadora junto a una pantalla con el texto *«Thanks!»*. Encabezado: **Invita a los interesados.**

### Diapositiva 12

30 min Playbacks

CENTRATE EN EL USUARIO Comparte tus observaciones, reflexiones, y avances, contando una historia sobre el usuario. Las historias harán que la audiencia se interese y vea el valor del trabajo.

Enterprise Design Thinking Toolkit • 2021 IBM Corporation

**Contenido visual de la lámina:** Fotografía de un equipo trabajando frente a una pared con notas adhesivas. Encabezado: **Céntrate en el usuario.**

### Diapositiva 13

30 min Playbacks

ESCUCHA EL FEEDBACK Todos los participantes tienen la oportunidad de proporcionar retroalimentación. Toma nota sin juzgar.

Enterprise Design Thinking Toolkit • 2021 IBM Corporation

**Contenido visual de la lámina:** Fotografía de cuatro personas de pie; una toma notas en una libreta. Encabezado: **Escucha el feedback.**

### Diapositiva 14

30 min Playbacks

ESCUCHA EL FEEDBACK

Los Playbacks revelan si el equipo está alineado o desalineado. Si surgen desacuerdos, no entres en pánico. El objetivo no es la perfección, sino la comunicación clara y comprometida.

Enterprise Design Thinking Toolkit • 2021 IBM Corporation

**Contenido visual de la lámina:** Fotografía de una persona presentando una pantalla titulada *Individual Mastery*. Encabezado: **Escucha el feedback.**

### Diapositiva 15

TOOLKIT

Playbacks

Enterprise Design Thinking Toolkit • 2021 IBM Corporation

**Contenido visual de la lámina:** Lámina de cierre del toolkit *Enterprise Design Thinking by IBM — Playbacks* con formas geométricas azules.

---

<a id="capitulo-08"></a>

## 08. Introducción a la Calidad de Software

Fuente del ZIP: `08_Introduccion_a_la_Calidad_de_Software.md`.

### Diapositiva 1

INGENIERÍA DE REQUERIMIENTOS Y ASEGURAMIENTO DE LA CALIDAD Sesión 10: Introducción al control de calidad del desarrollo de software

Prof. Rodrigo Caballero V.

rcaballerov@docente.uss.cl

**Contenido visual de la lámina:** Portada con fotografía de fondo, logo USS, título *Sesión 10: Introducción al control de calidad del desarrollo de software* y datos del profesor.

### Diapositiva 2

#### Contenidos de esta sesión

- Explicación de la importancia del control de calidad en el desarrollo de software

- Definición de términos clave (control de calidad, desarrollo de software, estándares de calidad, etc.)

- Ejemplos de casos en los que la falta de control de calidad ha tenido impactos negativos en el desarrollo de software.

**Contenido visual de la lámina:** Nota adhesiva amarilla: **Resultado de Aprendizaje de la Unidad** — *Aplica diversas normas, modelos y estándares de aseguramiento de la calidad al software y al ciclo de desarrollo, con el fin de asegurar que el software cumpla con los estándares de calidad exigidos en la organización.*

### Diapositiva 3

Introducción al control de calidad del desarrollo de software

¿Cuándo puedes decir que un producto es de buena calidad?

**Contenido visual de la lámina:** Fotografías de cuatro productos (zapatilla, teléfono inteligente, automóvil y audífonos) para la pregunta *¿Cuándo puedes decir que un producto es de buena calidad?*

### Diapositiva 4

¿Y en un software, cuándo se

puede valorar la calidad?

Calidad de

software

**Contenido visual de la lámina:** Ícono de código *</>* y nota adhesiva: *«Quizás puedas estar pensando en atributos como confiabilidad, seguridad, usabilidad, etc. Concepto clave: ATRIBUTO.»*

### Diapositiva 5

La importancia del control de calidad en el desarrollo de software

PRUEBAS

IMPLEMENTACIÓN

PRODUCTO

(Software, Incremento,

CONSTRUCCIÓN

MVP, etc.)

DISEÑO

IDEA (Concepto, necesidad, problemática)

ANÁLISIS

CALIDAD

Pressman (2002) . Fases de la Ingeniería de Software.

**Contenido visual de la lámina:** Flecha curva ascendente (Pressman, 2002, fases de la ingeniería de software) que parte de una **IDEA** (concepto, necesidad, problemática) y recorre **Análisis → Diseño → Construcción → Implementación → Pruebas** hasta el **PRODUCTO** (software, incremento, MVP, etc.). Desde cada fase salen flechas que convergen en la palabra **CALIDAD**. Nota adhesiva: *«Los atributos de calidad se deben tener presente en cada una de las fases del desarrollo de software.»*

### Diapositiva 6

La calidad de software se define como

el grado en el cual el software posee una combinación deseada de atributos.

Tales atributos son requerimientos adicionales del sistema (Kazman et al.,

2001), que hacen referencia a características que éste debe satisfacer,

diferentes a los requerimientos funcionales. Estas características o atributos se conocen con el nombre de

Definición: Calidad de

atributos de calidad, los cuales se definen como las propiedades de un

servicio que presta el sistema a sus

software

usuarios (Barbacci et al. 1995).

**Contenido visual de la lámina:** Ícono de código *</>* junto al texto de definición, con *combinación deseada de atributos*, *requerimientos adicionales* y *atributos de calidad* destacados en color.

### Diapositiva 7

#### Clasificación de atributos de calidad

Observables vía ejecución

- Se determinan del

No observables vía ejecución

comportamiento

- Se establecen durante

el desarrollo

Bass, L., Clements, P., & Kazman, R. (1998). Software Architecture in practice.

**Contenido visual de la lámina:** Dos flechas grandes en sentidos opuestos (Bass, Clements y Kazman, 1998): **Observables vía ejecución** — se determinan del comportamiento. **No observables vía ejecución** — se establecen durante el desarrollo.

### Diapositiva 8

#### Clasificación de atributos de calidad

Observables vía ejecución

- Se determinan del

comportamiento

**Contenido visual de la lámina:** **Tabla 1. Descripción de atributos de calidad observables vía ejecución:**

| Atributo | Descripción |
|---|---|
| Disponibilidad (*Availability*) | Es la medida de disponibilidad del sistema para el uso (Barbacci et al., 1995). |
| Confidencialidad (*Confidentiality*) | Es la ausencia de acceso no autorizado a la información (Barbacci et al., 1995). |
| Funcionalidad (*Functionality*) | Habilidad del sistema para realizar el trabajo para el cual fue concebido (Kazman et al., 2001). |
| Desempeño (*Performance*) | Es el grado en el cual un sistema o componente cumple sus funciones designadas, dentro de ciertas restricciones dadas, como velocidad, exactitud o uso de memoria (IEEE 610.12). Según Smith (1993), se refiere a aspectos temporales del comportamiento del sistema: capacidad de respuesta, tiempo requerido para responder a aspectos específicos o número de eventos procesados en un intervalo de tiempo. Según Bass et al. (1998), se refiere además a la cantidad de comunicación e interacción entre los componentes del sistema. |
| Confiabilidad (*Reliability*) | Es la medida de la habilidad de un sistema a mantenerse operativo a lo largo del tiempo (Barbacci et al., 1995). |
| Seguridad externa (*Safety*) | Ausencia de consecuencias catastróficas en el ambiente; medida de ausencia de errores que generan pérdidas de información (Barbacci et al., 1995). |
| Seguridad interna (*Security*) | Es la medida de la habilidad del sistema para resistir a intentos de uso no autorizados y negación del servicio, mientras se sirve a usuarios legítimos (Kazman et al., 2001). |

### Diapositiva 9

#### Clasificación de atributos de calidad

No observables vía ejecución

- Se establecen

durante el desarrollo

**Contenido visual de la lámina:** **Tabla 2. Descripción de atributos de calidad no observables vía ejecución:**

| Atributo | Descripción |
|---|---|
| Configurabilidad (*Configurability*) | Posibilidad que se otorga a un usuario experto a realizar ciertos cambios al sistema (Bosch et al., 1999). |
| Integrabilidad (*Integrability*) | Es la medida en que trabajan correctamente componentes del sistema que fueron desarrollados separadamente al ser integrados (Bass et al., 1998). |
| Integridad (*Integrity*) | Es la ausencia de alteraciones inapropiadas de la información (Barbacci et al., 1995). |
| Interoperabilidad (*Interoperability*) | Es la medida de la habilidad de que un grupo de partes del sistema trabajen con otro sistema; es un tipo especial de integrabilidad (Bass et al., 1998). |
| Modificabilidad (*Modifiability*) | Es la habilidad de realizar cambios futuros al sistema (Bosch et al., 1999). |
| Mantenibilidad (*Maintainability*) | Es la capacidad de someter a un sistema a reparaciones y evolución (Barbacci et al., 1995); capacidad de modificar el sistema de manera rápida y a bajo costo (Bosch et al., 1999). |
| Portabilidad (*Portability*) | Es la habilidad del sistema para ser ejecutado en diferentes ambientes de computación: hardware, software o una combinación de ambos (Kazman et al., 2001). |
| Reusabilidad (*Reusability*) | Es la capacidad de diseñar un sistema de forma tal que su estructura o parte de sus componentes puedan ser reutilizados en futuras aplicaciones (Bass et al., 1998). |
| Escalabilidad (*Scalability*) | Es el grado con el que se pueden ampliar el diseño arquitectónico, de datos o procedimental (Pressman, 2002). |
| Capacidad de prueba (*Testability*) | Es la medida de la facilidad con la que el software, al ser sometido a una serie de pruebas, puede demostrar sus fallas; la probabilidad de que, asumiendo que tiene al menos una falla, el software fallará en su próxima ejecución de prueba (Bass et al., 1998). |

### Diapositiva 10

Los atributos de calidad se pueden

organizar y descomponer de maneras

diferentes, en lo que se conoce como

modelos de calidad. Los modelos de

calidad de software facilitan el

entendimiento del proceso de la ingeniería

de software (Pressman, 2002).

Modelos de

calidad

**Contenido visual de la lámina:** Portada del libro *Software Engineering: A Practitioner's Approach* (7.ª edición), de Roger S. Pressman.

### Diapositiva 11

#### Principales modelos de calidad

ISO/IEC

McCall Dromey FURPS ISO/IEC

9126

25000

**Contenido visual de la lámina:** Cinco círculos grises superpuestos con los nombres de los modelos: **McCall**, **Dromey**, **FURPS**, **ISO/IEC 9126** e **ISO/IEC 25000**. Las láminas 12 a 15 destacan uno a la vez.

### Diapositiva 12

#### Principales modelos de calidad

Modelo de McCall

ISO/IEC

McCall Dromey FURPS ISO/IEC

9126

25000

Criterios asociados a los factores de calidad

Modelo de McCall (McCall et al.,1977)

**Contenido visual de la lámina:** **Modelo de McCall** (McCall et al., 1977). Criterios asociados a los factores de calidad:

| Factor | Criterios |
|---|---|
| Correctitud | Rastreabilidad, completitud, consistencia |
| Confiabilidad | Consistencia, exactitud, tolerancia a fallas |
| Eficiencia | Eficiencia de ejecución, eficiencia de almacenamiento |
| Integridad | Control de acceso, auditoría de acceso |
| Usabilidad | Operabilidad, entrenamiento, comunicación |
| Mantenibilidad | Simplicidad, concreción |
| Capacidad de prueba | Simplicidad, instrumentación, auto-descriptividad, modularidad |
| Flexibilidad | Auto-descriptividad, capacidad de expansión, generalidad, modularidad |
| Portabilidad | Auto-descriptividad, independencia del sistema, independencia de máquina |
| Reusabilidad | Auto-descriptividad, generalidad, modularidad, independencia del sistema, independencia de máquina |
| Interoperabilidad | Modularidad, similitud de comunicación, similitud de datos |

### Diapositiva 13

#### Principales modelos de calidad

Modelo de Dromey

ISO/IEC

McCall Dromey FURPS ISO/IEC

9126

25000

Relación entre propiedades del producto y atributos de calidad.

Modelo de Dromey (Dromey, 1996).

**Contenido visual de la lámina:** **Modelo de Dromey** (Dromey, 1996). Relación entre propiedades del producto y atributos de calidad:

| Propiedad del producto | Atributos de calidad |
|---|---|
| Correctitud | Funcionalidad, confiabilidad |
| Internas | Mantenibilidad, eficiencia, confiabilidad |
| Contextuales | Mantenibilidad, reusabilidad, portabilidad, confiabilidad |
| Descriptivas | Mantenibilidad, reusabilidad, portabilidad, usabilidad |

### Diapositiva 14

#### Principales modelos de calidad

Modelo FURPS

ISO/IEC

McCall Dromey FURPS ISO/IEC

9126

25000

Atributos de calidad – Modelo FURPS (Pressman, 2002)

**Contenido visual de la lámina:** **Modelo FURPS** (Pressman, 2002):

| Factor de calidad | Atributos |
|---|---|
| Funcionalidad | Características y capacidades del programa; generalidad de las funciones; seguridad del sistema |
| Facilidad de uso | Factores humanos; factores estéticos; consistencia de la interfaz; documentación |
| Confiabilidad | Frecuencia y severidad de las fallas; exactitud de las salidas; tiempo medio de fallos; capacidad de recuperación ante fallas; capacidad de predicción |
| Rendimiento | Velocidad del procesamiento; tiempo de respuesta; consumo de recursos; rendimiento efectivo total; eficacia |
| Capacidad de soporte | Extensibilidad; adaptabilidad; capacidad de pruebas; capacidad de configuración; compatibilidad; requisitos de instalación |

### Diapositiva 15

#### Principales modelos de calidad

Modelo ISO/IEC 9126

ISO/IEC

McCall Dromey FURPS ISO/IEC

9126

25000

**Contenido visual de la lámina:** **Modelo ISO/IEC 9126:**

| Característica | Subcaracterísticas |
|---|---|
| Funcionalidad | Adecuación, exactitud, interoperabilidad, seguridad |
| Confiabilidad | Madurez, tolerancia a fallas, recuperabilidad |
| Usabilidad | Entendibilidad, capacidad de aprendizaje, operabilidad |
| Eficiencia | Comportamiento en tiempo, comportamiento de recursos |
| Mantenibilidad | Analizabilidad, modificabilidad, estabilidad, capacidad de pruebas |
| Portabilidad | Adaptabilidad, instalabilidad, reemplazabilidad |

Nota adhesiva: *«El modelo ISO 25000 lo veremos la próxima semana. ¡Es el más usado en la actualidad!»*

### Diapositiva 16

A menudo se confunde:

Gestión de la calidad

del Proyecto

v/s

Gestión de la calidad

Importante: No confundir

del Producto (Software)

**Contenido visual de la lámina:** Contraposición **Gestión de la calidad del Proyecto** *v/s* **Gestión de la calidad del Producto (Software)**. Nota adhesiva: *«Ambas gestiones impactan tanto en el software final como en el cliente. La gestión de la calidad del proyecto se centra en el quehacer del equipo de desarrollo, mientras que la gestión de calidad del producto se centra en métricas técnicas.»*

### Diapositiva 17

Ejemplos de fallas respecto a la gestión de calidad del proyecto

No entender los

requisitos:

No planificar adecuadamente:

No documentar adecuadamente:

No comunicar adecuadamente:

- Es importante que se

- La planificación es

- La documentación es

- La comunicación es

esencial en cualquier proyecto. • A menudo cometen el

esencial para un proyecto de pruebas exitoso. • A menudo cometen el

esencial para cualquier proyecto de pruebas. • A menudo cometen el

entiendan completamente los requisitos del sistema antes de comenzar a escribir casos de prueba. • Si no se entienden los

error de no planificar adecuadamente, lo que puede llevar a retrasos en el proyecto y a la entrega de un producto de baja calidad.

error de no documentar adecuadamente, lo que puede llevar a confusiones y problemas en el futuro.

error de no comunicar adecuadamente con el equipo de desarrollo y otros miembros del equipo de pruebas, lo que puede llevar a problemas en el proyecto.

requisitos, es probable que se escriban casos de prueba inadecuados o que se pierda algún aspecto importante del sistema.

GeekQA (s.f.). https://geekqa.net/8-errores-comunes-que-cometen-los-testers-cuando-empiezan-en-qa/

**Contenido visual de la lámina:** Cuatro columnas de colores (GeekQA, s.f.): **No entender los requisitos** — es importante entender completamente los requisitos del sistema antes de comenzar a escribir casos de prueba; si no se entienden, es probable que se escriban casos de prueba inadecuados o que se pierda algún aspecto importante del sistema. **No planificar adecuadamente** — la planificación es esencial para un proyecto de pruebas exitoso; a menudo se comete el error de no planificar adecuadamente, lo que puede llevar a retrasos y a la entrega de un producto de baja calidad. **No documentar adecuadamente** — la documentación es esencial para cualquier proyecto de pruebas; no documentar adecuadamente puede llevar a confusiones y problemas en el futuro. **No comunicar adecuadamente** — la comunicación es esencial en cualquier proyecto; no comunicarse adecuadamente con el equipo de desarrollo y otros miembros del equipo de pruebas puede llevar a problemas en el proyecto.

### Diapositiva 18

Ejemplos de fallas respecto a la gestión de calidad del producto

Fallo de Amazon (2014)

El 14 de diciembre de 2014, numerosos compradores encontraron productos en Amazon a precios extremadamente bajos, debido a un error de software que redujo los precios a solo 0,01 libras.

Los vendedores, desesperados, contactaron al servicio de atención al cliente para resolver el problema, ya que sus negocios estaban en riesgo de quiebra. El fallo se debió al software de terceros Repricer Express, que aplicaba precios dinámicos desde una comparación de productos.

Aunque el error solo duró un día, algunas pequeñas empresas perdieron hasta 100,000 libras. Repricer Express se negó a asumir la responsabilidad y no compensó a los afectados. ¿Qué atributo de calidad de software está involucrado en este caso?

QAWERK (s.f.). https://qawerk.es/blog/los-mayores-fallos-en-las-pruebas-de-software/

**Contenido visual de la lámina:** **Fallo de Amazon (2014)** (QAWERK, s.f.), con una ilustración de bolsas de compra y el texto *«£100 mil — amazon»*. El 14 de diciembre de 2014, numerosos compradores encontraron productos en Amazon a precios extremadamente bajos, debido a un error de software que redujo los precios a solo 0,01 libras. Los vendedores contactaron al servicio de atención al cliente, ya que sus negocios estaban en riesgo de quiebra. El fallo se debió al software de terceros **Repricer Express**, que aplicaba precios dinámicos desde una comparación de productos. Aunque el error solo duró un día, algunas pequeñas empresas perdieron hasta 100.000 libras; Repricer Express se negó a asumir la responsabilidad y no compensó a los afectados. Pregunta final: *¿Qué atributo de calidad de software está involucrado en este caso?*

### Diapositiva 19

#### Referencias Bibliográficas

- Barbacci, M., Klein, M., Longstaff, T., & Weinstock, C. (1995). Quality Attributes. Carnegie Mellon University. Technical Report. • Bass, L., Clements, P., & Kazman, R. (1998). Software Architecture in practice. Addison-Wesley. • Bosch, J. (2000). Design & Use of Software Architectures. Addison-Wesley. • Camacho, E., Cardeso, F., & Nuñez, G. (2004). Arquitecturas de Software. Guía de Estudio. • Crosby, P. (1979). Quality is Free. Nueva York: McGraw-Hill. • Dromey, G. (1996). Cornering the Chimera. IEEE Software. Vol 13, Nro. 1. • Grady, R., & Caswell, D. (1987) Software Metrics: Establishing a company-Wide Program. Prentice Hall. • ISO/IEC. (1998). Information Technology – Software Product Quality – Part 1: Quality Model. • Kazman, R., Clements, P., Klein, M. (2001). Evaluating Software Architectures. Methods and case studies. Addison Wesley. • Sommerville, I. (2002). Ingeniería de software, Pearson Educación. • Los mayores fallos en las pruebas de software (s.f.). QWERK. https://qawerk.es/blog/los- mayores-fallos-en-las-pruebas-de-software/ • 8 Errores comunes que cometen los Testers cuando empiezan en QA (s.f). GeekQA. https://geekqa.net/8-errores-comunes-que-cometen-los-testers-cuando-empiezan-en-qa/

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 20

¡Tus consultas son importantes! Espacio para preguntas

**Contenido visual de la lámina:** Lámina de cierre: *¡Tus consultas son importantes! Espacio para preguntas.*

---

<a id="capitulo-09"></a>

## 09. Herramientas para la Calidad de Software

Fuente del ZIP: `09_Herramientas_para_la_Calidad_de_Software.md`.

### Diapositiva 1

INGENIERÍA DE REQUERIMIENTOS Y ASEGURAMIENTO DE LA CALIDAD Herramientas y metodologías para el control de calidad del desarrollo de software

Prof. Rodrigo Caballero V.

rcaballerov@docente.uss.cl

**Contenido visual de la lámina:** Portada con fotografía de fondo, logo USS, título de la sesión y datos del profesor.

### Diapositiva 2

#### Contenidos de esta sesión

- Presentación de distintas herramientas y metodologías utilizadas en el control de calidad del software (pruebas unitarias, pruebas de integración, pruebas funcionales, etc.).

- Análisis de casos de estudio donde se aplicaron estas herramientas y metodologías con éxito.

- Demostración práctica de alguna de las herramientas utilizadas en el control de calidad del desarrollo de software.

**Contenido visual de la lámina:** Nota adhesiva amarilla: **Resultado de Aprendizaje de la Unidad** — *Aplica diversas normas, modelos y estándares de aseguramiento de la calidad al software y al ciclo de desarrollo, con el fin de asegurar que el software cumpla con los estándares de calidad exigidos en la organización.*

### Diapositiva 3

Herramientas y metodologías para el control de calidad del desarrollo de software

ISO/IEC 25000, conocida como SQuaRE (System and

Familia de normas ISO/IEC 25000

Software Quality Requirements and Evaluation), es una

familia de normas que tiene por objetivo la creación de

un marco de trabajo común para evaluar la calidad del

producto software.

La familia ISO/IEC 25000 es el resultado de la evolución

de otras normas anteriores, especialmente de las normas

ISO/IEC 9126, que describe las particularidades de un

modelo de calidad del producto software, e ISO/IEC

14598, que abordaba el proceso de evaluación de

productos software.

**Contenido visual de la lámina:** Diagrama **Familia de normas ISO/IEC 25000** (iso25000.com): un recuadro central **ISO/IEC 2500n — División para gestión de la calidad**, rodeado por cuatro: **ISO/IEC 2501n — División para el modelo de calidad**, **ISO/IEC 2502n — División para la medición de calidad**, **ISO/IEC 2503n — División para los requisitos de calidad** e **ISO/IEC 2504n — División para la evaluación de calidad**.

### Diapositiva 4

#### Atributos de calidad del Modelo ISO/IEC 25010

**Contenido visual de la lámina:** Tabla **CALIDAD DEL PRODUCTO SOFTWARE** (iso25000.com), con nueve características y sus subcaracterísticas:

| Característica | Subcaracterísticas |
|---|---|
| Adecuación funcional | Completitud funcional, corrección funcional, pertinencia funcional |
| Eficiencia de desempeño | Comportamiento temporal, utilización de recursos, capacidad |
| Compatibilidad | Coexistencia, interoperabilidad |
| Capacidad de interacción | Reconocibilidad de adecuación, aprendizabilidad, operabilidad, protección frente a errores de usuario, involucración del usuario, inclusividad, asistencia al usuario, auto-descriptividad |
| Fiabilidad | Ausencia de fallos, disponibilidad, tolerancia a fallos, recuperabilidad |
| Seguridad | Confidencialidad, integridad, no-repudio, responsabilidad, autenticidad, resistencia |
| Mantenibilidad | Modularidad, reusabilidad, analizabilidad, capacidad de ser modificado, capacidad de ser probado |
| Flexibilidad | Adaptabilidad, escalabilidad, instalabilidad, reemplazabilidad |
| Protección | Restricción operativa, identificación de riesgos, protección ante fallos, advertencia de peligro, integración segura |

### Diapositiva 5

#### Atributos de calidad del Modelo ISO/IEC 25010

Actualmente, muchas de las

herramientas de pruebas y

calidad de software, por ejemplo Kiuwan, son basadas

en el modelo ISO/IEC 25010, permitiendo la evaluación de

los atributos de calidad de

forma automatizada vinculando métricas para cuantificar cada una de las

características de calidad.

**Contenido visual de la lámina:** Captura del panel de **Kiuwan** con indicadores: *Risk index* 91,87; *Global indicator* 36,42; *Effort to target* 498 h; gráfico de barras *Current/Target* por característica; gráfico circular por característica (Efficiency, Maintainability, Portability, Reliability, Security); *Lines of code* 30.861; *Files* 338; *Complexity* 93,16; *% Duplicated code* 8,89. Encerrada en rojo, la fila de defectos por característica: *Defects* 6.143; *Maintainability* 2.916; *Security* 214; *Efficiency* 1.162; *Portability* 541; *Reliability* 1.310.

### Diapositiva 6

Herramientas y metodologías para el control de calidad del desarrollo de software

Un vistazo a algunas de las herramientas más utilizadas para el control de

calidad, con métricas en relación a los atributos de calidad

**Contenido visual de la lámina:** Logos de las herramientas: **Kiuwan**, **SonarQube**, **SonarCloud**, **Selenium**, **Locust**, **Apache JMeter** y **Google Lighthouse**.

### Diapositiva 7

Herramientas y metodologías para el control de calidad del desarrollo de software

Solución Software as a Service (SaaS)

de análisis estático de código multitecnología, dedicada a la analítica de las aplicaciones software, así como a

la medición de la calidad y medida de

seguridad de las mismas. Kiuwan es una de las herramientas en la lista de

OWASP de herramientas de análisis

estático del código fuente.​

https://www.kiuwan.com/

**Contenido visual de la lámina:** Captura del panel de defectos de **Kiuwan**: gráficos *Defects by characteristic* (Maintainability, Efficiency, Portability, Reliability), *Defects by language* (Java) y *Defects by priority* (Very High a Very Low); indicadores *87 Violated rules*, *1.227 Defects*, *20 Very high* y *61,93 Quality indicator*; y una tabla de reglas incumplidas (por ejemplo *Cyclomatic complexity*, *Avoid catching NullPointerExceptions*, *Do not use the ternary operator*, *Provide Javadoc comments for public classes*, *Avoid catch blocks with empty bodies*) con su característica, lenguaje y esfuerzo estimado. Enlace: https://www.kiuwan.com/

### Diapositiva 8

Herramientas y metodologías para el control de calidad del desarrollo de software

SonarQube y SonarCloud son un mismo producto, el primero es necesario una instalación previa, mientras

que el segundo es una versión en la nube (SaaS).

Solución para detección de problemas en repositorios

Bitbucket, GitHub o Azure DevOps; con objetivo de inspección continua de la calidad del código. Puedes evaluar con métricas diversos atributos de calidad, con

sugerencias de acción.

https://www.sonarsource.com/products/

**Contenido visual de la lámina:** Logos de **SonarQube** y **SonarCloud** y captura de un *Overview Report* de SonarCloud: *Overall lines of code* 362.439; *Reliability* nota D con 4.023 bugs; *Security* nota D con 17.733 vulnerabilidades y 1.263 hotspots; *Maintainability* nota A con 17.184 *code smells*; *Coverage* 1,2 %; *Duplications* 44,1 %; y una tabla de *Issues by severity*. Enlace: https://www.sonarsource.com/products/

### Diapositiva 9

Herramientas y metodologías para el control de calidad del desarrollo de software

Entorno de pruebas de software para aplicaciones. Provee una herramienta

de grabar/reproducir para crear pruebas sin usar un lenguaje de

scripting para pruebas.

A diferencia de las herramientas anteriores que visibilizan diversos

atributos, el foco de Selenium es fiabilidad y adecuación funcional.

https://www.selenium.dev/

**Contenido visual de la lámina:** Capturas de **Selenium IDE**: un proyecto de pruebas con la lista de comandos grabados (*execute script*, *if*, *else*, *assert*, *control flow*…) y su registro de ejecución con resultados *OK*. Enlace: https://www.selenium.dev/

### Diapositiva 10

Herramientas y metodologías para el control de calidad del desarrollo de software

Esta herramienta nos permite crear escenarios de prueba de

manera rápida y sencilla de

manera programática con python. Además, al ejecutar el escenario tenemos la posibilidad

de acceder a una UI web con

suficiente información para entender qué está pasando con

nuestras pruebas.

https://www.locust.io/

**Contenido visual de la lámina:** Logo de **Locust** y captura de su interfaz web: *Host* http://api.initech.com, *Status RUNNING* con 21.400 usuarios, 6 *workers*, 228,1 RPS y 0 % de fallas. Tabla de estadísticas por endpoint (GET /, /blog, /blog/[post-slug], POST /groups/create, GET y POST /signin, /users/[username], /v1/users/) con *# Requests*, *# Fails*, mediana, percentiles 90 y 99, promedio, mínimo, máximo, tamaño promedio y RPS. Fila *Aggregated*: 24.895 solicitudes, 0 fallas, mediana 34 ms, 228,1 RPS. Enlace: https://www.locust.io/

### Diapositiva 11

Herramientas y metodologías para el control de calidad del desarrollo de software

JMeter es un proyecto de Apache que puede ser utilizado como una

herramienta de prueba de carga para analizar y medir el rendimiento

de una variedad de servicios, con

énfasis en aplicaciones web

Endurance

Stress Testing

Testing

Spike Testing

Volume

Scalability

Testing

Testing

Load Testing

https://jmeter.apache.org/

**Contenido visual de la lámina:** Logo de **Apache JMeter** y captura de su interfaz (Apache JMeter 5.3) con un plan de prueba (*HTTP Request Defaults*, *User Defined Variables*, *HTTP Cookie Manager*, *HTTP Header Manager*, *JMeter Users*, *Home Page*, *Think Time*, *View Results Tree*). Seis botones con tipos de prueba: **Stress Testing, Endurance Testing, Spike Testing, Volume Testing, Scalability Testing y Load Testing**. Enlace: https://jmeter.apache.org/

### Diapositiva 12

Herramientas y metodologías para el control de calidad del desarrollo de software

Herramienta completamente automatizada y de código abierto que

nos ofrece la posibilidad de medir la calidad de una determinada página web,

sea pública o privada. Algo que consigue poniendo a prueba la facilidad de uso y el

rendimiento del sitio que deseemos. Así,

gracias a sus resultados, es más sencillo

establecer en lo que debemos mejorar.

https://chromewebstore.google.com/detail/lighthouse/

blipmdconlkpinefehnmjammfjpmpbjk?hl=es

**Contenido visual de la lámina:** Logo de **Google Lighthouse** y captura de un informe: *Performance* 25, *Accessibility* 85, *Best Practices* 71, *SEO* 100 y *Progressive Web App*; escala de colores 0–49 (rojo), 50–89 (naranjo) y 90–100 (verde); métricas *First Contentful Paint* 3,3 s, *Speed Index* 7,1 s, *Largest Contentful Paint* 6,2 s, *Time to Interactive* 11,7 s, *Total Blocking Time* 2.790 ms y *Cumulative Layout Shift* 0,124.

### Diapositiva 13

#### Casos de éxito aplicando estas herramientas

Telefónica LatAm logró una mejora en la calidad y seguridad de sus aplicaciones que se tradujo en un rendimiento del 20% en producción.

La introducción de Kiuwan en el ciclo de vida del desarrollo de software aumentó la productividad del equipo de desarrollo, todo ello con costos mínimos de inicio y mantenimiento de la plataforma.

Ferrovial pudo mejorar la calidad y seguridad de cada una de sus aplicaciones. El análisis y la integración mejoraron el enfoque de desarrollo.

Puglia Digitale aprovechó los mecanismos de Kiuwan para identificar prácticas de programación deficientes y proporcionar la información necesaria a los desarrolladores para corregir los defectos.

https://www.kiuwan.com/success-stories/

**Contenido visual de la lámina:** Cuatro recuadros con casos de éxito de Kiuwan (https://www.kiuwan.com/success-stories/): **Centrica** — la introducción de Kiuwan en el ciclo de vida del desarrollo de software aumentó la productividad del equipo de desarrollo, con costos mínimos de inicio y mantenimiento. **Telefónica** — Telefónica LatAm logró una mejora en la calidad y seguridad de sus aplicaciones que se tradujo en un rendimiento del 20 % en producción. **Ferrovial** — pudo mejorar la calidad y seguridad de cada una de sus aplicaciones; el análisis y la integración mejoraron el enfoque de desarrollo. **Puglia Digitale** — aprovechó los mecanismos de Kiuwan para identificar prácticas de programación deficientes y proporcionar la información necesaria a los desarrolladores para corregir los defectos.

### Diapositiva 14

Podemos probar Google Lighthouse mediante una extensión en el navegador web Chrome de Google.

Actividad práctica con

1. Instala la extensión en Google Chrome

https://chromewebstore.google.com/detail/lighthouse/ blipmdconlkpinefehnmjammfjpmpbjk?hl=es

Google Lighthouse

2. Abre una página web que quieras auditar

3. Haz clic derecho en la página y selecciona inspeccionar.

**Contenido visual de la lámina:** A la izquierda, logo de Chrome y título *Actividad práctica con Google Lighthouse*. A la derecha, captura de la ficha de la extensión **Lighthouse** en Chrome Web Store (developers.google.com/web, destacada, 4,4 ★, más de 1.000.000 de usuarios, botón *Añadir a Chrome*) y los pasos: 1. Instala la extensión en Google Chrome (https://chromewebstore.google.com/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=es). 2. Abre una página web que quieras auditar. 3. Haz clic derecho en la página y selecciona *Inspeccionar*.

### Diapositiva 15

#### Demostración práctica con Google Lighthouse

4. La función Inspeccionar abrirá un panel DevTools en la

parte derecha de la página web. Selecciona "Lighthouse" en

la barra de herramientas del panel. Si no encuentras la

opción "Lighthouse", haz clic en las dos flechas que hay al

final de la barra de herramientas.

5. Desde aquí, puedes seleccionar una, varias o todas las

categorías, en función de los aspectos de tu web que quieras

analizar. Y haz clic en "Analyze page load". A continuación, la

herramienta generará un informe. Encontrarás las

puntuaciones de la auditoría de cada categoría en la parte

superior.

¡El reporte te sugerirá todas las medidas remediales que se

requieren para mejorar las métricas!

**Contenido visual de la lámina:** Captura de las herramientas para desarrolladores de Chrome con la pestaña **Lighthouse** seleccionada en el menú de pestañas (junto a *Security*, *Recorder*, *Performance insights* y *AdBlock*) y el panel *Generate a Lighthouse report*: botón **Analyze page load**; *Mode*: Navigation (Default), Timespan, Snapshot; *Device*: Mobile o Desktop; *Categories*: Performance, Accessibility, Best practices, SEO y Progressive Web App. Flechas señalan la pestaña Lighthouse y el botón de análisis.

### Diapositiva 16

#### Demostración práctica con Google Lighthouse

Reporte de evaluación

Reporte de evaluación inicial

post remediación v/s

**Contenido visual de la lámina:** Comparación **Reporte de evaluación inicial** *v/s* **Reporte de evaluación post remediación**, con una flecha entre ambos. Inicial: Performance 25, Accessibility 85, Best Practices 71, SEO 100; First Contentful Paint 3,3 s, Speed Index 7,1 s, Largest Contentful Paint 6,2 s, Time to Interactive 11,7 s, Total Blocking Time 2.790 ms, Cumulative Layout Shift 0,124. Posterior: Performance 98, Accessibility 100, Best Practices 93, SEO 100; First Contentful Paint 1,0 s, Speed Index 1,6 s, Time to Interactive 2,0 s, First Meaningful Paint 1,5 s, First CPU Idle 2,4 s, Max Potential First Input Delay 290 ms. Nota adhesiva: *«El objetivo de los reportes generados por las herramientas de pruebas y calidad es contrastar una situación inicial contra una situación posterior a las remediaciones.»*

### Diapositiva 17

#### Referencias Bibliográficas

- Sommerville, I. (2002). Ingeniería de software, Pearson Educación.

- ISO/IEC 25000 (s.f.). https://iso25000.com

- Kiuwan (s.f.). https://www.kiuwan.com

- SonarSource (s.f). https://www.sonarsource.com

- Selenium (s.f.). https://www.selenium.dev

- Locust (s.f.). https://locust.io

- Apache Jmeter (s.f.). https://jmeter.apache.org

- Pol, Tushar (2023). Google Lighthouse: Qué es y Cómo Utilizarlo. https://es.semrush.com/blog/como-utilizar-google-lighthouse/

**Contenido visual de la lámina:** Lámina de texto, sin imágenes con contenido adicional.

### Diapositiva 18

¡Tus consultas son importantes! Espacio para preguntas

**Contenido visual de la lámina:** Lámina de cierre: *¡Tus consultas son importantes! Espacio para preguntas.*
