import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// Archivo is served cut to the characters of the site's texts (spec 013, RF-40;
// scripts/subset-archivo.py). A text with a character the cut font lost would be drawn, for that
// one character, with the system font, and nobody would notice until it is on screen.

const srcDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const webDir = path.join(srcDir, "..");
const fontsDir = path.join(srcDir, "assets", "fonts");

function files(dir: string, pattern: RegExp): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return files(full, pattern);
    return pattern.test(entry.name) && !entry.name.includes(".test.") ? [full] : [];
  });
}

test("every character of the site's texts that Archivo has is in the file the site serves", () => {
  const report = JSON.parse(readFileSync(path.join(fontsDir, "Archivo-site.json"), "utf8")) as { kept: string; source: string };
  const kept = new Set(report.kept);
  const inSource = new Set(report.source);
  assert.ok(kept.size >= 100 && inSource.size > kept.size, "the report of the cut font is not the expected one");

  // The same files the script reads: any text of the site comes from one of them.
  const sources = [...files(path.join(webDir, "messages"), /\.json$/), ...files(srcDir, /\.(ts|tsx|mdx)$/)];
  assert.ok(sources.length > 50, `only ${sources.length} files read: the scan is not reaching the texts`);
  const lost = new Map<string, string>();
  for (const file of sources) {
    for (const written of readFileSync(file, "utf8")) {
      // Titles and buttons are set in capitals by the stylesheet: each character counts in both forms.
      for (const char of new Set([written, ...written.toUpperCase(), ...written.toLowerCase()])) {
        if (inSource.has(char) && !kept.has(char) && !lost.has(char)) lost.set(char, path.relative(webDir, file));
      }
    }
  }
  assert.deepEqual(
    [...lost].map(([char, file]) => `"${char}" (U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0")}) in ${file}`),
    [],
    "characters the cut font lost: run scripts/subset-archivo.py again and commit its three files",
  );
});

test("the font the site serves is the cut one, far under the size of the whole Latin subset", () => {
  const cut = statSync(path.join(fontsDir, "Archivo-site.woff2")).size;
  const whole = statSync(path.join(fontsDir, "source", "Archivo-latin-variable.woff2")).size;
  assert.ok(cut < 48_000, `Archivo-site.woff2 is ${cut} bytes`);
  assert.ok(cut < whole * 0.55, `${cut} of ${whole} bytes`);
});
