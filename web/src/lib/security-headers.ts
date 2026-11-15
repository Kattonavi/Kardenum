/**
 * Security headers sent with every response (seo-sitio.md §2.7, "Confianza").
 * They are static: set once in next.config.ts, the same for every page, so pages stay prerendered.
 */
export type ResponseHeader = { readonly key: string; readonly value: string };

/**
 * Two years of HTTPS only for this host. `includeSubDomains` and `preload` are left out on
 * purpose: they bind every future subdomain of the domain and are slow to undo, so they are a
 * decision for the launch, not a default.
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
 */
export function contentSecurityPolicy(env: { readonly NODE_ENV?: string } = process.env): string {
  const directives: Record<string, readonly string[]> = {
    "default-src": ["'self'"],
    // `next dev` evaluates code to refresh modules; a production build never does.
    "script-src": ["'self'", "'unsafe-inline'", ...(env.NODE_ENV === "development" ? ["'unsafe-eval'"] : [])],
    "style-src": ["'self'"],
    "img-src": ["'self'"],
    "font-src": ["'self'"],
    "connect-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };
  return Object.entries(directives)
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
}

export function securityHeaders(env: { readonly NODE_ENV?: string } = process.env): ResponseHeader[] {
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
