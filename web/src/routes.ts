import { type AppLocale, isAppLocale, locales, xDefaultLocale } from "./i18n/locales";
import type { Env } from "./lib/indexing";
import { getSiteUrl } from "./lib/site-url";
import { type SiteConfig, siteConfig } from "./site.config";

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
  "/servicios/desarrollo/tiendas-online": { en: "/services/development/ecommerce", built: true, listed: serviceSubpages },
  "/servicios/desarrollo/software-a-la-medida": { en: "/services/development/custom-software", built: true, listed: serviceSubpages },
  "/servicios/diseno": { en: "/services/design", built: true, listed: true },
  "/servicios/video": { en: "/services/video", built: true, listed: true },
  "/servicios/minecraft": { en: "/services/minecraft", built: true, listed: true },
  "/servicios/minecraft/plugins": { en: "/services/minecraft/plugins", built: true, listed: serviceSubpages },
  "/servicios/minecraft/servidores": { en: "/services/minecraft/servers", built: true, listed: serviceSubpages },
  "/servicios/minecraft/tebex": { en: "/services/minecraft/tebex", built: true, listed: serviceSubpages },
  "/servicios/discord": { en: "/services/discord", built: true, listed: true },
  "/servicios/discord/bots": { en: "/services/discord/bots", built: true, listed: serviceSubpages },
  "/portafolio": { en: "/work", built: true, listed: portfolio },
  "/guias": { en: "/guides", built: false, listed: guides },
  "/nosotros": { en: "/about", built: true, listed: true },
  "/contacto": { en: "/contact", built: true, listed: true },
  "/legal/privacidad": { en: "/legal/privacy", built: true, listed: true },
  "/legal/terminos": { en: "/legal/terms", built: true, listed: true },
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

/** Every page that exists, public or hidden: the ones the tests visit. */
export function builtPathnames(): AppPathname[] {
  return appPathnames.filter(isBuilt);
}

/** Pages that exist behind a feature that is off: reachable by their address, never linked, listed or indexed. */
export function hiddenPathnames(): AppPathname[] {
  return appPathnames.filter((pathname) => isBuilt(pathname) && !isListed(pathname));
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

export function isAppPathname(value: string): value is AppPathname {
  return Object.hasOwn(routeTable, value);
}

/**
 * Address of the page on screen in another language, for the ES / EN links and the language bar.
 * It is the final address: next-intl's Link would add "/es" when a locale is passed, which only
 * works through a redirect. A path outside the registry leads to that language's home page.
 */
export function pathInLocale(pathname: string, locale: AppLocale): string {
  return localizedPath(isAppPathname(pathname) ? pathname : "/", locale);
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

/** Short addresses that lead to a page of the site. */
const shortLinks: Readonly<Record<string, AppPathname>> = { "/minecraft": "/servicios/minecraft" };

export type ShortLinkRedirect = { readonly source: string; readonly destination: string; readonly permanent: boolean };

/** An address outside the site that a redirect may point to: https only. Anything else is a mistake in site.config.ts. */
function externalHttpsUrl(value: string): string {
  let url: URL | null = null;
  try {
    url = new URL(value);
  } catch {
    // reported below
  }
  if (!url || url.protocol !== "https:") throw new Error(`A short link can only lead to an https address, got "${value}".`);
  return url.href;
}

/**
 * Short addresses that redirect (seo-sitio.md §2.1):
 * - /minecraft → its page, permanently (308), once that page is built;
 * - /discord → the invitation to the studio's Discord server, once it exists in site.config.ts.
 *   Temporary (307): an invitation can be replaced, and browsers keep a permanent redirect for good.
 *   Until then /discord is not an address of the site. It never goes in the sitemap.
 */
export function shortLinkRedirects(config: SiteConfig = siteConfig): ShortLinkRedirect[] {
  const pages: ShortLinkRedirect[] = Object.entries(shortLinks)
    .filter(([, target]) => isBuilt(target))
    .map(([source, destination]) => ({ source, destination, permanent: true }));
  const { discordInvite } = config.contact;
  if (discordInvite.status !== "ready") return pages;
  return [...pages, { source: "/discord", destination: externalHttpsUrl(discordInvite.value), permanent: false }];
}

export type LanguageAlternates = Record<AppLocale | "x-default", string>;

/** Address of a page in each language, as the visitor sees it. */
export type LocalizedPaths = Readonly<Record<AppLocale, string>>;

/** hreflang set of a page from its address in each language: one URL per language plus x-default. */
export function alternatesOf(paths: LocalizedPaths, env: Env = process.env): LanguageAlternates {
  const byLocale = Object.fromEntries(locales.map((locale) => [locale, absoluteUrl(paths[locale], env)])) as Record<AppLocale, string>;
  return { ...byLocale, "x-default": byLocale[xDefaultLocale] };
}

/** hreflang set of a route: one URL per language plus x-default. The same on every language version. */
export function languageAlternates(pathname: AppPathname, env: Env = process.env): LanguageAlternates {
  return alternatesOf(routePaths(pathname), env);
}

/** Address of a route in each language. */
export function routePaths(pathname: AppPathname): LocalizedPaths {
  return Object.fromEntries(locales.map((locale) => [locale, localizedPath(pathname, locale)])) as Record<AppLocale, string>;
}

// ---------------------------------------------------------------------------------------------
// Collections: one template, one page per entry, with its own slug in each language
// (/portafolio/kardenum <-> /en/work/kardenum). The templates stay out of `routeTable`, so
// `AppPathname` (and AppLink) only ever names fixed pages. The entries themselves come from the
// content and are listed in src/lib/entries.ts, a server module: this file reaches the browser.
// ---------------------------------------------------------------------------------------------

type CollectionDefinition = {
  /** English template, without the /en prefix. */
  readonly en: string;
  /** Fixed page that lists the entries: their parent in breadcrumbs and the flag that makes them public. */
  readonly index: AppPathname;
};

/** The key is the Spanish template, which is also the folder under src/app/[locale]. */
export const collectionTable = {
  "/portafolio/[slug]": { en: "/work/[slug]", index: "/portafolio" },
} as const satisfies Record<string, CollectionDefinition>;

export type CollectionPathname = keyof typeof collectionTable;

export const collectionPathnames = Object.keys(collectionTable) as CollectionPathname[];

/** Translated templates in the shape next-intl expects; src/i18n/routing.ts adds them to the fixed ones. */
export const intlCollectionPathnames = Object.fromEntries(
  collectionPathnames.map((template) => [template, { es: template, en: collectionTable[template].en }]),
) as Record<CollectionPathname, Record<AppLocale, string>>;

/** Address of an entry in a language, as the visitor sees it: the single source for links, sitemap, canonical and tests. */
export function entryPath(collection: CollectionPathname, slug: Readonly<Record<AppLocale, string>>, locale: AppLocale): string {
  const template = locale === "es" ? collection : `/en${collectionTable[collection].en}`;
  return template.replace("[slug]", slug[locale]);
}

/** Address of an entry in each language. */
export function entryPaths(collection: CollectionPathname, slug: Readonly<Record<AppLocale, string>>): LocalizedPaths {
  return Object.fromEntries(locales.map((locale) => [locale, entryPath(collection, slug, locale)])) as Record<AppLocale, string>;
}

/**
 * Addresses in each language of the entries that are built, by language and slug ("en/kardenum").
 * The header gets it from the server: on an entry page the path does not say which entry is on
 * screen, its `slug` parameter does (useParams).
 */
export type EntryLinks = Readonly<Record<string, LocalizedPaths>>;

export function entryLinkKey(locale: AppLocale, slug: string): string {
  return `${locale}/${slug}`;
}

/** Route parameters as useParams() returns them. */
export type RouteParams = Readonly<Record<string, string | string[] | undefined>>;

/**
 * Address of the page on screen in `target`: the same entry when an entry is on screen,
 * otherwise the same fixed page (pathInLocale).
 */
export function languageHref(pathname: string, params: RouteParams | null, entries: EntryLinks, target: AppLocale): string {
  const { locale, slug } = params ?? {};
  if (typeof locale === "string" && typeof slug === "string" && isAppLocale(locale)) {
    const entry = entries[entryLinkKey(locale, slug)];
    if (entry) return entry[target];
  }
  return pathInLocale(pathname, target);
}
