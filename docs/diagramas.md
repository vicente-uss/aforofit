# AforoFit — Diagramas de análisis y diseño

El documento maestro incorpora esta sección en el [diagramas y estados](cierre-avances-1-y-2.md#diagramas-completos).

Grupo 6 · Taller de Ingeniería de Software · Avance 2 · Actualizado el 16 de noviembre de 2026

Este documento reúne los diagramas formales del sistema. Se basa en [`AGENTS.md`](../AGENTS.md), en los
[requisitos, casos de uso y criterios](requisitos-casos-uso-criterios.md) y en la
[revisión del prototipo](revision-prototipo-2026-11-16.md). Los diagramas en Mermaid se ven directamente en GitHub.

## Trazabilidad del diseño

Los diagramas describen el **diseño del Avance 2**. Los ID se desarrollan en el [registro de decisiones](../AGENTS.md#decisiones-vigentes-d01d17) y la [matriz de requisitos y criterios](requisitos-casos-uso-criterios.md#8-matriz-de-cobertura).

| Vista | Qué cubre | Trazabilidad principal |
|---|---|---|
| [Casos de uso](#1-casos-de-uso) | Actores, funciones y alcance de CU01–CU16 | [Especificaciones de los casos](requisitos-casos-uso-criterios.md#5-especificación-de-los-casos-de-uso-principales) |
| [Modelo entidad-relación](#2-modelo-entidad-relación) | Datos de acceso, visitas, turnos, rutinas, catálogo, préstamos, mediciones y configuración | RF02, RF04, RF06–RF08, RF10–RF15, RF18–RF27 |
| [Secuencia del ingreso](#3-secuencia-del-ingreso-cu01-cu02-y-cu04) | Lectura, validación, entrada o turno, aforo y rutina | CU01, CU02, CU04, CU11 y CU15 · CA01–CA07, CA10–CA13, CA29 y CA31 |
| [Estados de la visita](#4-estados-de-la-visita) | Salida, cierre automático y liberación del cupo | CU03 y CU15 · CA08–CA11, CA14 y CA15 |
| [Estados del préstamo](#5-estados-del-préstamo) | Préstamo, devolución parcial y devolución de garantía | CU08 y CU09 · CA19–CA21 y CA27 |
| [Flujo central](diagramas/flujo-central.svg), [arquitectura](diagramas/arquitectura.svg) e [interfaces en la PPT](entregas/avances/AforoFit-Avance2-Grupo6.pdf) | Recorrido del alumno, componentes, despliegue y vistas de los roles | [Flujo central](../AGENTS.md#5-flujo-central-lo-que-se-demuestra-en-vivo), [stack](../AGENTS.md#6-stack-y-arquitectura) y RNF01–RNF11 |

## Estado

| Diagrama | Herramienta | Archivo | Estado |
|---|---|---|---|
| Casos de uso | draw.io | [`diagramas/casos-de-uso.drawio`](diagramas/casos-de-uso.drawio) | Listo |
| Entidad-relación | draw.io y Mermaid (este archivo) | [`diagramas/entidad-relacion.drawio`](diagramas/entidad-relacion.drawio) | Flujo de ingreso implementado (`005` a `009`); rutinas, feedback, mediciones y préstamos siguen como diseño |
| Secuencia del ingreso | Mermaid (este archivo; draw.io lo importa con Organizar → Insertar → Mermaid) | — | Listo |
| Estados de la visita y del préstamo | draw.io y Mermaid (este archivo) | [`diagramas/estados.drawio`](diagramas/estados.drawio) | Listo |
| Flujo central y arquitectura | Imágenes de la presentación | [`diagramas/`](diagramas/) | Listo |

Para editar el diagrama de casos de uso, abre el archivo `.drawio` en [app.diagrams.net](https://app.diagrams.net)
(Archivo → Abrir desde → Dispositivo).

---

## 1. Casos de uso

Tres actores y 16 casos de uso. El alumno concentra el flujo central (CU01 a CU04).

![Diagrama de casos de uso](diagramas/casos-de-uso.png)

| Caso | Nombre | Actores | Prioridad |
|---|---|---|---|
| CU01 | Ingresar al gimnasio | Alumno | Alta |
| CU02 | Esperar turno (extiende CU01) | Alumno | Alta |
| CU03 | Salir y dar feedback | Alumno | Alta |
| CU04 | Ver rutina del día | Alumno | Alta |
| CU05 | Elegir perfil y rutina | Alumno | Alta |
| CU06 | Crear o editar rutina | Alumno, profesor | Alta |
| CU07 | Registrar medidas | Alumno | Alta |
| CU08 | Prestar implementos | Profesor | Alta |
| CU09 | Recibir devolución | Profesor | Alta |
| CU10 | Cambiar estado de máquina | Profesor | Alta |
| CU11 | Vincular credencial (extiende CU01) | Profesor, administrador | Alta |
| CU12 | Habilitar alumno | Administrador | Alta |
| CU13 | Gestionar catálogo | Administrador | Alta |
| CU14 | Configurar parámetros | Administrador | Alta |
| CU15 | Ver aforo en vivo | Alumno, profesor | Alta |
| CU16 | Ver reportes | Administrador | Media |

**Relaciones:**
- CU02 extiende CU01 cuando el gimnasio está lleno.
- CU11 extiende CU01 cuando la credencial no está registrada.

**Casos compartidos:** CU06, CU11 y CU15 usan la misma pantalla, con permisos distintos según el rol.

---

## 2. Modelo entidad-relación

El modelo de diseño propone quince tablas y políticas RLS. El alumno se relaciona con tarjetas, visitas, turnos, rutinas y mediciones. Los scripts `001` a `009` ya crearon perfiles, catálogo y el flujo de ingreso (`alumnos`, `tarjetas`, `configuracion`, `visitas`, `turnos` y `aforo`). Rutinas, feedback, mediciones y préstamos siguen siendo diseño.

```mermaid
erDiagram
    PERFILES |o--o| ALUMNOS : "es"
    ALUMNOS ||--o{ TARJETAS : "tiene"
    ALUMNOS ||--o{ VISITAS : "registra"
    ALUMNOS ||--o{ TURNOS : "recibe"
    ALUMNOS ||--o{ RUTINAS : "tiene"
    ALUMNOS ||--o{ MEDICIONES : "registra"
    PERFILES ||--o{ RUTINAS : "es autor de"
    RUTINAS ||--|{ EJERCICIOS : "contiene"
    MAQUINAS ||--o{ EJERCICIOS : "se usa en"
    VISITAS ||--o| FEEDBACK : "termina con"
    RUTINAS ||--o{ FEEDBACK : "recibe"
    TARJETAS ||--o{ PRESTAMOS : "queda en garantía"
    PRESTAMOS ||--|{ PRESTAMO_ITEMS : "incluye"
    IMPLEMENTOS ||--o{ PRESTAMO_ITEMS : "se presta en"

    PERFILES {
        uuid id PK "igual a auth.users.id"
        text nombre
        text rol "alumno, profesor o admin"
    }
    ALUMNOS {
        uuid id PK
        uuid perfil_id FK "opcional y único"
        text nombre
        text rut UK "ficticio"
        text carrera
        date certificado_hasta
        text objetivo "fuerza, hipertrofia o salud"
        text nivel "principiante o intermedio"
        timestamptz creado_en
    }
    TARJETAS {
        text uid PK "UID del chip, único"
        uuid alumno_id FK
        text tipo "credencial_uss o tne"
        timestamptz creado_en
    }
    VISITAS {
        uuid id PK
        uuid alumno_id FK
        timestamptz entrada
        timestamptz salida
        bool cierre_automatico
    }
    TURNOS {
        uuid id PK
        uuid alumno_id FK
        int numero "correlativo del día"
        text estado "esperando, llamado, usado o expirado"
        timestamptz creado_en
        timestamptz llamado_en
    }
    RUTINAS {
        uuid id PK
        uuid alumno_id FK
        uuid autor_id FK
        text origen "sistema, profesor o alumno"
        bool activa
    }
    EJERCICIOS {
        uuid id PK
        uuid rutina_id FK
        bigint maquina_id FK
        int orden
        int series
        int repeticiones
        numeric carga_kg
    }
    MAQUINAS {
        bigint id PK
        text nombre
        text ejercicio
        text grupo_muscular
        text patron_movimiento
        text ajustes
        int cantidad
        text estado "disponible o en_mantencion"
        text foto_url "ruta en el bucket maquinas"
    }
    FEEDBACK {
        uuid id PK
        uuid visita_id FK
        uuid rutina_id FK
        text valor "facil, justo o me_costo"
    }
    MEDICIONES {
        uuid id PK
        uuid alumno_id FK
        date fecha
        numeric peso_kg
        numeric estatura_cm
        numeric cintura_cm
    }
    PRESTAMOS {
        uuid id PK
        text tarjeta_uid FK "TNE en garantía"
        text estado "abierto, parcial o cerrado"
        bool tne_devuelta
        timestamptz creado_en
    }
    PRESTAMO_ITEMS {
        uuid prestamo_id PK, FK
        bigint implemento_id PK, FK
        int cantidad
        int devueltos
    }
    IMPLEMENTOS {
        bigint id PK
        text nombre UK
        text categoria
        int cantidad_total
    }
    CONFIGURACION {
        int id PK "una sola fila"
        int capacidad
        jsonb horario
        date periodo_inicio
        date periodo_fin
        int cierre_automatico_horas
        int turno_expira_minutos
        numeric umbral_casi_lleno
        jsonb progresion
        jsonb modalidades_rutina
    }
    AFORO {
        int id PK "una sola fila, pública"
        int ocupacion
        int capacidad
        int turno_llamado
        int en_espera
        numeric umbral_casi_lleno
        timestamptz actualizado_en
    }
```

**Restricciones de la base de datos:**
- `tarjetas.uid` es único: una credencial pertenece a un solo alumno (regla 1).
- Índice único parcial en `visitas (alumno_id) where salida is null`: una visita abierta por alumno (regla 5).
- `turnos`: número único por día de Santiago y un solo turno activo por alumno y día (regla 4).
- `configuracion` y `aforo` tienen una sola fila (`id = 1`). `aforo` se publica en Realtime y no contiene datos de alumnos.
- `prestamo_items.devueltos <= cantidad`.
- RLS en `mediciones`: solo las lee su dueño (RNF07).

---

### 2.1 Modelo implementado en Supabase (23 de noviembre)

![Modelo de datos implementado](diagramas/entidad-relacion-implementado.png)

Generado desde el esquema real de la base (`information_schema`), no dibujado a mano: 9 tablas del esquema `public`,
todas con Row Level Security. Fuente editable en `diagramas/entidad-relacion-implementado.dot` (Graphviz:
`dot -Tpng -Gdpi=150 entidad-relacion-implementado.dot -o entidad-relacion-implementado.png`).

**Cómo leerlo (para la lámina 17):**

- **Verde, flujo de ingreso:** `alumnos` es el centro. Cada alumno puede tener varias `tarjetas` (TNE y TUI, regla 1:
  una tarjeta pertenece a un solo alumno), muchas `visitas` (solo una abierta a la vez, regla 5, con un índice único)
  y sus `turnos` de la lista de espera (regla 4).
- **Azul, acceso:** `perfiles` guarda el rol (alumno, profesor o administrador) de cada usuario de Supabase Auth. Un
  alumno puede no tener cuenta (`perfil_id` opcional): el ingreso funciona igual con la tarjeta.
- **Amarillo, parámetros y estado:** `configuracion` tiene una sola fila con la capacidad, el horario, el período y
  los demás parámetros (nada fijo en el código). `aforo` es una fila que se recalcula en cada entrada, salida o turno;
  es la que escucha la pantalla pública en tiempo real.
- **Morado, catálogo:** `maquinas` (con su `estado`, base de la advertencia de mantención) e `implementos`.
- **Orden de `registrar_ingreso`:** ¿la tarjeta existe? → ¿el certificado está vigente en el período? → ¿está
  dentro del horario? → ¿tiene una visita abierta? (sale) → ¿hay cupo? (entra) o turno. Todo en una transacción.
- **Diseñado frente a implementado:** el modelo de la sección 2 tiene además rutinas, préstamos y registro corporal;
  se construyen según el [CR-01](cr-01-linea-base-entrega-final.md).

## 3. Secuencia del ingreso (CU01, CU02 y CU04)

> **Diseño frente a lo implementado (23 de noviembre).** El diagrama muestra el diseño lógico. En la implementación, el kiosco hace una sola llamada a `registrar_ingreso(uid)`, que valida credencial, certificado, horario y cupo dentro de la base de datos y devuelve entrada, salida, turno o rechazo ([contrato](contrato-flujo-ingreso.md)). Las pantallas en tiempo real escuchan la tabla `aforo`, no `visitas`. La entrega de la rutina al celular sigue pendiente.

```mermaid
sequenceDiagram
    actor A as Alumno
    participant L as Lector NFC
    participant P as Pantalla /ingreso
    participant DB as Supabase (PostgreSQL)
    participant RT as Supabase Realtime
    participant C as Celular del alumno

    Note over C: El alumno ya inició sesión en su celular (D13)
    A->>L: Acerca su credencial
    L->>P: Escribe el UID y presiona Enter
    P->>DB: Busca la tarjeta por UID
    alt Credencial no registrada
        DB-->>P: Sin resultado
        P-->>A: "Credencial no registrada" (CU11)
    else Credencial registrada
        DB-->>P: Alumno
        P->>DB: Valida certificado, horario y cupo
        alt Sin certificado vigente o fuera de horario
            DB-->>P: Rechazo con motivo
            P-->>A: Muestra el motivo
        else Gimnasio lleno
            DB-->>P: Sin cupo
            P->>DB: Crea un turno (estado esperando)
            P-->>A: Muestra su número de turno (CU02)
        else Hay cupo
            P->>DB: Crea la visita (entrada = ahora)
            DB-->>RT: Cambio en visitas
            RT-->>P: Aforo +1
            RT-->>C: Visita abierta
            C->>DB: Pide la rutina activa
            DB-->>C: Rutina con cargas y avisos de mantención
            P-->>A: "Bienvenido, [nombre]"
        end
    end
```

La validación de certificado, horario y cupo debería quedar en una sola función de la base de datos, para que
dos lecturas al mismo tiempo no ocupen el último cupo.

---

## 4. Estados de la visita

```mermaid
stateDiagram-v2
    [*] --> Abierta: pasa la credencial con cupo
    Abierta --> Cerrada: pasa la credencial al salir
    Abierta --> CerradaAutomaticamente: pasan 3 horas sin salida
    Cerrada --> [*]
    CerradaAutomaticamente --> [*]
```

| Estado | Cómo se guarda | Efecto |
|---|---|---|
| Abierta | `salida` vacía | Cuenta en el aforo |
| Cerrada | `salida` con la hora real | Libera el cupo y pide feedback si usó su rutina |
| Cerrada automáticamente | `salida` con la hora del cierre y `cierre_automatico = true` | Libera el cupo y no pide feedback |

---

## 5. Estados del préstamo

```mermaid
stateDiagram-v2
    [*] --> Abierto: el profesor pasa la TNE y marca los implementos
    Abierto --> Parcial: devuelve una parte
    Parcial --> Parcial: devuelve otra parte
    Abierto --> Devuelto: devuelve todo
    Parcial --> Devuelto: devuelve el resto
    Devuelto --> Cerrado: el profesor entrega la TNE
    Cerrado --> [*]
```

| Estado | Condición | Puede abrir otro préstamo |
|---|---|---|
| Abierto | Ningún implemento devuelto | No |
| Parcial | Algunos implementos devueltos | No |
| Devuelto | Todo devuelto y la TNE sigue con el profesor | No |
| Cerrado | Todo devuelto y `tne_devuelta = true` | Sí |

Los préstamos no cambian el aforo (D04). El diagrama conserva el bloqueo de otro préstamo mientras la TNE siga en garantía. Pendiente confirmar esa condición con el equipo y alinearla con R9 y su criterio.

---

## Pendientes

- Contrastar el modelo entidad-relación con los [scripts de perfiles y catálogo](../supabase/sql/) ya disponibles y actualizarlo a medida que se creen las tablas del flujo central.
- Definir qué pasa con un turno llamado que no se presenta (por ejemplo, si vence a los 5 minutos).
