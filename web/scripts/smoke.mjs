// Smoke test against a running server (local or Railway).
//   pnpm smoke <baseUrl> [--expect=noindex|indexable]
// Default expectation is "noindex": the state the site must keep until launch.
// It reads the route registry and the page texts from src/, so every public page is checked
// in both languages without listing URLs here. Exits with code 1 if any check fails.
import { readFileSync } from "node:fs";
import { homeFaqs } from "@/content/home";
import { getPageMeta, getPageName } from "@/content/pages";
import { serviceLines } from "@/content/service-lines";
import { subpages } from "@/content/subpages";
import { locales } from "@/i18n/locales";
import { securityHeaders } from "@/lib/security-headers";
import { ogImagePath } from "@/lib/seo/metadata";
import { getSiteUrl } from "@/lib/site-url";
import {
  absoluteUrl,
  breadcrumbTrail,
  builtPathnames,
  footerNotices,
  hiddenPathnames,
  isListed,
  languageAlternates,
  localizedPath,
  publicPathnames,
  routeTable,
  shortLinkRedirects,
} from "@/routes";
import { siteConfig } from "@/site.config";

const args = process.argv.slice(2);
const baseArg = args.find((a) => !a.startsWith("--"));
const expectArg = args.find((a) => a.startsWith("--expect="));
const expectMode = expectArg ? expectArg.split("=")[1] : "noindex";
const siteUrlArg = args.find((a) => a.startsWith("--site-url="));

if (!baseArg || !["noindex", "indexable"].includes(expectMode)) {
  console.error("Usage: pnpm smoke <baseUrl> [--expect=noindex|indexable] [--site-url=<origin>|self]");
  process.exit(2);
}

// The origin the server under test was built with (its SITE_URL). Canonical, hreflang, og:image,
// sitemap and JSON-LD are expected on it. "self" means the address being tested; without the
// flag it is this shell's SITE_URL or the production domain.
if (siteUrlArg) {
  const value = siteUrlArg.slice("--site-url=".length);
  process.env.SITE_URL = value === "self" ? new URL(baseArg).origin : value;
}

const base = new URL(baseArg);
const noindex = expectMode === "noindex";
let failures = 0;
let passes = 0;

function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
  if (ok) passes += 1;
  else failures += 1;
}

async function get(pathname, headers = {}) {
  const res = await fetch(new URL(pathname, base), { redirect: "manual", headers });
  const body = await res.text();
  return { res, body };
}

function robotsHeaderOk(res) {
  const value = (res.headers.get("x-robots-tag") ?? "").toLowerCase();
  return noindex ? value.includes("noindex") : !value.includes("noindex");
}

const ENTITIES = { "&amp;": "&", "&quot;": '"', "&#x27;": "'", "&#39;": "'", "&lt;": "<", "&gt;": ">" };
const decode = (text) => text.replace(/&(amp|quot|#x27|#39|lt|gt);/g, (entity) => ENTITIES[entity]);

/** Attributes of every <link> and <meta> tag of a document, lowercased names. */
function headTags(html) {
  const tags = [];
  for (const [, name, raw] of html.matchAll(/<(link|meta)\b([^>]*)>/gi)) {
    const attrs = {};
    for (const [, key, value] of raw.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)) attrs[key.toLowerCase()] = decode(value);
    tags.push({ name: name.toLowerCase(), attrs });
  }
  return tags;
}

const count = (html, re) => (html.match(re) ?? []).length;

/** What the visitor gets without JavaScript: the markup, without the data Next serializes in <script>. */
const rendered = (html) => decode(html.replace(/<script\b[\s\S]*?<\/script>/g, ""));

// ---------------------------------------------------------------------------------------------
// 1. Home: 200 in Spanish, no redirect (Railway healthcheck hits "/").
// ---------------------------------------------------------------------------------------------
const home = await get("/");
check("GET / -> 200", home.res.status === 200, `status ${home.res.status}`);
check("GET / has no Location header", !home.res.headers.has("location"));
check('GET / is <html lang="es">', /<html[^>]*\blang="es"/.test(home.body));
check(
  `GET / X-Robots-Tag ${noindex ? "has" : "lacks"} noindex`,
  robotsHeaderOk(home.res),
  home.res.headers.get("x-robots-tag") ?? "no header",
);

// A browser asking for English, or carrying a stale locale cookie, still gets the Spanish root.
const homeEn = await get("/", { "accept-language": "en-US,en;q=0.9" });
check("GET / (Accept-Language: en) -> 200 without redirect", homeEn.res.status === 200 && !homeEn.res.headers.has("location"), `status ${homeEn.res.status}`);
const homeCookie = await get("/", { cookie: "NEXT_LOCALE=en; kardenum_lang=en" });
check("GET / (language cookies set to en) -> 200 without redirect", homeCookie.res.status === 200 && !homeCookie.res.headers.has("location"), `status ${homeCookie.res.status}`);
check("GET / sets no cookie", !home.res.headers.has("set-cookie"), home.res.headers.get("set-cookie") ?? "");

// The Spanish prefix is not a second URL for the same page.
const esPrefixed = await get("/es");
check(
  "GET /es redirects permanently (308) to /",
  esPrefixed.res.status === 308 && new URL(esPrefixed.res.headers.get("location") ?? "x:", base).pathname === "/",
  `status ${esPrefixed.res.status} -> ${esPrefixed.res.headers.get("location")}`,
);
check(`GET /es redirect X-Robots-Tag ${noindex ? "has" : "lacks"} noindex`, robotsHeaderOk(esPrefixed.res));

// ---------------------------------------------------------------------------------------------
// 2. Every built page, in both languages: structure and technical SEO (seo-sitio.md §2).
//    A page behind a feature that is off is built but hidden: it answers at its address with
//    noindex even on the open site, it is not in the sitemap and no public page links to it.
// ---------------------------------------------------------------------------------------------
const seenTitles = new Set();
const seenDescriptions = new Set();
const hiddenPaths = new Set(hiddenPathnames().flatMap((pathname) => locales.map((locale) => localizedPath(pathname, locale))));

for (const pathname of builtPathnames()) {
  const alternates = languageAlternates(pathname);
  const hidden = !isListed(pathname);
  for (const locale of locales) {
    const path = localizedPath(pathname, locale);
    const label = `[${locale}] ${path}`;
    const page = path === "/" ? home : await get(path);
    const tags = headTags(page.body);
    const meta = getPageMeta(pathname);
    const link = (rel, extra = () => true) => tags.filter((t) => t.name === "link" && t.attrs.rel === rel && extra(t.attrs));
    const metaTag = (key, value) => tags.find((t) => t.name === "meta" && t.attrs[key] === value)?.attrs.content;

    check(`${label} -> 200 without redirect`, page.res.status === 200 && !page.res.headers.has("location"), `status ${page.res.status}`);
    check(`${label} is <html lang="${locale}">`, new RegExp(`<html[^>]*\\blang="${locale}"`).test(page.body));
    check(`${label} X-Robots-Tag ${noindex ? "has" : "lacks"} noindex`, robotsHeaderOk(page.res));

    const structure = {
      header: count(page.body, /<header[\s>]/g),
      main: count(page.body, /<main[\s>]/g),
      footer: count(page.body, /<footer[\s>]/g),
      h1: count(page.body, /<h1[\s>]/g),
    };
    check(`${label} has one header, main, footer and h1`, Object.values(structure).every((n) => n === 1), JSON.stringify(structure));

    const title = decode(page.body.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
    check(`${label} title is the page's own`, title === meta.title[locale], title);
    const description = metaTag("name", "description") ?? "";
    check(`${label} description is the page's own`, description === meta.description[locale], `${description.length} chars`);
    check(`${label} title and description are unique on the site`, !seenTitles.has(title) && !seenDescriptions.has(description));
    seenTitles.add(title);
    seenDescriptions.add(description);

    const robotsMeta = (metaTag("name", "robots") ?? "").toLowerCase();
    const pageNoindex = noindex || hidden;
    check(`${label} meta robots ${pageNoindex ? "has" : "lacks"} noindex${hidden ? " (hidden page)" : ""}`, robotsMeta.includes("noindex") === pageNoindex, robotsMeta || "no tag");
    if (!hidden) {
      const linksToHidden = [...rendered(page.body).matchAll(/<a\b[^>]*\bhref="([^"#?]*)/g)].map((match) => match[1]).filter((href) => hiddenPaths.has(href));
      check(`${label} links to no hidden page`, linksToHidden.length === 0, [...new Set(linksToHidden)].join(", "));
    }

    const canonicals = link("canonical");
    check(`${label} has exactly one canonical, pointing to itself`, canonicals.length === 1 && canonicals[0].attrs.href === alternates[locale], canonicals.map((c) => c.attrs.href).join(", ") || "none");

    const hreflang = Object.fromEntries(link("alternate", (a) => "hreflang" in a).map((t) => [t.attrs.hreflang, t.attrs.href]));
    check(
      `${label} hreflang es, en and x-default (English)`,
      Object.keys(hreflang).length === 3 && hreflang.es === alternates.es && hreflang.en === alternates.en && hreflang["x-default"] === alternates.en,
      JSON.stringify(hreflang),
    );

    // ES / EN and the language bar link to the same page at its final address (no /es prefix, no home page).
    // React writes the attribute as hrefLang: HTML attribute names are case-insensitive.
    const languageLinks = [...page.body.matchAll(/<a\b[^>]*\bhreflang="(es|en)"[^>]*>/gi)].map(([tag, language]) => ({
      language,
      href: decode(tag.match(/\bhref="([^"]*)"/)?.[1] ?? ""),
    }));
    const wrongLinks = languageLinks.filter((link) => link.href !== localizedPath(pathname, link.language));
    check(
      `${label} language links go to this page in each language, without redirect`,
      wrongLinks.length === 0 && locales.every((language) => languageLinks.some((link) => link.language === language)),
      wrongLinks.length > 0 ? wrongLinks.map((link) => `${link.language}: ${link.href}`).join(", ") : `${languageLinks.length} links`,
    );

    check(`${label} og:url is the canonical`, metaTag("property", "og:url") === alternates[locale], metaTag("property", "og:url") ?? "none");
    check(`${label} og:site_name and twitter card`, metaTag("property", "og:site_name") === siteConfig.name && metaTag("name", "twitter:card") === "summary_large_image");

    const imagePath = ogImagePath(pathname, locale);
    check(`${label} og:image is the page's social image`, metaTag("property", "og:image") === absoluteUrl(imagePath), metaTag("property", "og:image") ?? "none");
    // The image is requested from the server under test, not from the production origin.
    const image = await fetch(new URL(imagePath, base));
    const bytes = (await image.arrayBuffer()).byteLength;
    check(`${label} social image ${imagePath} -> 200 image/png`, image.status === 200 && image.headers.get("content-type") === "image/png" && bytes > 10_000, `status ${image.status}, ${bytes} bytes`);

    check(`${label} theme-color and manifest are declared`, Boolean(metaTag("name", "theme-color")) && link("manifest").length === 1);
  }
}

// ---------------------------------------------------------------------------------------------
// 3. Structured data on the home page: Organization and WebSite, without placeholders.
// ---------------------------------------------------------------------------------------------
for (const locale of locales) {
  const page = locale === "es" ? home : await get(localizedPath("/", locale));
  const scripts = [...page.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  let graph = [];
  let valid = scripts.length === 1;
  try {
    graph = JSON.parse(scripts[0] ?? "")["@graph"] ?? [];
  } catch {
    valid = false;
  }
  const byType = Object.fromEntries(graph.map((node) => [node["@type"], node]));
  check(`[${locale}] JSON-LD is one valid document with Organization and WebSite`, valid && Boolean(byType.Organization) && Boolean(byType.WebSite), `types: ${Object.keys(byType).join(", ") || "none"}`);
  check(`[${locale}] Organization: name, url and fixed logo URL`, byType.Organization?.name === siteConfig.name && byType.Organization?.url === absoluteUrl("/") && byType.Organization?.logo === absoluteUrl("/logo.png"));
  check(
    `[${locale}] WebSite: one node for both languages`,
    byType.WebSite?.name === siteConfig.name && byType.WebSite?.["@id"] === absoluteUrl("/#website") && locales.every((language) => byType.WebSite?.inLanguage?.includes(language)),
  );
  check(`[${locale}] JSON-LD has no bracketed placeholders`, !/"\[[^"]*\]"/.test(scripts[0] ?? ""));

  // The content is in the server HTML: nothing a visitor or a crawler reads depends on JavaScript.
  const html = decode(page.body);
  const missingLines = serviceLines.filter((line) => !html.includes(line.name[locale]) || !html.includes(line.summary[locale]));
  check(`[${locale}] the five service lines are in the HTML`, missingLines.length === 0, missingLines.map((line) => line.id).join(", "));
  const missingFaqs = homeFaqs.filter((faq) => !html.includes(faq.question[locale]) || !html.includes(faq.answer[locale]));
  check(`[${locale}] the seven questions and their answers are in the HTML, folded or not`, missingFaqs.length === 0, missingFaqs.map((faq) => faq.id).join(", "));
}
const logo = await fetch(new URL("/logo.png", base));
check("GET /logo.png -> 200 image/png", logo.status === 200 && logo.headers.get("content-type") === "image/png", `status ${logo.status}`);
const manifest = await get("/manifest.webmanifest");
let manifestName = "";
try {
  manifestName = JSON.parse(manifest.body).name;
} catch {
  // reported by the check below
}
check("GET /manifest.webmanifest -> 200 with the site name", manifest.res.status === 200 && manifestName === siteConfig.name, `status ${manifest.res.status}`);

// ---------------------------------------------------------------------------------------------
// 3b. Inner pages: breadcrumbs and Service data, trademark notices, translated addresses.
// ---------------------------------------------------------------------------------------------
const messages = Object.fromEntries(
  locales.map((locale) => [locale, JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"))]),
);
const lineByPathname = new Map(serviceLines.map((line) => [line.pathname, line]));
const subpageByPathname = new Map(Object.values(subpages).map((page) => [page.pathname, page]));

for (const pathname of builtPathnames().filter((candidate) => candidate !== "/")) {
  for (const locale of locales) {
    const path = localizedPath(pathname, locale);
    const label = `[${locale}] ${path}`;
    const page = await get(path);
    const html = rendered(page.body);
    const scripts = [...page.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    let graph = [];
    try {
      graph = scripts.flatMap((script) => JSON.parse(script)["@graph"] ?? []);
    } catch {
      check(`${label} JSON-LD parses`, false);
    }
    const breadcrumb = graph.find((node) => node["@type"] === "BreadcrumbList");

    // The visible trail and its structured data go together: both or neither, and the same pages.
    const trail = breadcrumbTrail(pathname);
    const visibleTrail = html.includes(`<nav aria-label="${messages[locale].Sections.breadcrumb}"`);
    const items = breadcrumb?.itemListElement ?? [];
    check(
      `${label} breadcrumb: visible trail and BreadcrumbList, both present and saying the same`,
      visibleTrail &&
        Boolean(breadcrumb) &&
        (items.length === trail.length &&
            trail.every((crumb, index) => items[index]?.position === index + 1 && items[index]?.item === absoluteUrl(localizedPath(crumb, locale)) && items[index]?.name === getPageName(crumb)[locale])),
      breadcrumb ? items.map((item) => item.name).join(" > ") : "no breadcrumb",
    );

    const line = lineByPathname.get(pathname);
    if (line) {
      const service = graph.find((node) => node["@type"] === "Service");
      check(
        `${label} Service: name, url and description of the line`,
        service?.name === line.name[locale] && service?.url === absoluteUrl(path) && service?.description === getPageMeta(pathname).description[locale],
        service ? service.name : "no Service node",
      );
    }
    const subpage = subpageByPathname.get(pathname);
    if (subpage) {
      const service = graph.find((node) => node["@type"] === "Service");
      const h1 = decode((page.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
      const title = [...subpage.hero.titleLines[locale], subpage.hero.titleAccent[locale]].join(" ");
      check(`${label} h1 is the title of the service`, h1 === title, h1);
      check(
        `${label} Service: named as the h1, with its url and description`,
        service?.name === title.replace(/\.$/, "") && service?.url === absoluteUrl(path) && service?.description === getPageMeta(pathname).description[locale],
        service ? service.name : "no Service node",
      );
    }
    check(`${label} JSON-LD has no bracketed placeholders`, !scripts.some((script) => /"\[[^"]*\]"/.test(script)));

    const expectedNotices = footerNotices(pathname);
    const shown = ["minecraft", "discord"].filter((notice) => html.includes(messages[locale].Footer[`${notice}Notice`]));
    check(`${label} footer notices: ${expectedNotices.join(" + ")}`, shown.length === expectedNotices.length && expectedNotices.every((notice) => shown.includes(notice)), shown.join(" + ") || "none");

    // The other language's slug under this language's prefix is not a second URL for the page.
    const foreign = locale === "en" ? `/en${pathname}` : routeTable[pathname].en;
    if (foreign !== path) {
      const redirected = await get(foreign);
      check(
        `GET ${foreign} redirects permanently (308) to ${path}`,
        redirected.res.status === 308 && new URL(redirected.res.headers.get("location") ?? "x:", base).pathname === path,
        `status ${redirected.res.status} -> ${redirected.res.headers.get("location")}`,
      );
    }
  }
}

for (const { source, destination, permanent } of shortLinkRedirects()) {
  const short = await get(source);
  const location = short.res.headers.get("location") ?? "";
  // To a page of the site (permanent) or to an address outside it, such as the Discord invitation (temporary).
  const arrives = destination.startsWith("/") ? new URL(location || "x:", base).pathname === destination : location === destination;
  const status = permanent ? 308 : 307;
  check(`GET ${source} redirects (${status}) to ${destination}`, short.res.status === status && arrives, `status ${short.res.status} -> ${location}`);
}
if (siteConfig.contact.discordInvite.status === "pending") {
  const discord = await get("/discord");
  check("GET /discord -> 404 until the invitation exists (it never redirects to an invented address)", discord.res.status === 404, `status ${discord.res.status}`);
}

// The quote form is in the server HTML with its five fields and says, literally, that it stores nothing.
for (const locale of locales) {
  const contact = await get(localizedPath("/contacto", locale));
  const html = rendered(contact.body);
  const text = messages[locale].ContactPage;
  const fields = [text.fieldLine, text.fieldType, text.fieldIdea, text.fieldDeadline, text.fieldName];
  check(`[${locale}] quote form: five labelled fields in the HTML`, count(contact.body, /<label[\s>]/g) === 5 && fields.every((field) => html.includes(field)), `${count(contact.body, /<label[\s>]/g)} labels`);
  check(`[${locale}] quote form says it does not store the data`, html.includes(text.submitNote));
  // Before its script runs, the browser could send the form by itself: nothing to send, and no way to send it.
  const formHtml = contact.body.match(/<form\b[\s\S]*?<\/form>/)?.[0] ?? "";
  const namedFields = [...formHtml.matchAll(/<(?:input|select|textarea)\b[^>]*\sname="([^"]*)"/gi)].map((match) => match[1]);
  const isOff = (tag) => /\sdisabled(=""|[\s>/])/i.test(tag);
  const controls = [...formHtml.matchAll(/<(?:input|select|textarea)\b[^>]*>/gi)].map((match) => match[0]);
  const submitButton = formHtml.match(/<button\b[^>]*type="submit"[^>]*>/i)?.[0] ?? "";
  check(
    `[${locale}] quote form cannot be sent by the browser alone (no field names, send button off)`,
    formHtml !== "" && namedFields.length === 0 && isOff(submitButton),
    namedFields.length > 0 ? `named fields: ${namedFields.join(", ")}` : submitButton || "no form",
  );
  // The fields wait for the script too: what is typed before it runs would be erased, and without it the form says why it is off.
  check(
    `[${locale}] quote form fields are off until the script runs, with a note for no JavaScript`,
    controls.length === 5 && controls.every(isOff) && /<noscript>[\s\S]*<\/noscript>/.test(formHtml) && decode(formHtml).includes(text.noScript),
    `${controls.filter(isOff).length} of ${controls.length} fields off`,
  );
  check(`[${locale}] contact page links to no invented WhatsApp number`, siteConfig.contact.whatsapp.status === "ready" || !contact.body.includes("wa.me/"));
}

// ---------------------------------------------------------------------------------------------
// 4. robots.txt and sitemap follow the indexing guard.
// ---------------------------------------------------------------------------------------------
const robots = await get("/robots.txt");
check("GET /robots.txt -> 200", robots.res.status === 200, `status ${robots.res.status}`);
const robotsOneLine = robots.body.trim().replace(/\n/g, " | ");
const sitemap = await get("/sitemap.xml");
if (noindex) {
  check("robots.txt disallows everything", /^Disallow:\s*\/\s*$/im.test(robots.body), robotsOneLine);
  check("robots.txt does not announce a sitemap", !/^Sitemap:/im.test(robots.body), robotsOneLine);
  check("GET /sitemap.xml -> 404 while not indexable", sitemap.res.status === 404, `status ${sitemap.res.status}`);
} else {
  check("robots.txt does not disallow everything", !/^Disallow:\s*\/\s*$/im.test(robots.body), robotsOneLine);
  check("robots.txt points to the sitemap", robots.body.includes(`Sitemap: ${absoluteUrl("/sitemap.xml")}`), robotsOneLine);
  check("GET /sitemap.xml -> 200 XML", sitemap.res.status === 200 && (sitemap.res.headers.get("content-type") ?? "").includes("xml"), `status ${sitemap.res.status}`);
  const locs = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
  const expected = publicPathnames().flatMap((pathname) => locales.map((locale) => absoluteUrl(localizedPath(pathname, locale))));
  check("sitemap lists exactly the public pages in both languages", locs.length === expected.length && expected.every((url) => locs.includes(url)), `${locs.length} urls`);
  const xDefault = count(sitemap.body, /hreflang="x-default"/g);
  check("sitemap entries carry es, en and x-default alternatives", xDefault === expected.length && count(sitemap.body, /hreflang="es"/g) === expected.length, `${xDefault} x-default links`);
}
check(`robots.txt X-Robots-Tag ${noindex ? "has" : "lacks"} noindex`, robotsHeaderOk(robots.res));

// ---------------------------------------------------------------------------------------------
// 5. Unknown routes: real 404 status AND the brand 404 page in the server HTML
//    (not Next's empty "__next_error__" shell that only renders with JavaScript).
// ---------------------------------------------------------------------------------------------
const notFoundText = messages.es.NotFound;
const brand404 = (body) => {
  const html = rendered(body);
  return (
    !body.includes("__next_error__") &&
    [/<header[\s>]/g, /<main[\s>]/g, /<footer[\s>]/g, /<h1[\s>]/g].every((landmark) => count(html, landmark) === 1) &&
    [notFoundText.label, notFoundText.titleLine, notFoundText.titleAccent, notFoundText.home].every((text) => html.includes(text)) &&
    // A way out in each language.
    /<a\b[^>]*\bhref="\/"/.test(html) &&
    /<a\b[^>]*\bhref="\/en"/.test(html)
  );
};
// Every link of the 404 page leads to a page that exists.
const notFoundPage = await get("/ruta-que-no-existe-smoke");
const notFoundLinks = [...new Set([...rendered(notFoundPage.body).matchAll(/<a\b[^>]*\bhref="(\/[^"#]*)"/g)].map((match) => match[1]))];
const deadLinks = [];
for (const link of notFoundLinks) {
  const target = await get(link);
  if (target.res.status !== 200) deadLinks.push(`${link} -> ${target.res.status}`);
}
check("the 404 page links only to pages that exist", notFoundLinks.length >= 2 && deadLinks.length === 0, deadLinks.join(", ") || `${notFoundLinks.length} links`);
for (const pathname of ["/ruta-que-no-existe-smoke", "/en/ruta-que-no-existe-smoke", "/en/a/b", "/de", "/no-existe-smoke.txt", "/og/es/no-existe.png"]) {
  const missing = await get(pathname);
  check(`GET ${pathname} -> 404 with the brand page in HTML`, missing.res.status === 404 && brand404(missing.body), `status ${missing.res.status}`);
  if (pathname === "/ruta-que-no-existe-smoke") {
    check(`unknown route X-Robots-Tag ${noindex ? "has" : "lacks"} noindex`, robotsHeaderOk(missing.res));
  }
}

// ---------------------------------------------------------------------------------------------
// 6. A static asset referenced by the home page is served (standalone copy worked) with the header.
// ---------------------------------------------------------------------------------------------
const assetPath = home.body.match(/\/_next\/static\/[^"'\s)]+/)?.[0];
check("home references a /_next/static asset", Boolean(assetPath));
if (assetPath) {
  const asset = await get(assetPath);
  check(`GET ${assetPath} -> 200`, asset.res.status === 200, `status ${asset.res.status}`);
  check(`static asset X-Robots-Tag ${noindex ? "has" : "lacks"} noindex`, robotsHeaderOk(asset.res));
}

// ---------------------------------------------------------------------------------------------
// 7. Security headers on every kind of response, whatever the indexing state (seo-sitio.md §2.7).
// ---------------------------------------------------------------------------------------------
// The analytics script is loaded only when the server was built with both of its variables; the
// content policy must then allow that origin, and no other origin otherwise. Read from the page
// itself, so this works whatever the variables of the shell running the test.
const analyticsTag = home.body.match(/<script\b[^>]*\bdata-website-id="([^"]*)"[^>]*>/);
const analyticsSrc = analyticsTag?.[0].match(/\bsrc="([^"]*)"/)?.[1];
const expectedHeaders = securityHeaders({
  NODE_ENV: "production",
  ...(analyticsTag && analyticsSrc ? { UMAMI_SRC: decode(analyticsSrc), UMAMI_WEBSITE_ID: analyticsTag[1] } : {}),
});
check(`analytics: ${analyticsTag ? `loads ${analyticsSrc}` : "not configured, nothing is loaded"}`, !analyticsTag || Boolean(analyticsSrc?.startsWith("https://")));
const responses = [
  ["page /", home.res],
  ["page /en/services/minecraft", (await get("/en/services/minecraft")).res],
  ["404", notFoundPage.res],
  ["redirect /es", esPrefixed.res],
  ...(await Promise.all(shortLinkRedirects().map(async ({ source }) => [`short link ${source}`, (await get(source)).res]))),
  ["robots.txt", robots.res],
  ["social image", await fetch(new URL(ogImagePath("/", "es"), base))],
  ...(assetPath ? [["static asset", (await get(assetPath)).res]] : []),
];
for (const [label, res] of responses) {
  const wrong = expectedHeaders.filter((header) => res.headers.get(header.key) !== header.value).map((header) => `${header.key}: ${res.headers.get(header.key) ?? "missing"}`);
  check(`${label}: security headers (${expectedHeaders.length})`, wrong.length === 0, wrong.join(" | "));
  check(`${label}: does not say what it is built with`, !res.headers.has("x-powered-by"), res.headers.get("x-powered-by") ?? "");
}

console.log(`\nSite origin expected in canonical, hreflang, sitemap and JSON-LD: ${getSiteUrl()}`);
console.log(
  failures === 0
    ? `OK: all ${passes} checks passed (${expectMode}) on ${base.origin}`
    : `${failures} of ${passes + failures} checks failed on ${base.origin}`,
);
process.exit(failures === 0 ? 0 : 1);
