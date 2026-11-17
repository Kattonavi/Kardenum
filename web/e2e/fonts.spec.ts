import { isGenerated } from "../src/routes";
import { expect, test } from "./helpers";

// The brand fonts are self-hosted and loaded with display: swap. While they load, a system
// font resized to Archivo's measures holds the same lines, so nothing moves when they arrive.

test("the brand fonts load under the names the CSS stacks use", async ({ page }) => {
  await page.goto("/");
  const loaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].filter((face) => face.status === "loaded").map((face) => face.family.replaceAll('"', ""));
  });
  // globals.css names these families literally: if next/font ever renames them, the site
  // would silently fall back to system fonts.
  expect(loaded).toContain("Archivo");
  expect(loaded).toContain("JetBrains Mono");

  const families = await page.evaluate(() => ({
    body: getComputedStyle(document.body).fontFamily,
    heading: getComputedStyle(document.querySelector("h1") as Element).fontFamily,
  }));
  expect(families.body).toMatch(/^"?Archivo"?, "Kardenum Sans Fallback"/);
  expect(families.heading).toMatch(/^"?Archivo"?, "Kardenum Display Fallback"/);
});

test("fonts are served from the site itself", async ({ page }) => {
  const fontRequests: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "font") fontRequests.push(request.url());
  });
  await page.goto("/", { waitUntil: "networkidle" });
  expect(fontRequests.length).toBeGreaterThan(0);
  const origin = new URL(page.url()).origin;
  for (const url of fontRequests) expect(url.startsWith(origin), url).toBe(true);
});

// The home page, and the pages whose title, next to its scene, has the longest written lines
// (spec 013, RF-21): if the fallback font were wider there, a line would wrap and push the page.
for (const pathname of ["/", "/en/services/design", "/servicios/discord", "/en/services/minecraft/tebex"]) {
  test(`${pathname}: nothing moves when the fonts arrive late (font swap)`, async ({ page }) => {
    test.skip(pathname.includes("/tebex") && !isGenerated("/servicios/minecraft/tebex"), "the sub-pages are hidden and this is an open site");
    // Hold every font for 600 ms so the page is first painted with the fallback fonts.
    await page.route("**/*.woff2", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      await route.continue();
    });
    await page.goto(pathname, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const shift = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const layoutShift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
              if (!layoutShift.hadRecentInput) total += layoutShift.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
          setTimeout(() => resolve(total), 700);
        }),
    );
    // Core Web Vitals asks for CLS <= 0.1 on the whole visit; the font swap gets a small share of it.
    expect(shift).toBeLessThan(0.03);
  });
}

// Archivo is two files (spec 013, RF-43): the base one, which every page preloads, and one with the
// rest of the Latin letters, which a browser must ask for only where one of them is shown.
const EXTENDED_FONT = /Archivo-ext[^/]*\.woff2/;

test("no page of the site asks for the extended file of Archivo", async ({ page }) => {
  // Twelve pages, each one loaded and walked to the end: more than the 30 s of a single test.
  test.setTimeout(120_000);
  const asked: string[] = [];
  page.on("request", (request) => {
    if (EXTENDED_FONT.test(request.url())) asked.push(`${page.url()} → ${request.url()}`);
  });
  const pages = ["/", "/en", "/servicios", "/servicios/minecraft", "/en/services/discord", "/preguntas-frecuentes", "/en/faq", "/nosotros", "/contacto", "/legal/privacidad", "/legal/terminos", "/no-existe"];
  for (const pathname of pages) {
    await page.goto(pathname, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    // To the end and back, so that what is drawn only when the visitor comes near is drawn too.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.evaluate(() => document.fonts.ready);
  }
  expect(asked).toEqual([]);
});

test("a letter of another language typed into the quote form brings the extended file, and is drawn in Archivo", async ({ page }) => {
  await page.goto("/contacto", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const name = page.getByLabel("Tu nombre");
  await name.scrollIntoViewIfNeeded();
  const extended = page.waitForResponse((response) => EXTENDED_FONT.test(response.url()) && response.status() === 200, { timeout: 15_000 });
  await name.fill("João Ångström");
  await extended;
  await page.evaluate(() => document.fonts.ready);
  // Both files of the family are loaded now, and the field is still set in Archivo.
  const loaded = await page.evaluate(() => [...document.fonts].filter((face) => face.status === "loaded" && face.family.replaceAll('"', "") === "Archivo").length);
  expect(loaded).toBe(2);
  expect(await name.evaluate((field) => getComputedStyle(field).fontFamily)).toMatch(/^"?Archivo"?,/);
});
