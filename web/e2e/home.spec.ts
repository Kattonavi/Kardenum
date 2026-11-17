import { siteConfig } from "../src/site.config";
import { expect, test } from "./helpers";

// Home page (docs/handoff/fase-2/maquetas, spec 012 RF-30 to RF-34). One goal: see in seconds
// what the studio does and ask for a quote. The carousel and the scenes have their own specs.

const LINES = [
  { id: "desarrollo", name: "Desarrollo", english: "Development", href: "/servicios/desarrollo", englishHref: "/en/services/development" },
  { id: "diseno", name: "Diseño", english: "Design", href: "/servicios/diseno", englishHref: "/en/services/design" },
  { id: "video", name: "Video y animación", english: "Video and animation", href: "/servicios/video", englishHref: "/en/services/video" },
  { id: "minecraft", name: "Minecraft", english: "Minecraft", href: "/servicios/minecraft", englishHref: "/en/services/minecraft" },
  { id: "discord", name: "Discord", english: "Discord", href: "/servicios/discord", englishHref: "/en/services/discord" },
] as const;

test("the first screen says what the studio is, centred, and leads to the quote", async ({ page }) => {
  await page.goto("/");
  const title = page.getByRole("heading", { level: 1 });
  expect(await title.evaluate((h1) => h1.textContent)).toBe("Software, diseño y video. Un solo estudio.");
  expect(await title.evaluate((h1) => getComputedStyle(h1).textAlign)).toBe("center");
  // The second sentence is in the accent: bronze, on ink.
  expect(await title.locator("span").evaluate((accent) => getComputedStyle(accent).color)).toBe("rgb(184, 146, 58)");
  await expect(page.getByText("Un estudio para llevar tu proyecto de la idea a algo que puedas mostrar con orgullo. Escuchamos, proponemos y construimos contigo cada parte.")).toBeVisible();

  // The carousel comes right after the text of the first screen.
  const order = await page.evaluate(() => {
    const hero = document.querySelector("h1")?.closest("section");
    const carousel = document.querySelector(".carousel");
    return hero && carousel ? Boolean(hero.compareDocumentPosition(carousel) & Node.DOCUMENT_POSITION_FOLLOWING) : false;
  });
  expect(order).toBe(true);

  await page.getByRole("main").getByRole("link", { name: "Cotizar proyecto" }).click();
  await expect(page).toHaveURL(/#contacto$/);
  await expect(page.getByRole("heading", { level: 2, name: "Hablemos de tu proyecto." })).toBeInViewport();

  await page.getByRole("main").getByRole("link", { name: "Ver servicios" }).click();
  await expect(page).toHaveURL(/#servicios$/);
  await expect(page.getByRole("heading", { level: 2, name: "Cinco líneas, un mismo criterio." })).toBeInViewport();
});

test("each line has its scene, its sentence and a button that names where it leads, in each language", async ({ page }) => {
  await page.goto("/");
  const lines = page.getByRole("region", { name: "Cinco líneas, un mismo criterio." });
  for (const line of LINES) {
    const block = lines.locator("article, li").filter({ has: page.getByRole("heading", { level: 3, name: line.name, exact: true }) });
    await expect(block).toHaveCount(1);
    await expect(block.locator(`[data-scene="${line.id}"]`)).toHaveCount(1);
    const button = block.getByRole("link", { name: `Ver ${line.name}`, exact: true });
    await expect(button).toHaveAttribute("href", line.href);
    expect((await button.boundingBox())?.height ?? 0, `${line.name}: a 44 px target`).toBeGreaterThanOrEqual(44);
    expect(await button.evaluate((link) => getComputedStyle(link).borderTopWidth)).toBe("1px");
  }
  // Desarrollo and Diseño are the large blocks, with their services named.
  await expect(lines.locator("article")).toHaveCount(2);
  await expect(lines.locator("article").first().getByRole("listitem")).toHaveText(["Sitios web", "Tiendas online", "Aplicaciones web", "Software a la medida"]);
  await expect(lines.locator("article").nth(1).getByRole("listitem")).toHaveText(["Identidad visual", "Piezas para redes", "Presentaciones", "Catálogos"]);

  await page.goto("/en");
  const english = page.getByRole("region", { name: "Five lines, one standard." });
  for (const line of LINES) {
    await expect(english.getByRole("link", { name: `View ${line.english}`, exact: true })).toHaveAttribute("href", line.englishHref);
  }
});

test("on a card, the whole card is the link", async ({ page }) => {
  await page.goto("/");
  const card = page.getByRole("region", { name: "Cinco líneas, un mismo criterio." }).locator("li").filter({ has: page.getByRole("heading", { level: 3, name: "Minecraft", exact: true }) });
  await card.scrollIntoViewIfNeeded();
  // A click on the scene, far from the button, opens the line: the button stretches over the card.
  const scene = await card.locator("[data-scene]").boundingBox();
  if (!scene) throw new Error("the card has no scene on screen");
  await page.mouse.click(scene.x + 20, scene.y + 20);
  await expect(page).toHaveURL(/\/servicios\/minecraft$/);
});

test("the home page no longer carries the questions or the numbered list of lines", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("main").locator("details")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Claridad antes de empezar." })).toHaveCount(0);
  await expect(page.getByText("¿Qué es un sitio web?")).toHaveCount(0);
  // "Trabajo destacado" stays hidden until there is a portfolio.
  await expect(page.getByRole("main").getByRole("link", { name: /portafolio/i })).toHaveCount(0);
});

test("how we work: four steps on stone, in four columns on a wide screen and one on a phone", async ({ page }) => {
  await page.goto("/");
  const process = page.getByRole("region", { name: "Cómo trabajamos" });
  expect(await process.evaluate((section) => getComputedStyle(section).backgroundColor)).toBe("rgb(244, 244, 241)");
  const steps = process.getByRole("listitem");
  await expect(steps.getByRole("heading", { level: 3 })).toHaveText(["Nos cuentas", "Cotización", "Producción", "Entrega"]);
  await expect(steps.nth(3)).toContainText("Recibes el proyecto listo para usar y respaldado por 30 días de garantía.");
  // On stone the number is in the deep bronze: bronze as text is only for ink.
  expect(await steps.first().locator("span").first().evaluate((number) => getComputedStyle(number).color)).toBe("rgb(122, 92, 20)");

  await steps.first().scrollIntoViewIfNeeded();
  const tops = await steps.evaluateAll((all) => all.map((step) => Math.round(step.getBoundingClientRect().top)));
  const columns = new Set(await steps.evaluateAll((all) => all.map((step) => Math.round(step.getBoundingClientRect().left)))).size;
  if ((page.viewportSize()?.width ?? 0) >= 1024) {
    expect(new Set(tops).size, "one row").toBe(1);
    expect(columns).toBe(4);
  } else {
    expect(new Set(tops).size, "one column").toBe(4);
    expect(columns).toBe(1);
  }
});

test("the closing band is centred and shows the three channels, WhatsApp first and leading to the quote form", async ({ page }) => {
  await page.goto("/");
  const closing = page.getByRole("region", { name: "Hablemos de tu proyecto." });
  expect(await closing.evaluate((section) => getComputedStyle(section).textAlign)).toBe("center");
  await expect(closing.getByText("Elige el canal de tu preferencia. Analizamos tu solicitud y respondemos con una cotización a la medida.")).toBeVisible();
  const channels = closing.getByRole("list", { name: "Canales de contacto" }).getByRole("link");
  await expect(channels).toHaveText(["WhatsApp", "Discord", "Correo"]);
  await expect(channels.nth(0)).toHaveAttribute("href", "/contacto#cotizador");

  // Discord and e-mail are inert while their data is pending in site.config.ts.
  const pending: [number, boolean][] = [
    [1, siteConfig.contact.discordInvite.status === "pending"],
    [2, siteConfig.contact.email.status === "pending"],
  ];
  for (const [index, isPending] of pending) {
    if (!isPending) continue;
    await expect(channels.nth(index)).toBeDisabled();
    await expect(channels.nth(index)).not.toHaveAttribute("href", /.*/);
  }
  if (pending.some(([, isPending]) => isPending)) await expect(closing.getByText("[Canales por activar]")).toBeVisible();
});

test("blocks come in as they enter the screen, and end in place", async ({ page }) => {
  await page.goto("/");
  const blocks = page.locator("main .reveal");
  expect(await blocks.count()).toBeGreaterThanOrEqual(9);
  // The entrance follows the scroll: it is not an animation that runs by itself.
  const supported = await page.evaluate(() => CSS.supports("animation-timeline: view()"));
  test.skip(!supported, "this browser has no scroll-driven animations: the blocks are simply in place");
  const last = blocks.last();
  await last.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 400);
  await expect.poll(() => last.evaluate((block) => getComputedStyle(block).opacity)).toBe("1");
  await expect.poll(() => last.evaluate((block) => getComputedStyle(block).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("every block is in place from the start", async ({ page }) => {
    await page.goto("/");
    const states = await page.locator("main .reveal").evaluateAll((all) => all.map((block) => `${getComputedStyle(block).opacity} ${getComputedStyle(block).transform}`));
    expect(states.length).toBeGreaterThanOrEqual(9);
    expect(new Set(states)).toEqual(new Set(["1 none"]));
  });
});
