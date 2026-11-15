import path from "node:path";
import type { NextConfig } from "next";
import { isSiteIndexable, NOINDEX_DIRECTIVE } from "./src/lib/indexing";

// Pin both roots to /web: Railway only sees this folder, and an unrelated lockfile
// higher up must never change where `.next/standalone/server.js` ends up.
const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: projectRoot,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: projectRoot,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
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

export default nextConfig;
