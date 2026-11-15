// Smoke test against a running server (local or Railway).
//   pnpm smoke <baseUrl> [--expect=noindex|indexable]
// Default expectation is "noindex": the state the site must keep until launch.
// It reads the route registry and the page texts from src/, so every public page is checked
// in both languages without listing URLs here. Exits with code 1 if any check fails.
import { getPageMeta } from "@/content/pages";
import { locales } from "@/i18n/locales";
import { ogImagePath } from "@/lib/seo/metadata";
import { absoluteUrl, languageAlternates, localizedPath, publicPathnames } from "@/routes";
import { siteConfig } from "@/site.config";

const args = process.argv.slice(2);
const baseArg = args.find((a) => !a.startsWith("--"));
const expectArg = args.find((a) => a.startsWith("--expect="));
const expectMode = expectArg ? expectArg.split("=")[1] : "noindex";

if (!baseArg || !["noindex", "indexable"].includes(expectMode)) {
  console.error("Usage: pnpm smoke <baseUrl> [--expect=noindex|indexable]");
  process.exit(2);
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
  "GET /es redirects to /",
  [301, 307, 308].includes(esPrefixed.res.status) && new URL(esPrefixed.res.headers.get("location") ?? "x:", base).pathname === "/",
  `status ${esPrefixed.res.status} -> ${esPrefixed.res.headers.get("location")}`,
);
check(`GET /es redirect X-Robots-Tag ${noindex ? "has" : "lacks"} noindex`, robotsHeaderOk(esPrefixed.res));

// ---------------------------------------------------------------------------------------------
// 2. Every public page, in both languages: structure and technical SEO (seo-sitio.md §2).
// ---------------------------------------------------------------------------------------------
const seenTitles = new Set();
const seenDescriptions = new Set();

for (const pathname of publicPathnames()) {
  const alternates = languageAlternates(pathname);
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
    check(`${label} meta robots ${noindex ? "has" : "lacks"} noindex`, robotsMeta.includes("noindex") === noindex, robotsMeta || "no tag");

    const canonicals = link("canonical");
    check(`${label} has exactly one canonical, pointing to itself`, canonicals.length === 1 && canonicals[0].attrs.href === alternates[locale], canonicals.map((c) => c.attrs.href).join(", ") || "none");

    const hreflang = Object.fromEntries(link("alternate", (a) => "hreflang" in a).map((t) => [t.attrs.hreflang, t.attrs.href]));
    check(
      `${label} hreflang es, en and x-default (English)`,
      Object.keys(hreflang).length === 3 && hreflang.es === alternates.es && hreflang.en === alternates.en && hreflang["x-default"] === alternates.en,
      JSON.stringify(hreflang),
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
  check(`[${locale}] WebSite: name and language`, byType.WebSite?.name === siteConfig.name && byType.WebSite?.inLanguage === locale);
  check(`[${locale}] JSON-LD has no bracketed placeholders`, !/"\[[^"]*\]"/.test(scripts[0] ?? ""));
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
const brand404 = (body) => !body.includes("__next_error__") && body.includes("Esta página no existe");
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

console.log(
  failures === 0
    ? `\nOK: all ${passes} checks passed (${expectMode}) on ${base.origin}`
    : `\n${failures} of ${passes + failures} checks failed on ${base.origin}`,
);
process.exit(failures === 0 ? 0 : 1);
