# Plan del sitio web de Kardenum

Borrador v17 · 15 de noviembre de 2026. Base para las maquetas y el desarrollo. La identidad aprobada está en `identidad-visual.md`, el registro de tono de los textos en `textos-sitio.md`, el plan de SEO en `seo-sitio.md` y lo que falta antes de programar en `checklist-pre-desarrollo.md`. **Prioridad del sitio: que nos encuentren por búsqueda orgánica.**

## 1. Qué tiene que lograr el sitio

Un solo objetivo: que quien llega entienda en segundos qué hace el estudio y pida una cotización. Portafolio, proceso y equipo existen para darle confianza a ese paso.

Hay dos públicos muy distintos:

- **Negocios y personas** (de local a internacional): buscan web, marca o video. Deciden por confianza y por ver trabajo parecido al suyo.
- **Dueños de servidores de Minecraft y de comunidades de Discord**: llegan por recomendación, comparan en Discord y suelen pagar en dólares.

**Decisión de arquitectura: una marca, dos puertas.** El inicio le habla a negocios y presenta Minecraft y Discord como dos líneas más. Cada una tiene su página completa por sí sola, para compartirla directo en Discord sin pasar por el inicio. Así el estudio no se lee como empresa de juegos y el cliente de Minecraft o de Discord no tiene que atravesar un sitio corporativo.

**Tres canales de contacto:** WhatsApp, Discord y correo. Los tres aparecen en el cierre de cada página y en Contacto.

**Discord aparece dos veces y son cosas distintas.** Es una línea de servicio: bots y configuración de servidores para clientes. Y es el segundo canal del estudio: su propio servidor, que presenta todos los servicios, sirve para hacer publicidad dentro de la comunidad y enlaza de vuelta al sitio.

## 2. Arquitectura de servicios

Cinco líneas, organizadas por lo que busca el cliente y no por quién lo hace en el equipo.

| Línea | Qué incluye |
|---|---|
| **Desarrollo** | Sitios web · Tiendas online (e-commerce) · Aplicaciones web · Software a la medida · Mejora y rediseño de sitios que ya existen · Apps móviles (mención secundaria hasta tener una publicada) |
| **Diseño** | Identidad visual y manual básico de marca · Piezas para redes · Presentaciones y propuestas comerciales · Catálogos de productos y servicios · Campañas gráficas (fechas especiales, regalos corporativos, bienestar laboral) · Material para eventos y prospección comercial |
| **Video y animación** | Edición de video · Motion graphics y animación 2D (algo de 3D) en After Effects · Títulos animados, efectos y transiciones · Audio |
| **Minecraft** | Configuración y desarrollo de plugins · Servidores y networks · Dedicados: configuración, seguridad e instalación de software (Pterodactyl, WHMCS, NamelessMC y demás) · Launchers · Tiendas Tebex · Webs para servidores |
| **Discord** | Bots a medida · Configuración de servidores: roles, permisos y canales · Tickets y soporte · Verificación y seguridad · Integraciones con Minecraft y con webs |

Cambios frente a la lista original:

- **Redes sociales no se ofrece.** El estudio no maneja redes: no hay parrillas, calendarios ni informes. Las piezas gráficas para redes siguen dentro de Diseño.
- **Minecraft y Discord son líneas separadas.** Los bots y la configuración de servidores de Discord van en Discord; plugins, servidores, launchers, tiendas y webs van en Minecraft.
- **Marketing no es línea propia.** El material comercial va en Diseño. Presentaciones y catálogos aparecían dos veces; quedan una sola vez.
- **Apps móviles no es titular.** Se menciona dentro de Desarrollo; sube de nivel cuando haya una app publicada que mostrar.

### Modelo comercial (igual para las cinco líneas)

- Todo se cotiza a la medida: el cliente cuenta lo que necesita, el estudio revisa los requerimientos y le envía una cotización. No hay planes, mensualidades ni precios públicos, y el sitio no usa las palabras "plan" ni "mensualidad".
- **Dedicados** es trabajo puntual a pedido: configuración, seguridad e instalación. El estudio no hace administración continua.

## 3. Idiomas y mapa del sitio

**El español es el idioma principal del sitio; el inglés es el segundo** (cambio del 15 de noviembre; antes era al revés). El español vive en la raíz y el inglés bajo `/en`. A quien llega con el navegador en otro idioma, una barra discreta le ofrece la versión en inglés. El contenido se escribe en los dos idiomas, y el inglés se adapta a lo que se busca en inglés en vez de traducirse al pie de la letra.

```
/  (español, principal)       /en  (inglés)
├─ (inicio)                   (home)
├─ servicios                  services        ← índice de las 5 líneas
│  ├─ desarrollo              development     ← subpáginas: tiendas-online, software-a-la-medida
│  ├─ diseno                  design
│  ├─ video                   video
│  ├─ minecraft               minecraft       ← landing propia, alias corto /minecraft; subpáginas: plugins, servidores, tebex
│  └─ discord                 discord         ← landing propia; subpágina: bots
├─ portafolio                 work            ← galería con filtro por línea
│  └─ [caso]                  [case]
├─ guias                      guides          ← artículos que traen búsquedas (SEO)
│  └─ [guia]                  [guide]
├─ nosotros                   about           ← quiénes somos, cómo trabajamos, garantía
├─ contacto                   contact         ← WhatsApp, Discord y correo
└─ legal/privacidad           legal/privacy
   legal/terminos             legal/terms
```

**Menú**

En escritorio, Servicios abre un desplegable con las 5 líneas, su descripción corta y los enlaces a sus subpáginas, más "Ver todos los servicios". En celular, un botón abre el menú a pantalla completa: Servicios desplegado, Portafolio, Nosotros, selector Español / English, botón Cotizar proyecto y los tres canales. El pie de todas las páginas lleva Privacidad y Términos.

| Español | Inglés | A dónde lleva |
|---|---|---|
| Servicios | Services | Desplegable con las 5 líneas |
| Portafolio | Work | Galería de trabajos |
| Nosotros | About | Quiénes somos, cómo trabajamos y garantía |
| ES / EN | ES / EN | Cambio de idioma |
| Cotizar (botón) | Get a quote | Contacto, con los tres canales |

"Estudio" se renombró a **Nosotros** porque el nombre no se entendía.

La dirección corta `/discord` queda reservada para redirigir a la invitación del servidor del estudio; la página del servicio vive en `/servicios/discord`.

**Subpáginas por servicio (aprobado):** los servicios con búsqueda propia tienen su página dentro de la línea, por ejemplo `/servicios/minecraft/plugins` o `/servicios/desarrollo/tiendas-online`. Detalle en `seo-sitio.md`.

**Plantillas a construir (13):** inicio, índice de servicios, página de servicio (sirve para 3 líneas), landing de comunidad (sirve para Minecraft y Discord), subpágina de servicio (6 maquetadas), portafolio, caso, índice de guías, guía, nosotros, contacto, legal (privacidad y términos), 404.

**Estado de las maquetas:** diseño de escritorio completo en la página "Ronda 2" del tablero, en dos filas. Arriba, las páginas principales en el orden del menú: navegación (desplegable y barra de idioma), inicio, índice de servicios, las 5 líneas, portafolio, caso, índice de guías, guía, Nosotros y Contacto. Abajo, las 6 subpáginas (tiendas online, software a la medida, plugins, servidores y networks, Tebex y bots), la ficha SEO, privacidad, términos y la 404. La página "Ronda 3" queda para celular (siguiente fase): hoy tiene el menú móvil, el inicio y la línea Minecraft. Revisado en accesibilidad y desborde a 390 px el 15 de noviembre.

## 4. Qué lleva cada página

### Inicio (maquetado)
1. Hero: descriptor, frase de posicionamiento, párrafo corto y dos botones (Cotizar proyecto · Ver servicios). Sin recuadro de datos.
2. Las 5 líneas, en lista numerada con lo que incluye cada una.
3. Trabajo destacado: 3 o 4 casos. Oculto hasta que haya contenido.
4. Cómo trabajamos en 4 pasos: nos cuentas → cotización a medida → producción con revisiones → entrega con garantía de 30 días.
5. Preguntas frecuentes: las generales, en acordeón.
6. Cierre: "Hablemos de tu proyecto." con WhatsApp, Discord y correo.
7. Pie de página.

Borradores de frase para el hero (a validar):
- "Software, design and video. One studio." / "Software, diseño y video. Un solo estudio."
- "Digital craft, start to finish." / "Oficio digital, de principio a fin."

Descriptor para títulos y SEO: "Kardenum — estudio de desarrollo, diseño y video" / "Kardenum — software, design and video studio".

### Página de servicio (plantilla, maquetada en Desarrollo, Diseño y Video)
1. Qué resolvemos y para quién.
2. Servicios de la línea con entregables concretos.
3. Proceso específico de esa línea.
4. Trabajos de esa línea.
5. Preguntas frecuentes propias de la línea, solo las necesarias. Precios, plazos y pagos no van: se definen en la cotización.
6. Llamado a cotizar con la línea ya preseleccionada.

En las maquetas: hero con la palabra clave, franja de tecnologías o formatos, servicios de la línea (con enlace a su subpágina los que la tienen), qué recibes, proceso, trabajos, guías de la línea y preguntas propias. Desarrollo agrega "¿Cuál necesitas?" con la regla informarse / comprar / operar / ordenar procesos. Cierre con WhatsApp primero.

Entregables confirmados: en Desarrollo el código fuente se entrega siempre; en Diseño se entregan editables en PSD, compatibles con Affinity.

Video y animación lleva en el hero un espacio para el reel del estudio (oculto hasta que exista) y una franja de formatos por plataforma (16:9, 9:16, 1:1, 4:5). Pendiente: si el estudio graba o solo trabaja con material del cliente.

### Minecraft (maquetado)
La plantilla de servicio más tres cosas:
- Plataformas que manejan: Pterodactyl, WHMCS, NamelessMC, Tebex. Plugins para Paper, Spigot, Velocity y BungeeCord.
- Código fuente de los plugins: se entrega si se acuerda en la cotización.
- Alcance explícito: se configura y se entrega; no se administra después de la entrega. Garantía de 30 días sobre el trabajo propio.
- Aviso visible de que no es un servicio oficial de Minecraft (sección 6).

En la maqueta: hero con la palabra clave ("Todo para tu servidor de Minecraft") y botón principal por Discord; franja de plataformas; los seis servicios, con enlace a su subpágina los que la tienen (plugins, servidores, Tebex); alcance (lo que hacemos y lo que no); proceso; trabajos; guías de la línea; preguntas propias; cierre con Discord primero e invitación al servidor del estudio; aviso de Minecraft en el pie.

### Discord (maquetado)
La misma plantilla que Minecraft:
- Servicios: bots a medida, configuración de servidores, tickets, seguridad e integraciones.
- Alcance explícito: qué se entrega y qué queda a cargo del cliente.
- Aviso de que el estudio no está afiliado a Discord.
- Hosting del bot: lo elige el cliente; si no tiene, le recomendamos opciones.

En estas dos páginas se usa el 20 % épico de la marca, y en ambas Discord es el canal de contacto destacado.

### Preguntas frecuentes (aprobadas, en el inicio)
Siete preguntas, en el inicio y antes del cierre, bajo el título "Claridad antes de empezar". Precios, plazos, pagos y portafolio no van aquí: se definen con cada cliente en la cotización.

Tono: sobrio y de empresa. Cada definición dice qué es, para qué sirve y cuándo es la opción indicada. Sin ejemplos cotidianos.

Las cuatro primeras explican cada tipo de proyecto por separado. La regla para diferenciarlos es qué hace la persona: informarse (sitio web), comprar (tienda online), operar con su cuenta (aplicación web) o trabajar por dentro de la empresa (software a la medida).

**1. ¿Qué es un sitio web?**
Es la presencia oficial de tu empresa en internet. Presenta quién eres, qué ofreces y por qué elegirte, y convierte esa primera impresión en un contacto. Es el punto de partida para toda empresa que necesita ser encontrada y tomada en serio.

**2. ¿Qué es una tienda online?**
Es un sitio web preparado para vender. Reúne catálogo, carrito y medios de pago en un mismo lugar, de modo que tu cliente puede comprar en cualquier momento y sin intermediarios. Es la opción indicada cuando el producto se puede elegir y pagar sin asesoría previa.

**3. ¿Qué es una aplicación web?**
Es una plataforma que funciona desde el navegador y a la que cada persona entra con su propia cuenta. No está hecha para informar, sino para operar: reservar, gestionar, consultar o hacer seguimiento. Es la opción indicada cuando tus clientes o tu equipo necesitan hacer algo, y no solo leer.

**4. ¿Qué es un software a la medida?**
Es un sistema construido alrededor de la forma en que opera tu empresa, y no al revés. Ordena procesos internos como inventario, facturación o logística, y reemplaza hojas de cálculo y tareas manuales por una sola herramienta confiable. Es la opción indicada cuando ningún programa del mercado se ajusta a tu operación.

**5. No tengo claro qué necesito. ¿Me pueden ayudar?**
Sí, y es lo habitual. Antes de proponer una solución entendemos el objetivo de tu empresa. A partir de ahí recomendamos el tipo de proyecto que realmente conviene, aunque resulte más sencillo de lo que tenías en mente.

**6. Ya tengo un sitio web. ¿Lo pueden mejorar?**
Sí. Hacemos un diagnóstico de lo que existe y definimos si conviene optimizarlo, reestructurarlo o reconstruirlo. La recomendación y su alcance quedan claros antes de cotizar.

**7. ¿Qué cubre la garantía?**
Todo proyecto tiene 30 días de garantía. En ese periodo corregimos sin costo cualquier falla atribuible a nuestro trabajo. Las fallas de origen externo también se atienden, mediante una cotización nueva.

Para las páginas de Minecraft y Discord: ¿administran el servidor después de entregarlo? No.

### Tono de los textos (decidido)
El sitio queda en tono actual: cercano y directo. Las preguntas frecuentes van en tono formal, y algunas frases formales se adoptaron en el inicio, en Nosotros y en el cierre. El detalle está en `textos-sitio.md`.

### Portafolio (maquetado)
1. Encabezado con la regla a la vista: cada proyecto aparece con permiso del cliente y los privados no se publican.
2. Filtros por línea: Todos, Desarrollo, Diseño, Video, Minecraft, Discord.
3. Galería de tarjetas: imagen 4:3, línea de servicio, año, nombre y una frase.
4. Cierre con los tres canales de contacto.

### Caso de portafolio (maquetado)
1. Ruta de regreso al portafolio, nombre del proyecto y una frase.
2. Datos: líneas involucradas, año y cliente (nombre, "Cliente reservado" o "Proyecto propio").
3. Imagen principal en 16:9.
4. El reto, qué hicimos (lista) y resultado.
5. Piezas: galería en 4:3.
6. Enlace al siguiente proyecto.
7. Cierre con los tres canales de contacto.

### Guía (plantilla maquetada)
Artículo que resuelve una duda que el cliente investiga antes de contratar. Lleva migas de pan, título con la búsqueda, fecha de publicación y de actualización, el contenido con subtítulos claros y, al final, un llamado a cotizar el servicio relacionado. El índice de guías las agrupa por línea. Detalle en `seo-sitio.md`.

En la maqueta (ejemplo con la guía de Tebex): migas de pan, título largo, resumen, autor "Por Kardenum" con fechas y tiempo de lectura; índice "En esta guía"; "Antes de empezar" con lo que se necesita; pasos numerados con captura, bloque de código y nota; bloque oscuro "¿Prefieres que lo dejemos configurado?" hacia el servicio; guías relacionadas; aviso de Minecraft en el pie. El contenido va entre corchetes: se escribe guía por guía.

### Nosotros (maquetado)
1. Encabezado: "Varios oficios. Un solo estudio."
2. La idea: de dónde viene el nombre (*kardía*, "corazón" en griego) y quiénes somos: estudio independiente que trabaja con negocios, creadores y comunidades, en español y en inglés. No se menciona el país.
3. Principios, en tres puntos: una sola dirección, a la medida, alcance claro.
4. Garantía de 30 días: qué cubre y qué no.
5. Cierre con los tres canales de contacto.

No lleva sección de equipo: puede cambiar con el tiempo.

### Contacto (maquetado)
Los tres canales: WhatsApp, Discord y correo. Para WhatsApp, un cotizador de 5 campos (línea → tipo de proyecto → descripción → plazo → nombre) que arma el mensaje y abre el chat con el texto listo. No necesita backend.

En la maqueta: hero "Hablemos de tu proyecto"; tres tarjetas de canal (el correo queda como `[correo@kardenum.com]` hasta definirlo); el cotizador con vista previa del mensaje; la nota "este formulario no guarda tus datos"; y "Qué pasa después" en tres pasos (recibimos, aclaramos, cotizamos). Las opciones del tipo de proyecto cambian según la línea elegida.

## 5. Reglas del portafolio

### Qué se puede mostrar
Condición del estudio en todos los proyectos: puede compartir parte del trabajo con su marca, salvo que el proyecto sea privado. Se define en la cotización y queda escrito en el contrato.

| Nivel | Qué aparece en el sitio |
|---|---|
| **Público** | El trabajo y el nombre del cliente |
| **Reservado** | El trabajo, sin nombre: "Cliente reservado" |
| **Privado** | Nada. No se publica ni se menciona |

En el código, cada caso lleva un campo `visibilidad` con esos tres valores. Los privados nunca se generan.

### Marca de agua y créditos
- **Dentro del sitio no hay marca de agua.** El portafolio ya es del estudio.
- **Sí hay marca de agua** en los avances que se envían antes del pago final y en las piezas publicadas fuera del sitio, como redes y Discord. Va en una esquina, sin estorbar.
- **Crédito discreto en lo entregado**, con opción de quitarlo: "Sitio por Kardenum" en el pie de una web, o el crédito en la descripción de un video.

### Con qué se llena al inicio
- **Caso 0: Kardenum.** Identidad (Diseño), sitio (Desarrollo) y pieza de lanzamiento (Video).
- **Proyectos propios.** Kaelion para la línea de Minecraft; trabajos web ya hechos que se puedan mostrar, por ejemplo el catálogo de Londoño Distribuciones si hay permiso.
- **Trabajo previo de cada integrante**, rotulado como tal.

Nada de clientes ni testimonios inventados. Umbral de lanzamiento: mínimo una pieza por línea; mientras no se cumpla, Portafolio no aparece en el menú y queda construido detrás de un flag.

## 6. Páginas legales

Pendiente de redactar. Antes de publicar debe revisarlas un abogado.

### Política de privacidad
La norma colombiana (Ley 1581 de 2012 y su reglamentación, hoy en el Decreto 1074 de 2015) pide como mínimo:
1. Quién responde por los datos y cómo contactarlo: nombre o razón social, domicilio, dirección, correo y teléfono.
2. Qué se hace con los datos y para qué.
3. Los derechos de la persona.
4. Quién atiende peticiones, consultas y reclamos.
5. El procedimiento para ejercer esos derechos.
6. Desde cuándo rige la política y por cuánto tiempo se conservan los datos.

A tener en cuenta:
- En agosto de 2026 se radicó en la Cámara un proyecto que modifica la Ley 1581. Si se aprueba, hay que revisar la política.
- Si el sitio usa analítica con cookies, necesita aviso de cookies.
- El sitio tiene versión en inglés y apunta también a clientes de otros países: preguntar al abogado qué normas extranjeras aplican.

Fuentes: [Decreto 1074 de 2015](https://normativa.colpensiones.gov.co/colpens/docs/decreto_1074_2015_pr026.htm) · [Proyecto de Ley Estatutaria 282 de 2026 Cámara](https://www.redjurista.com/Compilaciones2018/gacetasCongreso/2026/gc_1217_2026.pdf)

### Términos del sitio
Quién opera la página, que es informativa y todo se cotiza a la medida, de quién son los contenidos y las piezas del portafolio, límites de responsabilidad y ley aplicable.

### Condiciones de servicio
Van en la cotización o contrato que acepta cada cliente, no solo en el sitio: pagos, revisiones, garantía de 30 días, entrega de derechos, confidencialidad y el derecho a mostrar el trabajo según el nivel acordado.

### Qué más entra en lo legal
- **Aviso de cookies**, solo si el sitio usa analítica con cookies.
- **Garantía y cancelaciones:** qué cubre la garantía de 30 días y qué pasa si el cliente cancela a mitad del trabajo. Puede ir dentro de las condiciones de servicio.
- **Aviso de Minecraft.** Las reglas de uso de la marca piden mostrar de forma visible un aviso parecido a: "NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT". Va en la página de Minecraft y en el pie del sitio. [Fuente](https://conductatlas.com/platform/minecraft/minecraft-usage-guidelines/provision/CA-P-025271/mandatory-not-official-disclaimer-requirement/)
- **Aviso de Discord:** una línea que diga que el estudio no está afiliado a Discord. Es buena práctica; confirmar con el abogado.
- **Identificación del responsable** en el pie del sitio.

### Datos que faltan para redactarlas
- A nombre de quién va el estudio: persona o empresa.
- Ciudad, correo y teléfono de contacto.
- Si el sitio va a usar analítica y cuál.

## 7. Identidad visual

Aprobada. El detalle completo, con el código del logo, está en `identidad-visual.md`.

- **Dirección:** B · Gremio. Blanco y negro con un solo acento.
- **Logo:** L5 · Corchete. Paquete `kardenum-logo-final.zip` con SVG por piezas, PNG y PDF.
- **Acento:** Bronce `#B8923A`. Se probó el cobre y se descartó.
- **Paleta base:** Tinta `#111110`, Piedra `#F4F4F1`, Niebla `#D9D8D2`, Grafito `#55544F`.
- **Tipografía:** Archivo (expandida y en mayúsculas para títulos, normal para texto) y JetBrains Mono para etiquetas.

**Tablero:** https://claude.ai/artifact/5S5zbu5FhFbWkgko6ZeK6c. "Ronda 2" tiene los logos explorados y todo el sitio en escritorio; "Ronda 3", el celular (siguiente fase).

## 8. Stack y decisiones técnicas

Criterios: rendimiento, estabilidad, accesibilidad en PC y móvil, y SEO.

- **Next.js 16** (App Router) y TypeScript, con pnpm. Todas las páginas se generan en el build. Se arranca en la última versión de parche de la rama 16.
- **Tailwind CSS v4**, con la paleta, la tipografía y el bronce como variables en `@theme`.
- **Idiomas con next-intl v4:** español por defecto en la raíz, inglés bajo `/en`, slugs traducidos y hreflang con `x-default` apuntando al inglés. En Next.js 16 el middleware se llama `proxy.ts`.
- **Sin redirección automática por idioma** (lo recomienda Google): una barra discreta ofrece la versión en inglés a quien llega con el navegador en otro idioma, y la española a quien entra a `/en` con el navegador en español. Recuerda la elección.
- **Fuentes con `next/font`**, Archivo y JetBrains Mono alojadas en el propio sitio. **Imágenes con `next/image`** (AVIF/WebP).
- **Hosting en Railway**, con Cloudflare delante para DNS y caché. Un solo dominio, `kardenum.com`, con `www` redirigido.
- **Despliegue directo a producción** (decisión del 15 de noviembre): no hay desarrollo local. Cada push a `main` de `Kattonavi/Kardenum` despliega el servicio `web` en Railway. El build es la prueba: si falla, sigue en línea el despliegue anterior. Hasta el lanzamiento nada se indexa: la variable `SITE_INDEXABLE=false` hace que `robots.txt` bloquee todo y que todas las respuestas lleven `X-Robots-Tag: noindex`. Después del lanzamiento se crea un entorno `staging`.
- **Infraestructura (desde cero, 15 de noviembre):**
  - **Railway:** proyecto `kardenum` con el servicio `web`, configurado con raíz `/web`, healthcheck `/`, `SITE_INDEXABLE=false` y la URL https://web-production-f1d7c246.up.railway.app. No hay `api` ni base de datos en v1.
  - **GitHub:** el repo `Kattonavi/Kardenum` (monorepo, app en `/web`) se crea desde Claude Code y luego se conecta al servicio.
  - **El repo y el proyecto anteriores se borraron.**
- **Analítica con Umami** en Railway, sin cookies (evita el banner de cookies).
- **Accesibilidad:** HTML semántico, menú y desplegable con teclado completo, foco visible, objetivos táctiles de 44 px, contraste revisado (bronce sobre tinta 6,5:1, sirve para texto; bronce sobre piedra 2,6:1, solo para líneas y detalles, nunca para texto; si hace falta texto en el acento sobre fondo claro se usa el bronce oscuro `#7A5C14`, 5,7:1) y `prefers-reduced-motion`. Pruebas con `eslint-plugin-jsx-a11y` y axe + Playwright en móvil y escritorio.
- **Calidad en cada deploy:** Lighthouse CI con mínimo 95 en las cuatro categorías.
- **Sin backend, sin base de datos y sin CMS en v1.** Servicios y casos viven en el repo como archivos tipados (MDX o TS). Agregar un caso es agregar un archivo.
- Cada caso del portafolio lleva `visibilidad: publico | reservado | privado`.
- Cotizador en el cliente que compone el mensaje de WhatsApp. El formulario con backend (Spring Boot) queda para v2, cuando haya volumen que justifique guardar cotizaciones.
- **Nombre y datos de marca en un solo archivo** (`site.config.ts`): nombre, descriptor, dominio, redes, WhatsApp, Discord y correo.
- El logo se usa como SVG en línea, con el código de `identidad-visual.md`.
- **SEO:** todo lo técnico está en `seo-sitio.md`: metadatos por página e idioma, sitemap con alternativas, robots, canonical, imágenes OG, JSON-LD y Core Web Vitals.
- Dependencias mínimas: next-intl y MDX. Sin librería de componentes ni de animaciones: animación con CSS salvo que una sección pida más.

## 9. Decisiones

### Tomadas
- Todo se cotiza a la medida. Sin planes ni mensualidades.
- Cinco líneas: Desarrollo, Diseño, Video y animación, Minecraft y Discord. No se ofrece manejo de redes sociales.
- Dedicados: trabajo puntual a pedido, sin administración continua.
- Tres canales de contacto: WhatsApp, Discord y correo.
- El servidor de Discord del estudio presenta todos los servicios. Minecraft también va completo en el sitio.
- Español como idioma principal del sitio; inglés como segundo (cambio del 15 de noviembre).
- Identidad: dirección B, logo L5 y acento bronce.
- Menú: Servicios · Portafolio · Nosotros · ES / EN · Cotizar.
- Nombre: Kardenum, confirmado el 15 de noviembre.
- El hero no lleva recuadro de datos.
- Portafolio con tres niveles de visibilidad y sin marca de agua dentro del sitio.
- Las condiciones de servicio van en la cotización o contrato.
- Preguntas frecuentes: siete en el inicio, con una por cada tipo de proyecto, en tono formal. Sin precios, plazos, pagos ni portafolio.
- Nosotros no muestra al equipo.
- Tono de los textos: el actual, con las frases formales elegidas (ver `textos-sitio.md`).
- Garantía: 30 días sobre errores del trabajo propio; lo externo se arregla con cotización nueva.
- SEO: subpáginas por servicio con búsqueda propia. Sin perfil de empresa en Google por ahora.
- Guías: plantilla lista para el lanzamiento y primeras 2 o 3 publicadas en el primer mes (ver `seo-sitio.md`).

### Pendientes
1. **Dominio.** Comprar kardenum.com (el nombre ya quedó confirmado).
2. **Datos para las páginas legales** (sección 6).
3. **Correo de contacto:** qué dirección se va a usar.
4. **SEO:** validar palabras clave y decidir si las guías entran al menú principal (ver `seo-sitio.md`, sección 7).
5. **GitHub:** crear el repo `Kattonavi/Kardenum` y conectarlo al servicio `web` de Railway.

## 10. Orden de trabajo

1. Diseño terminado. Lo que falta antes y durante el código está en `checklist-pre-desarrollo.md`.
2. Validar palabras clave con el Planificador de Google y escribir los textos por línea: descripción, entregables y preguntas frecuentes, en español y en inglés.
3. Páginas legales, con los datos de la sección 6 y revisión de un abogado.
4. Desarrollo: scaffold con idiomas, SEO técnico y modelo de contenido → plantillas → cotizador → revisión con Lighthouse y axe.
5. Lanzamiento: la lista de `seo-sitio.md` (dominio, Search Console, Bing, analítica, pruebas en móvil y de rendimiento).

**Primer mes después del lanzamiento:** las primeras 2 o 3 guías (Tebex, bots de Discord y sitio web vs aplicación vs software).

**Para v2:** formulario por servicio con backend, casos con métricas y testimonios reales.
