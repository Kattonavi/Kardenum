import assert from "node:assert/strict";
import { test } from "node:test";
import { contentSecurityPolicy, securityHeaders } from "@/lib/security-headers";

const production = { NODE_ENV: "production" };
const header = (name: string) => securityHeaders(production).find((candidate) => candidate.key.toLowerCase() === name)?.value;

/** The policy as { directive: sources }. */
function parse(policy: string): Record<string, string[]> {
  return Object.fromEntries(
    policy.split(";").map((part) => {
      const [directive = "", ...sources] = part.trim().split(/\s+/);
      return [directive, sources];
    }),
  );
}

test("every response is HTTPS only, cannot be sniffed, framed or given device features", () => {
  assert.match(header("strict-transport-security") ?? "", /^max-age=\d+$/);
  assert.ok(Number((header("strict-transport-security") ?? "").split("=")[1]) >= 31536000, "at least one year");
  assert.equal(header("x-content-type-options"), "nosniff");
  assert.equal(header("referrer-policy"), "strict-origin-when-cross-origin");
  assert.equal(header("x-frame-options"), "DENY");
  for (const feature of ["camera", "microphone", "geolocation"]) assert.match(header("permissions-policy") ?? "", new RegExp(`${feature}=\\(\\)`));
});

test("HSTS does not bind subdomains or ask for the preload list until the launch decides it", () => {
  assert.doesNotMatch(header("strict-transport-security") ?? "", /includeSubDomains|preload/i);
});

test("header names are unique and values are single lines", () => {
  const names = securityHeaders(production).map((candidate) => candidate.key.toLowerCase());
  assert.equal(new Set(names).size, names.length);
  for (const candidate of securityHeaders(production)) assert.doesNotMatch(candidate.value, /[\r\n]/, candidate.key);
});

test("the content policy only lets the site load from itself", () => {
  assert.equal(header("content-security-policy"), contentSecurityPolicy(production));
  const policy = parse(contentSecurityPolicy(production));
  assert.deepEqual(policy["default-src"], ["'self'"]);
  assert.deepEqual(policy["object-src"], ["'none'"]);
  assert.deepEqual(policy["frame-ancestors"], ["'none'"]);
  assert.deepEqual(policy["base-uri"], ["'self'"]);
  assert.deepEqual(policy["form-action"], ["'self'"]);
  // No wildcard, no scheme-wide source and no other origin anywhere: a new one (analytics) is added on purpose.
  for (const [directive, sources] of Object.entries(policy)) {
    for (const source of sources) assert.match(source, /^'(self|none|unsafe-inline)'$/, `${directive}: ${source}`);
  }
  // Inline scripts are allowed as blocks, never as handlers in attributes.
  assert.deepEqual(policy["script-src-attr"], ["'none'"]);
});

test("inline code is allowed for scripts only, and code is never evaluated in production", () => {
  const policy = parse(contentSecurityPolicy(production));
  assert.deepEqual(policy["script-src"], ["'self'", "'unsafe-inline'"]);
  for (const [directive, sources] of Object.entries(policy)) {
    if (directive !== "script-src") assert.ok(!sources.includes("'unsafe-inline'"), `${directive} allows inline code`);
  }
  assert.doesNotMatch(contentSecurityPolicy(production), /unsafe-eval/);
  assert.doesNotMatch(contentSecurityPolicy({}), /unsafe-eval/);
  // Only `next dev` needs it.
  assert.match(contentSecurityPolicy({ NODE_ENV: "development" }), /script-src 'self' 'unsafe-inline' 'unsafe-eval'/);
});
