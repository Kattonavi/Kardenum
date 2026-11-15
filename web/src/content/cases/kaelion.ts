import type { PortfolioCase } from "../types";

/**
 * Own project of the Minecraft line (maqueta B-Portafolio). Only the name, the line and what it
 * is exist today; everything else is pending in site.config.ts.
 */
export const kaelionCase: PortfolioCase = {
  id: "kaelion",
  visibilidad: "publico",
  client: { kind: "own" },
  slug: { es: "kaelion", en: "kaelion" },
  name: "Kaelion",
  summary: {
    es: "Servidor RPG de Minecraft: plugins y configuración.",
    en: "Minecraft RPG server: plugins and setup.",
  },
  cardText: {
    es: "Servidor RPG de Minecraft: plugins y configuración",
    en: "Minecraft RPG server: plugins and setup",
  },
  lines: ["minecraft"],
  year: { pending: "kaelion.year" },
  cover: { pending: "kaelion.cover" },
  hero: { pending: "kaelion.hero" },
  challenge: { pending: "kaelion.challenge" },
  work: { pending: "kaelion.work" },
  result: { pending: "kaelion.result" },
  pieces: [{ kind: "pending", ref: { pending: "kaelion.serverScreenshot" } }],
  // Provisional, like every title and description until the keywords are validated.
  meta: {
    title: {
      es: "Kaelion: servidor RPG de Minecraft — Kardenum",
      en: "Kaelion: Minecraft RPG server — Kardenum",
    },
    description: {
      es: "Caso del portafolio: Kaelion, servidor RPG de Minecraft con plugins y configuración, un proyecto propio del estudio. Cotiza tu servidor.",
      en: "Portfolio case: Kaelion, a Minecraft RPG server with its plugins and setup, an own project of the studio. Get a quote for your server.",
    },
  },
};
