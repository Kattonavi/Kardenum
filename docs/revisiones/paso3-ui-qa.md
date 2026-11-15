# Paso 3 · QA de interfaz en navegador real

**Commit probado:** 0def2aa (build de producción en `http://127.0.0.1:4700`; Railway no hizo falta).
**Navegador:** Chromium de Playwright 1.64 (Edge no usado). **Anchos:** 320, 390, 768, 1280 (+ texto 200 %).
**Alcance:** 14 URL (9 ES incl. 404, 5 EN) y el cotizador en ES y EN. No se editó código.
Scripts y capturas: `.impeccable/review/paso3/` (ignorada por git). No se repite la evidencia de `evidencia-paso3.txt`.

## Hallazgos (reproducidos dos veces o deterministas)

| # | Sev. | Página · ancho | Problema | Pasos | Esperado → Obtenido | Captura |
|---|------|----------------|----------|-------|---------------------|---------|
| 1 | **Alto** | `/contacto` y `/en/contact` · **todos** (320, 390, 1280) | Un nombre largo **sin espacios** (80 caracteres, el máximo) desborda la vista previa y provoca **scroll horizontal de toda la página** | Abrir `/contacto`, campo 5 "Tu nombre", escribir `WWWW…` (80 veces; con teclado real, `maxLength` se respeta). Mirar `document.documentElement.scrollWidth` | Esperado: el texto parte la línea (como ya hace la idea, que usa `break-words`) y no hay scroll lateral. Obtenido: scrollWidth 680 con viewport 390/320 y 1437 con viewport 1280; la vista previa se sale de la pantalla. Causa: el `<span>` del saludo de la vista previa no tiene `break-words` (`quote-form.tsx`, el de "Hola, Kardenum. Soy …"); la idea sí lo tiene. Con una palabra larga de 80 letras reales (p. ej. un apellido compuesto largo o una URL en el nombre) pasa igual | `ev-name80-390.png`, `q-name80-1280.png`, `q-name80-320.png` |
| 2 | Medio | Todas las páginas · 390 con texto al 200 % | El menú móvil queda **fuera de pantalla**: con `html{font-size:200%}` la cabecera mide 534 px en un viewport de 390, el botón "Abrir menú" queda en x 342-399 y ES/EN se corta. Mismo patrón a 320 (scroll 426-636 px según página) | Cargar cualquier página a 390 px, aplicar tamaño de texto al 200 % (rem), mirar la cabecera | Esperado: cabecera reflujo sin perder el menú (WCAG 1.4.4/1.4.10). Obtenido: scroll horizontal y botón del menú parcialmente fuera de pantalla | `ev-textzoom200-390.png`, `ev-textzoom200-1280.png` |
| 3 | Medio | Todas · 1280 con texto al 200 % | La cabecera de escritorio supera el ancho (1334 px en 1280): "Cotizar" queda a 54 px fuera de pantalla | Igual que arriba a 1280 px | Esperado: pasar al menú móvil antes de desbordar. Obtenido: scroll lateral y botón Cotizar cortado | `ev-textzoom200-1280.png` |
| 4 | Bajo | Menú móvil · 390 (todas) | El menú móvil no marca la sección activa: en `/nosotros`, `/contacto` y `/servicios/video` solo hay `aria-current` en el idioma (ES); "Nosotros", "Cotizar proyecto" y la línea actual no lo llevan. En escritorio sí (Servicios/Nosotros/Cotizar activos) | Abrir el menú en cada una de esas páginas y listar `a[aria-current]` | Esperado: el mismo estado activo que en escritorio. Obtenido: ninguno | `m-mobile-menu-390.png` |
| 5 | Bajo | Desplegable Servicios · 1280 (`/servicios/video`) | El desplegable no marca la línea actual entre sus cinco tarjetas (solo el disparador "Servicios" va en bronce) | Abrir el desplegable en `/servicios/video`; solo `es` tiene `aria-current` | Esperado: la tarjeta "Video y animación" marcada. Obtenido: sin marca | `m-dropdown-1280.png` |
| 6 | Bajo | Cotizador · todos | Al ir a otra página y volver con "Atrás" el formulario se reinicia (línea, plazo e idea vuelven a los valores por defecto; la línea solo se recupera si venía en `?linea=`) | Elegir otra línea y escribir idea, ir a `/nosotros`, "Atrás" | No se prueba que deba conservarse (RF-5 prohíbe guardar), pero la persona pierde lo escrito sin aviso; documentado por si se quiere restaurar con el historial del navegador | — (`q3.mjs`) |

## Por confirmar (no reproducido dos veces o decisión de diseño dudosa)
- Los botones "Cotizar" de la cabecera, "Cotizar proyecto" del héroe y "¿No sabes cuál necesitas?" van a `/contacto` sin `#cotizador`: el formulario queda a 960 px y hay que bajar la página (scrollY 0 tras el clic). Los botones de WhatsApp del cierre sí llevan `#cotizador`. Puede ser intencional (el hero de Contacto ofrece tres canales). Confirmar con el fundador.
- Los textos al 200 % (#2, #3) se midieron con `html{font-size:200%}` en el viewport fijo, no con zoom de navegador. Con zoom real de 200 % (viewport efectivo 640 px) el cotizador y las páginas no desbordan (scrollWidth 640/640). Puede quedar solo como "Bajo" si el fundador no cubre escalado de fuente del sistema.

## Probado y salió bien
- **Cotizador, datos extremos (ES y EN, 320/390/768/1280):** emoji con ZWJ, RTL (árabe y hebreo), `<script>`, `<img onerror>`, `<b>`, comillas, `& % # ? = + / \`, solo espacios, muchos saltos de línea, 1000+ caracteres pegados, nombre de 200 caracteres: la vista previa muestra exactamente el texto limpio de RF-7 (saltos colapsados a máximo 2, espacios normalizados), no inyecta HTML (`aside script/img/b` = 0), sin errores de consola, sin diálogos.
- **RF-5:** `localStorage`, `sessionStorage`, `document.cookie` y cookies de contexto vacíos tras escribir; 0 peticiones de red mientras se escribe (ES y EN, cuatro anchos).
- **Truncado de emoji:** con `insertText` de emoji hasta superar 80/1000, el navegador respeta `maxLength` y no queda ningún surrogate suelto en la vista previa.
- **`?linea=`:** `video`, `discord` válidos preseleccionan; `VIDEO`, `minecraft%20`, vacío, doble `linea`, `__proto__`, `%E0%A4%A`, `linea[]=` se ignoran (cae en Desarrollo), sin errores de hidratación.
- **Orden libre de selectores:** cambiar tipo → línea → plazo → línea otra vez siempre reinicia el tipo a "Todavía no lo tengo claro" y conserva el plazo (RF-2).
- **Doble envío y Enter:** con el número pendiente el botón es inerte, no se abre ninguna pestaña (RF-6).
- **Teclado:** orden de tabulación línea → tipo → idea → plazo → nombre → enviar → pie; foco visible en select, textarea, input y botón (anillo doble en el botón oscuro). Enlace "Saltar al contenido" lleva a `main#contenido` con foco.
- **Menús:** el desplegable de Servicios abre con clic, cierra con Esc (foco vuelve al disparador) y con clic fuera; no abre por hover. Menú móvil abre/cierra con Esc (foco vuelve a "Abrir menú"), navega y se cierra; bloquea el scroll del fondo. Cotizar y Contacto con `aria-current` en escritorio, `/contacto`.
- **ES/EN:** en las 13 páginas con versión doble el cambio de idioma lleva a la misma página del otro idioma (p. ej. `/servicios/diseno` ↔ `/en/services/design`); en el 404 lleva a `/en`.
- **Migas, avisos y 404:** migas presentes (verificadas en EN; en ES visibles en las capturas); aviso de Minecraft en las 14 páginas y aviso de Discord solo en `/servicios/discord`; 404 responde 404, con cabecera y pie, enlaces a Servicios/Nosotros/Contacto y línea en inglés.
- **Sin desborde ni cortes en títulos largos:** ningún elemento sale del viewport a 320/390/768/1280 en las 14 URL (los títulos largos en inglés envuelven bien); sin errores de consola salvo el 404 esperado del recurso.
- **`prefers-reduced-motion: reduce`:** 0 animaciones en ejecución en `/servicios`, `/servicios/minecraft`, `/contacto` y `scroll-behavior:auto` (con `no-preference` es `smooth`).
- **Fidelidad frente a maquetas** (B-Servicios, B-Contacto, B-Linea-Minecraft/Video, B-404): estructura, jerarquía, colores, tipografía y copy coinciden; solo difieren los elementos decididos (Portafolio, chips de subpáginas, valores de ejemplo del formulario, avisos entre corchetes, banner de idioma).

## Tabla heurística (Nielsen)

| Heurística | Pantalla | Sev. | Evidencia |
|---|---|---|---|
| H1 Visibilidad del estado | Menú móvil / desplegable | Bajo | #4, #5 |
| H3 Control y libertad | Cotizador al volver atrás | Bajo | #6 |
| H5 Prevención de errores | Cotizador, nombre largo sin espacios | Alto | #1 |
| H4 Consistencia | Menú móvil vs escritorio | Bajo | #4 |
| H7 Flexibilidad | Cabecera con texto ampliado | Medio | #2, #3 |

## No cubierto
Revisión página por página de todas las secciones intermedias a 768 px por captura (solo métricas de desborde); formulario con el envío real a WhatsApp (número pendiente); lectores de pantalla.

## Resolución (2026-11-15, hilo principal)

| # | Sev. | Qué se hizo |
|---|---|---|
| 1 | Alto | **Corregido.** La vista previa parte las palabras largas (`wrap-anywhere` en la caja del mensaje). Prueba e2e nueva ("a long word typed by the visitor wraps…") en escritorio y celular, a su ancho y a 320 px; falla contra el build anterior (157 px y 290 px de desborde). |
| 2, 3 | Medio | Backlog 22 (lote de pulido). Con zoom real del navegador al 200 % no hay desborde; el caso es el escalado solo de fuente. |
| 4, 5, 6 | Bajo | Backlog 26. |
| Por confirmar | — | "Cotizar" hacia el inicio de Contacto: es lo que muestra la maqueta. Backlog 27, lo decide el fundador. |

Hallazgo derivado: la guardia de "sin scroll lateral" de todas las páginas comparaba `scrollWidth` con
`window.innerWidth`, y con emulación de celular esa comparación nunca falla (la página desbordada se aleja y
`innerWidth` crece). Ahora compara contra el ancho configurado (`web/e2e/helpers.ts`); con la comparación corregida,
las 19 páginas pasan en los dos tamaños y a 320 px.

Re-verificación del delta: no se pidió otra pasada de navegador; el arreglo queda cubierto por la prueba e2e nueva.
