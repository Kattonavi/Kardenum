/**
 * What is wrong with the pictures of a page, read from its HTML. Every `<img>` of the site must
 * come out of the image component (src/components/ui/plain-image.tsx), which means:
 * - `srcset` and `sizes`: one file per width, in the format the browser accepts (AVIF or WebP);
 * - `width` and `height`: the page does not jump while the picture loads;
 * - `alt`: present, even when empty for a decorative picture;
 * - no inline `style`: the content policy blocks it;
 * - lazy, unless it is the main picture of the page (`fetchpriority="high"`).
 * The smoke test runs this on every page it fetches (scripts/smoke.mjs).
 */
export function imageProblems(html: string): string[] {
  const problems: string[] = [];
  for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) {
    // An attribute with its quoted value is read whole, so a word inside a value (an alt that says
    // "style", a class list) is never taken for an attribute.
    const attributes = new Map(
      [...tag.matchAll(/([a-zA-Z_:][\w:.-]*)\s*=\s*"([^"]*)"|([a-zA-Z_:][\w:.-]*)(?=[\s/>])/g)].map((match) => [(match[1] ?? match[3] ?? "").toLowerCase(), match[2] ?? ""]),
    );
    const missing: string[] = [];
    if (!attributes.get("srcset")?.trim()) missing.push("srcset");
    if (!attributes.get("sizes")?.trim()) missing.push("sizes");
    for (const side of ["width", "height"]) {
      if (!/^[1-9]\d*$/.test(attributes.get(side) ?? "")) missing.push(side);
    }
    if (!attributes.has("alt")) missing.push("alt");
    const faults = missing.length > 0 ? [`without ${missing.join(", ")}`] : [];
    if (attributes.has("style")) faults.push("with an inline style");
    const main = attributes.get("fetchpriority") === "high";
    if (main && attributes.get("loading") === "lazy") faults.push("marked as the main picture and lazy at once");
    if (!main && attributes.get("loading") !== "lazy") faults.push("not lazy and not marked as the main picture");
    if (faults.length > 0) problems.push(`${(attributes.get("src") ?? tag).slice(0, 80)}: ${faults.join("; ")}`);
  }
  return problems;
}

/** Number of pictures in a page. */
export function countImages(html: string): number {
  return [...html.matchAll(/<img\b[^>]*>/gi)].length;
}
