import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { shortLinkRedirects } from "./routes";

const handleI18nRouting = createMiddleware(routing);

// Short addresses (/minecraft, and /discord once its invitation exists). They are answered here
// and not with `redirects` in next.config.ts: a redirect made there leaves without the headers
// of the site (security headers and noindex), and every response should carry them.
const shortLinks = new Map(shortLinkRedirects().map((redirect) => [redirect.source, redirect]));

/**
 * Pages hidden behind a feature that is off, on the open site (specs 004, 005 and 006, "Páginas
 * ocultas y sitio abierto"): the list is computed when the site is compiled (next.config.ts, env
 * BLOCKED_PATHS) and inlined here, so it is the mode of the build and not of the process.
 */
function readBlockedPaths(value: string | undefined): ReadonlySet<string> {
  const list: unknown = JSON.parse(value ?? "[]");
  if (!Array.isArray(list) || !list.every((item) => typeof item === "string" && item.startsWith("/"))) {
    throw new Error("BLOCKED_PATHS must be a JSON list of paths (next.config.ts).");
  }
  return new Set(list);
}
const blockedPaths = readBlockedPaths(process.env.BLOCKED_PATHS);

// An address that matches no page: Next answers it with the brand 404 (src/app/global-not-found.tsx),
// full HTML for a document and a 404 for its RSC data, with the headers of every response.
const NOT_FOUND_TARGET = "/_pagina-no-generada";

/**
 * Short links and locale routing (Spanish at the root, English under /en). Not an authorization layer.
 *
 * With language detection off, next-intl redirects for one reason: the request used a second
 * address of a page (/es instead of /, or a slug of the other language). Each page has one
 * URL, so those redirects are permanent (308) instead of next-intl's temporary 307.
 */
export default function proxy(request: NextRequest) {
  // First of all: a hidden page is not there, whatever else the address would match.
  if (blockedPaths.has(request.nextUrl.pathname)) {
    const target = request.nextUrl.clone();
    target.pathname = NOT_FOUND_TARGET;
    target.search = "";
    return NextResponse.rewrite(target);
  }

  const shortLink = shortLinks.get(request.nextUrl.pathname);
  if (shortLink) {
    const status = shortLink.permanent ? 308 : 307;
    // To an address outside the site (https only, checked in routes.ts) or to one of its pages.
    if (!shortLink.destination.startsWith("/")) return NextResponse.redirect(shortLink.destination, status);
    const target = request.nextUrl.clone();
    target.pathname = shortLink.destination;
    return NextResponse.redirect(target, status);
  }

  const response = handleI18nRouting(request);
  if (response.status === 307 && response.headers.has("location")) {
    return new NextResponse(null, { status: 308, headers: response.headers });
  }
  return response;
}

export const config = {
  // Everything except /api, /_next, /_vercel and paths with a dot (robots.txt, icon.svg, ...).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
