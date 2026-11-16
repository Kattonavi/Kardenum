import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/contact/contact-cta";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { CaseHeroVisual, CasePieceView } from "@/components/portfolio/case-visuals";
import { JsonLd } from "@/components/seo/json-ld";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getPageName } from "@/content/pages";
import { type AppLocale, isAppLocale } from "@/i18n/locales";
import { builtEntries, type Entry, pathsOfEntry } from "@/lib/entries";
import { clientLabel, findCase, lineNames, nextCase, showCaseValue, visibleCases } from "@/lib/portfolio";
import { breadcrumbJsonLd, creativeWorkJsonLd } from "@/lib/seo/json-ld";
import { buildEntryMetadata, ogImagePath } from "@/lib/seo/metadata";
import { breadcrumbTrail, entryPath } from "@/routes";

const COLLECTION = "/portafolio/[slug]";
const INDEX = "/portafolio";

// Only the published cases exist, each under its own slug in each language: any other slug,
// or the slug of one language under the other prefix, matches no page and gets the brand 404.
export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const { locale } = params;
  return isAppLocale(locale) ? visibleCases().map((item) => ({ slug: item.slug[locale] })) : [];
}

function findEntry(locale: AppLocale, slug: string): Entry | undefined {
  return builtEntries().find((entry) => entry.collection === COLLECTION && entry.slug[locale] === slug);
}

export async function generateMetadata({ params }: PageProps<"/[locale]/portafolio/[slug]">) {
  const { locale, slug } = await params;
  const entry = isAppLocale(locale) ? findEntry(locale, slug) : undefined;
  // Unreachable: dynamicParams = false only lets the generated slugs in.
  if (!entry || !isAppLocale(locale)) notFound();
  return buildEntryMetadata(entry, locale);
}

const sectionTitleClass = "type-label font-medium text-(--muted-text)";

/** Page of a case (maqueta B-Caso, spec 005, RF-3). */
export default async function Page({ params }: PageProps<"/[locale]/portafolio/[slug]">) {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) notFound();
  const item = findCase(locale, slug);
  const entry = findEntry(locale, slug);
  if (!item || !entry) notFound();

  const [t, sections] = await Promise.all([
    getTranslations({ locale, namespace: "Portfolio" }),
    getTranslations({ locale, namespace: "Sections" }),
  ]);
  const year = showCaseValue(item.year, locale);
  const challenge = showCaseValue(item.challenge, locale);
  const work = showCaseValue(item.work, locale);
  const result = showCaseValue(item.result, locale);
  const next = nextCase(item);
  const facts = [
    { term: t("lines"), value: lineNames(item.lines, locale) },
    { term: t("year"), value: year.status === "ready" ? String(year.value) : year.note },
    { term: t("client"), value: clientLabel(item, { ownProject: t("ownProject"), reservedClient: t("reservedClient") }) },
  ];

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbJsonLd(
            locale,
            breadcrumbTrail(INDEX).map((pathname) => ({ name: getPageName(pathname)[locale], pathname })),
            { name: item.name, path: pathsOfEntry(entry)[locale] },
          ),
          creativeWorkJsonLd(locale, {
            name: item.name,
            description: item.meta.description[locale],
            path: pathsOfEntry(entry)[locale],
            // The social image of the portfolio, until each case has its own (spec 005).
            image: ogImagePath(INDEX, locale),
            year: year.status === "ready" ? year.value : undefined,
          }),
        ]}
      />
      <div className="surface-ink">
        <Container>
          {/* Home › Portfolio › case: the way back to the portfolio (maqueta B-Caso), as on every inner page. */}
          <Breadcrumbs pathname={INDEX} locale={locale} label={sections("breadcrumb")} entry={{ name: item.name }} />
          <div className="flex flex-col gap-6 pt-10 pb-14">
            <h1 className="text-[clamp(2.25rem,6vw,4.75rem)] leading-[1.05] tracking-[0.01em] type-display">{item.name}</h1>
            <p className="max-w-[36rem] text-lg leading-[1.6] text-(--muted-text)">{item.summary[locale]}</p>
            <dl className="flex flex-wrap gap-x-16 gap-y-5 border-t border-line pt-6">
              {facts.map((fact) => (
                <div key={fact.term} className="flex flex-col gap-1.5">
                  <dt className="font-mono text-[0.6875rem] tracking-[0.14em] text-(--muted-text) uppercase">{fact.term}</dt>
                  <dd className="text-[0.9375rem] leading-[1.4]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </div>

      <div className="surface-stone">
        <Container className="pb-14">
          <div className="pt-16">
            <CaseHeroVisual hero={item.hero} name={item.name} locale={locale} />
          </div>

          <section aria-label={t("about")} className="grid grid-cols-[repeat(auto-fit,minmax(min(20rem,100%),1fr))] gap-x-16 gap-y-12 py-18">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <h2 className={sectionTitleClass}>{t("challenge")}</h2>
                <p className="text-lg leading-[1.6]">{challenge.status === "ready" ? challenge.value[locale] : challenge.note}</p>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className={sectionTitleClass}>{t("result")}</h2>
                <p className="text-lg leading-[1.6]">{result.status === "ready" ? result.value[locale] : result.note}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className={sectionTitleClass}>{t("work")}</h2>
              {work.status === "ready" ? (
                <ul className="border-t border-ink">
                  {work.value.map((line) => (
                    <li key={line[locale]} className="flex items-baseline gap-4 border-b border-ink py-4 text-[1.0625rem] leading-normal">
                      <span aria-hidden="true" className="size-2 shrink-0 bg-bronze" />
                      {line[locale]}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg leading-[1.6]">{work.note}</p>
              )}
            </div>
          </section>

          <section aria-labelledby="pieces-title" className="flex flex-col gap-6 pb-18">
            <h2 id="pieces-title" className={sectionTitleClass}>
              {t("pieces")}
            </h2>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(26.25rem,100%),1fr))] gap-6">
              {item.pieces.map((piece, index) => (
                <li key={`${piece.kind}-${index}`}>
                  <CasePieceView piece={piece} locale={locale} />
                </li>
              ))}
            </ul>
          </section>

          {next ? (
            <Link
              href={entryPath(COLLECTION, next.slug, locale)}
              className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-ink py-10 transition-colors duration-150 hover:text-(--accent-text)"
            >
              <span className="type-label text-(--muted-text)">{t("next")}</span>
              <span className="inline-flex items-center gap-4 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] tracking-[0.04em] type-display">
                {next.name}
                <ArrowRightIcon size={28} className="shrink-0" />
              </span>
            </Link>
          ) : null}
        </Container>
      </div>

      <ContactCta />
    </>
  );
}
