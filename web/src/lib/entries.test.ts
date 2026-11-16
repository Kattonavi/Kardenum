import assert from "node:assert/strict";
import { test } from "node:test";
import { portfolioCases } from "@/content/cases";
import { locales } from "@/i18n/locales";
import { blockedPaths, builtEntries, generatedEntries, isEntryListed, pathsOfEntry } from "@/lib/entries";
import { visibleCases } from "@/lib/portfolio";
import { hiddenPathnames, isListed, localizedPath, publicPathnames } from "@/routes";

// Specs 004, 005 and 006, "Páginas ocultas y sitio abierto": the list the proxy answers with the
// brand 404 (next.config.ts, env BLOCKED_PATHS; src/proxy.ts).
const open = { SITE_INDEXABLE: "true" };
const closed = { SITE_INDEXABLE: "false" };

test("a closed site blocks nothing: hidden pages are there to be reviewed", () => {
  assert.deepEqual(blockedPaths(closed), []);
  assert.deepEqual(blockedPaths({}), []);
  assert.equal(generatedEntries(closed).length, builtEntries().length);
});

test("an open site blocks every hidden page and entry, in both languages, and nothing public", () => {
  const blocked = blockedPaths(open);
  const expected = [
    ...hiddenPathnames().flatMap((pathname) => locales.map((locale) => localizedPath(pathname, locale))),
    ...builtEntries()
      .filter((entry) => !isEntryListed(entry))
      .flatMap((entry) => locales.map((locale) => pathsOfEntry(entry)[locale])),
  ];
  assert.deepEqual([...blocked].sort(), [...expected].sort());
  assert.equal(new Set(blocked).size, blocked.length, "no address twice");
  for (const pathname of publicPathnames()) {
    for (const locale of locales) assert.equal(blocked.includes(localizedPath(pathname, locale)), false, `${pathname} is public`);
  }
  // Every address is a path the proxy compares as is: absolute, no trailing slash, no query.
  for (const path of blocked) assert.match(path, /^\/[a-z0-9/-]*[a-z0-9]$/, path);
});

test("the list follows the features: the portfolio and its cases, the sub-pages", () => {
  const blocked = blockedPaths(open);
  assert.equal(blocked.includes("/portafolio"), !isListed("/portafolio"));
  assert.equal(blocked.includes("/en/work"), !isListed("/portafolio"));
  assert.equal(blocked.includes("/servicios/minecraft/plugins"), !isListed("/servicios/minecraft/plugins"));
  assert.equal(blocked.includes("/en/services/discord/bots"), !isListed("/servicios/discord/bots"));
  for (const item of visibleCases(portfolioCases)) {
    assert.equal(blocked.includes(`/portafolio/${item.slug.es}`), !isListed("/portafolio"), item.id);
    assert.equal(blocked.includes(`/en/work/${item.slug.en}`), !isListed("/portafolio"), item.id);
  }
  // Fixed pages that are always public are never blocked.
  for (const path of ["/", "/en", "/servicios/minecraft", "/en/contact"]) assert.equal(blocked.includes(path), false, path);
});
