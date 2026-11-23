# AforoFit

**Gestión inteligente para el gimnasio de la USS: tu credencial activa tu rutina y el sistema coordina a todos los alumnos.**

Proyecto Integrador · Taller de Ingeniería de Software · Grupo 6 · Universidad San Sebastián, sede Bellavista · 2026

---

## Qué propone

Hoy en el gimnasio de la USS el ingreso se anota con RUT en papel y se traspasa a Excel, las salidas no se
registran y el límite de 20 personas se controla a ojo. AforoFit usa el momento de la entrada para ordenar todo:

1. El alumno pasa su **credencial** por un lector en la entrada: se valida su habilitación y el horario, y queda registrado.
2. Si el gimnasio está lleno, pasa a una **lista de espera** con número de turno.
3. Su **rutina del día** aparece en su celular, con pesos, ajustes de máquina y avisos si alguna está en mantención.
4. Al salir, pasa la credencial otra vez: se libera el cupo y, si usó la rutina, responde **fácil / justo / me costó**.
5. Una pantalla muestra el **aforo en vivo**.
6. Los profesores registran los **préstamos de implementos** para la cancha, con la TNE como garantía.

Es un prototipo académico que funciona con **datos de prueba**.

## Estado al 23 de noviembre (Avance 3)

| Estado | Evidencia |
|---|---|
| En producción en https://aforofit.vercel.app | Login por rol; kiosco `/ingreso` con el lector USB (entrada, salida, rechazo con motivo, lista de espera y vinculación de credenciales); aforo en vivo en `/aforo`; lista de espera del profesor en `/profesor/espera`. Reglas 1 a 6 validadas en la base de datos (`registrar_ingreso`). |
| Pruebas | 52 pruebas de Vitest y 42 pruebas SQL de las reglas, en verde. Lector físico probado con TNE y TUI el 20 de noviembre. |
| Demostrado en Figma Make | Flujos completos de los tres actores, incluidas rutinas y préstamos, con datos de prueba. |
| Pendiente en la app | Respaldo QR, rutina en el celular, feedback y progresión, préstamos de implementos, gestión administrativa y registro corporal. |

## Prototipo navegable

**[Abrir el prototipo en Figma Make](https://www.figma.com/make/onv7W4YD13BPc7HAQ5jjef)**: cubre los 16 casos de uso
con datos de prueba (alumno, profesor encargado, administrador y pantalla de aforo). Antes de mostrarlo, usa
**Restablecer demo** en el login. Es la referencia visual para construir la app real en Next.js.

## Stack

| Parte | Tecnología |
|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind |
| Backend y base de datos | Supabase (PostgreSQL, Auth, Realtime) |
| Despliegue | Vercel |
| Ingreso | Lector USB de 13,56 MHz en modo teclado, probado con TNE y TUI el 20 de noviembre. Ingreso manual como respaldo; QR pendiente. |

## Cómo ejecutarlo

Requisitos: Node.js LTS y Git.

```bash
git clone https://github.com/vicente-uss/aforofit.git
cd aforofit
npm install
```

Crea un archivo `.env.local` en la raíz con las dos claves del proyecto Supabase
(Vicente las comparte por privado; nunca se suben al repositorio):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxx
```

Luego:

```bash
npm run dev
```

Y abre http://localhost:3000.

## Cómo trabajamos

1. Antes de empezar: `git checkout main` y `git pull`.
2. Crea una rama por tarea: `git checkout -b nombre-de-la-tarea`.
3. Programa y prueba con `npm run dev`; antes de subir, `npm run build`.
4. Sube tu rama y abre un pull request. Otro integrante lo revisa en la vista previa de Vercel y lo aprueba.
5. Al fusionar a `main`, Vercel publica solo.
6. Marca tu tarea como hecha en el **Plan de acción**.

Usamos IA para casi todo. Para que cualquier IA tenga el contexto completo, pídele que lea
[`AGENTS.md`](AGENTS.md) antes de empezar (Claude Code lo lee solo a través de [`CLAUDE.md`](CLAUDE.md)).

## Documentación

- [Documento maestro de AforoFit](docs/cierre-avances-1-y-2.md): alcance, reglas, requisitos completos, criterios, diagramas, evidencia, entrevista y pendientes para el Avance 3.
- [Complementos de los avances 1 y 2](docs/complementos-avances-1-y-2.md): objetivos medibles, interesados, enfoque, plan, verificación, plan de calidad, ADR y Playback.
- [CR-01, línea base de la entrega final](docs/cr-01-linea-base-entrega-final.md) (propuesta).
- [Auditoría integral con los frameworks](docs/auditoria-proyecto-frameworks-2026-11-23.md): cronología por hito, brechas y plan de acción.
- [Auditoría de interfaces del 23 de noviembre](docs/auditoria-interfaces-2026-11-23.md): prototipo frente a producción, CA32, CA37 y decisiones.
- [Bases y rúbrica del Proyecto Integrador](docs/bases-proyecto-integrador.md): alcance y criterios por hito.
- Material de apoyo: [Framework de Ingeniería de Requerimientos y Calidad](docs/framework-requerimientos-calidad.md) (procedimiento de trabajo), [Framework de Ingeniería de Software](docs/framework-ingenieria-de-software.md) (procedimiento de trabajo), [Ingeniería de Requerimientos](docs/ingenieria-de-requerimientos.md) (transcripción de las clases) e [Ingeniería de Software](docs/ingenieria-de-software.md).

- [`AGENTS.md`](AGENTS.md): contexto completo: problema, alcance, reglas de negocio, arquitectura, convenciones, calendario y estado actual.
- [`docs/entrevista-encargado-2026-11-12.md`](docs/entrevista-encargado-2026-11-12.md): entrevista con el encargado del gimnasio y decisiones D01–D11.
- [`docs/requisitos-casos-uso-criterios.md`](docs/requisitos-casos-uso-criterios.md): requisitos, casos de uso y criterios de aceptación (CA01–CA22).
- [`docs/pruebas-tarjetas.md`](docs/pruebas-tarjetas.md): prueba de tarjetas y lector elegido.
- [`docs/diagramas.md`](docs/diagramas.md): casos de uso, entidad-relación, secuencia del ingreso y estados (archivos `.drawio` en `docs/diagramas/`).
- [`supabase/sql/`](supabase/sql/): scripts de la base de datos, en orden de ejecución (`001`, `002`…).
- [`docs/revision-prototipo-2026-11-16.md`](docs/revision-prototipo-2026-11-16.md): revisión del prototipo de Figma Make y correcciones aplicadas.
- [Prototipo en Figma Make](https://www.figma.com/make/onv7W4YD13BPc7HAQ5jjef): interfaz navegable de todos los actores.

## Equipo

| Integrante | Rol |
|---|---|
| Vicente Galleguillos | Jefe de proyecto |
| Benjamín Velásquez | Frontend y prototipo |
| Pau Urzúa | Ingreso y hardware |
| Isidora Moscoso | Backend y base de datos |
| Bastián González | Administración y QA |
