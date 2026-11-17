# AforoFit — Prueba de tarjetas y elección del lector

16 de noviembre de 2026 · Grupo 6

Este documento registra qué tarjetas puede leer el sistema y qué lector se usará en la entrada del gimnasio.
Respalda la decisión D17 de [`AGENTS.md`](../AGENTS.md).

## 1. Prueba con NFC Tools

Se leyeron las tarjetas con la app NFC Tools en un celular Android con NFC. Un celular solo lee tarjetas de
13,56 MHz: si la tarjeta responde, es de esa frecuencia.

| Tarjeta | ¿Se lee? | Tipo | UID |
|---|---|---|---|
| TNE 1 | Sí | ISO 14443-3A, NXP MIFARE Classic 4K | `2A:26:**:**` (4 bytes, fijo) |
| TNE 2 | Sí | ISO 14443-3A, NXP MIFARE Classic 4K | `AC:CD:**:**` (4 bytes, fijo) |
| TNE 3 | Sí | ISO 14443-3A, NXP MIFARE Classic 4K | `DC:94:**:**` (4 bytes, fijo) |
| Carnet de identidad | Sí, pero se descarta | ISO 14443-4, MIFARE Plus | Empieza con `08`: UID aleatorio |
| Credencial USS (TUI) | Sí | Por registrar | Por registrar (enmascarado) |

Los UID se muestran enmascarados.

**Conclusiones**
- Las tres TNE son iguales: MIFARE Classic 4K de 13,56 MHz, cada una con un UID fijo y distinto. Sirven como
  credencial y cumplen la regla de credencial única.
- El carnet de identidad no sirve: su UID cambia en cada lectura y se trata de un documento con datos personales
  reales, lo que va contra D11 y RNF07.
- La TUI (credencial USS) también funciona y se acepta. Aun así, **la TNE es la credencial principal** para el
  ingreso y los préstamos (D17), porque todos los alumnos la tienen. El QR queda de respaldo.

## 2. Cotizaciones del lector

| Opción | Lee | Precio | Decisión |
|---|---|---|---|
| [Lector USB 13,56 MHz MF1 S50](https://www.mercadolibre.cl/up/MLCU17718247) | MIFARE 13,56 MHz | $14.990 | **Elegido** |
| [Lector USB 125 kHz EM4100](https://www.mercadolibre.cl/p/MLC27690226) | 125 kHz | $12.490 | Descartado: no lee la TNE |
| [Hikvision DS-K1F100-D8E](https://www.paris.cl/lector-basico-de-control-de-acceso-ds-k1f100-d8e-MK6ICHHCS8.html) | 125 kHz y 13,56 MHz | $54.420 | Descartado: caro y pensado para el software de Hikvision |

También se revisaron lectores duales de pared (Dahua y similares). Se descartaron porque se conectan cableados a
una cerradura y no por USB al computador.

El Avance 2 fue aprobado el 17 de noviembre: el lector se compra para el Avance 3.

## 3. Formato del UID que entrega el lector

El vendedor confirmó lo siguiente:
- Se reconoce como teclado HID, sin drivers, en Windows y Mac.
- Al pasar la tarjeta escribe el código y presiona Enter.
- Entrega el UID como **número decimal calculado con los bytes en orden inverso (LSB)**, no en hexadecimal.

En la base de datos el UID se guarda en hexadecimal, en el mismo orden que muestra NFC Tools. La función
`normalizarUid` hace la conversión (ejemplos con UID ficticios):

| Lo que escribe el lector | UID guardado |
|---|---|
| `0729785092` | `04:A3:7F:2B` |
| `3566231068` | `1C:5E:90:D4` |
| `1063913394` | `B2:07:6A:3F` |

El ingreso manual y el QR usan directamente el formato hexadecimal.

**Al recibir el lector:** abrir el Bloc de notas, pasar una TNE y comparar el número con su UID en NFC Tools, convertido de la misma forma. Si no coincide,
ajustar `normalizarUid` antes de registrar tarjetas.
