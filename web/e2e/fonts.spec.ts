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

test("nothing moves when the fonts arrive late (font swap)", async ({ page }) => {
  // Hold every font for 600 ms so the page is first painted with the fallback fonts.
  await page.route("**/*.woff2", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    await route.continue();
  });
  await page.goto("/", { waitUntil: "load" });
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
