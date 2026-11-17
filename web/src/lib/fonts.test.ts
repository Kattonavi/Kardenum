import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// Archivo is served in two files (spec 013, RF-43; scripts/subset-archivo.py): a base one, cut to
// the characters of the site's texts, that every page loads, and an extended one with the rest of
// the Latin letters, which a browser downloads only where one of them is shown. A text of the
// site with a character outside the base file would make its page download the second file, or
// draw that character with the system font, and nobody would notice until it is on screen.

const srcDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const webDir = path.join(srcDir, "..");
const fontsDir = path.join(srcDir, "assets", "fonts");
const report = JSON.parse(readFileSync(path.join(fontsDir, "Archivo-site.json"), "utf8")) as { kept: string; extended: string; baseRange: string; extendedRange: string };

function files(dir: string, pattern: RegExp): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return files(full, pattern);
    return pattern.test(entry.name) && !entry.name.includes(".test.") ? [full] : [];
  });
}

/** The code points a CSS unicode-range covers. */
function covered(range: string): Set<number> {
  const codes = new Set<number>();
  for (const part of range.split(",")) {
    const [from, to = from] = part.trim().replace("U+", "").split("-");
    for (let code = Number.parseInt(from ?? "", 16); code <= Number.parseInt(to ?? "", 16); code += 1) codes.add(code);
  }
  return codes;
}

test("every character of the site's texts that Archivo has is in the base file", () => {
  const kept = new Set(report.kept);
  const extended = new Set(report.extended);
  assert.ok(kept.size >= 100 && extended.size >= 300, "the report of the cut font is not the expected one");

  // The same files the script reads: any text of the site comes from one of them.
  const sources = [...files(path.join(webDir, "messages"), /\.json$/), ...files(srcDir, /\.(ts|tsx|mdx)$/)];
  assert.ok(sources.length > 50, `only ${sources.length} files read: the scan is not reaching the texts`);
  const outside = new Map<string, string>();
  for (const file of sources) {
    for (const written of readFileSync(file, "utf8")) {
      // Titles and buttons are set in capitals by the stylesheet: each character counts in both forms.
      for (const char of new Set([written, ...written.toUpperCase(), ...written.toLowerCase()])) {
        if (extended.has(char) && !kept.has(char) && !outside.has(char)) outside.set(char, path.relative(webDir, file));
      }
    }
  }
  assert.deepEqual(
    [...outside].map(([char, file]) => `"${char}" (U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0")}) in ${file}`),
    [],
    "characters of the texts that are only in the extended file: run scripts/subset-archivo.py again, copy the ranges it prints and commit",
  );
});

test("the two files of Archivo share no character, and the ranges in the code are the ones of the files", () => {
  const base = covered(report.baseRange);
  const extended = covered(report.extendedRange);
  assert.deepEqual([...base].filter((code) => extended.has(code)), [], "a character is in both ranges");
  assert.deepEqual([...base].sort((a, b) => a - b), [...report.kept].map((char) => char.codePointAt(0)).sort((a, b) => (a ?? 0) - (b ?? 0)));
  assert.equal(extended.size, [...report.extended].length);

  const fonts = readFileSync(path.join(srcDir, "app", "fonts.ts"), "utf8");
  assert.ok(fonts.includes(`{ prop: "unicode-range", value: "${report.baseRange}" }`), "src/app/fonts.ts does not carry the range of the base file");
  const css = readFileSync(path.join(srcDir, "app", "globals.css"), "utf8");
  assert.ok(css.includes(`unicode-range: ${report.extendedRange};`), "src/app/globals.css does not carry the range of the extended file");
  assert.ok(css.includes('src: url("../assets/fonts/Archivo-ext.woff2") format("woff2");'), "src/app/globals.css does not declare the extended file");
});

test("the base file stays small enough to arrive in two TCP flights", () => {
  // 43,800 bytes fit in the first two flights of a new connection; the response headers take about 900.
  const base = statSync(path.join(fontsDir, "Archivo-site.woff2")).size;
  assert.ok(base <= 42_900, `Archivo-site.woff2 is ${base} bytes`);
});
