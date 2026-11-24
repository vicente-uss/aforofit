# AforoFit — Revisión del prototipo de Figma Make

El documento maestro incorpora esta sección en el [anexo de revisión de Figma](cierre-avances-1-y-2.md#anexo-c-revisión-de-figma).

16 de noviembre de 2026 · Vicente Galleguillos

Para: Benjamín Velásquez. **Estado al 16 de noviembre: las 8 correcciones de código y los 4 ajustes de la segunda revisión están aplicados en el prototipo de Figma Make** (versión 5 de los datos de prueba). Solo queda reemplazar las fotos de las máquinas por las reales y sacar las capturas para el Avance 2. El prototipo cubre los 16 casos de uso; antes de presentar, usar “Restablecer demo” en el login.

Prototipo: [AforoFit en Figma Make](https://www.figma.com/make/onv7W4YD13BPc7HAQ5jjef)

## Correcciones importantes

### 1. El profesor no puede crear ni asignar rutinas

**Estado: corregido el 16 de noviembre.** Menú “Asignar rutinas” con lista de rutinas asignadas, selector de alumno y edición en `/profesor/rutinas/:id/editar`.

**Qué pasa:** el modelo ya tiene el origen “profesor”, pero ninguna página del profesor permite crear, asignar ni editar la rutina de un alumno.

**Por qué importa:** incumple RF14 y el caso de uso compartido CU06, que la decisión D15 deja en prioridad alta.

**Cómo corregirlo:**

1. Agregar la ruta `/profesor/rutinas` al menú del profesor.
2. Reutilizar `EditorRutina` con una propiedad `modo="profesor"` y un selector de alumno arriba.
3. Al guardar, poner `origen: "profesor"`, el nombre del profesor en `autor` y asignar la rutina al alumno elegido.
4. En *Mis rutinas* del alumno, mostrar un aviso “Tu profesor te asignó una rutina” con el botón *Seleccionar como activa*.

**Listo cuando:** el profesor crea una rutina para un alumno, esta aparece en sus rutinas con la etiqueta Profesor y, al dar feedback, las cargas no cambian (CA15).

### 2. La credencial y la TNE están modeladas por separado

**Estado: corregido el 16 de noviembre.** Tabla de tarjetas con UID en formato de chip para la credencial USS y la TNE; la misma búsqueda sirve para el ingreso y el préstamo.

**Qué pasa:** para el ingreso se busca al alumno por el UID del chip (`04:A3:7F:2B`); para el préstamo, por el número impreso de la TNE (`TNE-120931`).

**Por qué importa:** el lector siempre entrega el UID del chip, nunca el número impreso. Con este modelo, pasar la TNE por el lector en el préstamo no encontraría al alumno, y la decisión D16 no se cumple.

**Cómo corregirlo:**

1. Reemplazar los campos `credencial` y `tne` del alumno por una lista de tarjetas: `{ uid, tipo: "credencial_uss" | "tne", alumnoId }`.
2. Usar la misma búsqueda por UID (`alumnoPorUid`) en el ingreso y en el préstamo.
3. Guardar en el préstamo el UID de la tarjeta dejada como garantía. Opcionalmente, mostrar los últimos 4 dígitos impresos para que el profesor la reconozca.
4. Mantener la regla de unicidad: un UID pertenece a un solo alumno (CA03).

**Listo cuando:** la misma tarjeta, pasada por el mismo lector, sirve para entrar al gimnasio y para pedir un préstamo.

### 3. Un alumno sin turno puede quitarle el cupo a un turno llamado

**Estado: corregido el 16 de noviembre.** Los turnos llamados reservan su cupo; un alumno sin turno recibe número si no quedan cupos libres después de las reservas.

**Qué pasa:** al llamar un turno, `llamarSiguienteTurno` reserva el cupo. Pero `registrarIngreso` decide si el gimnasio está lleno comparando solo `ocupacion >= capacidad`, sin descontar los turnos llamados.

**Por qué importa:** si un alumno sin turno pasa su credencial justo después del llamado, entra; cuando llega el alumno llamado, el gimnasio ya está lleno. Rompe la regla 4 (orden de llegada) y el criterio CA07.

**Cómo corregirlo:**

```ts
const llamados = s.turnos.filter((t) => t.estado === "llamado").length;
const esLlamado = turnoPropio?.estado === "llamado";
const cuposLibres = s.config.capacidad - ocup - (esLlamado ? llamados - 1 : llamados);
const lleno = cuposLibres <= 0;
```

El alumno llamado usa su cupo reservado; cualquier otro solo entra si quedan cupos libres después de las reservas.

**Listo cuando:** con 19 personas adentro y el turno 7 llamado, un alumno sin turno recibe el turno 9 y el alumno del turno 7 entra.

## Correcciones menores

| # | Qué pasaba | Cómo se corrigió | Requisito | Estado |
| --- | --- | --- | --- | --- |
| 4 | El cierre automático a las 3 horas solo se mostraba | `cerrarVisitasVencidas()` cierra las visitas vencidas, las marca en el historial y libera el cupo; se ejecuta al abrir el panel del profesor y al cambiar la hora simulada | RF08, CA09 | Corregido |
| 5 | `certVigente` no revisaba el fin del período académico | Se agregó la condición `fecha <= periodo.fin` | RF04, D03 | Corregido |
| 6 | El feedback solo se activaba para el alumno de demo | Feedback pendiente y rutina activa guardados por alumno | RF18 | Corregido |
| 7 | La estatura para el IMC estaba fija | Campo Estatura en el modal Registrar medición | RF27 | Corregido |
| 8 | Las fotos de las máquinas son de Unsplash | Usar las [fotos del inventario](../supabase/storage/maquinas/) en Figma | P7 | Fotos disponibles en el repositorio; reemplazo en Figma sin verificar |

## Paso a Next.js y Supabase

El prototipo usa Vite + React y guarda los datos en el navegador (localStorage). La app real va en Next.js con Supabase, según AGENTS.md. Casi todo se reutiliza:

| Parte del prototipo | Qué hacer con ella |
| --- | --- |
| `components/ui` y `components/domain` | Copiarlos al repositorio casi tal cual: ya usan Tailwind |
| Páginas (`pages/`) | Moverlas a rutas de Next.js (`app/alumno/...`, `app/profesor/...`, `app/admin/...`, `app/aforo`) |
| `store/types.ts` | Usarlo como borrador del modelo de datos: cada interfaz es una tabla (ver abajo) |
| Funciones de `store/store.ts` | Convertirlas en consultas a Supabase o funciones en la base de datos; las validaciones se mantienen |
| Sincronización entre pestañas (`storage`) | Reemplazarla por Supabase Realtime en las tablas `visitas` y `turnos` |
| Panel de demostración (hora simulada, llenar aforo) | Mantenerlo solo para el rol administrador: sirve para mostrar los criterios de aceptación en la expo |

### De `types.ts` a tablas

- **alumnos** (sin `credencial` ni `tne`) y **tarjetas** (`uid` único, `tipo`, `alumno_id`): corrige el punto 2.
- **visitas** (`entrada`, `salida`, `cierre_automatico`): une `Visita` y `VisitaHistorial`, para que entrada y salida queden en una sola fila.
- **turnos**, **maquinas**, **implementos**, **prestamos** y **prestamo_items**.
- **rutinas** con `origen`, `autor_id` y `alumno_id`, y **ejercicios** como tabla aparte.
- **mediciones** con política de acceso para que solo las lea su dueño.
- **feedback** (`visita_id`, `rutina_id`, `valor`).
- **configuracion** con una sola fila.

Vicente lo cruza contra las 9 reglas de negocio antes de crear las tablas.

## Checklist de cierre

El checklist registra correcciones del prototipo Figma y evidencia del Avance 2. Para el estado del código Next.js, consulta el [documento de cierre](cierre-avances-1-y-2.md).

- [x] Pantalla del profesor para crear y asignar rutinas (punto 1)
- [x] Tabla de tarjetas: un UID para el ingreso y el préstamo (punto 2)
- [x] Cupos reservados para turnos llamados (punto 3)
- [x] Cierre automático de visitas vencidas (punto 4)
- [x] Validación del fin del período académico (punto 5)
- [x] Feedback por alumno (punto 6)
- [x] Campo de estatura en el registro corporal (punto 7)
- [x] Fotos del inventario disponibles en el repositorio.
- [ ] Verificar que Figma use esas fotos (punto 8, con Bastián).
- [x] Capturas por actor incluidas en las láminas de interfaces del [Avance 2](entregas/avances/AforoFit-Avance2-Grupo6.pdf).

### Correcciones registradas en la segunda revisión (16 de noviembre)

- [x] Rutina activa por alumno (`rutinaActivaPorAlumno`)
- [x] El profesor puede editar las rutinas que ya asignó
- [x] Mensaje correcto cuando la modalidad del profesor está deshabilitada
- [x] UID de las TNE en formato de chip (`04:XX:XX:XX`), sin duplicados

**Para la app real (Next.js y Supabase):** las mediciones corporales siguen siendo una sola lista; en la base de datos deben quedar asociadas a cada alumno, con acceso solo para su dueño.
