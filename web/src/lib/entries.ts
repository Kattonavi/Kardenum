import { portfolioCases } from "../content/cases";
import type { PageMeta, PortfolioCase } from "../content/types";
import type { Localized } from "../i18n/locales";
import { locales } from "../i18n/locales";
import {
  type CollectionPathname,
  collectionPathnames,
  collectionTable,
  type EntryLinks,
  entryLinkKey,
  entryPaths,
  isListed,
  type LocalizedPaths,
} from "../routes";
import { visibleCases } from "./portfolio";

/**
 * Entries of the collections (src/routes.ts): the pages made from one template. Server-side
 * only: it reads the content, and private cases must never reach a file the browser loads.
 * A second collection (guides) adds its source here and its template in routes.ts.
 */
export type Entry = {
  readonly collection: CollectionPathname;
  /** Internal id, unique inside its collection. */
  readonly id: string;
  readonly slug: Localized<string>;
  readonly name: string;
  readonly meta: Pick<PageMeta, "title" | "description">;
};

/** What each collection is made of. The cases come in as a parameter so the tests can add private ones. */
type Content = { readonly cases: readonly PortfolioCase[] };

const sources: Readonly<Record<CollectionPathname, (content: Content) => readonly Omit<Entry, "collection">[]>> = {
  "/portafolio/[slug]": ({ cases }) => visibleCases(cases).map(({ id, slug, name, meta }) => ({ id, slug, name, meta })),
};

/** Every entry with a page, public or hidden behind the flag of its collection: the ones the tests visit. */
export function builtEntries(cases: readonly PortfolioCase[] = portfolioCases): Entry[] {
  const entries = collectionPathnames.flatMap((collection) => sources[collection]({ cases }).map((entry) => ({ ...entry, collection })));
  // The header tells entries apart by language and slug only (useParams gives the slug, not the
  // collection), so a slug may not repeat across collections.
  const keys = entries.flatMap((entry) => locales.map((locale) => entryLinkKey(locale, entry.slug[locale])));
  const repeated = keys.filter((key, index) => keys.indexOf(key) !== index);
  if (repeated.length > 0) throw new Error(`Two entries share a slug in the same language: ${[...new Set(repeated)].join(", ")}.`);
  return entries;
}

/** An entry is public when the index of its collection is. */
export function isEntryListed(entry: Entry): boolean {
  return isListed(collectionTable[entry.collection].index);
}

export function publicEntries(cases: readonly PortfolioCase[] = portfolioCases): Entry[] {
  return builtEntries(cases).filter(isEntryListed);
}

export function hiddenEntries(cases: readonly PortfolioCase[] = portfolioCases): Entry[] {
  return builtEntries(cases).filter((entry) => !isEntryListed(entry));
}

export function pathsOfEntry(entry: Entry): LocalizedPaths {
  return entryPaths(entry.collection, entry.slug);
}

/** Addresses in each language of every built entry, for the ES / EN links of the header. */
export function entryLinks(cases: readonly PortfolioCase[] = portfolioCases): EntryLinks {
  return Object.fromEntries(
    builtEntries(cases).flatMap((entry) => locales.map((locale) => [entryLinkKey(locale, entry.slug[locale]), pathsOfEntry(entry)])),
  );
}
