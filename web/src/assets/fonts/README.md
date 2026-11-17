# Fuentes del sitio

Licencia de todas: SIL Open Font License 1.1 (archivos `OFL-*.txt`).

## Archivo, la fuente del sitio (`Archivo-site.woff2`)

El sitio carga Archivo con `next/font/local` (`src/app/fonts.ts`) y JetBrains Mono con `next/font/google`. Las dos
se precargan.

| Archivo | Qué es |
|---|---|
| `source/Archivo-latin-variable.woff2` | El archivo que Google Fonts sirve para el subconjunto latino de Archivo variable, sin tocar: pesos 100 a 900, anchos 62 a 125, 230 caracteres, 90 KB. Es la fuente del recorte; el sitio no lo sirve |
| `Archivo-site.woff2` | El que sirve el sitio: pesos 400 a 800, anchos 100 a 125 y los caracteres de sus textos más todo el español, 40,5 KB (spec 013, RF-43) |
| `Archivo-site.json` | Los caracteres que quedaron y los que tenía el original. Lo lee `src/lib/fonts.test.ts` |

Se regenera con:

```
py -3 -m pip install fonttools brotli
py -3 scripts/subset-archivo.py
```

**Cuándo hay que regenerarlo:** cuando el build falle con "characters the cut font lost". Pasa al escribir un texto
con un carácter que Archivo tiene y el recorte no (por ejemplo "ç" o "×"). Se corre el script y se versionan los tres
archivos. Si el sitio empieza a usar un peso menor de 400, mayor de 800 o un ancho menor de 100, hay que cambiar
`AXES` en el script y `weight` y `font-stretch` en `src/app/fonts.ts`.

Lo que queda fuera a propósito: las letras de otros idiomas (ã, ç, è, ö…). Un visitante que escriba "João" en el
cotizador ve esa letra en la fuente del sistema. Con las letras del portugués y el francés el archivo pesa 44,4 KB y
con todo el bloque Latin-1, 52,2 KB; hasta 42,9 KB llega en dos ráfagas de TCP y por encima en tres.

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
