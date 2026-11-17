# Fase 2b · Revisión de diseño en celular de las páginas interiores

2026-11-17. Completa la revisión de diseño de la fase 2, que quedó parcial (`fase-2-informe-final.md`, sección 2).
Spec 013, RF-51. Revisor independiente (`impeccable-finish-reviewer`): recibió el brief, el plan de la fase, las
specs 012 y 013, la maqueta de celular del inicio y 51 capturas a 390 × 844 px, no conclusiones.

**Veredicto: FIEL CON AJUSTES.** Las piezas del sistema están en su sitio y siguen la maqueta: botones con borde de
44 px, botones de cierre de 52 px, pie nuevo, tarjetas con escena, escena 16:10 debajo del texto y márgenes de 20 px.
**Ningún hallazgo Crítico. Un Alto, aplicado.** Lo demás va al backlog (ítems 73 a 77).

## Qué vio y qué no

Capturas en `.impeccable/review/fase-2b/` (no se versionan; `INDEX.txt` dice qué es cada serie). Tomadas sobre el
código de la rebanada 3, con movimiento reducido para que las escenas salgan completas.

- **Vistas completas:** índice de servicios (5 pantallas), línea Desarrollo (8), línea Minecraft (7), Nosotros (4),
  Contacto (5), 404 (2) y el menú de celular abierto.
- **Vistas en parte:** Diseño, Video, Discord y Minecraft en inglés (2 de 6 pantallas cada una: comparten plantilla
  con las dos líneas vistas completas), preguntas (5 de 7), privacidad (3 de 4) y una subpágina (3 de 7).
- **No vistas:** el resto de esas páginas: de Diseño, Video, Discord y Minecraft en inglés, de la tercera pantalla
  en adelante; en preguntas, el grupo de Discord y el pie; el final de privacidad; la subpágina desde su cuarta
  pantalla.
- **Sin evidencia posible en capturas quietas:** el control "Pausar animación" (se oculta con movimiento reducido),
  la entrada al bajar y los botones hacia subpáginas (siguen tras su flag). Los tres tienen pruebas de navegador.

## Hallazgos

| Sev. | Dónde | Qué se ve | Qué se hizo |
|---|---|---|---|
| **Alto** | Las cinco líneas, lista numerada de servicios | El nombre del servicio arrancaba 72 px a la derecha, detrás del número, y la descripción volvía al margen: dos alineaciones en la misma fila | **Aplicado** (rebanada 4): por debajo de 768 px el número tiene su columna y el nombre, la descripción y el enlace comparten la otra. Prueba en `web/e2e/lines.spec.ts`: antes, nombre en 92 px y descripción en 20 px; después, los dos en el mismo punto, a 390 y a 640 px |
| Medio | Preguntas, entre grupos | Dos filetes oscuros seguidos con una franja vacía de unos 90 px entre ellos | Backlog 73 |
| Medio | Líneas y Nosotros, al cerrar una lista | Un filete gris al final de la lista y, 90 px después, el filete negro de la sección siguiente: dos separadores para un solo corte | Backlog 73 |
| Medio | Título de página en celular (Desarrollo, Discord, Video, Minecraft en inglés) | Una palabra sola en un renglón del título ("MEDIDA.", "VIDEO", "YOUR") | Backlog 74. La decisión del fundador sobre títulos era para escritorio y la spec 013 (RF-23) no deja cambiar el tamaño en celular |
| Medio | 404 | Una línea en inglés bajo los enlaces, con otro tipo de texto | Backlog 20, que ya lo recoge: la 404 no conoce el idioma y lleva esa línea a propósito |
| Bajo | Subpágina, migas | Al partirse dejan "/" colgando al final del renglón | Backlog 75 |
| Bajo | Migas en inglés | El espacio después de "HOME" es mayor (el enlace corto mide 44 px de ancho) | Backlog 75 |
| Bajo | Privacidad | El título numerado que se parte vuelve al margen, debajo del número | Backlog 76 |
| Bajo | Nosotros frente a las líneas | "Principios" lleva filete bajo el título y "Cómo trabajamos" no, siendo el mismo bloque | Backlog 76 |
| Bajo | Contacto | El filete superior del pie queda pegado al cambio de fondo (Contacto no tiene cierre) | Backlog 76 |
| Bajo, a confirmar | "Entrar al servidor", "Política de privacidad" (Contacto), "Go to the home page" (404) | Enlaces de texto cuya altura tocable parece menor de 44 px | Backlog 77. La prueba de objetivos táctiles (`web/e2e/accessibility.spec.ts`) pasa en esas páginas: hay que medirlos uno por uno antes de tocar |

## Lo que pasa contra la maqueta

- Pie: renglones de 44 px sin espacio entre ellos y un enlace solo en su renglón son el mismo reparto de la maqueta.
- "Correo" solo en su renglón en el cierre: igual que en la maqueta.
- Botones de cierre de 52 px y "Ver X →" de 44 px en mono de 12 px.
- Bronce como texto solo sobre Tinta; sobre Piedra solo en cuadros y filetes.
- Ningún texto desbordado ni cortado en lo que se vio.
