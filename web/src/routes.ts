import { type AppLocale, locales, xDefaultLocale } from "./i18n/locales";
import type { Env } from "./lib/indexing";
import { getSiteUrl } from "./lib/site-url";
import { siteConfig } from "./site.config";

/**
 * Single registry of the site's routes. It feeds next-intl's translated pathnames, the menus,
 * the sitemap, canonical URLs and hreflang, so those can never disagree.
 *
 * The key is the Spanish path, which is also the folder under src/app/[locale].
 * URLs are lowercase, with hyphens and without accents or trailing slash.
 */
type RouteDefinition = {
  /** English path, without the /en prefix. */
  readonly en: string;
  /** A page exists for this route. routes.test.ts checks it against the filesystem. */
  readonly built: boolean;
  /** Public: shown in menus, included in the sitemap and indexable. If false, the page is built but hidden (noindex). */
  readonly listed: boolean;
};

const { portfolio, guides, serviceSubpages } = siteConfig.features;

export const routeTable = {
  "/": { en: "/", built: true, listed: true },
  "/servicios": { en: "/services", built: true, listed: true },
  "/servicios/desarrollo": { en: "/services/development", built: true, listed: true },
  "/servicios/desarrollo/tiendas-online": { en: "/services/development/ecommerce", built: false, listed: serviceSubpages },
  "/servicios/desarrollo/software-a-la-medida": { en: "/services/development/custom-software", built: false, listed: serviceSubpages },
  "/servicios/diseno": { en: "/services/design", built: true, listed: true },
  "/servicios/video": { en: "/services/video", built: true, listed: true },
  "/servicios/minecraft": { en: "/services/minecraft", built: true, listed: true },
  "/servicios/minecraft/plugins": { en: "/services/minecraft/plugins", built: false, listed: serviceSubpages },
  "/servicios/minecraft/servidores": { en: "/services/minecraft/servers", built: false, listed: serviceSubpages },
  "/servicios/minecraft/tebex": { en: "/services/minecraft/tebex", built: false, listed: serviceSubpages },
  "/servicios/discord": { en: "/services/discord", built: true, listed: true },
  "/servicios/discord/bots": { en: "/services/discord/bots", built: false, listed: serviceSubpages },
  "/portafolio": { en: "/work", built: false, listed: portfolio },
  "/guias": { en: "/guides", built: false, listed: guides },
  "/nosotros": { en: "/about", built: true, listed: true },
  "/contacto": { en: "/contact", built: true, listed: true },
  "/legal/privacidad": { en: "/legal/privacy", built: false, listed: true },
  "/legal/terminos": { en: "/legal/terms", built: false, listed: true },
} as const satisfies Record<string, RouteDefinition>;

export type AppPathname = keyof typeof routeTable;

export const appPathnames = Object.keys(routeTable) as AppPathname[];

/** Translated pathnames in the shape next-intl expects. */
export const intlPathnames = Object.fromEntries(
  appPathnames.map((pathname) => [pathname, { es: pathname, en: routeTable[pathname].en }]),
) as Record<AppPathname, Record<AppLocale, string>>;

export function isBuilt(pathname: AppPathname): boolean {
  return routeTable[pathname].built;
}

export function isListed(pathname: AppPathname): boolean {
  return routeTable[pathname].listed;
}

/** Pages that exist and are public: the ones that go in the sitemap. */
export function publicPathnames(): AppPathname[] {
  return appPathnames.filter((pathname) => isBuilt(pathname) && isListed(pathname));
}

/** Path of a route in a language, as the visitor sees it: Spanish has no prefix, English lives under /en. */
export function localizedPath(pathname: AppPathname, locale: AppLocale): string {
  switch (locale) {
    case "es":
      return pathname;
    case "en": {
      const english = routeTable[pathname].en;
      return english === "/" ? "/en" : `/en${english}`;
    }
  }
}

/** Absolute URL on the site's origin (SITE_URL). The root has no trailing slash, like every other page. */
export function absoluteUrl(path: string, env: Env = process.env): string {
  if (!path.startsWith("/")) throw new Error(`absoluteUrl expects a path starting with "/": ${path}`);
  const origin = getSiteUrl(env);
  return path === "/" ? origin : `${origin}${path}`;
}

/** Pages from the home page down to `pathname`, for breadcrumbs: every parent path that is a route. */
export function breadcrumbTrail(pathname: AppPathname): AppPathname[] {
  const trail: AppPathname[] = ["/"];
  let current = "";
  for (const segment of pathname.split("/").filter(Boolean)) {
    current += `/${segment}`;
    if (current in routeTable) trail.push(current as AppPathname);
  }
  return trail;
}

export type FooterNotice = "minecraft" | "discord";

/**
 * Trademark notices of the footer. The Minecraft one is shown on the whole site (the lines are
 * named on every page); the Discord one on the Discord pages.
 */
export function footerNotices(pathname: string): FooterNotice[] {
  const discord = "/servicios/discord";
  return pathname === discord || pathname.startsWith(`${discord}/`) ? ["minecraft", "discord"] : ["minecraft"];
}

/** Short addresses that redirect (308) to a page, once that page is built. */
const shortLinks: Readonly<Record<string, AppPathname>> = { "/minecraft": "/servicios/minecraft" };

export function shortLinkRedirects(): { source: string; destination: string; permanent: true }[] {
  return Object.entries(shortLinks)
    .filter(([, target]) => isBuilt(target))
    .map(([source, destination]) => ({ source, destination, permanent: true }));
}

export type LanguageAlternates = Record<AppLocale | "x-default", string>;

/** hreflang set of a route: one URL per language plus x-default. The same on every language version. */
export function languageAlternates(pathname: AppPathname, env: Env = process.env): LanguageAlternates {
  const byLocale = Object.fromEntries(
    locales.map((locale) => [locale, absoluteUrl(localizedPath(pathname, locale), env)]),
  ) as Record<AppLocale, string>;
  return { ...byLocale, "x-default": byLocale[xDefaultLocale] };
}
