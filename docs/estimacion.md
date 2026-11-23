# Estimación del Avance 3 · AforoFit

Actualizado: lunes 23 de noviembre de 2026. Las cifras y fórmulas están en la planilla
**"AforoFit — Estimación Avance 3"** (hojas Resumen, Puntos de función, Pesos IFPUG, COCOMO, Productividad,
Factores propios, Recursos y costos, Costos por rol, Riesgos y Pruebas). Si cambia un supuesto, se cambia en la
planilla y se actualiza este resumen. La PPT del Avance 3 lo presenta en las láminas 5 a 14.

**Resultado:** AforoFit mide **207 puntos de función no ajustados** (10,35 KLOC). COCOMO 81 básico
orgánico estima **27,9 persona-mes, 8,9 meses y 3,2 personas**, unas **21 veces** el esfuerzo disponible del
equipo (1,3 persona-mes). Por productividad, un equipo con la productividad de clase necesitaría entre 5,8 y
20,7 persona-mes; con la productividad observada del equipo, entre 1,6 y 2,5. El gasto real es de **$18.980**
(el lector, comprado por Pau) y el presupuesto teórico por rol es de **$2.530.265**.

Referencias: Taller de Ingeniería de Software, Semana 5 (Estimación: tamaño, esfuerzo, duración, recursos y
costo), Semana 6 (Estimación del tamaño con LOC y puntos de función) y Semana 7 (COCOMO: estimación de
esfuerzo). Formatos tomados del taller Aeroground (justificación por función y productividad) y de la Solemne 2
(costos por rol y contingencia).

## 1. Alcance contado

- Solo los requisitos de **prioridad alta** (RF01–RF27). La prioridad media (RF28–RF31) y el trabajo futuro
  quedan fuera.
- Frontera del sistema: la app web y su base de datos en Supabase. **0 EIF**: no se leen datos de sistemas de
  la USS (fuera del alcance). Supabase Auth se considera parte de la solución.
- Un mismo proceso usado por dos roles con la misma lógica (por ejemplo, crear rutina para el alumno o el
  profesor) se cuenta una vez.

## 2. Tamaño: puntos de función no ajustados (Semana 6)

**No ajustados** significa que no se aplica el factor de ajuste opcional del estándar IFPUG (las 14
características generales), igual que en la clase. Es tamaño funcional: no son horas, días ni dinero.

Procedimiento:
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

Cálculo total (formato de la lámina "Primer cálculo de puntos de función"):

| Tipo | Cantidad | Complejidad | Peso | Resultado |
|---|---:|---|---:|---:|
| EI | 13 | Baja | 3 | 39 |
| EI | 5 | Media | 4 | 20 |
| EI | 4 | Alta | 6 | 24 |
| EO | 1 | Baja | 4 | 4 |
| EO | 3 | Media | 5 | 15 |
| EQ | 7 | Baja | 3 | 21 |
| ILF | 12 | Baja | 7 | 84 |
| EIF | 0 | — | 5 | 0 |
| **Total** | **45** | | | **207** |

Ejemplos resueltos paso a paso:

| Función | Tipo | DET → columna | FTR o RET → fila | Complejidad | PF |
|---|---|---|---|---|---:|
| Registrar ingreso con credencial | EI | 6 → 5–15 | 5 FTR (tarjetas, alumnos, configuración, visitas y turnos) → 3 o más | Alta | 1 × 6 = 6 |
| Aforo en vivo | EO | 6 → 6–19 | 3 FTR → 2–3 | Media | 1 × 5 = 5 |
| Rutinas y ejercicios | ILF | 12 → 1–19 | 2 RET → 2–5 | Baja | 1 × 7 = 7 |

Descomposición por módulo (bottom-up):

| Módulo | PF | LOC estimadas |
|---|---:|---:|
| Ingreso y aforo | 52 | 2.600 |
| Rutinas | 51 | 2.550 |
| Catálogo y máquinas | 32 | 1.600 |
| Préstamos | 25 | 1.250 |
| Acceso y usuarios | 17 | 850 |
| Administración | 16 | 800 |
| Registro corporal | 14 | 700 |

## 3. De puntos de función a LOC

- **KLOC** = miles de líneas de código (10.350 LOC = 10,35 KLOC). COCOMO recibe el tamaño en KLOC.
- **Supuesto:** unas 50 LOC por punto de función, el promedio aproximado para JavaScript y TypeScript en
  tablas de conversión. 207 × 50 = **10.350 LOC = 10,35 KLOC**. Se mantiene como supuesto; las mediciones del
  repositorio son solo un contraste.
- **Contraste con lo construido** (líneas no vacías y sin comentarios en `app`, `components`, `lib`, `proxy.ts`
  y `supabase/sql`, sin pruebas):

  | Fecha | LOC | PF terminados | LOC por PF |
  |---|---:|---:|---:|
  | 19 de noviembre | 1.671 | 24 | ≈ 70 |
  | 23 de noviembre | 2.776 (2.168 TypeScript y 608 SQL) | 87 | ≈ 32 |

  Ambas mediciones incluyen el código base de la plantilla oficial `with-supabase` (inicio de sesión, registro,
  recuperación de clave y componentes de interfaz). Partimos de esa plantilla como base, igual que se parte de un
  framework; los roles, los paneles, el kiosco, la normalización del UID, el catálogo, la base de datos del flujo
  y toda la lógica de AforoFit los programó el equipo. El valor de 50 queda entre ambas mediciones.

## 4. Esfuerzo, duración y dotación: COCOMO 81 básico (Semana 7)

COCOMO (Constructive Cost Model) lo publicó Barry Boehm en 1981 y transforma tamaño en esfuerzo, duración y
dotación. El modelo básico solo usa el tamaño y el modo.

| Modo | a | b | c | d | ¿Aplica? |
|---|---:|---:|---:|---:|---|
| **Orgánico** | 2,4 | 1,05 | 2,5 | 0,38 | **Sí**: requisitos estables levantados en entrevista, dominio simple, sin integraciones (0 EIF) y equipo pequeño |
| Semiacoplado | 3,0 | 1,12 | 2,5 | 0,35 | No: supone integraciones o requisitos rígidos (solo comparación) |
| Empotrado | 3,6 | 1,20 | 2,5 | 0,32 | No: supone tiempo real o hardware crítico; el lector funciona como teclado USB |

El modo se elige por las características del proyecto, no por el que da menos esfuerzo.

```
Paso 1  Esfuerzo  PM = a × KLOC^b  = 2,4 × 10,35^1,05 = 2,4 × 11,63 ≈ 27,9 persona-mes
Paso 2  Duración  D  = c × PM^d    = 2,5 × 27,9^0,38  = 2,5 × 3,54  ≈ 8,9 meses
Paso 3  Dotación  P  = PM ÷ D      = 27,9 ÷ 8,9       ≈ 3,2 personas en promedio
        Costo        = PM × $2.000.000                ≈ $55,8 millones (supuesto de la clase; solo mano de obra)
```

| Escenario (sensibilidad) | KLOC | PM | Meses | Personas |
|---|---:|---:|---:|---:|
| Base orgánico | 10,35 | 27,9 | 8,9 | 3,2 |
| Tamaño +25 % | 12,9 | 35,3 | 9,7 | 3,6 |
| Tamaño −25 % | 7,8 | 20,6 | 7,9 | 2,6 |
| Factor observado al 23 de noviembre (≈ 32 LOC/PF) | 6,6 | 17,4 | 7,4 | 2,4 |
| Semiacoplado (solo comparación) | 10,35 | 41,1 | 9,2 | 4,5 |
| Empotrado (solo comparación) | 10,35 | 59,5 | 9,2 | 6,4 |

## 5. Segundo método: esfuerzo por productividad (Semanas 5 y 6)

Esfuerzo = tamaño ÷ productividad. La productividad no se calcula: se toma de datos históricos.

| Método | Productividad | Esfuerzo para AforoFit |
|---|---|---:|
| A · PF con productividad de clase (taller Aeroground) | 10 PF por persona-mes | 207 ÷ 10 = **20,7 PM** |
| A · LOC con productividad de clase (taller Aeroground) | 1.800 LOC por persona-mes | 10.350 ÷ 1.800 = **5,75 PM** |
| B · PF con productividad observada del equipo | ≈ 132 PF por persona-mes | 207 ÷ 132 ≈ **1,57 PM** |
| B · LOC con productividad observada del equipo | ≈ 4.220 LOC por persona-mes | 10.350 ÷ 4.220 ≈ **2,45 PM** |

Productividad observada (B): 87 PF y 2.776 LOC construidos en 2 semanas por 5 integrantes a 10 h por semana =
5 × 10 × 2 ÷ 152 = 0,658 persona-mes. Está inflada por la IA y la plantilla, y depende de las horas supuestas.

Los dos métodos tradicionales (COCOMO y la productividad de clase) coinciden en el orden de magnitud; la
productividad observada explica por qué el equipo sí alcanza a construir el núcleo.

## 6. Contraste con la realidad del equipo y factores propios

- **Esfuerzo disponible:** 5 integrantes × 10 h por semana **cada uno** (unas 4 de clase y 6 de trabajo propio)
  × 4 semanas ÷ 152 h por persona-mes = **1,32 PM**.
- COCOMO pide unas **21 veces más** (27,9 ÷ 1,32). La productividad requerida sería de unos 157 PF por
  persona-mes.
- **Factores propios del proyecto** (hoja Factores propios de la planilla):
  - ↓ IA revisada por el equipo, que COCOMO no considera.
  - ↓ Plantilla oficial y servicios administrados (Supabase Auth, RLS y Realtime, sin servidor propio).
  - ↓ Alcance acotado a la prioridad alta y sin integraciones (0 EIF).
  - ↑ Experiencia dispar del equipo y dedicación parcial (10 h por integrante a la semana).
- **Lectura:** COCOMO está calibrado con proyectos profesionales de los años 80, sin IA, sin plantillas ni
  servicios administrados, y para un producto final documentado y probado. Por eso **no se promete la fecha de
  COCOMO**: se usa para dimensionar el trabajo y decidir el orden. Primero va ingreso y aforo, el módulo más
  grande y el del flujo central.

## 7. Recursos y costos (Semana 5)

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

Es un valor teórico: el equipo no cobra. COCOMO valoriza el mismo producto en $55,8 millones porque supone un
equipo profesional tradicional a tiempo completo.

## 8. Riesgos principales

Son 16 en la hoja Riesgos de la planilla. Exposición = probabilidad × impacto, cada uno de 1 a 3.
R01 (el lector falla con la TNE), R02 y R03 quedaron cerrados.

| ID | Riesgo | Exposición | Mitigación | Responsable |
|---|---|---:|---|---|
| R08 | El núcleo no queda terminado antes del congelamiento | 9 | Solo prioridad alta; avanzar por módulo según los PF; revisión cada martes | Vicente |
| R04 | Realtime falla durante la demo | 6 | Recarga cada 15 s como respaldo; aforo visible también en el panel del profesor | Isidora |
| R05 | Internet inestable en la expo | 6 | Compartir internet desde un celular; videos de respaldo | Vicente |
| R06 | Reglas de negocio mal implementadas | 6 | Validarlas en `registrar_ingreso`; 42 pruebas SQL en verde | Isidora |
| R10 | Poca disponibilidad del equipo por cierre de semestre | 6 | Responsable y respaldo por tarea; recortar la prioridad media | Vicente |

## 9. Supuestos a confirmar

- Horas por semana por integrante (10) y semanas de desarrollo (4, del 10 de noviembre al 3 de diciembre). Las
  horas solo cambian el esfuerzo disponible y la productividad observada, no el tamaño ni COCOMO.
- Factor de 50 LOC por punto de función (el mayor riesgo de la estimación: las mediciones van de 32 a 70).
- El conteo de DET y FTR. Agrupar distinto los ILF mueve el total en unos ±15–20 PF. Si una función se
  reclasifica, se cambia en la planilla y todo se recalcula.
