import type { GuideMeta } from "../../types";

// FICTITIOUS GUIDE, for trying the template only (docs/specs/006-guias.md). Never commit it.
export const pruebaMeta: GuideMeta = {
  id: "prueba",
  line: "minecraft",
  service: "/servicios/minecraft/tebex",
  slug: { es: "guia-de-prueba", en: "test-guide" },
  shortName: { es: "Guía de prueba", en: "Test guide" },
  title: {
    es: "Guía de prueba: un texto ficticio para revisar la plantilla de guías",
    en: "Test guide: made-up text to review the guide template",
  },
  summary: {
    es: "Texto ficticio. Esta guía no existe: sirve para ver cada componente de la plantilla con contenido largo.",
    en: "Made-up text. This guide does not exist: it shows every component of the template with long content.",
  },
  publishedAt: "2026-11-01",
  updatedAt: "2026-11-12",
  readingMinutes: 7,
  sections: [
    { es: "Antes de empezar", en: "Before you start" },
    { es: "Un paso ficticio con captura", en: "A made-up step with a screenshot" },
    { es: "Un paso ficticio con código y tabla", en: "A made-up step with code and a table" },
    { es: "Siguientes pasos", en: "Next steps" },
  ],
  meta: {
    title: { es: "Guía de prueba ficticia — Kardenum", en: "Made-up test guide — Kardenum" },
    description: {
      es: "Texto ficticio para revisar la plantilla de guías: secciones, captura, código, nota y tabla. No es una guía real ni se publica nunca.",
      en: "Made-up text to review the guide template: sections, screenshot, code, note and table. It is not a real guide and is never published.",
    },
  },
};
