# Acta de Playback — martes 24 de noviembre de 2026

Validación del prototipo programado con el profesor encargado del gimnasio, según el guion de la
[sección 9 de los complementos](complementos-avances-1-y-2.md#9-validación-con-el-encargado-playback) (FW-IR 11).

- **Fecha y hora:** martes 24 de noviembre de 2026, de 17:10 a 17:30 aproximadamente.
- **Lugar:** gimnasio de la USS Bellavista.
- **Asistentes:** el profesor encargado del gimnasio (el mismo de la [entrevista del 12 de noviembre](entrevista-encargado-2026-11-12.md))
  y Vicente Galleguillos.
- **Fuente:** dos notas de voz grabadas durante la sesión (17:13, demo, unos 6 min; 17:23, preguntas, unos 8 min),
  transcritas en forma automática y revisadas por Vicente el mismo día. Las respuestas de este acta son las que Vicente
  confirmó; los audios no se suben al repositorio.

## Qué se mostró

Prototipo en producción (`https://aforofit.vercel.app`), `/ingreso` con sesión de profesor y `/aforo`, con la capacidad
bajada a 2 para la prueba. El lector USB estaba con Pau, así que la demo se hizo con el **ingreso manual** del kiosco
(mismo camino que la tarjeta: `registrar_ingreso`). Se explicó que en el gimnasio el lector escribe el código al acercar la TNE.

Flujo mostrado: entrada → gimnasio lleno → turno → rechazo por certificado no vigente → salida que llama el turno →
entrada con turno → credencial no registrada y vinculación a una alumna ficticia. Se le aclaró que la pantalla es un
prototipo y que la rutina en el celular todavía no está construida (no se validó).

## Qué validó el encargado

- **Flujo de ingreso: validado.** Le pareció simple y funcional; no pidió cambios.
- **Llamado del turno:** prefiere que lo llame el sistema solo, porque los profesores atienden otras áreas (confirma D14).
- Le pareció una buena idea, más práctica que el registro en papel, y comentó que podría servir en otros gimnasios o sedes.

## Qué pidió cambiar o agregar

1. **Nombre en el turno llamado:** que `/aforo` muestre el nombre de la persona llamada, no solo «Turno N».
   Se aprueba **nombre e inicial del apellido** (por ejemplo «Turno 3 · Catalina D.»), porque `/aforo` es pública.
2. **Cerrar una visita a mano:** poder quitar desde el panel a un alumno que se fue sin marcar la salida («más de uno
   no va a marcar, sobre todo al principio»). Complementa el cierre automático a las 3 horas (R6).
3. **TNE olvidada:** si un alumno deja su TNE de garantía, un botón para avisarle en su perfil.

## Respuestas a las preguntas abiertas

| Pregunta | Respuesta |
|---|---|
| ¿El ingreso le sirve así? | Sí, sin cambios |
| ¿Turno automático o con botón? | Automático, con el nombre e inicial del apellido en pantalla |
| R9: ¿un alumno que devolvió todo, pero no retiró su TNE, puede pedir otro préstamo? | **No.** Además, la TNE de garantía solo se deja con el profesor, no hace falta pasarla por el lector |
| Implementos para préstamo | 2 balones de fútbol, 2 de vóleibol, 2 de básquetbol, 2 paletas y 1 pelota de taca-taca |
| Período académico | **No aplica.** El certificado médico dura **un año desde su fecha de emisión** (emitido en noviembre de 2026, vence en noviembre de 2027) |
| ¿Rutina o préstamos primero? | Sin preferencia: que el equipo priorice lo que más le sirva al proyecto |

## Decisiones nuevas

| Código | Decisión |
|---|---|
| D19 | R9: un alumno con la TNE de garantía sin retirar no puede abrir otro préstamo, aunque haya devuelto todos los implementos. La TNE se deja físicamente con el profesor; pasarla por el lector no es obligatorio para la garantía |
| D20 | La vigencia del certificado médico es de un año desde su fecha de emisión, no el período académico (reemplaza D03). La base ya guarda `certificado_hasta`; solo cambia cómo se calcula |
| D21 | El profesor puede cerrar a mano la visita de un alumno que no marcó la salida, desde `/profesor` |
| D22 | `/aforo` muestra junto al turno llamado el nombre y la inicial del apellido del alumno, nunca el nombre completo ni el RUT |
| D23 | Prioridad de la entrega final: la decide el equipo según el beneficio para la evaluación; se mantiene el CR-01 (rutina primero) |
| D24 | RNF08: pantalla mínima en `/admin` para capacidad, horario y cierre automático, después de F-01 a F-03; si el jueves 26 la rutina no está lista, queda como limitación declarada. CA34 queda parcial |

## Acciones, responsables y fechas

| ID | Acción | Responsable | Fecha |
|---|---|---|---|
| F-28 | Botón «Cerrar visita» en `/profesor` para quien no marcó la salida (D21), con prueba | Agente + revisor | Jue 26 |
| F-29 | Nombre e inicial del apellido junto al turno llamado en `/aforo` y en `/profesor/espera` (D22), con prueba | Agente + revisor | Mié 25 |
| F-30 | Aviso «Olvidaste tu TNE» en el perfil del alumno, enviado por el profesor | Agente | P2, si sobra tiempo |
| F-31 | Cargar las cantidades reales de implementos (`supabase/sql/010_implementos_reales.sql`) | Vicente | Mié 25 |
| F-32 | Regla 2 y criterios de habilitación: vigencia de un año desde la emisión (D20) | Claude | Mié 25 |
| — | Carga de alumnos desde el Excel del gimnasio | — | Trabajo futuro: el prototipo solo usa datos ficticios (D11) |

## Limitaciones de esta validación

- No se vio el lector en vivo (se mostró el ingreso manual); la lectura con TNE está probada por separado
  ([pruebas de tarjetas](pruebas-tarjetas.md) y [medición CA29](medicion-ca29-2026-11-23.md)).
- La rutina, el feedback y el estado de máquinas no se mostraron porque todavía no existen.
- La transcripción automática tuvo partes poco claras; lo que quedó en este acta fue confirmado por Vicente.
