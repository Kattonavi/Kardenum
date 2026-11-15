import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

/**
 * Locale routing only (Spanish at the root, English under /en). Not an authorization layer.
 *
 * With language detection off, next-intl redirects for one reason: the request used a second
 * address of a page (/es instead of /, or a slug of the other language). Each page has one
 * URL, so those redirects are permanent (308) instead of next-intl's temporary 307.
 */
export default function proxy(request: NextRequest) {
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
