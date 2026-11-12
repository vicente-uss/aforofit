# AGENTS.md — Contexto del proyecto AforoFit

Este archivo es la fuente única de contexto para cualquier IA o persona que trabaje en el proyecto.
Si algo de aquí contradice otro documento, manda este archivo. Si cambias el alcance, las reglas o
el estado, actualiza este archivo en el mismo pull request.

Última actualización: jueves 12 de noviembre de 2026, después de la entrevista con el encargado del gimnasio
(ver `docs/entrevista-encargado-2026-11-12.md`).

## 1. Qué es AforoFit

Sistema web para el gimnasio (sala de musculación) de la **Universidad San Sebastián (USS), sede Bellavista**.
Lo usan **solo alumnos** de la universidad. Es el **Proyecto Integrador** (evaluación Solemne) del
ramo Taller de Ingeniería de Software, Grupo 6, noviembre–diciembre de 2026.

Es un **prototipo académico**: se trabaja con **datos ficticios**, sin conexión a los sistemas
reales de la USS y sin datos médicos reales. Debe ejecutarse en vivo en la demostración final.

### Datos reales del gimnasio (entrevista del 12 de noviembre)

| Dato | Valor |
|---|---|
| Horario | Lunes a viernes 08:00–22:00 (último ingreso 21:00) · sábado 08:00–14:00 (último ingreso 13:00) |
| Capacidad | 20 personas simultáneas (límite operativo usado hoy) |
| Asistencia | 80 a 90 alumnos al día (estimación del encargado) |
| Horas peak | Aproximadamente 09:00–13:00 |
| Personal | Dos profesores de Educación Física, que además atienden la cancha y tareas administrativas |
| Máquinas con esperas | Poleas y estaciones de press banca |
| Infraestructura | Computador All-in-One con internet y puerto USB disponible en el gimnasio |
| Habilitación | Certificado médico vigente; habilita durante el año académico, no 365 días |

### Situación actual (problema)

- **P1.** El ingreso se anota en papel (nombre, RUT, carrera, fecha y hora) y después se traspasa a Excel.
- **P2.** No se registran las salidas: nadie sabe cuántas personas siguen adentro.
- **P3.** El aforo se controla a ojo, mientras los profesores atienden otras áreas.
- **P4.** Cuando se llega a 20 personas, la espera se maneja a mano (a veces entregan un número).
- **P5.** Los préstamos de implementos dependen de recordar qué se entregó; hay devoluciones incompletas
  y alumnos que olvidan retirar la TNE que dejaron como garantía.
- **P6.** Los certificados médicos se revisan a mano y su vigencia se lleva en Excel.
- **P7.** En horas peak hay esperas en poleas y press banca.
- Cada alumno arma su rutina o pide orientación a los profesores.

### Idea central (la solución)

> La entrada es el único momento en que todos pasan por el mismo lugar. Ahí el sistema decide.

1. El alumno pasa su **credencial** (tarjeta con chip) por un lector en la entrada.
2. El sistema lo identifica, valida que esté **habilitado** y dentro del **horario**, y registra la entrada.
3. Si el gimnasio está lleno, el alumno pasa a una **lista de espera** con número de turno.
4. Su **rutina del día** aparece en su celular, con pesos, ajustes de máquina y **advertencias** si alguna máquina está en mantención.
5. Al salir, pasa la credencial: se registra la **salida** y el aforo se actualiza. Si usó la rutina, responde
   **fácil / justo / me costó** y su próxima rutina se ajusta.
6. Una pantalla pública muestra el **aforo en vivo**.
7. El profesor registra los **préstamos de implementos** (para la cancha) con la TNE del alumno.

El registro de entrada y salida **no depende** de que el alumno use la rutina.

### Lo innovador (estado del arte)

Las apps de rutina existentes (SmartGym, GymTime, EGYM) son individuales. Los controles de acceso solo
abren la puerta. **No encontramos** un sistema que use el ingreso para activar la rutina de cada alumno
con el estado del gimnasio en ese momento. (Decirlo siempre como "no encontramos", nunca como "no existe".)

El **reparto automático del orden de ejercicios** sigue siendo la idea más innovadora, pero el encargado
dudó de su factibilidad: es **experimental** y requiere una prueba de factibilidad antes de comprometerlo (D08).

## 2. Usuarios (roles)

| Rol | Qué hace |
|---|---|
| **Alumno** | Entra y sale con su credencial, recibe su rutina, da feedback al salir, registra sus medidas corporales. |
| **Profesor encargado** | Profesor de Educación Física a cargo del gimnasio (hoy son dos). Supervisa ingreso y aforo, gestiona la lista de espera, registra préstamos y devoluciones, cambia el estado de las máquinas y puede ajustar la rutina de un alumno. |
| **Administrador** | Registra máquinas (con fotos) e implementos, habilita alumnos según su certificado y período académico, configura parámetros y revisa reportes. |

Solo alumnos. Los funcionarios y colaboradores pueden inscribirse en el gimnasio real, pero quedan
fuera del prototipo (D10, limitación de alcance documentada).

## 3. Alcance

### Prioridad alta (comprometido para la entrega final)

- **Ingreso y salida con credencial** (credencial USS o TNE) y QR como respaldo (D02).
- **Aforo en vivo** con capacidad configurable (inicial: 20) en una pantalla pública (D01).
- **Lista de espera** con número de turno cuando el gimnasio está lleno.
- **Habilitación** de alumnos con certificado vigente por **período académico** configurable (D03).
- **Préstamo de implementos**: una solicitud con varios implementos, devoluciones parciales y registro de la TNE
  entregada como garantía. Independiente del ingreso y del aforo (D04).
- **Catálogo del gimnasio**: máquinas con fotos e implementos con cantidades.
- **Estado de máquinas**: Disponible / En mantención, con **advertencia en la rutina** del alumno (D05, D06).
- ★ **Rutina activada por la credencial**: aparece en el celular con pesos y ajustes de máquina.
- ★ **Feedback al salir y progresión de cargas** con parámetros configurables (D07). En rutinas asignadas por el
  profesor, el feedback se registra pero las cargas no cambian automáticamente.
- **Rutinas de tres orígenes** (D15): generadas por el sistema, creadas o asignadas por el profesor, o creadas por el alumno.
  El alumno elige su rutina activa; el administrador habilita o deshabilita cada modalidad.
- **Usuarios y roles**: alumno, profesor encargado, administrador.
- **Registro corporal privado**: el alumno anota peso y perímetros (datos ficticios en las pruebas); IMC y evolución.

★ = no encontrado en soluciones existentes.

### Prioridad media (solo si el núcleo está listo y probado)

- ★ **Reparto del orden de ejercicios** — experimental, primero una prueba de factibilidad (D08).
- Registro de incidencias de mal uso.
- Reportes: asistencia por carrera y horario, horas peak, uso de máquinas y préstamos.
- Alumnos en riesgo: aviso cuando un alumno deja de venir.

Nada de prioridad media puede aparecer en el pendón como implementado si no lo está.

### Trabajo futuro (declarado, no se construye)

Reemplazo automático de ejercicios por máquina en mantención · pronóstico de ocupación por zona ·
limpieza y mantención según uso · notificaciones y gamificación · informe PDF de evaluación ·
inscripción de funcionarios y colaboradores.

### Fuera del alcance (no construir, no sugerir)

Conexión con los sistemas reales de la USS · datos reales de alumnos o información médica real ·
subir o validar certificados médicos (solo se registra la vigencia) · app nativa · otras sedes ·
torniquetes y puertas automáticas · sensores o cambios en las máquinas · registrar series durante el
entrenamiento · pagos · reconocimiento facial · IA generativa dentro del producto.

## 4. Reglas de negocio

Cada regla debe tener una validación en el código o una restricción en la base de datos, y un caso de prueba.
Todos los valores numéricos y fechas son **parámetros configurables**, no fijos en el código.

1. **Credencial única**: una credencial pertenece a un solo alumno; si no está registrada, se ofrece vincularla.
2. **Habilitación**: solo ingresa un alumno con certificado vigente para el período académico en curso
   (inicial: 3 de marzo al 23 de diciembre, supuesto pendiente de confirmación oficial).
3. **Horario**: solo se permite ingresar dentro del horario y antes del último ingreso
   (lunes a viernes hasta 21:00, sábado hasta 13:00; domingo cerrado).
4. **Capacidad**: si hay 20 personas adentro (configurable), el alumno pasa a la lista de espera con número de turno
   y entra cuando se libera un cupo, en orden de llegada.
5. **Entrada y salida**: una visita abierta por alumno a la vez; la salida cierra la visita y libera el cupo.
6. **Cierre automático**: si el alumno no marca salida, la visita se cierra sola a las 3 horas. Es un respaldo:
   la ocupación registrada puede no coincidir con la real.
7. **Mantención**: una máquina En mantención aparece con advertencia en las rutinas que la incluyen
   (sin reemplazo automático en este prototipo).
8. **Progresión**: fácil = +2,5 kg · justo = igual · me costó = −5 %. Si el profesor ajustó la rutina, manda su versión.
   Valores iniciales, aún no validados para todos los ejercicios.
9. **Préstamos**: una solicitud puede tener varios implementos; se registran devoluciones parciales; un alumno con
   implementos pendientes no puede abrir otra solicitud; el sistema indica si la TNE de garantía ya fue devuelta.
   Los préstamos no cambian el aforo.

## 5. Flujo central (lo que se demuestra en vivo)

| Etapa | Qué pasa | Requisito de las bases |
|---|---|---|
| Ingreso | Credencial en el lector → se identifica al alumno | Captura de información |
| Proceso | Validación de habilitación, horario y capacidad → entrada o lista de espera; rutina del día con pesos y advertencias | Procesamiento y validación |
| Persistencia | Se registran entrada, salida y feedback | Persistencia |
| Salida | Rutina en el celular y aforo actualizado en la pantalla | Salida verificable |
| Consulta | Próxima rutina ajustada, historial de visitas y préstamos | Consulta verificable |

## 6. Stack y arquitectura

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind, web responsiva. Creado con la plantilla oficial `with-supabase`.
- **Backend y base de datos**: Supabase (PostgreSQL + Auth + Realtime).
- **Despliegue**: Vercel. Cada push a `main` publica en producción; cada pull request genera una vista previa.
- **Lector de credenciales**: lector NFC USB de 13,56 MHz en modo teclado (HID), conectado al computador
  All-in-One del gimnasio. Al acercar la tarjeta escribe su UID como texto seguido de Enter. En la app es solo un
  campo de texto enfocado. Registrar siempre las credenciales con el mismo lector.
- **Respaldo de ingreso**: código QR.

```
Lector USB (teclado) ──► Computador del gimnasio (navegador) ──► Next.js en Vercel ◄──► Supabase
                                                                       ▲
Celular del alumno ────────────────────────────────────────────────────┤  (rutina)
Pantalla pública ──────────────────────────────────────────────────────┘  (aforo en vivo)
```

### Variables de entorno

Solo estas dos, en `.env.local` (local) y en Vercel (producción):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Nunca usar ni subir la clave `secret` / `service_role`. Nunca subir `.env.local`.

## 7. Convenciones

- **Idioma**: interfaz, textos, commits y documentación en español de Chile. Nombres de dominio
  (tablas, columnas, componentes de negocio) en español, en `snake_case` para la base de datos,
  sin tildes ni ñ en identificadores (`alumnos`, `maquinas`, `prestamos`).
- **Base de datos**: Row Level Security activado en todas las tablas. El alumno solo ve sus datos;
  el registro corporal solo lo ve su dueño. Guarda cada SQL que ejecutes en Supabase en
  `supabase/sql/NNN_descripcion.sql` (ej. `001_tablas_iniciales.sql`) para tener historial.
- **Parámetros**: capacidad, horario, período académico, progresión y cierre automático viven en una
  tabla de configuración editable por el administrador.
- **Ramas**: `main` siempre funciona. Una rama por tarea (`ingreso-credencial`, `prestamos`) y
  pull request revisado por otro integrante antes de fusionar.
- **Simplicidad**: es un prototipo de 3 semanas hecho por 5 estudiantes. Preferir la solución más
  simple que cumpla la regla. No agregar librerías sin necesidad clara.
- **Datos**: solo datos ficticios. Nunca datos reales de alumnos ni información médica.

### Comandos

```
npm install       # instalar dependencias
npm run dev       # desarrollo en http://localhost:3000
npm run build     # verificar que compila antes de un pull request
npm run lint      # revisar estilo
```

## 8. Equipo

| Integrante | Rol | Responsable de |
|---|---|---|
| Vicente Galleguillos | Jefe de proyecto | Plan, requisitos, estimación, plan de pruebas, documentación, PPT de avances, relación con el encargado |
| Benjamín Velásquez | Backend y reglas de negocio | Modelo de datos, generador de rutina, progresión, capacidad y lista de espera |
| Pau Urzúa | Ingreso y hardware | Lector de credenciales, QR de respaldo, entrada y salida, aforo en vivo, préstamo de implementos |
| Isidora Moscoso | Frontend alumno y encargado | Rutina en el celular, feedback, panel del profesor encargado, registro corporal |
| Bastián González | Administración y QA | Catálogo con fotos, inventario de implementos, habilitación, reportes, diseño del pendón, ejecución de pruebas |

Las tareas se siguen en el documento **"AforoFit — Plan de acción del proyecto"** (cada uno marca su casilla).
Las guías de arranque están en **"AforoFit — Kit de arranque"**.

## 9. Calendario

Clases: martes 13:10–16:00 (los avances se entregan los martes) y jueves 11:00–12:20 (consultas).
El encargado está disponible para ver el prototipo los martes cerca de las 17:00, después de clases.

| Fecha | Hito | Contenido exigido |
|---|---|---|
| Mar 10 nov | Avance 1 ✅ | Aprobado con nota máxima, sin observaciones |
| **Mar 17 nov** | **Avance 2** | Requisitos funcionales y no funcionales priorizados · actores, casos de uso y criterios de aceptación · modelo de datos · arquitectura y diseño de interfaces · evidencia de avance técnico · ajustes desde el Avance 1 (entrevista) |
| Mar 24 nov | Avance 3 | Estimación LOC y/o puntos de función con supuestos · esfuerzo, duración, recursos y riesgos · demo del prototipo · pruebas iniciales · borrador del pendón |
| Jue 26 nov | Pendón definitivo | Aprobado y enviado a imprimir; solo funcionalidades implementadas o marcadas como futuras |
| Lun 30 nov | Congelamiento | Desde aquí solo correcciones |
| 1–3 dic | Entrega final y expo (70 % de la nota) | Prototipo funcionando en vivo, código con instrucciones, evidencia de pruebas, pendón instalado, defensa de todos |

## 10. Estado actual

Actualizado: jueves 12 de noviembre de 2026.

**Hecho**
- Avance 1 aprobado con nota máxima.
- Repositorio en GitHub, proyecto en Supabase y despliegue en Vercel creados.
- Entrevista con el encargado del gimnasio (decisiones D01–D11).

**Pendiente para el Avance 2 (martes 17)**
- [ ] Comprar el lector NFC USB tipo teclado y probarlo con la credencial USS, la TNE y la Bip! (Pau)
- [ ] Inventario de máquinas con fotos y cantidades exactas de implementos (Bastián)
- [ ] Primer borrador del modelo de datos con las reglas actualizadas (Benjamín)
- [ ] Revisión de pantallas del alumno y del profesor encargado (Isidora)
- [ ] Requisitos priorizados, casos de uso y criterios de aceptación (Vicente)

**Decisiones tomadas** (entrevista del 12 de noviembre)

| Código | Decisión |
|---|---|
| D01 | Capacidad inicial de 20 personas, configurable |
| D02 | Registro de salida independiente de las rutinas |
| D03 | Certificados vinculados a períodos académicos configurables |
| D04 | Préstamos independientes del ingreso al gimnasio |
| D05 | Máquinas con estados Disponible y En mantención |
| D06 | Advertencia de mantención visible en las rutinas (sin reemplazo automático) |
| D07 | Progresión de cargas con parámetros configurables |
| D08 | Reparto automático sujeto a validación adicional (experimental) |
| D09 | Evaluar rutinas creadas por el alumno o asignadas por el profesor |
| D10 | Prototipo limitado a alumnos |
| D11 | Sin datos reales ni información médica sensible en las pruebas |
| D12 | Generación de rutina: el alumno define objetivo (fuerza, hipertrofia, salud) y nivel (principiante, intermedio); el sistema usa plantillas por objetivo y nivel con solo máquinas registradas |
| D13 | Entrega al celular: el alumno inicia sesión una vez en la app web; al pasar la credencial, su sesión abierta recibe la rutina en tiempo real |
| D14 | Lista de espera: número de turno; la pantalla muestra el turno llamado y el alumno vuelve a pasar la credencial |
| D15 | Origen de la rutina configurable: generada por el sistema, creada o asignada por el profesor, o creada por el alumno; el alumno elige su rutina activa y el administrador habilita cada modalidad |
| D16 | Préstamo con el lector: el profesor pasa la TNE, marca los implementos y la TNE queda como garantía; en la devolución marca lo que vuelve |

Requisitos (RF01–RF31, RNF01–RNF11), casos de uso (CU01–CU16) y criterios de aceptación (CA01–CA22):
documento **"AforoFit — Requisitos, casos de uso y criterios de aceptación"**.

Otras decisiones: ingreso con credencial con chip y QR de respaldo · repositorio público (Vercel Hobby solo
despliega commits del dueño en repos privados) · las tareas viven en el plan de acción, no en GitHub ·
la IA se usa para casi todo y el equipo revisa y decide.

**Preguntas abiertas**
- ¿La credencial USS tiene chip de 13,56 MHz con UID fijo? ¿Y la TNE?
- Cantidades exactas de implementos disponibles para préstamo.
- ¿Es factible el reparto automático de ejercicios? (prueba de factibilidad y consulta a usuarios)
- Fechas oficiales del período académico.

## 11. Cómo debe trabajar una IA en este proyecto

1. Lee este archivo completo antes de proponer o escribir código.
2. Respeta el alcance: si algo no está en la sección 3, pregunta antes de agregarlo.
3. Cada regla de negocio (sección 4) debe quedar validada y con su caso de prueba.
4. Responde y escribe en español; código simple y comentado donde la lógica no sea obvia.
5. Al terminar una tarea, indica qué partes de la sección 10 (Estado actual) hay que actualizar.
6. Nunca expongas claves ni uses datos reales de alumnos o información médica.
