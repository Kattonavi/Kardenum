import type { MetadataRoute } from "next";
import { locales } from "../../i18n/locales";
import { absoluteUrl, languageAlternates, localizedPath, publicPathnames } from "../../routes";

/**
 * One entry per public page and language, each with its language alternatives
 * (es, en and x-default). Hidden pages (portfolio behind its flag) are left out.
 */
export function buildSitemapEntries(): MetadataRoute.Sitemap {
  return publicPathnames().flatMap((pathname) => {
    const languages = languageAlternates(pathname);
    return locales.map((locale) => ({
      url: absoluteUrl(localizedPath(pathname, locale)),
      alternates: { languages },
    }));
  });
}
