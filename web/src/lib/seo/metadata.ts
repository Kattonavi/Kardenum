import type { Metadata } from "next";
import { getPageMeta } from "../../content/pages";
import { type AppLocale, locales } from "../../i18n/locales";
import { type AppPathname, absoluteUrl, intlPathnames, isListed, languageAlternates } from "../../routes";
import { siteConfig } from "../../site.config";
import { type Env, isSiteIndexable } from "../indexing";

/** Open Graph locale codes. Regional codes that do not single out a country. */
const OG_LOCALE: Record<AppLocale, string> = { es: "es_LA", en: "en_US" };

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

const HOME_IMAGE_SLUG: Record<AppLocale, string> = { es: "inicio", en: "home" };

// The social image sets its title in one row per line, in expanded capitals (about 0.9 em per
// character), between OG_TITLE_SIZE.min and .max pixels.
export const OG_PADDING_X = 72;
const OG_CHARACTER_WIDTH = 0.9;
export const OG_TITLE_SIZE = { min: 40, max: 76 } as const;

/** Longest line the image can show whole. content.test.ts keeps every page under it. */
export const MAX_OG_LINE_LENGTH = Math.floor((OG_IMAGE_SIZE.width - OG_PADDING_X * 2) / (OG_TITLE_SIZE.min * OG_CHARACTER_WIDTH));

/** Largest title size at which the longest line still fits in one row. */
export function ogTitleFontSize(lines: readonly string[]): number {
  const longest = Math.max(...lines.map((line) => line.length), 1);
  const fit = Math.floor((OG_IMAGE_SIZE.width - OG_PADDING_X * 2) / (longest * OG_CHARACTER_WIDTH));
  return Math.max(OG_TITLE_SIZE.min, Math.min(OG_TITLE_SIZE.max, fit));
}

/** File name of a page's social image, in the page's language: "inicio.png", "services-development.png". */
export function ogImageName(pathname: AppPathname, locale: AppLocale): string {
  const path = intlPathnames[pathname][locale];
  const slug = path === "/" ? HOME_IMAGE_SLUG[locale] : path.slice(1).replaceAll("/", "-");
  return `${slug}.png`;
}

/** Path of a page's social image. The ".png" keeps it out of the locale proxy. */
export function ogImagePath(pathname: AppPathname, locale: AppLocale): string {
  return `/og/${locale}/${ogImageName(pathname, locale)}`;
}

/**
 * Metadata of a page in one language: unique title and description, its own canonical,
 * hreflang (es, en and x-default pointing to English) and the social image.
 * Every page calls this from generateMetadata; nothing here is inherited from the layout,
 * so a page can never end up with another page's canonical.
 */
export function buildPageMetadata(pathname: AppPathname, locale: AppLocale, env: Env = process.env): Metadata {
  const meta = getPageMeta(pathname);
  const title = meta.title[locale];
  const description = meta.description[locale];
  const alternates = languageAlternates(pathname, env);
  const canonical = alternates[locale];
  const image = absoluteUrl(ogImagePath(pathname, locale), env);
  const indexable = isSiteIndexable(env) && isListed(pathname);

  return {
    title,
    description,
    alternates: { canonical, languages: alternates },
    // Hidden pages (portfolio behind its flag, for example) stay noindex even after launch.
    robots: indexable ? undefined : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url: canonical,
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((other) => other !== locale).map((other) => OG_LOCALE[other]),
      images: [{ url: image, ...OG_IMAGE_SIZE, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
