import assert from "node:assert/strict";
import { test } from "node:test";
import { isSiteIndexable, NOINDEX_DIRECTIVE } from "@/lib/indexing";

test("only the exact string 'true' opens indexing", () => {
  assert.equal(isSiteIndexable({ SITE_INDEXABLE: "true" }), true);
  for (const value of [undefined, "", "false", "TRUE", "True", "1", "yes", " true", "true "]) {
    assert.equal(isSiteIndexable({ SITE_INDEXABLE: value }), false, `value: ${JSON.stringify(value)}`);
  }
});

test("the noindex directive blocks indexing and following", () => {
  assert.match(NOINDEX_DIRECTIVE, /noindex/);
  assert.match(NOINDEX_DIRECTIVE, /nofollow/);
});
