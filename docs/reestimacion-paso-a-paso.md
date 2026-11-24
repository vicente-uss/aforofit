# Reestimación paso a paso · AforoFit (versión 0.3)

Lunes 23 de noviembre de 2026. Rehace la estimación desde el principio con el procedimiento del framework de
Ingeniería de Software (secciones 9 a 13) y de las clases de las semanas 5, 6 y 7. A diferencia de la versión 0.2
(`estimacion.md`), el tamaño se mide **dos veces y por separado**: en LOC (descomposición por componentes) y en PF
(matrices de clase). Después, cada tamaño pasa a esfuerzo con la **fórmula inicial** (esfuerzo = tamaño ÷
productividad, semanas 5 y 6) y con **COCOMO 81 básico** (semana 7).

> Estado: propuesta para revisar. La PPT y la planilla todavía muestran la versión 0.2.

## Paso 0. Qué se estima (FW-IS 9.3 y 10.2, paso 1)

| | Incluido | Excluido |
|---|---|---|
| Alcance | Requisitos de prioridad alta, RF01 a RF27 (el alcance diseñado completo) | Prioridad media (RF28 a RF31) y trabajo futuro |
| Frontera | App web y base de datos en Supabase | Sistemas de la USS (0 EIF) |
| Código | Lo que programa el equipo | Plantilla `with-supabase`, pruebas y configuración (regla de `estimacion.md` 3.1) |

La línea base del CR-01 (lo que se entrega en esta versión) es una decisión aparte: aquí se estima el alcance
completo, como en la versión 0.2, para que las cifras se puedan comparar.

## Paso 1. Tamaño en LOC (semana 6, LOC; FW-IS 11.2)

**Técnica:** descomposición por componentes (bottom-up) con **analogía interna**: el tamaño de cada componente
pendiente se toma de componentes parecidos que el equipo ya construyó y midió en el repositorio. Es lo que la
clase pide para usar LOC antes de programar: «podemos estimar las LOC con proyectos anteriores, analogía y
descomposición» (semana 6, lámina 15).

**Regla de conteo** (declarada antes de contar): líneas no vacías y sin comentarios de los archivos `.ts`, `.tsx`
y `.sql`; sin la plantilla, las pruebas ni la configuración.

### 1.1 Lo ya construido (medido el 23 de noviembre)

| Componente medido | LOC | Sirve de referencia para |
|---|---:|---|
| Kiosco `/ingreso` con el lector (pantalla con estados y lectura) | 420 | Pantalla con lector |
| Pantalla de aforo en tiempo real | 88 | Pantalla en tiempo real |
| Lista de espera del profesor | 128 | Lista con acciones |
| Paneles por rol, layout y protección de rutas | 270 | — |
| Lógica en `lib/` (aforo, mensajes, UID, roles) | 341 | Lógica auxiliar (unos 40 por archivo) |
| SQL: 9 tablas con RLS, funciones de las reglas, permisos y datos | 608 | Tabla con RLS (unas 30), función de reglas (60 a 100) |
| **Total construido por el equipo** | **1.855** | |

### 1.2 Lo pendiente (estimado por componente)

Tamaños unitarios tomados de la tabla anterior: tabla con RLS 30 · función SQL simple 40 a 60, compleja 100 ·
formulario simple 80 · lista o consulta 100 · editor o pantalla en tiempo real 180 a 200 · pantalla con lector
250 · archivo de lógica 40.

| Módulo | Componentes pendientes | LOC |
|---|---|---:|
| Ingreso y aforo | Historial de visitas (100); respaldo QR (100) | 200 |
| Rutinas | 3 tablas (90); 6 plantillas de datos (60); generar rutina (100), feedback y progresión (80), asignar y activar (40); objetivo y nivel (80); rutina del día en tiempo real con advertencias (180); feedback al salir (80); editor de rutinas (200); asignar rutina (100); ver y elegir rutina (100); lógica de progresión, tiempo real y mensajes (130) | 1.240 |
| Catálogo y máquinas | Ver catálogo con fotos (100); registrar y editar máquina con foto (200); cambiar estado (60 + 20 de SQL); implementos (120); subida de fotos (40) | 540 |
| Préstamos | 2 tablas (60); registrar préstamo y devolución parcial con la regla 9 (160); préstamo con el lector (250); devolución (120); abiertos y TNE pendientes (100); historial (80); lógica (40) | 810 |
| Administración | Habilitar y registrar vigencia (100); ver alumnos (100); configurar parámetros (180); SQL de permisos (40) | 420 |
| Registro corporal | Tabla con RLS (35); registrar medición (80); evolución con IMC y gráfico (150); cálculo del IMC (20) | 285 |
| **Total pendiente** | | **3.495** |

### 1.3 Resultado en LOC, con escenarios (FW-IS 10.2, paso 8)

Lo medido no cambia; los escenarios solo mueven lo pendiente. El alto pesa más porque las estimaciones por
componente suelen quedarse cortas (omisiones, integración y correcciones).

| Escenario | Hipótesis | LOC | KLOC |
|---|---|---:|---:|
| Bajo | Lo pendiente sale un 20 % más chico | 1.855 + 2.796 = 4.651 | 4,65 |
| **Central** | Tamaños unitarios de la tabla | 1.855 + 3.495 = **5.350** | **5,35** |
| Alto | Lo pendiente sale un 50 % más grande | 1.855 + 5.243 = 7.098 | 7,10 |

## Paso 2. Tamaño en PF (semana 6, puntos de función; FW-IS 11.9)

Se repitió el conteo de las 45 funciones de la hoja «Puntos de función» de la planilla contra las matrices de la
clase: cada una tiene su tipo justificado, sus FTR o RET y sus DET, y la complejidad sale de la matriz. El total no
cambia.

| Tipo | Cantidad | Baja | Media | Alta | PF |
|---|---:|---|---|---|---:|
| EI | 22 | 13 × 3 = 39 | 5 × 4 = 20 | 4 × 6 = 24 | 83 |
| EO | 4 | 1 × 4 = 4 | 3 × 5 = 15 | — | 19 |
| EQ | 7 | 7 × 3 = 21 | — | — | 21 |
| ILF | 12 | 12 × 7 = 84 | — | — | 84 |
| EIF | 0 | — | — | — | 0 |
| **Total** | **45** | | | | **207 PF no ajustados** |

Ejemplo de un conteo: **Registrar ingreso con credencial** es una EI con 5 FTR (tarjetas, alumnos, configuración,
visitas y turnos) y 6 DET. En la matriz de EI, 3 o más FTR con 5 a 15 DET da **alta**: 1 × 6 = 6 PF.

Punto discutible, declarado: el **cierre automático a las 3 horas** se contó como EI (3 PF), aunque lo dispara el
sistema y no un usuario. Si el profesor no lo acepta como EI, el total baja a 204 PF y nada de lo que sigue cambia
de forma apreciable.

**Contraste entre las dos medidas:** 5.350 LOC ÷ 207 PF ≈ **26 LOC por PF** (22 a 34 según el escenario). Lo ya
construido da 21 LOC por PF (1.855 ÷ 87). Las dos medidas son coherentes entre sí. El factor genérico de 50 LOC
por PF que usó la versión 0.2 duplica el tamaño real de este stack.

## Paso 3. Esfuerzo con la fórmula inicial (semanas 5 y 6)

```
Esfuerzo (PM) = Tamaño ÷ Productividad
```

La productividad no se calcula para el proyecto nuevo: se toma de datos históricos (semana 6, lámina 56). Hay dos
fuentes.

| Fuente | LOC por persona-mes | PF por persona-mes |
|---|---:|---:|
| A. Referencia de clase | 1.500 a 2.000 (semanas 5 y 6); 1.800 en el taller Aeroground | 10 (semana 6, lámina 56) |
| B. Observada del equipo | 1.855 LOC ÷ 0,658 PM = **2.820** | 87 PF ÷ 0,658 PM = **132** |

El esfuerzo de B sale de 5 integrantes × 10 h por semana × 2 semanas ÷ 152 h por persona-mes = 0,658 PM. Depende
del supuesto de 10 h, y la productividad está inflada por la IA y los servicios administrados.

### 3.1 Por LOC

```
A (clase)     PM = 5.350 ÷ 1.800 = 2,97 PM       (rango: 4.651 ÷ 2.000 = 2,33 a 7.098 ÷ 1.500 = 4,73)
B (observada) PM = 5.350 ÷ 2.820 = 1,90 PM
```

### 3.2 Por PF

```
A (clase)     PM = 207 ÷ 10  = 20,7 PM
B (observada) PM = 207 ÷ 132 = 1,57 PM
```

### 3.3 Por qué A por LOC y A por PF no coinciden (FW-IS 10.2, paso 6)

Las productividades de la clase vienen de proyectos con unas **180 LOC por PF** (1.800 LOC por PM ÷ 10 PF por PM;
la tabla histórica de la lámina 56 de la semana 6 da 150). AforoFit necesita unas **26 LOC por PF**, porque Next.js,
Supabase y RLS hacen con pocas líneas lo que antes requería mucho código. Por eso «10 PF por persona-mes» no es una
productividad comparable para este equipo: la propia clase advierte que la productividad debe venir de proyectos
comparables, con la misma tecnología (semana 6, láminas 13 a 17). La estimación por LOC con productividad de clase
(2,97 PM) es la más defendible de las dos A.

## Paso 4. Duración con la fórmula inicial (semana 6, lámina 10; FW-IS 13.1)

```
Horas-persona = PM × 152 h
Capacidad semanal = 5 integrantes × 10 h = 50 h por semana
Duración mínima aritmética = horas-persona ÷ capacidad semanal
```

| Método | PM | Horas | Semanas con el equipo real |
|---|---:|---:|---:|
| LOC, productividad de clase | 2,97 | 452 | 9,0 |
| LOC, productividad observada | 1,90 | 288 | 5,8 |
| PF, productividad de clase | 20,7 | 3.146 | 62,9 |
| PF, productividad observada | 1,57 | 238 | 4,8 |
| **Disponible** (4 semanas) | **1,32** | **200** | **4,0** |

Es una aproximación aritmética: no considera dependencias ni tareas que no se pueden hacer en paralelo.

## Paso 5. COCOMO 81 básico (semana 7; FW-IS 12)

**Modo orgánico**, justificado por características y no por conveniencia: requisitos levantados en entrevista y
estables, dominio simple, sin integraciones (0 EIF), equipo pequeño, y el lector funciona como un teclado USB (no
hay tiempo real ni hardware crítico). Coeficientes de la semana 7: a = 2,4; b = 1,05; c = 2,5; d = 0,38.

**Con el tamaño en LOC (central, 5,35 KLOC):**

```
Paso 1  KLOC = 5.350 ÷ 1.000                 = 5,35
Paso 2  PM   = a × KLOC^b = 2,4 × 5,35^1,05   = 2,4 × 5,82 ≈ 13,96 persona-mes
Paso 3  D    = c × PM^d   = 2,5 × 13,96^0,38  = 2,5 × 2,72 ≈ 6,81 meses
Paso 4  P    = PM ÷ D     = 13,96 ÷ 6,81      ≈ 2,05 personas en promedio
Costo laboral = 13,96 PM × $2.000.000 (supuesto de la clase) ≈ $27,9 millones
```

**Con el tamaño en PF:** COCOMO necesita KLOC, así que los PF se convierten con un factor declarado
(FW-IS 12.10, «convertir PF a KLOC sin base»):

| Conversión | KLOC | PM | Meses | Personas |
|---|---:|---:|---:|---:|
| 207 PF × 26 LOC por PF (calibrado con el paso 2) | 5,35 | 13,96 | 6,81 | 2,05 |
| 207 PF × 50 LOC por PF (tabla genérica, versión 0.2) | 10,35 | 27,92 | 8,86 | 3,15 |

**Sensibilidad** (FW-IS 12.9, paso 9):

| Escenario | KLOC | PM | Meses | Personas |
|---|---:|---:|---:|---:|
| Bajo | 4,65 | 12,05 | 6,44 | 1,87 |
| **Central** | **5,35** | **13,96** | **6,81** | **2,05** |
| Alto | 7,10 | 18,79 | 7,62 | 2,47 |
| Semiacoplado (solo comparación) | 5,35 | 19,63 | 7,09 | 2,77 |
| Empotrado (solo comparación) | 5,35 | 26,94 | 7,17 | 3,76 |

## Paso 6. Contraste y lectura (FW-IS 10.2, pasos 6 y 9; 12.9, paso 10)

| Método | Esfuerzo (PM) | Veces lo disponible (1,32 PM) |
|---|---:|---:|
| COCOMO orgánico (LOC central) | 13,96 | 10,6 |
| PF con productividad de clase | 20,7 | 15,7 (productividad no comparable, paso 3.3) |
| LOC con productividad de clase | 2,97 | 2,3 |
| LOC con productividad observada | 1,90 | 1,4 |
| PF con productividad observada | 1,57 | 1,2 |

**Lectura:**
- Las dos medidas de tamaño coinciden: unas 5.350 LOC y 207 PF, es decir, unas 26 LOC por PF.
- La versión 0.2 sobrestimaba el tamaño al doble por usar 50 LOC por PF. Con el tamaño medido, COCOMO baja de
  27,9 a unos **14 PM**.
- COCOMO sigue pidiendo unas **10 veces** lo disponible, porque está calibrado con equipos de los años 80 sin IA,
  sin plantillas ni servicios administrados. Se usa para dimensionar, no se promete su fecha.
- Las estimaciones con productividad (de clase en LOC u observada) dan entre **1,6 y 3 PM**. El alcance completo
  queda entre 1,2 y 2,3 veces lo disponible. Por eso no cabe entero y el CR-01 (aprobado) fija qué se entrega en
  esta versión.

## Paso 7. Puerta de salida (FW-IS 9.5 y 12)

- [x] Definido qué se estima y qué queda fuera (paso 0).
- [x] Separados tamaño (pasos 1 y 2), esfuerzo (3 y 5), duración (4 y 5), recursos y costo (5; detalle por rol
  en `estimacion.md` 7, sin cambios).
- [x] Declarados la técnica, la unidad, la fuente y la regla de conteo de cada número.
- [x] Supuestos visibles: tamaños unitarios por componente, 10 h por semana por integrante, 152 h por
  persona-mes y productividades de referencia.
- [x] Escenarios bajo, central y alto, y comparación de modos.
- [x] Cálculo reproducible: cada fórmula está con sus números.
- [ ] Revisión de otro integrante y decisión de si reemplaza a la versión 0.2 en la planilla y en la PPT.
