# AforoFit — Requisitos, casos de uso y criterios de aceptación

El documento maestro incorpora esta sección en el [requisitos, casos y criterios](cierre-avances-1-y-2.md#requisitos-casos-y-criterios).

Nov 12, 2026 · @Vixoo

Contenido de análisis para el Avance 2 del martes 17 de noviembre. Se basa en AGENTS.md, la entrevista con el encargado del 12 de noviembre (P1–P7, D01–D11) y las decisiones de diseño y credenciales D12–D17.

## 1. Decisiones y trazabilidad

El registro canónico de [D01–D17](../AGENTS.md#decisiones-vigentes-d01d17) recoge las decisiones de la [entrevista](entrevista-encargado-2026-11-12.md), del diseño y de las [pruebas de credenciales](pruebas-tarjetas.md). Los [problemas P1–P7](../AGENTS.md#situación-actual-problema) y las [reglas R1–R9](../AGENTS.md#4-reglas-de-negocio) sirven de origen a los requisitos. Para seguir la trazabilidad, buscar los ID en la [matriz de cobertura](#8-matriz-de-cobertura) y en el [índice de diagramas](diagramas.md#trazabilidad-del-diseño).

| Decisión | Requisitos relacionados | Casos de uso relacionados |
|---|---|---|
| D01 | RF09, RF10, RF26, RNF08 | CU02, CU14, CU15 |
| D02 | RF07, RF08 | CU03 |
| D03 | RF04, RF25, RF26 | CU01, CU12, CU14 |
| D04 | RF22, RF23, RF24 | CU08, CU09 |
| D05 | RF20 | CU10 |
| D06 | RF17 | CU04, CU10 |
| D07 | RF18, RF26 | CU03, CU14 |
| D08 | RF28 | CU04 |
| D09 | RF13, RF14 | CU06 |
| D10 | RF01, RF04, RF25 | CU01, CU12 |
| D11 | RF25, RF27, RNF07 | CU07, CU12 |
| D12 | RF11, RF12 | CU05 |
| D13 | RF01, RF16, RNF02 | CU01, CU04 |
| D14 | RF10 | CU02 |
| D15 | RF13, RF14, RF15, RF26 | CU05, CU06, CU14 |
| D16 | RF03, RF22, RF23, RF24 | CU08, CU09 |
| D17 | RF02, RF03, RNF04 | CU01, CU08, CU11 |

## 2. Requisitos funcionales

Son 31 requisitos: 27 de prioridad alta y 4 de prioridad media. La columna Origen traza cada uno al problema (P), la decisión (D) o la regla de negocio (R) que lo justifica.

| ID | El sistema debe… | Prioridad | Origen | Línea base de la entrega final ([CR-01](cr-01-linea-base-entrega-final.md)) |
| --- | --- | --- | --- | --- |
| RF01 | Permitir que un alumno inicie sesión y ver solo las funciones de su rol | Alta | D13 | ✅ Implementado |
| RF02 | Vincular una credencial a un único alumno | Alta | R1 | ✅ Implementado |
| RF03 | Identificar al alumno al pasar su credencial por el lector o mostrar su QR | Alta | P1, D17 | 🟡 Lector implementado; respaldo por ingreso manual, QR en próxima versión |
| RF04 | Validar que el alumno tenga certificado vigente para el período académico en curso | Alta | P6, D03, R2 | ✅ Implementado |
| RF05 | Validar que el ingreso ocurra dentro del horario y antes del último ingreso | Alta | R3 | ✅ Implementado |
| RF06 | Registrar la entrada con fecha y hora | Alta | P1 | ✅ Implementado |
| RF07 | Registrar la salida cuando el alumno vuelve a pasar su credencial | Alta | P2, D02, R5 | ✅ Implementado |
| RF08 | Cerrar automáticamente las visitas sin salida después de 3 horas | Alta | R6 | ✅ Implementado |
| RF09 | Calcular el aforo y mostrarlo en vivo en una pantalla pública | Alta | P3, D01 | ✅ Implementado |
| RF10 | Asignar un número de turno cuando el gimnasio está lleno y llamar los turnos en orden | Alta | P4, D14, R4 | ✅ Implementado |
| RF11 | Permitir que el alumno defina su objetivo y su nivel de entrenamiento | Alta | D12 | 🔨 Se construye (B1) |
| RF12 | Generar una rutina con plantillas por objetivo y nivel, usando solo máquinas registradas | Alta | D12 | 🔨 Se construye (B2) |
| RF13 | Permitir que el alumno cree y edite su propia rutina | Alta | D09, D15 | ⏭ Próxima versión |
| RF14 | Permitir que el profesor cree, asigne y edite la rutina de un alumno | Alta | D09, D15 | ⏭ Próxima versión |
| RF15 | Permitir que el alumno elija su rutina activa entre las disponibles | Alta | D15 | ⏭ Próxima versión |
| RF16 | Mostrar la rutina activa en el celular del alumno al registrar su entrada, en tiempo real | Alta | D13 | 🔨 Se construye (B3) |
| RF17 | Advertir en la rutina cuando un ejercicio usa una máquina en mantención | Alta | D06, R7 | 🔨 Se construye (B3) |
| RF18 | Registrar el feedback al salir y ajustar las cargas de la próxima sesión según los parámetros | Alta | D07, R8 | 🔨 Se construye (B4) |
| RF19 | Registrar máquinas con foto, patrón de movimiento y ajustes | Alta | P7 | 🟡 Datos por SQL; pantalla en próxima versión |
| RF20 | Cambiar el estado de una máquina entre Disponible y En mantención | Alta | D05 | 🔨 Se construye (B5) |
| RF21 | Registrar implementos con su cantidad disponible | Alta | P5 | 🟡 Datos por SQL; pantalla en próxima versión |
| RF22 | Registrar un préstamo con varios implementos y la TNE como garantía | Alta | P5, D04, D16 | Opcional (S1, préstamo básico); si no, próxima versión |
| RF23 | Registrar devoluciones parciales e impedir un nuevo préstamo mientras haya pendientes | Alta | P5, R9 | Opcional (S1, sin devoluciones parciales); si no, próxima versión |
| RF24 | Mostrar los préstamos abiertos y las TNE de garantía pendientes de devolver | Alta | P5 | ⏭ Próxima versión |
| RF25 | Permitir que el administrador habilite alumnos y registre la vigencia de su certificado | Alta | P6, D03 | 🟡 Regla validada al ingresar; pantalla opcional (S2) |
| RF26 | Permitir que el administrador configure capacidad, horario, período académico, progresión, cierre automático y modalidades de rutina | Alta | D01, D03, D07, D15 | 🟡 Parámetros por SQL; pantalla en próxima versión |
| RF27 | Permitir que el alumno registre su peso y perímetros y vea su evolución con IMC | Alta | Alcance aprobado | ⏭ Próxima versión |
| RF28 | Repartir el orden de los ejercicios entre los alumnos presentes (experimental) | Media | P7, D08 | Sin cambio (prioridad media) |
| RF29 | Registrar incidencias de mal uso | Media | Alcance aprobado | Sin cambio (prioridad media) |
| RF30 | Generar reportes de asistencia por carrera, horario y uso de máquinas y préstamos | Media | P1 | Sin cambio (prioridad media) |
| RF31 | Alertar al administrador cuando un alumno deja de venir | Media | Alcance aprobado | Sin cambio (prioridad media) |

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

Consulta el [diagrama y catálogo de los 16 casos de uso](diagramas.md#1-casos-de-uso), con sus actores y prioridades.

Los casos compartidos (CU06, CU11 y CU15) usan la misma pantalla con permisos distintos según el rol, lo que reduce el trabajo de desarrollo.

## 5. Especificación de los casos de uso principales

Los flujos principales y los casos de apoyo se especifican a continuación. Los ID de requisitos y criterios se cruzan en la [matriz de cobertura](#8-matriz-de-cobertura).

### CU01 · Ingresar al gimnasio

**Actor:** alumno. **Precondición:** el alumno presenta una credencial o QR para su lectura. **Requisitos:** RF03 a RF06, RF16.

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
3. El alumno llamado vuelve a pasar su credencial y se revalidan identidad, habilitación, horario y derecho al cupo antes de registrar la entrada en CU01.

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

### Casos de apoyo

| Caso | Actor y condición | Acción y resultado | Alternativa relevante |
|---|---|---|---|
| CU05 | Alumno con sesión | Guarda objetivo y nivel, genera una rutina o activa una disponible | Si la modalidad está deshabilitada, la opción queda fuera del flujo |
| CU07 | Alumno con sesión | Registra medidas y consulta su historial e IMC | Un usuario ajeno carece de acceso al registro |
| CU10 | Profesor encargado | Cambia el estado de la máquina y las rutinas la muestran con el estado vigente | Si está en mantención, las rutinas muestran advertencia |
| CU11 | Profesor o administrador ante una credencial sin vínculo | Identifica al alumno y vincula la credencial | Una credencial ya vinculada no se asigna a un segundo alumno |
| CU12 | Administrador | Registra la habilitación y la vigencia del período académico | Con vigencia vencida, CU01 rechaza el ingreso |
| CU13 | Administrador | Registra máquinas e implementos y consulta el catálogo | La disponibilidad se usa para validar préstamos |
| CU14 | Administrador | Guarda parámetros y el sistema aplica la configuración vigente | Una modalidad deshabilitada queda fuera de las opciones del alumno |
| CU15 | Alumno o profesor, y consulta en pantalla pública | Consulta el aforo, que se actualiza con entradas y salidas | Con el gimnasio lleno se muestra la situación y el turno llamado cuando corresponda |
| CU16 | Administrador | Consulta reportes por carrera, horario, uso de máquinas o préstamos | Función de prioridad media |

## 6. Criterios de aceptación

> **Línea base de la entrega final (CR-01, aprobado el 23 de noviembre):** se activan CA11, CA12, CA13, CA14, CA24 y
> CA26. Quedan como «no aplica en esta versión» CA15, CA16 y CA38 (rutinas del profesor y del alumno), CA19 a CA21
> (préstamos; CA19 y CA20 se activan si se hace S1) y CA22 y CA39 (registro corporal).

CA01–CA22 corresponden al Avance 2 presentado. Los criterios complementarios de abajo completan la trazabilidad documental. Su ejecución y evidencias se registran por separado.

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
| CA10 | RF09, RNF02 | La pantalla de aforo está abierta | Se registra una entrada o una salida | El número cambia en 2 segundos o menos, sin recargar la página |
| CA11 | RF16, RNF02 | Un alumno con sesión iniciada en su celular y una rutina activa | Se registra su entrada | Su rutina aparece en el celular en 2 segundos o menos |
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

### Criterios complementarios de la revisión documental

CA23–CA39 detallan la aceptación de requisitos ya documentados. CA40–CA43 son criterios propuestos para requisitos de prioridad media. El reparto y las alertas dependen de acordar su métrica o umbral. Estos criterios se incorporaron después de la presentación.

| ID | Requisito | Dado | Cuando | Entonces |
|---|---|---|---|---|
| CA23 | RF01, RNF06 | Un alumno con credenciales válidas y otro usuario con datos propios | El alumno inicia sesión e intenta abrir funciones administrativas o datos ajenos | Accede a su panel y se rechazan las consultas y pantallas fuera de su rol |
| CA24 | RF11 | Un alumno con sesión | Elige objetivo y nivel, guarda y vuelve a abrir el perfil | Sus dos selecciones se mantienen |
| CA25 | RF19 | Un administrador y una foto de prueba | Registra una máquina con foto, patrón y ajustes | La ficha conserva y muestra esos datos |
| CA26 | RF20 | Una máquina disponible que figura en una rutina | El profesor la marca En mantención y luego Disponible | El estado persiste y la advertencia aparece y desaparece según el estado |
| CA27 | RF21 | Un administrador y un implemento con una cantidad definida | Registra el implemento y consulta el catálogo | La cantidad disponible figura en el catálogo y se usa para validar el stock del préstamo |
| CA28 | RF25 | Un alumno sin habilitación y un período académico configurado | El administrador registra la habilitación y la vigencia | La habilitación se guarda y se aplica solo cuando el período y la vigencia corresponden |
| CA29 | RNF01 | Una credencial vinculada, alumno habilitado y cupo | Se cronometra desde que se acerca la credencial hasta el registro | El ingreso se registra en 3 segundos o menos |
| CA30 | RNF03 | Computador del gimnasio, Android y iPhone | Se abren las vistas correspondientes en cada navegador | Los flujos web se pueden usar en cada equipo sin instalar la app |
| CA31 | RF03, RNF04 | Un lector USB seleccionado y un QR válido | Se prueba el escaneo por lector y el respaldo QR | El lector se reconoce como teclado sin instalar drivers y ambas vías identifican al alumno |
| CA32 | RNF05 | La vista del alumno a 360 px | Se completan las acciones principales definidas para esa vista | La vista es utilizable y las acciones principales requieren hasta dos toques |
| CA33 | RNF07 | Datos ficticios y una habilitación registrada | Se revisan los formularios, registros y acceso a las medidas | Se usan datos ficticios, del certificado se guarda la vigencia y cada alumno consulta solo sus medidas |
| CA34 | RF26, RNF08 | El panel administrador y parámetros iniciales | Se modifican capacidad, horario, período, progresión, cierre automático y modalidades | Los cambios se guardan y se aplican desde la configuración |
| CA35 | RNF09 | La URL de demo y el plan de contingencia | Se abre el despliegue y se revisa el video de respaldo | La URL es accesible para la demo y el video está disponible si falla la red |
| CA36 | RNF10 | Un cambio de aplicación y otro de datos | Se revisa su historial | El cambio tiene un pull request revisado y el SQL correspondiente está en el repositorio |
| CA37 | RNF11 | Un recorrido por las vistas de los roles y la pantalla pública | Se revisan los textos visibles | La interfaz se muestra en español |
| CA38 | RF13, RF14 | Un alumno y un profesor con sus modalidades habilitadas | El alumno crea y edita su rutina y el profesor crea, asigna y edita la de un alumno | Las rutinas conservan sus cambios y origen y la asignación se muestra al alumno |
| CA39 | RF27 | Un alumno con registros corporales de prueba | Registra peso, perímetros y estatura y consulta su historial | Ve su evolución y el IMC correspondiente |
| CA40 | RF28 | Una prueba de factibilidad acordada para alumnos que comparten máquinas | Se comparan los órdenes de ejercicios propuestos | Se registra si el orden reduce las coincidencias según la métrica acordada |
| CA41 | RF29 | Un encargado ante una incidencia de mal uso | Registra la incidencia | La incidencia queda guardada y se puede consultar |
| CA42 | RF30 | Datos de prueba para distintas carreras, horarios, máquinas y préstamos | El administrador consulta los reportes correspondientes | Los resultados corresponden a los datos y filtros usados |
| CA43 | RF31 | Un alumno de prueba y un umbral de inasistencia acordado | La inasistencia alcanza el umbral configurado | Se muestra la alerta al administrador |
| CA44 | RF06, RF07 (R5) | Un alumno con una visita abierta | Se intenta registrar una segunda visita abierta para el mismo alumno | La base de datos lo impide (índice `visitas_una_abierta_por_alumno`) y, al pasar la credencial, se registra la salida en vez de otra entrada. Prueba R5 en `supabase/pruebas/registrar_ingreso.sql` |

## 7. Supuestos y pendientes

Queda pendiente incorporar un criterio directo para la unicidad de visita abierta (R5) y confirmar el efecto de una TNE no devuelta sobre un nuevo préstamo (R9). Estos puntos están consolidados en el [documento maestro](cierre-avances-1-y-2.md#reglas-de-negocio-r1r9).

Ninguno bloquea el Avance 2. Los supuestos quedan como parámetros configurables y se declaran en la presentación.

| Tema | Supuesto o pendiente | Responsable |
| --- | --- | --- |
| Período académico | 3 de marzo al 23 de diciembre, pendiente de confirmación oficial | Vicente |
| Redondeo de cargas | Las cargas ajustadas se redondean al múltiplo de 2,5 kg más cercano | Benjamín |
| Plantillas de rutina | Falta escribir las plantillas por objetivo y nivel (6 combinaciones) | Benjamín |
| Lector | TNE y TUI leídas con NFC Tools en celular. Lector USB de 13,56 MHz elegido. Queda adquirirlo y comprobar ambas tarjetas y el formato del UID. [Registro](pruebas-tarjetas.md) | Pau / Equipo |
| Implementos | Cantidades exactas disponibles para préstamo | Bastián |
| Máquinas | Inventario inicial, fotos y patrones registrados. Los ajustes específicos de máquina faltan en la carga del catálogo | Bastián |
| Reparto (RF28) | Factibilidad por validar con usuarios y una prueba técnica | Vicente y Benjamín |
| Funcionarios | El gimnasio real los acepta; quedan fuera del prototipo como limitación de alcance | Equipo |

## 8. Matriz de cobertura

Los códigos remiten al [registro de decisiones](#1-decisiones-y-trazabilidad), los [requisitos funcionales](#2-requisitos-funcionales), los [no funcionales](#3-requisitos-no-funcionales), los [casos de uso](#5-especificación-de-los-casos-de-uso-principales), los [criterios](#6-criterios-de-aceptación) y el [índice de diagramas](diagramas.md#trazabilidad-del-diseño).

| Área | Requisitos y criterios | Casos | Diagramas |
|---|---|---|---|
| Ingreso, espera y aforo | RF02 → CA02, CA03; RF03 → CA01, CA31; RF04 → CA04; RF05 → CA05; RF06 → CA01; RF07 → CA08; RF08 → CA09; RF09 → CA10; RF10 → CA06, CA07; RNF01 → CA29; RNF02 → CA10, CA11; RNF04 → CA31 | CU01, CU02, CU03, CU11, CU15 | Casos de uso, secuencia, visita y entidad-relación |
| Roles, habilitación y configuración | RF01 → CA23; RF25 → CA28; RF26 → CA17, CA18, CA34; RNF06 → CA23; RNF08 → CA34 | CU12, CU14 | Casos de uso, entidad-relación y arquitectura |
| Rutinas y mantención | RF11 → CA24; RF12 → CA12; RF13 → CA16, CA38; RF14 → CA15, CA38; RF15 → CA16; RF16 → CA11; RF17 → CA13; RF18 → CA14, CA15; RF20 → CA26; RF28 → CA40; RNF02 → CA10, CA11 | CU03, CU04, CU05, CU06, CU10 | Casos de uso, secuencia, visita y entidad-relación |
| Catálogo y préstamos | RF19 → CA25; RF21 → CA27; RF22 → CA19; RF23 → CA20; RF24 → CA21 | CU08, CU09, CU13 | Casos de uso, préstamo y entidad-relación |
| Medidas y privacidad | RF27 → CA22, CA39; RNF06 → CA23; RNF07 → CA33 | CU07 | Casos de uso y entidad-relación |
| Incidencias, reportes e inasistencia | RF29 → CA41; RF30 → CA42; RF31 → CA43 | CU16 | Modelo de reportes en CU16; incidencias e inasistencia sin diagrama específico |
| Calidad transversal | RNF03 → CA30; RNF05 → CA32; RNF09 → CA35; RNF10 → CA36; RNF11 → CA37 | Transversal | Arquitectura y diseño de interfaces |

**Cobertura documental:** 31 RF y 11 RNF con al menos un criterio vinculado. Los criterios de prioridad media conservan sus condiciones de validación.
