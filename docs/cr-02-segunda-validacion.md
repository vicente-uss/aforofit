# CR-02 · Segunda validación y ampliación funcional de AforoFit

**Fecha:** 27 de noviembre de 2026. **Estado:** requisitos acordados con el coordinador; revisión formal del equipo y del encargado pendiente. La rama `cr02-inscripcion-acceso` implementa CR02-01 a CR02-04 con las migraciones 025 y 026.
**Origen:** apuntes de la segunda validación presencial con el encargado del gimnasio y aclaraciones posteriores del coordinador. No constituye transcripción literal ni acta firmada del encargado.
**Base preservada:** main `d91dc915bbcdb3d900062d9cb815cbd54ad33a6e` (PR #29 documental integrado), migraciones hasta 024; PR #28 certificado con 793 comprobaciones (278 Vitest + 515 SQL). El alcance original CR-01 queda como referencia histórica. No se promete ganar la evaluación ni se declara aprobado lo nuevo antes de comprobarlo.

## 1. Objetivo y alcance

Reducir la transcripción manual desde Google Forms, Excel y Outlook; concentrar inscripción, control de acceso, préstamos, inventario, calendario de multicancha y reportes de gestión en una sola experiencia para los encargados. Conservar el aforo, turnos, rutinas, medidas privadas y demás funcionalidades ya certificadas. Solo prototipo académico y datos ficticios, sin integración USS.

| ID provisional | Requisito | Criterio de aceptación |
|---|---|---|
| CR02-01 | Inscripción manual por profesor | Registrar y editar una persona desde una interfaz simple con los campos de la sección 2; validar RUT único y correo institucional; adjuntar certificados y consultar estado. No hay botón de importar Excel. |
| CR02-02 | Categorías de usuarios | Admitir estudiante, funcionario/colaborador y deportista destacado; excluir otros. Estudiante y funcionario requieren certificado médico; destacado queda exento de ese certificado. |
| CR02-03 | Ingreso manual por RUT | El profesor escribe el RUT dictado por la persona; mismo flujo de entrada/salida, aforo, espera y validaciones que el lector. Lector TNE/TUI principal; RUT segunda opción; QR última opción, sin obligar al profesor a encender cámara. |
| CR02-04 | Autorización excepcional | Mostrar aviso de certificado médico pendiente/no vigente y botón para autorizar ese ingreso, repetible sin límite de usos; conservar la exigencia en futuras visitas, horario, capacidad y turno. No altera la vigencia ni otros motivos de rechazo. |
| CR02-05 | Préstamos por nombre | Escribir nombre libre, seleccionar sugerencias de solicitantes recientes/autocompletado, incluso si nunca se inscribió al gimnasio. TNE retenida físicamente como garantía; no leer NFC en este módulo. Mantener devolución parcial y bloqueo por pendientes hasta entregar TNE. |
| CR02-06 | Profesor con modo admin | Una cuenta `profesor.demo` para la demo; botón rojo inferior Modo administrador, PIN de seis dígitos configurado fuera del cliente, comprobado por servidor; modo temporal con salida visible. Alumnos no pueden activar el modo. No ampliar auditorías ni deshacer permisos actuales; conservar cuenta admin separada de respaldo mientras se valida. |
| CR02-07 | Calendario multicancha | Reemplazar Outlook con calendario propio. Profesor crea, modifica y cancela reservas presenciales; no permitir reserva directa desde alumno. Bloques académicos, talleres y eventos deportivos tienen prioridad; impedir solapamientos, mostrar disponibilidad. |
| CR02-08 | Responsable y nómina | Registrar nombre, carrera y correo del responsable (RUT no obligatorio para crear la reserva); preferir responsable con cuenta vinculada. El responsable completa o corrige la nómina de compañeros desde Mis reservas, con nombre, RUT y carrera. No obtiene permisos para reservar nuevos horarios. |
| CR02-09 | Correo de confirmación | Preparar destinatario, horario, respuesta precargada y reglamento adjunto PDF preferente (DOCX si corresponde). Ideal: envío real desde la app con cuenta Gmail de prueba autorizada; fallback explícito de copiar/descargar y enviar manualmente, nunca simular envío exitoso. |
| CR02-10 | Dashboard | Gráficos de ingresos de personas, ranking de frecuencia, préstamos y reservas, con períodos mensual, semestral y anual. No exportar Excel ni PDF. |
| CR02-11 | Inventario completo | Registrar todos los bienes deportivos, con nombre, foto, cantidad y estado; diferenciar prestables de no prestables para no mezclar stock. Fotos reales pendientes; usar placeholders identificados hasta recibirlas. |
| CR02-12 | Rutina de adaptación | Precargar programa de adaptación asignable desde el panel profesor, manteniendo las tres modalidades, historial y feedback. No inventar ejercicios de un programa aún no transcrito. |
| CR02-13 | Demo | Cinco cuentas ficticias de alumno independientes (alumno1 a alumno5), acceso fácil desde celulares de evaluadores, y una cuenta de profesor con modo admin. No incluir contraseñas en Git. |
| CR02-14 | Rediseño USS | Nueva iteración en Figma, diseño coherente con Kit Digital USS, escritorio y móvil; confirmar logo y tokens oficiales antes de declarar identidad institucional aplicada. |

## 2. Inscripción: formulario fuente

Campos proporcionados por el coordinador desde «Inscripción Sala de Musculación» de Google Forms:
- Nombre completo; RUT sin puntos y con guion; correo institucional @uss.cl o @correo.uss.cl.
- Fecha de nacimiento (DD/MM/AAAA); teléfono +56 9XXXXXXXX; contacto de emergencia y teléfono de emergencia.
- Datos a considerar (enfermedades/lesiones/otros); tipo de inscripción (estudiante o funcionario/colaborador en el formulario original); carrera para estudiante.
- Certificado médico y certificado de alumno regular, archivo de máximo 10 MB cada uno según formulario. El coordinador añade deportista destacado como tercera categoría; certificado de alumno regular aplica a estudiantes, no a funcionarios. Confirmar cómo acredita la condición de destacado. Los documentos de demo son ficticios y de acceso restringido.
- Conservar el reglamento de ingreso y entrenamiento del formulario: indicar RUT, toalla de mano, ropa/calzado deportivo (sin jeans/ropa clínica), sin acompañantes, mantener orden, consultar al profesor y avisar desperfectos.
- El equipo se compromete a importar el Excel directamente a la BD únicamente si el proyecto gana y se implementa, con autorización institucional y datos reales gestionados fuera del prototipo. No solicitar archivo sensible ni construir importador en UI.

## 3. Operación de multicancha

Reservas ordinarias presenciales entre 08:00 y 16:00, módulos de 80 minutos, según horario impreso. Propuesta transcrita en la conversación: 08:00–09:20, 09:30–10:50, 11:00–12:20, 12:30–13:50, 14:30–15:50; cotejar con la fotografía original antes de parametrizar. Bloques prioritarios académicos/deportivos pueden extenderse después de las 16:00. Registrar responsable primero; enviar correo con instrucciones y reglamento; alumno vinculado completa nómina en su panel. Profesor puede cancelar/modificar; una actividad prioritaria que choca con reserva existente requiere resolución explícita, no borrado silencioso. Confirmar días habilitados, límite de participantes, plazo para nómina y tratamiento de responsables sin cuenta. Mientras tanto, el profesor puede completar nómina presencialmente como respaldo propuesto.

## 4. Decisiones técnicas propuestas (no ejecutadas)

- Guardar una referencia de la versión 024 antes de cambios. Trabajar por ramas y PR. Se permite rediseñar esquema y recargar datos ficticios en entorno desechable; no borrar el entorno desplegado sin respaldo, plan y aprobación explícita.
- Separar identidad de persona, cuenta, condición de acceso, certificados y solicitante de préstamo. Reutilizar IDs de solicitantes en autocompletado; si hay homónimos, mostrar coincidencias y permitir distinguirlos sin exigir inscripción. Mantener inventario transaccional y garantía TNE.
- Reutilizar configuración, cron y Realtime; los nuevos accesos deben pasar por la misma lógica de aforo. PIN no es un rol decidido en frontend ni secreto público; limitar elevación a la cuenta de encargado. No iniciar otro ciclo independiente de endurecimiento de seguridad.
- Calendario propio, no sincronización Outlook. Correo con Gmail: verificar mecanismo autorizado y condiciones de cuenta, sin enviar a direcciones reales durante QA; si no está listo, mostrar fallback honesto.
- No medir uso real de máquinas a partir de rutinas previstas. RF30 puede cubrir asistencia, préstamos y reservas; uso efectivo de máquinas requiere evidencia propia. RF28, RF29 y RF31 siguen fuera de este incremento salvo decisión posterior.

## 5. Plan de implementación

| Orden | Rama sugerida | Dependencias |
|---|---|---|
| 0 | cr-02-ampliacion-funcional | Documento y aprobación de alcance |
| 1 | diseno-cr02 | Figma: navegación, formularios, estados, diseño USS |
| 2 | inscripcion-acceso-cr02 | Modelo personas, certificados, RUT, excepción, datos demo |
| 3 | modo-admin-cr02 | Contrato de permisos y modo de encargado |
| 4 | prestamos-inventario-cr02 | Identidad de solicitante y catálogo |
| 5 | multicancha-cr02 | Calendario, prioridad, responsable, nómina, correo |
| 6 | reportes-cr02 | Datos y consultas de los módulos anteriores |
| 7 | rutinas-demo-cr02 | Programa transcrito, cuentas demo y fotos |
| 8 | cierre-cr02 | Aplicar identidad visual, regresión, evidencia, documentos y congelamiento |

Se pueden paralelizar prototipo, análisis de esquema, calendario y dashboard mediante contratos antes de integrar. Numerar migraciones desde 025 después de fijar dependencias; no colisionar. Mantener certificación de las 793 pruebas existentes o justificar, mapear y reemplazar casos afectados por cambios de requisitos (p. ej. préstamos sin lector). No contar dos veces ni afirmar cobertura completa sin ejecutar. Prioridad crítica: inscripción, RUT y préstamo ágil; luego calendario, modo admin, reportes y calidad visual.

## 6. Pendientes de validación e insumos

- Reglamento original de multicancha (esperado del encargado al día siguiente; no recibido).
- Fotografías del inventario completo y catálogo de bienes/ejercicios (esperadas al día siguiente; no recibidas).
- Transcribir programa de adaptación, confirmar módulos exactos, días, reglas de prioridad, plazos de nómina y acreditación de deportistas destacados.
- Confirmar identidad oficial USS, cuenta de correo de prueba y mecanismo de envío.
- Confirmar responsables, versión y evidencia con equipo/encargado; revisión de requisitos y criterios; pruebas físicas y en producción siguen pendientes.
