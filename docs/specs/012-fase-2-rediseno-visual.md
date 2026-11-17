# 012 · Fase 2: rediseño visual del sitio

**Estado:** en construcción (2026-11-16). Avance, decisiones y evidencia: `docs/revisiones/fase-2-bitacora.md`.
**Fuente:** `docs/handoff/fase-2/BRIEF-FASE-2.md`, `docs/handoff/fase-2/fase-2-rediseno.md` y las dos maquetas del
inicio (`docs/handoff/fase-2/maquetas/`). Donde este encargo contradice al plan original (preguntas en el inicio,
sitio sin animación), manda este.
**Numeración:** las specs 009 a 011 existen solo en la rama `feat/motion-and-service-visuals`, que no se publicó y
queda sin fusionar (ver "Decisiones"). Esta spec parte de `main`.

Cambia la capa visual: cinco escenas hechas con HTML y CSS, un carrusel en el inicio, movimiento y menos texto en el
inicio. La marca no cambia. **No se tocan** rutas existentes, idiomas, SEO técnico, metadatos, flags, cabeceras de
seguridad, freno de lanzamiento ni el workflow `verify-deploy`.

## Requisitos

### Reglas de todo el lote

| # | Requisito |
|---|---|
| RF-1 | Ninguna página DEBE llevar atributos `style` ni `<style>` en línea: todo el estilo sale de las hojas del proyecto y la CSP estricta queda intacta. |
| RF-2 | Toda animación DEBE ser CSS y animar solo `transform` y `opacity` (ningún `@keyframes` del proyecto toca otra propiedad). Sin librerías de animación ni dependencias nuevas. |
| RF-3 | CUANDO el visitante pide movimiento reducido, la página DEBE verse completa y correcta sin animación: ningún contenido queda oculto o a medio aparecer. |
| RF-4 | Todo texto nuevo DEBE existir en español y en inglés (mismas claves en los dos idiomas). |
| RF-5 | Cada página DEBE conservar un solo `<h1>`, objetivos táctiles de 44 px, foco visible y contraste AA. Bronce como texto solo sobre Tinta. |
| RF-6 | Lighthouse en celular DEBE dar 95 o más en las cuatro categorías; CLS hasta 0,1 (la prueba interna de 0,03 sigue), LCP hasta 2,5 s. |

### Escenas (rebanada 2)

| # | Requisito |
|---|---|
| RF-10 | DEBEN existir cinco escenas, una por línea, como componentes de servidor sin JavaScript: Desarrollo (navegador con tienda y carrito), Diseño (tablero de marca), Video (visor, línea de tiempo y fichas de formato), Minecraft (consola y panel) y Discord (chat con comando y respuesta de un bot). |
| RF-11 | Cada escena DEBE tener proporción fija 16:10 (`aspect-ratio`) y escalar con su contenedor (`container-type: inline-size`; medidas internas en `cqw` y `em`): la misma escena sirve a 300 px y a 900 px. |
| RF-12 | El contenedor de la escena DEBE llevar `role="img"` y un `aria-label` traducido; lo de adentro queda oculto a lectores de pantalla. |
| RF-13 | Los textos visibles dentro de una escena DEBEN estar traducidos. Las escenas NO DEBEN llevar nombres de clientes, cifras de resultados, arte oficial de Minecraft, ni el logo o la interfaz exacta de Discord. |
| RF-14 | Sin animación (movimiento reducido o navegador sin soporte), cada escena DEBE verse completa: el estado sin animar es la composición terminada. |
| RF-15 | Toda página con escenas DEBE ofrecer un control visible que pausa y reanuda el movimiento de todas las escenas de la página (WCAG 2.2.2), y DEBE funcionar sin JavaScript. |

### Carrusel del inicio (rebanada 3)

| # | Requisito |
|---|---|
| RF-20 | El inicio DEBE tener un solo carrusel a todo el ancho de la ventana, debajo del texto de la primera pantalla, con las cinco escenas. La del centro ocupa 46 % del ancho en escritorio y 78 % en celular, con separación de 2 % y 3 %; las vecinas se asoman con opacidad 0,32. |
| RF-21 | El carrusel DEBE avanzar por pasos: cada escena se queda 2,8 s y el cambio dura 0,7 s (3,5 s por paso, `cubic-bezier(0.7, 0, 0.2, 1)`), y vuelve a empezar sin salto visible. Las copias que hacen posible la vuelta quedan ocultas a lectores de pantalla. |
| RF-22 | Debajo DEBE haber cinco pestañas con una barra que se llena mientras su escena está al centro. Son indicadores, no controles. |
| RF-23 | El carrusel DEBE tener un botón visible de pausar y reanudar, y DEBE pausarse al pasar el cursor y al recibir foco. Todo eso funciona sin JavaScript. La pausa detiene a la vez la pista, las opacidades, las pestañas y el movimiento interno de las escenas. |
| RF-24 | CUANDO el visitante pide movimiento reducido, el carrusel NO DEBE avanzar solo y DEBE poder deslizarse a mano (y con el teclado). |
| RF-25 | El carrusel NO DEBE mover el contenido de la página ni en la carga ni al avanzar (CLS). |

### Inicio (rebanada 4)

| # | Requisito |
|---|---|
| RF-30 | El inicio DEBE seguir las maquetas, con los textos exactos del brief: primera pantalla centrada, carrusel, "Lo que hacemos" (Desarrollo y Diseño como bloques grandes alternados; Video, Minecraft y Discord como tres tarjetas con su escena), "Cómo trabajamos" sobre Piedra en cuatro columnas (una en celular) y cierre centrado. |
| RF-31 | Las frases de cada línea DEBEN ser las que ya usa el sitio (`service-lines.ts`). |
| RF-32 | El inicio NO DEBE mostrar las preguntas frecuentes ni la lista numerada de líneas. "Trabajo destacado" sigue oculto. |
| RF-33 | Donde decía "Ver línea" DEBE haber un botón con borde, de 44 px de alto, con el nombre de la línea ("Ver Desarrollo →", "View Development →"). En las tarjetas, toda la tarjeta es el enlace. |
| RF-34 | Tarjetas y bloques DEBEN entrar con un desplazamiento corto y un fundido al aparecer en pantalla, con `animation-timeline: view()` como mejora: sin soporte, el contenido se ve desde el principio. |

### Pie y preguntas frecuentes (rebanada 5)

| # | Requisito |
|---|---|
| RF-40 | El pie DEBE llevar: logo, las cinco líneas como enlaces, Preguntas frecuentes, Privacidad, Términos y © del año. El aviso de Minecraft sigue solo en las páginas de Minecraft (spec 008). |
| RF-41 | DEBE existir `/preguntas-frecuentes` (`/en/faq`): un grupo general con las siete preguntas aprobadas y un grupo por línea con las preguntas de cada página de línea. Lleva metadatos, migas, hreflang y entra al sitemap. No entra al menú. |
| RF-42 | La página de preguntas DEBE estar enlazada desde el pie, desde el cierre de cada página y desde cada línea. |
| RF-43 | Las páginas de línea ya NO DEBEN mostrar sus preguntas: enlazan a su grupo. |

### Resto de las páginas (rebanadas 6 y 7)

| # | Requisito |
|---|---|
| RF-50 | En el índice de servicios cada línea DEBE ser una tarjeta con su escena, su frase y su botón. |
| RF-51 | En las páginas de línea la primera pantalla DEBE ir en dos columnas: texto a la izquierda y la escena de la línea a la derecha (en celular, la escena debajo). El resto de secciones y todo el texto se conservan. Los enlaces a subpáginas usan el botón con borde. |
| RF-52 | Las subpáginas (tras su flag, que no se enciende) DEBEN llevar la misma primera pantalla, con la escena de su línea. |
| RF-53 | Nosotros, Contacto, portafolio, casos, guías, legales y 404 solo heredan botones, pie y la entrada al bajar. Sin escenas. |

## Decisiones (tomadas sin preguntar, según "Cómo decidir sin preguntar" del brief)

Cada una queda también en la bitácora, con su fecha.

1. **Se parte de `main`, no de la rama `feat/motion-and-service-visuals`.** Esa rama (specs 009 a 011) choca con
   el brief: escenas en SVG y un observador en JavaScript (el brief pide HTML con `cqw` y solo CSS), secciones
   plegadas en las líneas (el brief conserva todo el texto) y redes sociales en el pie (el pie del brief no las
   trae). La rama se conserva intacta, sin fusionar. De ella se reutiliza lo que coincide con el brief: el modelo de
   la página de preguntas (`faq.ts` y sus pruebas).
2. **Redes sociales fuera del pie.** El pie es el del brief y la maqueta. Queda en el backlog.
3. **WCAG 2.2.2 en todas las escenas, no solo en el carrusel.** Una escena en bucle es movimiento automático de más
   de 5 s esté donde esté. Un mismo control ("Pausar animación") detiene todas las escenas de la página: en el inicio
   es el botón del carrusel; en el índice de servicios, las líneas y las subpáginas va junto a la primera escena. Es
   una casilla nativa con aspecto de botón y funciona con `:has(:checked)`, sin script. No recuerda la elección entre
   páginas (para eso haría falta script y almacenamiento).
4. **Pestañas del carrusel como indicadores**, igual que en la maqueta (ocultas a lectores de pantalla). Con solo
   CSS no se puede saltar a una escena.
5. **Movimiento reducido en el carrusel:** la pista deja de animarse y pasa a ser una fila con desplazamiento
   horizontal y ajuste al centro; las copias no se muestran; las barras de las pestañas no se llenan.
6. **El texto dentro de las escenas se mide en `cqw`**, no en rem: es parte de un dibujo (`role="img"`), no texto
   de lectura, y debe escalar con la escena. La regla de tipografía en rem (WCAG 1.4.4) sigue para todo el texto real.
7. **Pesos de la maqueta:** títulos en Archivo ancho 125 peso 800 y botones en 700 (la identidad decía 600). La
   maqueta aprobada es la referencia visual; la familia no cambia. Las fuentes de respaldo se miden de nuevo para el
   peso 800, para que el cambio de fuente no mueva la página.
8. **El cierre centrado es uno solo para todo el sitio** (mismo componente), con el enlace a las preguntas. Las
   variantes por página se conservan (orden de canales, franja de Discord, correo escrito en Minecraft).
9. **Cómo se prueban las rebanadas 2 y 3**, cuando ninguna página publicada usa todavía escenas ni carrusel: pruebas
   estáticas sobre el código (corren en cada build) y pruebas de navegador contra una galería de prueba que solo se
   instala en el clon de descarte (`docs/pruebas/escenas-de-prueba/`), como las guías y los casos de prueba. Desde la
   rebanada 4 las mismas pruebas de navegador corren contra el inicio real, también en `verify-deploy`.
10. **`lighthouserc.cjs` no se toca** (es parte de la verificación). El Lighthouse de las páginas que no mide
    (preguntas, las otras líneas) se corre aparte y va en el informe.
11. **Las palabras dentro de una escena las dibuja la hoja de estilos** (`data-t` + `content: attr(data-t)`), no son
    texto de la página. Medido el 2026-11-16 con la galería de prueba: como texto real, axe marcaba contraste
    insuficiente en las escenas vecinas del carrusel (atenuadas a 0,32), la prueba de texto al 200 % fallaba (ese
    texto escala con la escena, no con la letra) y un buscador leería "Carrito, Pagar" como contenido. Siguen
    traducidas (RF-13) y ocultas a lectores de pantalla.
12. **Una escena lejos de la pantalla no se dibuja hasta acercarse** (`content-visibility: auto`): su caja no
    depende de lo de adentro, así que nada se mueve. Medido: el primer pintado de la galería bajó de 1,3 s a 0,8 s.
13. **El control de pausa es una casilla con el mismo texto en sus dos estados** ("Pausar animación", con una marca
    que se llena): así el nombre que dice un lector de pantalla es el texto en pantalla. Con solo CSS no se puede
    cambiar a "Reanudar" sin que el nombre y el estado se contradigan.
14. **El cursor solo pausa el carrusel donde hay cursor** (`hover: hover`): en una pantalla táctil el "hover" se
    queda pegado tras un toque. Ahí la pausa es el control visible, o el foco del teclado.
15. **Página de preguntas: textos nuevos, mínimos y provisionales** (el brief no los trae; los confirma el
    fundador): la frase bajo el título ("Lo que más nos preguntan antes de empezar un proyecto, ordenado por línea
    de servicio. Si tu duda no está aquí, escríbenos."), el título del grupo general ("Para empezar."), el título
    y la descripción para buscadores, y sus equivalentes en inglés. El título de la página es el que tenía la
    sección en el inicio: "Claridad antes de empezar.". Sin datos estructurados `FAQPage`, como el resto del sitio.
16. **La página de preguntas no lleva escenas** (es texto: 23 preguntas con su respuesta), ni avisos de Minecraft o Discord en el
    pie (habla de las cinco líneas, como el inicio; spec 008). Una respuesta de una línea que repite palabra por
    palabra una general se muestra una sola vez, con las generales.
17. **Cada línea enlaza a su grupo desde el cierre:** en la página de una línea (y en sus subpáginas), el enlace
    "¿Tienes dudas? Ver preguntas frecuentes" del cierre lleva a `/preguntas-frecuentes#<línea>`. No se agregó una
    sección aparte donde estaban las preguntas: sería un segundo enlace al mismo sitio, una pantalla más arriba.
    Las subpáginas conservan sus propias preguntas (siguen tras su flag).
18. **La entrada al bajar termina pronto.** La maqueta fundía el bloque a lo largo del 80 % de su altura; un
    bloque alto (una lista de preguntas) quedaba semitransparente, por debajo del contraste AA, durante casi una
    pantalla con la página en reposo (axe lo marcó en la página de preguntas). Ahora el movimiento dura los
    primeros 8rem del bloque y el fundido termina en los primeros 2,5rem. Queda un límite conocido: una franja de
    una línea de alto, en el borde inferior de la pantalla, puede verse a medio fundir. Regla técnica (contraste
    AA) sobre maqueta.
19. **El pie no lleva separadores entre las líneas** (como la maqueta): cierra el ítem 40 del backlog (el "·"
    colgando en celular).
20. **Presupuesto de peso del documento: el del inicio cabe en la primera ráfaga de TCP** (14.600 bytes con las
    cabeceras de respuesta; 13.560 de cuerpo en gzip). Por encima, Lighthouse simula una ida y vuelta más (150 ms
    de LCP) y el rendimiento del build abierto queda al filo del mínimo: `verify-deploy` falló por eso en las
    rebanadas 4 y 5. Lo vigila la prueba de humo. Para caber, sin cambiar un píxel (26 capturas idénticas contra
    producción, a 1280 y 390 px, con los menús abiertos):
    - **Looks con nombre** en `globals.css`: una lista larga de utilidades viaja dos veces en cada documento (el
      HTML y los datos que Next escribe para el navegador). Los botones, los títulos, los enlaces de la cabecera y
      del pie y los bloques del inicio llevan ahora un nombre (`btn-primary`, `title-hero`, `eyebrow`, `nav-link`…),
      definido con las mismas utilidades.
    - **Los menús cerrados no van en el HTML:** el contenido del menú de celular y el del desplegable de Servicios
      se dibuja al abrirlos. Cerrados no se podían ver (sin script, sus controles ya eran enlaces al pie y a
      `/servicios`) y pesaban 5 KB y 3 KB en cada página. Los enlaces a las cinco líneas siguen en el pie.
    - **Las palabras de las escenas las escribe la hoja de estilos por idioma** (`content` bajo `:lang(en)`), ya no
      un atributo: una prueba unitaria exige que cada palabra en español tenga su par en inglés.
    - **El interior de cada escena es un fragmento de HTML fijo por línea** (`scene.tsx`), no un árbol de
      elementos de React: como elementos, las escenas ocupaban una cuarta parte del documento.
22. **Índice de servicios en Tinta, con las mismas tarjetas del inicio.** Cinco tarjetas: tres en la primera fila y
    dos, más anchas, en la segunda (en una ventana ancha), para que ninguna fila quede corta. La orientación
    "¿No sabes cuál necesitas?" sigue debajo, sobre Piedra. El control de pausa va sobre la rejilla.
23. **Primera pantalla de las líneas:** el texto ocupa tres quintos y la escena dos. Con la escena al lado, el título
    de Minecraft y Discord usa el mismo tamaño que el de las otras líneas (antes era mayor y, en la columna más
    angosta, se partía en cinco renglones). La pieza del corchete que acompañaba esos dos títulos sale: su lugar lo
    toma la escena.
24. **Títulos en peso 800 en todo el sitio** (páginas, secciones, legales, casos, guías y 404), no solo en el inicio:
    dos pesos de título entre páginas del mismo sitio se verían como un error. El tamaño mínimo del título de página
    baja de 30 a 29 px: en peso 800 la palabra más larga ("DEVELOPMENT") medía 3 px más que una pantalla de 320.
25. **Subpáginas:** misma primera pantalla que su línea, con su escena. Conservan sus propias preguntas.
26. **La entrada al bajar llega al resto de las páginas por los bloques que comparten** (listas numeradas,
    tarjetas, listas de marcas, pasos, preguntas) y, donde la página tiene los suyos, en ellos (Nosotros, Contacto,
    legales, índices de portafolio y guías).
27. **El pie de la 404 sigue al pie del sitio** (es un pie propio y estático: esa página reemplaza al layout):
    sin separadores y con el enlace a Preguntas frecuentes.
21. **Lo que no se ve al cargar se calcula después:** las bandas del inicio bajo el carrusel, y el cierre y el pie
    de todas las páginas, llevan `content-visibility: auto`. El primer layout del inicio era una tarea larga que
    Lighthouse contaba como bloqueo en el runner. En el inicio los saltos a un ancla son directos, no suaves, para
    caer siempre en el ancla (las bandas de arriba tienen altura estimada hasta que se dibujan).

## Fuera de alcance

- Encender flags, abrir el sitio a buscadores, variables de Railway.
- Piezas reales (reel, capturas, casos): cuando existan, reemplazan escenas en las secciones de trabajo.
- Transiciones entre páginas (el plan de la fase las menciona; el brief no las pide). Al backlog.
- Recordar la pausa del movimiento entre páginas.

## Plan (una rebanada a la vez: clon limpio en verde → push → `verify-deploy` en verde)

| # | Rebanada | Hecho cuando |
|---|---|---|
| 1 | Spec, plan, bitácora y carpeta del encargo en `docs/handoff/fase-2/` | Commit en `main`; `verify-deploy` manual en verde (línea base: un push sin `web/**` no despliega) |
| 2 | Cinco escenas y el control de pausa | `pnpm build` (pruebas estáticas nuevas) · navegador contra la galería de prueba en el clon |
| 3 | Carrusel | Igual, más Lighthouse en celular y axe sobre la galería |
| 4 | Inicio completo, en los dos idiomas | Puerta completa; las pruebas de escenas y carrusel pasan a correr contra `/` y `/en` |
| 5 | Pie nuevo y página de preguntas | Puerta completa; sitemap y hreflang con la página nueva |
| 6 | Índice de servicios y las cinco líneas | Puerta completa |
| 7 | Subpáginas (tras su flag) | Puerta completa (el sitio cerrado las genera con `noindex`) |
| 8 | Revisiones del lote: código, seguridad, navegador, SEO técnico y diseño contra las maquetas | Crítico y Alto aplicados; lo demás al backlog |

Si una rebanada no pasa `verify-deploy` tras dos intentos de arreglo: `git revert`, se documenta y se sigue con la
siguiente que no dependa de ella.

## Validación

| RF | Prueba |
|---|---|
| RF-1 | `web/src/lib/no-inline-styles.test.ts` (código fuente) · `pnpm smoke` y `web/e2e/security.spec.ts` (CSP sin violaciones en el navegador) |
| RF-2 | `web/src/lib/motion-rules.test.ts` (cada `@keyframes` de las hojas del proyecto) |
| RF-3, RF-14, RF-24 | `web/e2e/scenes.spec.ts` y `web/e2e/carousel.spec.ts` con movimiento reducido |
| RF-4, RF-13 | `web/src/content/messages.test.ts` (mismas claves en `es.json` y `en.json`) |
| RF-5 | `web/e2e/accessibility.spec.ts` (axe en cada página, 1280 y 390 px) |
| RF-6, RF-25 | Lighthouse CI en `verify-deploy` · prueba de CLS de `web/e2e/` |
| RF-10 a RF-13, RF-15 | `web/e2e/scenes.spec.ts` |
| RF-20 a RF-23 | `web/e2e/carousel.spec.ts` |
| RF-30 a RF-34 | `web/e2e/home.spec.ts` |
| RF-40 a RF-43 | `web/src/content/faq.test.ts` · `web/e2e/faq.spec.ts` · `pnpm smoke` |
| RF-50 a RF-53 | `web/e2e/scenes.spec.ts` (páginas con escena) · `web/e2e/subpages.spec.ts` |

Los nombres de archivo de las pruebas son los previstos; la bitácora deja los definitivos con su salida.
