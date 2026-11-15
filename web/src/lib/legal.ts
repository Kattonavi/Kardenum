import type { AppLocale } from "../i18n/locales";
import type { ProvidedLocalized, ProvidedText } from "../site.config";

/**
 * How the legal pages show a value of site.config.ts (docs/specs/003-paginas-legales.md):
 * the value once it exists, or its bracketed note, in the language of the page, while it is pending.
 */
export function showValue(value: ProvidedLocalized<string>, locale: AppLocale): string {
  return value.status === "ready" ? value.value : value.placeholder[locale];
}

/** A date written as YYYY-MM-DD. Anything else is a mistake in site.config.ts and fails the build. */
export function parseIsoDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = match ? new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))) : null;
  // Date.UTC rolls 2026-02-31 over to March: the round trip catches dates that do not exist.
  if (!date || date.toISOString().slice(0, 10) !== value) throw new Error(`Legal dates must be real dates written as YYYY-MM-DD, got "${value}".`);
  return date;
}

/** Long date in the language of the page ("15 de noviembre de 2026"), or its note while pending. */
export function showDate(value: ProvidedLocalized<string>, locale: AppLocale): string {
  if (value.status === "pending") return value.placeholder[locale];
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(parseIsoDate(value.value));
}

/** Paragraphs of a legal text in a language. While pending, one paragraph: its note. */
export function showParagraphs(value: ProvidedText, locale: AppLocale): readonly string[] {
  return value.status === "ready" ? value.value[locale] : [value.placeholder[locale]];
}

/**
 * Puts each value in its {field} of a sentence. The replacement is a function so that "$&" in a
 * value is text and not a pattern; a field without a value is a mistake and fails the build.
 */
export function fillSentence(sentence: string, values: Readonly<Record<string, string>>): string {
  return sentence.replace(/\{(\w+)\}/g, (_field, key: string) => {
    const value = values[key];
    if (value === undefined) throw new Error(`No value for {${key}} in "${sentence}".`);
    return value;
  });
}
