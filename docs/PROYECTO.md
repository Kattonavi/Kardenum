# Kardenum — sitio web

> Adoptado con /nuevo-proyecto el 2026-11-15. Fuente de verdad: `docs/handoff/BRIEF.md` y `docs/handoff/docs/`.
> Lo marcado **(pendiente)** está por confirmar con el fundador.

## Resumen
- **Cliente / negocio:** Kardenum, estudio propio (desarrollo, diseño, video, Minecraft, Discord). Todo a la medida.
- **Qué hace y para quién:** que quien llega entienda en segundos qué hace el estudio y pida cotización. Dos públicos:
  negocios (web, marca, video) y dueños de servidores de Minecraft y comunidades de Discord.
- **Idioma:** español en la raíz, inglés en `/en`. No se menciona el país.
- **Objetivo medible:** clics en WhatsApp, Discord y correo (eventos de Umami) y posiciones orgánicas en Search Console.
- **Dominio:** web · **Nivel:** N2 (sitio público con SEO, sin backend) · **Talla:** M · **Riesgo:** normal (sin
  datos guardados: el cotizador arma un mensaje de WhatsApp en el cliente).

## Apetito y circuit breaker
Decidido por Sara (el brief no lo fija); se cambia si el fundador dice otra cosa.

| Rebanada | Paso del brief | Apetito |
|---|---|---|
| 0 · Base desplegada | 1: Next 16, guardia `SITE_INDEXABLE`, marca en Tailwind, next-intl, fuentes, layout | 4 h |
| 1 · Componentes y páginas con contenido | 2 y 3 | 2 días |
| 2 · SEO técnico | 4 | 0,5 día |
| 3 · Detrás de flags y legales | 5 y 6 | 1 día |
| 4 · Pruebas en GitHub Actions | 7 | 0,5 día |

**Total ≈ 4,5 días.** Al 50 % de una rebanada sin terminarla → parar y recortar. Al 100 % → publicar lo que hay o
re-negociar. El lanzamiento (paso 8) depende de datos del fundador, no del código.

## Alcance
| Must (v1) | Should | Later |
|---|---|---|
| Inicio, servicios, 5 líneas, Nosotros, Contacto con cotizador de WhatsApp, 404 | Subpáginas (6), portafolio, casos y guías detrás de flags | Formulario con backend (Spring Boot) |
| es/en con rutas traducidas, barra de idioma sin redirección | Diseño móvil fino de la Ronda 3 | Casos con métricas y testimonios reales |
| SEO técnico completo (metadatos, hreflang, sitemap, JSON-LD, OG) | Umami con eventos de contacto | Entorno `staging` (después del lanzamiento) |
| Guardia de indexación y legales con datos de reemplazo | axe + Lighthouse en CI | |

- **No-goals:** backend, base de datos o CMS en v1 · redirección automática por idioma · precios, planes, testimonios o
  sección de equipo.
- **Rebanada 0:** `/` responde 200 en español en Railway con el guardia activo, y la base (marca, idiomas, fuentes,
  layout) lista para montar componentes.
- **Riesgos top 3:**
  1. ~~next-intl con Cache Components~~ Resuelto el 2026-11-15: todo sale `○`/`●`. Para que el 404 llegue con HTML
     completo, las rutas desconocidas no coinciden con nada (`dynamicParams = false`, sin catch-all) y responde
     `global-not-found.tsx` (experimental). Cache Components queda apagado porque no admite `dynamicParams`.
  2. Push directo a `main` sin CI (decisión del fundador, 2026-11-15: así hasta el lanzamiento; después, `main`
     protegida, CI y `staging`). Mitigación: antes de cada push, clon limpio con build, humo y e2e; después, humo y
     e2e contra la URL de Railway.
  3. Datos pendientes (correo, WhatsApp, Discord, legales) frenan el lanzamiento: van en `site.config.ts` como
     reemplazos, nunca inventados.
- **Contenido:** textos en las maquetas (`docs/handoff/maquetas/`); inglés por escribir · **Marca:** completa en
  `docs/handoff/marca/`.

## Avance
| Rebanada | Hecho | Falta | Horas usadas / apetito |
|---|---|---|---|
| 0 | Paso 1 completo en `main` (6ea6a3e → 8a64095): Next 16.4.6, guardia `SITE_INDEXABLE`, standalone para Railway, marca en `@theme`, Archivo + JetBrains Mono, next-intl (es raíz, en `/en`), 404 global, esqueleto `header`/`main`/`footer`, jsx-a11y completo. Prueba de humo de 28 comprobaciones en verde desde un clon limpio, arrancando con `pnpm start` | — (repo conectado a Railway; primer despliegue verificado con Node 22.23.4 y pnpm 12.5.1) | ~1 h / 4 h |
| 1 y 2 (parcial) | En producción (6472f58 → 7ec00ec): `site.config.ts`, registro único de rutas con slugs traducidos, modelo de contenido tipado, SEO técnico (metadatos, canonical, hreflang, sitemap con guardia, imágenes OG, JSON-LD, manifest), layout global (desplegable, menú móvil, barra de idioma, pie) e inicio. 43 pruebas unitarias en el build, 68 de humo y 61 e2e (axe sin violaciones) contra Railway. Lighthouse celular en Railway: 99 / 100 / 100 (SEO 100 con el guardia abierto, medido en local) | Páginas de servicios, las 5 líneas, Nosotros, Contacto con cotizador y 404 diseñada (paso 3 del brief): hoy sus enlaces dan el 404 de marca. Revisiones del lote (ui-qa, finish-reviewer, code-reviewer) sin correr | ~1,2 h / 2,5 días |
| 2 (paso 3 del brief) | En producción (c48dfb7 → e3937f0): índice de Servicios, las cinco líneas desde una sola plantilla con contenido tipado, Nosotros, Contacto con el cotizador de WhatsApp (spec 002) y 404 diseñada. Menú con estado activo, migas con `BreadcrumbList`, `Service` por línea, aviso de Discord en sus páginas, `/minecraft` (308), enlaces de idioma directos. 65 pruebas unitarias en el build, 412 de humo y 264 e2e contra Railway (axe sin violaciones en las 18 URL públicas y el 404). **Revisiones del lote hechas** (`docs/revisiones/`): código APROBADO tras corregir un Alto (el formulario se podía enviar de forma nativa antes de cargar el script) y re-verificar el delta; navegador con un Alto corregido (palabra larga desbordaba la página); diseño sin contradicciones con las maquetas. Evidencia y matriz de completitud en `evidencia-paso3.txt` | Subpáginas, portafolio, casos y guías (pasos 5 y 6, detrás de flags); legales (los enlaces del pie llevan al 404, backlog 9); inglés definitivo; datos de contacto; Medios abiertos en backlog 9 y 22 | ~1,8 h / 2,5 días |
| 3 (paso 4 del brief) | En producción (f4c6812 → 44a4e8c): texto al 200 % sin pérdida (WCAG 1.4.4), Privacidad y Términos con datos entre corchetes y freno de lanzamiento que recorre toda la configuración (spec 003), cabeceras de seguridad y CSP estática, `/discord` (307), cabecera que funciona antes de su script, Umami listo por variables, `favicon.ico`. 91 pruebas unitarias en el build, 510 de humo y 381 e2e contra Railway; Lighthouse 100 en las cuatro categorías (build abierto en local). **Revisiones del lote hechas** (`docs/revisiones/paso4-*.md`): código con un Alto corregido (menú inerte con barra de desplazamiento clásica entre 1024 y 1039 px), seguridad sin bloqueantes, navegador y SEO técnico sin Crítico ni Alto. Evidencia en `evidencia-paso4.txt` | Subpáginas, portafolio, casos y guías (paso 5, detrás de flags); CI (paso 7); datos de contacto y texto legal; backlog 31 a 36 | ~3 h / 2,5 días |
| 4a (paso 5 del brief: subpáginas) | En producción (be82e7f → 4754318): las seis subpáginas de servicio desde una plantilla con contenido tipado (spec 004), construidas y ocultas tras `features.serviceSubpages` (200 con `noindex`, fuera del sitemap, sin enlaces desde páginas públicas). Las pruebas de humo y de accesibilidad recorren ahora todas las páginas construidas. 93 unitarias, 796 de humo y 603 e2e contra Railway; las tres ramas del flag corridas en un clon de descarte (`evidencia-paso5.txt`) | Portafolio y casos (spec 005) y guías (spec 006), en construcción; validar títulos de las subpáginas (backlog 38); revisiones del lote del paso 5 | ~1,5 h |
| 4b (paso 5: portafolio y casos) | En producción (4811074 → 1909978): índice del portafolio con filtro sin JavaScript y página de caso (spec 005), como colección con slug por idioma; casos Kardenum y Kaelion con lo que traen las maquetas y lo demás entre corchetes; construido y oculto tras `features.portfolio`. Encender el flag sin una pieza por línea rompe el build. 105 unitarias, 898 de humo y 715 e2e en clon limpio; ramas del flag con casos de prueba (reservado, nombrado y privado) en `evidencia-paso5.txt` | Guías (spec 006); contenido real de los casos (resultado y captura de Kardenum; todo Kaelion; piezas de Video y Discord); revisiones del lote del paso 5 | ~2 h (incluye al agente) |
| 4c (paso 5: guías) | En producción (c5dd6bf → 3b758fa): índice de guías y plantilla de guía en MDX (spec 006), como segunda colección con slug por idioma; componentes de guía (secciones numeradas, qué necesitas, captura, código, nota y tabla con desplazamiento propio); `Article` y `BreadcrumbList`; construido y oculto tras `features.guides`. Cero guías: publicar una es agregar su carpeta. 112 unitarias, 984 de humo y 747 e2e en clon limpio; plantilla y ramas del flag verificadas con dos guías de prueba que no están en el repo (`evidencia-paso5.txt`) | Escribir las primeras guías (primer mes tras el lanzamiento); revisiones del lote del paso 5 | ~1,5 h (incluye al agente) |
| 4 (cierre del paso 5) | **Revisiones del lote hechas** (`docs/revisiones/paso5-*.md`, una ronda sobre 3b758fa y re-verificación del delta posterior): código APROBADO; seguridad sin bloqueantes, con su Medio corregido (términos confidenciales en la prueba de humo); navegador, SEO técnico y diseño sin Crítico ni Alto. Además, por pedido del fundador: migas de los casos corregidas, `CreativeWork` en los casos y las imágenes por el optimizador de Next (AVIF y WebP, `srcset`, precarga de la imagen principal) con la CSP estricta. Clon limpio del último commit: 116 unitarias, 988 de humo y 747 e2e; producción: humo 988/988 (la última suite completa de navegador contra producción fue en 3b758fa: 747). Lighthouse móvil de las plantillas nuevas con contenido de prueba: 99 a 100; la de caso con imagen principal, 95 (backlog 48) | Antes de encender cada flag: backlog 38 (subpáginas), 41 y 45 (portafolio y guías), 46 (filtro vacío), 48 (Lighthouse con imagen); contenido real de casos y guías | ~2 h |

## Stack
| Capa | Elección | Por qué / desviación |
|---|---|---|
| Frontend | Next.js 16.4.6 (App Router, Turbopack; Cache Components apagado), TS strict, Tailwind 4.3, next-intl 4.14.9 | Brief |
| Pruebas | `node --test` (unitarias, dentro del build), Playwright + axe (e2e), prueba de humo propia | Desviación: sin Vitest mientras toda versión de Vite con más de 30 días tenga el aviso crítico de RCE del 2026-11-10 |
| UI | Sin shadcn ni librería de componentes o animaciones | Desviación del default: el brief pide dependencias mínimas |
| Backend / BD / Auth / Pagos | Ninguno en v1 | Brief |
| Otros | `next/font` (Archivo, JetBrains Mono), imágenes por el optimizador de Next (`getImageProps`: AVIF y WebP, `srcset` por anchos) con un `<img>` propio que descarta el estilo en línea que la CSP bloquea, `next/og`, MDX (`@next/mdx` 16.4.2 + `remark-gfm` 4.0.1) para las guías, Umami sin cookies | Brief |

## Infra y entrega
- **Railway:** proyecto `kardenum`, entorno `production`, servicio `web` (raíz `/web`, healthcheck `/`, Railpack).
  `pnpm start` → `scripts/start.mjs` → `.next/standalone/server.js` en `0.0.0.0:$PORT`.
- **GitHub:** `Kattonavi/Kardenum` (privado). Cada push a `main` que toque `web/**` despliega.
- **Dominio:** `kardenum.com` **(pendiente de compra)**, con Cloudflare delante.

## SEO
Detalle en `docs/handoff/docs/seo-sitio.md`. Nichos primero (Minecraft y Discord en inglés). Sin perfil de empresa en Google.

## Decisiones tomadas por defecto
- El paquete del handoff vive en `docs/handoff/` (lo sugería su `LEEME.md`).
- **Dominio por variable (decisión del fundador, 2026-11-15):** canonical, hreflang, `og:image`, sitemap y JSON-LD
  usan `SITE_URL`; sin definir vale `https://kardenum.com`. En Railway se pone la URL de Railway hasta comprar el
  dominio. Con `SITE_INDEXABLE=true`, el build falla si `SITE_URL` no es `https://kardenum.com`.
- **Raíz sin barra final:** `https://kardenum.com`, como la escribe Next, en canonical, hreflang, sitemap y JSON-LD.
- **Pie con el aviso de Minecraft en todo el sitio** (plan-sitio-web.md §6 y pedido del fundador); el de Discord se
  suma en sus páginas.
- **Canales de contacto pendientes:** se muestran sin enlace y con la nota `[Canales por activar]`. Un build con
  `SITE_INDEXABLE=true` falla mientras falte alguno (`src/lib/launch.ts`).
- **Páginas legales con lo pendiente entre corchetes (decisión del fundador, 2026-11-15):** Privacidad y Términos
  llevan la estructura y los títulos de sus maquetas; responsable, fechas y texto de cada sección están en
  `site.config.ts` como pendientes. El freno de lanzamiento recorre toda la configuración: con un solo valor pendiente
  (contacto o legal), el build indexable falla y los nombra. Spec: `docs/specs/003-paginas-legales.md`.
- **Barra de idioma:** cookie propia `kardenum_lang`, decidida antes del primer pintado
  (`docs/specs/001-barra-de-idioma.md`).
- **Fuentes de respaldo medidas** (Arial y Roboto ajustadas a Archivo) para que el cambio de fuente no mueva la página.
- **Inglés provisional:** traducción fiel de los textos aprobados; se reescribe con las palabras clave validadas.
- **Diseño:** se implementan las maquetas tal cual. Las etiquetas pequeñas sobre los títulos se quedan como en las
  maquetas (decisión del fundador, 2026-11-15), aunque Impeccable las prohíba.
- **El freno de lanzamiento se queda** (decisión del fundador): `SITE_LAUNCH_CHECK=off` solo en local.
- **Una URL por página:** `/es` y los slugs del otro idioma redirigen con 308 (permanente).
- Node 22 (`engines.node: 22.x`), igual al de la máquina donde se verifica el build.
- La guardia se lee en el build (fail-closed: solo `"true"` abre). Al lanzar, comprobar `/robots.txt` tras el cambio.
- Favicon y `apple-icon` desde el paquete del logo (`kardenum-favicon.svg`, `-180.png`).
- next-intl fijado en 4.14.9 (la 4.15 tiene menos de 30 días); `localeDetection`, `localeCookie` y `alternateLinks`
  apagados: `/` siempre en español, sin cookies, y hreflang desde los metadatos (x-default → inglés) en el paso 4.
- El 404 es uno solo y bilingüe (español primero, línea en inglés hacia `/en`): `global-not-found` no recibe el
  idioma. Se aparta de la maqueta B-404, que solo existe en español. Su cabecera y su pie son estáticos (enlaces
  simples a páginas que existen): el menú compartido depende del contexto de next-intl y, con él, Next entrega su
  página de error vacía.
- **WhatsApp lleva al cotizador** (plan §4: "llamado a cotizar con la línea ya preseleccionada"): el botón de
  WhatsApp del cierre de cada página y del menú móvil abre `/contacto#cotizador`, con la línea de la página elegida.
  Discord y correo siguen inertes hasta tener el dato.
- **Cotizador con valores neutros:** arranca en "Todavía no lo tengo claro" y "Sin fecha definida" (la maqueta
  muestra "Tienda online" y "En uno a tres meses" como ejemplo), para que el mensaje no afirme lo que la persona no
  eligió. Especificación en `docs/specs/002-cotizador-whatsapp.md`.
- **Enlaces de idioma directos:** ES / EN y la barra de idioma enlazan a la dirección final de la misma página en el
  otro idioma (`pathInLocale`), no a `/es/…` ni al inicio.
- **Texto al 200 % (WCAG 1.4.4, decisión del fundador del 2026-11-15):** toda la tipografía va en rem (prueba unitaria
  `type-scale.test.ts`); la cabecera pasa a su forma compacta por *container query* sobre su ancho en rem, no por el
  ancho de la ventana (una *media query* no ve el tamaño de fuente de la raíz); y cuando la página mide menos de
  18rem, una palabra que no cabe en su columna se parte en vez de ensanchar la página. A tamaño normal no cambia nada.
- **Cabeceras de seguridad estáticas (paso 4):** se fijan una vez en `next.config.ts` y van en todas las respuestas.
  La CSP solo deja cargar desde el propio sitio; la única concesión es `'unsafe-inline'` en `script-src`, porque Next
  escribe los datos de cada página en scripts en línea y el nonce exigiría render dinámico (Constitución, regla 4).
  Medido en laboratorio: con `script-src 'self'` ninguna página hidrata, con o sin `experimental.sri`. Los estilos
  sí van estrictos. HSTS sin `includeSubDomains` ni `preload` hasta el lanzamiento (backlog 29).
- **Cabecera que funciona antes de su script (decisión del fundador, 2026-11-15):** "Servicios" llega del servidor
  como enlace a `/servicios` y el control del menú como enlace a una navegación del pie (Servicios, Nosotros,
  Contacto), que solo se muestra cuando se llega por ese enlace; el script los convierte en desplegable y menú. Las
  cinco líneas del pie son enlaces (en celular el pie mide 56 px más: cada una tiene 44 px de área táctil).
- **Umami por variables:** con `UMAMI_SRC` y `UMAMI_WEBSITE_ID` se carga el script y la CSP admite ese origen en
  `script-src` y `connect-src`; con una sola o ninguna, no se carga nada. Aún no se construyen eventos.
- **Cotizador con enlace a la política y sin casilla de autorización** (excepción al estándar del Workspace, a
  confirmar con el abogado): el formulario no guarda ni envía datos al sitio.
- **HSTS sin `includeSubDomains` ni `preload`**, y **`/discord` con 307**: decididos por el fundador.
- **Umami en instancia propia en Railway** (decisión del fundador, 2026-11-15), al comprar el dominio. No Umami Cloud.
- **Los enlaces de las líneas en el pie y las migas en Nosotros se quedan** (confirmado por el fundador, 2026-11-15).
- **Guías: sin resaltado de sintaxis y con tablas** (`remark-gfm`, solo compilación), con su propio desplazamiento
  horizontal y el estilo de la identidad (spec 006).
- **Decisiones del cierre del paso 5 (fundador, 2026-11-15):** los filtros solo ofrecen las líneas con entradas; con
  el sitio abierto, un flag apagado no genera sus páginas (404) y con el sitio cerrado siguen respondiendo; el
  optimizador solo genera los anchos que usan las plantillas; el original de una imagen puede medir hasta 2400 px
  y 800 KB; la regla de Lighthouse con imagen principal (backlog 48) se queda; los títulos de las subpáginas
  esperan la validación de palabras clave.
- **Paso 6 (legales):** comparadas contra `B-Legal-privacidad` y `B-Legal-terminos` el 2026-11-15: no falta nada.
- **`SITE_LAUNCH_CHECK=off` solo en local:** en Railway o en CI ese interruptor hace fallar el build.
- **Nosotros con migas** (cambio del 2026-11-15): la maqueta no las trae, pero el plan de SEO las pide en toda página
  interna y está por encima de las maquetas en el orden de fuentes. La prueba de humo las exige, con su `BreadcrumbList`.
- Los textos en inglés del sitio son provisionales hasta escribir el inglés con las palabras clave validadas.

## Pendientes
Ver `docs/handoff/docs/checklist-pre-desarrollo.md`, sección 2 (correo, WhatsApp, Discord, datos legales, frase del
hero, perfiles oficiales, video).
