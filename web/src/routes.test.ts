import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { locales } from "@/i18n/locales";
import {
  absoluteUrl,
  appPathnames,
  intlPathnames,
  isListed,
  languageAlternates,
  localizedPath,
  publicPathnames,
  routeTable,
} from "@/routes";
import { siteConfig } from "@/site.config";

const appDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "app", "[locale]");

// seo-sitio.md §2.1: lowercase, hyphens, no accents, no trailing slash.
const SLUG_PATH = /^\/$|^(\/[a-z0-9]+(-[a-z0-9]+)*)+$/;

test("every path is lowercase with hyphens, without accents or trailing slash", () => {
  for (const pathname of appPathnames) {
    assert.match(pathname, SLUG_PATH, `Spanish path: ${pathname}`);
    assert.match(routeTable[pathname].en, SLUG_PATH, `English path of ${pathname}`);
  }
});

test("no two routes share a URL in the same language", () => {
  for (const locale of locales) {
    const urls = appPathnames.map((pathname) => localizedPath(pathname, locale));
    assert.equal(new Set(urls).size, urls.length, `duplicated ${locale} URL`);
  }
});

test("`built` matches the pages that exist under src/app/[locale]", () => {
  for (const pathname of appPathnames) {
    const pageFile = path.join(appDir, ...pathname.split("/").filter(Boolean), "page.tsx");
    assert.equal(
      routeTable[pathname].built,
      existsSync(pageFile),
      `${pathname}: built=${routeTable[pathname].built} but page.tsx ${existsSync(pageFile) ? "exists" : "does not exist"}`,
    );
  }
});

test("Spanish lives at the root and English under /en, with translated slugs", () => {
  assert.equal(localizedPath("/", "es"), "/");
  assert.equal(localizedPath("/", "en"), "/en");
  assert.equal(localizedPath("/servicios/desarrollo/tiendas-online", "es"), "/servicios/desarrollo/tiendas-online");
  assert.equal(localizedPath("/servicios/desarrollo/tiendas-online", "en"), "/en/services/development/ecommerce");
  assert.equal(localizedPath("/portafolio", "en"), "/en/work");
  assert.equal(localizedPath("/legal/privacidad", "en"), "/en/legal/privacy");
});

test("next-intl receives one translated pathname per route and language", () => {
  assert.deepEqual(Object.keys(intlPathnames), appPathnames);
  assert.deepEqual(intlPathnames["/servicios"], { es: "/servicios", en: "/services" });
});

test("hreflang: each language points to itself and x-default points to English", () => {
  assert.deepEqual(languageAlternates("/"), {
    es: "https://kardenum.com",
    en: "https://kardenum.com/en",
    "x-default": "https://kardenum.com/en",
  });
  assert.deepEqual(languageAlternates("/servicios/minecraft/servidores"), {
    es: "https://kardenum.com/servicios/minecraft/servidores",
    en: "https://kardenum.com/en/services/minecraft/servers",
    "x-default": "https://kardenum.com/en/services/minecraft/servers",
  });
});

test("absolute URLs use the single production origin", () => {
  assert.equal(absoluteUrl("/en/services"), `${siteConfig.url}/en/services`);
  assert.equal(new URL(siteConfig.url).protocol, "https:");
  assert.equal(siteConfig.url.endsWith("/"), false);
});

test("portfolio, guides and service sub-pages stay unlisted while their feature is off", () => {
  assert.equal(siteConfig.features.portfolio, false);
  assert.equal(isListed("/portafolio"), false);
  assert.equal(isListed("/guias"), false);
  assert.equal(isListed("/servicios/minecraft/plugins"), false);
  assert.equal(isListed("/servicios/minecraft"), true);
});

test("the sitemap set is exactly the pages that are built and listed", () => {
  const expected = appPathnames.filter((pathname) => routeTable[pathname].built && routeTable[pathname].listed);
  assert.deepEqual(publicPathnames(), expected);
  assert.ok(publicPathnames().includes("/"));
});
