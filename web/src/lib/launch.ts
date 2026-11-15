import { type Env, isSiteIndexable } from "./indexing";
import { getSiteUrl } from "./site-url";
import { type SiteConfig, siteConfig } from "../site.config";

/**
 * What still blocks the launch:
 * - contact data that is a placeholder (a visitor must never see "[correo@kardenum.com]"),
 * - a SITE_URL that is not the production domain (canonical URLs and the sitemap would
 *   point search engines to a temporary address).
 */
export function getLaunchBlockers(config: SiteConfig = siteConfig, env: Env = process.env): string[] {
  const blockers = Object.entries(config.contact)
    .filter(([, value]) => value.status === "pending")
    .map(([key]) => `site.config.ts contact.${key} is still pending`);

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
