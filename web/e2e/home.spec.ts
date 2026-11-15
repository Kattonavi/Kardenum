import { expect, test } from "@playwright/test";

// Home page (maqueta B-Gremio-inicio-v2). One goal: understand in seconds what the studio does
// and ask for a quote.

test("the hero says what the studio is and leads to the quote", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Software, diseño\s*y video\.\s*Un solo estudio\./);

  await page.getByRole("main").getByRole("link", { name: "Cotizar proyecto" }).click();
  await expect(page).toHaveURL(/#contacto$/);
  await expect(page.getByRole("heading", { level: 2, name: "Hablemos de tu proyecto." })).toBeInViewport();

  await page.getByRole("main").getByRole("link", { name: "Ver servicios" }).click();
  await expect(page).toHaveURL(/#servicios$/);
  await expect(page.getByRole("heading", { level: 2, name: "Cinco líneas, un mismo criterio." })).toBeInViewport();
});

test("the five lines link to their pages, in each language", async ({ page }) => {
  await page.goto("/");
  const list = page.getByRole("region", { name: "Cinco líneas, un mismo criterio." });
  const expected = [
    ["Desarrollo", "/servicios/desarrollo"],
    ["Diseño", "/servicios/diseno"],
    ["Video y animación", "/servicios/video"],
    ["Minecraft", "/servicios/minecraft"],
    ["Discord", "/servicios/discord"],
  ];
  for (const [name, href] of expected) {
    await expect(list.getByRole("link").filter({ has: page.getByRole("heading", { name, exact: true }) })).toHaveAttribute("href", href);
  }

  await page.goto("/en");
  const english = page.getByRole("region", { name: "Five lines, one standard." });
  await expect(english.getByRole("link").filter({ has: page.getByRole("heading", { name: "Development", exact: true }) })).toHaveAttribute("href", "/en/services/development");
  await expect(english.getByRole("link").filter({ has: page.getByRole("heading", { name: "Design", exact: true }) })).toHaveAttribute("href", "/en/services/design");
});

test("questions open and close with the keyboard; the first one starts open", async ({ page }) => {
  await page.goto("/");
  const faq = page.getByRole("region", { name: "Claridad antes de empezar." });
  const answers = faq.locator("details");
  await expect(answers).toHaveCount(7);
  await expect(answers.nth(0)).toHaveAttribute("open", "");
  await expect(answers.nth(1)).not.toHaveAttribute("open", "");

  const second = answers.nth(1).locator("summary");
  await second.focus();
  await page.keyboard.press("Enter");
  await expect(answers.nth(1)).toHaveAttribute("open", "");
  await expect(answers.nth(1).getByText("Es un sitio web preparado para vender.", { exact: false })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(answers.nth(1)).not.toHaveAttribute("open", "");
});

test("the closing band shows the three channels, WhatsApp first, inert while their data is pending", async ({ page }) => {
  await page.goto("/");
  const closing = page.getByRole("region", { name: "Hablemos de tu proyecto." });
  const channels = closing.getByRole("list", { name: "Canales de contacto" }).getByRole("link");
  await expect(channels).toHaveText(["WhatsApp", "Discord", "Correo"]);
  for (const channel of await channels.all()) {
    await expect(channel).toBeDisabled();
    await expect(channel).not.toHaveAttribute("href", /.*/);
  }
  await expect(closing.getByText("[Canales por activar]")).toBeVisible();
});

test("headings follow one outline: a single h1, then h2 and h3 without jumps", async ({ page }) => {
  await page.goto("/");
  const levels = await page.locator("main h1, main h2, main h3, main h4").evaluateAll((nodes) => nodes.map((node) => Number(node.tagName[1])));
  expect(levels.filter((level) => level === 1)).toHaveLength(1);
  expect(levels[0]).toBe(1);
  for (let i = 1; i < levels.length; i += 1) {
    expect((levels[i] ?? 0) - (levels[i - 1] ?? 0), `heading ${i + 1}`).toBeLessThanOrEqual(1);
  }
});
