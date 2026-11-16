import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/contact/contact-cta";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { CaseCover } from "@/components/portfolio/case-visuals";
import { FILTER_GROUP, filteredItemClass, filterLines, LineFilter, showFilter } from "@/components/sections/line-filter";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { getPageName } from "@/content/pages";
import { isAppLocale } from "@/i18n/locales";
import { clientLabel, lineNames, showCaseValue, visibleCases } from "@/lib/portfolio";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { type LocalePageProps, breadcrumbTrail, entryPath } from "@/routes";

const PATHNAME = "/portafolio";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return buildPageMetadata(PATHNAME, locale);
}

/** Portfolio index (maqueta B-Portafolio, spec 005): the rule in view, the filter by line and one card per published case. */
export default async function Page({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const [t, sections] = await Promise.all([
    getTranslations({ locale, namespace: "Portfolio" }),
    getTranslations({ locale, namespace: "Sections" }),
  ]);
  const cases = visibleCases();
  const lines = filterLines(cases.map((item) => item.lines));
  const texts = { ownProject: t("ownProject"), reservedClient: t("reservedClient") };

  return (
    <>
      <JsonLd nodes={[breadcrumbJsonLd(locale, breadcrumbTrail(PATHNAME).map((pathname) => ({ name: getPageName(pathname)[locale], pathname })))]} />
      <PageHero
        label={t("label")}
        titleLines={[t("titleLine1"), t("titleLine2")]}
        text={t("text")}
        spacing="pt-10 pb-16"
        before={<Breadcrumbs pathname={PATHNAME} locale={locale} label={sections("breadcrumb")} />}
      />

      <div className="surface-stone">
        <Container>
          <section aria-label={t("projects")} className={`${FILTER_GROUP} flex flex-col gap-10 pt-12 pb-24`}>
            {showFilter(lines) ? <LineFilter locale={locale} legend={t("filterLabel")} allLabel={t("all")} lines={lines} variant="display" /> : null}

            <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(21.25rem,100%),1fr))] gap-x-8 gap-y-12">
              {cases.map((item) => {
                const year = showCaseValue(item.year, locale);
                return (
                  <li key={item.id} className={filteredItemClass(item.lines)}>
                    <Link href={entryPath("/portafolio/[slug]", item.slug, locale)} className="group flex flex-col gap-3.5">
                      <CaseCover cover={item.cover} locale={locale} />
                      <div className="flex items-baseline justify-between gap-4 font-mono text-[0.6875rem] text-graphite uppercase">
                        <span className="tracking-[0.14em]">{lineNames(item.lines, locale)}</span>
                        <span className="tracking-[0.1em]">{year.status === "ready" ? year.value : year.note}</span>
                      </div>
                      <h2 className="text-xl leading-[1.2] tracking-[0.06em] type-display group-hover:underline">{item.name}</h2>
                      <p className="text-[0.9375rem] leading-normal text-(--muted-text)">{`${item.cardText[locale]}. ${clientLabel(item, texts)}.`}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </Container>
      </div>

      <ContactCta />
    </>
  );
}
