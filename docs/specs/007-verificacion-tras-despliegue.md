# 007 · Verificación automática tras cada despliegue

**Estado:** implementado y comprobado con una corrida real en verde y otra forzada a fallar (2026-11-15; `docs/revisiones/evidencia-paso7.txt`). **Fuente:** `docs/handoff/BRIEF.md`, paso 7 ("Pruebas automáticas en GitHub
Actions contra la URL de Railway: axe con Playwright en 390 y 1280 px, y Lighthouse CI") y la indicación del fundador
del 2026-11-15.

Después de cada despliegue de Railway, GitHub Actions comprueba el sitio que quedó en línea y avisa si algo falla. **El
workflow no despliega, no revierte y no cambia nada**: Railway sigue desplegando por su cuenta desde `main`.

## Requisitos

| # | Requisito |
|---|---|
| RF-1 | CUANDO Railway informa a GitHub que un despliegue de producción terminó bien, el workflow DEBE correr contra la dirección del sitio con el código de ese mismo commit. También DEBE poder lanzarse a mano. |
| RF-2 | El workflow DEBE correr la prueba de humo y la suite de navegador completa (axe incluido) en 1280 y 390 px contra el sitio desplegado. |
| RF-3 | El workflow DEBE medir con Lighthouse CI, en móvil, una página de cada tipo, y fallar si alguna categoría queda por debajo de 95: rendimiento, accesibilidad y buenas prácticas contra el sitio desplegado; las cuatro, con SEO, sobre el build abierto del mismo commit (con el sitio cerrado, su `noindex` haría fallar SEO sin que haya un defecto). |
| RF-4 | El workflow NO DEBE desplegar ni modificar nada: permisos de solo lectura sobre el código, sin secretos, sin pasos de despliegue. El build abierto que compila para medir no se publica en ninguna parte. |
| RF-5 | SI una comprobación falla, el workflow DEBE avisar: abre un issue en el repositorio (o comenta en el que ya esté abierto) con el commit, qué falló y el enlace a la corrida, y guarda los informes de la corrida. |
| RF-6 | Una verificación en curso DEBE cancelarse cuando llega un despliegue más nuevo, y solo entonces: los demás avisos de Railway sobre el mismo despliegue (en curso, el anterior pasa a inactivo) no deben cancelarla. |

## Decisiones (comprobadas el 2026-11-15)

- **Disparador:** `deployment_status`. Railway crea en GitHub un despliegue por cada publicación (entorno
  `kardenum / production`) y le pone estado `in_progress` y luego `success`; un push que no toca `web/**` no despliega
  y no dispara nada. No se usa `push`: el día que se active "Wait for CI" en Railway, un workflow de `push` que
  espera al despliegue se bloquearía con él.
- **Dirección bajo prueba:** escrita en el workflow (`SITE_UNDER_TEST`), junto con lo que se espera (`noindex`). El
  estado que publica Railway trae la dirección de su panel, no la del sitio. Al lanzar se cambian esas dos líneas.
- **Lighthouse CI** `@lhci/cli` 0.15.1 (Lighthouse 12.6.1; la 0.16 tiene menos de 30 días), fijada en el workflow y
  ejecutada con `npx`: no entra a `package.json`, para no cargar cada instalación ni cada build de Railway.
  Tres corridas por página; se juzga la corrida representativa.
- **Páginas medidas:** inicio en los dos idiomas, índice de servicios, una línea, Nosotros, Contacto y una legal.
- **`SITE_LAUNCH_CHECK=off` en GitHub Actions:** el build abierto tiene datos pendientes a propósito. Ese valor se
  acepta en local y en GitHub Actions (donde nada se publica) y sigue haciendo fallar el build donde compila Railway.
- **Acciones de terceros:** solo `actions/checkout`, `actions/setup-node` y `actions/upload-artifact`, fijadas por
  SHA completo. pnpm se activa con Corepack, a la versión de `package.json`.
- **Aviso por issue:** quien dispara el workflow es el bot de Railway, así que el correo de fallo de GitHub no le
  llega a nadie. Un issue sí avisa a quien sigue el repositorio.

## Fuera de alcance

- CI previo al despliegue (lint, tipos, pruebas y build en cada push, con "Wait for CI" en Railway): lo pide el
  estándar del Workspace y queda propuesto en el backlog; hoy esas comprobaciones corren dentro de `pnpm build`.
- Repetir las pruebas con el contenido de `docs/pruebas` (guías y casos ficticios): backlog 50.
- Lighthouse de páginas con imagen principal (backlog 48): no hay ninguna todavía.

## Pruebas

| Requisito | Cómo se comprueba |
|---|---|
| RF-1, RF-2, RF-3 | una corrida real del workflow tras un despliegue, en verde (`docs/revisiones/evidencia-paso7.txt`) |
| RF-4 | lectura del workflow: `permissions: contents: read`, sin secretos ni pasos de despliegue; `launch.test.ts` |
| RF-5 | una corrida forzada a fallar en una rama de prueba del workflow, que abre el issue |
| RF-6 | lectura del grupo de concurrencia y la lista de corridas de un despliegue real |
