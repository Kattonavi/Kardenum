# Revisión de código — paso 5 del brief

- **Revisor:** `code-reviewer` (opus · high), el mismo del paso 4. **Fecha:** 2026-11-15.
- **Alcance:** `git diff db32532..3b758fa -- web/` (subpáginas de servicio, portafolio y casos, guías en MDX) contra
  las specs 004, 005 y 006 y la Constitución del proyecto. Reutilizó `evidencia-paso5.txt`; no repitió las suites.
- **Veredicto:** **APROBADO.** Sin Crítico ni Alto.

## Lo que comprobó contra producción y en el código

- Rutas: índices, casos y subpáginas responden 200; una dirección de entrada que no existe da 404;
  `/en/portafolio/kardenum` y la barra final redirigen con 308 a la dirección canónica.
- Caso en inglés: canonical, hreflang (es, en, x-default) y los tres enlaces ES / EN llevan al mismo caso.
- Ninguna página pública tiene enlaces `<a>` a subpáginas, casos ni guías ocultos.
- `dynamicParams = false` en las dos colecciones; los casos privados se filtran en un solo lugar (`visibleCases`); el
  freno suma los pendientes del portafolio solo con el flag encendido.
- Las pruebas dependen del valor real de cada flag, no lo fijan en apagado.
- Sin secretos en el diff, sin TODO ni `console.log` en `src`; `pnpm audit --prod` sin avisos.

## Hallazgos y resolución

| # | Sev. | Dónde | Escenario | Resolución |
|---|---|---|---|---|
| 1 | Medio | `site-header.tsx` (`entryLinks()`), `lib/entries.ts` | La tabla de direcciones por idioma de todas las entradas construidas viaja en los datos de todas las páginas, también de las públicas y aunque la colección esté oculta: quien lea el código de la página de inicio encuentra `/portafolio/kardenum`. No hay enlaces `<a>` y esas páginas llevan `noindex`: el daño es que se pueden descubrir. Además la tabla crece con cada guía en todas las páginas. | **Backlog 41** (Medio que no es de seguridad: siguiente rebanada). Ver abajo. |
| 2 | Bajo | `lib/guides.ts`, casos | No se validaba el formato del slug: uno con tilde o mayúscula llegaría codificado a la página y no coincidiría con ninguna entrada (404, o ES / EN hacia el inicio). | **Corregido.** `builtEntries` exige minúsculas, dígitos y guiones en todo slug de toda colección, y nombra la entrada; prueba unitaria. |
| 3 | Bajo | `package.json` | `@mdx-js/react` no se importa en ningún archivo. | **Se queda:** `@next/mdx` lo declara como dependencia par (`peerDependencies`) y la guía de Next lo pide en la instalación. |

## No verificado por el revisor

Las guías ficticias en un clon propio, las ramas con casos privado y reservado, el JSON-LD de `CreativeWork` y
`Article`, y el filtro sin JavaScript en un navegador: los tomó de la evidencia y del código.

## Decisión sobre el hallazgo 1

No se corrige en este lote. La cabecera vive en el layout y no sabe en qué entrada está; por eso recibe la tabla
completa. El arreglo limpio es de estructura: que el layout de cada colección (que sí recibe el slug) pinte la
cabecera con el par de direcciones de esa entrada, moviendo las páginas a grupos de rutas. Es un cambio mecánico
grande (todas las carpetas de página) y va solo, con su propia verificación. Mientras tanto: no hay enlaces hacia las
entradas ocultas, llevan `noindex`, y la revisión de seguridad lo clasificó como informativo. La comprobación nueva
de términos confidenciales cubre el riesgo real (un nombre reservado dentro de un slug).
