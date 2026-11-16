# 005 · Portafolio y casos

**Estado:** implementado y oculto tras `features.portfolio` (2026-11-15). **Fuente:** maquetas `B-Portafolio` y `B-Caso`,
`docs/handoff/docs/plan-sitio-web.md` §4 ("Portafolio", "Caso de portafolio") y §5 ("Reglas del portafolio"),
`seo-sitio.md` §2.

El índice del portafolio y la página de cada caso. Quedan **construidos y ocultos** detrás de `features.portfolio`
hasta cumplir el umbral del plan: al menos una pieza por línea. Los casos viven en el repo como archivos tipados;
agregar un caso es agregar un archivo.

## Requisitos

| # | Requisito |
|---|---|
| RF-1 | El índice (`/portafolio`, `/en/work`) DEBE mostrar: migas (Inicio › Portafolio), el rótulo, el título "Trabajo que podemos mostrar.", la regla a la vista ("Cada proyecto aparece aquí con permiso del cliente. Los proyectos privados no se publican."), los filtros por línea (Todos y las líneas que tienen al menos un caso visible; decisión del fundador, 2026-11-15: un filtro sin resultados no se ofrece) y una tarjeta por caso visible: portada 4:3, líneas, año, nombre y una frase. Cada tarjeta enlaza a su caso. |
| RF-2 | CUANDO la persona elige una línea en los filtros, el índice DEBE mostrar solo los casos de esa línea; "Todos" los muestra todos. El filtro DEBE funcionar sin JavaScript y con teclado, y decir cuál está elegido. |
| RF-3 | Cada caso visible DEBE tener su página en `/portafolio/<slug>` y `/en/work/<slug>` (slug propio por idioma) con: ruta de regreso al portafolio, nombre, una frase, datos (líneas, año, cliente), imagen principal 16:9, el reto, qué hicimos (lista), resultado, piezas (4:3), enlace al siguiente proyecto y el cierre de contacto. |
| RF-4 | El cliente DEBE mostrarse según su tipo: el nombre (público), "Cliente reservado" (reservado) o "Proyecto propio". Un caso reservado NO DEBE contener el nombre del cliente en ninguna parte del HTML. |
| RF-5 | Un caso privado NO DEBE generarse ni mencionarse: sin página, sin tarjeta, sin entrada en el sitemap, y nada suyo en el HTML ni en los archivos que el sitio sirve. El tipo de un caso privado no admite contenido (ni textos ni imágenes). |
| RF-6 | MIENTRAS `features.portfolio` sea `false`, el índice y los casos DEBEN llevar `noindex` aunque el sitio esté abierto, quedar fuera del sitemap, y ninguna página pública DEBE enlazarlos. CUANDO sea `true`, entran al menú (Servicios · Portafolio · Nosotros), al sitemap y a "Ver portafolio" donde las maquetas lo traen. |
| RF-7 | SI `features.portfolio` es `true` y alguna línea no tiene al menos un caso visible, el build DEBE fallar y nombrar las líneas que faltan. SI el sitio se compila para indexar (`SITE_INDEXABLE=true`) con el portafolio encendido y un caso visible tiene datos entre corchetes, el build DEBE fallar y nombrar cada dato. Con el portafolio apagado, los datos pendientes de los casos NO DEBEN frenar el lanzamiento. |
| RF-8 | Una dirección de caso que no existe (o el slug de un idioma bajo el prefijo del otro) DEBE responder 404 con la página 404 de marca completa. Todo sigue estático: sin `ƒ` en la tabla del build. |
| RF-9 | Cada caso DEBE llevar título y descripción únicos por idioma, canonical propio, hreflang (es, en, x-default → inglés) con el slug de cada idioma, `BreadcrumbList` y `CreativeWork` (nombre, año si se conoce, creador → la organización, imagen), y los enlaces ES / EN de la cabecera y de la barra de idioma DEBEN llevar al mismo caso en el otro idioma. |
| RF-10 | Índice y casos DEBEN cumplir lo de todo el sitio: un `h1`, `header`/`main`/`footer`, objetivos de 44 px, sin violaciones de axe, sin desborde a 320 px ni con texto al 200 %. Las imágenes llevan texto alternativo, ancho y alto, y un tope de peso por archivo que una prueba revisa. |

## Diseño técnico (decidido con laboratorio el 2026-11-15, Next 16.4.6 + next-intl 4.14.9)

Laboratorio (`evidencia-paso5.txt`): un segmento dinámico bajo `[locale]` con `dynamicParams = false` compila
estático con uno y con cero parámetros; un slug desconocido responde el 404 de marca con cabeceras; next-intl traduce
`/portafolio/[x]` ↔ `/en/work/[x]`; el slug de un idioma bajo el otro prefijo da 404 (no hay URL duplicadas). En esas
páginas `usePathname()` de next-intl y de Next NO sirven para saber dónde se está (devuelven la plantilla en un
idioma y la ruta interna en el otro); `useParams()` sí.

- **Las plantillas dinámicas no entran al registro `routeTable`** (`AppPathname` sigue siendo solo rutas fijas, para
  no romper `AppLink`). Van en un registro aparte de **colecciones** en `src/routes.ts`
  (`/portafolio/[slug]` ↔ `/work/[slug]`; la de guías se suma en la spec 006) que se añade a `pathnames` de next-intl.
- **Dirección de una entrada:** una función única (`entryPath(colección, slug, idioma)`) usada por tarjetas, sitemap,
  canonical, hreflang, migas y pruebas. Los enlaces a entradas usan `next/link` con la dirección final.
- **Metadatos:** `buildPageMetadata` se generaliza (o gana una hermana) para recibir direcciones por idioma, título,
  descripción y si es pública, sin duplicar la lógica de canonical/hreflang/robots.
- **ES / EN en una entrada:** la cabecera (servidor) pasa a los componentes de idioma una tabla con las direcciones
  por idioma de las entradas visibles; el cliente identifica la entrada con `useParams()`.
- **Imagen social de un caso:** la del índice del portafolio (una por caso queda en el backlog).
- **Filtro sin JavaScript:** grupo de botones de opción (radio) con estilo de botón y reglas CSS `:has()`; sin estado
  en el cliente. Con un filtro elegido que no tiene casos no se muestra nada (no puede pasar con el portafolio
  público: RF-7).
- **Casos (`src/content/cases/`):** un archivo por caso y un índice. Unión discriminada por `visibilidad`: `publico` y
  `reservado` llevan contenido; `privado` solo un identificador interno, líneas y año (RF-5 por tipo).
- **Piezas:** cada pieza es una imagen (importada, 4:3) o una composición propia del caso. El caso Kardenum trae en
  la maqueta dos composiciones hechas en HTML (paleta y tipografía) y la portada con el símbolo: se modelan como
  tipos de pieza (`mark`, `palette`, `typeface`, `image`, `pending`), no como capturas.
- **Datos pendientes de un caso** (regla 6 de la Constitución): viven en `site.config.ts` (`portfolio.<caso>.<dato>`),
  con el mismo `Pending`/`Ready` de los datos legales, y se muestran entre corchetes. El freno de lanzamiento solo
  los cuenta con `features.portfolio` encendido (RF-7).
- **Imágenes** (decisión del fundador, 2026-11-15): todas pasan por el componente de imagen del sitio, que toma
  sus props de `getImageProps()` (optimizador de Next: AVIF, luego WebP, un archivo por ancho en `srcset`, con
  `sizes`, `width` y `height`) y descarta el estilo en línea que la CSP bloquea. Carga diferida por defecto; la
  imagen principal se marca como prioritaria (`fetchpriority="high"`, sin diferir). El optimizador solo sirve
  imágenes importadas por el código. El original se guarda en WebP o AVIF, 2400 px de ancho como máximo y 800 KB
  por archivo (decisión del fundador, 2026-11-15; prueba unitaria). El optimizador solo genera los anchos que usan
  las plantillas (`deviceSizes` e `imageSizes` acotados en `next.config.ts`); la prueba de humo revisa cada `<img>` servido y que el optimizador convierta.

## Páginas ocultas y sitio abierto (decisión del fundador, 2026-11-15)

MIENTRAS el flag esté apagado: con el sitio cerrado (`SITE_INDEXABLE` distinto de `true`) el índice y los casos siguen
respondiendo 200 con `noindex`, para revisarlas; con el sitio abierto (`SITE_INDEXABLE=true`) NO se generan y su
dirección responde el 404 de marca. Todo sigue estático (sin `ƒ`), y el 404 es la página completa con cabeceras, no
un `notFound()` al renderizar. Las pruebas de humo y de navegador esperan una cosa u otra según el modo.

**Cómo se cumple con el sitio abierto (dos capas, decisión del fundador del 2026-11-16):**

1. **El proxy** responde el 404 de marca a la lista de direcciones ocultas, tanto a la página como a su petición de
   datos RSC. Compara la ruta ya decodificada y normalizada (`web/src/lib/comparable-path.ts`): una letra codificada,
   la doble codificación, las mayúsculas y la barra final son la misma dirección y reciben el mismo 404.
2. **El build abierto no compila esas páginas.** El archivo de una página detrás de un flag se llama
   `page.<flag>.tsx` (`subpages`, `portfolio`, `guides`) y `next.config.ts` solo acepta esa extensión cuando el build
   genera la página (`pageExtensions()` en `web/src/routes.ts`). Sin ella la dirección no coincide con ninguna ruta y
   Next responde como a cualquier dirección desconocida: el 404 de marca con HTML completo. No se usa `notFound()`
   dentro de la página, que en Next 16.4.6 entrega un cascarón vacío.

Hay un solo layout raíz: con el flag encendido, pasar de una página a otra sigue siendo navegación del lado del
cliente, sin recarga completa. `web/src/routes.test.ts` falla si una página detrás de un flag se llama `page.tsx`.

## Cómo se escribe un caso reservado (revisión de seguridad del paso 5)

El tipo impide el campo del cliente, pero el `id`, el `slug`, el nombre, los textos y los nombres de los archivos de
imagen son texto libre, y los nombres de archivo llegan a la dirección de la imagen. En un caso reservado todos son
genéricos ("catalogo-ferreteria", nunca la marca). Antes de publicar, la prueba de humo se corre con
`CONFIDENTIAL_TERMS="marca,otro nombre"`: busca cada término en todo lo que el sitio sirve. Esa lista no se versiona.

## Con qué se llena hoy (de las maquetas; nada inventado)

- **Kardenum** (caso 0): Diseño · Desarrollo, 2026, proyecto propio. "Identidad visual y sitio web del estudio."
  (tarjeta: "Identidad visual y sitio web. Proyecto propio."). El reto y "Qué hicimos" (cuatro ítems) salen de
  `B-Caso`. Resultado: pendiente (`[Resultado del proyecto]`: en un proyecto propio no se pide comentario de cliente). Piezas: símbolo,
  paleta, tipografía y captura del sitio (pendiente). Imagen principal: símbolo y nombre sobre tinta.
- **Kaelion**: Minecraft, proyecto propio. "Servidor RPG de Minecraft: plugins y configuración. Proyecto propio."
  Año, portada, reto, qué hicimos, resultado y piezas: pendientes.
- Las demás tarjetas de la maqueta (`[NOMBRE DEL PROYECTO]`) no se crean.
- Inglés provisional, como en el resto del sitio.

Los avisos de marca del pie y el correo escrito en el cierre de las páginas de Minecraft siguen la línea de cada
página: `docs/specs/008-aviso-de-minecraft-por-linea.md` (decisión del fundador del 2026-11-16).

## Fuera de alcance

- "Trabajos" dentro de las páginas de línea y de las subpáginas (se conecta cuando haya casos por línea).
- Imagen social por caso; optimizador de imágenes del servidor.
- Encender el flag: lo decide el fundador al cumplir el umbral.

## Pruebas

| Requisito | Prueba |
|---|---|
| RF-1 a RF-4, RF-9 (navegador) | `web/e2e/portfolio.spec.ts` |
| RF-5, RF-7 (lógica) | `web/src/lib/portfolio.test.ts`, `web/src/lib/launch.test.ts` |
| RF-6, RF-8, RF-9 (HTML del servidor, sitio cerrado y abierto) | `web/scripts/smoke.mjs` (páginas ocultas y entradas de colección) |
| RF-6 con el flag encendido, RF-5 con un caso privado y uno reservado de prueba | corrida única en un clon de descarte (`evidencia-paso5.txt`) |
| RF-10 | `web/e2e/accessibility.spec.ts` (todas las páginas construidas, entradas incluidas) |
