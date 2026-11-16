import assert from "node:assert/strict";
import { test } from "node:test";
import { blockedPaths } from "@/lib/entries";
import { comparablePath } from "@/lib/comparable-path";

const HIDDEN = "/servicios/minecraft/plugins";

test("an address already in its plain form stays as it is", () => {
  for (const path of ["/", "/portafolio", HIDDEN, "/en/work/kardenum"]) assert.equal(comparablePath(path), path);
});

test("every spelling of a hidden page is reduced to the one in the list", () => {
  const spellings = {
    "an encoded letter": "/servicios/minecraft/plugin%73",
    "an encoded letter, lower-case hex": "/servicios/minecraft/plu%67ins",
    "every letter encoded": "/%73%65%72%76%69%63%69%6f%73/minecraft/plugins",
    "double encoding": "/servicios/minecraft/plugin%2573",
    "triple encoding": "/servicios/minecraft/plugin%252573",
    "an encoded percent sign in lower-case hex": "/servicios/minecraft/plugin%25%37%33",
    "upper case": "/SERVICIOS/Minecraft/PLUGINS",
    "an encoded capital": "/servicios/minecraft/%50lugins",
    "a trailing slash": "/servicios/minecraft/plugins/",
    "several trailing slashes": "/servicios/minecraft/plugins///",
    "an encoded trailing slash": "/servicios/minecraft/plugins%2F",
    "a double slash": "//servicios//minecraft/plugins",
    "an encoded slash": "/servicios%2Fminecraft%2fplugins",
    "a backslash": "/servicios\\minecraft\\plugins",
    "an encoded backslash": "/servicios%5Cminecraft/plugins",
    "a dot segment": "/servicios/minecraft/./plugins",
    "an encoded dot segment": "/servicios/minecraft/%2E/plugins",
    "a parent segment": "/servicios/discord/../minecraft/plugins",
    "an encoded parent segment": "/servicios/discord/%2e%2e/minecraft/plugins",
    "all at once": "//SERVICIOS/%2e/Minecraft/plugin%2573/",
  };
  for (const [name, spelling] of Object.entries(spellings)) assert.equal(comparablePath(spelling), HIDDEN, name);
});

test("a malformed escape never throws and never spells a page", () => {
  for (const path of ["/portafolio%", "/portafolio%7", "/portafolio%zz", "/%E0%A4%A", "/portafoli%C3%B3", "/%ff%fe"]) {
    assert.doesNotThrow(() => comparablePath(path), path);
    assert.notEqual(comparablePath(path), "/portafolio", path);
  }
});

test("an address escaped beyond the limit is left alone instead of looping", () => {
  const deep = `/portafoli%${"25".repeat(40)}6F`;
  assert.notEqual(comparablePath(deep), "/portafolio");
});

test("it never climbs above the root", () => {
  assert.equal(comparablePath("/../../portafolio"), "/portafolio");
  assert.equal(comparablePath("/.."), "/");
  assert.equal(comparablePath(""), "/");
});

test("the hidden addresses of an open site are already in the form the proxy compares", () => {
  // The proxy looks the normalised address up in this list: an entry that changed when normalised
  // could never be found.
  const open = { SITE_INDEXABLE: "true" };
  for (const path of [...blockedPaths(open), ...blockedPaths({})]) assert.equal(comparablePath(path), path);
});
