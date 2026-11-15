# Revisión final de diseño — paso 3 del brief

- **Revisor:** `impeccable-finish-reviewer` (opus · medium), sin navegador: capturas de `ui-qa` (commit 0def2aa),
  maquetas aprobadas y código. **Fecha:** 2026-11-15.
- **Vara:** fidelidad a las maquetas aprobadas (el encargo fue implementarlas, no rediseñar) y calidad de ejecución
  dentro de esa dirección.
- **Veredicto:** ninguna contradicción de fidelidad con las maquetas. Lo único material son los enlaces legales del
  pie que llevan al 404.

## Hallazgos y resolución

| # | Sev. | Dónde | Qué | Resolución |
|---|---|---|---|---|
| 1 | Medio | Pie, todas las páginas | PRIVACIDAD y TÉRMINOS enlazan a páginas que aún no existen y llevan al 404. El 404 sí los oculta, así que los dos pies no coinciden. | Sin cambio en este lote: el fundador pidió esos dos enlaces en el pie (bloque d) y las páginas legales dependen de datos pendientes. Backlog 9, con dos salidas para que él decida: ocultarlos hasta que existan o construir las páginas. |
| 2 | Bajo | 404 | La maqueta lleva PRIVACIDAD · TÉRMINOS en el pie y el build no (solo enlaza páginas que existen). | Se resuelve con el 1. |
| 3 | Bajo (criterio, sin maqueta móvil) | Contacto, 390 px | La vista previa "Así te llega el mensaje" queda debajo del botón de envío: en celular la persona envía antes de verla. | Backlog 28 (lote de pulido). |

## Fiel a la maqueta (1280 px)

Servicios, Nosotros, Contacto y 404: estructura, ritmo vertical, escala tipográfica, reglas, superficies y botones
coinciden. Las cinco líneas conservan todas las secciones de su maqueta salvo las decididas (Trabajos, Guías, reel).
En celular (390 px) el apilado, el margen de 20 px y la jerarquía siguen a `B-Movil-Inicio`.

## Lo que el revisor no pudo verificar

- 768 px (solo se midieron desbordes en la revisión de navegador).
- Desarrollo, Diseño, Minecraft y Discord contra una maqueta renderizada: las comparó contra el HTML de la maqueta.
  Desarrollo y Minecraft sí se compararon captura contra maqueta en el hilo principal durante la construcción.
- El estado de foco y los dos desbordes corregidos después de las capturas (cubiertos por pruebas e2e).
