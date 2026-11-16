import en from "../messages/en.json";
import es from "../messages/es.json";
import { locales } from "../src/i18n/locales";
import { getWrittenEmail } from "../src/lib/contact";
import { entryPath, isGenerated, localizedPath } from "../src/routes";
import { expect, test } from "./helpers";

// docs/specs/008-aviso-de-minecraft-por-linea.md in the browser. The smoke test checks the same on
// the server HTML of every page and entry; the unit tests, the rule (src/lib/notices.test.ts).
// The addresses are written by hand on purpose: they are what the founder asked for.

const MESSAGES = { es, en } as const;
const MINECRAFT_PAGES = ["/servicios/minecraft", "/servicios/minecraft/plugins", "/servicios/minecraft/servidores", "/servicios/minecraft/tebex"] as const;
const DISCORD_PAGES = ["/servicios/discord", "/servicios/discord/bots"] as const;
const OTHER_PAGES = ["/", "/servicios", "/servicios/desarrollo", "/servicios/desarrollo/tiendas-online", "/nosotros", "/contacto", "/portafolio", "/guias", "/legal/privacidad"] as const;
const CASES = "/portafolio/[slug]";
const kaelion = { es: "kaelion", en: "kaelion" };
const kardenum = { es: "kardenum", en: "kardenum" };
// The cases have a page in this build (hidden on the open site they are a 404: see playwright.config.ts).
const casesGenerated = isGenerated("/portafolio");

for (const locale of locales) {
  const { minecraftNotice, discordNotice } = MESSAGES[locale].Footer;
  const closing = `#${MESSAGES[locale].ContactCta.id}`;
  const minecraftPaths = [
    ...MINECRAFT_PAGES.filter((pathname) => isGenerated(pathname)).map((pathname) => localizedPath(pathname, locale)),
    ...(casesGenerated ? [entryPath(CASES, kaelion, locale)] : []),
  ];
  const otherPaths = [
    ...[...OTHER_PAGES, ...DISCORD_PAGES].filter((pathname) => isGenerated(pathname)).map((pathname) => localizedPath(pathname, locale)),
    ...(casesGenerated ? [entryPath(CASES, kardenum, locale)] : []),
  ];

  for (const path of minecraftPaths) {
    test(`${path} is about Minecraft: the notice in its footer and the e-mail written in its closing (RF-1, RF-5)`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("contentinfo")).toContainText(minecraftNotice);
      await expect(page.getByRole("contentinfo")).not.toContainText(discordNotice);
      const email = getWrittenEmail();
      await expect(page.locator(closing)).toContainText(email.text);
      // A link only once the address exists: never to an invented one.
      await expect(page.locator(`${closing} a[href^="mailto:"]`).filter({ hasText: email.text })).toHaveCount(email.href ? 1 : 0);
    });
  }

  for (const path of otherPaths) {
    test(`${path} is not about Minecraft: no Minecraft notice on it (RF-2)`, async ({ page }) => {
      await page.goto(path);
      // Footer and content, not <body>: the data Next serializes in its scripts always carries both sentences.
      await expect(page.getByRole("contentinfo")).toBeVisible();
      await expect(page.getByRole("contentinfo")).not.toContainText(minecraftNotice);
      await expect(page.getByRole("main")).not.toContainText(minecraftNotice);
    });
  }

  for (const path of DISCORD_PAGES.filter((pathname) => isGenerated(pathname)).map((pathname) => localizedPath(pathname, locale))) {
    test(`${path} is about Discord: the Discord notice in its footer (RF-6)`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("contentinfo")).toContainText(discordNotice);
    });
  }
}

test("the 404 page carries no trademark notice (RF-2)", async ({ page }) => {
  const response = await page.goto("/pagina-que-no-existe");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.getByRole("contentinfo")).not.toContainText(es.Footer.minecraftNotice);
  await expect(page.getByRole("contentinfo")).not.toContainText(es.Footer.discordNotice);
  await expect(page.getByRole("main")).not.toContainText(es.Footer.minecraftNotice);
});

// The footer is in the layout, which is not rendered again on a client-side navigation: the
// notice has to follow the page on screen by itself.
test("the notice comes and goes with the page, without reloading the document (RF-4)", async ({ page }) => {
  const footer = page.getByRole("contentinfo");
  const minecraft = localizedPath("/servicios/minecraft", "es");
  const discord = localizedPath("/servicios/discord", "es");

  await page.goto(minecraft);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    (window as unknown as { sameDocument?: boolean }).sameDocument = true;
  });
  const documents: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "document") documents.push(request.url());
  });
  await expect(footer).toContainText(es.Footer.minecraftNotice);

  // The strip of lines in the footer is there at every width.
  await footer.locator(`a[href="${discord}"]`).click();
  await expect(page).toHaveURL(new RegExp(`${discord}$`));
  await expect(footer).toContainText(es.Footer.discordNotice);
  await expect(footer).not.toContainText(es.Footer.minecraftNotice);

  await footer.locator(`a[href="${minecraft}"]`).click();
  await expect(page).toHaveURL(new RegExp(`${minecraft}$`));
  await expect(footer).toContainText(es.Footer.minecraftNotice);
  await expect(footer).not.toContainText(es.Footer.discordNotice);

  expect(documents, "documents requested during the navigation").toEqual([]);
  expect(await page.evaluate(() => (window as unknown as { sameDocument?: boolean }).sameDocument), "the page was not reloaded").toBe(true);
});

// From one case to the next the template is the same and only the slug changes.
test("from a case to the next one, the notice follows the case on screen, without reloading the document (RF-4)", async ({ page }) => {
  test.skip(!casesGenerated, "the portfolio is hidden and this is an open site: the cases are a 404");
  const footer = page.getByRole("contentinfo");
  const toKaelion = entryPath(CASES, kaelion, "es");
  const toKardenum = entryPath(CASES, kardenum, "es");

  await page.goto(toKardenum);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    (window as unknown as { sameDocument?: boolean }).sameDocument = true;
  });
  const documents: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "document") documents.push(request.url());
  });
  await expect(footer).not.toContainText(es.Footer.minecraftNotice);

  // "Siguiente proyecto" goes round the published cases.
  await page.getByRole("main").locator(`a[href="${toKaelion}"]`).click();
  await expect(page).toHaveURL(new RegExp(`${toKaelion}$`));
  await expect(footer).toContainText(es.Footer.minecraftNotice);

  await page.getByRole("main").locator(`a[href="${toKardenum}"]`).click();
  await expect(page).toHaveURL(new RegExp(`${toKardenum}$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kardenum");
  await expect(footer).not.toContainText(es.Footer.minecraftNotice);

  expect(documents, "documents requested during the navigation").toEqual([]);
  expect(await page.evaluate(() => (window as unknown as { sameDocument?: boolean }).sameDocument), "the page was not reloaded").toBe(true);
});
