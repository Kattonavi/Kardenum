import { getAnalytics } from "@/lib/analytics";

/**
 * Umami's tracker, only when UMAMI_SRC and UMAMI_WEBSITE_ID exist (src/lib/analytics.ts).
 * A plain deferred script in the server HTML: the content policy allows its origin and nothing else.
 */
export function AnalyticsScript() {
  const analytics = getAnalytics();
  if (!analytics) return null;
  return <script defer src={analytics.src} data-website-id={analytics.websiteId} />;
}
