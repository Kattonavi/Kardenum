import assert from "node:assert/strict";
import { test } from "node:test";
import { getChannelHref, getWrittenEmail } from "@/lib/contact";
import { type SiteConfig, siteConfig } from "@/site.config";

// docs/specs/008-aviso-de-minecraft-por-linea.md, RF-5: the e-mail written out in the closing of
// the pages about Minecraft.
const withEmail = (email: SiteConfig["contact"]["email"]): SiteConfig => ({ ...siteConfig, contact: { ...siteConfig.contact, email } });

test("RF-5: while the address does not exist, its bracketed note is written and nothing is linked", () => {
  const pending = withEmail({ status: "pending", placeholder: "[correo]" });
  assert.deepEqual(getWrittenEmail(pending), { text: "[correo]", href: null });
  assert.equal(getChannelHref("email", pending), null);
});

test("RF-5: once the address exists, it is written as it is and links to it", () => {
  const ready = withEmail({ status: "ready", value: "estudio@example.com" });
  assert.deepEqual(getWrittenEmail(ready), { text: "estudio@example.com", href: "mailto:estudio@example.com" });
});
