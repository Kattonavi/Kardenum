# Product

<!-- impeccable:product-schema 1 -->

> Registro tomado del handoff aprobado por el fundador (`docs/handoff/`, 15 de noviembre de 2026), sin entrevista
> nueva: cada sección cita su fuente. Si algo cambió, se corrige aquí primero.

## Platform

web

## Users

Dos públicos distintos (plan-sitio-web.md §1):

- **Negocios y personas**, de local a internacional, que buscan web, marca o video. Deciden por confianza y por ver
  trabajo parecido al suyo.
- **Dueños de servidores de Minecraft y de comunidades de Discord.** Llegan por recomendación, comparan en Discord
  y suelen pagar en dólares.

## Product Purpose

Sitio de Kardenum, estudio independiente con cinco líneas: Desarrollo, Diseño, Video y animación, Minecraft y
Discord. Un solo objetivo: que quien llega entienda en segundos qué hace el estudio y pida una cotización.
Portafolio, proceso y garantía existen para darle confianza a ese paso. La prioridad número uno es que el estudio
aparezca en búsquedas orgánicas (BRIEF.md, seo-sitio.md).

Éxito: clics en WhatsApp, Discord y correo, y posiciones orgánicas por servicio.

## Positioning

Varios oficios en un solo estudio y bajo una sola dirección: desarrollo, marca, video y comunidad se trabajan
juntos y con el mismo criterio. Una marca, dos puertas: el inicio le habla a negocios, y Minecraft y Discord
tienen su página completa para compartirla directo en Discord (plan-sitio-web.md §1).

## Operating Context

- Todo se cotiza a la medida: el cliente cuenta lo que necesita, el estudio revisa y envía una cotización.
- Tres canales de contacto en el cierre de cada página y en Contacto: WhatsApp, Discord y correo. El cotizador
  arma el mensaje de WhatsApp en el navegador; no hay backend ni se guardan datos.
- Español en la raíz e inglés en `/en`, sin redirección automática: una barra ofrece el otro idioma.

## Capabilities and Constraints

- Sin backend, base de datos ni CMS en v1: el contenido vive en archivos tipados del repo.
- No hay precios, plazos ni pagos públicos. Nunca se usan las palabras "plan" ni "mensualidad".
- No se menciona el país. No hay sección de equipo.
- Dedicados (Minecraft): trabajo puntual a pedido; el estudio no administra después de la entrega.
- Garantía de 30 días sobre el trabajo propio; lo externo se atiende con cotización nueva.
- El portafolio queda oculto hasta tener al menos una pieza por línea; cada caso lleva `visibilidad`
  (público, reservado o privado) y los privados no se generan.
- Sin decidir todavía: correo, WhatsApp, invitación de Discord, perfiles oficiales y datos legales
  (`web/src/site.config.ts` los marca como pendientes).

## Brand Commitments

Identidad aprobada el 13 de noviembre de 2026 (identidad-visual.md): dirección B · Gremio, logo L5 · Corchete,
acento bronce. Las maquetas de `docs/handoff/maquetas/` son el diseño y los textos definitivos de escritorio.

- Voz: cercana y directa, con algunas frases formales ya elegidas (textos-sitio.md). El cliente se siente
  entendido, escuchado y tomado en cuenta.
- Las preguntas frecuentes van en tono formal y tienen una sola versión.
- El inglés se escribe para cómo se busca en inglés; no se traduce al pie de la letra.

## Evidence on Hand

- Textos aprobados en las maquetas y en `docs/handoff/docs/`.
- Logo en SVG, PNG y PDF: `docs/handoff/marca/kardenum-logo-final.zip`.
- Casos reales hoy: Kardenum y Kaelion. Video no tiene ninguna pieza. No existe reel.
- No hay testimonios ni clientes que se puedan nombrar: no se inventan.

## Product Principles

1. Entender en segundos, cotizar en un paso.
2. Una página por cada búsqueda que importa; contenido real y útil, sin relleno.
3. Alcance claro: se dice qué se entrega y qué no.
4. Nada inventado: lo que falta se muestra como pendiente o se oculta.

## Accessibility & Inclusion

WCAG 2.1 AA (BRIEF.md): `header`, `main` y `footer` con un solo H1; menú y desplegable completos con teclado;
objetivos táctiles de 44 px; foco visible; `prefers-reduced-motion`. El bronce `#B8923A` es texto solo sobre
Tinta; sobre fondo claro el texto de acento usa `#7A5C14`.
