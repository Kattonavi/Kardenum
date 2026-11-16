import assert from "node:assert/strict";
import { test } from "node:test";
import { portfolioCases } from "@/content/cases";
import { serviceLines } from "@/content/service-lines";
import type { PortfolioCase, ServiceLineId, ShownCase } from "@/content/types";
import { getPageMeta } from "@/content/pages";
import { locales } from "@/i18n/locales";
import { builtEntries, entryLinks, pathsOfEntry } from "@/lib/entries";
import {
  assertPortfolioReady,
  casePendingKeys,
  clientLabel,
  findCase,
  linesWithoutCases,
  nextCase,
  portfolioLaunchBlockers,
  visibleCases,
} from "@/lib/portfolio";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { appPathnames, entryPath, isBuilt } from "@/routes";
import { portfolioPending, type SiteConfig, siteConfig } from "@/site.config";

// docs/specs/005-portafolio-y-casos.md. The cases below are built here: the real ones are not touched.
delete process.env.SITE_URL;

// The entries of a hidden section are only generated on a closed site: these tests describe that one,
// whatever SITE_INDEXABLE the build that runs them has.
const closedSite = { SITE_INDEXABLE: "false" };

const texts = { ownProject: "Proyecto propio", reservedClient: "Cliente reservado" };
const both = (text: string) => ({ es: text, en: text });

/** A published case with every value ready, for the lines given. */
function shown(id: string, lines: readonly ServiceLineId[], visibility: "publico" | "reservado" = "publico"): ShownCase {
  const content = {
    id,
    slug: { es: id, en: `${id}-en` },
    name: `Caso ${id}`,
    summary: both(`Resumen ${id}.`),
    cardText: both(`Tarjeta ${id}`),
    lines,
    year: 2026,
    cover: { kind: "mark", alt: both("Logo") },
    hero: { kind: "mark", alt: both("Logo") },
    challenge: both("El reto."),
    work: [both("Una cosa.")],
    result: both("El resultado."),
    pieces: [],
    meta: { title: both(`Título ${id}`), description: both(`Descripción ${id}`) },
  } as const;
  return visibility === "publico" ? { ...content, visibilidad: "publico", client: { kind: "named", name: `Cliente ${id}` } } : { ...content, visibilidad: "reservado", client: { kind: "reserved" } };
}

const privateCase: PortfolioCase = { visibilidad: "privado", id: "secreto", lines: ["video", "discord"], year: 2026 };
const allLines = serviceLines.map((line) => line.id);
const withPortfolio = (on: boolean): SiteConfig => ({ ...siteConfig, features: { ...siteConfig.features, portfolio: on } });

test("RF-4: a reserved case has nowhere to put the client's name, and shows the reserved label", () => {
  const reserved = shown("reservado", ["diseno"], "reservado");
  assert.equal(clientLabel(reserved, texts), "Cliente reservado");
  assert.equal("name" in reserved.client, false);
  // The type rejects a reserved client with a name: tsc fails here if it ever accepts one.
  const named: Extract<PortfolioCase, { visibilidad: "reservado" }>["client"] = {
    kind: "reserved",
    // @ts-expect-error a reserved client has no name
    name: "Acme",
  };
  assert.ok(named);
  assert.equal(clientLabel(shown("publico", ["diseno"]), texts), "Cliente publico");
  assert.equal(clientLabel(portfolioCases.find((item) => item.id === "kardenum") as ShownCase, texts), "Proyecto propio");
});

test("RF-5: a private case is never published: no case, no entry, no address, no sitemap URL", () => {
  const cases = [shown("uno", ["desarrollo"]), privateCase];
  assert.deepEqual(visibleCases(cases).map((item) => item.id), ["uno"]);
  assert.equal(findCase("es", "secreto", cases), undefined);
  assert.deepEqual(builtEntries(cases, []).map((entry) => entry.id), ["uno"]);
  assert.equal(Object.keys(entryLinks(cases, [], closedSite)).some((key) => key.includes("secreto")), false);
  for (const url of buildSitemapEntries({}, cases).map((entry) => entry.url)) assert.doesNotMatch(url, /secreto/);
  // It counts for no line either.
  assert.ok(linesWithoutCases(cases).includes("video"));
  // The type of a private case takes no content at all.
  const leaky: Extract<PortfolioCase, { visibilidad: "privado" }> = {
    visibilidad: "privado",
    id: "x",
    lines: [],
    year: 2026,
    // @ts-expect-error a private case has no texts
    summary: both("x"),
  };
  assert.ok(leaky);
});

test("RF-7: with the portfolio on, every line needs a published case, and the build names the missing ones", () => {
  const twoLines = [shown("a", ["desarrollo", "diseno"]), shown("b", ["minecraft"]), privateCase];
  assert.throws(() => assertPortfolioReady(withPortfolio(true), twoLines), /video, discord/);
  assert.doesNotThrow(() => assertPortfolioReady(withPortfolio(false), twoLines));
  assert.doesNotThrow(() => assertPortfolioReady(withPortfolio(true), [shown("a", allLines)]));
  assert.doesNotThrow(() => assertPortfolioReady(withPortfolio(true), allLines.map((line) => shown(line, [line], "reservado"))));
  // The real cases today.
  assert.deepEqual(linesWithoutCases(), allLines.filter((line) => !portfolioCases.some((item) => item.visibilidad !== "privado" && item.lines.includes(line))));
});

test("RF-7: pending data of the published cases blocks the launch only with the portfolio on", () => {
  const pending: ShownCase = { ...shown("p", ["video"]), year: { pending: "kaelion.year" }, pieces: [{ kind: "pending", ref: { pending: "kardenum.siteScreenshot" } }] };
  assert.deepEqual(casePendingKeys(pending), ["kaelion.year", "kardenum.siteScreenshot"]);
  assert.deepEqual(portfolioLaunchBlockers(withPortfolio(false), [pending]), []);
  assert.deepEqual(portfolioLaunchBlockers(withPortfolio(true), [pending]), [
    "site.config.ts portfolio.kaelion.year is still pending",
    "site.config.ts portfolio.kardenum.siteScreenshot is still pending",
  ]);
  assert.deepEqual(portfolioLaunchBlockers(withPortfolio(true), [shown("ready", ["video"])]), []);
});

test("every pending note of site.config.ts belongs to a case that points to it, and says what is missing in brackets", () => {
  const referenced = visibleCases().flatMap((item) => casePendingKeys(item).map((key) => [key, item.id] as const));
  assert.deepEqual(referenced.map(([key]) => key).sort(), Object.keys(portfolioPending).sort());
  for (const [key, id] of referenced) {
    assert.ok(key.startsWith(`${id}.`), `${key} is used by ${id}`);
    for (const locale of locales) assert.match(portfolioPending[key].placeholder[locale], /^\[.+\]$/, `${key} ${locale}`);
  }
});

test("the published cases have their own slugs, addresses, texts and a next project", () => {
  const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const shownCases = visibleCases();
  assert.ok(shownCases.length >= 1);
  for (const item of shownCases) {
    for (const locale of locales) {
      assert.match(item.slug[locale], SLUG, `${item.id} ${locale}`);
      assert.equal(findCase(locale, item.slug[locale])?.id, item.id);
      assert.ok(item.meta.title[locale].length <= 60, `${item.id} ${locale} title`);
      assert.ok(item.meta.description[locale].length >= 110 && item.meta.description[locale].length <= 155, `${item.id} ${locale} description`);
    }
    assert.equal(entryPath("/portafolio/[slug]", item.slug, "es"), `/portafolio/${item.slug.es}`);
    assert.equal(entryPath("/portafolio/[slug]", item.slug, "en"), `/en/work/${item.slug.en}`);
    if (shownCases.length > 1) assert.notEqual(nextCase(item)?.id, item.id);
  }
  // Titles and descriptions are unique across the whole site.
  const pages = appPathnames.filter(isBuilt).map(getPageMeta);
  for (const field of ["title", "description"] as const) {
    const values = [...pages, ...shownCases.map((item) => item.meta)].flatMap((meta) => locales.map((locale) => meta[field][locale]));
    assert.equal(new Set(values).size, values.length, `duplicated ${field}`);
  }
});

test("entries: ES / EN of an entry lead to the same case in the other language, and a slug cannot repeat", () => {
  const cases = [shown("uno", ["desarrollo"])];
  const links = entryLinks(cases, [], closedSite);
  assert.deepEqual(links["es/uno"], { es: "/portafolio/uno", en: "/en/work/uno-en" });
  assert.deepEqual(links["en/uno-en"], links["es/uno"]);
  const [entry] = builtEntries(cases, []);
  assert.ok(entry);
  assert.deepEqual(pathsOfEntry(entry), { es: "/portafolio/uno", en: "/en/work/uno-en" });
  assert.throws(() => builtEntries([shown("uno", ["video"]), shown("uno", ["discord"])], []), /share a slug/);
  // A slug with an accent, a capital or a space would reach the page encoded and match nothing.
  for (const slug of ["guía", "Caso", "dos palabras", "-inicio", "fin-", "doble--guion"]) {
    const broken = { ...shown("uno", ["video"]), slug: { es: slug, en: "ok" } };
    assert.throws(() => builtEntries([broken], []), /lowercase letters, digits and hyphens/, slug);
  }
});

test("the next project goes round the published cases and skips private ones", () => {
  const cases = [shown("a", ["video"]), privateCase, shown("b", ["video"])];
  const [a, b] = visibleCases(cases);
  assert.ok(a && b);
  assert.equal(nextCase(a, cases)?.id, "b");
  assert.equal(nextCase(b, cases)?.id, "a");
  assert.equal(nextCase(a, [cases[0] as PortfolioCase]), undefined);
});
