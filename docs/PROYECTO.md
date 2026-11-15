# Kardenum — sitio web

> Adoptado con /nuevo-proyecto el 2026-11-15. Fuente de verdad: `docs/handoff/BRIEF.md` y `docs/handoff/docs/`.
> Lo marcado **(pendiente)** está por confirmar con el fundador.

## Resumen
- **Cliente / negocio:** Kardenum, estudio propio (desarrollo, diseño, video, Minecraft, Discord). Todo a la medida.
- **Qué hace y para quién:** que quien llega entienda en segundos qué hace el estudio y pida cotización. Dos públicos:
  negocios (web, marca, video) y dueños de servidores de Minecraft y comunidades de Discord.
- **Idioma:** español en la raíz, inglés en `/en`. No se menciona el país.
- **Objetivo medible:** clics en WhatsApp, Discord y correo (eventos de Umami) y posiciones orgánicas en Search Console.
- **Dominio:** web · **Nivel:** N2 (sitio público con SEO, sin backend) · **Talla:** M · **Riesgo:** normal (sin
  datos guardados: el cotizador arma un mensaje de WhatsApp en el cliente).

## Apetito y circuit breaker
Decidido por Sara (el brief no lo fija); se cambia si el fundador dice otra cosa.

| Rebanada | Paso del brief | Apetito |
|---|---|---|
| 0 · Base desplegada | 1: Next 16, guardia `SITE_INDEXABLE`, marca en Tailwind, next-intl, fuentes, layout | 4 h |
| 1 · Componentes y páginas con contenido | 2 y 3 | 2 días |
| 2 · SEO técnico | 4 | 0,5 día |
| 3 · Detrás de flags y legales | 5 y 6 | 1 día |
| 4 · Pruebas en GitHub Actions | 7 | 0,5 día |

**Total ≈ 4,5 días.** Al 50 % de una rebanada sin terminarla → parar y recortar. Al 100 % → publicar lo que hay o
re-negociar. El lanzamiento (paso 8) depende de datos del fundador, no del código.

## Alcance
| Must (v1) | Should | Later |
|---|---|---|
| Inicio, servicios, 5 líneas, Nosotros, Contacto con cotizador de WhatsApp, 404 | Subpáginas (6), portafolio, casos y guías detrás de flags | Formulario con backend (Spring Boot) |
| es/en con rutas traducidas, barra de idioma sin redirección | Diseño móvil fino de la Ronda 3 | Casos con métricas y testimonios reales |
| SEO técnico completo (metadatos, hreflang, sitemap, JSON-LD, OG) | Umami con eventos de contacto | Entorno `staging` (después del lanzamiento) |
| Guardia de indexación y legales con datos de reemplazo | axe + Lighthouse en CI | |

- **No-goals:** backend, base de datos o CMS en v1 · redirección automática por idioma · precios, planes, testimonios o
  sección de equipo.
- **Rebanada 0:** `/` responde 200 en español en Railway con el guardia activo, y la base (marca, idiomas, fuentes,
  layout) lista para montar componentes.
- **Riesgos top 3:**
  1. ~~next-intl con Cache Components~~ Resuelto el 2026-11-15: todo sale `○`/`●`. Para que el 404 llegue con HTML
     completo, las rutas desconocidas no coinciden con nada (`dynamicParams = false`, sin catch-all) y responde
     `global-not-found.tsx` (experimental). Cache Components queda apagado porque no admite `dynamicParams`.
  2. Push directo a `main` sin CI (decisión del fundador, 2026-11-15: así hasta el lanzamiento; después, `main`
     protegida, CI y `staging`). Mitigación: antes de cada push, clon limpio con build, humo y e2e; después, humo y
     e2e contra la URL de Railway.
  3. Datos pendientes (correo, WhatsApp, Discord, legales) frenan el lanzamiento: van en `site.config.ts` como
     reemplazos, nunca inventados.
- **Contenido:** textos en las maquetas (`docs/handoff/maquetas/`); inglés por escribir · **Marca:** completa en
  `docs/handoff/marca/`.

## Avance
| Rebanada | Hecho | Falta | Horas usadas / apetito |
|---|---|---|---|
| 0 | Paso 1 completo en `main` (6ea6a3e → 8a64095): Next 16.4.6, guardia `SITE_INDEXABLE`, standalone para Railway, marca en `@theme`, Archivo + JetBrains Mono, next-intl (es raíz, en `/en`), 404 global, esqueleto `header`/`main`/`footer`, jsx-a11y completo. Prueba de humo de 28 comprobaciones en verde desde un clon limpio, arrancando con `pnpm start` | — (repo conectado a Railway; primer despliegue verificado con Node 22.23.4 y pnpm 12.5.1) | ~1 h / 4 h |
| 1 y 2 (parcial) | En producción (6472f58 → 7ec00ec): `site.config.ts`, registro único de rutas con slugs traducidos, modelo de contenido tipado, SEO técnico (metadatos, canonical, hreflang, sitemap con guardia, imágenes OG, JSON-LD, manifest), layout global (desplegable, menú móvil, barra de idioma, pie) e inicio. 43 pruebas unitarias en el build, 68 de humo y 61 e2e (axe sin violaciones) contra Railway. Lighthouse celular en Railway: 99 / 100 / 100 (SEO 100 con el guardia abierto, medido en local) | Páginas de servicios, las 5 líneas, Nosotros, Contacto con cotizador y 404 diseñada (paso 3 del brief): hoy sus enlaces dan el 404 de marca. Revisiones del lote (ui-qa, finish-reviewer, code-reviewer) sin correr | ~1,2 h / 2,5 días |

## Stack
| Capa | Elección | Por qué / desviación |
|---|---|---|
| Frontend | Next.js 16.4.6 (App Router, Turbopack; Cache Components apagado), TS strict, Tailwind 4.3, next-intl 4.14.9 | Brief |
| Pruebas | `node --test` (unitarias, dentro del build), Playwright + axe (e2e), prueba de humo propia | Desviación: sin Vitest mientras toda versión de Vite con más de 30 días tenga el aviso crítico de RCE del 2026-11-10 |
| UI | Sin shadcn ni librería de componentes o animaciones | Desviación del default: el brief pide dependencias mínimas |
| Backend / BD / Auth / Pagos | Ninguno en v1 | Brief |
| Otros | `next/font` (Archivo, JetBrains Mono), `next/image`, `next/og`, Umami sin cookies | Brief |

## Infra y entrega
- **Railway:** proyecto `kardenum`, entorno `production`, servicio `web` (raíz `/web`, healthcheck `/`, Railpack).
  `pnpm start` → `scripts/start.mjs` → `.next/standalone/server.js` en `0.0.0.0:$PORT`.
- **GitHub:** `Kattonavi/Kardenum` (privado). Cada push a `main` que toque `web/**` despliega.
- **Dominio:** `kardenum.com` **(pendiente de compra)**, con Cloudflare delante.

## SEO
Detalle en `docs/handoff/docs/seo-sitio.md`. Nichos primero (Minecraft y Discord en inglés). Sin perfil de empresa en Google.

## Decisiones tomadas por defecto
- El paquete del handoff vive en `docs/handoff/` (lo sugería su `LEEME.md`).
- **Una sola fuente del dominio:** `https://kardenum.com` en `site.config.ts`. Canonical, hreflang, sitemap, JSON-LD
  e imágenes OG salen de ahí también antes del lanzamiento (en la URL de Railway apuntan al dominio final).
- **Raíz sin barra final:** `https://kardenum.com`, como la escribe Next, en canonical, hreflang, sitemap y JSON-LD.
- **Pie con el aviso de Minecraft en todo el sitio** (plan-sitio-web.md §6 y pedido del fundador); el de Discord se
  suma en sus páginas.
- **Canales de contacto pendientes:** se muestran sin enlace y con la nota `[Canales por activar]`. Un build con
  `SITE_INDEXABLE=true` falla mientras falte alguno (`src/lib/launch.ts`).
- **Barra de idioma:** cookie propia `kardenum_lang`, decidida antes del primer pintado
  (`docs/specs/001-barra-de-idioma.md`).
- **Fuentes de respaldo medidas** (Arial y Roboto ajustadas a Archivo) para que el cambio de fuente no mueva la página.
- **Inglés provisional:** traducción fiel de los textos aprobados; se reescribe con las palabras clave validadas.
- **Diseño:** se implementan las maquetas tal cual. Choque anotado: Impeccable prohíbe las etiquetas pequeñas sobre
  los títulos y las maquetas aprobadas las llevan; decide el fundador en la revisión del lote.
- Node 22 (`engines.node: 22.x`), igual al de la máquina donde se verifica el build.
- La guardia se lee en el build (fail-closed: solo `"true"` abre). Al lanzar, comprobar `/robots.txt` tras el cambio.
- Favicon y `apple-icon` desde el paquete del logo (`kardenum-favicon.svg`, `-180.png`).
- next-intl fijado en 4.14.9 (la 4.15 tiene menos de 30 días); `localeDetection`, `localeCookie` y `alternateLinks`
  apagados: `/` siempre en español, sin cookies, y hreflang desde los metadatos (x-default → inglés) en el paso 4.
- El 404 es uno solo y bilingüe (español primero, línea en inglés hacia `/en`): `global-not-found` no recibe el
  idioma. Se aparta de la maqueta B-404, que solo existe en español.
- Los textos en inglés del sitio son provisionales hasta escribir el inglés con las palabras clave validadas.

## Pendientes
Ver `docs/handoff/docs/checklist-pre-desarrollo.md`, sección 2 (correo, WhatsApp, Discord, datos legales, frase del
hero, perfiles oficiales, video).
