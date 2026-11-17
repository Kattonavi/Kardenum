# 013 · Ajustes tras la fase 2: decisiones del fundador

**Estado:** en construcción (2026-11-17). Avance y evidencia: `docs/revisiones/fase-2b-bitacora.md`.
**Fuente:** el encargo del fundador del 2026-11-17, después de leer `docs/revisiones/fase-2-informe-final.md`. Sus
cinco decisiones son los requisitos; no hubo entrevista porque el encargo ya las trae resueltas.
**Reemplaza** de la spec 012 y de su bitácora: la decisión 17 y la 46 (ancho de 1200 px), la 45 (cabecera intacta, solo
en lo que toca al botón "Cotizar"), la 23 de la spec (texto 3/5 y escena 2/5 en las líneas), la 10 (`lighthouserc.cjs`
no se toca) y la 48 de la bitácora (la pregunta repetida). Todo lo demás de la spec 012 sigue vigente, incluidas sus
reglas de lote (RF-1 a RF-6): sin estilos en línea, animación solo con CSS, movimiento reducido, los dos idiomas a la
par, accesibilidad AA y Lighthouse de 95 o más.

**No se toca:** rutas, idiomas, metadatos, flags, cabeceras de seguridad, freno de lanzamiento, variables de Railway,
los mínimos de Lighthouse (95, tres pasadas, pasada mediana) ni el presupuesto de bytes del inicio.

## Requisitos

### A · Ancho de página (rebanada propia)

| # | Requisito |
|---|---|
| RF-1 | El contenido de todas las páginas, la cabecera y el pie DEBEN medir como máximo 1320 px de ancho, con márgenes laterales de 48 px en ventana ancha (contenido útil de 1224 px), como la maqueta de la fase 2. En celular los márgenes siguen en 20 px. |
| RF-2 | La página 404 (que tiene cabecera y pie propios) DEBE usar el mismo ancho. |
| RF-3 | CUANDO la ventana mide 1440 px o más, el pie DEBE ocupar una sola fila, como en la maqueta. |
| RF-4 | El cambio de ancho NO DEBE mover el contenido al cargar (CLS hasta 0,03 en la prueba interna) ni dejar desplazamiento horizontal entre 320 y 1920 px. |

### B · Botón "Cotizar" de la cabecera

| # | Requisito |
|---|---|
| RF-10 | El botón "Cotizar" de la cabecera DEBE ir relleno en Bronce con texto en Tinta en todas las páginas, como la maqueta. |
| RF-11 | CUANDO el visitante está en Contacto, el botón DEBE seguir marcado como página actual (`aria-current="page"`) y distinguirse a la vista del resto de páginas. |

### C · Títulos junto a la escena (páginas de línea y subpáginas)

| # | Requisito |
|---|---|
| RF-20 | CUANDO la primera pantalla va en dos columnas, el texto DEBE ocupar el 55 % y la escena el 45 %. |
| RF-21 | CUANDO la primera pantalla va en dos columnas, el título NO DEBE pasar de tres renglones ni dejar una palabra sola en un renglón, en ninguna de las 11 páginas (5 líneas y 6 subpáginas) ni en ninguno de los dos idiomas, a cualquier ancho de escritorio. |
| RF-22 | El título DEBE repartir sus renglones de forma pareja (`text-wrap: balance`). |
| RF-23 | En celular (una columna) el tamaño del título NO DEBE cambiar respecto a hoy. |

### D · Preguntas frecuentes

| # | Requisito |
|---|---|
| RF-30 | La pregunta repetida DEBE quedar en los dos grupos con el nombre de cada cosa: "¿Administran el servidor de Minecraft después de la entrega?" y "¿Administran el servidor de Discord después de la entrega?" (en inglés, "Do you manage the Minecraft server after delivery?" y "Do you manage the Discord server after delivery?", provisional como todo el inglés). Las respuestas no cambian. |
| RF-31 | Ninguna pregunta DEBE repetirse palabra por palabra en la página de preguntas, en ningún idioma. |

### E · Rendimiento y verificación

| # | Requisito |
|---|---|
| RF-40 | El inicio DEBE aligerarse sin cambiar lo que se ve: capturas idénticas antes y después a 1280 y 390 px, y un resultado en el runner que no sea peor que el de hoy. Lo que tenga riesgo se propone y no se aplica. |
| RF-41 | `verify-deploy` DEBE medir `/preguntas-frecuentes` y `/en/faq` con el mismo mínimo que las demás páginas. |
| RF-42 | El documento de la página de preguntas DEBE caber en la primera ráfaga de TCP (14.600 bytes transferidos) en los dos idiomas, y la prueba de humo DEBE vigilarlo. |

### F · Carrusel y revisión de diseño

| # | Requisito |
|---|---|
| RF-50 | En celular, el rótulo activo bajo el carrusel ("I · DESARROLLO") DEBE tener un contraste de 4,5:1 o más contra su fondo durante todo el tiempo en que su escena está quieta al centro, también si el visitante pausa en ese momento. |
| RF-51 | Las páginas interiores (índice de servicios, las cinco líneas, preguntas, Nosotros, Contacto, legales y 404) DEBEN tener revisión de diseño en celular (390 px), con el brief, el plan de la fase y la spec a la vista. Se aplica lo Crítico y lo Alto; lo demás va al backlog. |

## Decisiones tomadas sin preguntar

1. **Los límites internos no cambian:** el título del inicio (1100 px), el pie del carrusel (1040 px) y el título del
   cierre (900 px) ya eran los de la maqueta; lo único distinto era el ancho de página.
2. **En Contacto el botón "Cotizar" lleva además un borde en Piedra.** Relleno siempre, ya no puede marcar la página
   actual con el relleno; el borde es la señal a la vista y `aria-current` la del lector de pantalla.
3. **El filete bajo la cabecera y la franja de idioma se quedan** (backlog 58): el fundador decidió solo el botón.
4. **Junto a la escena los cortes del título van escritos con cada título** (`titleBeside`), y su tamaño sale del
   ancho de su columna, así los renglones son los mismos de 1024 a 1920 px. Medido en la tipografía real, con solo
   `text-wrap: balance` el navegador dejaba una palabra sola en 12 de los 22 títulos: reparte anchos, no evita
   palabras solas. `text-wrap: balance` está puesto, pero quien cumple la regla son los cortes. Hay **dos tamaños**:
   6,5 % del ancho de la columna (41 px a 1440) y 5,2 % (33 px) para los títulos con un renglón de más de 17 letras.
   Con ese tamaño menor quedan tres páginas públicas en inglés (Development, Design, Minecraft) y tres subpáginas en
   español; ahí el título mide menos que los de sección (36 px). La parte en bronce puede empezar a mitad de renglón
   ("Y SOFTWARE"). **Alternativa por decidir:** un solo tamaño de 41 px, aceptando que en esos títulos una palabra
   larga quede sola en el primer renglón. En una columna (celular, o páginas sin escena) nada cambia.
7. **RF-21 se cumple en 20 de 22 títulos.** Los otros dos son títulos en inglés de tres palabras, de subpáginas
   ocultas ("Custom Minecraft plugins." y "Custom ecommerce websites."): no caben en un renglón y quedan con la
   primera palabra sola, nunca la última.
8. **RF-40 se cumple en su parte de "no cambiar lo que se ve" y "no peor", no en la de aligerar el inicio.** Lo que
   se aplicó (hojas de estilo por página) le da margen a la página de preguntas y a las páginas sin escenas; el
   inicio queda igual en el runner y su documento pierde holgura (de 346 a 207 bytes libres). Lo que sí lo
   aligeraría toca fuentes o JavaScript y quedó como propuesta (backlog 78).
9. **RF-51 queda parcial:** la revisión vio 51 capturas de 13 páginas, no todas las pantallas de todas
   (`docs/revisiones/fase-2b-diseno-celular.md`).
5. **Las preguntas de las subpáginas no se tocan** (dos de Minecraft repiten la pregunta sin el nombre): siguen
   ocultas tras su flag y el fundador habló de los dos grupos de la página de preguntas.
6. **El título repetido entre el inicio y `/servicios` (backlog 65) sigue abierto:** no vino decidido.

## Fuera de alcance

- Borrar las ramas desechables (lo hace el fundador) y el punto de restauración de la fase 2 (lo decide él).
- El filete de la cabecera, la franja de idioma, los títulos de grupo de la página de preguntas y los textos
  provisionales.
- Bajar cualquier mínimo de Lighthouse o cambiar cómo se mide.

## Plan (una rebanada a la vez: clon limpio en verde → push → `verify-deploy` en verde)

| # | Rebanada | RF | Hecho cuando |
|---|---|---|---|
| 0 | Spec y línea base | — | Commit de documentos; `verify-deploy` a mano en verde antes de cambiar nada |
| 1 | Ancho de 1320 px | RF-1 a RF-4 | Puerta completa; capturas a 1440 y 1920 px junto a la maqueta |
| 2 | "Cotizar", títulos junto a la escena y las dos preguntas | RF-10 a RF-31 | Puerta completa; prueba de renglones en las 22 combinaciones |
| 3 | Rendimiento: inicio, dieta de la página de preguntas y su entrada a `verify-deploy` | RF-40 a RF-42 | Puerta completa; medida en el runner antes de `main` |
| 4 | Contraste del rótulo y revisión de diseño en celular, con sus arreglos | RF-50, RF-51 | Puerta completa; informe de la revisión en `docs/revisiones/` |

Si una rebanada no pasa `verify-deploy` tras dos intentos de arreglo: `git revert`, se documenta y se sigue con la
siguiente que no dependa de ella. Un rojo solo por `/` con 0,94 se relanza una vez antes de contarlo como intento.

## Validación

| RF | Prueba |
|---|---|
| RF-1, RF-2, RF-4 | `web/e2e/layout.spec.ts` (ancho del contenido a 1440 y 1920 px, sin desplazamiento horizontal) · prueba de CLS existente |
| RF-3 | `web/e2e/layout.spec.ts` (el pie en una fila a 1440 px) |
| RF-10, RF-11 | `web/e2e/navigation.spec.ts` |
| RF-20 a RF-23 | `web/e2e/titles.spec.ts` (22 títulos a 1024, 1280, 1440 y 1920 px; tamaño en celular) · `web/src/content/content.test.ts` |
| RF-30, RF-31 | `web/src/content/faq.test.ts` |
| RF-40 | Capturas antes y después · corrida de diagnóstico en el runner |
| RF-41 | `web/lighthouserc.cjs` · corrida de `verify-deploy` |
| RF-42 | `pnpm smoke` |
| RF-50 | `web/e2e/carousel.spec.ts` |
| RF-51 | `docs/revisiones/fase-2b-diseno-celular.md` |
