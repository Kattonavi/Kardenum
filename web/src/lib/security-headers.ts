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

export function securityHeaders(): ResponseHeader[] {
  return [
    { key: "Strict-Transport-Security", value: STRICT_TRANSPORT_SECURITY },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: PERMISSIONS_POLICY },
    // For browsers that do not read frame-ancestors.
    { key: "X-Frame-Options", value: "DENY" },
  ];
}
