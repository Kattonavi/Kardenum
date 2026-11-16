import AxeBuilder from "@axe-core/playwright";
import { type Page } from "@playwright/test";
import { locales } from "../src/i18n/locales";
import { generatedPathnames, localizedPath } from "../src/routes";
import { generatedEntries, pathsOfEntry } from "../src/lib/entries";
import { doubleTextSize, expect, sidewaysOverflow, test } from "./helpers";

// BRIEF.md → "Accesibilidad (WCAG 2.1 AA)". axe finds roughly half of the problems; the rest
// (keyboard, focus order) is covered by navigation.spec.ts and language.spec.ts.
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];
// Every built page in both languages, public or hidden behind a feature, from the route registry: a new page
// is checked without listing it here. Plus the 404 page, which has its own header and footer (it replaces the layout).
// The entries of the collections (portfolio cases) are pages too.
const PAGES = [
  ...generatedPathnames().flatMap((pathname) => locales.map((locale) => localizedPath(pathname, locale))),
  ...generatedEntries().flatMap((entry) => locales.map((locale) => pathsOfEntry(entry)[locale])),
  "/pagina-que-no-existe",
];

async function expectNoViolations(page: Page, context: string) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const summary = results.violations.map((violation) => `${violation.id} (${violation.impact}): ${violation.nodes.map((node) => node.target.join(" ")).join(" | ")}`);
  expect(summary, `axe violations on ${context}`).toEqual([]);
}

for (const path of PAGES) {
  test(`${path} has no axe violations`, async ({ page }) => {
    await page.goto(path);
    await expectNoViolations(page, path);
  });

  test(`${path} has one h1, one main and the three landmarks`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
  });

  test(`${path} headings follow one outline: a single h1, then h2 and h3 without jumps`, async ({ page }) => {
    await page.goto(path);
    const levels = await page.locator("main h1, main h2, main h3, main h4").evaluateAll((nodes) => nodes.map((node) => Number(node.tagName[1])));
    expect(levels.filter((level) => level === 1)).toHaveLength(1);
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i += 1) {
      expect((levels[i] ?? 0) - (levels[i - 1] ?? 0), `heading ${i + 1}`).toBeLessThanOrEqual(1);
    }
  });

  test(`${path} does not scroll sideways, down to 320 px`, async ({ page }) => {
    await page.goto(path);
    expect(await sidewaysOverflow(page), "at the project's width").toBe(0);
    await page.setViewportSize({ width: 320, height: 640 });
    expect(await sidewaysOverflow(page), "at 320 px").toBe(0);
  });

  // WCAG 1.4.4: with the text at twice its size (the root font size, not the browser zoom) nothing
  // is lost. The header is where it used to break: its menu button ended up off screen.
  test(`${path} keeps its header usable with text at 200 %`, async ({ page }) => {
    await page.goto(path);
    await doubleTextSize(page);
    const width = page.viewportSize()?.width ?? 0;
    const banner = page.getByRole("banner");

    // All the text really grows: type set in px would pass every other check without changing.
    // The smallest type of the site is 11 px at the default size.
    const smallestText = await page.locator("body *").evaluateAll((elements) =>
      Math.min(
        ...elements
          .filter((element) => element.getClientRects().length > 0 && [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()))
          .map((element) => parseFloat(getComputedStyle(element).fontSize)),
      ),
    );
    expect(smallestText, "smallest text on the page, in px").toBeGreaterThanOrEqual(22);

    expect(await sidewaysOverflow(page), "sideways overflow").toBe(0);
    const offScreen = await banner.locator("a, button").evaluateAll(
      (elements, viewportWidth) =>
        elements
          .filter((element) => {
            const box = element.getBoundingClientRect();
            // Not rendered (closed panels) or hidden until focused (skip link).
            if (box.width <= 1 || box.height <= 1) return false;
            return box.left < 0 || box.right > viewportWidth + 0.5;
          })
          .map((element) => (element.textContent ?? "").trim() || element.getAttribute("aria-label") || element.tagName),
      width,
    );
    expect(offScreen, "header controls off screen").toEqual([]);

    const openMenu = banner.getByRole("button", { name: /^(Abrir menú|Open menu)$/ });
    if (path === "/pagina-que-no-existe") {
      // The 404 has a static header: its quote link is the way on.
      await expect(banner.getByRole("link", { name: "Cotizar" })).toBeVisible();
      return;
    }
    // At this text size every width shows the compact header: the menu opens and can be closed.
    await expect(openMenu).toBeVisible();
    await openMenu.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('a[href$="/contacto"], a[href$="/en/contact"]').first()).toBeVisible();
    const close = dialog.getByRole("button", { name: /^(Cerrar menú|Close menu)$/ });
    const closeBox = await close.boundingBox();
    expect((closeBox?.x ?? -1) >= 0 && (closeBox?.x ?? 0) + (closeBox?.width ?? 0) <= width + 0.5, "close button on screen").toBe(true);
    await close.click();
    await expect(dialog).toBeHidden();
  });

  test(`${path} touch targets are at least 44 px`, async ({ page }) => {
    await page.goto(path);
    const small = await page.evaluate(() => {
      const offenders: string[] = [];
      for (const element of document.querySelectorAll<HTMLElement>("a, button, summary, [role='link']")) {
        const box = element.getBoundingClientRect();
        if (box.width === 0 || box.height === 0) continue; // not rendered (closed menus)
        // Hidden until focused (skip link): measured in navigation.spec.ts.
        if (box.width <= 1 && box.height <= 1) continue;
        if (box.height < 44 || box.width < 44) {
          offenders.push(`${element.tagName.toLowerCase()} "${(element.textContent ?? "").trim().slice(0, 30)}" ${Math.round(box.width)}x${Math.round(box.height)}`);
        }
      }
      return offenders;
    });
    expect(small).toEqual([]);
  });
}

test("the open menus have no axe violations either", async ({ page }, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "desktop") {
    await page.getByRole("navigation", { name: "Principal" }).getByRole("button", { name: "Servicios" }).click();
  } else {
    await page.getByRole("button", { name: "Abrir menú" }).click();
  }
  await expectNoViolations(page, `/ with the ${testInfo.project.name} menu open`);
});

test("the language bar has no axe violations", async ({ browser }) => {
  const context = await browser.newContext({ locale: "en-US" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Language" })).toBeVisible();
  await expectNoViolations(page, "/ with the language bar");
  await context.close();
});

test("keyboard focus is always visible", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "keyboard navigation is checked on desktop");
  await page.goto("/");
  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const style = getComputedStyle(document.activeElement as Element);
      return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
    });
    expect(outline.style, `stop ${i + 1}`).toBe("solid");
    expect(outline.width, `stop ${i + 1}`).toBeGreaterThanOrEqual(2);
  }
});
