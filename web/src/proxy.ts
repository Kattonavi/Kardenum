import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Locale routing only (Spanish at the root, English under /en). Not an authorization layer.
export default createMiddleware(routing);

export const config = {
  // Everything except /api, /_next, /_vercel and paths with a dot (robots.txt, icon.svg, ...).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
