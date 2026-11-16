import assert from "node:assert/strict";
import { test } from "node:test";
import { assertLaunchReady, findPending, findUnfilled, getLaunchBlockers } from "@/lib/launch";
import { portfolioCases } from "@/content/cases";
import type { PortfolioCase, ShownCase } from "@/content/types";
import { casePendingKeys, visibleCases } from "@/lib/portfolio";
import { type SiteConfig, siteConfig } from "@/site.config";

/** The same configuration with every pending value filled in: what the launch needs. */
function fillPending(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(fillPending);
  if (!value || typeof value !== "object") return value;
  if ("status" in value && value.status === "pending") return { status: "ready", value: "x" };
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, fillPending(child)]));
}

// A fixture built from the real configuration; the cast is only for the test.
// The contact and legal data, all ready. The portfolio is off here whatever the real flag says:
// its own readiness has its own tests below, and opening it must not change what these ones check.
const filledConfig = fillPending(siteConfig) as SiteConfig;
const readyConfig: SiteConfig = { ...filledConfig, features: { ...filledConfig.features, portfolio: false } };

/** `readyConfig` with one value put back to pending, by its path. */
function withPending(path: string): SiteConfig {
  const config = structuredClone(readyConfig) as unknown as Record<string, unknown>;
  const keys = path.split(".");
  let node = config;
  for (const key of keys.slice(0, -1)) node = node[key] as Record<string, unknown>;
  const last = keys.at(-1);
  assert.ok(last && last in node, `unknown path in the fixture: ${path}`);
  node[last] = { status: "pending", placeholder: "[pendiente]" };
  return config as unknown as SiteConfig;
}

const RAILWAY = "https://web-production-f1d7c246.up.railway.app";
const open = { SITE_INDEXABLE: "true" };
const closed = { SITE_INDEXABLE: "false" };

test("the fixture is the real configuration with nothing pending", () => {
  assert.deepEqual(findPending(readyConfig), []);
  assert.deepEqual(getLaunchBlockers(readyConfig, {}), []);
});

test("every pending value of the real configuration is found, wherever it is", () => {
  // Counted in an independent way: the walk cannot skip a branch without this noticing.
  const written = (JSON.stringify(siteConfig).match(/"status":"pending"/g) ?? []).length;
  const found = findPending(siteConfig);
  assert.equal(found.length, written);
  assert.equal(new Set(found).size, found.length);
  assert.equal(getLaunchBlockers(siteConfig, {}).length, written);
});

test("pending contact data is reported as a launch blocker", () => {
  assert.deepEqual(getLaunchBlockers(withPending("contact.email"), {}), ["site.config.ts contact.email is still pending"]);
});

test("pending legal data, dates and texts are reported as launch blockers", () => {
  for (const path of [
    "legal.owner.name",
    "legal.owner.identification",
    "legal.owner.address",
    "legal.owner.email",
    "legal.owner.phone",
    "legal.privacy.effectiveDate",
    "legal.privacy.updatedDate",
    "legal.privacy.intro",
    "legal.privacy.sections.rights",
    "legal.terms.effectiveDate",
    "legal.terms.intro",
    "legal.terms.sections.law",
  ]) {
    assert.deepEqual(getLaunchBlockers(withPending(path), {}), [`site.config.ts ${path} is still pending`]);
  }
});

test("an indexable build fails while contact or legal data is pending, naming each one", () => {
  assert.throws(() => assertLaunchReady(open, withPending("contact.whatsapp")), /contact\.whatsapp/);
  assert.throws(() => assertLaunchReady(open, withPending("contact.discordInvite")), /contact\.discordInvite/);
  assert.throws(() => assertLaunchReady(open, withPending("legal.owner.name")), /legal\.owner\.name is still pending/);
  assert.throws(() => assertLaunchReady(open, withPending("legal.terms.sections.liability")), /legal\.terms\.sections\.liability/);
  // The real configuration, as it is today or once it is complete.
  const pending = findPending(siteConfig);
  if (pending.length > 0) {
    assert.throws(
      () => assertLaunchReady(open, siteConfig),
      (error: Error) => pending.every((path) => error.message.includes(`${path} is still pending`)),
    );
  }
});

test("an indexable build fails unless SITE_URL is the production domain", () => {
  assert.throws(() => assertLaunchReady({ ...open, SITE_URL: RAILWAY }, readyConfig), /SITE_URL is https:\/\/web-production-f1d7c246\.up\.railway\.app and must be https:\/\/kardenum\.com/);
  assert.throws(() => assertLaunchReady({ ...open, SITE_URL: "https://www.kardenum.com" }, readyConfig), /SITE_URL/);
  assert.throws(() => assertLaunchReady({ ...open, SITE_URL: "http://kardenum.com" }, readyConfig), /SITE_URL/);
});

test("an indexable build passes with every value ready and the production domain", () => {
  assert.doesNotThrow(() => assertLaunchReady(open, readyConfig));
  assert.doesNotThrow(() => assertLaunchReady({ ...open, SITE_URL: "https://kardenum.com" }, readyConfig));
  assert.doesNotThrow(() => assertLaunchReady({ ...open, SITE_URL: "https://kardenum.com/" }, readyConfig));
});

test("a noindex build never fails for pending data or a temporary SITE_URL", () => {
  assert.doesNotThrow(() => assertLaunchReady(closed, siteConfig));
  assert.doesNotThrow(() => assertLaunchReady({}, withPending("legal.privacy.intro")));
  assert.doesNotThrow(() => assertLaunchReady({ ...closed, SITE_URL: RAILWAY }, withPending("contact.email")));
});

test("SITE_LAUNCH_CHECK=off skips the check (local verification only)", () => {
  assert.doesNotThrow(() => assertLaunchReady({ SITE_INDEXABLE: "true", SITE_LAUNCH_CHECK: "off" }, withPending("contact.email")));
  assert.doesNotThrow(() => assertLaunchReady({ SITE_INDEXABLE: "true", SITE_LAUNCH_CHECK: "off" }, siteConfig));
  // Only the exact value "off" skips it.
  assert.throws(() => assertLaunchReady({ SITE_INDEXABLE: "true", SITE_LAUNCH_CHECK: "false" }, withPending("contact.email")), /contact\.email/);
});

/** `readyConfig` with one value replaced, by its path. */
function withValue(path: string, value: unknown): SiteConfig {
  const config = structuredClone(readyConfig) as unknown as Record<string, unknown>;
  const keys = path.split(".");
  let node = config;
  for (const key of keys.slice(0, -1)) node = node[key] as Record<string, unknown>;
  const last = keys.at(-1);
  assert.ok(last && last in node, `unknown path in the fixture: ${path}`);
  node[last] = value;
  return config as unknown as SiteConfig;
}

test("a value marked ready that says nothing still blocks the launch", () => {
  const holes: [string, unknown][] = [
    ["legal.owner.phone", { status: "ready", value: "" }],
    ["legal.owner.name", { status: "ready", value: "   " }],
    ["legal.owner.address", { status: "ready", value: "[ciudad y dirección]" }],
    ["contact.email", { status: "ready", value: "[correo@kardenum.com]" }],
    ["legal.privacy.intro", { status: "ready", value: { es: ["Aplica a quien nos escribe."], en: [] } }],
    ["legal.terms.sections.law", { status: "ready", value: { es: ["Ley aplicable.", " "], en: ["Governing law."] } }],
    ["legal.privacy.sections.data", { status: "ready", value: { es: ["[Los datos que llegan…]"], en: ["The data that arrives."] } }],
  ];
  for (const [path, value] of holes) {
    const config = withValue(path, value);
    assert.deepEqual(findUnfilled(config), [path]);
    assert.throws(() => assertLaunchReady(open, config), new RegExp(`${path.replaceAll(".", "\.")} is marked ready but is empty`));
  }
  // Real values pass: text with brackets inside it is not a note left behind.
  const real = withValue("legal.privacy.intro", { status: "ready", value: { es: ["Esta política [versión 1] aplica a todos."], en: ["This policy applies to everyone."] } });
  assert.deepEqual(findUnfilled(real), []);
  assert.doesNotThrow(() => assertLaunchReady(open, real));
});

test("SITE_LAUNCH_CHECK=off cannot skip the check on Railway or in CI", () => {
  const skipped = { SITE_INDEXABLE: "true", SITE_LAUNCH_CHECK: "off" };
  assert.throws(() => assertLaunchReady({ ...skipped, RAILWAY_ENVIRONMENT_NAME: "production" }, siteConfig), /local verification only and RAILWAY_ENVIRONMENT_NAME is set/);
  assert.throws(() => assertLaunchReady({ ...skipped, RAILWAY_SERVICE_ID: "x" }, readyConfig), /local verification only/);
  assert.throws(() => assertLaunchReady({ ...skipped, CI: "true" }, readyConfig), /local verification only and CI is set/);
  // GitHub Actions builds the open site to measure it and deploys nothing: the switch works there...
  assert.doesNotThrow(() => assertLaunchReady({ ...skipped, CI: "true", GITHUB_ACTIONS: "true" }, siteConfig));
  // ...but never where Railway builds, whatever else is set.
  assert.throws(() => assertLaunchReady({ ...skipped, CI: "true", GITHUB_ACTIONS: "true", RAILWAY_ENVIRONMENT_NAME: "production" }, siteConfig), /RAILWAY_ENVIRONMENT_NAME is set/);
  // A closed site never fails, wherever it is built and whatever the switch says.
  assert.doesNotThrow(() => assertLaunchReady({ SITE_INDEXABLE: "false", SITE_LAUNCH_CHECK: "off", RAILWAY_ENVIRONMENT_NAME: "production" }, siteConfig));
});

// docs/specs/005-portafolio-y-casos.md, RF-7: the pending data of the cases only counts with the portfolio on.
const portfolioOn = (config: SiteConfig): SiteConfig => ({ ...config, features: { ...config.features, portfolio: true } });
const portfolioOff = (config: SiteConfig): SiteConfig => ({ ...config, features: { ...config.features, portfolio: false } });

/** The real cases with every pending value replaced by a ready one: what the launch with the portfolio needs. */
const readyCases: PortfolioCase[] = visibleCases(portfolioCases).map(
  (item): ShownCase => ({
    ...item,
    year: 2026,
    cover: { kind: "mark", alt: { es: "Logo", en: "Logo" } },
    hero: { kind: "mark", alt: { es: "Logo", en: "Logo" } },
    challenge: { es: "Reto.", en: "Challenge." },
    work: [{ es: "Algo.", en: "Something." }],
    result: { es: "Resultado.", en: "Result." },
    pieces: item.pieces.filter((piece) => piece.kind !== "pending"),
  }),
);

test("with the portfolio on, an indexable build fails while a published case has pending data, naming each one", () => {
  const pending = visibleCases(portfolioCases).flatMap(casePendingKeys);
  if (pending.length === 0) return;
  assert.throws(
    () => assertLaunchReady(open, portfolioOn(readyConfig), portfolioCases),
    (error: Error) => pending.every((key) => error.message.includes(`site.config.ts portfolio.${key} is still pending`)),
  );
  assert.doesNotThrow(() => assertLaunchReady(open, portfolioOn(readyConfig), readyCases));
});

test("with the portfolio off, the pending data of the cases does not stop the launch", () => {
  assert.doesNotThrow(() => assertLaunchReady(open, portfolioOff(readyConfig), portfolioCases));
  // A closed site never fails for it either, portfolio on or off.
  assert.doesNotThrow(() => assertLaunchReady(closed, portfolioOn(readyConfig), portfolioCases));
  // The data of siteConfig keeps its own count: the cases add nothing to it.
  assert.deepEqual(getLaunchBlockers(portfolioOn(readyConfig), {}), []);
});
