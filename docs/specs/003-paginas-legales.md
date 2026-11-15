# 003 · Páginas legales y freno de lanzamiento

**Estado:** implementado (2026-11-15). **Fuente:** maquetas `B-Legal-privacidad` y `B-Legal-terminos`, decisión del
fundador del 2026-11-15 ("construye las dos páginas con la estructura de las maquetas, con los datos legales entre
corchetes desde `site.config.ts`; el build falla con `SITE_INDEXABLE=true` si quedan datos legales sin llenar").

Las maquetas traen la estructura y los títulos de cada sección; todo lo demás (quién responde por el sitio, las fechas
y el texto de cada sección) está entre corchetes porque todavía no existe. Las páginas se publican así, con el sitio
cerrado a los buscadores, y el freno impide abrirlo mientras quede un solo corchete.

## Requisitos

| # | Requisito |
|---|---|
| RF-1 | El sitio DEBE tener Política de privacidad (`/legal/privacidad` ↔ `/en/legal/privacy`) y Términos del sitio (`/legal/terminos` ↔ `/en/legal/terms`), con la estructura de su maqueta: migas, etiqueta "Legal", título, fechas de vigencia y de última actualización, lista de contenido con ocho enlaces e introducción más ocho secciones numeradas. |
| RF-2 | Todo dato o texto legal que no exista DEBE vivir en `site.config.ts` como pendiente y mostrarse entre corchetes, en el idioma de la página. Los títulos de las secciones son contenido aprobado y no llevan corchetes. Nada se inventa. |
| RF-3 | CUANDO un valor pasa a listo, la página DEBE mostrarlo en lugar del corchete: los datos del responsable dentro de su frase, las fechas con formato largo del idioma y el texto de cada sección como párrafos. |
| RF-4 | MIENTRAS quede cualquier valor pendiente en `site.config.ts` (contacto o legal), un build con `SITE_INDEXABLE=true` DEBE fallar y nombrar cada valor pendiente. `SITE_LAUNCH_CHECK=off` lo omite solo en local. Un build sin indexar nunca falla por esto. |
| RF-5 | Los enlaces "Privacidad" y "Términos" del pie DEBEN llevar a estas páginas desde todas las páginas, incluido el 404, en el idioma de la página. |
| RF-6 | Cada página legal DEBE tener título y descripción propios por idioma, canonical, hreflang, imagen social, migas con `BreadcrumbList` y entrar al sitemap cuando el sitio sea indexable. |
| RF-7 | Cada enlace de la lista de contenido DEBE llevar a su sección, medir al menos 44 px de alto y usarse con teclado. |

## Decisiones

- **Un solo responsable para las dos páginas.** Nombre o razón social, identificación, domicilio, correo y teléfono se
  llenan una vez (`legal.owner`) y cada página los pone en su frase. El correo legal es un campo aparte del correo de
  contacto comercial, como en la maqueta; pueden ser el mismo.
- **Los corchetes en inglés** son traducción de los de la maqueta (que solo existe en español). Provisional, como el
  resto del inglés.
- **El freno recorre toda la configuración** en busca de pendientes, en vez de listar campos: un dato nuevo no se puede
  quedar por fuera.
- **Fechas en formato ISO** (`AAAA-MM-DD`) en la configuración; la página las escribe en formato largo.
- **Sin cierre de contacto** en estas páginas, como en la maqueta: después del texto va el pie.

## Fuera de alcance

- Redactar el texto legal: lo entrega el fundador (o su abogado) y se pega en `site.config.ts`.
- Enlazar la política junto al cotizador o pedir autorización con casilla: la maqueta de Contacto no lo trae y el
  cotizador no guarda datos. Queda como pregunta para quien redacte la política.
- Aviso de cookies: la analítica prevista (Umami) no usa cookies.

## Pruebas

| Requisito | Prueba |
|---|---|
| RF-2, RF-3 (lógica) | `web/src/lib/legal.test.ts` |
| RF-4 | `web/src/lib/launch.test.ts` |
| RF-1, RF-5, RF-6 (HTML del servidor, en los dos idiomas) | `web/scripts/smoke.mjs` |
| RF-1, RF-2, RF-5, RF-7 (navegador) y accesibilidad | `web/e2e/legal.spec.ts`, `web/e2e/accessibility.spec.ts` |
