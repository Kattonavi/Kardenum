import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { SiteFooter } from "@/components/layout/site-footer";
import { AnalyticsScript } from "@/components/seo/analytics-script";
import { MAIN_CONTENT_ID, SiteHeader } from "@/components/layout/site-header";
import { routing } from "@/i18n/routing";
import { brand } from "@/lib/brand";
import { isSiteIndexable } from "@/lib/indexing";
import { languageOfferScript } from "@/lib/language-choice";
import { getSiteUrl } from "@/lib/site-url";
import { siteConfig } from "@/site.config";
import { archivo, jetbrainsMono } from "../fonts";
import "../globals.css";

// Both languages are generated at build time, and nothing else is ever rendered on demand.
// Unknown paths match no route, so Next serves the 404 with full HTML. A page that calls
// notFound() while rendering gets an empty error shell instead (checked on Next 16.4.6),
// which is why there is no catch-all route and Cache Components stays off (it forbids dynamicParams).
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: brand.ink };

// Site-wide defaults only. Title, description, canonical, hreflang and social image are set by
// each page with buildPageMetadata (src/lib/seo/metadata.ts): a canonical here would be inherited
// by every page.
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: siteConfig.name,
  title: siteConfig.name,
  robots: isSiteIndexable() ? undefined : { index: false, follow: false },
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    // suppressHydrationWarning: the script below may add data-lang-offer to <html> before React hydrates.
    <html lang={locale} className={`${archivo.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        {/* Decides before the first paint whether to offer the other language (no layout shift). */}
        <script dangerouslySetInnerHTML={{ __html: languageOfferScript }} />
        {/* Gives client components (e.g. next-intl's Link) the locale. messages={null}: no
            translations are shipped to the browser; client components receive their texts as props. */}
        <NextIntlClientProvider messages={null}>
          <SiteHeader locale={locale} />
          {/* The only <main> of every page: pages render sections, never their own <main>. */}
          <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex flex-1 flex-col focus:outline-none">
            {children}
          </main>
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
        <AnalyticsScript />
      </body>
    </html>
  );
}
