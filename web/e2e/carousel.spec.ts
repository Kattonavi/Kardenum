import type { Locator, Page } from "@playwright/test";
import { expect, sidewaysOverflow, test } from "./helpers";

// Carousel of the home page (docs/specs/012-fase-2-rediseno-visual.md, RF-20 to RF-25). It is
// CSS only, so its clock can be set from here: every animation of the page is paused and moved
// to the same moment, which is what the page looks like that long after it loaded.
//

const STEP = 3500;
const STILL = 2800;
const CYCLE = 5 * STEP;
const LINES = ["desarrollo", "diseno", "video", "minecraft", "discord"] as const;

async function openCarousel(page: Page, path = "/"): Promise<Locator> {
  await page.goto(path);
  const carousel = page.locator(".carousel");
  await expect(carousel).toHaveCount(1);
  return carousel;
}

/** Freezes every animation of the carousel at `ms` after the load. (The entrances of the page follow the scroll and have no clock.) */
async function setClock(page: Page, ms: number): Promise<void> {
  await page.evaluate((time) => {
    for (const animation of document.getAnimations()) {
      const target = animation.effect instanceof KeyframeEffect ? animation.effect.target : null;
      if (!target?.closest(".carousel")) continue;
      animation.pause();
      animation.currentTime = time;
    }
  }, ms);
}

type Slide = { line: string | null; copy: boolean; left: number; width: number; centre: number; opacity: number };

function slides(carousel: Locator): Promise<Slide[]> {
  return carousel.locator(".carousel-slide").evaluateAll((all) =>
    all.map((slide) => {
      const box = slide.getBoundingClientRect();
      return {
        line: slide.querySelector("[data-scene]")?.getAttribute("data-scene") ?? null,
        copy: slide.getAttribute("aria-hidden") === "true",
        left: box.left,
        width: box.width,
        centre: box.left + box.width / 2,
        opacity: Number(getComputedStyle(slide).opacity),
      };
    }),
  );
}

/**
 * Animations of the carousel (row, slides, tabs and the scenes inside), by state. Only what the
 * browser is drawing: the scene of a slide far from the screen is not rendered
 * (content-visibility: auto) and its animations wait as they were left (see scenes.spec.ts).
 */
function carouselAnimations(page: Page): Promise<{ running: number; paused: number }> {
  return page.evaluate(() => {
    const inside = document.getAnimations().filter((animation) => {
      const target = animation.effect instanceof KeyframeEffect ? animation.effect.target : null;
      return target?.closest(".carousel") != null && target.checkVisibility({ contentVisibilityAuto: true });
    });
    return {
      running: inside.filter((animation) => animation.playState === "running").length,
      paused: inside.filter((animation) => animation.playState === "paused").length,
    };
  });
}

const isWide = (page: Page) => (page.viewportSize()?.width ?? 0) >= 768;

test("five scenes, with copies at the ends that screen readers do not get", async ({ page }) => {
  const carousel = await openCarousel(page);
  await expect(carousel).toHaveAttribute("aria-label", "Lo que entrega cada línea");
  const all = await slides(carousel);
  expect(all.map((slide) => slide.line)).toEqual(["discord", ...LINES, "desarrollo", "diseno"]);
  expect(all.map((slide) => slide.copy)).toEqual([true, false, false, false, false, false, true, true]);
  // What a screen reader gets: five pictures, one per line.
  await expect(carousel.getByRole("img")).toHaveCount(5);
  // The tabs show progress and are not controls.
  await expect(carousel.locator(".carousel-tabs")).toHaveAttribute("aria-hidden", "true");
  await expect(carousel.getByRole("link")).toHaveCount(0);
  await expect(carousel.getByRole("button")).toHaveCount(0);
});

test("the scene in the centre has the width of the mockup and its neighbours peek in, dimmed", async ({ page }) => {
  const carousel = await openCarousel(page);
  const viewport = page.viewportSize()?.width ?? 0;
  const [share, gap] = isWide(page) ? [0.46, 0.02] : [0.78, 0.03];
  await setClock(page, 0);

  const all = await slides(carousel);
  const centre = all[1];
  const left = all[0];
  const right = all[2];
  if (!centre || !left || !right) throw new Error("slides missing");
  // The row is as wide as the window minus the scrollbar, where there is one.
  const row = await carousel.locator(".carousel-track").evaluate((track) => track.getBoundingClientRect().width);
  expect(row).toBeGreaterThan(viewport - 20);
  expect(centre.width).toBeCloseTo(row * share, 0);
  expect(right.left - (centre.left + centre.width)).toBeCloseTo(row * gap, 0);
  expect(Math.abs(centre.centre - row / 2)).toBeLessThan(1);
  expect(centre.opacity).toBe(1);
  expect(left.opacity).toBeCloseTo(0.32, 2);
  expect(right.opacity).toBeCloseTo(0.32, 2);
  // Both neighbours are partly on screen.
  expect(left.left + left.width).toBeGreaterThan(0);
  expect(right.left).toBeLessThan(row);
  expect(await sidewaysOverflow(page)).toBe(0);
});

test("it advances by steps: 2.8 s still, 0.7 s moving, and one scene in the centre at a time", async ({ page }) => {
  const carousel = await openCarousel(page);
  const track = carousel.locator(".carousel-track");
  expect(await track.evaluate((element) => getComputedStyle(element).animationDuration)).toBe("17.5s");
  expect(await track.evaluate((element) => getComputedStyle(element).animationTimingFunction)).toBe("cubic-bezier(0.7, 0, 0.2, 1)");
  const row = await track.evaluate((element) => element.getBoundingClientRect().width);

  for (const [step, line] of LINES.entries()) {
    // At the start of the step and at the end of its still part, the same scene is in the centre.
    for (const moment of [step * STEP, step * STEP + STILL - 10]) {
      await setClock(page, moment);
      const all = await slides(carousel);
      const centred = all.filter((slide) => Math.abs(slide.centre - row / 2) < 1);
      expect(centred.map((slide) => slide.line), `at ${moment} ms`).toEqual([line]);
      expect(centred[0]?.opacity, `at ${moment} ms`).toBe(1);
      expect(all.filter((slide) => slide.opacity > 0.33).map((slide) => slide.line), `only the centre is clear at ${moment} ms`).toEqual(
        // The first and second scenes have a copy that follows them, off screen.
        step < 2 ? [line, line] : step === 4 ? [line, line] : [line],
      );
    }
    // Half-way through the move nothing is centred.
    await setClock(page, step * STEP + STILL + 350);
    expect((await slides(carousel)).filter((slide) => Math.abs(slide.centre - row / 2) < 1)).toEqual([]);
  }
});

test("it starts again without a visible jump", async ({ page }) => {
  const carousel = await openCarousel(page);
  await setClock(page, 0);
  const start = await slides(carousel);
  await setClock(page, CYCLE - 1);
  const end = await slides(carousel);
  // At the end the copies sit exactly where the real scenes are at the start, equally clear.
  for (const [atStart, atEnd] of [
    [0, 5],
    [1, 6],
    [2, 7],
  ] as const) {
    expect(end[atEnd]?.line).toBe(start[atStart]?.line);
    expect(end[atEnd]?.left ?? NaN).toBeCloseTo(start[atStart]?.left ?? NaN, 0);
    expect(end[atEnd]?.opacity ?? NaN).toBeCloseTo(start[atStart]?.opacity ?? NaN, 1);
  }
});

test("each tab fills while its scene is in the centre", async ({ page }) => {
  const carousel = await openCarousel(page);
  const fills = () =>
    carousel.locator(".carousel-tab-bar").evaluateAll((bars) =>
      bars.map((bar) => {
        const fill = getComputedStyle(bar, "::before").transform;
        return fill === "none" ? 1 : Number(fill.replace("matrix(", "").split(",")[0]);
      }),
    );
  for (const step of LINES.keys()) {
    await setClock(page, step * STEP + STEP / 2);
    const filled = await fills();
    expect(filled[step], `tab ${step + 1} is half full`).toBeCloseTo(0.5, 1);
    expect(filled.filter((value, index) => index !== step && value > 0.01), `only tab ${step + 1} is filling`).toEqual([]);
    const names = await carousel.locator(".carousel-tab-name").evaluateAll((all) => all.map((name) => Number(getComputedStyle(name).opacity)));
    expect(names[step]).toBe(1);
    expect(Math.max(...names.filter((_, index) => index !== step))).toBeLessThanOrEqual(0.5);
  }
});

test("the pause control stops and resumes everything at once", async ({ page }) => {
  await openCarousel(page);
  await expect.poll(async () => (await carouselAnimations(page)).running).toBeGreaterThan(20);
  const pause = page.getByRole("checkbox", { name: "Pausar animación" });
  await expect(pause).toBeVisible();

  await pause.check();
  await expect.poll(() => carouselAnimations(page)).toMatchObject({ running: 0 });
  // Paused means still: the row is where it was a moment ago.
  const track = page.locator(".carousel-track");
  const before = await track.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(900);
  expect(await track.evaluate((element) => getComputedStyle(element).transform)).toBe(before);

  await pause.uncheck();
  await expect.poll(async () => (await carouselAnimations(page)).paused).toBe(0);
});

test("keyboard focus on the row of scenes pauses it, and leaving resumes", async ({ page }) => {
  const carousel = await openCarousel(page);
  const row = carousel.getByRole("group", { name: "Escenas de las cinco líneas" });
  await row.focus();
  await expect(row).toBeFocused();
  await expect.poll(() => carouselAnimations(page)).toMatchObject({ running: 0 });
  await row.blur();
  await expect.poll(async () => (await carouselAnimations(page)).paused).toBe(0);
});

test("the cursor over the row of scenes pauses it", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "a touch screen has no cursor to rest on the row");
  const carousel = await openCarousel(page);
  await carousel.locator(".carousel-viewport").hover();
  await expect.poll(() => carouselAnimations(page)).toMatchObject({ running: 0 });
  await page.mouse.move(2, 2);
  await expect.poll(async () => (await carouselAnimations(page)).paused).toBe(0);
});

test("advancing never moves the page", async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as unknown as { __shift: number };
    state.__shift = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
        if (!entry.hadRecentInput) state.__shift += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  const carousel = await openCarousel(page);
  const height = () => page.evaluate(() => document.documentElement.scrollHeight);
  const before = await height();
  const top = (await carousel.boundingBox())?.y;
  // One whole step in real time: a still part and a move.
  await page.waitForTimeout(STEP + 400);
  expect(await height()).toBe(before);
  expect((await carousel.boundingBox())?.y).toBe(top);
  expect(await page.evaluate(() => (window as unknown as { __shift: number }).__shift)).toBeLessThan(0.03);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("it does not advance by itself and is moved by hand, one scene in the centre at a time", async ({ page }) => {
    const carousel = await openCarousel(page);
    expect(await carouselAnimations(page)).toEqual({ running: 0, paused: 0 });
    const row = carousel.getByRole("group", { name: "Escenas de las cinco líneas" });
    const width = await row.evaluate((element) => element.clientWidth);

    // Only the five scenes, all of them clear; the copies are gone.
    const visible = (await slides(carousel)).filter((slide) => slide.width > 0);
    expect(visible.map((slide) => slide.line)).toEqual([...LINES]);
    expect(visible.every((slide) => slide.opacity === 1)).toBe(true);
    expect(Math.abs((visible[0]?.centre ?? 0) - width / 2), "the first scene starts in the centre").toBeLessThan(2);
    await expect(carousel.locator(".carousel-tabs")).toBeHidden();
    await expect(page.getByRole("checkbox", { name: "Pausar animación" })).toBeHidden();

    // It stays put.
    const position = () => row.evaluate((element) => element.scrollLeft);
    await page.waitForTimeout(STEP + 300);
    expect(await position()).toBe(0);

    // With the keyboard: the row takes focus and the arrow keys move it.
    await row.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect.poll(position).toBeGreaterThan(0);

    // To the end: the last scene stops in the centre, and the page itself never scrolls sideways.
    await row.evaluate((element) => element.scrollTo({ left: element.scrollWidth }));
    await expect
      .poll(async () => {
        const last = (await slides(carousel)).filter((slide) => slide.width > 0).at(-1);
        return Math.abs((last?.centre ?? 0) - width / 2);
      })
      .toBeLessThan(2);
    expect(await sidewaysOverflow(page)).toBe(0);
  });
});

test.describe("before any script runs", () => {
  test.use({ javaScriptEnabled: false });

  test("the carousel already moves and its pause control already works", async ({ page }) => {
    await openCarousel(page);
    await expect.poll(async () => (await carouselAnimations(page)).running).toBeGreaterThan(20);
    await page.getByRole("checkbox", { name: "Pausar animación" }).check();
    await expect.poll(() => carouselAnimations(page)).toMatchObject({ running: 0 });
  });
});

test("in English the carousel has its own names", async ({ page }) => {
  const carousel = await openCarousel(page, "/en");
  await expect(carousel).toHaveAttribute("aria-label", "What each line delivers");
  await expect(carousel.getByRole("group", { name: "Scenes of the five lines" })).toBeVisible();
  await expect(carousel.locator(".carousel-tab-name").first()).toHaveAttribute("data-short", "Development");
  await expect(carousel.locator(".carousel-tab-name").nth(2)).toHaveAttribute("data-name", "III · Video and animation");
  await expect(page.getByRole("checkbox", { name: "Pause animation" })).toBeVisible();
});
