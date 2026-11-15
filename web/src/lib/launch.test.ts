import assert from "node:assert/strict";
import { test } from "node:test";
import { assertLaunchReady, findPending, getLaunchBlockers } from "@/lib/launch";
import { type SiteConfig, siteConfig } from "@/site.config";

/** The same configuration with every pending value filled in: what the launch needs. */
function fillPending(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(fillPending);
  if (!value || typeof value !== "object") return value;
  if ("status" in value && value.status === "pending") return { status: "ready", value: "x" };
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, fillPending(child)]));
}

// A fixture built from the real configuration; the cast is only for the test.
const readyConfig = fillPending(siteConfig) as SiteConfig;

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
