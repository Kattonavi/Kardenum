// Lighthouse CI, run by .github/workflows/verify-deploy.yml after each deployment
// (docs/specs/007-verificacion-tras-despliegue.md). Two modes, chosen with LHCI_MODE:
//
// - "deployed": the live site, at LHCI_BASE_URL. Performance, accessibility and best practices.
//   SEO is left out: while the site is closed to search engines, its noindex fails that category.
// - "open": the same commit built open (SITE_INDEXABLE=true) and served on this machine, where
//   SEO can be measured as it will be after the launch. The four categories.
//
// Every category must reach 95 on every page. Each page is measured three times and the run
// Lighthouse CI picks as the most representative one is the one judged, so one noisy run on a
// shared machine does not fail the check and a slow page still does.

const MINIMUM = 0.95;

// One page of each kind: home in both languages, the services index, a line page, about,
// contact (with the quote form) and a legal page.
const PATHS = ["/", "/en", "/servicios", "/servicios/minecraft", "/nosotros", "/contacto", "/legal/privacidad"];

const mode = process.env.LHCI_MODE;
if (mode !== "deployed" && mode !== "open") throw new Error('LHCI_MODE must be "deployed" or "open".');

const port = process.env.PORT || "4173";
const base = mode === "deployed" ? process.env.LHCI_BASE_URL : `http://127.0.0.1:${port}`;
if (!base) throw new Error("LHCI_BASE_URL is required in deployed mode.");

const categories = mode === "deployed" ? ["performance", "accessibility", "best-practices"] : ["performance", "accessibility", "best-practices", "seo"];

module.exports = {
  ci: {
    collect: {
      url: PATHS.map((path) => `${base.replace(/\/$/, "")}${path === "/" ? "/" : path}`),
      numberOfRuns: 3,
      settings: {
        onlyCategories: categories,
        // Chrome's sandbox needs privileges the hosted runners do not give.
        chromeFlags: "--no-sandbox",
      },
      ...(mode === "open"
        ? {
            // `pnpm start` serves the standalone build on PORT and prints "Ready" when it listens.
            startServerCommand: "pnpm start",
            startServerReadyPattern: "Ready",
            startServerReadyTimeout: 60000,
          }
        : {}),
    },
    assert: {
      assertions: Object.fromEntries(categories.map((category) => [`categories:${category}`, ["error", { minScore: MINIMUM, aggregationMethod: "median-run" }]])),
    },
    upload: {
      // The reports stay in .lighthouseci and the workflow keeps them as an artifact: nothing is
      // sent to a public server.
      target: "filesystem",
      outputDir: ".lighthouseci/reports",
    },
  },
};
