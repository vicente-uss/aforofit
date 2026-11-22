# AGENTS.md — Contexto del proyecto AforoFit

Para una lectura integral, usa el [documento maestro](docs/cierre-avances-1-y-2.md). Incluye las decisiones, reglas, requisitos, criterios, diagramas, evidencia y entrevista. Este archivo conserva las instrucciones de trabajo y el estado de referencia.

Este archivo es la fuente única de contexto para cualquier IA o persona que trabaje en el proyecto.
Si algo de aquí contradice otro documento, manda este archivo. Si cambias el alcance, las reglas o
el estado, actualiza este archivo en el mismo pull request.

Última actualización: martes 17 de noviembre de 2026, al cierre del Avance 2.

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

- **Ingreso y salida con credencial**: la TNE es la credencial principal (D17); la TUI (credencial USS) también se contempla. QR como respaldo.
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

Nada de prioridad media puede aparecer en el afiche como implementado si no lo está.

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

**Validaciones abiertas:** crear un criterio directo para la unicidad de visita abierta (R5) y confirmar si la garantía TNE pendiente bloquea otro préstamo después de devolver todos los implementos (R9). El modelo de estados representa ese bloqueo.

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
- **Lector de credenciales**: lector USB de 13,56 MHz para tarjetas MIFARE, en modo teclado (HID), conectado al
  computador All-in-One del gimnasio. Elegido: "Lector Usb Tarjeta Llavero Rfid Id Serie 13.56 Mhz Mf1 S50"
  ($14.990 + $3.990 de envío = $18.980, Mercado Libre), comprado por Pau. Según el vendedor, el lector escribe el UID como
  **número decimal con los bytes en orden inverso (LSB)** y presiona Enter. Falta comprobarlo con el lector físico.
  La app recibe el código en un campo enfocado y `normalizarUid` lo convierte al formato hexadecimal de NFC Tools
  (ej. ficticio: `0729785092` → `04:A3:7F:2B`), previsto para `tarjetas.uid`. Detalle en
  `docs/pruebas-tarjetas.md`.
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
npm test          # pruebas unitarias (Vitest)
```

## 8. Equipo

| Integrante | Rol | Responsable de |
|---|---|---|
| Vicente Galleguillos | Jefe de proyecto | Plan, requisitos, estimación, plan de pruebas, documentación, PPT de avances, relación con el encargado |
| Benjamín Velásquez | Frontend y prototipo | Prototipo en Figma Make, pantallas por actor, rutina en el celular, feedback, panel del profesor encargado, pantalla pública, registro corporal |
| Pau Urzúa | Ingreso y hardware | Lector de credenciales, QR de respaldo, entrada y salida, aforo en vivo, préstamo de implementos |
| Isidora Moscoso | Backend y base de datos | Supabase: modelo de datos, RLS, login con roles, generador de rutina, progresión, capacidad y lista de espera |
| Bastián González | Administración y QA | Catálogo con fotos, inventario de implementos, habilitación, reportes, diseño del afiche, ejecución de pruebas |

Las tareas se siguen en el documento **"AforoFit — Plan de acción del proyecto"** (cada uno marca su casilla).
Las guías de arranque están en **"AforoFit — Kit de arranque"**.

## 9. Calendario

Clases: martes 13:10–16:00 (los avances se entregan los martes) y jueves 11:00–12:20 (consultas).
El encargado está disponible para ver el prototipo los martes cerca de las 17:00, después de clases.

| Fecha | Hito | Contenido exigido |
|---|---|---|
| Mar 10 nov | Avance 1 ✅ | Aprobado con nota máxima (7,0), sin observaciones |
| Mar 17 nov | Avance 2 ✅ | Aprobado con nota máxima (7,0); al profesor le gustó especialmente el prototipo. Presentación en `docs/entregas/avances/` |
| **Mar 24 nov** | **Avance 3** | Estimación LOC y/o puntos de función con supuestos · esfuerzo, duración, recursos y riesgos · demo del prototipo · pruebas iniciales · propuesta de afiche y plan de cierre |
| Jue 26 nov | Afiche definitivo | Aprobado; formato según lo que el profesor envíe por Blackboard; solo funcionalidades implementadas o marcadas como futuras |
| Lun 30 nov | Congelamiento | Desde aquí solo correcciones |
| 1–3 dic | Entrega final y expo (70 % de la nota) | Prototipo funcionando en vivo, código con instrucciones, evidencia de pruebas, afiche, defensa de todos |

## 10. Estado actual

Actualizado: domingo 22 de noviembre de 2026.

**Hecho**
- Avance 1 aprobado con nota máxima (7,0).
- Avance 2 aprobado con nota máxima (7,0). Presentación (PDF, 23 láminas) en `docs/entregas/avances/`.
- Repositorio en GitHub, proyecto en Supabase y despliegue en Vercel creados.
- Entrevista con el encargado del gimnasio (decisiones D01–D11).
- Requisitos, casos de uso y criterios de aceptación (`docs/requisitos-casos-uso-criterios.md`).
- Prototipo en Figma Make revisado y corregido (`docs/revision-prototipo-2026-11-16.md`).
- Diagramas de casos de uso, entidad-relación, secuencia del ingreso y estados (`docs/diagramas.md`).
- Prueba con NFC Tools en celular: se leyeron tres TNE y una TUI. Se eligió el lector USB para la prueba física
  (`docs/pruebas-tarjetas.md`).
- Login con roles: tabla `perfiles` con RLS y trigger, paneles `/alumno`, `/profesor` y `/admin`, rutas
  protegidas en el servidor y kiosco público en `/ingreso` (`supabase/sql/001_perfiles_roles.sql`).
- Contraseña de `admin.demo` rotada, según confirmó el equipo.
- Catálogo en Supabase: `maquinas` con el inventario real (11 tipos, 12 equipos), `implementos` y bucket público
  `maquinas` para las fotos (`supabase/sql/002` a `004`).
- Pantalla `/ingreso` de kiosco: captura el código recibido y normaliza el UID con `lib/ingreso/normalizarUid.ts`
  (pruebas en Vitest con `npm test`). Ingreso manual de respaldo; QR pendiente.
- Lector USB de 13,56 MHz comprado por Pau ($18.980 con envío, unos $3.800 por integrante). Probado el 20 de noviembre:
  funciona como teclado con TNE, TUI y tarjetas bancarias, y entrega el UID en decimal invertido como dijo el vendedor
  (`docs/pruebas-tarjetas.md`).
- Estimación del Avance 3: 207 puntos de función no ajustados (10,35 KLOC), COCOMO 81 orgánico de 27,9 PM,
  8,9 meses y 3,2 personas, recursos, costos y 16 riesgos (`docs/estimacion.md` y la planilla
  "AforoFit — Estimación Avance 3").
- Guion de la PPT del Avance 3 con presentador por lámina (documento "AforoFit — Guion PPT Avance 3").
- Contenido del afiche en formato billboard, con tabla de funciones mencionables y plan al 26 de noviembre
  (`docs/afiche-contenido.md`); falta el formato de Blackboard y el diseño (Bastián).
- Base de datos del flujo central aplicada en Supabase (`supabase/sql/005` a `009`): `alumnos`, `tarjetas`,
  `configuracion`, `visitas`, `turnos`, `aforo`, `registrar_ingreso` y `vincular_credencial`, con las reglas 1 a 6,
  RLS, Realtime en `aforo` y 25 alumnos ficticios. `admin.demo` quedó con rol `admin`.
- Pruebas SQL de las reglas: 42 casos en OK (`supabase/pruebas/registrar_ingreso.sql`).
- Prueba de punta a punta con las pantallas del pull request #7 (22 de noviembre): entrada, salida, rechazo, turno y
  `/aforo` en vivo funcionan. `/profesor/espera` se actualiza en menos de 2 s (medido el 22 de noviembre: turno
  1.011 ms, llamado 454 ms), con la corrección en el pull request #7 (commit `d7918be`).

**Pendiente**
- [ ] Confirmar las cantidades reales de implementos con el profesor encargado
- [ ] Comparar en `/ingreso` la lectura normalizada con NFC Tools por tarjeta (UID enmascarados) y medir CA29
- [ ] Avance 3 (24 nov): revisar y fusionar el pull request de la base (Isidora) y el #7 de las pantallas
- [ ] Activar en Supabase la protección contra claves filtradas (Vicente)
- [ ] Detalle menor aceptado: un turno llamado que nadie reclama expira recién cuando se pasa otra tarjeta, así que
  `/aforo` puede mostrar "Turno N" unos minutos de más
- [ ] Detalle menor aceptado: `vincular_credencial` con un UID de formato inválido devuelve un error de restricción y el
  kiosco lo muestra como "Sin conexión". No ocurre en la práctica porque el kiosco siempre envía el UID normalizado
- [ ] Avance 3: confirmar los supuestos de la estimación (horas por semana y factor LOC/PF); costo del afiche según Blackboard
- [ ] Avance 3: pruebas iniciales a partir de CA01–CA22 (Bastián), propuesta de afiche con plan de cierre y diseño de la PPT.
- [ ] Afiche: el pendón y el tríptico se reemplazan por un solo afiche (aviso del profesor del 19 de noviembre); el formato llega por Blackboard.

Ver el [cierre de los avances 1 y 2](docs/cierre-avances-1-y-2.md#pendientes-revisados) para el detalle de validaciones, evidencia y trabajo restante.

### Decisiones vigentes D01–D17

D01–D11 provienen de la entrevista, D12–D16 del diseño y D17 del levantamiento de credenciales.

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
| D17 | Credencial principal: la TNE (MIFARE Classic, 13,56 MHz, UID fijo) para ingreso y préstamos; la TUI (credencial USS) también funciona con el lector USB (probado por Pau el 20 de noviembre); la TNE queda como principal porque todos los alumnos la tienen; se descarta el carnet de identidad (UID aleatorio y datos personales); lector de 13,56 MHz |

Requisitos (RF01–RF31, RNF01–RNF11), casos de uso (CU01–CU16) y criterios de aceptación (CA01–CA22):
[documento de requisitos y trazabilidad](docs/requisitos-casos-uso-criterios.md#1-decisiones-y-trazabilidad). CA01–CA22 corresponden a la entrega original. La matriz incluye los criterios complementarios de la revisión documental.

Otras decisiones: ingreso con la TNE y QR de respaldo · repositorio público (Vercel Hobby solo
despliega commits del dueño en repos privados) · las tareas viven en el plan de acción, no en GitHub ·
la IA se usa para casi todo y el equipo revisa y decide.

**Preguntas abiertas**
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
