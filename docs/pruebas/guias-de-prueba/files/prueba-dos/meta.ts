import type { GuideMeta } from "../../types";

// FICTITIOUS GUIDE, for trying the template only (docs/specs/006-guias.md). Never commit it.
export const pruebaDosMeta: GuideMeta = {
  id: "prueba-dos",
  line: "desarrollo",
  service: "/servicios/desarrollo",
  slug: { es: "segunda-guia-de-prueba", en: "second-test-guide" },
  shortName: { es: "Segunda prueba", en: "Second test" },
  title: {
    es: "Segunda guía de prueba, ficticia, para ver las guías relacionadas",
    en: "Second made-up test guide, to see the related guides",
  },
  summary: {
    es: "Texto ficticio. Una segunda guía corta para que aparezcan las guías relacionadas y el filtro del índice.",
    en: "Made-up text. A second short guide so the related guides and the filter of the index show up.",
  },
  publishedAt: "2026-11-05",
  updatedAt: "2026-11-05",
  readingMinutes: 2,
  sections: [
    { es: "Antes de empezar", en: "Before you start" },
    { es: "Siguientes pasos", en: "Next steps" },
  ],
  meta: {
    title: { es: "Segunda guía de prueba ficticia — Kardenum", en: "Second made-up test guide — Kardenum" },
    description: {
      es: "Texto ficticio para revisar las guías relacionadas y el filtro del índice de guías. No es una guía real ni se publica nunca.",
      en: "Made-up text to review the related guides and the filter of the guides index. It is not a real guide and is never published.",
    },
  },
};
