import { expect, type Page, test as base } from "@playwright/test";

/**
 * The `test` every spec uses. On top of Playwright's, each test fails if a page breaks the
 * site's Content-Security-Policy. A policy that is too strict stops the scripts of the page (it
 * stays on screen but nothing works) and no other check would say why; the browser only reports
 * it on the console.
 */
export const test = base.extend<{ cspGuard: void; breaksPolicyOnPurpose: boolean }>({
  /** Only for the test that breaks the policy to prove that the guard notices: `test.use({ breaksPolicyOnPurpose: true })`. */
  breaksPolicyOnPurpose: [false, { option: true }],
  cspGuard: [
    async ({ context, breaksPolicyOnPurpose }, use) => {
      const violations: string[] = [];
      context.on("console", (message) => {
        if (/Content[ -]Security[ -]Policy/i.test(message.text())) violations.push(message.text().slice(0, 300));
      });
      await use();
      if (breaksPolicyOnPurpose) expect(violations.length, "the guard saw the violations made on purpose").toBeGreaterThan(0);
      else expect(violations, "Content-Security-Policy violations reported by the browser").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/**
 * How far the page content goes beyond the configured viewport width, in px (0 = no sideways scroll).
 *
 * It is compared with the configured width and not with window.innerWidth: with phone emulation,
 * a page that overflows is zoomed out to fit, innerWidth grows with the content and
 * `scrollWidth <= innerWidth` stays true while the page is broken.
 */
export async function sidewaysOverflow(page: Page): Promise<number> {
  const viewport = page.viewportSize();
  if (!viewport) throw new Error("sidewaysOverflow needs a fixed viewport size");
  const contentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  return Math.max(0, contentWidth - viewport.width);
}

/**
 * Text at twice its size, as a reader who enlarges the font gets it (WCAG 1.4.4). It is set on
 * the element and not with a <style> tag: the site's policy does not allow inline styles.
 */
export async function doubleTextSize(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
}
