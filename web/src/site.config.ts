import type { Localized } from "./i18n/locales";

/**
 * Brand name and data of the studio, in one place.
 *
 * Data that does not exist yet is `pending`: it is shown as a bracketed placeholder and is never
 * invented. When a value is defined, replace it with `{ status: "ready", value: "..." }`.
 * A build with SITE_INDEXABLE=true fails while any contact value is pending (src/lib/launch.ts).
 */
export type Pending = { readonly status: "pending"; readonly placeholder: string };
export type Ready<T> = { readonly status: "ready"; readonly value: T };
export type Provided<T> = Pending | Ready<T>;

function pending(placeholder: string): Pending {
  return { status: "pending", placeholder };
}

export type SiteConfig = {
  readonly name: string;
  /**
   * Production origin: the default of SITE_URL and the only origin an indexable build accepts.
   * Absolute URLs are built with getSiteUrl() (src/lib/site-url.ts), never from this field directly.
   */
  readonly url: string;
  /** What the studio is, for titles and SEO. */
  readonly descriptor: Localized<string>;
  readonly contact: {
    /** Contact e-mail address. */
    readonly email: Provided<string>;
    /** WhatsApp number in international format, digits only (used as https://wa.me/<number>). */
    readonly whatsapp: Provided<string>;
    /** Permanent invite URL to the studio's Discord server (also the target of /discord). */
    readonly discordInvite: Provided<string>;
  };
  /** Official profiles for JSON-LD `sameAs`. Only real, existing profiles. */
  readonly profiles: readonly string[];
  /** Sections that are built but stay out of menus and the sitemap, with noindex, until they have real content. */
  readonly features: {
    /** Goes public with at least one piece per service line. */
    readonly portfolio: boolean;
    readonly guides: boolean;
    /** The service sub-pages (online stores, custom software, plugins, servers, Tebex, bots). */
    readonly serviceSubpages: boolean;
  };
};

export const siteConfig: SiteConfig = {
  name: "Kardenum",
  url: "https://kardenum.com",
  descriptor: {
    es: "Estudio de desarrollo, diseño y video",
    en: "Software, design and video studio",
  },
  contact: {
    email: pending("[correo@kardenum.com]"),
    whatsapp: pending("[WhatsApp]"),
    discordInvite: pending("[Discord]"),
  },
  profiles: [],
  features: {
    portfolio: false,
    guides: false,
    serviceSubpages: false,
  },
};
