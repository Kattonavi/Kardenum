# Revisión de código — paso 3 del brief

- **Revisor:** `code-reviewer` (opus · high), contexto fresco. **Fecha:** 2026-11-15.
- **Alcance:** `git diff 7c0e424..0def2aa -- web/` contra `docs/specs/002-cotizador-whatsapp.md`, la Constitución del
  proyecto y `docs/handoff/BRIEF.md`.
- **Veredicto:** APROBADO CON CAMBIOS. Sin Críticos; un Alto.

## Hallazgos y resolución

| # | Sev. | Dónde | Escenario | Resolución |
|---|---|---|---|---|
| 1 | **Alto** | `web/src/components/contact/quote-form.tsx` | El `<form>` no tenía `action`, los cinco campos llevaban `name` y el botón era `type="submit"`. Enviado antes de hidratar o sin JavaScript, el navegador hacía un GET a `/contacto?…&descripcion=<idea>&nombre=<nombre>`: los datos quedaban en la URL, el historial y los registros del servidor. Incumple RF-5. | **Corregido.** Los campos ya no tienen `name` y el botón de envío sale `disabled` hasta que el script corre. Prueba e2e sin JavaScript (`contact.spec.ts`, "without JavaScript"), que falla contra el build anterior, y comprobación de humo sobre el HTML del servidor. |
| 2 | Medio | `web/src/lib/quote.ts`, vista previa | `replace("{name}", name)` interpretaba `$&`, `$$`, `` $` `` del nombre: "Juan $& Pérez" llegaba como "Soy Juan {name} Pérez.". Incumple RF-4. | **Corregido.** `introduce()` con función de reemplazo, usada en el mensaje y en la vista previa; prueba unitaria. |
| 3 | Bajo | `web/src/lib/quote.ts` | `.slice()` cortaba por unidades UTF-16: 79 letras + un emoji dejaba medio emoji y `encodeURIComponent` lanzaba `URIError` (el envío fallaba sin aviso). | **Corregido.** El límite cuenta caracteres completos y se descartan los medios caracteres; prueba unitaria. |
| 4 | Bajo | `web/e2e/contact.spec.ts` (RF-8) | La rama negativa de `?linea=` esperaba "Desarrollo", que ya es el valor del HTML del servidor: pasaba antes de hidratar. | **Corregido.** La prueba espera a que el script haya leído la dirección. |
| 5 | Bajo | `web/src/lib/seo/seo.test.ts` | "a page without texts…" se salta sola cuando todas las rutas tengan textos. | Backlog 24. |
| 6 | Bajo | `web/src/components/pages/line-page.tsx` | El enlace a una subpágina depende de `isListed`, sin `isBuilt`: encender `serviceSubpages` antes de construirlas daría enlaces al 404. | Backlog 23 (antes de encender flags). |
| 7 | Bajo | `web/src/content/quote.ts` | Ninguna prueba vigila que los tipos de proyecto de una línea sean únicos y distintos de "Todavía no lo tengo claro". Hoy lo son. | Backlog 24. |
| 8 | Bajo | `web/src/content/content.test.ts` | La paridad es/en del contenido tipado compara conteos, no pares. | Backlog 24. |

## Lo que el revisor comprobó

Sin secretos ni `.env` versionado · ningún `package.json` ni lockfile cambió · `pnpm test` 63/63 y `pnpm lint` sin
avisos · sin TODO, `console.log`, mocks ni `any` · 404 de marca, redirecciones 308 y enlaces de idioma directos
contra el build local · las pruebas reescritas en el lote no quedaron más débiles que el requisito.

## Lo que no pudo verificar

- La rama "número listo" de RF-4 en navegador (corre solo con el número puesto; evidencia en
  `evidencia-paso3.txt`, sección 4).
- El comportamiento de `maxLength` con emojis en Chrome y Safari (el hallazgo 3 se corrigió igual).
- No cotejó cada página contra el plan §4 ni leyó a fondo `sections/*`, `servicios/page.tsx` y `content/lines/*`.
- Si la descripción del nodo `Service` (sale de la meta) cumple la guía de Google de reflejar lo visible: backlog 25.

## Re-verificación del delta

(Se anota aquí; no genera informe nuevo.)
