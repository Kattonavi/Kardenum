# Fuentes para las imágenes generadas

Instancias estáticas que solo usa el generador de imágenes para redes (`src/app/og`), porque el motor de
`next/og` no lee fuentes variables ni woff2. El sitio carga Archivo y JetBrains Mono con `next/font`.

| Archivo | Origen | Instancia |
|---|---|---|
| `ArchivoExpanded-SemiBold.ttf` | Archivo variable (Google Fonts, `ofl/archivo`) | ancho 125, peso 600 |
| `JetBrainsMono-Medium.ttf` | JetBrains Mono variable (Google Fonts, `ofl/jetbrainsmono`) | peso 500 |

Las dos están recortadas a latín (U+0020-007E, U+00A0-00FF y puntuación común) con fontTools:

```
fonttools varLib.instancer "Archivo[wdth,wght].ttf" wdth=125 wght=600 -o full.ttf
fonttools subset full.ttf --unicodes="U+0020-007E,U+00A0-00FF,U+2013,U+2014,U+2018-201D,U+2022,U+2026,U+2192" --layout-features=kern,liga,calt --no-hinting
```

Licencia: SIL Open Font License 1.1 (archivos `OFL-*.txt`).
