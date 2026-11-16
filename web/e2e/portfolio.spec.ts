import type { Page } from "@playwright/test";
import en from "../messages/en.json";
import es from "../messages/es.json";
import { serviceLines } from "../src/content/service-lines";
import { filterLines, showFilter } from "../src/lib/line-filter";
import type { ShownCase } from "../src/content/types";
import { type AppLocale, locales, otherLocale } from "../src/i18n/locales";
import { clientLabel, lineNames, nextCase, visibleCases } from "../src/lib/portfolio";
import { entryPath, isGenerated, isListed, localizedPath } from "../src/routes";
import { portfolioPending, siteConfig } from "../src/site.config";
import { expect, test } from "./helpers";

// docs/specs/005-portafolio-y-casos.md, RF-1 to RF-4, RF-6 and RF-9 in the browser. Metadata,
// sitemap and the 404s are checked on the server HTML by the smoke test; axe, 320 px, text at
// 200 % and touch targets of these pages by accessibility.spec.ts.

const MESSAGES = { es, en } as const;
const COLLECTION = "/portafolio/[slug]";
const cases = visibleCases();
// The portfolio pages exist in this build (hidden on the open site they are a 404: see playwright.config.ts).
const generated = isGenerated("/portafolio");
const casePath = (item: ShownCase, locale: AppLocale) => entryPath(COLLECTION, item.slug, locale);
const show = <T,>(value: T | { pending: keyof typeof portfolioPending }, locale: AppLocale, format: (ready: T) => string) =>
  value && typeof value === "object" && "pending" in value ? portfolioPending[value.pending].placeholder[locale] : format(value as T);

/** Cards of the index that are on screen, by case name. */
async function visibleCards(page: Page): Promise<string[]> {
  return page.locator("main ul > li:visible h2").allTextContents();
}

for (const locale of generated ? locales : []) {
  const t = MESSAGES[locale].Portfolio;
  const index = localizedPath("/portafolio", locale);
  // The filter offers "Todos" and the lines with at least one case; with a single line it is not drawn.
  const lines = filterLines(cases.map((item) => item.lines));
  const options = [{ id: "all", label: t.all }, ...serviceLines.filter((line) => lines.includes(line.id)).map((line) => ({ id: line.id, label: line.shortName[locale] }))];
  const expectedFor = (option: string) => cases.filter((item) => option === "all" || item.lines.some((line) => line === option)).map((item) => item.name);

  test(`${index} shows the rule, the filters and one card per published case (RF-1)`, async ({ page }) => {
    await page.goto(index);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(`${t.titleLine1} ${t.titleLine2}`);
    await expect(page.getByText(t.text, { exact: true })).toBeVisible();
    const crumbs = page.getByRole("navigation", { name: MESSAGES[locale].Sections.breadcrumb }).getByRole("listitem");
    await expect(crumbs).toHaveCount(2);

    const filter = page.getByRole("group", { name: t.filterLabel });
    if (showFilter(lines)) {
      await expect(filter.getByRole("radio")).toHaveCount(options.length);
      for (const option of options) await expect(filter.getByText(option.label, { exact: true })).toBeVisible();
      await expect(filter.getByRole("radio", { name: t.all })).toBeChecked();
    } else {
      await expect(filter).toHaveCount(0);
    }

    const projects = page.getByRole("region", { name: t.projects });
    await expect(projects.getByRole("link")).toHaveCount(cases.length);
    for (const item of cases) {
      const card = projects.getByRole("link", { name: new RegExp(item.name) });
      await expect(card).toHaveAttribute("href", casePath(item, locale));
      await expect(card.getByRole("heading", { level: 2 })).toHaveText(item.name);
      await expect(card).toContainText(lineNames(item.lines, locale), { ignoreCase: true });
      await expect(card).toContainText(show(item.year, locale, String));
      await expect(card).toContainText(`${item.cardText[locale]}. ${clientLabel(item, t)}.`);
    }
  });

  test(`${index} filters by line with the mouse and with the keyboard (RF-2)`, async ({ page }) => {
    test.skip(!showFilter(lines), "fewer than two lines have cases: there is no filter");
    await page.goto(index);
    const filter = page.getByRole("group", { name: t.filterLabel });
    for (const option of [...options.slice(1), options[0]]) {
      if (!option) continue;
      await filter.locator("label", { hasText: option.label }).click();
      await expect(filter.getByRole("radio", { name: option.label, exact: true })).toBeChecked();
      expect(await visibleCards(page), option.id).toEqual(expectedFor(option.id));
    }
    // Arrow keys move through the group and the choice follows the focus, as in any radio group.
    await filter.getByRole("radio", { name: t.all }).focus();
    await page.keyboard.press("ArrowRight");
    const second = options[1];
    if (!second) throw new Error("no line options");
    await expect(filter.getByRole("radio", { name: second.label, exact: true })).toBeChecked();
    await expect(filter.getByRole("radio", { name: second.label, exact: true })).toBeFocused();
    expect(await visibleCards(page)).toEqual(expectedFor(second.id));
  });

  test.describe(`${index} without JavaScript`, () => {
    test.use({ javaScriptEnabled: false });
    test(`the filter still works (RF-2)`, async ({ page }) => {
      test.skip(!showFilter(lines), "fewer than two lines have cases: there is no filter");
      await page.goto(index);
      const filter = page.getByRole("group", { name: t.filterLabel });
      for (const option of options.slice(1)) {
        await filter.locator("label", { hasText: option.label }).click();
        expect(await visibleCards(page), option.id).toEqual(expectedFor(option.id));
      }
    });
  });

  for (const item of cases) {
    const path = casePath(item, locale);

    test(`${path} shows the case in the order of the mockup (RF-3, RF-4)`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(item.name);
      await expect(page.getByText(item.summary[locale], { exact: true })).toBeVisible();

      // Home › Portfolio › case: the way back to the portfolio.
      const crumbs = page.getByRole("navigation", { name: MESSAGES[locale].Sections.breadcrumb }).getByRole("listitem");
      await expect(crumbs).toHaveCount(3);
      await expect(page.getByRole("navigation", { name: MESSAGES[locale].Sections.breadcrumb }).getByRole("link", { name: t.label })).toHaveAttribute("href", index);
      await expect(crumbs.last().locator("[aria-current=page]")).toHaveText(item.name);

      const facts = page.locator("main dl");
      await expect(facts.locator("dt")).toHaveText([t.lines, t.year, t.client], { ignoreCase: true });
      await expect(facts.locator("dd")).toHaveText([lineNames(item.lines, locale), show(item.year, locale, String), clientLabel(item, t)]);

      const headings = await page.getByRole("main").getByRole("heading", { level: 2 }).allTextContents();
      expect(headings.map((heading) => heading.toLowerCase())).toEqual(
        [t.challenge, t.result, t.work, t.pieces, MESSAGES[locale].ContactCta.title].map((heading) => heading.toLowerCase()),
      );
      // One item per piece (a palette is a list of its own inside its piece).
      await expect(page.getByRole("region", { name: t.pieces }).locator(":scope > ul > li")).toHaveCount(item.pieces.length);
    });

    const next = nextCase(item);
    if (next) {
      test(`${path} leads to the next project (RF-3)`, async ({ page }) => {
        await page.goto(path);
        const link = page.getByRole("link", { name: new RegExp(`${t.next}.*${next.name}`, "i") });
        await expect(link).toHaveAttribute("href", casePath(next, locale));
        await link.click();
        await expect(page).toHaveURL(new RegExp(`${casePath(next, locale)}$`));
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(next.name);
      });
    }

    test(`${path}: ES / EN lead to the same case in the other language (RF-9)`, async ({ page }, testInfo) => {
      const other = otherLocale(locale);
      const target = casePath(item, other);
      await page.goto(path);
      const banner = page.getByRole("banner");
      // The language bar offers the same case too (it is shown only when the browser asks for it).
      await expect(banner.locator('[role="region"] a[hreflang]')).toHaveAttribute("href", target);

      if (testInfo.project.name === "mobile") {
        await banner.getByRole("button", { name: MESSAGES[locale].Nav.openMenu }).click();
        const dialog = page.getByRole("dialog");
        const option = dialog.getByRole("link", { name: MESSAGES[locale].Language[other], exact: true });
        await expect(option).toHaveAttribute("href", target);
        await option.click();
      } else {
        const option = banner.getByRole("group", { name: MESSAGES[locale].Language.label }).getByRole("link", { name: other, exact: true });
        await expect(option).toHaveAttribute("href", target);
        await option.click();
      }
      await expect(page).toHaveURL(new RegExp(`${target}$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(item.name);
      await expect(page.locator("html")).toHaveAttribute("lang", other);
    });
  }
}

test("a case that does not exist answers with the brand 404 (RF-8)", async ({ page }) => {
  const response = await page.goto(entryPath(COLLECTION, { es: "no-existe-e2e", en: "no-existe-e2e" }, "es"));
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(`${es.NotFound.titleLine} ${es.NotFound.titleAccent}`);
});

test("the menu and the public pages link to the portfolio only when it is public (RF-6)", async ({ page }, testInfo) => {
  const listed = isListed("/portafolio");
  expect(listed).toBe(siteConfig.features.portfolio);
  for (const path of ["/", "/servicios", "/en/services", "/servicios/minecraft", "/nosotros"]) {
    await page.goto(path);
    const links = page.locator('a[href^="/portafolio"], a[href^="/en/work"]');
    if (listed) expect(await links.count(), path).toBeGreaterThan(0);
    else await expect(links, path).toHaveCount(0);
  }
  await page.goto("/");
  const name = es.Nav.portfolio;
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: es.Nav.openMenu }).click();
    await expect(page.getByRole("dialog").getByRole("link", { name, exact: true })).toHaveCount(listed ? 1 : 0);
  } else {
    await expect(page.getByRole("navigation", { name: es.Nav.label }).getByRole("link", { name, exact: true })).toHaveCount(listed ? 1 : 0);
  }
});
