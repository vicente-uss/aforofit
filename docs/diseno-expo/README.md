# AforoFit · Tres propuestas para la exposición

**Recomendación del diseño: B — Identidad deportiva.** La cifra 20 se lee primero y las veinte marcas convierten el límite operativo en una imagen que se puede explicar con una sola pregunta: «¿Y si llega alguien más?». La captura contesta con un turno real del prototipo. A funciona mejor cuando el evaluador se detiene a leer. C es preferible si la defensa empieza mostrando el lector. La selección corresponde al jefe de proyecto.

| Propuesta | Matriz editable | PDF A0 | Vista previa | Recurso principal |
|---|---|---|---|---|
| A · Precisión editorial | [SVG](A-precision.svg) | [PDF](A-precision.pdf) | [PNG](A-precision.png) | El conteo de la captura se traduce en 17 marcas llenas y tres libres. |
| B · Identidad deportiva | [SVG](B-deporte.svg) | [PDF](B-deporte.pdf) | [PNG](B-deporte.png) | Veinte trazos inclinados recorren el ancho de la sala gráfica. El turno aparece bajo el límite. |
| C · Producto tecnológico | [SVG](C-producto.svg) | [PDF](C-producto.pdf) | [PNG](C-producto.png) | Tres encuadres muestran objeto, confirmación y rutina. Son vistas del prototipo, no fotogramas de una misma sesión. |

## Lectura y fuentes

El encabezado acredita a la Universidad San Sebastián, Taller de Ingeniería de Software y Grupo 6. El pie identifica al docente y a los cinco integrantes según AGENTS.md. Se usó identificación institucional tipográfica al no encontrar un logo USS con autorización explícita. La retícula tiene seis columnas, con márgenes laterales de 34 mm. La banda de evidencia emplea parejas de tres columnas. El azul de acción #2563EB y el azul tinta #101C2C proceden de app/globals.css. El marfil separa el soporte editorial de las interfaces. Nimbus Sans reemplaza a Inter para una exportación reproducible con fuentes incrustadas. Para el futuro tríptico se pueden conservar las marcas, la secuencia del acceso y el pie de evidencia.

| Exigencia de las bases §7 | Dónde se resuelve | Fuente del repositorio |
|---|---|---|
| Problema, objetivo y contexto | Titular, explicación del ingreso y «El punto de partida». Los 80–90 alumnos son una estimación del encargado. | Entrevista del 12/11 y AGENTS.md |
| Método, tecnologías y arquitectura | «Del levantamiento a la prueba» y secuencia de cinco estaciones desde la credencial hasta la pantalla pública. | README, diagramas, requisitos y acta de playback |
| Funciones y evidencia auténtica | Capturas de cada cabecera y «Qué permite el registro». Se toma el estado implementado del 25/11, posterior al plan CR-01. | README, pruebas-ejecutadas y docs/evidencia |
| Resultados y condiciones | «Qué se comprobó». 429 comprobaciones locales del consolidado; registro ≤ 1,2 s como cota superior del video; aforo < 0,1 s desde el resultado del kiosco en la misma máquina. Rutina cerca de 1 s en otra prueba, con ingreso manual y sesión iniciada. | pruebas-ejecutadas, medicion-ca29-2026-11-23 |
| Beneficio, conclusión y límites | La ocupación se obtiene de las visitas abiertas. La banda azul identifica el alcance académico, los datos ficticios, los usuarios alumnos, la ausencia de integración USS y la prueba pendiente de cámara. | AGENTS.md, README y pruebas-ejecutadas |
| Institución, título y autores | Cabecera y créditos. El QR abre la pantalla pública, distinta del QR de respaldo del alumno. | AGENTS.md y bases §7 |

Las secciones 8 y 9 sitúan el pendón junto al prototipo ejecutable, la defensa de los integrantes y la instalación física. La lámina aporta la síntesis y el acceso al aforo; la demostración, la aprobación, la confección y el montaje corresponden a etapas posteriores. La rúbrica docente usa niveles 0–3 y evalúa también esos hitos.

## Material y edición

- A incorpora la pantalla de fidelidad «1280-aforo-casi-lleno» y un detalle de «1280-profesor-historial».
- B muestra la pantalla de fidelidad «1280-aforo-lleno-turno», recortada para destacar el conteo y el llamado.
- C usa la fotografía del lector USB del 24/11, el resultado de ingreso, la rutina móvil con aviso de mantención y el detalle «prestamo-parcial». Las rutas y cajas de recorte en píxeles están en componer.py. Las imágenes están incrustadas en los SVG y conservan su proporción.
- Para mejorar C, fotografiar el mismo lector horizontalmente, con luz lateral de ventana, fondo mate y foco en el indicador y el punto de lectura. Hacer una toma con una mano acercando una tarjeta de prueba cuya cara no muestre datos. Conservar el original sin compresión de mensajería. Para un recorte de 249 mm de ancho, 2.000 píxeles útiles dan unos 204 ppp. La toma actual ofrece unos 75 ppp en el recorte. En C la imagen editable se llama **foto-lector-sustituible**.

Abrir el SVG elegido en Inkscape con Nimbus Sans instalada. Los textos son objetos editables y la foto puede reemplazarse conservando el marco y la proporción. Tras editar el SVG, exportar directamente el PDF y después la vista previa. Si se desea conservar cambios en el generador, editar también la función a(), b(), c() o detail(). Ejecutar componer.py sobrescribe las tres matrices SVG.

Desde esta carpeta, con Python 3, Pillow, ReportLab, fuentes URW Base 35, Inkscape y Poppler instalados:

```bash
python componer.py
for f in *.svg; do
  inkscape "$f" --export-filename="${f%.svg}.pdf"
  pdftoppm -scale-to 1700 -png -singlefile "${f%.svg}.pdf" "${f%.svg}"
done
```

## Auditoría de las propuestas

Evaluación editorial interna de los PDF renderizados. El impacto a distancia se estimó reduciendo las páginas; falta probarlo de pie ante una copia A0. En las tres páginas se verificaron dimensiones de 841 × 1189 mm, incrustación tipográfica y decodificación desde el PDF rasterizado a https://aforofit.vercel.app/aforo. El QR es vectorial, con cuatro módulos de reserva. Se revisaron alineación, cortes, contraste y correspondencia de las imágenes con los originales. Las tres conservan cuerpo de lectura cercano a 30 pt y notas de lectura cercana. Los recortes de interfaz son evidencia visual: los pies y el cuerpo llevan la información indispensable.

| Criterio | Máx. | A | B | C | Observación |
|---|---:|---:|---:|---:|---|
| Identidad y originalidad | 15 | 14 | 15 | 13 | A interpreta la captura; B convierte la capacidad en señalética; C utiliza una secuencia fotográfica más convencional. |
| Impacto a distancia | 15 | 14 | 15 | 13 | El 20 de B domina incluso a escala reducida. En C se necesita acercarse para leer las interfaces. |
| Jerarquía y legibilidad | 15 | 14 | 14 | 13 | A ofrece la lectura más pausada. B y C exigen proximidad para el material secundario. |
| Cumplimiento académico del contenido | 20 | 20 | 20 | 20 | Las tres contienen los bloques de §7. La nota de confección requiere aprobación e instalación. |
| Evidencia y precisión | 15 | 14 | 14 | 15 | A vincula dato y pantalla; B documenta el turno; C muestra las dos interfaces y el lector. |
| Identidad de producto y adaptación | 10 | 9 | 9 | 10 | C conserva la interfaz como protagonista. Los módulos de A y B pueden distribuirse por caras. |
| Preparación técnica | 10 | 8 | 8 | 7 | Formato, fuentes y QR verificados. Faltan prueba física y condiciones de imprenta; C acusa la resolución del material. |
| **Total** | **100** | **93** | **95** | **91** | B alcanza la meta editorial interna. |

Entrega digital en color RGB y a tamaño final. La facultad confirmó A0 vertical. Antes de imprimir, acordar con la imprenta soporte, montaje, sangrado, perfil de color, tolerancias de corte y escala al 100 %. Revisar un recorte a tamaño real con capturas y QR, y verificar el contraste del azul sobre el soporte elegido. La sección 10 de AGENTS.md podrá incorporar las tres propuestas en el seguimiento del pendón; la aprobación por el jefe de proyecto sigue abierta.
