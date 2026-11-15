import assert from "node:assert/strict";
import { test } from "node:test";
import { securityHeaders } from "@/lib/security-headers";

const header = (name: string) => securityHeaders().find((candidate) => candidate.key.toLowerCase() === name)?.value;

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
  const names = securityHeaders().map((candidate) => candidate.key.toLowerCase());
  assert.equal(new Set(names).size, names.length);
  for (const candidate of securityHeaders()) assert.doesNotMatch(candidate.value, /[\r\n]/, candidate.key);
});
