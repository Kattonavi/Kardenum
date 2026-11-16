# Revisión de diseño — paso 5 del brief

- **Revisor:** `impeccable-finish-reviewer` (sonnet · medium), sin navegador. **Fecha:** 2026-11-15.
- **Método:** el código de cada plantilla contra el HTML de su maqueta, valor por valor (medidas, espaciados,
  tipografía, color, bordes). No abrió las capturas: lo visual y los estados reales están en `paso5-ui-qa.md`.
- **Resultado:** ninguna diferencia Alta ni Media en ninguna plantilla.

## Sin diferencias materiales

- **Subpágina** (`sub-page.tsx`, `sections/content.tsx` contra `B-Sub-Minecraft-plugins`): coinciden los rellenos de
  sección (72 / 88 / 96 px), separaciones, tarjetas numeradas, lista de entregables, etiquetas, pasos, preguntas y la
  cuadrícula de servicios relacionados (140 px, relleno 24).
- **Índice del portafolio** y **plantilla de guía**: salvo lo de abajo.
- **Tokens** (`globals.css`): Tinta, Piedra, Niebla, Grafito, Ceniza y Bronce coinciden; sin esquinas redondeadas.

## Diferencias menores (todas Bajo) y resolución

| # | Dónde | Maqueta | Construido | Resolución |
|---|---|---|---|---|
| 1 | Caso, cabecera (`portafolio/[slug]/page.tsx`) | H1 a 132 px bajo la barra | 112 px (migas del sitio con 28 px + 40 px) | Backlog 47: subir `pt-10` a `pt-16` |
| 2 | Tarjeta del portafolio, al pasar el cursor | el título pasa a bronce oscuro | subrayado | Backlog 47 |
| 3 | Cuadrículas con `auto-fill` (portafolio, guías, piezas, relacionadas) | `auto-fit` | con pocas tarjetas no se estiran a todo el ancho | Se queda: con dos casos se ve mejor así; con seis o más son iguales |
| 4 | Tarjeta de guía relacionada | separación de 14 px | 16 px | Backlog 47 |
| 5 | Texto de la tarjeta del portafolio | `[Qué se hizo] · [Cliente]` | `texto. cliente.` | Se queda: es el formato de las tarjetas reales de la maqueta ("…. Proyecto propio.") |
| — | Tarjeta de guía, fondo al pasar el cursor | no lo trae | `#e4e3dd`, como las tarjetas de servicios relacionados | Se queda: coherente con el sitio |
