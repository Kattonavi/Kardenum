# Fase 2b · Revisión de diseño en escritorio: el título junto a la escena

2026-11-17. Pedida por el fundador al decidir un solo tamaño de título (spec 013, RF-20 a RF-23). Revisor
independiente (`impeccable-finish-reviewer`): recibió la spec, las cinco reglas del fundador y 37 capturas de la
primera pantalla (las cinco líneas en español e inglés a 1440 y 1072 px, tres a 1280, dos a 1024 y las seis subpáginas
en los dos idiomas a 1440). Según su propio informe **no leyó el brief ni la maqueta de escritorio**: comparó contra la
spec, la hoja de estilos y las reglas.

**Veredicto: APROBADO CON AJUSTES.** Vio las 37 capturas. Las 37 cumplen las cinco reglas: 41,5 px a 1440, nunca
menos de 32 px, el bronce siempre al inicio de un renglón, ningún título con más de tres renglones en lo capturado y
ninguna palabra corta sola en el último. **Ningún hallazgo Crítico ni Alto.** Lo que marcó está alrededor del título.

| Sev. | Dónde | Qué se ve | Qué se hizo |
|---|---|---|---|
| Medio | Minecraft y Discord a 1072 px | El segundo botón caía a otro renglón: la columna de texto (unos 500 px) no alcanzaba para los dos (504 px en español, 541 en inglés) | **Aplicado.** La escena va al lado del texto solo desde 1216 px de ventana, donde caben el título y los dos botones de todas las páginas (el par más ancho mide 568 px). Ahí el título mide 37 px. Prueba en `web/e2e/titles.spec.ts` |
| Medio | A 1024 px, con la escena debajo | La escena ocupaba todo el ancho (928 px) y quedaba descomunal | **Aplicado.** Entre 1024 y 1215 px la escena mide como máximo 640 px, alineada con el texto. Por debajo de 1024 px no cambia |
| Medio | Subpágina de tiendas en inglés | "Custom / ecommerce / websites." en tres renglones cuando cabe en dos | **Aplicado:** "Custom ecommerce / websites." |
| Medio, a confirmar | Subpáginas y líneas en inglés, borde inferior | El título de sección que asoma abajo (hasta 36 px) queda muy cerca de los 41 px del título de página: la jerarquía se aplana | Backlog 79 |
| Bajo | Subpágina de plugins en inglés | "Custom Minecraft / plugins.": una sola palabra en bronce en el último renglón | Backlog 79 (cambia qué parte va en bronce) |
| Bajo | Desarrollo en inglés | "Web / development and / custom software.": "WEB" sola en el primer renglón | Sin arreglo sin reescribir el título: "Web development and" no cabe en un renglón y el bronce debe empezar renglón. Backlog 79 |
| Bajo | Desarrollo y Discord en español | El renglón del medio ("SOFTWARE", "DE DISCORD") es mucho más corto | Se acepta: no hay otro corte con el bronce al inicio de renglón |
| Bajo | Dos subpáginas en inglés | Una palabra sola al final del párrafo bajo el título | Backlog 79 |
| Bajo, a confirmar | Migas en inglés | El hueco después de "HOME" es mayor | Ya está en el backlog 75 |

## Segunda pasada: el estado final, con los ajustes aplicados

El mismo revisor vio 7 capturas del estado que queda (`.impeccable/review/fase-2b-titulos-2/`): Discord en español y
Desarrollo en inglés a 1024, 1215 y 1216 px, y la subpágina de tiendas en inglés a 1440 px. **Veredicto: APROBADO CON
AJUSTES; los tres cambios funcionan.**

- A 1216 px los dos botones quedan en un renglón, las columnas se ven equilibradas y el título de 37,8 px se lee bien.
- A 1024 y 1215 px la escena de 640 px bajo el texto se ve proporcionada, y el vacío a su derecha no se ve descuidado:
  el párrafo y los botones terminan a la misma altura y todo comparte el borde izquierdo.
- "Custom ecommerce / websites." queda en dos renglones, con el bronce al inicio del segundo.
- **Bajo, nuevo (backlog 79):** al pasar de 1215 a 1216 px el título baja de 56 a 38 px de golpe, y a 1215 px es
  mayor que a 1440 (56 contra 41). Arreglo propuesto: por debajo de 1216 px, limitar el título de estas páginas a
  48 px (`clamp(1.8125rem, 4.6vw, 3rem)`); en celular no cambia nada.
- **Medio, sigue abierto (backlog 79):** la jerarquía frente a los títulos de sección.

Además de las capturas, lo cubren las pruebas: 22 títulos a 1216, 1280, 1440 y 1920 px, los botones en un renglón, la
escena debajo y de 640 px como máximo a 1024 y 1215 px, y nada se mueve al llegar las fuentes.
