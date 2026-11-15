# Lista previa al desarrollo

15 de noviembre de 2026. Qué está listo y qué falta antes de programar el sitio de Kardenum. Complementa `plan-sitio-web.md` y `seo-sitio.md`.

**Resumen:** el diseño de escritorio está completo; el de celular es la siguiente fase. Se puede arrancar el código ya. Lo que falta son datos y contenido que solo tú puedes dar; en el código van en un solo archivo (`site.config.ts`) o detrás de un flag, así que no frenan el arranque.

## 1. Diseño: listo

Tablero: https://claude.ai/artifact/5S5zbu5FhFbWkgko6ZeK6c. Todo el escritorio está en la página "Ronda 2" (dos filas); el celular, en "Ronda 3".

| Página | Estado |
|---|---|
| Inicio | Listo |
| Índice de servicios | Listo |
| Líneas: Desarrollo, Diseño, Video y animación | Listas (plantilla de servicio) |
| Líneas: Minecraft y Discord | Listas (landing de comunidad) |
| Subpáginas de servicio | Las 6 listas: tiendas online, software a la medida, plugins, servidores y networks, Tebex y bots. Sus textos son un primer borrador para revisar |
| Portafolio y caso | Listos |
| Índice de guías y guía | Listos |
| Nosotros | Listo |
| Contacto con cotizador de WhatsApp | Listo |
| Legal: privacidad y términos | Plantillas listas, falta el texto |
| 404 | Lista |
| Navegación: desplegable de Servicios y barra de idioma | Listas |
| Celular | Siguiente fase: hay menú móvil, inicio y línea Minecraft; falta el resto con calma |

**Revisión automática del 15 de noviembre** (todas las páginas, con las fuentes de la marca):
- A 390 px de ancho ninguna página se desborda horizontalmente.
- axe (accesibilidad WCAG 2.1 AA): sin errores de contraste, de nombres de botones ni de etiquetas.
- Un solo H1 por página y sin saltos en el orden de títulos.
- Única observación: las maquetas no usan `<main>`. En el código cada página lleva `<header>` (menú), `<main>` (contenido) y `<footer>`.

## 2. Decisiones que solo tú puedes tomar

1. **Video:** ¿el estudio graba, o trabaja solo con el material que entrega el cliente? La respuesta va en la pregunta frecuente de la línea de Video.
2. **Correo de contacto** (sigue como `[correo@kardenum.com]`). Lo usan Contacto, el pie, las páginas legales y los datos estructurados.
3. **Número de WhatsApp** del estudio y **enlace de invitación permanente** al servidor de Discord (para los botones y para la redirección `/discord`).
4. **Datos legales:** a nombre de quién va el estudio (persona o empresa), identificación, ciudad y dirección, y teléfono.
5. **Frase del hero:** confirmar "Software, diseño y video. Un solo estudio." (en el plan sigue marcada "a validar").
6. **Perfiles oficiales** que van a existir: servidor de Discord, GitHub, BuiltByBit o SpigotMC, Behance, YouTube o Vimeo. Se enlazan en los datos estructurados para que Google reconozca la marca.
7. **Guías en el menú principal:** decidir cuando haya varias publicadas.
8. **Bots de Discord:** ¿el código fuente se entrega igual que en plugins ("si se acuerda en la cotización")? Así quedó en la subpágina.
9. **Revisar los textos de las subpáginas nuevas**, sobre todo las preguntas frecuentes.

## 3. Contenido por escribir o reunir

- **Textos de las subpáginas:** ya tienen un primer borrador en las maquetas; falta tu revisión.
- **Versión en inglés** de todas las páginas, después de validar las palabras clave. Se adapta a cómo se busca en inglés, no se traduce al pie de la letra.
- **Título y descripción** de cada página en los dos idiomas.
- **Portafolio:** casos reales con capturas, año, servicios y nivel de visibilidad acordado con cada cliente. Hoy solo hay Kardenum y Kaelion. Regla del plan: el portafolio sale al menú cuando haya al menos una pieza por línea; Video todavía no tiene ninguna.
- **Caso Kardenum:** el texto del resultado.
- **Reel del estudio** para la página de Video. Mientras no exista, ese bloque se oculta.
- **Primeras guías** (primer mes después del lanzamiento): Tebex, bots de Discord y sitio web vs aplicación vs software.
- **Textos legales** de privacidad y términos, con revisión de un abogado.

## 4. SEO

**Antes de programar**
- Validar las palabras clave con el Planificador de Google (tabla en `seo-sitio.md`).
- Confirmar los slugs finales en español y en inglés (lista en `seo-sitio.md`).

**En el código** (detalle en `seo-sitio.md`, sección 2)
- Páginas generadas en el build, metadatos únicos por página e idioma, canonical propio.
- hreflang `es`, `en` y `x-default` (inglés); sitemap con alternativas de idioma; robots.
- Sin redirección automática por idioma: barra que ofrece el otro idioma.
- JSON-LD: Organization y WebSite en el inicio; Service, BreadcrumbList, CreativeWork y Article donde corresponde.
- Imagen OG por página con `next/og`; favicon y manifest desde el paquete del logo.
- 404 con estado real; portafolio con `noindex` mientras esté oculto.
- Core Web Vitals en celular: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1. Lighthouse ≥ 95.

**Al lanzar:** dominio, Search Console y Bing verificados, sitemap enviado, Umami con eventos de contacto.

## 5. Cuentas y servicios por crear

- **Dominio** kardenum.com, con DNS en Cloudflare.
- **Correo con el dominio** (por ejemplo `hola@kardenum.com`). Para empezar sirve un reenvío al correo personal.
- **Búsqueda de marca** en la SIC antes de registrar Kardenum.
- **Repositorio** en GitHub y **proyecto en Railway** (sitio y Umami).
- **Google Search Console** y **Bing Webmaster Tools**.
- **WhatsApp Business** del estudio y **servidor de Discord** con invitación permanente.

## 6. Técnico: lo que conviene dejar definido al arrancar

- **Modelo de contenido tipado** (TS o MDX): línea, subpágina, caso (con `visibilidad`), guía y pregunta frecuente.
- **Mensajes de idioma** de next-intl por página, en español y en inglés.
- **`site.config.ts`** con nombre, dominio, correo, WhatsApp, invitación de Discord y perfiles.
- **Componentes que salen de las maquetas:**
  - Navegación y layout: menú con desplegable, menú móvil, barra de idioma, migas de pan y pie.
  - Hero en tres variantes: base, comunidad con corchete y video con reel.
  - Contenido de servicio: lista de servicios, "¿Cuál necesitas?", qué recibes, alcance, proceso y preguntas en acordeón.
  - Tarjetas y conversión: tarjeta de trabajo, tarjeta de guía, cierre de contacto y cotizador.
- **Pruebas:** `eslint-plugin-jsx-a11y`, axe con Playwright en 390 y 1280 px, y Lighthouse CI.

## 7. Orden recomendado para el código

1. Base del proyecto: Next.js 16, Tailwind con los colores de la marca, next-intl (español en la raíz, inglés en `/en`), fuentes y estructura `header` / `main` / `footer`.
2. Componentes de la sección 6.
3. Páginas con contenido ya escrito: inicio, servicios, las 5 líneas, Nosotros, Contacto y 404.
4. SEO técnico: metadatos, hreflang, sitemap, JSON-LD e imágenes OG.
5. Portafolio, casos, subpáginas y guías, detrás de flags hasta tener contenido real.
6. Páginas legales.
7. Revisión final (Lighthouse, axe, celular) y lanzamiento.
