import { serviceLines } from "../content/service-lines";
import type { ServiceLineId } from "../content/types";
import { type AppLocale, isAppLocale } from "../i18n/locales";
import { entryLinkKey, type RouteParams } from "../routes";

/**
 * Trademark notices of the footer (docs/specs/008-aviso-de-minecraft-por-linea.md). A page carries
 * the notice of a brand when that brand's line is one of the lines the page is about: the data of
 * the page decides, never a list of addresses. This file reaches the browser (the footer reads the
 * page on screen): it only imports the service lines, which are public.
 */
export const noticeLines = ["minecraft", "discord"] as const satisfies readonly ServiceLineId[];
export type FooterNotice = (typeof noticeLines)[number];

/** Notices of a page about these lines, in the order they are shown. */
export function noticesOf(lines: readonly ServiceLineId[]): FooterNotice[] {
  return noticeLines.filter((notice) => lines.includes(notice));
}

/**
 * Whether a page is about Minecraft: the Minecraft notice goes in its footer and the contact
 * e-mail is written out in its closing (the brand's rules do not take a chat link as the only
 * means of contact).
 */
export function isMinecraftPage(lines: readonly ServiceLineId[]): boolean {
  return lines.includes("minecraft");
}

/**
 * Lines a fixed page is about: its own line, for the page of a line and for each of its
 * sub-pages (src/content/service-lines.ts); none for any other page.
 */
export function linesOfPage(pathname: string): ServiceLineId[] {
  return serviceLines.filter((line) => line.pathname === pathname || line.subpages.some((subpage) => subpage.pathname === pathname)).map((line) => line.id);
}

/**
 * Notices of the entries (cases, guides) that carry any, by language and slug (entryLinkKey).
 * Built on the server from the entries this build generates (src/lib/entries.ts) and handed to
 * the footer: on an entry page the path does not say which entry is on screen.
 */
export type EntryNotices = Readonly<Record<string, readonly FooterNotice[]>>;

type EntryWithLines = { readonly slug: Readonly<Record<AppLocale, string>>; readonly lines: readonly ServiceLineId[] };

export function entryNoticesOf(entries: readonly EntryWithLines[], locales: readonly AppLocale[]): EntryNotices {
  return Object.fromEntries(
    entries
      .map((entry) => ({ entry, notices: noticesOf(entry.lines) }))
      .filter(({ notices }) => notices.length > 0)
      .flatMap(({ entry, notices }) => locales.map((locale) => [entryLinkKey(locale, entry.slug[locale]), notices])),
  );
}

/** Notices of the page on screen: those of the entry when an entry is on screen, otherwise those of the fixed page. */
export function noticesOnScreen(pathname: string, params: RouteParams | null, entries: EntryNotices): readonly FooterNotice[] {
  const { locale, slug } = params ?? {};
  if (typeof locale === "string" && typeof slug === "string" && isAppLocale(locale)) return entries[entryLinkKey(locale, slug)] ?? [];
  return noticesOf(linesOfPage(pathname));
}
