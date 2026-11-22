# Contrato del flujo de ingreso

Fuente común entre la base de datos (Isidora) y las pantallas `/ingreso`, `/aforo` y `/profesor/espera`.
Si cambia un nombre, un tipo o un motivo, se actualiza este archivo y `lib/ingreso/mensajes.ts` en el mismo pull request.

## 1. `registrar_ingreso(p_uid text) returns jsonb`

Devuelve **siempre un objeto**, nunca `null`, una fila ni un array:

```json
{
  "resultado": "entrada",
  "motivo": null,
  "alumno": { "id": "uuid", "nombre": "Nombre ficticio" },
  "turno": null,
  "ocupacion": 12,
  "capacidad": 20
}
```

| Campo | Tipo | Regla |
|---|---|---|
| `resultado` | text | `entrada`, `salida`, `turno` o `rechazo` |
| `motivo` | text o null | Uno de la lista cerrada cuando `resultado = rechazo`; `null` en los demás casos |
| `alumno` | `{ id, nombre }` o null | `null` si no se pudo identificar al alumno |
| `turno` | int o null | Número asignado cuando `resultado = turno`; `null` en los demás casos |
| `ocupacion` | int | Ocupación después de la operación. También se informa en un rechazo |
| `capacidad` | int | Capacidad vigente. También se informa en un rechazo |

### Motivos de rechazo (lista cerrada)

| `motivo` | Texto en pantalla | Criterio |
|---|---|---|
| `credencial_no_registrada` | Credencial no registrada | CA02 |
| `certificado_no_vigente` | Certificado no vigente | CA04 |
| `fuera_de_periodo` | Fuera del período académico | |
| `fuera_de_horario` | Fuera del horario de ingreso | CA05 |
| `gimnasio_cerrado` | El gimnasio está cerrado hoy | |
| `sin_permiso` | Esta pantalla requiere la sesión de un profesor | |

## 2. `vincular_credencial(p_uid text, p_alumno_id uuid) returns jsonb`

Devuelve `{ "ok": boolean, "motivo": text | null }`. Con `ok = true`, `motivo` es `null`.

| `motivo` | Texto en pantalla | Criterio |
|---|---|---|
| `credencial_de_otro_alumno` | La credencial ya pertenece a otro alumno | CA03 |
| `alumno_no_encontrado` | Alumno no encontrado | |
| `sin_permiso` | Esta pantalla requiere la sesión de un profesor | |

## 3. Permisos de las funciones

Ambas funciones se ejecutan solo con sesión y validan dentro que el rol sea `profesor` o `admin` (CU11).
Si el rol no corresponde, responden con el motivo `sin_permiso`.

```sql
revoke execute on function public.registrar_ingreso(text) from public, anon;
grant execute on function public.registrar_ingreso(text) to authenticated;

revoke execute on function public.vincular_credencial(text, uuid) from public, anon;
grant execute on function public.vincular_credencial(text, uuid) to authenticated;
```

## 4. Tabla `aforo`

Tiene **una sola fila, con `id = 1`**. La actualizan las funciones de la base de datos.

| Columna | Tipo | Nota |
|---|---|---|
| `id` | int, PK | Siempre 1 |
| `ocupacion` | int | Personas adentro |
| `capacidad` | int | Copiada de `configuracion` |
| `turno_llamado` | int, null | Turno que muestra la pantalla pública |
| `en_espera` | int | Turnos en estado `esperando` |
| `umbral_casi_lleno` | numeric | Copiado de `configuracion`, inicial 0,8 |
| `actualizado_en` | timestamptz | Última actualización |

Lectura pública, sin escritura desde el cliente, y publicada en Realtime. La política es necesaria porque
todas las tablas usan RLS: sin ella, el `grant` no basta y la pantalla pública no recibe filas.

```sql
alter table public.aforo enable row level security;

create policy "aforo_lectura_publica" on public.aforo
  for select to anon, authenticated using (true);

grant select on public.aforo to anon, authenticated;

alter publication supabase_realtime add table public.aforo;
```

## 5. Tabla `turnos`

`alumno_id` es una clave foránea a `alumnos(id)`:

```sql
alumno_id uuid not null references public.alumnos(id)
```

Así, `select("numero, estado, creado_en, alumnos(nombre)")` devuelve `alumnos` como un **objeto** y no como un array.
Los estados son `esperando`, `llamado`, `usado` y `expirado`. La base de datos usa `expirado` cuando un turno
llamado no se reclama en `turno_expira_minutos`. La pantalla `/profesor/espera` lee solo `esperando` y `llamado`.

## 6. Tabla `configuracion`

Se agrega el parámetro `umbral_casi_lleno`:

```sql
umbral_casi_lleno numeric not null default 0.8
  check (umbral_casi_lleno > 0 and umbral_casi_lleno <= 1)
```

Cuando el administrador lo cambia, el valor se copia a `aforo.umbral_casi_lleno`. La pantalla pública lee
`aforo`, porque `configuracion` no es pública. El 0,8 del código es solo un respaldo si el valor falta o es inválido.

## 7. Acceso por pantalla

| Ruta | Quién entra | Datos que usa |
|---|---|---|
| `/ingreso` | Profesor y administrador (CU11) | `registrar_ingreso`, `vincular_credencial` y búsqueda en `alumnos` por `nombre` y `rut` |
| `/aforo` | Público | `aforo` |
| `/profesor/espera` | Solo profesor (CU02) | `turnos` con `alumnos(nombre)` y `aforo` |
