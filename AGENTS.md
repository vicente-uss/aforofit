# AGENTS.md — Contexto del proyecto AforoFit

Este archivo es la fuente única de contexto para cualquier IA o persona que trabaje en el proyecto.
Si algo de aquí contradice otro documento, manda este archivo. Si cambias el alcance, las reglas o
el estado, actualiza este archivo en el mismo pull request.

## 1. Qué es AforoFit

Sistema web para el gimnasio de la **Universidad San Sebastián (USS), sede Bellavista**.
Lo usan **solo alumnos** de la universidad. Es el **Proyecto Integrador** (evaluación Solemne) del
ramo Taller de Ingeniería de Software, Grupo 6, noviembre–diciembre de 2026.

Es un **prototipo académico**: se trabaja con **datos de prueba**, sin conexión a los sistemas
reales de la USS. Debe ejecutarse en vivo en la demostración final.

### Situación actual del gimnasio (problema)

- El ingreso se registra anotando el **RUT en papel y lápiz**.
- **Nadie entrega rutinas**: cada alumno arma la suya.
- **El aforo no se controla**: el encargado avisa cuando ve que está muy lleno.
- El encargado revisa **a mano** los certificados al día y el préstamo de implementos.
- En horas peak se forman **filas en las mismas máquinas**.
- Cuando una máquina falla, cada alumno improvisa su reemplazo.

### Idea central (la solución)

> La entrada es el único momento en que todos pasan por el mismo lugar. Ahí el sistema decide.

1. El alumno pasa su **credencial** (tarjeta con chip) por un lector en la entrada.
2. El sistema lo identifica, valida que esté **habilitado** y genera su **rutina del día**.
3. La rutina aparece **al instante en su celular**, con pesos y ajustes de cada máquina.
4. El sistema **reparte el orden de los ejercicios** entre los alumnos que están adentro para evitar filas.
5. Si una máquina está en mantención, **todas las rutinas la reemplazan** por un ejercicio equivalente.
6. Al salir, pasa la credencial y responde **fácil / justo / me costó**: eso ajusta los pesos de su próxima rutina.
7. Una pantalla pública muestra el **aforo en vivo**.

Durante el entrenamiento el alumno solo mira su rutina: **no registra series una por una**.

### Lo innovador (estado del arte)

Las apps de rutina existentes (SmartGym, GymTime, EGYM) son individuales y el usuario avisa a mano
si una máquina está ocupada. Los controles de acceso solo abren la puerta. **No encontramos** un
sistema que use el ingreso para activar la rutina de cada alumno y coordinar a todos los que están
entrenando. (Decirlo siempre como "no encontramos", nunca como "no existe".)

## 2. Usuarios (roles)

| Rol | Qué hace |
|---|---|
| **Alumno** | Entra con su credencial, recibe su rutina generada, da feedback al salir, pide implementos, registra sus medidas corporales. |
| **Encargado** | Vigila ingreso y aforo, presta implementos, marca máquinas en mantención, registra mal uso y puede ajustar la rutina de un alumno si hace falta. **No crea rutinas** y no entrena a los alumnos. |
| **Administrador** | Registra máquinas e implementos, habilita alumnos (con certificado vigente) y revisa reportes. |

No hay visitantes ni usuarios externos.

## 3. Alcance

### Prioridad alta (comprometido para la entrega final)

- ★ **Rutina activada por la credencial**: aparece en el celular con pesos y ajustes de máquina.
- ★ **Orden repartido**: evita que varios alumnos partan en la misma máquina.
- ★ **Feedback al salir y progresión de cargas**.
- ★ **Máquina en mantención** con reemplazo automático en todas las rutinas.
- **Ingreso con credencial** (credencial USS o TNE) y QR como respaldo.
- **Préstamo de implementos** con la credencial (pelotas y otros): préstamo, devolución y pendientes.
- **Catálogo del gimnasio**: máquinas e implementos reales, registrados una vez.
- **Usuarios y roles**: alumno, encargado, administrador.
- **Aforo en vivo** y lista de espera cuando el gimnasio está lleno.
- **Registro corporal privado**: el alumno anota peso y perímetros; IMC y evolución.
- **Habilitación de alumnos** con certificado vigente.

★ = no encontrado en soluciones existentes.

### Prioridad media (solo si el núcleo está listo y probado)

- Registro de incidencias de mal uso (si se repite, avisa al administrador).
- ★ Pronóstico de ocupación por zona para la próxima hora.
- Reportes: asistencia por carrera y horario, uso de máquinas y préstamos.
- Alumnos en riesgo: aviso al administrador cuando un alumno deja de venir.

Nada de prioridad media puede aparecer en el pendón como implementado si no lo está.

### Trabajo futuro (declarado, no se construye)

Limpieza y mantención según uso · notificaciones y gamificación · informe PDF de evaluación.

### Fuera del alcance (no construir, no sugerir)

Usuarios externos a la universidad · conexión con los sistemas reales de la USS · app nativa ·
otras sedes · torniquetes y puertas automáticas · sensores o cambios en las máquinas · registrar
series durante el entrenamiento · pagos · reconocimiento facial · IA generativa dentro del producto.

## 4. Reglas de negocio

Cada regla debe tener una validación en el código o una restricción en la base de datos, y un caso de prueba.

1. **Credencial única**: una credencial pertenece a un solo alumno; si no está registrada, se ofrece vincularla.
2. **Habilitación**: solo ingresan alumnos habilitados por el administrador con certificado vigente.
3. **Capacidad**: se controla la capacidad del gimnasio y de las máquinas disponibles.
   Parámetro inicial del reparto: máximo 2 alumnos parten en la misma máquina por bloque de 10 minutos (configurable).
4. **Mantención**: una máquina en mantención se reemplaza por otra del mismo patrón de movimiento.
5. **Progresión**: fácil = +2,5 kg · justo = igual · me costó = −5 %. Si el encargado ajustó la rutina, manda su versión.
6. **Cierre automático**: si el alumno no marca salida, la visita se cierra sola a las 3 horas.
7. **Gimnasio lleno**: el alumno pasa a lista de espera y entra cuando se libera un cupo.
8. **Préstamos**: un implemento a la vez por alumno; si no lo devuelve, queda pendiente y no puede pedir otro.

Los valores numéricos (2 alumnos, 10 min, 2,5 kg, 5 %, 3 h) son parámetros: guárdalos en configuración, no fijos en el código.

## 5. Flujo central (lo que se demuestra en vivo)

| Etapa | Qué pasa | Requisito de las bases |
|---|---|---|
| Ingreso | Credencial en el lector → se identifica al alumno | Captura de información |
| Proceso | Validación + rutina del día con pesos, orden repartido y reemplazos | Procesamiento y validación |
| Salida | La rutina aparece en el celular (tiempo real) | Salida verificable |
| Persistencia | Feedback al salir (fácil / justo / me costó) | Persistencia |
| Consulta | Próxima rutina ajustada y aforo en vivo | Consulta verificable |

## 6. Stack y arquitectura

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind, web responsiva. Creado con la plantilla oficial `with-supabase`.
- **Backend y base de datos**: Supabase (PostgreSQL + Auth + Realtime).
- **Despliegue**: Vercel. Cada push a `main` publica en producción; cada pull request genera una vista previa.
- **Lector de credenciales**: lector NFC USB de 13,56 MHz en modo teclado (HID). Al acercar la tarjeta
  escribe su UID como texto seguido de Enter. En la app es solo un campo de texto enfocado.
  El formato del UID depende del lector: registrar siempre las credenciales con el mismo lector.
- **Respaldo de ingreso**: código QR.

```
Lector USB (teclado) ──► Navegador (Next.js en Vercel) ◄──► Supabase (Postgres + Auth + Realtime)
                              ▲
Celular del alumno ───────────┘  (rutina en tiempo real)
Pantalla pública ─────────────┘  (aforo en vivo)
```

### Variables de entorno

Solo estas dos, en `.env.local` (local) y en Vercel (producción):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Nunca usar ni subir la clave `secret` / `service_role`. Nunca subir `.env.local`.

## 7. Convenciones

- **Idioma**: interfaz, textos, commits y documentación en español de Chile. Nombres de dominio
  (tablas, columnas, componentes de negocio) en español, en `snake_case` para la base de datos,
  sin tildes ni ñ en identificadores (`alumnos`, `maquinas`, `prestamos`).
- **Base de datos**: Row Level Security activado en todas las tablas. El alumno solo ve sus datos;
  el registro corporal solo lo ve su dueño. Guarda cada SQL que ejecutes en Supabase en
  `supabase/sql/NNN_descripcion.sql` (ej. `001_tablas_iniciales.sql`) para tener historial.
- **Ramas**: `main` siempre funciona. Una rama por tarea (`ingreso-credencial`, `prestamos`) y
  pull request revisado por otro integrante antes de fusionar.
- **Simplicidad**: es un prototipo de 3 semanas hecho por 5 estudiantes. Preferir la solución más
  simple que cumpla la regla. No agregar librerías sin necesidad clara.
- **Datos**: solo datos de prueba. Nunca datos reales de alumnos.

### Comandos

```
npm install       # instalar dependencias
npm run dev       # desarrollo en http://localhost:3000
npm run build     # verificar que compila antes de un pull request
npm run lint      # revisar estilo
```

## 8. Equipo

| Integrante | Rol | Responsable de |
|---|---|---|
| Vicente Galleguillos | Jefe de proyecto | Plan, requisitos, estimación, plan de pruebas, documentación, PPT de avances |
| Benjamín Velásquez | Backend y reglas de negocio | Modelo de datos, generador de rutina, reparto, progresión, reemplazos, capacidad |
| Pau Urzúa | Ingreso y hardware | Lector de credenciales, QR de respaldo, aforo en vivo, préstamo de implementos |
| Isidora Moscoso | Frontend alumno y encargado | Rutina en el celular, feedback, panel del encargado, registro corporal |
| Bastián González | Administración y QA | Catálogo de máquinas e implementos, habilitación, reportes, diseño del pendón, ejecución de pruebas |

Las tareas se siguen en el documento **"AforoFit — Plan de acción del proyecto"** (cada uno marca su casilla).
Las guías de arranque están en **"AforoFit — Kit de arranque"**.

## 9. Calendario

Clases: martes 13:10–16:00 (los avances se entregan los martes) y jueves 11:00–12:20 (consultas).

| Fecha | Hito | Contenido exigido |
|---|---|---|
| Mar 10 nov | Avance 1 ✅ | Aprobado con nota máxima, sin observaciones |
| **Mar 17 nov** | **Avance 2** | Requisitos funcionales y no funcionales priorizados · actores, casos de uso y criterios de aceptación · modelo de datos · arquitectura y diseño de interfaces · evidencia de avance técnico · ajustes desde el Avance 1 |
| Mar 24 nov | Avance 3 | Estimación LOC y/o puntos de función con supuestos · esfuerzo, duración, recursos y riesgos · demo del prototipo · pruebas iniciales · borrador del pendón |
| Jue 26 nov | Pendón definitivo | Aprobado y enviado a imprimir; solo funcionalidades implementadas o marcadas como futuras |
| Lun 30 nov | Congelamiento | Desde aquí solo correcciones |
| 1–3 dic | Entrega final y expo (70 % de la nota) | Prototipo funcionando en vivo, código con instrucciones, evidencia de pruebas, pendón instalado, defensa de todos |

## 10. Estado actual

Actualizado: jueves 12 de noviembre de 2026.

**Hecho**
- Avance 1 aprobado con nota máxima.
- Repositorio en GitHub, proyecto en Supabase y despliegue en Vercel creados.

**Pendiente para el Avance 2 (martes 17)**
- [ ] Comprar el lector NFC USB tipo teclado y probarlo con la credencial USS, la TNE y la Bip! (Pau, viernes 13)
- [ ] Entrevista con el encargado del gimnasio: implementos, horas peak, máquinas, certificados (Vicente)
- [ ] Inventario de máquinas e implementos reales con fotos (Bastián)
- [ ] Primer borrador del modelo de datos (Benjamín)
- [ ] Revisión de pantallas del alumno y del encargado (Isidora)

**Decisiones tomadas**
- Ingreso con credencial con chip; QR como respaldo si la credencial no sirve.
- Repositorio público (Vercel Hobby solo despliega commits del dueño en repos privados).
- No se usa tablero de GitHub: las tareas viven en el plan de acción.
- La IA se usa para casi todo; el equipo revisa y decide.

**Preguntas abiertas** (se resuelven con la entrevista y la prueba del lector)
- ¿La credencial USS tiene chip de 13,56 MHz con UID fijo?
- Capacidad máxima oficial del gimnasio, horario y horas peak.
- Certificado que se exige y su vigencia.
- Lista real de máquinas e implementos.

## 11. Cómo debe trabajar una IA en este proyecto

1. Lee este archivo completo antes de proponer o escribir código.
2. Respeta el alcance: si algo no está en la sección 3, pregunta antes de agregarlo.
3. Cada regla de negocio (sección 4) debe quedar validada y con su caso de prueba.
4. Responde y escribe en español; código simple y comentado donde la lógica no sea obvia.
5. Al terminar una tarea, indica qué partes de la sección 10 (Estado actual) hay que actualizar.
6. Nunca expongas claves ni uses datos reales de alumnos.
