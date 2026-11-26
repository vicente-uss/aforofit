# AforoFit · Trípticos para la exposición

La indicación docente del 24 de noviembre solicita 20 ejemplares a color en la facultad. El equipo selecciona una propuesta antes del tiraje. El diseño parte de B4.1 (54da5e4), con 95/100 en auditoría editorial independiente. Esa evaluación corresponde al afiche.

| Propuesta | PDF de dos caras | Exterior e interior | Editables | Plegado |
|---|---|---|---|---|
| T1 · Presentación editorial del producto | [T1.pdf](T1/T1.pdf) | [Exterior](T1/exterior.png) · [Interior](T1/interior.png) | [Exterior](T1/exterior.svg) · [Interior](T1/interior.svg) | [Cerrado y primera apertura](T1/plegado.png) |
| T2 · Experiencia del visitante | [T2.pdf](T2/T2.pdf) | [Exterior](T2/exterior.png) · [Interior](T2/interior.png) | [Exterior](T2/exterior.svg) · [Interior](T2/interior.svg) | [Cerrado y primera apertura](T2/plegado.png) |

**Selección sugerida: T2.** La cubierta identifica el producto y las preguntas de la solapa conducen a tres momentos: llegar, esperar y entrenar. La progresión de 40 a 42,5 kg aporta una segunda razón para conservar el folleto después de ver el afiche. T1 facilita una exposición más técnica: las tres funciones se pueden presentar en cualquier orden y el aviso de mantención queda visible junto al ejercicio.

## Preparación e impresión

1. Confirmar con la facultad papel, gramaje, tolerancia de plegado, tamaño abierto, sangrado, perfil de color y sentido de volteo de su máquina. Las medidas siguientes son provisionales.
2. El PDF contiene exterior primero e interior después. El corte es A4 horizontal de 297 × 210 mm. MediaBox y BleedBox miden 303 × 216 mm; TrimBox delimita el corte a 3 mm de los bordes. Imprimir a tamaño real sobre un pliego que admita el sangrado, con imposición de imprenta. Si el equipo solo admite A4, acordar con la facultad cómo trabajar el borde.
3. Doble cara, cabeceras arriba, volteo por el borde corto del A4 apaisado. Hacer una copia de prueba: el dorso de la portada debe ser el panel de acceso y el de la solapa debe ser la experiencia del alumno. Las líneas de plegado no forman parte del arte.
4. Medir desde la izquierda del papel ya cortado. Exterior: solapa 97 mm, contraportada 100, portada 100; pliegues a 97 y 197. Interior: acceso 100 mm, gestión 100, alumno 97; pliegues a 100 y 200. Con el interior hacia arriba, doblar primero el panel derecho estrecho hacia el centro; después cerrar el izquierdo por encima. La portada queda al frente y el QR al dorso.
5. Revisar que la solapa cierre sin abombarse, el pie quede derecho, los colores y la letra se lean y el QR abra el aforo desde la pieza cerrada. Presentar el ejemplar al docente antes del tiraje de 20.

Se revisaron las cuatro caras renderizadas, incluidas tipografía y alineación. Los cuerpos de párrafo son de aproximadamente 10,2–11,1 pt, con pies puntuales de 9,5–9,8 pt. El PDF conserva texto vectorial y ambas familias Barlow incrustadas. Se verificaron cuatro milímetros libres de texto a cada lado de ambos pliegues mediante las cajas de los textos exportados. Se comprobó TrimBox en ambas páginas de cada PDF. ZBar decodificó ambos QR públicos de 28 mm (cuatro módulos de reserva) a https://aforofit.vercel.app/aforo desde la contraportada renderizada. El QR de ingreso pertenece al alumno y su escaneo físico con cámara continúa pendiente. Las vistas de plegado son montajes a escala de cada propuesta.

## Inventario

| Recurso | Procedencia | Uso y resolución efectiva en PDF |
|---|---|---|
| Isotipo y fuentes | SVG de B4.1 derivado de LogoMark del producto. Barlow Regular y Barlow Condensed Bold en iteracion-2/fuentes, con licencias. | Marca vectorial en portada; veinte marcas impresas por propuesta. |
| [Logo oficial USS](recursos/uss-logo-white.svg) | [Archivo original del sitio institucional](https://cdn.uss.cl/uss-site/app/uploads/2026/10/uss-logo-white.svg), enlazado en la cabecera de www.uss.cl. Autorización documentada en afiche-contenido.md. | Ambas portadas. 40 mm de ancho; Inkscape incorpora el SVG externo en el PDF a 651 ppp. Se conserva el original sin recolorear. |
| entrada-escritorio.png | ingreso/ del banco final | T1/T2: recorte de bienvenida 1160 × 310 px a 83 mm, 355 ppp. Se excluye la latencia simulada. |
| turno-llamado-escritorio.png | aforo/ del banco final | T1/T2: 3840 × 1560 px a 84 mm, 1161 ppp. Sala con 19 personas, un cupo y turno 03. |
| rutina-fotos-movil.png | alumno/ del banco final | T1: 1170 × 767 px a 79 mm, 376 ppp. T2: 1170 × 535 px a 80 mm, 371 ppp. |
| progresion-movil.png | alumno/ del banco final | T2: 1130 × 158 px a 80 mm, 359 ppp. Segunda prueba independiente con la carga siguiente. |

[Banco fijado en a2a3756](https://github.com/vicente-uss/aforofit/tree/a2a3756968f31ac5bdcc8b4ca9673c56656812a0/docs/evidencia/final). Los tres primeros PNG se reutilizan desde iteracion-3/originales y el cuarto se incluye íntegro en recursos. El generador conserva los píxeles de cada recorte. La fotografía nueva del lector queda pendiente de una toma presencial; las dos propuestas se sostienen con evidencia del software.

## Evaluación editorial interna

| Criterio | Máx. | T1 | T2 | Motivo |
|---|---:|---:|---:|---|
| Identidad y portada | 15 | 14 | 14 | Marca, veinte cupos y logo institucional auténtico. T1 destaca la frase y T2 el nombre del producto. |
| Narrativa y lectura plegada | 20 | 17 | 19 | T1 organiza por función. T2 enlaza la pregunta exterior con llegada, espera y entrenamiento. |
| Legibilidad | 15 | 14 | 13 | El recorte de progresión de T2 exige más proximidad que el ejercicio de T1. |
| Precisión y cobertura académica | 20 | 19 | 19 | Ambas explican objetivos, método, arquitectura, conclusión, resultados, alcance y condiciones. |
| Evidencia de producto | 15 | 14 | 15 | T1 muestra mantención y rutina; T2 suma la progresión con cifras trazables. |
| Preparación técnica | 15 | 13 | 13 | PDF, fuentes, cajas de corte, doble cara y QR verificados digitalmente. El ajuste mecánico depende del soporte. |
| **Total** | **100** | **91** | **93** | Pendientes la prueba física y la evaluación independiente. |

## Regenerar

Desde esta carpeta: instalar las fuentes de iteracion-2/fuentes, Python 3 con Pillow, PyMuPDF y ReportLab, e Inkscape. Ejecutar `python componer.py`. Cada carpeta recibe un PDF, dos SVG, dos PNG y la vista del plegado. Para cambiar textos de manera reproducible editar exterior() o interior(). Los SVG admiten edición directa en Inkscape y contienen sus imágenes.

[Indicaciones y contenido](../../afiche-contenido.md) · [Bases](../../bases-proyecto-integrador.md) · [Consolidado local](../../pruebas-ejecutadas.md) · [Medición física](../../medicion-ca29-2026-11-23.md) · [Estimación](../../estimacion.md). Se preservan las 429 comprobaciones locales, la cota superior de entrada de 1,2 s y las condiciones del cambio de aforo. La prueba física y los escenarios controlados de las capturas son fuentes distintas.
