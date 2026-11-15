import { type Env, isSiteIndexable } from "./indexing";
import { getSiteUrl } from "./site-url";
import { type SiteConfig, siteConfig } from "../site.config";

/**
 * Every value of the configuration that is still a placeholder, by its path
 * ("contact.email", "legal.privacy.sections.rights"). The whole object is walked instead of
 * listing fields, so a value added later cannot be left out of the launch check.
 */
export function findPending(value: unknown, path = ""): string[] {
  if (!value || typeof value !== "object") return [];
  if ("status" in value && value.status === "pending") return [path];
  return Object.entries(value).flatMap(([key, child]) => findPending(child, path ? `${path}.${key}` : key));
}

/**
 * What still blocks the launch:
 * - data that is a placeholder: contact channels and legal data and texts (a visitor must never
 *   see "[correo@kardenum.com]" or "[Nombre o razón social]"),
 * - a SITE_URL that is not the production domain (canonical URLs and the sitemap would
 *   point search engines to a temporary address).
 */
export function getLaunchBlockers(config: SiteConfig = siteConfig, env: Env = process.env): string[] {
  const blockers = findPending(config).map((path) => `site.config.ts ${path} is still pending`);

  const siteUrl = getSiteUrl(env);
  if (siteUrl !== config.url) blockers.push(`SITE_URL is ${siteUrl} and must be ${config.url}`);
  return blockers;
}

/**
 * Called from next.config.ts. Fails the build when the site is about to be indexable without
 * being ready, so the previous (noindex) deployment stays online.
 * SITE_LAUNCH_CHECK=off skips it, for local verification of an indexable build only.
 */
export function assertLaunchReady(env: Env = process.env, config: SiteConfig = siteConfig): void {
  if (!isSiteIndexable(env) || env.SITE_LAUNCH_CHECK === "off") return;
  const blockers = getLaunchBlockers(config, env);
  if (blockers.length > 0) {
    throw new Error(`SITE_INDEXABLE=true but the site is not ready to launch: ${blockers.join("; ")}. Fix them or keep SITE_INDEXABLE=false.`);
  }
}
