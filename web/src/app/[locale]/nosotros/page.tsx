import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/contact/contact-cta";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { SectionHeader, SplitSection } from "@/components/sections/content";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { getPageName } from "@/content/pages";
import { isAppLocale } from "@/i18n/locales";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/routes";

const PATHNAME = "/nosotros";

export async function generateMetadata({ params }: PageProps<"/[locale]/nosotros">): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return buildPageMetadata(PATHNAME, locale);
}

// About (maqueta B-Nosotros): the idea behind the name, three principles and the warranty.
// There is no team section and the country is not mentioned, on purpose.
// The mockup has no breadcrumbs; the SEO plan asks for them on every inner page and ranks above it.
export default async function AboutPage({ params }: PageProps<"/[locale]/nosotros">) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const [t, sections] = await Promise.all([getTranslations({ locale, namespace: "AboutPage" }), getTranslations({ locale, namespace: "Sections" })]);
  const principles = [
    { number: "01", title: t("principle1Title"), text: t("principle1Text") },
    { number: "02", title: t("principle2Title"), text: t("principle2Text") },
    { number: "03", title: t("principle3Title"), text: t("principle3Text") },
  ];

  return (
    <>
      <JsonLd nodes={[breadcrumbJsonLd(locale, breadcrumbTrail(PATHNAME).map((pathname) => ({ name: getPageName(pathname)[locale], pathname })))]} />
      <PageHero
        label={t("label")}
        titleLines={[t("titleLine")]}
        titleAccent={t("titleAccent")}
        text={t("text")}
        spacing="pt-10 pb-16"
        before={<Breadcrumbs pathname={PATHNAME} locale={locale} label={sections("breadcrumb")} />}
      />

      <div className="surface-stone">
        <Container>
          <section aria-labelledby="idea-title" className="flex flex-wrap items-start gap-x-16 gap-y-8 py-22">
            <div className="flex-[1_1_18rem]">
              <SectionHeader label={t("ideaLabel")} title={t("ideaTitle")} titleId="idea-title" />
            </div>
            <div className="flex min-w-0 flex-[2_1_32rem] flex-col gap-5 text-lg leading-[1.6]">
              <p>{t.rich("ideaOrigin", { em: (chunks) => <em>{chunks}</em> })}</p>
              <p className="text-(--muted-text)">{t("ideaStudio")}</p>
            </div>
          </section>

          <section aria-labelledby="principles-title" className="flex flex-col gap-8 pb-22">
            <h2 id="principles-title" className="type-label text-(--muted-text)">
              {t("principlesLabel")}
            </h2>
            <ol className="reveal grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-8 border-t border-(--rule) pt-8">
              {principles.map((principle) => (
                <li key={principle.number} className="flex flex-col gap-3">
                  <span aria-hidden="true" className="font-mono text-xs tracking-[0.1em]">
                    {principle.number}
                  </span>
                  <span aria-hidden="true" className="h-0.5 w-8 bg-bronze" />
                  <h3 className="leading-[1.4] tracking-[0.1em] type-display">{principle.title}</h3>
                  <p className="text-[0.9375rem] leading-normal text-(--muted-text)">{principle.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <SplitSection last label={t("warrantyLabel")} title={t("warrantyTitle")} titleId="warranty-title">
            <div className="reveal grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-8">
              <div className="flex flex-col gap-3">
                <h3 className="leading-[1.4] tracking-[0.1em] type-display">{t("coversTitle")}</h3>
                <p className="leading-[1.6] text-(--muted-text)">{t("coversText")}</p>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="leading-[1.4] tracking-[0.1em] type-display">{t("excludesTitle")}</h3>
                <p className="leading-[1.6] text-(--muted-text)">{t("excludesText")}</p>
              </div>
            </div>
          </SplitSection>
        </Container>
      </div>

      <ContactCta />
    </>
  );
}
