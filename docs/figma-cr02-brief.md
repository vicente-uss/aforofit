# Brief de rediseño CR-02 · AforoFit

Usar [CR-02](cr-02-segunda-validacion.md) como fuente. Crear una nueva iteración, sin reemplazar el prototipo original. Objetivo: una herramienta operativa rápida de gestión deportiva USS, no un sistema de reservas públicas.

## Pantallas y flujos de diseño
- Login: acceso profesor, cinco cuentas de alumno de demostración (sin contraseñas visibles).
- Profesor: inicio con ocupación, turnos, préstamos pendientes y próximas reservas; navegación lateral escritorio, acciones claras en móvil. Botón rojo inferior Modo administrador, modal PIN 6 dígitos, indicador de modo activo y volver a profesor.
- Kiosco: lector protagonista, campo RUT escrito por profesor, teclado numérico opcional con K/guion, QR secundario. Estados ingreso/salida, espera, certificado médico pendiente con autorización excepcional, rechazo no exceptuable.
- Inscripción: lista/búsqueda de personas, alta y edición por secciones de identificación, contacto, antecedentes y documentos. Estado de certificado, adjuntar y consultar archivos ficticios; campos condicionales por categoría. Sin importación Excel.
- Préstamos: entrada por nombre, coincidencias y recientes, selección de varios implementos, confirmación TNE física, pendientes/devoluciones parciales y entrega de garantía. Sin lector.
- Inventario: catálogo completo, fotos, categoría, stock/estado y prestabilidad; vista admin para alta/edición.
- Multicancha: calendario semanal con módulos de 80 min, bloques libres/ocupados/prioritarios, modal de reserva presencial, responsable, edición/cancelación, detalle y nómina, preparar/enviar correo con PDF (estados enviado, pendiente y error).
- Alumno móvil: conservar QR, rutina, medidas e historial; añadir Mis reservas con datos de reserva existente y formulario de compañeros (nombre/RUT/carrera), sin botón de nueva reserva.
- Dashboard: selector mensual/semestral/anual, asistencia y ranking, préstamos y reservas; métricas honestas y sin exportaciones.
- Rutinas: asignación del programa de adaptación desde profesor, conservar las modalidades actuales.
- Pantalla de aforo pública: conservar anonimización y lectura a distancia.

Diseñar primero flujos operativos a 1440 px y alumno a 390 px, comprobar 360 px. Estados vacío, carga, éxito, error y permisos. Reusar patrones actuales y definir tokens de color, tipografía, espaciado, contraste y botones; aplicar Kit Digital USS solo tras confirmar recursos oficiales. Usar datos ficticios y placeholders de fotos/reglamento hasta recibir archivos. Prototipo navegable, no confundir diseño con integración funcional.
