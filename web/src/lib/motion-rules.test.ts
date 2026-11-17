import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// Rules of the phase 2 redesign that can be read from the source (spec 012, RF-1, RF-2, RF-11
// and RF-14). They run inside every build, before any page exists to be opened in a browser.

const srcDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function sourceFiles(dir: string, pattern: RegExp): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full, pattern);
    return pattern.test(entry.name) ? [full] : [];
  });
}

const relative = (file: string) => path.relative(srcDir, file).replaceAll("\\", "/");
const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

const stylesheets = sourceFiles(srcDir, /\.css$/).map((file) => ({ file: relative(file), css: withoutComments(readFileSync(file, "utf8")) }));

/** The block that starts at the first "{" at or after `from`, without its outer braces. */
function blockAt(css: string, from: number): string {
  const open = css.indexOf("{", from);
  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") depth -= 1;
    if (depth === 0) return css.slice(open + 1, index);
  }
  throw new Error("unbalanced braces in a stylesheet");
}

function keyframes(css: string): { name: string; body: string }[] {
  return [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((match) => ({ name: match[1] ?? "", body: blockAt(css, match.index) }));
}

// The content policy of the site blocks inline styles, so one that slipped in would simply not
// apply: the page would look broken only in a browser. Generated images (src/app/og) are drawn
// by next/og from style objects and never reach a page.
test("no component sets an inline style or writes a <style> tag", () => {
  const offenders = sourceFiles(srcDir, /\.tsx$/)
    .filter((file) => !relative(file).startsWith("app/og/"))
    .flatMap((file) => {
      const code = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
      return [...code.matchAll(/\sstyle=|<style[\s>]/g)].map((match) => `${relative(file)}: ${match[0].trim()}`);
    });
  assert.deepEqual(offenders, []);
});

// Only transform and opacity are animated: the browser moves them without laying the page out
// again, so an animation can never shift the content (the mockup animated `left`; here it is a
// transform). `translate`, `scale` and `rotate` are the same thing written apart.
test("every animation of the site moves only transform and opacity", () => {
  const ALLOWED = new Set(["transform", "opacity", "translate", "scale", "rotate"]);
  const all = stylesheets.flatMap(({ file, css }) => keyframes(css).map((rule) => ({ file, ...rule })));
  assert.ok(all.length >= 10, `only ${all.length} @keyframes found: the scan is not reaching the stylesheets`);

  const offenders = all.flatMap(({ file, name, body }) =>
    [...body.matchAll(/([\w-]+)\s*:/g)]
      .map((match) => match[1] ?? "")
      .filter((property) => !ALLOWED.has(property))
      .map((property) => `${file}: @keyframes ${name} animates ${property}`),
  );
  assert.deepEqual(offenders, []);
});

test("no stylesheet animates with a transition on a property that lays the page out again", () => {
  const LAYOUT = /\b(width|height|top|left|right|bottom|inset|margin|padding|font-size|gap)\b/;
  const offenders = stylesheets.flatMap(({ file, css }) =>
    [...css.matchAll(/transition(?:-property)?\s*:\s*([^;}]+)/g)].filter((match) => LAYOUT.test(match[1] ?? "")).map((match) => `${file}: ${match[0]}`),
  );
  assert.deepEqual(offenders, []);
});

test("a scene has a fixed 16:10 box and scales with its container", () => {
  const scenes = stylesheets.find(({ file }) => file === "app/scenes.css");
  assert.ok(scenes, "src/app/scenes.css not found");
  const scene = blockAt(scenes.css, scenes.css.indexOf(".scene {"));
  const frame = blockAt(scenes.css, scenes.css.indexOf(".scene-frame {"));
  assert.match(scene, /container-type:\s*inline-size/);
  assert.match(frame, /aspect-ratio:\s*16\s*\/\s*10/);
  assert.match(frame, /overflow:\s*hidden/);
  // Everything inside is measured from this size: container width units, never px or rem.
  assert.match(frame, /font-size:\s*[\d.]+cqw/);
  const fixed = [...scenes.css.slice(0, scenes.css.indexOf(".motion-toggle {")).matchAll(/font-size:\s*([^;]+);/g)]
    .map((match) => (match[1] ?? "").trim())
    .filter((size) => !/^[\d.]+(cqw|em)$/.test(size));
  assert.deepEqual(fixed, [], "font sizes inside a scene are in cqw or em");
});

// The words inside the scenes are drawn by the stylesheet, in the language of the page (RF-4 and
// RF-13: both languages side by side). The interface messages have their own test for that; these
// words do not live there, so the stylesheet is read here: every word written for Spanish has
// its pair for English, on the same piece.
test("every word of a scene drawn in Spanish has its English pair", () => {
  const raw = readFileSync(path.join(srcDir, "app", "scenes.css"), "utf8");
  const between = (from: string, to: string) => {
    const start = raw.indexOf(from);
    const end = raw.indexOf(to, start);
    assert.ok(start !== -1 && end !== -1, `markers "${from}" and "${to}" not found in scenes.css`);
    return raw.slice(start + from.length, end);
  };
  const words = (block: string) => [...block.matchAll(/^\s*([^\n{}]+?)\s*\{\s*content:\s*"([^"]*)";\s*\}/gm)].map((match) => ({ selector: match[1] ?? "", word: match[2] ?? "" }));

  const spanish = words(between("/* words: es */", "/* words: en */"));
  const english = words(between("/* words: en */", "/* words: end */"));
  assert.ok(spanish.length >= 20, `only ${spanish.length} Spanish words found: the scan is not reading the block`);
  assert.deepEqual(
    english.map(({ selector }) => selector),
    spanish.map(({ selector }) => `:lang(en) ${selector}`),
    "each English rule is the Spanish one under :lang(en), in the same order",
  );
  for (const [index, { selector, word }] of spanish.entries()) {
    assert.notEqual(word.trim(), "", `${selector} has no word`);
    assert.notEqual(english[index]?.word, word, `${selector} says the same in both languages: it belongs with the words of any language`);
  }
});

// Without animation a scene must be its finished composition (reduced motion, a paused page, a
// browser that does not know the feature): every animation of a scene is declared only for
// visitors who have not asked for reduced motion, so the styles outside that block are what they see.
// The same holds for the carousel: still, it shows the first scene in the centre.
test("the movement of the scenes and of the carousel exists only without a reduced-motion preference", () => {
  for (const name of ["app/scenes.css", "app/carousel.css"]) {
    const sheet = stylesheets.find(({ file }) => file === name);
    assert.ok(sheet, `src/${name} not found`);
    const start = sheet.css.indexOf("@media (prefers-reduced-motion: no-preference)");
    assert.notEqual(start, -1, `${name}: the block for visitors without the preference is missing`);
    const moving = blockAt(sheet.css, start);
    const outside = sheet.css.replace(moving, "");
    const stray = [...outside.matchAll(/^\s*animation(?:-name)?\s*:[^;]+;/gm)].map((match) => `${name}: ${match[0].trim()}`);
    assert.deepEqual(stray, []);
    // The pause control of the page (a native checkbox) stops it, without script.
    assert.match(moving, /body:has\(\.motion-toggle > input:checked\)[^{]+\{\s*animation-play-state:\s*paused/, `${name}: the pause control stops the movement`);
  }
});

// RF-21: five steps of 3.5 s, 2.8 s still and 0.7 s moving, and every animation of the carousel
// lasts the same, so the row, the dimming of the slides and the tabs cannot drift apart.
test("every animation of the carousel lasts the 17.5 s of its five steps", () => {
  const sheet = stylesheets.find(({ file }) => file === "app/carousel.css");
  assert.ok(sheet, "src/app/carousel.css not found");
  const durations = [...sheet.css.matchAll(/animation:\s*[\w-]+\s+([\d.]+m?s)/g)].map((match) => match[1]);
  assert.ok(durations.length >= 4, "the animations of the carousel were not found");
  assert.deepEqual([...new Set(durations)], ["17.5s"]);
  assert.match(sheet.css, /animation:\s*carousel-step-narrow 17\.5s cubic-bezier\(0\.7, 0, 0\.2, 1\) infinite/);
  for (const name of ["carousel-step-narrow", "carousel-step-wide"]) {
    const steps: { name: string; body: string } | undefined = keyframes(sheet.css).find((rule) => rule.name === name);
    assert.ok(steps, `@keyframes ${name}`);
    // Still from each multiple of 20 % to 16 % later (2.8 of 3.5 s), then the move.
    assert.deepEqual(
      [...steps.body.matchAll(/([\d.,%\s]+)\{/g)].map((match) => (match[1] ?? "").replace(/\s/g, "")),
      ["0%,16%", "20%,36%", "40%,56%", "60%,76%", "80%,96%", "100%"],
    );
  }
});
