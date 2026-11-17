import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/contact/contact-cta";
import { GuideCard } from "@/components/guides/guide-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { FILTER_GROUP, filteredItemClass, filterLines, LineFilter, showFilter } from "@/components/sections/line-filter";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { getPageName } from "@/content/pages";
import { isAppLocale } from "@/i18n/locales";
import { sortedGuides } from "@/lib/guides";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { type LocalePageProps, breadcrumbTrail } from "@/routes";

const PATHNAME = "/guias";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return buildPageMetadata(PATHNAME, locale);
}

/**
 * Index of the guides (maqueta B-Guias, spec 006, RF-1): the newest first, filtered by line
 * without JavaScript. With no guide written, only the heading is shown: no empty filter.
 */
export default async function Page({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const [t, sections] = await Promise.all([getTranslations({ locale, namespace: "Guides" }), getTranslations({ locale, namespace: "Sections" })]);
  const guides = sortedGuides().map((guide) => guide.meta);
  const texts = { guide: t("guide"), read: t("read") };
  const lines = filterLines(guides.map((guide) => [guide.line]));

  return (
    <>
      <JsonLd nodes={[breadcrumbJsonLd(locale, breadcrumbTrail(PATHNAME).map((pathname) => ({ name: getPageName(pathname)[locale], pathname })))]} />
      <PageHero
        label={t("label")}
        titleLines={[t("titleLine")]}
        titleAccent={t("titleAccent")}
        text={t("text")}
        spacing="pt-10 pb-22"
        before={<Breadcrumbs pathname={PATHNAME} locale={locale} label={sections("breadcrumb")} />}
      />

      {guides.length > 0 ? (
        <div className="surface-stone">
          <Container>
            <section aria-label={t("published")} className={`${FILTER_GROUP} flex flex-col gap-8 pt-18 pb-24`}>
              {showFilter(lines) ? <LineFilter locale={locale} legend={t("filterLabel")} allLabel={t("all")} lines={lines} variant="mono" /> : null}
              <ul className="reveal grid grid-cols-[repeat(auto-fill,minmax(min(21.25rem,100%),1fr))] border-t border-l border-t-ink border-l-mist">
                {guides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} locale={locale} texts={texts} heading="h2" withSummary className={filteredItemClass([guide.line])} />
                ))}
              </ul>
            </section>
          </Container>
        </div>
      ) : null}

      <ContactCta />
    </>
  );
}
