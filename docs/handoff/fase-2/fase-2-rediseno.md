# Fase 2 · Rediseño visual del sitio

Plan del 16 de noviembre de 2026. Estado: **dirección elegida (B3), inicio maquetado y paso a código en curso.** Donde este documento contradiga a `plan-sitio-web.md` (preguntas frecuentes en el inicio, sitio sin animación), manda este cuando se apruebe la dirección.

## Por qué

Comentarios de personas cercanas al estudio después de ver el sitio en construcción:

- Hay demasiado texto. Uno entra y solo lee.
- Faltan imágenes que muestren de una vez qué hace el estudio.
- El estilo se siente minimalista "de otra época". Piden algo más actual, más llamativo y con animaciones.
- Las preguntas frecuentes deben salir del inicio a una página propia.

La lectura: tienen razón. Un estudio que vende diseño y video tiene que mostrarlo, no describirlo.

## Decisiones tomadas

| Tema | Decisión |
|---|---|
| Alcance | **Se conserva la marca**: logo L5, bronce, paleta y tipografía. Cambia el sitio: imágenes, composición y movimiento |
| Imágenes | **Escenas hechas por nosotros**: composiciones de lo que entrega cada línea, armadas en código |
| Animación | **Nivel medio**: primera pantalla animada, secciones que entran al bajar y transiciones entre páginas |
| Preguntas frecuentes | Salen del inicio a una página propia, agrupadas por línea |
| Celular | Se diseña junto con el escritorio. Reemplaza la "Ronda 3" que estaba pendiente |

## Dirección elegida: B3

En la "Ronda 4" del tablero se probaron tres direcciones para el inicio (A · Escenario, B · Muro, C · Collage) y tres versiones de la B. Quedó la **B3**:

- Primera pantalla centrada: etiqueta, título, párrafo y dos botones.
- Debajo, **un solo carrusel que avanza por pasos**: una escena al centro y las vecinas asomándose atenuadas. Cambia cada 3,5 segundos. La escena central ocupa 46 % del ancho en escritorio y 78 % en celular (la primera versión, de 60 %, se sentía muy grande).
- Se descartaron dos carruseles a la vez (excesivo) y la fila que se desliza sin parar (no deja ver cada escena).
- Las líneas van como bloques grandes de imagen y texto (Desarrollo y Diseño) y tres tarjetas (Video, Minecraft y Discord).
- "Ver línea" pasa a ser un botón con borde y con el nombre de la línea, para que se entienda dónde hacer clic.
- El inicio completo quedó maquetado en escritorio y celular: primera pantalla, carrusel, líneas, cómo trabajamos (sobre fondo claro), cierre con enlace a preguntas frecuentes y pie.
- Al programarlo, el carrusel lleva botón de pausa y se detiene al pasar el cursor: es requisito de accesibilidad.

El encargo para el código está en el repo, en `docs/handoff/fase-2/BRIEF-FASE-2.md`.

## Qué se queda igual

Todo lo construido en los pasos 1 a 7 (ver `estado-desarrollo.md`): rutas e idiomas, SEO técnico, cotizador, páginas legales, seguridad, flags, pruebas y despliegue. La fase cambia la capa visual: los componentes y cómo se compone cada página.

También siguen en pie las reglas de siempre: nada de clientes, cifras ni testimonios inventados; sin "plan" ni "mensualidad"; sin mencionar el país; sin sección de equipo.

## Las escenas

Una escena es una composición visual que muestra el resultado de una línea, hecha con HTML, CSS y SVG. No es una foto ni un trabajo de cliente. Ventajas: se pueden hacer ya, pesan poco, se animan y usan los colores de la marca.

| Línea | Escena |
|---|---|
| Desarrollo | Una ventana de navegador con una tienda o un panel que se arma por partes, junto a un fragmento de código |
| Diseño | Un tablero de marca: símbolo, paleta, tipografía y una pieza para redes |
| Video y animación | Una línea de tiempo de edición con sus capas y un visor que cambia de formato (16:9, 9:16, 1:1) |
| Minecraft | La consola de un servidor y su panel (jugadores, rendimiento), y una tienda del servidor |
| Discord | Una ventana de chat donde un bot responde a un comando o abre un ticket |

Límites de las escenas:

- No llevan nombres de clientes ni cifras de resultados. Usan a Kardenum o textos neutros.
- No usan arte oficial de Minecraft ni el logo o la interfaz exacta de Discord. Son interfaces propias, con la identidad del estudio.
- Cuando existan piezas reales (reel, capturas, casos), van reemplazando escenas en las secciones de trabajo.

## Animación

- Primero con CSS, sin librerías pesadas. Si una sección necesita más, se justifica y se mide.
- La página se ve completa sin animación: quien tenga activada la opción de reducir movimiento, o un navegador que no soporte el efecto, ve el contenido igual.
- La seguridad no se afloja: la política de contenido estricta se mantiene.
- El presupuesto no cambia: Lighthouse 95 o más, LCP hasta 2,5 s, CLS hasta 0,1 e INP hasta 200 ms, en celular.

## Qué cambia en cada página

**Inicio** (pasa a ser visual, con frases cortas)
1. Primera pantalla: frase de posicionamiento y una escena animada que recorre las cinco líneas.
2. Las cinco líneas como tarjetas grandes, cada una con su escena.
3. Trabajo destacado, cuando haya piezas.
4. Cómo trabajamos, en cuatro pasos, compacto y visual.
5. Cierre con los tres canales y un enlace a las preguntas frecuentes.

**Páginas de línea y subpáginas** (conservan su texto, mejor repartido)
- Primera pantalla con la escena de la línea.
- Servicios como tarjetas visuales.
- El texto que trae búsquedas se queda: es por donde llega Google.
- Las preguntas propias de la línea pasan a la página de preguntas; queda un enlace a su grupo.

**Preguntas frecuentes** (página nueva)
- `/preguntas-frecuentes` y `/en/faq`.
- Grupo general (las siete aprobadas) y un grupo por línea.
- Se enlaza desde el pie, el cierre de cada página y cada línea. No entra al menú principal.

**Nosotros, Contacto, portafolio, guías y legales:** toman el sistema nuevo cuando esté definido. Su contenido no cambia.

## Cómo se trabaja

1. **Dirección** ("Ronda 4" del tablero): dos o tres propuestas de la primera pantalla del inicio y una sección, con animación real, en escritorio y celular. Se elige una.
2. **Inicio completo**, escritorio y celular.
3. **Una página de línea y una subpágina**, para volver la dirección un sistema de componentes.
4. **Código**: Claude Code reemplaza componentes página por página. Las pruebas automáticas y Lighthouse deciden si un cambio entra.

## Mientras tanto, en el código

- Sí puede avanzar lo que no es visual: el aviso de Minecraft solo en las páginas de Minecraft y la página de preguntas frecuentes (ruta, contenido y enlaces).
- En pausa: el lote de pulido visual y cualquier ajuste de diseño de las páginas actuales.

## Pendiente

- Dos o tres sitios que sirvan de referencia de "moderno y llamativo".
- Qué piezas reales puede producir el equipo más adelante (reel, capturas, diseños).
- Validar la dirección elegida con las mismas personas que dieron los comentarios.
