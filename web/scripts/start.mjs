// Production entry point: `pnpm start` (Railway's Railpack runs the `start` script).
// Starts the standalone server built by `next build`.
// Inside containers HOSTNAME holds the container id, and server.js would bind to it;
// bind to all interfaces instead. BIND_HOST overrides it (for example "::" for IPv6).
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const server = path.join(root, ".next", "standalone", "server.js");

if (!existsSync(server)) {
  console.error("[start] .next/standalone/server.js not found. Run `pnpm build` first.");
  process.exit(1);
}

process.env.HOSTNAME = process.env.BIND_HOST || "0.0.0.0";
process.env.PORT ||= "3000";

await import(pathToFileURL(server).href);
