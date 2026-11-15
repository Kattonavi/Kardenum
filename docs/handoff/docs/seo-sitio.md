# Plan de SEO de Kardenum

Borrador v4 · 15 de noviembre de 2026. Prioridad del sitio: que la gente nos encuentre por búsqueda orgánica en Google, en español (idioma principal) y en inglés. Este documento complementa `plan-sitio-web.md`.

## 0. Lo esencial

1. **Una página por cada búsqueda que importa.** Google posiciona páginas, no sitios. Si alguien busca "desarrollo de plugins de Minecraft", tiene que existir una página que trate solo de eso.
2. **Empezar por los nichos.** Un dominio nuevo no le gana "diseño web" a agencias con años de antigüedad. Sí puede ganar búsquedas específicas y de nicho, sobre todo Minecraft y Discord en inglés.
3. **Lo técnico, perfecto desde el día uno:** HTML generado en el build, rapidez en móvil, hreflang bien hecho, sitemap, datos estructurados y metadatos únicos por página e idioma.
4. **Contenido real y útil**, escrito para cada idioma y no traducido al pie de la letra. Sin relleno ni palabras clave repetidas.
5. **Medir desde el lanzamiento** con Search Console. Un dominio nuevo tarda meses en posicionar; los resultados se miden por trimestre, no por semana.

## 1. Estrategia: a qué búsquedas apuntamos

### Mapa de palabras clave (hipótesis a validar)

Son candidatas. Antes de escribir los textos finales se validan con el Planificador de palabras clave de Google (volumen y competencia) y, después del lanzamiento, con los datos reales de Search Console.

| Página | Español (principal) | Inglés |
|---|---|---|
| Inicio | estudio de desarrollo, diseño y video | software, design and video studio |
| Desarrollo | desarrollo de páginas web · diseño de páginas web a la medida | web development studio · custom website development |
| Tiendas online | desarrollo de tiendas online | ecommerce website development |
| Software a la medida | desarrollo de software a la medida | custom software development |
| Diseño | diseño de identidad visual · diseño de marca | brand identity design |
| Video y animación | edición de video · animación 2D | motion graphics services · video editing services |
| Minecraft | desarrollo de plugins de minecraft | minecraft plugin development · custom minecraft plugins |
| Minecraft · servidores | configuración de servidores de minecraft | minecraft server setup · minecraft network setup |
| Minecraft · Tebex | configuración de tienda tebex | tebex store setup |
| Minecraft · dedicados | instalación de pterodactyl | pterodactyl panel installation |
| Minecraft · launchers | launcher de minecraft personalizado | custom minecraft launcher |
| Discord | bots de discord a medida | custom discord bot development |
| Discord · servidores | configuración de servidores de discord | discord server setup |

### Subpáginas por servicio (aprobado)

Además de la página de cada línea, los servicios con búsqueda propia tienen su propia página dentro de la línea, por ejemplo:

```
/servicios/desarrollo                       /en/services/development
/servicios/desarrollo/tiendas-online        /en/services/development/ecommerce
/servicios/desarrollo/software-a-la-medida  /en/services/development/custom-software
/servicios/minecraft                        /en/services/minecraft
/servicios/minecraft/plugins                /en/services/minecraft/plugins
/servicios/minecraft/servidores             /en/services/minecraft/servers
/servicios/minecraft/tebex                  /en/services/minecraft/tebex
/servicios/discord                          /en/services/discord
/servicios/discord/bots                     /en/services/discord/bots
```

Regla: una subpágina solo se publica si tiene contenido propio (qué es, qué incluye, proceso, trabajos, preguntas de ese servicio). Una página vacía o repetida resta en vez de sumar. El resto de servicios quedan como secciones dentro de la página de su línea; si uno empieza a traer búsquedas en Search Console, sube a subpágina.

Ejemplo maquetado en el tablero: la subpágina de Plugins de Minecraft y su ficha SEO (título, descripción, H1, hreflang, datos estructurados y enlaces internos).

### Búsqueda local

**Decidido: no se crea perfil de empresa en Google por ahora.** El sitio apunta a búsquedas por servicio, no por ubicación, y no menciona el país.

## 2. SEO técnico (va en el código)

### 2.1 Rastreo e indexación
- Todas las páginas se generan en el build (estáticas). Google recibe el HTML completo sin depender de JavaScript.
- `app/sitemap.ts` con todas las URLs en los dos idiomas y sus alternativas de idioma. Se envía en Search Console.
- `app/robots.ts` que permite todo y apunta al sitemap.
- Canonical propio en cada página e idioma: cada versión se apunta a sí misma, nunca a la del otro idioma.
- Un solo dominio: `https://kardenum.com`. La versión `www` redirige con 301.
- URLs en minúsculas, con guiones y sin tildes (`diseno`, no `diseño`). Mismo criterio con la barra final en todo el sitio.
- Página 404 real, que devuelva estado 404 y enlace a inicio y servicios.
- `/minecraft` redirige a la página del servicio con 308. `/discord` redirige a la invitación del servidor y no entra en el sitemap.
- Mientras el portafolio esté oculto detrás del flag, no aparece en el sitemap y lleva `noindex`.

### 2.2 Idiomas
- **El español es el idioma principal:** vive en la raíz; el inglés vive bajo `/en`.
- `<html lang="es">` y `<html lang="en">` según la versión.
- hreflang en cada página: `es`, `en` y `x-default` apuntando al inglés, que es la versión más útil para quien no habla ninguno de los dos. Recíprocos: cada versión enlaza a la otra. Van en el `<head>` y en el sitemap.
- **Sin redirección automática por idioma.** Google recomienda no redirigir a una versión de idioma según lo que se cree que habla el usuario. En vez de eso, una barra discreta ofrece "View this site in English" a quien llega con el navegador en otro idioma, y la versión en español a quien entra a `/en` con el navegador en español. La elección se recuerda en una cookie.
- El selector ES / EN lleva a la misma página en el otro idioma, no al inicio.
- Slugs, títulos, descripciones, textos alternativos y datos estructurados, todo traducido.
- Los textos en inglés se escriben con los términos que se buscan en inglés, no como traducción literal del español.

### 2.3 Metadatos por página
- **Título** único por página e idioma, de unos 60 caracteres, con la palabra clave al inicio. Patrón: "Plugins de Minecraft a la medida — Kardenum" / "Custom Minecraft Plugins — Kardenum".
- **Descripción** única de unos 150 caracteres que diga qué se ofrece y termine con una invitación a cotizar.
- **Imagen para redes (Open Graph)** por página, generada con `next/og` en el estilo de la marca: tinta, bronce y el título de la página.
- Favicon, `apple-touch-icon` y `manifest` desde el paquete del logo. `theme-color` en tinta.
- Nombre del sitio: "Kardenum", declarado en los datos estructurados `WebSite`.

### 2.4 Estructura del HTML
- Un solo `<h1>` por página, con el tema de la página. En las páginas de servicio el H1 lleva la palabra clave ("Desarrollo de plugins de Minecraft a la medida").
- Títulos en orden (`h2`, `h3`), regiones semánticas (`header`, `nav`, `main`, `footer`) y migas de pan en las páginas internas.
- Todo el texto es texto real, nunca dentro de imágenes.
- Las preguntas frecuentes van en `<details>`: el contenido está en el HTML y Google lo lee aunque esté plegado.

### 2.5 Datos estructurados (JSON-LD)
| Dónde | Tipo | Qué lleva |
|---|---|---|
| Inicio | `Organization` | nombre, URL, logo (URL fija), `sameAs` con los perfiles oficiales, correo de contacto, idiomas |
| Inicio | `WebSite` | nombre del sitio e idiomas |
| Páginas internas | `BreadcrumbList` | la ruta de la página |
| Servicios | `Service` | nombre, descripción, `provider` → la organización, idiomas disponibles |
| Casos | `CreativeWork` | nombre, año, creador → la organización, imagen |
| Guías | `Article` | título, autor y editor → la organización, fechas de publicación y actualización, imagen |

Lo que **no** se usa:
- **FAQPage:** Google dejó de mostrar los resultados enriquecidos de preguntas frecuentes el 7 de mayo de 2026. Las preguntas se quedan por su valor para el cliente, no por el marcado.
- **Reseñas o calificaciones propias:** no hay testimonios inventados, y las reseñas que una empresa publica de sí misma no generan estrellas.
- **Marcado especial "para IA":** Google indica que no hace falta ningún marcado especial para aparecer en AI Overviews. Rige lo mismo de siempre: contenido claro y bien estructurado.

Todo se valida con la Prueba de resultados enriquecidos y con la inspección de URL de Search Console.

### 2.6 Rendimiento (Core Web Vitals)
Metas en móvil: **LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1**.
- Hero sin imagen pesada: tipografía y color, como en la maqueta.
- Fuentes con `next/font`, alojadas en el sitio, solo el subconjunto latino y con `display: swap`.
- Imágenes con `next/image` (AVIF/WebP), con ancho y alto declarados y carga diferida fuera de la primera pantalla.
- JavaScript solo donde hace falta: menú móvil, desplegable de servicios, filtro del portafolio y cotizador.
- Lighthouse CI en cada deploy, con mínimo 95 en Rendimiento, Accesibilidad, Buenas prácticas y SEO.

### 2.7 Confianza
- HTTPS con HSTS y cabeceras de seguridad.
- Páginas legales y responsable del sitio enlazados en el pie.
- Canales de contacto visibles en todas las páginas.

## 3. Contenido

- **Cada página de servicio responde lo que busca el cliente:** qué es, qué incluye (entregables concretos), cómo se trabaja, trabajos de esa línea, preguntas propias y llamado a cotizar. Extensión: la que haga falta para responder bien, sin relleno.
- **Señales de experiencia y confianza:** Google valora saber quién está detrás del sitio y ver trabajo real. Como Nosotros no muestra al equipo, eso se compensa con casos detallados (reto, qué hicimos, resultado, piezas) y con el responsable identificado en las páginas legales.
- **Imágenes:** texto alternativo descriptivo en cada idioma y nombres de archivo con sentido (`kaelion-launcher-inicio.avif`, no `img-03.png`).
- **Enlaces internos:** inicio → líneas → subpáginas → casos, y de vuelta. Cada caso enlaza a los servicios que usó; cada servicio, a sus casos y a servicios relacionados.

### Guías (aprobado)

Artículos dentro del sitio que explican un tema que el cliente investiga antes de contratar ("cómo configurar una tienda Tebex", "qué es Pterodactyl"). Las páginas de servicio responden a quien ya quiere contratar; las guías, a quien todavía está entendiendo su problema. Es la palanca más fuerte de tráfico orgánico después de las páginas de servicio.

- **Cuándo:** la plantilla de guía se construye antes del lanzamiento. Las primeras 2 o 3 guías se publican en el primer mes después.
- **Ritmo:** una o dos al mes, en inglés y en español. Mejor pocas y útiles que muchas flojas.
- **Cada guía termina con un llamado a su servicio**, por ejemplo: "¿Prefieres que lo dejemos configurado? Cotiza por Discord", con enlace a la subpágina correspondiente.
- **Rutas:** `/guias/[slug]` en español y `/en/guides/[slug]` en inglés, con índice en `/guias` y `/en/guides`.
- **Contenido:** archivos MDX en el repo, como los casos. Cada guía lleva fecha de publicación y de actualización visibles.
- **Datos estructurados:** `Article` con autor y editor → la organización, fechas e imagen, y `BreadcrumbList`.

Orden propuesto para las primeras (empezar por Minecraft y Discord, donde hay menos competencia):
1. "How to set up a Tebex store for your Minecraft server" / "Cómo configurar una tienda Tebex para tu servidor de Minecraft" → subpágina Tebex.
2. "What to look for in a custom Discord bot" / "Qué debe tener un bot de Discord a medida" → subpágina de bots.
3. "Website vs web app vs custom software: which one does your business need?" / "Sitio web, aplicación web o software a la medida: cuál necesita tu empresa" → Desarrollo (sale de las preguntas frecuentes).
4. "Pterodactyl: what it is and how to install it securely" / "Pterodactyl: qué es y cómo instalarlo de forma segura" → Minecraft (dedicados).

## 4. Fuera del sitio

- **Google Search Console:** propiedad de dominio verificada por DNS, sitemap enviado, revisión de indexación y Core Web Vitals.
- **Bing Webmaster Tools:** se importa desde Search Console en minutos. Bing alimenta otros buscadores y asistentes.
- **Perfiles oficiales que enlazan al sitio** (y van en `sameAs`): servidor de Discord del estudio y su ficha en directorios de servidores, GitHub, perfiles en BuiltByBit o SpigotMC para Minecraft, Behance para diseño y YouTube o Vimeo para el reel de video.
- **Créditos en lo entregado:** "Sitio por Kardenum" en el pie de cada web entregada, con opción de quitarlo. El texto del enlace es la marca, no una palabra clave.
- **Nada de comprar enlaces** ni de intercambiarlos en masa.

## 5. Medición

- **Search Console:** impresiones, clics, CTR y posición por página e idioma; consultas que traen tráfico; páginas indexadas.
- **Umami:** visitas y clics en WhatsApp, Discord y correo como eventos. Así se sabe qué páginas generan cotizaciones.
- **Revisión mensual:** qué consultas aparecen, qué páginas suben y qué textos ajustar. Las consultas reales reemplazan las hipótesis de la sección 1.

## 6. Lista de lanzamiento

- [ ] Dominio comprado, `www` → 301 al dominio sin www, HTTPS activo.
- [ ] Títulos y descripciones únicos en todas las páginas e idiomas.
- [ ] hreflang recíproco con `x-default`, validado.
- [ ] Canonical propio en cada página.
- [ ] Sitemap con alternativas de idioma y robots publicados.
- [ ] JSON-LD validado sin errores.
- [ ] Imágenes Open Graph por página.
- [ ] 404 con estado correcto; redirecciones `/minecraft` y `/discord` probadas.
- [ ] Lighthouse móvil ≥ 95 en las cuatro categorías.
- [ ] Search Console y Bing verificados; sitemap enviado.
- [ ] Umami con eventos de contacto.
- [ ] Perfiles oficiales creados y enlazados.

## 7. Decisiones

### Tomadas
- **Subpáginas por servicio: sí.** Primeras: tiendas online y software a la medida (Desarrollo); plugins, servidores y Tebex (Minecraft); bots (Discord).
- **Perfil de empresa en Google: no**, por ahora.
- **Idioma principal: español** en la raíz; inglés bajo `/en` (15 de noviembre).
- **Guías: sí.** Plantilla lista para el lanzamiento y primeras 2 o 3 guías en el primer mes (sección 3).

### Pendientes
1. **Validar las palabras clave** con el Planificador de Google antes de escribir los textos finales.
2. **Dónde se enlaza la sección de guías:** pie de página y páginas de servicio desde el lanzamiento; decidir si entra al menú principal cuando haya varias publicadas.

## Fuentes

- [Google: gestionar sitios multirregionales y multilingües](https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites)
- [Google: cómo puede ayudar x-default](https://developers.google.cn/search/blog/2023/05/x-default?hl=en)
- [Google: datos estructurados de Organization](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Fin de los resultados enriquecidos de preguntas frecuentes (mayo 2026)](https://prioritypixels.co.uk/insights/google-ends-faq-rich-results-in-search/)
