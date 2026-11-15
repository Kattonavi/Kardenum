# Auditoría SEO técnica — paso 4 (2026-11-15)

Alcance: build abierto local `http://127.0.0.1:4712` (22 URL del sitemap, canonical `https://kardenum.com`) y producción cerrada `https://web-production-f1d7c246.up.railway.app`. Solo curl y scripts de lectura (rastreo propio en `scratchpad`, no se tocó código). Plan contra el que se audita: `docs/handoff/docs/seo-sitio.md` 2.1 a 2.7 y sección 6. Lo marcado como "ya decidido" en el encargo no se reporta.

Resultado: **0 Crítico, 0 Alto, 2 Medio, 7 Bajo.** El SEO técnico del build abierto está sano; falta cerrar dos huecos de contenido/ cabeceras antes de dar el paso 4 por completo.

## Hallazgos

| # | Sev. | Hallazgo | Evidencia | Arreglo |
|---|---|---|---|---|
| 1 | Medio | `/nosotros` y `/en/about` no tienen `BreadcrumbList` ni migas visibles. El plan 2.4 y 2.5 pide migas y `BreadcrumbList` en "páginas internas"; las otras 6 internas sí las tienen. | `curl -s $B/nosotros \| grep -c 'application/ld+json'` -> `0` (igual `/en/about`); `... \| grep -ciE 'breadcrumb\|Inicio / '` -> `0`. En `/servicios/video` el conteo es `1`. En `/nosotros` el HTML no tiene `<nav aria-label="Migas">` (solo "Principal", "Legal"). | Añadir migas + JSON-LD en `web/src/app/[locale]/nosotros/page.tsx` igual que en `contacto/page.tsx`. Ojo: la prueba de humo de 509 comprobaciones no lo detectó. |
| 2 | Medio (condicional) | Todas las páginas HTML salen con `Cache-Control: s-maxage=31536000` (un año en cachés compartidas), sin `max-age` ni `stale-while-revalidate`. Hoy Railway no cachea, pero al poner un CDN/proxy delante de `kardenum.com` (p. ej. Cloudflare) cada deploy dejaría HTML viejo hasta purgar. | `curl -sI $B/servicios/minecraft` -> `Cache-Control: s-maxage=31536000` + `ETag`. Las 22 páginas igual. Producción: `Cache-Control: s-maxage=31536000`. | Documentar en la lista de lanzamiento "purgar caché en cada deploy" o fijar `Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate` vía `headers()` en `web/next.config.ts`. |
| 3 | Bajo | Las entidades JSON-LD no son coherentes entre idiomas: `WebSite` tiene `@id` distinto (`https://kardenum.com/#website` en es, `https://kardenum.com/en#website` en en) y `Organization` con el mismo `@id` `/#organization` lleva `description` en español en `/` y en inglés en `/en` (dos descripciones para la misma entidad). | `curl -s $B/en \| grep -o '"@id":"[^"]*"'` -> `.../#organization`, `.../en#website`; `description":"Software, design and video studio"` frente a `"Estudio de desarrollo, diseño y video"` en `/`. | Un solo `WebSite` `@id` (`/#website`) con `inLanguage` por página o `name`/`description` neutros; descripción de Organization única o con `@language`. Archivo: `web/src/lib/seo/json-ld.ts`. |
| 4 | Bajo | `Service` usa `availableLanguage`, propiedad que no es de `Service` en schema.org (es de `ContactPoint`/`ServiceChannel`). No es un error para Google (`Service` no genera resultado enriquecido), pero el validador de schema.org lo marca como propiedad no reconocida. No pude confirmarlo contra schema.org (la consulta devolvió vacío); verificar con validator.schema.org antes de decidir. | `"availableLanguage":["Spanish","English"]` dentro del nodo `Service` en `/servicios/desarrollo`. | Usar `inLanguage`/quitarlo, o mover a un `ServiceChannel`. `web/src/lib/seo/json-ld.ts`. |
| 5 | Bajo | `/en/contact` enlaza con claves de `linea` en español (`?linea=desarrollo`, `diseno`). Funciona y el canonical limpia el parámetro (`/contacto?linea=minecraft` -> canonical `https://kardenum.com/contacto`), pero la URL en inglés lleva vocabulario español. | `href="/en/contact?linea=desarrollo#quote"` en `/en/services/...`; `curl -s "$B/contacto?linea=minecraft" \| grep canonical` -> `href="https://kardenum.com/contacto"`. | Aceptar `line=development` en inglés o dejarlo documentado. Sin impacto SEO real. |
| 6 | Bajo | Cabecera interna filtrada `x-middleware-rewrite: /es/servicios/minecraft` en respuestas HTML. | `curl -sI $B/servicios/minecraft` -> `x-middleware-rewrite: /es/servicios/minecraft`. | Quitarla en el proxy si molesta; cosmético. `web/src/proxy.ts`. |
| 7 | Bajo | `/favicon.ico` da 404 (los rastreadores lo piden por defecto). Hay `<link rel="icon" href="/icon.svg">` y `apple-icon.png`, que Google acepta. | `curl -s -o /dev/null -w "%{http_code}" $B/favicon.ico` -> `404`. | Opcional: servir `favicon.ico` o redirigirlo a `/icon.svg`. |
| 8 | Bajo | El sitemap no lleva `lastmod`. Google solo lo usa si es fiable; no es un fallo. | `curl -s $B/sitemap.xml \| grep -c lastmod` -> `0`. | Opcional: fecha real de último cambio de contenido por página, no la del build. `web/src/lib/seo/sitemap.ts`. |
| 9 | Bajo | `manifest.webmanifest` solo en español (`lang":"es"`, descripción en español) y `display":"browser"`. | `curl -s $B/manifest.webmanifest`. | Informativo; sin efecto en indexación. |

## Sección 2.x del plan

| Sección | Estado | Evidencia |
|---|---|---|
| 2.1 Rastreo e indexación | **Cumple** (lo pendiente es de lanzamiento) | `robots.txt` abierto: `User-Agent: *`, `Allow: /`, `Sitemap: https://kardenum.com/sitemap.xml`. Sitemap con 22 `<url>` = 11 páginas x 2 idiomas, todas devuelven 200 sin redirección; sin URL de más ni de menos frente a `routeTable` (`/portafolio`, `/guias`, subpáginas -> 404, no en sitemap). `X-Robots-Tag` ausente en el build abierto en las 22 páginas (`xrt= None`); sin meta robots. Canonical == `<loc>` en las 22 (script: `CANON!=LOC` 0). Barra final: `/servicios/` -> 308 a `/servicios` (un salto). Mayúsculas: `/Servicios/Minecraft` -> 404 (correcto, no hay duplicado). `/minecraft` -> 308 `/servicios/minecraft`. 404 real: `/nope` -> `404`, `noindex`, `Cache-Control: private, no-cache, no-store`. Producción cerrada: `Disallow: /`, `x-robots-tag: noindex, nofollow`, sitemap 404 (esperado). Pendiente de lanzamiento: `www` 301, `/discord`. Gap: hallazgos 2 y 8. |
| 2.2 Idiomas | **Cumple** | Script de reciprocidad sobre las 22 URL: `NONRECIP` 0, `SM!=HEAD` 0 (hreflang del `<head>` idéntico al del sitemap; cada página apunta a es, en y `x-default` -> versión `/en`). `<html lang>` es/en correcto. `og:locale` `es_LA`/`en_US` con `og:locale:alternate` cruzado. Todos los hrefs internos (49) son URL finales (en el sitemap, o `?linea=`/`#`), ninguno pasa por redirección. Sin redirección por idioma: `curl -H "Accept-Language: en-US"` a `/` -> `200`; `curl -H "Accept-Language: es-CO"` a `/en/services` -> `200`; sin `Set-Cookie` en respuestas. |
| 2.3 Metadatos | **Cumple** | Títulos 23-58 caracteres y descripciones 128-157, únicos (medidos en las 22). `og:image` 1200x630 PNG por página, las 22 responden 200 `image/png` (27-37 KB). `twitter:card=summary_large_image` + imagen. `theme-color #111110`, `manifest`, `icon.svg`, `apple-icon.png` 200. Nota: títulos/descripciones en inglés provisionales (decidido). |
| 2.4 Estructura HTML | **Parcial** | Jerarquía h1 -> h2 -> h3 sin saltos en las 22 (un solo h1). Sin enlaces vacíos (`EMPTYLINK` 0). Sin `<img>` en las páginas (no hay `alt` que revisar). Contenido principal en el HTML servido (SSR, 50-81 KB sin comprimir; 12-13 KB con gzip: `curl -H "Accept-Encoding: gzip"` -> 12072 / 13193 bytes). Falta: migas en `/nosotros` y `/en/about` (hallazgo 1). |
| 2.5 Datos estructurados | **Parcial (según lo que existe hoy)** | Presentes y válidos como JSON: home con `Organization` (`@id` `/#organization`, `logo` `/logo.png` 200, 1024x1024 PNG, `knowsLanguage`) + `WebSite` (`publisher` -> `@id` de la organización); `BreadcrumbList` en servicios, contacto, legales (URLs absolutas, posiciones 1..n, coinciden con las migas visibles "Inicio / Servicios / ..."); `Service` por línea con `provider` -> Organization y `url`. Faltan por diseño: `sameAs`, correo (decidido); `CreativeWork`/`Article` (pasos 5 y 6). Huecos reales: hallazgos 1, 3 y 4. Prueba de resultados enriquecidos/Search Console: no ejecutable aquí (herramientas externas). |
| 2.6 Rendimiento | **No evaluado (fuera del encargo)** | No se corrió Lighthouse. Indicios por fuente: sin `<img>` en el HTML, 2 fuentes `woff2` con `preload`, CSS externo único, HTML gzip 12-13 KB. Falta medirlo (Lighthouse CI móvil >= 95) en la lista de lanzamiento. |
| 2.7 Confianza | **Cumple (HTTP) / parcial (visible)** | Cabeceras en todas las respuestas: `Strict-Transport-Security: max-age=63072000`, `Content-Security-Policy` estática, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`. Pie con `nav aria-label="Legal"` (Privacidad / Términos) y `aria-label="Canales de contacto"` presente en todas las páginas. Los canales visibles y el responsable legal son de revisión visual (ui-qa), no verificados aquí. |

## Lista de lanzamiento (sección 6) frente al estado actual

| Ítem | Estado hoy |
|---|---|
| Títulos/descripciones únicos | Hecho (22/22) |
| hreflang recíproco con x-default | Hecho y verificado (0 fallos) |
| Canonical propio | Hecho (22/22) |
| Sitemap + robots | Hecho en build abierto; cerrado en producción (esperado) |
| JSON-LD validado sin errores | Parcial: validado solo como JSON; falta pasar validador de schema.org / Prueba de resultados enriquecidos (hallazgos 3, 4) |
| Imágenes OG por página | Hecho (22/22 con 200) |
| 404 + redirecciones `/minecraft`, `/discord` | `/minecraft` 308 hecho; 404 hecho; `/discord` pendiente (decidido) |
| Lighthouse >= 95 | Sin medir en este informe |
| `www` 301, dominio, Search Console, Bing, Umami, perfiles | Pendientes de lanzamiento (decidido) |

## Qué falta para dar por completo el paso 4

1. Migas + `BreadcrumbList` en `/nosotros` y `/en/about` (hallazgo 1) y ampliar la prueba de humo para que exija `BreadcrumbList` en toda página interna.
2. Decidir la política de caché del HTML antes de poner CDN delante del dominio (hallazgo 2).
3. Pasar el JSON-LD por el validador de schema.org y la Prueba de resultados enriquecidos en el build abierto; corregir `@id`/descripción por idioma y `availableLanguage` si el validador lo marca (hallazgos 3, 4).
4. Medir Lighthouse móvil (2.6) en producción.
Lo demás (Bajo) es opcional.

## Resolución (2026-11-15, hilo principal, commit 44a4e8c)

| # | Sev. | Qué se hizo |
|---|---|---|
| 1 | Medio | **Corregido.** Nosotros lleva migas y `BreadcrumbList`: el plan de SEO pide migas en toda página interna y está por encima de las maquetas en el orden de fuentes. La prueba de humo ahora las exige en toda página interna. |
| 2 | Medio (condicional) | Backlog 2 (regla de caché del HTML al poner el CDN, en el lanzamiento). |
| 3 | Bajo | **Corregido.** Un solo nodo `WebSite` (mismo `@id` en los dos idiomas, `inLanguage` con ambos) y `Organization` sin descripción que cambie por idioma. |
| 4 | Bajo | **Corregido** y verificado en schema.org: los idiomas del servicio van en `availableChannel` (`ServiceChannel`). |
| 7 | Bajo | **Corregido** (decisión del fundador): `favicon.ico` generado desde el ícono del paquete de marca (`scripts/make-favicon.mjs`). |
| 5, 6, 8, 9 | Bajo | Backlog 35. |

Lighthouse móvil, que la auditoría no midió: 100 en las cuatro categorías (`evidencia-paso4.txt`, sección 3).
