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

const open = { SITE_INDEXABLE: "true" };
const closed = { SITE_INDEXABLE: "false" };

test("pending contact data is reported as a launch blocker", () => {
  const partial: SiteConfig = { ...readyConfig, contact: { ...readyConfig.contact, email: { status: "pending", placeholder: "[correo]" } } };
  assert.deepEqual(getLaunchBlockers(partial), ["contact.email"]);
  assert.deepEqual(getLaunchBlockers(readyConfig), []);
});

test("an indexable build fails while contact data is pending", () => {
  const partial: SiteConfig = { ...readyConfig, contact: { ...readyConfig.contact, whatsapp: { status: "pending", placeholder: "[WhatsApp]" } } };
  assert.throws(() => assertLaunchReady(open, partial), /contact\.whatsapp/);
});

test("a noindex build never fails for pending data", () => {
  const partial: SiteConfig = { ...readyConfig, contact: { ...readyConfig.contact, whatsapp: { status: "pending", placeholder: "[WhatsApp]" } } };
  assert.doesNotThrow(() => assertLaunchReady(closed, partial));
  assert.doesNotThrow(() => assertLaunchReady({}, partial));
});

test("an indexable build passes once every contact value is ready", () => {
  assert.doesNotThrow(() => assertLaunchReady(open, readyConfig));
});

test("SITE_LAUNCH_CHECK=off skips the check (local verification only)", () => {
  const partial: SiteConfig = { ...readyConfig, contact: { ...readyConfig.contact, email: { status: "pending", placeholder: "[correo]" } } };
  assert.doesNotThrow(() => assertLaunchReady({ SITE_INDEXABLE: "true", SITE_LAUNCH_CHECK: "off" }, partial));
});
