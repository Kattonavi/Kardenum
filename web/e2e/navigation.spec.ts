import { siteConfig } from "../src/site.config";
import { expect, test } from "./helpers";

// BRIEF.md: the menu and the dropdown work completely with the keyboard.

test.describe("desktop menu", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop layout only");
  });

  test("Servicios opens with the keyboard, Escape closes it and returns focus", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Principal" });
    const trigger = nav.getByRole("button", { name: "Servicios" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(nav.getByRole("link", { name: "Desarrollo" })).toBeHidden();

    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    for (const line of ["Desarrollo", "Diseño", "Video y animación", "Minecraft", "Discord"]) {
      await expect(nav.getByRole("link", { name: line, exact: true })).toBeVisible();
    }
    await expect(nav.getByRole("link", { name: "Ver todos los servicios" })).toBeVisible();

    // Tab walks the panel in reading order.
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("link", { name: "Desarrollo", exact: true })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("the dropdown closes when focus leaves it or a click lands outside", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Principal" });
    const trigger = nav.getByRole("button", { name: "Servicios" });

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    // A click anywhere outside the button and the panel.
    await page.getByRole("contentinfo").click({ position: { x: 5, y: 5 } });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await nav.getByRole("link", { name: /Cuéntanos tu idea/ }).focus();
    await page.keyboard.press("Tab");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("the portfolio stays out of the menu while it is hidden", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("banner").getByRole("link", { name: "Portafolio" })).toHaveCount(0);
    await expect(page.getByRole("banner").getByRole("link", { name: "Nosotros" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: "Cotizar" })).toBeVisible();
  });

  test("the skip link is the first stop and moves focus to the content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Saltar al contenido" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#contenido")).toBeFocused();
  });
});

test.describe("phone menu", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "phone layout only");
  });

  test("opens as a modal dialog, traps focus and Escape returns to the button", async ({ page }) => {
    await page.goto("/");
    const openButton = page.getByRole("button", { name: "Abrir menú" });
    await openButton.click();

    const dialog = page.getByRole("dialog", { name: "Menú" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Cerrar menú" })).toBeFocused();

    // Twenty tabs later focus is still inside the dialog.
    for (let i = 0; i < 20; i += 1) await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement?.closest("dialog") !== null)).toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(openButton).toBeFocused();
  });

  test("lists the five lines, the language choice and the quote button", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir menú" }).click();
    const dialog = page.getByRole("dialog", { name: "Menú" });

    const services = dialog.getByRole("button", { name: "Servicios" });
    await expect(services).toHaveAttribute("aria-expanded", "true");
    const menu = dialog.getByRole("navigation", { name: "Principal" });
    for (const line of ["Desarrollo", "Diseño", "Video y animación", "Minecraft", "Discord"]) {
      await expect(menu.getByRole("link", { name: new RegExp(`^${line}`) })).toBeVisible();
    }
    await services.click();
    await expect(menu.getByRole("link", { name: /^Desarrollo/ })).toBeHidden();

    await expect(dialog.getByRole("link", { name: "Portafolio" })).toHaveCount(0);
    await expect(dialog.getByRole("link", { name: "Nosotros" })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Cotizar proyecto" })).toBeVisible();
    const language = dialog.getByRole("group", { name: "Idioma" });
    await expect(language.getByRole("link", { name: "Español" })).toHaveAttribute("aria-current", "true");
    await expect(language.getByRole("link", { name: "English" })).toBeVisible();
  });

  test("a link inside the menu closes it", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await dialog.getByRole("link", { name: "Kardenum, go to the home page" }).click();
    await expect(dialog).toBeHidden();
  });
});

test("in the phone menu WhatsApp leads to the quote form; pending channels cannot be followed", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "the header shows the channels only in the phone menu");
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  const dialog = page.getByRole("dialog", { name: "Menú" });
  await expect(dialog.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", "/contacto#cotizador");

  test.skip(siteConfig.contact.discordInvite.status !== "pending", "the Discord invitation is already set");
  const discord = dialog.getByRole("list", { name: "Canales de contacto" }).getByRole("link", { name: "Discord" });
  await expect(discord).toBeDisabled();
  await expect(discord).not.toHaveAttribute("href", /.*/);
});

test.describe("where you are", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "the desktop menu marks the current page");
  });

  test("the menu marks the current page", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Principal" });

    await page.goto("/");
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(0);

    await page.goto("/nosotros");
    await expect(nav.getByRole("link", { name: "Nosotros" })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "Cotizar" })).not.toHaveAttribute("aria-current", /.*/);

    await page.goto("/contacto");
    await expect(nav.getByRole("link", { name: "Cotizar" })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "Nosotros" })).not.toHaveAttribute("aria-current", /.*/);

    await page.goto("/en/about");
    await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
  });

  test("inner pages show the path from the home page", async ({ page }) => {
    await page.goto("/servicios/desarrollo");
    const trail = page.getByRole("navigation", { name: "Ruta" });
    await expect(trail.getByRole("listitem")).toHaveText(["Inicio", "Servicios", "Desarrollo"]);
    await expect(trail.getByText("Desarrollo")).toHaveAttribute("aria-current", "page");
    await trail.getByRole("link", { name: "Servicios" }).click();
    await expect(page).toHaveURL(/\/servicios$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cinco líneas, un mismo criterio.");

    await page.goto("/en/services/minecraft");
    const english = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(english.getByRole("link")).toHaveText(["Home", "Services"]);
    await expect(english.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/en/services");
  });
});

test("before its script runs the header already leads somewhere; then it becomes the menu", async ({ page }, testInfo) => {
  // A slow phone, or a script that never arrives: the page is on screen without its scripts.
  let release: () => void = () => {};
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/_next/static/**/*.js", async (route) => {
    await held;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const phone = testInfo.project.name === "mobile";
  const header = page.getByRole("banner");

  if (phone) {
    // The menu control is a link to the navigation in the footer.
    const control = header.getByRole("link", { name: "Ir a la navegación del pie" });
    await expect(control).toHaveAttribute("href", "#pie");
    await control.click();
    const fallback = page.getByRole("contentinfo").getByRole("navigation", { name: "Principal" });
    await expect(fallback).toBeVisible();
    await expect(fallback.getByRole("link")).toHaveText(["Servicios", "Nosotros", "Contacto"]);
    await expect(fallback.getByRole("link", { name: "Nosotros" })).toHaveAttribute("href", "/nosotros");
  } else {
    // "Servicios" is a link to the services page.
    await expect(header.getByRole("link", { name: "Servicios", exact: true })).toHaveAttribute("href", "/servicios");
  }

  release();
  // The same element is now the button of the menu (found by its role: no race with the script).
  if (phone) {
    await header.getByRole("button", { name: "Abrir menú" }).click();
    await expect(page.getByRole("dialog", { name: "Menú" })).toBeVisible();
  } else {
    const trigger = page.getByRole("navigation", { name: "Principal" }).getByRole("button", { name: "Servicios" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page).toHaveURL(/\/$/);
  }
});

test("the footer is a navigation too: the five lines are links", async ({ page }) => {
  await page.goto("/nosotros");
  const lines = page.getByRole("contentinfo").getByRole("navigation", { name: "Líneas de servicio" }).getByRole("link");
  await expect(lines).toHaveText(["Desarrollo", "Diseño", "Video", "Minecraft", "Discord"]);
  await expect(lines.nth(3)).toHaveAttribute("href", "/servicios/minecraft");
  // The navigation for when the menu cannot open stays out of the way otherwise.
  await expect(page.getByRole("contentinfo").getByRole("navigation", { name: "Principal" })).toBeHidden();

  await page.goto("/en/about");
  await expect(page.getByRole("contentinfo").getByRole("navigation", { name: "Service lines" }).getByRole("link").first()).toHaveAttribute("href", "/en/services/development");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every main page can be reached from the header and the footer", async ({ page }, testInfo) => {
    await page.goto("/legal/privacidad");
    const header = page.getByRole("banner");
    if (testInfo.project.name === "mobile") {
      await header.getByRole("link", { name: "Ir a la navegación del pie" }).click();
      const fallback = page.getByRole("contentinfo").getByRole("navigation", { name: "Principal" });
      await expect(fallback).toBeVisible();
      await fallback.getByRole("link", { name: "Contacto" }).click();
      await expect(page).toHaveURL(/\/contacto$/);
    } else {
      await header.getByRole("link", { name: "Servicios", exact: true }).click();
      await expect(page).toHaveURL(/\/servicios$/);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cinco líneas, un mismo criterio.");
    }
  });
});
