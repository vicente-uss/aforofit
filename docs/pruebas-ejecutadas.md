# Pruebas ejecutadas

Registro de ejecución de las pruebas frente a los criterios de aceptación (FW-IR 9 y FW-IS 6.5: un criterio dice
qué se espera; esta hoja dice qué se ejecutó y qué pasó). Se actualiza en cada ronda de pruebas hasta el
congelamiento del lunes 30 de noviembre.

## Ronda 1 · lunes 23 de noviembre de 2026 (Avance 3)

**Versión probada:** `main` en el commit `00c41f6`, desplegada en https://aforofit.vercel.app.
**Datos:** solo alumnos ficticios. Las pruebas SQL corren dentro de una transacción que se revierte; se comprobó
después que la base quedó igual (capacidad 20, ningún alumno de prueba, aforo en 0).

### Resumen

| Nivel | Herramienta | Casos | Resultado |
|---|---|---:|---|
| Unitarias | Vitest (`npm test`) | 57 | ✅ 57 OK |
| Integración en la base | `supabase/pruebas/registrar_ingreso.sql` | 42 | ✅ 42 OK |
| Sistema con el lector real | Prueba grabada por Pau, medida en [medicion-ca29](medicion-ca29-2026-11-23.md) | 4 lecturas | ✅ 4 OK |
| Revisión de interfaces | [Auditoría de interfaces](auditoria-interfaces-2026-11-23.md) de Benjamín | 4 pantallas | 🟡 CA32 parcial; corregido en el pull request #9 |
| **Total** | | **107** | **106 OK y 1 parcial** |

### Por criterio de aceptación

| CA | Qué se espera | Nivel | Cómo se probó | Resultado | Evidencia |
|---|---|---|---|---|---|
| CA01 | Entrada con alumno habilitado y cupo | Integración y sistema | 2 casos SQL; entrada real con el lector | ✅ | SQL «Entrada normal…»; video de Pau (aforo 0 → 1) |
| CA02 | Credencial no registrada: ofrece vincular | Integración, unitaria y sistema | 2 casos SQL, 1 de Vitest; lectura real de una tarjeta nueva | ✅ | SQL; `mensajes.test.ts`; video de Pau |
| CA03 | Una credencial no se vincula a dos alumnos | Integración y unitaria | 1 caso SQL, 1 de Vitest | ✅ | SQL «Credencial de otro alumno: rechazo» |
| CA04 | Certificado vencido: rechazo | Integración, unitaria y sistema | 1 caso SQL, 1 de Vitest; lectura real con alumno vencido | ✅ | SQL; video de Pau («Certificado no vigente») |
| CA05 | Fuera de horario: rechazo | Integración y unitaria | 5 casos SQL (lunes 21:05 y 07:59, sábado 13:01, domingo, último ingreso a las 21:00) | ✅ | SQL R3 |
| CA06 | Gimnasio lleno: turno en orden | Integración y unitaria | 5 casos SQL con capacidad 2 | ✅ | SQL CA06 y R4 |
| CA07 | La salida llama al turno y este entra | Integración | 5 casos SQL, incluido el cupo reservado | ✅ | SQL CA07 |
| CA08 | Segunda pasada registra la salida | Integración, unitaria y sistema | 4 casos SQL; salida real con el lector | ✅ | SQL; video de Pau (aforo 1 → 0) |
| CA09 | Cierre automático a las 3 horas | Integración | 3 casos SQL | ✅ | SQL CA09 |
| CA10 | `/aforo` se actualiza en 2 s o menos | Sistema | Fotogramas del video: menos de 0,1 s después del kiosco; `/profesor/espera` 1.011 y 454 ms (22 nov) | ✅ | [medicion-ca29](medicion-ca29-2026-11-23.md) |
| CA23 | Cada rol accede solo a lo suyo (RLS) | Integración | 4 casos SQL: el alumno ve solo su visita y no escribe; anon solo lee el aforo | ✅ | SQL RNF y Contrato |
| CA29 | Ingreso en 3 s o menos | Sistema | 4 lecturas reales medidas desde el video | ✅ 1,2 s o menos | [medicion-ca29](medicion-ca29-2026-11-23.md) |
| CA31 | Lector como teclado sin drivers | Sistema | Lector USB con TNE y TUI (20 nov) y prueba del 23 nov; normalización con 14 casos de Vitest | ✅ lector · ⏸ QR pospuesto (CR-01) | [pruebas-tarjetas](pruebas-tarjetas.md); `normalizarUid.test.ts` |
| CA32 | Vista utilizable a 360 px | Revisión | Auditoría de interfaces | 🟡 Parcial; la parte de `/aforo` se corrigió en el pull request #9 | [auditoría](auditoria-interfaces-2026-11-23.md) |
| CA35 | URL pública y video de respaldo | Sistema | URL activa; video de respaldo de 41 s | ✅ | https://aforofit.vercel.app |
| CA36 | Cambios con pull request y SQL en el repositorio | Revisión | Pull requests #7, #8 y #9; SQL `001` a `009` | ✅ | GitHub |
| CA37 | Interfaz en español | Revisión | Recorrido de las 4 pantallas | ✅ | [auditoría](auditoria-interfaces-2026-11-23.md) |
| CA44 | Una visita abierta por alumno | Integración | 1 caso SQL con el índice único | ✅ | SQL R5 |

Los criterios de rutina, préstamos, catálogo, administración y registro corporal (CA11 a CA22, CA24 a CA28, CA30,
CA33, CA34 y CA38 a CA43) se prueban en la ronda 2, según el [CR-01](cr-01-linea-base-entrega-final.md).

### Defectos y hallazgos

| ID | Hallazgo | Encontrado en | Severidad | Decisión | Estado |
|---|---|---|---|---|---|
| D-01 | `/profesor/espera` tardaba en reflejar los turnos | Prueba de punta a punta, 22 nov | Media | Escuchar solo la fila de `aforo` | ✅ Corregido (pull request #7, `d7918be`) |
| D-02 | `/aforo` poco legible en el televisor: cupos sin mostrar, turno y espera pequeños, barra delgada | Auditoría de interfaces, 23 nov | Media | Corregir | ✅ Corregido (pull request #9) |
| D-03 | `/ingreso` no mostraba el aforo en reposo | Auditoría de interfaces, 23 nov | Baja | Corregir | ✅ Corregido (pull request #9) |
| D-04 | Si la ventana del kiosco no está activa, el lector escribe en otra parte | Prueba con el lector, 23 nov | Media | Limitación del lector tipo teclado; aviso visible (F-26) | Abierto |
| D-05 | Al vincular, toda tarjeta queda como `tne` aunque sea una TUI | Prueba con el lector, 23 nov | Baja | Elegir el tipo al vincular (F-27) | Abierto |
| D-06 | Un turno llamado que nadie reclama vence solo cuando se pasa otra tarjeta | Pruebas SQL, 22 nov | Baja | Aceptado para la demo (F-23) | Aceptado |
| D-07 | `vincular_credencial` con un UID de formato inválido se muestra como «Sin conexión» | Revisión de código, 22 nov | Baja | Aceptado: el kiosco siempre envía el UID normalizado | Aceptado |
| D-08 | La documentación mostraba los 2 primeros bytes de UID reales y el kiosco muestra los 2 últimos: juntos podían formar un UID completo | Revisión del video, 23 nov | Media (privacidad) | Enmascarar por completo los UID en la documentación | ✅ Corregido el 23 nov |

**Riesgo residual:** el flujo de ingreso está probado en sus reglas y con el lector real; quedan sin medir CA30 (tres
tipos de equipo) y la repetición de CA29 en la red de la universidad.
