import { expect, sidewaysOverflow, test } from "./helpers";

// Page width (spec 013, RF-1 to RF-4): the content, the header and the footer are at most 1320 px
// wide with 48 px at each side on a wide window, as in the phase 2 mockups. The suite runs at
// 1280 px, where the cap is never reached: these tests widen the window to see it.

const CONTENT_WIDTH = 1320 - 2 * 48;

// A page of each kind, and an address that does not exist: the 404 has its own header and footer.
const PAGES = ["/", "/servicios", "/servicios/minecraft", "/preguntas-frecuentes", "/nosotros", "/contacto", "/legal/privacidad", "/no-existe"];

test.describe("on a wide window", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "the cap of the page width is only reached on a wide window");
  });

  for (const width of [1440, 1920]) {
    test(`RF-1, RF-2: header, content and footer are 1224 px wide at ${width} px, and nothing scrolls sideways`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const pathname of PAGES) {
        await page.goto(pathname);
        const widths = await page.evaluate(() => {
          const inner = (selector: string) => {
            const box = document.querySelector(selector);
            if (!box) return null;
            const style = getComputedStyle(box);
            return Math.round(box.getBoundingClientRect().width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
          };
          // The first box with the page width inside each part of the page.
          return { header: inner("header nav.header-row, header nav"), main: inner("main .page-width"), footer: inner("footer .page-width") };
        });
        expect(widths, `${pathname} at ${width} px`).toEqual({ header: CONTENT_WIDTH, main: CONTENT_WIDTH, footer: CONTENT_WIDTH });
        expect(await sidewaysOverflow(page), `${pathname} at ${width} px: sideways scroll`).toBe(0);
      }
    });
  }

  test("RF-3: at 1440 px the footer is one row, as in the mockup", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const pathname of ["/", "/en", "/servicios/minecraft", "/no-existe"]) {
      await page.goto(pathname);
      const footer = page.locator("footer");
      await footer.scrollIntoViewIfNeeded();
      // The brand, the first line, the last legal link and the year: all on the same row.
      const centres = await footer.evaluate((element) => {
        const centre = (node: Element | null | undefined) => {
          if (!node) return null;
          const box = node.getBoundingClientRect();
          return Math.round(box.top + box.height / 2);
        };
        const links = [...element.querySelectorAll("a[href]")].filter((link) => link.checkVisibility());
        const year = [...element.querySelectorAll("span")].find((span) => span.textContent?.startsWith("©"));
        return [centre(links[0]), centre(links.at(-1)), centre(year)];
      });
      const [first, ...rest] = centres;
      expect(first, `${pathname}: the footer has links`).not.toBeNull();
      for (const centre of rest) expect(Math.abs((centre ?? -999) - (first ?? 0)), `${pathname}: footer rows ${centres.join(", ")}`).toBeLessThanOrEqual(2);
    }
  });
});

test("RF-1: on a phone the content keeps 20 px at each side", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "phone layout only");
  await page.goto("/servicios");
  const padding = await page.locator("main .page-width").first().evaluate((box) => [getComputedStyle(box).paddingLeft, getComputedStyle(box).paddingRight]);
  expect(padding).toEqual(["20px", "20px"]);
});
