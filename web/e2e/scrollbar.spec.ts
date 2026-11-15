import { expect, test } from "./helpers";

// Headless browsers hide the scrollbar, and with it a whole kind of layout bug: a page that gets
// wider when it stops scrolling. Here the scrollbar is real. Found in review (step 4): between
// 1024 and 1039 px, opening the phone menu removed the scrollbar, the header grew past its
// breakpoint, the control and the dialog inside it stopped being displayed, and the page was left
// inert behind an open modal dialog nobody could see.
test.use({
  launchOptions: { ignoreDefaultArgs: ["--hide-scrollbars"] },
  viewport: { width: 1030, height: 700 },
});

test("opening the menu never changes the width of the page, and the menu stays usable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "a desktop window with a classic scrollbar");
  await page.goto("/");
  const scrollbar = await page.evaluate(() => window.innerWidth - document.documentElement.clientWidth);
  test.skip(scrollbar === 0, "this browser draws overlay scrollbars");

  const headerWidth = () => page.getByRole("banner").evaluate((header) => header.getBoundingClientRect().width);
  const before = await headerWidth();
  expect(before, "with the scrollbar the header is narrower than the window").toBeLessThan(1030);

  // At this width the header is compact: its control opens the menu.
  await page.getByRole("banner").getByRole("button", { name: "Abrir menú" }).click();
  const dialog = page.getByRole("dialog", { name: "Menú" });
  await expect(dialog).toBeVisible();
  const box = await dialog.boundingBox();
  expect(box?.width ?? 0, "the dialog is on screen").toBeGreaterThan(900);
  expect(await headerWidth(), "the page keeps its width while it does not scroll").toBe(before);

  // The menu works and leaves: the page is never left behind an invisible modal.
  await dialog.getByRole("link", { name: "Nosotros" }).click();
  await expect(page).toHaveURL(/\/nosotros$/);
  await expect(page.getByRole("dialog", { name: "Menú" })).toBeHidden();
  await page.getByRole("contentinfo").getByRole("link", { name: "Privacidad" }).click();
  await expect(page).toHaveURL(/\/legal\/privacidad$/);
});
