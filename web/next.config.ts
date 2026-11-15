import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { isSiteIndexable, NOINDEX_DIRECTIVE } from "./src/lib/indexing";
import { assertLaunchReady } from "./src/lib/launch";
import { securityHeaders } from "./src/lib/security-headers";
import { getSiteUrl } from "./src/lib/site-url";
import { shortLinkRedirects } from "./src/routes";

// Fail at once on a malformed SITE_URL: every absolute URL of the site is built from it.
getSiteUrl();

// The site cannot become indexable with placeholder data (contact or legal) or outside the production domain.
assertLaunchReady();

// Short links are answered in src/proxy.ts, which is loaded with the first request: a wrong
// address in site.config.ts must stop the build here, not the site there.
shortLinkRedirects();

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Pin both roots to /web: Railway only sees this folder, and an unrelated lockfile
// higher up must never change where `.next/standalone/server.js` ends up.
const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: projectRoot,
  // No "X-Powered-By: Next.js": the stack is nobody's business.
  poweredByHeader: false,
  // The site has no next/image: without this, /_next/image would still answer as an image resizer.
  images: { unoptimized: true },
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
  // Every response carries the security headers, indexable or not; the noindex one is added
  // only while the site is closed to search engines. Redirects are made in src/proxy.ts for the
  // same reason: one made with `redirects` here would leave without these headers.
  async headers() {
    const headers = [...securityHeaders()];
    if (!isSiteIndexable()) headers.push({ key: "X-Robots-Tag", value: NOINDEX_DIRECTIVE });
    return [{ source: "/:path*", headers }];
  },
};

export default withNextIntl(nextConfig);
