import { portfolioCases } from "../content/cases";
import { serviceLines } from "../content/service-lines";
import type { CaseValue, PendingRef, PortfolioCase, ServiceLineId, ShownCase } from "../content/types";
import type { AppLocale } from "../i18n/locales";
import { type PortfolioPendingKey, portfolioPending, type SiteConfig, siteConfig } from "../site.config";

/**
 * Rules of the portfolio (docs/specs/005-portafolio-y-casos.md). Cases and configuration come in
 * as parameters, so the tests can try private, reserved and incomplete cases without touching
 * src/content.
 */

/** Cases that are published: private ones are dropped here and nowhere else (RF-5). */
export function visibleCases(cases: readonly PortfolioCase[] = portfolioCases): ShownCase[] {
  return cases.filter((candidate): candidate is ShownCase => candidate.visibilidad !== "privado");
}

export function isPendingRef(value: unknown): value is PendingRef {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value) && "pending" in (value as object);
}

/** The bracketed note of a pending value, in the language of the page. */
export function pendingNote(ref: PendingRef, locale: AppLocale): string {
  return portfolioPending[ref.pending].placeholder[locale];
}

/** Every pending value of a case, by its key in site.config.ts ("kaelion.year"). */
export function casePendingKeys(item: ShownCase): PortfolioPendingKey[] {
  const fields: readonly CaseValue<unknown>[] = [item.year, item.cover, item.hero, item.challenge, item.work, item.result];
  const pieces = item.pieces.flatMap((piece) => (piece.kind === "pending" ? [piece.ref] : []));
  return [...fields.filter(isPendingRef), ...pieces].map((ref) => ref.pending);
}

/** Service lines without a single published case. */
export function linesWithoutCases(cases: readonly PortfolioCase[] = portfolioCases): ServiceLineId[] {
  const covered = new Set(visibleCases(cases).flatMap((item) => item.lines));
  return serviceLines.map((line) => line.id).filter((line) => !covered.has(line));
}

/**
 * RF-7, first half: the portfolio goes public with at least one piece per line. Checked on every
 * build with the portfolio on, open to search engines or not.
 */
export function assertPortfolioReady(config: SiteConfig = siteConfig, cases: readonly PortfolioCase[] = portfolioCases): void {
  if (!config.features.portfolio) return;
  const missing = linesWithoutCases(cases);
  if (missing.length > 0) {
    throw new Error(`features.portfolio is on but these service lines have no published case: ${missing.join(", ")}. Add their cases or keep the portfolio off.`);
  }
}

/**
 * RF-7, second half: pending data of the published cases, named one by one. They only block the
 * launch while the portfolio is on; with it off, nobody can reach a case from the site.
 */
export function portfolioLaunchBlockers(config: SiteConfig = siteConfig, cases: readonly PortfolioCase[] = portfolioCases): string[] {
  if (!config.features.portfolio) return [];
  return visibleCases(cases).flatMap((item) => casePendingKeys(item).map((key) => `site.config.ts portfolio.${key} is still pending`));
}

/** A value of a case for the page: the value itself, or its note while it is pending. */
export type Shown<T> = { readonly status: "ready"; readonly value: T } | { readonly status: "pending"; readonly note: string };

export function showCaseValue<T>(value: CaseValue<T>, locale: AppLocale): Shown<T> {
  return isPendingRef(value) ? { status: "pending", note: pendingNote(value, locale) } : { status: "ready", value };
}

/** The case after this one in the order of the index, going round; none when it is the only one. */
export function nextCase(item: ShownCase, cases: readonly PortfolioCase[] = portfolioCases): ShownCase | undefined {
  const shown = visibleCases(cases);
  if (shown.length < 2) return undefined;
  const index = shown.findIndex((candidate) => candidate.id === item.id);
  return shown[(index + 1) % shown.length];
}

/** The published case behind a slug in a language. */
export function findCase(locale: AppLocale, slug: string, cases: readonly PortfolioCase[] = portfolioCases): ShownCase | undefined {
  return visibleCases(cases).find((item) => item.slug[locale] === slug);
}

/** Who the work was for, as the card and the case page say it (RF-4). A reserved case has no name to show. */
export function clientLabel(item: ShownCase, texts: { readonly ownProject: string; readonly reservedClient: string }): string {
  switch (item.client.kind) {
    case "named":
      return item.client.name;
    case "own":
      return texts.ownProject;
    case "reserved":
      return texts.reservedClient;
  }
}

/** The lines of a case by their short names: "Diseño · Desarrollo". */
export function lineNames(lines: readonly ServiceLineId[], locale: AppLocale): string {
  return lines.map((id) => serviceLines.find((line) => line.id === id)?.shortName[locale] ?? id).join(" · ");
}
