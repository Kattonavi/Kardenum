# 004 · Subpáginas de servicio

**Estado:** en construcción (2026-11-15). **Fuente:** maquetas `B-Sub-*` (seis) y `B-Sub-ficha-SEO`,
`docs/handoff/docs/seo-sitio.md` §1 ("Subpáginas por servicio") y §2, `plan-sitio-web.md` §3.

Seis servicios con búsqueda propia tienen su página dentro de su línea: tiendas online y software a la medida
(Desarrollo); plugins, servidores y Tebex (Minecraft); bots (Discord). Salen de una sola plantilla con contenido
tipado. Quedan **construidas pero ocultas** detrás de `features.serviceSubpages` hasta que el fundador las abra: la
regla del plan de SEO es que una subpágina solo se publica con contenido propio, y hoy les faltan sus trabajos.

## Requisitos

| # | Requisito |
|---|---|
| RF-1 | Cada subpágina DEBE existir en español y en inglés en las rutas del plan de SEO, y mostrar, en este orden: migas (Inicio › Servicios › línea › servicio), título con la palabra clave, texto, dos botones, "Qué hacemos" (cuatro ítems numerados), "Qué recibes" (lista y, si la maqueta lo trae, un grupo de etiquetas), "Cómo trabajamos" (cuatro pasos), preguntas frecuentes, servicios relacionados (cuatro enlaces) y el cierre de contacto. |
| RF-2 | MIENTRAS `features.serviceSubpages` sea `false`, las subpáginas DEBEN llevar `noindex` aunque el sitio esté abierto, quedar fuera del sitemap, y ninguna página pública DEBE enlazarlas (menú, desplegable, índice de Servicios, páginas de línea, pie). |
| RF-3 | CUANDO `features.serviceSubpages` sea `true`, las subpáginas DEBEN entrar al sitemap con sus alternativas de idioma, ser indexables, y aparecer en el desplegable de Servicios, el menú móvil, el índice de Servicios y la página de su línea. |
| RF-4 | Cada subpágina DEBE llevar título y descripción únicos por idioma, canonical propio, hreflang (es, en, x-default), imagen social con su título, y datos estructurados `Service` y `BreadcrumbList` que coinciden con las migas visibles. |
| RF-5 | En las subpáginas de Minecraft y Discord el botón principal DEBE llevar a Discord (a la invitación cuando exista; mientras tanto, al cierre de contacto) y el cierre DEBE mostrar Discord primero con la invitación al servidor del estudio. En las de Desarrollo el botón principal DEBE llevar al cotizador con la línea preseleccionada y el cierre muestra WhatsApp primero. El segundo botón, "Otros canales", lleva al cierre de contacto. |
| RF-6 | Cada servicio relacionado DEBE enlazar a su subpágina si la tiene y, si no, a la página de su línea. Nunca a una ruta que no exista. |
| RF-7 | La sección "Trabajos" NO DEBE mostrarse mientras el portafolio esté oculto, ni la de "Guías" mientras las guías estén ocultas: no se muestran tarjetas con corchetes. |
| RF-8 | Las subpáginas DEBEN cumplir lo mismo que el resto del sitio: un solo `h1`, `header`/`main`/`footer`, objetivos de 44 px, sin violaciones de axe, sin desborde lateral a 320 px ni con el texto al 200 %, y el aviso de Discord en el pie de la subpágina de bots. |

## Decisiones

- **Construidas y ocultas, no ausentes.** La dirección de cada subpágina responde 200 con `noindex`; el flag decide si
  se enlaza, se indexa y entra al sitemap. Así se pueden revisar en producción antes de abrirlas.
- **Títulos y descripciones.** Los de Plugins salen de la ficha SEO. Los de las otras cinco siguen el mismo patrón con
  las palabras clave candidatas del plan de SEO. Son provisionales hasta que el fundador valide las palabras clave.
- **Botón principal en Desarrollo.** La maqueta lleva los dos botones al mismo sitio (`#contacto`). El principal va al
  cotizador con la línea preseleccionada, que es la regla ya decidida para las páginas de línea.
- **La invitación al servidor del estudio** va en el cierre de las cuatro subpáginas de Minecraft y Discord. La
  maqueta de Plugins (la primera que se dibujó) no la trae; las otras tres sí.
- **"Launchers"** en servicios relacionados enlaza a la página de Minecraft: no tiene subpágina.
- **Las pruebas recorren las páginas construidas**, no solo las públicas: humo, axe, texto al 200 % y desborde.

## Fuera de alcance

- Las tarjetas de trabajos y de guías dentro de cada subpágina: llegan con el portafolio (spec 005) y las guías (006).
- Encender el flag: lo decide el fundador.

## Pruebas

| Requisito | Prueba |
|---|---|
| RF-1, RF-5, RF-6, RF-7 (navegador) | `web/e2e/subpages.spec.ts` |
| RF-2, RF-4 (HTML del servidor, sitio cerrado y abierto) | `web/scripts/smoke.mjs` (páginas ocultas) |
| RF-3 | corrida única con el flag encendido en un clon de descarte (`docs/revisiones/evidencia-paso5.txt`) y `web/src/routes.test.ts` |
| RF-6 y coherencia del contenido | `web/src/content/content.test.ts` |
| RF-8 | `web/e2e/accessibility.spec.ts` (todas las páginas construidas) |
