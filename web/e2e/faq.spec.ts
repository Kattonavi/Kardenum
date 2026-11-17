import { faqGroups } from "../src/content/faq";
import { homeFaqs } from "../src/content/home";
import { linePages } from "../src/content/lines";
import { serviceLines } from "../src/content/service-lines";
import { expect, test } from "./helpers";

// Questions page and the new footer (docs/specs/012-fase-2-rediseno-visual.md, RF-40 to RF-43):
// every question of the site on one page, linked from the footer, from the closing band of every
// page and from each line. It is not in the menu.

const TOTAL = faqGroups.reduce((count, group) => count + group.items.length, 0);

test("the footer has the brand, the five lines, the questions, the legal pages and the year", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByText("Kardenum", { exact: true })).toBeVisible();
  await expect(footer.getByRole("navigation", { name: "Líneas de servicio" }).getByRole("link")).toHaveText(["Desarrollo", "Diseño", "Video", "Minecraft", "Discord"]);
  await expect(footer.getByRole("navigation", { name: "Legal" }).getByRole("link")).toHaveText(["Preguntas frecuentes", "Privacidad", "Términos"]);
  await expect(footer.getByText(`© ${new Date().getFullYear()} Kardenum`)).toBeVisible();
  // The lines are separated by space alone: a wrapped row cannot leave a separator hanging.
  await expect(footer.getByRole("navigation", { name: "Líneas de servicio" })).not.toContainText("·");
  // The home page is not about Minecraft: no trademark notice (spec 008).
  await expect(footer).not.toContainText("Mojang");
  for (const link of await footer.getByRole("link").all()) {
    expect((await link.boundingBox())?.height ?? 0, await link.innerText()).toBeGreaterThanOrEqual(44);
  }
});

test("the footer leads to the questions page, in each language", async ({ page }) => {
  await page.goto("/nosotros");
  await page.getByRole("contentinfo").getByRole("link", { name: "Preguntas frecuentes" }).click();
  await expect(page).toHaveURL(/\/preguntas-frecuentes$/);
  expect(await page.getByRole("heading", { level: 1 }).evaluate((h1) => h1.textContent)).toBe("Claridad antes de empezar.");

  await page.goto("/en/about");
  await page.getByRole("contentinfo").getByRole("link", { name: "FAQ", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/faq$/);
  expect(await page.getByRole("heading", { level: 1 }).evaluate((h1) => h1.textContent)).toBe("Clarity before we start.");
});

test("the questions page is not in the menu", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("banner").locator('a[href="/preguntas-frecuentes"]')).toHaveCount(0);
});

test("every question is there: the seven general ones first, then one group per line", async ({ page }) => {
  await page.goto("/preguntas-frecuentes");
  const main = page.getByRole("main");
  await expect(main.locator("details")).toHaveCount(TOTAL);
  await expect(main.getByRole("heading", { level: 2 })).toHaveText(["Para empezar.", ...serviceLines.map((line) => linePages[line.id].faq.title.es), "Hablemos de tu proyecto."]);

  const general = main.getByRole("region", { name: "Para empezar." });
  await expect(general.locator("summary")).toHaveText(homeFaqs.map((faq) => faq.question.es));
  for (const line of serviceLines) {
    const group = main.getByRole("region", { name: linePages[line.id].faq.title.es });
    const expected = faqGroups.find((candidate) => candidate.line?.id === line.id)?.items ?? [];
    await expect(group.locator("summary")).toHaveText(expected.map((faq) => faq.question.es));
    // Each group leads to its line, with the button that names it.
    await expect(group.getByRole("link", { name: `Ver ${line.name.es}`, exact: true })).toHaveAttribute("href", line.pathname);
  }
  // An answer that a line shares with the general ones is shown once.
  await expect(main.getByText(homeFaqs.find((faq) => faq.id === "mejorar-sitio")?.answer.es ?? "", { exact: true })).toHaveCount(1);
  // The answers are in the page even while folded.
  await expect(main.getByText(homeFaqs[6]?.answer.es ?? "", { exact: true })).toBeAttached();
});

test("questions open and close with the keyboard; only the first one starts open", async ({ page }) => {
  await page.goto("/preguntas-frecuentes");
  const answers = page.getByRole("main").locator("details");
  await expect(page.getByRole("main").locator("details[open]")).toHaveCount(1);
  await expect(answers.nth(0)).toHaveAttribute("open", "");

  const second = answers.nth(1).locator("summary");
  await second.focus();
  await page.keyboard.press("Enter");
  await expect(answers.nth(1)).toHaveAttribute("open", "");
  await expect(answers.nth(1).getByText("Es un sitio web preparado para vender.", { exact: false })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(answers.nth(1)).not.toHaveAttribute("open", "");
});

test("the topics at the top lead to each group, in the language of the page", async ({ page }) => {
  await page.goto("/preguntas-frecuentes");
  const topics = page.getByRole("navigation", { name: "Temas" }).getByRole("link");
  await expect(topics).toHaveText(["General", ...serviceLines.map((line) => line.name.es)]);
  await topics.nth(4).click();
  await expect(page).toHaveURL(/#minecraft$/);
  await expect(page.getByRole("heading", { level: 2, name: linePages.minecraft.faq.title.es })).toBeInViewport();

  await page.goto("/en/faq");
  await expect(page.getByRole("navigation", { name: "Topics" }).getByRole("link").nth(1)).toHaveAttribute("href", "#development");
});

test("the closing band of a page leads to the questions; on a line, to the questions of that line", async ({ page }) => {
  await page.goto("/");
  const closing = page.getByRole("region", { name: "Hablemos de tu proyecto." });
  const link = closing.getByRole("link", { name: "¿Tienes dudas? Ver preguntas frecuentes" });
  await expect(link).toHaveAttribute("href", "/preguntas-frecuentes");
  expect((await link.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);

  await page.goto("/servicios/minecraft");
  await page.getByRole("region", { name: "Hablemos de tu proyecto." }).getByRole("link", { name: "¿Tienes dudas? Ver preguntas frecuentes" }).click();
  await expect(page).toHaveURL(/\/preguntas-frecuentes#minecraft$/);
  await expect(page.getByRole("heading", { level: 2, name: linePages.minecraft.faq.title.es })).toBeInViewport();

  await page.goto("/en/services/development");
  await expect(page.getByRole("region", { name: "Let's talk about your project." }).getByRole("link", { name: "Any questions? Read the FAQ" })).toHaveAttribute("href", "/en/faq#development");

  // The questions page does not send to itself.
  await page.goto("/preguntas-frecuentes");
  await expect(page.getByRole("region", { name: "Hablemos de tu proyecto." }).locator("[data-faq-link]")).toHaveCount(0);
});

test("the pages of the lines no longer show their questions", async ({ page }) => {
  for (const line of serviceLines) {
    await page.goto(line.pathname);
    await expect(page.getByRole("main").locator("details"), line.id).toHaveCount(0);
    await expect(page.getByRole("heading", { name: linePages[line.id].faq.title.es }), line.id).toHaveCount(0);
  }
});
