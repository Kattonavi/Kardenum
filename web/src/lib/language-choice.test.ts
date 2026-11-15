import assert from "node:assert/strict";
import { test } from "node:test";
import vm from "node:vm";
import { LANGUAGE_COOKIE, LANGUAGE_OFFER_ATTRIBUTE, languageOfferScript } from "@/lib/language-choice";

/** Runs the real inline script against a fake page and reports whether the bar is offered. */
function offered(page: { lang: string; cookie?: string; browser?: string | undefined }): boolean {
  const attributes = new Set<string>();
  const context = {
    document: {
      documentElement: { lang: page.lang, setAttribute: (name: string) => attributes.add(name) },
      cookie: page.cookie ?? "",
    },
    navigator: { language: page.browser },
  };
  vm.runInNewContext(languageOfferScript, context);
  return attributes.has(LANGUAGE_OFFER_ATTRIBUTE);
}

const cookie = (value: string) => `otra=1; ${LANGUAGE_COOKIE}=${value}; theme=x`;

test("RF-1: a Spanish page offers English to a browser in another language", () => {
  assert.equal(offered({ lang: "es", browser: "en-US" }), true);
  assert.equal(offered({ lang: "es", browser: "fr-FR" }), true);
  assert.equal(offered({ lang: "es", browser: "pt" }), true);
});

test("RF-2: a Spanish page offers nothing to a Spanish browser", () => {
  assert.equal(offered({ lang: "es", browser: "es-CO" }), false);
  assert.equal(offered({ lang: "es", browser: "es" }), false);
  assert.equal(offered({ lang: "es", browser: "ES-419" }), false);
});

test("RF-3: an English page offers Spanish only to a Spanish browser", () => {
  assert.equal(offered({ lang: "en", browser: "es-MX" }), true);
  assert.equal(offered({ lang: "en", browser: "en-GB" }), false);
  assert.equal(offered({ lang: "en", browser: "de-DE" }), false);
});

test("RF-4: after dismissing the bar it is not offered again on that language", () => {
  assert.equal(offered({ lang: "es", browser: "en-US", cookie: cookie("es") }), false);
  assert.equal(offered({ lang: "en", browser: "es-CO", cookie: cookie("en") }), false);
});

test("RF-5: the remembered choice wins over the browser language", () => {
  assert.equal(offered({ lang: "es", browser: "es-CO", cookie: cookie("en") }), true);
  assert.equal(offered({ lang: "en", browser: "en-US", cookie: cookie("es") }), true);
  assert.equal(offered({ lang: "en", browser: "es-CO", cookie: `${LANGUAGE_COOKIE}=en` }), false);
});

test("RF-6: a browser that is not Spanish but starts with the same letters is not Spanish", () => {
  // "est" is Estonian (ISO 639-2); only "es" or "es-XX" count as Spanish.
  assert.equal(offered({ lang: "es", browser: "est" }), true);
});

test("RF-7: an unknown browser language or a foreign cookie value never breaks the page", () => {
  assert.equal(offered({ lang: "es", browser: undefined }), true);
  assert.equal(offered({ lang: "en", browser: undefined }), false);
  assert.equal(offered({ lang: "es", browser: "es-CO", cookie: `${LANGUAGE_COOKIE}=fr` }), false);
  assert.doesNotThrow(() => vm.runInNewContext(languageOfferScript, {}));
});

test("the script cannot close its own <script> tag", () => {
  assert.doesNotMatch(languageOfferScript, /<\/script/i);
});
