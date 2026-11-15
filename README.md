# Kardenum

Monorepo del sitio de Kardenum, estudio de desarrollo, diseño y video.

| Carpeta | Qué hay |
|---|---|
| `web/` | Sitio en Next.js 16 (App Router), TypeScript, Tailwind v4 y pnpm. Se despliega en Railway (servicio `web`, raíz `/web`). |
| `docs/handoff/` | Brief, plan, SEO, identidad, textos y maquetas aprobadas. Fuente de verdad del contenido y el diseño. |

## Despliegue

Cada push a `main` que toque `web/**` despliega en Railway. No hay entorno local de desarrollo: el build es la prueba.

```bash
cd web
pnpm install --frozen-lockfile
pnpm build                                     # eslint + tsc + next build (falla = no se hace push)
pnpm start                                     # servidor standalone en PORT (3000 por defecto)
pnpm smoke http://localhost:3000               # prueba de humo; también contra la URL de Railway
```

## Indexación

`SITE_INDEXABLE` (por defecto `false`) mantiene el sitio fuera de los buscadores: `robots.txt` con `Disallow: /`,
cabecera `X-Robots-Tag: noindex` en todas las respuestas y sin sitemap. Solo el valor exacto `true` lo abre, y se
lee en el build. Detalle en `web/src/lib/indexing.ts`.
