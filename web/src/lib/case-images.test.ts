import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// docs/specs/005-portafolio-y-casos.md: case images are stored already optimized. WebP or AVIF,
// at most 1600 px wide and 300 KB per file (the site serves them as they are: images.unoptimized).
const casesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "assets", "cases");
const MAX_WIDTH = 1600;
const MAX_BYTES = 300 * 1024;

/** Width of a WebP (VP8, VP8L or VP8X) or AVIF (its "ispe" box) image, read from its header; null if it is neither. */
function imageWidth(data: Buffer): number | null {
  if (data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP") {
    const chunk = data.toString("ascii", 12, 16);
    if (chunk === "VP8X") return 1 + data.readUIntLE(24, 3);
    if (chunk === "VP8L") return 1 + (data.readUInt32LE(21) & 0x3fff);
    if (chunk === "VP8 ") return data.readUInt16LE(26) & 0x3fff;
    return null;
  }
  if (data.toString("ascii", 4, 8) === "ftyp" && /^avi[fs]$/.test(data.toString("ascii", 8, 12))) {
    const box = data.indexOf("ispe", 0, "ascii");
    return box === -1 ? null : data.readUInt32BE(box + 8);
  }
  return null;
}

/** What is wrong with one image file; empty when it is within the limits. */
function imageProblems(name: string, data: Buffer): string[] {
  const problems: string[] = [];
  if (!/\.(webp|avif)$/i.test(name)) problems.push(`${name}: only WebP or AVIF`);
  const width = imageWidth(data);
  if (width === null) problems.push(`${name}: not a WebP or AVIF file`);
  else if (width > MAX_WIDTH) problems.push(`${name}: ${width} px wide (max ${MAX_WIDTH})`);
  if (data.length > MAX_BYTES) problems.push(`${name}: ${Math.round(data.length / 1024)} KB (max ${MAX_BYTES / 1024})`);
  return problems;
}

function files(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? files(full) : [full];
  });
}

/** Header of a WebP of the given width, padded to `bytes`. */
function syntheticWebp(width: number, bytes = 64): Buffer {
  const data = Buffer.alloc(bytes);
  data.write("RIFF", 0, "ascii");
  data.write("WEBP", 8, "ascii");
  data.write("VP8X", 12, "ascii");
  data.writeUIntLE(width - 1, 24, 3);
  data.writeUIntLE(899, 27, 3);
  return data;
}

function syntheticAvif(width: number): Buffer {
  const data = Buffer.alloc(64);
  data.writeUInt32BE(24, 0);
  data.write("ftypavif", 4, "ascii");
  data.write("ispe", 32, "ascii");
  data.writeUInt32BE(width, 40);
  return data;
}

test("the checker accepts images within the limits and rejects each kind of excess", () => {
  assert.deepEqual(imageProblems("a.webp", syntheticWebp(1600)), []);
  assert.deepEqual(imageProblems("a.avif", syntheticAvif(1200)), []);
  assert.deepEqual(imageProblems("a.webp", syntheticWebp(1601)), ["a.webp: 1601 px wide (max 1600)"]);
  assert.deepEqual(imageProblems("a.avif", syntheticAvif(2400)), ["a.avif: 2400 px wide (max 1600)"]);
  assert.deepEqual(imageProblems("a.webp", syntheticWebp(800, MAX_BYTES + 1)), ["a.webp: 300 KB (max 300)"]);
  assert.deepEqual(imageProblems("a.png", Buffer.from("\x89PNG\r\n\x1a\n")), ["a.png: only WebP or AVIF", "a.png: not a WebP or AVIF file"]);
  assert.equal(imageWidth(syntheticWebp(1234)), 1234);
});

test("every case image is WebP or AVIF, at most 1600 px wide and 300 KB", () => {
  // There may be none (no case has images yet); every file under src/assets/cases is checked.
  const problems = files(casesDir).flatMap((file) => imageProblems(path.relative(casesDir, file), readFileSync(file)));
  assert.deepEqual(problems, []);
});

// docs/specs/006-guias.md: the screenshots of a guide live next to its .mdx files and follow the same limits.
const guidesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "guides");
const GUIDE_SOURCE = /\.(ts|tsx|mdx)$/;

test("every guide screenshot is WebP or AVIF, at most 1600 px wide and 300 KB", () => {
  // Everything in src/content/guides that is not the source of a guide is an image of one.
  const images = files(guidesDir).filter((file) => !GUIDE_SOURCE.test(file));
  const problems = images.flatMap((file) => imageProblems(path.relative(guidesDir, file), readFileSync(file)));
  assert.deepEqual(problems, []);
  // The filter itself: an image is never mistaken for a source file, nor the other way round.
  assert.equal(GUIDE_SOURCE.test("tebex/es.mdx"), true);
  assert.equal(GUIDE_SOURCE.test("tebex/panel.webp"), false);
});
