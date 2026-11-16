# Kardenum — guía para Claude Code

Hereda `E:/Workspace/CLAUDE.md` (reglas globales) y los estándares de `E:/Workspace/estandares/`.
Este archivo solo agrega o endurece; nunca relaja.

- **Nivel / talla / riesgo:** N2 · M · normal · **Contexto:** `docs/PROYECTO.md` · **Brief:** `docs/handoff/BRIEF.md`
- **Diseño:** las maquetas de `docs/handoff/maquetas/` son el diseño y los textos definitivos (`[...]` = pendiente).

## Constitución
1. **El handoff manda.** Orden de las fuentes: plan → SEO → identidad → maquetas → textos (`docs/handoff/BRIEF.md`).
   Si algo no está resuelto ahí, se pregunta; no se inventa.
2. **Ningún push con el build en rojo:** `cd web && pnpm build` (ESLint sin avisos + `tsc` + `next build`).
3. **`/` responde 200 en español, sin redirección, y el sitio no se indexa hasta el lanzamiento:**
   `pnpm --dir web smoke <url> --expect=noindex` contra local y, después de cada despliegue, contra Railway con
   `--site-url=self` (el servicio se compila con `SITE_URL` = su propia dirección hasta tener el dominio).
4. **Todo estático:** la tabla de rutas de `next build` solo muestra `○` y `●`; `ƒ` únicamente en `Proxy (Middleware)`.
   Las rutas desconocidas no deben coincidir con ninguna ruta (`dynamicParams = false`, sin catch-all): así Next sirve
   `global-not-found.tsx` con HTML completo. Una página que llama `notFound()` al renderizar entrega un shell vacío
   (comprobado en Next 16.4.6). Por eso Cache Components queda apagado: no admite `dynamicParams`.
5. **TS strict sin `any`** sin comentario que lo justifique: `pnpm --dir web typecheck`.
6. **Datos que no existen** (correo, WhatsApp, Discord, perfiles, legales) solo en `site.config.ts` como reemplazos.
7. **Textos:** nunca "plan" ni "mensualidad", no se menciona el país, ni testimonios ni clientes inventados.
8. **Bronce `#B8923A`** como texto solo sobre Tinta `#111110`; sobre fondo claro, texto en `#7A5C14`.
9. Código e identificadores en inglés; textos al usuario en español e inglés; docs en español.

## Comandos (desde `web/`)
| Tarea | Comando |
|---|---|
| Build (puerta) | `pnpm build` |
| Arrancar el build | `pnpm start` (puerto `PORT`, 3000 por defecto) |
| Prueba de humo | `pnpm smoke http://localhost:3000` · `pnpm smoke https://web-production-f1d7c246.up.railway.app --site-url=self` |
| Unitarias | `pnpm test` (`node --test`; también corren dentro de `pnpm build`) |
| Navegador (e2e + axe) | `E2E_BASE_URL=http://127.0.0.1:3000 pnpm test:e2e` (o la URL de Railway) |
| Tipos / Lint | `pnpm typecheck` · `pnpm lint` |

## Reglas específicas del proyecto
- **No hay desarrollo local:** cada push a `main` que toque `web/**` despliega en Railway. Se verifica con el build y
  con `pnpm start` + `pnpm smoke` antes del push.
- `/web` es autocontenido (su `package.json`, `pnpm-lock.yaml` y `pnpm-workspace.yaml`): Railway solo ve esa carpeta.
  No crear un workspace de pnpm en la raíz.
- Leer la guía de `web/node_modules/next/dist/docs/` antes de usar una API de Next (lo pide `web/AGENTS.md`).
- La configuración del servicio de Railway vive en el panel; no agregar `.railway/railway.ts` sin acordarlo.
- **Una página nueva** se registra en `web/src/routes.ts` (`built: true`), lleva sus textos en
  `web/src/content/pages.ts` y llama a `buildPageMetadata` en `generateMetadata`. Así entra sola al sitemap, al
  hreflang, a las imágenes OG y a la prueba de humo.
- **Una página detrás de un flag** (`features` en `site.config.ts`) se registra con `behind("<flag>")` y su archivo
  se llama `page.<flag>.tsx` (`subpages`, `portfolio`, `guides`), nunca `page.tsx`: así el build abierto con el flag
  apagado no la compila y su dirección da el 404 de marca (`web/src/routes.test.ts` lo comprueba).
- Los componentes de cliente reciben sus textos como props: el provider no envía mensajes al navegador.
- Código con barras invertidas (regex) se escribe con Write/Edit, nunca con heredoc de Bash.
- Las URL absolutas salen de `absoluteUrl()` / `getSiteUrl()` (variable `SITE_URL`), nunca de `siteConfig.url`.
- En los títulos con `<br>` va un espacio antes de cada salto, para que el texto no quede pegado sin él.
