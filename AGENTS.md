# AGENTS.md — Contexto del proyecto AforoFit

Para una lectura integral, usa el [documento maestro](docs/cierre-avances-1-y-2.md). Incluye las decisiones, reglas, requisitos, criterios, diagramas, evidencia y entrevista. Este archivo conserva las instrucciones de trabajo y el estado de referencia.

Este archivo es la fuente única de contexto para cualquier IA o persona que trabaje en el proyecto.
Si algo de aquí contradice otro documento, manda este archivo. Si cambias el alcance, las reglas o
el estado, actualiza este archivo en el mismo pull request.

Última actualización: martes 24 de noviembre de 2026, después del Avance 3 y del Playback con el encargado.

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
| Habilitación | Certificado médico vigente; dura **un año desde su fecha de emisión** (Playback del 24 de noviembre, D20; corrige lo anotado en la entrevista, «año académico») |

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
| **Administrador** | Registra máquinas (con fotos) e implementos, habilita alumnos según la vigencia de su certificado, configura parámetros y revisa reportes. |

Acceso a pantallas: `/ingreso` es para profesor y administrador (CU11: ambos vinculan credenciales) y `/profesor/espera` es solo para el profesor (CU02: gestiona la lista).

Solo alumnos. Los funcionarios y colaboradores pueden inscribirse en el gimnasio real, pero quedan
fuera del prototipo (D10, limitación de alcance documentada).

## 3. Alcance

### Prioridad alta (comprometido para la entrega final)

- **Ingreso y salida con credencial**: la TNE es la credencial principal (D17); la TUI (credencial USS) también se contempla. QR como respaldo.
- **Aforo en vivo** con capacidad configurable (inicial: 20) en una pantalla pública (D01).
- **Lista de espera** con número de turno cuando el gimnasio está lleno.
- **Habilitación** de alumnos con certificado vigente: un año desde su emisión (D20, reemplaza D03).
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

**Línea base de la entrega final (D18, [CR-01](docs/cr-01-linea-base-entrega-final.md), aprobado el 23 de noviembre):**
de la prioridad alta se entrega en esta versión lo ya implementado (ingreso y salida, validaciones, aforo, lista de
espera y roles) más lo que se construye esta semana: objetivo y nivel, rutina por plantilla en el celular con aviso de
mantención, feedback con progresión y estado de máquinas (RF11, RF12, RF16 a RF18 y RF20). Si alcanza: préstamo básico
y pantalla de habilitación. Quedan **diseñados para una próxima versión**: rutinas creadas por el alumno o asignadas
por el profesor (RF13 a RF15), préstamos completos (RF22 a RF24), registro corporal (RF27) y las pantallas de
administración del catálogo y la configuración. En el afiche y la defensa van como próxima versión, nunca como
implementados.

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
2. **Habilitación**: solo ingresa un alumno con certificado vigente. El certificado dura **un año desde su fecha
   de emisión** (D20, confirmado por el encargado el 24 de noviembre): `certificado_hasta` = emisión + 12 meses.
   Ya no depende del período académico.
3. **Horario**: solo se permite ingresar dentro del horario y antes del último ingreso
   (lunes a viernes hasta 21:00, sábado hasta 13:00; domingo cerrado).
4. **Capacidad**: si hay 20 personas adentro (configurable), el alumno pasa a la lista de espera con número de turno
   y entra cuando se libera un cupo, en orden de llegada.
5. **Entrada y salida**: una visita abierta por alumno a la vez; la salida cierra la visita y libera el cupo.
6. **Cierre automático**: si el alumno no marca salida, la visita se cierra sola a las 3 horas. Es un respaldo:
   la ocupación registrada puede no coincidir con la real.
7. **Mantención**: una máquina En mantención aparece con advertencia en las rutinas que la incluyen
   (sin reemplazo automático en este prototipo).
8. **Progresión**: fácil = +2,5 kg · justo = igual · me costó = −5 %, redondeado al múltiplo de 2,5 kg más cercano
   (`redondeo_kg`). «Me costó» siempre baja al menos un paso y nunca deja la carga negativa (D25: sin eso, con 25 kg
   o menos el −5 % se perdía al redondear). Si el profesor ajustó la rutina, manda su versión.
   Valores iniciales, aún no validados para todos los ejercicios.
9. **Préstamos**: una solicitud puede tener varios implementos; se registran devoluciones parciales; un alumno con
   implementos pendientes **o con su TNE de garantía sin retirar** no puede abrir otra solicitud (D19); el sistema
   indica si la TNE de garantía ya fue devuelta. La TNE se deja físicamente con el profesor; pasarla por el lector no
   es obligatorio. Los préstamos no cambian el aforo.

**Validaciones cerradas:** R5 tiene criterio directo (CA44, con el índice único y la prueba SQL). R9 quedó confirmada en el Playback del 24 de noviembre: la TNE pendiente sí bloquea otro préstamo (D19; `docs/acta-playback-2026-11-24.md`).

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
  **número decimal con los bytes en orden inverso (LSB)** y presiona Enter (comprobado con el lector físico el 20 de noviembre).
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
- **Parámetros**: capacidad, horario, progresión y cierre automático viven en una
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
| Mar 24 nov | Avance 3 ✅ | Aprobado con nota máxima (7,0). Presentación en `docs/entregas/avances/` |
| **Jue 26 nov** | **Afiche definitivo** | Archivo cerrado: formato A0, con el nombre del profesor; solo funcionalidades implementadas o marcadas como futuras. Además, 20 trípticos a color, impresos en la facultad |
| Lun 30 nov | Congelamiento | Desde aquí solo correcciones |
| 1–3 dic | Entrega final y expo (70 % de la nota) | Prototipo funcionando en vivo, código con instrucciones, evidencia de pruebas, afiche y 20 trípticos, defensa de todos |

## 10. Estado actual

Actualizado: martes 24 de noviembre de 2026.

**Hecho**
- Avance 1 aprobado con nota máxima (7,0).
- Avance 2 aprobado con nota máxima (7,0). Presentación (PDF, 23 láminas) en `docs/entregas/avances/`.
- Avance 3 aprobado con nota máxima (7,0) el 24 de noviembre: los tres avances tienen 7,0.
- Repositorio en GitHub, proyecto en Supabase y despliegue en Vercel creados.
- Entrevista con el encargado del gimnasio (decisiones D01–D11).
- Requisitos, casos de uso y criterios de aceptación (`docs/requisitos-casos-uso-criterios.md`).
- Prototipo en Figma Make revisado y corregido (`docs/revision-prototipo-2026-11-16.md`).
- Diagramas de casos de uso, entidad-relación, secuencia del ingreso y estados (`docs/diagramas.md`).
- Prueba con NFC Tools en celular: se leyeron tres TNE y una TUI. Se eligió el lector USB para la prueba física
  (`docs/pruebas-tarjetas.md`).
- Login con roles: tabla `perfiles` con RLS y trigger, paneles `/alumno`, `/profesor` y `/admin`, rutas
  protegidas en el servidor (`supabase/sql/001_perfiles_roles.sql`).
- Contraseña de `admin.demo` rotada, según confirmó el equipo.
- Catálogo en Supabase: `maquinas` con el inventario real (11 tipos, 12 equipos), `implementos` y bucket público
  `maquinas` para las fotos (`supabase/sql/002` a `004`; fotos originales en `supabase/storage/maquinas/`).
- Pantalla `/ingreso` de kiosco: captura el código recibido y normaliza el UID con `lib/ingreso/normalizarUid.ts`
  (pruebas en Vitest con `npm test`). Ingreso manual de respaldo; QR pendiente.
- Lector USB de 13,56 MHz comprado por Pau ($18.980 con envío, unos $3.800 por integrante). Probado el 20 de noviembre:
  funciona como teclado con TNE, TUI y tarjetas bancarias, y entrega el UID en decimal invertido como dijo el vendedor
  (`docs/pruebas-tarjetas.md`).
- Estimación del Avance 3, versión 0.3 (rehecha el 23 de noviembre con el método de clase, semanas 5, 6 y 7): tamaño
  medido dos veces por separado, **207 PF no ajustados** con justificación por función y **5.350 LOC** por
  descomposición en componentes (1.855 medidas en el repo + 3.495 estimadas por analogía; escenarios 4.651 a 7.098),
  que coinciden en unas 26 LOC/PF. Fórmula inicial (esfuerzo = tamaño ÷ productividad): 2,97 PM por LOC con
  productividad de clase, 20,7 PM por PF con productividad de clase (no comparable: viene de unas 180 LOC/PF),
  1,90 y 1,57 PM con la productividad observada (costo laboral de $3,1 a $5,9 millones a $2.000.000 por PM; la planilla
  también da la productividad implícita de COCOMO, unas 383 LOC por PM). COCOMO 81 orgánico: **14,0 PM, 6,8 meses y 2,1 personas**, unas 10
  veces el esfuerzo disponible de 1,32 PM (5 integrantes × 10 h por semana × 4 semanas). Costos por rol con
  contingencia del 12 % ($2.530.265 teórico) y 16 riesgos (`docs/estimacion.md` y la planilla
  "AforoFit — Estimación Avance 3", con la hoja nueva LOC por componentes). La versión 0.2 (10,35 KLOC con 50 LOC/PF
  y COCOMO de 27,9 PM) quedó reemplazada.
- Guion de la PPT del Avance 3 con presentador por lámina (documento "AforoFit — Guion PPT Avance 3").
- Contenido del afiche en formato billboard, con tabla de funciones mencionables y plan al 26 de noviembre
  (`docs/afiche-contenido.md`). Borrador visual en A4 vertical hecho el 23 de noviembre (canvas "AforoFit — Borrador del
  afiche"), con roles, credenciales y cifras verificados contra este archivo. Versión 2 (23 nov, noche): logo USS
  autorizado, esquema funcional, metodología con PF, LOC y COCOMO, y resultados con conclusión, para cubrir los seis
  bloques de las bases (`docs/evidencia/afiche/afiche-borrador-v2-2026-11-23.png`). Versión 3 (24 nov): foto del lector
  incorporada (`docs/evidencia/lector/lector-usb-2026-11-24.jpg`) y cifra «115 pruebas aprobadas y 1 parcial»
  (`docs/evidencia/afiche/afiche-borrador-v3-2026-11-24.png`). La proporción es la misma de A0. Nombre del docente agregado el 24 de noviembre: «Docente: Rodrigo Correa Rojas», en el encabezado.
- Base de datos del flujo central aplicada en Supabase (`supabase/sql/005` a `009`): `alumnos`, `tarjetas`,
  `configuracion`, `visitas`, `turnos`, `aforo`, `registrar_ingreso` y `vincular_credencial`, con las reglas 1 a 6,
  RLS, Realtime en `aforo` y 25 alumnos ficticios. `admin.demo` quedó con rol `admin`.
- CR-01 aprobado por el equipo el 23 de noviembre, sin cambios: línea base de la entrega final con 26 PF por
  construir (B1 a B5), 13 PF opcionales y 81 PF para una próxima versión (D18; `docs/cr-01-linea-base-entrega-final.md`).
  Actualizados la columna de línea base en los requisitos, los CA activos, la tabla del afiche y la reestimación
  (`docs/estimacion.md` 6.1).
- Pruebas SQL de las reglas: 42 casos en OK (`supabase/pruebas/registrar_ingreso.sql`).
- Hoja de pruebas ejecutadas, ronda 1 (23 nov, commit `00c41f6`): 57 Vitest, 42 SQL y 4 lecturas reales en OK, CA32
  parcial, 18 criterios del flujo de ingreso con evidencia y 8 defectos registrados (`docs/pruebas-ejecutadas.md`)
- Pantallas del flujo central (pull request #7, fusionado el 22 de noviembre): `/ingreso` exige sesión de profesor o admin y llama a
  `registrar_ingreso` (entrada, salida, turno, rechazo y vinculación de credenciales), `/aforo` pública en tiempo real
  con respaldo cada 15 s, y `/profesor/espera`. Textos en `lib/ingreso/mensajes.ts` y estado del aforo en
  `lib/aforo/estado.ts`, con pruebas en Vitest (52 en ese momento). ESLint ignora `.next` y los demás archivos generados.
- Prueba de punta a punta con las pantallas del pull request #7 (22 de noviembre): entrada, salida, rechazo, turno y
  `/aforo` en vivo funcionan. `/profesor/espera` se actualiza en menos de 2 s (medido el 22 de noviembre: turno
  1.011 ms, llamado 454 ms), con la corrección en el pull request #7 (commit `d7918be`).
- Pull requests #8 (base de datos) y #7 (pantallas) fusionados el 22 de noviembre: el flujo central completo está
  en producción en https://aforofit.vercel.app (kiosco, aforo en vivo y lista de espera contra la base real).
- PPT final del Avance 3 (24 de noviembre): 18 láminas de exposición y 6 de respaldo, con notas del orador y un
  bloque seguido por integrante (Vicente 1 a 3 y 18, Isidora 4 a 6, Benjamín 7 a 10, Pau 11 a 14, Bastián 15 a 17).
  Orden: alcance y supuestos, tamaño (modelo de datos, ejemplo «Registrar ingreso con credencial», 207 PF y 5.350 LOC),
  esfuerzo (4,8 y 5,8 semanas con la productividad del equipo, cálculo y COCOMO como contraste), demo, interfaces,
  pruebas (115 aprobadas y 1 parcial), recursos, riesgos, afiche y cierre con los cuatro estados del CR-01. El respaldo
  tiene la matriz de pesos, el código pendiente por módulo, la productividad de la clase, COCOMO paso a paso, los costos
  por rol y el diagrama ER ampliado. PDF en `docs/entregas/avances/AforoFit-Avance3-Grupo6.pdf`. Reemplaza a la versión
  de 25 láminas en Canva.
- Correcciones visuales de la auditoría de interfaces (pull request #9, fusionado el 23 de noviembre): `/aforo` muestra
  cupos disponibles, turno llamado y espera más grandes, barra más gruesa y estado con color; `/ingreso` muestra el
  aforo en reposo. Lectura en vivo de `aforo` compartida en `lib/aforo/useAforo.ts`. 57 pruebas en Vitest.
- Planilla de estimación compartida con Bastián; contraseñas de los usuarios de prueba entregadas por privado; las
  tarjetas de Pau quedan vinculadas para la demo.
- Material de apoyo del curso (frameworks de Ingeniería de Requerimientos y Calidad y de Ingeniería de Software, y
  transcripciones de las clases): se sacó del repositorio público el 24 de noviembre y se guarda fuera, en el Drive del
  equipo. Las referencias «FW-IR» y «FW-IS» de los documentos apuntan a ese material.
- Playback con el encargado (24 de noviembre, 17:10, con Vicente): validó el flujo de ingreso sin cambios, prefiere el
  turno automático, confirmó R9 y corrigió la vigencia del certificado (un año desde la emisión). Demo con ingreso manual
  porque el lector estaba con Pau. Decisiones D19 a D24 (`docs/acta-playback-2026-11-24.md`).
- F-01, base de datos de la rutina (PR #11, fusionado y aplicado en Supabase el 24 de noviembre):
  `supabase/sql/011_rutinas.sql` con 6 plantillas que usan solo máquinas registradas, `elegir_objetivo_nivel` (B1),
  `generar_rutina`, `registrar_feedback` con la regla 8 y D25 (B4), `rutina_del_dia` con el aviso de mantención (R7),
  RLS en las tablas nuevas y `visitas` en Realtime para que el celular se entere de la entrada (D13). Pruebas en el
  proyecto real de Supabase: 62 de 62 OK (`supabase/pruebas/rutinas.sql`) y 42 de 42 OK (`registrar_ingreso`); 6
  plantillas con 5 o 6 ejercicios cada una; 71 en Vitest (`lib/rutina/progresion.ts`).
- Recursos sin costo para el proyecto: dos integrantes ya tenían Claude Pro (US$20 al mes), Gemini Pro y Figma Make
  con cuenta de estudiante, y el afiche y los trípticos se imprimen en la facultad. El gasto real sigue siendo el lector ($18.980).

**Pendiente** (lista priorizada por hito en `docs/plan-cierre-avance-3-y-final.md`)
- [ ] Comparar en `/ingreso` la lectura normalizada con NFC Tools por tarjeta (UID enmascarados). CA29 ya está medido
  desde el video de la prueba de Pau: cumple, 1,2 s o menos en 4 lecturas (`docs/medicion-ca29-2026-11-23.md`);
  repetir en la red de la universidad
- [ ] Auditoría integral con los frameworks (`docs/auditoria-proyecto-frameworks-2026-11-23.md`): la línea base de la
  entrega final ya está aprobada (CR-01) y el prototipo quedó validado con el encargado (acta del 24 de noviembre);
  falta registrar las pruebas por CA
- [ ] Complementos de los avances 1 y 2 (`docs/complementos-avances-1-y-2.md`): árbol de problemas, objetivos medibles,
  interesados, decisión de enfoque, plan semana a semana, verificación de requisitos, plan de calidad, ADR-01 a ADR-04 y
  guion del Playback con el encargado. Falta solo la revisión de otro integrante (el acta y RNF08 ya están resueltos)
- [ ] Pedidos del Playback (24 nov): nombre e inicial del apellido junto al turno llamado en `/aforo` (F-29, D22),
  botón «Cerrar visita» en `/profesor` para quien no marcó la salida (F-28, D21) y regla 2 con vigencia de un año
  (F-32, D20: además, `registrar_ingreso` todavía rechaza fuera de `periodo_inicio`/`periodo_fin`; hay que quitar ese
  chequeo). Cantidades reales de implementos aplicadas en Supabase el 24 de noviembre (5 implementos, 9 unidades;
  `supabase/sql/010`, PR #10 fusionado). El aviso «Olvidaste tu TNE» en el perfil del alumno queda como P2 (F-30)
- [ ] Cargas iniciales de las plantillas: son de ejemplo; declararlas como supuesto o validarlas con el encargado
- [ ] RNF08 (D24): pantalla mínima en `/admin` para capacidad, horario y cierre automático (F-09), después de F-01 a F-03
- [ ] Activar en Supabase la protección contra claves filtradas (Vicente)
- [ ] Detalle menor aceptado: un turno llamado que nadie reclama expira recién cuando se pasa otra tarjeta, así que
  `/aforo` puede mostrar "Turno N" unos minutos de más
- [ ] Hallazgo de Pau con el lector (23 nov): si la pestaña o la ventana del kiosco no está activa, el lector escribe en
  otra parte y la lectura se pierde. Es propio de un lector tipo teclado: el navegador no puede capturar teclas sin el
  foco. La página ya recupera el foco dentro de sí misma cada 2 s. Medidas: kiosco a pantalla completa (modo kiosco de
  Chrome) y aviso visible «Lector en pausa: haz clic aquí» cuando la página pierde el foco (F-26 del plan de cierre)
- [ ] Hallazgo de Pau (23 nov): un alumno puede tener varias tarjetas vinculadas. Es correcto según R1 (una tarjeta
  pertenece a un solo alumno, no al revés) y D17 (TNE y TUI); `tarjetas.tipo` ya distingue `tne` y `credencial_uss`.
  Detalle: el kiosco guarda toda vinculación como `tne`. Se documenta; corregir el tipo es P2 (F-27)
- [ ] Detalle menor aceptado: `vincular_credencial` con un UID de formato inválido devuelve un error de restricción y el
  kiosco lo muestra como "Sin conexión". No ocurre en la práctica porque el kiosco siempre envía el UID normalizado
- [ ] Entrega final: B1, B2 y B4 ya están en la base (PR #11); faltan las pantallas de B1, B3 y B4 (F-02) y B5 (F-03)
  antes del congelamiento del lunes 30; S1 y S2 solo si la base está lista el viernes 27.
- [ ] Afiche en formato A0, con el nombre del profesor (Bastián y Vicente, archivo cerrado el jueves 26). Ya tiene la foto del
  lector y el nombre del docente (Rodrigo Correa Rojas); falta exportarlo en PDF para imprimir en A0 (no en PNG). Se imprime en la facultad.
- [ ] Trípticos: 20 a color, impresos en la facultad (indicación del 24 de noviembre, después del aviso del 19 que los
  había reemplazado por el afiche). Falta diseñarlos a partir del contenido del afiche.

Ver el [cierre de los avances 1 y 2](docs/cierre-avances-1-y-2.md#pendientes-revisados) para el detalle de validaciones, evidencia y trabajo restante.

### Decisiones vigentes D01–D25

D01–D11 provienen de la entrevista, D12–D16 del diseño, D17 del levantamiento de credenciales, D18 del CR-01, D19–D24 del [Playback del 24 de noviembre](docs/acta-playback-2026-11-24.md) y D25 de la revisión del PR #11.

| Código | Decisión |
|---|---|
| D01 | Capacidad inicial de 20 personas, configurable |
| D02 | Registro de salida independiente de las rutinas |
| D03 | ~~Certificados vinculados a períodos académicos configurables~~ Reemplazada por D20 (24 nov) |
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
| D16 | Préstamo con el lector: el profesor pasa la TNE, marca los implementos y la TNE queda como garantía; en la devolución marca lo que vuelve. Ajuste D19: pasar la TNE por el lector es opcional; basta con identificar al alumno |
| D17 | Credencial principal: la TNE (MIFARE Classic, 13,56 MHz, UID fijo) para ingreso y préstamos; la TUI (credencial USS) también funciona con el lector USB (probado por Pau el 20 de noviembre); la TNE queda como principal porque todos los alumnos la tienen; se descarta el carnet de identidad (UID aleatorio y datos personales); lector de 13,56 MHz |
| D18 | Línea base de la entrega final (CR-01, aprobado por el equipo el 23 de noviembre): se entrega el flujo central con rutina por plantilla, feedback, progresión y estado de máquinas; préstamo básico y habilitación solo si alcanza; rutinas del profesor y del alumno, préstamos completos y registro corporal quedan diseñados para una próxima versión |
| D19 | R9: un alumno con la TNE de garantía sin retirar no puede abrir otro préstamo, aunque haya devuelto todos los implementos; la TNE se deja físicamente con el profesor |
| D20 | El certificado médico dura un año desde su fecha de emisión (reemplaza D03); `certificado_hasta` = emisión + 12 meses |
| D21 | El profesor puede cerrar a mano la visita de un alumno que no marcó la salida, desde `/profesor` |
| D22 | `/aforo` muestra junto al turno llamado el nombre y la inicial del apellido, nunca el nombre completo ni el RUT |
| D23 | El encargado no prioriza rutina ni préstamos; el equipo decide según el beneficio para la evaluación y se mantiene el CR-01 |
| D24 | RNF08: pantalla mínima en `/admin` (capacidad, horario y cierre automático) después de la rutina; si no alcanza el jueves 26, limitación declarada. CA34 queda parcial |
| D25 | Regla 8: «me costó» siempre baja al menos un paso de redondeo (`redondeo_kg`), sin quedar negativa (revisión del PR #11, 24 nov) |

Requisitos (RF01–RF31, RNF01–RNF11), casos de uso (CU01–CU16) y criterios de aceptación (CA01–CA22):
[documento de requisitos y trazabilidad](docs/requisitos-casos-uso-criterios.md#1-decisiones-y-trazabilidad). CA01–CA22 corresponden a la entrega original. La matriz incluye los criterios complementarios de la revisión documental.

Otras decisiones: ingreso con la TNE y QR de respaldo · repositorio público (Vercel Hobby solo
despliega commits del dueño en repos privados) · las tareas viven en el plan de acción, no en GitHub ·
la IA se usa para casi todo y el equipo revisa y decide · desde el 23 de noviembre el desarrollo se hace con agentes
(Claude Code y Codex) coordinados por Vicente; cada pull request lo aprueba otro integrante y cada uno defiende su área
(`docs/plan-cierre-avance-3-y-final.md`, sección 0).

**Preguntas abiertas**
- ¿Es factible el reparto automático de ejercicios? (prueba de factibilidad y consulta a usuarios)

Resueltas en el Playback del 24 de noviembre: cantidades de implementos (2 balones de fútbol, 2 de vóleibol,
2 de básquetbol, 2 paletas y 1 pelota de taca-taca) y período académico (ya no aplica: D20).

## 11. Cómo debe trabajar una IA en este proyecto

1. Lee este archivo completo antes de proponer o escribir código.
2. Respeta el alcance: si algo no está en la sección 3, pregunta antes de agregarlo.
3. Cada regla de negocio (sección 4) debe quedar validada y con su caso de prueba.
4. Responde y escribe en español; código simple y comentado donde la lógica no sea obvia.
5. Al terminar una tarea, indica qué partes de la sección 10 (Estado actual) hay que actualizar.
6. Nunca expongas claves ni uses datos reales de alumnos o información médica.
