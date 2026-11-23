# Auditoría de interfaces: prototipo frente a producción

Fecha: lunes 23 de noviembre de 2026. Responsable: **Benjamín Velásquez** (frontend y prototipo). Compara el prototipo
aprobado en Figma Make con lo desplegado en https://aforofit.vercel.app y verifica los criterios **CA37** (todo en
español) y **CA32** (celular de 360 px), además de la legibilidad de `/aforo` en un televisor. Se hizo con ingreso
manual y UID ficticios.

La sección 6 registra la **decisión del equipo** sobre cada hallazgo. Lo que Benjamín marcó como prioridad «alta» no
siempre se corrige: algunas diferencias son decisiones de diseño (D14) o sirven para medir CA29.

## 1. Resultado de los criterios

| Criterio | Resultado | Hallazgo |
|---|---|---|
| CA37 · Interfaz 100 % en español | **Cumple** | `/ingreso`, `/aforo`, `/profesor/espera` y `/profesor` en español, sin textos residuales en inglés |
| CA32 · Celular de 360 px | **Parcial** | `/profesor` se apila en una columna sin desborde. El indicador «N» de Next.js tapa parte de «Mantención» (solo en desarrollo; no aparece para el usuario final). En `/aforo`, «Nadie en espera» y «Actualizado» quedan muy pequeños |
| Legibilidad de `/aforo` en televisor | **Parcial** | La cifra principal y «Disponible» se leen de lejos. Son pequeños «Nadie en espera» y la barra, no hay cupos libres explícitos y el turno llamado no se destaca |

## 2. `/ingreso` (kiosco)

| Diferencia con el prototipo | Prioridad de Benjamín |
|---|---|
| Sin indicador de aforo en reposo (el prototipo muestra 13/20 y cupos libres) | Alta |
| La tarjeta del último estado solo aparece al leer una credencial | Alta |
| Sin acceso a la lista de espera desde el kiosco | Alta |
| Llamado a la acción sin ícono NFC y sin mencionar la credencial USS (TUI) | Media |
| «Últimas lecturas» muestra milisegundos en vez del nombre o motivo, sin color | Media |
| Ingreso manual reducido a un botón, sin simular entrada o salida por separado | Media |
| QR como texto «próximamente» | Media |
| Encabezado sin sede, reloj ni operador; una sola columna con mucho espacio en blanco | Baja |

## 3. `/aforo` (pantalla pública)

| Diferencia con el prototipo | Prioridad de Benjamín |
|---|---|
| Lista de espera reducida a una línea; sin tarjeta destacada del turno llamado | Alta |
| Cifra con barra delgada en vez de anillo grueso y barra segmentada | Alta |
| Sin desglose de personas adentro, capacidad y **cupos disponibles** | Media |
| Estado «Disponible» sin color semántico ni contenedor | Media |
| Sin reloj ni fecha grandes; solo «Actualizado» en una esquina | Media |
| Sin pie con horarios y último ingreso | Media |
| Fondo negro plano y sede separada del logo | Baja |

## 4. `/profesor/espera` (lista de espera)

| Diferencia con el prototipo | Prioridad de Benjamín |
|---|---|
| Sin botones «Llamar siguiente turno» ni «Registrar ingreso» | Alta |
| Sin tarjeta del turno llamado actualmente | Alta |
| Lista vacía sin estructura de filas (no había nadie en espera durante la revisión) | Alta |
| Una sola tarjeta de aforo, sin «en espera» ni cupos disponibles | Media |
| Sin título de sección ni botón para volver | Media |
| Encabezado sin sede, reloj ni usuario; columna estrecha | Baja |

## 5. `/profesor` (panel)

| Diferencia con el prototipo | Prioridad de Benjamín |
|---|---|
| Menú de tarjetas en vez de panel del día con métricas en vivo | Alta |
| Sin menú lateral persistente | Alta |
| Sin accesos rápidos a pantalla pública o ingreso | Media |
| Operador, barra superior y estilo más simples | Baja |

## 6. Decisión del equipo

| Hallazgo | Decisión | Motivo |
|---|---|---|
| Botones «Llamar siguiente turno» y «Marcar como llamado» | **Se queda así** | D14: el turno se llama solo cuando se libera un cupo y el alumno vuelve a pasar la credencial |
| Milisegundos en «Últimas lecturas» | **Se queda así** | Son la medición de CA29 (tiempo de respuesta) que hace Pau |
| Lista de espera vacía y turno llamado no visible | **Repetir la prueba con turnos** | La revisión se hizo sin nadie esperando; se repite con capacidad 1 (pendiente de Benjamín) |
| `/aforo`: cupos disponibles, turno y «Nadie en espera» más grandes, barra más gruesa y estado con color | **Corregir antes de la entrega final** | Mejora la lectura en el televisor con poco trabajo |
| `/ingreso`: aforo actual visible en reposo | **Corregir antes de la entrega final** | El profesor ve el cupo sin pasar una tarjeta |
| Panel del día con métricas, menú lateral, gráficos y reloj | **Después del Avance 3** | Mejoras grandes, fuera del flujo central |
| Indicador «N» en las capturas | **Recortar o volver a capturar** | Es el indicador de desarrollo de Next.js |

## 7. Evidencia

| Archivo | Qué muestra |
|---|---|
| [`evidencia/auditoria-interfaces/ingreso-entrada.png`](evidencia/auditoria-interfaces/ingreso-entrada.png) | `/ingreso` con entrada aceptada de una alumna ficticia (UID de prueba `04:A3:7F:2B`), aforo 1 / 20 y últimas lecturas |
| [`evidencia/auditoria-interfaces/aforo-en-vivo.png`](evidencia/auditoria-interfaces/aforo-en-vivo.png) | `/aforo` actualizado solo a 1 / 20 tras ese ingreso |
| [`evidencia/auditoria-interfaces/aforo-tv.png`](evidencia/auditoria-interfaces/aforo-tv.png) | `/aforo` a pantalla completa en 0 / 20 (vista de televisor) |
| [`evidencia/auditoria-interfaces/profesor-movil-360.png`](evidencia/auditoria-interfaces/profesor-movil-360.png) | `/profesor` en celular de 360 px (CA32) |

Todas usan datos ficticios. Las capturas tienen el indicador «N» de Next.js en la esquina; para la PPT hay que recortarlo.

## 8. Pendiente

- [ ] Captura de `/profesor/espera` (no venía en el informe)
- [ ] Prueba con turnos (capacidad 1): turno en espera y turno llamado en `/aforo` y `/profesor/espera`
- [ ] Video de 30 segundos: entrada y salida con `/aforo` actualizándose
- [ ] Frase final para la lámina 19. Propuesta: «Se mantuvo la estructura del prototipo (kiosco, pantalla pública y
  lista de espera en tiempo real) y el color inmediato según el resultado; al programar, simplificamos la interfaz
  hacia alto contraste y lectura rápida, y dejamos para después los gráficos y el panel del día del profesor.»
