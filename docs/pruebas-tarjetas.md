# AforoFit — Prueba de tarjetas y elección del lector

El documento maestro incorpora esta sección en el [anexo de pruebas de credenciales](cierre-avances-1-y-2.md#anexo-b-pruebas-de-credenciales).

16 de noviembre de 2026 · Grupo 6

Este documento registra las lecturas realizadas con NFC Tools en un celular y el lector USB elegido para la entrada del gimnasio.
Respalda la decisión D17 de [`AGENTS.md`](../AGENTS.md).

## 1. Prueba con NFC Tools

Se leyeron las tarjetas con la app NFC Tools en un celular Android con NFC. Un celular solo lee tarjetas de
13,56 MHz: si la tarjeta responde, es de esa frecuencia.

| Tarjeta | ¿Se lee? | Tipo | UID |
|---|---|---|---|
| TNE 1 | Sí | ISO 14443-3A, NXP MIFARE Classic 4K | `••:••:••:••` (4 bytes, fijo) |
| TNE 2 | Sí | ISO 14443-3A, NXP MIFARE Classic 4K | `AC:CD:**:**` (4 bytes, fijo) |
| TNE 3 | Sí | ISO 14443-3A, NXP MIFARE Classic 4K | `DC:94:**:**` (4 bytes, fijo) |
| Carnet de identidad | Sí, pero se descarta | ISO 14443-4, MIFARE Plus | Empieza con `08`: UID aleatorio |
| Credencial USS (TUI) | Sí | ISO 14443-4 sobre NfcA, SAK `0x38` | `••:••:••:••` (4 bytes) |

Los UID se muestran enmascarados.

**Conclusiones**
- Las tres TNE son iguales: MIFARE Classic 4K de 13,56 MHz, cada una con un UID fijo y distinto. Sirven como
  credencial y cumplen la regla de credencial única.
- El carnet de identidad no sirve: su UID cambia en cada lectura y se trata de un documento con datos personales
  reales, lo que va contra D11 y RNF07.
- Se leyó una TUI (credencial USS) con NFC Tools. Su compatibilidad con el lector USB sigue pendiente.
  **La TNE es la credencial principal** para el ingreso y los préstamos (D17), porque todos los alumnos la tienen. El QR queda de respaldo.

## 2. Cotizaciones del lector

| Opción | Lee | Precio | Decisión |
|---|---|---|---|
| [Lector USB 13,56 MHz MF1 S50](https://www.mercadolibre.cl/up/MLCU17718247) | MIFARE 13,56 MHz | $14.990 | **Elegido** |
| [Lector USB 125 kHz EM4100](https://www.mercadolibre.cl/p/MLC27690226) | 125 kHz | $12.490 | Descartado: no lee la TNE |
| [Hikvision DS-K1F100-D8E](https://www.paris.cl/lector-basico-de-control-de-acceso-ds-k1f100-d8e-MK6ICHHCS8.html) | 125 kHz y 13,56 MHz | $54.420 | Descartado: caro y pensado para el software de Hikvision |

También se revisaron lectores duales de pared (Dahua y similares). Se descartaron porque se conectan cableados a
una cerradura y no por USB al computador.

El Avance 2 fue aprobado el 17 de noviembre. Pau compró el lector ($14.990 + $3.990 de envío) y lo probó el 20 de noviembre (sección 4).

## 3. Formato esperado del UID del lector USB

El vendedor confirmó lo siguiente:
- Se reconoce como teclado HID, sin drivers, en Windows y Mac.
- Al pasar la tarjeta escribe el código y presiona Enter.
- Entrega el UID como **número decimal calculado con los bytes en orden inverso (LSB)**, no en hexadecimal.

El modelo prevé guardar el UID en hexadecimal, en el mismo orden que muestra NFC Tools. La función
`normalizarUid` hace la conversión (ejemplos con UID ficticios):

| Lo que escribe el lector | UID guardado |
|---|---|
| `0729785092` | `04:A3:7F:2B` |
| `3566231068` | `1C:5E:90:D4` |
| `1063913394` | `B2:07:6A:3F` |

El formulario manual solicita el UID en hexadecimal. El QR sigue pendiente.

## 4. Prueba física del lector USB (20 de noviembre de 2026)

Realizada por Pau con el lector recibido. Resultado: **funciona tal como indicó el vendedor**.

| Tarjeta | Resultado |
|---|---|
| TNE | Se lee: escribe el UID en decimal (orden inverso) y presiona Enter |
| TUI (credencial USS) | Se lee igual que la TNE |
| Tarjetas bancarias sin contacto | También responden, porque usan la misma tecnología de 13,56 MHz |

Implicancias:
- Se confirma D17: la TNE sigue como credencial principal y la **TUI también sirve** con el lector USB.
- Una tarjeta bancaria entrega un UID, pero no se vincula a ningún alumno: en `/ingreso` aparece como
  "Credencial no registrada". El profesor no debe vincular tarjetas bancarias. Además, muchas generan un UID
  aleatorio en cada lectura, así que no sirven como credencial.
- Falta registrar la comparación lectura normalizada vs. NFC Tools por tarjeta, con los UID enmascarados
  (ej. `••:••:••:••`), y medir el tiempo de ingreso (CA29) cuando `/ingreso` esté conectado.
