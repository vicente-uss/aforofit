# AforoFit — Entrevista de levantamiento de requisitos

**Proyecto Integrador · Ingeniería Civil Informática · Grupo 6 · USS Bellavista**

**Fecha:** Jueves 12 de noviembre de 2026  
**Entrevistador:** Vicente Galleguillos  
**Entrevistado:** Profesor de Educación Física y encargado del gimnasio USS Bellavista  
**Nombre del entrevistado:** No registrado  
**Objetivo:** Identificar necesidades reales, conocer los procesos actuales y validar los supuestos del proyecto AforoFit.

**Fuentes:** Entrevista presencial grabada, aclaraciones posteriores del entrevistador, Instagram del gimnasio y formulario oficial de inscripción.

---

## A. Funcionamiento general

### 1. ¿Cómo funciona normalmente el gimnasio durante un día?

El gimnasio funciona de lunes a viernes desde las 08:00 hasta las 22:00 horas y los sábados desde las 08:00 hasta las 14:00 horas.

El último ingreso está permitido a las 21:00 horas de lunes a viernes y a las 13:00 horas los sábados.

Existen dos profesores de Educación Física encargados del funcionamiento del recinto. En ciertos horarios ambos trabajan simultáneamente.

Sus responsabilidades no se limitan al gimnasio: también supervisan la cancha, apoyan otras actividades y realizan tareas administrativas.

Actualmente los alumnos registran sus ingresos en papel y posteriormente la información se traspasa a Excel.

### 2. ¿Cuáles son los horarios de mayor concurrencia y cuántos alumnos asisten diariamente?

El horario de mayor concurrencia comienza aproximadamente entre las 09:00 y las 09:30 horas, hasta las 12:30 o 13:00 horas.

Se estima una asistencia diaria de **80 a 90 alumnos**, considerando las personas que utilizan el gimnasio durante toda la jornada.

Esta cifra es una estimación y no proviene de un reporte estadístico verificado.

La ocupación simultánea es variable. El encargado mencionó momentos con apenas tres personas y otros cercanos al límite de veinte.

### 3. ¿Existe una capacidad máxima y cómo se controla?

El gimnasio aplica un límite de **20 personas simultáneas**.

Actualmente, los encargados supervisan manualmente el número de alumnos presentes.

Se confirma que 20 personas es el límite operativo utilizado. No se dispone de un documento institucional que permita determinar si corresponde también al aforo oficial formalmente establecido.

**Decisión para AforoFit:** utilizar 20 personas como capacidad inicial configurable.

### 4. ¿Qué ocurre cuando llega mucha gente al mismo tiempo?

Cuando se alcanzan las 20 personas, los encargados indican a los nuevos alumnos que deben esperar.

En ocasiones entregan un número y les piden que esperen o regresen cuando exista disponibilidad.

El procedimiento se realiza manualmente.

Esta situación puede complicarse porque los profesores también atienden otras áreas y no siempre están supervisando el ingreso.

---

## B. Ingreso y habilitación

### 5. ¿Cómo es actualmente el proceso de ingreso?

El alumno registra manualmente sus antecedentes en una hoja de papel.

Se anotan:

- Nombre.
- RUT.
- Carrera.
- Fecha.
- Hora de ingreso.

Posteriormente, los encargados traspasan la información a Excel.

Esto requiere tiempo y genera trabajo administrativo adicional.

**Información complementaria:** el formulario oficial de inscripción solicita nombre completo, RUT, correo institucional, fecha de nacimiento, teléfono, contacto de emergencia, teléfono de emergencia, antecedentes de salud y tipo de inscripción.

El formulario distingue entre estudiantes y funcionarios/colaboradores.

### 6. ¿Actualmente registran las salidas?

No. Actualmente se registran los ingresos, pero no las salidas.

Esto dificulta conocer cuántas personas permanecen dentro del gimnasio.

El encargado manifestó interés en que los alumnos puedan escanear una credencial al entrar y nuevamente al retirarse, actualizando automáticamente los cupos.

**Decisión para AforoFit:**

- Registrar entradas y salidas.
- Actualizar el aforo según los movimientos registrados.
- No depender de que el alumno utilice la aplicación de rutinas.
- Mantener un cierre automático de visitas como mecanismo de respaldo, inicialmente a las tres horas.

El cierre automático no garantiza que la ocupación registrada coincida siempre con la real, por lo que deberá tratarse como un mecanismo de contingencia.

### 7. ¿Qué requisitos debe cumplir un alumno para entrenar?

Se exige un certificado médico vigente.

El procedimiento actual contempla subir digitalmente el documento mediante un formulario y posteriormente presentar el original físico en el gimnasio.

Los encargados revisan su autenticidad y registran la vigencia en Excel.

El certificado habilita al alumno durante el año académico correspondiente, no durante 365 días desde su emisión.

La exigencia del original se relaciona con antecedentes de certificados alterados.

El encargado mencionó que se han revisado aproximadamente entre 800 y 900 certificados acumulados a lo largo de distintos períodos.

**Decisión provisional para AforoFit:**

- Inicio del año académico: 3 de marzo.
- Término del año académico: 23 de diciembre.
- Las fechas deben ser configurables.

Estas fechas son supuestos de desarrollo y no representan una confirmación del calendario oficial de la universidad.

### 8. ¿Se utiliza actualmente la credencial universitaria?

No se utiliza como mecanismo electrónico de ingreso al gimnasio.

Sin embargo, la TNE universitaria sí se utiliza como garantía para solicitar implementos deportivos.

El encargado consideró útil incorporar un mecanismo de identificación electrónica para registrar entradas y salidas.

**Pendiente:** comprobar la compatibilidad del lector NFC con la credencial USS, TNE y Bip!.

---

## C. Máquinas y entrenamiento

### 9. ¿Cuáles son las máquinas más utilizadas y dónde se producen esperas?

El encargado mencionó principalmente las poleas y las estaciones de press banca como equipamiento donde coinciden varios estudiantes.

En los horarios de mayor concurrencia pueden existir esperas para utilizarlas.

No se dispone de mediciones sobre tiempos de espera o frecuencia de utilización.

El gimnasio cuenta con un inventario básico en Excel, pero no con un catálogo fotográfico completo.

**Responsable del levantamiento:** Bastián González.

### 10. ¿Qué ocurre cuando una máquina presenta una falla?

Normalmente los problemas se detectan durante el uso cotidiano.

Los encargados revisan lo ocurrido y permanecen atentos al equipamiento.

Algunas situaciones graves son comunicadas mediante Instagram, aunque no existe evidencia de que este sea siempre el procedimiento utilizado.

También realizan inventarios cuando se los solicita la jefatura.

**Decisión para AforoFit:**

El encargado podrá cambiar el estado de una máquina entre:

- Disponible.
- En mantención.

Cuando una máquina incluida en una rutina esté marcada como en mantención, el alumno deberá visualizar una advertencia.

Por ahora no se exigirá el reemplazo automático del ejercicio.

### 11. ¿Los alumnos llevan sus propias rutinas o reciben orientación?

Los estudiantes pueden llevar sus rutinas personales y también recibir orientación de los profesores de Educación Física.

El encargado valoró positivamente que AforoFit permita diferentes alternativas:

- Rutinas generadas automáticamente.
- Rutinas creadas por el alumno.
- Rutinas creadas o asignadas por el profesor.

Estas modalidades fueron consideradas interesantes, pero todavía debe decidirse cuáles podrán implementarse dentro del plazo.

No se validaron los algoritmos específicos de generación ni la progresión de cargas.

---

## D. Préstamo de implementos

### 12. ¿Qué implementos prestan y cómo funciona su devolución?

Los implementos se prestan para utilizarse **fuera del gimnasio, principalmente en las canchas y espacios deportivos**.

Entre los materiales mencionados se encuentran:

- Balones de básquetbol.
- Balones de vóleibol.
- Balones de fútbol o futsal.
- Paletas de tenis de mesa.
- Pelotas de tenis de mesa.

Al solicitar materiales, el estudiante entrega su TNE universitaria como garantía.

Cuando devuelve los implementos, recupera la tarjeta.

**Problemas identificados:**

- Los alumnos pueden devolver materiales incompletos.
- Los profesores pueden olvidar qué elementos entregaron.
- Algunos estudiantes devuelven los materiales, pero olvidan retirar su pase.
- Pueden quedar materiales sin devolver o abandonados.

El encargado consideró útil registrar quién solicitó los implementos, a qué hora, cuáles recibió y cuáles devolvió.

**Decisiones para AforoFit:**

- Los préstamos son independientes del ingreso al gimnasio.
- Un préstamo no modifica el aforo.
- Una solicitud puede contener varios implementos.
- Se deben registrar entregas y devoluciones parciales.
- Debe identificarse si la TNE utilizada como garantía ya fue devuelta.

**Pendiente:** obtener las cantidades exactas de implementos disponibles.

---

## E. Validación de AforoFit

### 13. ¿Qué opinión tiene sobre identificarse con una credencial y recibir una rutina?

El encargado consideró positivo automatizar el ingreso mediante credencial o código.

Le pareció especialmente útil registrar automáticamente las entradas y salidas para mantener actualizado el aforo.

Respecto a las rutinas, manifestó interés en la generación automática y en las alternativas de creación o asignación por profesores y alumnos.

No expresó un rechazo general al sistema.

**Aspectos todavía no validados:**

- Compatibilidad técnica del lector.
- Funcionamiento de la identificación en el computador del gimnasio.
- Uso de las rutinas por estudiantes con diferentes preferencias.
- Algoritmos de generación y progresión de cargas.

### 14. ¿Qué opina sobre repartir el orden de los ejercicios y gestionar máquinas en mantención?

El encargado manifestó dudas sobre la factibilidad de distribuir automáticamente el orden de los ejercicios para evitar coincidencias.

No prohibió realizar la prueba, pero explicó que no lo consideraba especialmente factible debido a la manera en que entrenan actualmente los estudiantes.

**Decisión:** mantener el reparto automático como una propuesta pendiente de mayor validación de usuarios y de una prueba de factibilidad.

Para las máquinas en mantención se definió un alcance inicial más sencillo: mostrar una advertencia en la rutina cuando una máquina esté fuera de servicio.

No se contempla exigir reemplazos automáticos para el prototipo actual.

### 15. ¿Existe infraestructura para conectar un lector de credenciales?

Sí.

El gimnasio dispone de:

- Computador All-in-One.
- Conexión a internet.
- Puerto USB disponible.

Esto permite plantear la utilización de un lector NFC USB compatible con emulación de teclado.

**Pendiente:** adquisición y pruebas físicas a cargo de Pau Urzúa.

---

## F. Cierre

### 16. ¿Qué actividad le gustaría simplificar?

El encargado destacó principalmente el control del ingreso, la salida y el aforo.

Actualmente los profesores deben supervisar la ocupación mientras realizan otras funciones.

Le pareció beneficioso que los alumnos registraran sus entradas y salidas electrónicamente.

También valoró mejorar el control de préstamos para evitar confusiones con los implementos entregados.

### 17. ¿Existe algún otro problema importante?

El encargado señaló que, en términos generales, se habían abordado los principales problemas del gimnasio.

Recalcó las dificultades relacionadas con el aforo y explicó que los alumnos suelen organizar sus propias rutinas o recibir orientación de los profesores.

No identificó otro problema principal adicional en esa parte de la entrevista.

### 18. ¿Podemos volver a mostrar el prototipo?

Sí.

El encargado manifestó disponibilidad para recibir demostraciones posteriores.

Se conversó sobre realizar visitas los martes, después de las presentaciones de avances de Ingeniería de Software.

Se consideró aproximadamente las 17:00 horas como un horario posible, en el que podrían coincidir ambos profesores.

La disponibilidad es favorable, pero las visitas específicas deberán coordinarse.

---

## G. Documentación oficial complementaria

### 1. Instagram del gimnasio

**Cuenta:** @gimnasio.bellavistauss

**Enlace:** https://www.instagram.com/gimnasio.bellavistauss/

Según la información proporcionada, su descripción establece:

| Día | Horario | Último acceso |
|---|---|---|
| Lunes a viernes | 08:00–22:00 | 21:00 |
| Sábado | 08:00–14:00 | 13:00 |

La cuenta también dirige a los usuarios hacia un formulario de inscripción.

### 2. Formulario de inscripción

**Nombre:** Inscripción Sala de Musculación

**Enlace:** https://docs.google.com/forms/d/e/1FAIpQLSeJ7KV11cB9pe2jNequL7wGTgZzqIwI8apf7YamqCPk2rGEFQ/viewform

El formulario solicita:

| Campo | Carácter |
|---|---|
| Nombre completo | Obligatorio |
| RUT sin puntos y con guion | Obligatorio |
| Correo institucional | Obligatorio |
| Fecha de nacimiento | Obligatorio |
| Teléfono | Obligatorio |
| Contacto de emergencia | Obligatorio |
| Teléfono de emergencia | Obligatorio |
| Datos de salud: enfermedades, lesiones u otros | Obligatorio |
| Tipo de inscripción | Estudiante o funcionario/colaborador |

Al subir archivos y enviar el formulario, Google también informa que registra el nombre, fotografía y correo asociados a la cuenta utilizada.

**Consideración para AforoFit:** aunque el formulario oficial recopila información personal y de salud, el prototipo académico trabajará exclusivamente con datos ficticios y no necesita reproducir todos estos campos.

### 3. Reglas oficiales de ingreso y entrenamiento

Según el formulario proporcionado, los usuarios deben:

- Indicar el RUT al profesor responsable.
- Contar con una toalla de mano para uso personal.
- Utilizar vestimenta y calzado deportivo.
- No entrenar con jeans ni ropa clínica.
- Permanecer en la sala únicamente si están entrenando; no se permiten acompañantes.
- Mantener ordenados discos, mancuernas y accesorios.
- Utilizar toalla durante el entrenamiento.
- Consultar al profesor ante dudas.
- Comunicar al profesor cualquier desperfecto o ruido extraño.

Estas reglas forman parte de las condiciones de utilización del gimnasio.

No todas requieren una validación informática. Algunas corresponden a normas de comportamiento y supervisión presencial.

### 4. Diferencia entre el formulario real y el alcance de AforoFit

El formulario oficial permite inscribirse como estudiante o funcionario/colaborador.

Sin embargo, el alcance académico inicial de AforoFit contempla únicamente estudiantes.

**Decisión actual:** mantener el prototipo limitado a alumnos y no incorporar funcionarios sin una decisión posterior del equipo.

Esta diferencia se documenta como una limitación del alcance, no como un error del formulario oficial.

---

## H. Registro de observaciones

### Principales problemas identificados

**P1. Registro manual de ingresos.** Los datos se anotan en papel y posteriormente se traspasan a Excel.

**P2. Ausencia de registro de salidas.** No existe información automática sobre cuántos alumnos permanecen dentro.

**P3. Control manual del aforo.** Los profesores deben supervisar la ocupación mientras atienden otras áreas.

**P4. Esperas administradas manualmente.** Cuando se alcanza la capacidad, se gestionan los turnos mediante números e indicaciones.

**P5. Riesgo de devoluciones incompletas.** La administración de préstamos depende de recordar qué materiales se entregaron.

**P6. Revisión administrativa de certificados.** La habilitación requiere revisión de documentos y control mediante Excel.

**P7. Coincidencia en determinadas máquinas.** En horarios concurridos pueden producirse esperas en poleas y estaciones de press banca.

### Necesidades identificadas

1. Digitalizar entradas y salidas.
2. Mantener actualizado el aforo.
3. Gestionar un límite configurable de ocupación.
4. Facilitar la administración de esperas.
5. Registrar préstamos y devoluciones.
6. Controlar la habilitación según año académico.
7. Disponer de un catálogo fotográfico de máquinas.
8. Informar las máquinas en mantención.
9. Facilitar la gestión de rutinas.
10. Reducir tareas administrativas repetitivas.

### Funcionalidades valoradas por el encargado

- Identificación mediante credencial o código.
- Registro electrónico de entradas y salidas.
- Visualización del aforo actualizado.
- Administración de préstamos.
- Inventario fotográfico.
- Generación de rutinas.
- Creación o asignación de rutinas por alumnos o profesores.
- Demostraciones posteriores del prototipo.

### Decisiones actuales del equipo

| Código | Decisión |
|---|---|
| D01 | Capacidad inicial de 20 personas, configurable |
| D02 | Registro de salida independiente de las rutinas |
| D03 | Certificados vinculados a períodos académicos configurables |
| D04 | Préstamos independientes del ingreso al gimnasio |
| D05 | Máquinas con estados Disponible y En mantención |
| D06 | Advertencia de mantención visible en las rutinas |
| D07 | Mantener inicialmente la progresión configurable de cargas |
| D08 | Reparto automático sujeto a validación adicional |
| D09 | Evaluar modalidades alternativas de creación de rutinas |
| D10 | Mantener el prototipo limitado a alumnos |
| D11 | No recopilar datos reales ni información médica sensible para las pruebas |

### Parámetros iniciales de progresión

Se mantienen los definidos originalmente para AforoFit:

- Fácil: +2,5 kg.
- Justo: mantener la carga.
- Me costó: −5 %.

Estos valores son parámetros iniciales configurables. Todavía no se ha validado su idoneidad para todos los ejercicios.

---

## I. Pendientes de validación

| N.º | Pendiente | Responsable |
|---|---|---|
| 1 | Inventario completo de máquinas con cantidades, características y fotografías | Bastián |
| 2 | Cantidades exactas de implementos disponibles para préstamo | Bastián / Vicente |
| 3 | Cotización y compatibilidad del lector NFC con las tarjetas | Pau |
| 4 | Viabilidad práctica del reparto automático de ejercicios | Vicente / Equipo |

**Acciones complementarias:**

- Solicitar fotografías e inventarios por Instagram cuando sea necesario.
- Probar las credenciales físicamente.
- Consultar a nuevos usuarios sobre el reparto de ejercicios.
- Utilizar datos confirmados para los catálogos y datos ficticios cuando corresponda a las pruebas.

### Valores provisionales

- **Asistencia diaria:** estimación de 80–90 alumnos.
- **Período académico:** 3 de marzo a 23 de diciembre, supuesto de desarrollo pendiente de confirmación oficial.
- **Progresión de cargas:** parámetros iniciales que requieren validación técnica.

---

## J. Conclusiones de la entrevista para el Avance 2

### Conclusión 1. Problema principal

El gimnasio presenta dificultades para controlar su ocupación debido al registro manual de ingresos, la falta de registro de salidas y las múltiples responsabilidades de sus profesores.

### Conclusión 2. Digitalización de procesos

AforoFit puede contribuir a disminuir las tareas administrativas mediante identificación electrónica, registro de asistencia, control de aforo y seguimiento de préstamos.

### Conclusión 3. Validación con usuario real

El encargado valoró positivamente varias funcionalidades propuestas, especialmente el ingreso y salida mediante identificación, el control de implementos y la gestión de rutinas.

### Conclusión 4. Ajustes del diseño

La entrevista permitió identificar que los préstamos ocurren fuera del gimnasio y que el reparto automático de ejercicios necesita más validación.

También se decidió simplificar inicialmente la gestión de mantenciones, mostrando advertencias a los alumnos sin exigir sustituciones automáticas.

### Conclusión 5. Factibilidad técnica

El gimnasio dispone de computador, conexión a internet y puertos USB para realizar pruebas del sistema.

La compatibilidad del lector y las credenciales todavía debe comprobarse.

### Conclusión 6. Alcance del prototipo

Aunque el procedimiento oficial permite inscripciones de funcionarios, AforoFit mantendrá inicialmente su alcance académico limitado a estudiantes.

Los datos utilizados serán ficticios y no se recopilarán antecedentes personales reales para las pruebas.

### Conclusión general

La entrevista y la revisión de información institucional permitieron identificar problemas concretos del gimnasio USS Bellavista, contrastar los supuestos iniciales de AforoFit y establecer decisiones fundamentadas para su diseño.

La información será utilizada para construir los requisitos funcionales y no funcionales, los casos de uso, los criterios de aceptación, el modelo de datos y la arquitectura del Avance 2.

Las decisiones del proyecto que difieran de `AGENTS.md` deberán incorporarse a la documentación oficial del repositorio una vez revisadas y aprobadas por el equipo.

---

## K. Checklist de entrevista

**Estado: 6/6 actividades completadas.**

- [x] Entrevista realizada y respuestas registradas.
- [x] Problemas reales identificados y separados de los supuestos.
- [x] Requisitos de AforoFit contrastados con las respuestas.
- [x] Información relevante enviada a Benjamín para el modelo de datos.
- [x] Información de equipamiento compartida con Bastián.
- [x] Conclusiones breves para la sección de análisis del PPT.

**Responsables informados:**
- Benjamín Velásquez: modelo de datos, arquitectura y reglas de negocio.
- Bastián González: inventario, catálogo y diseño de interfaces administrativas.

**Estado final:** Levantamiento inicial de requisitos completado y antecedentes distribuidos al equipo.

**Próxima etapa:** elaboración de requisitos priorizados, casos de uso, criterios de aceptación y presentación del Avance 2 del martes 17 de noviembre de 2026.