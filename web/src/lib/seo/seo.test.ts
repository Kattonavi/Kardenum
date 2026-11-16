import assert from "node:assert/strict";
import { test } from "node:test";
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  serializeJsonLd,
  serviceJsonLd,
  websiteJsonLd,
} from "@/lib/seo/json-ld";
import { buildPageMetadata, ogImageName, ogImagePath } from "@/lib/seo/metadata";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { hasPageMeta } from "@/content/pages";
import { publicEntries } from "@/lib/entries";
import { type AppPathname, isListed, publicPathnames } from "@/routes";
import { type SiteConfig, siteConfig } from "@/site.config";

// These tests describe the production origin: ignore the SITE_URL of the machine running them.
delete process.env.SITE_URL;

const closed = { SITE_INDEXABLE: "false" };
const open = { SITE_INDEXABLE: "true" };

test("each language version has its own canonical and the same hreflang set (x-default is English)", () => {
  const es = buildPageMetadata("/", "es", closed);
  const en = buildPageMetadata("/", "en", closed);
  const languages = { es: "https://kardenum.com", en: "https://kardenum.com/en", "x-default": "https://kardenum.com/en" };

  assert.equal(es.alternates?.canonical, "https://kardenum.com");
  assert.equal(en.alternates?.canonical, "https://kardenum.com/en");
  assert.deepEqual(es.alternates?.languages, languages);
  assert.deepEqual(en.alternates?.languages, languages);
});

test("title and description differ between languages", () => {
  const es = buildPageMetadata("/", "es", closed);
  const en = buildPageMetadata("/", "en", closed);
  assert.notEqual(es.title, en.title);
  assert.notEqual(es.description, en.description);
  assert.equal(es.title, "Kardenum — estudio de desarrollo, diseño y video");
});

test("pages are noindex until the site is indexable", () => {
  assert.deepEqual(buildPageMetadata("/", "es", closed).robots, { index: false, follow: false });
  assert.deepEqual(buildPageMetadata("/", "es", {}).robots, { index: false, follow: false });
  assert.equal(buildPageMetadata("/", "es", open).robots, undefined);
});

test("the social image is per page and language, on the production origin", () => {
  const es = buildPageMetadata("/", "es", closed);
  const en = buildPageMetadata("/", "en", closed);
  assert.deepEqual(es.openGraph?.images, [{ url: "https://kardenum.com/og/es/inicio.png", width: 1200, height: 630, alt: es.title }]);
  assert.deepEqual(en.openGraph?.images, [{ url: "https://kardenum.com/og/en/home.png", width: 1200, height: 630, alt: en.title }]);
  assert.equal(ogImageName("/servicios/desarrollo", "es"), "servicios-desarrollo.png");
  assert.equal(ogImageName("/servicios/desarrollo", "en"), "services-development.png");
  assert.equal(ogImagePath("/servicios/minecraft/tebex", "en"), "/og/en/services-minecraft-tebex.png");
});

test("a page without texts cannot get metadata by accident", () => {
  // A route added to the registry without its texts must fail the build, not borrow another page's title.
  // Every real route has its texts now, so the route here is one that does not exist.
  const withoutTexts = "/ruta-sin-textos" as AppPathname;
  assert.equal(hasPageMeta(withoutTexts), false);
  assert.throws(() => buildPageMetadata(withoutTexts, "es", closed), /No page meta/);
});

test("the sitemap lists every public page in both languages with its alternatives", () => {
  const entries = buildSitemapEntries();
  // Pages plus the public entries of the collections (portfolio cases once the portfolio is on).
  assert.equal(entries.length, (publicPathnames().length + publicEntries().length) * 2);
  const home = entries.find((entry) => entry.url === "https://kardenum.com");
  assert.ok(home);
  assert.deepEqual(home.alternates?.languages, {
    es: "https://kardenum.com",
    en: "https://kardenum.com/en",
    "x-default": "https://kardenum.com/en",
  });
  assert.ok(entries.some((entry) => entry.url === "https://kardenum.com/en"));
  // Hidden sections are not in the sitemap; each one follows its flag, as in routes.test.ts.
  const { portfolio, guides } = siteConfig.features;
  for (const entry of entries) {
    if (!portfolio) assert.doesNotMatch(entry.url, /portafolio|\/work/, "the portfolio is hidden: not in the sitemap");
    if (!guides) assert.doesNotMatch(entry.url, /guias|guides/, "the guides are hidden: not in the sitemap");
  }
  assert.equal(entries.some((entry) => entry.url.endsWith("/portafolio")), portfolio && isListed("/portafolio"));
});

test("Organization leaves pending data out instead of publishing placeholders", () => {
  const organization = organizationJsonLd("es");
  assert.equal(organization["@type"], "Organization");
  assert.equal(organization.name, "Kardenum");
  assert.equal(organization.url, "https://kardenum.com");
  assert.equal(organization.logo, "https://kardenum.com/logo.png");
  assert.equal("contactPoint" in organization, false);
  assert.equal("sameAs" in organization, false);
  // No bracketed placeholder ("[correo@kardenum.com]") inside any string of the document.
  assert.doesNotMatch(serializeJsonLd([organization, websiteJsonLd()]), /"\[[^"]*\]"|correo@|pending/);
});

test("Organization includes e-mail and profiles once they exist", () => {
  const ready: SiteConfig = {
    ...siteConfig,
    profiles: ["https://github.com/example"],
    contact: { ...siteConfig.contact, email: { status: "ready", value: "hola@example.com" } },
  };
  const organization = organizationJsonLd("en", ready);
  assert.deepEqual(organization.sameAs, ["https://github.com/example"]);
  assert.deepEqual(organization.contactPoint, {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "hola@example.com",
    availableLanguage: ["Spanish", "English"],
  });
});

test("WebSite is one node for the two languages, published by the organization", () => {
  const website = websiteJsonLd();
  assert.equal(website["@id"], "https://kardenum.com/#website");
  assert.equal(website.url, "https://kardenum.com");
  assert.deepEqual(website.inLanguage, ["es", "en"]);
  assert.deepEqual(website.publisher, { "@id": "https://kardenum.com/#organization" });
});

test("Organization says the same in both languages: one entity, one description of it", () => {
  assert.deepEqual(organizationJsonLd("es"), organizationJsonLd("en"));
});

test("the languages of a service hang from its channel, where schema.org defines them", () => {
  const service = serviceJsonLd("en", { name: "Minecraft", description: "Plugins.", pathname: "/servicios/minecraft" });
  assert.equal("availableLanguage" in service, false);
  assert.deepEqual(service.availableChannel, { "@type": "ServiceChannel", serviceUrl: "https://kardenum.com/en/contact", availableLanguage: ["Spanish", "English"] });
});

test("BreadcrumbList numbers the path and uses the URLs of the page's language", () => {
  const crumbs = breadcrumbJsonLd("en", [
    { name: "Home", pathname: "/" },
    { name: "Services", pathname: "/servicios" },
    { name: "Minecraft", pathname: "/servicios/minecraft" },
  ]);
  assert.deepEqual(crumbs.itemListElement, [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://kardenum.com/en" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://kardenum.com/en/services" },
    { "@type": "ListItem", position: 3, name: "Minecraft", item: "https://kardenum.com/en/services/minecraft" },
  ]);
});

test("Service points to the organization as provider", () => {
  const service = serviceJsonLd("es", { name: "Plugins de Minecraft", description: "Desarrollo de plugins.", pathname: "/servicios/minecraft/plugins" });
  assert.equal(service.url, "https://kardenum.com/servicios/minecraft/plugins");
  assert.deepEqual(service.provider, { "@type": "Organization", "@id": "https://kardenum.com/#organization", name: "Kardenum", url: "https://kardenum.com" });
});

test("serialized JSON-LD is valid JSON and cannot close its script tag", () => {
  const json = serializeJsonLd([{ "@type": "Thing", name: "</script><script>alert(1)</script>" }]);
  assert.doesNotMatch(json, /</);
  const parsed = JSON.parse(json);
  assert.equal(parsed["@context"], "https://schema.org");
  assert.equal(parsed["@graph"][0].name, "</script><script>alert(1)</script>");
});
