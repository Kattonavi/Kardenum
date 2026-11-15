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

/** A text that says nothing: empty, blank, or still a bracketed note such as "[fecha]". */
const saysNothing = (text: string): boolean => text.trim() === "" || /^\s*\[[\s\S]*\]\s*$/.test(text);

/** Inside a value marked as ready: an empty text, a note in brackets or an empty list (a language without its paragraphs). */
function hasHole(value: unknown): boolean {
  if (typeof value === "string") return saysNothing(value);
  if (Array.isArray(value)) return value.length === 0 || value.some(hasHole);
  if (value && typeof value === "object") return Object.values(value).some(hasHole);
  return false;
}

/**
 * Values marked as ready that are not: "ready" with an empty text, with the bracketed note left
 * in, or with one language missing. Marking a value ready must not be a way around the check.
 */
export function findUnfilled(value: unknown, path = ""): string[] {
  if (!value || typeof value !== "object") return [];
  if ("status" in value && value.status === "ready") return "value" in value && hasHole(value.value) ? [path] : [];
  return Object.entries(value).flatMap(([key, child]) => findUnfilled(child, path ? `${path}.${key}` : key));
}

/**
 * What still blocks the launch:
 * - data that is a placeholder: contact channels and legal data and texts (a visitor must never
 *   see "[correo@kardenum.com]" or "[Nombre o razón social]"),
 * - data marked as ready that is empty or still a note in brackets,
 * - a SITE_URL that is not the production domain (canonical URLs and the sitemap would
 *   point search engines to a temporary address).
 */
export function getLaunchBlockers(config: SiteConfig = siteConfig, env: Env = process.env): string[] {
  const blockers = [
    ...findPending(config).map((path) => `site.config.ts ${path} is still pending`),
    ...findUnfilled(config).map((path) => `site.config.ts ${path} is marked ready but is empty or still a note in brackets`),
  ];

  const siteUrl = getSiteUrl(env);
  if (siteUrl !== config.url) blockers.push(`SITE_URL is ${siteUrl} and must be ${config.url}`);
  return blockers;
}

/**
 * Called from next.config.ts. Fails the build when the site is about to be indexable without
 * being ready, so the previous (noindex) deployment stays online.
 * SITE_LAUNCH_CHECK=off skips it, for local verification of an indexable build only: on
 * Railway or in CI the switch itself fails the build, so copying it there cannot publish an
 * indexable site with placeholders.
 */
export function assertLaunchReady(env: Env = process.env, config: SiteConfig = siteConfig): void {
  if (!isSiteIndexable(env)) return;
  if (env.SITE_LAUNCH_CHECK === "off") {
    const deploying = Object.keys(env).find((name) => name === "CI" || name.startsWith("RAILWAY_"));
    if (deploying) throw new Error(`SITE_LAUNCH_CHECK=off is for local verification only and ${deploying} is set: remove it from this environment.`);
    return;
  }
  const blockers = getLaunchBlockers(config, env);
  if (blockers.length > 0) {
    throw new Error(`SITE_INDEXABLE=true but the site is not ready to launch: ${blockers.join("; ")}. Fix them or keep SITE_INDEXABLE=false.`);
  }
}
