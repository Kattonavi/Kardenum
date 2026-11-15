import type { AppPathname } from "../routes";
import type { PageMeta } from "./types";

/**
 * Title, description and social image text of every built page, in both languages.
 * pages.test.ts checks that each built route has an entry and that titles and descriptions are unique.
 */
const pageMeta: Partial<Record<AppPathname, PageMeta>> = {
  "/": {
    title: {
      es: "Kardenum — estudio de desarrollo, diseño y video",
      en: "Kardenum — software, design and video studio",
    },
    description: {
      es: "Estudio de desarrollo, diseño y video: sitios web, tiendas online, software a la medida, identidad visual y edición de video. Cotiza tu proyecto.",
      en: "Software, design and video studio: websites, online stores, custom software, brand identity and video editing. Get a quote for your project.",
    },
    og: {
      es: {
        label: "Estudio de desarrollo, diseño y video",
        lines: ["Software, diseño", "y video."],
        accent: "Un solo estudio.",
      },
      en: {
        label: "Software, design and video studio",
        lines: ["Software, design", "and video."],
        accent: "One studio.",
      },
    },
  },
};

export function getPageMeta(pathname: AppPathname): PageMeta {
  const meta = pageMeta[pathname];
  if (!meta) throw new Error(`No page meta for "${pathname}". Add it to src/content/pages.ts.`);
  return meta;
}

export function hasPageMeta(pathname: AppPathname): boolean {
  return pathname in pageMeta;
}
