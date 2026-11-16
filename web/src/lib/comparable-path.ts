/**
 * The form of an address that src/proxy.ts compares with the list of hidden pages. The same page
 * can be asked for in many spellings (an encoded letter, capitals, a trailing slash) and what
 * happens to each one further on (next-intl, then Next's router) is not this file's to guess:
 * every spelling that could name a hidden page is reduced here to the one in the list.
 *
 * Only used to compare. The request goes on with its address untouched, and refusing one address
 * too many costs nothing: a hidden page has no other spelling that should answer.
 */

// How many times an escape is undone (%2573 -> %73 -> s). An address escaped deeper than this
// is left as it is: Next undoes one level, and what is left matches no page.
const MAX_PASSES = 8;

// The addresses of the site are ASCII (src/routes.ts, src/lib/entries.ts), so only ASCII escapes
// can spell one. Escapes of other bytes stay as they are, and nothing here can throw.
const ASCII_ESCAPE = /%([0-7][0-9a-f])/gi;

export function comparablePath(pathname: string): string {
  let path = pathname;
  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    const unescaped = path.replace(ASCII_ESCAPE, (_, hex: string) => String.fromCharCode(Number.parseInt(hex, 16)));
    if (unescaped === path) break;
    path = unescaped;
  }

  const segments: string[] = [];
  for (const segment of path.toLowerCase().replaceAll("\\", "/").split("/")) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") segments.pop();
    else segments.push(segment);
  }
  return `/${segments.join("/")}`;
}
