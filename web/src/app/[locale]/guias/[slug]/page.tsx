import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/contact/contact-cta";
import { GuideCard } from "@/components/guides/guide-card";
import { guideComponents, sectionAnchor, sectionNumber } from "@/components/guides/guide-mdx";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { AppLink } from "@/components/ui/app-link";
import { buttonClass } from "@/components/ui/button";
import { linePages } from "@/content/lines";
import { getPageName } from "@/content/pages";
import { serviceLines } from "@/content/service-lines";
import { type AppLocale, isAppLocale } from "@/i18n/locales";
import { getChannelHref, quoteFormHref } from "@/lib/contact";
import { builtEntries, type Entry, generatedEntries, pathsOfEntry } from "@/lib/entries";
import { findGuide, formatGuideDate, relatedGuides } from "@/lib/guides";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildEntryMetadata, ogImagePath } from "@/lib/seo/metadata";
import { breadcrumbTrail, isListed } from "@/routes";

const COLLECTION = "/guias/[slug]";
const INDEX = "/guias";

// Only the written guides exist, each under its own slug in each language: any other slug, or
// the slug of one language under the other prefix, matches no page and gets the brand 404.
export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const { locale } = params;
  // Hidden behind its flag on the open site: none (src/lib/entries.ts, isEntryGenerated).
  return isAppLocale(locale) ? generatedEntries().filter((entry) => entry.collection === COLLECTION).map((entry) => ({ slug: entry.slug[locale] })) : [];
}

function findEntry(locale: AppLocale, slug: string): Entry | undefined {
  return builtEntries().find((entry) => entry.collection === COLLECTION && entry.slug[locale] === slug);
}

export async function generateMetadata({ params }: PageProps<"/[locale]/guias/[slug]">) {
  const { locale, slug } = await params;
  const entry = isAppLocale(locale) ? findEntry(locale, slug) : undefined;
  // Unreachable: dynamicParams = false only lets the generated slugs in.
  if (!entry || !isAppLocale(locale)) notFound();
  return buildEntryMetadata(entry, locale);
}

/** Page of a guide (maqueta B-Guia-plantilla, spec 006, RF-2 to RF-5). */
export default async function Page({ params }: PageProps<"/[locale]/guias/[slug]">) {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) notFound();
  const guide = findGuide(locale, slug);
  const entry = findEntry(locale, slug);
  if (!guide || !entry) notFound();

  const { meta } = guide;
  const [t, sections, cta, contact, { default: Body }] = await Promise.all([
    getTranslations({ locale, namespace: "Guides" }),
    getTranslations({ locale, namespace: "Sections" }),
    getTranslations({ locale, namespace: "ContactCta" }),
    getTranslations({ locale, namespace: "ContactPage" }),
    guide.body[locale](),
  ]);
  const line = serviceLines.find((candidate) => candidate.id === meta.line);
  const lineName = line?.shortName[locale] ?? meta.line;
  const path = pathsOfEntry(entry)[locale];
  const sectionTitles = meta.sections.map((section) => section[locale]);
  const texts = { sectionId: t("sectionId"), needs: t("needs"), note: t("note"), code: t("code"), table: t("table") };
  const related = relatedGuides(meta);

  // Same rules as the sub-pages (spec 004, RF-5): Discord on community lines, once the invitation
  // exists (until then, the contact channels of the page); the quote form with the line chosen on the others.
  const community = linePages[meta.line].kind === "community";
  const quoteHref = community ? (getChannelHref("discord") ?? `#${cta("id")}`) : quoteFormHref(locale, contact("quoteId"), meta.line);
  const externalQuote = quoteHref.startsWith("http");
  const byline = [
    { key: "by", content: t("by") },
    { key: "published", content: <>{`${t("publishedOn")} `}<time dateTime={meta.publishedAt}>{formatGuideDate(meta.publishedAt, locale)}</time></> },
    { key: "updated", content: <>{`${t("updatedOn")} `}<time dateTime={meta.updatedAt}>{formatGuideDate(meta.updatedAt, locale)}</time></> },
    { key: "minutes", content: t("minutes", { minutes: meta.readingMinutes }) },
  ];

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbJsonLd(
            locale,
            breadcrumbTrail(INDEX).map((pathname) => ({ name: getPageName(pathname)[locale], pathname })),
            { name: meta.shortName[locale], path },
          ),
          articleJsonLd(locale, {
            headline: meta.title[locale],
            description: meta.meta.description[locale],
            path,
            image: ogImagePath(INDEX, locale),
            datePublished: meta.publishedAt,
            dateModified: meta.updatedAt,
          }),
        ]}
      />
      <div className="surface-ink">
        <Container>
          <Breadcrumbs pathname={INDEX} locale={locale} label={sections("breadcrumb")} entry={{ name: meta.shortName[locale] }} />
          <div className="flex flex-col gap-6 pt-10 pb-20">
            <p className="flex items-center gap-3 type-label text-(--muted-text)">
              <span aria-hidden="true" className="size-2 shrink-0 bg-bronze" />
              {`${t("guide")} · ${lineName}`}
            </p>
            <h1 className="max-w-[52rem] text-[clamp(1.75rem,3.8vw,3rem)] leading-[1.1] tracking-[0.01em] type-display">{meta.title[locale]}</h1>
            <p className="max-w-[40rem] text-lg leading-[1.6] text-(--muted-text)">{meta.summary[locale]}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-xs tracking-[0.1em] text-(--muted-text) uppercase">
              {byline.map((item) => (
                <li key={item.key}>{item.content}</li>
              ))}
            </ul>
          </div>
        </Container>
      </div>

      <div className="surface-stone">
        <Container>
          <div className="flex flex-wrap items-start gap-x-16 gap-y-12 pt-18 pb-24">
            <nav aria-label={t("contents")} className="flex min-w-0 flex-[1_1_15rem] flex-col gap-3.5">
              <p className="type-label text-(--muted-text)">{t("contents")}</p>
              <ol className="border-t border-ink">
                {sectionTitles.map((title, n) => (
                  <li key={title}>
                    <a
                      href={`#${sectionAnchor(texts.sectionId, n)}`}
                      className="flex min-h-11 items-baseline gap-2.5 border-b border-mist py-2.5 text-[0.9375rem] leading-[1.4] transition-colors duration-150 hover:text-(--accent-text)"
                    >
                      <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-(--muted-text)">{sectionNumber(n)}</span>
                      {title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <article className="flex min-w-0 max-w-[46rem] flex-[3_1_36rem] flex-col gap-14">
              <Body components={guideComponents({ sections: sectionTitles, texts })} />
            </article>
          </div>
        </Container>
      </div>

      <div className="surface-ink">
        <Container>
          <section aria-labelledby="related-service-title" className={`flex flex-wrap items-end justify-between gap-x-16 gap-y-8 py-18 ${related.length === 0 ? "border-b border-line" : ""}`}>
            <div className="flex flex-[1_1_24rem] flex-col gap-4">
              <p className="type-label text-(--muted-text)">{`${t("relatedService")} · ${getPageName(meta.service)[locale]}`}</p>
              <h2 id="related-service-title" className="text-[clamp(1.5rem,3.4vw,2.5rem)] leading-[1.1] tracking-[0.01em] type-display">
                {t("serviceTitle")}
              </h2>
              <p className="max-w-[34rem] text-lg leading-[1.6] text-(--muted-text)">{t("serviceText")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={quoteHref} className={buttonClass.primary} {...(externalQuote ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {community ? t("quoteDiscord") : t("quoteForm")}
              </a>
              {isListed(meta.service) ? (
                <AppLink href={meta.service} className={buttonClass.secondary}>
                  {t("viewService")}
                </AppLink>
              ) : null}
            </div>
          </section>
        </Container>
      </div>

      {related.length > 0 ? (
        <div className="surface-stone">
          <Container>
            <section aria-labelledby="related-guides-title" className="flex flex-col gap-8 pt-22 pb-24">
              <div className="flex flex-col gap-4">
                <p className="type-label text-(--muted-text)">{t("relatedLabel")}</p>
                <h2 id="related-guides-title" className="max-w-[40rem] text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.15] tracking-[0.01em] type-display">
                  {t("relatedTitle")}
                </h2>
              </div>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))] border-t border-l border-t-ink border-l-mist">
                {related.map((other) => (
                  <GuideCard key={other.id} guide={other} locale={locale} texts={{ guide: t("guide"), read: t("read") }} heading="h3" />
                ))}
              </ul>
            </section>
          </Container>
        </div>
      ) : null}

      <ContactCta first={community ? "discord" : "whatsapp"} community={community} line={meta.line} />
    </>
  );
}
