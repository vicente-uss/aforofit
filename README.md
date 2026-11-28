# AforoFit

AforoFit registra con la credencial las entradas y salidas de los alumnos del gimnasio USS Bellavista.\
Cuando se llena el gimnasio, asigna turnos y muestra el aforo en vivo.\
El alumno recibe su rutina en el celular y el profesor gestiona los préstamos de implementos.

Proyecto Integrador del Grupo 6 · Taller de Ingeniería de Software · [Abrir AforoFit en producción](https://aforofit.vercel.app)

## Estado al 27 de noviembre de 2026

Al cierre del 27 de noviembre, los PR #22–#28 están fusionados en main (base de referencia `0e730a22aa7d401787c7b10a3834444a8bb480a8`). Las migraciones 018–024 cubren seguridad, estabilidad autónoma, aviso TNE, administración de catálogo, registro corporal privado, rutinas personalizadas y configuración completa. **27/27 RF de prioridad alta implementados**; RF28–RF31 siguen pendientes de decisión. La certificación del PR #28 (commit `5ac9df4af1bc4735337f623f89452e73413f6bc1`) registra **793 comprobaciones únicas (278 Vitest + 515 SQL)** en entorno desechable, lint/build correctos y cero vulnerabilidades reportadas por ambas auditorías npm; [GitHub Actions 46075145155](https://github.com/vicente-uss/aforofit/actions/runs/46075145155). La certificación posterior a la fusión y la comprobación de producción quedan pendientes. Security Advisor: 24 advertencias y 1 sugerencia, consideradas auditadas por el coordinador; no se adjuntó un desglose independiente. CA31 físico (lector TNE/TUI y cámara QR en el gimnasio) sigue pendiente de evidencia.

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
| Ingreso | Lector USB de 13,56 MHz en modo teclado, probado con TNE y TUI el 20 de noviembre. Ingreso manual y QR de respaldo; la cámara depende de compatibilidad del navegador. |

## Instalación local

Necesitas Git, Node.js con npm (versión probada de Node: **24.22.3**), Chrome y una cuenta de Supabase con un proyecto propio de prueba. Para probar sin lector USB, usa **Ingreso manual**.

```bash
git clone https://github.com/vicente-uss/aforofit.git
cd aforofit
npm install
```

Crea `.env.local` en la raíz, junto a `package.json`. Copia la URL del proyecto y su clave **publishable** desde el panel de conexión de tu proyecto Supabase. Usa solo estos nombres y completa los valores en tu computador:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Nunca uses la clave `service_role` en la app ni subas `.env.local` al repositorio. Prepara la base siguiendo los pasos de abajo. Después, ejecuta `npm run dev` desde la raíz y abre [localhost:3000](http://localhost:3000). Si cambias las variables, reinicia el servidor.

## Preparar Supabase desde cero

1. En **Authentication → Users → Add user**, crea las tres cuentas de la tabla «Usuarios de prueba» con sus correos completos. Define contraseñas privadas y activa **Auto Confirm User**. Hazlo antes de 001 para que se creen los tres perfiles y antes de 008 para que Antonia quede vinculada a su cuenta.
2. En **SQL Editor**, ejecuta cada archivo completo, uno por uno, en el orden de la tabla. **Al terminar 001**, ejecuta por separado los dos `UPDATE` comentados al final de ese archivo, quitando el prefijo `--`. Asignan los roles de profesor y administrador. Comprueba con `select nombre, rol from public.perfiles order by nombre;` que cada cuenta tiene el rol indicado.
3. Después de 003, entra a **Storage → maquinas** y sube los 11 JPG de [supabase/storage/maquinas](supabase/storage/maquinas/) directamente a la raíz del bucket, conservando sus nombres. El SQL crea el bucket público y sus políticas. El 004 guarda las rutas de las fotos.
4. Al terminar 011, comprueba que la publicación **supabase_realtime** incluye `public.aforo` y `public.visitas`. Los SQL 007 y 011 las incorporan. Puedes verificarlo en SQL Editor con `select tablename from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public';`.

| Archivo en orden de ejecución | Qué instala o modifica | Datos que carga |
|---|---|---|
| [001_perfiles_roles.sql](supabase/sql/001_perfiles_roles.sql) | Crea perfiles con RLS, el trigger de Auth y los perfiles de usuarios existentes. | Perfiles de las cuentas de prueba. |
| [002_maquinas.sql](supabase/sql/002_maquinas.sql) | Crea el catálogo de máquinas y sus permisos por rol. | Solo estructura. |
| [003_implementos_y_fotos.sql](supabase/sql/003_implementos_y_fotos.sql) | Crea implementos, el bucket público de fotos y sus políticas de acceso. | Bucket sin fotos. |
| [004_datos_catalogo.sql](supabase/sql/004_datos_catalogo.sql) | Carga 11 tipos de máquinas (12 equipos), rutas de fotos e implementos iniciales. | Inventario real del gimnasio y cantidades provisorias de implementos. |
| [005_tablas_flujo_ingreso.sql](supabase/sql/005_tablas_flujo_ingreso.sql) | Crea alumnos, tarjetas, visitas, turnos, configuración y la fila pública de aforo. | Parámetros iniciales y ocupación cero. |
| [006_funciones_flujo_ingreso.sql](supabase/sql/006_funciones_flujo_ingreso.sql) | Implementa registro de ingreso y salida, turnos, sincronización del aforo y vinculación de credenciales. | Sin datos de alumnos. |
| [007_permisos_flujo_ingreso.sql](supabase/sql/007_permisos_flujo_ingreso.sql) | Aplica permisos y RLS del flujo y publica aforo en Realtime. | Sin datos. |
| [008_datos_prueba_flujo_ingreso.sql](supabase/sql/008_datos_prueba_flujo_ingreso.sql) | Carga 25 alumnos y 24 tarjetas y vincula alumno.demo con Antonia. | **Ficticios**: nombres, RUT, UID y vigencias. |
| [009_corregir_rol_admin_demo.sql](supabase/sql/009_corregir_rol_admin_demo.sql) | Corrige el rol de admin.demo si ya existía con otro rol. | Ajuste de cuenta ficticia. |
| [010_implementos_reales.sql](supabase/sql/010_implementos_reales.sql) | Actualiza los implementos y retira la colchoneta del préstamo. | Inventario confirmado: 5 tipos y 9 unidades. |
| [011_rutinas.sql](supabase/sql/011_rutinas.sql) | Crea plantillas, rutinas, ejercicios y feedback, sus funciones y la publicación de visitas en Realtime. | Seis plantillas con ejercicios y cargas de ejemplo. |
| [012_mantencion_y_cierre_manual.sql](supabase/sql/012_mantencion_y_cierre_manual.sql) | Permite cambiar el estado de máquinas y cerrar visitas a mano; excluye ese cierre del feedback. | Sin datos de prueba. |
| [013_turno_nombre.sql](supabase/sql/013_turno_nombre.sql) | Publica con el turno el primer nombre y la inicial del apellido en la fila de aforo. | Completa el nombre de un llamado existente. |
| [014_vigencia_y_configuracion.sql](supabase/sql/014_vigencia_y_configuracion.sql) | Elimina la validación por período académico y permite al admin ajustar capacidad, horario y cierre automático. | Completa la hora de cierre en el horario existente. |
| [015_prestamos_y_habilitacion.sql](supabase/sql/015_prestamos_y_habilitacion.sql) | Crea préstamos, detalle, vistas de stock y pendientes, devolución completa y habilitación por emisión. | Deduce la emisión desde el vencimiento existente y conserva la vigencia. |
| [017_devoluciones_qr_tarjetas.sql](supabase/sql/017_devoluciones_qr_tarjetas.sql) | Devoluciones por cantidad, entrega separada de TNE, tipo TNE/TUI y QR de respaldo; conserva la firma anterior de devolución. | Inicializa cantidades devueltas según el estado histórico. |

| [018_seguridad_final.sql](supabase/sql/018_seguridad_final.sql) | Seguridad, roles, permisos y RPC. | Conserva los datos existentes. |
| [019_estabilidad_final.sql](supabase/sql/019_estabilidad_final.sql) | Cron, expiración de turnos y reconciliación de aforo. | Conserva los datos existentes. |
| [020_aviso_tne.sql](supabase/sql/020_aviso_tne.sql) | Aviso de TNE pendiente. | Conserva los datos existentes. |
| [021_administracion_catalogo.sql](supabase/sql/021_administracion_catalogo.sql) | CRUD de catálogo, stock y fotos. | Conserva los datos existentes. |
| [022_registro_corporal.sql](supabase/sql/022_registro_corporal.sql) | Mediciones privadas y evolución. | Conserva los datos existentes. |
| [023_rutinas_personalizadas.sql](supabase/sql/023_rutinas_personalizadas.sql) | Rutinas por origen, selección e historial. | Conserva los datos existentes. |
| [024_configuracion_completa.sql](supabase/sql/024_configuracion_completa.sql) | Configuración de aforo, turnos, modalidades y progresión. | Conserva los datos existentes. |
| [025_inscripciones_certificados.sql](supabase/sql/025_inscripciones_certificados.sql) | Categorías de persona, ficha privada del profesor y bucket privado de certificados. | Conserva los identificadores y la vigencia histórica registrada. |
| [026_acceso_rut_excepciones.sql](supabase/sql/026_acceso_rut_excepciones.sql) | Acceso por RUT y registro de excepciones por visita o turno. | Conserva credenciales, visitas, turnos y rutinas. |
| [027_vigencia_y_retiro_certificados.sql](supabase/sql/027_vigencia_y_retiro_certificados.sql) | Unifica el estado médico de inscripción, habilitación y acceso, y registra el retiro de adjuntos reemplazados. | Conserva fechas, fichas y documentos asociados. |
| [028_modo_administrador.sql](supabase/sql/028_modo_administrador.sql) | Permiso administrativo temporal para la cuenta del encargado. | Conserva los roles y requiere configurar Vault para la demo. |

La numeración salta de 015 a 017. En instalaciones nuevas, continúa en orden con los archivos 018 a 024 de `supabase/sql/`. La 019 requiere `pg_cron`. Para actualizar desde 023, aplica [024](supabase/sql/024_configuracion_completa.sql) antes de desplegar el panel. Consulta las [instrucciones de configuración, reversión y certificación](docs/configuracion-completa-024.md).

Aplica 025 a 028 en orden al entorno de prueba. Sigue la [configuración del modo administrador](docs/cr-02-modo-administrador.md) para preparar la demo. La [certificación de CR-02](.github/workflows/certificacion-cr02-fase-1.yml) ejecuta la regresión y las pruebas nuevas con un proyecto Supabase desechable.

## Usuarios de prueba

Las contraseñas de las cuentas compartidas se entregan por privado. Si creaste tu propio proyecto, usa las que definiste en Auth.

| Correo | Rol | Acceso principal |
|---|---|---|
| `alumno.demo@aforofit.cl` | Alumno (Antonia) | Su rutina y feedback en `/alumno` |
| `profesor.demo@aforofit.cl` | Profesor | Kiosco, panel del profesor, espera, visitas, máquinas, préstamos y modo Administración con PIN de demo |
| `admin.demo@aforofit.cl` | Administrador | Kiosco, panel de administración, configuración y habilitación |

## Pantallas y rutas

| Ruta | Acceso | Qué permite hacer |
|---|---|---|
| `/` | Todos | Envía al login o al panel del rol con sesión. |
| `/auth/login` | Sin sesión | Iniciar sesión con correo y contraseña. |
| `/auth/forgot-password`, `/auth/update-password` | Recuperación de cuenta | Solicitar el correo y definir una nueva contraseña con la sesión de recuperación. |
| `/auth/confirm`, `/auth/error` | Flujo de Auth | El primero procesa el enlace de confirmación; el segundo muestra errores de acceso. |
| `/ingreso` | Profesor y admin | Leer o vincular TNE/TUI, registrar acceso por RUT, ingresar un UID o usar QR. Solo el profesor puede autorizar una visita excepcional. |
| `/aforo` | Pública, sin sesión | Ver ocupación, cupos, espera y turno llamado con nombre abreviado. |
| `/alumno` | Alumno | Elegir objetivo y nivel, ver ejercicios, cargas y mantención, y responder el feedback; generar QR. |
| `/alumno/historial` | Alumno | Consultar sus visitas y feedback. |
| `/alumno/rutinas` | Alumno | Crear, editar, archivar y seleccionar rutinas. |
| `/alumno/medidas` | Alumno | Registrar peso, estatura y perímetro de cintura, IMC e historial privado. |
| `/profesor` | Profesor | Abrir los módulos del encargado. |
| `/profesor/inscripciones` | Profesor | Inscribir y editar personas, consultar el estado de sus certificados y descargar sus archivos privados. |
| `/profesor/espera` | Profesor | Consultar la lista de espera y los turnos llamados. |
| `/profesor/adentro` | Profesor | Revisar quién sigue adentro y cerrar una visita a mano. |
| `/profesor/maquinas` | Profesor | Marcar una máquina disponible o en mantención. |
| `/profesor/prestamos` | Profesor | Identificar al alumno, ver stock, prestar varios implementos, devolver cantidades y entregar la TNE por separado. |
| `/profesor/historial` | Profesor | Consultar visitas y préstamos por fecha en Santiago. |
| `/profesor/rutinas` | Profesor | Crear, asignar y editar rutinas de origen profesor. |
| `/admin` | Admin o profesor en modo Administración | Abrir los módulos de administración. |
| `/admin/configuracion` | Admin o profesor en modo Administración | Cambiar capacidad, umbral, horarios, cierre automático, expiración de turnos, modalidades de rutina y progresión de cargas. |
| `/admin/habilitacion` | Admin o profesor en modo Administración | Consultar el estado médico de una persona y registrar la emisión de certificados históricos. Las fichas con adjuntos se gestionan en Inscripciones. |
| `/admin/maquinas` | Admin o profesor en modo Administración | Administrar máquinas y fotos. |
| `/admin/implementos` | Admin o profesor en modo Administración | Administrar implementos y stock. |

## Pruebas

Desde la raíz del repositorio, con las dependencias instaladas y las dos variables de entorno configuradas:

```bash
npm test
npm run lint
npm run build
```

Se esperan 278 casos Vitest aprobados, lint sin errores y build exitoso. Ejecuta las suites SQL únicamente en Supabase desechable mediante [certificación 024](.github/workflows/certificacion-024.yml). No ejecutar suites automatizadas en producción. Las pruebas históricas se cuentan una sola vez.

| Archivo | Qué comprueba | Casos OK |
|---|---|---:|
| [registrar_ingreso.sql](supabase/pruebas/registrar_ingreso.sql) | Credenciales, habilitación, horario, cupos, turnos, salida, cierre automático y permisos | 45 |
| [rutinas.sql](supabase/pruebas/rutinas.sql) | Objetivo y nivel, generación por plantilla, mantención, feedback, cargas y acceso por rol | 62 |
| [profesor.sql](supabase/pruebas/profesor.sql) | Estado de máquinas, cierre manual, aforo y exclusión de feedback | 25 |
| [turno_nombre.sql](supabase/pruebas/turno_nombre.sql) | Abreviación, uso y expiración del turno y lectura pública | 10 |
| [configuracion.sql](supabase/pruebas/configuracion.sql) | Permisos del admin, rangos, horario, cierre y actualización del aforo | 27 |
| [prestamos.sql](supabase/pruebas/prestamos.sql) | Stock, devoluciones parciales y completas, dos firmas SQL, TNE, permisos y vigencia | 37 |
| [ingreso_codigo.sql](supabase/pruebas/ingreso_codigo.sql) | QR de un uso, vencimiento, reemplazo, permisos y reglas de acceso | 14 |
| [historial.sql](supabase/pruebas/historial.sql) | Lectura por rol, visitas y estados de préstamos | 9 |
| [estabilidad_019.sql](supabase/pruebas/estabilidad_019.sql) | Estabilidad y turnos | 30 |
| [seguridad_018.sql](supabase/pruebas/seguridad_018.sql) | Seguridad y roles | 55 |
| [020/aviso_tne.sql](supabase/pruebas/020/aviso_tne.sql) | Aviso TNE | 21 |
| [021/catalogo.sql](supabase/pruebas/021/catalogo.sql) | Catálogo y stock | 27 |
| [medidas/mediciones.sql](supabase/pruebas/medidas/mediciones.sql) | Privacidad y medidas | 42 |
| [023/rutinas_personalizadas.sql](supabase/pruebas/023/rutinas_personalizadas.sql) | Rutinas y modalidades | 38 |
| [023/primera_rutina_en_visita.sql](supabase/pruebas/023/primera_rutina_en_visita.sql) | Primera rutina y visitas | 19 |
| [024/configuracion_completa.sql](supabase/pruebas/024/configuracion_completa.sql) | Configuración y validaciones | 30 |
| [024/modalidades_y_feedback.sql](supabase/pruebas/024/modalidades_y_feedback.sql) | Modalidades y feedback | 22 |
| [migracion_017.sql](supabase/pruebas/migracion_017.sql) | Actualización histórica en base 015 | 2 |

Total: **515 SQL + 278 Vitest = 793**. Cron, concurrencia, Chromium y reversión se verifican adicionalmente. `migracion_017.sql` requiere el estado anterior a 017 y se ejecuta en el trabajo histórico de CI.

## Preparar y ensayar la demo

1. Usa tu proyecto de prueba. Como profesor, abre `/profesor/adentro`, cierra las visitas de ensayos anteriores y comprueba que `/aforo` marque **0 personas**. Revisa también `/profesor/espera`. Para obtener **turno 1**, usa un día sin turnos previos o una base de prueba recién preparada: la numeración es diaria.
2. Como administrador, anota la configuración original en `/admin/configuracion`, fija la capacidad en **1** y verifica que el horario permita ingresos a la hora del ensayo (hora de Santiago). En `/admin/habilitacion` revisa las vigencias. Los certificados vigentes de 008 vencen el 23-12-2026: para ensayar después, actualiza la emisión de los alumnos de prueba que deban entrar.
3. Usa sesiones separadas para cada rol. Deja `/aforo` abierto sin sesión y `/alumno` abierto como Antonia en el celular. Elige un objetivo y un nivel para generar su rutina. En el computador entra como profesor a `/ingreso`.
4. En **Ingreso manual**, escribe el UID de Antonia: entra y aparece su rutina. Ingresa el de Benjamín: queda en espera. Repite el de Antonia: sale, el celular ofrece feedback y la pantalla llama a **Benjamín P.**. Pasa el de Benjamín para que ocupe el cupo. El kiosco descarta una repetición inmediata de la misma tarjeta: espera al menos tres segundos antes de repetirla.
5. Al terminar, registra las salidas pendientes y restablece la capacidad original (20 en una instalación nueva) y el horario si lo cambiaste. Como respaldo del lector usa ingreso manual; para un corte de red ten a mano un hotspot y el video de respaldo del equipo.

| Alumno ficticio | UID para ingreso manual | Caso |
|---|---|---|
| Antonia Fictia Rivas | `04:A3:7F:2B` | Entrada, rutina de alumno.demo y salida |
| Benjamín Prueba Soto | `1C:5E:90:D4` | Espera y llamado al liberarse un cupo |
| Catalina Demo Fuentes | `B2:07:6A:3F` | Segundo alumno en espera |
| Yerko Demo Vencido | `FA:10:00:18` | Rechazo por certificado vencido |

## Limitaciones de esta versión

Las identidades, credenciales y documentos de prueba son ficticios. En CR-02 fase 1 se inscriben estudiantes, funcionarios/colaboradores y deportistas destacados. El profesor puede guardar una ficha con documentos pendientes. Para estudiantes se registra el certificado de alumno regular y el acceso conserva la validación médica. Los deportistas destacados están exentos del certificado médico y el mecanismo institucional de acreditación sigue pendiente. Los certificados admiten PDF, JPG o PNG de hasta 10 MB (10.485.760 bytes) por archivo. Los RUT de demostración que terminan en F conservan el acceso por credencial y requieren un RUT válido para el acceso manual.

Al reemplazar un archivo, Inscripciones guarda primero la ficha y luego retira el adjunto anterior mediante Storage. Si el retiro falla, se reintenta al volver a Inscripciones. Las cargas abandonadas antes de guardar que quedaron sin una marca de retiro (incluidas las previas a 027) requieren revisión operativa.

El QR de respaldo se canjea con seis caracteres en Ingreso manual; en navegadores compatibles también se ofrece cámara (BarcodeDetector). Para probarlo, abre una sesión de alumno con credencial vinculada, genera el QR y canjea el código desde otra sesión de profesor en `/ingreso`. Vence en dos minutos y sirve una vez. CA31 físico sigue pendiente. RF28–RF31 siguen pendientes.

## Kiosco de ingreso en Chrome

Cierra Chrome y abre una ventana dedicada al lector con uno de estos comandos.
Para probar localmente, cambia la dirección por `http://localhost:3000/ingreso`.

**Windows (PowerShell)**

```powershell
& "$env:ProgramFiles\Google\Chrome\Application\chrome.exe" --kiosk "https://aforofit.vercel.app/ingreso"
```

**macOS (Terminal)**

```bash
open -na "Google Chrome" --args --kiosk "https://aforofit.vercel.app/ingreso"
```

Inicia sesión como profesor o administrador y deja el kiosco en primer plano.
Si cambias de aplicación o pestaña, vuelve al kiosco y pulsa **Lector en pausa: haz clic aquí** antes de pasar la credencial.

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
- [Pruebas ejecutadas](docs/pruebas-ejecutadas.md): resultados por criterio de aceptación y defectos.
- [Plan de cierre del Avance 3 y la entrega final](docs/plan-cierre-avance-3-y-final.md): pendientes por hito y prioridad.
- [Complementos de los avances 1 y 2](docs/complementos-avances-1-y-2.md): objetivos medibles, interesados, enfoque, plan, verificación, plan de calidad, ADR y Playback.
- [CR-01, línea base de la entrega final](docs/cr-01-linea-base-entrega-final.md) (aprobado el 23 de noviembre).
- [Auditoría integral con los frameworks](docs/auditoria-proyecto-frameworks-2026-11-23.md): cronología por hito, brechas y plan de acción.
- [Auditoría de interfaces del 23 de noviembre](docs/auditoria-interfaces-2026-11-23.md): prototipo frente a producción, CA32, CA37 y decisiones.
- [Bases y rúbrica del Proyecto Integrador](docs/bases-proyecto-integrador.md): alcance y criterios por hito.
- Fotos originales del catálogo de máquinas (las que se suben al bucket `maquinas` de Supabase): `supabase/storage/maquinas/`.

- [`AGENTS.md`](AGENTS.md): contexto completo: problema, alcance, reglas de negocio, arquitectura, convenciones, calendario y estado actual.
- [`docs/entrevista-encargado-2026-11-12.md`](docs/entrevista-encargado-2026-11-12.md): entrevista con el encargado del gimnasio y decisiones D01–D11.
- [`docs/requisitos-casos-uso-criterios.md`](docs/requisitos-casos-uso-criterios.md): requisitos, casos de uso y criterios de aceptación y su trazabilidad.
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
