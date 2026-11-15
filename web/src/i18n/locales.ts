/** Languages of the site. Spanish is the main one (root); English lives under /en. */
export const locales = ["es", "en"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "es";

/** hreflang x-default points to English: the most useful version for someone who speaks neither language. */
export const xDefaultLocale: AppLocale = "en";

export type Localized<T> = Readonly<Record<AppLocale, T>>;

export function otherLocale(locale: AppLocale): AppLocale {
  return locale === "es" ? "en" : "es";
}
