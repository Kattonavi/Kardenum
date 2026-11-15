import assert from "node:assert/strict";
import { test } from "node:test";
import { getAnalytics } from "@/lib/analytics";
import { contentSecurityPolicy } from "@/lib/security-headers";

const configured = { NODE_ENV: "production", UMAMI_SRC: "https://analytics.example.com/script.js", UMAMI_WEBSITE_ID: "0f8fad5b-d9cb-469f-a165-70867728950e" };

/** The policy as { directive: sources }. */
function parse(policy: string): Record<string, string[]> {
  return Object.fromEntries(
    policy.split(";").map((part) => {
      const [directive = "", ...sources] = part.trim().split(/\s+/);
      return [directive, sources];
    }),
  );
}

test("analytics loads only when both variables exist", () => {
  assert.equal(getAnalytics({}), null);
  assert.equal(getAnalytics({ UMAMI_SRC: configured.UMAMI_SRC }), null);
  assert.equal(getAnalytics({ UMAMI_WEBSITE_ID: configured.UMAMI_WEBSITE_ID }), null);
  assert.equal(getAnalytics({ UMAMI_SRC: "  ", UMAMI_WEBSITE_ID: configured.UMAMI_WEBSITE_ID }), null);
  assert.deepEqual(getAnalytics(configured), {
    src: "https://analytics.example.com/script.js",
    websiteId: "0f8fad5b-d9cb-469f-a165-70867728950e",
    origin: "https://analytics.example.com",
  });
});

test("a script address that is not https, or an id that is not an id, stops the build", () => {
  for (const src of ["http://analytics.example.com/script.js", "//analytics.example.com/script.js", "script.js", "javascript:alert(1)"]) {
    assert.throws(() => getAnalytics({ ...configured, UMAMI_SRC: src }), /UMAMI_SRC/, src);
  }
  for (const id of ['abc" onload="x', "a b", "<script>", "x".repeat(65)]) {
    assert.throws(() => getAnalytics({ ...configured, UMAMI_WEBSITE_ID: id }), /UMAMI_WEBSITE_ID/, id);
  }
});

test("the content policy allows the analytics origin for scripts and connections, and only there", () => {
  const without = parse(contentSecurityPolicy({ NODE_ENV: "production" }));
  const withAnalytics = parse(contentSecurityPolicy(configured));
  assert.deepEqual(withAnalytics["script-src"], [...(without["script-src"] ?? []), "https://analytics.example.com"]);
  assert.deepEqual(withAnalytics["connect-src"], [...(without["connect-src"] ?? []), "https://analytics.example.com"]);
  for (const directive of Object.keys(without)) {
    if (directive !== "script-src" && directive !== "connect-src") assert.deepEqual(withAnalytics[directive], without[directive], directive);
  }
  // Without the variables nothing but the site itself is allowed anywhere.
  assert.doesNotMatch(contentSecurityPolicy({ NODE_ENV: "production" }), /https?:/);
  assert.doesNotMatch(contentSecurityPolicy({ NODE_ENV: "production", UMAMI_SRC: configured.UMAMI_SRC }), /https?:/);
});
