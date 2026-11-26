# AforoFit · Entrega para exposición

| Pieza | Imprenta | Vista y editables |
|---|---|---|
| B5 · Cada entrada cuenta | [PDF A0](AforoFit-Afiche-A0.pdf) | [PNG](AforoFit-Afiche-A0.png) · [SVG](AforoFit-Afiche-A0.svg) |
| T3 · Al llegar, si hay espera, al entrenar | [PDF de dos páginas](AforoFit-Triptico.pdf) | [Exterior PNG](Triptico-exterior.png) · [Interior PNG](Triptico-interior.png) · [Plegado](Triptico-plegado.png) · [Exterior SVG](Triptico-exterior.svg) · [Interior SVG](Triptico-interior.svg) |

Base editorial: afiche B4.1, commit 54da5e4, y tríptico T2, commit 974a61b. Las matrices son autónomas con fotografías incrustadas. Las fuentes de composición son las Barlow distribuidas en iteracion-2/fuentes.

## Recursos y procedencia

- La imagen de acceso fue aportada por el equipo como fotografía propia (adjunto con hora 11_35_39). Se conserva íntegra en [TNE-lector-original.jpg](recursos/TNE-lector-original.jpg), SHA-256 b75bd2af69c20c323762ae704e45741cacf8d7231d0ff41a7b8a9dcb35f2f3ef. El nombre asignado por la plataforma no se usó para establecer su procedencia. No contiene campos EXIF ni geolocalización detectables. La toma muestra una mano y el reverso de la credencial con información genérica de Junaeb; no se observa nombre, RUT, rostro ni código personal legible.
- El [recorte](recursos/TNE-lector-recorte.jpg) selecciona (0, 650) a (1380, 1430) en el original de 1536 × 2048 px. Se guarda al 97 % de calidad, sin reescalado, con el perfil ICC de origen. Se preservaron la geometría de la credencial y el LED. La foto ilustra el gesto de acceso; la medición temporal procede del video documentado del proyecto.
- Las otras tres tomas adjuntas repiten el dispositivo desde arriba, en perspectiva o con una segunda mano. Se escogió una sola para reconocer el mismo equipo en las dos piezas. Entre los cuatro adjuntos no había una toma conjunta del computador y el celular. Se prescindió de esa escena y de las reconstrucciones generativas. La vista general del gimnasio tampoco era necesaria para explicar el flujo.
- Se reutilizan las capturas locales de [la iteración 3](../iteracion-3/README.md) y la [progresión de T2](../triptico/README.md). Originales del banco visual a2a3756. Las cuentas y resultados de pantalla son ficticios, con respuestas controladas en escenarios independientes. Las capturas de la aplicación conservan sus píxeles y proporciones.
- El isotipo de AforoFit se conserva en las matrices aprobadas. Para USS, se utilizaron únicamente los [fundamentos del Kit Digital](https://kitdigital.uss.cl/diseno/fundamentos-de-diseno) y los SVG del paquete oficial. Se verificó que las versiones 0.12.20 indicada por el equipo y 0.21.0 etiquetada latest en el registro de npm contienen archivos idénticos. Los SVG de unpkg coincidieron con ambos paquetes.
- [Fondo claro](recursos/logo-horizontal-on-light.svg), SHA-256 3a94e041ed15989cdff438aa650b9ed8e6f670ff9e029ba9dec2fc0ddb3fe1ab. [Fondo oscuro](recursos/logo-horizontal-on-dark.svg), SHA-256 a4b1c00a59303e2a3cbf9fafea96a26bb7708f6f0a5b04e9a724bf3344dabdd3. Origen: https://unpkg.com/@ussebastian/kitdigital@0.12.20/dist/assets/img/ . Se insertaron los trazados sin recolorear y con viewBox 310 × 96. Anchos en papel: 75 mm y 48 mm. El afiche conserva 15 mm hasta el borde superior y 32 mm al borde derecho; en la portada el logo comienza a 9 mm del pliegue. El Kit consultado describe identidad digital; no se encontró una medida física normativa verificable para estas dos aplicaciones impresas. Las medidas son decisiones de composición.

## Generación

Instalar Barlow Regular y Barlow Condensed Bold de ../iteracion-2/fuentes en el sistema para Inkscape. Comprobar con fc-match que resuelvan a las familias correctas. Se requieren Python 3, Pillow, PyMuPDF e Inkscape. Desde esta carpeta ejecutar `python componer.py`. El programa deriva B5 y T3 de las matrices aprobadas, prepara el recorte fotográfico, exporta los PDF, renderiza las páginas y prepara la vista de primera apertura.

## Auditoría digital

Se inspeccionaron las tres páginas renderizadas desde los PDF finales y la primera apertura simulada. pdfinfo/PyMuPDF confirmaron una página A0 de 841 × 1189 mm y un tríptico de dos páginas con TrimBox 297 × 210 mm y BleedBox/MediaBox 303 × 216 mm. pdffonts confirmó Barlow y Barlow Condensed incrustadas. Los logos permanecen vectoriales; pdfimages solo enumera fotografía y capturas. ZBar leyó ambos QR en el render del PDF con destino https://aforofit.vercel.app/aforo. Los pares blanco/azul y tinta/marfil de las matrices aprobadas tienen un contraste de 6,84:1 y 15,71:1. Se comprobó que ningún texto del tríptico invade los 4 mm próximos a sus pliegues.

| Pieza | Resolución efectiva en el PDF |
|---|---|
| B5 | Foto 389 ppp; pantalla pública 203; rutina 177; bienvenida del kiosco 202. |
| T3 | Foto 422 ppp; pantalla pública 1161; ejercicio 371; progresión 359. |

Se contrastó la [sección 7 de las bases](../../bases-proyecto-integrador.md) con el afiche: título, identidad institucional y equipo; problema, objetivo, método y tecnologías; arquitectura de cinco pasos; funciones, evidencia, resultados, beneficio, conclusión y limitaciones. El tríptico explicita horarios, capacidad y certificados, y conserva el ejemplo de progresión. El QR público abre la vista de aforo. El panel de acceso del tríptico explica cómo obtener el código de ingreso de un solo uso. En la prueba técnica se comprobó el canje manual. La validación física mediante cámara sigue pendiente.

El consolidado de [pruebas ejecutadas](../../pruebas-ejecutadas.md) es de 429 locales (198 Vitest y 231 SQL). La [prueba con lector](../../medicion-ca29-2026-11-23.md) documenta ≤ 1,2 s como cota superior desde la luz a la entrada visible; menos de 0,1 s desde el resultado del kiosco al cambio de aforo en la misma máquina. Los textos conservan red doméstica y video analizado a intervalos de 0,1 s.

| Criterio | Máx. | B5 | T3 | Observación |
|---|---:|---:|---:|---|
| Identidad | 15 | 15 | 15 | Marca de producto protagonista y firma USS auténtica con variante adecuada al fondo. |
| Jerarquía y narrativa | 20 | 19 | 19 | El lector y el kiosco tienen un lugar claro. En T3 el primer panel concentra más texto de lectura cercana. |
| Legibilidad | 15 | 14 | 14 | En B5 el móvil conserva los 177 ppp de la composición aprobada; en T3 los valores pequeños del recorte se refuerzan con un pie. |
| Contenido y exactitud | 20 | 20 | 20 | Consolidado, resultado cronometrado, límites y método identificables. |
| Evidencia | 15 | 15 | 15 | La fotografía y los escenarios se identifican; la toma del lector no se usa como cronómetro. |
| Preimpresión | 15 | 13 | 13 | Fuentes, dimensiones, cajas y QR verificados. Color sobre soporte, montaje y pliegue pendientes de prueba real. |
| **Evaluación interna** | **100** | **96** | **96** | Auditoría digital del cierre; la conformidad física corresponde a facultad, docente e imprenta. |

## Prueba y tiraje

**B5.** Imprimir a tamaño real. Se entrega el A0 confirmado sin sangrado añadido. Acordar soporte, perfil de color, tolerancia de corte y montaje. Comprobar a la altura final la lectura desde 3–5 m y el escaneo público; comprobar de cerca la letra de la rutina y la fotografía.

**T3.** A4 horizontal abierto provisional, 3 mm de sangrado y doble cara. Confirmar papel, gramaje, tamaño, perfil y registro de la máquina. Imponer en pliego que admita sangrado y cortar a TrimBox, sin ajustar a página. Exterior primero (97/100/100 mm), interior después (100/100/97 mm). Voltear por borde corto en apaisado. Con interior hacia arriba, plegar primero el panel derecho estrecho sobre el centro y luego cerrar la portada izquierda. Revisar físicamente color, texto, cierre y QR de contraportada. Tras el visto bueno docente sobre la prueba, producir **20 ejemplares a color**.
