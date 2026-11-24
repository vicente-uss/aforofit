# Estimación del Avance 3 · AforoFit (versión 0.3)

Actualizado: lunes 23 de noviembre de 2026, 22:00. Las cifras y fórmulas están en la planilla
**"AforoFit — Estimación Avance 3"** (hojas Resumen, Puntos de función, Pesos IFPUG, LOC por componentes, COCOMO,
Productividad, Factores propios, Recursos y costos, Costos por rol, Riesgos y Pruebas). Si cambia un supuesto, se
cambia en la planilla y se actualiza este resumen. La PPT del Avance 3 lo presenta en las láminas 5 a 14.

**Resultado:** AforoFit mide **207 puntos de función no ajustados** y **5.350 LOC** (5,35 KLOC), dos medidas
tomadas por separado que coinciden en unas 26 LOC por PF. COCOMO 81 básico orgánico estima **14,0 persona-mes,
6,8 meses y 2,1 personas**, unas **10 veces** el esfuerzo disponible del equipo (1,32 persona-mes). Con la fórmula
inicial (esfuerzo = tamaño ÷ productividad), el esfuerzo queda entre **1,6 y 3,0 persona-mes**: el alcance completo
es entre 1,2 y 2,3 veces lo disponible. El gasto real es de **$18.980** (el lector, comprado por Pau) y el
presupuesto teórico por rol es de **$2.530.265**.

**Qué cambió respecto de la versión 0.2 (19 de noviembre):** antes el tamaño en LOC no se medía, sino que salía de
207 PF × 50 LOC por PF (10,35 KLOC, un factor genérico de tablas de conversión). Ahora las LOC se estiman por
componentes, a partir de lo que el equipo ya construyó, y el factor resulta de 26: el de 50 duplicaba el tamaño.
COCOMO bajó de 27,9 a 14,0 PM. Los PF no cambian.

Referencias: Taller de Ingeniería de Software, Semana 5 (Estimación: tamaño, esfuerzo, duración, recursos y
costo), Semana 6 (Estimación del tamaño con LOC y puntos de función) y Semana 7 (COCOMO: estimación de
esfuerzo); framework de Ingeniería de Software, secciones 9 a 13. Formatos tomados del taller Aeroground
(justificación por función y productividad) y de la Solemne 2 (costos por rol y contingencia).

## 1. Qué se estima (FW-IS 9.3 y 10.2, paso 1)

| | Incluido | Excluido |
|---|---|---|
| Alcance | Requisitos de prioridad alta, RF01 a RF27 (el alcance diseñado completo) | Prioridad media (RF28 a RF31) y trabajo futuro |
| Frontera | App web y base de datos en Supabase; Supabase Auth es parte de la solución | Sistemas de la USS (0 EIF) |
| Código | Lo que programa el equipo | Plantilla `with-supabase`, pruebas y configuración (regla de la sección 2.1) |

- Un mismo proceso usado por dos roles con la misma lógica (por ejemplo, crear una rutina como alumno o como
  profesor) se cuenta una vez.
- La línea base del CR-01 (lo que se entrega en esta versión) es una decisión aparte, en la sección 7: aquí se
  estima el alcance completo.

## 2. Tamaño en LOC por componentes (Semana 6)

**Técnica:** descomposición por componentes (bottom-up) con **analogía interna**. Lo construido se mide en el
repositorio; el tamaño de cada componente pendiente se toma de componentes parecidos que el equipo ya construyó.
Es lo que la clase pide para usar LOC antes de programar: estimar las líneas con proyectos anteriores, analogía y
descomposición (semana 6, lámina 15). El detalle de los 43 componentes está en la hoja **LOC por componentes**.

### 2.1 Regla de conteo (declarada antes de contar)

| Se cuenta | No se cuenta |
|---|---|
| Archivos `.ts`, `.tsx` y `.sql` versionados en `app/`, `components/`, `lib/`, `proxy.ts` y `supabase/sql/` | Líneas vacías y comentarios (`//`, `/* … */`, `--`) |
| Código de la plantilla `with-supabase`, en una columna aparte | Pruebas (`*.test.ts`, `supabase/pruebas/`), configuración (`*.config.*`), CSS, `node_modules` y `.next` |

Se considera plantilla: `app/auth/`, `components/ui/`, `lib/supabase/`, `lib/utils.ts` y los formularios
`login-form`, `forgot-password-form`, `update-password-form` y `logout-button`, aunque el equipo los haya
retocado (criterio conservador). La medición se hizo con un script de Python que aplica esta tabla sobre
`git ls-files`.

Medición del 23 de noviembre: **1.855 LOC del equipo** (1.247 de TypeScript y 608 de SQL). Aparte: 960 LOC de la
plantilla y 253 de pruebas, que no se cuentan.

### 2.2 Lo ya construido (medido)

| Componente medido | LOC | Sirve de referencia para |
|---|---:|---|
| Kiosco `/ingreso` con el lector | 420 | Pantalla con lector |
| Pantalla de aforo en tiempo real | 88 | Pantalla en tiempo real |
| Lista de espera del profesor | 128 | Lista con acciones |
| Paneles por rol, layout y protección de rutas | 270 | — |
| Lógica en `lib/` (aforo, mensajes, UID, roles) | 341 | Archivo de lógica (unos 40) |
| SQL: 9 tablas con RLS, funciones de las reglas, permisos y datos | 608 | Tabla con RLS (unas 30), función de reglas (40 a 100) |
| **Total** | **1.855** | |

### 2.3 Lo pendiente (estimado por componente)

Tamaños unitarios: tabla con RLS 30 · función SQL simple 40, compleja 100 · formulario simple 80 · lista o
consulta 100 · pantalla en tiempo real 180 · editor 200 · pantalla con lector 250 · archivo de lógica 40.

| Módulo | Componentes pendientes | LOC |
|---|---|---:|
| Ingreso y aforo | Historial de visitas (100); respaldo QR (100) | 200 |
| Rutinas | 3 tablas (90); 6 plantillas (60); generar rutina (100), feedback y progresión (80), asignar y activar (40); objetivo y nivel (80); rutina del día en tiempo real (180); feedback al salir (80); editor de rutinas (200); asignar rutina (100); ver y elegir rutina (100); lógica (130) | 1.240 |
| Catálogo y máquinas | Ver catálogo (100); registrar y editar máquina con foto (200); cambiar estado (80); implementos (120); subida de fotos (40) | 540 |
| Préstamos | 2 tablas (60); préstamo y devolución parcial con la regla 9 (160); préstamo con el lector (250); devolución (120); abiertos y TNE pendientes (100); historial (80); lógica (40) | 810 |
| Administración | Habilitar y registrar vigencia (100); ver alumnos (100); configurar parámetros (180); permisos (40) | 420 |
| Registro corporal | Tabla (35); registrar medición (80); evolución con IMC y gráfico (150); cálculo del IMC (20) | 285 |
| **Total pendiente** | | **3.495** |

### 2.4 Resultado y escenarios (FW-IS 10.2, paso 8)

Lo medido no cambia; los escenarios mueven lo pendiente. El alto pesa más porque las estimaciones por componente
suelen quedarse cortas (omisiones, integración y correcciones).

| Escenario | Hipótesis | LOC | KLOC |
|---|---|---:|---:|
| Bajo | Lo pendiente sale un 20 % más chico | 4.651 | 4,65 |
| **Central** | Tamaños unitarios de la tabla | **5.350** | **5,35** |
| Alto | Lo pendiente sale un 50 % más grande | 7.098 | 7,10 |

## 3. Tamaño en puntos de función no ajustados (Semana 6)

**No ajustados** significa que no se aplica el factor de ajuste opcional del estándar IFPUG (las 14
características generales), igual que en la clase. Es tamaño funcional: no son horas, días ni dinero.

Procedimiento (FW-IS 11.9):
1. Identificar las funciones desde los RF.
2. Clasificarlas como EI, EO, EQ, ILF o EIF, con una **justificación por función** (columna K de la hoja
   Puntos de función, formato del taller Aeroground).
3. Contar los FTR (o los RET en los archivos) y los DET.
4. Ubicar la complejidad en la matriz: los DET dan la columna y los FTR o RET dan la fila.
5. Asignar el peso.
6. Sumar: PF = cantidad × peso por tipo y complejidad.

Las matrices son las de la clase (Semana 6):

| Tipo | Filas | Columnas | Pesos (baja / media / alta) |
|---|---|---|---|
| EI | FTR 0–1 / 2 / 3 o más | DET 1–4 / 5–15 / 16 o más | 3 / 4 / 6 |
| EO y EQ | FTR 0–1 / 2–3 / 4 o más | DET 1–5 / 6–19 / 20 o más | EO 4 / 5 / 7 · EQ 3 / 4 / 6 |
| ILF y EIF | RET 1 / 2–5 / 6 o más | DET 1–19 / 20–50 / 51 o más | ILF 7 / 10 / 15 · EIF 5 / 7 / 10 |

El 23 de noviembre se revisaron de nuevo las 45 funciones contra las matrices. El total no cambia:

| Tipo | Cantidad | Baja | Media | Alta | PF |
|---|---:|---|---|---|---:|
| EI | 22 | 13 × 3 = 39 | 5 × 4 = 20 | 4 × 6 = 24 | 83 |
| EO | 4 | 1 × 4 = 4 | 3 × 5 = 15 | — | 19 |
| EQ | 7 | 7 × 3 = 21 | — | — | 21 |
| ILF | 12 | 12 × 7 = 84 | — | — | 84 |
| EIF | 0 | — | — | — | 0 |
| **Total** | **45** | | | | **207** |

Ejemplos resueltos paso a paso:

| Función | Tipo | DET → columna | FTR o RET → fila | Complejidad | PF |
|---|---|---|---|---|---:|
| Registrar ingreso con credencial | EI | 6 → 5–15 | 5 FTR (tarjetas, alumnos, configuración, visitas y turnos) → 3 o más | Alta | 1 × 6 = 6 |
| Aforo en vivo | EO | 6 → 6–19 | 3 FTR → 2–3 | Media | 1 × 5 = 5 |
| Rutinas y ejercicios | ILF | 12 → 1–19 | 2 RET → 2–5 | Baja | 1 × 7 = 7 |

Punto discutible, declarado: el **cierre automático a las 3 horas** se contó como EI (3 PF), aunque lo dispara el
sistema y no un usuario. Si no se acepta como EI, el total baja a 204 PF y nada de lo que sigue cambia de forma
apreciable.

### 3.1 Las dos medidas, lado a lado

| Módulo | PF | LOC (central) | LOC por PF |
|---|---:|---:|---:|
| Ingreso y aforo | 52 | 1.576 | 30 |
| Rutinas | 51 | 1.240 | 24 |
| Catálogo y máquinas | 32 | 658 | 21 |
| Préstamos | 25 | 810 | 32 |
| Acceso y usuarios | 17 | 361 | 21 |
| Administración | 16 | 420 | 26 |
| Registro corporal | 14 | 285 | 20 |
| **Total** | **207** | **5.350** | **26** |

Lo construido da 21 LOC por PF (1.855 ÷ 87) y el total estimado, 26: las dos medidas son coherentes. El factor
genérico de 50 LOC por PF de la versión 0.2 duplicaba el tamaño de este stack, en parte porque las reglas viven
en SQL y Supabase resuelve Auth, RLS y tiempo real sin código propio.

## 4. Esfuerzo con la fórmula inicial (Semanas 5 y 6)

```
Esfuerzo (PM) = Tamaño ÷ Productividad
```

La productividad no se calcula para el proyecto nuevo: se toma de datos históricos (semana 6, lámina 56).

| Fuente | LOC por persona-mes | PF por persona-mes |
|---|---:|---:|
| A. Referencia de clase | 1.500 a 2.000 (semanas 5 y 6); 1.800 en el taller Aeroground | 10 (semana 6, lámina 56) |
| B. Observada del equipo | 1.855 LOC ÷ 0,658 PM = **2.820** | 87 PF ÷ 0,658 PM = **132** |

El esfuerzo de B sale de 5 integrantes × 10 h por semana × 2 semanas ÷ 152 h por persona-mes = 0,658 PM. Depende
del supuesto de 10 h, y la productividad está inflada por la IA y los servicios administrados.

```
Por LOC  A  PM = 5.350 ÷ 1.800 = 2,97 PM      (rango 4.651 ÷ 2.000 = 2,33 a 7.098 ÷ 1.500 = 4,73)
         B  PM = 5.350 ÷ 2.820 = 1,90 PM
Por PF   A  PM =   207 ÷ 10    = 20,7 PM
         B  PM =   207 ÷ 132   = 1,57 PM
```

**Por qué A por LOC y A por PF no coinciden** (FW-IS 10.2, paso 6): las productividades de la clase vienen de
proyectos con unas **180 LOC por PF** (1.800 ÷ 10; la tabla histórica de la lámina 56 da 150). AforoFit necesita
unas **26**. Por eso «10 PF por persona-mes» no es comparable para este equipo: la clase advierte que la
productividad debe venir de proyectos comparables, con la misma tecnología (semana 6, láminas 13 a 17). La de
LOC con productividad de clase (2,97 PM) es la más defendible de las dos.

### 4.1 Duración con la fórmula inicial (Semana 6, lámina 10; FW-IS 13.1)

```
Horas-persona = PM × 152 h · Capacidad = 5 integrantes × 10 h = 50 h por semana
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

## 5. Esfuerzo, duración y dotación: COCOMO 81 básico (Semana 7)

COCOMO (Constructive Cost Model) lo publicó Barry Boehm en 1981 y transforma tamaño en esfuerzo, duración y
dotación. El modelo básico solo usa el tamaño y el modo.

| Modo | a | b | c | d | ¿Aplica? |
|---|---:|---:|---:|---:|---|
| **Orgánico** | 2,4 | 1,05 | 2,5 | 0,38 | **Sí**: requisitos estables levantados en entrevista, dominio simple, sin integraciones (0 EIF) y equipo pequeño |
| Semiacoplado | 3,0 | 1,12 | 2,5 | 0,35 | No: supone integraciones o requisitos rígidos (solo comparación) |
| Empotrado | 3,6 | 1,20 | 2,5 | 0,32 | No: supone tiempo real o hardware crítico; el lector funciona como teclado USB |

El modo se elige por las características del proyecto, no por el que da menos esfuerzo.

```
Paso 1  KLOC     = 5.350 ÷ 1.000                 = 5,35
Paso 2  Esfuerzo PM = a × KLOC^b = 2,4 × 5,35^1,05  = 2,4 × 5,82 ≈ 14,0 persona-mes
Paso 3  Duración D  = c × PM^d   = 2,5 × 13,96^0,38 = 2,5 × 2,72 ≈ 6,8 meses
Paso 4  Dotación P  = PM ÷ D     = 13,96 ÷ 6,81     ≈ 2,1 personas en promedio
        Costo       = PM × $2.000.000               ≈ $27,9 millones (supuesto de la clase; solo mano de obra)
```

**Con el tamaño en PF:** COCOMO necesita KLOC, así que los PF se convierten con un factor declarado (FW-IS
12.10). Con el factor calibrado de la sección 3.1 (207 × 26) se llega a los mismos 5,35 KLOC. Con el factor
genérico de la versión 0.2 (207 × 50 = 10,35 KLOC) daría 27,9 PM, 8,9 meses y 3,2 personas.

| Escenario (sensibilidad) | KLOC | PM | Meses | Personas |
|---|---:|---:|---:|---:|
| Tamaño bajo | 4,65 | 12,1 | 6,4 | 1,9 |
| **Base orgánico** | **5,35** | **14,0** | **6,8** | **2,1** |
| Tamaño alto | 7,10 | 18,8 | 7,6 | 2,5 |
| Versión 0.2 (207 PF × 50 LOC por PF) | 10,35 | 27,9 | 8,9 | 3,2 |
| Semiacoplado (solo comparación) | 5,35 | 19,6 | 7,1 | 2,8 |
| Empotrado (solo comparación) | 5,35 | 26,9 | 7,2 | 3,8 |

## 6. Contraste con la realidad del equipo y factores propios

- **Esfuerzo disponible:** 5 integrantes × 10 h por semana **cada uno** (unas 4 de clase y 6 de trabajo propio)
  × 4 semanas ÷ 152 h por persona-mes = **1,32 PM**.

| Método | Esfuerzo (PM) | Veces lo disponible |
|---|---:|---:|
| COCOMO orgánico | 14,0 | 10,6 |
| PF con productividad de clase | 20,7 | 15,7 (productividad no comparable, sección 4) |
| LOC con productividad de clase | 2,97 | 2,3 |
| LOC con productividad observada | 1,90 | 1,4 |
| PF con productividad observada | 1,57 | 1,2 |

- **Factores propios del proyecto** (hoja Factores propios de la planilla):
  - ↓ IA revisada por el equipo, que COCOMO no considera.
  - ↓ Plantilla oficial y servicios administrados (Supabase Auth, RLS y Realtime, sin servidor propio).
  - ↓ Alcance acotado a la prioridad alta y sin integraciones (0 EIF).
  - ↑ Experiencia dispar del equipo y dedicación parcial (10 h por integrante a la semana).
- **Lectura:** COCOMO está calibrado con proyectos profesionales de los años 80, sin IA, sin plantillas ni
  servicios administrados, y para un producto final documentado y probado. Por eso **no se promete la fecha de
  COCOMO**: se usa para dimensionar el trabajo. Las estimaciones por productividad dicen que el alcance completo
  es entre 1,2 y 2,3 veces lo disponible: no cabe entero, y por eso el CR-01 fija qué se entrega en esta versión.

## 7. Reestimación de la última semana y línea base (CR-01, aprobado)

Reestimación bottom-up (FW-IS 13.5) con el ritmo observado del equipo: 87 PF en unas 100 h, es decir, **unas
1,15 h por PF**. Para la última semana hay 5 × 10 h = 50 h, menos unas 15 h de afiche, pruebas, ensayo y
documentación: **unas 35 h**, que alcanzan para **unos 30 PF**. Faltan unos 120 PF, así que en la última semana la
brecha es de unas **4 veces**.

El equipo aprobó el [CR-01](cr-01-linea-base-entrega-final.md) el 23 de noviembre:

| Parte | PF | Horas estimadas |
|---|---:|---:|
| Ya implementado (ingreso, aforo, lista de espera, roles y catálogo por SQL) | 87 | — |
| Se construye esta semana (B1 a B5: objetivo y nivel, plantillas y generador, rutina en el celular con aviso de mantención, feedback y progresión, estado de máquina) | 26 | 30 |
| Opcional si la base está lista el viernes 27 (S1 préstamo básico, S2 habilitación) | 13 | 15 |
| Próxima versión (rutinas del profesor y del alumno, préstamos completos, registro corporal, pantallas de administración) | 81 | — |
| **Total de la prioridad alta** | **207** | |

Los 207 PF y las 5.350 LOC siguen siendo el tamaño del alcance diseñado. Lo que cambia es cuánto de ese alcance
se entrega en esta versión.

## 8. Recursos y costos (Semana 5)

| Categoría | Recursos | Costo |
|---|---|---:|
| Humanos | Vicente (jefe de proyecto), Benjamín (frontend y prototipo), Isidora (backend y base de datos), Pau (ingreso y hardware), Bastián (administración, QA y afiche) | Teórico: $2.240.185 (detalle por rol abajo); no se paga |
| Software y servicios | Vercel Hobby, Supabase, GitHub y Figma Make (plan estudiante, 3.000 créditos de IA) | $0 |
| Inteligencia artificial | Claude Pro (US$20 al mes) de dos integrantes que ya lo tenían, no comprado para el proyecto; Gemini Pro con cuenta de estudiante | $0 para el proyecto |
| Infraestructura | Lector USB de 13,56 MHz MF1 S50 ($14.990) + envío ($3.990); computador All-in-One del gimnasio (existente) | $18.980 |
| Otros | Impresión del afiche (la imprime la universidad) | $0 |

El lector lo compró **Pau**: $18.980 con envío, **unos $3.800 por integrante** ($3.796).

### Costos por rol (formato de la Solemne 2)

Costo = costo mensual × meses × dedicación × cantidad. Meses: 4 semanas ÷ 4,33 = 0,92. Dedicación: 10 h de
40 h semanales = 25 %. Costos mensuales y contingencia del 12 % tomados del ejercicio Aquaprocesos.

| Rol | Integrantes | Costo mensual | Meses | Dedicación | Cantidad | Costo total |
|---|---|---:|---:|---:|---:|---:|
| Jefe de proyecto | Vicente | $2.200.000 | 0,92 | 25 % | 1 | $508.083 |
| Desarrollador | Benjamín, Isidora y Pau | $2.000.000 | 0,92 | 25 % | 3 | $1.385.681 |
| Tester / QA | Bastián | $1.500.000 | 0,92 | 25 % | 1 | $346.420 |
| **Total del equipo** | | | | | **5** | **$2.240.185** |

| Presupuesto teórico | Monto |
|---|---:|
| Costo del equipo | $2.240.185 |
| Costos adicionales (lector) | $18.980 |
| Contingencia (12 %) | $271.100 |
| **Total** | **$2.530.265** |

Es un valor teórico: el equipo no cobra. COCOMO valoriza el mismo producto en unos $27,9 millones porque supone
un equipo profesional tradicional a tiempo completo.

## 9. Riesgos principales

Son 16 en la hoja Riesgos de la planilla. Exposición = probabilidad × impacto, cada uno de 1 a 3.
R01 (el lector falla con la TNE), R02 y R03 quedaron cerrados.

| ID | Riesgo | Exposición | Mitigación | Responsable |
|---|---|---:|---|---|
| R08 | El núcleo no queda terminado antes del congelamiento | 9 | Solo prioridad alta; línea base del CR-01; revisión cada martes | Vicente |
| R04 | Realtime falla durante la demo | 6 | Recarga cada 15 s como respaldo; aforo visible también en el panel del profesor | Isidora |
| R05 | Internet inestable en la expo | 6 | Compartir internet desde un celular; videos de respaldo | Vicente |
| R06 | Reglas de negocio mal implementadas | 6 | Validarlas en `registrar_ingreso`; 42 pruebas SQL en verde | Isidora |
| R10 | Poca disponibilidad del equipo por cierre de semestre | 6 | Responsable y respaldo por tarea; recortar la prioridad media | Vicente |

## 10. Supuestos a confirmar

- Horas por semana por integrante (10) y semanas de desarrollo (4, del 10 de noviembre al 3 de diciembre). Las
  horas cambian el esfuerzo disponible y la productividad observada, no el tamaño ni COCOMO.
- Los tamaños unitarios por componente de la sección 2.3 (el mayor supuesto de la medición en LOC). Se revisan
  cuando se construyan las rutinas: si salen más grandes, se pasa al escenario alto.
- El conteo de DET y FTR. Agrupar distinto los ILF mueve el total en unos ±15–20 PF. Si una función se
  reclasifica, se cambia en la planilla y todo se recalcula.

## 11. Puerta de salida (FW-IS 9.5 y 12)

- [x] Definido qué se estima y qué queda fuera (sección 1).
- [x] Separados tamaño (secciones 2 y 3), esfuerzo (4 y 5), duración (4.1 y 5), recursos y costo (8).
- [x] Declarados la técnica, la unidad, la fuente y la regla de conteo de cada número.
- [x] Supuestos visibles (sección 10) y escenarios bajo, central y alto, con comparación de modos.
- [x] Cálculo reproducible: cada fórmula está con sus números, y la planilla los recalcula.
- [ ] Revisión de otro integrante.
