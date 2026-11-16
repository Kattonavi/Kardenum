# kardenum-web

Sitio de Kardenum. Next.js 16 (App Router, `output: "standalone"`), TypeScript strict, Tailwind v4, next-intl, pnpm.

| Script | Qué hace |
|---|---|
| `pnpm build` | ESLint (sin avisos) → `next typegen` → `tsc --noEmit` → pruebas unitarias → `next build` → copia `public/` y `.next/static/` al standalone |
| `pnpm start` | Arranca `.next/standalone/server.js` en `0.0.0.0:$PORT` (lo usa Railway) |
| `pnpm test` | Pruebas unitarias con `node --test` (reglas de URLs, hreflang, sitemap, JSON-LD, textos prohibidos, barra de idioma) |
| `pnpm smoke <url> [--expect=noindex\|indexable] [--site-url=<origen>\|self]` | Prueba de humo contra un servidor: recorre el registro de rutas y revisa cada página en los dos idiomas. `--site-url` es el `SITE_URL` con que se compiló ese servidor (`self` = la misma dirección que se prueba) |
| `pnpm test:e2e` | Playwright + axe a 1280 y 390 px contra `E2E_BASE_URL` (por defecto `http://127.0.0.1:3000`) |
| `pnpm lint` · `pnpm typecheck` | Por separado |

## Dónde vive cada cosa

| Qué | Dónde |
|---|---|
| Nombre, dominio, canales de contacto y secciones ocultas | `src/site.config.ts` |
| Rutas y slugs en español e inglés (una sola lista) | `src/routes.ts` |
| Páginas detrás de un flag (`features` en `site.config.ts`) | archivos `page.<flag>.tsx`: `page.subpages.tsx`, `page.portfolio.tsx`, `page.guides.tsx` |
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
| `SITE_INDEXABLE` | `false` | Solo el valor exacto `true` deja indexar el sitio. Se lee en el build: cambiarla exige un despliegue nuevo. Guardia en `src/lib/indexing.ts`. Con `true`, el build falla mientras `site.config.ts` tenga cualquier valor pendiente (contacto, datos y textos legales) o `SITE_URL` no sea `https://kardenum.com` (`src/lib/launch.ts`). `SITE_LAUNCH_CHECK=off` omite el freno solo en local: con `CI` o una variable `RAILWAY_*` presente, hace fallar el build. |
| `UMAMI_SRC` y `UMAMI_WEBSITE_ID` | sin definir = sin analítica | Dirección https del script de Umami y el id del sitio. Solo con las DOS se carga el script y la política de contenido admite ese origen; con una sola o ninguna no se carga nada. Se leen en el build. |
| `CONFIDENTIAL_TERMS` (solo para `pnpm smoke`) | sin definir | Nombres que el sitio nunca debe servir (el cliente de un caso reservado, un proyecto privado), separados por comas. La prueba de humo los busca en todas las respuestas. No se versiona ni se pone en Railway. |
| `SITE_URL` | sin definir = `https://kardenum.com` | Origen de todas las URL absolutas: canonical, hreflang, `og:image`, sitemap y JSON-LD. Antes de tener el dominio se pone la dirección de Railway. Solo el origen, sin ruta. Se lee en el build. |
| `NEXT_TELEMETRY_DISABLED` | `1` | Sin telemetría de Next.js. |
| `SITE_LAUNCH_CHECK` | sin definir | Para medir un build abierto que no se publica: `off` permite compilar con `SITE_INDEXABLE=true` aunque falten datos. Vale en local y en GitHub Actions (el workflow de verificación lo usa para Lighthouse y no despliega nada). En Railway, o en cualquier otro CI, ese valor hace fallar el build. |

## Páginas ocultas detrás de un flag

Subpáginas de servicio, portafolio y guías están construidas pero ocultas hasta encender su flag en
`src/site.config.ts` (`features`). Reglas (specs 004 a 006, "Páginas ocultas y sitio abierto"):

- **El archivo de una página detrás de un flag se llama `page.<flag>.tsx`**, no `page.tsx`: `page.subpages.tsx`,
  `page.portfolio.tsx` o `page.guides.tsx`. `src/routes.test.ts` falla si no es así.
- **Sitio cerrado** (`SITE_INDEXABLE` distinto de `true`): responden 200 con `noindex`, sin enlaces y fuera del
  sitemap, para revisarlas.
- **Sitio abierto con el flag apagado**: su dirección responde el 404 de marca, igual que su petición de datos RSC.
  Dos capas: el proxy (`src/proxy.ts`) las rechaza comparando la ruta ya decodificada y normalizada
  (`src/lib/comparable-path.ts`), y además el build no las compila, porque `next.config.ts` solo acepta la
  extensión de un flag cuando el build genera sus páginas (`pageExtensions()` en `src/routes.ts`).
- Estas páginas tipan sus `params` con `LocalePageProps` o `EntryPageProps` (`src/routes.ts`): el `PageProps<"/…">`
  de Next solo conoce las rutas del build en curso.

**Las pruebas necesitan saber cómo se compiló el servidor que revisan.** La prueba de humo lo recibe con
`--expect=noindex` o `--expect=indexable`. Las de navegador leen `SITE_INDEXABLE` del entorno donde corren
(`playwright.config.ts`): sin definir, esperan un sitio cerrado; contra un build abierto se lanzan con
`SITE_INDEXABLE=true E2E_BASE_URL=… pnpm test:e2e`, y dejan fuera las páginas que ese build no tiene.
