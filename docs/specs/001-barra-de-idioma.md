# 001 · Barra de idioma

**Estado:** implementada (2026-11-15). **Fuente:** `docs/handoff/docs/seo-sitio.md` §2.2 y maqueta `B-Nav-escritorio`.

El sitio nunca redirige por idioma (lo recomienda Google). Una barra discreta ofrece la otra versión y la
elección se recuerda. Como las páginas son estáticas, la decisión se toma en el navegador **antes del primer
pintado**, para que la barra no desplace la página.

## Requisitos

| # | Requisito |
|---|---|
| RF-1 | CUANDO alguien abre una página en español con el navegador en un idioma que no es español, el sitio DEBE mostrar la barra ofreciendo la versión en inglés, con sus textos en inglés. |
| RF-2 | CUANDO alguien abre una página en español con el navegador en español, el sitio NO DEBE mostrar la barra. |
| RF-3 | CUANDO alguien abre una página en inglés, el sitio DEBE ofrecer el español solo si el navegador está en español, con los textos en español. |
| RF-4 | CUANDO la persona cierra la barra, el sitio DEBE recordar el idioma de esa página y NO DEBE volver a ofrecer el otro en visitas posteriores. |
| RF-5 | CUANDO la persona elige un idioma (en la barra o en ES / EN), el sitio DEBE llevarla a la misma página en ese idioma y recordar la elección; si luego llega a una página del otro idioma, DEBE ofrecerle el idioma elegido. Nunca redirige solo. |
| RF-6 | El sitio DEBE tratar como español solo los códigos `es` y `es-XX`. |
| RF-7 | SI el navegador no informa su idioma o la cookie trae un valor desconocido, el sitio DEBE seguir funcionando: sin idioma del navegador se asume inglés. |

## Decisiones

- La elección se guarda en la cookie propia `kardenum_lang` (`es` o `en`, un año, `SameSite=Lax`). Solo se
  escribe cuando la persona hace clic; el servidor nunca la lee ni la escribe. Es una cookie de preferencia, no de
  analítica: no pide banner.
- La barra se renderiza en todas las páginas y está oculta por defecto. Un script en línea al inicio del
  `<body>` marca `<html data-lang-offer>` cuando hay que mostrarla.
- Por debajo de 360 px de ancho, ES / EN sale de la cabecera y queda dentro del menú.

## Fuera de alcance

- Detectar el país o la región.
- Más de dos idiomas.

## Pruebas

| Requisito | Prueba |
|---|---|
| RF-1 a RF-7 (lógica) | `web/src/lib/language-choice.test.ts` (ejecuta el script real) |
| RF-1 a RF-5 (navegador), sin desplazamiento | `web/e2e/language.spec.ts` |
| Sin redirección por `Accept-Language` ni cookies | `web/scripts/smoke.mjs` |
