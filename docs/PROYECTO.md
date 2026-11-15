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
  1. next-intl con Cache Components: las páginas deben seguir estáticas (la tabla de `next build` sin `ƒ`).
  2. Push directo a `main` sin CI: un build verde pero roto en ejecución llega a producción. Mitigación: `pnpm smoke`
     contra la URL de Railway tras cada despliegue; CI en el paso 7.
  3. Datos pendientes (correo, WhatsApp, Discord, legales) frenan el lanzamiento: van en `site.config.ts` como
     reemplazos, nunca inventados.
- **Contenido:** textos en las maquetas (`docs/handoff/maquetas/`); inglés por escribir · **Marca:** completa en
  `docs/handoff/marca/`.

## Avance
| Rebanada | Hecho | Falta | Horas usadas / apetito |
|---|---|---|---|
| 0 | Next 16.4.6 en `/web`, guardia `SITE_INDEXABLE`, standalone para Railway, prueba de humo, repo privado `Kattonavi/Kardenum` (6ea6a3e) | Tokens de marca, next-intl, fuentes, layout; conectar el repo a Railway (fundador) | ~1,5 h / 4 h |

## Stack
| Capa | Elección | Por qué / desviación |
|---|---|---|
| Frontend | Next.js 16.4.6 (App Router, Turbopack, Cache Components), TS strict, Tailwind 4.3, next-intl 4 | Brief |
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
- Node 22 (`engines.node: 22.x`), igual al de la máquina donde se verifica el build.
- La guardia se lee en el build (fail-closed: solo `"true"` abre). Al lanzar, comprobar `/robots.txt` tras el cambio.
- Favicon y `apple-icon` desde el paquete del logo (`kardenum-favicon.svg`, `-180.png`).

## Pendientes
Ver `docs/handoff/docs/checklist-pre-desarrollo.md`, sección 2 (correo, WhatsApp, Discord, datos legales, frase del
hero, perfiles oficiales, video).
