import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { homeFaqs, processSteps } from "@/content/home";
import { linePages } from "@/content/lines";
import { getPageMeta, getPageName, hasPageMeta } from "@/content/pages";
import { serviceLines } from "@/content/service-lines";
import { type AppLocale, locales } from "@/i18n/locales";
import { MAX_OG_LINE_LENGTH } from "@/lib/seo/metadata";
import { appPathnames, breadcrumbTrail, routeTable } from "@/routes";

const contentDir = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.join(contentDir, "..", "..");

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
}

/** Texts in one language inside any value: everything under a `{ es, en }` pair. */
function collectLocalized(value: unknown, locale: AppLocale, out: string[] = [], seen = new Set<unknown>()): string[] {
  if (!value || typeof value !== "object" || seen.has(value)) return out;
  seen.add(value);
  if (!Array.isArray(value) && "es" in value && "en" in value) {
    collectStrings((value as Record<AppLocale, unknown>)[locale], out);
    return out;
  }
  for (const item of Object.values(value)) collectLocalized(item, locale, out, seen);
  return out;
}

function contentFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return contentFiles(full);
    return entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts") ? [full] : [];
  });
}

// Every module under src/content is loaded, so a new content file is covered without touching this test.
const contentModules = await Promise.all(contentFiles(contentDir).map((file) => import(pathToFileURL(file).href)));

function messages(locale: AppLocale): string[] {
  return collectStrings(JSON.parse(readFileSync(path.join(webDir, "messages", `${locale}.json`), "utf8")));
}

/** Every text a visitor can read in a language: UI messages plus all typed content. */
function allTexts(locale: AppLocale): string[] {
  return [...messages(locale), ...contentModules.flatMap((module) => collectLocalized(module, locale))];
}

// BRIEF.md, "Reglas que no se negocian": never "plan" or "mensualidad", and the country is not mentioned.
const FORBIDDEN: Record<AppLocale, RegExp[]> = {
  es: [/\bplan(es)?\b/i, /\bmensualidad(es)?\b/i, /\bcolombi/i],
  en: [/\bplans?\b/i, /\bmonthly\b/i, /\bsubscriptions?\b/i, /\bcolombi/i],
};

test("the content scan reaches the texts of every content module", () => {
  const es = allTexts("es");
  assert.ok(es.length > 300, `only ${es.length} Spanish texts found`);
  // One text from each kind of module: line pages, home and page meta.
  assert.ok(es.includes(linePages.minecraft.hero.text.es));
  assert.ok(es.includes(homeFaqs[0]?.answer.es ?? ""));
  assert.ok(es.includes(getPageMeta("/").description.es));
});

test('texts never say "plan" or "mensualidad" and never mention the country', () => {
  for (const locale of locales) {
    for (const text of allTexts(locale)) {
      for (const pattern of FORBIDDEN[locale]) {
        assert.doesNotMatch(text, pattern, `${locale}: "${text}"`);
      }
    }
  }
});

test("no pending content in brackets ships inside the texts", () => {
  for (const locale of locales) {
    for (const text of allTexts(locale)) {
      assert.doesNotMatch(text, /\[[^\]]+\]/, `${locale}: "${text}" (pending data belongs in site.config.ts)`);
    }
  }
});

test("every text exists in both languages and is not left empty", () => {
  const es = contentModules.flatMap((module) => collectLocalized(module, "es"));
  const en = contentModules.flatMap((module) => collectLocalized(module, "en"));
  assert.equal(es.length, en.length, "a text has a different number of entries in Spanish and English");
  for (const text of [...es, ...en]) assert.notEqual(text.trim(), "", "empty text in the content");
});

test("the interface messages have the same keys in both languages, none empty", () => {
  const keyPaths = (value: unknown, prefix = ""): string[] =>
    value && typeof value === "object"
      ? Object.entries(value).flatMap(([key, child]) => keyPaths(child, prefix ? `${prefix}.${key}` : key))
      : [prefix];
  const read = (locale: AppLocale): unknown => JSON.parse(readFileSync(path.join(webDir, "messages", `${locale}.json`), "utf8"));

  // A key missing in one language would show its own name on the page instead of failing the build.
  assert.deepEqual(keyPaths(read("en")).sort(), keyPaths(read("es")).sort());
  for (const locale of locales) {
    for (const text of messages(locale)) assert.notEqual(text.trim(), "", `empty message in ${locale}.json`);
  }
});

test("there are five service lines, numbered I to V, each pointing to its own route", () => {
  assert.deepEqual(serviceLines.map((line) => line.numeral), ["I", "II", "III", "IV", "V"]);
  assert.equal(new Set(serviceLines.map((line) => line.pathname)).size, 5);
  for (const line of serviceLines) {
    assert.ok(line.pathname in routeTable, line.pathname);
    for (const sub of line.subpages) {
      assert.ok(sub.pathname.startsWith(`${line.pathname}/`), `${sub.pathname} is not inside ${line.pathname}`);
    }
  }
});

test("each line page belongs to its line and links only to sub-pages of that line", () => {
  for (const line of serviceLines) {
    const page = linePages[line.id];
    assert.equal(page.line, line.id);
    for (const service of page.services.items) {
      if (service.subpage) assert.ok(service.subpage.startsWith(`${line.pathname}/`), `${service.subpage} in ${line.id}`);
    }
    // Community lines state their scope; service lines say what the client receives.
    assert.equal(Boolean(page.scope), page.kind === "community", `${line.id} scope`);
    assert.equal(Boolean(page.deliverables), page.kind === "service", `${line.id} deliverables`);
    assert.equal(new Set(page.faq.items.map((faq) => faq.id)).size, page.faq.items.length, `${line.id} faq ids`);
  }
});

test("the home page has the seven approved questions and four process steps", () => {
  assert.equal(homeFaqs.length, 7);
  assert.equal(new Set(homeFaqs.map((faq) => faq.id)).size, 7);
  assert.deepEqual(processSteps.map((step) => step.number), ["01", "02", "03", "04"]);
});

test("every built page has a title and a description in both languages", () => {
  for (const pathname of appPathnames.filter((p) => routeTable[p].built)) {
    assert.ok(hasPageMeta(pathname), `missing page meta for ${pathname}`);
    const meta = getPageMeta(pathname);
    for (const locale of locales) {
      // seo-sitio.md §2.3: title about 60 characters, description about 150.
      assert.ok(meta.title[locale].length <= 60, `${pathname} ${locale} title has ${meta.title[locale].length} characters`);
      assert.ok(meta.description[locale].length >= 110, `${pathname} ${locale} description is too short`);
      assert.ok(meta.description[locale].length <= 155, `${pathname} ${locale} description has ${meta.description[locale].length} characters`);
    }
  }
});

test("titles and descriptions are unique across pages and languages", () => {
  const metas = appPathnames.filter(hasPageMeta).map(getPageMeta);
  for (const field of ["title", "description"] as const) {
    const values = metas.flatMap((meta) => locales.map((locale) => meta[field][locale]));
    assert.equal(new Set(values).size, values.length, `duplicated ${field}`);
  }
});

test("every line of a social image fits in one row", () => {
  // The image never wraps: a longer line would be cut at the edge without warning.
  for (const pathname of appPathnames.filter(hasPageMeta)) {
    for (const locale of locales) {
      const og = getPageMeta(pathname).og[locale];
      for (const line of [...og.lines, og.accent ?? ""]) {
        assert.ok(line.length <= MAX_OG_LINE_LENGTH, `${pathname} ${locale}: "${line}" has ${line.length} characters (max ${MAX_OG_LINE_LENGTH})`);
      }
    }
  }
});

test("every page in a breadcrumb trail has a name", () => {
  for (const pathname of appPathnames.filter((p) => routeTable[p].built)) {
    for (const crumb of breadcrumbTrail(pathname)) {
      for (const locale of locales) assert.notEqual(getPageName(crumb)[locale].trim(), "", `${crumb} ${locale}`);
    }
  }
});
