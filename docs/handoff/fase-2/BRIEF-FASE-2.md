# Brief · Fase 2: rediseño visual del sitio de Kardenum

16 de noviembre de 2026. Para Claude Code. Trabajo pensado para una sesión larga sin supervisión: lee todo antes de empezar.

## Qué es

El sitio está construido (pasos 1 a 7 del brief original) pero se ve demasiado textual. Esta fase cambia la capa visual: imágenes propias ("escenas"), un carrusel en el inicio, movimiento y menos texto en el inicio. La marca no cambia: mismo logo, colores y tipografía.

**No se toca:** rutas, idiomas, SEO técnico, metadatos, flags, cabeceras de seguridad, freno de lanzamiento, workflow `verify-deploy`, ni los textos que no estén listados aquí.

## Qué hay en este paquete

- `maquetas/inicio-escritorio.html`: el inicio aprobado. Ábrelo a 1280 px o más.
- `maquetas/inicio-celular.html`: el mismo inicio para 390 px.
- `fase-2-rediseno.md`: el plan y las decisiones de la fase.

**Las maquetas son la referencia visual, no código para copiar.** Están hechas con estilos en línea y la CSP del sitio los bloquea. Todo va con clases y CSS del proyecto.

## Reglas técnicas (no negociables)

1. **CSP estricta intacta.** Nada de atributos `style`, ni `<style>` en línea, ni librerías que los inyecten. Los retrasos escalonados van con `:nth-child` o clases, no con `style`.
2. **Animación solo con CSS**, sobre `transform` y `opacity`. Sin librerías de animación. En la maqueta el cuadro del visor de video anima `left`: en el código debe ser `transform`.
3. **`prefers-reduced-motion`:** sin animación la página se ve completa y correcta. El carrusel no avanza solo y se puede deslizar a mano.
4. **Presupuesto igual que antes:** Lighthouse 95 o más en las cuatro categorías, CLS hasta 0,1 (tu prueba interna de 0,03 sigue), LCP hasta 2,5 s, INP hasta 200 ms, en celular.
5. **Accesibilidad:** un solo H1, objetivos táctiles de 44 px, foco visible, contraste AA. Bronce `#B8923A` como texto solo sobre Tinta; sobre Piedra usa `#7A5C14`.
6. **Sin dependencias nuevas** salvo que sea imposible sin ellas; si agregas una, justifícala en el informe y respeta la regla de los 30 días.
7. **Los dos idiomas a la par.** Todo texto nuevo va en español y en inglés (el inglés sigue siendo provisional).

## El sistema nuevo

### Escenas

Una escena es una composición hecha con HTML y CSS que muestra lo que entrega una línea. No es una imagen ni un trabajo de cliente. Son cinco componentes, uno por línea:

| Línea | Escena | Movimiento |
|---|---|---|
| Desarrollo | Ventana de navegador con una tienda: rejilla de productos y carrito | Los productos entran escalonados; el botón de pagar late |
| Diseño | Tablero de marca: símbolo, paleta, muestra tipográfica y pieza para redes | La paleta sube por colores; las barras de la pieza se dibujan |
| Video y animación | Visor y línea de tiempo con tres pistas, y fichas de formato (16:9, 9:16, 1:1, 4:5) | El cabezal recorre la línea de tiempo; un cuadro cruza el visor; las fichas se encienden por turnos |
| Minecraft | Consola de servidor y panel (jugadores, rendimiento, tienda) | Las líneas de la consola aparecen una a una; las barras suben y bajan |
| Discord | Chat con canales, un comando y la respuesta de un bot con botones | Los mensajes aparecen en orden; indicador de escritura |

Cómo construirlas:

- Proporción fija 16:10, con `aspect-ratio`, para que no muevan el contenido al cargar.
- Escalan con su contenedor: el contenedor declara `container-type: inline-size` y todo lo de adentro se mide en `cqw` y `em`. La misma escena sirve a 300 px y a 900 px.
- Son decorativas: el contenedor lleva `role="img"` y un `aria-label` traducido que describe la escena; lo de adentro queda oculto para lectores de pantalla.
- Los textos visibles dentro de la escena (CARRITO, PAGAR, CONSOLA, etc.) se traducen.
- Límites de contenido: sin nombres de clientes ni cifras de resultados; sin arte oficial de Minecraft; sin el logo ni la interfaz exacta de Discord. Son interfaces propias con los colores de la marca.

### Carrusel del inicio

- Un solo carrusel, a todo el ancho de la ventana, debajo del texto de la primera pantalla.
- Cinco escenas. La del centro ocupa **46 % del ancho** en escritorio y **78 %** en celular, con separación de 2 % y 3 %. Las vecinas se asoman a los lados con opacidad 0,32.
- Avanza **por pasos**: cada escena se queda 2,8 s y el cambio dura 0,7 s (3,5 s por paso), con `cubic-bezier(0.7, 0, 0.2, 1)`. Vuelve a empezar sin salto visible (en la maqueta se logra con copias de la última y de las dos primeras escenas; las copias van ocultas a lectores de pantalla).
- Debajo, cinco pestañas con una barra que se llena mientras su escena está al centro.
- **Obligatorio, no está en la maqueta:** un botón visible de pausar y reanudar (WCAG 2.2.2), y pausa al pasar el cursor o al recibir foco. Hazlo de modo que funcione aunque el script no haya cargado.
- No debe mover el contenido de la página ni en la carga ni al avanzar.

### Botones "Ver línea"

Donde antes decía "Ver línea" como texto, ahora es un botón con borde, de 44 px de alto, con el nombre de la línea: "Ver Desarrollo →", "Ver Diseño →", "Ver Video y animación →", "Ver Minecraft →", "Ver Discord →". En inglés, "View Development →" y así. En las tarjetas, toda la tarjeta sigue siendo el enlace.

### Entrada al bajar

Las tarjetas y bloques entran con un desplazamiento corto y un fundido al aparecer en pantalla. Con CSS (`animation-timeline: view()`), como mejora: si el navegador no lo soporta, el contenido se ve igual desde el principio.

## El inicio, sección por sección

Sigue las maquetas. Textos exactos:

1. **Cabecera:** la actual.
2. **Primera pantalla, centrada:** etiqueta "ESTUDIO DE DESARROLLO, DISEÑO Y VIDEO"; H1 "Software, diseño y video. Un solo estudio." (la segunda frase en bronce); párrafo "Un estudio para llevar tu proyecto de la idea a algo que puedas mostrar con orgullo. Escuchamos, proponemos y construimos contigo cada parte."; botones "Cotizar proyecto" y "Ver servicios".
3. **Carrusel** y sus pestañas.
4. **Lo que hacemos:** título "Cinco líneas, un mismo criterio.". Desarrollo y Diseño van como bloques grandes alternados (escena a un lado; al otro, número romano, nombre, frase, fichas de servicios y botón). Video, Minecraft y Discord van como tres tarjetas con su escena arriba. Las frases de cada línea son las que ya usa el sitio.
5. **Cómo trabajamos**, sobre fondo Piedra, en cuatro columnas (una en celular):
   - 01 · Nos cuentas · Escuchamos tu idea y qué quieres lograr.
   - 02 · Cotización · Revisamos los requerimientos y te enviamos una propuesta a la medida.
   - 03 · Producción · Trabajamos con revisiones hasta dejarlo listo.
   - 04 · Entrega · Recibes el proyecto listo para usar y respaldado por 30 días de garantía.
6. **Cierre, centrado:** "Hablemos de tu proyecto."; "Elige el canal de tu preferencia. Analizamos tu solicitud y respondemos con una cotización a la medida."; los tres canales; y el enlace "¿Tienes dudas? Ver preguntas frecuentes →".
7. **Pie:** logo, las cinco líneas como enlaces, Preguntas frecuentes, Privacidad, Términos y © 2026 Kardenum. Sin el aviso de Minecraft (ese aviso va solo en las páginas de Minecraft).

Lo que sale del inicio: las preguntas frecuentes y la lista numerada de líneas que había antes. "Trabajo destacado" sigue oculto hasta que haya portafolio.

## Preguntas frecuentes

Si todavía no existe, crea la página `/preguntas-frecuentes` y `/en/faq`: un grupo general con las siete preguntas aprobadas y un grupo por línea con las preguntas que hoy están en cada página de línea. Lleva metadatos, migas, hreflang y entra al sitemap. Se enlaza desde el pie, el cierre de cada página y cada línea. No entra al menú. Las páginas de línea dejan de mostrar sus preguntas y enlazan a su grupo.

## El resto de las páginas

No hay maqueta nueva para cada una. Aplica el sistema con estas reglas, sin cambiar su contenido:

- **Índice de servicios:** cada línea es una tarjeta con su escena, su frase y su botón.
- **Páginas de línea:** la primera pantalla pasa a dos columnas, texto a la izquierda y la escena de la línea a la derecha (en celular, la escena debajo). El resto de secciones y **todo el texto se conservan**: es lo que trae búsquedas. Los enlaces a subpáginas usan el botón con borde.
- **Subpáginas** (siguen tras su flag): misma primera pantalla, con la escena de su línea.
- **Nosotros, Contacto, portafolio, casos, guías, legales y 404:** solo heredan botones, pie y la entrada al bajar. Sin escenas.

## Orden de trabajo

Una rebanada a la vez. Cada una termina con puerta de clon limpio, push y `verify-deploy` en verde antes de empezar la siguiente.

1. Spec de la fase y plan.
2. Las cinco escenas como componentes, con sus pruebas (sin estilos en línea, proporción fija, textos traducidos).
3. El carrusel, con pausa y movimiento reducido.
4. El inicio completo, en los dos idiomas.
5. Pie nuevo y página de preguntas frecuentes.
6. Índice de servicios y las cinco páginas de línea.
7. Subpágina (plantilla, tras su flag).
8. Revisiones del lote: código, seguridad, navegador, SEO técnico y diseño contra las maquetas. Aplica lo Crítico y lo Alto.

## Cómo decidir sin preguntar

Esta sesión corre sola. No te detengas a preguntar:

- Si algo no está definido, elige la opción más cercana a la maqueta y a estas reglas, y anótala en el informe como decisión tuya.
- Si la maqueta y una regla técnica chocan, gana la regla técnica.
- Si una rebanada no pasa `verify-deploy` después de dos intentos de arreglo, revierte esa rebanada, déjala documentada y sigue con la siguiente que no dependa de ella.
- No enciendas flags, no abras el sitio a buscadores y no cambies variables de Railway.
- Todo lo que no entre queda en `docs/BACKLOG.md` con su razón.

## Informe final

Al terminar, deja un resumen corto con: qué rebanadas quedaron en producción, la evidencia (pruebas, Lighthouse por página, corridas de `verify-deploy`), las decisiones que tomaste por tu cuenta, lo que quedó en el backlog y qué páginas conviene revisar a ojo.
