# B4 · Cada entrada cuenta

[Candidata A0](B4.pdf) · [Vista PNG](B4.png) · [SVG editable](B4.svg) · [Comparar B3 y B4](Comparacion-B3-B4.png)

La pregunta «¿Cuántos siguen dentro?» introduce el problema antes de mostrar el producto. Las veinte marcas reproducen el estado que se ve a continuación: diecinueve ocupadas y una libre. La pantalla pública domina el centro. La rutina y la bienvenida del kiosco permiten acercarse a otros dos usos del sistema. La franja azul reúne la evidencia cuantitativa y separa las condiciones de medición de los escenarios visuales.

## Inventario y trazabilidad

Los tres PNG de `originales/` son copias íntegras del [banco visual, versión a2a3756](https://github.com/vicente-uss/aforofit/tree/a2a3756968f31ac5bdcc8b4ca9673c56656812a0/docs/evidencia/final). El banco documenta una compilación local de Next.js de cba147b con Playwright, respuestas controladas y datos ficticios. Cada captura representa un escenario independiente. Las imágenes documentan la interfaz; las conclusiones temporales provienen de la prueba física descrita más abajo.

| Ruta dentro del banco | Recorte en píxeles (izquierda, arriba, derecha, abajo) | Reproducción en mm | ppp efectivos |
|---|---|---|---|
| aforo/turno-llamado-escritorio.png | Original completo, 3840 × 2160 | 480 × 270 | 203,2 |
| alumno/rutina-fotos-movil.png | (0, 800, 1170, 2450), del original 1170 × 2532 | 148 × 208,72 | 200,8 |
| ingreso/entrada-escritorio.png | (1880, 490, 3040, 800), del original 3840 × 2160 | 146 × 39,02 | 201,8 |

Cálculo: ancho en píxeles del recorte × 25,4 / ancho en mm. Poppler confirmó 203, 201 y 202 ppp en ambos ejes. Se conservaron los píxeles del recorte, con compresión sin pérdida. B3 tenía 61,9 ppp en la pantalla principal y 78,8 en el móvil.

| Original | SHA-256 |
|---|---|
| turno-llamado-escritorio.png | 52ffa3e74092dbe4b409680a1e39ddff8b4ef92f28fe4fa2a119f5f5ff3a1efe |
| rutina-fotos-movil.png | dc704109be497e12c476803f29c39d2d7b9a9e70bd6bfcd08e8a5bb1f569d758 |
| entrada-escritorio.png | 5fed93662ba92dd7799f9135a6af8daf66d59464ea2b663d53b0bc47ca555c09 |

El generador extrae directamente LogoMark de components/marca/logo.tsx y traduce los atributos JSX al SVG. El degradado original se conserva dentro del isotipo. Las fuentes Barlow Regular y Barlow Condensed Bold y sus licencias están en iteracion-2/fuentes. La comparación usa el PNG publicado de B3 a la misma escala que B4.

## Auditoría académica y editorial

| Sección 7 de las bases | Evidencia en B4 |
|---|---|
| Proyecto, institución, integrantes | Marca e isotipo, Universidad San Sebastián, sede, asignatura, grupo, año, docente y cinco roles. Reserva limpia para un logo autorizado. |
| Contexto, problema y objetivo | Papel y Excel, ausencia de salidas, 80–90 asistentes estimados, límite operativo informado, registro de visitas y turnos. |
| Metodología, tecnología y arquitectura | Entrevista, prototipo y revisión. Tamaño por FP y LOC; esfuerzo por COCOMO. Cinco etapas desde identificación a aforo en vivo. Next.js, TypeScript, Vercel, Supabase y Realtime. |
| Funciones principales y evidencia | Una captura pública, dos ejercicios fotografiados con cargas y advertencia de mantención, y confirmación del kiosco sin tabla de latencias. Texto sobre feedback, progresión, devoluciones parciales, historial y administración. |
| Resultados, beneficios, limitaciones y conclusión | 198 Vitest + 231 SQL = 429 locales. Entrada ≤ 1,2 s como cota superior; aforo < 0,1 s después del resultado del kiosco en la misma máquina. Video a intervalos de 0,1 s y red doméstica. La conclusión cita la salida observada (de 1 a 0). El acceso público por QR y la validación pendiente de cámara para el QR de ingreso aparecen en lugares distintos. Datos ficticios, alumnos y ausencia de integración USS expresos. |
| Legibilidad y fidelidad | Cifras y cabeceras condensadas, textos secundarios en Barlow Regular. Las veinte marcas, las pantallas y la conclusión tienen estados identificables y verificables. |

[Base académica](../../bases-proyecto-integrador.md) · [Entrevista](../../entrevista-encargado-2026-11-12.md) · [Estimación](../../estimacion.md) · [Resultados consolidados](../../pruebas-ejecutadas.md) · [Medición física](../../medicion-ca29-2026-11-23.md). El banco visual no incrementa el consolidado automatizado.

**Evaluación editorial interna: 95/100.** La auditoría independiente de 90/100 corresponde a B3. La meta superior a 95 queda abierta a evaluación externa y prueba física.

| Criterio | Puntaje | Observación |
|---|---:|---|
| Identidad y originalidad | 15/15 | Marca auténtica y veinte trazos que reproducen el estado de la pantalla principal. |
| Impacto a distancia | 14/15 | Marca, conteo y total de pruebas sobreviven a la reducción. Falta observación ante A0 físico. |
| Jerarquía y legibilidad | 14/15 | El recorrido de cinco pasos y los rótulos se distinguen. Los créditos y las advertencias requieren lectura cercana. |
| Contenido académico | 20/20 | La matriz anterior incluye objetivo, alcance, conclusión verificable y método de estimación. |
| Evidencia y precisión | 15/15 | Tres imágenes trazables, escenarios independientes y condiciones de la medición física diferenciadas. |
| Coherencia con el producto y adaptación | 9/10 | Isotipo y pantallas auténticas; la distribución de contenidos en un formato plegado aún no se ha probado. |
| Calidad técnica de impresión | 8/10 | A0 vectorial, fuentes incrustadas y tres recortes sobre 200 ppp. Restan soporte, prueba de color y escaneo físico. |

Se inspeccionó el PDF renderizado con Poppler antes de publicar. Tiene una página de 841 × 1189 mm. pdffonts confirmó la incrustación de ambas familias. El PNG de revisión tiene 2547 × 3600 píxeles. El QR mide 76 mm, con cuatro módulos blancos de seguridad; ZBar decodificó la página renderizada a https://aforofit.vercel.app/aforo. La revisión visual incluyó ortografía, alineaciones, recortes, márgenes y lectura de ambas cargas. Contraste de luminancia aproximado: tinta sobre marfil 15,7:1, blanco sobre azul 6,84:1 y azul sobre marfil 6,27:1. Se conserva RGB provisional. Coordinar perfil, sangrado, soporte y montaje antes de autorizar impresión.

## Reproducción y sustituciones

Instalar las dos fuentes de iteracion-2/fuentes para que Inkscape exporte con sus métricas correctas. Se necesitan Python 3, Pillow, ReportLab, Inkscape y Poppler. Desde esta carpeta, ejecutar:

```sh
python componer.py
pdffonts B4.pdf
pdfimages -list B4.pdf
```

Editar el texto o los encuadres en componer.py para conservarlos en futuras regeneraciones. El SVG también admite edición directa en Inkscape. Sus imágenes están incrustadas. Para exportar una edición manual sin sobrescribirla, ejecutar inkscape B4.svg -o B4.pdf y volver a renderizar.

**Logo USS.** Colocar un archivo oficial autorizado dentro del objeto invisible reserva-logo-USS (x 737, y 9, 72 × 32 mm). Mantener proporción y área de protección institucional. Si la guía oficial exige más espacio, ajustar la cabecera antes de exportar.

**Lector.** Se omitió la foto disponible. Para incorporar una toma propia, usar el espacio bajo «Cómo se registra una visita», entre x 34–205 e y 721–759 mm. Ajustar la imagen a ese espacio sin deformarla, rotularla como fotografía del lector y conservar el flujo inferior. Para 140 mm de ancho conviene un recorte de al menos 1103 píxeles. Verificar que la tarjeta de prueba carezca de datos personales visibles.

La selección, aprobación y prueba física corresponden al equipo. El trabajo se limita al material de exposición.
