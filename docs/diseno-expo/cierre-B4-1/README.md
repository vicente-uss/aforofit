# Cierre editorial B4.1

[PDF A0](B4.1.pdf) · [Vista PNG](B4.1.png) · [Fuente editable](B4.1.svg) · [Comparación rotulada B4 / B4.1](Comparacion-B4-B4.1.png)

La revisión parte del commit c3bf4b684e33d7b0e311fa5eb85d878f029e4175. El 93/100 de la auditoría independiente y su aprobación de la dirección artística corresponden a B4. B4.1 queda como candidata a revisión física.

| Elemento | Ajuste y criterio de lectura |
|---|---|
| Rutina móvil | El encuadre empieza en la confirmación de ingreso y termina tras el segundo ejercicio completo. Se distinguen el aviso de mantención, fotos, series, repeticiones y cargas. El ancho pasa de 148 a 168 mm; la leyenda permite leer las cargas sin descifrar la interfaz. |
| Kiosco | La bienvenida comparte eje izquierdo con «Kiosco web». Se conserva la identificación de escenario independiente y se excluye el tiempo simulado. |
| QR público | Su centro pasa de 1142 a 722 mm desde el borde superior: queda 420 mm más arriba con el mismo montaje. Se ubica junto a la etapa «Aforo en vivo», con dirección escrita. Mide 76 mm e incluye cuatro módulos blancos. La URL pertenece a la pantalla pública. |
| Conclusión | Explicita la relación entre registro de entradas y salidas y ocupación. En la prueba física documentada, el aforo pasó de 0 a 1 al entrar y volvió a 0 al salir. |
| Créditos | Se aumentó el cuerpo de los nombres y se alinearon las columnas con la franja superior. |

## Verificación editorial y técnica

Se inspeccionó el render final del PDF. Una página vertical de 841 × 1189 mm, texto seleccionable y fuentes Barlow Regular y Barlow Condensed Bold incrustadas según pdffonts. El PNG de revisión mide 2547 × 3600 px. ZBar decodificó el QR de ese render a https://aforofit.vercel.app/aforo.

| Imagen | Píxeles útiles | Ancho | ppp efectivos |
|---|---:|---:|---:|
| Pantalla pública | 3840 × 2160 | 480 mm | 203,2 |
| Rutina móvil | 1170 × 1668 | 168 mm | 176,9 |
| Bienvenida del kiosco | 1160 × 310 | 146 mm | 201,8 |

Se usaron los [originales trazables de B4](../iteracion-3/README.md). Los recortes conservan los píxeles de origen y su proporción. En la rutina se priorizó aumentar un 13,5 % el tamaño de lectura sobre alcanzar 200 ppp. Conviene revisar la letra de la interfaz, el color y el escaneo sobre el soporte real antes de autorizar impresión.

Contrastes de luminancia verificados: 15,71:1 entre tinta y marfil, 6,84:1 entre blanco y azul, 6,27:1 entre azul y marfil y 12,21:1 entre azul claro y tinta. Se revisaron la separación de las leyendas, las flechas del flujo y las reservas sin tinta.

La lámina mantiene los elementos de [la sección 7](../../bases-proyecto-integrador.md): institución y equipo, contexto, objetivo, tecnologías y método de estimación, arquitectura, escenarios del prototipo, beneficios, resultados, limitaciones y conclusión. Las 429 comprobaciones locales corresponden a [198 Vitest y 231 SQL](../../pruebas-ejecutadas.md). Las mediciones muestran la entrada en ≤ 1,2 s como cota superior y el cambio de aforo en menos de 0,1 s desde el resultado del kiosco en la misma máquina. Proceden de una prueba en red doméstica con fotogramas a intervalos de 0,1 s. [Medición con lector](../../medicion-ca29-2026-11-23.md).

## Incorporación de recursos auténticos

El generador admite PNG, JPEG o SVG y conserva las proporciones. La reserva del lector mide 125 × 43 mm y se alinea con «Credencial». La del logo USS mide 72 × 32 mm en la cabecera. Ambas son grupos identificados en el SVG y quedan sin tinta si se omiten los archivos. Para la fotografía interesa un encuadre horizontal del lector en uso, con una tarjeta de prueba y sin datos personales visibles. Para la marca institucional debe utilizarse el archivo oficial autorizado y respetarse su área de protección.

Instalar las fuentes de iteracion-2/fuentes, Python 3 con Pillow y ReportLab, Inkscape y Poppler. Desde esta carpeta:

```sh
python componer.py
# Cuando el equipo disponga de ambos recursos:
python componer.py --foto-lector lector.png --logo-uss logo-uss.svg
```

El comando regenera los tres formatos B4.1 y la comparativa con la versión publicada de B4. Tras incorporar recursos, revisar el render y volver a comprobar el QR.
