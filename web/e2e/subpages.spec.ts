import es from "../messages/es.json";
import { subpages } from "../src/content/subpages";
import { linePages } from "../src/content/lines";
import { serviceLines } from "../src/content/service-lines";
import { locales } from "../src/i18n/locales";
import { isGenerated, isListed, localizedPath } from "../src/routes";
import { siteConfig } from "../src/site.config";
import { expect, test } from "./helpers";

// docs/specs/004-subpaginas-de-servicio.md. Structure, accessibility and technical SEO of every
// built page are covered by accessibility.spec.ts and the smoke test, which visit these pages too.

const SECTIONS = {
  es: { offer: "Qué hacemos", deliverables: "Qué recibes", process: "Cómo trabajamos", faq: "Preguntas frecuentes", related: "Servicios relacionados", other: "Otros canales", breadcrumb: "Ruta", contact: "Hablemos de tu proyecto." },
  en: { offer: "What we do", deliverables: "What you get", process: "How we work", faq: "Frequently asked questions", related: "Related services", other: "Other channels", breadcrumb: "Breadcrumb", contact: "Let's talk about your project." },
} as const;

// Only the sub-pages this build generates (hidden ones on the open site are a 404: see playwright.config.ts).
for (const page of Object.values(subpages).filter((candidate) => isGenerated(candidate.pathname))) {
  for (const locale of locales) {
    const path = localizedPath(page.pathname, locale);
    const community = linePages[page.line].kind === "community";

    test(`${path} shows the service in the order of the mockup (RF-1)`, async ({ page: browser }) => {
      await browser.goto(path);
      const title = [...page.hero.titleLines[locale], page.hero.titleAccent[locale]].join(" ");
      await expect(browser.getByRole("heading", { level: 1 })).toHaveText(title);

      // Home › Services › line › service, the last one as the current page.
      const crumbs = browser.getByRole("navigation", { name: SECTIONS[locale].breadcrumb }).getByRole("listitem");
      await expect(crumbs).toHaveCount(4);
      await expect(crumbs.last().locator("[aria-current=page]")).toHaveCount(1);

      const main = browser.getByRole("main");
      const headings = await main.getByRole("heading", { level: 2 }).allTextContents();
      expect(headings).toEqual([
        page.offer.title[locale],
        page.deliverables.title[locale],
        SECTIONS[locale].process,
        page.faq.title[locale],
        page.related.title[locale],
        SECTIONS[locale].contact,
      ]);

      await expect(browser.getByRole("region", { name: page.offer.title[locale] }).getByRole("listitem")).toHaveCount(4);
      await expect(browser.getByRole("region", { name: SECTIONS[locale].process }).getByRole("listitem")).toHaveCount(4);
      await expect(browser.getByRole("region", { name: page.faq.title[locale] }).locator("details")).toHaveCount(page.faq.items.length);
      // The first answer is open; the others are in the page, folded.
      await expect(browser.getByText(page.faq.items[0]?.answer[locale] ?? "", { exact: true })).toBeVisible();

      const received = browser.getByRole("region", { name: page.deliverables.title[locale] });
      for (const item of page.deliverables.items) await expect(received.getByText(item[locale], { exact: true })).toBeVisible();
      if (page.deliverables.chips) {
        await expect(received.getByRole("heading", { level: 3, name: page.deliverables.chips.label[locale] })).toBeVisible();
        for (const chip of page.deliverables.chips.items) await expect(received.getByText(chip, { exact: true })).toBeVisible();
      }
    });

    test(`${path} quotes through the channel of its line (RF-5)`, async ({ page: browser }) => {
      await browser.goto(path);
      const hero = browser.getByRole("main").locator("section").first();
      const primary = hero.getByRole("link", { name: page.hero.cta[locale], exact: true });
      const contactId = locale === "es" ? "contacto" : "contact";
      if (community) {
        // Discord, once the studio's invitation exists; until then, the contact channels of the page.
        const invite = siteConfig.contact.discordInvite;
        await expect(primary).toHaveAttribute("href", invite.status === "ready" ? invite.value : `#${contactId}`);
      } else {
        const href = await primary.getAttribute("href");
        expect(href).toBe(`${localizedPath("/contacto", locale)}?linea=${page.line}#${locale === "es" ? "cotizador" : "quote"}`);
      }
      await expect(hero.getByRole("link", { name: SECTIONS[locale].other, exact: true })).toHaveAttribute("href", `#${contactId}`);

      // The closing band leads with the same channel.
      const channels = browser.locator(`#${contactId}`).getByRole("list").first().getByRole("listitem");
      await expect(channels.first()).toContainText(community ? "Discord" : "WhatsApp");
    });

    test(`${path} links each related service to a page that exists (RF-6)`, async ({ page: browser }) => {
      await browser.goto(path);
      const links = browser.getByRole("region", { name: page.related.title[locale] }).getByRole("link");
      await expect(links).toHaveCount(4);
      for (const [index, related] of page.related.items.entries()) {
        const link = links.nth(index);
        await expect(link).toHaveAttribute("href", localizedPath(related.pathname, locale));
        await expect(link).toContainText(related.name[locale]);
        await expect(link).toContainText(serviceLines.find((line) => line.id === related.line)?.name[locale] ?? "");
      }
      // One of them, followed: it arrives at a real page.
      const target = localizedPath(page.related.items[0]?.pathname ?? "/", locale);
      await links.first().click();
      await expect(browser).toHaveURL(new RegExp(`${target}$`));
      await expect(browser.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }
}

test("no works or guides are shown while those sections of the site are hidden (RF-7)", async ({ page }) => {
  test.skip(isListed("/portafolio") || isListed("/guias"), "the portfolio or the guides are public");
  for (const path of ["/servicios/minecraft/tebex", "/en/services/discord/bots"]) {
    await page.goto(path);
    // No section of works or guides, and none of the placeholder cards of the mockups.
    await expect(page.getByRole("heading", { name: /Trabajos|Guías|Guides|^Work$/ })).toHaveCount(0);
    await expect(page.getByRole("main").getByRole("link", { name: /portafolio|portfolio|our work/i })).toHaveCount(0);
    await expect(page.getByRole("main")).not.toContainText(/CAPTURA|NOMBRE DEL|FECHA/i);
  }
});

test("while the sub-pages are hidden, the public pages do not lead to them (RF-2)", async ({ page }, testInfo) => {
  test.skip(siteConfig.features.serviceSubpages, "the sub-pages are public");
  for (const path of ["/", "/servicios", "/servicios/minecraft", "/en/services/development"]) {
    await page.goto(path);
    const hrefs = await page.locator("a[href]").evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href") ?? ""));
    const hidden = Object.values(subpages).flatMap((subpage) => locales.map((locale) => localizedPath(subpage.pathname, locale)));
    expect(hrefs.filter((href) => hidden.includes(href)), `links on ${path}`).toEqual([]);
  }
  // The menu neither: the dropdown on a wide screen, the full-screen menu on a phone.
  await page.goto("/");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("banner").getByRole("button", { name: "Abrir menú" }).click();
    await expect(page.getByRole("dialog", { name: "Menú" }).getByRole("link", { name: "Plugins" })).toHaveCount(0);
  } else {
    await page.getByRole("navigation", { name: "Principal" }).getByRole("button", { name: "Servicios" }).click();
    await expect(page.getByRole("banner").getByRole("link", { name: "Plugins" })).toHaveCount(0);
  }
  const response = await page.goto("/servicios/minecraft/plugins");
  if (isGenerated("/servicios/minecraft/plugins")) {
    // Closed site. Hidden is not absent: the address answers, closed to search engines.
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  } else {
    // Open site: the page is not part of the build (specs 004 to 006, "Páginas ocultas y sitio abierto").
    expect(response?.status()).toBe(404);
  }
});

// The whole sentence, not the word: "Discord" and "Minecraft" are always in the footer, as names of lines.
test("the bots page carries the Discord notice in its footer, and not the Minecraft one (RF-8; spec 008)", async ({ page }) => {
  test.skip(!isGenerated("/servicios/discord/bots"), "the sub-pages are hidden and this is an open site: the page is a 404");
  await page.goto("/servicios/discord/bots");
  await expect(page.getByRole("contentinfo")).toContainText(es.Footer.discordNotice);
  await expect(page.getByRole("contentinfo")).not.toContainText(es.Footer.minecraftNotice);
});

// Founder's decision (2026-11-15): one root layout for the whole site, so going from a line to
// its sub-page is a client-side navigation, never a full reload. Runs once the sub-pages are on.
test("from a line, its sub-page opens on the client, without reloading the document", async ({ page }) => {
  test.skip(!siteConfig.features.serviceSubpages, "the sub-pages are hidden: the line does not link to them");
  await page.goto(localizedPath("/servicios/minecraft", "es"));
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    (window as unknown as { sameDocument?: boolean }).sameDocument = true;
  });
  const documents: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "document") documents.push(request.url());
  });
  const target = localizedPath("/servicios/minecraft/plugins", "es");
  await page.getByRole("main").locator(`a[href="${target}"]`).first().click();
  await expect(page).toHaveURL(new RegExp(`${target}$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText([...subpages.plugins.hero.titleLines.es, subpages.plugins.hero.titleAccent.es].join(" "));
  expect(documents, "documents requested during the navigation").toEqual([]);
  expect(await page.evaluate(() => (window as unknown as { sameDocument?: boolean }).sameDocument), "the page was not reloaded").toBe(true);
});
