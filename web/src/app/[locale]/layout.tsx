import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { isSiteIndexable } from "@/lib/indexing";
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

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  // generateMetadata runs alongside the layout: validate here too (e.g. "/sitemap.xml" lands in [locale]).
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("title"),
    description: t("description"),
    robots: isSiteIndexable() ? undefined : { index: false, follow: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
