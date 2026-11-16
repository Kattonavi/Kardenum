import assert from "node:assert/strict";
import { test } from "node:test";
import { countImages, imageProblems } from "@/lib/html-images";

// The shape of what the image component writes (src/components/ui/plain-image.tsx).
const srcset = "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fa.1.webp&amp;w=640&amp;q=75 640w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fa.1.webp&amp;w=1200&amp;q=75 1200w";
const good = `<img alt="Panel" loading="lazy" width="1600" height="900" decoding="async" class="h-auto w-full" sizes="100vw" srcset="${srcset}" src="/_next/image?url=%2Fa.webp&amp;w=1200&amp;q=75"/>`;
const main = good.replace('loading="lazy"', 'loading="eager" fetchpriority="high"');

test("a picture written by the image component has nothing wrong", () => {
  assert.deepEqual(imageProblems(`<main>${good}${main}</main>`), []);
  assert.equal(countImages(`<main>${good}${main}</main>`), 2);
  assert.deepEqual(imageProblems("<main><p>No pictures here.</p></main>"), []);
});

test("a picture without srcset, sizes, dimensions or alt is reported, each by name", () => {
  const cases: [string, RegExp][] = [
    ['<img src="/captura.png" alt="x" width="800" height="600" loading="lazy">', /without srcset, sizes/],
    [good.replace(' width="1600"', ""), /without width/],
    [good.replace(' height="900"', ""), /without height/],
    [good.replace('width="1600"', 'width="100%"'), /without width/],
    [good.replace('height="900"', 'height="0"'), /without height/],
    [good.replace('alt="Panel" ', ""), /without alt/],
    [good.replace(' sizes="100vw"', ""), /without sizes/],
    ['<img src="/a.png">', /without srcset, sizes, width, height, alt/],
  ];
  for (const [html, expected] of cases) {
    const problems = imageProblems(html);
    assert.equal(problems.length, 1, html);
    assert.match(problems[0] ?? "", expected, html);
  }
});

test("an inline style and a wrong loading mode are reported too", () => {
  assert.match(imageProblems(good.replace("<img ", '<img style="color:transparent" '))[0] ?? "", /inline style/);
  assert.match(imageProblems(good.replace('loading="lazy"', 'loading="eager"'))[0] ?? "", /not lazy and not marked as the main picture/);
  assert.match(imageProblems(good.replace('loading="lazy"', 'loading="lazy" fetchpriority="high"'))[0] ?? "", /main picture and lazy at once/);
  // An empty alt is a decision (decorative picture), not a missing attribute.
  assert.deepEqual(imageProblems(good.replace('alt="Panel"', 'alt=""')), []);
});
