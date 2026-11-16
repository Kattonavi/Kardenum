import assert from "node:assert/strict";
import { test } from "node:test";
import { portfolioCases } from "@/content/cases";
import { subpages } from "@/content/subpages";
import type { GuideContent, PortfolioCase, ServiceLineId } from "@/content/types";
import { builtEntries, entryNotices } from "@/lib/entries";
import { isMinecraftPage, linesOfPage, noticesOf, noticesOnScreen } from "@/lib/notices";
import { appPathnames } from "@/routes";

// docs/specs/008-aviso-de-minecraft-por-linea.md. The addresses below are written by hand on
// purpose: they are what the founder asked for, not what the rule under test computes.
const closedSite = { SITE_INDEXABLE: "false" };
const openSite = { SITE_INDEXABLE: "true" };
const both = (text: string) => ({ es: text, en: text });
const body = { es: async () => ({ default: () => null }), en: async () => ({ default: () => null }) };

function guide(id: string, line: ServiceLineId): GuideContent {
  return {
    meta: {
      id,
      line,
      service: "/servicios/minecraft/tebex",
      slug: { es: `${id}-es`, en: `${id}-en` },
      shortName: both(`Guía ${id}`),
      title: both(`Título ${id}`),
      summary: both(`Resumen ${id}.`),
      publishedAt: "2026-11-01",
      updatedAt: "2026-11-10",
      readingMinutes: 5,
      sections: [both("Antes de empezar"), both("Siguientes pasos")],
      meta: { title: both(`Meta ${id}`), description: both(`Descripción ${id}`) },
    },
    body,
  };
}

function publishedCase(id: string, lines: readonly ServiceLineId[]): PortfolioCase {
  return {
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
    visibilidad: "publico",
    client: { kind: "own" },
  };
}

const pagesWith = (notice: "minecraft" | "discord") => appPathnames.filter((pathname) => noticesOf(linesOfPage(pathname)).includes(notice)).sort();

test("RF-1, RF-2: of the fixed pages, the Minecraft notice goes on the Minecraft line and its three sub-pages, and on no other", () => {
  assert.deepEqual(pagesWith("minecraft"), ["/servicios/minecraft", "/servicios/minecraft/plugins", "/servicios/minecraft/servidores", "/servicios/minecraft/tebex"]);
  // Named one by one: the pages that carried it while it was in the footer of the whole site.
  for (const pathname of ["/", "/servicios", "/servicios/desarrollo", "/servicios/discord", "/servicios/discord/bots", "/nosotros", "/contacto", "/portafolio", "/guias", "/legal/privacidad", "/legal/terminos"]) {
    assert.deepEqual(noticesOf(linesOfPage(pathname)).includes("minecraft"), false, pathname);
  }
});

test("RF-6: the Discord notice goes on the Discord line and its sub-page, and on no other", () => {
  assert.deepEqual(pagesWith("discord"), ["/servicios/discord", "/servicios/discord/bots"]);
});

test("RF-3: the line of a sub-page is the same in the two places that name it", () => {
  // src/content/subpages says the line of each sub-page; src/content/service-lines.ts lists the sub-pages of each line.
  for (const page of Object.values(subpages)) assert.deepEqual(linesOfPage(page.pathname), [page.line], page.pathname);
});

test("RF-1, RF-2: of the cases, Kaelion (Minecraft) carries the notice and Kardenum does not", () => {
  const notices = Object.fromEntries(builtEntries().map((entry) => [entry.id, noticesOf(entry.lines)]));
  assert.deepEqual(notices.kaelion, ["minecraft"]);
  assert.deepEqual(notices.kardenum, []);
  // The entries carry the lines of their case, not a copy that could drift.
  for (const item of portfolioCases) {
    if (item.visibilidad !== "privado") assert.deepEqual(builtEntries().find((entry) => entry.id === item.id)?.lines, item.lines);
  }
});

test("RF-3: a guide follows its line and a case any of its lines", () => {
  const cases = [publishedCase("tienda", ["desarrollo"]), publishedCase("servidor", ["diseno", "minecraft"]), publishedCase("comunidad", ["discord", "minecraft"])];
  const guides = [guide("tebex", "minecraft"), guide("bot", "discord"), guide("sitio", "desarrollo")];
  assert.deepEqual(entryNotices(closedSite, cases, guides), {
    "es/servidor": ["minecraft"],
    "en/servidor-en": ["minecraft"],
    "es/comunidad": ["minecraft", "discord"],
    "en/comunidad-en": ["minecraft", "discord"],
    "es/tebex-es": ["minecraft"],
    "en/tebex-en": ["minecraft"],
    "es/bot-es": ["discord"],
    "en/bot-en": ["discord"],
  });
});

test("the footer only learns of the entries this build generates", () => {
  // Portfolio and guides are off: on the open site their entries have no page, so nothing about them goes to the browser.
  assert.deepEqual(entryNotices(openSite), {});
  assert.deepEqual(entryNotices(closedSite), { "es/kaelion": ["minecraft"], "en/kaelion": ["minecraft"] });
  // A private case never has an entry, whatever its lines.
  const secret: PortfolioCase = { visibilidad: "privado", id: "secreto", lines: ["minecraft"], year: 2026 };
  assert.deepEqual(entryNotices(closedSite, [secret], []), {});
});

test("RF-4: the footer shows the notices of the page on screen: the entry when there is one, the fixed page otherwise", () => {
  const entries = entryNotices(closedSite);
  assert.deepEqual(noticesOnScreen("/servicios/minecraft", { locale: "es" }, entries), ["minecraft"]);
  assert.deepEqual(noticesOnScreen("/servicios/minecraft/plugins", { locale: "en" }, entries), ["minecraft"]);
  assert.deepEqual(noticesOnScreen("/servicios/discord/bots", { locale: "es" }, entries), ["discord"]);
  assert.deepEqual(noticesOnScreen("/", { locale: "es" }, entries), []);
  assert.deepEqual(noticesOnScreen("/portafolio", { locale: "es" }, entries), []);
  assert.deepEqual(noticesOnScreen("/portafolio/[slug]", { locale: "es", slug: "kaelion" }, entries), ["minecraft"]);
  assert.deepEqual(noticesOnScreen("/portafolio/[slug]", { locale: "en", slug: "kaelion" }, entries), ["minecraft"]);
  assert.deepEqual(noticesOnScreen("/portafolio/[slug]", { locale: "es", slug: "kardenum" }, entries), []);
  // An address that only looks like the line, and no parameters at all (the 404).
  assert.deepEqual(noticesOnScreen("/servicios/minecraft-y-mas", { locale: "es" }, entries), []);
  assert.deepEqual(noticesOnScreen("/servicios/minecraft/otra", null, entries), []);
});

test("RF-5: a page is about Minecraft when Minecraft is one of its lines", () => {
  assert.equal(isMinecraftPage(["minecraft"]), true);
  assert.equal(isMinecraftPage(["diseno", "minecraft"]), true);
  assert.equal(isMinecraftPage(["discord"]), false);
  assert.equal(isMinecraftPage([]), false);
});
