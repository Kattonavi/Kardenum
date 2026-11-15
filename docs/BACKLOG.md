# Backlog — Kardenum

Lo que no bloquea el paso actual. Severidad: Crítico · Alto · Medio · Bajo · Info.

| # | Qué | Severidad | Cuándo |
|---|---|---|---|
| 1 | `minimatch` < 11.0.1 (GHSA-g3hv-75wg-m249, DoS por globs). Solo en desarrollo, vía ESLint (`typescript-estree`); no llega al servidor. Forzar la v11 por override puede romper `typescript-estree`. Resolver cuando `eslint-config-next` lo actualice. | Bajo | Revisar en cada parche de Next |
| 2 | El HTML sale con `Cache-Control: s-maxage=31536000` (estático de Next). Con Cloudflare delante, definir la regla de caché del HTML y purgar en cada despliegue, o el sitio servirá versiones viejas. | Medio | Paso 8 (lanzamiento) |
| 3 | Cabeceras de seguridad: HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`; quitar `X-Powered-By` (`poweredByHeader: false`). | Medio | Paso 4 (SEO técnico y confianza) |
| 4 | Subir next-intl a 4.15.x cuando cumpla 30 días (trae "Prefer static internal pathnames over overlapping dynamic ones", útil con las rutas traducidas). | Bajo | Desde el 2026-12-12 |
| 5 | `web/.env.example` con `SITE_INDEXABLE=false` y `NEXT_TELEMETRY_DISABLED=1`: una regla de permisos impide crearlo desde Claude. Mientras, las variables están documentadas en `web/README.md`. | Bajo | Lo crea el fundador |
| 6 | Hook `Stop` del proyecto (typecheck): bloqueado por el sello de evaluación del Workspace. Comando listo: `pnpm --dir web --silent typecheck 1>&2 \|\| exit 2` (pnpm 12 no acepta `-s`). | Info | Lo crea el fundador |
| 7 | `global-not-found` es experimental en Next 16.4. Revisar en cada actualización de Next si pasa a estable o cambia. | Info | Cada actualización de Next |
| 8 | Push protection / `gitleaks` en el repo y Dependabot con actualizaciones agrupadas. | Medio | Paso 7 (CI) |
