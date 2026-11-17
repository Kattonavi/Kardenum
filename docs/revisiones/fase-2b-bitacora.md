# Fase 2b · Bitácora: decisiones del fundador tras la fase 2

Sesión del 2026-11-17, desde otro computador. Encargo: el mensaje del fundador de ese día. Spec:
`docs/specs/013-ajustes-tras-la-fase-2.md`. Este archivo se actualiza al cerrar cada rebanada.

## Estado por rebanada

| # | Rebanada | Estado | Commit | Puerta de clon limpio | `verify-deploy` |
|---|---|---|---|---|---|
| 0 | Spec 013 y línea base | hecha | `5756538` | — (solo documentos) | 44083060175, a mano: los tres trabajos en verde |
| 1 | Ancho de página de 1320 px | **en producción** | `61e58ae` | 148 unitarias · humo 1285 · navegador 1128 passed | 44086433152: los tres trabajos en verde |
| 2 | "Cotizar" relleno, títulos junto a la escena, las dos preguntas | **en producción** | `d9ac0ed` | 151 unitarias · humo 1285 · navegador 1152 passed | 44088502728: los tres trabajos en verde |
| 3 | Rendimiento: hojas de estilo por página, dieta de la página de preguntas y su entrada a `verify-deploy` | **desplegada; verificación en curso al cerrar esta nota** | `ece59cf` | 151 unitarias · humo 1287 · navegador 1152 passed | 44100140091: en curso |
| 4 | Contraste del rótulo del carrusel y revisión de diseño en celular | **hecha en local, sin subir**: falta su puerta de clon limpio (el sistema la detuvo por falta de memoria) | `849e9d8`, `1269710` | pendiente | — |

## Entorno de este computador

- **Node:** el computador trae Node 26.13.0 y el proyecto pide 22.x. Se instaló fnm 1.39.0 (con winget, sin permisos
  de administrador) y con él Node 22.23.5, al lado del 26. Todas las puertas de esta sesión corrieron con Node 22
  (la primera línea de cada puerta lo imprime). fnm resuelve solo la versión dentro de `web/` a partir de
  `engines.node` de `package.json`; fuera de `web/` sigue el 26.
- **Unidad E::** el disco viene de otro computador y Git rechaza clonar desde él ("dubious ownership"). La puerta
  clona con `git -c safe.directory=…` hacia `C:\kd-tmp\gate`, sin tocar la configuración global.
- **Un servidor de pruebas mantiene bloqueada `.next/standalone`** mientras corre: hay que cerrarlo antes de cada
  `pnpm build` (si no, el build falla al final con `EBUSY`).

## Decisiones tomadas sin preguntar

Las seis primeras están en la spec 013.

| # | Decisión | Por qué |
|---|---|---|
| 1 | Los límites internos (título del inicio 1100 px, pie del carrusel 1040, título del cierre 900) no cambian | Ya eran los de la maqueta |
| 2 | En Contacto el botón "Cotizar" lleva además un borde en Piedra | Relleno siempre, el relleno ya no marca la página actual |
| 3 | El filete de la cabecera y la franja de idioma se quedan | El fundador decidió solo el botón |
| 4 | Los cortes del título junto a la escena van escritos con cada título (`titleBeside`), y su tamaño depende del ancho de la columna | Solo con `text-wrap: balance` el navegador deja palabras solas (medido; ver rebanada 2) |
| 5 | Las preguntas de las subpáginas no se tocan | Siguen ocultas tras su flag |
| 6 | El título repetido entre el inicio y `/servicios` (backlog 65) sigue abierto | No vino decidido |
| 7 | Dos tamaños de título junto a la escena: 6,5 % del ancho de la columna (41 px a 1440) y 5,2 % (33 px) para los títulos con un renglón de más de 17 letras | Con un solo tamaño, o los títulos largos dejaban una palabra sola o todos quedaban en 33 px, por debajo de los títulos de sección |
| 8 | Trabajo local adelantado mientras corría una verificación | Igual que anoche: los push fueron en orden y cada uno esperó el verde del anterior |
| 9 | Se usó la rama desechable `diag/lighthouse-diet` una vez más, para medir la rebanada 3 en el runner antes de `main` | `verify-deploy` a mano sobre una rama abre un issue si falla; el workflow de diagnóstico no |

## Evidencia

### Rebanada 1 (`61e58ae`): ancho de página

- Prueba nueva `web/e2e/layout.spec.ts`. Antes del cambio: cabecera, contenido y pie medían 1120 px a 1440 y a
  1920 px, y el pie ocupaba dos filas (56 px entre sus centros). Después: 1224 px en los tres, pie en una fila, sin
  desplazamiento horizontal, también en la 404.
- Junto a la maqueta a 1440 px: los cuatro pasos de "Cómo trabajamos" parten en los mismos renglones, el pie queda en
  una fila y la página mide 4.234 px de alto (la maqueta, 4.239; antes, 4.315).
- Las alturas estimadas de las bandas del inicio que se dibujan después se midieron de nuevo a ocho anchos.

### Rebanada 2 (`d9ac0ed`): "Cotizar", títulos y preguntas

- **Títulos.** Medido en la tipografía real: con el tamaño de 46 px que estimaba el backlog, `text-wrap: balance`
  dejaba una palabra sola en 12 de los 22 títulos (5 líneas y 6 subpáginas, en dos idiomas). El navegador reparte
  renglones, no evita palabras solas. Por eso los cortes van escritos con cada título y el tamaño sale del ancho de la
  columna: los renglones son los mismos de 1024 a 1920 px.
- Resultado: 20 de 22 títulos en uno a tres renglones sin ninguna palabra sola. Los otros dos son títulos en inglés de
  tres palabras, de subpáginas ocultas ("Custom / Minecraft plugins." y "Custom / ecommerce websites."): no caben en un
  renglón a ningún tamaño razonable y quedan con la primera palabra sola, nunca la última.
- Prueba nueva `web/e2e/titles.spec.ts`: las 22 combinaciones a 1024, 1280, 1440 y 1920 px (columnas 55/45, renglones
  iguales a los escritos, ninguno con una palabra sola salvo esos dos, y el título cabe en su columna). En celular la
  página de una línea quedó idéntica byte a byte a la de antes.
- **"Cotizar":** relleno Bronce, texto Tinta, peso 700, en todas las páginas y en la 404; en Contacto, borde Piedra y
  `aria-current="page"` (`web/e2e/navigation.spec.ts`).
- **Preguntas:** las dos con el nombre de su servidor, en los dos idiomas; ninguna pregunta se repite en la página
  (`web/src/content/faq.test.ts`).

### Rebanada 3 (`ece59cf`): rendimiento

Qué se aplicó, sin cambiar lo que se ve (30 de 38 capturas idénticas byte a byte contra la rebanada 2, a 1280 y
390 px; las otras 8 son las páginas con preguntas, donde el "+" pasa de icono a dibujo de la hoja de estilos y se
ve igual):

- **Hojas de estilo por página.** Los estilos de las escenas y del carrusel van en una hoja propia (`motion.css`)
  que solo cargan las páginas con escenas. La hoja de todas las páginas baja de 15.366 a 11.267 bytes transferidos
  y cabe en la primera ráfaga.
- **Página de preguntas:** looks con nombre y el "+" dibujado por la hoja. Documento de 15.484 a 12.430 bytes (gzip);
  en inglés, de 15.157 a 12.241. La prueba de humo lo vigila (1.287 comprobaciones).
- **`verify-deploy` mide `/preguntas-frecuentes` y `/en/faq`** (nueve páginas en vez de siete).

Medido en el runner de GitHub, en la misma máquina y por turnos (corridas de diagnóstico 44094349249 y 44096784595;
A es esta rebanada, B es `main` como estaba desplegado):

| Página | Sin el cambio (B) | Con el cambio (A) |
|---|---|---|
| `/preguntas-frecuentes` (6 pasadas por lado) | 0,94 · 0,95 · 0,95 · 0,95 · 0,94 · 0,94 (LCP 2,86 a 3,02 s) | 0,96 · 0,98 · 0,96 · 0,96 · 0,96 · 0,96 (LCP 2,43 a 2,72 s) |
| `/nosotros`, primer pintado simulado | 0,92 s | 0,77 s |
| `/` (16 pasadas por lado) | 8 en 0,96 y 8 en 0,95 | 6 en 0,96 y 10 en 0,95 |
| `/en` (16 pasadas por lado) | 14 en 0,96 o más y 2 en 0,95 | 11 en 0,96 y 5 en 0,95 |

- **La página de preguntas gana margen** y sin el cambio no habría pasado al entrar a `verify-deploy`.
- **El inicio no gana ni pierde de forma medible:** solo da 0,95 o 0,96, nunca menos, con y sin el cambio. En la
  muestra de diez pasadas por lado salió idéntico (4 y 6); sumando la primera muestra, 6 de 16 contra 8 de 16, una
  diferencia que con ese tamaño es azar. Sigue pasando sin margen. Las páginas con escenas cargan una segunda hoja
  y eso les cuesta la ida y vuelta que la hoja única ya pagaba: su primer pintado simulado sigue en 0,92 s.
- Una prueba cambió: `carousel.spec.ts` "advancing never moves the page" mide su paso cuando la página ha asentado.
  La banda "Lo que hacemos" pasa de su altura estimada a la real un instante después de cargar, fuera de pantalla, y
  con las hojas separadas la prueba medía justo antes. Las alturas estimadas se afinaron (a 1280 px ya coinciden) y
  los desplazamientos que reporta el navegador se siguen contando desde el principio.

### Rebanada 4 (`849e9d8`, `1269710`): rótulo del carrusel y revisión de diseño

- **Rótulo activo en celular.** Medido: el rótulo entraba después de que su escena se detenía; en ese instante
  estaba transparente (contraste 1:1) y tardaba 0,35 s en llegar a su color, con unos 0,17 s por debajo de 4,5:1.
  Si el visitante pausaba ahí, se quedaba así. Ahora un rótulo sale y el siguiente entra mientras la fila se mueve:
  está entero durante los 2,8 s en que su escena está quieta. Prueba nueva en `carousel.spec.ts`, en siete momentos
  de cada turno y con la pausa. axe no ve ese rótulo (lo dibuja la hoja de estilos), así que la suite en verde no
  lo cubría.
- **Revisión de diseño en celular:** `docs/revisiones/fase-2b-diseno-celular.md`. Fiel con ajustes, nada Crítico,
  un Alto aplicado (lista numerada de las líneas) y lo demás al backlog (73 a 77).
- En local: build con 151 unitarias, 24 pruebas del carrusel y 83 de líneas y títulos en verde; capturas de
  escritorio idénticas a las de la rebanada 3. **Falta la puerta de clon limpio y el push.**

## Rendimiento del inicio: qué es el LCP y qué pesa

Medido con Lighthouse 12.6.1 (la versión que usa Lighthouse CI 0.15.1), celular, sobre el build local.

- **El elemento LCP es el título `<h1>` ("Software, diseño y video. Un solo estudio.")**, texto. Se pinta en el primer
  pintado (0,16 s observados). No es una escena ni el carrusel.
- **El LCP simulado (2,86 s) no lo decide el inicio sino lo que todas las páginas descargan antes de ese pintado.**
  Lighthouse promedia un cálculo optimista (documento y hoja de estilos: 0,91 s) con uno pesimista que suma todo lo
  que terminó de bajar antes del LCP. Medido quitando cada pieza:

  | Se quita | LCP simulado | Diferencia |
  |---|---|---|
  | Nada | 2,86 s | — |
  | El JavaScript del framework (8 archivos, 166 KB transferidos) | 2,11 s | −0,75 s |
  | La fuente Archivo (91 KB) | 2,50 s | −0,36 s |
  | La fuente JetBrains Mono (32 KB) | 2,71 s | −0,15 s |

- **El documento del inicio (13,2 KB comprimido) ya cabe en la primera ráfaga.** De esos 13,2 KB, 7,5 KB (57 %) son
  los datos que Next repite para el navegador; la cabecera, 0,9 KB; **las 13 escenas, 0,9 KB**; el pie, 0,6 KB.
- En esta máquina el inicio queda en el filo del redondeo: con LCP de 2,856 s da 0,96 y con 2,860 s da 0,95.
