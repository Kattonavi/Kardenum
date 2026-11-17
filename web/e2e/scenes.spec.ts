import type { Locator, Page } from "@playwright/test";
import { subpages } from "../src/content/subpages";
import { isGenerated } from "../src/routes";
import { expect, test } from "./helpers";

// Scenes (docs/specs/012-fase-2-rediseno-visual.md, RF-10 to RF-15): what each service line
// delivers, drawn with HTML and CSS. These tests open every page that carries scenes.

const LINES = ["desarrollo", "diseno", "video", "minecraft", "discord"] as const;

/** Every kind of page that carries scenes, with the lines whose scene it shows. */
const PAGES: Record<string, readonly string[]> = {
  "/": LINES,
  "/en": LINES,
  "/servicios": LINES,
  "/en/services": LINES,
  "/servicios/desarrollo": ["desarrollo"],
  "/servicios/diseno": ["diseno"],
  "/servicios/video": ["video"],
  "/servicios/minecraft": ["minecraft"],
  "/servicios/discord": ["discord"],
  "/en/services/design": ["diseno"],
  // The page of a service carries the scene of its line. They are hidden behind a feature: on an
  // open site with the feature off they are not generated, and there is nothing to open.
  ...Object.fromEntries(
    Object.values(subpages)
      .filter((page) => isGenerated(page.pathname))
      .map((page) => [page.pathname, [page.line]]),
  ),
};

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
/**
 * Pieces of the scenes that are not whole: transparent, or squashed to nothing. A piece left at
 * the first or last keyframe of its animation would be one of them.
 */
function missingPieces(scenes: Locator): Promise<string[]> {
  return scenes.evaluateAll((all) =>
    all.flatMap((scene) =>
      [...scene.querySelectorAll<HTMLElement>("*")]
        .filter((piece) => {
          const style = getComputedStyle(piece);
          return style.opacity !== "1" || /matrix\(0, |, 0, 0, 0\)|scale\(0/.test(style.transform);
        })
        .map((piece) => `${scene.getAttribute("data-scene")}: .${piece.className}`),
    ),
  );
}

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

for (const [path, lines] of Object.entries(PAGES)) {
  test.describe(`scenes on ${path}`, () => {
    test("each scene is a picture with a description, and what is inside stays out of the reading order", async ({ page }) => {
      const scenes = await openScenes(page, path);
      for (const scene of await scenes.all()) {
        await expect(scene).toHaveAttribute("role", "img");
        expect((await scene.getAttribute("aria-label"))?.length ?? 0).toBeGreaterThan(20);
        await expect(scene.locator("> *")).toHaveCount(1);
        await expect(scene.locator("> *")).toHaveAttribute("aria-hidden", "true");
      }
      // The lines of the page are all there (the five of them, or the one of a line page), each with its own description.
      for (const line of lines) await expect(page.locator(`[data-scene="${line}"]`).first()).toBeAttached();
      const labels = await scenes.evaluateAll((all) => all.map((scene) => `${scene.getAttribute("data-scene")}|${scene.getAttribute("aria-label")}`));
      expect(new Set(labels).size).toBe(lines.length);
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
      const scenes = await openScenes(page, path);
      await expect.poll(async () => (await sceneAnimations(page)).running).toBeGreaterThan(0);

      const pause = page.getByRole("checkbox", { name: path.startsWith("/en") ? "Pause animation" : "Pausar animación" });
      await expect(pause).toHaveCount(1);
      const box = await pause.locator("xpath=..").boundingBox();
      expect(box?.height ?? 0, "a 44 px target").toBeGreaterThanOrEqual(44);

      // With the keyboard, as a native checkbox.
      await pause.focus();
      await page.keyboard.press("Space");
      await expect(pause).toBeChecked();
      // Paused right after arriving, when most pieces have not come in yet: a scene does not
      // freeze half drawn, it shows its complete picture.
      await expect.poll(() => sceneAnimations(page)).toEqual({ running: 0, paused: 0 });
      expect(await missingPieces(scenes)).toEqual([]);

      // A scene further down is only drawn when the visitor gets to it: it arrives still too.
      const last = page.locator("[data-scene]").last();
      await last.evaluate((scene) => scene.setAttribute("data-last-scene", ""));
      await last.scrollIntoViewIfNeeded();
      await expect.poll(() => sceneAnimations(page, "[data-last-scene]")).toEqual({ running: 0, paused: 0 });
      expect(await missingPieces(page.locator("[data-last-scene]"))).toEqual([]);

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
        expect(await missingPieces(scenes)).toEqual([]);
        await expect(page.getByRole("checkbox", { name: /Pausar animación|Pause animation/ })).toBeHidden();
      });
    });
  });
}

// The words of a scene are drawn by the stylesheet, in the language of the page (see scene.tsx):
// they are part of the picture. As text of the page they would be a few pixels tall and partly dimmed.
test("the words inside the scenes are translated, and are not text of the page", async ({ page }) => {
  /** What the stylesheet draws on a piece of a scene (its ::before, or ::after where the piece has a mark before the word). */
  const drawn = (line: string, piece: string, pseudo: "::before" | "::after" = "::before") =>
    page
      .locator(`[data-scene="${line}"] ${piece}`)
      .first()
      .evaluate((element, which) => getComputedStyle(element, which).content, pseudo);

  const spanish = await openScenes(page, "/");
  expect(await drawn("desarrollo", ".sc-dev-cart-title")).toBe('"Carrito"');
  expect(await drawn("desarrollo", ".sc-dev-url")).toBe('"tutienda.com/catalogo"');
  expect(await drawn("minecraft", ".sc-mc-title", "::after")).toBe('"Consola"');
  expect(await drawn("minecraft", ".sc-mc-box:nth-child(1) > .sc-mc-label")).toBe('"Jugadores en línea"');
  expect(await drawn("minecraft", ".sc-mc-line:nth-child(6)")).toBe('"[12:04:16] Listo · TPS 20.0"');
  expect(await drawn("discord", ".sc-dc-card-title")).toBe('"Ticket creado en #soporte"');
  expect(await drawn("discord", ".sc-dc-action:nth-child(2)")).toBe('"Cerrar"');
  expect(await drawn("video", ".sc-vid-format:nth-child(2)")).toBe('"9:16"');
  await expect(spanish.first()).toHaveAttribute("aria-label", /^Escena de /);
  expect((await spanish.allTextContents()).join("").trim(), "no text nodes inside a scene").toBe("");

  const english = await openScenes(page, "/en");
  expect(await drawn("desarrollo", ".sc-dev-cart-title")).toBe('"Cart"');
  expect(await drawn("desarrollo", ".sc-dev-url")).toBe('"yourstore.com/catalog"');
  expect(await drawn("minecraft", ".sc-mc-title", "::after")).toBe('"Console"');
  expect(await drawn("minecraft", ".sc-mc-box:nth-child(1) > .sc-mc-label")).toBe('"Players online"');
  expect(await drawn("discord", ".sc-dc-card-title")).toBe('"Ticket created in #support"');
  expect(await drawn("discord", ".sc-dc-action:nth-child(2)")).toBe('"Close"');
  expect(await drawn("video", ".sc-vid-format:nth-child(2)")).toBe('"9:16"');
  await expect(english.first()).toHaveAttribute("aria-label", / scene: /);
  expect((await english.allTextContents()).join("").trim(), "no text nodes inside a scene").toBe("");
});

test.describe("before any script runs", () => {
  test.use({ javaScriptEnabled: false });

  test("the pause control already works", async ({ page }) => {
    await openScenes(page, "/");
    const scenes = page.locator("[data-scene]");
    const pause = page.getByRole("checkbox", { name: "Pausar animación" });
    await pause.check();
    await expect.poll(() => sceneAnimations(page)).toEqual({ running: 0, paused: 0 });
    expect(await missingPieces(scenes)).toEqual([]);
  });
});
