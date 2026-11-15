# Revisión de seguridad — paso 4 (cabeceras, CSP, proxy, redirecciones, freno de lanzamiento)

- **Revisor:** security-engineer · **Fecha:** 2026-11-15 · **Nivel:** N2, riesgo normal (ASVS 5 L1).
- **Alcance:** `git diff 20f367a..1ed1944 -- web/` y el código que ese lote toca o del que depende (`proxy.ts`, `routes.ts`,
  `security-headers.ts`, `next.config.ts`, `indexing.ts`, `launch.ts`, `site-url.ts`, `contact.ts`, `quote.ts`,
  `quote-form.tsx`, `language-choice.ts`, `json-ld.ts`, `robots.ts`, `sitemap.ts`, `layout.tsx`, `global-not-found.tsx`).
- **Entornos:** producción `https://web-production-f1d7c246.up.railway.app` (commit 1ed1944, cerrado), build cerrado
  local `:4700` y build indexable local `:4712`. Solo peticiones normales con `curl`. No se compiló, no se instaló nada,
  no se editó código.

## Veredicto

**Sin bloqueantes.** 0 Crítico · 0 Alto · 1 Medio · 6 Bajo · 3 Info.

No encontré ningún punto por donde HTML o script de un tercero entre en una página, ni redirección abierta. La CSP
está bien armada para un sitio estático y es más estricta que la referencia del Workspace (`style-src 'self'` sin
`'unsafe-inline'`, sin `data:` ni `blob:`). El hallazgo Medio es de configuración: el freno de lanzamiento tiene una
salida (`SITE_LAUNCH_CHECK=off`) que solo la documentación limita a local.

## Hallazgos

| # | Sev. | ASVS / ref. | Dónde | Escenario (quién, por dónde, qué logra) | Arreglo propuesto |
|---|---|---|---|---|---|
| M1 | **Medio** | V13 configuración (ID exacto sin verificar), A10 fallar cerrado | `web/src/lib/launch.ts:37` | Al conectar el dominio, alguien (fundador o agente) copia a Railway las variables del build indexable local de la evidencia (`SITE_INDEXABLE=true SITE_LAUNCH_CHECK=off`) para que el despliegue no falle. El build pasa y el sitio queda indexable con 28 marcadores a la vista (`[Nombre o razón social]` en las páginas legales, `[correo@kardenum.com]`). Si además `SITE_URL` sigue siendo la dirección de Railway, los canónicos y el sitemap apuntan al dominio temporal. Hoy lo único que lo impide es una línea del README y de `PROYECTO.md`. Probabilidad 1 × impacto 3. | Que `off` solo valga fuera de Railway y de CI: en `assertLaunchReady`, lanzar si `SITE_LAUNCH_CHECK=off` llega junto con `CI` o con alguna variable `RAILWAY_*`. Está por confirmar que Railway las expone durante el build; si no, usar una variable propia definida en Railway (por ejemplo `SITE_DEPLOY=railway`). No condicionarlo a un `SITE_URL` de loopback: el build indexable local de la evidencia usa `SITE_URL=https://kardenum.com` (verificado: el sitemap de `:4712` da `https://kardenum.com`), así que esa condición rompería la verificación del proyecto. Una prueba en `launch.test.ts` para cada caso. |
| B1 | Bajo | V3 cabeceras (ID exacto sin verificar) | Next, antes de `headers()` | Hay respuestas que salen **sin ninguna** cabecera del sitio (ni CSP, ni HSTS, ni nosniff, ni `X-Robots-Tag`): (a) las redirecciones propias de Next por barra final y por `//` (`/contacto/`, `/es/`, `/minecraft/`, `//x`), en producción y en local (`:4700/contacto/` → 308 sin cabeceras); (b) los 500 de rutas malformadas (`/%`, `/%c0%af`) y del método `TRACE`. No hay escenario de ataque: las 308 no tienen cuerpo y los 500 dicen siempre `Internal Server Error` en `text/plain`. Pero contradice lo que afirman el comentario de `next.config.ts`, el de `proxy.ts` y la evidencia ("every response"). Los buscadores no indexan una 308. | Corregir los comentarios y la evidencia: "toda respuesta que llega a la app de Next". Opcional: `skipTrailingSlashRedirect: true` y hacer la redirección de barra final en `proxy.ts`, que sí lleva las cabeceras. El `//` y los 500 previos al enrutado no tienen arreglo desde la app (por confirmar). No lo veo necesario para N2. |
| B2 | Bajo | Superficie innecesaria, CWE-400 | `web/next.config.ts` (falta `images`) | El sitio no usa `next/image`, pero `/_next/image` responde 200 (`?url=/og/es/inicio.png&w=3840&q=75` → 200 `image/png`). Cualquiera puede pedir redimensionados de las imágenes locales. Es acotado (solo anchos y calidades configurados: `q=100` → 400), queda en caché y no acepta URLs externas (400). Aun así es CPU y disco gastados en un endpoint que no se usa, y el optimizador de imágenes ha tenido avisos de seguridad de Next en el pasado (sin verificar cuántos). | `images: { unoptimized: true }` en `next.config.ts`. Verificado en el código: `node_modules/next/dist/server/next-server.js:193` responde 404 cuando `imagesConfig.unoptimized` es verdadero. Agregar al smoke `GET /_next/image?... → 404`. |
| B3 | Bajo | V1 validación (ID exacto sin verificar), A10 | `web/src/routes.ts:146-152`, `web/src/proxy.ts:12`, `web/src/lib/contact.ts:18-21` | La invitación de Discord se valida (`externalHttpsUrl`) solo cuando se carga `proxy.ts`: lo llama a nivel de módulo, y ninguna prueba ni `next.config.ts` llama `shortLinkRedirects()` con la configuración real (las pruebas usan `withDiscord(...)` fabricado). Si el dueño pone `discord.gg/abc` sin `https://`, probablemente el build pasa y el proxy lanza al primer request, con todas las páginas en 500 (por confirmar: no compilé). Lo atraparía el smoke antes del push. Además, `getChannelHref("discord")` pone el valor crudo en los `href` de Contacto y de la línea Discord sin esa validación. | Llamar `shortLinkRedirects()` en `next.config.ts` junto a `assertLaunchReady()` (falla el build y no el servidor) y que `getChannelHref("discord")` use la misma `externalHttpsUrl`. Mejor aún: validar `discordInvite` (https y host `discord.gg` / `discord.com`) en un solo lugar. |
| B4 | Bajo | Fallar cerrado | `web/src/lib/launch.ts:11-15`, `web/src/lib/indexing.ts:17` | (a) `findPending` solo mira `status`, así que `{ status: "ready", value: "" }` o `{ status: "ready", value: "[correo]" }` (marcador copiado a mano) pasa el freno y sale publicado. (b) `SITE_INDEXABLE=TRUE`, `1` o `" true"` dejan el sitio cerrado en silencio. Falla hacia lo seguro, pero el fundador cree que lanzó y el sitio sigue con `noindex` y marcadores. | (a) En `getLaunchBlockers`, tratar también como pendiente todo `ready` cuyo valor (o algún párrafo) esté vacío o calce con `/^\[.*\]$/`. (b) En `next.config.ts`, fallar si `SITE_INDEXABLE` está definida y no es exactamente `true` o `false`. |
| B5 | Bajo | N1 de `estandares/seguridad.md` | `web/public/.well-known/` (no existe) | `/.well-known/security.txt` → 404. Un investigador que encuentre un fallo no tiene a quién avisar. Ítem pendiente del checklist que no está en "ya decidido". Depende del correo, que sigue pendiente. | Generarlo desde `siteConfig.contact.email` (por ejemplo `src/app/.well-known/security.txt/route.ts` estático, con `Contact:` y `Expires:`) para que el freno de lanzamiento lo cubra solo. El matcher del proxy ya excluye rutas con punto. |
| B6 | Bajo | N2: "Next y React en la última parcheada" | `web/package.json` | `react` y `react-dom` están en 19.3.0. Existe 19.3.1 (publicada el 2026-10-14). `pnpm audit --prod` no reporta avisos, así que no consta como arreglo de seguridad. `next-intl` 4.14.9 frente a 4.15.1. `next` 16.4.6 es la última. | Subir a 19.3.1 en el ciclo mensual de parches (con el cooldown de versiones nuevas), sin urgencia. |
| I1 | Info | — | Cabeceras de respuesta | `x-middleware-rewrite: /es/contacto`, `x-nextjs-cache`, `x-nextjs-prerender` y las rutas `/_next/` delatan Next.js. Quitar `X-Powered-By` no oculta el stack. No es riesgo: solo que el objetivo del comentario no se cumple. | Nada, o ajustar el comentario de `poweredByHeader`. |
| I2 | Info | V3.4 | `security-headers.ts` | Endurecimientos estáticos baratos, no exigidos en N2: `Cross-Origin-Opener-Policy: same-origin` y `script-src-attr 'none'` (ver la sección CSP). | Evaluar en el laboratorio de CSP. |
| I3 | Info | Operación | `/sitemap.xml` | Mientras el sitio está cerrado, `/sitemap.xml` es un 404 con `Cache-Control: s-maxage=31536000`. Si al lanzar hay CDN (backlog 2), esa respuesta podría quedar en caché un año. Lo menciono porque toca la decisión del `s-maxage`. | Purgar la caché del CDN al lanzar; anotarlo en el backlog 2. |

## Punto 1 — cabeceras: ¿falta o sobra alguna?

- **Faltan para N2:** ninguna (CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy, `frame-ancestors`). `security.txt` (B5) no es una cabecera, pero es N1.
- **Sobra:** ninguna que haga daño. `X-Frame-Options: DENY` es redundante con `frame-ancestors 'none'`, pero barato y útil para navegadores viejos.
- **Build indexable `:4712`:** las seis cabeceras siguen en `/` y `X-Robots-Tag` desaparece, como debe ser.
- **Respuestas sin cabeceras:** las de B1.

## Punto 2 — la concesión `'unsafe-inline'` en `script-src`

**Riesgo residual real en este sitio: bajo.** `'unsafe-inline'` solo sirve a un atacante que logre inyectar HTML en una
página servida. Revisé por dónde podría entrar:

- **No hay contenido de terceros en el HTML.** Todo sale de `site.config.ts`, `messages/*.json` y `content/*`, escritos por el
  estudio, y React lo renderiza como texto escapado. Las páginas son prerenderizadas: el 404 no refleja la ruta
  pedida (sonda `/zzcanary%3Cb%3Exx?q=%3Cscript%3E…`, sin eco en el HTML).
- **Entradas del visitante, todas cerradas:**
  - `?linea=` se compara con la lista de líneas (`parseLineParam`); un valor fuera de la lista se ignora y nada se refleja (sonda `?linea=%3Cimg…%3E`, sin eco).
  - El cotizador renderiza lo tecleado como texto de React; sale de la página solo por `encodeURIComponent` dentro de `https://wa.me/<dígitos>`, con `window.open(…, "noopener,noreferrer")`.
  - La cookie `kardenum_lang` se lee con una regex que solo acepta `es|en` y nunca se escribe en el DOM.
  - `pathInLocale` solo devuelve rutas del registro.
- **`dangerouslySetInnerHTML`, dos usos:**
  - El script de idioma es una constante.
  - El JSON-LD sale de datos tipados con `<` escapado como `<`. Eso basta: es `application/ld+json`, no se ejecuta, y solo `</script` podría romperlo.
- **Sinks de DOM en código propio:** ninguno (`innerHTML`, `eval`, `new Function`, `localStorage`, `fetch`).
- **Lo que la CSP no cubriría de todos modos:**
  - Una dependencia comprometida: va dentro de `'self'`.
  - Railway comprometido: sirve la propia política.

  Con o sin `'unsafe-inline'`, el riesgo es el mismo.

El riesgo cambia el día en que entre contenido que el estudio no escribe: guías o portafolio desde un CMS o MDX con
HTML, textos de clientes, analítica de terceros. Ese es el disparador para reabrir el backlog 30.

**Opciones estáticas más estrictas.** El backlog 30 ya recoge la política por página con hashes. Estas no estaban:

1. **`script-src-attr 'none'`:**
   - **Qué hace:** bloquea los manejadores en línea (`<img onerror=…>`, el payload más común de una inyección de HTML) y deja pasar los `<script>` en línea que Next necesita. Es estática y la misma para todas las páginas.
   - **Evidencia:** el HTML servido de `/`, `/contacto` y el 404 no tiene ningún atributo `on*=` (React adjunta los eventos por JS, no por atributo).
   - **Límites:** no frena un `<script>` inyectado ni las URL `javascript:`. Que React 19 bloquee estas últimas en `href` es dato de memoria, sin verificar.
   - **Por confirmar:** que nada de Next 16.4.6 use atributos `on*` en otras páginas. Se comprueba con el laboratorio de la sección 6 y la guardia de CSP de las e2e.
2. **Una sola política con la unión de los hashes de todas las páginas.** Es estática y no necesita una política por página.
   - **Medido en `:4700`:** 23 páginas (22 del sitemap más el 404) tienen 40 scripts en línea ejecutables distintos. Solo 2 son comunes a todas; el máximo por página es 6. `script-src` queda en unos 2,2 KB, un tamaño aceptable para una cabecera.
   - **Costo:** los hashes existen solo después del build y `headers()` se evalúa antes. Habría que compilar dos veces, con un `generateBuildId` determinista (por confirmar si el `buildId` va dentro de `self.__next_f`), o reescribir `routes-manifest` después del build, que es un formato interno y frágil.
   - **Riesgo:** una página nueva sin su hash no hidrata. La guardia de CSP de Playwright lo atraparía.
   - **Recomendación:** no hacerlo ahora. Con lo que hay en las páginas, no compra seguridad real.
3. **Trusted Types (`require-trusted-types-for 'script'`):** solo protege de XSS por DOM, que aquí no existe. La compatibilidad con el runtime de Next está por confirmar. No lo recomiendo.

**Recomendación:** mantener la política. Probar `script-src-attr 'none'` en el laboratorio de CSP y, si no rompe nada,
agregarla. Dejar la opción 2 anotada en el backlog 30.

## Punto 3 — proxy y redirecciones (verificado, sin hallazgos)

| Sonda (local `:4700`, sin punto literal para que el proxy la atienda) | Resultado |
|---|---|
| `/es/%2F%2Fevil`, `/es/%5Cevil`, `/es/%5C%5Cevil`, `/es/%2f%5cevil`, `/es/%2F%2Fevil%2Ecom`, `/es/%2F%2F2130706433` | 308 a `/%2F%2Fevil`, `/%5Cevil`… El `Location` conserva la codificación; el navegador lo trata como ruta del mismo origen |
| `/es/%09/evil`, `/es/%0A/evil`, `/es/%0D%0A/evil`, `/es/%09/%09/evil`, `/es/%09/%0A/%09/evil` (también en producción) | 308 a `/evil`: los caracteres de control se quitan y las barras se colapsan; nunca sale `//` |
| `/ES/%2F%2Fevil`, `/En/%2F%2Fevil`, `/ES//evil`, `/es///evil`, `/es/\\evil` (literal) | 308 a rutas de una sola barra (`/es/…`, `/ES/evil`, `/es/evil`) |
| `//evil.com`, `/es//evil.com` (producción) | Normalización propia de Next: 308 a `/evil.com`, `/es/evil.com` |
| `/minecraft?a=1&next=https://evil.com` | 308 a `/servicios/minecraft?a=1&next=https%3A%2F%2Fevil.com`: la consulta se reenvía, pero al mismo origen y nada la lee |
| `Host: evil.com` y `X-Forwarded-Host: evil.com` (local); solo `X-Forwarded-Host: evil.com` (producción) | `Location` relativo (`/servicios/minecraft`, `/`): sin inyección de host ni envenenamiento por esa vía. En producción, `Host: evil.com` da 404 en el borde de Railway, que enruta por host |
| `/minecraft%0d%0aSet-Cookie:x=1` | 404; CRLF eliminado, sin cabecera nueva |
| `x-middleware-subrequest: proxy:proxy:…`, `src/proxy:…`, `middleware:…` | El proxy corre igual (308): CVE-2025-29927 no aplica |
| `/discord` con la invitación pendiente | 404 con cabeceras: no es una dirección del sitio |
| `/Minecraft` | 404 (los atajos distinguen mayúsculas; aceptable) |

- **`/discord`:**
  - Solo apunta a `siteConfig.contact.discordInvite`.
  - Se valida con `https:` y `URL.href`; las pruebas rechazan `http:`, `javascript:`, `//…`, sin esquema y vacío.
  - No reenvía la consulta.
  - El destino interno solo puede ser un `AppPathname` tipado del registro.
- **La conversión 307→308 de next-intl** solo afecta redirecciones al mismo origen. No hay bucles: `/ES` va a `/es` y luego a `/`, en dos saltos.

## Punto 4 — entrada del visitante (sin hallazgos)

- **RF-5, HTML servido de `/contacto` (producción):**
  - `<form>` sin `action`.
  - Cinco controles `disabled` (tres `select`, un `textarea`, un `input`) y el botón `type="submit" disabled`.
  - **0** controles con `name=` (`grep -c ' name='` → 0).
  - El envío hace `preventDefault()` y solo `window.open` a `wa.me`.
  - Sin `fetch`, sin almacenamiento; `connect-src 'self'` y `form-action 'self'` lo refuerzan.
  - Lo único que guarda algo es el autocompletar del navegador por `autoComplete="name"`, que es del navegador y no del sitio.
- **`buildWhatsAppUrl`:**
  - Solo dígitos del número.
  - Mensaje con `encodeURIComponent`, sin surrogates sueltos ni caracteres de control.
  - Reemplazo con función, así que `$&` se trata como texto.
- **Cookie:** `kardenum_lang=es|en; Path=/; Max-Age=1 año; SameSite=Lax; Secure` en https. Sin `HttpOnly` porque la lee un script, lo cual es correcto para un dato no sensible. Aunque otro sitio lograra plantarla, la regex solo acepta `es|en`.

## Punto 5 — fallar cerrado

- **Indexación:** solo `SITE_INDEXABLE === "true"` abre, y los cuatro controles (robots, `X-Robots-Tag`, meta robots, sitemap 404) usan la misma función y se calculan en el build. Verificado en producción:
  - `X-Robots-Tag: noindex, nofollow` en página, 404, redirecciones del proxy, `robots.txt`, OG, `/_next/static`, `/_next/image`.
  - `robots.txt` con `Disallow`.
  - `/sitemap.xml` → 404.
- **Excepciones:** salen sin `X-Robots-Tag` las de B1, que son 308 sin cuerpo y no se indexan.
- **Huecos:** M1 (`SITE_LAUNCH_CHECK=off` sin límite) y B4 (valores `ready` vacíos o con corchetes; valor mal escrito silencioso).
- **CSP de desarrollo:** `'unsafe-eval'` solo se agrega con `NODE_ENV=development`; producción no lo lleva (cabecera verificada).

## Punto 6 — cadena de suministro y secretos

- `pnpm --dir web audit`: 1 moderada, `minimatch` (GHSA-g3hv-75wg-m249), solo en la cadena de `eslint-config-next`. Ya decidido (backlog 1).
- `pnpm --dir web audit --prod`: **No known vulnerabilities found**.
- **Repo:**
  - El único `.env*` versionado es `web/.env.example`; `.gitignore` tiene `.env*` y `!.env.example`.
  - `git grep` de patrones de claves (`api_key`, `secret`, `token`, `BEGIN … PRIVATE`, `ghp_`, `sk_live`, `AKIA`) en 1ed1944: solo menciones en docs y nombres de tokens de diseño.
- **Bundle del cliente:** 10 chunks de `/`, `/contacto` y `/en/legal/privacy` (645 KB).
  - Sin `SITE_*`, `RAILWAY_*`, `NEXT_PUBLIC_*`, rutas locales ni `sourceMappingURL`.
  - `.map` → 404.
- **Páginas de error:** el 500 dice solo `Internal Server Error` y el 502 de Railway `upstream error`; el 404 es la página de marca. Sin trazas ni versiones.
- **Archivos sensibles:** `/.git/config`, `/.env`, `/server.js` y `/package.json` → 404.

## Checklist N1/N2 aplicable (sitio estático sin BD ni auth)

| Ítem | Estado | Evidencia |
|---|---|---|
| HTTPS + HSTS | Cumple (decidido sin `includeSubDomains`/`preload`) | `strict-transport-security: max-age=63072000` en producción |
| CSP, nosniff, Referrer-Policy, Permissions-Policy, `frame-ancestors 'none'` | Cumple (salvo B1) | `curl -I` de página, 404, 308 del proxy, robots, OG, estáticos, `HEAD /` |
| Sin secretos en repo ni bundle | Cumple | Punto 6 |
| `gitleaks` / push protection | Pendiente (paso 7, ya decidido) | — |
| Formularios: validación servidor, anti-spam, rate limit | No aplica | El cotizador no envía nada al servidor (RF-5 verificado) |
| `pnpm audit` sin altas/críticas | Cumple | 1 moderada de desarrollo |
| `dangerouslySetInnerHTML` solo con datos seguros; `rel="noopener noreferrer"` | Cumple | `json-ld.ts` (escapa `<`), script constante; `channel-link.tsx:27`, `line-page.tsx:84` |
| Errores sin trazas | Cumple | Punto 6 |
| `security.txt` | No cumple | B5 |
| N2: Next/React en la última parcheada | Next sí; React una patch atrás | B6 |
| N2: BD, admin, subidas | No aplica | Sin backend |

## Comandos usados (salida relevante)

```
# Cabeceras en producción (página, 404, redirecciones, robots, OG, estáticos)
curl -s -o /dev/null -D - $P{/,/contacto,/pagina-que-no-existe,/es,/minecraft,/robots.txt,/og/es/inicio.png,/discord,/sitemap.xml,/favicon.ico}
  -> las 6 cabeceras + x-robots-tag en todas; /es y /minecraft 308 con cabeceras
curl -s -o /dev/null -D - $P/_next/static/chunks/<js|css> $P/_next/static/media/<woff2> ; curl -sI $P/
  -> cabeceras presentes; HEAD también
curl -s -o /dev/null -D - $P/contacto/
  -> HTTP/1.1 308 · location: /contacto · refresh · (sin CSP, HSTS, nosniff ni X-Robots-Tag)        [B1]
curl -s -D - http://127.0.0.1:4700/%   ;  curl -X TRACE $P/
  -> 500 Internal Server Error, Content-Type: text/plain, sin cabeceras del sitio; el proceso sigue vivo (/ -> 200)  [B1]
curl "$P/_next/image?url=/og/es/inicio.png&w=64&q=75"   -> 200 image/png                         [B2]
curl "$L/_next/image?url=https://evil.com/a.png&w=64&q=75" -> 400
sed -n 192,195p node_modules/next/dist/server/next-server.js
  -> if (imagesConfig.loader !== 'default' || imagesConfig.unoptimized) { await this.render404(...) }
curl $P/.well-known/security.txt  -> 404                                                          [B5]
# Redirección abierta: tabla del punto 3
# Hashes (script en el scratchpad, lee :4712/sitemap.xml y pide cada página a :4700)
pages: 23 | distinct inline hashes: 40 | shared by all pages: 2 | max per page: 6 | script-src length with union: 2177 bytes
# RF-5
curl -s $P/contacto | grep -o -E '<(input|select|textarea)[^>]*>' | grep -c ' name='   -> 0
pnpm --dir web audit         -> 1 vulnerabilities found · Severity: 1 moderate (minimatch, eslint)
pnpm --dir web audit --prod  -> No known vulnerabilities found
pnpm view next dist-tags.latest -> 16.4.6 · react 19.3.1 (2026-10-14) · next-intl 4.15.1
```

## Lo que no pude verificar

- Si un `discordInvite` mal escrito rompe el build o solo el servidor (B3): no compilé, por regla del encargo.
- Si `script-src-attr 'none'` no rompe ninguna página ni el 404 (solo revisé el HTML de 3 páginas). Va en el laboratorio de la sección 6.
- Si el `buildId` forma parte de los scripts en línea, lo que condiciona la opción 2 de la CSP.
- Si Railway expone variables `RAILWAY_*` durante el build (variante del arreglo de M1).
- Si 19.3.1 de React corrige algo de seguridad: no hay aviso en `pnpm audit`.
- El 502 de `/%` en producción lo produce el borde de Railway (no llega a la app); no lo controla el proyecto.

## Opinión en una línea sobre lo ya decidido

HSTS sin `includeSubDomains` sobre `*.up.railway.app` es correcto; al conectar `kardenum.com`, decidir `preload` antes
de crear subdominios. El `s-maxage` de un año está bien para HTML estático, pero exige purgar el CDN al lanzar (I3).

## Resolución (2026-11-15, hilo principal, commit 44a4e8c)

| Hallazgo | Sev. | Qué se hizo |
|---|---|---|
| M1: `SITE_LAUNCH_CHECK=off` saltaba el freno en cualquier entorno | Medio | **Corregido.** Con `CI` o cualquier variable `RAILWAY_*` presente, el propio interruptor hace fallar el build. Prueba unitaria. |
| B2: `/_next/image` respondía sin que el sitio use `next/image` | Bajo | **Corregido.** `images: { unoptimized: true }`; ahora responde 404. |
| B3: la invitación de Discord solo se validaba al cargar el proxy | Bajo | **Corregido.** Se valida en el build (`next.config.ts`). |
| B4: un valor listo pero vacío o con corchetes pasaba el freno | Bajo | **Corregido** (`findUnfilled`). |
| `script-src-attr 'none'` (opción estática no considerada) | — | **Aplicado**; las 381 pruebas de navegador pasan sin violaciones. |
| B1: redirecciones propias de Next y errores tempranos sin cabeceras · B5: sin `security.txt` · B6: React 19.3.1 disponible | Bajo | Backlog 34. |
| Una sola política con los hashes de todas las páginas (40 scripts, ~2,2 KB, dos compilaciones) | — | Backlog 30. |

## Re-verificación del delta `1ed1944..44a4e8c` (2026-11-15, mismo revisor): sin bloqueantes

- **M1, B2 y B3: resueltos.** En producción `/_next/image` responde 404, `/minecraft` 308 y `/discord` 404 con la
  invitación pendiente. Por confirmar al lanzar: que Railway exponga sus `RAILWAY_*` durante el build real.
- **B4: a medias.** `findUnfilled` cubre lo marcado como listo y vacío. Un `SITE_INDEXABLE` mal escrito (`TRUE`, `1`) deja
  el sitio cerrado sin avisar: sigue Bajo, backlog 34.
- **`script-src-attr 'none'`** en producción; 0 atributos `on*=` en el HTML servido de cinco páginas.
- **Bajo nuevo: `UMAMI_SRC` aceptaba cualquier host https y direcciones con usuario y clave.** Corregido lo segundo (el
  build falla); la lista de hosts permitidos queda para cuando se sepa dónde vive Umami (backlog 31).
