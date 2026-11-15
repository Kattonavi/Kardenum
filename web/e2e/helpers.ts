import type { Page } from "@playwright/test";

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
