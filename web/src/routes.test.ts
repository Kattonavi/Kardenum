import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { locales } from "@/i18n/locales";
import {
  absoluteUrl,
  appPathnames,
  breadcrumbTrail,
  footerNotices,
  intlPathnames,
  isAppPathname,
  builtPathnames,
  hiddenPathnames,
  isListed,
  languageAlternates,
  localizedPath,
  pathInLocale,
  publicPathnames,
  routeTable,
  shortLinkRedirects,
} from "@/routes";
import { type SiteConfig, siteConfig } from "@/site.config";

// These tests describe the production origin: ignore the SITE_URL of the machine running them.
delete process.env.SITE_URL;

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

test("a built page behind a feature that is off is hidden: it exists, and it is not public", () => {
  const hidden = hiddenPathnames();
  assert.ok(hidden.includes("/servicios/minecraft/plugins"));
  assert.equal(hidden.length, 6, "the six service sub-pages");
  for (const pathname of hidden) {
    assert.ok(builtPathnames().includes(pathname));
    assert.ok(!publicPathnames().includes(pathname), `${pathname} is in the sitemap`);
  }
  assert.deepEqual([...publicPathnames(), ...hidden].sort(), [...builtPathnames()].sort());
});

test("the sitemap set is exactly the pages that are built and listed", () => {
  const expected = appPathnames.filter((pathname) => routeTable[pathname].built && routeTable[pathname].listed);
  assert.deepEqual(publicPathnames(), expected);
  assert.ok(publicPathnames().includes("/"));
});

test("language links go to the final address of the same page, never through a redirect", () => {
  assert.equal(pathInLocale("/", "es"), "/");
  assert.equal(pathInLocale("/", "en"), "/en");
  assert.equal(pathInLocale("/servicios/desarrollo", "es"), "/servicios/desarrollo");
  assert.equal(pathInLocale("/servicios/desarrollo", "en"), "/en/services/development");
  assert.equal(pathInLocale("/nosotros", "en"), "/en/about");
  for (const pathname of appPathnames) {
    assert.equal(pathInLocale(pathname, "es").startsWith("/es"), false, pathname);
  }
  // A path outside the registry (it should never reach the header) leads to that language's home page.
  for (const unknown of ["/no-existe", "", "constructor", "/en/services"]) {
    assert.equal(pathInLocale(unknown, "es"), "/");
    assert.equal(pathInLocale(unknown, "en"), "/en");
  }
});

test("breadcrumbs list every parent page that exists; trademark notices follow the section", () => {
  assert.deepEqual(breadcrumbTrail("/"), ["/"]);
  assert.deepEqual(breadcrumbTrail("/contacto"), ["/", "/contacto"]);
  assert.deepEqual(breadcrumbTrail("/servicios/minecraft/tebex"), ["/", "/servicios", "/servicios/minecraft", "/servicios/minecraft/tebex"]);
  // "/legal" is not a page: the trail skips it.
  assert.deepEqual(breadcrumbTrail("/legal/privacidad"), ["/", "/legal/privacidad"]);

  assert.deepEqual(footerNotices("/"), ["minecraft"]);
  assert.deepEqual(footerNotices("/servicios/minecraft"), ["minecraft"]);
  assert.deepEqual(footerNotices("/servicios/discord"), ["minecraft", "discord"]);
  assert.deepEqual(footerNotices("/servicios/discord/bots"), ["minecraft", "discord"]);
  assert.deepEqual(footerNotices("/servicios/discordia"), ["minecraft"]);
});

const withDiscord = (invite: string): SiteConfig => ({
  ...siteConfig,
  contact: { ...siteConfig.contact, discordInvite: { status: "ready", value: invite } },
});
const withoutDiscord: SiteConfig = {
  ...siteConfig,
  contact: { ...siteConfig.contact, discordInvite: { status: "pending", placeholder: "[Discord]" } },
};

test("short links to pages are permanent and only lead to pages that exist", () => {
  const pages = shortLinkRedirects(withoutDiscord);
  for (const redirect of pages) {
    assert.equal(redirect.permanent, true);
    assert.ok(isAppPathname(redirect.destination) && routeTable[redirect.destination].built, redirect.destination);
    assert.equal(isAppPathname(redirect.source), false, `${redirect.source} is already a page`);
  }
  assert.deepEqual(
    pages.map((redirect) => [redirect.source, redirect.destination]),
    [["/minecraft", "/servicios/minecraft"]],
  );
});

test("/discord leads to the invitation once it exists, with a temporary redirect", () => {
  assert.equal(shortLinkRedirects(withoutDiscord).some((redirect) => redirect.source === "/discord"), false);
  const discord = shortLinkRedirects(withDiscord("https://discord.gg/ejemplo")).find((redirect) => redirect.source === "/discord");
  assert.deepEqual(discord, { source: "/discord", destination: "https://discord.gg/ejemplo", permanent: false });
  // /discord is never a page of the site, so it cannot reach the sitemap.
  assert.equal(isAppPathname("/discord"), false);
});

test("a short link never leads to anything but an https address", () => {
  for (const wrong of ["http://discord.gg/ejemplo", "javascript:alert(1)", "//discord.gg/ejemplo", "discord.gg/ejemplo", ""]) {
    assert.throws(() => shortLinkRedirects(withDiscord(wrong)), /https address/, wrong);
  }
});
