// Runs after `next build` (output: "standalone").
// The standalone server.js does not include `public/` or `.next/static/`; copy them next to it
// so the same server serves the assets. Plain Node so it works on Windows and on Railway (Linux).
import { cpSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const standalone = path.join(root, ".next", "standalone");
const server = path.join(standalone, "server.js");

if (!existsSync(server)) {
  console.error(
    `[copy-standalone-assets] ${path.relative(root, server)} not found. ` +
      "Check output: 'standalone' and outputFileTracingRoot in next.config.ts.",
  );
  process.exit(1);
}

const copies = [
  [path.join(root, "public"), path.join(standalone, "public")],
  [path.join(root, ".next", "static"), path.join(standalone, ".next", "static")],
];

for (const [from, to] of copies) {
  if (!existsSync(from)) continue;
  cpSync(from, to, { recursive: true, force: true });
  console.log(`[copy-standalone-assets] ${path.relative(root, from)} -> ${path.relative(root, to)}`);
}
