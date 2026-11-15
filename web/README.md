# kardenum-web

Sitio de Kardenum. Next.js 16 (App Router, `output: "standalone"`), TypeScript strict, Tailwind v4, next-intl, pnpm.

| Script | Qué hace |
|---|---|
| `pnpm build` | ESLint (sin avisos) → `next typegen` → `tsc --noEmit` → pruebas unitarias → `next build` → copia `public/` y `.next/static/` al standalone |
| `pnpm start` | Arranca `.next/standalone/server.js` en `0.0.0.0:$PORT` (lo usa Railway) |
| `pnpm test` | Pruebas unitarias con `node --test` (reglas de URLs, hreflang, sitemap, JSON-LD, textos prohibidos, barra de idioma) |
| `pnpm smoke <url> [--expect=noindex\|indexable]` | Prueba de humo contra un servidor: recorre el registro de rutas y revisa cada página en los dos idiomas |
| `pnpm test:e2e` | Playwright + axe a 1280 y 390 px contra `E2E_BASE_URL` (por defecto `http://127.0.0.1:3000`) |
| `pnpm lint` · `pnpm typecheck` | Por separado |

## Dónde vive cada cosa

| Qué | Dónde |
|---|---|
| Nombre, dominio, canales de contacto y secciones ocultas | `src/site.config.ts` |
| Rutas y slugs en español e inglés (una sola lista) | `src/routes.ts` |
| Contenido tipado: líneas, preguntas, pasos, título y descripción de cada página | `src/content/` |
| Textos de la interfaz | `messages/es.json` y `messages/en.json` |
| SEO: metadatos, hreflang, sitemap, JSON-LD | `src/lib/seo/` |
| Colores, fuentes y superficies | `src/app/globals.css` |

Para agregar una página: se registra en `src/routes.ts` con `built: true`, se le escribe título y descripción en
`src/content/pages.ts` y su `generateMetadata` llama a `buildPageMetadata`. Con eso entra sola al sitemap, al
hreflang, a las imágenes para redes y a la prueba de humo.

## Variables (en Railway, nunca en el repo)

| Variable | Valor hoy | Para qué |
|---|---|---|
| `SITE_INDEXABLE` | `false` | Solo el valor exacto `true` deja indexar el sitio. Se lee en el build: cambiarla exige un despliegue nuevo. Guardia en `src/lib/indexing.ts`. Con `true`, el build falla mientras `site.config.ts` tenga datos de contacto pendientes. |
| `NEXT_TELEMETRY_DISABLED` | `1` | Sin telemetría de Next.js. |
| `SITE_LAUNCH_CHECK` | sin definir | Solo para pruebas locales: `off` permite compilar con `SITE_INDEXABLE=true` aunque falten datos. No se define en Railway. |
