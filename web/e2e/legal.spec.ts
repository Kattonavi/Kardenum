import { siteConfig } from "../src/site.config";
import { expect, test } from "./helpers";

// Legal pages (docs/specs/003-paginas-legales.md, maquetas B-Legal-privacidad and B-Legal-terminos).

const PAGES = [
  {
    path: "/legal/privacidad",
    title: "Política de privacidad",
    crumb: "Privacidad",
    first: "Quién es el responsable",
    last: "Vigencia y conservación",
    data: siteConfig.legal.privacy,
  },
  {
    path: "/legal/terminos",
    title: "Términos del sitio",
    crumb: "Términos",
    first: "Quién opera este sitio",
    last: "Ley aplicable y cambios",
    data: siteConfig.legal.terms,
  },
] as const;

for (const legal of PAGES) {
  test(`RF-1: ${legal.path} has the structure of its mockup`, async ({ page }) => {
    await page.goto(legal.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(legal.title);
    await expect(page.getByRole("navigation", { name: "Ruta" }).getByRole("listitem")).toHaveText(["Inicio", legal.crumb]);
    await expect(page.getByText("Vigente desde", { exact: false })).toBeVisible();
    await expect(page.getByText("Última actualización", { exact: false })).toBeVisible();

    const contents = page.getByRole("navigation", { name: "Contenido" }).getByRole("link");
    const sections = page.getByRole("article").getByRole("heading", { level: 2 });
    await expect(contents).toHaveCount(8);
    await expect(sections).toHaveCount(8);
    await expect(sections.first()).toContainText(legal.first);
    await expect(sections.last()).toContainText(legal.last);

    // The list of contents and the sections say the same, in the same order, numbered 01 to 08.
    const listed = await contents.allTextContents();
    const headed = await sections.allTextContents();
    expect(listed.map((text) => text.slice(0, 2))).toEqual(["01", "02", "03", "04", "05", "06", "07", "08"]);
    expect(listed.map((text) => text.slice(2).trim())).toEqual(headed.map((text) => text.replace(/^\d{2} · /, "").trim()));
  });

  test(`RF-7: the contents of ${legal.path} lead to each section`, async ({ page }) => {
    await page.goto(legal.path);
    const contents = page.getByRole("navigation", { name: "Contenido" }).getByRole("link");
    const sections = page.getByRole("article").getByRole("heading", { level: 2 });
    for (const index of [0, 3, 7]) {
      await contents.nth(index).click();
      await expect(page).toHaveURL(new RegExp(`#s${index + 1}$`));
      await expect(sections.nth(index)).toBeInViewport();
    }
    // With the keyboard too: the link is a real link to the section.
    await contents.nth(1).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#s2$/);
    await expect(sections.nth(1)).toBeInViewport();
  });

  test(`RF-2: what is not written yet in ${legal.path} is shown in brackets, never invented`, async ({ page }) => {
    await page.goto(legal.path);
    const article = page.getByRole("article");
    if (legal.data.intro.status === "pending") await expect(article.locator("p").first()).toHaveText(legal.data.intro.placeholder.es);
    if (legal.data.effectiveDate.status === "pending") {
      await expect(page.getByText("Vigente desde", { exact: false })).toContainText(legal.data.effectiveDate.placeholder.es);
    }
    for (const text of Object.values(legal.data.sections)) {
      if (text.status === "pending") await expect(article.getByText(text.placeholder.es, { exact: true })).toBeVisible();
    }
    const owner = siteConfig.legal.owner;
    if (owner.name.status === "pending") await expect(article.getByText(owner.name.placeholder.es, { exact: false })).toBeVisible();
  });
}

test("RF-1: the legal pages exist in English, with their own address", async ({ page }) => {
  await page.goto("/en/legal/privacy");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Privacy policy");
  await expect(page.getByRole("navigation", { name: "Contents" }).getByRole("link")).toHaveCount(8);
  await expect(page.getByRole("article").getByRole("heading", { level: 2 }).first()).toContainText("Who is responsible");
  if (siteConfig.legal.privacy.intro.status === "pending") {
    await expect(page.getByRole("article").locator("p").first()).toHaveText(siteConfig.legal.privacy.intro.placeholder.en);
  }

  await page.goto("/en/legal/terms");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Site terms");
  await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("listitem")).toHaveText(["Home", "Terms"]);
});

test("RF-5: the footer leads to both legal pages, in the language of the page", async ({ page }) => {
  await page.goto("/servicios/diseno");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "Términos" })).toHaveAttribute("href", "/legal/terminos");
  await footer.getByRole("link", { name: "Privacidad" }).click();
  await expect(page).toHaveURL(/\/legal\/privacidad$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Política de privacidad");

  await page.goto("/en/contact");
  const english = page.getByRole("contentinfo");
  await expect(english.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/en/legal/privacy");
  await english.getByRole("link", { name: "Terms" }).click();
  await expect(page).toHaveURL(/\/en\/legal\/terms$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Site terms");
});

test("RF-5: the 404 page links to the legal pages too", async ({ page }) => {
  await page.goto("/pagina-que-no-existe");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "Privacidad" })).toHaveAttribute("href", "/legal/privacidad");
  await footer.getByRole("link", { name: "Términos" }).click();
  await expect(page).toHaveURL(/\/legal\/terminos$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Términos del sitio");
});
