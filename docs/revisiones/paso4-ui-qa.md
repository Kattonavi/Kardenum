# Paso 4 · UI QA en navegador real

Sitio probado: `http://127.0.0.1:4700` (build del commit 1ed1944), Chromium de Playwright (Python), 2026-11-15.
Scripts y capturas: `.impeccable/review/paso4/` (`a_legal.py`, `a3_toc.py`, `b_zoom.py`, `b2_fine.py`, `c_menu.py`, `d_form.py`, `e_hydr.py`, `f_nojs.py`, `g_zoom.py`, `h_lang.py`).
Método del texto grande: `document.documentElement.style.fontSize = "N%"` (150/200 pedidos, más 105-140 para encontrar el umbral) y zoom real del navegador (viewport/escala: 1280->640, 768->384, 320 y 200 px a escala 2).
Un hallazgo cuenta solo si se reprodujo dos veces (cada medición corrió al menos en dos barridos o dos repeticiones).

## Resumen

Crítico 0 · Alto 0 · Medio 3 · Bajo 5 · Por confirmar 3.

## Hallazgos

| # | Sev. | Página · ancho | Problema | Pasos para reproducir | Esperado / obtenido | Captura |
|---|---|---|---|---|---|---|
| 1 | Medio | 404 (`/es/no-existe`) · 390 con texto 125-130 %; 375 con 125 %; 360 con 150 % | La cabecera estática del 404 (sin menú) no cabe: el botón "Cotizar" se sale por la derecha y aparece scroll lateral | Viewport 390 de ancho; `document.documentElement.style.fontSize="130%"`; leer `scrollWidth` | Esperado: sin scroll lateral (WCAG 1.4.10). Obtenido: `scrollWidth` 398 (125 %), 414 (130 %), "Cotizar" con R=414 sobre 390; a 360 y 150 %: 376. Vuelve a caber a 140 % y 150 % en 390, así que un barrido solo con 150/200 % no lo ve | `p-404-390-130.png`, `p-404-360-150.png` |
| 2 | Medio | Inicio, y todos los H1/H2 de MAYÚSCULAS · 390 con texto 150 %; 320 con 120-125 % | La regla que parte palabras por debajo de 18rem actúa a tamaños no extremos y parte una palabra o deja la coma huérfana | Viewport 390, texto 150 %: el H1 de inicio dice "SOFTWAR / E, DISEÑO". Viewport 320, texto 120 %: "SOFTWARE" cabe pero la coma pasa sola a la línea siguiente ("**,** DISEÑO") | Esperado: palabra entera y puntuación pegada a su palabra (o reducir el título un paso). Obtenido: corte feo. En 320 y 100-115 % no ocurre; 390 y 125-140 % tampoco | `p-home-390-150.png`, `p-home-320-120.png` |
| 3 | Medio | Todas las páginas con menú · 390 (y 1280/768 en móvil) SIN JavaScript | Sin JS el menú móvil queda deshabilitado para siempre y no hay alternativa: desde Inicio o una página legal en 390 no se llega a Servicios, Nosotros ni Contacto (el pie solo trae Desarrollo/Diseño/Video/Minecraft/Discord y Privacidad/Términos). En escritorio, "Servicios" también queda muerto. Ninguno de esos controles explica nada (solo el cotizador tiene `noscript`) | Contexto con `java_script_enabled=False`; 390; abrir `/es/legal/privacidad`; listar enlaces visibles | Esperado: una ruta de enlaces a Servicios/Nosotros/Contacto o un aviso. Obtenido: botón "Abrir menú" `disabled` sin mensaje; en Inicio el único camino a Contacto es "WhatsApp"→`/contacto#cotizador` | `p-nojs-legal-390.png`, `p-nojs-home-390.png` |
| 4 | Bajo | Contacto, Inicio, legales · antes de hidratar y sin JS | Los controles `disabled` no se ven deshabilitados: opacidad 1 y cursor `pointer` (el campo de idea muestra cursor `default` y pasa a `text` al hidratar). Quien tiene conexión lenta ve un botón "Abrir menú" o "Enviar por WhatsApp" como vivo y el clic no hace nada | `page.route("**/_next/static/**/*.js")` reteniendo; `goto` con `domcontentloaded`; leer `getComputedStyle` de los botones | Esperado: aspecto o cursor de inactivo hasta encender. Obtenido: idéntico al estado activo (diferencia de píxeles pre/post hidratación: solo el anillo de foco; sin saltos de layout, bien) | `p-prehydr-contacto-390.png`, `p-nojs-contacto-390.png` |
| 5 | Bajo | Barra de idioma · cualquier página sin JS | "Cerrar aviso de idioma" queda `disabled` y la barra no se puede quitar, sin explicación | JS desactivado, navegador con idioma inglés; ver la barra | Esperado: ocultar la barra o no mostrar el botón. Obtenido: botón muerto | `p-nojs-home-390.png` |
| 6 | Bajo | Menú móvil · 320 con texto 200 % | "SERVICIOS" se parte "SERVICI / OS" y el numeral "III" "II / I" | Viewport 320, `fontSize="200%"`, abrir menú | Esperado: numeral intacto. Obtenido: cortado (extremo; a 390/200 % el menú queda bien) | `p-menu-320-200.png` |
| 7 | Bajo | Legal · cambio de idioma estando en `#s4` | El selector de idioma pierde la sección: `/es/legal/terminos#s4` → `/en/legal/terms`, arriba del todo | Abrir `/es/legal/terminos#s4`, clic "en" | Esperado (opcional): conservar el ancla. Obtenido: scrollY 0, sin hash (Atrás sí vuelve a `#s4`) | (salida de `h_lang.py`) |
| 8 | Bajo | Nosotros, Contacto · 768 | Cuadrículas de 2 columnas con 3 tarjetas dejan una huérfana ("Alcance claro", "Correo", "Te enviamos la cotización") y deja espacio vacío | Viewport 768, página completa | Esperado: 3 en fila o 1 columna; obtenido: 2+1 | `p-nosotros-768.png`, `p-contacto-768.png` |

## Por confirmar

- 404 a 768 con texto 200 %: un `path` (icono SVG) queda con L813/R819, fuera del viewport de 768, sin generar scroll (`scrollWidth` 768). Posible flecha recortada de un botón; no se vio en captura.
- Menú móvil: el desplegable "Servicios" abre expandido por defecto, así "Cotizar proyecto" y "WhatsApp" quedan bajo el pliegue en 800 px de alto desde 150 % (hay scroll interno del diálogo y sí se alcanza). Puede ser decisión de diseño.
- Chevron de los `select` del cotizador no crece con el texto (muy pequeño a 200 %); puede ser el control nativo.

## Lo probado que salió bien

- Fidelidad: ambas legales a 1280 coinciden con su maqueta (migas, etiqueta, título, fechas, lista de contenido, 8 secciones). Las 4 URL dan 200, `lang` correcto y 0 scroll lateral a 320/390/768/1280. Los marcadores largos envuelven bien incluso a 320.
- Regiones: `navigation` "Principal", "Ruta"/"Breadcrumb", "Contenido" (por `aria-labelledby`), "Legal" (pie); 8 `region` con nombre de su H2; un H1 y H2 numerados. El panel del menú móvil (segundo "Principal") está oculto a la accesibilidad mientras está cerrado.
- Lista de contenido: los 8 enlaces llevan a su sección con ratón y teclado (Enter) a 1280 y 390; sin cabecera fija que tape el destino; Atrás regresa a la sección anterior; el foco siguiente tras un salto continúa desde la sección.
- Texto grande: sin scroll lateral en ninguna página (inicio, servicios, línea, nosotros, contacto, legal) a 1280/768/390/320 con 100/125/150/200 % salvo el hallazgo 1. Menú: abre, se usa el desplegable, Escape cierra y devuelve el foco a "Abrir menú", idioma y "Cotizar" alcanzables en 150 y 200 % a todos los anchos; el diálogo hace scroll cuando no cabe. Cotizador rellenable a todos los tamaños (los campos no se salen; el botón "Enviar" permanece deshabilitado por el canal pendiente).
- Zoom real 200 % (viewport 640 y 384) y 400 % (320): 0 desbordes, 0 palabras partidas.
- Hidratación: con los scripts retenidos no hay salto de layout ni cambio visual al encender; el orden de foco sigue el orden visual y los controles deshabilitados se saltan.
- Sin JS: se leen las páginas legales, funciona la lista de contenido, el cambio de idioma (enlaces `/en/...` correctos, incl. legales), la navegación por enlaces del pie y de la cabecera en escritorio; el cotizador avisa "necesita JavaScript".
- Pies: "Privacidad" y "Términos" aparecen en las páginas y en el 404 (en español, por decisión). Cambio de idioma desde una legal lleva a la legal equivalente (`/en/legal/terms`); Atrás regresa.
- 768 del lote anterior (servicios, línea Desarrollo, nosotros, contacto, inicio): sin problemas de layout salvo las tarjetas huérfanas (hallazgo 8).

## Resolución (2026-11-15, hilo principal, commit 44a4e8c)

| Hallazgo | Sev. | Qué se hizo |
|---|---|---|
| 404: "Cotizar" se sale con el texto al 125-130 % en celular | Medio | **Corregido.** El nombre de la marca cede antes en la cabecera del 404 (por debajo de 22,5rem queda el símbolo solo). |
| Sin JavaScript en celular no hay salida | Medio | **Corregido** (decisión del fundador): el control del menú llega del servidor como enlace a una navegación del pie (Servicios, Nosotros, Contacto), visible solo cuando se llega por ese enlace; las cinco líneas del pie son enlaces. "Servicios" en escritorio llega como enlace a `/servicios`. |
| Palabras partidas a tamaños intermedios ("SOFTWAR/E" a 390 px con 150 %) | Medio | Backlog 33. Es la regla de partir palabras por debajo de 18rem: sin ella, la página se ensancha. |
| Controles apagados que se ven activos · cerrar la barra de idioma sin JS · palabras partidas en el menú a 320 px con 200 % · el cambio de idioma pierde el ancla · tarjetas huérfanas a 768 px | Bajo | El menú y el desplegable ya no se apagan (son enlaces hasta que corre el script). El resto, backlog 33. |
