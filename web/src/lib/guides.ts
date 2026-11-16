import { guides as guideRegistry } from "../content/guides";
import type { GuideContent, GuideMeta } from "../content/types";
import { type AppLocale, locales } from "../i18n/locales";
import { isBuilt } from "../routes";
import { type SiteConfig, siteConfig } from "../site.config";

/**
 * Rules of the guides (docs/specs/006-guias.md). Guides and configuration come in as
 * parameters, so the tests can try broken guides without touching src/content.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** A real date written as YYYY-MM-DD ("2026-02-31" is not one). */
export function isIsoDate(value: string): boolean {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return date.toISOString().slice(0, 10) === value;
}

/** Long date in the language of the page: "15 de noviembre de 2026", "November 15, 2026". */
export function formatGuideDate(value: string, locale: AppLocale): string {
  if (!isIsoDate(value)) throw new Error(`Guide dates must be real dates written as YYYY-MM-DD, got "${value}".`);
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function emptyLocales(value: Readonly<Record<AppLocale, string>>): AppLocale[] {
  return locales.filter((locale) => typeof value[locale] !== "string" || value[locale].trim() === "");
}

/** What is wrong with one guide: missing languages, dates that are not dates or out of order, a related page that does not exist. */
export function guideProblems(guide: GuideContent): string[] {
  const { meta } = guide;
  const problems: string[] = [];
  const texts: [string, Readonly<Record<AppLocale, string>>][] = [
    ["slug", meta.slug],
    ["shortName", meta.shortName],
    ["title", meta.title],
    ["summary", meta.summary],
    ["meta.title", meta.meta.title],
    ["meta.description", meta.meta.description],
    ...meta.sections.map((section, index): [string, Readonly<Record<AppLocale, string>>] => [`sections[${index}]`, section]),
  ];
  for (const [field, value] of texts) {
    const missing = emptyLocales(value);
    if (missing.length > 0) problems.push(`${field} is missing in ${missing.join(", ")}`);
  }
  const missingBodies = locales.filter((locale) => typeof guide.body[locale] !== "function");
  if (missingBodies.length > 0) problems.push(`the body is missing in ${missingBodies.join(", ")}`);
  if (meta.sections.length < 2) problems.push("it needs at least two sections (00 · Antes de empezar … Siguientes pasos)");
  if (!isIsoDate(meta.publishedAt)) problems.push(`publishedAt "${meta.publishedAt}" is not a date written as YYYY-MM-DD`);
  if (!isIsoDate(meta.updatedAt)) problems.push(`updatedAt "${meta.updatedAt}" is not a date written as YYYY-MM-DD`);
  if (isIsoDate(meta.publishedAt) && isIsoDate(meta.updatedAt) && meta.updatedAt < meta.publishedAt) {
    problems.push(`updatedAt ${meta.updatedAt} is before publishedAt ${meta.publishedAt}`);
  }
  if (!Number.isInteger(meta.readingMinutes) || meta.readingMinutes < 1) problems.push("readingMinutes must be a whole number of minutes");
  if (!isBuilt(meta.service)) problems.push(`its related service ${meta.service} is not a page of the site`);
  return problems;
}

/**
 * RF-7: the build fails with the guides on and none written, and on any guide that is
 * incomplete, naming it. Called from next.config.ts.
 */
export function assertGuidesReady(config: SiteConfig = siteConfig, guides: readonly GuideContent[] = guideRegistry): void {
  if (config.features.guides && guides.length === 0) {
    throw new Error("features.guides is on but there is no guide: write one or keep the guides off.");
  }
  const ids = guides.map((guide) => guide.meta.id);
  const repeated = ids.filter((id, index) => ids.indexOf(id) !== index);
  const problems = [
    ...repeated.map((id) => `guide ${id} is listed twice`),
    ...guides.flatMap((guide) => guideProblems(guide).map((problem) => `guide ${guide.meta.id}: ${problem}`)),
  ];
  if (problems.length > 0) throw new Error(`Some guides are not ready: ${problems.join("; ")}.`);
}

/** Guides in the order of the index: the most recent publication first. */
export function sortedGuides(guides: readonly GuideContent[] = guideRegistry): GuideContent[] {
  return [...guides].sort((a, b) => b.meta.publishedAt.localeCompare(a.meta.publishedAt));
}

/** Up to `max` other guides for "Guías relacionadas": those of the same line first. */
export function relatedGuides(guide: GuideMeta, guides: readonly GuideContent[] = guideRegistry, max = 2): GuideMeta[] {
  const others = sortedGuides(guides)
    .map((candidate) => candidate.meta)
    .filter((candidate) => candidate.id !== guide.id);
  return [...others.filter((candidate) => candidate.line === guide.line), ...others.filter((candidate) => candidate.line !== guide.line)].slice(0, max);
}

/** The guide behind a slug in a language. */
export function findGuide(locale: AppLocale, slug: string, guides: readonly GuideContent[] = guideRegistry): GuideContent | undefined {
  return guides.find((guide) => guide.meta.slug[locale] === slug);
}
