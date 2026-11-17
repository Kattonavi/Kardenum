# Fase 2 · Bitácora de la sesión sin supervisión

Sesión nocturna del 2026-11-16. Encargo: `docs/handoff/fase-2/BRIEF-FASE-2.md`. Spec: `docs/specs/012-fase-2-rediseno-visual.md`.
Este archivo se actualiza al cerrar cada rebanada: de aquí sale el informe final.

## Estado por rebanada

| # | Rebanada | Estado | Commit | `verify-deploy` |
|---|---|---|---|---|
| 1 | Spec, plan y bitácora | **hecha** | `87cfd88` | corrida manual 44001275728: success (línea base; un push sin `web/**` no despliega) |
| 2 | Cinco escenas y control de pausa | **en producción** | `d438bd1` | 44002958854: success (los tres trabajos) |
| 3 | Carrusel | **en producción** | `2a93d0e` + `78962ae` | 44004820274: success (los tres trabajos) |
| 4 | Inicio completo | **desplegada, verificación en rojo** (intento de arreglo 1 de 2 en curso) | `3f672fd` | 44006779132: humo y navegador success, Lighthouse contra el despliegue success, **Lighthouse sobre el build abierto failure** (rendimiento de `/`: 0,82 · 0,93 · 0,94; mínimo 0,95). Issue #3 abierto por el workflow |
| 5 | Pie y preguntas frecuentes | pendiente | — | — |
| 6 | Índice de servicios y líneas | pendiente | — | — |
| 7 | Subpáginas (tras su flag) | pendiente | — | — |
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

- `verify-deploy` no guarda los informes de Lighthouse: `upload-artifact` descarta la carpeta oculta
  `.lighthouseci` ("No files were found with the provided path"). Hace falta `include-hidden-files: true`. No se
  tocó porque el brief pide no tocar el workflow: los puntajes por página del informe son medidas locales.

- Redes sociales en el pie (pedido del 2026-11-16 que quedó en la rama sin publicar).
- Transiciones entre páginas (las menciona el plan de la fase, no el brief).
- Recordar la pausa del movimiento entre páginas.

## Páginas que conviene revisar a ojo

(se llena al cerrar cada rebanada)
