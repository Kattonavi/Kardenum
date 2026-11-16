# Revisión de seguridad — paso 5 (subpáginas, portafolio, guías MDX, dependencias)

- **Revisor:** security-engineer · **Fecha:** 2026-11-15 · **Nivel:** N2, riesgo normal · **Ronda única.**
- **Alcance:** `git diff db32532..3b758fa -- web/`, con las specs 004, 005 y 006 y la evidencia `evidencia-paso5.txt`.
- **Entornos:** producción `https://web-production-f1d7c246.up.railway.app` (commit 3b758fa), solo lecturas con `curl`.
- **Lo que no hice:** no compilé ningún clon ni instalé las guías de prueba. Lo que dependía de eso va como "por confirmar".

## Veredicto

**Sin bloqueantes.** 0 Crítico · 0 Alto · 1 Medio · 4 Bajo · 2 Info.

Lo que sí funciona:

- Los casos privados no llegan a ningún archivo servido. La evidencia lo muestra y yo lo confirmé por el grafo de importaciones: ningún componente de cliente importa `content/cases`, `lib/portfolio` ni `lib/entries`.
- Las dependencias nuevas están limpias.
- El MDX no tiene ninguna entrada de visitantes.

El Medio es el único hueco real de la promesa de la spec 005: que un caso "reservado" no lleve el nombre del cliente lo garantiza el tipo solo en un campo.

## Hallazgos

| # | Sev. | Dónde | Escenario (quién, por dónde, qué logra) | Arreglo propuesto |
|---|---|---|---|---|
| M1 | **Medio** | `web/src/content/types.ts:202-215` (`CaseContent`), `web/src/components/portfolio/case-images.ts:9-11` | El estudio publica un caso **reservado** para un cliente con acuerdo de confidencialidad. El tipo impide un campo `client.name`, pero hay texto libre: `id`, `slug`, `name` (nombre del proyecto), `summary`, `cardText`, `meta.title/description`, textos alternativos y nombres de archivo de imagen. La convención documentada empuja a usar el nombre: `src/assets/cases/<case id>/kaelion-spawn.avif`. Si alguno lleva el nombre del cliente ("tienda-acme"), sale en la URL, el sitemap, el JSON-LD, la imagen OG, el payload RSC de **todas** las páginas (ver I1) y la ruta de la imagen en `/_next/static/media/`. Turbopack conserva el nombre original del archivo: lo comprobé en `web/.next/static/media/apple-icon.235d5mhjvu-ba.png`. Se rompe el acuerdo con el cliente. La evidencia (sección 3.B) solo comprobó que la etiqueta dice "Cliente reservado". Probabilidad 2 × impacto 2–3. | Una prueba que corra en el build para todo caso `reservado`: (1) `id`, `slug` y nombres de archivo de imagen genéricos, por ejemplo `^caso-[a-z0-9-]+$` o una lista de palabras permitidas; (2) ningún texto del caso puede contener términos de una lista de confidencialidad que no se versiona (variable `CONFIDENTIAL_TERMS` o archivo ignorado por git), revisada también por `pnpm smoke` sobre el HTML, el RSC y el sitemap servidos. Documentar la regla en `types.ts` junto a `reservado`. |
| B1 | Bajo | `web/src/routes.ts:4` → `site.config.ts`; importado por componentes de cliente (`footer-notices.tsx:4`, `language-bar.tsx:10`, `locale-switcher.tsx:8`, `nav-link.tsx:8`) | `siteConfig` y los valores de `portfolioPending` viajan **enteros** en el JS del navegador de todas las páginas, con cualquier flag o visibilidad. Verificado en los chunks de producción: `legal:{owner:{name:h("[Nombre o razón social]"…`, `features:{portfolio:!1,…}`, `h("[Captura del servidor]"…`. Hoy son notas, pero lo que se escriba ahí es público aunque la página que lo usa esté apagada (dirección, teléfono e identificación del responsable antes de lanzar, o una nota de un caso que pasó a `privado` y no se borró de `portfolioPending`). Como los legales se publican igual, el riesgo es bajo. | Que los componentes de cliente no importen `site.config.ts`: mover lo que necesitan de `routes.ts` (tabla de rutas, `languageHref`, `entryLinkKey`) a un módulo sin `siteConfig` y pasar los flags por props. Poner `import "server-only"` en `site.config.ts` para que el build falle si vuelve a entrar al cliente. |
| B2 | Bajo | `web/src/lib/portfolio.ts:56-59` (RF-7), `launch.ts` | Con el sitio ya indexable y el portafolio, las guías o las subpáginas apagadas, sus páginas siguen respondiendo 200 por dirección, con `noindex` y marcadores (`[Año]`, `[El reto: …]`). El comentario dice "nobody can reach a case from the site", pero las direcciones van en el payload de cada página (I1). Cualquiera puede verlas con el sitio lanzado. No expone nada sensible hoy: Kardenum y Kaelion son proyectos propios. Es la promesa del paso 4 ("un visitante nunca ve corchetes") con una excepción no declarada. Además, `findUnfilled` solo recorre `siteConfig`: un texto con `[…]` dentro de un caso o de una guía no lo detiene nadie. | Elegir y anotar: (a) con el flag apagado, no generar las entradas (`generateStaticParams` vacío → 404 de marca) y verificarlas en un build de prueba con el flag encendido, como ya hace la evidencia; o (b) aceptar la excepción por escrito en la spec 005. Además, aplicar `hasHole` también a los textos de casos y guías publicados. |
| B3 | Bajo | `web/src/content/guides/*/*.mdx` (ninguna todavía), `web/next.config.ts` (`createMDX`) | MDX es código, no texto. Una guía puede llevar `<script>…</script>` en línea (lo permite `'unsafe-inline'`), `<iframe>`, `style=` (la CSP lo bloquea y la guardia e2e lo atrapa), `import` de cualquier módulo o `{process.env.ALGO}`, que se evalúa en el build con las variables de Railway y queda escrito en el HTML. Hoy el autor es el estudio. El riesgo aparece si una guía la redacta un agente con material de la web o un colaborador, y es justo el disparador del backlog 30 ("contenido que el estudio no escribe"). | Una prueba que lea las fuentes `.mdx` y rechace `<script`, `<iframe`, `<object`, `<embed`, `style=`, `on[a-z]+=`, `process.env`, `export` e `import` que no sean imágenes locales `./*.{avif,webp,png}`. Revisar cada guía nueva como se revisa código. |
| B4 | Bajo | `web/package.json` | `@next/mdx` 16.4.2 con `next` 16.4.6. No hay aviso, pero la mezcla de versiones de los paquetes `@next/*` es lo que la guía de Next pide evitar. `@mdx-js/react` parece no usarse: no hay `providerImportSource`, y `mdx-components.tsx` solo importa tipos de `mdx/types` (por confirmar). | Alinear `@next/mdx` con `next` en el siguiente ciclo de parches. Quitar `@mdx-js/react` si no se usa (una dependencia menos). |
| I1 | Info | `web/src/lib/entries.ts:69-73` (`entryLinks`) → cabecera de cliente | Las direcciones de todas las entradas construidas, ocultas incluidas, van en el payload RSC de **cada** página. Verificado en `/`: `"es/kaelion":{"es":"/portafolio/kaelion","en":"/en/work/kaelion"}`. Ocultar por flag no es control de acceso, y está bien que no lo sea, siempre que nada confidencial dependa de él. | Nada, más que la regla: lo confidencial se protege con `privado` (no se genera), nunca con un flag. |
| I2 | Info | Dependencias | Ningún paquete nuevo tiene scripts de instalación (`hasInstallScript`/`requiresBuild` no aparece en el lockfile, y `allowBuilds` niega los cuatro que podrían tenerlos). | — |

## Por punto del encargo

1. **Dependencias.**
   - `pnpm audit --prod`: **No known vulnerabilities found**. `pnpm audit`: solo la moderada conocida de `minimatch` (backlog 37).
   - Antigüedad, autores y versión más reciente de cada paquete:

     | Paquete | Publicado | Autores | ¿Última? |
     |---|---|---|---|
     | `@next/mdx` 16.4.2 | 2026-10-15 | vercel-release-bot | No (hay 16.4.6) |
     | `@mdx-js/loader` y `@mdx-js/react` 3.1.1 | 2025-08-29 | wooorm, timneutkens, johno | Sí |
     | `remark-gfm` 4.0.1 | 2025-02-10 | wooorm, remcohaszing | Sí |
     | `@types/mdx` 2.0.14 | 2026-06-06 | DefinitelyTyped | Sí |

   - Todos superan los 30 días y tienen el autor esperado. Sin scripts de instalación.
   - No corrí `supply-chain-risk-auditor`: para cinco paquetes del ecosistema unified/MDX, de autores conocidos, no lo justifica el nivel N2.
2. **MDX.**
   - El cuerpo de una guía viene de una importación estática por guía y por idioma (`() => import("./<id>/es.mdx")` en el registro), elegida con `findGuide(locale, slug)`. No hay ruta armada con datos de la petición, y `dynamicParams = false` limita los slugs a los generados.
   - `guideComponents`:
     - `img` lanza error, así que no hay imágenes sin tamaño.
     - Las tablas usan clase en vez de `style` (`tableCellAlignToStyle: false`).
     - Los enlaces externos llevan `rel="noopener noreferrer"`.
     - Nada escribe estilos en línea.
   - Riesgo residual: B3.
3. **Privados y reservados.** Privado: correcto. `visibleCases` es el único filtro y lo usan `entries.ts`, `sitemap.ts` y `launch.ts`; el tipo `privado` no tiene campos de contenido; la evidencia 3.B da 0 apariciones en HTML, sitemap y `.next/static`. Revisé caminos que la prueba no cubre:
   - **RSC:** solo props de páginas visibles.
   - **JSON-LD y OG:** salen de las entradas visibles.
   - **Bundle del cliente:** `content/cases` no entra; `site.config` sí (B1).
   - **Reservado:** M1.
4. **Páginas ocultas.** Aceptable para N2 mientras no tengan nada confidencial (B2, I1). En producción:
   - `/portafolio`, `/portafolio/kaelion`, `/en/work/kardenum`, `/guias` y `/servicios/minecraft/tebex` → 200 con `x-robots-tag: noindex, nofollow`.
   - `/sitemap.xml` → 404 (sitio cerrado).
5. **`PlainImage`.** Correcto. `getImageProps` con `unoptimized` apunta directo a `/_next/static/media/…`, sin pasar por `/_next/image`, que sigue en 404 desde el paso 4. Se descarta el `style` en línea y el `alt` sale del pie de foto.
6. **Freno y umbrales.**
   - `assertPortfolioReady` y `assertGuidesReady` corren en cada build con el flag encendido (evidencia 3.B0: build con exit 1 que nombra las líneas).
   - `portfolioLaunchBlockers` se suma al freno (3.B1).
   - Hueco: B2, porque `findUnfilled` no mira casos ni guías.

## Comandos usados (salida relevante)

```
curl -s $P/ | grep -o -E 'portafolio/[a-z0-9-]+|work/[a-z0-9-]+' | sort | uniq -c
  -> 2 portafolio/kaelion · 2 portafolio/kardenum · 2 work/kaelion · 2 work/kardenum           [I1]
# chunks JS de /, /contacto, /portafolio, /portafolio/kaelion, /guias (10 archivos)
grep -o -E "Captura del servidor|Nombre o raz[^\"]{0,10}|correo@kardenum" all.js | sort | uniq -c
  -> 1 Captura del servidor · 1 Nombre o razón social · 1 correo@kardenum                         [B1]
for u in /portafolio /portafolio/kaelion /en/work/kardenum /guias /servicios/minecraft/tebex /sitemap.xml
  -> 200 noindex x5 · sitemap 404
for f in $(grep -rl '"use client"' src); do grep -E 'cases|portfolio|entries|guides|content/' $f; done   -> (nada)
pnpm --dir web audit --prod -> No known vulnerabilities found · pnpm --dir web audit -> 1 moderate (minimatch)
grep -n -i "hasInstallScript\|requiresBuild" web/pnpm-lock.yaml -> (nada)
pnpm view <paquete>@<versión> time / maintainers -> tabla del punto 1
```

## Lo que no verifiqué

- No compilé un clon con las guías de prueba (`guide-fixture/install.py`). Que una guía con `<script>` o `{process.env.X}` llegue al HTML lo deduzco de cómo funciona MDX y React 19, sin medirlo (B3).
- Si `@next/mdx` exige `@mdx-js/react` como peer aunque `src/` no lo importe (comprobé con `grep`: no aparece en `src/` ni en `next.config.ts`) (B4).

## Resolución (2026-11-15, hilo principal)

| Hallazgo | Sev. | Qué se hizo |
|---|---|---|
| M1: el nombre de un cliente reservado puede colarse por el `id`, el `slug`, el nombre, un texto o el nombre de un archivo de imagen | Medio | **Corregido con una barrera y una regla.** La prueba de humo acepta `CONFIDENTIAL_TERMS="nombre,otro"` (la lista no se versiona) y busca cada término en la dirección y el cuerpo de todas las respuestas que pide, datos de las páginas incluidos; nunca imprime los términos. Probado contra producción: con un término que sí está en el sitio falla y lista las páginas; con términos ausentes pasa. La regla de autoría queda en la spec 005: un caso reservado lleva `id`, `slug`, nombre y archivos genéricos. |
| B1: `site.config.ts` viaja entero en el JavaScript del navegador | Bajo | **Avisado en el propio archivo** (todo lo que vive ahí es público). Sacarlo del navegador (`server-only` y flags por props) va con el backlog 41, que toca los mismos componentes. |
| B2: las páginas ocultas responden 200 con `noindex` y corchetes | Bajo | **Aceptado por escrito** (specs 004, 005 y 006: "construidas y ocultas, no ausentes", para revisarlas en producción). Queda como decisión del fundador para el lanzamiento: backlog 43. |
| B3: un `.mdx` es código | Bajo | **Corregido.** Prueba unitaria que rechaza en el cuerpo de una guía `import`, `export`, `<script>`, `<iframe>`, `<object>`/`<embed>`/`<link>`/`<style>`, `process.env`, estilos en línea y manejadores de eventos; los datos de una guía viven en `meta.ts`. |
| B4: `@next/mdx` 16.4.2 junto a `next` 16.4.6 | Bajo | Backlog 44: alinear cuando 16.4.6 cumpla 30 días (2026-12-09) o al subir Next. `@mdx-js/react` se queda: `@next/mdx` lo declara como dependencia par. |
| I1: las direcciones de las entradas ocultas van en los datos de todas las páginas | Info | Es el Medio 1 de la revisión de código: backlog 41. |
