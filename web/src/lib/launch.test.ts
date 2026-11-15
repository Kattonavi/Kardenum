import assert from "node:assert/strict";
import { test } from "node:test";
import { assertLaunchReady, getLaunchBlockers } from "@/lib/launch";
import { type SiteConfig, siteConfig } from "@/site.config";

const readyConfig: SiteConfig = {
  ...siteConfig,
  contact: {
    email: { status: "ready", value: "hola@example.com" },
    whatsapp: { status: "ready", value: "10000000000" },
    discordInvite: { status: "ready", value: "https://discord.gg/example" },
  },
};
const withPending = (key: keyof SiteConfig["contact"]): SiteConfig => ({
  ...readyConfig,
  contact: { ...readyConfig.contact, [key]: { status: "pending", placeholder: "[pendiente]" } },
});

const RAILWAY = "https://web-production-f1d7c246.up.railway.app";
const open = { SITE_INDEXABLE: "true" };
const closed = { SITE_INDEXABLE: "false" };

test("pending contact data is reported as a launch blocker", () => {
  assert.deepEqual(getLaunchBlockers(withPending("email"), {}), ["site.config.ts contact.email is still pending"]);
  assert.deepEqual(getLaunchBlockers(readyConfig, {}), []);
});

test("an indexable build fails while contact data is pending", () => {
  assert.throws(() => assertLaunchReady(open, withPending("whatsapp")), /contact\.whatsapp/);
  assert.throws(() => assertLaunchReady(open, withPending("discordInvite")), /contact\.discordInvite/);
});

test("an indexable build fails unless SITE_URL is the production domain", () => {
  assert.throws(() => assertLaunchReady({ ...open, SITE_URL: RAILWAY }, readyConfig), /SITE_URL is https:\/\/web-production-f1d7c246\.up\.railway\.app and must be https:\/\/kardenum\.com/);
  assert.throws(() => assertLaunchReady({ ...open, SITE_URL: "https://www.kardenum.com" }, readyConfig), /SITE_URL/);
  assert.throws(() => assertLaunchReady({ ...open, SITE_URL: "http://kardenum.com" }, readyConfig), /SITE_URL/);
});

test("an indexable build passes with every contact value ready and the production domain", () => {
  assert.doesNotThrow(() => assertLaunchReady(open, readyConfig));
  assert.doesNotThrow(() => assertLaunchReady({ ...open, SITE_URL: "https://kardenum.com" }, readyConfig));
  assert.doesNotThrow(() => assertLaunchReady({ ...open, SITE_URL: "https://kardenum.com/" }, readyConfig));
});

test("a noindex build never fails for pending data or a temporary SITE_URL", () => {
  assert.doesNotThrow(() => assertLaunchReady(closed, withPending("whatsapp")));
  assert.doesNotThrow(() => assertLaunchReady({}, withPending("whatsapp")));
  assert.doesNotThrow(() => assertLaunchReady({ ...closed, SITE_URL: RAILWAY }, withPending("email")));
});

test("SITE_LAUNCH_CHECK=off skips the check (local verification only)", () => {
  assert.doesNotThrow(() => assertLaunchReady({ SITE_INDEXABLE: "true", SITE_LAUNCH_CHECK: "off" }, withPending("email")));
  // Only the exact value "off" skips it.
  assert.throws(() => assertLaunchReady({ SITE_INDEXABLE: "true", SITE_LAUNCH_CHECK: "false" }, withPending("email")), /contact\.email/);
});
