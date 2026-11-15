import { expect, test } from "./helpers";

// Security headers as the browser gets them. Their values are checked by `pnpm smoke` on every
// kind of response; here is what only a browser can tell: that the policy does not break the
// pages, and that it does stop what the site never does.

test("the page is served with its content policy and still works", async ({ page }) => {
  const response = await page.goto("/contacto");
  const policy = response?.headers()["content-security-policy"] ?? "";
  expect(policy).toContain("default-src 'self'");
  expect(policy).toContain("frame-ancestors 'none'");

  // Scripts run: the quote form wakes up and the preview follows what is typed.
  await page.getByLabel("Tu nombre").fill("Ana");
  await expect(page.getByRole("complementary", { name: "Vista previa del mensaje" })).toContainText("Soy Ana.");

  // Styles and fonts load: the title is set in the brand's display font, and the font is there.
  const family = await page.getByRole("heading", { level: 1 }).evaluate((h1) => getComputedStyle(h1).fontFamily);
  expect(family).toContain("Archivo");
  await expect.poll(() => page.evaluate(() => document.fonts.check('600 16px "Archivo"'))).toBe(true);
});

test.describe("breaking the policy on purpose", () => {
  // The guard of every other test fails on a violation; here it must see the ones made below,
  // which proves it is listening and not passing by default.
  test.use({ breaksPolicyOnPurpose: true });

  test("the policy stops outside scripts, frames and inline styles", async ({ page }) => {
    await page.goto("/");
    const blocked = await page.evaluate(
      () =>
        new Promise<string[]>((resolve) => {
          const seen: string[] = [];
          document.addEventListener("securitypolicyviolation", (event) => seen.push(event.effectiveDirective));
          const script = document.createElement("script");
          script.src = "https://example.com/no-existe.js";
          const frame = document.createElement("iframe");
          frame.src = "https://example.com/";
          const style = document.createElement("style");
          style.textContent = "body { outline: 1px solid red }";
          document.body.append(script, frame, style);
          setTimeout(() => resolve(seen), 800);
        }),
    );
    expect(blocked).toEqual(expect.arrayContaining(["script-src-elem", "frame-src", "style-src-elem"]));
  });
});
