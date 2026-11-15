# 006 · Guías

**Estado:** en construcción (2026-11-15). **Fuente:** maquetas `B-Guias` y `B-Guia-plantilla`,
`docs/handoff/docs/seo-sitio.md` §3 ("Guías") y §2, `plan-sitio-web.md` §4 ("Guía").

El índice de guías y la plantilla de guía. Quedan **construidos y ocultos** detrás de `features.guides`. Hoy no hay
ninguna guía escrita (las maquetas traen el contenido entre corchetes; el plan las publica en el primer mes después
del lanzamiento): esta spec entrega la plantilla lista, de modo que publicar una guía sea agregar sus archivos.

## Requisitos

| # | Requisito |
|---|---|
| RF-1 | El índice (`/guias`, `/en/guides`) DEBE mostrar: migas (Inicio › Guías), rótulo, título "Guías para entender antes de decidir.", el texto de la maqueta, los filtros por línea (Todas y las cinco líneas, sin JavaScript, como en el portafolio) y una tarjeta por guía: "Guía · línea", fecha de publicación, título, resumen y "Leer guía". |
| RF-2 | Cada guía DEBE tener su página en `/guias/<slug>` y `/en/guides/<slug>` (slug propio por idioma) con: migas (Inicio › Guías › nombre corto), rótulo "Guía · línea", título, resumen, "Por Kardenum", fecha de publicación y de actualización visibles (`<time datetime>`), minutos de lectura, el índice "En esta guía" con un enlace por sección, las secciones numeradas (00 · Antes de empezar … Siguientes pasos), el bloque "Servicio relacionado" con sus dos botones, "Guías relacionadas" (si hay otras) y el cierre de contacto. |
| RF-3 | El contenido de una guía DEBE poder usar, además de párrafos, listas, enlaces y énfasis: la lista "Qué necesitas", una captura con su descripción (que también es su texto alternativo), un bloque de código y una nota. Un bloque de código largo NO DEBE ensanchar la página: se desplaza dentro de su caja y se puede enfocar con teclado. |
| RF-4 | El bloque "Servicio relacionado" DEBE enlazar a la subpágina o línea de la guía ("Ver el servicio") y a su canal de cotización (Discord en Minecraft y Discord; el cotizador con la línea preseleccionada en las demás), con las mismas reglas de la spec 004 (RF-5). "Ver el servicio" solo se muestra si esa página es pública. |
| RF-5 | Cada guía DEBE llevar título y descripción únicos por idioma, canonical propio, hreflang (es, en, x-default → inglés) con el slug de cada idioma, `BreadcrumbList` y `Article` (título, autor y editor → la organización, fechas de publicación y actualización, imagen), y los enlaces ES / EN DEBEN llevar a la misma guía en el otro idioma. |
| RF-6 | MIENTRAS `features.guides` sea `false`, índice y guías DEBEN llevar `noindex` aunque el sitio esté abierto, quedar fuera del sitemap, y ninguna página pública DEBE enlazarlos. CUANDO sea `true`, entran al sitemap, al pie de página y a las páginas de servicio que la maqueta indica. |
| RF-7 | SI `features.guides` es `true` y no hay ninguna guía, el build DEBE fallar. Una guía a la que le falte un idioma, una fecha válida, o cuya fecha de actualización sea anterior a la de publicación, DEBE hacer fallar el build nombrando la guía. |
| RF-8 | Una dirección de guía que no existe DEBE responder el 404 de marca. Todo sigue estático, y el contenido de una guía NO DEBE romper la política de contenido (sin estilos en línea, sin scripts de terceros). |
| RF-9 | Índice y guías DEBEN cumplir lo de todo el sitio: un `h1`, títulos en orden, 44 px, sin violaciones de axe, sin desborde a 320 px ni con el texto al 200 %. |

## Diseño técnico (laboratorio del 2026-11-15, `evidencia-paso5.txt`)

Probado en un clon de descarte con `@next/mdx` 16.4.2 sobre Next 16.4.6 y Turbopack: compila y queda estático; la
importación dinámica por idioma y slug funciona; el archivo puede exportar sus propios datos; los componentes
propios llegan por `mdx-components.tsx`; el HTML no trae estilos en línea ni hay violaciones de la política en el
navegador; no agrega JavaScript al navegador; `pnpm audit --prod` sin avisos. Las tablas de Markdown NO se
convierten (hace falta otro complemento): las guías no usan tablas.

- **Dependencias nuevas** (las nombra el plan: "next-intl y MDX"): `@next/mdx` 16.4.2, `@mdx-js/loader` 3.1.1,
  `@mdx-js/react` 3.1.1 y `@types/mdx` 2.0.14, fijadas. `@next/mdx` va en 16.4.2 y no en 16.4.6 porque la regla del
  Workspace pide más de 30 días de publicada (16.4.2: 2026-10-15); se sube junto con Next. Sin resaltado de sintaxis
  ni otros complementos.
- **Una guía = una carpeta** en `src/content/guides/<id>/`: `meta.ts` (tipado: línea, servicio relacionado, slug,
  nombre corto, título, resumen, fechas, minutos de lectura y títulos de las secciones, todo por idioma) y `es.mdx` +
  `en.mdx` con el cuerpo. Los títulos de las secciones viven solo en `meta.ts`; el cuerpo marca cada sección con un
  componente que recibe su número. `src/content/guides/index.ts` las registra.
- **Colección** `/guias/[slug]` ↔ `/guides/[slug]`, sobre lo construido en la spec 005.
- **Componentes de guía** (`mdx-components.tsx`): sección numerada, "Qué necesitas", captura, código y nota, con la
  tipografía de la maqueta. Las capturas usan `next/image` con importación estática y el mismo tope de peso de la 005.
- **Imagen social:** la del índice de guías (una por guía queda en el backlog).

## Con qué se llena hoy

Con nada: cero guías. Los cuatro títulos del índice de la maqueta quedan anotados aquí como las primeras a escribir:
"Sitio web, aplicación web o software a la medida: cuál necesita tu empresa" (Desarrollo), "Cómo configurar una
tienda Tebex para tu servidor de Minecraft" (Minecraft), "Pterodactyl: qué es y cómo instalarlo de forma segura"
(Minecraft) y "Qué debe tener un bot de Discord a medida" (Discord). El índice sin guías muestra solo su encabezado.

## Fuera de alcance

- Escribir las guías. Resaltado de sintaxis, tablas, buscador, RSS, imagen social por guía.
- "Guías" dentro de las páginas de línea y subpáginas (se conecta al publicar la primera guía de cada una).

## Pruebas

| Requisito | Prueba |
|---|---|
| RF-7 y coherencia de `meta.ts` | `web/src/lib/guides.test.ts` |
| RF-6, RF-8 (HTML del servidor) | `web/scripts/smoke.mjs` |
| RF-1 (índice sin guías), RF-9 | `web/e2e/guides.spec.ts`, `web/e2e/accessibility.spec.ts` |
| RF-2 a RF-5, RF-8 con una guía | corrida en un clon de descarte con una guía de prueba (`evidencia-paso5.txt`): hoy no hay guías reales |
