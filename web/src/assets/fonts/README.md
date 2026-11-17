# Fuentes del sitio

Licencia de todas: SIL Open Font License 1.1 (archivos `OFL-*.txt`).

## Archivo, la fuente del sitio (dos archivos)

El sitio carga el archivo base de Archivo con `next/font/local` (`src/app/fonts.ts`) y JetBrains Mono con
`next/font/google`; los dos se precargan. El segundo archivo de Archivo se declara en `src/app/globals.css` y no se
precarga.

| Archivo | Qué es |
|---|---|
| `Archivo-site.woff2` | El base, el que cargan todas las páginas: pesos 400 a 800, anchos 100 a 125 y los caracteres de los textos del sitio más todo el español, 40,5 KB (spec 013, RF-43) |
| `Archivo-ext.woff2` | El resto de las letras y signos latinos de la fuente (ã, ç, è, ő…), mismos pesos y anchos, 73,8 KB. Lleva `unicode-range`: el navegador lo baja solo donde se muestra una de esas letras, por ejemplo un nombre escrito en el cotizador. Ninguna página del sitio lo pide (`e2e/fonts.spec.ts`) |
| `Archivo-site.json` | Los caracteres de cada archivo y su `unicode-range`. Lo lee `src/lib/fonts.test.ts` |
| `source/Archivo-latin-variable.woff2` | Origen del base: el archivo que Google Fonts sirve para el subconjunto latino, sin tocar (pesos 100 a 900, anchos 62 a 125, 230 caracteres, 90 KB) |
| `source/Archivo-variable.ttf` | Origen del segundo: la fuente completa de google/fonts (`ofl/archivo`, versión 2.001), sin tocar. Los 230 caracteres del subconjunto latino tienen en ella el mismo dibujo |

Se regenera con:

```
py -3 -m pip install fonttools brotli
py -3 scripts/subset-archivo.py
```

El script solo reescribe un archivo cuando cambian sus caracteres: correrlo dos veces no cambia nada.

**Cuándo hay que regenerarlos:** cuando el build falle con "characters of the texts that are only in the extended
file". Pasa al escribir un texto del sitio con un carácter que Archivo tiene y el base no (por ejemplo "ç"): esa letra
pasa al base. Se corre el script, se copian los dos rangos que imprime (el del base a `src/app/fonts.ts`, el del
segundo a `src/app/globals.css`) y se versiona todo; `src/lib/fonts.test.ts` falla si los rangos del código no son
los de los archivos. Si el sitio empieza a usar un peso menor de 400, mayor de 800 o un ancho menor de 100, hay que
cambiar `AXES` en el script y los pesos y anchos de las dos declaraciones.

El base no debe pasar de 42,9 KB: hasta ahí llega en dos ráfagas de TCP en una conexión nueva; por encima, en tres,
como el de 90 KB (lo vigila la misma prueba). Por eso las letras de otros idiomas van en el segundo archivo.

## Fuentes para las imágenes generadas

Instancias estáticas que solo usa el generador de imágenes para redes (`src/app/og`), porque el motor de
`next/og` no lee fuentes variables ni woff2.

| Archivo | Origen | Instancia |
|---|---|---|
| `ArchivoExpanded-SemiBold.ttf` | Archivo variable (Google Fonts, `ofl/archivo`) | ancho 125, peso 600 |
| `JetBrainsMono-Medium.ttf` | JetBrains Mono variable (Google Fonts, `ofl/jetbrainsmono`) | peso 500 |

Las dos están recortadas a latín (U+0020-007E, U+00A0-00FF y puntuación común) con fontTools:

```
fonttools varLib.instancer "Archivo[wdth,wght].ttf" wdth=125 wght=600 -o full.ttf
fonttools subset full.ttf --unicodes="U+0020-007E,U+00A0-00FF,U+2013,U+2014,U+2018-201D,U+2022,U+2026,U+2192" --layout-features=kern,liga,calt --no-hinting
```
