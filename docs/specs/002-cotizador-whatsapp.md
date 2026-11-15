# 002 · Cotizador por WhatsApp

**Estado:** implementado (2026-11-15). **Fuente:** maqueta `B-Contacto` y `docs/handoff/docs/plan-sitio-web.md` §4
("Contacto") y §8.

Un formulario de cinco pasos que arma el mensaje de la solicitud y abre WhatsApp con el texto listo. Corre solo
en el navegador: no hay backend y no guarda nada.

## Requisitos

| # | Requisito |
|---|---|
| RF-1 | El cotizador DEBE pedir, en este orden: línea de servicio, tipo de proyecto, idea (texto libre), plazo y nombre. Ninguno es obligatorio. |
| RF-2 | CUANDO la persona cambia la línea, el cotizador DEBE mostrar los tipos de proyecto de esa línea y dejar seleccionado "Todavía no lo tengo claro". |
| RF-3 | MIENTRAS la persona llena el formulario, el cotizador DEBE mostrar el mensaje tal como llegará: saludo con el nombre, línea, proyecto, plazo y la idea. Si faltan el nombre o la idea, la vista previa DEBE mostrar su lugar entre corchetes. |
| RF-4 | CUANDO la persona envía, el cotizador DEBE abrir `https://wa.me/<número>?text=<mensaje>` en una pestaña nueva, con el mensaje codificado. Sin nombre, el saludo no lleva "Soy…"; sin idea, esa parte se omite. |
| RF-5 | El cotizador NO DEBE guardar ni enviar los datos a ningún lado: sin `localStorage`, sin cookies y sin peticiones de red. El mensaje solo viaja en el enlace de WhatsApp. Vale también antes de que cargue el script de la página y sin JavaScript: el navegador no puede enviar el formulario por su cuenta (campos sin `name`; campos y botón apagados hasta que el script corre, para que tampoco se borre lo escrito al cargar). Sin JavaScript el cotizador queda apagado y lo dice. |
| RF-6 | SI el número de WhatsApp está pendiente en `site.config.ts`, el botón de envío DEBE quedar inerte con la nota `[WhatsApp por activar]`, y la vista previa DEBE seguir funcionando. |
| RF-7 | El cotizador DEBE limitar el nombre a 80 caracteres y la idea a 1000, y DEBE normalizar espacios y saltos de línea antes de armar el mensaje. El límite nunca deja medio carácter (un emoji simple no se corta por la mitad; los campos cuentan como el navegador, así que un emoji puede ocupar más de un lugar), lo escrito se trata siempre como texto (`$&` no es un patrón) y una palabra larga se parte en la vista previa en vez de ensanchar la página. |
| RF-8 | CUANDO la página se abre con `?linea=<id>`, el cotizador DEBE preseleccionar esa línea; un valor que no sea una de las cinco líneas se ignora. |
| RF-9 | Cada campo DEBE tener su etiqueta visible y asociada; los controles miden al menos 48 px de alto y todo se usa con teclado. |

## Decisiones

- **Valores por defecto neutros.** El tipo de proyecto arranca en "Todavía no lo tengo claro" y el plazo en "Sin fecha
  definida", para que el mensaje nunca afirme algo que la persona no eligió (la maqueta invita a "dejarlo como está").
- **Tipos de proyecto por línea.** La maqueta solo trae los de Desarrollo. Los de las otras cuatro líneas son los
  nombres de servicio ya aprobados en la página de cada línea. Provisional: lo revisa el fundador.
- **La línea llega preseleccionada** desde el botón de WhatsApp del cierre de cada página de línea
  (`/contacto?linea=<id>#cotizador`). El parámetro se lee en el navegador, así la página sigue siendo estática.
- El idioma del mensaje es el de la página (español o inglés).

- **Política de privacidad y autorización (decisión del fundador, 2026-11-15).** Junto a la nota "Este formulario no
  guarda tus datos" va un enlace a la política de privacidad. No hay casilla de autorización: el formulario no envía
  ni guarda datos en el sitio. Es una excepción al estándar del Workspace y queda por confirmar con el abogado.

## Fuera de alcance

- Guardar cotizaciones o enviarlas por correo (v2, con backend).
- Adjuntar archivos.

## Pruebas

| Requisito | Prueba |
|---|---|
| RF-4, RF-7, RF-8 (lógica) | `web/src/lib/quote.test.ts` |
| RF-1 a RF-9 (navegador) | `web/e2e/contact.spec.ts` |
| RF-5 y RF-6 (HTML del servidor) | `web/scripts/smoke.mjs` |

La prueba de RF-4 en navegador tiene dos ramas según `site.config.ts`: con el número pendiente comprueba RF-6
(no se abre nada); con el número listo comprueba que se abre `wa.me` con el mensaje exacto (la petición se
intercepta, no sale de la máquina). Mientras el número siga pendiente solo corre la primera. La segunda se ejecutó
el 2026-11-15 en un clon de descarte con un número ficticio (escritorio y celular, en verde); hay que volver a
correrla al poner el número real.
