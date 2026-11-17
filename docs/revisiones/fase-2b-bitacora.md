# Fase 2b · Bitácora: decisiones del fundador tras la fase 2

Sesión del 2026-11-17, desde otro computador. Encargo: el mensaje del fundador de ese día. Spec:
`docs/specs/013-ajustes-tras-la-fase-2.md`. Este archivo se actualiza al cerrar cada rebanada.

## Estado por rebanada

| # | Rebanada | Estado | Commit | Puerta de clon limpio | `verify-deploy` |
|---|---|---|---|---|---|
| 0 | Spec 013 y línea base | hecha | `5756538` | — (solo documentos) | 44083060175, a mano: los tres trabajos en verde |
| 1 | Ancho de página de 1320 px | **en producción** | `61e58ae` | 148 unitarias · humo 1285 · navegador 1128 passed | 44086433152: los tres trabajos en verde |
| 2 | "Cotizar" relleno, títulos junto a la escena, las dos preguntas | **en producción** | `d9ac0ed` | 151 unitarias · humo 1285 · navegador 1152 passed | 44088502728: los tres trabajos en verde |
| 3 | Rendimiento: hojas de estilo por página, dieta de la página de preguntas y su entrada a `verify-deploy` | **en producción** | `ece59cf` | 151 unitarias · humo 1287 · navegador 1152 passed | 44100140091: los tres trabajos en verde |
| 4 | Contraste del rótulo del carrusel y lista numerada de las líneas (revisión de diseño en celular) | **en producción** | `849e9d8`, `1269710` (desplegado `605d6e1`) | 151 unitarias · humo 1287 · navegador 1155 passed | **Pendiente.** Comprobación local contra producción: humo 1287 · Lighthouse del despliegue 0,96 a 1,00 · navegador 1154 de 1155 (una intermitente) |
| 5 | Títulos junto a la escena con un solo tamaño; la pregunta de las subpáginas de Minecraft | **en producción** | `3c4f00f` | 152 unitarias · humo 1287 · navegador 1162 passed | **Pendiente.** Comprobación local: humo 1287 · Lighthouse del despliegue 0,97 a 1,00 · Lighthouse del build abierto 0,95 a 0,96, pasa · navegador 1159 de 1162 (tres intermitentes) |
| 6 | Archivo en dos archivos, calentamiento y `verify-deploy` en dos tamaños | **en producción** | `2d2ad8a`, `cacdae1`, `6046f95` (desplegado `c0cb073`) | 155 unitarias · humo 1287 · navegador 1166 passed | **Pendiente.** Comprobación local: humo 1287 · Lighthouse del despliegue 0,96 a 1,00 · Lighthouse del build abierto 0,97 en las nueve páginas · navegador 1166 de 1166 |

## Bloqueo: GitHub Actions no corre desde las 15:16 UTC del 2026-11-17

- Al lanzar `verify-deploy` para la rebanada 4 (corrida 44112487200), GitHub no arrancó ningún trabajo: "The job was
  not started because recent account payments have failed or your spending limit needs to be increased. Please check
  the 'Billing & plans' section in your settings". Es de la cuenta y de dinero: lo resuelve el fundador.
- Esta sesión gastó minutos de Actions: cuatro corridas completas de `verify-deploy` (tres trabajos cada una: la
  línea base y las rebanadas 1 a 3) y tres de diagnóstico, dos de ellas con dos builds y hasta 60 pasadas de
  Lighthouse.
- Railway desplegó `605d6e1` (éxito a las 15:04 UTC) pero no avisó a GitHub: el estado del despliegue quedó "en curso"
  y `verify-deploy` no arrancó solo. Por eso se lanzó a mano.
- **Decisión del fundador (tercera ronda):** no esperar a Actions. Las rebanadas 5 y 6 se subieron una a la vez, cada
  una con su puerta de clon limpio y, ya desplegada, con las tres comprobaciones del workflow corridas desde este
  computador contra producción (humo y navegador; Lighthouse contra el despliegue; Lighthouse sobre el build abierto
  del mismo commit, compilado aquí). No es `verify-deploy`: es otra máquina y otra red.
- **`verify-deploy` queda pendiente:** una sola corrida completa sobre el `main` final cuando Actions vuelva
  (`gh workflow run verify-deploy.yml --ref main`; backlog 81).
- La comprobación local de la rebanada 4 que se anotó antes no incluyó el Lighthouse sobre el build abierto; las de
  las rebanadas 5 y 6 sí, y cubren el mismo código.

## Cuánto gasta `verify-deploy` y cómo quedó dividido

Medido en las cuatro corridas completas del 2026-11-17 (GitHub cobra cada trabajo redondeado al minuto):

| Trabajo | Duración | Qué se lo lleva |
|---|---|---|
| Humo y navegador contra el despliegue | 11 a 17 min | La suite de navegador: 906 s en la última corrida. Instalar dependencias, 10 s; instalar el navegador, 28 s; humo, 23 s |
| Lighthouse contra el despliegue | 6 a 7 min | 27 pasadas (9 páginas × 3), unos 15 s cada una |
| Lighthouse sobre el build abierto | 6 a 8 min | El build, 48 s, y otras 27 pasadas |
| **Total por corrida** | **24 a 32 min cobrados** | Una por cada despliegue: cada push que toca `web/**` |

Desde la rebanada 6 (spec 013, RF-46 y decisión 15):

- **Corto, tras cada despliegue, en un solo trabajo:** humo; Lighthouse contra el despliegue en tres páginas (`/`,
  `/servicios/minecraft`, `/preguntas-frecuentes`), tres pasadas cada una, mismo mínimo de 95; y 146 pruebas de
  navegador (inicio, menús, cotizador, carrusel, preguntas, fuentes, idioma, ancho de página y política de contenido).
  Estimado: 7 a 8 minutos cobrados, la cuarta parte. El subconjunto de navegador tarda 127 s desde este computador
  contra producción. **Sin medir en GitHub** (Actions no corre).
- **Completo, solo a mano:** los tres trabajos de siempre, con calentamiento. Obligatorio antes del lanzamiento.
- **Caché** de los paquetes de pnpm y de los navegadores de Playwright: ahorra poco (instalar las dos cosas eran
  38 s por trabajo), porque el tiempo se va en las pruebas, no en la instalación.
- **Lo que el corto deja de vigilar en cada despliegue:** las pruebas de accesibilidad con axe de todas las páginas
  (546 de las 1.166), el Lighthouse con SEO sobre el build abierto y seis de las nueve páginas. Todo eso sigue en la
  puerta de clon limpio antes de cada push (menos Lighthouse) y en el completo.

## Entorno de este computador

- **Node:** el computador trae Node 26.13.0 y el proyecto pide 22.x. Se instaló fnm 1.39.0 (con winget, sin permisos
  de administrador) y con él Node 22.23.5, al lado del 26. Todas las puertas de esta sesión corrieron con Node 22
  (la primera línea de cada puerta lo imprime), poniéndolo delante en el `PATH` de cada comando. `fnm exec -- node -v`
  dentro de `web/` da v22.23.5 (lee `engines.node` de `package.json`); fuera de `web/` sigue el 26.
  **Falta un paso del fundador:** en una terminal suya, `node -v` dentro de `web/` sigue dando 26 hasta que el perfil
  de PowerShell cargue fnm (`fnm env --use-on-cd`); esta sesión no pudo escribir ese archivo.
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

### Rebanada 4, comprobada en producción desde este computador (no es `verify-deploy`)

Las mismas tres comprobaciones del workflow, una tras otra, contra `https://web-production-f1d7c246.up.railway.app`,
con las pruebas del commit desplegado (`605d6e1`) y Node 22:

- Humo: `OK: all 1287 checks passed (noindex)`.
- Navegador: 1154 passed, 47 skipped, **1 failed**: `scenes.spec.ts` "the scenes move, and the control of the page
  pauses and resumes all of them", en celular, en `/servicios`. Repetida cuatro veces contra producción: 64 de 64 en
  verde. Es una carrera de tiempos de la prueba al reanudar (lee "animaciones corriendo" justo después de comprobar
  que ninguna está en pausa), no algo de esta rebanada. Backlog 82.
- Lighthouse contra el despliegue, tres pasadas por página: rendimiento de 0,96 a 1,00 en las nueve páginas (inicio
  0,98 · 0,97 · 0,98; preguntas 1,00 · 1,00 · 1,00), accesibilidad y buenas prácticas 1,00. Son cifras de esta máquina
  y esta red, no las del runner.

### Rebanada 5 (`3c4f00f`): un solo tamaño de título

Segunda ronda de decisiones del fundador. Detalle en la spec 013 (RF-20 a RF-26, decisiones 7 y 10) y en
`docs/revisiones/fase-2b-diseno-titulos.md`.

- 22 títulos a 1216, 1280, 1440 y 1920 px: un tamaño (41 px a 1440, 37 px a 1216), los renglones escritos, el bronce
  al inicio de renglón, ninguna palabra corta sola al final y los dos botones en un renglón.
- A 1024 y 1215 px la escena va debajo del texto, de 640 px como máximo.
- Nada se mueve al llegar las fuentes en las páginas con los renglones más largos (`fonts.spec.ts`, 12 pruebas).
- Revisión de diseño en escritorio: aprobado con ajustes; los tres medios que nacían del cambio, aplicados.

### Rebanada 6 (`2d2ad8a`): Archivo recortada y calentamiento

Medido en local con Lighthouse 12.6.1, celular, tres pasadas en el inicio y dos en las demás:

| Página | Antes (rebanada 5) | Archivo recortada, Mono sin precarga | Archivo recortada, Mono con precarga (lo que quedó) |
|---|---|---|---|
| `/` | FCP 0,91 s · LCP 2,86 s · 0,95 | FCP 1,06 s · LCP 2,65 s · 0,96 a 0,97 | FCP 0,91 s · LCP 2,66 s · 0,97 |
| `/en` | 0,91 · 2,86 · 0,95 a 0,96 | 1,06 · 2,65 · 0,97 | 0,91 · 2,65 · 0,97 |
| `/servicios/minecraft` | 0,91 · 2,86 · 0,95 a 0,96 | 1,06 · 2,65 · 0,97 | 0,91 · 2,65 · 0,97 |
| `/preguntas-frecuentes` | 0,76 · 2,71 · 0,96 | 1,06 · 2,64 · 0,97 | 0,76 · 2,65 · 0,97 |

- **Archivo:** de 90.096 a 40.500 bytes (pesos 400 a 800, anchos 100 a 125, 132 caracteres). El inicio sale del filo:
  de 0,95 a 0,97 en esta máquina. **No está medido en el runner** (Actions no corre).
- **No es idéntica byte a byte.** Las 38 capturas conservan su tamaño (mismos renglones, misma altura de página), pero
  entre el 0,04 % y el 0,21 % de los píxeles cambia en los bordes de las letras. Causa medida: al limitar los ejes,
  fontTools redondea los contornos; difieren como máximo 1,3 unidades de 1.000 por eme (0,05 px en un título de
  41 px) y el avance de algunas letras, 1 unidad. Comparadas a doble tamaño, antes y después, el título del
  inicio y un párrafo de la página de preguntas no se distinguen.
- **JetBrains Mono sin precarga se probó y no se aplicó** (spec 013, decisión 14): mismo LCP y peor primer pintado.
- **Calentamiento:** `web/scripts/warm-up.mjs` probado en local (nueve páginas en 200 y una carga en Chrome); la
  configuración de Lighthouse CI no arranca servidor con `LHCI_SERVER=running` y sí sin ella. **El paso del workflow
  no se pudo ejecutar en GitHub Actions:** su primera corrida real será la verificación de esta rebanada.

### Rebanadas 5 y 6 en producción, comprobadas desde este computador (no es `verify-deploy`)

| Comprobación | Rebanada 5 (`3c4f00f`) | Rebanada 6 (`c0cb073`) |
|---|---|---|
| Humo contra producción | `OK: all 1287 checks passed` | `OK: all 1287 checks passed` |
| Lighthouse contra el despliegue, 9 páginas × 3 | pasa; rendimiento 0,97 a 1,00 | pasa; 0,96 a 1,00 |
| Lighthouse sobre el build abierto, 9 páginas × 3, cuatro categorías | pasa; inicio 0,95 · 0,95 · 0,95, las demás 0,96 | pasa; **0,97 en las 27 pasadas** |
| Navegador contra producción | 1159 passed, 3 failed | **1166 passed, 0 failed** |

- Las tres que fallaron en la rebanada 5 son intermitentes contra el servidor remoto: repetidas cuatro veces
  seguidas, 36 de 36 en verde. Dos eran la prueba de pausa de las escenas en celular, que leía una sola vez las
  animaciones tras reanudar; en la rebanada 6 espera a que se cumpla y no volvió a fallar. La tercera es
  `legal.spec.ts` "the contents of /legal/privacidad lead to each section" (backlog 82).
- **El inicio sale del filo en el build abierto: de 0,95 a 0,97**, medido en esta máquina con la misma configuración
  de Lighthouse CI. Falta la medida del runner.

### Rebanada 6, segunda parte (`6046f95`): segundo archivo de Archivo

- `Archivo-ext.woff2`: 73.816 bytes, 436 caracteres (el resto de Latin-1, latín extendido A, B y adicional,
  puntuación y monedas), con `unicode-range`. El base no cambió ni un byte (40.500).
- Ninguna de doce páginas del sitio lo pide, recorridas hasta el final (`e2e/fonts.spec.ts`); al escribir
  "João Ångström" en el cotizador sí se descarga y el campo sigue en Archivo.
- Costo para todas las páginas: la hoja de estilos pasa de 11.286 a 11.805 bytes transferidos (los dos rangos); cabe
  en la primera ráfaga con 2,8 KB de margen. El documento del inicio no cambia (13.345 de 13.560 bytes).
- Lighthouse local del inicio con los dos archivos: 0,97 · 0,97 · 0,97 (LCP simulado 2,64 s).

### La rama `feat/motion-and-service-visuals`

Solo existe en este disco (no tiene copia en el remoto). Tres commits del 2026-11-16 por la mañana, anteriores a la
fase 2: es el lote que el brief de la fase 2 reemplazó (specs 009 a 011). Sale de `a8636ef`; `main` lleva 37 commits
desde ahí. Lo que tiene y `main` no:

- Las specs 009, 010 y 011.
- Las escenas de cada línea como SVG (`components/visuals/`), la entrada al bajar con un observador en JavaScript
  (`components/motion/reveal-observer.tsx`) y una lista interactiva de líneas en el inicio (`services-showcase.tsx`).
  La fase 2 hizo lo mismo con HTML y solo CSS, que es lo que pedía su brief.
- **Redes sociales en el pie** (`web/src/lib/social.ts` y su prueba): Facebook, Instagram y Discord desde
  `site.config.ts`. Es lo único que sigue pendiente en `main` (backlog 66).
- Dos archivos de pruebas de ese lote (`motion.spec.ts`, `visual-first.spec.ts`).

Su página de preguntas ya se reutilizó en `main` (spec 012, decisión 1). No se borró.
