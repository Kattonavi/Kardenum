import { expect, type Page, test } from "@playwright/test";

// docs/specs/001-barra-de-idioma.md. The site never redirects by language: a bar offers the
// other version and the choice is remembered.

const bar = (page: Page) => page.getByRole("region", { name: /^(Language|Idioma)$/ });

async function languageCookie(page: Page): Promise<string | undefined> {
  const cookies = await page.context().cookies();
  return cookies.find((cookie) => cookie.name === "kardenum_lang")?.value;
}

test.describe("browser in English", () => {
  test.use({ locale: "en-US" });

  test("RF-1: the Spanish home stays in Spanish and offers English", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(bar(page)).toBeVisible();
    await expect(bar(page)).toHaveAttribute("lang", "en");
    await expect(bar(page).getByRole("link", { name: "View in English" })).toBeVisible();
  });

  test("RF-5: accepting the offer goes to the same page in English and is remembered", async ({ page }) => {
    await page.goto("/");
    await bar(page).getByRole("link", { name: "View in English" }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(bar(page)).toBeHidden();
    expect(await languageCookie(page)).toBe("en");

    // Back on the Spanish page (a shared link, for example) English is offered again: no redirect.
    await page.goto("/");
    expect(new URL(page.url()).pathname).toBe("/");
    await expect(bar(page)).toBeVisible();
  });

  test("RF-4: dismissing the bar keeps it closed on later visits", async ({ page }) => {
    await page.goto("/");
    await bar(page).getByRole("button", { name: "Close language notice" }).click();
    await expect(bar(page)).toBeHidden();
    expect(await languageCookie(page)).toBe("es");

    await page.reload();
    await expect(bar(page)).toBeHidden();
  });

  test("the bar is decided before the first paint: it does not shift the page", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(bar(page)).toBeVisible();
    const shift = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const layoutShift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
              if (!layoutShift.hadRecentInput) total += layoutShift.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
          setTimeout(() => resolve(total), 500);
        }),
    );
    expect(shift).toBeLessThan(0.02);
  });

  test("RF-3: the English page offers nothing to an English browser", async ({ page }) => {
    await page.goto("/en");
    await expect(bar(page)).toBeHidden();
  });
});

test.describe("browser in Spanish", () => {
  test("RF-2: the Spanish home offers nothing", async ({ page }) => {
    await page.goto("/");
    await expect(bar(page)).toBeHidden();
    expect(await languageCookie(page)).toBeUndefined();
  });

  test("RF-3: the English page offers Spanish, in Spanish", async ({ page }) => {
    await page.goto("/en");
    await expect(bar(page)).toBeVisible();
    await expect(bar(page)).toHaveAttribute("lang", "es");
    await bar(page).getByRole("link", { name: "Ver en español" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    expect(await languageCookie(page)).toBe("es");
  });

  test("ES / EN leads to the same page in the other language and remembers it", async ({ page }) => {
    await page.goto("/");
    const switcher = page.getByRole("banner").getByRole("group", { name: "Idioma" });
    await expect(switcher.getByRole("link", { name: "es", exact: true })).toHaveAttribute("aria-current", "true");
    await switcher.getByRole("link", { name: "en", exact: true }).click();
    await expect(page).toHaveURL(/\/en$/);
    expect(await languageCookie(page)).toBe("en");
    // The visitor chose English: the English page does not offer Spanish back.
    await expect(bar(page)).toBeHidden();
  });
});

// Inner pages have a different address in each language (translated slugs): the links must go
// to the final address of the same page, not to the other home page and not through a redirect.
test.describe("translated addresses", () => {
  test("ES / EN on an inner page: same page, final address, no redirect", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "the header shows ES / EN at every width; one size is enough here");
    const redirects: string[] = [];
    page.on("response", (response) => {
      if (response.status() >= 300 && response.status() < 400) redirects.push(`${response.status()} ${response.url()}`);
    });

    await page.goto("/servicios/desarrollo");
    const switcher = page.getByRole("banner").getByRole("group", { name: "Idioma" });
    await expect(switcher.getByRole("link", { name: "es", exact: true })).toHaveAttribute("href", "/servicios/desarrollo");
    await expect(switcher.getByRole("link", { name: "en", exact: true })).toHaveAttribute("href", "/en/services/development");

    await switcher.getByRole("link", { name: "en", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/services\/development$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const english = page.getByRole("banner").getByRole("group", { name: "Language" });
    await expect(english.getByRole("link", { name: "es", exact: true })).toHaveAttribute("href", "/servicios/desarrollo");
    await english.getByRole("link", { name: "es", exact: true }).click();
    await expect(page).toHaveURL(/\/servicios\/desarrollo$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    expect(redirects).toEqual([]);
  });

  test("the phone menu offers the same page in the other language", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "phone layout only");
    await page.goto("/en/about");
    await page.getByRole("button", { name: "Open menu" }).click();
    const language = page.getByRole("dialog", { name: "Menu" }).getByRole("group", { name: "Language" });
    await expect(language.getByRole("link", { name: "Español" })).toHaveAttribute("href", "/nosotros");
    await expect(language.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en/about");
  });

  test("the language bar offers the same inner page, not the home page", async ({ browser }) => {
    const englishBrowser = await browser.newContext({ locale: "en-US" });
    const spanishPage = await englishBrowser.newPage();
    await spanishPage.goto("/contacto");
    await expect(bar(spanishPage).getByRole("link", { name: "View in English" })).toHaveAttribute("href", "/en/contact");
    await bar(spanishPage).getByRole("link", { name: "View in English" }).click();
    await expect(spanishPage).toHaveURL(/\/en\/contact$/);
    await englishBrowser.close();

    const spanishBrowser = await browser.newContext({ locale: "es-CO" });
    const englishPage = await spanishBrowser.newPage();
    await englishPage.goto("/en/services/minecraft");
    await expect(bar(englishPage).getByRole("link", { name: "Ver en español" })).toHaveAttribute("href", "/servicios/minecraft");
    await bar(englishPage).getByRole("link", { name: "Ver en español" }).click();
    await expect(englishPage).toHaveURL(/\/servicios\/minecraft$/);
    await expect(englishPage.locator("html")).toHaveAttribute("lang", "es");
    await spanishBrowser.close();
  });
});
