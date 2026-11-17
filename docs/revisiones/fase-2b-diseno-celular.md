# Fase 2b · Revisión de diseño en celular de las páginas interiores

2026-11-17. Completa la revisión de diseño de la fase 2, que había quedado parcial (`fase-2-informe-final.md`,
sección 2). Spec 013, RF-51. Revisor independiente (`impeccable-finish-reviewer`), en dos pasadas: recibió el brief, el
plan de la fase, las specs 012 y 013, la maqueta de celular del inicio y 92 capturas a 390 × 844 px, no conclusiones.

**Veredicto: FIEL CON AJUSTES**, en las dos pasadas. Las piezas del sistema están en su sitio y siguen la maqueta:
botones con borde de 44 px, botones de cierre de 52 px, pie nuevo, tarjetas con escena, escena 16:10 debajo del texto
y márgenes de 20 px. **Ningún hallazgo Crítico. Un Alto, aplicado y comprobado por el mismo revisor.** Lo demás va al
backlog (ítems 73 a 77 y 83).

## Qué vio

- **Primera pasada** (51 capturas del código de la rebanada 3, en `.impeccable/review/fase-2b/`): completos el
  índice de servicios, las líneas Desarrollo y Minecraft, Nosotros, Contacto, la 404 y el menú de celular abierto; en
  parte Diseño, Video, Discord, Minecraft en inglés, preguntas, privacidad y una subpágina.
- **Segunda pasada** (41 capturas de producción con la rebanada 4, en `.impeccable/review/fase-2b-celular-2/`, sin
  tope de pantallas): completas, de arriba al pie, Diseño (6 pantallas), Video (6), Discord (7), preguntas (7),
  privacidad (4), Términos (4) y la subpágina de tiendas online (7). El revisor listó los 41 archivos como vistos.
- **Lo que queda sin ver:** Minecraft en inglés pasó solo con sus dos primeras pantallas (comparte plantilla con la
  línea Minecraft en español, vista completa); las otras cinco subpáginas y las páginas en inglés no se capturaron.
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

## Segunda pasada: qué confirmó y qué añadió

- **El arreglo de la lista numerada quedó bien:** número, nombre y descripción comparten columna, también con
  nombres de dos renglones (Diseño, Video y Discord).
- **Confirmados** en las pantallas nuevas: los dos filetes para un solo corte (preguntas, líneas y subpágina), la
  palabra sola en el título de Video y Discord en celular, las migas partidas de la subpágina, el título numerado de
  las legales (también en Términos), el filete del pie pegado al cambio de fondo (privacidad y Términos) y el enlace
  "Entrar al servidor" con poca altura tocable.
- **Nuevos, los dos Bajo y en la subpágina (oculta tras su flag), al backlog 83:** "Qué hacemos" usa el bloque de
  pasos y no la lista numerada de su línea, y con "Cómo trabajamos" justo después las dos secciones parecen una; las
  tarjetas de "Servicios relacionados" dejan la flecha sola en un renglón y entre las cuatro llenan casi una pantalla.
