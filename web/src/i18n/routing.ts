import { defineRouting } from "next-intl/routing";
import { intlCollectionPathnames, intlPathnames } from "../routes";
import { defaultLocale, locales } from "./locales";

export const routing = defineRouting({
  locales,
  // Spanish is the main language and lives at the root; English lives under /en.
  defaultLocale,
  localePrefix: "as-needed",
  // No redirect by browser language or cookie (Google's recommendation): "/" always answers in Spanish.
  // The language bar offers the other version and remembers the choice (src/components/layout/language-bar.tsx).
  localeDetection: false,
  localeCookie: false,
  // hreflang is emitted from page metadata, because x-default must point to English.
  alternateLinks: false,
  // Translated slugs come from the route registry (src/routes.ts): /servicios <-> /en/services,
  // and the templates of the collections: /portafolio/[slug] <-> /en/work/[slug].
  pathnames: { ...intlPathnames, ...intlCollectionPathnames },
});

export type { AppLocale } from "./locales";
