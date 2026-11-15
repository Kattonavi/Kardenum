import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { getSiteUrl } from "@/lib/site-url";
import { absoluteUrl, languageAlternates } from "@/routes";

const RAILWAY = "https://web-production-f1d7c246.up.railway.app";

test("without SITE_URL the origin is the production domain", () => {
  assert.equal(getSiteUrl({}), "https://kardenum.com");
  assert.equal(getSiteUrl({ SITE_URL: "" }), "https://kardenum.com");
  assert.equal(getSiteUrl({ SITE_URL: "   " }), "https://kardenum.com");
});

test("SITE_URL replaces the origin, with or without a trailing slash", () => {
  assert.equal(getSiteUrl({ SITE_URL: RAILWAY }), RAILWAY);
  assert.equal(getSiteUrl({ SITE_URL: `${RAILWAY}/` }), RAILWAY);
  assert.equal(getSiteUrl({ SITE_URL: ` ${RAILWAY} ` }), RAILWAY);
  assert.equal(getSiteUrl({ SITE_URL: "http://127.0.0.1:3000" }), "http://127.0.0.1:3000");
});

test("a SITE_URL that is not a bare origin fails loudly instead of producing broken URLs", () => {
  for (const value of ["kardenum.com", "ftp://kardenum.com", `${RAILWAY}/en`, `${RAILWAY}?x=1`, `${RAILWAY}/#top`, "https://user:pass@kardenum.com", "not a url"]) {
    assert.throws(() => getSiteUrl({ SITE_URL: value }), /SITE_URL/, value);
  }
});

test("canonical, hreflang, social image and sitemap all follow SITE_URL", () => {
  const env = { SITE_URL: RAILWAY, SITE_INDEXABLE: "false" };

  assert.equal(absoluteUrl("/", env), RAILWAY);
  assert.equal(absoluteUrl("/en/services", env), `${RAILWAY}/en/services`);
  assert.deepEqual(languageAlternates("/", env), { es: RAILWAY, en: `${RAILWAY}/en`, "x-default": `${RAILWAY}/en` });

  const metadata = buildPageMetadata("/", "en", env);
  assert.equal(metadata.alternates?.canonical, `${RAILWAY}/en`);
  assert.deepEqual(metadata.openGraph?.images, [{ url: `${RAILWAY}/og/en/home.png`, width: 1200, height: 630, alt: metadata.title }]);
  assert.equal(metadata.openGraph?.url, `${RAILWAY}/en`);

  const urls = buildSitemapEntries(env).map((entry) => entry.url);
  assert.ok(urls.includes(RAILWAY));
  assert.ok(urls.every((url) => url.startsWith(RAILWAY)));
});
