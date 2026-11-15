import { defineConfig } from "@playwright/test";

// End-to-end checks against a running build (local `pnpm start` or the Railway URL):
//   E2E_BASE_URL=https://web-production-f1d7c246.up.railway.app pnpm test:e2e
// Two sizes, the ones the brief asks for: 1280 px (desktop) and 390 px (phone).
const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  // Against a remote server too many parallel connections exhaust this machine's sockets
  // (net::ERR_NO_BUFFER_SPACE on Windows): fewer workers there, the default locally.
  workers: baseURL.startsWith("https://") ? 4 : undefined,
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
