import { type AppLocale, locales } from "../../i18n/locales";
import { type AppPathname, absoluteUrl, localizedPath } from "../../routes";
import { type SiteConfig, siteConfig } from "../../site.config";

/**
 * Structured data builders (seo-sitio.md §2.5). Pending data is left out, never written as a
 * placeholder. FAQPage and self-published reviews are not used on purpose.
 */
export type JsonLdNode = { readonly "@type": string } & Readonly<Record<string, unknown>>;

// Computed on each call: the origin comes from SITE_URL.
const organizationId = () => absoluteUrl("/#organization");
const LANGUAGE_NAME: Record<AppLocale, string> = { es: "Spanish", en: "English" };

export function organizationJsonLd(locale: AppLocale, config: SiteConfig = siteConfig): JsonLdNode {
  const { email } = config.contact;
  return {
    "@type": "Organization",
    "@id": organizationId(),
    name: config.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo.png"),
    knowsLanguage: [...locales],
    ...(config.profiles.length > 0 ? { sameAs: [...config.profiles] } : {}),
    ...(email.status === "ready"
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            email: email.value,
            availableLanguage: locales.map((language) => LANGUAGE_NAME[language]),
          },
        }
      : {}),
  };
}

/** One site in two languages: the same node, with the same @id, on both home pages. */
export function websiteJsonLd(config: SiteConfig = siteConfig): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: config.name,
    url: absoluteUrl("/"),
    inLanguage: [...locales],
    publisher: { "@id": organizationId() },
  };
}

export type Crumb = { readonly name: string; readonly pathname: AppPathname };

/** Path of an inner page, from the home page down to the page itself. */
export function breadcrumbJsonLd(locale: AppLocale, crumbs: readonly Crumb[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(localizedPath(crumb.pathname, locale)),
    })),
  };
}

export function serviceJsonLd(
  locale: AppLocale,
  service: { readonly name: string; readonly description: string; readonly pathname: AppPathname },
  config: SiteConfig = siteConfig,
): JsonLdNode {
  return {
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: absoluteUrl(localizedPath(service.pathname, locale)),
    // Named here too: the full Organization node lives on the home page, and each page is read on its own.
    provider: { "@type": "Organization", "@id": organizationId(), name: config.name, url: absoluteUrl("/") },
    // schema.org: the languages belong to the channel through which the service is requested, not to Service.
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl(localizedPath("/contacto", locale)),
      availableLanguage: locales.map((language) => LANGUAGE_NAME[language]),
    },
  };
}

/** One JSON-LD document for a page. "<" is escaped so the content can never close the script tag. */
export function serializeJsonLd(nodes: readonly JsonLdNode[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(/</g, "\\u003c");
}
