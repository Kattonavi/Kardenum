# Contenido de prueba (nunca se publica)

Las plantillas de caso y de guía se construyeron sin contenido real: hoy hay dos casos con datos pendientes y cero
guías. Para verlas y probarlas completas se usa este contenido ficticio, **solo en un clon de descarte**: nunca en el
árbol que se versiona ni en producción. Todo dice que es de prueba.

| Qué | Cómo (desde la raíz de un clon, con `py -3`) |
|---|---|
| Dos guías ficticias con todos los componentes (captura, código largo, tabla alineada, nota) y slug distinto por idioma | `py -3 docs/pruebas/guias-de-prueba/install.py web` (y `--uninstall` para quitarlas) |
| Encender el portafolio | `py -3 docs/pruebas/casos-de-prueba.py web flag` |
| Tres casos ficticios: uno reservado (Video), uno con cliente nombrado (Discord) y uno privado | `py -3 docs/pruebas/casos-de-prueba.py web fixtures` |
| Imagen principal real en el caso con cliente nombrado (ejercita la imagen prioritaria) | `py -3 docs/pruebas/caso-con-imagen-principal.py web docs/pruebas/imagen-principal-de-prueba.webp` (después del anterior) |

Con eso instalado, las pruebas que hoy no tienen sobre qué correr sí corren: las de cada guía (`e2e/guides.spec.ts`),
las de casos reservados y privados, la de que el optimizador convierte una imagen y la de la imagen principal. Las
corridas hechas así están en `docs/revisiones/evidencia-paso5.txt`. Al montar la integración continua (paso 7 del
brief) conviene que un trabajo aparte las repita.
