import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import type { LegalDocument } from "@/content/legal";
import { getPageName } from "@/content/pages";
import { isAppLocale } from "@/i18n/locales";
import { fillSentence, showDate, showParagraphs, showValue } from "@/lib/legal";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { type AppPathname, breadcrumbTrail } from "@/routes";
import { type LegalDocumentData, siteConfig } from "@/site.config";

type LocaleParams = Promise<{ locale: string }>;

export async function legalMetadata(pathname: AppPathname, params: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return buildPageMetadata(pathname, locale);
}

type LegalPageProps<SectionId extends string> = {
  /** Titles and order of the sections (approved in the mockups). */
  document: LegalDocument<SectionId>;
  /** Dates and texts of the document in site.config.ts: shown in brackets while they are pending. */
  data: LegalDocumentData<SectionId>;
  params: LocaleParams;
};

/**
 * A legal page (maquetas B-Legal-privacidad and B-Legal-terminos; docs/specs/003-paginas-legales.md):
 * the list of contents on the side and the numbered sections. No closing band: the footer follows.
 */
export async function LegalPage<SectionId extends string>({ document, data, params }: LegalPageProps<SectionId>) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const [t, sections] = await Promise.all([getTranslations({ locale, namespace: "Legal" }), getTranslations({ locale, namespace: "Sections" })]);

  const owner = Object.fromEntries(Object.entries(siteConfig.legal.owner).map(([field, value]) => [field, showValue(value, locale)]));
  const entries = document.sections.map((section, index) => ({
    // "s1"… as in the mockups: short, the same in both languages and stable when a title changes.
    anchor: `s${index + 1}`,
    number: String(index + 1).padStart(2, "0"),
    title: section.title[locale],
    paragraphs: section.id === "owner" ? [fillSentence(document.ownerSentence[locale], owner)] : showParagraphs(data.sections[section.id], locale),
  }));

  return (
    <>
      <JsonLd
        nodes={[breadcrumbJsonLd(locale, breadcrumbTrail(document.pathname).map((pathname) => ({ name: getPageName(pathname)[locale], pathname })))]}
      />
      <div className="surface-ink">
        <Container>
          <Breadcrumbs pathname={document.pathname} locale={locale} label={sections("breadcrumb")} />
          <div className="flex flex-col gap-5 pt-10 pb-18">
            <p className="flex items-center gap-3 type-label text-(--muted-text)">
              <span aria-hidden="true" className="size-2 shrink-0 bg-bronze" />
              {t("label")}
            </p>
            <h1 className="text-[clamp(1.75rem,3.8vw,3rem)] leading-[1.05] tracking-[0.01em] type-display">{document.title[locale]}</h1>
            <p className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-xs tracking-[0.1em] text-(--muted-text) uppercase">
              <span>
                {t("effectiveFrom")} {showDate(data.effectiveDate, locale)}
              </span>
              <span>
                {t("updated")} {showDate(data.updatedDate, locale)}
              </span>
            </p>
          </div>
        </Container>
      </div>

      <div className="surface-stone">
        <Container>
          <div className="flex flex-wrap items-start gap-x-16 gap-y-12 pt-18 pb-24">
            <nav aria-labelledby="legal-contents" className="flex min-w-0 flex-[1_1_15rem] flex-col gap-3.5">
              <p id="legal-contents" className="type-label text-(--muted-text)">
                {t("contents")}
              </p>
              <ol className="border-t border-(--rule)">
                {entries.map((entry) => (
                  <li key={entry.anchor}>
                    <a
                      href={`#${entry.anchor}`}
                      className="flex min-h-11 items-baseline gap-2.5 border-b border-mist py-2.5 text-[0.9375rem] leading-[1.4] transition-colors duration-150 hover:text-(--accent-text)"
                    >
                      <span aria-hidden="true" className="font-mono text-[0.6875rem] tracking-[0.1em] text-(--muted-text)">
                        {entry.number}
                      </span>
                      {entry.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className="flex max-w-[46rem] min-w-0 flex-[3_1_36rem] flex-col gap-11">
              {showParagraphs(data.intro, locale).map((paragraph) => (
                <p key={paragraph} className="text-lg leading-[1.7]">
                  {paragraph}
                </p>
              ))}
              {entries.map((entry) => (
                <section key={entry.anchor} aria-labelledby={entry.anchor} className="flex flex-col gap-3.5">
                  <h2 id={entry.anchor} className="text-xl leading-[1.3] tracking-[0.04em] type-display">
                    <span className="font-mono text-[0.75em] font-medium tracking-[0.1em] text-(--muted-text)">{entry.number} · </span>
                    {entry.title}
                  </h2>
                  {entry.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-[1.0625rem] leading-[1.7]">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </article>
          </div>
        </Container>
      </div>
    </>
  );
}
