import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { use } from "react";
import { ContactCta } from "@/components/contact/contact-cta";
import { Hero } from "@/components/home/hero";
import { LinesShowcase } from "@/components/home/lines-showcase";
import { HomeProcess } from "@/components/home/process";
import { SceneCarousel } from "@/components/home/scene-carousel";
import { JsonLd } from "@/components/seo/json-ld";
import { isAppLocale } from "@/i18n/locales";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return buildPageMetadata("/", locale);
}

// Home (docs/handoff/fase-2/maquetas, spec 012): the first screen with the carousel of scenes,
// the five lines seen before they are read, how we work and the closing band. The questions
// live on their own page. "Trabajo destacado" joins when the portfolio has content.
export default function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  if (!isAppLocale(locale)) notFound();
  const sections = useTranslations("Sections");
  const cta = useTranslations("ContactCta");

  return (
    <>
      <JsonLd nodes={[organizationJsonLd(locale), websiteJsonLd()]} />
      <Hero contactId={cta("id")} servicesId={sections("servicesId")} />
      <div className="surface-ink pb-16 md:pb-26">
        <SceneCarousel locale={locale} />
      </div>
      <LinesShowcase id={sections("servicesId")} locale={locale} />
      <HomeProcess locale={locale} />
      <ContactCta />
    </>
  );
}
