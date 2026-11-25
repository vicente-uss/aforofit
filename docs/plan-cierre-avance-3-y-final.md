# Plan de cierre: Avance 3 y entrega final

Lunes 23 de noviembre de 2026, 17:15 (actualizado el martes 24: el Avance 3 se aprobó con 7,0). Reúne **todos los pendientes abiertos** del repositorio, sacados de
AGENTS.md 10, la lista inicial de pendientes del Avance 3, la [auditoría integral](auditoria-proyecto-frameworks-2026-11-23.md), el
[CR-01](cr-01-linea-base-entrega-final.md), los [complementos](complementos-avances-1-y-2.md), la
[auditoría de interfaces](auditoria-interfaces-2026-11-23.md) y `afiche-contenido.md`. Los ordena por hito y por
prioridad. Es la única lista de trabajo vigente (la lista inicial de pendientes se eliminó el 24 de noviembre).

## 0. Modo de trabajo hasta el cierre

- **El desarrollo se hace con agentes** (Claude Code y Codex), coordinados por Vicente. La documentación del
  repositorio es la especificación: cada prompt apunta a AGENTS.md, al CR-01 y a los requisitos y criterios que toca.
- **Ciclo por función:** prompt único → el agente abre un pull request → el otro agente lo revisa (Codex revisa lo
  de Claude Code y al revés) → auditoría contra la documentación → prueba en la vista previa de Vercel → fusión.
- **Se mantiene la regla de AGENTS.md 7:** cada pull request lo aprueba otro integrante en la vista previa, unos
  5 minutos. De paso, cada integrante conoce lo que tendrá que defender.
- **Cada integrante defiende un área** (rúbrica 4, «Participación y trabajo grupal», y bases 8, «defensa por todos
  los integrantes»):

| Integrante | Área que explica y defiende | Pull requests que aprueba |
|---|---|---|
| Vicente | Requisitos, estimación, CR-01, plan y pruebas | — (coordina) |
| Isidora | Modelo de datos, RLS, reglas en la base, generador y progresión | Base de datos y rutina (backend) |
| Benjamín | Interfaces: kiosco, `/aforo`, rutina en el celular, feedback | Pantallas |
| Pau | Lector, flujo de ingreso, demo en vivo, préstamo (si entra) | Ingreso y préstamos |
| Bastián | Pruebas, calidad, afiche, estado de máquinas | Hoja de pruebas y máquinas |

**Lo que un agente no puede hacer** y depende de una persona: usar el lector físico, medir CA29 con tarjetas reales,
grabar el video, hacer la sesión con el encargado, revisar Blackboard, imprimir el afiche, cambiar ajustes en el panel
de Supabase y ensayar. Esas tareas van marcadas como **Persona**.

**Efecto en el CR-01:** se mantiene el supuesto de capacidad de 5 integrantes × 10 h por semana (decisión de
Vicente, 23 de noviembre), así que el CR-01 no cambia. Si con los agentes el ritmo resulta mayor, lo opcional (S1 y
S2) y RNF08 entran en el orden ya definido, sin otro registro de cambio.

**Tipos de tarea:** **Agente** (prompt a Claude Code o Codex) · **Claude** (este asistente: documentos, PPT en
Canva, auditorías) · **Persona** (requiere a alguien del equipo o hardware) · **Externo** (encargado o profesor).

**Prioridades:** **P0** sin esto se pierde puntaje directo · **P1** sube la nota o reduce un riesgo importante ·
**P2** mejora si sobra tiempo.

## 1. Avance 3 — martes 24 de noviembre, 13:10

Rúbrica 3: estimación, esfuerzo, prototipo, pruebas, afiche y defensa (18 puntos).

| ID | P | Tarea | Tipo | Quién | Cuándo | Tiempo | Depende de |
|---|---|---|---|---|---|---|---|
| A3-01 ✅ | P0 | Aprobar el CR-01 (aprobado por el equipo el lun 23, sin cambios) | Persona | Equipo | Lun 23 | 10 min | — |
| A3-02 ✅ | P0 | Hoja de pruebas ejecutadas ([hecha](pruebas-ejecutadas.md)) del flujo de ingreso: cada CA activo con su prueba (Vitest, SQL o manual), resultado y fecha. Correr las pruebas SQL y Vitest de nuevo para tener resultados de hoy | Claude | — | Hoy | 30 min | — |
| A3-03 ✅ | P0 | Completar las láminas 17 a 23 en Canva: ER implementado (17, `docs/diagramas/entidad-relacion-implementado.png`), demo (18), interfaces con la frase de la auditoría (19), pruebas con las cifras de A3-02 (20), dificultades con la auditoría de interfaces y el pull request #9 como corrección (21), afiche (22) y línea base del CR-01 (23) | Claude | — | ✅ Hecho (lun 23) | 1 h | A3-01, A3-02 |
| A3-04 ✅ | P0 | Preparar la demo: el lector y las tarjetas vinculadas en la sala, capacidad según el guion de la lámina 20, aforo en 0 antes de empezar, ingreso manual como plan B | Persona | Pau con el lector; Vicente con la base | Mañana antes de clases | 20 min | Lector disponible |
| A3-05 ✅ | P0 | Ensayo con todos y la respuesta a «¿cómo cierran la brecha?» | Persona | Equipo | Mar 11:30 | 45 min | A3-03 |
| A3-06 ✅ | P1 | Video de respaldo (hecho: 41 s, en el Drive del equipo) de 30 s: entrada, salida y `/aforo` actualizándose (con ingreso manual si no está el lector) | Persona | Vicente o Pau | Hoy | 15 min | — |
| A3-07 ✅ | P1 | Capturas nuevas ([hechas](evidencia/capturas-2026-11-23/README.md)) de `/aforo` (0/20 y lleno con turno) e `/ingreso` desde **producción**, donde no aparece el indicador «N» | Persona | Vicente o Benjamín | Hoy | 10 min | — |
| A3-08 ✅ | P1 | Medir CA29 ([hecho desde el video](medicion-ca29-2026-11-23.md)) con el lector: 5 lecturas, tiempo de cada una con los ms del kiosco | Persona | Pau | Hoy o mañana antes de clases | 10 min | Lector |
| A3-09 ✅ | P1 | Lighthouse de `/aforo` e `/ingreso` desde Chrome (DevTools → Lighthouse) y anotar los 4 puntajes | Persona | Vicente o Bastián | Hoy | 10 min | — |
| A3-10 | P1 | Borrador visual del afiche (aunque falte el formato de Blackboard) | Claude + Persona | Vicente con Bastián | ✅ Borrador hecho (lun 23, A4 vertical); foto del lector incorporada el mar 24 | 45 min | A3-01 |
| A3-11 ✅ | P2 | Declarar la regla de conteo LOC (qué se excluye: plantilla, pruebas, SQL) en `estimacion.md` ([hecha](estimacion.md#21-regla-de-conteo-declarada-antes-de-contar)) | Claude | — | Hoy | 10 min | — |
| A3-12 | P2 | Sesión con el encargado y acta (complementos, sección 9) | Externo | Vicente | Mar ~17:00 | 30 min | Después del avance |

## 2. Entrega final — congelamiento el lunes 30 de noviembre; expo del 1 al 3 de diciembre

Rúbrica 4: alcance, funcionamiento, calidad técnica, pruebas, coherencia, afiche, demo y participación (27 puntos,
70 % de la Solemne).

### P0: sin esto se pierde puntaje directo

| ID | Tarea | Tipo | Requisitos y criterios | Cuándo | Tiempo humano | Depende de |
|---|---|---|---|---|---|---|
| F-01 ✅ | Rutina, parte base de datos (PR #11, aplicado en Supabase el 24 nov: 62 y 42 pruebas SQL OK): tablas de rutinas, ejercicios y feedback con RLS; 6 plantillas (3 objetivos × 2 niveles) con máquinas del catálogo; generador; progresión R8 con redondeo a 2,5 kg; pruebas SQL y unitarias | Agente | RF11, RF12, RF18 · CA12, CA14, CA24 | Mié 25 | 2 h | CR-01 aprobado |
| F-02 ✅ | Rutina, parte pantallas: objetivo y nivel en `/alumno`; rutina del día al registrar la entrada (Realtime, como `/aforo`); advertencia de máquina en mantención; feedback fácil/justo/me costó al salir | Agente | RF11, RF16, RF17, RF18 · CA11, CA13, CA14 | Mié 25 a jue 26 | 2 h | F-01 |
| F-03 ✅ | Estado de máquina Disponible / En mantención desde `/profesor` | Agente | RF20 · CA26 | Jue 26 | 45 min | F-01 |
| F-04 | Afiche definitivo con lo que el CR-01 deja como implementado o próxima versión, en A0 y con el nombre del profesor (indicación del 24 de noviembre) | Claude + Persona | Bases 7 | Jue 26 | 1,5 h | A3-10, formato del profesor |
| F-04b | 20 trípticos a color con el contenido del afiche, impresos en la facultad | Claude + Persona | Indicación del 24 nov | Por definir | 1,5 h | F-04 |
| F-05 | Hoja de pruebas completa: todos los CA activos ejecutados, con resultado, versión y defectos, y riesgo residual | Agente + Persona | Rúbrica 4 «Validaciones y pruebas» | Sáb 28 a dom 29 | 2 h | F-01 a F-03 |
| F-06 ✅ | README reproducible: orden de los SQL `001` en adelante, pruebas SQL y Vitest, usuarios de prueba (sin contraseñas), cómo cambiar la capacidad y plan de respaldo de la demo | Agente | Bases 8; FW-IS 7.2 | Dom 29 | 30 min | F-01 |
| F-07 | Plan de demo final con respaldo: hotspot, video, ingreso manual, datos limpios (aforo 0/20) y el celular con la sesión del alumno abierta | Claude + Persona | Rúbrica 4 «Demostración» | Lun 30 | 1 h | F-02 |
| F-08 | Congelamiento: actualizar AGENTS.md 3 y 10, la matriz de cobertura, los diagramas y cerrar el CR-01 con su evidencia | Claude | Rúbrica 4 «Coherencia» | Lun 30 | 1 h | Todo lo anterior |

### P1: sube la nota o reduce un riesgo importante

| ID | Tarea | Tipo | Requisitos y criterios | Cuándo | Tiempo humano |
|---|---|---|---|---|---|
| F-09 ✅ | Configuración mínima desde `/admin`: capacidad, horario y cierre automático (D24; el período académico ya no aplica por D20). Solo después de F-01 a F-03 | Agente | RF26 · CA34 | Jue 26 | 45 min |
| F-28 ✅ | Botón «Cerrar visita» en `/profesor` para quien no marcó la salida (D21, pedido del encargado), con prueba | Agente | R6 · RF08 | Jue 26 | 30 min |
| F-29 ✅ | Nombre e inicial del apellido junto al turno llamado en `/aforo` y `/profesor/espera` (D22, pedido del encargado), con prueba | Agente | RF10 · D14 | Mié 25 | 30 min |
| F-31 ✅ | Cantidades reales de implementos (`supabase/sql/010_implementos_reales.sql`, aplicado el 24 nov: 5 implementos, 9 unidades; PR #10) | Persona | RF21 | Mar 24 | Hecho |
| F-32 ✅ | Regla 2 con vigencia de un año desde la emisión (D20): quitar de `registrar_ingreso` el rechazo `fuera_de_periodo` y actualizar requisitos, CA y pruebas SQL | Agente + Claude | R2 · RF25 · CA28 | Mié 25 | 20 min |
| F-10 ✅ | Préstamo básico con la TNE: varios implementos, devolución completa y bloqueo con pendientes (S1 del CR-01) | Agente | RF22, RF23 · CA19, CA20 | Vie 27 | 1,5 h |
| F-11 ✅ | Habilitación desde `/admin`: vigencia del certificado (S2 del CR-01) | Agente | RF25 · CA28 | Vie 27 | 45 min |
| F-12 | Matriz de cobertura con las columnas «implementado» y «resultado de prueba» | Claude | Rúbrica 4 «Coherencia» | Dom 29 | 30 min |
| F-13 ✅ | Diagramas al día: ER con las tablas nuevas y secuencia con la rutina | Claude | — | Dom 29 | 30 min |
| F-14 | Medir los RNF que faltan: RNF02 en la rutina, RNF03 en computador, Android y iPhone, RNF05 a 360 px | Persona | CA11, CA30, CA32 | Sáb 28 | 45 min |
| F-15 | Guion de defensa por integrante: qué explica cada uno y 3 preguntas probables de su área | Claude + Persona | Rúbrica 4 «Participación» | Dom 29 | 1 h |
| F-16 | Activar en Supabase la protección contra claves filtradas | Persona | RNF06 | Cualquier día | 2 min |
| F-26 ✅ | Aviso visible en `/ingreso` cuando la página pierde el foco («Lector en pausa: haz clic aquí») y guía para abrir el kiosco en modo pantalla completa de Chrome (hallazgo de Pau, 23 nov) | Agente | RNF04 · CA31 | Mié 25 | 30 min |
| F-17 | Revisión cruzada de los complementos de los avances 1 y 2 por otro integrante | Persona | FW-IR 9.2 | Antes del 30 | 20 min |
| F-18 ✅ | Decidir R9 con el encargado: sí bloquea (D19, acta del 24 de noviembre) | Externo | R9 | Mar 24, 17:00 | Hecho |

### P2: si sobra tiempo antes del congelamiento

| ID | Tarea | Tipo | Requisitos |
|---|---|---|---|
| F-19 | Registro corporal privado con IMC | Agente | RF27 · CA22, CA39 |
| F-20 | Devoluciones parciales y garantías pendientes (préstamo completo) | Agente | RF23, RF24 · CA21 |
| F-21 | QR de respaldo | Agente | RF03 · CA31 |
| F-22 | Rutinas creadas por el alumno o asignadas por el profesor | Agente | RF13 a RF15 · CA15, CA16, CA38 |
| F-23 | Turno llamado que vence solo, sin esperar otra lectura (detalle menor aceptado) | Agente | RF10 |
| F-24 | Pantallas del catálogo: máquinas con foto e implementos | Agente | RF19, RF21 · CA25, CA27 |
| F-27 | Al vincular, elegir si la tarjeta es TNE o TUI (hoy se guarda todo como `tne`); mostrar las tarjetas que ya tiene el alumno | Agente | RF02 · D17 |
| F-25 ✅ | Cantidades de implementos y período académico confirmados en el Playback (F-31 y D20) | Externo | Hecho |
| F-30 | Aviso «Olvidaste tu TNE» en el perfil del alumno, enviado por el profesor (pedido del encargado) | Agente | RF24 · P5 |

**Regla para P2:** solo se suma al afiche lo que esté fusionado y probado **antes del jueves 26**. Lo que entre
después se muestra en la demo, pero el afiche lo deja como «próxima versión».

## 3. Calendario resumido

| Día | Avance 3 | Entrega final |
|---|---|---|
| Lun 23 (hoy) | A3-01, A3-02, A3-03, A3-06, A3-07, A3-09, A3-10, A3-11 | — |
| Mar 24 | A3-04, A3-05, presentación, A3-12 (17:00) | Prompt F-01 en la noche |
| Mié 25 | — | F-01 fusionado, F-02 en curso |
| Jue 26 | — | F-02, F-03, F-09; **afiche F-04** |
| Vie 27 | — | F-10, F-11 |
| Sáb 28 | — | F-05 (pruebas), F-14 |
| Dom 29 | — | F-05, F-06, F-12, F-13, F-15 |
| Lun 30 | — | F-07, F-08, **congelamiento** |
| 1 al 3 dic | — | Expo y defensa |

## 4. Riesgos de este plan

| Riesgo | Señal | Respuesta |
|---|---|---|
| La revisión humana no alcanza el ritmo de los agentes | Pull requests abiertos más de un día | Hacer solo P0 y P1 hasta el jueves; P2 queda para después |
| Un agente se sale del alcance o inventa reglas | El pull request toca archivos fuera de su tarea | Los prompts citan AGENTS.md 3 y 4 y el CR-01; la auditoría compara contra la documentación antes de fusionar |
| El lector no está cuando hace falta | Pau no está en la sala | Ingreso manual (misma función) y video |
| Alguien del equipo no puede explicar su área en la defensa | En el ensayo | Guion por integrante (F-15) y que cada uno apruebe los pull requests de su área |
| Cambios de último minuto rompen la demo | Error en producción después del jueves | Desde el sábado solo correcciones; volver a la versión anterior en Vercel si algo falla |

## 5. Checklist de Vicente: hoy y mañana

### Hoy en la noche, al recibir las entregas del equipo

- [ ] Enviar a Claude cada entrega a medida que llegue, aunque esté incompleta: Pau (casos con el lector, CA29 y
  video), Benjamín (capturas nuevas, prueba de turnos y frase de la lámina 19), Isidora (diagrama o ideas para la
  lámina 17) y Bastián (hoja de pruebas, Lighthouse y avance del afiche)
- [ ] Aprobar la vista previa de las láminas 17 a 23 en Canva antes de guardarlas (las arma Claude con esas entregas)
- [x] Revisar el [CR-01](cr-01-linea-base-entrega-final.md): aprobado por el equipo el lunes 23
- [ ] Dejar la base lista para la demo en el SQL Editor de Supabase y comprobar que
  https://aforofit.vercel.app/aforo muestre **0 / 20**:

  ```sql
  update visitas set salida = now() where salida is null;
  update turnos set estado = 'expirado' where estado in ('esperando','llamado');
  update configuracion set capacidad = 20 where id = 1;
  ```

**Si alguna entrega no llega:**

- [ ] Video: grabarlo en 30 s con el ingreso manual del kiosco
- [ ] Capturas: sacarlas desde producción (sin el indicador «N»)
- [ ] Lighthouse: Chrome → F12 → Lighthouse → Analyze, en `/aforo` y en `/ingreso`, y anotar los 4 puntajes

### Mañana martes 24

- [ ] Antes de las 11:30: confirmar con Pau que lleve el lector y sus tarjetas vinculadas
- [ ] 11:30, ensayo (el CR-01 ya está aprobado): ensayar la respuesta a «¿cómo cierran la brecha?»
  (está en el guion)
- [ ] Antes de presentar: bajar la capacidad a 2 para mostrar el turno (lámina 20) y volverla a 20 al terminar:

  ```sql
  update configuracion set capacidad = 2 where id = 1;
  ```

- [ ] 13:10: Avance 3
- [ ] Cerca de las 17:00: sesión con el encargado con el guion de la
  [sección 9 de los complementos](complementos-avances-1-y-2.md#9-validación-con-el-encargado-playback); contarle
  a Claude el resultado para completar el acta
- [ ] En la noche: pedir el prompt de F-01 (rutina, base de datos) y empezar la entrega final
