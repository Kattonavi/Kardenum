# 008 · Avisos de marca por línea y correo escrito en las páginas de Minecraft

**Estado:** implementado (2026-11-16; evidencia en `docs/revisiones/evidencia-paso5.txt`, última sección).
**Fuente:** indicación del fundador del 2026-11-16 y `docs/handoff/BRIEF.md` ("Avisos en el pie: las páginas de
Minecraft llevan el aviso de que no es un servicio oficial de Minecraft. Las de Discord, el aviso de que el estudio no
está afiliado a Discord"). Reemplaza la decisión anterior de `docs/PROYECTO.md` (aviso de Minecraft en todo el sitio).

El aviso de Minecraft sale solo en las páginas cuyo tema es Minecraft, y en ellas el correo de contacto queda escrito
en el cierre. Qué página es de Minecraft lo dice un dato (su línea), no una lista de direcciones.

## Requisitos

| # | Requisito |
|---|---|
| RF-1 | El pie de una página DEBE mostrar el aviso de Minecraft CUANDO la línea de la página es Minecraft, en español y en inglés, en el HTML del servidor. |
| RF-2 | El pie de una página cuya línea no es Minecraft NO DEBE mostrar el aviso: inicio, índice de servicios, las otras líneas y sus subpáginas, Nosotros, Contacto, legales, índices de portafolio y guías, y la página 404. |
| RF-3 | La línea de una página DEBE salir del contenido: la página de una línea y sus subpáginas, de `service-lines.ts`; una guía, de su `line`; un caso, de sus `lines` (basta con que Minecraft esté entre ellas). Ninguna dirección se escribe a mano en la regla. |
| RF-4 | CUANDO se navega del lado del cliente entre una página de Minecraft y otra que no lo es, el aviso DEBE aparecer o desaparecer con la página, sin recargar el documento. |
| RF-5 | El cierre de contacto de una página de Minecraft DEBE mostrar la dirección de correo escrita, no solo un botón: con enlace `mailto:` cuando el dato existe, y como reemplazo entre corchetes, sin enlace, mientras siga pendiente en `site.config.ts`. |
| RF-6 | El aviso de Discord DEBE seguir la misma regla, por la línea Discord. |

## Decisiones

- **Por qué el correo:** las reglas de uso de la marca Minecraft piden decir a quién contactar por el servicio y por
  qué medio, y aclaran que "chat and forum links are not acceptable methods". En las páginas de Minecraft el primer
  canal es Discord, así que la dirección de correo va escrita. Fuente:
  [ConductAtlas, copia de las Minecraft Usage Guidelines](https://conductatlas.com/platform/minecraft/minecraft-usage-guidelines/provision/CA-P-025277/must-provide-valid-contact-method-not-chat-or-forum/)
  (secundaria: `minecraft.net/en-us/usage-guidelines` no respondió el 2026-11-16; el plan cita la misma copia para el aviso).
- **El correo no se inventa** (Constitución, regla 6): hoy `contact.email` es un reemplazo y el cierre lo muestra
  entre corchetes. El build abierto ya falla mientras siga pendiente (`src/lib/launch.ts`).
- **El pie vive en el layout** (un solo layout raíz): la página no puede pasarle datos. El pie lee la dirección en
  pantalla; para casos y guías, el servidor le entrega qué entradas generadas llevan aviso (como los enlaces ES / EN).
- **404:** no es una página de Minecraft; su pie deja de llevar el aviso.

## Fuera de alcance

- El texto del aviso (no cambia) y el del aviso de Discord.
- Escribir la dirección de correo en las páginas que no son de Minecraft.
- La dirección de correo real: la define el estudio en `site.config.ts`.

## Validación

| RF | Prueba |
|---|---|
| RF-1, RF-2, RF-3, RF-6 | `web/src/lib/notices.test.ts` (conjunto literal de páginas con aviso; guías y casos de prueba) · `pnpm smoke` (cada página y entrada generada, en los dos idiomas, y la 404) · `web/e2e/notices.spec.ts` |
| RF-4 | `web/e2e/notices.spec.ts` ("without reloading the document") |
| RF-5 | `web/src/lib/contact.test.ts` · `pnpm smoke` (cierre de cada página y entrada) · `web/e2e/notices.spec.ts` |
