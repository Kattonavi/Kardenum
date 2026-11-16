# Paso 5 · UI QA en navegador real (una ronda)

Probado: producción `https://web-production-f1d7c246.up.railway.app` (subpáginas, portafolio, casos, `/en/...`) y, para guías, un clon propio con las dos guías de prueba (`scratchpad/fix-clone`, commit 361388e, build `SITE_INDEXABLE=false`, puerto 4910; ya apagado al cerrar). Chromium de Playwright (`py -3.13`). Scripts y capturas en `.impeccable/review/paso5/` (`a_text.py`, `b_sweep.py`, `c_filter.py`, `d_guide.py`, `e_lang.py`, `f_*.py`, `g_names.py`, `h_break.py`). Capturas de página: `p-<página>-<ancho>.png` (1280 y 390), maquetas renderizadas `mq-<página>-1280.png`.
Cobertura: 6 subpáginas, `/portafolio`, 2 casos, `/guias`, 2 guías, en ES y EN, a 1280/1024/768/390 y con texto 100/125/150 %.

## Resumen

Crítico 0 · Alto 0 · Medio 2 · Bajo 5 · Por confirmar 2.

## Hallazgos

| # | Sev. | URL · ancho | Problema | Reproducción | Esperado / obtenido | Captura |
|---|---|---|---|---|---|---|
| 1 | Medio | `/guias` (clon con guías) y `/portafolio` · 1280 y 390 | Un filtro sin resultados deja un hueco en blanco: ni mensaje de "no hay guías de esta línea" ni anuncio del cambio | Elegir Diseño, Video o Discord en `/guias` (con dos guías, Desarrollo y Minecraft); Video o Discord en `/portafolio` | Esperado: texto de estado vacío y, idealmente, un contador anunciado ("2 de 2", "0 resultados"). Obtenido: solo cambia el botón marcado; el lector solo anuncia el radio, no el resultado. En `/portafolio` no pasará con el flag encendido (RF-7 exige un caso por línea), pero en guías Diseño y Video quedarán vacíos aunque se publiquen las cuatro guías previstas (Desarrollo, Minecraft x2, Discord) | `p-filter-work-video-390.png`, `p-filter-guides-video-1280.png` |
| 2 | Medio | `/portafolio/kardenum` (H1) y subpáginas `/servicios/minecraft/servidores`, `/servicios/desarrollo/tiendas-online`, `/servicios/desarrollo/software-a-la-medida`, `/en/services/minecraft/plugins`, `/guias/segunda-guia-de-prueba` · 390 con texto 150 % | La regla que parte palabras por debajo de 18rem corta palabras de título a un tamaño no extremo: el H1 "KARDENUM" sale "KARDEN / UM". Mismo patrón del hallazgo 2 del paso 4 | Viewport 390, `document.documentElement.style.fontSize="150%"`; ver el H1 (medido dos veces: con `overflow-wrap: normal` el H1 se desborda, o sea que hoy se parte) | Esperado: palabra entera (reducir el título un paso a ese ancho, o 17rem de umbral). Obtenido: nombre de marca partido, ilegible como logotipo | `p-caso-390-150-h1.png`, `p-servidores-390-150-h1.png`, `p-software-390-150-h1.png` |
| 3 | Bajo | `/portafolio`, `/guias`, "Guías relacionadas" · cualquier ancho | El nombre accesible de cada tarjeta enlace empieza por metadatos y repite el marcador de la imagen: "[CAPTURA DEL SERVIDOR] MINECRAFT [AÑO] KAELION ... " o "GUÍA · DESARROLLO 5 DE NOVIEMBRE DE 2026 Segunda guía..." | Listar el texto de los enlaces de tarjeta (aria snapshot o `innerText`) | Esperado: nombre breve que empiece por el título (`aria-labelledby` al H2). Obtenido: nombre largo y desordenado; el marcador de captura de un caso pendiente se lee como contenido | `g_names.py` (salida) |
| 4 | Bajo | `/guias/guia-de-prueba#paso-2` → EN · 1280 y 390 | El cambio de idioma lleva a la misma guía (bien) pero pierde el ancla de sección y aterriza arriba. Igual que en las legales | Abrir la guía con `#paso-2` y pulsar "en" | Obtenido: `/en/guides/test-guide`, sin hash. Atrás sí regresa con el ancla | `e_lang.py` |
| 5 | Bajo | Subpáginas (p. ej. `/servicios/minecraft/plugins`) · 1280 | El título de "Servicios relacionados" ("TAMBIÉN PARA TU SERVIDOR.") se parte en dos líneas; en la maqueta cabe en una (la cuadrícula va debajo, a todo el ancho) | Comparar con `B-Sub-Minecraft-plugins.html` | Esperado: una línea como en la maqueta; obtenido: dos | `p-plugins-1280.png`, `mq-plugins-1280.png` |
| 6 | Bajo | Guía, bloque de código y tabla · 390 | La caja se desplaza por dentro (bien, sin ensanchar la página, enfocable y con nombre), pero no hay pista visual de que continúa: el código se corta en "muy" y la tabla en "Celda" | Abrir la guía a 390 | Esperado: sombra o degradado en el borde, o texto "desliza". Obtenido: corte seco | `p-guia-390.png` |
| 7 | Bajo | Guía · todos | Las cajas de código dicen todas "Bloque de código" y las tablas "Tabla" | Tab hasta las cajas | Con varias cajas por guía no se distinguen; mejor un nombre por caja o referencia a su sección | `d_guide.py` (salida) |

## Por confirmar

- Menú móvil en 390 con el desplegable de Servicios abierto por defecto empuja "Cotizar proyecto" bajo el pliegue a partir de 150 % (ya visto en el paso 4; sigue igual).
- Subpáginas: a 390 con 150 % algunos textos de apoyo ("Configuración de servidores", en bots) se parten dentro de una etiqueta; parece el mismo mecanismo del hallazgo 2, no se capturó.

## Fidelidad con las maquetas (1280 y 390)

Texto de las 10 plantillas comparado línea por línea con su maqueta: solo difieren lo decidido (Portafolio fuera del menú, secciones "Trabajos" y "Guías" ocultas por spec 004 RF-7, migas con "Inicio", barra de idioma, "[Canales por activar]", pie con aviso), y el contenido de guías de prueba. Diferencia visual propia: hallazgo 5. El caso Kardenum coincide casi píxel a píxel con `B-Caso`.

## Lo probado que salió bien

- Filtro por línea (CSS puro, radios): ratón, flechas del teclado, y **sin JavaScript** funcionan igual; el radio elegido se anuncia y su etiqueta muestra anillo de foco de 2 px; Tab sale del grupo en un solo paso. ES y EN.
- Guía: un H1, H2 numerados en orden, índice "En esta guía" con ancla por sección, fechas en `<time>`, imagen con alt, cajas de código y tabla enfocables con `role=group` y nombre, anillo de foco visible, el contenido ancho no ensancha la página (390: 0 de scroll lateral), flechas desplazan la caja.
- Cambio de idioma en casos, guías, subpáginas y portafolio lleva a la misma entrada (slug por idioma) con Atrás correcto. Slug del otro idioma o inexistente: 404 de marca; `/en/portafolio/kaelion` redirige a `/en/work/kaelion`.
- Notas pendientes entre corchetes (Kaelion): se leen como pendientes y no rompen el layout a 390.
- Barrido 1280/1024/768/390 × 100/125/150 %: sin desborde lateral en ninguna página (los "fuera de pantalla" reportados están dentro de cajas con scroll propio).

## Resolución (2026-11-15, hilo principal)

Sin Crítico ni Alto: no bloquea el cierre del lote.

| Hallazgo | Sev. | Qué se hizo |
|---|---|---|
| Un filtro sin resultados deja un hueco en blanco, sin mensaje (guías: Diseño y Video quedarán vacíos aun con las cuatro guías previstas) | Medio | Backlog 46, con propuesta: mostrar solo los filtros de las líneas que tienen entradas. Cambia lo que dice la spec ("Todos y las cinco líneas"): lo decide el fundador. En el portafolio no puede pasar con el flag encendido (el build exige un caso por línea). |
| H1 partido ("KARDEN / UM") a 390 px con el texto al 150 % | Medio | Es el hallazgo ya anotado en el backlog 33 (regla de partir palabras por debajo de 18rem). Se suma este caso. |
| Nombre accesible de las tarjetas que empieza por los metadatos · el cambio de idioma en una guía pierde el ancla · un título de subpágina en dos líneas a 1280 px · código y tabla sin pista de que se desplazan · todas las cajas se llaman igual | Bajo | Backlog 46. |
