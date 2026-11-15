import type { MetadataRoute } from "next";
import { portfolioCases } from "../../content/cases";
import type { PortfolioCase } from "../../content/types";
import { locales } from "../../i18n/locales";
import type { Env } from "../indexing";
import { absoluteUrl, alternatesOf, languageAlternates, localizedPath, publicPathnames } from "../../routes";
import { pathsOfEntry, publicEntries } from "../entries";

/**
 * One entry per public page and language, each with its language alternatives
 * (es, en and x-default), plus the public entries of the collections. Hidden pages and entries
 * (portfolio behind its flag) are left out.
 */
export function buildSitemapEntries(env: Env = process.env, cases: readonly PortfolioCase[] = portfolioCases): MetadataRoute.Sitemap {
  const pages = publicPathnames().flatMap((pathname) => {
    const languages = languageAlternates(pathname, env);
    return locales.map((locale) => ({
      url: absoluteUrl(localizedPath(pathname, locale), env),
      alternates: { languages },
    }));
  });
  // Entries of a collection (portfolio cases) once their collection is public.
  const entries = publicEntries(cases).flatMap((entry) => {
    const paths = pathsOfEntry(entry);
    const languages = alternatesOf(paths, env);
    return locales.map((locale) => ({ url: absoluteUrl(paths[locale], env), alternates: { languages } }));
  });
  return [...pages, ...entries];
}
