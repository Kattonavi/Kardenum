import { defineConfig } from "@playwright/test";

// End-to-end checks against a running build (local `pnpm start` or the Railway URL):
//   E2E_BASE_URL=https://web-production-f1d7c246.up.railway.app pnpm test:e2e
// Two sizes, the ones the brief asks for: 1280 px (desktop) and 390 px (phone).
const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
// SITE_INDEXABLE must say how the server under test was built (unset or anything but "true": a
// closed site, the usual case). On an open build the pages hidden behind a feature that is off
// are not generated (specs 004 to 006, "Páginas ocultas y sitio abierto"), so the tests that
// visit them follow src/routes.ts (isGenerated) and src/lib/entries.ts (generatedEntries) and
// leave them out:  SITE_INDEXABLE=true E2E_BASE_URL=… pnpm test:e2e

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  // Too many parallel connections exhaust this machine's sockets (net::ERR_NO_BUFFER_SPACE on
  // Windows): two workers against a remote server and four locally, where the suite reached the
  // same limit once it passed 600 tests.
  workers: baseURL.startsWith("https://") ? 2 : 4,
  reporter: [["list"]],
  use: {
    baseURL,
    browserName: "chromium",
    locale: "es-CO",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
  ],
});
