import { expect, type Page, test } from "@playwright/test";
import { siteConfig } from "../src/site.config";
import { sidewaysOverflow } from "./helpers";

// Contact page and WhatsApp quote form (docs/specs/002-cotizador-whatsapp.md, maqueta B-Contacto).

const whatsapp = siteConfig.contact.whatsapp;
const CANARY = "canario-kardenum-7731";

function quoteForm(page: Page) {
  const section = page.getByRole("region", { name: "Cuéntanos qué necesitas." });
  return {
    section,
    line: section.getByLabel("Línea de servicio"),
    type: section.getByLabel("Tipo de proyecto"),
    idea: section.getByLabel("Cuéntanos tu idea"),
    deadline: section.getByLabel("¿Para cuándo lo necesitas?"),
    name: section.getByLabel("Tu nombre"),
    submit: section.getByRole("button", { name: "Enviar por WhatsApp" }),
    preview: section.getByRole("complementary", { name: "Vista previa del mensaje" }),
  };
}

test("the three channels are offered; WhatsApp leads to the quote form", async ({ page }) => {
  await page.goto("/contacto");
  const channels = page.getByRole("region", { name: "Canales" });
  await expect(channels.getByRole("heading", { level: 2 })).toHaveText(["WhatsApp", "Discord", "Correo"]);

  await channels.getByRole("link", { name: "Armar solicitud" }).click();
  await expect(page).toHaveURL(/#cotizador$/);
  await expect(page.getByRole("heading", { level: 2, name: "Cuéntanos qué necesitas." })).toBeInViewport();

  // Channels without data are shown, with their placeholder, but cannot be followed.
  if (siteConfig.contact.email.status === "pending") {
    await expect(channels.getByText(siteConfig.contact.email.placeholder)).toBeVisible();
    await expect(channels.getByRole("link", { name: "Escribir correo" })).toBeDisabled();
  }
  if (siteConfig.contact.discordInvite.status === "pending") {
    await expect(channels.getByRole("link", { name: "Abrir Discord" })).toBeDisabled();
  }
});

test("RF-1, RF-9: five labelled fields in order, none required, at least 48 px tall", async ({ page }) => {
  await page.goto("/contacto");
  const form = quoteForm(page);

  const labels = await form.section.locator("form label").allTextContents();
  expect(labels.map((label) => label.trim())).toEqual([
    "1 · Línea de servicio",
    "2 · Tipo de proyecto",
    "3 · Cuéntanos tu idea",
    "4 · ¿Para cuándo lo necesitas?",
    "5 · Tu nombre",
  ]);

  for (const control of [form.line, form.type, form.idea, form.deadline, form.name]) {
    await expect(control).toBeVisible();
    await expect(control).not.toHaveAttribute("required", /.*/);
    expect((await control.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(48);
  }
  await expect(form.line.locator("option")).toHaveText(["Desarrollo", "Diseño", "Video y animación", "Minecraft", "Discord"]);
  // Nothing is chosen for the visitor: the message never claims what they did not say.
  await expect(form.type.locator("option:checked")).toHaveText("Todavía no lo tengo claro");
  await expect(form.deadline.locator("option:checked")).toHaveText("Sin fecha definida");
});

test("RF-2: the project types follow the line and go back to 'not sure yet'", async ({ page }) => {
  await page.goto("/contacto");
  const form = quoteForm(page);

  await expect(form.type.locator("option")).toHaveText([
    "Sitio web",
    "Tienda online",
    "Aplicación web",
    "Software a la medida",
    "Mejora o rediseño",
    "Todavía no lo tengo claro",
  ]);
  await form.type.selectOption({ label: "Tienda online" });
  await expect(form.preview).toContainText("Proyecto: Tienda online");

  await form.line.selectOption({ label: "Minecraft" });
  await expect(form.type.locator("option:checked")).toHaveText("Todavía no lo tengo claro");
  await expect(form.type.locator("option").filter({ hasText: "Tienda online" })).toHaveCount(0);
  await expect(form.type.locator("option").last()).toHaveText("Todavía no lo tengo claro");
  await expect(form.preview).toContainText("Línea: Minecraft");
  await expect(form.preview).toContainText("Proyecto: Todavía no lo tengo claro");

  // Going back to the first line does not bring back the earlier choice either.
  await form.line.selectOption({ label: "Desarrollo" });
  await expect(form.type.locator("option:checked")).toHaveText("Todavía no lo tengo claro");
});

test("RF-3: the preview shows the message as it will arrive, with placeholders for what is missing", async ({ page }) => {
  await page.goto("/contacto");
  const form = quoteForm(page);

  await expect(form.preview).toContainText("Hola, Kardenum. Soy [nombre].");
  await expect(form.preview).toContainText('[Lo que escribas en "Cuéntanos tu idea".]');

  await form.name.fill("  Ana   Ruiz, Café Sur ");
  await form.idea.fill("Quiero vender café en línea.\n\n\n\nCon pagos y envíos.");
  await form.deadline.selectOption({ label: "En el próximo mes" });

  await expect(form.preview).toContainText("Hola, Kardenum. Soy Ana Ruiz, Café Sur.");
  await expect(form.preview).toContainText("Plazo: En el próximo mes");
  await expect(form.preview).toContainText("Quiero vender café en línea.");
  await expect(form.preview).toContainText("Con pagos y envíos.");
  await expect(form.preview).not.toContainText("[nombre]");
  await expect(form.preview).not.toContainText("[Lo que escribas");
});

test("RF-7: name and idea are limited in the fields themselves", async ({ page }) => {
  await page.goto("/contacto");
  const form = quoteForm(page);
  await expect(form.name).toHaveAttribute("maxlength", "80");
  await expect(form.idea).toHaveAttribute("maxlength", "1000");
});

test("RF-5: what is typed stays in the page: no storage, no cookie, no request", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(`${request.url()} ${request.postData() ?? ""}`));

  await page.goto("/contacto");
  const form = quoteForm(page);
  await form.name.fill(`Ana ${CANARY}`);
  await form.idea.fill(`Idea ${CANARY}`);
  await form.line.selectOption({ label: "Discord" });
  await expect(form.preview).toContainText(CANARY);
  await page.waitForLoadState("networkidle");

  const stored = await page.evaluate(() => JSON.stringify([{ ...localStorage }, { ...sessionStorage }, document.cookie]));
  expect(stored).not.toContain(CANARY);
  expect(requests.filter((entry) => entry.includes(CANARY))).toEqual([]);
  await expect(form.section.getByText("Este formulario no guarda tus datos.", { exact: false })).toBeVisible();

  // Nor does it come back after a reload.
  await page.reload();
  await expect(quoteForm(page).name).toHaveValue("");
});

test("RF-4, RF-6: sending opens WhatsApp with the message, or stays inert while the number is pending", async ({ page, context }) => {
  await page.goto("/contacto");
  const form = quoteForm(page);
  await form.name.fill("Ana Ruiz");
  await form.idea.fill("¿Precio & plazo? 100% listo #ya");

  if (whatsapp.status === "pending") {
    await expect(form.submit).toHaveAttribute("aria-disabled", "true");
    await expect(form.section.getByText("[WhatsApp por activar]")).toBeVisible();
    let opened = false;
    context.on("page", () => {
      opened = true;
    });
    // Both ways a visitor can send: Enter in a field and the button itself (focusable, announced as unavailable).
    await form.name.press("Enter");
    await form.submit.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);
    expect(opened).toBe(false);
    await expect(page).toHaveURL(/\/contacto$/);
    // The preview keeps working.
    await expect(form.preview).toContainText("Hola, Kardenum. Soy Ana Ruiz.");
    return;
  }

  // The chat itself is not opened by the test: only the address it would go to is read.
  await context.route("https://wa.me/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<title>wa</title>" }));
  const [popup] = await Promise.all([context.waitForEvent("page"), form.submit.click()]);
  await popup.waitForURL(/^https:\/\/wa\.me\//);
  const target = new URL(popup.url());
  expect(target.pathname).toBe(`/${whatsapp.value.replace(/\D/g, "")}`);
  expect([...target.searchParams.keys()]).toEqual(["text"]);
  expect(target.searchParams.get("text")).toBe(
    "Hola, Kardenum. Soy Ana Ruiz.\nLínea: Desarrollo\nProyecto: Todavía no lo tengo claro\nPlazo: Sin fecha definida\n\n¿Precio & plazo? 100% listo #ya",
  );
  await expect(form.section.getByText("[WhatsApp por activar]")).toHaveCount(0);
});

test("RF-8: a line page sends its line preselected; anything else in the address is ignored", async ({ page }) => {
  await page.goto("/servicios/minecraft");
  const closing = page.getByRole("region", { name: "Hablemos de tu proyecto." });
  const link = closing.getByRole("link", { name: "WhatsApp" });
  await expect(link).toHaveAttribute("href", "/contacto?linea=minecraft#cotizador");
  await link.click();
  await expect(page).toHaveURL(/\/contacto\?linea=minecraft#cotizador$/);

  const form = quoteForm(page);
  await expect(form.line.locator("option:checked")).toHaveText("Minecraft");
  await expect(form.preview).toContainText("Línea: Minecraft");
  await expect(page.getByRole("heading", { level: 2, name: "Cuéntanos qué necesitas." })).toBeInViewport();
  // The choice in the address is a starting point: the visitor can change it.
  await form.line.selectOption({ label: "Diseño" });
  await expect(form.preview).toContainText("Línea: Diseño");

  for (const value of ["otra", "Minecraft", "%3Cscript%3E", ""]) {
    await page.goto(`/contacto?linea=${value}`);
    const ignored = quoteForm(page);
    // "Desarrollo" is also what the server HTML shows: wait until the script has read the address.
    await expect(ignored.submit).not.toHaveAttribute("disabled", /.*/);
    await expect(ignored.line.locator("option:checked")).toHaveText("Desarrollo");
    await expect(ignored.preview).toContainText("Línea: Desarrollo");
  }
});

test("RF-7: a long word typed by the visitor wraps instead of widening the page", async ({ page }) => {
  await page.goto("/contacto");
  const form = quoteForm(page);
  await form.name.fill("W".repeat(80));
  await form.idea.fill(`${"M".repeat(400)} https://ejemplo.test/${"a".repeat(300)}`);
  await expect(form.preview).toContainText("W".repeat(80));

  expect(await sidewaysOverflow(page), "at the project's width").toBe(0);
  await page.setViewportSize({ width: 320, height: 640 });
  expect(await sidewaysOverflow(page), "at 320 px").toBe(0);
  const box = await form.preview.boundingBox();
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(320);
});

test("the quote form speaks English on the English page", async ({ page }) => {
  await page.goto("/en/services/discord");
  const link = page.getByRole("region", { name: "Let's talk about your project." }).getByRole("link", { name: "WhatsApp" });
  await expect(link).toHaveAttribute("href", "/en/contact?linea=discord#quote");
  await link.click();

  const section = page.getByRole("region", { name: "Tell us what you need." });
  await expect(section.getByLabel("Service line").locator("option:checked")).toHaveText("Discord");
  await section.getByLabel("Your name").fill("Ana");
  const preview = section.getByRole("complementary", { name: "Message preview" });
  await expect(preview).toContainText("Hi, Kardenum. I'm Ana.");
  await expect(preview).toContainText("Line: Discord");
  await expect(preview).toContainText("Project: I am not sure yet");
  await expect(preview).toContainText("Timeline: No set date");
});

test("the form is usable with the keyboard alone", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "keyboard navigation is checked on desktop");
  await page.goto("/contacto");
  const form = quoteForm(page);
  // The fields are off until the script runs; focus() does not wait for that by itself.
  await expect(form.line).toBeEnabled();
  await form.line.focus();
  await page.keyboard.press("Tab");
  await expect(form.type).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(form.idea).toBeFocused();
  await page.keyboard.type("Una idea");
  await page.keyboard.press("Tab");
  await expect(form.deadline).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(form.name).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(form.submit).toBeFocused();
  await expect(form.preview).toContainText("Una idea");
});

// Before the page's script runs (slow phone) or without JavaScript, the browser would send the
// form by itself. Nothing typed may leave the page that way either.
test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("RF-5: the browser cannot send the form on its own", async ({ page }) => {
    await page.goto("/contacto");
    const form = quoteForm(page);

    // The form is off, and says why: nothing can be typed, and Enter or the button send nothing.
    for (const control of [form.line, form.type, form.idea, form.deadline, form.name, form.submit]) {
      await expect(control).toBeDisabled();
    }
    // Chromium keeps <noscript> as raw text when Playwright turns scripts off (the parser still
    // believes scripting is on), so the note is checked by its presence, not by its visibility.
    expect(await form.section.locator("form noscript").textContent()).toContain("El cotizador necesita JavaScript para armar el mensaje.");

    // Even with the fields forced on, filled and sent natively, nothing travels: they have no name.
    await form.section.locator("form").evaluate((element: HTMLFormElement, canary) => {
      for (const field of element.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea")) {
        field.disabled = false;
        field.value = canary;
      }
      element.submit();
    }, CANARY);
    await page.waitForLoadState("load");
    expect(decodeURIComponent(page.url())).not.toContain(CANARY);
    expect(new URL(page.url()).search.replace("?", "")).toBe("");
  });
});

test("the form cannot be used before its script runs, so nothing typed is erased", async ({ page }) => {
  // A slow phone: the page is on screen, its scripts are still on their way. A field filled now
  // would be emptied when the script takes over, so the fields wait for it.
  let release: () => void = () => {};
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/_next/static/**/*.js", async (route) => {
    await held;
    await route.continue();
  });
  await page.goto("/contacto", { waitUntil: "domcontentloaded" });
  const form = quoteForm(page);
  for (const control of [form.line, form.type, form.idea, form.deadline, form.name, form.submit]) {
    await expect(control).toBeDisabled();
  }

  release();
  // From here on what is typed stays: the script is the one holding it.
  await form.name.fill("Ana Ruiz");
  await form.idea.fill("Una idea escrita pronto.");
  await form.line.selectOption({ label: "Video y animación" });
  await expect(form.name).toHaveValue("Ana Ruiz");
  await expect(form.preview).toContainText("Soy Ana Ruiz.");
  await expect(form.preview).toContainText("Una idea escrita pronto.");
  await expect(form.preview).toContainText("Línea: Video y animación");
});
