import assert from "node:assert/strict";
import { test } from "node:test";
import { type LegalDocument, privacyDocument, termsDocument } from "@/content/legal";
import { locales } from "@/i18n/locales";
import { fillSentence, parseIsoDate, showDate, showParagraphs, showValue } from "@/lib/legal";
import { type LegalDocumentData, type ProvidedLocalized, siteConfig } from "@/site.config";

const pendingValue: ProvidedLocalized<string> = { status: "pending", placeholder: { es: "[fecha]", en: "[date]" } };

test("RF-2: a pending value is shown as its note, in the language of the page", () => {
  assert.equal(showValue(pendingValue, "es"), "[fecha]");
  assert.equal(showValue(pendingValue, "en"), "[date]");
  assert.equal(showDate(pendingValue, "en"), "[date]");
  assert.deepEqual(showParagraphs({ status: "pending", placeholder: { es: "[Texto.]", en: "[Text.]" } }, "es"), ["[Texto.]"]);
});

test("RF-3: a ready value replaces the note", () => {
  assert.equal(showValue({ status: "ready", value: "Estudio Ejemplo S.A.S." }, "en"), "Estudio Ejemplo S.A.S.");
  assert.deepEqual(showParagraphs({ status: "ready", value: { es: ["Uno.", "Dos."], en: ["One."] } }, "es"), ["Uno.", "Dos."]);
  assert.deepEqual(showParagraphs({ status: "ready", value: { es: ["Uno.", "Dos."], en: ["One."] } }, "en"), ["One."]);
});

test("RF-3: dates are written in the long form of each language", () => {
  const date: ProvidedLocalized<string> = { status: "ready", value: "2026-12-01" };
  assert.equal(showDate(date, "es"), "1 de diciembre de 2026");
  assert.equal(showDate(date, "en"), "December 1, 2026");
});

test("a date that is not a real YYYY-MM-DD date fails instead of being printed", () => {
  for (const wrong of ["1/12/2026", "2026-12-1", "2026-02-31", "2026-13-01", "", "diciembre"]) {
    assert.throws(() => parseIsoDate(wrong), /YYYY-MM-DD/, wrong);
  }
  assert.equal(parseIsoDate("2028-02-29").toISOString(), "2028-02-29T00:00:00.000Z");
});

test("the sentence about who answers for the site takes each value as plain text", () => {
  assert.equal(fillSentence("{name}, {id}. Correo: {email}.", { name: "A $& B", id: "900", email: "a@b.co" }), "A $& B, 900. Correo: a@b.co.");
  assert.throws(() => fillSentence("{name} y {otro}", { name: "A" }), /No value for \{otro\}/);
});

function checkDocument<SectionId extends string>(name: string, document: LegalDocument<SectionId>, data: LegalDocumentData<SectionId>) {
  const ids = document.sections.map((section) => section.id);
  assert.equal(ids.length, 8, `${name}: eight sections, as in the mockup`);
  assert.equal(ids[0], "owner", `${name}: the first section says who answers for the site`);
  assert.equal(new Set(ids).size, ids.length, `${name}: section ids are unique`);
  // Every section but the first has its text in site.config.ts, and nothing there is left unused.
  assert.deepEqual(ids.slice(1).sort(), Object.keys(data.sections).sort(), `${name}: sections and their texts match`);

  const owner = siteConfig.legal.owner;
  for (const locale of locales) {
    const values = Object.fromEntries(Object.entries(owner).map(([key, value]) => [key, showValue(value, locale)]));
    const sentence = fillSentence(document.ownerSentence[locale], values);
    assert.doesNotMatch(sentence, /[{}]/, `${name} ${locale}: every field of the sentence has a value`);
  }
}

test("RF-1: each legal page has its eight sections and a text for each one", () => {
  checkDocument("privacy", privacyDocument, siteConfig.legal.privacy);
  checkDocument("terms", termsDocument, siteConfig.legal.terms);
});

test("RF-2: every note of a pending legal value is in brackets, in both languages", () => {
  const notes: string[] = [];
  const collect = (value: unknown): void => {
    if (!value || typeof value !== "object") return;
    if ("status" in value && value.status === "pending" && "placeholder" in value) {
      notes.push(...(typeof value.placeholder === "string" ? [value.placeholder] : Object.values(value.placeholder as Record<string, string>)));
      return;
    }
    Object.values(value).forEach(collect);
  };
  collect(siteConfig.legal);
  for (const note of notes) assert.match(note, /^\[[^\]]+\]$/, note);
});

test("ready legal dates in the configuration are real dates", () => {
  for (const document of [siteConfig.legal.privacy, siteConfig.legal.terms]) {
    for (const date of [document.effectiveDate, document.updatedDate]) {
      if (date.status === "ready") assert.doesNotThrow(() => parseIsoDate(date.value));
    }
  }
});
