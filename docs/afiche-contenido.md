# Contenido del afiche · AforoFit

Actualizado: lunes 23 de noviembre de 2026, 22:30. Reemplaza al pendón y al tríptico (aviso del profesor del
19 de noviembre). El **formato** (tamaño, orientación, soporte e impresión) llega por Blackboard. Este
documento deja listo el **contenido** para que Bastián lo diseñe apenas llegue.

**Regla de las bases (sección 7):** el afiche no puede atribuir al prototipo funciones que no estén
implementadas o claramente marcadas como futuras. Antes de imprimir, Bastián revisa la columna **Estado** de
la sección 4 contra la app en producción.

## 1. Formato elegido: afiche "billboard"

Elegimos el formato billboard, de Mike Morrison, en vez del afiche académico tradicional con cajas de texto:

- **Centro:** la idea principal en una frase grande, sobre un fondo sólido, más un QR a la demo.
- **Columna izquierda:** el contexto (problema, objetivo y cómo funciona).
- **Columna derecha:** la evidencia (capturas reales, el lector y los resultados).
- **Franja inferior:** integrantes, tecnologías y lo que viene.

Se lee en tres niveles:
1. A 3 metros se entiende la frase central.
2. A 1 metro, el flujo y las capturas.
3. De cerca, el detalle y el QR.

```
┌──────────────────────────────────────────────────────────────────┐
│  AforoFit · Grupo 6 · Taller de Ingeniería de Software · USS      │
├───────────────┬───────────────────────────────┬──────────────────┤
│ Problema      │                               │ Evidencia        │
│ Objetivo      │   FRASE CENTRAL (grande)      │ captura /ingreso │
│ Cómo funciona │                               │ captura /aforo   │
│ (flujo 1→4)   │   subfrase · QR a la demo     │ foto del lector  │
│               │                               │ resultados       │
├───────────────┴───────────────────────────────┴──────────────────┤
│ Integrantes y roles · Tecnologías · Limitaciones · Próximamente   │
└──────────────────────────────────────────────────────────────────┘
```

Si el formato de Blackboard es vertical, la misma estructura se apila: título, frase central con QR,
contexto, evidencia y franja inferior.

## 2. Reglas de diseño (para que no parezca hecho con IA)

- **Una sola fuente sans-serif**, en dos pesos (regular y negrita). Nada de mezclar con serif cursiva.
- **Un solo color de acento**, el mismo de la PPT del Avance 2. Fondo blanco o muy claro y texto oscuro;
  la frase central puede ir sobre el acento.
- **Grilla de 3 columnas**, márgenes amplios y todo alineado a la grilla. El espacio vacío se deja vacío.
- **Evidencia real:** capturas de la app y foto del lector. Nada de stock, íconos decorativos, fichas de cifras
  todas iguales ni barras de color de adorno.
- **Jerarquía por tamaño:** título, frase central, subtítulos, texto y notas. Unas 300 a 400 palabras en total.
- **Logos:** el logo de la USS va en el encabezado (autorizado, confirmado por el equipo el 23 de noviembre). Nada
  de logos de terceros (Vercel, Supabase, Figma): las tecnologías van como texto.

## 3. Textos

### Encabezado
**AforoFit** · Control de ingreso y aforo para el gimnasio de la USS Bellavista
Grupo 6 · Taller de Ingeniería de Software · 2026 · logo de la Universidad San Sebastián (autorizado)

### Frase central
> **Pasas tu TNE y el gimnasio sabe cuántos hay adentro.**

Subfrase: *La entrada es el único momento en que todos pasan por el mismo lugar. Ahí AforoFit decide.*

QR → https://aforofit.vercel.app/aforo, con la leyenda "Míralo en vivo".

### Problema (columna izquierda)
El ingreso se anota en papel y se pasa a Excel. Nadie registra las salidas, así que no se sabe cuántos siguen
adentro, y el límite de 20 personas se controla a ojo.

### Objetivo
Registrar entradas y salidas con la credencial del alumno, validar su habilitación y el horario, y mostrar el
aforo en vivo, con lista de espera cuando el gimnasio está lleno.

### Cómo funciona (esquema funcional y arquitectura simplificada)
Cinco cajas unidas por flechas, que muestran a la vez el flujo y las piezas del sistema:

1. **TNE o TUI** · lector USB de 13,56 MHz
2. **Kiosco web** · Next.js en Vercel
3. **Supabase valida** · certificado, horario y cupo
4. **Entra**, o recibe un turno si está lleno (caja con el color de acento)
5. **Pantalla /aforo** en vivo · al salir, se repite

### Evidencia (columna derecha)

> **Borrador del 23 de noviembre:** las cifras medidas son 115 de 116 pruebas en OK, 1,2 s o menos para entrar o salir
> (CA29, umbral 3 s) y menos de 0,1 s para que el aforo cambie después del kiosco (CA10). Roles verificados contra
> AGENTS.md (sección 8) y credenciales TNE y TUI contra D17.
- Captura del kiosco `/ingreso` con un mensaje de entrada (datos ficticios).
- Captura de la pantalla pública `/aforo` con el turno llamado.
- Foto del lector USB de 13,56 MHz: funciona como teclado, sin drivers, con TNE y TUI.
- **Resultados** (se completan con la hoja de pruebas):
  - "X de Y pruebas aprobadas";
  - "Ingreso en N segundos" (CA29);
  - "El aforo cambia en menos de 2 segundos" (CA10).

  Solo cifras medidas; si no se midió, no va.

### Franja inferior
- **Integrantes:**
  - Vicente Galleguillos (jefe de proyecto)
  - Benjamín Velásquez (frontend y prototipo)
  - Isidora Moscoso (backend y base de datos)
  - Pau Urzúa (ingreso y hardware)
  - Bastián González (administración y QA)
- **Tecnologías:** Next.js · Supabase (PostgreSQL, Auth y Realtime) · Vercel · lector USB de 13,56 MHz.
- **Metodología:** requisitos levantados en entrevista con el encargado del gimnasio, prototipo validado en
  Figma Make y estimación por puntos de función, LOC y COCOMO.
- **Resultados y conclusión** (exigido por las bases): *«Sin papel: cada entrada y salida queda registrada y el
  aforo se ve en vivo. El flujo central ya funciona con el lector real.»* Si la rutina entra en producción antes
  de imprimir, la conclusión se actualiza.
- **Limitaciones:** prototipo académico con datos ficticios, solo para alumnos y sin conexión a los sistemas
  de la USS. El certificado no se sube: solo se registra su vigencia.
- **Próximamente:** las funciones marcadas así en la sección 4.

## 4. Qué funciones se pueden mencionar

| Función | Cómo aparece en el afiche | Estado al 23 nov (CR-01 aprobado) | Verificar el 26 nov |
|---|---|---|---|
| Ingreso y salida con TNE o TUI | Implementado | En producción | ☐ |
| Validación de certificado, horario y cupo | Implementado | En producción | ☐ |
| Lista de espera con turno | Implementado | En producción | ☐ |
| Aforo en vivo en pantalla pública | Implementado | En producción | ☐ |
| Login por rol (alumno, profesor y admin) | Implementado | En producción | ☐ |
| Catálogo de máquinas e implementos | Implementado solo si hay pantalla | Solo en la base de datos | ☐ |
| Rutina en el celular al pasar la credencial | "Próximamente" si no está | Se construye (línea base, B1 a B3) | ☐ |
| Feedback al salir y progresión de cargas | "Próximamente" si no está | Se construye (línea base, B4) | ☐ |
| Estado de máquinas y aviso de mantención en la rutina | "Próximamente" si no está | Se construye (línea base, B3 y B5) | ☐ |
| Préstamo de implementos con la TNE | "Próximamente" si no está | Opcional (S1, básico); si no, próxima versión | ☐ |
| Registro corporal privado | Solo como "Próximamente" | Próxima versión (CR-01) | — |
| Reparto del orden de ejercicios (experimental) | Solo como "Próximamente" | Prioridad media | — |

Si una función pasa a producción antes de imprimir, se mueve de "Próximamente" a la evidencia.

## 5. Plan hasta el jueves 26 de noviembre

| Fecha | Qué | Quién |
|---|---|---|
| Vie 20 | Contenido listo (este documento) | Vicente |
| Al llegar el formato por Blackboard | Armar la grilla con el tamaño real y ubicar los bloques | Bastián |
| Lun 23 | Insertar las capturas de Benjamín, la foto del lector y los resultados de pruebas | Bastián |
| Mar 24 | Mostrar el borrador en el Avance 3 (lámina 24) y anotar las observaciones del profesor | Bastián |
| Mié 25 | Ajustes y revisión del grupo: textos, cifras y la tabla de la sección 4 | Todos |
| Jue 26 | Enviar al profesor para su aprobación | Bastián y Vicente |
| Vie 27 a lun 30 | Enviar a imprimir apenas se apruebe (lo imprime la universidad) y confirmar fecha de retiro | Bastián |
| 1 a 3 dic | Retirar el afiche impreso e instalarlo en el lugar de la exposición antes de la defensa, según las condiciones de montaje que informe la coordinación | Bastián y Pau |

## 6. Revisión antes de enviarlo

- [ ] La frase central se lee a 3 metros (probar imprimiendo el afiche reducido a una hoja carta).
- [ ] Cada función implementada se puede mostrar en la app; lo demás dice "Próximamente".
- [ ] Las cifras salen de la hoja de pruebas o de la planilla de estimación.
- [ ] Sin datos reales: capturas con alumnos ficticios y UID enmascarados.
- [ ] El QR abre https://aforofit.vercel.app/aforo.
- [ ] Una fuente, un color de acento y todo alineado a la grilla.
- [ ] Solo el logo de la USS (autorizado); ningún logo de terceros.
- [ ] Están los seis bloques de las bases: título, integrantes y logo · problema y objetivo · metodología,
  tecnologías y esquema · funcionalidades y evidencias · resultados, beneficios, limitaciones y conclusión ·
  diseño legible y consistente con el prototipo.
