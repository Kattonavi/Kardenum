import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { isSiteIndexable, NOINDEX_DIRECTIVE } from "./src/lib/indexing";
import { assertLaunchReady } from "./src/lib/launch";
import { getSiteUrl } from "./src/lib/site-url";
import { shortLinkRedirects } from "./src/routes";

// Fail at once on a malformed SITE_URL: every absolute URL of the site is built from it.
getSiteUrl();

// The site cannot become indexable with placeholder contact data or outside the production domain.
assertLaunchReady();

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Pin both roots to /web: Railway only sees this folder, and an unrelated lockfile
// higher up must never change where `.next/standalone/server.js` ends up.
const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: projectRoot,
  experimental: {
    // 404 for URLs that match no route (src/app/global-not-found.tsx): the root layout
    // lives in [locale], so a regular app/not-found.tsx has no layout to render in.
    globalNotFound: true,
  },
  turbopack: {
    root: projectRoot,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Short addresses such as /minecraft, permanent (308), once their page exists.
  async redirects() {
    return shortLinkRedirects();
  },
  async headers() {
    if (isSiteIndexable()) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: NOINDEX_DIRECTIVE }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
