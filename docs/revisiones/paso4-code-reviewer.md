# Revisión de código — paso 4 del brief

- **Revisor:** `code-reviewer` (opus · high), contexto fresco. **Fecha:** 2026-11-15.
- **Alcance:** `git diff 20f367a..1ed1944 -- web/` contra las specs 002 y 003, la Constitución del proyecto y
  `docs/handoff/docs/seo-sitio.md` §2.
- **Veredicto:** RECHAZADO por un Alto (regresión del propio lote). Corregido en `44a4e8c`.

## Hallazgos y resolución

| # | Sev. | Dónde | Escenario | Resolución |
|---|---|---|---|---|
| 1 | **Alto** | `site-header.tsx`, `globals.css` | Escritorio con barra de desplazamiento clásica y ventana de 1024 a 1039 px: la cabecera se ve compacta; al abrir el menú la página deja de desplazarse, desaparece la barra, la cabecera crece más allá de 64rem y la *container query* oculta el contenedor del menú con su `<dialog>` dentro. El diálogo queda abierto y modal pero sin pintarse: la página queda inerte hasta pulsar Esc. Lo introdujo el cambio de la cabecera al 200 % (antes `lg:` medía la ventana con la barra). Las pruebas no lo veían: el navegador sin interfaz oculta las barras. | **Corregido.** El diálogo ya no vive dentro de un elemento que el layout pueda ocultar (solo se oculta el control) y, mientras el menú está abierto, la página conserva el espacio de la barra (`scrollbar-gutter: stable`), así que no cambia de ancho. Prueba nueva con barras reales (`e2e/scrollbar.spec.ts`), que falla contra el build anterior. |
| 2 | Medio | `proxy.ts` | Los enlaces cortos se validaban al cargar el proxy (primera petición), no en el build: una invitación de Discord mal escrita habría roto todas las rutas ya desplegadas. | **Corregido.** `next.config.ts` vuelve a llamar `shortLinkRedirects()`: el error detiene el build. |
| 3 | Medio | `launch.ts` | Un valor marcado como listo pero vacío, con un idioma sin párrafos o con el corchete dentro pasaba el freno. | **Corregido.** `findUnfilled` lo bloquea y lo nombra; pruebas unitarias. |
| 4 | Medio | `legal-page.tsx` (RF-3) | La página legal nunca se había renderizado con valores listos: todas las pruebas dependían de lo pendiente. | **Hecho una vez** en un clon de descarte con datos ficticios (ver `evidencia-paso4.txt`, sección 10). Queda en el backlog repetirlo cuando llegue el texto real. |
| 5 | Bajo | varios | `key` por párrafo (dos iguales chocaban) · `SITE_LAUNCH_CHECK=off` valía en cualquier entorno · redirecciones de barra final de Next sin cabeceras · menú que no se cierra al cambiar el tamaño de texto · fecha de actualización anterior a la de vigencia. | `key` por posición y `SITE_LAUNCH_CHECK=off` rechazado en Railway o CI: **corregidos**. El resto, backlog 34 y 36. |

## Lo que el revisor comprobó

Sin secretos ni `.env` versionado · el lote no toca dependencias · `pnpm audit --prod` sin vulnerabilidades ·
`pnpm test` 84/84 y `pnpm lint` sin avisos · sin mocks, TODO, `console.log`, estilos en línea ni `any` · el proxy
conserva la cadena de consulta y no cambia las demás rutas · la guardia de CSP tiene una prueba que demuestra que
escucha · el freno cuenta los pendientes de forma independiente.

## Re-verificación del delta

El arreglo del Alto queda cubierto por la prueba con barras reales, que reproduce el defecto en el build anterior y
pasa en el nuevo. La re-verificación del delta (`1ed1944..44a4e8c`, 30 archivos) se pidió el 2026-11-15 al mismo
revisor; su resultado se anota aquí debajo.
