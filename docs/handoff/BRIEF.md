# Kardenum — brief para el desarrollo del sitio

Contexto para Claude Code. Todo lo que está aquí ya fue decidido con el fundador. Ante una duda que estos documentos no resuelvan, pregunta antes de inventar.

## Qué es

Kardenum es un estudio independiente con cinco líneas de servicio: Desarrollo, Diseño, Video y animación, Minecraft y Discord. Todo se cotiza a la medida: no hay planes, mensualidades ni precios públicos. El sitio tiene un solo objetivo: que quien llega entienda en segundos qué hace el estudio y pida una cotización. La prioridad número uno es el SEO, es decir, que el sitio aparezca en búsquedas orgánicas.

## Fuentes de verdad, en este orden

1. `docs/plan-sitio-web.md`: arquitectura, mapa del sitio, contenido de cada página, reglas del portafolio, stack y decisiones.
2. `docs/seo-sitio.md`: todo el SEO técnico y de contenido (sección 2 = lo que va en el código).
3. `docs/identidad-visual.md`: logo (con el SVG), colores, tipografía y componentes.
4. `maquetas/`: diseño definitivo de escritorio. Abre `maquetas/index.html`. Los textos de las maquetas son los textos del sitio. Lo que está entre corchetes `[...]` es contenido pendiente.
5. `docs/textos-sitio.md`: tono de los textos y frases aprobadas.
6. `docs/checklist-pre-desarrollo.md`: qué falta y el orden de trabajo recomendado.

## Infraestructura (creada el 15 de noviembre de 2026)

El repo y el proyecto de Railway anteriores se borraron. Se empieza de cero.

- **Railway:** proyecto `kardenum` (`08e6e401-f66c-42bf-bc8e-aef9d446942d`), entorno `production`.
  - Servicio `web` (`662c11bf-c752-4c66-84f7-8e33b1aa6e04`), vacío y ya configurado:
    - Carpeta raíz `/web` y despliegue solo cuando cambia `/web/**`.
    - Healthcheck en `/` (120 s), builder Railpack y reinicio si falla.
    - Variables: `SITE_INDEXABLE=false` y `NEXT_TELEMETRY_DISABLED=1`.
  - URL: https://web-production-f1d7c246.up.railway.app
  - No hay `api` ni base de datos: el sitio v1 no los necesita.
- **GitHub:** falta crear el repo `Kattonavi/Kardenum` (privado). Es un monorepo y la app de Next.js va en `/web`.
- **Para conectarlos:**
  1. Crea el repo y sube el primer commit con la app en `/web`.
  2. Conecta el repo al servicio `web`, rama `main`. Puede hacerse desde el panel de Railway (Settings → Source) o con la CLI de Railway.
  3. Desde ahí, cada push a `main` despliega.

## Flujo de trabajo: directo a producción en Railway

No hay desarrollo local. Cada push a `main` despliega en Railway. Las reglas que lo hacen seguro:

1. **El build es la prueba.** `pnpm build` (con `tsc` y ESLint) tiene que pasar. Si falla, Railway no reemplaza el despliegue que está en línea.
2. **Healthcheck.** Railway da por bueno un despliegue cuando `/` responde. La raíz tiene que responder 200 en español, sin redirigir.
3. **Nada se indexa antes del lanzamiento.** Una variable `SITE_INDEXABLE` (por defecto `false`) controla tres cosas:
   - Con `false`, `robots.txt` responde `Disallow: /` y todas las respuestas llevan la cabecera `X-Robots-Tag: noindex`.
   - Con `false`, el sitemap no se publica.
   - Solo se pasa a `true` cuando `kardenum.com` esté conectado y el contenido real esté listo.

   Esto va en el primer commit.
4. **Pruebas automáticas.** ESLint con `jsx-a11y` y `tsc` corren en el build. axe y Lighthouse se corren contra la URL de Railway después de cada despliegue, con GitHub Actions.
5. **Después del lanzamiento**, cuando haya visitas reales, se crea un entorno `staging` en Railway (o entornos por PR) y `main` deja de desplegar sin revisión.

## Stack

- Next.js 16 (App Router), TypeScript y pnpm. Última versión de parche. Todas las páginas se generan en el build.
- Tailwind CSS v4, con los colores y fuentes de la marca como variables en `@theme`.
- next-intl v4. **Español en la raíz, inglés bajo `/en`**, con las rutas traducidas. En Next.js 16 el middleware se llama `proxy.ts`.
- `next/font` (Archivo variable con eje de ancho, y JetBrains Mono) y `next/image`.
- Contenido en archivos tipados del repo (TS o MDX). Sin backend, sin base de datos y sin CMS en v1.
- Despliegue en Railway (`output: 'standalone'`), con Cloudflare delante. Analítica con Umami, sin cookies.
- Dependencias mínimas: sin librería de componentes ni de animaciones.

## Rutas

| Español (raíz) | Inglés (`/en`) |
|---|---|
| `/` | `/en` |
| `/servicios` | `/en/services` |
| `/servicios/desarrollo` · `/tiendas-online` · `/software-a-la-medida` | `/en/services/development` · `/ecommerce` · `/custom-software` |
| `/servicios/diseno` | `/en/services/design` |
| `/servicios/video` | `/en/services/video` |
| `/servicios/minecraft` · `/plugins` · `/servidores` · `/tebex` | `/en/services/minecraft` · `/plugins` · `/servers` · `/tebex` |
| `/servicios/discord` · `/bots` | `/en/services/discord` · `/bots` |
| `/portafolio` · `/portafolio/[caso]` | `/en/work` · `/en/work/[case]` |
| `/guias` · `/guias/[guia]` | `/en/guides` · `/en/guides/[guide]` |
| `/nosotros` · `/contacto` | `/en/about` · `/en/contact` |
| `/legal/privacidad` · `/legal/terminos` | `/en/legal/privacy` · `/en/legal/terms` |

Redirecciones: `/minecraft` → `/servicios/minecraft` (308). `/discord` → invitación al servidor del estudio (fuera del sitemap).

## Correspondencia maqueta → página

| Maqueta | Página |
|---|---|
| `B-Nav-escritorio` | Menú con desplegable de Servicios y barra de idioma |
| `B-Gremio-inicio-v2` | Inicio |
| `B-Servicios` | Índice de servicios |
| `B-Linea-Desarrollo`, `-Diseno`, `-Video` | Plantilla de página de línea |
| `B-Linea-Minecraft`, `-Discord` | Plantilla de landing de comunidad |
| `B-Sub-*` | Plantilla de subpágina de servicio (6 subpáginas) |
| `B-Portafolio`, `B-Caso` | Portafolio y caso |
| `B-Guias`, `B-Guia-plantilla` | Índice de guías y guía |
| `B-Nosotros`, `B-Contacto` | Nosotros y Contacto (con el cotizador de WhatsApp) |
| `B-Legal-privacidad`, `-terminos` | Plantilla legal |
| `B-404` | Página no encontrada |
| `B-Sub-ficha-SEO` | Referencia: qué metadatos y datos estructurados lleva cada subpágina |
| `B-Movil-*` | Celular: menú, inicio y línea Minecraft (fase siguiente; el resto se resuelve con el diseño fluido) |

## Reglas que no se negocian

- **SEO:** metadatos únicos por página e idioma, canonical propio, hreflang `es`/`en`/`x-default` (inglés), sitemap con alternativas, JSON-LD (Organization, WebSite, Service, BreadcrumbList, CreativeWork, Article), imágenes OG con `next/og`, 404 real. Detalle en `docs/seo-sitio.md`.
- **Sin redirección automática por idioma.** Una barra ofrece el otro idioma y recuerda la elección.
- **Rendimiento en celular:** LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1. Lighthouse ≥ 95 en las cuatro categorías.
- **Accesibilidad (WCAG 2.1 AA):**
  - Cada página lleva `<header>` (menú), `<main>` (contenido) y `<footer>`, con un solo H1.
  - El menú y el desplegable funcionan completos con teclado.
  - Objetivos táctiles de 44 px como mínimo y foco visible.
  - Se respeta `prefers-reduced-motion`.
- **Contraste del bronce:** el bronce `#B8923A` sirve como texto solo sobre Tinta `#111110`. Sobre Piedra `#F4F4F1` va solo en líneas y detalles. Si hace falta texto bronce sobre fondo claro, se usa `#7A5C14`.
- **Avisos en el pie:** las páginas de Minecraft llevan el aviso de que no es un servicio oficial de Minecraft. Las de Discord, el aviso de que el estudio no está afiliado a Discord.
- **Textos:**
  - Nunca usar "plan" ni "mensualidad".
  - No mencionar el país.
  - No hay sección de equipo.
  - Nada de testimonios ni clientes inventados.
- **Portafolio:** cada caso lleva `visibilidad: publico | reservado | privado`, y los privados no se generan. El portafolio queda detrás de un flag (fuera del menú, del sitemap y con `noindex`) hasta tener al menos una pieza por línea.
- **Datos que todavía no existen:** correo, WhatsApp, invitación de Discord, perfiles y datos legales. Van en `site.config.ts` como valores de reemplazo; no se inventan.

## Orden de trabajo

1. Base: Next.js 16 en `/web`, con el guardia `SITE_INDEXABLE` desde el primer commit (el healthcheck de Railway ya apunta a `/`). Luego Tailwind con los colores de la marca, next-intl (español raíz, inglés `/en`), fuentes y layout `header` / `main` / `footer`.
2. Componentes que salen de las maquetas:
   - Navegación y layout: menú con desplegable, menú móvil, barra de idioma, migas de pan y pie.
   - Hero en tres variantes: base, comunidad con corchete y video con reel.
   - Contenido de servicio: lista de servicios, "¿Cuál necesitas?", qué recibes, alcance, proceso y preguntas en acordeón con `<details>`.
   - Tarjetas y conversión: tarjeta de trabajo, tarjeta de guía, cierre de contacto y cotizador de WhatsApp.
3. Páginas con contenido listo: inicio, servicios, las 5 líneas, Nosotros, Contacto y 404.
4. SEO técnico completo.
5. Subpáginas, portafolio, casos y guías, detrás de flags hasta tener contenido real.
6. Páginas legales.
7. Pruebas automáticas en GitHub Actions contra la URL de Railway: axe con Playwright en 390 y 1280 px, y Lighthouse CI.
8. Lanzamiento: conectar `kardenum.com`, pasar `SITE_INDEXABLE` a `true`, enviar el sitemap a Search Console y Bing, y crear el entorno `staging`.
