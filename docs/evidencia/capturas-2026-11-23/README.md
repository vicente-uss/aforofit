# Capturas del flujo de ingreso · 23 de noviembre de 2026

Producción (https://aforofit.vercel.app), commit `00c41f6`, 21:05 a 21:08. Capacidad bajada a 1 y último ingreso del
lunes extendido para la prueba; después se restauró (capacidad 20, último ingreso 21:00, sin visitas ni turnos
abiertos). Alumnos ficticios ingresados con el ingreso manual del kiosco.

| Archivo | Qué muestra | Criterio |
|---|---|---|
| `01-ingreso-reposo.png` | Kiosco en reposo con la línea de aforo (pull request #9) | D-03 |
| `02-ingreso-entrada.png` | Entrada de Antonia Fictia Rivas: 1 / 1, 218 ms | CA01, CA29 |
| `03-aforo-lleno.png` | `/aforo` lleno: «Sin cupos», barra roja, insignia «Lleno» | CA06, CA10 |
| `04-ingreso-turno.png` | Gimnasio lleno: Benjamín Prueba Soto recibe el turno 2, 269 ms | CA06 |
| `05-aforo-lleno-en-espera.png` | `/aforo` con «1 en espera» | CA06, CA10 |
| `06-profesor-espera-turno.png` | `/profesor/espera` con el turno 2 esperando | CU02 |
| `07-ingreso-salida.png` | Salida de Antonia: 0 / 1, 255 ms | CA08 |
| `08-aforo-turno-llamado.png` | `/aforo` llama el turno 2 («pasa tu credencial») | CA07, D14 |
| `09-ingreso-entrada-con-turno.png` | Benjamín entra con su turno: 1 / 1, 233 ms | CA07 |
| `10-aforo-0-de-20.png` | `/aforo` restaurado en 0 / 20 | — |

El turno es el 2 porque la numeración es del día y el turno 1 se usó en una prueba anterior. Sin datos reales ni UID.
