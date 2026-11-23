# Estimación del Avance 3 · AforoFit

Actualizado: viernes 20 de noviembre de 2026. Las cifras y fórmulas están en la planilla
**"AforoFit — Estimación Avance 3"** (hojas Resumen, Puntos de función, Pesos IFPUG, COCOMO,
Recursos y costos, y Riesgos). Si cambia un supuesto, se cambia en la planilla y se actualiza este resumen.

**Resultado:** AforoFit mide **207 puntos de función no ajustados** (10,35 KLOC). COCOMO 81 básico
orgánico estima **27,9 persona-mes, 8,9 meses y 3,2 personas**, unas 26 veces el esfuerzo disponible del
equipo. El gasto real es de **$18.980** (el lector, comprado por Pau).

## 1. Alcance contado

- Solo los requisitos de **prioridad alta** (RF01–RF27). La prioridad media (RF28–RF31) y el trabajo futuro
  quedan fuera.
- Frontera del sistema: la app web y su base de datos en Supabase. **0 EIF**: no se leen datos de sistemas de
  la USS (fuera del alcance). Supabase Auth se considera parte de la solución.
- Un mismo proceso usado por dos roles con la misma lógica (por ejemplo, crear rutina para el alumno o el
  profesor) se cuenta una vez.

## 2. Tamaño: puntos de función no ajustados (semana 6)

Procedimiento:
1. Identificar las funciones desde los RF.
2. Clasificarlas como EI, EO, EQ, ILF o EIF.
3. Contar los FTR (o los RET) y los DET.
4. Ubicar la complejidad en la matriz.
5. Asignar el peso.
6. Sumar.

En la planilla, la complejidad y el peso se calculan con fórmulas a partir de las matrices de la clase.

Pesos (baja / media / alta): EI 3·4·6 · EO 4·5·7 · EQ 3·4·6 · ILF 7·10·15 · EIF 5·7·10.

| Tipo | Funciones | PF |
|---|---:|---:|
| EI (entradas externas) | 22 | 83 |
| EO (salidas externas) | 4 | 19 |
| EQ (consultas externas) | 7 | 21 |
| ILF (archivos lógicos internos) | 12 | 84 |
| EIF (archivos de interfaz externa) | 0 | 0 |
| **Total** | **45** | **207** |

Ejemplo resuelto:
- *Registrar ingreso con credencial* es una EI con 5 FTR (tarjetas, alumnos, configuración, visitas y turnos)
  y 6 DET.
- La matriz la ubica en complejidad alta, así que vale **6 PF**.

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

- **Supuesto:** unas 50 LOC por punto de función, el promedio aproximado para JavaScript y TypeScript en
  tablas de conversión. 207 × 50 = **10.350 LOC = 10,35 KLOC**.
- **Analogía con el repositorio** (medido el 19 de noviembre, contando líneas no vacías y sin comentarios en
  `app`, `components`, `lib` y `proxy.ts`):
  - El repo tiene 1.671 LOC.
  - Lo terminado suma 24 PF: perfiles, máquinas, implementos e inicio de sesión.
  - Eso da unas **70 LOC por PF**.
  - El valor sobreestima, porque esas LOC incluyen la plantilla `with-supabase` y la pantalla `/ingreso`
    parcial, que no suman PF terminados.

## 4. Esfuerzo, duración y dotación: COCOMO 81 básico (semana 7)

**Modo orgánico** (a = 2,4; b = 1,05; c = 2,5; d = 0,38): el equipo es pequeño, los requisitos son conocidos
y estables, y no hay restricciones fuertes de hardware ni tiempo real (el lector funciona como teclado USB).

```
Esfuerzo  PM = 2,4 × 10,35^1,05 = 27,9 persona-mes
Duración  D  = 2,5 × 27,9^0,38  = 8,9 meses
Dotación     = 27,9 / 8,9       = 3,2 personas
Costo        = 27,9 × $2.000.000 = $55,8 millones (supuesto de la clase; sin licencias ni contingencia)
```

| Escenario (sensibilidad) | KLOC | PM | Meses | Personas |
|---|---:|---:|---:|---:|
| Base orgánico | 10,4 | 27,9 | 8,9 | 3,2 |
| Tamaño +25% | 12,9 | 35,3 | 9,7 | 3,6 |
| Tamaño −25% | 7,8 | 20,6 | 7,9 | 2,6 |
| Factor observado en el repo (~70 LOC/PF) | 14,4 | 39,5 | 10,1 | 3,9 |
| Semiacoplado (solo comparación) | 10,4 | 41,1 | 9,2 | 4,5 |

## 5. Contraste con la realidad del equipo

- **Esfuerzo disponible:** 5 integrantes × 4 semanas × 8 h por semana (supuesto a confirmar) / 152 h por
  persona-mes = **1,1 PM**.
- COCOMO pide unas **26 veces más**. La productividad requerida sería de unos 197 PF por persona-mes.
- **Lectura:** COCOMO está calibrado con proyectos profesionales de los años 80, sin IA, sin plantillas ni
  servicios administrados, y para un producto final documentado y probado. AforoFit es un prototipo y cubre
  esa diferencia con cuatro cosas:
  - alcance acotado a la prioridad alta;
  - la plantilla oficial;
  - Supabase (Auth, RLS y Realtime sin servidor propio);
  - IA revisada por el equipo.

  Por eso **no se promete la fecha de COCOMO**: se usa para dimensionar el trabajo y decidir el orden.
  Primero va ingreso y aforo, el módulo más grande y el del flujo central.

## 6. Recursos y costos (semanas 5 y 7)

| Categoría | Recursos | Costo |
|---|---|---:|
| Humanos | Vicente (jefe de proyecto), Benjamín (frontend y prototipo), Isidora (backend y base de datos), Pau (ingreso y hardware), Bastián (administración, QA y afiche) | Teórico: $1.847.575 (costo mensual × meses × dedicación); no se paga |
| Software y servicios | Vercel Hobby, Supabase, GitHub y Figma Make (plan estudiante, 3.000 créditos de IA) | $0 |
| Inteligencia artificial | Claude Pro (US$20 al mes) de dos integrantes que ya lo tenían, no comprado para el proyecto; Gemini Pro con cuenta de estudiante | $0 para el proyecto |
| Infraestructura | Lector USB de 13,56 MHz MF1 S50 ($14.990) + envío ($3.990); computador All-in-One del gimnasio (existente) | $18.980 |
| Otros | Impresión del afiche (la imprime la universidad) | $0 |

El lector lo compró **Pau**: $18.980 con envío, **unos $3.800 por integrante** ($3.796).

## 7. Riesgos principales

Son 16 en la hoja Riesgos de la planilla. Exposición = probabilidad × impacto, cada uno de 1 a 3.

| ID | Riesgo | Exposición | Mitigación | Responsable |
|---|---|---:|---|---|
| R08 | El núcleo no queda terminado antes del congelamiento | 9 | Solo prioridad alta; avanzar por módulo según los PF; revisión cada martes | Vicente |
| R01 | El lector falla con la TNE (recibido el 20 de noviembre; exposición baja a 3) | 3 | Probarlo con TNE y TUI; respaldo: ingreso manual del UID y QR | Pau |
| R04 | Realtime falla durante la demo | 6 | Recarga periódica como respaldo; aforo visible también en el panel del profesor | Isidora |
| R05 | Internet inestable en la expo | 6 | Compartir internet desde un celular; datos de demo precargados | Vicente |
| R06 | Reglas de negocio mal implementadas | 6 | Validarlas en `registrar_ingreso`; un caso de prueba por regla | Isidora |
| R10 | Poca disponibilidad del equipo por cierre de semestre | 6 | Responsable y respaldo por tarea; recortar la prioridad media | Vicente |

## 8. Supuestos a confirmar

- Horas por semana por integrante (8) y semanas de desarrollo (4, del 10 de noviembre al 3 de diciembre).
- Factor de 50 LOC por punto de función.
- La analogía con el repo (sección 3) usa la medición del 19 de noviembre; con lo construido al 23 de noviembre
  (unos 87 PF) el factor observado cambia y hay que recalcularlo.
- El conteo de DET y FTR. Si una función se reclasifica, se cambia en la planilla y todo se recalcula.
