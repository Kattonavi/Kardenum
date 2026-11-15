import type { PortfolioCase } from "../types";

/**
 * Case 0: the studio itself (maquetas B-Portafolio and B-Caso). Identity (Design) and website
 * (Development). The result and the screenshot of the site are still pending (site.config.ts).
 */
export const kardenumCase: PortfolioCase = {
  id: "kardenum",
  visibilidad: "publico",
  client: { kind: "own" },
  slug: { es: "kardenum", en: "kardenum" },
  name: "Kardenum",
  summary: {
    es: "Identidad visual y sitio web del estudio.",
    en: "Visual identity and website for the studio.",
  },
  cardText: {
    es: "Identidad visual y sitio web",
    en: "Visual identity and website",
  },
  lines: ["diseno", "desarrollo"],
  year: 2026,
  cover: { kind: "mark", alt: { es: "Logo de Kardenum", en: "Kardenum logo" } },
  hero: { kind: "mark", alt: { es: "Símbolo de Kardenum", en: "Kardenum symbol" } },
  challenge: {
    es: "Crear desde cero la marca de un estudio que ofrece desarrollo, diseño, video y servicios para Minecraft y Discord, sin que se lea como una empresa de una sola cosa.",
    en: "Build from scratch the brand of a studio that offers development, design, video and services for Minecraft and Discord, without it reading as a one-trade company.",
  },
  work: [
    {
      es: "Símbolo: una K formada por un corchete y un signo de menor que.",
      en: "Symbol: a K made of a bracket and a less-than sign.",
    },
    {
      es: "Paleta en blanco y negro con un solo acento.",
      en: "Black and white palette with a single accent.",
    },
    {
      es: "Tipografía Archivo en su versión expandida.",
      en: "Archivo typeface in its expanded width.",
    },
    {
      es: "Sitio web en inglés y español.",
      en: "Website in English and Spanish.",
    },
  ],
  result: { pending: "kardenum.result" },
  pieces: [
    { kind: "mark", alt: { es: "Símbolo de Kardenum sobre fondo claro", en: "Kardenum symbol on a light background" } },
    {
      kind: "palette",
      title: { es: "Paleta", en: "Palette" },
      colors: ["#111110", "#F4F4F1", "#D9D8D2", "#55544F", "#B8923A"],
    },
    {
      kind: "typeface",
      title: { es: "Tipografía", en: "Typeface" },
      name: "Archivo",
      sample: "Aa Bb Cc Dd Ee 0123456789",
      secondary: "JetBrains Mono · 01 02 03",
    },
    { kind: "pending", ref: { pending: "kardenum.siteScreenshot" } },
  ],
  // Provisional, like every title and description until the keywords are validated.
  meta: {
    title: {
      es: "Kardenum: identidad visual y sitio web — Kardenum",
      en: "Kardenum: visual identity and website — Kardenum",
    },
    description: {
      es: "Caso del portafolio: identidad visual y sitio web de Kardenum, el propio estudio. El reto, qué hicimos y las piezas. Cotiza tu proyecto.",
      en: "Portfolio case: visual identity and website for Kardenum, the studio itself. The challenge, what we did and the pieces. Get a quote for your project.",
    },
  },
};
