import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { use } from "react";
import { ContactCta } from "@/components/contact/contact-cta";
import { Hero } from "@/components/home/hero";
import { ServicesList } from "@/components/home/services-list";
import { Container } from "@/components/layout/container";
import { StepsSection } from "@/components/sections/content";
import { FaqSection } from "@/components/sections/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { homeFaqs, processSteps } from "@/content/home";
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
  const sections = useTranslations("Sections");
  const cta = useTranslations("ContactCta");

  return (
    <>
      <JsonLd nodes={[organizationJsonLd(locale), websiteJsonLd(locale)]} />
      <Hero contactId={cta("id")} servicesId={sections("servicesId")} />
      <div className="surface-stone">
        <Container>
          <ServicesList id={sections("servicesId")} locale={locale} />
          <StepsSection
            label={sections("process")}
            titleId="process-title"
            variant="home"
            steps={processSteps.map((step) => ({ number: step.number, title: step.title[locale], text: step.text[locale] }))}
          />
          <FaqSection
            id={t("faqId")}
            label={sections("faq")}
            title={t("faqTitle")}
            titleId="faq-title"
            variant="home"
            items={homeFaqs.map((faq) => ({ id: faq.id, question: faq.question[locale], answer: faq.answer[locale] }))}
          />
        </Container>
      </div>
      <ContactCta />
    </>
  );
}
