import { linePages } from "../src/content/lines";
import { serviceLines } from "../src/content/service-lines";
import { subpages } from "../src/content/subpages";
import { isGenerated } from "../src/routes";
import { expect, test } from "./helpers";

// Services index and the pages of the five lines after the phase 2 redesign
// (docs/specs/012-fase-2-rediseno-visual.md, RF-50 and RF-51). The scenes themselves are checked
// in scenes.spec.ts; here is where they sit on the page and that no text was lost.

test("the services index shows each line as a card: its scene, its sentence and a button that names it", async ({ page }) => {
  await page.goto("/servicios");
  const lines = page.getByRole("region", { name: "Líneas de servicio" });
  const cards = lines.getByRole("listitem");
  await expect(cards).toHaveCount(5);
  for (const [index, line] of serviceLines.entries()) {
    const card = cards.nth(index);
    await expect(card.getByRole("heading", { level: 2 })).toHaveText(line.name.es);
    await expect(card.locator(`[data-scene="${line.id}"]`)).toHaveCount(1);
    await expect(card).toContainText(line.summary.es);
    const button = card.getByRole("link", { name: `Ver ${line.name.es}`, exact: true });
    await expect(button).toHaveAttribute("href", line.pathname);
    expect((await button.boundingBox())?.height ?? 0, `${line.id}: a 44 px target`).toBeGreaterThanOrEqual(44);
  }
  // The whole card is the link: a click on its scene opens the line.
  await cards.nth(1).scrollIntoViewIfNeeded();
  const scene = await cards.nth(1).locator("[data-scene]").boundingBox();
  if (!scene) throw new Error("the card has no scene on screen");
  await page.mouse.click(scene.x + 12, scene.y + 12);
  await expect(page).toHaveURL(/\/servicios\/diseno$/);

  await page.goto("/en/services");
  await expect(page.getByRole("region", { name: "Service lines" }).getByRole("link", { name: "View Development", exact: true })).toHaveAttribute("href", "/en/services/development");
});

for (const line of serviceLines) {
  test(`${line.pathname}: the first screen has the text and, beside it or under it, the scene of the line`, async ({ page }) => {
    await page.goto(line.pathname);
    const title = page.getByRole("heading", { level: 1 });
    const scene = page.locator(`[data-scene="${line.id}"]`);
    await expect(scene).toHaveCount(1);
    await expect(page.locator("[data-scene]")).toHaveCount(1);

    const titleBox = await title.boundingBox();
    const sceneBox = await scene.boundingBox();
    if (!titleBox || !sceneBox) throw new Error("title or scene not on the page");
    if ((page.viewportSize()?.width ?? 0) >= 1280) {
      // Two columns: the scene to the right of the text, overlapping it in height.
      expect(sceneBox.x, "the scene is to the right of the title").toBeGreaterThan(titleBox.x + titleBox.width - 1);
      expect(sceneBox.y).toBeLessThan(titleBox.y + titleBox.height);
      expect(sceneBox.y + sceneBox.height).toBeGreaterThan(titleBox.y);
    } else {
      // On a phone the scene goes under the text and its buttons, at the full width of the column.
      const buttons = await page.getByRole("main").getByRole("link", { name: /Cotizar/ }).first().boundingBox();
      expect(sceneBox.y).toBeGreaterThan((buttons?.y ?? 0) + (buttons?.height ?? 0) - 1);
      expect(sceneBox.width).toBeGreaterThan((page.viewportSize()?.width ?? 0) * 0.8);
    }
    // One control pauses it, next to the scene.
    await expect(page.getByRole("checkbox", { name: "Pausar animación" })).toHaveCount(1);
  });

  test(`${line.pathname}: every section and every text of the line is still there`, async ({ page }) => {
    await page.goto(line.pathname);
    const content = linePages[line.id];
    const main = page.getByRole("main");
    await expect(main.getByText(content.hero.text.es, { exact: true })).toBeVisible();
    await expect(main.getByRole("heading", { level: 2, name: content.services.title.es })).toBeVisible();
    for (const service of content.services.items) {
      await expect(main.getByRole("heading", { level: 3, name: service.title.es, exact: true }).first()).toBeAttached();
      await expect(main.getByText(service.text.es, { exact: true }).first()).toBeAttached();
    }
    if (content.chooser) {
      await expect(main.getByRole("heading", { level: 2, name: content.chooser.title.es })).toBeAttached();
      for (const option of content.chooser.options) await expect(main.getByText(option.text.es, { exact: true })).toBeAttached();
    }
    if (content.deliverables) {
      await expect(main.getByRole("heading", { level: 2, name: content.deliverables.title.es })).toBeAttached();
      for (const item of content.deliverables.items) await expect(main.getByText(item.es, { exact: true }).first()).toBeAttached();
    }
    if (content.scope) {
      await expect(main.getByRole("heading", { level: 2, name: content.scope.title.es })).toBeAttached();
      for (const item of [...content.scope.does, ...content.scope.doesNot]) await expect(main.getByText(item.es, { exact: true }).first()).toBeAttached();
    }
    await expect(main.getByRole("heading", { level: 2, name: "Cómo trabajamos" })).toBeAttached();
    await expect(main.getByText(content.processFirstStep.es, { exact: true })).toBeAttached();
    for (const item of content.strip.items.es) await expect(main.getByText(item, { exact: true }).first()).toBeAttached();
  });
}

// Sub-pages (RF-52) are hidden behind a feature: they exist to be reviewed while the site is
// closed, and are not generated on an open site with the feature off.
for (const page of Object.values(subpages).filter((candidate) => isGenerated(candidate.pathname))) {
  test(`${page.pathname}: the first screen has the scene of its line, as on the page of the line`, async ({ page: browser }) => {
    await browser.goto(page.pathname);
    const title = browser.getByRole("heading", { level: 1 });
    const scene = browser.locator(`[data-scene="${page.line}"]`);
    await expect(scene).toHaveCount(1);
    await expect(browser.locator("[data-scene]")).toHaveCount(1);
    await expect(browser.getByRole("checkbox", { name: "Pausar animación" })).toHaveCount(1);
    const titleBox = await title.boundingBox();
    const sceneBox = await scene.boundingBox();
    if (!titleBox || !sceneBox) throw new Error("title or scene not on the page");
    if ((browser.viewportSize()?.width ?? 0) >= 1280) expect(sceneBox.x, "the scene is to the right of the title").toBeGreaterThan(titleBox.x + titleBox.width - 1);
    else expect(sceneBox.y, "the scene is under the title").toBeGreaterThan(titleBox.y + titleBox.height - 1);
  });
}

// The entrance while scrolling reaches every inner page through the blocks they share (RF-34, RF-53).
const WITH_BLOCKS = ["/servicios/desarrollo", "/servicios/minecraft", "/nosotros", "/contacto", "/legal/privacidad", "/preguntas-frecuentes"];

for (const path of WITH_BLOCKS) {
  test(`${path}: its blocks come in while scrolling and end in place`, async ({ page }) => {
    await page.goto(path);
    const blocks = page.locator("main .reveal");
    expect(await blocks.count()).toBeGreaterThan(0);
    const supported = await page.evaluate(() => CSS.supports("animation-timeline: view()"));
    test.skip(!supported, "this browser has no scroll-driven animations: the blocks are simply in place");
    // Scrolled to the end, every block the visitor went past is whole.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect
      .poll(() => blocks.evaluateAll((all) => all.filter((block) => block.getBoundingClientRect().bottom < window.innerHeight - 200).every((block) => getComputedStyle(block).opacity === "1")))
      .toBe(true);
  });
}

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  for (const path of WITH_BLOCKS) {
    test(`${path}: every block is in place from the start`, async ({ page }) => {
      await page.goto(path);
      const states = await page.locator("main .reveal").evaluateAll((all) => all.map((block) => `${getComputedStyle(block).opacity} ${getComputedStyle(block).transform}`));
      expect(states.length).toBeGreaterThan(0);
      expect(new Set(states)).toEqual(new Set(["1 none"]));
    });
  }
});
