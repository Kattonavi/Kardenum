// Smoke test against a running server (local or Railway).
//   node scripts/smoke.mjs <baseUrl> [--expect=noindex|indexable]
// Default expectation is "noindex": the state the site must keep until launch.
// Exits with code 1 if any check fails.

const args = process.argv.slice(2);
const baseArg = args.find((a) => !a.startsWith("--"));
const expectArg = args.find((a) => a.startsWith("--expect="));
const expectMode = expectArg ? expectArg.split("=")[1] : "noindex";

if (!baseArg || !["noindex", "indexable"].includes(expectMode)) {
  console.error("Usage: node scripts/smoke.mjs <baseUrl> [--expect=noindex|indexable]");
  process.exit(2);
}

const base = new URL(baseArg);
const noindex = expectMode === "noindex";
let failures = 0;

function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
  if (!ok) failures += 1;
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

// 1. Home: 200 in Spanish, no redirect (Railway healthcheck hits "/").
const home = await get("/");
check("GET / -> 200", home.res.status === 200, `status ${home.res.status}`);
check("GET / has no Location header", !home.res.headers.has("location"));
check('GET / is <html lang="es">', /<html[^>]*\blang="es"/.test(home.body));
check(
  `GET / X-Robots-Tag ${noindex ? "has" : "lacks"} noindex`,
  robotsHeaderOk(home.res),
  home.res.headers.get("x-robots-tag") ?? "no header",
);
const metaNoindex = /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(home.body);
check(`GET / meta robots ${noindex ? "has" : "lacks"} noindex`, metaNoindex === noindex);

// 2. A browser asking for English still gets the Spanish root, without a redirect.
const homeEn = await get("/", { "accept-language": "en-US,en;q=0.9" });
check("GET / (Accept-Language: en) -> 200 without redirect", homeEn.res.status === 200 && !homeEn.res.headers.has("location"), `status ${homeEn.res.status}`);

// 2b. Neither a stale locale cookie redirects, nor does "/" set cookies (no cookie banner needed).
const homeCookie = await get("/", { cookie: "NEXT_LOCALE=en" });
check("GET / (cookie NEXT_LOCALE=en) -> 200 without redirect", homeCookie.res.status === 200 && !homeCookie.res.headers.has("location"), `status ${homeCookie.res.status}`);
check("GET / sets no cookie", !home.res.headers.has("set-cookie"), home.res.headers.get("set-cookie") ?? "");

// 2c. English lives under /en; the Spanish prefix is not a second URL for the same page.
const en = await get("/en");
check("GET /en -> 200", en.res.status === 200, `status ${en.res.status}`);
check('GET /en is <html lang="en">', /<html[^>]*\blang="en"/.test(en.body));
check(`GET /en X-Robots-Tag ${noindex ? "has" : "lacks"} noindex`, robotsHeaderOk(en.res));
const esPrefixed = await get("/es");
check(
  "GET /es redirects to /",
  [301, 307, 308].includes(esPrefixed.res.status) && new URL(esPrefixed.res.headers.get("location") ?? "x:", base).pathname === "/",
  `status ${esPrefixed.res.status} -> ${esPrefixed.res.headers.get("location")}`,
);
check(`GET /es redirect X-Robots-Tag ${noindex ? "has" : "lacks"} noindex`, robotsHeaderOk(esPrefixed.res));

// 2d. Page structure required by the brief: one <header>, one <main>, one <footer> and a single <h1>.
for (const [label, page] of [["/", home], ["/en", en]]) {
  const count = (re) => (page.body.match(re) ?? []).length;
  const ok = count(/<header[\s>]/g) === 1 && count(/<main[\s>]/g) === 1 && count(/<footer[\s>]/g) === 1 && count(/<h1[\s>]/g) === 1;
  check(`${label} has one header, main, footer and h1`, ok, `header ${count(/<header[\s>]/g)}, main ${count(/<main[\s>]/g)}, footer ${count(/<footer[\s>]/g)}, h1 ${count(/<h1[\s>]/g)}`);
}

// 3. robots.txt
const robots = await get("/robots.txt");
check("GET /robots.txt -> 200", robots.res.status === 200, `status ${robots.res.status}`);
if (noindex) {
  check("robots.txt disallows everything", /^Disallow:\s*\/\s*$/im.test(robots.body), robots.body.trim().replace(/\n/g, " | "));
} else {
  check("robots.txt does not disallow everything", !/^Disallow:\s*\/\s*$/im.test(robots.body), robots.body.trim().replace(/\n/g, " | "));
}
check(`robots.txt X-Robots-Tag ${noindex ? "has" : "lacks"} noindex`, robotsHeaderOk(robots.res));

// 4. Sitemap is not published while the site is not indexable.
if (noindex) {
  const sitemap = await get("/sitemap.xml");
  check("GET /sitemap.xml -> 404 while not indexable", sitemap.res.status === 404, `status ${sitemap.res.status}`);
}

// 5. Unknown routes: real 404 status AND the brand 404 page in the server HTML
//    (not Next's empty "__next_error__" shell that only renders with JavaScript).
const brand404 = (body) => !body.includes("__next_error__") && body.includes("Esta página no existe");
for (const pathname of ["/ruta-que-no-existe-smoke", "/en/ruta-que-no-existe-smoke", "/en/a/b", "/de", "/no-existe-smoke.txt"]) {
  const missing = await get(pathname);
  check(`GET ${pathname} -> 404 with the brand page in HTML`, missing.res.status === 404 && brand404(missing.body), `status ${missing.res.status}`);
  if (pathname === "/ruta-que-no-existe-smoke") {
    check(`unknown route X-Robots-Tag ${noindex ? "has" : "lacks"} noindex`, robotsHeaderOk(missing.res));
  }
}

// 6. A static asset referenced by the home page is served (standalone copy worked) with the header.
const assetPath = home.body.match(/\/_next\/static\/[^"'\s)]+/)?.[0];
check("home references a /_next/static asset", Boolean(assetPath));
if (assetPath) {
  const asset = await get(assetPath);
  check(`GET ${assetPath} -> 200`, asset.res.status === 200, `status ${asset.res.status}`);
  check(`static asset X-Robots-Tag ${noindex ? "has" : "lacks"} noindex`, robotsHeaderOk(asset.res));
}

console.log(failures === 0 ? `\nOK: all checks passed (${expectMode}) on ${base.origin}` : `\n${failures} check(s) failed on ${base.origin}`);
process.exit(failures === 0 ? 0 : 1);
