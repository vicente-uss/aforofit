# AforoFit — Requisitos, casos de uso y criterios de aceptación

Nov 12, 2026 · @Vixoo

Contenido de análisis para el Avance 2 del martes 17 de noviembre. Se basa en AGENTS.md, la entrevista con el encargado del 12 de noviembre (P1–P7, D01–D11) y las decisiones de diseño D12–D16.

## 1. Decisiones de diseño

Estas cinco decisiones completan las de la entrevista (D01–D11) y cierran los huecos que impedían escribir los casos de uso.

| Código | Decisión |
| --- | --- |
| D12 | **Generación de rutina:** el alumno define una vez su objetivo (fuerza, hipertrofia o salud) y su nivel (principiante o intermedio). El sistema arma la rutina con plantillas por objetivo y nivel, usando solo máquinas registradas. |
| D13 | **Entrega al celular:** el alumno inicia sesión una vez en la app web. Al pasar la credencial en el computador del gimnasio, su sesión abierta recibe la rutina en tiempo real. |
| D14 | **Lista de espera:** si el gimnasio está lleno, el alumno recibe un número de turno. La pantalla muestra el turno llamado y el alumno vuelve a pasar la credencial para entrar. |
| D15 | **Origen de la rutina configurable:** una rutina puede ser generada por el sistema, creada o asignada por el profesor, o creada por el alumno. El alumno elige cuál es su rutina activa, y el administrador habilita o deshabilita cada modalidad. |
| D16 | **Préstamo con el lector:** el profesor pasa la TNE del alumno por el mismo lector, marca los implementos entregados y la TNE queda registrada como garantía. En la devolución marca lo que vuelve y la entrega de la TNE. |

## 2. Requisitos funcionales

Son 31 requisitos: 27 de prioridad alta y 4 de prioridad media. La columna Origen traza cada uno al problema (P), la decisión (D) o la regla de negocio (R) que lo justifica.

| ID | El sistema debe… | Prioridad | Origen |
| --- | --- | --- | --- |
| RF01 | Permitir que un alumno inicie sesión y ver solo las funciones de su rol | Alta | D13 |
| RF02 | Vincular una credencial a un único alumno | Alta | R1 |
| RF03 | Identificar al alumno al pasar su credencial por el lector o mostrar su QR | Alta | P1 |
| RF04 | Validar que el alumno tenga certificado vigente para el período académico en curso | Alta | P6, D03, R2 |
| RF05 | Validar que el ingreso ocurra dentro del horario y antes del último ingreso | Alta | R3 |
| RF06 | Registrar la entrada con fecha y hora | Alta | P1 |
| RF07 | Registrar la salida cuando el alumno vuelve a pasar su credencial | Alta | P2, D02, R5 |
| RF08 | Cerrar automáticamente las visitas sin salida después de 3 horas | Alta | R6 |
| RF09 | Calcular el aforo y mostrarlo en vivo en una pantalla pública | Alta | P3, D01 |
| RF10 | Asignar un número de turno cuando el gimnasio está lleno y llamar los turnos en orden | Alta | P4, D14, R4 |
| RF11 | Permitir que el alumno defina su objetivo y su nivel de entrenamiento | Alta | D12 |
| RF12 | Generar una rutina con plantillas por objetivo y nivel, usando solo máquinas registradas | Alta | D12 |
| RF13 | Permitir que el alumno cree y edite su propia rutina | Alta | D09, D15 |
| RF14 | Permitir que el profesor cree, asigne y edite la rutina de un alumno | Alta | D09, D15 |
| RF15 | Permitir que el alumno elija su rutina activa entre las disponibles | Alta | D15 |
| RF16 | Mostrar la rutina activa en el celular del alumno al registrar su entrada, en tiempo real | Alta | D13 |
| RF17 | Advertir en la rutina cuando un ejercicio usa una máquina en mantención | Alta | D06, R7 |
| RF18 | Registrar el feedback al salir y ajustar las cargas de la próxima sesión según los parámetros | Alta | D07, R8 |
| RF19 | Registrar máquinas con foto, patrón de movimiento y ajustes | Alta | P7 |
| RF20 | Cambiar el estado de una máquina entre Disponible y En mantención | Alta | D05 |
| RF21 | Registrar implementos con su cantidad disponible | Alta | P5 |
| RF22 | Registrar un préstamo con varios implementos y la TNE como garantía | Alta | P5, D04, D16 |
| RF23 | Registrar devoluciones parciales e impedir un nuevo préstamo mientras haya pendientes | Alta | P5, R9 |
| RF24 | Mostrar los préstamos abiertos y las TNE de garantía pendientes de devolver | Alta | P5 |
| RF25 | Permitir que el administrador habilite alumnos y registre la vigencia de su certificado | Alta | P6, D03 |
| RF26 | Permitir que el administrador configure capacidad, horario, período académico, progresión, cierre automático y modalidades de rutina | Alta | D01, D03, D07, D15 |
| RF27 | Permitir que el alumno registre su peso y perímetros y vea su evolución con IMC | Alta | Alcance aprobado |
| RF28 | Repartir el orden de los ejercicios entre los alumnos presentes (experimental) | Media | P7, D08 |
| RF29 | Registrar incidencias de mal uso | Media | Alcance aprobado |
| RF30 | Generar reportes de asistencia por carrera, horario y uso de máquinas y préstamos | Media | P1 |
| RF31 | Alertar al administrador cuando un alumno deja de venir | Media | Alcance aprobado |

## 3. Requisitos no funcionales

Cada uno tiene una medida para poder comprobarlo en las pruebas.

| ID | Categoría | Requisito | Cómo se mide | Prioridad |
| --- | --- | --- | --- | --- |
| RNF01 | Rendimiento | El ingreso se registra rápido en la entrada | 3 segundos o menos desde que se acerca la credencial | Alta |
| RNF02 | Tiempo real | El aforo y la rutina se actualizan sin recargar la página | 2 segundos o menos después del evento | Alta |
| RNF03 | Compatibilidad | Funciona en el navegador del computador del gimnasio y en celulares Android y iPhone, sin instalar una app | Prueba en los tres tipos de equipo | Alta |
| RNF04 | Compatibilidad | Funciona con un lector USB tipo teclado, sin drivers, y con QR como respaldo | Prueba con el lector comprado | Alta |
| RNF05 | Usabilidad | Las vistas del alumno se usan con una mano en el celular | Pantallas desde 360 px de ancho; acciones principales en 2 toques o menos | Alta |
| RNF06 | Seguridad | Cada rol accede solo a lo suyo | Row Level Security activo en todas las tablas; un alumno no puede leer datos de otro | Alta |
| RNF07 | Privacidad | No se guardan datos reales ni información médica | Solo datos ficticios; del certificado se guarda solo la vigencia; las medidas corporales solo las ve su dueño | Alta |
| RNF08 | Configurabilidad | Los parámetros se cambian sin modificar código | Capacidad, horario, período, progresión, cierre automático y modalidades editables desde el panel | Alta |
| RNF09 | Disponibilidad | El sistema está en línea para la demo | URL pública en Vercel; video de respaldo si falla la red | Alta |
| RNF10 | Mantenibilidad | El código y la base de datos tienen historial | Cambios por pull request revisado; cada SQL guardado en `supabase/sql/` | Media |
| RNF11 | Idioma | Toda la interfaz está en español | Revisión de todas las pantallas | Alta |

## 4. Actores y casos de uso

Hay tres actores y 16 casos de uso. CU01 a CU04 forman el flujo central que se demuestra en vivo; CU08 y CU09 resuelven el préstamo de implementos.

&#91;embedded content: casos de uso por actor · 3 actores, 16 casos\]

Los casos compartidos (CU06, CU11 y CU15) usan la misma pantalla con permisos distintos según el rol, lo que reduce el trabajo de desarrollo.

## 5. Especificación de los casos de uso principales

Se detallan los seis casos que forman el flujo central y el préstamo. Los demás son registros simples (crear, editar, consultar).

### CU01 · Ingresar al gimnasio

**Actor:** alumno. **Precondición:** la credencial está vinculada al alumno. **Requisitos:** RF03 a RF06, RF16.

1. El alumno acerca su credencial al lector del computador del gimnasio.
2. El sistema identifica al alumno.
3. El sistema valida su habilitación, el horario y la capacidad.
4. El sistema registra la entrada y aumenta el aforo en uno.
5. La pantalla muestra “Bienvenido” con el nombre del alumno, y su rutina activa aparece en su celular.

**Flujos alternativos**

- **2a. Credencial no registrada:** el sistema lo informa y ofrece vincularla (CU11). No registra la entrada.
- **3a. Sin certificado vigente:** el sistema rechaza el ingreso e indica el motivo.
- **3b. Fuera de horario:** el sistema rechaza el ingreso e indica el horario de último ingreso.
- **3c. Gimnasio lleno:** continúa en CU02.
- **1a. El lector no funciona:** el alumno muestra su QR desde el celular y se continúa en el paso 2.

**Postcondición:** hay una visita abierta y el aforo está actualizado.

### CU02 · Esperar turno (extiende CU01)

**Actor:** alumno. **Requisitos:** RF10.

1. El sistema asigna el siguiente número de turno y lo muestra en pantalla.
2. Cuando se libera un cupo, la pantalla llama al turno siguiente.
3. El alumno llamado vuelve a pasar su credencial y se continúa en CU01, paso 4.

**Flujo alternativo 3a:** si pasa un alumno con un turno posterior, el sistema le indica que aún no es su turno.

### CU03 · Salir y dar feedback

**Actor:** alumno. **Precondición:** tiene una visita abierta. **Requisitos:** RF07, RF18.

1. El alumno pasa su credencial al salir.
2. El sistema registra la salida y reduce el aforo en uno.
3. Si el alumno usó su rutina, su celular le pregunta cómo le fue: fácil, justo o me costó.
4. El alumno responde y el sistema ajusta las cargas de su próxima sesión.

**Flujos alternativos**

- **3a. No responde:** la salida queda registrada y las cargas no cambian.
- **4a. Rutina asignada por el profesor:** el feedback se registra, pero las cargas no cambian automáticamente.
- **1a. No pasa la credencial al salir:** la visita se cierra sola a las 3 horas (RF08).

### CU04 · Ver rutina del día

**Actor:** alumno. **Precondición:** tiene la sesión iniciada en su celular y una rutina activa. **Requisitos:** RF16, RF17.

1. Al registrarse su entrada, el celular muestra la rutina activa.
2. Cada ejercicio indica la máquina, series, repeticiones, carga y ajustes de la máquina.
3. Si una máquina está en mantención, ese ejercicio muestra una advertencia.

**Flujo alternativo 1a. Sin rutina activa:** el sistema ofrece generar una con su objetivo y nivel (RF12) o elegir otra disponible (RF15).

### CU06 · Crear o editar rutina

**Actores:** alumno y profesor encargado. **Requisitos:** RF13, RF14, RF15, RF26.

1. El actor abre el editor de rutinas.
2. Agrega ejercicios eligiendo máquinas del catálogo, con series, repeticiones y carga.
3. Guarda la rutina. El sistema registra su origen: generada, profesor o alumno.
4. Si la creó el profesor para un alumno, queda asignada y el alumno ve un aviso para activarla.

**Flujo alternativo 1a. Modalidad deshabilitada:** si el administrador deshabilitó esa modalidad, la opción no aparece.

### CU08 · Prestar implementos y CU09 · Recibir devolución

**Actor:** profesor encargado. **Requisitos:** RF21 a RF24.

1. El alumno pide implementos y entrega su TNE.
2. El profesor pasa la TNE por el lector y el sistema identifica al alumno.
3. El profesor marca los implementos y sus cantidades.
4. El sistema registra el préstamo y la TNE como garantía. El aforo no cambia.
5. En la devolución, el profesor busca el préstamo y marca lo que vuelve.
6. Cuando vuelve todo, el profesor entrega la TNE, la marca como devuelta y el préstamo se cierra.

**Flujos alternativos**

- **2a. El alumno tiene implementos pendientes:** el sistema no permite un nuevo préstamo y muestra lo pendiente.
- **5a. Devolución parcial:** el préstamo sigue abierto con lo que falta.
- **3a. No hay stock suficiente:** el sistema no permite prestar más de lo disponible.

## 6. Criterios de aceptación

Son 22 criterios para los requisitos de prioridad alta. Cada uno se convierte en un caso de prueba del Avance 3: Bastián lo ejecuta y registra el resultado obtenido.

| ID | Requisito | Dado | Cuando | Entonces |
| --- | --- | --- | --- | --- |
| CA01 | RF03, RF06 | Un alumno habilitado, dentro del horario y con cupo disponible | Pasa su credencial | Se registra su entrada con fecha y hora y el aforo sube en uno |
| CA02 | RF02 | Una credencial que no está vinculada a ningún alumno | Se pasa por el lector | El sistema muestra “Credencial no registrada”, ofrece vincularla y no registra la entrada |
| CA03 | RF02 | Una credencial ya vinculada a otro alumno | Se intenta vincular a un segundo alumno | El sistema rechaza la vinculación |
| CA04 | RF04 | Un alumno sin certificado vigente para el período en curso | Pasa su credencial | Se rechaza el ingreso con el motivo “Certificado no vigente” |
| CA05 | RF05 | Un lunes a las 21:05 | Un alumno habilitado pasa su credencial | Se rechaza el ingreso con el motivo “Fuera del horario de ingreso” |
| CA06 | RF10 | 20 personas dentro del gimnasio | Un alumno habilitado pasa su credencial | Recibe un número de turno y no se registra su entrada |
| CA07 | RF10 | El turno 3 es el siguiente y se libera un cupo | La pantalla llama al turno 3 y ese alumno pasa su credencial | Se registra su entrada; si pasa el alumno del turno 4, se le indica que espere |
| CA08 | RF07 | Un alumno con una visita abierta | Pasa su credencial | Se registra su salida y el aforo baja en uno |
| CA09 | RF08 | Una visita abierta hace más de 3 horas | Se ejecuta el cierre automático | La visita se cierra marcada como “cierre automático” y libera el cupo |
| CA10 | RF09 | La pantalla de aforo está abierta | Se registra una entrada o una salida | El número cambia en 2 segundos o menos, sin recargar la página |
| CA11 | RF16 | Un alumno con sesión iniciada en su celular y una rutina activa | Se registra su entrada | Su rutina aparece en el celular en 2 segundos o menos |
| CA12 | RF12 | Un alumno con objetivo hipertrofia y nivel principiante | Pide generar su rutina | La rutina sigue la plantilla de ese objetivo y nivel e incluye solo máquinas registradas |
| CA13 | RF17 | Una rutina que usa una polea marcada En mantención | El alumno ve su rutina | Ese ejercicio muestra una advertencia de mantención |
| CA14 | RF18 | Un ejercicio con 40 kg en una rutina generada | El alumno responde fácil, justo o me costó | La próxima sesión tiene 42,5 kg, 40 kg o 37,5 kg, respectivamente |
| CA15 | RF14, RF18 | Una rutina asignada por el profesor | El alumno responde “me costó” | El feedback queda registrado y las cargas no cambian automáticamente |
| CA16 | RF13, RF15 | Un alumno que creó su propia rutina | La marca como activa | Esa es la rutina que aparece en su próximo ingreso |
| CA17 | RF26 | El administrador deshabilitó las rutinas creadas por el alumno | Un alumno intenta crear una rutina | La opción no está disponible |
| CA18 | RF26 | El administrador cambia la capacidad de 20 a 15 | Entra el alumno número 16 | Recibe un número de turno |
| CA19 | RF22 | Un alumno sin préstamos pendientes | El profesor pasa su TNE y marca 2 balones de básquetbol | Se crea un préstamo con 2 balones, la TNE queda como garantía y el aforo no cambia |
| CA20 | RF23 | Un préstamo con 2 balones | El alumno devuelve 1 | Queda 1 balón pendiente y el alumno no puede abrir otro préstamo |
| CA21 | RF24 | Un préstamo con todos los implementos devueltos | El profesor entrega la TNE y la marca como devuelta | El préstamo se cierra y ya no aparece entre los abiertos |
| CA22 | RF27 | El alumno A registró sus medidas | El alumno B o un profesor intentan consultarlas | El sistema no se las muestra |

## 7. Supuestos y pendientes

Ninguno bloquea el Avance 2. Los supuestos quedan como parámetros configurables y se declaran en la presentación.

| Tema | Supuesto o pendiente | Responsable |
| --- | --- | --- |
| Período académico | 3 de marzo al 23 de diciembre, pendiente de confirmación oficial | Vicente |
| Redondeo de cargas | Las cargas ajustadas se redondean al múltiplo de 2,5 kg más cercano | Benjamín |
| Plantillas de rutina | Falta escribir las plantillas por objetivo y nivel (6 combinaciones) | Benjamín |
| Lector | Compatibilidad con la credencial USS y la TNE; si falla, el QR es el ingreso principal | Pau |
| Implementos | Cantidades exactas disponibles para préstamo | Bastián |
| Máquinas | Inventario completo con fotos, patrones de movimiento y ajustes | Bastián |
| Reparto (RF28) | Factibilidad por validar con usuarios y una prueba técnica | Vicente y Benjamín |
| Funcionarios | El gimnasio real los acepta; quedan fuera del prototipo como limitación de alcance | Equipo |
