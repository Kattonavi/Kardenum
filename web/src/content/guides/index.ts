import type { GuideContent } from "../types";

/**
 * Every published guide, newest first in the index. A guide is a folder here (meta.ts, es.mdx
 * and en.mdx) plus its line below:
 *   { meta: tebexMeta, body: { es: () => import("./tebex/es.mdx"), en: () => import("./tebex/en.mdx") } }
 * The bodies are only loaded by the site; tests and the smoke test read the metadata alone.
 * None is written yet (docs/specs/006-guias.md, "Con qué se llena hoy").
 */
export const guides: readonly GuideContent[] = [];
