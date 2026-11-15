import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { homeFaqs, processSteps } from "@/content/home";
import { getPageMeta, hasPageMeta } from "@/content/pages";
import { serviceLines } from "@/content/service-lines";
import { type AppLocale, locales } from "@/i18n/locales";
import { appPathnames, routeTable } from "@/routes";

const webDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
}

function messages(locale: AppLocale): string[] {
  return collectStrings(JSON.parse(readFileSync(path.join(webDir, "messages", `${locale}.json`), "utf8")));
}

/** Every text a visitor can read in a language: UI messages plus typed content. */
function allTexts(locale: AppLocale): string[] {
  const builtMeta = appPathnames.filter(hasPageMeta).map(getPageMeta);
  const typed = [
    ...serviceLines.flatMap((line) => [line.name[locale], line.shortName[locale], line.summary[locale], ...line.subpages.map((s) => s.label[locale])]),
    ...processSteps.flatMap((step) => [step.title[locale], step.text[locale]]),
    ...homeFaqs.flatMap((faq) => [faq.question[locale], faq.answer[locale]]),
    ...builtMeta.flatMap((meta) => [meta.title[locale], meta.description[locale], meta.og[locale].label, ...meta.og[locale].lines, meta.og[locale].accent ?? ""]),
  ];
  return [...messages(locale), ...typed];
}

// BRIEF.md, "Reglas que no se negocian": never "plan" or "mensualidad", and the country is not mentioned.
const FORBIDDEN: Record<AppLocale, RegExp[]> = {
  es: [/\bplan(es)?\b/i, /\bmensualidad(es)?\b/i, /\bcolombi/i],
  en: [/\bplans?\b/i, /\bmonthly\b/i, /\bsubscriptions?\b/i, /\bcolombi/i],
};

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
