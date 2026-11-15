import { getAnalytics } from "./analytics";
import type { Env } from "./indexing";

/**
 * Security headers sent with every response (seo-sitio.md §2.7, "Confianza").
 * They are static: set once in next.config.ts, the same for every page, so pages stay prerendered.
 */
export type ResponseHeader = { readonly key: string; readonly value: string };

/**
 * Two years of HTTPS only for this host. Without `includeSubDomains` and `preload`, by decision
 * of the founder (2026-11-15): they bind every future subdomain of the domain and are slow to undo.
 */
export const STRICT_TRANSPORT_SECURITY = "max-age=63072000";

/** Features the site never uses, denied to it and to anything embedded in it. */
export const PERMISSIONS_POLICY = "camera=(), microphone=(), geolocation=(), browsing-topics=()";

/**
 * Content-Security-Policy: everything comes from the site itself and nothing else is allowed.
 *
 * The one concession is 'unsafe-inline' for scripts. Next writes the data of each page in inline
 * scripts that are different on every page: allowing them by nonce needs a server render per
 * request (the site would stop being static), and by hash it needs a different policy per page.
 * Measured on 2026-11-15 (Next 16.4.6): with script-src 'self' alone no page hydrates, with or
 * without experimental.sri. Styles need no such concession: there are no inline styles.
 * What keeps inline scripts safe here is that the site renders no content written by visitors.
 *
 * The only other origin ever allowed is the analytics one, for scripts and connections, and only
 * when UMAMI_SRC and UMAMI_WEBSITE_ID exist (src/lib/analytics.ts).
 */
export function contentSecurityPolicy(env: Env = process.env): string {
  const analytics = getAnalytics(env);
  const analyticsOrigin = analytics ? [analytics.origin] : [];
  const directives: Record<string, readonly string[]> = {
    "default-src": ["'self'"],
    // `next dev` evaluates code to refresh modules; a production build never does.
    "script-src": ["'self'", "'unsafe-inline'", ...(env.NODE_ENV === "development" ? ["'unsafe-eval'"] : []), ...analyticsOrigin],
    // 'unsafe-inline' above is for <script> blocks only: handlers written in attributes (onclick="…") stay forbidden.
    "script-src-attr": ["'none'"],
    "style-src": ["'self'"],
    "img-src": ["'self'"],
    "font-src": ["'self'"],
    "connect-src": ["'self'", ...analyticsOrigin],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };
  return Object.entries(directives)
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
}

export function securityHeaders(env: Env = process.env): ResponseHeader[] {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(env) },
    { key: "Strict-Transport-Security", value: STRICT_TRANSPORT_SECURITY },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: PERMISSIONS_POLICY },
    // For browsers that do not read frame-ancestors.
    { key: "X-Frame-Options", value: "DENY" },
  ];
}
