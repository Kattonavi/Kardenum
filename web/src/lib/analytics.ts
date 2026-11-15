import type { Env } from "./indexing";

/**
 * Umami, by variables (decision of the founder, 2026-11-15). The site loads its script only when
 * BOTH variables exist; with one or none, nothing is loaded and nothing about it reaches the page.
 * - UMAMI_SRC: address of the tracker script, https (for example https://cloud.umami.is/script.js).
 * - UMAMI_WEBSITE_ID: id of the site in Umami.
 * They are read when the site is built, like every other variable.
 */
export type Analytics = {
  readonly src: string;
  readonly websiteId: string;
  /** Origin of the script. Umami sends its events to the same origin, so the content policy allows it for scripts and connections. */
  readonly origin: string;
};

export function getAnalytics(env: Env = process.env): Analytics | null {
  const src = env.UMAMI_SRC?.trim();
  const websiteId = env.UMAMI_WEBSITE_ID?.trim();
  if (!src || !websiteId) return null;

  let url: URL | null = null;
  try {
    url = new URL(src);
  } catch {
    // reported below
  }
  if (!url || url.protocol !== "https:") throw new Error(`UMAMI_SRC must be the https address of the Umami script, got "${src}".`);
  // The id goes into an HTML attribute: letters, digits and hyphens only (Umami ids are UUIDs).
  if (!/^[A-Za-z0-9-]{1,64}$/.test(websiteId)) throw new Error(`UMAMI_WEBSITE_ID must be the id Umami gives the site (letters, digits and hyphens), got "${websiteId}".`);
  return { src: url.href, websiteId, origin: url.origin };
}
