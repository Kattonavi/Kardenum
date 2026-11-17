import type { Page } from "@playwright/test";
import { linePages } from "../src/content/lines";
import { subpages } from "../src/content/subpages";
import { locales } from "../src/i18n/locales";
import { isGenerated, localizedPath } from "../src/routes";
import { expect, test } from "./helpers";

// The title next to the scene, on the pages of the lines and on their sub-pages (spec 013, RF-20
// to RF-23): on a wide window the text takes 55 % and the scene 45 %, and the title never takes
// more than three lines nor leaves a word alone on one.

const PAGES = [
  ...Object.values(linePages).map((page) => ({ pathname: `/servicios/${page.line}` as const, hero: page.hero })),
  ...Object.values(subpages).map((page) => ({ pathname: page.pathname, hero: page.hero })),
].filter((page) => isGenerated(page.pathname));

/** The words of the title, grouped by the line each one is drawn on. */
async function titleLines(page: Page): Promise<string[][]> {
  return page.evaluate(() => {
    const title = document.querySelector("h1");
    if (!title) return [];
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    const lines: { top: number; words: string[] }[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent ?? "";
      for (const match of text.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const top = range.getClientRects()[0]?.top ?? 0;
        const line = lines.find((candidate) => Math.abs(candidate.top - top) < 4);
        if (line) line.words.push(match[0]);
        else lines.push({ top, words: [match[0]] });
      }
    }
    return lines.sort((a, b) => a.top - b.top).map((line) => line.words);
  });
}

test.describe("on a wide window", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "two columns only on a wide window");
  });

  for (const { pathname, hero } of PAGES) {
    for (const locale of locales) {
      const path = localizedPath(pathname, locale);

      test(`${path}: RF-20, RF-21: beside its scene the title has one size, its written lines, and the bronze part starts a line`, async ({ page }) => {
        const accent = hero.titleAccent[locale].split(" ");
        // 1216 px is the narrowest window with the scene beside the text; 1215 and below stack them.
        for (const width of [1216, 1280, 1440, 1920]) {
          await page.setViewportSize({ width, height: 900 });
          await page.goto(path);
          await page.evaluate(() => document.fonts.ready);
          const title = page.getByRole("heading", { level: 1 });
          expect(await title.evaluate((h1) => getComputedStyle(h1).getPropertyValue("text-wrap")), `${width} px: text-wrap`).toContain("balance");

          // RF-20: the two columns share the row 55 to 45 (the gap between them is not part of either).
          const columns = await page.evaluate(() => {
            const text = document.querySelector("h1")?.parentElement?.getBoundingClientRect();
            const scene = document.querySelector("[data-scene]")?.parentElement?.getBoundingClientRect();
            return text && scene ? { text: text.width, scene: scene.width, beside: scene.left >= text.right } : null;
          });
          expect(columns?.beside, `${width} px: the scene is beside the text`).toBe(true);
          expect((columns?.text ?? 0) / ((columns?.text ?? 0) + (columns?.scene ?? 1)), `${width} px: share of the text column`).toBeCloseTo(0.55, 2);

          // One size for every title: 6.5 % of the column, 41 px on a 1440 px window, never under 32 px.
          const size = await title.evaluate((h1) => parseFloat(getComputedStyle(h1).fontSize));
          expect(size, `${width} px: size of the title`).toBeGreaterThanOrEqual(32);
          expect(size, `${width} px: size of the title`).toBeCloseTo((columns?.text ?? 0) * 0.065, 0);
          if (width === 1440) expect(Math.round(size), "size of the title on a 1440 px window").toBe(41);

          // RF-21: the lines are the ones written with the title, at every width.
          const lines = await titleLines(page);
          const drawn = lines.map((line) => line.join(" "));
          expect(drawn, `${width} px`).toEqual(hero.titleBeside[locale].split(" / "));
          expect(lines.length, `${width} px: lines of "${drawn.join(" / ")}"`).toBeLessThanOrEqual(4);
          // The bronze part starts a line and is not shared with the rest of the title.
          let fromTheEnd = 0;
          let accentStartsLine = false;
          for (const line of [...lines].reverse()) {
            fromTheEnd += line.length;
            if (fromTheEnd >= accent.length) {
              accentStartsLine = fromTheEnd === accent.length;
              break;
            }
          }
          expect(accentStartsLine, `${width} px: "${accent.join(" ")}" starts a line in "${drawn.join(" / ")}"`).toBe(true);
          // The last line is never a short word alone. A word alone there is the whole bronze part, when it is one word.
          const last = lines.at(-1) ?? [];
          if (lines.length > 1 && last.length === 1) {
            expect(accent.length, `${width} px: "${last[0]}" is alone on the last line of "${drawn.join(" / ")}"`).toBe(1);
            expect((last[0] ?? "").length, `${width} px: "${last[0]}" is a short word alone on the last line`).toBeGreaterThan(5);
          }
          // The two buttons under the text share one line.
          const buttonTops = await title.evaluate((h1) => [...(h1.parentElement?.querySelectorAll(":scope > div a") ?? [])].map((button) => Math.round(button.getBoundingClientRect().top)));
          expect(buttonTops.length, `${width} px: buttons under the title`).toBe(2);
          expect(new Set(buttonTops).size, `${width} px: the buttons are on one line`).toBe(1);
          // The title fits its column: nothing is cut or pushed under the scene.
          const overflow = await title.evaluate((h1) => h1.scrollWidth - h1.clientWidth);
          expect(overflow, `${width} px: the title fits its column`).toBeLessThanOrEqual(0);
        }
      });
    }
  }
});

test("where the text would not fit beside the scene, the scene goes under it, no wider than 640 px", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "a window between a tablet and a wide one");
  for (const width of [1024, 1215]) {
    await page.setViewportSize({ width, height: 900 });
    for (const pathname of ["/servicios/discord", "/en/services/development"]) {
      await page.goto(pathname);
      const title = page.getByRole("heading", { level: 1 });
      expect(await title.evaluate((h1) => parseFloat(getComputedStyle(h1).fontSize)), `${pathname} at ${width} px`).toBeGreaterThanOrEqual(32);
      const titleBox = await title.boundingBox();
      const sceneBox = await page.locator("[data-scene]").boundingBox();
      expect(sceneBox?.y ?? 0, `${pathname} at ${width} px: the scene is under the title`).toBeGreaterThan((titleBox?.y ?? 0) + (titleBox?.height ?? 0));
      expect(sceneBox?.width ?? 0, `${pathname} at ${width} px: width of the scene`).toBeLessThanOrEqual(640);
      expect(sceneBox?.x, `${pathname} at ${width} px: the scene starts where the text starts`).toBe(titleBox?.x);
    }
  }
});

test("RF-23: on a phone the title keeps the size of every page title, and the scene goes under the text", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "phone layout only");
  for (const pathname of ["/servicios/desarrollo", "/en/services/minecraft"]) {
    await page.goto(pathname);
    const title = page.getByRole("heading", { level: 1 });
    // clamp(1.8125rem, 4.6vw, 3.625rem) at 390 px: its smallest size, 29 px.
    expect(await title.evaluate((h1) => getComputedStyle(h1).fontSize), pathname).toBe("29px");
    const titleBox = await title.boundingBox();
    const sceneBox = await page.locator("[data-scene]").boundingBox();
    expect(sceneBox?.y ?? 0, `${pathname}: the scene is under the title`).toBeGreaterThan((titleBox?.y ?? 0) + (titleBox?.height ?? 0));
  }
});
