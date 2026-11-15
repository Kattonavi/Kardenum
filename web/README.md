# kardenum-web

Sitio de Kardenum. Next.js 16 (App Router, `output: "standalone"`), TypeScript strict, Tailwind v4, pnpm.

| Script | Qué hace |
|---|---|
| `pnpm build` | ESLint (sin avisos) → `next typegen` → `tsc --noEmit` → `next build` → copia `public/` y `.next/static/` al standalone |
| `pnpm start` | Arranca `.next/standalone/server.js` en `0.0.0.0:$PORT` (lo usa Railway) |
| `pnpm smoke <url> [--expect=noindex\|indexable]` | Prueba de humo: `/` 200 en español sin redirección, guardia de indexación, 404 real y estáticos |
| `pnpm lint` · `pnpm typecheck` | Por separado |

Variables (en Railway, nunca en el repo):

| Variable | Valor hoy | Para qué |
|---|---|---|
| `SITE_INDEXABLE` | `false` | Solo el valor exacto `true` deja indexar el sitio. Se lee en el build: cambiarla exige un despliegue nuevo. Guardia en `src/lib/indexing.ts`. |
| `NEXT_TELEMETRY_DISABLED` | `1` | Sin telemetría de Next.js. |
