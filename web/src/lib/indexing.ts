/**
 * Indexing guard for the whole site.
 *
 * The site is indexable only when `SITE_INDEXABLE` is exactly the string "true".
 * Any other value, or no value at all, keeps it out of search engines (fail closed):
 * - `robots.txt` answers `Disallow: /` (src/app/robots.ts),
 * - every response carries `X-Robots-Tag: noindex, nofollow` (next.config.ts),
 * - every page carries `<meta name="robots" content="noindex, nofollow">` (src/app/layout.tsx),
 * - the sitemap must not be published (any future sitemap route must check this guard).
 *
 * It is read at build time: changing the variable requires a new build (on Railway, a new
 * deployment after the variable change). After flipping it, check `/robots.txt` in production.
 */
export type Env = Readonly<Record<string, string | undefined>>;

export function isSiteIndexable(env: Env = process.env): boolean {
  return env.SITE_INDEXABLE === "true";
}

export const NOINDEX_DIRECTIVE = "noindex, nofollow";
