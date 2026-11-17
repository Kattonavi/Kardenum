# Fase 2 · Bitácora de la sesión sin supervisión

Sesión nocturna del 2026-11-16. Encargo: `docs/handoff/fase-2/BRIEF-FASE-2.md`. Spec: `docs/specs/012-fase-2-rediseno-visual.md`.
Este archivo se actualiza al cerrar cada rebanada: de aquí sale el informe final.

## Estado por rebanada

| # | Rebanada | Estado | Commit | `verify-deploy` |
|---|---|---|---|---|
| 1 | Spec, plan y bitácora | **hecha** | `87cfd88` | corrida manual 44001275728: success (línea base; un push sin `web/**` no despliega) |
| 2 | Cinco escenas y control de pausa | **en producción** | `d438bd1` | 44002958854: success (los tres trabajos) |
| 3 | Carrusel | **en producción** | `2a93d0e` + `78962ae` | 44004820274: success (los tres trabajos) |
| 4 | Inicio completo | **en producción** (verde al segundo arreglo; su margen de rendimiento volvió a fallar en la rebanada 5, ver abajo) | `3f672fd` + `d23fe40` + `68b1b80` | 44016256510: success (los tres trabajos). Antes: | 44006779132: humo y navegador success, Lighthouse contra el despliegue success, **Lighthouse sobre el build abierto failure** (rendimiento de `/`: 0,82 · 0,93 · 0,94; mínimo 0,95). Issue #3 abierto por el workflow |
| 5 | Pie y preguntas frecuentes | **en producción** (verde tras la dieta `bb20f33`: corrida 44024408090, los tres trabajos) | `8b07a3b` + `5684ba2` + `bb20f33` | Antes: | 44017531353: humo, navegador y Lighthouse contra el despliegue success; **Lighthouse sobre el build abierto failure** en `/` (0,71 · 0,94 · 0,94) |
| 6 | Índice de servicios y líneas | subida, verificando | `cebb917` | — |
| 7 | Subpáginas, pie de la 404 y entrada al bajar en el resto | lista en local | — | — |
| 8 | Revisiones del lote | pendiente | — | — |

## Decisiones tomadas sin preguntar

Las diez primeras están razonadas en la spec 012 ("Decisiones"). Resumen:

| # | Decisión | Por qué |
|---|---|---|
| 1 | Se parte de `main`; la rama `feat/motion-and-service-visuals` (specs 009 a 011) queda intacta y sin fusionar | Choca con el brief en tres puntos: SVG y observador en JS, secciones plegadas, redes en el pie |
| 2 | Redes sociales fuera del pie | El pie del brief y de la maqueta no las trae (backlog) |
| 3 | Un control "Pausar animación" en toda página con escenas, no solo en el carrusel | WCAG 2.2.2 aplica a cualquier bucle de más de 5 s |
| 4 | Pestañas del carrusel como indicadores, no controles | Así es la maqueta; con solo CSS no se salta a una escena |
| 5 | Movimiento reducido: el carrusel pasa a fila deslizable con ajuste al centro | Regla 3 del brief |
| 6 | Texto dentro de las escenas en `cqw` | Es parte de un dibujo, no texto de lectura |
| 7 | Títulos en peso 800 y botones en 700, como la maqueta; respaldos de fuente medidos de nuevo | La maqueta aprobada es la referencia visual |
| 8 | Un solo cierre centrado para todo el sitio, con el enlace a preguntas | El cierre es un componente compartido |
| 9 | Rebanadas 2 y 3 probadas con pruebas estáticas y una galería de prueba solo en el clon de descarte | Ninguna página publicada usa escenas hasta la rebanada 4 |
| 10 | `lighthouserc.cjs` no se toca; Lighthouse de las demás páginas se corre aparte | Es parte de `verify-deploy`, que el brief pide no tocar |
| 11 | Las palabras dentro de una escena las dibuja la hoja de estilos (`content: attr(data-t)`), no son texto de la página | Medido: como texto real fallaban axe (contraste en las vecinas atenuadas) y la prueba de texto al 200 % |
| 12 | `content-visibility: auto` en las escenas | Medido: primer pintado de la galería de 1,3 s a 0,8 s |
| 13 | El control de pausa es una casilla "Pausar animación" con el mismo texto en sus dos estados | Sin script no se puede cambiar el texto a "Reanudar" sin contradecir el nombre accesible |
| 14 | El cursor pausa el carrusel solo donde hay cursor (`hover: hover`) | En táctil el "hover" se queda pegado tras un toque |
| 15 | Tres tonos de superficie nuevos como tokens (`coal` #1a1a18, `soot` #22211f, `chalk` #e9e8e3) | Son los fondos de tarjeta y de escena de la maqueta; nunca se usan como texto |
| 16 | El carrusel cambia de proporción de celular a escritorio en 768 px | La maqueta solo define 390 y 1280 px |
| 17 | El inicio usa el ancho de página del sitio (1200 px con márgenes de 40), no el de la maqueta (1320 con 48) | La cabecera es "la actual" y todo el sitio se alinea con ella |
| 18 | En las tarjetas (Video, Minecraft, Discord) el enlace es el botón, estirado sobre toda la tarjeta | Toda la tarjeta responde al clic y el nombre del enlace es corto ("Ver Minecraft"), no el texto entero de la tarjeta |
| 19 | Las fichas de servicios de Desarrollo y Diseño son texto, no enlaces, con los nombres de la maqueta | Así están en la maqueta; las subpáginas siguen ocultas |
| 20 | Botones sin relleno con borde gris (`#55544F`) sobre Tinta, como la maqueta | El texto del botón lo identifica (WCAG 1.4.11 no exige contraste al borde en ese caso); sobre Piedra el borde sigue siendo Tinta |
| 21 | Etiquetas nuevas de la maqueta: "Lo que hacemos", "Proceso", "Contacto" (en inglés "What we do", "Process", "Contact") | Están en la maqueta; el brief dice "sigue las maquetas" |
| 22 | Entre la rebanada 4 y la 5 las siete preguntas generales no están en ninguna página | El brief saca las preguntas del inicio en la 4 y crea su página en la 5; el sitio sigue cerrado a buscadores |
| 23 | La galería de prueba se retira al cerrar la rebanada 4 | El inicio real ya lleva escenas y carrusel: las mismas pruebas corren contra `/` y `/en`, también en `verify-deploy` |
| 24 | En celular, el nombre de la pestaña del carrusel sale antes de que entre el siguiente (la maqueta los cruza) | Dos nombres encimados durante el cruce no se leen |
| 25 | Rama desechable `diag/lighthouse-open` con un workflow propio que repite "lighthouse-open" e imprime las métricas de cada pasada | `verify-deploy` solo dice pasa o falla y no guarda los informes; así se mide en el runner sin desplegar, sin abrir issues y sin tocar el workflow real. No se fusiona; se borra al cerrar el lote |
| 26 | En el inicio, las bandas bajo el carrusel se dibujan al acercarse (`content-visibility: auto`) y los saltos a un ancla son directos, no suaves | Arreglo del fallo de `verify-deploy` de la rebanada 4 (tiempo de bloqueo en el runner) |
| 27 | Página de preguntas con textos nuevos provisionales (frase, "Para empezar.", metadatos) | El brief no los trae; se reutilizan los de la rama sin publicar. **A confirmar por el fundador** |
| 28 | La página de preguntas no lleva escenas ni avisos de marca | Es texto; habla de las cinco líneas, como el inicio |
| 29 | Cada línea enlaza a su grupo de preguntas desde el cierre, no desde una sección aparte | Un solo enlace por página; el cierre de una línea cae en `#<línea>` |
| 30 | La entrada al bajar dura los primeros 8rem del bloque y el fundido los primeros 2,5rem (la maqueta: 80 % del bloque) | Un bloque alto quedaba bajo contraste AA con la página en reposo; lo marcó axe |
| 31 | Pie sin separadores entre las líneas | Así es la maqueta; cierra el ítem 40 del backlog |
| 32 | Presupuesto de peso: el documento del inicio cabe en 14.600 bytes; lo vigila el humo (13.560 de cuerpo en gzip) | Por encima, Lighthouse simula una ida y vuelta más y el rendimiento del build abierto queda al filo |
| 33 | Looks con nombre en `globals.css` en vez de listas largas de utilidades en botones, títulos, cabecera, pie e inicio | Cada lista larga viaja dos veces por documento (HTML y datos de Next) |
| 34 | El contenido del menú de celular y del desplegable de Servicios se dibuja al abrirlos, no viene en el HTML | Cerrados no se ven y pesaban 8 KB por página. Sin script sus controles ya eran enlaces (al pie y a `/servicios`); los enlaces a las líneas siguen en el pie. **Cambia el HTML de la cabecera, no su aspecto ni su comportamiento** |
| 35 | Las palabras de las escenas las escribe la hoja de estilos por idioma (`:lang(en)`), y el interior de cada escena es un fragmento de HTML fijo | Como elementos de React con atributos, las escenas eran una cuarta parte del documento. Una prueba unitaria exige el par en inglés de cada palabra |
| 36 | El cierre y el pie de todas las páginas se calculan al acercarse (`content-visibility: auto`) | Menos trabajo en el primer layout; nunca están en la primera pantalla |
| 37 | Rama desechable `diag/lighthouse-diet` (segunda de diagnóstico) | Para no reescribir la primera; mismas reglas: no se fusiona, se borra al cerrar el lote |
| 38 | Índice de servicios sobre Tinta con las tarjetas del inicio (3 + 2 en ventana ancha) | "Cada línea es una tarjeta con su escena": se usa la tarjeta de la maqueta, sobre su mismo fondo |
| 39 | Primera pantalla de las líneas: texto 3/5 y escena 2/5; mismo tamaño de título en las cinco líneas; sale la pieza del corchete | Con la escena al lado, el título grande de Minecraft y Discord se partía en cinco renglones |
| 40 | Títulos en peso 800 en todo el sitio; mínimo del título de página de 30 a 29 px | Un solo peso de título en el sitio; en 800, "DEVELOPMENT" desbordaba 3 px a 320 px |
| 41 | La entrada al bajar llega a las demás páginas por sus bloques compartidos | "Heredan la entrada al bajar" |
| 42 | El pie de la 404 sigue al pie nuevo | Es un pie propio; si no, quedaba con el viejo |

## Evidencia

### Antes de empezar

- Punto de restauración del Workspace: `20261116-210841-kardenum-fase-2-redise-o-visual-sesi-n-n`.
- `main` local = `origin/main` = `a8636ef`. Rama `feat/motion-and-service-visuals` en `58b53e7`, solo local, sin tocar.
- Unidad E: medida antes del primer build: `pnpm typecheck` en 16 s (el 2026-11-16 por la mañana no terminaba). Se
  trabaja en E: y la puerta de clon limpio corre en C:.

### Rebanada 1 (`87cfd88`)

- `verify-deploy` a mano, antes de cambiar nada: corrida 44001275728, success en 6 min 38 s.

### Rebanada 2 (`d438bd1`): escenas

- Puerta de clon limpio (C:): build con 143 unitarias, 0 fallos (5 nuevas, `src/lib/motion-rules.test.ts`); tabla de
  rutas sin `ƒ` fuera del proxy; humo `OK: all 1051 checks passed (noindex)`; navegador 829 passed, 41 skipped (las 24
  de `e2e/scenes.spec.ts` se omiten solas: ninguna página publicada tiene escenas todavía).
- Galería de prueba (`docs/pruebas/escenas-de-prueba`, en un clon de C: con los mismos archivos):
  `e2e/scenes.spec.ts` 24 passed (1280 y 390 px, es y en, movimiento reducido y sin JavaScript).
- Vistas a ojo contra la maqueta, a 900 y 300 px: las cinco coinciden.
- `verify-deploy` tras el despliegue: corrida 44002958854, success en los tres trabajos.

### Rebanada 3 (`2a93d0e` y `78962ae`): carrusel

- La primera puerta falló en el build: un error de tipos en la prueba nueva (`motion-rules.test.ts`), que yo había
  corrido sin pasar antes por `tsc`. Corregido en `78962ae`; desde entonces, tipos después de cada cambio.
- Puerta de clon limpio de `78962ae`: 144 unitarias, 0 fallos; humo `OK: all 1051 checks passed (noindex)`;
  navegador 829 passed, 65 skipped. Con la galería de prueba sobre el mismo clon: `scenes.spec.ts` y
  `carousel.spec.ts`, 47 passed, 1 skipped (la del cursor, en el proyecto táctil).
- Lo que comprueba `carousel.spec.ts` moviendo el reloj de las animaciones: 46 % y 2 % (78 % y 3 % en celular),
  vecinas a 0,32, cinco pasos de 2,8 s quietos y 0,7 s de cambio, vuelta sin salto, pestañas, pausa con la casilla,
  con el foco y con el cursor, sin JavaScript, CLS menor de 0,03 durante un paso, y con movimiento reducido la tira
  deslizable con cada escena al centro.
- Medido antes de construir sobre él (galería, celular): axe sin violaciones tras la decisión 11; primer pintado
  0,8 s tras la decisión 12.
- `verify-deploy`: corrida 44004820274, success en los tres trabajos.

### Rebanada 4 (`3f672fd`): inicio

- Puerta de clon limpio: 144 unitarias; humo `OK: all 1055 checks passed (noindex)`; navegador 884 passed, 18 skipped.
- Lighthouse local sobre el inicio real (celular): accesibilidad 1,00, buenas prácticas 1,00 (texto legible 73,8 % y
  70,7 %), rendimiento 0,95 con LCP simulado de 3,0 s.
- `verify-deploy` (corrida 44006779132): **falló un trabajo de tres.** "Lighthouse on the open build" dio rendimiento
  0,94 en `/` (pasadas 0,82, 0,93 y 0,94; el mínimo es 0,95). `/en` y las otras cinco páginas pasaron; humo, axe y
  navegador pasaron; Lighthouse contra el despliegue en Railway pasó. El workflow abrió el issue #3.

**Diagnóstico (medido en local, 2026-11-16 por la noche):**

| Hipótesis | Medida | Resultado |
|---|---|---|
| El movimiento retrasa el LCP | Lighthouse con `--force-prefers-reduced-motion` | Descartada: LCP simulado 3010 ms con animaciones y 3008 sin ellas |
| El primer pintado llega tarde | Bandas inferiores con `content-visibility` (FCP observado de 124 a 112 ms) | Descartada: el LCP simulado no cambió (3010 ms) |
| El documento no cabe en la primera ráfaga de TCP | Tamaño transferido: inicio 17.089 bytes, `/servicios` 11.562, `/servicios/minecraft` 14.051 | **Confirmada:** Lighthouse simula el arranque lento de TCP (10 segmentos de 1.460 bytes = 14.600). El inicio paga una ida y vuelta más: FCP simulado 910 ms frente a 760 ms en las otras dos, exactamente los 150 ms de la latencia simulada |

- De qué está hecho el documento del inicio (gzip): 15,7 KB, de los cuales 9,3 KB son los datos que Next escribe para
  el navegador (repiten el HTML) y 2,3 KB la cabecera. Las escenas ocupan unos 3 KB entre las dos copias.
- Lo que más pesa y menos se ve: las cadenas largas de clases, que viajan dos veces. Con todas acortadas el
  documento bajaría 3,1 KB (emulado sobre el HTML servido); solo las del contenido del inicio, 1,6 KB.
- Lo que el diagnóstico todavía no explica: la pasada de 0,82. Las escenas animadas provocan unas 30
  recalculaciones de estilo por segundo en el hilo principal (medido); si en el runner eso se vuelve tiempo de
  bloqueo, aligerar el documento no lo arregla. Por eso el siguiente paso es medir en el runner, por pasada, desde
  una rama de diagnóstico que no despliega.
**Medido en el runner (rama `diag/lighthouse-open`, corrida 44009883667; mismo build abierto, métricas por pasada):**

| Página | Rendimiento | LCP simulado | TBT | Documento |
|---|---|---|---|---|
| `/` | 0,87 · 0,93 · 0,94 | 3,04 · 2,94 · 2,96 s | **322 · 160 · 86 ms** | 16.716 bytes |
| `/en` | 0,95 · 0,93 · 0,94 | 2,92 · 2,98 · 2,92 s | **60 · 136 · 94 ms** | 16.516 |
| `/servicios/minecraft` | 0,95 · 0,97 · 0,95 | 2,89 · 2,58 · 2,91 s | 58 · 47 · 73 ms | 15.432 |
| `/servicios` | 0,96 · 0,98 · 0,96 | 2,78 · 2,43 · 2,76 s | 62 · 48 · 66 ms | 11.306 |

- **El diagnóstico local estaba incompleto.** El escalón de 14.600 bytes existe (la línea Minecraft también lo
  paga desde antes y pasa), pero no es lo que tumba al inicio: su LCP es el mismo que el de la línea Minecraft. Lo
  que lo tumba es el **tiempo de bloqueo**, que en mi máquina no se veía (20 a 30 ms en todas las páginas) porque
  el runner es 1,5 veces más lento (índice de CPU 2.350 frente a 3.600).
- Causa, con una traza y la CPU frenada 6×: la primera tarea de layout del inicio dura 310 ms (215 ms en la línea
  Minecraft, 173 ms en `/servicios`); la tarea de scripts es igual en todas (203 ms).
- **Intento de arreglo 1:** las bandas del inicio que quedan bajo el carrusel ("Lo que hacemos" y "Cómo
  trabajamos") no se calculan ni se pintan hasta que el visitante se acerca (`content-visibility: auto`), con una
  altura estimada por ancho. Para que un salto a un ancla caiga siempre en su sitio, una página con esas bandas
  salta en vez de desplazarse suave. Con el multiplicador de CPU del runner (6× aquí), el inicio queda en 56 a 90 ms
  de bloqueo, el rango de las demás páginas (42 a 80 ms). Se mide en el runner desde la rama de diagnóstico antes de
  subirlo a `main`.

**El arreglo medido en el runner (corrida de diagnóstico 44012172057 sobre `ce9e22f`, mismo código que `d23fe40`):**

| Página | Rendimiento | LCP simulado | TBT |
|---|---|---|---|
| `/` | 0,81 · 0,95 · 0,95 → pasa | 2,98 · 2,88 · 2,88 s | 528 · **42 · 41 ms** |
| `/en` | 0,95 · 0,95 · 0,94 → pasa | 2,88 · 2,88 · 3,02 s | 43 · 70 · 26 ms |
| `/servicios/minecraft` | 0,94 · 0,95 · 0,95 → pasa | 3,02 · 2,87 · 2,88 s | 23 · 31 · 43 ms |

- El bloqueo del inicio en caliente queda igual al de las demás páginas. La primera pasada de `/` sigue siendo mala
  (es la primera página que mide Lighthouse CI con el servidor recién arrancado); la regla de la pasada mediana la
  absorbe, pero deja al inicio sin tolerancia: sus otras dos pasadas tienen que dar 0,95 las dos.
- **Margen fino, y no es nuevo:** toda página cuyo documento pasa de 14.600 bytes (el inicio, y la línea Minecraft
  desde antes de esta fase) da 0,94 a 0,95 en el build abierto. Un `verify-deploy` en rojo por un 0,94 aislado en
  `/` es posible sin que nada haya cambiado. Bajar el documento del inicio de 16,9 a menos de 14,6 KB daría ese
  margen (LCP de 2,88 a 2,72 s), pero emulado sobre el HTML servido exige acortar las 116 cadenas largas de clases
  del sitio, cabecera incluida: va al backlog con sus números.
- El runner de esta corrida era más rápido que el de la primera (índice de CPU 3.700 a 4.000 frente a 2.350): las
  cifras absolutas no se comparan entre corridas; la comparación válida es el inicio contra las demás páginas de
  la misma corrida.

**Intento 1 desplegado (`d23fe40`, verify-deploy 44013432702):** los dos trabajos de Lighthouse pasaron. Falló
el de navegador, por otra causa: `scenes.spec.ts` "the control of the page pauses and resumes all of them", en
escritorio, en `/` y `/en` (882 passed, 2 failed). Tras reanudar, 63 animaciones seguían "en pausa".

- Causa: la prueba contaba todas las animaciones de la página. Las de una escena que el navegador ya no dibuja
  (lejos de la pantalla, `content-visibility: auto`) conservan el estado en que quedaron hasta que la escena vuelve
  a dibujarse. En mi máquina y contra producción la prueba pasaba; en el runner, más lento, no. El sitio hace lo
  correcto: al volver a pantalla, la escena sigue el estado de la página.
- **Intento 2 (`68b1b80`, solo pruebas):** la prueba cuenta las animaciones de lo que se está dibujando
  (`checkVisibility({ contentVisibilityAuto: true })`) y comprueba algo más: una escena del final de la página llega
  en pausa cuando el visitante baja hasta ella con la página pausada, y se mueve en cuanto se reanuda. No se
  debilitó ninguna aserción: la de "nada queda en pausa" sigue, sobre el conjunto correcto.
- Comprobado antes de `main`: tres pasadas locales (47 passed) y una contra producción (47 passed); y
  `verify-deploy` lanzado a mano sobre la rama temporal `tmp/verify-tests` (no despliega).

### El margen del inicio vuelve a fallar en la rebanada 5 y se arregla de raíz (`bb20f33`)

- La verificación de la rebanada 5 (44017531353) falló en el mismo punto que la 4: Lighthouse sobre el build
  abierto, `/` con 0,71 · 0,94 · 0,94. La rebanada 5 no tocó el inicio: es el margen fino que quedó anotado arriba.
  La primera pasada de `/` siempre es mala (servidor recién arrancado), así que sus otras dos tienen que dar 0,95
  las dos, y con el documento por encima de la primera ráfaga de TCP dan 0,94 o 0,95 según el día.
- Otra medida en el runner, con la rebanada 6 ya escrita y sin dieta (44018814875, runner lento, índice 2.350):
  `/` 0,91 · 0,91 · 0,95 (TBT 211 · 207 · 70); `/servicios/minecraft` con su escena 0,92 · 0,94 · 0,95;
  `/servicios` con cinco escenas 0,96 · 0,96 · 0,94. Con escenas y sin dieta, la línea Minecraft también caería.
- **Arreglo: dieta del documento, sin cambiar un píxel** (spec 012, decisiones 20 y 21). Qué se probó y cuánto dio,
  medido sobre el HTML servido (bytes transferidos de `/`, gzip más cabeceras):

  | Paso | `/` | Nota |
  |---|---|---|
  | Antes | 17.076 | 2.476 por encima de 14.600 |
  | Looks con nombre para botones, contenedor y bloques del inicio | 16.535 | −541 |
  | Menú de celular y desplegable de Servicios fuera del HTML mientras están cerrados | 15.875 | −660, en todas las páginas |
  | Palabras de las escenas desde la hoja de estilos e interior de cada escena como HTML fijo | 15.106 | −769 |
  | Looks con nombre para la cabecera, el pie, el enlace a preguntas y lo que quedaba del inicio | 14.280 | −826 |
  | Colores del símbolo de la escena de diseño desde la hoja | 14.227 | −53; en inglés, 14.012 |

  Descartado por los números: acortar solo las clases del contenido (no alcanzaba: 15.039), quitar elementos de
  las escenas (el gzip ya comprime la repetición), y convertir las 116 cadenas largas del sitio una por una.
- Comprobado que no cambia nada a la vista: 26 capturas idénticas byte a byte entre producción (sin dieta) y el
  build con dieta, a 1280 y 390 px, en once páginas y con el menú de celular y el desplegable abiertos.
- Puerta de clon limpio de `bb20f33`: 148 unitarias; humo `OK: all 1195 checks passed`; navegador 924 passed.
- **En el runner (rama `diag/lighthouse-diet`, corrida 44021517261, runner rápido):** `/` 0,96 · 0,96 · 0,95
  (documento 14.123 bytes; LCP 2,74 · 2,73 · 2,88 s; TBT 53 · 29 · 41 ms, y por primera vez la primera pasada no
  es mala); `/en` 0,96 · 0,96 · 0,95; `/servicios/minecraft` 0,96 · 0,96 · 0,96; las demás 0,95 a 0,96.
- **Efecto secundario medido, pendiente:** la hoja de estilos pasó de 13.227 a 15.060 bytes transferidos (los
  looks con `@apply` repiten declaraciones y las palabras de las escenas pesan 718 bytes). También tiene su
  ráfaga de 14.600: el FCP simulado de las páginas pequeñas subió de 0,78 a 0,92 s. Su LCP y su puntaje no
  cambiaron en esa corrida (0,95 a 0,96), salvo `/nosotros`, que dio 0,95 las tres veces (antes 0,95 a 0,98). Se
  pidió una segunda muestra del mismo commit antes de subir. Lo que se sabe para bajarla: 746 bytes son reglas
  `@font-face` de alfabetos que el sitio no usa (cirílico, griego, vietnamita, latín extendido) que `next/font`
  emite siempre; reagrupar los looks da 177.

- **Criterio de reversión (intento 1 de 2):** si tras el segundo intento `verify-deploy` sigue en rojo, `git revert`
  de `3f672fd` y se sigue con la rebanada 5, que no depende del inicio nuevo.
- El trabajo adelantado de la rebanada 5 está en la rama `wip/fase-2-rebanada-5` (no despliega).

## Riesgos medidos y abiertos

- **Auditoría "font-size" de Lighthouse (buenas prácticas):** cuenta como ilegible todo texto de menos de 12 px,
  también el dibujado por CSS dentro de las escenas (en un celular miden unos 5 px). Falla si menos del 60 % del
  texto de la página es legible. En la galería (casi todo era escena) fallaba. **En el inicio real pasa:** 73,8 % de
  texto legible en español y 70,7 % en inglés (medido el 2026-11-16). Si el inicio ganara escenas o perdiera texto,
  esta auditoría sería la primera en caer: buenas prácticas bajaría a 0,96.
- **Presupuesto de bytes por documento: 14.600 transferidos.** Cualquier página cuyo HTML comprimido pase de ahí
  pierde 150 ms de LCP simulado. `/servicios/minecraft` está en 14.051: con una escena encima lo cruza (rebanada 6).
- **Rendimiento del inicio, sin margen en la medida local.** Lighthouse local (Windows, servidor en la misma
  máquina, limitación simulada; tres pasadas con la configuración de `verify-deploy`): inicio 0,95 con LCP simulado
  de 3,0 s en `/` y `/en`; una página sin escenas (`/servicios`, `/nosotros`) da 0,95 a 0,96 con 2,7 a 2,9 s. LCP y
  primer pintado *observados*: 0,15 a 0,2 s. Con las animaciones apagadas el LCP simulado es el mismo (3,0 s): la
  diferencia no es el movimiento, es el primer render de un documento más grande (950 nodos frente a 438; 108 ms
  de tareas frente a 85 ms, sin limitación). La medida que decide es la de `verify-deploy` en el runner.
- **Las animaciones sí ocupan el hilo principal** mientras corren: estilo y layout pasan de 173 ms a 799 ms en la
  traza de Lighthouse (con CPU limitada 4×). No bloquean (TBT de 20 a 30 ms) ni mueven la página (CLS 0), pero es
  trabajo continuo en el celular del visitante. El control de pausa y `prefers-reduced-motion` lo apagan.

## Pendiente para el backlog

(se pasa a `docs/BACKLOG.md` al cerrar el lote)

- **Documento del inicio bajo 14.600 bytes** (hoy 16.935 en `/` y 16.722 en `/en`): quita la ida y vuelta extra
  que simula Lighthouse (150 ms de LCP) y da margen al rendimiento del build abierto. Emulado: acortar todas las
  cadenas largas de clases (116, cabecera incluida) y dibujar las palabras de las escenas desde CSS lo deja en
  13.498. Solo las clases del contenido y del pie no alcanza (14.765). Lo mismo para la línea Minecraft (15.530).
- `verify-deploy` no guarda los informes de Lighthouse: `upload-artifact` descarta la carpeta oculta
  `.lighthouseci` ("No files were found with the provided path"). Hace falta `include-hidden-files: true`. No se
  tocó porque el brief pide no tocar el workflow: los puntajes por página del informe son medidas locales.

- Redes sociales en el pie (pedido del 2026-11-16 que quedó en la rama sin publicar).
- Transiciones entre páginas (las menciona el plan de la fase, no el brief).
- Recordar la pausa del movimiento entre páginas.

## Páginas que conviene revisar a ojo

(se llena al cerrar cada rebanada)
