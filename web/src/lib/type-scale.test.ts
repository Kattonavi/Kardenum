import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const srcDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(tsx?|css)$/.test(entry.name) && !entry.name.endsWith(".test.ts") ? [full] : [];
  });
}

// WCAG 1.4.4: text set in px does not follow the reader's text size, so it would stay small
// while the rest of the page grows. Sizes go in rem (the mockups' 13 px is 0.8125rem).
test("font sizes are never set in px", () => {
  const PX_CLASS = /\btext-\[[0-9.]+px\]/g;
  const PX_RULE = /font-size:\s*[0-9.]+px/g;
  const offenders = sourceFiles(srcDir).flatMap((file) => {
    const source = readFileSync(file, "utf8");
    const found = [...(source.match(PX_CLASS) ?? []), ...(file.endsWith(".css") ? (source.match(PX_RULE) ?? []) : [])];
    return found.map((match) => `${path.relative(srcDir, file)}: ${match}`);
  });
  assert.deepEqual(offenders, []);
});
