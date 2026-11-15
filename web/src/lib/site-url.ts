import { siteConfig } from "../site.config";
import type { Env } from "./indexing";

/**
 * Origin every absolute URL of the site is built from: canonical, hreflang, sitemap,
 * JSON-LD and social images.
 *
 * It comes from the SITE_URL variable and defaults to the production domain
 * (site.config.ts). Before the domain exists, the service sets SITE_URL to the address it
 * is really served from, so those URLs resolve. It is read at build time, like the
 * indexing guard. An indexable build must use the production domain (src/lib/launch.ts).
 */
export function getSiteUrl(env: Env = process.env): string {
  const raw = env.SITE_URL?.trim();
  if (!raw) return siteConfig.url;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`SITE_URL is not a valid URL: "${raw}". Example: https://kardenum.com`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`SITE_URL must start with https:// (or http:// for a local server): "${raw}"`);
  }
  if (url.pathname !== "/" || url.search !== "" || url.hash !== "" || url.username !== "" || url.password !== "") {
    throw new Error(`SITE_URL must be only the origin, without path, query or credentials: "${raw}"`);
  }
  // The origin has no trailing slash: paths are appended to it.
  return url.origin;
}
