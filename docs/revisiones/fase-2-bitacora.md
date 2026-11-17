# Fase 2 · Bitácora de la sesión sin supervisión

Sesión nocturna del 2026-11-16. Encargo: `docs/handoff/fase-2/BRIEF-FASE-2.md`. Spec: `docs/specs/012-fase-2-rediseno-visual.md`.
Este archivo se actualiza al cerrar cada rebanada: de aquí sale el informe final.

## Estado por rebanada

| # | Rebanada | Estado | Commit | `verify-deploy` |
|---|---|---|---|---|
| 1 | Spec, plan y bitácora | en curso | — | — |
| 2 | Cinco escenas y control de pausa | pendiente | — | — |
| 3 | Carrusel | pendiente | — | — |
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

## Evidencia

### Antes de empezar

- Punto de restauración del Workspace: `20261116-210841-kardenum-fase-2-redise-o-visual-sesi-n-n`.
- `main` local = `origin/main` = `a8636ef`. Rama `feat/motion-and-service-visuals` en `58b53e7`, solo local, sin tocar.
- Unidad E: medida antes del primer build: `pnpm typecheck` en 16 s (el 2026-11-16 por la mañana no terminaba). Se
  trabaja en E: y la puerta de clon limpio corre en C:.

## Pendiente para el backlog

(se pasa a `docs/BACKLOG.md` al cerrar el lote)

- Redes sociales en el pie (pedido del 2026-11-16 que quedó en la rama sin publicar).
- Transiciones entre páginas (las menciona el plan de la fase, no el brief).
- Recordar la pausa del movimiento entre páginas.

## Páginas que conviene revisar a ojo

(se llena al cerrar cada rebanada)
