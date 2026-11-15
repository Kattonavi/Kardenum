# Checklist — SitioWebKardenum · nivel N2

Generado con `scripts/generar-checklist.py` desde `estandares/` (87 ítems aplicables; 17 en No aplica). Un ítem sin evidencia = no cumplido.
Lo que no aplique a la superficie real del proyecto se saca a **No aplica** con su motivo, en una línea.

## seguridad
- [ ] HTTPS forzado (Railway lo da) + **HSTS** `max-age=63072000; includeSubDomains; preload` (V12). · **resp:** security-engineer · **evidencia:** pendiente
- [ ] Cabeceras (V3): `Content-Security-Policy` (con nonce si hay scripts inline), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` mínima, `frame-ancestors 'none'` (en CSP). · **resp:** security-engineer · **evidencia:** pendiente
- [ ] Sin secretos en el repo ni en el bundle del cliente (ASVS 13.3.1). Solo `NEXT_PUBLIC_*` para lo público. `.env.example` al día. · **resp:** security-engineer · **evidencia:** pendiente
- [ ] **`gitleaks` o push protection de GitHub activo** en el repo; evidencia: salida del escaneo. `.git` no accesible desde la web (ASVS 13.4.1). · **resp:** security-engineer · **evidencia:** pendiente
- [ ] Dependencias: `pnpm audit` sin altas/críticas; lockfile versionado; Renovate o Dependabot activo; solo versiones dentro de ventana de actualización (ASVS 15.2.1). · **resp:** security-engineer · **evidencia:** pendiente
- [ ] Toda dependencia **nueva** se verifica antes de instalar: existe en el registro, antigüedad (> 30 días), descargas, repo y autor esperados (los agentes inventan nombres de paquetes: 4–6 %; "slopsquatting"). Hook `scripts/hooks/dependencia-nueva.cjs` (avisa en `pnpm add`/`npm i`). · **resp:** security-engineer · **evidencia:** pendiente
- [ ] Sin `dangerouslySetInnerHTML` con datos no sanitizados (V1). Enlaces externos `rel="noopener noreferrer"`. · **resp:** security-engineer · **evidencia:** pendiente
- [ ] Páginas de error que no filtran stack traces ni versiones (V16); sin modo debug en producción (ASVS 13.4.2). · **resp:** security-engineer · **evidencia:** pendiente
- [ ] `security.txt` en `/.well-known/security.txt`. · **resp:** security-engineer · **evidencia:** pendiente
- [ ] Next.js y React en la última versión parcheada; suscripción a los avisos de seguridad (programa mensual desde 07-2026). Dependabot/Renovate con actualizaciones de seguridad automáticas. · **resp:** security-engineer · **evidencia:** pendiente
- [ ] Plazos de remediación definidos: crítica ≤7 d, alta ≤30 d, media ≤90 d (ASVS 15.1.1). · **resp:** security-engineer · **evidencia:** pendiente

## seo
- [x] `<title>` único (≤60 car.) y `meta description` (≤155) por página — Metadata API de Next. · **resp:** skill seo · **evidencia:** `pnpm smoke` (412/412 en producción, `docs/revisiones/evidencia-paso3.txt`): título y descripción propios y únicos en las 18 URL; longitudes en `content.test.ts`
- [x] Un solo `<h1>` por página; jerarquía de encabezados lógica; HTML semántico. · **resp:** skill seo · **evidencia:** `pnpm smoke` (412/412 en producción, `docs/revisiones/evidencia-paso3.txt`) y `pnpm test:e2e` (264 en producción, `evidencia-paso3.txt`) (`accessibility.spec.ts`: un h1 y esquema sin saltos en las 18 URL y el 404)
- [x] `lang` correcto en `<html>` (`es-CO` si el público es Colombia). · **resp:** skill seo · **evidencia:** `pnpm smoke` (412/412 en producción, `docs/revisiones/evidencia-paso3.txt`): `es` y `en` (sin región: el sitio no menciona el país)
- [x] URL canónica (`alternates.canonical`) en cada página. Sin contenido duplicado con/sin barra final. · **resp:** skill seo · **evidencia:** `pnpm smoke` (412/412 en producción, `docs/revisiones/evidencia-paso3.txt`): un canonical por página, apuntando a sí misma; `/es` y los slugs del otro idioma redirigen con 308
- [x] `robots.txt` y `sitemap.xml` generados por Next (`app/robots.ts`, `app/sitemap.ts`). · **resp:** skill seo · **evidencia:** `pnpm smoke` (412/412 en producción, `docs/revisiones/evidencia-paso3.txt`): cerrado, `Disallow: /` y sitemap 404; abierto, sitemap con alternativas (build local con el guardia abierto)
- [x] Open Graph + Twitter Card con imagen 1200×630 (`opengraph-image`). · **resp:** skill seo · **evidencia:** `pnpm smoke` (412/412 en producción, `docs/revisiones/evidencia-paso3.txt`): `og:image` propia por página e idioma, 200 `image/png`
- [x] Favicon, `apple-icon`, `manifest`. · **resp:** skill seo · **evidencia:** `pnpm smoke` (412/412 en producción, `docs/revisiones/evidencia-paso3.txt`): manifest y `theme-color`; `icon.svg` y `apple-icon.png` en el build
- [ ] Imágenes con `next/image`, `alt` descriptivo, AVIF/WebP, dimensiones fijas (sin CLS). · **resp:** skill seo · **evidencia:** pendiente
- [x] Schema JSON-LD: `Organization` + `WebSite` (el hook valida el JSON-LD al editar). · **resp:** skill seo · **evidencia:** `pnpm smoke` (412/412 en producción, `docs/revisiones/evidencia-paso3.txt`): un documento válido en el inicio, sin datos entre corchetes
- [x] Contenido indexable en el HTML del servidor (no depender de JS del cliente para el texto principal). · **resp:** skill seo · **evidencia:** `pnpm smoke` (412/412 en producción, `docs/revisiones/evidencia-paso3.txt`): líneas, preguntas, migas, avisos y el cotizador se leen en el HTML sin scripts
- [ ] Core Web Vitals en verde (ver rendimiento.md). · **resp:** skill seo · **evidencia:** pendiente
- [x] Página 404 útil (con navegación), sin soft-404. · **resp:** skill seo · **evidencia:** `pnpm smoke` (412/412 en producción, `docs/revisiones/evidencia-paso3.txt`): estado 404 real, cabecera, pie y enlaces solo a páginas que existen
- [ ] Alta en **Google Search Console** + **Bing Webmaster**, sitemap enviado. · **resp:** skill seo · **evidencia:** pendiente
- [x] `BreadcrumbList` en páginas internas; enlazado interno lógico. · **resp:** skill seo · **evidencia:** `pnpm smoke` (412/412 en producción, `docs/revisiones/evidencia-paso3.txt`): migas visibles y `BreadcrumbList` coinciden en cada página (Nosotros no lleva migas, como su maqueta)
- [ ] Una página por servicio/producto/ciudad relevante (no todo en una). · **resp:** skill seo · **evidencia:** pendiente
- [ ] Contenido con E-E-A-T: quiénes somos, contacto real, dirección, políticas. · **resp:** skill seo · **evidencia:** pendiente
- [x] Si hay varios idiomas: `hreflang` correcto (`seo-hreflang`). · **resp:** skill seo · **evidencia:** `pnpm smoke` (412/412 en producción, `docs/revisiones/evidencia-paso3.txt`): es, en y x-default (inglés) en las 18 URL; enlaces de idioma a la dirección final
- [ ] Preparado para buscadores con IA (AI Overviews): respuestas claras, datos estructurados, `llms.txt` opcional (`seo-geo`). · **resp:** skill seo · **evidencia:** pendiente

## diseno-ux
- [ ] `PRODUCT.md` (qué es, para quién, tono) antes de diseñar; `DESIGN.md` registrado al terminar (impeccable-documenter). · **resp:** ui-qa + impeccable · **evidencia:** pendiente
- [ ] Responsive real: 360 px, 768 px, 1280 px, 1920 px. Sin scroll horizontal. Probado en móvil (`mobile-native`). · **resp:** ui-qa + impeccable · **evidencia:** pendiente
- [x] **WCAG 2.2 AA**: contraste ≥4.5:1 texto (3:1 grande/UI), foco visible, navegable con teclado, `alt`, labels, `prefers-reduced-motion`. · **resp:** ui-qa + impeccable · **evidencia:** `pnpm test:e2e` (264 en producción, `evidencia-paso3.txt`) (axe, foco visible, teclado) y `docs/revisiones/paso3-ui-qa.md` (`prefers-reduced-motion`, orden de foco). Sin pasada con lector de pantalla
- [x] Objetivos táctiles ≥ 24×24 px (44 px recomendado) (2.5.8). · **resp:** ui-qa + impeccable · **evidencia:** `pnpm test:e2e` (264 en producción, `evidencia-paso3.txt`): todos los enlaces y botones ≥ 44 px en las 18 URL y el 404
- [ ] Criterios nuevos de WCAG 2.2: foco no tapado por header fijo, banner de cookies ni botón de WhatsApp (2.4.11); toda acción de arrastre tiene alternativa de un toque (2.5.7); no se pide dos veces el mismo dato (3.3.7); login sin pruebas cognitivas, permite pegar y gestor de contraseñas (3.3.8); la ayuda/contacto está en el mismo lugar en todas las páginas (3.2.6). · **resp:** ui-qa + impeccable · **evidencia:** pendiente
- [x] Reflujo sin scroll horizontal a 320 px y con zoom 200 %. · **resp:** ui-qa + impeccable · **evidencia:** `pnpm test:e2e` (`accessibility.spec.ts`): sin desborde a 390, 1280 y 320 px contra el ancho configurado, y con el texto al 200 % (tamaño de fuente de la raíz) en las 19 páginas a 1280 y 390 px, con todo el texto creciendo y el menú utilizable. Zoom de navegador al 200 % sin desborde (`docs/revisiones/paso3-ui-qa.md`)
- [x] axe-core cubre ≈ 57 % de los problemas: `@axe-core/playwright` en las rutas clave (0 `serious`/`critical`) más recorrido manual con teclado; informe en `.impeccable/review/`. · **resp:** ui-qa + impeccable · **evidencia:** `pnpm test:e2e` (264 en producción, `evidencia-paso3.txt`): axe sin violaciones (WCAG 2.1 A/AA y buenas prácticas) en las 18 URL, el 404, los menús abiertos y la barra de idioma; recorrido de teclado en `docs/revisiones/paso3-ui-qa.md`
- [ ] El criterio contractual de contraste es el ratio WCAG 2.x; APCA es solo apoyo informativo (texto fino en oscuro) y no cumple por sí solo. · **resp:** ui-qa + impeccable · **evidencia:** pendiente
- [x] Copy real (no lorem ipsum) en español de Colombia salvo otro público; CTA claro por sección. · **resp:** ui-qa + impeccable · **evidencia:** textos aprobados de las maquetas en `web/src/content/` y `messages/es.json`; `content.test.ts` impide corchetes y palabras vetadas
- [ ] Fotos reales o assets propios; nada de stock genérico ni "AI slop" (detector de Impeccable sin hallazgos críticos). · **resp:** ui-qa + impeccable · **evidencia:** pendiente
- [ ] Botón/enlace de **WhatsApp** si el negocio atiende por ahí (muy común en CO), sin tapar contenido en móvil. · **resp:** ui-qa + impeccable · **evidencia:** pendiente
- [x] Tipografía con `next/font` (sin saltos de layout). · **resp:** ui-qa + impeccable · **evidencia:** `pnpm test:e2e` (264 en producción, `evidencia-paso3.txt`) (`fonts.spec.ts`: CLS con las fuentes retenidas)
- [ ] Estados: cargando, vacío, error, éxito en toda vista con datos. En Next: `loading.tsx`/Suspense con skeleton, `error.tsx` con `retry`, `not-found.tsx`, `global-error.tsx`. · **resp:** ui-qa + impeccable · **evidencia:** pendiente
- [ ] Tiempos de respuesta: < 0,1 s sin feedback; > 1 s indicador; > 10 s progreso con opción de cancelar. Nunca "sin resultados" mientras carga. · **resp:** ui-qa + impeccable · **evidencia:** pendiente
- [ ] Vacío con acción: explica la función y ofrece el botón o enlace que lo llena. · **resp:** ui-qa + impeccable · **evidencia:** pendiente
- [x] Formularios: etiqueta visible y persistente (nunca solo placeholder), `autocomplete`, validación inline, no borrar lo escrito al fallar. · **resp:** ui-qa + impeccable · **evidencia:** `pnpm test:e2e` (264 en producción, `evidencia-paso3.txt`) (`contact.spec.ts`): cinco etiquetas visibles y asociadas, `autocomplete="name"`, y lo escrito no se borra (los campos esperan al script). Sin validación: ningún campo es obligatorio (spec 002)
- [ ] Errores: dicen qué pasó y cómo arreglarlo; mismo texto en el resumen y en el campo; sin "inválido", "oops" ni códigos técnicos (ver `referencias/ux-writing.md`). · **resp:** ui-qa + impeccable · **evidencia:** pendiente
- [ ] Páginas 404 y 500 diseñadas. · **resp:** ui-qa + impeccable · **evidencia:** pendiente
- [x] Más de un idioma: `app/[lang]`, `<html lang>`, formatos con `Intl`, textos fuera del JSX, probado con cadenas largas (`next-intl`). · **resp:** ui-qa + impeccable · **evidencia:** `pnpm smoke` (412/412 en producción, `docs/revisiones/evidencia-paso3.txt`) y `pnpm test:e2e` (264 en producción, `evidencia-paso3.txt`): `[locale]`, `<html lang>`, slugs traducidos, textos en `messages/*.json` con paridad de claves; títulos largos en inglés sin cortes (`docs/revisiones/paso3-ui-qa.md`)
- [x] `break-ui` sin roturas (nombres largos, sin imagen, 0 ítems, 1000 ítems). · **resp:** ui-qa + impeccable · **evidencia:** `docs/revisiones/paso3-ui-qa.md`: datos extremos en el cotizador; el único desborde (palabra de 80 caracteres) quedó corregido y con prueba e2e
- [ ] 3–5 necesidades escritas ("Necesito… para que…") y el flujo principal; la tarea principal se completa en ≤ 3 pasos desde la entrada. · **resp:** ui-qa + impeccable · **evidencia:** pendiente
- [ ] matriz pantalla × estado (vacío, carga, error, éxito, sin permiso) con cada celda diseñada y capturada. · **resp:** ui-qa + impeccable · **evidencia:** pendiente

## rendimiento
- [ ] Server Components por defecto; `"use client"` solo donde hay interactividad (`react-best-practices`). · **resp:** seo-performance · **evidencia:** pendiente
- [ ] Imágenes `next/image` con `sizes`; AVIF/WebP; `images.qualities` definido en `next.config`. · **resp:** seo-performance · **evidencia:** pendiente
- [ ] Imagen LCP presente en el HTML inicial con `preload` o `fetchPriority="high"` (en 1–2 imágenes como máximo), nunca `lazy`. `priority` está deprecado en Next 16. · **resp:** seo-performance · **evidencia:** pendiente
- [ ] Fuentes con `next/font` (fallback ajustado), máximo 2 familias; imágenes e iframes con dimensiones o `aspect-ratio` para no mover el layout (CLS). · **resp:** seo-performance · **evidencia:** pendiente
- [ ] Sin librerías pesadas sin justificar (`pick-ui-library`); animar solo `transform`/`opacity` (`animation-performance`). · **resp:** seo-performance · **evidencia:** pendiente
- [ ] Cache: Cache Components (`use cache` + Suspense), o `ensureStatic` donde el contenido sea estático; sin el modelo previo (`unstable_cache`, `dynamic`, `fetch` cache) en proyectos nuevos. `Cache-Control` correcto; CDN delante si hay mucho tráfico (Cloudflare). · **resp:** seo-performance · **evidencia:** pendiente
- [ ] INP se mide en campo (`web-vitals` o CrUX; desde N3 reportando a analítica). Lighthouse no mide INP: solo da TBT como apoyo de laboratorio. · **resp:** seo-performance · **evidencia:** pendiente
- [ ] Presupuesto de JS medido con el analizador de bundle de Turbopack, no a ojo. · **resp:** seo-performance · **evidencia:** pendiente
- [ ] Diagnóstico del LCP por subpartes: TTFB ≈ 40 %, descarga ≈ 40 %, retrasos de carga y de render < 10 % cada uno. · **resp:** seo-performance · **evidencia:** pendiente

## legal-colombia
- [ ] **Política de Tratamiento de Datos Personales** publicada y enlazada en el footer y junto a cada formulario. · **resp:** hilo principal (textos: abogado o cliente) · **evidencia:** pendiente
- [ ] **Autorización previa, expresa e informada**: checkbox **no pre-marcado** + enlace a la política en cada formulario. · **resp:** hilo principal (textos: abogado o cliente) · **evidencia:** pendiente
- [ ] Aviso de privacidad con: responsable (razón social, NIT, contacto), finalidades, derechos del titular, canal para ejercerlos. · **resp:** hilo principal (textos: abogado o cliente) · **evidencia:** pendiente
- [ ] Canal para consultas y reclamos (correo o formulario). Plazos de respuesta: consultas 10 días hábiles, reclamos 15. · **resp:** hilo principal (textos: abogado o cliente) · **evidencia:** pendiente
- [ ] Cookies no esenciales (analítica con cookies, píxeles de ads) **solo tras consentimiento**. Analítica sin cookies (Umami/Plausible) no requiere banner. · **resp:** hilo principal (textos: abogado o cliente) · **evidencia:** pendiente
- [ ] Datos de identificación del responsable visibles (razón social, NIT, dirección, contacto). · **resp:** hilo principal (textos: abogado o cliente) · **evidencia:** pendiente
- [ ] Términos y condiciones de uso del sitio. · **resp:** hilo principal (textos: abogado o cliente) · **evidencia:** pendiente
- [ ] **RNBD ante la SIC**: obligatorio si la empresa del cliente tiene **activos > 100.000 UVT** (y entidades públicas). Bases nuevas: registrar dentro de los 2 meses siguientes. Avisar al cliente. · **resp:** hilo principal (textos: abogado o cliente) · **evidencia:** pendiente
- [ ] Marketing por WhatsApp/SMS/llamadas/correo: respetar autorización y canales elegidos; **Ley 2300 de 2023** limita contactos de cobranza (horarios y frecuencia). Revisar si el cliente hace cobranza o telemercadeo. · **resp:** hilo principal (textos: abogado o cliente) · **evidencia:** pendiente

## operacion-railway
- [ ] Proyecto Railway con entornos **production** (y **staging** desde N2). · **resp:** railway-devops · **evidencia:** pendiente · **nota:** desviación del brief: staging se crea después del lanzamiento (BRIEF.md, flujo de trabajo §5)
- [ ] Config como código en `.railway/railway.ts` (IaC de Railway): build, start, `preDeploy`, healthcheck, dominios. `railway config plan` antes de cada `railway config apply`; el `apply` en producción lo confirma el usuario. `railway.json`/`railway.toml` están obsoletos (corte duro **2026-12-01**; proyectos viejos: `railway config migrate`). Fuente: docs.railway.com/config-as-code e /infrastructure-as-code. Verificar al montar: reinicio, cron y watch paths (no figuran en esa página). · **resp:** railway-devops · **evidencia:** pendiente · **nota:** pendiente de acordar: el servicio está configurado en el panel; no pisarlo sin decidirlo
- [ ] Healthcheck (`/api/health` en Next, `/actuator/health` en Spring). · **resp:** railway-devops · **evidencia:** pendiente · **nota:** desviación del brief: el healthcheck de Railway ya apunta a `/` (200 en español)
- [ ] Dominio propio con HTTPS; redirección `www` ↔ raíz definida (una sola canónica). · **resp:** railway-devops · **evidencia:** pendiente
- [ ] Variables en Railway (nunca en el repo). Referencias entre servicios con variables de Railway. · **resp:** railway-devops · **evidencia:** pendiente
- [ ] Deploy desde GitHub (rama `main` → production) con **Wait for CI** activado: `ci.yml` (typecheck, lint, test, build) corre en push a `main` y, si falla, Railway no despliega. `main` protegida (PR obligatorio, CI verde). Detalle y esqueleto en [ci-cd.md](ci-cd.md). · **resp:** railway-devops · **evidencia:** pendiente · **nota:** decidido por el fundador el 2026-11-15: push directo a `main` hasta el lanzamiento; después, `main` protegida y CI
- [ ] 1 monitor externo gratuito (UptimeRobot o Better Stack) sobre la home y `/api/health`, con aviso por correo. El healthcheck de Railway solo corre al desplegar: no vigila. · **resp:** railway-devops · **evidencia:** pendiente
- [ ] Rotación de secretos documentada y probada (tras el incidente de Railway del 2026-10-21: rotar todo lo que vivía en variables de Railway). · **resp:** railway-devops · **evidencia:** pendiente
- [ ] **Staging** separado con su propia BD; PR previews si el plan lo permite. · **resp:** railway-devops · **evidencia:** pendiente · **nota:** desviación del brief: staging después del lanzamiento y sin BD
- [ ] Webhook de Railway (`Deployment.failed`) a un canal de Slack/Discord o correo; los webhooks no van firmados (añadir cabecera secreta). · **resp:** railway-devops · **evidencia:** pendiente
- [ ] **Rollback ensayado** una vez en staging (Deployments > Rollback) y procedimiento anotado en `docs/RUNBOOK.md` ([plantilla](../referencias/plantillas/runbook.md)). · **resp:** railway-devops · **evidencia:** pendiente

## ci-cd
- [ ] PR: `typecheck` + `lint` + `test` + `build`: sí · **resp:** hilo principal · **evidencia:** pendiente
- [ ] Secretos y dependencias: gitleaks + `audit` prod · **resp:** hilo principal · **evidencia:** pendiente
- [ ] `main` protegida (PR + CI verde): sí · **resp:** hilo principal · **evidencia:** pendiente · **nota:** decidido por el fundador el 2026-11-15: después del lanzamiento
- [ ] Railway **Wait for CI**: sí · **resp:** hilo principal · **evidencia:** pendiente · **nota:** decidido por el fundador el 2026-11-15: push directo a `main` hasta el lanzamiento; después, `main` protegida y CI
- [ ] Verificación tras desplegar: scripteada · **resp:** hilo principal · **evidencia:** pendiente
- [ ] Versión y release: Conventional Commits + `release-please` · **resp:** hilo principal · **evidencia:** pendiente
- [ ] Actualizaciones: Renovate/Dependabot semanal agrupado + cooldown 3-5 d · **resp:** hilo principal · **evidencia:** pendiente

## No aplica
- Formularios: validación en servidor (Zod), anti-spam (honeypot + Cloudflare Turnstile), rate limit por IP. → **No aplica:** sin formularios con servidor en v1: el cotizador arma el mensaje de WhatsApp en el navegador.
- Consultas parametrizadas siempre (ORM o prepared statements) (V1). Prohibido concatenar SQL. → **No aplica:** sin base de datos en v1.
- Usuario de BD de la app con **mínimo privilegio** (no superusuario). → **No aplica:** sin base de datos en v1.
- Panel admin detrás de auth (ASVS 8.2.1, 8.3.1), ruta no indexable, rate limit al login (ASVS 6.3.1), sin cuentas por defecto (ASVS 6.3.2). → **No aplica:** sin panel ni cuentas en v1.
- Subida de archivos (V5): validar tipo real (magic bytes) y tamaño, renombrar, guardar en bucket, nunca ejecutar. → **No aplica:** sin subida de archivos.
- Las respuestas de API devuelven solo los campos necesarios (ASVS 15.3.1). → **No aplica:** sin API en v1.
- Backups de Postgres verificados (ver operacion-railway.md). → **No aplica:** sin base de datos en v1.
- Negocio físico o local: schema `LocalBusiness` (o subtipo) con NAP idéntico al de **Google Business Profile**. Revisar con `seo-local`. → **No aplica:** decidido: sin perfil de empresa en Google y sin mencionar el país (seo-sitio.md §1).
- Postgres: índices para las consultas reales, sin N+1 (`supabase-postgres-best-practices`). → **No aplica:** sin base de datos en v1.
- Spring Boot: pool de conexiones dimensionado al plan de Railway, timeouts, paginación en listados. → **No aplica:** sin backend en v1.
- Guardar **prueba de la autorización** (fecha, IP, versión de la política, finalidad) en BD. → **No aplica:** el sitio no guarda datos personales (cotizador sin backend).
- Datos sensibles (salud, biométricos, etc.) y de menores: solo si es indispensable y con autorización reforzada. → **No aplica:** el sitio no recoge datos sensibles ni de menores.
- Postgres solo por la red privada de Railway; nada de acceso público a la base salvo pedido explícito. → **No aplica:** sin base de datos en v1.
- Postgres de Railway con **backups** programados (diario/semanal/mensual) **y** una copia lógica (`pg_dump`) fuera del volumen: borrar el volumen borra sus backups. → **No aplica:** sin base de datos en v1.
- **Restauración probada** al menos una vez, con RTO (tiempo) y RPO (antigüedad del dato) medidos y anotados en `docs/RUNBOOK.md`. → **No aplica:** sin datos que restaurar; el rollback de despliegue va en su propio ítem.
- Migraciones en `preDeploy` (Drizzle/Flyway; si falla, el deploy no avanza), compatibles hacia atrás (expand/contract). Las destructivas, en un segundo deploy y con backup previo. El rollback de Railway restaura imagen y variables, **no** deshace datos. → **No aplica:** sin base de datos en v1.
- Migraciones: `preDeploy` + backup previo → **No aplica:** sin base de datos en v1.
