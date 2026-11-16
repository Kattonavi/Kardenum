import type { StaticImageData } from "next/image";

/**
 * Images of the cases, by the id a case file names (`{ kind: "image", image: "<id>" }`).
 * They are imported here, and only here, so their width and height are known at build time and
 * the content files stay loadable by Node (unit tests, smoke test, Playwright).
 *
 * Files live in src/assets/cases/<case id>/ with names that say what they show
 * ("kaelion-spawn.avif"), already optimized: WebP or AVIF, at most 2400 px wide and 800 KB
 * (src/lib/case-images.test.ts). None exists yet.
 */
export const caseImages: Readonly<Record<string, StaticImageData>> = {};

export function getCaseImage(id: string): StaticImageData {
  const image = caseImages[id];
  if (!image) throw new Error(`Unknown case image "${id}". Import it in src/components/portfolio/case-images.ts.`);
  return image;
}
