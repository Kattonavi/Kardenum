import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { brand } from "@/lib/brand";

const css = readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "app", "globals.css"), "utf8");

const TOKENS: Record<keyof typeof brand, string> = {
  ink: "ink",
  stone: "stone",
  mist: "mist",
  graphite: "graphite",
  ash: "ash",
  line: "line",
  bronze: "bronze",
  bronzeDeep: "bronze-deep",
};

test("brand.ts has the same colors as the @theme tokens in globals.css", () => {
  for (const [key, token] of Object.entries(TOKENS) as [keyof typeof brand, string][]) {
    const declaration = `--color-${token}:`;
    const start = css.indexOf(declaration);
    assert.notEqual(start, -1, `${declaration} not found in globals.css`);
    const value = css.slice(start + declaration.length).trimStart().slice(0, 7);
    assert.match(value, /^#[0-9a-fA-F]{6}$/, `${declaration} is not a 6-digit hex color`);
    assert.equal(brand[key].toLowerCase(), value.toLowerCase(), `brand.${key}`);
  }
});
