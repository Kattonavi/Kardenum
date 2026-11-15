import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { use } from "react";
import { ContactCta } from "@/components/contact/contact-cta";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { Process } from "@/components/home/process";
import { ServicesList } from "@/components/home/services-list";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { homeFaqs } from "@/content/home";
import { isAppLocale } from "@/i18n/locales";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return buildPageMetadata("/", locale);
}

// Home (maqueta B-Gremio-inicio-v2): hero, the five lines, how we work, questions and the
// closing band. "Trabajo destacado" joins when the portfolio has content.
export default function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  if (!isAppLocale(locale)) notFound();
  const t = useTranslations("Home");
  const cta = useTranslations("ContactCta");

  return (
    <>
      <JsonLd nodes={[organizationJsonLd(locale), websiteJsonLd(locale)]} />
      <Hero contactId={cta("id")} servicesId={t("servicesId")} />
      <div className="surface-stone">
        <Container>
          <ServicesList id={t("servicesId")} locale={locale} />
          <Process locale={locale} />
          <Faq id={t("faqId")} locale={locale} items={homeFaqs} />
        </Container>
      </div>
      <ContactCta />
    </>
  );
}
