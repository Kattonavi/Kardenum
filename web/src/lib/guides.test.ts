import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { guides } from "@/content/guides";
import type { GuideContent, GuideMeta, ServiceLineId } from "@/content/types";
import { getPageMeta } from "@/content/pages";
import { locales } from "@/i18n/locales";
import { builtEntries, entryLinks } from "@/lib/entries";
import { assertGuidesReady, findGuide, formatGuideDate, guideProblems, isIsoDate, relatedGuides, sortedGuides } from "@/lib/guides";
import { appPathnames, entryPath, isBuilt } from "@/routes";
import { type SiteConfig, siteConfig } from "@/site.config";

// docs/specs/006-guias.md, RF-7 and the coherence of meta.ts. The guides below are built here:
// the registry is not touched (today it is empty).
delete process.env.SITE_URL;

const both = (text: string) => ({ es: text, en: text });
const body = { es: async () => ({ default: () => null }), en: async () => ({ default: () => null }) };

function guide(id: string, overrides: Partial<GuideMeta> = {}, line: ServiceLineId = "minecraft"): GuideContent {
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
      ...overrides,
    },
    body,
  };
}

const withGuides = (on: boolean): SiteConfig => ({ ...siteConfig, features: { ...siteConfig.features, guides: on } });

test("RF-7: with the guides on and none written, the build fails; off, it does not", () => {
  assert.throws(() => assertGuidesReady(withGuides(true), []), /features\.guides is on but there is no guide/);
  assert.doesNotThrow(() => assertGuidesReady(withGuides(false), []));
  assert.doesNotThrow(() => assertGuidesReady(withGuides(true), [guide("una")]));
});

test("RF-7: a guide without one of its languages fails the build, named", () => {
  const missingText = guide("sin-ingles", { title: { es: "Título", en: " " } });
  assert.deepEqual(guideProblems(missingText), ["title is missing in en"]);
  assert.throws(() => assertGuidesReady(withGuides(false), [missingText]), /guide sin-ingles: title is missing in en/);

  const missingBody = { ...guide("sin-cuerpo"), body: { es: body.es } } as unknown as GuideContent;
  assert.throws(() => assertGuidesReady(withGuides(false), [missingBody]), /guide sin-cuerpo: the body is missing in en/);

  const missingSection = guide("sin-seccion", { sections: [both("Antes de empezar"), { es: "Siguientes pasos", en: "" }] });
  assert.throws(() => assertGuidesReady(withGuides(false), [missingSection]), /guide sin-seccion: sections\[1\] is missing in en/);
});

test("RF-7: dates must be real, written as YYYY-MM-DD, and the update cannot come before the publication", () => {
  for (const wrong of ["2026-02-31", "2026-13-01", "15/11/2026", "2026-11-1", ""]) {
    assert.equal(isIsoDate(wrong), false, wrong);
    assert.throws(() => assertGuidesReady(withGuides(false), [guide("fecha", { publishedAt: wrong })]), /guide fecha: publishedAt .* is not a date/);
  }
  assert.throws(() => assertGuidesReady(withGuides(false), [guide("orden", { publishedAt: "2026-11-10", updatedAt: "2026-11-01" })]), /guide orden: updatedAt 2026-11-01 is before publishedAt 2026-11-10/);
  assert.deepEqual(guideProblems(guide("mismo-dia", { publishedAt: "2026-11-10", updatedAt: "2026-11-10" })), []);
  assert.equal(formatGuideDate("2026-11-15", "es"), "15 de noviembre de 2026");
  assert.equal(formatGuideDate("2026-11-15", "en"), "November 15, 2026");
});

test("meta.ts: sections, reading time, related service and ids must make sense", () => {
  assert.match(guideProblems(guide("una-seccion", { sections: [both("Antes de empezar")] })).join(), /at least two sections/);
  assert.match(guideProblems(guide("minutos", { readingMinutes: 0 })).join(), /readingMinutes/);
  assert.match(guideProblems(guide("minutos", { readingMinutes: 2.5 })).join(), /readingMinutes/);
  assert.match(guideProblems(guide("servicio", { service: "/portafolio/no" as never })).join(), /is not a page of the site/);
  assert.throws(() => assertGuidesReady(withGuides(false), [guide("doble"), guide("doble")]), /guide doble is listed twice/);
});

test("guides: newest first, related ones of the same line first, each with its address in each language", () => {
  const older = guide("vieja", { publishedAt: "2026-10-01", updatedAt: "2026-10-01" });
  const newer = guide("nueva", { publishedAt: "2026-11-05", updatedAt: "2026-11-05" });
  const otherLine = guide("otra", { publishedAt: "2026-11-20", updatedAt: "2026-11-20" }, "desarrollo");
  const list = [older, newer, otherLine];
  assert.deepEqual(sortedGuides(list).map((item) => item.meta.id), ["otra", "nueva", "vieja"]);
  assert.deepEqual(relatedGuides(older.meta, list).map((item) => item.id), ["nueva", "otra"]);
  assert.deepEqual(relatedGuides(older.meta, [older]), []);
  assert.equal(findGuide("en", "nueva-en", list)?.meta.id, "nueva");
  assert.equal(findGuide("es", "nueva-en", list), undefined);

  const links = entryLinks([], list);
  assert.deepEqual(links["es/nueva-es"], { es: "/guias/nueva-es", en: "/en/guides/nueva-en" });
  assert.deepEqual(links["en/nueva-en"], links["es/nueva-es"]);
  assert.equal(entryPath("/guias/[slug]", newer.meta.slug, "en"), "/en/guides/nueva-en");
  assert.deepEqual(builtEntries([], list).map((entry) => [entry.collection, entry.id]), [
    ["/guias/[slug]", "otra"],
    ["/guias/[slug]", "nueva"],
    ["/guias/[slug]", "vieja"],
  ]);
});

test("the registry: every guide is complete, has both bodies on disk and its own texts", () => {
  assert.doesNotThrow(() => assertGuidesReady(siteConfig, guides));
  const guidesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "guides");
  const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const pageTexts = appPathnames.filter(isBuilt).map(getPageMeta);
  for (const { meta } of guides) {
    for (const locale of locales) {
      const file = path.join(guidesDir, meta.id, `${locale}.mdx`);
      assert.ok(existsSync(file), `${meta.id}: ${locale}.mdx`);
      // Each section of meta.ts is marked in the body, once, in order.
      const marks = [...readFileSync(file, "utf8").matchAll(/<Section n=\{(\d+)\}/g)].map((match) => Number(match[1]));
      assert.deepEqual(marks, meta.sections.map((_, index) => index), `${meta.id} ${locale}: <Section n={…}> marks`);
      assert.match(meta.slug[locale], SLUG, `${meta.id} ${locale} slug`);
      assert.ok(meta.meta.title[locale].length <= 60, `${meta.id} ${locale} title`);
      assert.ok(meta.meta.description[locale].length >= 110 && meta.meta.description[locale].length <= 155, `${meta.id} ${locale} description`);
    }
  }
  for (const field of ["title", "description"] as const) {
    const values = [...pageTexts, ...guides.map((item) => item.meta.meta)].flatMap((meta) => locales.map((locale) => meta[field][locale]));
    assert.equal(new Set(values).size, values.length, `duplicated ${field}`);
  }
});

// An .mdx file is compiled as code: it can import any module, read the build's environment or
// write a <script>. The body of a guide is content only; its data lives in meta.ts.
const FORBIDDEN_IN_A_GUIDE: readonly [RegExp, string][] = [
  [/^\s*import\s/m, "an import"],
  [/^\s*export\s/m, "an export (the data of a guide lives in meta.ts)"],
  [/<\s*script\b/i, "a <script>"],
  [/<\s*iframe\b/i, "an <iframe>"],
  [/<\s*(object|embed|link|style)\b/i, "an <object>, <embed>, <link> or <style>"],
  [/process\s*\.\s*env/, "process.env"],
  [/\bstyle\s*=/, "an inline style (the content policy blocks it)"],
  [/\bon[A-Za-z]+\s*=\s*[{"']/, "an event handler"],
  // A Markdown image or a bare <img> skips the image component: no srcset, no dimensions, no optimizer.
  [/!\[[^\]]*\]\(/, "a Markdown image (use <Screenshot>)"],
  [/<\s*img\b/i, "an <img> (use <Screenshot>)"],
];

/** The one import a guide needs: its own screenshots, from its own folder, already as WebP or AVIF. */
const OWN_IMAGE_IMPORT = /^import\s+[A-Za-z_]\w*\s+from\s+"\.\/[\w.-]+\.(?:webp|avif)";?\s*$/gm;

/**
 * Code shown to the reader is text, not code of the page: a fenced block (``` or ~~~) and inline
 * code never run. A guide about bots must be able to show `import { Client } from "discord.js"`
 * or `process.env.TOKEN` as an example. They are taken out before the rules are applied.
 */
function withoutShownCode(body: string): string {
  return body
    .replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, "")
    .replace(/`[^`\n]+`/g, "");
}

function guideCodeProblems(body: string): string[] {
  const authored = withoutShownCode(body).replace(OWN_IMAGE_IMPORT, "");
  return FORBIDDEN_IN_A_GUIDE.filter(([pattern]) => pattern.test(authored)).map(([, what]) => what);
}

function mdxFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return mdxFiles(full);
    return entry.name.endsWith(".mdx") ? [full] : [];
  });
}

test("the body of a guide is content, never code", () => {
  // The rule catches each construction, and lets ordinary content through.
  assert.deepEqual(guideCodeProblems("Un párrafo con `código`, un [enlace](/contacto) y una tabla.\n\n<Section n={1}>\nTexto\n</Section>\n"), []);
  assert.deepEqual(guideCodeProblems('import fs from "node:fs";\n\nTexto'), ["an import"]);
  // Its own screenshots are the exception; anything else, even an image from another folder, is not.
  assert.deepEqual(guideCodeProblems('import captura from "./captura-del-panel.webp";\n\n<Screenshot src={captura} caption="Panel" />\n'), []);
  assert.deepEqual(guideCodeProblems('import captura from "../otra-guia/captura.webp";\n'), ["an import"]);
  assert.deepEqual(guideCodeProblems('import { readFileSync } from "./captura.webp";\n'), ["an import"]);
  assert.deepEqual(guideCodeProblems('import logo from "./logo.png";\n'), ["an import"]);
  assert.deepEqual(guideCodeProblems("export const meta = {};\n"), ["an export (the data of a guide lives in meta.ts)"]);
  assert.deepEqual(guideCodeProblems("Texto\n<script>alert(1)</script>"), ["a <script>"]);
  assert.deepEqual(guideCodeProblems('<iframe src="https://example.com" />'), ["an <iframe>"]);
  assert.deepEqual(guideCodeProblems("La clave es {process.env.SECRET}"), ["process.env"]);
  assert.deepEqual(guideCodeProblems('<p style="color:red">x</p>'), ["an inline style (the content policy blocks it)"]);
  assert.deepEqual(guideCodeProblems('<button onClick={() => {}}>x</button>'), ["an event handler"]);
  // Code shown as an example is text: a guide can teach with imports, variables and handlers.
  const example = [
    "Así se conecta el bot:",
    "",
    "```js",
    'import { Client } from "discord.js";',
    "const client = new Client({ intents: [] });",
    "client.login(process.env.TOKEN);",
    "```",
    "",
    "~~~html",
    '<button onClick="saludar()" style="color:red">Hola</button>',
    "<script>saludar()</script>",
    "~~~",
    "",
    "La clave vive en `process.env.TOKEN` y nunca en el código; el manejador es `onClick={saludar}`.",
    "",
  ].join("\n");
  assert.deepEqual(guideCodeProblems(example), []);
  // The same constructions outside a block are still code of the page.
  assert.deepEqual(guideCodeProblems(`${example}\n<script>alert(1)</script>\n`), ["a <script>"]);
  assert.deepEqual(guideCodeProblems(`import x from "node:fs";\n\n${example}`), ["an import"]);
  // A block that is opened and never closed hides nothing.
  assert.deepEqual(guideCodeProblems('```js\nconst a = 1;\n\n<script>alert(1)</script>\n'), ["a <script>"]);
  assert.deepEqual(guideCodeProblems("Texto\n\n![El panel](./captura.webp)\n"), ["a Markdown image (use <Screenshot>)"]);
  assert.deepEqual(guideCodeProblems('<img src="/captura.webp" alt="" />'), ["an <img> (use <Screenshot>)"]);

  const guidesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "guides");
  for (const file of mdxFiles(guidesDir)) {
    assert.deepEqual(guideCodeProblems(readFileSync(file, "utf8")), [], `${path.relative(guidesDir, file)} has code in it`);
  }
});
