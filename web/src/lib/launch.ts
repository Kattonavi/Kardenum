import { type Env, isSiteIndexable } from "./indexing";
import { type SiteConfig, siteConfig } from "../site.config";

/**
 * What still blocks the launch: contact data that is a placeholder.
 * The site must not become indexable while a visitor could see "[correo@kardenum.com]".
 */
export function getLaunchBlockers(config: SiteConfig = siteConfig): string[] {
  return Object.entries(config.contact)
    .filter(([, value]) => value.status === "pending")
    .map(([key]) => `contact.${key}`);
}

/**
 * Called from next.config.ts. Fails the build when the site is about to be indexable with
 * pending data, so the previous (noindex) deployment stays online.
 * SITE_LAUNCH_CHECK=off skips it, for local verification of an indexable build only.
 */
export function assertLaunchReady(env: Env = process.env, config: SiteConfig = siteConfig): void {
  if (!isSiteIndexable(env) || env.SITE_LAUNCH_CHECK === "off") return;
  const blockers = getLaunchBlockers(config);
  if (blockers.length > 0) {
    throw new Error(
      `SITE_INDEXABLE=true but site.config.ts still has pending data: ${blockers.join(", ")}. ` +
        "Fill them in before launching (or keep SITE_INDEXABLE=false).",
    );
  }
}
