# Framework de Ingeniería de Software

**Guía de trabajo reutilizable para proyectos de software**  
**Base académica:** asignatura *Taller de Ingeniería de Software*, Universidad San Sebastián (USS).  
**Material docente:** Prof. Dr. Rodrigo Correa R. (portadas de las semanas 1 a 7); Alfredo Pereira aparece en el texto de la portada de la semana 6.  
**Edición del framework:** noviembre de 2026.  
**Cobertura:** contenidos prácticos seleccionados de las semanas 1 a 7.

> **Propósito.** Transformar clases de Ingeniería de Software en un procedimiento independiente, utilizable para planificar, modelar, diseñar, construir, verificar, documentar, entregar y evolucionar un sistema. El objetivo **no** es reproducir diapositivas ni exigir todos los métodos a todos los equipos: se explica qué hacer, **cuándo elegir una opción**, qué resultado producir y cómo comprobarlo. Las listas de verificación, plantillas y «puertas de salida» son una **propuesta de organización práctica** de los temas enseñados, no una metodología oficial obligatoria de la USS.

**Auditoría:** contrastado lámina por lámina con los PDF oficiales de las semanas 1 a 7 el 23 de noviembre de 2026. Cada sección indica su **fuente** como «S semana-lámina» (por ejemplo, S6-37 = semana 6, lámina 37); lo que no sale de una lámina se marca como *criterio del framework*. La transcripción citable del material está en [ingenieria-de-software.md](ingenieria-de-software.md).

**Regla de uso:** el tamaño del proyecto no decide por sí solo cuánta disciplina necesita. La documentación, la revisión y las pruebas se ajustan a incertidumbre, impacto de fallos, complejidad, tamaño del equipo y obligaciones del contexto. No se debe presentar una suposición como hecho ni una estimación como compromiso garantizado.

---

## 0. Mapa del framework y cómo usarlo

*Fuente: criterio del framework; roles de 0.4 a partir de S1-5 y S1-6.*

### 0.1. Flujo principal

```text
[Problema o necesidad]
      ↓
[1] Entender el contexto, definir objetivos y acordar alcance inicial
      ↓
[2] Elegir enfoque y forma de organizar el trabajo
      ↓
[3] Modelar actores, comportamientos, datos e interacciones necesarios
      ↓
[4] Diseñar estructura técnica, componentes, interfaces y despliegue
      ↓
[5] Preparar y ejecutar la construcción por unidades verificables
      ↓
[6] Verificar, validar y registrar evidencia de calidad
      ↓
[7] Documentar, integrar, desplegar y entregar
      ↓
[8] Operar, mantener, evolucionar y controlar cambios

En paralelo:
[9] Estimar tamaño y trabajo → [10] Planificar esfuerzo, duración,
recursos y costo → Reestimar ante cambios y aprendizaje

En cada transición:
[Decisión documentada] → [Entregable revisado] → [Criterio de salida]
                       ↖──── Retroalimentación ────↙
```

**Importante:** el diagrama describe dependencias conceptuales, **no obliga a ejecutar una cascada**. En enfoques incrementales se repiten análisis, diseño, construcción y pruebas para cada incremento. Algunas decisiones se adelantan o se revisan si aumenta el riesgo. La calidad, el registro de decisiones y la estimación acompañan todo el proyecto.

### 0.2. Qué guía a cada pregunta

| Si la pregunta es… | Consulta este apartado | Resultado esperado |
|---|---|---|
| ¿Qué problema resolver y para quién? | 1 | Objetivos, requisitos de entrada, supuestos y alcance |
| ¿Usamos cascada, RAD, RUP/AUP o Scrum? | 2 | Decisión de enfoque justificada |
| ¿Qué diagrama o representación necesitamos? | 3 | Modelos adecuados y comprobados |
| ¿Cómo organizamos módulos, datos y comunicación? | 4 | Diseño, contratos y decisiones técnicas |
| ¿Cómo construiremos sin perder control? | 5 | Unidades de trabajo e integración reproducible |
| ¿Qué debemos probar y con qué evidencia? | 6 | Estrategia de QA, casos de prueba y resultados |
| ¿Qué documentamos y cuándo entregamos? | 7 | Documentación mínima útil y entrega verificable |
| ¿Cómo gestionamos modificaciones posteriores? | 8 | Clasificación de mantenimiento, impacto y cambio |
| ¿Qué estamos estimando realmente? | 9 | Tamaño, esfuerzo, duración, recursos y costo diferenciados |
| ¿Cómo estimamos con poca información? | 10 | Rango por descomposición, analogía o juicio experto |
| ¿Cuándo sirve LOC o PF? | 11 | Medición de tamaño con método declarado |
| ¿Cómo usar COCOMO 81 básico? | 12 | PM, duración y dotación con cálculos reproducibles |
| ¿Cómo convertir cifras en plan y presupuesto? | 13 | Capacidad, cronograma, escenarios y costo |
| ¿Qué plantillas puedo copiar? | 16 | Artefactos reutilizables |

### 0.3. Niveles de aplicación

| Característica | Mínimo para iniciativa pequeña | Ampliación para proyecto grande, crítico o regulado |
|---|---|---|
| Definición | Problema, alcance, usuarios y criterios clave | Línea base de requisitos, restricciones y autorizaciones |
| Modelado | Solo los modelos que resuelvan dudas concretas | Vistas complementarias, revisión formal y trazabilidad |
| Diseño | Componentes principales, contratos, datos y decisiones | Riesgos, despliegue detallado, escenarios operacionales |
| Desarrollo | Unidades pequeñas, revisión e integración | Controles de cambios y validación independiente cuando proceda |
| Calidad | Casos críticos y evidencia de resultados | Cobertura trazable, pruebas automatizadas y criterios cuantitativos |
| Estimación | Supuestos, rango y descomposición inicial | Técnicas combinadas, escenarios, sensibilidad y calibración histórica |
| Entrega | Instrucciones de ejecución, pruebas y cambios | Operación, recuperación, soporte, versiones y auditoría |

**Regla para simplificar:** eliminar una actividad porque no aporta valor es válido; eliminar una comprobación necesaria porque el proyecto «es pequeño» no lo es.

### 0.4. Responsabilidades

| Rol o función | Decisión o responsabilidad principal |
|---|---|
| Cliente / dueño de necesidad | Explica problema y valor esperado; confirma resultados de negocio |
| Responsable de requisitos / análisis | Obtiene información, especifica necesidades, gestiona dudas |
| Responsable de arquitectura / diseño | Define organización técnica, alternativas y restricciones |
| Desarrollo | Implementa comportamiento, prueba unidades, integra y corrige |
| QA / pruebas | Define verificaciones, ejecuta pruebas y conserva evidencia |
| Operaciones / DevOps | Prepara despliegue, automatización, monitoreo y recuperación |
| Responsable de producto / prioridades | Decide qué entregar primero conforme al valor y los riesgos |
| Responsable del proceso / facilitación | Desbloquea coordinación y promueve revisión de trabajo |
| Usuarios finales | Prueban flujos relevantes y entregan retroalimentación |

Una persona puede cumplir varios roles. **No confundir rol con cargo:** lo importante es que no quede una responsabilidad crítica sin dueño.

### 0.5. Registros transversales

Mantener durante todo el proyecto:

- **Decisiones:** problema, opciones consideradas, elección, razón, responsables, fecha y condiciones de revisión.
- **Supuestos:** qué creemos, por qué, impacto si es falso y cómo lo validaremos.
- **Riesgos:** evento, probabilidad estimada, impacto, señales y respuesta.
- **Trabajo pendiente:** responsable, dependencia, prioridad, estado, evidencia de cierre.
- **Trazabilidad:** necesidad → requisito → diseño o componente → prueba → resultado.
- **Estimaciones:** versión, unidad, fórmula o técnica, fuentes, exclusiones, incertidumbre y fecha.

---

## 1. Comprender el problema y delimitar el proyecto

*Fuente: semana 1, láminas 4–39.*

**Objetivo:** evitar iniciar la programación sin saber qué problema se resuelve, quién será beneficiado y qué condiciones definen el éxito.

### 1.1. Secuencia de trabajo

1. Obtener la solicitud original sin asumir que la solución sugerida es obligatoria.
2. Identificar quién presenta la necesidad, quién utilizará el producto, quién aprueba y quién lo operará.
3. Definir **problema actual**, **resultado esperado** y **evidencia disponible** por separado.
4. Reconocer restricciones: legales, técnicas, de seguridad, integraciones, tiempo, presupuesto, competencias y disponibilidad.
5. Describir qué queda **dentro** y **fuera** del alcance inicial.
6. Convertir objetivos en requisitos de negocio, requisitos funcionales y no funcionales verificables.
7. Identificar incertidumbres que requieren entrevistas, observación, prototipos o pruebas tempranas.
8. Validar una primera comprensión con quienes tienen autoridad y con usuarios afectados.

### 1.2. Tipos de necesidad que no deben confundirse

| Tipo | Pregunta | Ejemplo genérico |
|---|---|---|
| Necesidad de negocio | ¿Para qué se necesita el sistema? | Reducir el tiempo de tramitación de solicitudes |
| Requisito funcional | ¿Qué comportamiento debe tener? | Registrar y consultar solicitudes |
| Requisito no funcional | ¿Cómo debe comportarse o qué restricción cumplir? | Responder consultas bajo un umbral medible |
| Regla de negocio | ¿Qué condición organizacional rige el comportamiento? | Solo un responsable autorizado aprueba una solicitud |
| Restricción de proyecto | ¿Bajo qué límite se debe trabajar? | Integración con un servicio existente y fecha de disponibilidad |
| Supuesto | ¿Qué afirmamos sin suficiente evidencia todavía? | Se supone que todos los usuarios tienen conexión estable |

**Un buen requisito** (S1-31) es claro, completo, consistente, verificable, factible, necesario, trazable, no ambiguo y priorizado. Ejemplo de la clase (S1-32): «El sistema debe ser rápido» es un mal requisito; uno bueno es «El sistema deberá responder a cualquier consulta en menos de 2 segundos para el 95 % de las solicitudes realizadas simultáneamente por hasta 500 usuarios». S1-34 y S1-35 agregan errores frecuentes y pares deficiente/correcto (seguridad, facilidad de uso, notificaciones).

**Ejemplo de transformación:** «El sistema debe ser rápido» es impreciso. Definir la operación, volumen de datos, entorno, umbral y percentil o criterio de medición permite luego ejecutar una prueba. No inventes el umbral: acordarlo con el interesado correspondiente.

### 1.3. Elegir cómo aclarar una necesidad

| Situación | Técnica inicial | Comprobación |
|---|---|---|
| No está claro el objetivo real | Entrevista con decisores y usuarios | Problema formulado y validado |
| Se desconoce cómo funciona el trabajo actual | Observación y análisis de proceso | Flujo actual consistente con evidencia |
| Usuarios describen funciones contradictorias | Taller de consenso | Conflicto resuelto o registrado |
| La experiencia/interfaz cuesta explicar | Wireframe o prototipo | Observaciones de usuarios y cambios documentados |
| El sistema se integra con otros | Revisión de contratos y responsables técnicos | Lista de dependencias y límites |
| Se pide precio/plazo sin detalle | Preguntas sobre alcance y estimación preliminar por rangos | Incertidumbre visible; **no** cotización definitiva |

### 1.4. Puerta de salida 1

- [ ] Problema y objetivos definidos sin confundir problema con solución.
- [ ] Usuarios, partes interesadas y personas que autorizan identificados.
- [ ] Funciones, cualidades, reglas y restricciones diferenciadas.
- [ ] Hay una lista de incertidumbres, exclusiones y decisiones pendientes.
- [ ] Existe información suficiente para seleccionar un enfoque; lo desconocido se declara.

**Entregable:** ficha de contexto y alcance inicial. Para un tratamiento exhaustivo de ingeniería de requisitos puede emplearse el [framework complementario de Requerimientos y Calidad](framework-requerimientos-calidad.md), pero este documento también contiene los mínimos para comenzar.

---

## 2. Elegir cómo organizar el desarrollo

*Fuente: semana 4, láminas 17–81.*

**Pregunta:** ¿se puede definir gran parte de la solución desde el inicio o se necesita aprender mediante entregas frecuentes? La respuesta debe considerar riesgos, cambios, tamaño del sistema, necesidad de aprobación y capacidad de obtener feedback.

### 2.1. Distinguir conceptos

- **Ciclo de vida (SDLC):** conjunto de actividades por las que pasa un sistema, desde necesidad y análisis hasta diseño, construcción, pruebas, despliegue y evolución.
- **Modelo de proceso:** estructura del ciclo y relaciones entre fases, como cascada o modelos iterativos.
- **Metodología/proceso de trabajo:** actividades, roles, artefactos y reglas que orientan la ejecución, como RUP o AUP.
- **Enfoque:** orientación general para gestionar incertidumbre, por ejemplo predictivo o adaptativo.
- **Marco de trabajo:** estructura de responsabilidades, eventos y artefactos que un equipo utiliza, como Scrum.

**No son sinónimos.** Se puede ser iterativo en el desarrollo y seguir una arquitectura deliberada; se puede usar Scrum sin renunciar a documentación o pruebas formales.

### 2.2. Matriz de selección

| Opción de las clases | Elegirla cuando… | Patrón de trabajo | Precaución principal |
|---|---|---|---|
| **Cascada / desarrollo estructurado** | Requisitos relativamente estables, aprobación definida por fases, dependencias secuenciales | Analizar → diseñar → construir → verificar → entregar | Corregir cambios tarde puede ser costoso; prever control de cambios |
| **RAD** | Se requieren resultados tempranos, usuarios disponibles, solución modular y prototipado factible | Prototipar → recibir comentarios → construir incrementos rápidos | Evitar velocidad aparente sin diseño ni integración cuidadosa |
| **RUP** | Complejidad o riesgos de arquitectura relevantes; se necesitan artefactos y disciplina de fases | Inicio → elaboración → construcción → transición; con iteraciones dentro de fases | No confundir sus fases con una cascada rígida |
| **AUP** | Se desea rigor iterativo inspirado en RUP, con menos ceremonia y documentación | Iteraciones con artefactos esenciales | Simplificar no significa abandonar trazabilidad ni QA |
| **Scrum** | Trabajo complejo con cambio frecuente, feedback regular y un producto evolucionable | Sprints de un mes o menos; inspección y adaptación | No es una receta automática ni elimina planificación técnica |

**Iterativo no es incremental:** una iteración revisa o mejora algo; un incremento añade capacidad utilizable. Un proyecto puede realizar ambas cosas.

### 2.3. Preguntas para la selección

1. ¿Qué proporción del alcance está confirmada y qué partes cambiarán probablemente?
2. ¿Hay usuarios capaces de revisar cada entrega y tomar decisiones?
3. ¿El valor puede entregarse por funcionalidades parciales?
4. ¿Existen riesgos tecnológicos que deben reducirse antes de construir todo?
5. ¿Hay requisitos de aprobación, seguridad o trazabilidad estrictos?
6. ¿Las dependencias entre áreas permiten trabajar en paralelo?
7. ¿Qué evidencia obligatoria exige el cliente, contrato o regulador?

**Comparación de la clase** (S4-81, más estrellas = más adecuado):

| Criterio | Cascada | RAD | RUP/AUP | Scrum |
|---|---|---|---|---|
| Requerimientos estables | ★★★ | ★★ | ★★★ | ★★ |
| Cambios frecuentes | ★ | ★★★ | ★★ | ★★★ |
| Entregas frecuentes | ★ | ★★★ | ★★ | ★★★ |
| Formalidad / trazabilidad | ★★★ | ★ | ★★★ | ★★ |
| Participación frecuente del cliente | ★ | ★★★ | ★★ | ★★★ |
| Gestión de incertidumbre | ★ | ★★ | ★★ | ★★★ |
| Desarrollo iterativo | Baja | Alta | Alta | Alta |

**Decisión práctica** *(criterio del framework, no de la lámina)*:

```text
¿Necesidad y alcance estables, revisiones formales imprescindibles?
    ├─ Sí → Evaluar cascada / proceso predictivo con control de cambios.
    └─ No
        ¿Usuarios disponibles y necesidad de prototipos rápidos?
          ├─ Sí → Evaluar RAD y entregas por incrementos.
          └─ No
             ¿Alto riesgo arquitectónico y disciplina técnica formal?
               ├─ Sí → Evaluar RUP o AUP según formalidad necesaria.
               └─ No
                  ¿Producto evolutivo con revisión periódica real?
                    ├─ Sí → Evaluar Scrum.
                    └─ No → Definir combinación específica y revisar riesgos.
```

Este árbol es **orientativo**: no representa condiciones necesarias y suficientes. Es válido combinar descubrimiento por prototipos, iteraciones de arquitectura y prácticas de integración continua con distintos modelos.

### 2.4. Si se elige Scrum: operacionalizarlo correctamente

**Equipo Scrum (un equipo, tres responsabilidades):**

- **Product Owner:** maximiza valor, define/comunica Product Goal y ordena Product Backlog.
- **Scrum Master:** facilita la comprensión y aplicación de Scrum, la efectividad del equipo y remoción de impedimentos organizativos.
- **Developers:** planifican y ejecutan el trabajo técnico que crea un incremento conforme a la Definition of Done; se responsabilizan de la calidad de su trabajo.

**Artefacto y compromiso:**

| Artefacto | Compromiso asociado | Qué debe contener o permitir |
|---|---|---|
| Product Backlog | Product Goal | Trabajo transparente y ordenado orientado al objetivo |
| Sprint Backlog | Sprint Goal | Objetivo del sprint, elementos seleccionados y plan de ejecución |
| Increment | Definition of Done | Trabajo integrado que satisface criterios comunes de calidad |

**Eventos:** Sprint (contenedor de un mes o menos); Sprint Planning (por qué, qué y cómo); Daily Scrum (inspeccionar avance y adaptar plan hacia Sprint Goal); Sprint Review (inspeccionar el producto con interesados y ajustar rumbo); Sprint Retrospective (mejorar forma de trabajo y calidad).

```text
Product Goal y Product Backlog
   → Sprint Planning → Sprint Goal + Sprint Backlog
   → Trabajo / integración / Daily Scrum
   → Incremento conforme a Definition of Done
   → Sprint Review (producto y feedback)
   → Sprint Retrospective (mejora del equipo)
   ↺ Nueva planificación con backlog actualizado
```

**Reglas de protección:** durante el sprint no introducir cambios que pongan en riesgo el Sprint Goal; no reducir deliberadamente la calidad acordada; el Product Backlog puede evolucionar. **Review ≠ Retrospective:** la primera trata del producto y resultados, la segunda del modo de trabajar. Un incremento no está «Done» solo por haberse escrito el código.

### 2.5. Salida de la selección

Registrar: enfoque elegido, por qué, riesgos, grado de documentación, periodicidad de revisión, política de aceptación y cuándo reconsiderar la decisión.

**Puerta de salida 2:** el equipo sabe cómo prioriza, quién toma decisiones, cómo revisa entregas y cómo maneja cambios; no se exige haber diseñado cada pantalla.

---

## 3. Modelar antes de construir: elegir la representación correcta

*Fuente: semana 2, láminas 4–52.*

**Objetivo:** resolver preguntas del sistema con el modelo más sencillo que permita una decisión técnica o funcional válida. Un diagrama no debe existir solo por completar una colección.

### 3.1. Pregunta → modelo → validación

| Pregunta que debes responder | Modelo / representación | Qué verificar con él |
|---|---|---|
| ¿Quién usa el sistema y para qué? | Casos de uso UML | Actores externos, objetivos y límites del sistema |
| ¿En qué orden ocurren las actividades? | Actividades UML o BPMN | Decisiones, excepciones, responsables y fin del flujo |
| ¿Qué objetos o conceptos maneja el sistema? | Clases UML / modelo conceptual | Entidades, asociaciones, cardinalidades y responsabilidades |
| ¿Qué intercambios suceden en el tiempo? | Secuencia UML | Mensajes, orden, errores y responsabilidades entre participantes |
| ¿Cómo cambia de situación un elemento? | Estados UML | Estados válidos, transiciones, eventos y restricciones |
| ¿Qué partes técnicas integran el producto? | Componentes UML | Límites, interfaces y dependencias |
| ¿En qué infraestructura se ejecutará? | Despliegue UML | Nodos, conexiones, servicios y ubicación de datos |
| ¿Cómo se organiza una pantalla? | Wireframe | Distribución y jerarquía, sin fijar diseño visual |
| ¿Cómo será su apariencia? | Mockup | Presentación y legibilidad |
| ¿Puede el usuario completar una tarea? | Prototipo interactivo | Flujo real, feedback y dudas antes de implementar |

**BPMN** se orienta a procesos de negocio y responsabilidades. **UML** se orienta a diferentes vistas de un sistema. Ninguno de los dos reemplaza todos los demás modelos.

### 3.2. Casos de uso: construir una vista funcional

1. Define el **límite del sistema** y sitúa dentro los objetivos que ofrece.
2. Enumera **actores externos** (persona, rol u otro sistema que interactúa), no tablas ni mecanismos de almacenamiento internos.
3. Redacta los casos de uso como **verbo + objetivo de valor**: «Consultar solicitud», «Registrar pago»; evita «Guardar variable».
4. Conecta cada actor solo con los casos de uso en que interviene.
5. Añade relaciones especiales **solo si aclaran** el comportamiento:
   - `<<include>>`: comportamiento reutilizado y obligatorio como parte del caso base.
   - `<<extend>>`: comportamiento adicional sujeto a condición o punto de extensión.
6. Comprueba escenarios normal, alternativos y de error en texto.
7. Valida que cada caso de uso corresponda a una necesidad y no duplique otro caso.

**Esquema textual:**

```text
Actor: Solicitante
  ├── Presentar solicitud
  │      └── <<include>> Validar datos mínimos
  ├── Consultar estado
  └── Adjuntar antecedentes (puede extender la presentación
                                  si el tipo de solicitud lo permite)
Actor: Responsable
  └── Resolver solicitud
```

**Precisión:** las relaciones formales UML tienen una dirección y semántica definidas; el esquema de texto anterior resume la conducta y **no pretende representar la notación gráfica exacta**. El hecho de que una acción sea frecuente u opcional no demuestra por sí solo que se deba usar `include` o `extend`; elegirlo solo cuando exista relación real entre casos de uso.

### 3.3. Diagramas de actividad o BPMN: describir un proceso

```text
Inicio → Recibir solicitud
           ↓
      ¿Datos completos?
       ├─ No → Solicitar corrección → Recibir corrección ─┐
       └─ Sí                                             │
           ↓                                             │
      Evaluar solicitud ←─────────────────────────────────┘
           ↓
      ¿Se aprueba?
       ├─ Sí → Notificar aprobación → Fin
       └─ No → Notificar rechazo → Fin
```

Registrar al menos: evento de inicio; tareas; bifurcaciones y condiciones; responsables; mensajes o sistemas externos; estados finales; excepciones relevantes. Si hay varios departamentos o participantes, BPMN con pools y lanes puede aclarar responsabilidades. No confundir un flujo visual con reglas de negocio ya validadas.

### 3.4. Diagrama de clases: estructura del dominio

Describir para cada clase o entidad: nombre, responsabilidad, atributos relevantes, relaciones y multiplicidades; distinguir **conceptos de negocio** de componentes de infraestructura. Ejemplo:

```text
Usuario (1) ─── (0..*) Solicitud
Solicitud (1) ─── (0..*) EventoDeSeguimiento
Solicitud (0..1) ─── (1) Resolución
```

Las multiplicidades son **supuestos del ejemplo**: deben derivarse de reglas confirmadas. Revisar duplicación, responsabilidad por cambios de estado y consistencia de asociaciones.

### 3.5. Secuencia: comportamiento distribuido

```text
Usuario → Interfaz: enviar solicitud
Interfaz → Servicio: registrar(datos)
Servicio → Repositorio: guardar(solicitud)
Repositorio → Servicio: identificador / error
Servicio → Interfaz: confirmación / motivo de rechazo
Interfaz → Usuario: resultado observable
```

Añadir ramificaciones cuando existan autorización fallida, indisponibilidad de integración o validación de datos. No implicar que cada componente deba ser una tecnología o proceso independiente: un diagrama de secuencia representa interacciones lógicas.

### 3.6. Estados, componentes y despliegue

**Estados:** enumerar estados válidos (`borrador → enviada → en revisión → aprobada/rechazada`), eventos, quién puede producirlos, precondiciones y transiciones prohibidas. **Componentes:** identificar módulos, funciones responsables, servicios y contratos; comprobar dependencias cíclicas. **Despliegue:** ubicar aplicación, datos, servicios externos y conexiones; discutir disponibilidad, acceso y recuperación.

### 3.7. Errores comunes y revisión del modelo

- **Exceso de modelos:** muchos diagramas redundantes y ninguno usado para decidir.
- **Mezclar niveles:** dibujar una tabla SQL en vez de un caso de uso de usuario.
- **Olvidar límites:** agregar un servicio externo como si fuese responsabilidad del sistema propio.
- **Omitir excepciones:** documentar solo flujo exitoso.
- **Desincronización:** el modelo describe una versión diferente del producto.
- **Falsa precisión:** presentar como aprobado un diagrama hecho con suposiciones.

**Puerta de salida 3:** los modelos elegidos responden preguntas reales; sus relaciones, reglas y dependencias se verificaron con participantes pertinentes y se conservaron los supuestos no resueltos.

---
## 4. Diseñar la solución técnica

*Fuente: semana 2, láminas 53–63; el registro de decisiones (4.4) es criterio del framework.*

**Entrada:** requisitos suficientemente claros, restricciones, riesgos y modelos revisados.  
**Objetivo:** transformar el comportamiento esperado en decisiones de construcción comprensibles para el equipo.  
**Salida:** diseño técnico trazable, contratos, responsabilidades, dependencias y decisiones registradas.

### 4.1. Orden sugerido

1. Identificar escenarios que dominarán la arquitectura: operación más frecuente, proceso crítico, carga máxima, fallos esperables y requisitos de seguridad.
2. Separar responsabilidades: interfaz/experiencia, lógica de negocio, persistencia, integraciones y operación, según corresponda.
3. Identificar datos y reglas de consistencia: quién los crea, modifica, consulta, protege y elimina.
4. Definir componentes y sus contratos: entradas, salidas, errores, autenticación y dependencias.
5. Elegir la arquitectura más sencilla que satisfaga restricciones **demostradas**.
6. Revisar riesgos y puntos débiles con escenarios concretos.
7. Trazar componentes y decisiones hasta los requisitos o restricciones que los justifican.
8. Confirmar qué decisiones son reversibles y cuáles resultarán costosas de cambiar.

### 4.2. Elecciones técnicas que deben justificarse

| Elección | Preguntas mínimas | Evidencia de decisión |
|---|---|---|
| Componentes y módulos | ¿Qué responsabilidad tiene cada uno? ¿Qué dependencias introduce? | Vista de componentes y contratos |
| Comunicación | ¿Síncrona o asíncrona? ¿Qué pasa ante error, retraso o duplicado? | Especificación de mensajes y fallos |
| Persistencia | ¿Qué entidades, relaciones, volumen, integridad y acceso se requieren? | Modelo de datos, reglas y restricciones |
| Interfaz | ¿Quién ejecuta cada tarea y en qué dispositivo? | Wireframes/prototipo revisado |
| Autenticación y autorización | ¿Quién es el usuario? ¿Qué puede hacer? ¿Qué información debe protegerse? | Matriz de permisos y escenarios negativos |
| Despliegue | ¿Dónde se ejecuta? ¿Qué necesita para operar? | Esquema textual de entornos, dependencias y configuración |
| Observabilidad | ¿Cómo se detecta un fallo y se reconstruye qué pasó? | Registro previsto de eventos, métricas y alertas pertinentes |
| Recuperación | ¿Qué se pierde o detiene si falla un componente? | Supuestos de respaldo, restauración y continuidad |

No hay una tecnología obligatoria derivada de las clases. Las preguntas anteriores convierten el énfasis docente en **diseñar antes de escribir código** en decisiones verificables.

### 4.3. Ejemplo de límites de componentes (texto, no imagen)

```text
[Cliente / interfaz]
       |
       v
[Aplicación / reglas de negocio]
       |                \
       v                 v
[Repositorio de datos]  [Servicio externo]

Responsabilidades:
- Interfaz: capturar acciones, presentar resultados, mostrar errores.
- Aplicación: validar reglas, comprobar permisos, coordinar operaciones.
- Repositorio: almacenar y consultar información con integridad.
- Servicio externo: funcionalidad ajena, sujeta a contrato y disponibilidad.
```

Es una **separación conceptual**, no una prescripción de microservicios, máquinas distintas, ni una obligación de usar cuatro capas.

### 4.4. Registrar decisiones con alternativas

*(criterio del framework, no de la lámina)*

Cada decisión de diseño debe poder responder: **¿por qué esta solución y no otra?** Esquema mínimo:

```text
DECISIÓN TÉCNICA
ID: ADR-001
Contexto: [situación y requisito relacionado]
Opciones: [A, B, C]
Criterios: [seguridad, esfuerzo, rendimiento, operación, dependencia]
Elección: [opción]
Razón y datos: [evidencia disponible]
Consecuencias: [beneficios, costos, límites]
Supuestos por verificar: [lista]
Estado: propuesta / aceptada / reemplazada
Responsable, fecha, versión: [...] 
```

### 4.5. Revisar calidad del diseño antes de construir

- [ ] Cada componente tiene una responsabilidad explicable.
- [ ] Las dependencias externas y su manejo de fallos están definidos.
- [ ] Las reglas y los datos sensibles tienen controles previstos.
- [ ] Los flujos normales y excepcionales pueden recorrerse en los modelos.
- [ ] El diseño explica sus decisiones importantes, no solo su estructura.
- [ ] Se distingue entre condiciones verificadas y decisiones todavía hipotéticas.
- [ ] Existe una estrategia para comprobar los atributos no funcionales críticos.

**Puerta de salida 4:** se puede comenzar una unidad de implementación sin inventar su comportamiento, contratos o principales condiciones de falla.

---

## 5. Preparar y ejecutar la construcción

*Fuente: criterio del framework, con apoyo de S4-68 a S4-70 (Definition of Done e incremento).*

### 5.1. Convertir modelos en trabajo implementable

1. Seleccionar una capacidad de valor y sus criterios de aceptación.
2. Identificar los componentes, contratos y datos que requiere.
3. Dividir el trabajo en unidades que puedan construirse e integrarse sin perder visibilidad del resultado.
4. Definir prueba o comprobación antes de considerar la unidad terminada.
5. Planificar integración con las partes dependientes y datos de prueba.
6. Implementar, revisar, probar y registrar evidencia.
7. Integrar con la versión vigente y ejecutar pruebas afectadas.
8. Actualizar modelos, decisiones y documentación si la implementación cambió el diseño.

### 5.2. Unidades de trabajo: buenas y malas divisiones

| División | Ventaja | Riesgo |
|---|---|---|
| Por capacidad de usuario (por ejemplo, registrar solicitud completa) | Permite demostrar valor integrado | Puede cruzar varios módulos; requiere coordinación |
| Por componente técnico (interfaz, datos, servicio) | Aclara responsabilidad especializada | Si nunca se integra, no demuestra valor funcional |
| Por riesgo (por ejemplo, validar una integración desconocida) | Reduce incertidumbre temprana | Puede crear prototipos que aún no cumplen calidad de producto |
| Por pantalla aislada | Fácil de visualizar | Una pantalla terminada sin servicios puede dar falsa sensación de avance |

**Criterio:** favorecer cortes que permitan comprobar algo real; para trabajo técnico transversal, explicitar la capacidad o riesgo que habilita.

### 5.3. Condiciones recomendadas de entrada y salida

**Entrada de una unidad:** objetivo, requisitos relacionados, criterios claros, dependencias identificadas y diseño suficiente. **Salida:** implementación integrada, revisión realizada, pruebas relevantes ejecutadas, defectos críticos tratados y documentación pertinente actualizada.

No hay que llamar «terminado» a algo que solo funciona en el equipo de un desarrollador. Evitar que la integración sea una fase sorpresiva al final.

### 5.4. Controles prácticos de implementación

| Riesgo | Control de trabajo |
|---|---|
| Programar una interpretación distinta del requisito | Revisar criterios y escenarios antes de implementar |
| Duplicar reglas en varios componentes | Definir propietario de la regla y revisar interfaces |
| Generar defectos al integrar | Integrar con frecuencia y probar contratos |
| Romper una función existente | Mantener pruebas de regresión de los flujos afectados |
| Dejar cambios incomprensibles | Registrar intención, contexto y decisiones importantes |
| Exponer credenciales o datos | Revisar permisos, almacenamiento seguro y configuración por entorno |
| Perder la capacidad de desplegar | Automatizar pasos repetibles y conservar instrucciones verificadas |

**Puerta de salida 5:** el trabajo puede ejecutarse en un entorno de comprobación, cumple sus criterios acordados y tiene evidencia de integración.

---

## 6. Aseguramiento de calidad (QA), verificación y validación

*Fuente: semana 3, láminas 4–52; S1-15.*

**Principio de las clases:** la calidad no es una revisión al final ni responsabilidad exclusiva de QA. Debe prevenir defectos desde requisitos y diseño, detectar fallas durante construcción y validar valor con quienes usarán el software.

### 6.1. Diferenciar tres actividades

| Concepto | Pregunta central | Evidencia típica |
|---|---|---|
| **Verificación** | ¿Estamos construyendo **correctamente** el producto según lo especificado? | Revisiones de requisitos, modelos, arquitectura, código y resultados frente a criterios |
| **Validación** | ¿Estamos construyendo el **producto correcto** para la necesidad real? | Pruebas de aceptación, sesiones con usuarios y evaluación en contexto |
| **Pruebas de software** | ¿Qué ocurre al ejecutar el producto bajo ciertas condiciones? | Casos ejecutados, resultados observados, defectos y registros |

**QA frente a testing** (S3-11): QA **previene** defectos, se aplica durante todo el proyecto, mejora procesos y participa todo el equipo; el testing **detecta** defectos, se ejecuta sobre el software desarrollado y evalúa el producto. Es correctivo.

**Error → defecto → falla** (S3-31, S3-32): una persona comete un **error** (por ejemplo, escribir `if (total = 0)` en lugar de `==`); el software queda con un **defecto** (no hace lo esperado); bajo ciertas condiciones, el defecto produce una **falla** visible en ejecución. *No todo defecto produce inmediatamente una falla*: puede permanecer oculto hasta que una condición lo active.

**El costo de corregir un error crece con la etapa** (S1-15): análisis $1 → diseño $10 → implementación $100 → producción $1.000. Corregir en producción puede costar hasta mil veces más que en análisis; por eso la calidad se trabaja desde los requisitos.

**Distinción importante:** se puede verificar correctamente un sistema que resuelve mal el problema del usuario. Y una demostración aceptada no prueba ausencia total de defectos. Una prueba aporta evidencia limitada al alcance de los escenarios ejecutados.

### 6.2. Estrategia de QA desde el inicio

1. Para cada requisito crítico, registrar cómo se verificará y cómo se validará.
2. Priorizar riesgos: alto impacto, alta probabilidad, componentes compartidos, integraciones y escenarios excepcionales.
3. Seleccionar **nivel** de prueba y **tipo** de prueba por separado.
4. Definir datos, entorno, procedimiento, resultado esperado y responsable de ejecución.
5. Ejecutar y comparar **esperado contra observado**, no contra impresiones.
6. Clasificar defectos, priorizar corrección y repetir pruebas afectadas.
7. Revisar resultados con responsables de negocio cuando se trate de aceptación.
8. Mantener evidencia relacionada con versión o compilación concreta.

### 6.3. Niveles de prueba: ¿qué parte se comprueba?

| Nivel | Objeto | Pregunta | Ejemplo de defecto |
|---|---|---|---|
| **Unitaria** | Función, método o componente individual | ¿La regla local responde bien a cada entrada? | Cálculo de descuento incorrecto con valores límite |
| **Integración** | Interacción entre componentes o sistemas | ¿Los contratos y datos fluyen bien entre las partes? | Pedido guardado pero stock no actualizado |
| **Sistema** | Solución completa | ¿El flujo integral funciona en su entorno de prueba? | Flujo de compra falla al combinar pago, inventario y despacho |
| **Aceptación** | Comportamiento según necesidades del cliente/usuario | ¿La solución aporta el resultado acordado? | La inscripción funciona, pero no advierte choques de horario requeridos |

La clasificación depende del **alcance de la comprobación**, no de si la prueba es automática o manual.

### 6.4. Tipos de prueba: ¿qué cualidad se comprueba?

| Tipo | Comprueba | Pregunta o métrica representativa |
|---|---|---|
| **Funcional** | Comportamientos y reglas | ¿Una acción válida produce el resultado correcto? |
| **Rendimiento** | Tiempos, procesamiento, carga | ¿Cumple el umbral acordado con carga y entorno definidos? |
| **Seguridad** | Protección, identidad, permisos, resistencia | ¿Se rechazan operaciones no autorizadas? |
| **Usabilidad** | Comprensión y facilidad de uso | ¿Usuarios representativos completan tareas sin ayuda indebida? |
| **Confiabilidad / recuperación** | Comportamiento ante fallos | ¿Se recupera y conserva integridad cuando falla una dependencia? |
| **Carga** | Volumen de usuarios simultáneos | ¿Cuántos usuarios soporta antes de degradarse? |
| **Compatibilidad** | Comportamiento en entornos requeridos | ¿Funciona en dispositivos o navegadores soportados? |
| **Accesibilidad** | Uso por personas con discapacidad | ¿Pueden usarlo personas con distintas capacidades? |
| **Regresión** | Impacto de modificaciones | ¿Siguen cumpliéndose comportamientos ya aprobados? |

Las preguntas de S3-48 cubren **rendimiento**, **seguridad**, **carga** (¿cuántos usuarios soporta?), **compatibilidad** y **accesibilidad**. Usabilidad, confiabilidad/recuperación y regresión son agregados del framework.

Un caso puede ser **de sistema y funcional**, o **de integración y seguridad**, simultáneamente. Los niveles y tipos son dos ejes diferentes.

### 6.5. Diseño mínimo de un caso de prueba

```text
ID: TC-014
Requisito(s): RF-07, RNF-03
Nombre: [comportamiento]
Nivel: [unitaria/integración/sistema/aceptación]
Tipo: [funcional/seguridad/rendimiento/...]
Precondiciones: [estado y datos]
Datos de entrada: [valores]
Pasos: [acciones reproducibles]
Esperado: [resultado verificable]
Observado: [lo ocurrido durante la ejecución]
Resultado: [aprobado / fallido / bloqueado / no ejecutado]
Entorno y versión: [identificación]
Evidencia: [registro, salida o documento interno]
Defecto relacionado: [si procede]
```

### 6.6. Probar caminos normales, límites y errores

**Ejemplo:** función de descuento con entradas `(precio, porcentaje)`. La clase (S3-36) prueba `100.000, 20 % → 80.000`, `50.000, 10 % → 45.000` y `25.000, 0 % → 25.000`. Como criterio del framework, comprobar además descuentos de `0%`, `100%`, negativos y mayores a `100%`, conforme a reglas acordadas. Si el negocio prohíbe entradas fuera del rango, el esperado debe especificar **rechazo con mensaje o error definido**, no permitir que el programa devuelva cualquier número.

**Secuencia de una compra con integraciones:**

```text
Iniciar compra
  → Validar inventario
  → Autorizar pago
  → Registrar venta
  → Descontar stock
  → Generar despacho y confirmación
  → Verificar consistencia final

Escenarios negativos que deben considerarse:
  pago rechazado / servicio no disponible / inventario insuficiente /
  reintento duplicado / fallo a mitad del proceso / confirmación tardía.
```

Si la compra agota la última unidad, verificar que una segunda operación no produzca venta inconsistente. El diseño debe establecer qué ocurre ante éxito parcial; la prueba no sustituye esa decisión.

### 6.7. Priorizar pruebas si los recursos son limitados

*(criterio del framework, no de la lámina)*

| Riesgo o condición | Prioridad típica | Justificación |
|---|---|---|
| Pérdida de dinero, datos o permisos | Muy alta | Consecuencias graves |
| Camino principal que habilita valor | Alta | El producto no cumple su propósito si falla |
| Integración externa crítica | Alta | Dependencia no controlada completamente |
| Reglas con muchos límites o estados | Alta | Mayor superficie de error |
| Función secundaria sin cambios | Según evidencia | Puede bastar regresión selectiva |
| Aspectos cosméticos sin impacto crítico | Según contexto | Evaluar en relación con accesibilidad y experiencia |

**Nunca declarar cobertura total solo por tener muchas pruebas.** Registrar cobertura relevante por requisitos y riesgos; revisar defectos abiertos antes de aceptar.

### 6.8. Lista de control de QA por hito

- [ ] Requisitos con criterios comprobables.
- [ ] Modelos y arquitectura revisados antes de su implementación crítica.
- [ ] Pruebas unitarias de reglas complejas y casos límite.
- [ ] Pruebas de integración de servicios y datos compartidos.
- [ ] Pruebas de sistema de escenarios completos.
- [ ] Validación por usuarios de comportamientos importantes.
- [ ] Requisitos no funcionales medidos donde corresponde.
- [ ] Resultados observados, versiones y defectos registrados.
- [ ] Riesgo residual conocido y aceptado por responsable pertinente.

**Puerta de salida 6:** existe evidencia de que la versión candidata cumple criterios definidos, se conoce qué no se probó y las personas autorizadas entienden los riesgos restantes.

---

## 7. Documentación, entrega y continuidad

*Fuente: semana 4, láminas 4–10; el procedimiento de entrega (7.2, 7.3) es criterio del framework.*

### 7.1. Documentar para responder preguntas futuras

| Destinatario | Necesita saber | Documentación mínima útil |
|---|---|---|
| Usuario | Cómo realizar tareas | Guía de uso, mensajes, casos frecuentes |
| Nueva persona del equipo | Qué construir y por qué | Contexto, alcance, decisiones, arquitectura |
| Desarrollo | Cómo interactúan componentes | Contratos, instrucciones, modelos vigentes |
| QA | Qué se espera y qué se probó | Requisitos, casos, datos y resultados |
| Operación | Cómo desplegar y recuperar | Configuración, ejecución, respaldo, monitoreo |
| Cliente / negocio | Qué se entregó y qué falta | Criterios cumplidos, limitaciones, pendientes |

**Equilibrio:** documentar demasiado crea mantenimiento burocrático; documentar demasiado poco hace al sistema dependiente de personas. Conservar información **útil, localizada y actualizable**.

### 7.2. Mínimo reproducible para entregar

1. Identificación de versión y componentes incluidos.
2. Dependencias y requisitos del entorno.
3. Pasos exactos para instalar, ejecutar y probar.
4. Variables de configuración **sin exponer secretos**.
5. Descripción de interfaces e integraciones.
6. Modelo de datos/migraciones y estrategia de respaldo cuando aplica.
7. Funcionalidades entregadas y criterios de aceptación.
8. Pruebas ejecutadas, defectos conocidos y limitaciones.
9. Procedimiento para volver a la versión anterior o recuperar el servicio cuando el riesgo lo exige.
10. Responsable de operación o soporte y canal de incidencias.

### 7.3. Procedimiento de entrega

```text
Versión candidata
 → Comprobar requisitos y resultados de pruebas
 → Verificar dependencias, datos y configuración
 → Ensayar despliegue y recuperación cuando corresponda
 → Obtener aceptación del resultado con evidencia
 → Publicar versión / realizar transición
 → Monitorear comportamiento y registrar incidentes
 → Incorporar aprendizaje en el plan de evolución
```

No asumir que «desplegar» equivale automáticamente a «aceptado». La puesta en marcha es una actividad técnica; la aceptación depende de criterios y autoridad definida.

**Puerta de salida 7:** un tercero competente puede ejecutar y mantener la versión sin depender de conocimiento oral no documentado; las limitaciones y pendientes están visibles.

---

## 8. Evolución y mantenimiento del software

*Fuente: semana 4, láminas 10–16.*

La entrega **no termina** el ciclo de vida: el sistema cambia por defectos, nuevas necesidades, seguridad, plataformas, infraestructura y regulación.

### 8.1. Tipos de mantenimiento

| Tipo | Propósito | Ejemplo genérico | Comprobación |
|---|---|---|---|
| **Correctivo** | Reparar defecto existente | Corregir cálculo erróneo | Caso que fallaba ahora pasa + regresión |
| **Adaptativo** | Ajustarse a un cambio externo | Actualizar compatibilidad de plataforma | Funciones operan en el nuevo entorno |
| **Perfectivo** | Mejorar o ampliar capacidad, utilidad o desempeño | Añadir consulta o mejorar tiempo de respuesta | Nuevo requisito/umbral verificado |
| **Preventivo** | Reducir futuros defectos o costos de mantenimiento | Refactorizar módulo frágil | Comportamiento conservado y riesgo reducido |

Un mismo cambio puede tener efectos de varias categorías. Clasificarlo por **propósito predominante** sin omitir pruebas de los efectos secundarios.

### 8.2. Flujo para gestionar una solicitud posterior

1. Registrar origen y necesidad: fallo, riesgo, cambio externo o mejora.
2. Clasificar tipo de mantenimiento y urgencia.
3. Identificar requisitos, componentes, datos, integraciones, pruebas y documentación impactados.
4. Estimar alcance, esfuerzo, duración, riesgos y costo **actualizados**.
5. Priorizar y autorizar; decidir si entra en un incremento próximo o requiere intervención inmediata.
6. Implementar en unidad controlada, verificar y ejecutar regresión afectada.
7. Desplegar con plan de contingencia y monitorear.
8. Actualizar documentación y registrar resultado o nuevo pendiente.

### 8.3. Analizar un cambio de alcance

| Pregunta | Respuesta que hay que dejar escrita |
|---|---|
| ¿Qué se agrega, modifica o elimina? | Requisitos y componentes concretos |
| ¿Qué decisiones anteriores deja de ser válidas? | Arquitectura, seguridad, datos, interfaces |
| ¿A quién afecta? | Usuarios, clientes, soporte y sistemas externos |
| ¿Qué ocurrirá con trabajo ya terminado? | Retrabajo, migraciones, nuevas pruebas |
| ¿Qué cambia en costo, capacidad y fecha? | Estimaciones nuevas y diferencias contra línea base |
| ¿Qué riesgos nuevos aparecen? | Probabilidad, impacto, tratamiento |
| ¿Quién acepta el impacto? | Responsable y decisión registrada |

**Puerta de salida 8:** el cambio responde a una necesidad definida, fue estimado antes de comprometerlo y deja trazabilidad del comportamiento y del resultado.

---
## 9. Estimar correctamente: tamaño, esfuerzo, duración, recursos y costo

*Fuente: semana 5, láminas 15–35; S7-8.*

**Principio de las semanas 5 a 7:** antes de responder «¿cuánto costará?» hay que responder «¿qué construiremos?» y «¿con qué información estamos estimando?». Una estimación es una predicción razonada **condicionada a supuestos**. No es una fecha garantizada, ni el simple deseo de cumplir un presupuesto.

### 9.1. Cinco conceptos distintos

| Concepto | Pregunta | Unidad o evidencia | No confundir con… |
|---|---|---|---|
| **Tamaño** | ¿Cuánto software o funcionalidad se construirá? | LOC/KLOC, PF u otra medida declarada | Cantidad de usuarios o dinero |
| **Esfuerzo** | ¿Cuánto trabajo humano acumulado se necesita? | Horas-persona, días-persona o persona-mes | Tiempo calendario |
| **Duración** | ¿Cuánto tiempo calendario podría tardar? | Días, semanas, meses | Esfuerzo total |
| **Recursos** | ¿Qué personas, herramientas, infraestructura y servicios necesitamos? | Cantidad, dedicación, tipo y disponibilidad | Solo número de programadores |
| **Costo** | ¿Cuánto dinero se utilizará? | Moneda y período declarados | Esfuerzo expresado como número |

```text
Alcance conocido + requisitos + restricciones
                    ↓
            Estimación de TAMAÑO
                    ↓
            Estimación de ESFUERZO
                    ↓
     Capacidad, dependencias y calendario
                    ↓
           Estimación de DURACIÓN
                    ↓
       Personas, infraestructura y apoyos
                    ↓
              Estimación de COSTO
                    ↺
       Cambios en un supuesto → reestimar
```

### 9.1b. Estimación ≠ presupuesto ≠ compromiso

La clase (S5-33) distingue tres conceptos que se relacionan, pero no significan lo mismo:

| Concepto | Qué es | Ejemplo de la clase |
|---|---|---|
| **Estimación** | Predicción de esfuerzo, duración o costo según la información disponible | «Estimamos aproximadamente 12 meses-persona de esfuerzo» |
| **Presupuesto** | Recursos económicos asignados o autorizados | «Disponemos de $35 millones» |
| **Compromiso** | Meta o acuerdo que la organización asume | «Nos comprometimos a entregar el 30 de noviembre» |

En un mismo proyecto pueden diferir (8 meses de esfuerzo, $30 millones disponibles y entrega comprometida en 6 meses). Que el cliente tenga $30 millones no significa que el proyecto cueste eso, y que ventas haya prometido 6 meses no significa que técnicamente basten. **Una decisión comercial no modifica automáticamente el esfuerzo técnico necesario.**

Además (S5-34, S5-35): toda estimación descansa en supuestos («estimamos 6 meses **bajo los siguientes supuestos…**»), y la incertidumbre disminuye a medida que el proyecto avanza, por lo que la estimación se revisa con la nueva información.

### 9.2. Ejemplo numérico de diferencia entre esfuerzo y plazo

Si una tarea supone **6 persona-mes** de trabajo, 1 persona trabajando 6 meses y 3 personas trabajando 2 meses parecen equivalentes **solo en una simplificación aritmética**. En la realidad hay dependencias, coordinación, aprendizaje, esperas y trabajo no paralelizable. **No es válido afirmar que triplicar el equipo reduce automáticamente la duración a un tercio**.

### 9.3. Lo que debe saberse antes de calcular

- Qué usuarios y tareas quedan incluidos y excluidos.
- Volumen de operaciones, datos y conectores externos relevantes.
- Calidad, seguridad, disponibilidad y rendimiento esperados.
- Restricciones de tecnología, plataformas, dependencias y requisitos regulatorios.
- Habilidades y disponibilidad real de personas, no solo su número.
- Fecha objetivo y posibilidad real de despliegues parciales.
- Historial de proyectos comparables o productividad observada.
- Información ausente y cómo cambia la confianza en el resultado.

### 9.4. Métricas que sirven y métricas que engañan

**Métricas potenciales:** esfuerzo real, duración real, tamaño, costo, defectos, capacidad, productividad y variación de estimaciones. Siempre indicar la regla de medición.

Un indicador simple visto en clases es:

`Productividad medida = tamaño producido / esfuerzo empleado`

Ejemplo hipotético: equipo A produce 12.000 LOC en 8 persona-mes → **1.500 LOC/persona-mes**; equipo B produce 15.000 LOC en 12 persona-mes → **1.250 LOC/persona-mes**. Bajo esa métrica A tiene mayor productividad aparente, **pero no demuestra** que su producto sea mejor, que su código sea de mayor calidad o que sus tareas fueran igualmente difíciles. Cambios de lenguaje, bibliotecas, calidad y regla de conteo alteran la comparación.

**Regla de interpretación:** las métricas deben servir para aprender, no para premiar más líneas de código o castigar a equipos con proyectos difíciles.

### 9.5. Puerta de salida de la estimación inicial

- [ ] Definido **qué** se intenta estimar y qué queda excluido.
- [ ] Diferenciados tamaño, esfuerzo, duración, recursos y costo.
- [ ] Fuente, unidad y método declarados.
- [ ] Supuestos y riesgos visibles.
- [ ] Se entrega rango o escenarios cuando la incertidumbre lo exige.
- [ ] Existe responsable y momento para actualizar el cálculo.

---

## 10. Estimar con información incompleta: elegir la técnica

*Fuente: semana 5, láminas 43–64.*

La semana 5 presenta **tres** estrategias (S5-53): **juicio experto**, **analogía** y **descomposición (bottom-up)**, y recomienda contrastar con una segunda estrategia (S5-61 a S5-64). La estimación **paramétrica** con COCOMO corresponde a la semana 7. Ninguna técnica sirve automáticamente para cualquier caso.

### 10.1. Cuándo elegir cada una

| Técnica | Elegir cuando… | Procedimiento | Riesgo | Cómo reforzarla |
|---|---|---|---|---|
| **Juicio experto** | Hay personas con experiencia pertinente y poco detalle disponible | Solicitar estimación razonada e independiente, comparar y discutir supuestos | Sesgos, anclaje, exceso de confianza | Pedir rango, evidencia y segunda opinión |
| **Analogía** | Existen proyectos anteriores realmente comparables | Seleccionar referencia, comparar diferencias, ajustar esfuerzo y alcance | Dos proyectos parecidos a primera vista pueden diferir mucho | Registrar factores de ajuste y calidad de datos históricos |
| **Bottom-up** | El trabajo se puede descomponer en unidades razonablemente identificadas | Dividir por componentes/capacidades, estimar cada unidad, añadir integración y riesgos, sumar | Omisiones, doble conteo, exceso de optimismo | Revisión cruzada de componentes y tareas transversales |
| **Estimación paramétrica (COCOMO, semana 7)** | Existe tamaño medible/estimable y condiciones de aplicación del modelo | Calcular con coeficientes, aclarar supuestos e interpretar | Sensibilidad al tamaño y a modelos históricos | Contrastar con expertos y datos propios |

### 10.2. Procedimiento completo de estimación inicial

1. **Delimitar:** escribir qué entra en la estimación y qué no.
2. **Consultar fuentes:** requisitos, modelos, datos históricos, responsables y restricciones.
3. **Descomponer:** identificar unidades de valor, componentes, integraciones, pruebas, despliegue y documentación.
4. **Seleccionar método principal:** juicio, analogía, bottom-up o paramétrico según la evidencia.
5. **Estimar independientemente cuando sea posible:** evitar que la primera cifra condicione a todas las personas.
6. **Contrastar con otro método:** anotar por qué difiere el resultado.
7. **Incluir trabajo no visible al usuario:** QA, integración, coordinación, documentación, correcciones y operación inicial.
8. **Calcular escenarios:** bajo, central y alto, o rangos con hipótesis explícitas.
9. **Someter a revisión:** ¿tienen sentido la productividad y el esfuerzo implícitos?
10. **Presentar una estimación explicada**, no solo una cifra, y actualizarla ante cambios.

### 10.3. Cómo descomponer sin perder trabajo

**Dos rutas enseñadas en las láminas:**

- **Descomposición por producto:** funciones de usuario, módulos, interfaces, datos, integraciones y comportamientos a implementar.
- **Descomposición por trabajo:** análisis, diseño, construcción, pruebas, integración, documentación, despliegue y gestión.

Son miradas complementarias. Para evitar doble conteo, elegir una como estructura principal y utilizar la otra como **lista de comprobación de actividades omitidas**. Ejemplo de producto:

```text
Sistema de solicitudes
  ├── Identidad y permisos
  ├── Registro y edición
  ├── Consulta y filtros
  ├── Flujo de aprobación
  ├── Avisos y notificaciones
  ├── Integración con sistema externo
  └── Operación y recuperación
```

Para cada componente documentar **complejidad**, dependencias, precondiciones y unidad de estimación. Añadir como actividades transversales QA, revisión, despliegue y coordinación.

### 10.4. Ejemplo de estimación bottom-up

**Ejemplo de la clase** (S5-56), tienda online: gestión de usuarios 2, catálogo 3, carrito 2, pagos 4, pedidos 3 y administración 4 semanas-persona = **18 semanas-persona** de esfuerzo, que **no** son 18 semanas de duración. Además faltan los elementos transversales: integración, pruebas, seguridad, despliegue, gestión, documentación y coordinación. Bottom-up reduce el riesgo de esconder trabajo en una cifra global, pero depende de que la descomposición sea suficientemente completa.

**Ejemplo adicional** *(criterio del framework, no de la lámina)*:

| Unidad de trabajo | Esfuerzo base, horas-persona | Supuesto |
|---|---:|---|
| Registro de solicitudes | 24 | Reglas y validaciones conocidas |
| Consulta y filtros | 16 | Base y contratos disponibles |
| Aprobación y permisos | 24 | Un flujo sin excepciones complejas |
| Integración externa | 20 | Contrato estable y entorno de pruebas |
| Pruebas de sistema, documentación y despliegue | 26 | Una versión y un entorno |
| **Subtotal** | **110** | No constituye presupuesto final |

**Importante:** los números son **inventados como ejercicio** para mostrar el cálculo. En un proyecto real se reemplazan con estimaciones del equipo y se agregan las contingencias y el trabajo omitido. Si la dependencia externa es incierta, no basta con mantener «20 horas»; se eleva un riesgo o se hace una prueba de viabilidad.

### 10.5. Analogía: cómo ajustar una referencia

**Ejemplo de la clase** (S5-55): una app de reservas médicas tomó 18 meses-persona, 5 meses y 4 personas. Una nueva app de reservas odontológicas comparte usuarios, agenda, reservas, cancelaciones y notificaciones, pero suma pagos online e integración con aseguradoras. Los 18 PM son un **punto de referencia** que se ajusta por las diferencias, **no** se copian. Hay que preguntar en qué se parecen, en qué se diferencian y qué impacto tienen esas diferencias.

**Ejemplo numérico** *(criterio del framework, no de la lámina)*:

```text
Proyecto histórico: 300 horas-persona.
Nuevo proyecto: misma clase de producto, pero más integraciones.
Hipótesis de ajuste: +25% de esfuerzo por esas integraciones.
Estimación ajustada: 300 × 1,25 = 375 horas-persona.
```

La cifra **25% es un supuesto hipotético**, no una regla universal ni un coeficiente del material docente. Debe justificarse con datos o criterio experto. No asumir que cantidad de pantallas, cantidad de usuarios o tamaño de la organización equivalen al tamaño del software.

### 10.6. Del método a la decisión de negocio

Si el cliente solicita mismo alcance con menos plazo, **no** aceptar automáticamente «trabajar el doble de rápido». Evaluar opciones y consecuencias:

- Reducir alcance y priorizar un primer incremento útil.
- Reordenar dependencias y tareas paralelizables.
- Incorporar capacidad con conocimiento pertinente y evaluar costo de coordinación.
- Ajustar fecha, presupuesto o restricciones técnicas.
- Probar primero los componentes de riesgo alto para evitar sorpresa tardía.
- Rechazar el compromiso si no existe un escenario defendible.

**Puerta de salida 10:** una tercera persona puede reconstruir los supuestos, sumar los elementos estimados y entender las diferencias entre métodos.

---

## 11. Medir el tamaño: LOC/KLOC o puntos de función (PF)

*Fuente: semana 6, láminas 3–58.*

**Regla central:** tamaño **no** es esfuerzo, y ninguna medida de tamaño es perfecta. El método seleccionado depende de qué información se conoce y de qué se desea comparar. El PDF de la semana 6 contiene tablas de puntos de función dentro de imágenes; aquí se convierten a texto, con sus pesos y umbrales.

### 11.1. Comparación y selección

| | LOC / KLOC | Puntos de Función (PF) |
|---|---|---|
| Mide | Tamaño aproximado del código | Tamaño funcional desde necesidades y transacciones de usuario |
| Requiere | Lenguaje, alcance implementado y regla de conteo | Funciones identificadas, datos y complejidad |
| Suele ser útil | Código existente, historial consistente por lenguaje/equipo | Estimar antes de programar, comparar funcionalidades de sistemas |
| Limitación | Depende de lenguaje, bibliotecas y estilo | Requiere clasificación cuidadosa y juicio en límites funcionales |
| Riesgo de mal uso | Incentivar más código como señal de valor | Contar pantallas, tablas o botones como si fueran funciones automáticamente |

**Decisión:** si no hay código pero sí requisitos funcionales claros, evaluar PF. Si hay código comparable o estimaciones por componente y una regla de conteo estable, LOC puede servir. Si se usan ambas, explicar la conversión y su incertidumbre.

### 11.2. LOC: definir una regla antes de contar

- `LOC` = líneas de código según convención **declarada**.
- `KLOC = LOC / 1.000`.
- Convenciones posibles: líneas físicas, líneas ejecutables, declaraciones; incluir o no comentarios, espacios, generados y dependencias.
- Usar la **misma convención** para comparar proyectos o períodos.
- El número de usuarios y el número de líneas **no** tienen relación fija.

**Ejemplo:** 24.000 LOC = **24 KLOC**, no 24.000 KLOC. Una cifra estimada de LOC antes de escribir el código es una **predicción**, no una medición.

**No equiparar LOC con productividad universal.** Dos equipos pueden implementar el mismo resultado con distinta longitud de código. Una implementación más corta tampoco será necesariamente mejor sin evaluar calidad, mantenimiento y funcionalidad.

### 11.3. Puntos de función: las cinco clases

Primero define el **límite de la aplicación**. Luego identifica funciones reconocibles desde la perspectiva de usuario; no confundas una tabla física con una función lógica, ni una pantalla con un único proceso necesariamente.

| Sigla | Nombre en las clases | Qué representa | Ejemplo |
|---|---|---|---|
| **EI** | Entrada Externa (*External Input*) | Proceso que ingresa datos o información de control para mantener datos internos o modificar comportamiento | Registrar una solicitud |
| **EO** | Salida Externa (*External Output*) | Proceso de salida con procesamiento, cálculo o información derivada | Generar un informe calculado |
| **EQ** | Consulta Externa (*External Inquiry*) | Interacción de consulta sin cálculos o derivaciones significativas como las de EO | Buscar solicitudes con datos mantenidos |
| **ILF** | Archivo Lógico Interno (*Internal Logical File*) | Grupo lógico de datos reconocido por el usuario, **mantenido por la aplicación que se mide** | Solicitudes administradas por el sistema |
| **EIF** | Archivo de Interfaz Externa (*External Interface File*) | Grupo lógico de datos reconocido y **mantenido por otra aplicación**, que el sistema consultado utiliza | Directorio de empleados administrado por otro sistema |

**Regla decisiva ILF/EIF:** no importa si hay una base de datos local, nube o una API; importa **quién mantiene lógicamente la información** en el límite del sistema. Si cambia esa responsabilidad, puede cambiar la clasificación y el conteo.

### 11.4. Qué son DET, FTR y RET

- **DET (Data Element Type):** dato elemental reconocible por el usuario, relevante para la función o grupo lógico. Ejemplos: identificador, fecha, estado, cantidad, importe.
- **FTR (File Type Referenced):** ILF o EIF referenciado o mantenido por una transacción EI, EO o EQ.
- **RET (Record Element Type):** subgrupo lógico reconocible de datos dentro de un ILF o EIF.

| Grupo de funciones | Complejidad determinada por… |
|---|---|
| EI, EO y EQ (transaccionales) | **DET + FTR** |
| ILF y EIF (datos) | **DET + RET** |

No decidir complejidad por cantidad de código, pantalla, tablas físicas o una impresión subjetiva.

### 11.5. Matriz de complejidad para EI

| FTR utilizados | 1–4 DET | 5–15 DET | 16 o más DET |
|---|---|---|---|
| 0–1 FTR | Baja | Baja | Media |
| 2 FTR | Baja | Media | Alta |
| 3 o más FTR | Media | Alta | Alta |

**Procedimiento:** contar DET; contar FTR distintos; buscar **fila y columna**; obtener baja, media o alta. Ejemplo: EI con **12 DET y 2 FTR = media**.

### 11.6. Matriz de complejidad para EO y EQ

| FTR utilizados | 1–5 DET | 6–19 DET | 20 o más DET |
|---|---|---|---|
| 0–1 FTR | Baja | Baja | Media |
| 2–3 FTR | Baja | Media | Alta |
| 4 o más FTR | Media | Alta | Alta |

Ejemplos de clase: EO con **22 DET y 3 FTR = alta**; EQ con **5 DET y 1 FTR = baja**.

### 11.7. Matriz de complejidad para ILF y EIF

| RET | 1–19 DET | 20–50 DET | 51 o más DET |
|---|---|---|---|
| 1 RET | Baja | Baja | Media |
| 2–5 RET | Baja | Media | Alta |
| 6 o más RET | Media | Alta | Alta |

Ejemplo visual convertido a texto: un ILF de **35 DET y 3 RET** es de complejidad **media**; un EIF de **35 DET y 3 RET** también es **medio**. **Tener igual complejidad no significa recibir igual peso:** se aplica la ponderación propia de cada tipo.

### 11.8. Tabla de pesos de puntos de función

| Tipo | Baja | Media | Alta |
|---|---:|---:|---:|
| EI | 3 | 4 | 6 |
| EO | 4 | 5 | 7 |
| EQ | 3 | 4 | 6 |
| ILF | 7 | 10 | 15 |
| EIF | 5 | 7 | 10 |

**Cálculo básico del conteo no ajustado:**

`PF = Σ (cantidad de funciones de cada tipo y complejidad × peso respectivo)`

**De PF a esfuerzo por productividad histórica** (S6-56): si proyectos comparables muestran unos **10 PF por persona-mes** y el nuevo proyecto mide **150 PF**, una primera aproximación es 150 ÷ 10 = **15 persona-mes**. Esos 15 PM no son 15 meses ni implican que 5 personas lo hagan en 3 meses. La organización también puede registrar LOC por persona-mes y la relación FP ↔ LOC ↔ esfuerzo de sus proyectos.

El material trabaja con esta suma ponderada. No aplicar factores de ajuste adicionales, equivalencias con horas o conversiones a LOC **sin justificar una metodología y sus parámetros**.

### 11.9. Procedimiento completo reproducible

```text
1. Definir límite de la aplicación y alcance del conteo.
2. Identificar funciones reconocibles desde la perspectiva del usuario.
3. Separar funciones transaccionales (EI/EO/EQ) y de datos (ILF/EIF).
4. Decidir clasificación con descripción funcional y responsable de los datos.
5. Contar DET y FTR o RET según corresponda.
6. Buscar complejidad en la matriz del tipo.
7. Aplicar peso de baja / media / alta.
8. Multiplicar por cantidad, sumar PF sin ajustes adicionales.
9. Revisar duplicaciones, funciones omitidas, alcance y suposiciones.
10. Registrar conteo, fecha, versión y quién lo revisó.
```

### 11.10. Ejemplo integrado de la semana 6, transcrito a tabla

Escenario académico: una plataforma gestiona producciones teatrales. Se entregan ya identificadas cinco funciones y sus conteos. El objetivo es **aplicar las matrices**, no inventar esos números.

| Función | Clasificación | DET | FTR/RET | Complejidad | Peso = PF |
|---|---|---:|---|---|---:|
| A. Registrar producción | EI | 8 | 2 FTR | Media | 4 |
| B. Informe de costos calculado | EO | 18 | 3 FTR | Media | 5 |
| C. Consultar antecedentes sin cálculos | EQ | 5 | 1 FTR | Baja | 3 |
| D. Datos de producciones mantenidos aquí | ILF | 32 | 3 RET | Media | 10 |
| E. Datos de recintos mantenidos externamente | EIF | 18 | 1 RET | Baja | 5 |
| **Total** | | | | | **27 PF** |

**Revisión por fila:**

- A: EI, DET 8 pertenece a 5–15 y FTR 2 → media → 4 PF.
- B: EO, DET 18 pertenece a 6–19 y FTR 3 → media → 5 PF.
- C: EQ, DET 5 pertenece a 1–5 y FTR 1 → baja → 3 PF.
- D: ILF, DET 32 pertenece a 20–50 y RET 3 → media → 10 PF.
- E: EIF, DET 18 pertenece a 1–19 y RET 1 → baja → 5 PF.

**Lección:** el resultado de **27 PF** mide tamaño funcional bajo estos supuestos. No significa 27 horas, 27 pantallas, 27 tareas ni 27 meses.

### 11.11. Errores de conteo frecuentes

| Error | Por qué falla | Corrección |
|---|---|---|
| Contar cada botón como EI | Un botón no define necesariamente una transacción lógica única | Identificar función elemental desde el usuario |
| Contar cada tabla como ILF | Un ILF es un grupo lógico, no obligatoriamente una tabla física | Revisar propiedad lógica, datos y límites |
| Confundir EI con EQ | Registrar modifica o controla; consultar obtiene información | Describir efecto funcional de la operación |
| Confundir EO con EQ | Algunas salidas incorporan cálculos/derivaciones | Revisar reglas de procesamiento de la salida |
| Confundir ILF con EIF | La ubicación física no determina la clasificación | Identificar quién mantiene el grupo lógico |
| Clasificar por «parece difícil» | Ignora DET/FTR/RET | Aplicar matrices y documentar conteos |
| Convertir PF a esfuerzo directamente | PF mide tamaño, no dedicación humana | Requerir productividad o modelo calibrado |

**Puerta de salida 11:** otra persona puede reproducir el conteo, comprobar cada fila y explicar por qué una función es EI/EO/EQ/ILF/EIF y por qué tiene su complejidad.

---
## 12. COCOMO 81 básico: de tamaño a esfuerzo y duración

*Fuente: semana 7, láminas 4–32.*

La semana 7 introduce **COCOMO 81 básico** como un modelo empírico para estimar esfuerzo y duración a partir del tamaño en **KLOC**, suponiendo un modo de desarrollo. **No confundir con COCOMO II**, ni tratar el resultado como presupuesto monetario completo o fecha garantizada.

### 12.1. Cuándo usarlo y cuándo no

**Evaluarlo si:** existe un tamaño expresado en KLOC razonablemente fundado, se puede justificar el modo de desarrollo y el objetivo es una primera estimación estructurada de esfuerzo/plazo.

**No utilizarlo como respuesta única si:** el proyecto tiene tamaño extremadamente incierto, un entorno atípico para los datos históricos del modelo, cambios frecuentes sin reestimación, factores humanos o técnicos dominantes no representados, o no se ha revisado siquiera el alcance. En esos casos puede emplearse solo como **escenario de contraste** con estimaciones propias.

### 12.2. Selección del modo

| Modo COCOMO básico | Características | Criterio operativo |
|---|---|---|
| **Orgánico** | Equipo familiarizado con dominio, requisitos relativamente conocidos, complejidad moderada | Proyecto con pocas restricciones excepcionales y equipo con experiencia pertinente |
| **Semiacoplado** | Experiencia y complejidad intermedias; mayor heterogeneidad | Proyecto que mezcla partes conocidas y desafíos más exigentes |
| **Empotrado** | Restricciones fuertes de hardware, software, operación o tiempo real | Sistema fuertemente condicionado por restricciones externas críticas |

No elegir «orgánico» solo porque produce menos esfuerzo. Es necesario **justificar por escrito el modo** según características del producto y equipo.

### 12.3. Fórmulas y unidades

```text
KLOC = LOC / 1000

Esfuerzo, PM = a × (KLOC)^b
Duración, meses = c × (PM)^d
Dotación promedio, personas = PM / duración
```

- **PM** = persona-mes: cantidad acumulada de trabajo, no meses transcurridos.
- **Duración** = estimación de calendario, no suma de horas.
- **Dotación promedio** = resultado matemático; no es una instrucción de contratar una cantidad fraccionaria de personas.
- Los coeficientes **a, b, c, d** cambian según modo.

### 12.4. Coeficientes del material de clase

| Modo | a | b | c | d |
|---|---:|---:|---:|---:|
| Orgánico | 2,4 | 1,05 | 2,5 | 0,38 |
| Semiacoplado | 3,0 | 1,12 | 2,5 | 0,35 |
| Empotrado | 3,6 | 1,20 | 2,5 | 0,32 |

Son los **coeficientes de COCOMO 81 básico enseñados en la semana 7**; no mezclarlos con coeficientes de otros modelos o versiones.

### 12.5. Ejemplo resuelto: 20.000 LOC, modo orgánico

**Paso 1: tamaño**

`KLOC = 20.000 / 1.000 = 20`

**Paso 2: esfuerzo**

`PM = 2,4 × (20)^1,05 ≈ 55,76 persona-mes`

**Paso 3: duración**

`Duración = 2,5 × (55,76)^0,38 ≈ 11,52 meses`

**Paso 4: dotación promedio**

`Dotación = 55,76 / 11,52 ≈ 4,84 personas en promedio`

**Interpretación:** se estiman ~55,76 meses-persona de trabajo acumulado a distribuir sobre ~11,52 meses bajo las hipótesis del modelo. **No** significa que 4,84 personas reales, asignadas permanentemente y sin cambios, puedan garantizar la fecha.

### 12.6. Comparar tres modos sin confundir sus resultados

| Escenario docente | Tamaño | Modo | Esfuerzo aproximado | Duración aproximada | Dotación promedio |
|---|---:|---|---:|---:|---:|
| A | 20 KLOC | Orgánico | 55,76 PM | 11,52 meses | 4,84 |
| B | 32 KLOC | Semiacoplado | 145,51 PM | 14,29 meses | 10,18 |
| C | 50 KLOC | Empotrado | 393,61 PM | 16,92 meses | 23,27 |

La diferencia **no se debe únicamente al tamaño**: los modos y coeficientes también cambian. Para estudiar la influencia del modo, conservar **el mismo KLOC** y recalcular con distintos coeficientes, justificando por qué se probarían esos escenarios.

### 12.7. Sensibilidad ante cambio de tamaño

Ejemplo de la semana 7: un proyecto orgánico aumenta de **20 a 25 KLOC**.

```text
Antes: PM = 2,4 × (20)^1,05 ≈ 55,76 PM
Después: PM = 2,4 × (25)^1,05 ≈ 70,48 PM
Diferencia ≈ 14,72 PM
Aumento relativo ≈ (70,48 / 55,76 - 1) × 100 = 26,4%
```

La clase lo ilustra también con S7-19: en modo orgánico, 10 KLOC ≈ 26,93 PM y 20 KLOC ≈ 55,76 PM. Duplicar el tamaño produce más del doble de esfuerzo porque b > 1.

**Resultado:** +25% de tamaño produce aproximadamente **+26,4% de esfuerzo** en este modelo. Como el exponente `b` supera 1, el esfuerzo crece más que proporcionalmente con tamaño manteniendo el modo. Después hay que recalcular **duración, dotación, presupuesto y riesgo**. No mantener automáticamente el calendario original.

### 12.8. Costo laboral estimado a partir de PM

**COCOMO básico no entrega costo monetario completo.** Una aproximación separada:

`Costo laboral ≈ PM × costo por persona-mes`

Ejemplo de clase, con valor **hipotético**:

`55,76 PM × $2.000.000 CLP/PM ≈ $111.520.000 CLP`

Este número **no incluye automáticamente** infraestructura, licencias, servicios, equipamiento, contingencias ni otros costos del proyecto. Si se pretende presupuestar por perfiles con tarifas diferentes, se deben desagregar los persona-mes según dedicación estimada.

### 12.9. Procedimiento de aplicación reproducible

1. Seleccionar una **versión concreta del alcance** y tamaño KLOC, con fuente y convención LOC.
2. Evaluar si el modelo histórico tiene sentido en el contexto.
3. Elegir modo **por características**, no por conveniencia presupuestaria.
4. Tomar coeficientes de la tabla correspondiente.
5. Calcular PM utilizando KLOC, no LOC brutas.
6. Calcular meses con PM y coeficientes correctos.
7. Calcular dotación promedio, **no** contratar automáticamente esa cifra.
8. Convertir el esfuerzo a un costo laboral solo si hay tarifas justificadas.
9. Revisar escenarios para tamaño alto/bajo y cambios de alcance.
10. Contrastar con analogía, bottom-up o experiencia real del equipo.
11. Documentar limitaciones, riesgos y fecha de reestimación.

### 12.10. Errores que invalidan el cálculo

Los cuatro primeros son los de S7-23; los demás son criterio del framework.

| Error | Corrección |
|---|---|
| Ingresar `20.000` como KLOC para 20.000 LOC | Utilizar `20 KLOC` |
| Llamar «55,76 meses» al esfuerzo de 55,76 PM | Distinguir PM de meses calendario |
| Tratar 4,84 personas como plantilla fija exacta | Interpretar como dotación promedio matemática |
| Seleccionar coeficientes de modo incorrecto | Registrar justificación y verificar tabla |
| Convertir PF directamente a KLOC sin base | Documentar factor de conversión y su incertidumbre, si procede |
| Multiplicar costo por PM y llamarlo presupuesto final | Agregar recursos, infraestructura, servicios y riesgos |
| Presentar una cifra sin rangos | Incluir incertidumbre y escenarios cuando corresponda |
| Usar COCOMO básico como evidencia definitiva para tecnología actual | Contrastar y calibrar frente a datos y capacidades reales |

### 12.11. Alcance de otros modelos

Las láminas mencionan **COCOMO intermedio** (factores de costo), **detallado** (distribución por fases) y **COCOMO II** (familia posterior con parámetros distintos), pero **no enseñan en detalle su cálculo**. Este framework **no inventa fórmulas ni coeficientes** de esos modelos. Deben estudiarse por separado antes de usarlos.

**Puerta de salida 12:** los cálculos son reproducibles, se ha escrito el modo y se entienden tanto resultados como limitaciones.

---

## 13. De la estimación al plan de trabajo, capacidad y presupuesto

*Fuente: semana 5, láminas 21–25 y 65–70; los escenarios de 13.4 son criterio del framework.*

### 13.1. Traducción a calendario

El esfuerzo estimado no se convierte por sí solo en calendario. Antes de asumir una fecha, registrar:

- Capacidad **efectiva** por persona y período (horas que realmente pueden destinarse a este trabajo).
- Habilidades requeridas y asignaciones, incluida disponibilidad de revisores y usuarios.
- Dependencias que impiden realizar actividades en paralelo.
- Tiempo de integración, pruebas, espera, corrección y despliegue.
- Calendario real: festivos, vacaciones, aprobaciones y otros compromisos.
- Factores de incertidumbre que puedan alterar el plan.

**Cálculo sencillo para estimaciones manuales:**

```text
Horas-persona planificadas = suma de esfuerzo estimado por tarea.
Capacidad semanal = suma de horas disponibles efectivas por integrante.
Duración mínima aritmética ≈ horas-persona / capacidad semanal.
```

Esta **aproximación ignora dependencias** y no debe confundirse con una estimación realista de calendario. El plan debe verificar tareas no paralelizables y la ruta de actividades crítica. Tampoco se debe mezclar automáticamente esta duración con el resultado COCOMO sin explicar la diferencia entre métodos.

### 13.2. Clasificar recursos, no solo personas

| Tipo | Ejemplos de recursos | Pregunta para estimar |
|---|---|---|
| Humanos | Análisis, desarrollo, QA, diseño, operación, usuarios revisores | ¿Qué dedicación y competencias? |
| Tecnología | Dispositivos, servicios, licencias y entornos | ¿Cuántos, por cuánto tiempo, bajo qué tarifa? |
| Infraestructura | Almacenamiento, servidores, conectividad, copias de seguridad | ¿Qué capacidad y crecimiento? |
| Externos | Proveedores, APIs, asesoría, servicios especializados | ¿Qué dependencia, plazo y costo adicional? |
| Coordinación | Reuniones, aprobaciones, integración y capacitación | ¿Cuántas personas y cuánto tiempo consumirá? |

### 13.3. Convertir el plan en presupuesto

**Costo humano con dedicación** (S5-22, S5-23): la persona cuesta más que su sueldo (remuneración, costos del empleador, beneficios, equipamiento, licencias, capacitación) y no siempre trabaja el 100 % en el proyecto.

`Costo = costo mensual × meses × dedicación`

Ejemplo de la clase: $2.500.000 × 4 meses = $10.000.000 al 100 %, y $2.500.000 × 4 × 0,5 = $5.000.000 al 50 %. La tabla de S5-23 (jefe de proyecto, analista, dos desarrolladores y QA durante 4 meses) suma **$30.500.000 de costo humano**, que todavía no es el costo del proyecto: faltan software, servicios, infraestructura y otros recursos (S5-21, S5-25).

**Caso «¿Aceptamos los $20 millones?»** (S5-68, S5-69): el costo humano estimado es de $27.000.000 en 4 meses, mayor que el presupuesto del cliente, $20.000.000. La respuesta no es simplemente «no»: se analizan alternativas (reducir alcance, construir un MVP, revisar la composición y dedicación del equipo, revisar la duración o replantear la solución técnica), y **cualquier cambio obliga a volver a estimar**.


```text
Costo total estimado =
  costo del trabajo humano
+ infraestructura y servicios
+ licencias y herramientas
+ contratación o apoyos externos
+ operación/transición inicial si aplica
+ contingencias justificadas
```

Establecer claramente si los valores incluyen impuestos, duración de servicios y moneda. La **contingencia** no debe usarse para ocultar funciones que se olvidaron estimar; primero completar el alcance y luego reconocer incertidumbre.

### 13.4. Tres escenarios y decisiones ante inviabilidad

*(criterio del framework, no de la lámina)* La clase trabaja escenarios de sensibilidad (S7-25) y alternativas ante un presupuesto insuficiente (S5-69).

| Escenario | Supuesto | Para qué se utiliza |
|---|---|---|
| Optimista | Menos problemas dentro de un rango creíble | Examinar oportunidad, sin comprometerlo como fecha segura |
| Base | Supuestos que el equipo considera más plausibles | Plan operativo inicial |
| Pesimista | Riesgos importantes plausibles que se materializan | Preparar reservas o decisiones alternativas |

Cuando el cliente plantea una fecha o presupuesto inferior al escenario defendible, presentar alternativas **con impacto explícito**: reducir alcance, incrementar recursos con costos de coordinación, modificar prioridades, posponer funcionalidades, cambiar restricciones o revisar el hito. **No prometer mantener todo constante**.

### 13.5. Control de estimaciones durante el proyecto

Conservar por versión:

| Campo | Ejemplo de registro |
|---|---|
| Fecha y versión | 2026-11-23 / estimación 0.2 |
| Alcance cubierto | Funciones incluidas y exclusiones |
| Método / datos | PF, LOC, COCOMO 81 orgánico, bottom-up, históricos |
| Resultado | Tamaño, esfuerzo, duración, recursos, costo |
| Precisión/incertidumbre | Rango, riesgos, supuestos pendientes |
| Próxima revisión | Tras prototipo, cambio de alcance o hito |
| Observación posterior | Real vs estimado; explicación de diferencias |

La **estimación mejora** cuando la organización registra resultados reales y aprende. Un cálculo que falla debe investigarse para mejorar futuros supuestos, no simplemente borrarse.

**Puerta de salida 13:** fechas y presupuesto están vinculados a capacidad y dependencias; existen escenarios y la autoridad conoce sus incertidumbres.

---

## 14. Integración con el framework de Requerimientos y Calidad

Ver el [Framework de Ingeniería de Requerimientos y Aseguramiento de la Calidad](framework-requerimientos-calidad.md).

*Fuente: criterio del framework.*

Los dos frameworks son **complementarios, no dos procesos que deban hacerse dos veces**.

| Actividad | Lidera el framework de Requerimientos/Calidad | Lidera este framework de Ingeniería de Software |
|---|---|---|
| Identificar problema y interesados | Diagnóstico, evidencia y validación | Uso para definir alcance realizable |
| Especificar requisitos | ERS, criterios y trazabilidad | Interpretación técnica y cortes implementables |
| Modelar proceso actual | BPMN y decisiones de negocio | Uso del proceso para diseñar el sistema |
| Casos de uso e interacciones | Validación funcional con interesados | Vista de componentes, secuencia y diseño técnico |
| Cualidades y pruebas | Definición de atributos y criterios | Estrategia de implementación, QA y ejecución de pruebas |
| Escoger enfoque de desarrollo | Necesidades de gestión de requisitos | Organización global de diseño, construcción y entregas |
| Estimar costo y duración | Aclara requisitos que condicionan el cálculo | LOC, PF, COCOMO, recursos y escenarios |
| Cambios | Trazabilidad y aceptación del cambio | Evaluación de efecto técnico, reestimación y entrega |

**Uso operativo:** se puede comenzar con el framework de Requerimientos para entender la necesidad, continuar con este para diseñar/planificar/construir y regresar al primero cuando cambien decisiones de negocio. **No duplicar las matrices**: mantener una fuente vigente y referenciarla desde los entregables relacionados.

---

## 15. Lista de control integral por hitos

*Fuente: criterio del framework.*

| Hito | Pregunta antes de continuar | Evidencia mínima |
|---|---|---|
| **H1 — Comprensión** | ¿Sabemos cuál es el problema y quién valida la solución? | Objetivo, interesados, alcance y supuestos |
| **H2 — Enfoque** | ¿El proceso elegido se ajusta a cambio, riesgo y feedback? | Decisión metodológica y responsabilidades |
| **H3 — Modelo** | ¿Los modelos responden preguntas necesarias? | Vistas revisadas y escenarios críticos |
| **H4 — Diseño** | ¿Podemos implementar sin inventar contratos ni reglas? | Componentes, datos, interfaces y ADR |
| **H5 — Construcción** | ¿Se integró una capacidad útil y verificable? | Incremento o unidad integrada y registro de cambios |
| **H6 — QA** | ¿Sabemos qué se probó, qué pasó y qué no? | Casos, resultados, defectos y riesgo residual |
| **H7 — Entrega** | ¿La versión se puede operar y entender? | Aceptación, documentación y procedimiento de despliegue |
| **H8 — Evolución** | ¿Los cambios se priorizaron y estimaron? | Registro, impacto y nueva evidencia de pruebas |
| **H9 — Estimación** | ¿La cifra se puede reproducir y revisar? | Método, datos, supuestos, escenarios y versión |

**Política de excepciones:** si un hito no cumple un criterio pero la organización decide continuar, dejar documentado el riesgo, responsable, motivación, acción correctiva y plazo de revisión. No cambiar retrospectivamente el estado a «aprobado» para ocultar trabajo pendiente.

---
## 16. Plantillas reutilizables listas para copiar

*Fuente: criterio del framework, a partir de las secciones anteriores.*

Las siguientes plantillas son **formatos sugeridos**, no formularios obligatorios. Adaptarlas al tamaño del proyecto y no copiar todas si no aportan valor. No declarar completados campos sin evidencia.

### P01. Ficha de inicio y alcance

```markdown
# Ficha de inicio — [proyecto]
- Versión / fecha:
- Problema actual:
- Evidencias del problema:
- Resultado de negocio esperado:
- Usuarios / interesados:
- Quién valida y aprueba:
- Funciones incluidas:
- Funciones excluidas:
- Requisitos no funcionales críticos:
- Integraciones:
- Restricciones:
- Dependencias externas:
- Supuestos aún por verificar:
- Riesgos iniciales:
- Indicadores de éxito y cómo se medirán:
- Decisión de continuar / investigar / replantear:
```

**Criterio:** cada función incluida responde a una necesidad; cada exclusión evita una interpretación contradictoria del alcance.

### P02. Decisión de enfoque de desarrollo

```markdown
# DEC-MET — Selección de enfoque
- Pregunta de decisión:
- Estabilidad de requisitos: alta / media / baja (evidencia)
- Frecuencia posible de feedback:
- Riesgos técnicos y de negocio:
- Necesidad de aprobación formal:
- Posibilidad de entregas parciales:
- Opciones consideradas: cascada / RAD / RUP / AUP / Scrum / híbrido
- Criterios y comparación:
- Opción escogida:
- Razones verificables:
- Qué se mantendrá como práctica de otras opciones:
- Responsables y roles:
- Política de cambios:
- Cuándo reevaluar:
- Estado: propuesta / aprobada / modificada
```

### P03. Registro de modelos y decisiones

| ID | Pregunta que resuelve | Modelo elegido | Requisito/escenario | Responsable | Estado | Revisión o evidencia |
|---|---|---|---|---|---|---|
| MOD-01 | ¿Quién puede registrar y consultar? | Casos de uso | RF-01, RF-02 | Por asignar | Propuesto | Pendiente |
| MOD-02 | ¿Qué sucede si falla el proveedor? | Secuencia | RI-01 | Por asignar | Propuesto | Pendiente |

Para cada modelo registrar **versión**, relaciones esenciales, decisiones tomadas y supuestos. Si no se utiliza un modelo, no inventar su ID para que parezca completo.

### P04. Especificación textual de un caso de uso

```markdown
# CU-XX — [verbo + objetivo]
- Objetivo del actor:
- Actor principal:
- Actores/servicios participantes:
- Disparador:
- Precondiciones:
- Flujo principal:
  1.
  2.
  3.
- Alternativa A — condición y pasos:
- Error E — condición, reacción y estado final:
- Postcondiciones:
- Reglas de negocio:
- Requisitos relacionados:
- Evidencia o validación del caso:
- Versión/estado:
```

### P05. Registro de decisión técnica (ADR)

```markdown
# ADR-XX — [tema]
- Estado: propuesta / aceptada / reemplazada
- Fecha y versión:
- Necesidad o restricción que origina la decisión:
- Requisitos y escenarios relacionados:
- Opciones consideradas:
- Criterios de evaluación:
- Evidencia disponible:
- Opción elegida y por qué:
- Consecuencias positivas:
- Costos y riesgos de la elección:
- Supuestos y criterios para revisar:
- Responsable de aprobar:
```

### P06. Contrato de componente o integración

```markdown
# INT-XX — [interacción o componente]
- Propósito de negocio:
- Componente emisor / consumidor:
- Componente receptor / proveedor:
- Operación o mensaje:
- Datos requeridos y validaciones:
- Autorización necesaria:
- Respuesta de éxito:
- Errores esperados y tratamiento:
- Reintentos, timeout e idempotencia (si aplica):
- Reglas sobre persistencia y duplicados:
- Requisito(s) relacionados:
- Pruebas de integración y fallo:
- Versión del contrato:
```

**Guía:** definir campos solo si son relevantes, pero documentar errores e indisponibilidad cuando el flujo dependa de un servicio externo.

### P07. Unidad implementable / elemento de backlog

```markdown
# TRAB-XX — [capacidad verificable]
- Valor o riesgo que aborda:
- Requisito y criterio de aceptación:
- Componentes involucrados:
- Dependencias y datos necesarios:
- Condición de entrada:
- Trabajo técnico por realizar:
- Estimación, unidad y fundamento:
- Pruebas necesarias:
- Documentación afectada:
- Responsable(s):
- Estado y bloqueos:
- Definition of Done / criterio de salida:
- Resultado observado y evidencia:
```

### P08. Plan y caso de prueba

```markdown
# TC-XX — [escenario]
- Requisito(s) vinculados:
- Nivel: unitario / integración / sistema / aceptación
- Tipo: funcional / no funcional / regresión / otro
- Riesgo cubierto:
- Versión del sistema:
- Entorno:
- Precondiciones y datos:
- Pasos reproducibles:
- Resultado esperado:
- Resultado observado:
- Estado: no ejecutado / aprobado / fallido / bloqueado
- Evidencia conservada:
- Incidente/defecto asociado:
- Fecha y responsable:
```

### P09. Registro y priorización de defectos

| Campo | Qué anotar |
|---|---|
| ID y resumen | Defecto identificable |
| Versión y entorno | Dónde se reproduce |
| Pasos y datos | Reproducción objetiva |
| Esperado / observado | Diferencia verificable |
| Severidad / impacto | Qué se rompe y a quién afecta |
| Prioridad | Cuándo debe corregirse |
| Evidencia | Registro o prueba relacionada |
| Estado / responsable | Pendiente, en corrección, en prueba, resuelto |
| Verificación posterior | Versión y caso que confirmó solución |

No confundir severidad con prioridad: un defecto severo puede necesitar mitigación de operación, mientras que una prioridad responde a la decisión de cuándo actuar.

### P10. Estimación por descomposición (bottom-up)

| ID | Componente o tarea | Incluye / excluye | Dependencias | Esfuerzo mínimo | Base | Máximo | Fuente / responsable |
|---|---|---|---|---:|---:|---:|---|
| E-01 | Por completar | | | | | | |
| E-02 | Por completar | | | | | | |
| **Total** | | | | **Σ** | **Σ** | **Σ** | |

Completar además: **unidad de esfuerzo**, trabajo transversal incluido, riesgos, incertidumbre, supuestos, capacidad y fecha de revisión. Los tres escenarios no implican por sí mismos probabilidades ni un nivel formal de confianza.

### P11. Hoja de conteo LOC

```markdown
# Medición o estimación LOC — [alcance]
- Fecha, versión y responsable:
- Lenguaje(s) y componentes:
- LOC real o LOC estimada:
- Regla de conteo: físicas / ejecutables / declaraciones / otra
- Incluye comentarios: sí / no
- Incluye líneas en blanco: sí / no
- Incluye código generado o dependencias: sí / no
- Fuente: herramienta / inspección / hipótesis
- LOC por componente:
- LOC total:
- KLOC total = LOC total / 1000:
- Diferencias con versiones anteriores:
- Limitaciones y posibilidad de comparación histórica:
```

### P12. Hoja de puntos de función

| ID | Descripción de función | EI/EO/EQ/ILF/EIF | DET | FTR/RET | Baja/Media/Alta | Peso | PF | Fundamento / estado |
|---|---|---|---:|---:|---|---:|---:|---|
| PF-01 | Por definir | | | | | | | |
| PF-02 | Por definir | | | | | | | |
| **Total** | | | | | | | **Σ** | |

Anexar en texto:

```text
Límite de la aplicación: [...] 
Funciones fuera de alcance: [...] 
Quién mantiene cada grupo lógico de datos: [...] 
Reglas de clasificación de EI / EO / EQ: [...] 
Definición del conteo DET / FTR / RET: [...] 
Revisión de funciones duplicadas: [...] 
Total de PF no ajustados: [...] 
Fuente de los supuestos y fecha: [...] 
```

### P13. Cálculo de COCOMO 81 básico

```markdown
# EST-COCOMO-XX
- Versión del alcance:
- Fuente del tamaño y convención:
- LOC estimadas:
- KLOC = LOC / 1000:
- Modelo: COCOMO 81 básico (no COCOMO II)
- Modo: orgánico / semiacoplado / empotrado
- Justificación del modo:
- Coeficientes a, b, c, d:
- PM = a * (KLOC^b):
- Duración en meses = c * (PM^d):
- Dotación promedio = PM / duración:
- Coste por PM (si corresponde):
- Costo laboral = PM * costo por PM:
- Infraestructura / servicios / herramientas / otros:
- Escenario mínimo, base y máximo:
- Comparación con otro método:
- Exclusiones, riesgos, sensibilidad y fecha de revisión:
```

### P14. Plan de capacidad y presupuesto

| Recurso o función | Cantidad / dedicación | Período | Tarifa unitaria | Costo estimado | Supuesto crítico |
|---|---|---|---|---|---|
| Análisis / diseño | | | | | |
| Desarrollo | | | | | |
| Pruebas y QA | | | | | |
| Operaciones | | | | | |
| Infraestructura | | | | | |
| Servicios externos | | | | | |
| Contingencias justificadas | | | | | |
| **Total** | | | | | |

Registrar también: dependencias del calendario, disponibilidad semanal efectiva, hitos, moneda, impuestos, exclusiones y costo de cambios solicitados.

### P15. Solicitud de cambio o mantenimiento

```markdown
# CAM-XX — [cambio]
- Fecha, solicitante y necesidad:
- Tipo: correctivo / adaptativo / perfectivo / preventivo
- Motivo y evidencia:
- Requisitos afectados:
- Modelos y decisiones afectados:
- Componentes / datos / interfaces afectados:
- Pruebas y documentación a actualizar:
- Opciones: hacer ahora / postergar / descartar
- Cambio en esfuerzo, duración, recursos y costo:
- Riesgos y alternativas:
- Autoriza:
- Estado y versión entregada:
- Pruebas ejecutadas y resultado observado:
```

### P16. Checklist de entrega y operación

```markdown
# Entrega — [versión]
- [ ] Capacidades incluidas/excluidas enumeradas
- [ ] Criterios de aceptación revisados
- [ ] Resultado de pruebas y defectos conocidos publicado
- [ ] Entorno, dependencias y configuración documentados
- [ ] Instalación y ejecución comprobadas
- [ ] Contratos de integración y modelo de datos vigentes
- [ ] Respaldo/recuperación evaluados donde corresponda
- [ ] Seguridad y acceso operativo verificados
- [ ] Monitoreo y responsable de incidentes identificados
- [ ] Plan de reversión documentado si el riesgo lo exige
- [ ] Conformidad del responsable de aceptación registrada
- [ ] Cambios futuros y deuda conocida incorporados al plan
```

### P17. Bitácora de aprendizaje de estimaciones

| Versión | Tamaño planificado / real | Esfuerzo planificado / real | Duración planificada / real | Costo planificado / real | Causa principal de variación | Acción para próximas estimaciones |
|---|---|---|---|---|---|---|
| v0.1 | | | | | | |

Esta tabla no sirve para atribuir culpas por variaciones sin contexto. Sirve para mejorar referencias históricas, detectar componentes olvidados y ajustar criterios de predicción.

---
## 17. Ejemplo de uso integral del framework (proyecto genérico)

*Fuente: criterio del framework (ejemplo didáctico).*

Este escenario es **ilustrativo**, no la documentación de un proyecto real ni una afirmación sobre un cliente existente. Sirve para mostrar cómo encadenar decisiones sin ejecutar actividades innecesarias.

### 17.1. Solicitud inicial

> «Necesitamos una aplicación para registrar solicitudes, que diferentes responsables puedan revisarlas y que las personas conozcan su estado».

**No comenzar todavía a programar.** La solicitud no aclara roles, datos, volumen, aprobaciones, seguridad, integraciones, límites ni definición de «revisar».

### 17.2. Diagnóstico y alcance mínimo

| Tema | Pregunta o hipótesis por validar |
|---|---|
| Objetivo | ¿Se busca reducir tiempo, evitar pérdidas o mejorar transparencia? |
| Roles | ¿Quién solicita, quién revisa y quién administra? |
| Datos | ¿Qué información es obligatoria para registrar? |
| Estados | ¿Puede una solicitud volver atrás o reabrirse? |
| Permisos | ¿Todos pueden ver todas las solicitudes? |
| Integraciones | ¿Se necesita correo, directorio de usuarios o sistema externo? |
| Alcance | ¿Incluye notificaciones, adjuntos, búsqueda y reportes en la primera entrega? |
| Calidad | ¿Qué disponibilidad, tiempos de respuesta y resguardo se requieren? |
| Éxito | ¿Qué resultado observable significa que funciona para el negocio? |

### 17.3. Elegir un enfoque

**Supuesto A:** usuarios disponibles semanalmente, criterios de negocio cambiantes y capacidad de entregar pequeñas funcionalidades. **Decisión provisional:** trabajar por incrementos con revisiones periódicas; evaluar Scrum si el equipo puede sostener sus responsabilidades, eventos y artefactos. **Condición para revisar:** si la organización exige aprobación formal de todos los requisitos antes de empezar, reconsiderar el enfoque y agregar hitos de autorización.

La elección se basa en el contexto, no en que «Scrum siempre es mejor».

### 17.4. Elegir los modelos mínimos

| Pregunta | Modelo recomendado | No se necesita inicialmente si… |
|---|---|---|
| ¿Quién hará qué? | Casos de uso | Ya está claro y no hay conflictos; una lista textual basta |
| ¿Qué estados se permiten? | Estados | No hay ciclo de vida del objeto ni transiciones relevantes |
| ¿Cómo aprobar y rechazar? | Actividades | El flujo es trivial y un caso de uso textual lo explica |
| ¿Cómo guardar y relacionar datos? | Modelo conceptual de clases/datos | Es una demostración sin persistencia aún |
| ¿Cómo registrar e informar con un proveedor externo? | Secuencia | No existe integración relevante en el incremento |
| ¿Dónde corre? | Despliegue simplificado | Un entorno de experimentación todavía no representa producción |

### 17.5. Transformar requisitos en capacidades

| Capacidad | Criterio de aceptación de ejemplo | Verificación principal |
|---|---|---|
| Registrar solicitud | Una persona habilitada registra los datos obligatorios y recibe identificador | Sistema e integración |
| Consultar estado | La persona autorizada ve estado vigente y fecha de actualización | Funcional + seguridad |
| Revisar solicitud | Un responsable autorizado cambia el estado siguiendo reglas aprobadas | Unitaria + sistema |
| Registrar historial | Los cambios relevantes mantienen autor y momento | Integración + sistema |

Los campos, roles y reglas son **propuestas a validar**, no requisitos reales confirmados.

### 17.6. Diseño técnico suficiente

Describir interfaz, módulo de solicitudes, capa de persistencia y servicio de identidad según restricciones reales. Registrar quién mantiene el historial, cómo se impide el acceso no autorizado y qué ocurre si la persistencia falla. No elegir microservicios ni infraestructura compleja solo porque se conoce esa tecnología.

### 17.7. Construcción y QA por incremento

**Primer incremento posible:** registrar y consultar una solicitud; crear dato, validar entrada y persistir; comprobar casos unitarios de validación, integración con repositorio, recorrido de sistema y aceptación con usuarios. Si el incremento no puede ejecutarse de punta a punta, declararlo como trabajo parcial, **no** como versión terminada.

### 17.8. Estimación de tamaño y trabajo

Si se desea estimar PF, identificar realmente EI de registro, EQ de consulta e ILF del grupo de solicitudes, y buscar DET/FTR/RET. **No se puede obtener un total válido** solamente con esta descripción porque faltan datos para clasificar complejidad y saber si existen otras funciones. Si se desea COCOMO, primero se necesita una estimación razonada de KLOC y un modo justificado. Mientras eso no exista, utilizar un rango preliminar por trabajo descompuesto, **marcado como incierto**.

### 17.9. Entrega y evolución

Registrar pasos de despliegue, resultados de pruebas, versión y limitaciones. Solicitudes futuras (adjuntos, reportes, cambio de plataforma o corrección de estados) pasan por análisis de impacto, nueva estimación, pruebas de regresión y documentación de cambios.

**Enseñanza del ejemplo:** el framework debe ayudar a tomar decisiones y detectar información faltante; no obliga a producir todos los diagramas ni permite inventar cifras cuando el alcance aún no está definido.

---

## 18. Cómo utilizar esta guía en un equipo o con asistentes de IA

*Fuente: criterio del framework.*

### 18.1. Protocolo de trabajo con evidencia

Cuando una persona o asistente use el documento para iniciar o continuar un proyecto:

1. Leer la **ficha de contexto** y el estado actual de los entregables.
2. Seleccionar **la pregunta que se quiere resolver** y la etapa pertinente, sin asumir que todos los pasos anteriores están aprobados.
3. Identificar los datos disponibles, los que faltan y los que son suposiciones.
4. Proponer **alternativas y criterios** antes de elegir método, diagrama, arquitectura o técnica de estimación.
5. Elaborar el artefacto necesario, con su **fuente de información** y requisitos relacionados.
6. Comprobar consistencia con decisiones ya vigentes y con interfaces afectadas.
7. Registrar qué fue revisado, por quién y con qué evidencia.
8. Solicitar decisión humana o de negocio cuando no exista autoridad suficiente para asumir un requisito o impacto.
9. Actualizar el estado y los riesgos, no «cerrar» tareas solo porque exista un documento.
10. Evitar duplicar modelos o registros ya vigentes en otro archivo.

### 18.2. Estados recomendados de un artefacto

| Estado | Significado |
|---|---|
| **Borrador** | Contenido inicial, no revisado |
| **En revisión** | Existe propuesta concreta y se espera comprobación |
| **Aprobado** | Responsable autorizado lo revisó y aceptó para el alcance señalado |
| **Implementado** | Existe construcción asociada, pero no implica prueba satisfactoria |
| **Verificado** | Cumple comprobaciones técnicas definidas para la versión |
| **Validado** | Interesados relevantes confirman adecuación a la necesidad |
| **Obsoleto / reemplazado** | Ya no describe el comportamiento o decisión vigentes |

No todos los artefactos necesitan todos los estados: usar solo los pertinentes. En particular, **aprobado**, **implementado**, **verificado** y **validado** no son sinónimos.

### 18.3. Evitar afirmaciones sin respaldo

- No declarar que un requisito fue acordado si solo se infirió de un ejemplo.
- No afirmar que un diagrama se validó porque fue generado correctamente.
- No presentar una tabla de PF con DET, FTR o RET inventados.
- No elegir COCOMO orgánico porque la cifra calculada parezca cómoda.
- No reportar pruebas exitosas sin ejecución y resultado observado.
- No afirmar que un despliegue funciona sin haber sido comprobado.
- No atribuir a las clases prácticas, plantillas o criterios complementarios como si fuesen normas obligatorias.

### 18.4. Regla de elección más importante

> **Elegir la herramienta o metodología por la decisión que ayuda a tomar.** Si una técnica no responde una pregunta real, no reduce riesgo ni permite comprobar un resultado, probablemente no sea necesaria en esa etapa.

---

## 19. Alcance académico, criterios de adaptación y cierre

*Fuente: criterio del framework.*

Esta guía selecciona el contenido **aplicable** de las siete semanas: fundamentos del proceso y los requisitos; modelamiento y UML; QA, verificación y validación; documentación, evolución y enfoques de desarrollo; fundamentos de estimación y recursos; LOC y puntos de función; y COCOMO 81 básico. Las escenas, actividades grupales repetidas, contenido ornamental e introducciones administrativas **no se trasladan** al framework. Los esquemas docentes con utilidad práctica se representan mediante **texto, tablas y procedimientos**, sin imágenes ni enlaces a ellas.

### 19.1. Qué decisiones siempre dependen del proyecto

- **Enfoque de desarrollo:** según incertidumbre, restricciones, riesgo y feedback real.
- **Modelos y diagramas:** según preguntas del sistema, no por número requerido de diagramas.
- **Arquitectura y tecnología:** según requisitos, competencias y condiciones del entorno.
- **Nivel y tipo de pruebas:** según requisitos, impacto, riesgos y medios de comprobación.
- **Profundidad de documentación:** según destinatarios, continuidad y riesgo.
- **Método de estimación:** según información disponible, históricos y confiabilidad de tamaño.
- **Criterio de entrega:** según aceptación y riesgo residual autorizado.

### 19.2. Qué no cubre en detalle el material base

No se desarrollan aquí: fórmulas de **COCOMO intermedio, detallado o COCOMO II**; productividad universal de PF a LOC; implementación completa de normas externas; selección obligatoria de frameworks de programación; diseño exhaustivo de bases de datos, criptografía, nube, DevOps o arquitectura avanzada. Cuando esos temas sean necesarios, el equipo debe obtener información específica y definir una extensión justificada, sin fingir que los coeficientes o reglas vienen de las siete clases.

### 19.3. Definición de una guía utilizada correctamente

El framework cumplió su función si, al finalizar cada decisión, una persona puede responder:

1. **Qué** queríamos resolver.
2. **Por qué** elegimos ese enfoque o técnica y qué descartamos.
3. **Qué evidencia** sustentó la decisión.
4. **Qué entregable** quedó disponible.
5. **Qué pruebas y revisiones** se hicieron realmente.
6. **Qué riesgos y pendientes** permanecen.
7. **Qué cambiará** en el plan si cambia el alcance o la información.

**Cierre:** ingeniería de software no es sinónimo de programar, generar diagramas o completar documentos. Es un proceso de decisiones comprobables que conectan necesidad, diseño, implementación, calidad, operación y evolución con recursos y tiempo reales.

---

## Historial

- 23 de noviembre de 2026: auditoría contra los PDF de las semanas 1 a 7. Se agregaron carga y accesibilidad a los tipos de prueba, se separaron las tres estrategias de la semana 5 de la paramétrica de la semana 7, se marcaron los errores de COCOMO de la lámina y se corrigió la mención de los docentes. También se agregaron estimación ≠ presupuesto ≠ compromiso, costo con dedicación y el caso de $20 millones, error → defecto → falla, QA frente a testing, costo de corregir según la etapa, PF a esfuerzo por productividad, atributos de un buen requisito, la tabla comparativa de enfoques (S4-81), los ejemplos de clase de bottom-up y analogía, las fuentes por sección y las marcas de criterio propio.

---

**Créditos del material académico:** Prof. Dr. Rodrigo Correa R. y Alfredo Pereira (identificados en las portadas del curso). **Universidad San Sebastián (USS).**
