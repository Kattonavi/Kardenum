# Backlog — Kardenum

Lo que no bloquea el paso actual. Severidad: Crítico · Alto · Medio · Bajo · Info.

| # | Qué | Severidad | Cuándo |
|---|---|---|---|
| 1 | `minimatch` < 11.0.1 (GHSA-g3hv-75wg-m249, DoS por globs). Solo en desarrollo, vía ESLint (`typescript-estree`); no llega al servidor. Forzar la v11 por override puede romper `typescript-estree`. Resolver cuando `eslint-config-next` lo actualice. | Bajo | Revisar en cada parche de Next |
| 2 | El HTML sale con `Cache-Control: s-maxage=31536000` (estático de Next). Con Cloudflare delante, definir la regla de caché del HTML y purgar en cada despliegue, o el sitio servirá versiones viejas. | Medio | Paso 8 (lanzamiento) |
| 3 | Cabeceras de seguridad: HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`; quitar `X-Powered-By` (`poweredByHeader: false`). | Medio | Paso 4 (SEO técnico y confianza) |
| 4 | Subir next-intl a 4.15.x cuando cumpla 30 días (trae "Prefer static internal pathnames over overlapping dynamic ones", útil con las rutas traducidas). | Bajo | Desde el 2026-12-12 |
| 5 | ~~`web/.env.example`~~ Hecho el 2026-11-15 con el comando que aprobó el fundador (17d77f9). | — | Cerrado |
| 6 | Hook `Stop` del proyecto (typecheck): el sello de evaluación del Workspace bloquea crear el archivo de ajustes del proyecto, también con la aprobación dada en el chat. Comando listo: `pnpm --dir web --silent typecheck 1>&2 \|\| exit 2`. La plantilla del Workspace ya usa `--silent`. | Info | Lo crea el fundador en su terminal |
| 7 | `global-not-found` es experimental en Next 16.4, y el motivo de no usar `notFound()` en páginas es el fallo abierto [vercel/next.js#99287](https://github.com/vercel/next.js/issues/99287). Cuando se cierre, reconsiderar el catch-all y Cache Components. | Info | Cada actualización de Next |
| 8 | Push protection / `gitleaks` en el repo y Dependabot con actualizaciones agrupadas. | Medio | Paso 7 (CI) |
| 9 | Enlaces a páginas sin construir (Servicios, las 5 líneas, Nosotros, Cotizar, Privacidad, Términos) llevan al 404 de marca. Se resuelve al construir cada página; `routes.test.ts` obliga a marcar `built: true`. | Medio | Paso 3 del brief |
| 10 | Volver a Vitest cuando una versión parcheada de Vite (≥ 8.3.7) cumpla 30 días, si las pruebas necesitan más que `node --test`. | Bajo | Desde el 2026-12-10 |
| 11 | Respaldo de fuentes en Android (Roboto): los valores están calculados, no medidos en un dispositivo. Medir CLS en un Android real o en BrowserStack. | Bajo | Antes del lanzamiento |
| 12 | Redirecciones cortas: `/minecraft` → `/servicios/minecraft` (308) al construir esa página; `/discord` → invitación cuando exista el dato. | Medio | Paso 3 y lanzamiento |
| 13 | Movimiento: hoy solo hay transiciones de color. La pasada de motion (motion-engineer) va en el lote de pulido. | Bajo | Lote de pulido |
| 14 | Redirecciones de next-intl (`/es` → `/`, slug del otro idioma) responden 307; para SEO convendría 308. Revisar opciones de next-intl o reglas en Cloudflare. | Bajo | Paso 8 |
| 15 | Impeccable 4.9.1 disponible (instalada 4.8.0): `npx impeccable update` en otra sesión. | Info | Cuando el fundador quiera |
