# Fase 2 · Bitácora de la sesión sin supervisión

Sesión nocturna del 2026-11-16. Encargo: `docs/handoff/fase-2/BRIEF-FASE-2.md`. Spec: `docs/specs/012-fase-2-rediseno-visual.md`.
Este archivo se actualiza al cerrar cada rebanada: de aquí sale el informe final.

## Estado por rebanada

| # | Rebanada | Estado | Commit | `verify-deploy` |
|---|---|---|---|---|
| 1 | Spec, plan y bitácora | **hecha** | `87cfd88` | corrida manual 44001275728: success (línea base; un push sin `web/**` no despliega) |
| 2 | Cinco escenas y control de pausa | **en producción** | `d438bd1` | 44002958854: success (los tres trabajos) |
| 3 | Carrusel | **en producción** | `2a93d0e` + `78962ae` | 44004820274: success (los tres trabajos) |
| 4 | Inicio completo | en curso | — | — |
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

## Riesgos medidos y abiertos

- **Auditoría "font-size" de Lighthouse (buenas prácticas):** cuenta como ilegible todo texto de menos de 12 px,
  también el dibujado por CSS dentro de las escenas (en un celular miden unos 5 px). Falla si menos del 60 % del
  texto de la página es legible. En la galería (casi todo era escena) fallaba. **En el inicio real pasa:** 73,8 % de
  texto legible en español y 70,7 % en inglés (medido el 2026-11-16). Si el inicio ganara escenas o perdiera texto,
  esta auditoría sería la primera en caer: buenas prácticas bajaría a 0,96.
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
