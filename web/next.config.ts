import path from "node:path";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import { isSiteIndexable, NOINDEX_DIRECTIVE } from "./src/lib/indexing";
import { assertLaunchReady } from "./src/lib/launch";
import { assertGuidesReady } from "./src/lib/guides";
import { assertPortfolioReady } from "./src/lib/portfolio";
import { securityHeaders } from "./src/lib/security-headers";
import { getSiteUrl } from "./src/lib/site-url";
import { shortLinkRedirects } from "./src/routes";

// Fail at once on a malformed SITE_URL: every absolute URL of the site is built from it.
getSiteUrl();

// The site cannot become indexable with placeholder data (contact or legal) or outside the production domain.
assertLaunchReady();

// With the portfolio on, every service line needs at least one published case, open site or not (spec 005, RF-7).
assertPortfolioReady();

// With the guides on there must be at least one, and an incomplete guide stops the build, named (spec 006, RF-7).
assertGuidesReady();

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
  // Pictures go through Next's optimizer (src/components/ui/plain-image.tsx): AVIF first, WebP for
  // browsers without it, one file per width. The optimizer is an open endpoint (/_next/image), so it
  // is narrowed to what the site uses: only images imported by the code (they live under
  // /_next/static/media), one quality, and no address outside the site.
  // The optimizer runs on sharp, whose binary needs the libvips libraries that ship next to it.
  // The standalone output copies the binary and leaves those libraries out (measured on
  // 2026-11-15: sharp then fails to load and Next serves every picture untouched, without a
  // word). They are named here so they travel with the build on every platform.
  outputFileTracingIncludes: { "/*": ["./node_modules/.pnpm/@img+*/node_modules/@img/*/lib/**/*"] },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    localPatterns: [{ pathname: "/_next/static/media/**", search: "" }],
    remotePatterns: [],
  },
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

// Guides are written in MDX (src/content/guides). remark-gfm adds tables; it is named as a string
// so Turbopack can load it. tableCellAlignToStyle: false keeps the alignment of a column as an
// attribute: by default it becomes style="text-align:…", which the content policy (style-src
// 'self') blocks. The table cells of src/components/guides turn it into a class.
const withMDX = createMDX({ options: { remarkPlugins: ["remark-gfm"], tableCellAlignToStyle: false } });

export default withMDX(withNextIntl(nextConfig));
