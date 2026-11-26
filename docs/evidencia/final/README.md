# Banco de evidencia visual de AforoFit

178 originales PNG de 63 escenarios en 17 páginas con interfaz. Las 52 tomas de página completa complementan los encuadres de escritorio y móvil.

[Abrir la hoja de contacto en PDF](hoja-de-contacto.pdf). La estrella identifica las candidatas editoriales.

## Procedencia

Versión capturada de main: `cba147b862f92ecf30cf71c3b3fcaec513fc7b69`. Playwright y Chromium renderizaron la compilación local de Next.js con Inter y las fotografías originales del catálogo. Todas las respuestas de perfiles, autenticación, consultas y operaciones se sirvieron en loopback con datos ficticios. El reloj del navegador representa el 25 de noviembre de 2026 a las 11:30 en Santiago.

Los nombres, las visitas, la vigencia, las colas y los préstamos son escenarios independientes. La producción, sus cuentas y el hardware físico no participaron. Los criterios en el inventario indican la relación funcional y no acreditan permisos, persistencia SQL, latencia, entrega de correos ni lectura física.

## Las diez recomendadas

1. [aforo/turno-llamado-escritorio.png](aforo/turno-llamado-escritorio.png) — Turno 03 llamado al liberarse un cupo; el nombre abreviado se lee a distancia.

2. [aforo/lleno-escritorio.png](aforo/lleno-escritorio.png) — 20 de 20 y cero cupos. Sirve como imagen previa al llamado.

3. [ingreso/entrada-escritorio.png](ingreso/entrada-escritorio.png) — Identificación, bienvenida y aforo en la misma vista.

4. [alumno/rutina-fotos-movil.png](alumno/rutina-fotos-movil.png) — Rutina activada en el celular con fotografía, series, repeticiones y carga.

5. [alumno/mantencion-movil.png](alumno/mantencion-movil.png) — Advertencia junto al ejercicio afectado.

6. [alumno/progresion-movil.png](alumno/progresion-movil.png) — Comparación de las cargas antes y después de responder Fácil.

7. [profesor/devolucion-parcial-escritorio.png](profesor/devolucion-parcial-escritorio.png) — Acuse de devolución y cantidades que quedan por entregar.

8. [profesor/historial-prestamos-escritorio.png](profesor/historial-prestamos-escritorio.png) — Implementos pendientes, TNE pendiente y préstamo cerrado en una consulta.

9. [admin/emision-escritorio.png](admin/emision-escritorio.png) — Fecha de emisión registrada y vigencia actualizada.

10. [admin/configuracion-escritorio.png](admin/configuracion-escritorio.png) — Capacidad, horas de cierre automático y horario semanal.

## Inventario

Escritorio usa 1920 × 1080 CSS a escala 2. Móvil usa 390 × 844 CSS a escala 3. Cada enlace indica la resolución efectiva en píxeles. En páginas largas el encuadre puede estar desplazado hasta el control o el mensaje correspondiente. Las tomas con «completa» abarcan toda la página.

### Autenticacion · 12 PNG

| Ruta | Estado | Criterio o referencia | Originales |
|---|---|---|---|
| `/auth/login` | Inicio | CA23 | [Escritorio 3840×2160](autenticacion/inicio-escritorio.png) · [Móvil 1170×2532](autenticacion/inicio-movil.png) |
| `/auth/login` | Validacion | CA23 | [Escritorio 3840×2160](autenticacion/validacion-escritorio.png) · [Móvil 1170×2532](autenticacion/validacion-movil.png) |
| `/auth/forgot-password` | Recuperacion | CA23 | [Escritorio 3840×2160](autenticacion/recuperacion-escritorio.png) · [Móvil 1170×2532](autenticacion/recuperacion-movil.png) |
| `/auth/forgot-password` | Enlace solicitado | CA23 | [Escritorio 3840×2160](autenticacion/enlace-solicitado-escritorio.png) · [Móvil 1170×2532](autenticacion/enlace-solicitado-movil.png) |
| `/auth/update-password` | Actualizar clave | CA23 | [Escritorio 3840×2160](autenticacion/actualizar-clave-escritorio.png) · [Móvil 1170×2532](autenticacion/actualizar-clave-movil.png) |
| `/auth/error` | Error acceso | CA23 | [Escritorio 3840×2160](autenticacion/error-acceso-escritorio.png) · [Móvil 1170×2532](autenticacion/error-acceso-movil.png) |

### Aforo · 21 PNG

| Ruta | Estado | Criterio o referencia | Originales |
|---|---|---|---|
| `/aforo` | Vacio | CA10 | [Escritorio 3840×2160](aforo/vacio-escritorio.png) · [Móvil 1170×2532](aforo/vacio-movil.png) · [Móvil completa 1170×3003](aforo/vacio-movil-completa.png) |
| `/aforo` | Intermedio | CA10 | [Escritorio 3840×2160](aforo/intermedio-escritorio.png) · [Móvil 1170×2532](aforo/intermedio-movil.png) · [Móvil completa 1170×3003](aforo/intermedio-movil-completa.png) |
| `/aforo` | Casi lleno | CA10 | [Escritorio 3840×2160](aforo/casi-lleno-escritorio.png) · [Móvil 1170×2532](aforo/casi-lleno-movil.png) · [Móvil completa 1170×3003](aforo/casi-lleno-movil-completa.png) |
| `/aforo` | Lleno | CA10 | [Escritorio 3840×2160](aforo/lleno-escritorio.png) · [Móvil 1170×2532](aforo/lleno-movil.png) · [Móvil completa 1170×3102](aforo/lleno-movil-completa.png) |
| `/aforo` | Espera | CA06 | [Escritorio 3840×2160](aforo/espera-escritorio.png) · [Móvil 1170×2532](aforo/espera-movil.png) · [Móvil completa 1170×3102](aforo/espera-movil-completa.png) |
| `/aforo` | Turno llamado | CA07 | [Escritorio 3840×2160](aforo/turno-llamado-escritorio.png) · [Móvil 1170×2532](aforo/turno-llamado-movil.png) · [Móvil completa 1170×3003](aforo/turno-llamado-movil-completa.png) |
| `/aforo` | Pantalla completa | CA10 | [Escritorio 3840×2160](aforo/pantalla-completa-escritorio.png) · [Móvil 1170×2532](aforo/pantalla-completa-movil.png) · [Móvil completa 1170×3003](aforo/pantalla-completa-movil-completa.png) |

### Ingreso · 40 PNG

| Ruta | Estado | Criterio o referencia | Originales |
|---|---|---|---|
| `/ingreso` | Reposo | CA01, CA31 | [Escritorio 3840×2160](ingreso/reposo-escritorio.png) · [Móvil 1170×2532](ingreso/reposo-movil.png) · [Móvil completa 1170×3279](ingreso/reposo-movil-completa.png) |
| `/ingreso` | Entrada | CA01, CA31 | [Escritorio 3840×2160](ingreso/entrada-escritorio.png) · [Móvil 1170×2532](ingreso/entrada-movil.png) |
| `/ingreso` | Salida | CA08 | [Escritorio 3840×2160](ingreso/salida-escritorio.png) · [Móvil 1170×2532](ingreso/salida-movil.png) |
| `/ingreso` | Certificado vencido | CA04 | [Escritorio 3840×2160](ingreso/certificado-vencido-escritorio.png) · [Móvil 1170×2532](ingreso/certificado-vencido-movil.png) · [Móvil completa 1170×3348](ingreso/certificado-vencido-movil-completa.png) |
| `/ingreso` | Credencial desconocida | CA02 | [Escritorio 3840×2160](ingreso/credencial-desconocida-escritorio.png) · [Móvil 1170×2532](ingreso/credencial-desconocida-movil.png) · [Móvil completa 1170×3666](ingreso/credencial-desconocida-movil-completa.png) |
| `/ingreso` | Vincular TNE | CA02, CA03, CA31 | [Escritorio 3840×2160](ingreso/vincular-tne-escritorio.png) · [Escritorio completa 3840×2258](ingreso/vincular-tne-escritorio-completa.png) · [Móvil 1170×2532](ingreso/vincular-tne-movil.png) · [Móvil completa 1170×4794](ingreso/vincular-tne-movil-completa.png) |
| `/ingreso` | Vincular TUI | CA02, CA03, CA31 | [Escritorio 3840×2160](ingreso/vincular-tui-escritorio.png) · [Escritorio completa 3840×2258](ingreso/vincular-tui-escritorio-completa.png) · [Móvil 1170×2532](ingreso/vincular-tui-movil.png) · [Móvil completa 1170×4794](ingreso/vincular-tui-movil-completa.png) |
| `/ingreso` | Vincular confirmada TNE | CA02, CA31 | [Escritorio 3840×2160](ingreso/vincular-confirmada-tne-escritorio.png) · [Móvil 1170×2532](ingreso/vincular-confirmada-tne-movil.png) · [Móvil completa 1170×3348](ingreso/vincular-confirmada-tne-movil-completa.png) |
| `/ingreso` | Vincular confirmada TUI | CA02, CA31 | [Escritorio 3840×2160](ingreso/vincular-confirmada-tui-escritorio.png) · [Móvil 1170×2532](ingreso/vincular-confirmada-tui-movil.png) · [Móvil completa 1170×3348](ingreso/vincular-confirmada-tui-movil-completa.png) |
| `/ingreso` | Turno | CA06 | [Escritorio 3840×2160](ingreso/turno-escritorio.png) · [Móvil 1170×2532](ingreso/turno-movil.png) |
| `/ingreso` | Manual | CA01, CA31 | [Escritorio 3840×2160](ingreso/manual-escritorio.png) · [Móvil 1170×2532](ingreso/manual-movil.png) · [Móvil completa 1170×3447](ingreso/manual-movil-completa.png) |
| `/ingreso` | Qr canje | CA01, CA31 | [Escritorio 3840×2160](ingreso/qr-canje-escritorio.png) · [Móvil 1170×2532](ingreso/qr-canje-movil.png) |
| `/ingreso` | Qr manual | CA01, CA31 | [Escritorio 3840×2160](ingreso/qr-manual-escritorio.png) · [Móvil 1170×2532](ingreso/qr-manual-movil.png) · [Móvil completa 1170×3447](ingreso/qr-manual-movil-completa.png) |
| `/ingreso` | Pausa | CA01, CA31 | [Escritorio 3840×2160](ingreso/pausa-escritorio.png) · [Móvil 1170×2532](ingreso/pausa-movil.png) · [Móvil completa 1170×3699](ingreso/pausa-movil-completa.png) |

### Alumno · 31 PNG

| Ruta | Estado | Criterio o referencia | Originales |
|---|---|---|---|
| `/alumno` | Panel | CA11, CA12 | [Escritorio 3840×2160](alumno/panel-escritorio.png) · [Escritorio completa 3840×2664](alumno/panel-escritorio-completa.png) · [Móvil 1170×2532](alumno/panel-movil.png) · [Móvil completa 1170×4128](alumno/panel-movil-completa.png) |
| `/alumno` | Objetivo nivel | CA24 | [Escritorio 3840×2160](alumno/objetivo-nivel-escritorio.png) · [Escritorio completa 3840×2246](alumno/objetivo-nivel-escritorio-completa.png) · [Móvil 1170×2532](alumno/objetivo-nivel-movil.png) · [Móvil completa 1170×3477](alumno/objetivo-nivel-movil-completa.png) |
| `/alumno` | Rutina fotos | CA11, CA12 | [Escritorio 3840×2160](alumno/rutina-fotos-escritorio.png) · [Escritorio completa 3840×2696](alumno/rutina-fotos-escritorio-completa.png) · [Móvil 1170×2532](alumno/rutina-fotos-movil.png) · [Móvil completa 1170×4176](alumno/rutina-fotos-movil-completa.png) |
| `/alumno` | Mantencion | CA13 | [Escritorio 3840×2160](alumno/mantencion-escritorio.png) · [Escritorio completa 3840×2696](alumno/mantencion-escritorio-completa.png) · [Móvil 1170×2532](alumno/mantencion-movil.png) · [Móvil completa 1170×4176](alumno/mantencion-movil-completa.png) |
| `/alumno` | Feedback | CA14 | [Escritorio 3840×2160](alumno/feedback-escritorio.png) · [Escritorio completa 3840×3404](alumno/feedback-escritorio-completa.png) · [Móvil 1170×2532](alumno/feedback-movil.png) · [Móvil completa 1170×5238](alumno/feedback-movil-completa.png) |
| `/alumno` | Progresion | CA14 | [Escritorio 3840×2160](alumno/progresion-escritorio.png) · [Móvil 1170×2532](alumno/progresion-movil.png) · [Móvil completa 1170×2637](alumno/progresion-movil-completa.png) |
| `/alumno` | Qr | CA31 | [Escritorio 3840×2160](alumno/qr-escritorio.png) · [Escritorio completa 3840×3328](alumno/qr-escritorio-completa.png) · [Móvil 1170×2532](alumno/qr-movil.png) · [Móvil completa 1170×5124](alumno/qr-movil-completa.png) |
| `/alumno/historial` | Historial | F-33 | [Escritorio 3840×2160](alumno/historial-escritorio.png) · [Móvil 1170×2532](alumno/historial-movil.png) |
| `/alumno/historial` | Historial vacio | F-33 | [Escritorio 3840×2160](alumno/historial-vacio-escritorio.png) · [Móvil 1170×2532](alumno/historial-vacio-movil.png) |

### Profesor · 48 PNG

| Ruta | Estado | Criterio o referencia | Originales |
|---|---|---|---|
| `/profesor` | Panel | CA23 | [Escritorio 3840×2160](profesor/panel-escritorio.png) · [Móvil 1170×2532](profesor/panel-movil.png) · [Móvil completa 1170×3441](profesor/panel-movil-completa.png) |
| `/profesor/espera` | Lista espera | CA06, CA07 | [Escritorio 3840×2160](profesor/lista-espera-escritorio.png) · [Móvil 1170×2532](profesor/lista-espera-movil.png) |
| `/profesor/espera` | Espera vacio | CA23 | [Escritorio 3840×2160](profesor/espera-vacio-escritorio.png) · [Móvil 1170×2532](profesor/espera-vacio-movil.png) |
| `/profesor/adentro` | Adentro | CA23 | [Escritorio 3840×2160](profesor/adentro-escritorio.png) · [Móvil 1170×2532](profesor/adentro-movil.png) |
| `/profesor/adentro` | Cierre manual | F-28, D21 | [Escritorio 3840×2160](profesor/cierre-manual-escritorio.png) · [Móvil 1170×2532](profesor/cierre-manual-movil.png) · [Móvil completa 1170×2592](profesor/cierre-manual-movil-completa.png) |
| `/profesor/adentro` | Salida confirmada | F-28, D21 | [Escritorio 3840×2160](profesor/salida-confirmada-escritorio.png) · [Móvil 1170×2532](profesor/salida-confirmada-movil.png) |
| `/profesor/adentro` | Adentro vacio | CA23 | [Escritorio 3840×2160](profesor/adentro-vacio-escritorio.png) · [Móvil 1170×2532](profesor/adentro-vacio-movil.png) |
| `/profesor/maquinas` | Maquinas | CA26 | [Escritorio 3840×2160](profesor/maquinas-escritorio.png) · [Móvil 1170×2532](profesor/maquinas-movil.png) |
| `/profesor/prestamos` | Prestamo multiple | CA19 | [Escritorio 3840×2160](profesor/prestamo-multiple-escritorio.png) · [Móvil 1170×2532](profesor/prestamo-multiple-movil.png) · [Móvil completa 1170×3330](profesor/prestamo-multiple-movil-completa.png) |
| `/profesor/prestamos` | Prestamo registrado | CA19 | [Escritorio 3840×2160](profesor/prestamo-registrado-escritorio.png) · [Móvil 1170×2532](profesor/prestamo-registrado-movil.png) · [Móvil completa 1170×4323](profesor/prestamo-registrado-movil-completa.png) |
| `/profesor/prestamos` | Devolucion parcial | CA20 | [Escritorio 3840×2160](profesor/devolucion-parcial-escritorio.png) · [Móvil 1170×2532](profesor/devolucion-parcial-movil.png) · [Móvil completa 1170×4464](profesor/devolucion-parcial-movil-completa.png) |
| `/profesor/prestamos` | Implementos pendientes | CA20 | [Escritorio 3840×2160](profesor/implementos-pendientes-escritorio.png) · [Móvil 1170×2532](profesor/implementos-pendientes-movil.png) · [Móvil completa 1170×4194](profesor/implementos-pendientes-movil-completa.png) |
| `/profesor/prestamos` | Tne pendiente | CA21 | [Escritorio 3840×2160](profesor/tne-pendiente-escritorio.png) · [Móvil 1170×2532](profesor/tne-pendiente-movil.png) · [Móvil completa 1170×3678](profesor/tne-pendiente-movil-completa.png) |
| `/profesor/prestamos` | Prestamo cerrado | CA21 | [Escritorio 3840×2160](profesor/prestamo-cerrado-escritorio.png) · [Móvil 1170×2532](profesor/prestamo-cerrado-movil.png) · [Móvil completa 1170×3864](profesor/prestamo-cerrado-movil-completa.png) |
| `/profesor/historial` | Historial | F-33 | [Escritorio 3840×2160](profesor/historial-escritorio.png) · [Móvil 1170×2532](profesor/historial-movil.png) · [Móvil completa 1170×4524](profesor/historial-movil-completa.png) |
| `/profesor/historial` | Historial prestamos | F-33 | [Escritorio 3840×2160](profesor/historial-prestamos-escritorio.png) · [Móvil 1170×2532](profesor/historial-prestamos-movil.png) · [Móvil completa 1170×4524](profesor/historial-prestamos-movil-completa.png) |
| `/profesor/historial` | Fecha | F-33 | [Escritorio 3840×2160](profesor/fecha-escritorio.png) · [Móvil 1170×2532](profesor/fecha-movil.png) · [Móvil completa 1170×4524](profesor/fecha-movil-completa.png) |
| `/profesor/historial` | Historial vacio | F-33 | [Escritorio 3840×2160](profesor/historial-vacio-escritorio.png) · [Móvil 1170×2532](profesor/historial-vacio-movil.png) · [Móvil completa 1170×3612](profesor/historial-vacio-movil-completa.png) |

### Admin · 26 PNG

| Ruta | Estado | Criterio o referencia | Originales |
|---|---|---|---|
| `/admin` | Panel | CA23 | [Escritorio 3840×2160](admin/panel-escritorio.png) · [Móvil 1170×2532](admin/panel-movil.png) |
| `/admin/configuracion` | Configuracion | CA18, CA34 | [Escritorio 3840×2160](admin/configuracion-escritorio.png) · [Escritorio completa 3840×2932](admin/configuracion-escritorio-completa.png) · [Móvil 1170×2532](admin/configuracion-movil.png) · [Móvil completa 1170×4938](admin/configuracion-movil-completa.png) |
| `/admin/configuracion` | Horarios | CA34 | [Escritorio 3840×2160](admin/horarios-escritorio.png) · [Escritorio completa 3840×2932](admin/horarios-escritorio-completa.png) · [Móvil 1170×2532](admin/horarios-movil.png) · [Móvil completa 1170×4938](admin/horarios-movil-completa.png) |
| `/admin/configuracion` | Cierre automatico | CA09, CA34 | [Escritorio 3840×2160](admin/cierre-automatico-escritorio.png) · [Escritorio completa 3840×2932](admin/cierre-automatico-escritorio-completa.png) · [Móvil 1170×2532](admin/cierre-automatico-movil.png) · [Móvil completa 1170×4938](admin/cierre-automatico-movil-completa.png) |
| `/admin/configuracion` | Validacion | CA34 | [Escritorio 3840×2160](admin/validacion-escritorio.png) · [Escritorio completa 3840×3108](admin/validacion-escritorio-completa.png) · [Móvil 1170×2532](admin/validacion-movil.png) · [Móvil completa 1170×5202](admin/validacion-movil-completa.png) |
| `/admin/habilitacion` | Habilitacion | CA28 | [Escritorio 3840×2160](admin/habilitacion-escritorio.png) · [Móvil 1170×2532](admin/habilitacion-movil.png) |
| `/admin/habilitacion` | Vigente | CA28 | [Escritorio 3840×2160](admin/vigente-escritorio.png) · [Móvil 1170×2532](admin/vigente-movil.png) |
| `/admin/habilitacion` | Vencido | CA04, CA28 | [Escritorio 3840×2160](admin/vencido-escritorio.png) · [Móvil 1170×2532](admin/vencido-movil.png) |
| `/admin/habilitacion` | Emision | CA28 | [Escritorio 3840×2160](admin/emision-escritorio.png) · [Móvil 1170×2532](admin/emision-movil.png) |

## Lectura de los estados

La rutina con fotos incluye la vista del día. El aviso de mantención usa el mismo componente, desplazado hasta el ejercicio afectado. La próxima sesión y la progresión se ven juntas tras responder «Fácil». Capacidad, horarios y cierre automático comparten un formulario. Visitas y préstamos comparten el historial del profesor. La fecha se selecciona con el control nativo del navegador.

La vinculación TNE y TUI muestra la selección y la respuesta de confirmación. El préstamo múltiple muestra primero las cantidades elegidas y luego el registro con stock actualizado. El cierre manual incluye la solicitud de confirmación y la respuesta posterior. La devolución parcial muestra la respuesta y las unidades restantes. El QR es de muestra y carece de validez fuera del escenario local.

## Cobertura y límites

Se revisaron las 18 entradas page.tsx de app/. Diecisiete renderizan interfaces. La raíz redirige al login o panel y /auth/confirm es un manejador de enlaces que también redirige. Por eso carecen de una lámina independiente. La aplicación presenta registro corporal y rutinas propias como funciones de una próxima versión.

La cámara QR queda pendiente: Chromium no expuso BarcodeDetector ni una entrada de video. El canje manual usa la función de ingreso por código con respuesta controlada. La pausa del lector se activó con el evento de pérdida de foco. La pantalla completa usa el botón del producto y se verificó document.fullscreenElement, dentro del navegador automatizado.

Se esperó a las fuentes, decodificación de las imágenes y resolución de las consultas. Se verificaron las dimensiones PNG y que el ancho del documento no excediera el viewport. Móvil corresponde a emulación Chromium. A 390 px, la pantalla pública coloca el llamado hacia el final y puede abreviar visualmente el nombre con puntos suspensivos. Para el afiche se recomienda el llamado en escritorio. Las fotografías del catálogo conservan su resolución original dentro de las capturas.
