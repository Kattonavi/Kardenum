# Fase 2 · Informe final

Sesión sin supervisión del 2026-11-16 al 17. Encargo: `docs/handoff/fase-2/BRIEF-FASE-2.md`.
Detalle de cada paso, con todas las medidas: `docs/revisiones/fase-2-bitacora.md`. Spec: `docs/specs/012-fase-2-rediseno-visual.md`.

**Las ocho rebanadas están en producción y verificadas.** `main` quedó en `0aec3aa`. No se encendió ningún flag, el
sitio sigue cerrado a buscadores, no se tocó ninguna variable de Railway ni el workflow `verify-deploy`, y no hay
dependencias nuevas (`package.json` y el lockfile no cambiaron).

## 1. Rebanadas en producción

| # | Rebanada | Commits | `verify-deploy` (los tres trabajos en verde) |
|---|---|---|---|
| 1 | Spec, plan y bitácora | `87cfd88` | 44001275728 (manual; un push sin `web/**` no despliega) |
| 2 | Cinco escenas y control de pausa | `d438bd1` | 44002958854 |
| 3 | Carrusel | `2a93d0e`, `78962ae` | 44004820274 |
| 4 | Inicio completo, es y en | `3f672fd`, `d23fe40`, `68b1b80` | 44016256510 (al segundo arreglo) |
| 5 | Pie nuevo y página de preguntas | `8b07a3b`, `5684ba2`, `bb20f33` | 44024408090 (tras un arreglo de fondo) |
| 6 | Índice de servicios y las cinco líneas | `cebb917` | 44025551912 |
| 7 | Subpáginas (tras su flag), pie de la 404, entrada al bajar en el resto | `b1a3eb5` | 44026730842 |
| 8 | Revisiones del lote y sus arreglos | `0aec3aa` | 44029900173 |

Ninguna rebanada se revirtió. Hubo tres verificaciones en rojo (44006779132, 44013432702 y 44017531353) y dos
avisos automáticos (issues 3 y 4), ya cerrados con su explicación:

- **Qué falló dos veces:** Lighthouse sobre el build abierto daba 0,94 de rendimiento en `/` (mínimo 0,95). El
  inicio nuevo pesa más que el anterior y quedó al filo.
- **Primer arreglo (`d23fe40`):** lo que está fuera de pantalla se dibuja al acercarse. Lighthouse pasó, pero ese
  cambio hizo fallar una prueba de la pausa que contaba escenas que el navegador ya no dibujaba (la tercera
  verificación en rojo; arreglo de la prueba en `68b1b80`). El margen seguía siendo de una centésima y la rebanada
  5 volvió a caer sin haber tocado el inicio.
- **Arreglo de fondo (`bb20f33`):** el documento del inicio pasó de 17.076 a 14.245 bytes transferidos sin cambiar
  un píxel (26 capturas idénticas contra producción). Con eso cabe en la primera ráfaga de red que simula
  Lighthouse. Desde entonces, en las cuatro corridas de diagnóstico las pasadas en caliente de `/` dan 0,95 a 0,96,
  las cuatro verificaciones oficiales siguientes pasaron y la prueba de humo vigila ese peso.

## 2. Evidencia

**Pruebas del último commit (`0aec3aa`), en clon limpio:** build con lint, tipos y 148 pruebas unitarias; humo
`OK: all 1285 checks passed`; navegador (Playwright y axe a 1280 y 390 px) `1124 passed`, 18 omitidas (las de
funciones apagadas o propias de un solo ancho).

**Lighthouse por página, en el runner de GitHub** (build abierto del commit `b1a3eb5`, tres pasadas, corrida
44026678030). Accesibilidad, buenas prácticas y SEO: **1,00 en las 14 páginas**. CLS: **0 en todas**.

| Página | Rendimiento | LCP simulado |
|---|---|---|
| `/` | 0,87 · 0,95 · 0,96 | 2,7 a 2,9 s |
| `/en` | 0,96 · 0,96 · 0,96 | 2,7 s |
| `/servicios` · `/en/services` | 0,95 a 0,98 · 0,96 | 2,4 a 2,9 s |
| Las cinco líneas | 0,95 a 0,96 | 2,7 a 2,9 s |
| `/preguntas-frecuentes` · `/en/faq` | 0,95 · 0,95 · 0,95 y 0,94 · 0,95 · 0,95 | 2,9 a 3,0 s |
| `/nosotros`, `/contacto`, `/legal/privacidad` | 0,96 a 0,98 | 2,4 a 2,7 s |

Lo que hay que saber de esta tabla:

- El LCP es el **simulado** en un celular lento; el medido de verdad en el runner va de 0,14 a 0,23 s. El objetivo
  del brief (2,5 s) se cumple en lo medido, no en lo simulado, igual que antes de la fase 2.
- La primera pasada de `/` (0,87) es la del servidor recién arrancado. Pasa siempre, también antes de la fase 2.
- **La página de preguntas pasa sin margen** y `verify-deploy` no la mide (backlog 61).
- INP: Lighthouse no lo mide sin interacción. El bloqueo total va de 30 a 100 ms con la CPU limitada.
- `verify-deploy` mide solo siete de estas páginas y no guarda sus informes (backlog 63). Las demás cifras salen
  de una rama de diagnóstico que repite su mismo trabajo.

**Revisiones del lote** (cada revisor recibió la spec y el código):

| Revisión | Resultado |
|---|---|
| Código | **Aprobado.** 0 Crítico, 0 Alto, 1 Medio (arreglado), 7 Bajo |
| Seguridad | **No bloquea.** 0 hallazgos con severidad; 2 informativos |
| Navegador real, de 320 a 1920 px | Sin fallas de Crítico a Medio; 2 Bajo |
| SEO técnico | **No rompe nada.** 2 hallazgos de texto (uno Medio), al backlog |
| Diseño contra las maquetas | **Fiel con ajustes.** 1 Alto que no apliqué (ver decisiones), 4 Medio, 2 Bajo |

## 3. Decisiones que tomé por mi cuenta

Están las 48 en la bitácora. Las que cambian lo que se ve o cómo se trabaja:

1. **Partí de `main`.** La rama del lote cancelado (`feat/motion-and-service-visuals`) quedó intacta y sin fusionar.
2. **Ancho de página de 1200 px, no los 1320 de la maqueta**, para alinear el inicio con la cabecera actual. Es la
   diferencia más visible con la maqueta y la revisión de diseño la marcó. **Es lo primero que conviene decidir.**
3. **La cabecera no se tocó**, aunque la revisión de diseño marcó como Alto que "Cotizar" va con borde y la maqueta
   lo dibuja relleno. El brief dice "Cabecera: la actual", y ante un choque gana la regla.
4. **Botón "Pausar animación" en toda página con escenas**, como casilla que funciona sin script. Al pausar, el
   carrusel se congela y las escenas pasan a su dibujo completo (congeladas quedaban a medio dibujar).
5. **Las pestañas del carrusel son indicadores, no botones**, como en la maqueta: con solo CSS no se salta a una
   escena. Con movimiento reducido el carrusel es una fila que se desliza a mano.
6. **Las palabras dentro de las escenas las dibuja la hoja de estilos**, en el idioma de la página. Como texto real
   de pocos píxeles fallaban contraste, tamaño mínimo y zoom.
7. **El contenido de los menús cerrados ya no viene en el HTML**: se dibuja al abrirlos. No cambia su aspecto ni su
   uso; sin script, sus botones ya llevaban al pie y a `/servicios`. Fue parte del arreglo de peso.
8. **Títulos en peso 800 en todo el sitio**, no solo en el inicio.
9. **Líneas:** texto en tres quintos y escena en dos; mismo tamaño de título en las cinco; sale la pieza del corchete
   de Minecraft y Discord. **Índice de servicios:** tarjetas del inicio sobre Tinta, tres arriba y dos abajo.
10. **Un solo cierre centrado para todo el sitio**, con el enlace a preguntas; en una línea lleva a su grupo.
11. **Página de preguntas con 23 preguntas** (las 7 generales y las de cada línea), no 34: es lo que había.
12. **No cambié textos no listados**, tampoco los dos que marcó la revisión de SEO.
13. **Dos ramas de diagnóstico** con un workflow propio que solo mide y nunca se fusiona, para ver en el runner lo
    que `verify-deploy` no muestra. No toqué el workflow oficial.
14. **Paré de optimizar al tener margen real.** La hoja de estilos quedó 500 bytes sobre su ráfaga; medido en tres
    corridas, no cuesta puntos. Bajarla exige cambiar la carga de fuentes y va al backlog.

## 4. Backlog

`docs/BACKLOG.md`, ítems 57 a 71. Se cierran el 13 (movimiento) y el 40 (el "·" colgando en el pie).

- **Para decidir tú:** ancho de página (57), cabecera frente a la maqueta (58), título de las líneas con la escena
  al lado (59), la pregunta repetida en dos grupos (64) y el título repetido entre inicio y servicios (65).
- **Antes del lanzamiento:** peso de la hoja de estilos (60), peso de la página de preguntas (61), margen del
  inicio al completar los datos de contacto (62).
- **Pulido:** redes en el pie (66), transiciones entre páginas (67), recordar la pausa (68), código muerto (69),
  una prueba que asume un ancho (70), detalles menores de las revisiones (71), informes de Lighthouse que el
  workflow no guarda (63).

## 5. Páginas que conviene revisar a ojo

Producción: `https://web-production-f1d7c246.up.railway.app`. Capturas de la noche, con las maquetas al lado, en
`.impeccable/review/fase-2/` (no se versionan).

1. **Inicio a 1440 px junto a la maqueta:** el ancho de página (punto 2 de las decisiones) y el pie en dos filas.
2. **Inicio en celular (390 px):** con la franja de idioma arriba, la escena del carrusel apenas asoma en la primera
   pantalla.
3. **Botón "Pausar animación"** bajo el carrusel: pulsarlo una vez y ver que el resultado es el esperado.
4. **`/servicios/desarrollo` y `/servicios/minecraft`:** el título ocupa cuatro renglones junto a la escena.
5. **`/servicios`:** las cinco tarjetas, tres y dos.
6. **`/preguntas-frecuentes`:** el orden de los grupos y la pregunta repetida entre Minecraft y Discord.
7. **Una subpágina** (oculta; se entra por su dirección, por ejemplo `/servicios/desarrollo/tiendas-online`): "DE"
   queda solo en un renglón del título.
8. **Una dirección inexistente:** el pie nuevo en la 404.

## 6. Lo que dejé sin hacer a propósito

- **Borrar las ramas desechables.** Borrar en el remoto no tiene vuelta atrás, así que lo decides tú. Ninguna se
  fusiona ni despliega nada:
  `git push origin --delete diag/lighthouse-open diag/lighthouse-diet wip/fase-2-rebanada-5 wip/fase-2-rebanada-6`
- **El punto de restauración** de antes de empezar sigue ahí
  (`20261116-210841-kardenum-fase-2-redise-o-visual-sesi-n-n`): tú decides `aceptar` o `restaurar` con
  `py -3 scripts/punto-restauracion.py`, desde el Workspace. No cubre lo ya desplegado.
