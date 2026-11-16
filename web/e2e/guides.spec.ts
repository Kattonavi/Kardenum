import en from "../messages/en.json";
import es from "../messages/es.json";
import { linePages } from "../src/content/lines";
import { getPageName } from "../src/content/pages";
import { serviceLines } from "../src/content/service-lines";
import { filterLines, showFilter } from "../src/lib/line-filter";
import { locales, otherLocale } from "../src/i18n/locales";
import { formatGuideDate, relatedGuides, sortedGuides } from "../src/lib/guides";
import { entryPath, isGenerated, isListed, localizedPath } from "../src/routes";
import { siteConfig } from "../src/site.config";
import { expect, sidewaysOverflow, test } from "./helpers";

// docs/specs/006-guias.md in the browser. Today the registry is empty: the index is checked as it
// is, and the guide tests run once guides exist (in a scratch clone, with the fictitious test
// guide). Metadata, sitemap, Article and the 404s are checked on the server HTML by the smoke
// test; axe, 320 px, text at 200 % and touch targets by accessibility.spec.ts.

const MESSAGES = { es, en } as const;
const COLLECTION = "/guias/[slug]";
const shown = sortedGuides();
// The guide pages exist in this build (hidden on the open site they are a 404: see playwright.config.ts).
const generated = isGenerated("/guias");

for (const locale of generated ? locales : []) {
  const t = MESSAGES[locale].Guides;
  const index = localizedPath("/guias", locale);

  test(`${index} shows its heading, and the filter and cards only when there are guides (RF-1)`, async ({ page }) => {
    await page.goto(index);
    const crumbs = page.getByRole("navigation", { name: MESSAGES[locale].Sections.breadcrumb }).getByRole("listitem");
    await expect(crumbs).toHaveCount(2);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(`${t.titleLine} ${t.titleAccent}`);
    await expect(page.getByText(t.text, { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: MESSAGES[locale].ContactCta.title })).toBeVisible();

    const filter = page.getByRole("group", { name: t.filterLabel });
    const published = page.getByRole("region", { name: t.published });
    if (shown.length === 0) {
      // No guide: only the heading. No empty filter, no empty list.
      await expect(filter).toHaveCount(0);
      await expect(published).toHaveCount(0);
      return;
    }
    // "Todas" and the lines with at least one guide; with a single line there is no filter.
    const lines = filterLines(shown.map(({ meta }) => [meta.line]));
    if (showFilter(lines)) {
      await expect(filter.getByRole("radio")).toHaveCount(lines.length + 1);
      await expect(filter.getByRole("radio", { name: t.all })).toBeChecked();
      for (const line of serviceLines) await expect(filter.getByText(line.shortName[locale], { exact: true })).toHaveCount(lines.includes(line.id) ? 1 : 0);
    } else {
      await expect(filter).toHaveCount(0);
    }
    await expect(published.getByRole("link")).toHaveCount(shown.length);
    for (const { meta } of shown) {
      const card = published.getByRole("link", { name: new RegExp(meta.title[locale].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) });
      await expect(card).toHaveAttribute("href", entryPath(COLLECTION, meta.slug, locale));
      await expect(card.locator(`time[datetime="${meta.publishedAt}"]`)).toHaveText(formatGuideDate(meta.publishedAt, locale), { ignoreCase: true });
    }
  });

  for (const { meta } of shown) {
    const path = entryPath(COLLECTION, meta.slug, locale);
    const sectionId = t.sectionId;

    test(`${path} shows the guide in the order of the template (RF-2, RF-3)`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(meta.title[locale]);
      await expect(page.getByText(meta.summary[locale], { exact: true })).toBeVisible();
      await expect(page.locator(`main time[datetime="${meta.publishedAt}"]`).first()).toHaveText(formatGuideDate(meta.publishedAt, locale));
      await expect(page.locator(`main time[datetime="${meta.updatedAt}"]`).first()).toHaveText(formatGuideDate(meta.updatedAt, locale));

      // Numbered sections, in the order of meta.ts.
      const titles = meta.sections.map((section, n) => `${String(n).padStart(2, "0")} · ${section[locale]}`);
      await expect(page.locator("main article h2")).toHaveText(titles);

      // "En esta guía": one link per section, each leading to it.
      const contents = page.getByRole("navigation", { name: t.contents }).getByRole("link");
      await expect(contents).toHaveCount(meta.sections.length);
      for (let n = 0; n < meta.sections.length; n += 1) await expect(contents.nth(n)).toHaveAttribute("href", `#${sectionId}-${n}`);
      const last = meta.sections.length - 1;
      await contents.nth(last).click();
      await expect(page).toHaveURL(new RegExp(`#${sectionId}-${last}$`));
      await expect(page.locator(`#${sectionId}-${last}`)).toBeInViewport();
    });

    test(`${path} leads to its service and its quote channel (RF-4)`, async ({ page }) => {
      await page.goto(path);
      const band = page.getByRole("region", { name: t.serviceTitle });
      await expect(band).toContainText(`${t.relatedService} · ${getPageName(meta.service)[locale]}`, { ignoreCase: true });
      const community = linePages[meta.line].kind === "community";
      const quote = band.getByRole("link", { name: community ? t.quoteDiscord : t.quoteForm, exact: true });
      if (community) {
        const invite = siteConfig.contact.discordInvite;
        await expect(quote).toHaveAttribute("href", invite.status === "ready" ? invite.value : `#${MESSAGES[locale].ContactCta.id}`);
      } else {
        await expect(quote).toHaveAttribute("href", `${localizedPath("/contacto", locale)}?linea=${meta.line}#${MESSAGES[locale].ContactPage.quoteId}`);
      }
      // "Ver el servicio" only while that page is public.
      const service = band.getByRole("link", { name: t.viewService, exact: true });
      if (isListed(meta.service)) await expect(service).toHaveAttribute("href", localizedPath(meta.service, locale));
      else await expect(service).toHaveCount(0);
    });

    test(`${path} lists the related guides, when there are others (RF-2)`, async ({ page }) => {
      await page.goto(path);
      const related = relatedGuides(meta);
      const section = page.getByRole("region", { name: t.relatedTitle });
      if (related.length === 0) {
        await expect(section).toHaveCount(0);
        return;
      }
      await expect(section.getByRole("link")).toHaveCount(related.length);
      for (const [position, other] of related.entries()) {
        await expect(section.getByRole("link").nth(position)).toHaveAttribute("href", entryPath(COLLECTION, other.slug, locale));
      }
    });

    test(`${path}: ES / EN lead to the same guide in the other language (RF-5)`, async ({ page }, testInfo) => {
      const other = otherLocale(locale);
      const target = entryPath(COLLECTION, meta.slug, other);
      await page.goto(path);
      const banner = page.getByRole("banner");
      await expect(banner.locator('[role="region"] a[hreflang]')).toHaveAttribute("href", target);
      if (testInfo.project.name === "mobile") {
        await banner.getByRole("button", { name: MESSAGES[locale].Nav.openMenu }).click();
        const option = page.getByRole("dialog").getByRole("link", { name: MESSAGES[locale].Language[other], exact: true });
        await expect(option).toHaveAttribute("href", target);
        await option.click();
      } else {
        const option = banner.getByRole("group", { name: MESSAGES[locale].Language.label }).getByRole("link", { name: other, exact: true });
        await expect(option).toHaveAttribute("href", target);
        await option.click();
      }
      await expect(page).toHaveURL(new RegExp(`${target}$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(meta.title[other]);
    });

    test(`${path}: code and tables scroll inside a box that can be focused and says what it is (RF-3)`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(path);
      const boxes = page.locator('main article [role="group"][tabindex="0"]');
      const count = await boxes.count();
      for (let i = 0; i < count; i += 1) {
        const box = boxes.nth(i);
        await expect(box).toHaveAttribute("aria-label", new RegExp(`^(${t.code}|${t.table})$`));
        await box.focus();
        await expect(box).toBeFocused();
        const outline = await box.evaluate((element) => getComputedStyle(element).outlineStyle);
        expect(outline, "focus is visible").toBe("solid");
      }
      // Whatever their width, the page itself does not scroll sideways.
      expect(await sidewaysOverflow(page)).toBe(0);
    });
  }
}

test("no public page links to the guides while they are hidden, and the footer does once public (RF-6)", async ({ page }) => {
  const listed = isListed("/guias");
  expect(listed).toBe(siteConfig.features.guides);
  for (const path of ["/", "/servicios", "/en/services", "/servicios/minecraft", "/nosotros", "/portafolio"]) {
    await page.goto(path);
    const links = page.locator('a[href^="/guias"], a[href^="/en/guides"]');
    if (listed) await expect(page.getByRole("contentinfo").locator(`a[href="${localizedPath("/guias", path.startsWith("/en") ? "en" : "es")}"]`)).toHaveCount(1);
    else await expect(links, path).toHaveCount(0);
  }
});

test("a guide that does not exist answers with the brand 404 (RF-8)", async ({ page }) => {
  const response = await page.goto(entryPath(COLLECTION, { es: "no-existe-e2e", en: "no-existe-e2e" }, "es"));
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(`${es.NotFound.titleLine} ${es.NotFound.titleAccent}`);
});
