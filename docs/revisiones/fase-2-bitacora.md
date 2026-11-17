# Fase 2 · Bitácora de la sesión sin supervisión

Sesión nocturna del 2026-11-16. Encargo: `docs/handoff/fase-2/BRIEF-FASE-2.md`. Spec: `docs/specs/012-fase-2-rediseno-visual.md`.
Este archivo se actualiza al cerrar cada rebanada: de aquí sale el informe final.

## Estado por rebanada

| # | Rebanada | Estado | Commit | `verify-deploy` |
|---|---|---|---|---|
| 1 | Spec, plan y bitácora | **hecha** | `87cfd88` | corrida manual 44001275728: success (línea base; un push sin `web/**` no despliega) |
| 2 | Cinco escenas y control de pausa | **en producción** | `d438bd1` | 44002958854: success (los tres trabajos) |
| 3 | Carrusel | en curso | — | — |
| 4 | Inicio completo | pendiente | — | — |
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

## Riesgos medidos y abiertos

- **Auditoría "font-size" de Lighthouse (buenas prácticas):** cuenta como ilegible todo texto de menos de 12 px,
  también el dibujado por CSS dentro de las escenas (en un celular miden unos 5 px). Falla si menos del 60 % del
  texto de la página es legible. En la galería (casi todo es escena) falla y buenas prácticas queda en 0,96, que
  aún pasa el mínimo de 0,95. Se mide de nuevo sobre el inicio real en la rebanada 4.
- Lighthouse local (Windows, limitación simulada) da LCP de 2,7 s y rendimiento 0,96 también en páginas sin escenas
  (`/servicios`, `/nosotros`): es de la máquina, no del cambio. La medida que decide es la de `verify-deploy`.

## Pendiente para el backlog

(se pasa a `docs/BACKLOG.md` al cerrar el lote)

- Redes sociales en el pie (pedido del 2026-11-16 que quedó en la rama sin publicar).
- Transiciones entre páginas (las menciona el plan de la fase, no el brief).
- Recordar la pausa del movimiento entre páginas.

## Páginas que conviene revisar a ojo

(se llena al cerrar cada rebanada)
