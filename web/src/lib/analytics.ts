import type { Env } from "./indexing";

/**
 * Umami, by variables (decision of the founder, 2026-11-15). The site loads its script only when
 * BOTH variables exist; with one or none, nothing is loaded and nothing about it reaches the page.
 * - UMAMI_SRC: address of the tracker script of the studio's own Umami, https and without user or password.
 * - UMAMI_WEBSITE_ID: id of the site in Umami.
 * They are read when the site is built, like every other variable.
 */
export type Analytics = {
  readonly src: string;
  readonly websiteId: string;
  /**
   * Origin of the script. A self-hosted Umami receives its events on the same origin, so the content
   * policy allows it for scripts and connections. Umami Cloud does not (its script sends to another
   * host, checked on 2026-11-15): it needs its collection origin allowed too (docs/BACKLOG.md, 31).
   */
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
  // The address is written in the HTML of every page: it must never carry credentials.
  if (url.username || url.password) throw new Error("UMAMI_SRC must not carry a user or a password.");
  // The id goes into an HTML attribute: letters, digits and hyphens only (Umami ids are UUIDs).
  if (!/^[A-Za-z0-9-]{1,64}$/.test(websiteId)) throw new Error(`UMAMI_WEBSITE_ID must be the id Umami gives the site (letters, digits and hyphens), got "${websiteId}".`);
  return { src: url.href, websiteId, origin: url.origin };
}
