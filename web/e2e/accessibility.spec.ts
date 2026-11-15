import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// BRIEF.md → "Accesibilidad (WCAG 2.1 AA)". axe finds roughly half of the problems; the rest
// (keyboard, focus order) is covered by navigation.spec.ts and language.spec.ts.
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];
const PAGES = ["/", "/en"];

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

  test(`${path} does not scroll sideways, down to 320 px`, async ({ page }) => {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.setViewportSize({ width: 320, height: 640 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
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
