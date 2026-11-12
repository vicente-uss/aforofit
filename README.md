# AforoFit

**Gestión inteligente para el gimnasio de la USS: tu credencial activa tu rutina y el sistema coordina a todos los alumnos.**

Proyecto Integrador · Taller de Ingeniería de Software · Grupo 6 · Universidad San Sebastián, sede Bellavista · 2026

---

## Qué hace

Hoy en el gimnasio de la USS el ingreso se anota con RUT en papel y se traspasa a Excel, las salidas no se
registran y el límite de 20 personas se controla a ojo. AforoFit usa el momento de la entrada para ordenar todo:

1. El alumno pasa su **credencial** por un lector en la entrada: se valida su habilitación y el horario, y queda registrado.
2. Si el gimnasio está lleno, pasa a una **lista de espera** con número de turno.
3. Su **rutina del día** aparece en su celular, con pesos, ajustes de máquina y avisos si alguna está en mantención.
4. Al salir, pasa la credencial otra vez: se libera el cupo y, si usó la rutina, responde **fácil / justo / me costó**.
5. Una pantalla muestra el **aforo en vivo**.
6. Los profesores registran los **préstamos de implementos** para la cancha, con la TNE como garantía.

Es un prototipo académico que funciona con **datos de prueba**.

## Stack

| Parte | Tecnología |
|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind |
| Backend y base de datos | Supabase (PostgreSQL, Auth, Realtime) |
| Despliegue | Vercel |
| Ingreso | Lector NFC USB de 13,56 MHz en modo teclado; QR como respaldo |

## Cómo ejecutarlo

Requisitos: Node.js LTS y Git.

```bash
git clone https://github.com/TU-USUARIO/aforofit.git
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

- [`AGENTS.md`](AGENTS.md): contexto completo: problema, alcance, reglas de negocio, arquitectura, convenciones, calendario y estado actual.
- [`docs/entrevista-encargado-2026-11-12.md`](docs/entrevista-encargado-2026-11-12.md): entrevista con el encargado del gimnasio y decisiones D01–D11.
- **AforoFit — Plan de acción del proyecto**: tareas por ciclo, responsables y puntos de decisión.
- **AforoFit — Kit de arranque**: guías de infraestructura, lector NFC, entrevista y modelo de datos.

## Equipo

| Integrante | Rol |
|---|---|
| Vicente Galleguillos | Jefe de proyecto |
| Benjamín Velásquez | Backend y reglas de negocio |
| Pau Urzúa | Ingreso y hardware |
| Isidora Moscoso | Frontend alumno y encargado |
| Bastián González | Administración y QA |
