import type { Locator, Page } from "@playwright/test";
import { expect, test } from "./helpers";

// Scenes (docs/specs/012-fase-2-rediseno-visual.md, RF-10 to RF-15): what each service line
// delivers, drawn with HTML and CSS. These tests open every page that carries scenes.

const PAGES = ["/", "/en"] as const;

const LINES = ["desarrollo", "diseno", "video", "minecraft", "discord"] as const;

async function openScenes(page: Page, path: string): Promise<Locator> {
  await page.goto(path);
  const scenes = page.locator("[data-scene]");
  await expect(scenes.first()).toBeAttached();
  return scenes;
}

/**
 * Animations running or paused inside the scenes the browser is drawing, by state; `within`
 * narrows it to the scenes inside one element.
 *
 * A scene far from the screen is not rendered (content-visibility: auto) and its animations stay
 * as they were left until it is drawn again: they are not counted. Counting them made this fail
 * on the CI runner, where 63 animations of scenes that had left the screen still said "paused"
 * after the page had resumed (verify-deploy run 44013432702).
 */
function sceneAnimations(page: Page, within = "body"): Promise<{ running: number; paused: number }> {
  return page.evaluate((selector) => {
    const root = document.querySelector(selector);
    const drawn = document.getAnimations().filter((animation) => {
      const target = animation.effect instanceof KeyframeEffect ? animation.effect.target : null;
      return target?.closest("[data-scene]") != null && root?.contains(target) === true && target.checkVisibility({ contentVisibilityAuto: true });
    });
    return {
      running: drawn.filter((animation) => animation.playState === "running").length,
      paused: drawn.filter((animation) => animation.playState === "paused").length,
    };
  }, within);
}

for (const path of PAGES) {
  test.describe(`scenes on ${path}`, () => {
    test("each scene is a picture with a description, and what is inside stays out of the reading order", async ({ page }) => {
      const scenes = await openScenes(page, path);
      for (const scene of await scenes.all()) {
        await expect(scene).toHaveAttribute("role", "img");
        expect((await scene.getAttribute("aria-label"))?.length ?? 0).toBeGreaterThan(20);
        await expect(scene.locator("> *")).toHaveCount(1);
        await expect(scene.locator("> *")).toHaveAttribute("aria-hidden", "true");
      }
      // The five lines are all there, each with its own description.
      for (const line of LINES) await expect(page.locator(`[data-scene="${line}"]`).first()).toBeAttached();
      const labels = await scenes.evaluateAll((all) => all.map((scene) => `${scene.getAttribute("data-scene")}|${scene.getAttribute("aria-label")}`));
      expect(new Set(labels).size).toBe(LINES.length);
    });

    test("each scene keeps a 16:10 box and scales with its container", async ({ page }) => {
      const scenes = await openScenes(page, path);
      const boxes = await scenes.evaluateAll((all) =>
        all.map((scene) => {
          const frame = scene.firstElementChild as HTMLElement;
          const { width, height } = frame.getBoundingClientRect();
          return { line: scene.getAttribute("data-scene"), width, height, fontSize: parseFloat(getComputedStyle(frame).fontSize), overflow: frame.scrollWidth - frame.clientWidth };
        }),
      );
      for (const box of boxes.filter((candidate) => candidate.width > 0)) {
        expect(box.width / box.height, `${box.line} at ${box.width}px is 16:10`).toBeCloseTo(1.6, 1);
        // Everything inside is measured from this: 2 % of the width of the scene.
        expect(box.fontSize / box.width, `${box.line} at ${box.width}px scales its text`).toBeCloseTo(0.02, 3);
      }
    });

    // Read from the HTML the server sends: the content policy applies to what is written there.
    // (In the browser Next's own route announcer sets a style from a script, which the policy allows.)
    test("the page is served without inline styles", async ({ page }) => {
      await openScenes(page, path);
      const html = await (await page.request.get(path)).text();
      expect(html).toContain("data-scene=");
      expect(html.match(/\sstyle=/g) ?? []).toEqual([]);
      expect(html.match(/<style[\s>]/g) ?? []).toEqual([]);
    });

    test("the scenes move, and the control of the page pauses and resumes all of them", async ({ page }) => {
      await openScenes(page, path);
      await expect.poll(async () => (await sceneAnimations(page)).running).toBeGreaterThan(0);

      const pause = page.getByRole("checkbox", { name: path === "/en" ? "Pause animation" : "Pausar animación" });
      await expect(pause).toHaveCount(1);
      const box = await pause.locator("xpath=..").boundingBox();
      expect(box?.height ?? 0, "a 44 px target").toBeGreaterThanOrEqual(44);

      // With the keyboard, as a native checkbox.
      await pause.focus();
      await page.keyboard.press("Space");
      await expect(pause).toBeChecked();
      await expect.poll(() => sceneAnimations(page)).toMatchObject({ running: 0 });
      expect((await sceneAnimations(page)).paused).toBeGreaterThan(0);

      // A scene further down is only drawn when the visitor gets to it: it arrives paused too.
      const last = page.locator("[data-scene]").last();
      await last.evaluate((scene) => scene.setAttribute("data-last-scene", ""));
      await last.scrollIntoViewIfNeeded();
      await expect.poll(() => sceneAnimations(page, "[data-last-scene]")).toMatchObject({ running: 0 });
      await expect.poll(async () => (await sceneAnimations(page, "[data-last-scene]")).paused).toBeGreaterThan(0);

      // Resumed from where the visitor is (a click on the control, without scrolling back to it):
      // what is on screen moves again at once.
      await pause.dispatchEvent("click");
      await expect(pause).not.toBeChecked();
      await expect.poll(() => sceneAnimations(page, "[data-last-scene]")).toMatchObject({ paused: 0 });
      expect((await sceneAnimations(page, "[data-last-scene]")).running).toBeGreaterThan(0);
      // And so does everything else that is being drawn.
      await expect.poll(async () => (await sceneAnimations(page)).paused).toBe(0);
    });

    test.describe("with reduced motion", () => {
      test.use({ reducedMotion: "reduce" });

      test("nothing moves, every piece of each scene is drawn and there is nothing to pause", async ({ page }) => {
        const scenes = await openScenes(page, path);
        expect(await sceneAnimations(page)).toEqual({ running: 0, paused: 0 });
        // A piece left at the first or last keyframe of its animation would be transparent or squashed.
        const hidden = await scenes.evaluateAll((all) =>
          all.flatMap((scene) =>
            [...scene.querySelectorAll<HTMLElement>("*")]
              .filter((piece) => {
                const style = getComputedStyle(piece);
                return style.opacity !== "1" || /matrix\(0, |, 0, 0, 0\)|scale\(0/.test(style.transform);
              })
              .map((piece) => `${scene.getAttribute("data-scene")}: .${piece.className}`),
          ),
        );
        expect(hidden).toEqual([]);
        await expect(page.getByRole("checkbox", { name: /Pausar animación|Pause animation/ })).toBeHidden();
      });
    });
  });
}

// The words of a scene travel in data-t and the stylesheet draws them (see scene.tsx): they are
// part of the picture. As text of the page they would be a few pixels tall and partly dimmed.
test("the words inside the scenes are translated, and are not text of the page", async ({ page }) => {
  const drawn = (line: string, word: string) => page.locator(`[data-scene="${line}"] [data-t="${word}"]`).first();

  const spanish = await openScenes(page, "/");
  await expect(drawn("desarrollo", "Carrito")).toBeAttached();
  await expect(drawn("minecraft", "Jugadores en línea")).toBeAttached();
  await expect(drawn("discord", "Ticket creado en #soporte")).toBeAttached();
  expect(await drawn("desarrollo", "Carrito").evaluate((word) => getComputedStyle(word, "::before").content)).toBe('"Carrito"');
  await expect(spanish.first()).toHaveAttribute("aria-label", /^Escena de /);
  expect((await spanish.allTextContents()).join("").trim(), "no text nodes inside a scene").toBe("");

  const english = await openScenes(page, "/en");
  await expect(drawn("desarrollo", "Cart")).toBeAttached();
  await expect(drawn("minecraft", "Players online")).toBeAttached();
  await expect(drawn("discord", "Ticket created in #support")).toBeAttached();
  await expect(english.first()).toHaveAttribute("aria-label", / scene: /);
  expect((await english.allTextContents()).join("").trim(), "no text nodes inside a scene").toBe("");
});

test.describe("before any script runs", () => {
  test.use({ javaScriptEnabled: false });

  test("the pause control already works", async ({ page }) => {
    await openScenes(page, "/");
    const pause = page.getByRole("checkbox", { name: "Pausar animación" });
    await pause.check();
    await expect.poll(() => sceneAnimations(page)).toMatchObject({ running: 0 });
    expect((await sceneAnimations(page)).paused).toBeGreaterThan(0);
  });
});
