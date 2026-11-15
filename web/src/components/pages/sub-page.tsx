import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/contact/contact-cta";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { MarkedList, NumberedCards, RelatedGrid, SplitSection, StackedSection, StepsSection } from "@/components/sections/content";
import { FaqSection } from "@/components/sections/faq";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { buttonClass } from "@/components/ui/button";
import { linePages } from "@/content/lines";
import { getPageName } from "@/content/pages";
import { serviceLines } from "@/content/service-lines";
import { subpages } from "@/content/subpages";
import type { SubpageId } from "@/content/types";
import { isAppLocale } from "@/i18n/locales";
import { getChannelHref, quoteFormHref } from "@/lib/contact";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/routes";

type LocaleParams = Promise<{ locale: string }>;

export async function subpageMetadata(id: SubpageId, params: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return buildPageMetadata(subpages[id].pathname, locale);
}

/**
 * Page of one service inside its line (maquetas B-Sub-*, spec 004), for the six sub-pages.
 * The works and the guides of the service join the page with the portfolio and the guides.
 */
export async function SubPage({ id, params }: { id: SubpageId; params: LocaleParams }) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();

  const page = subpages[id];
  const line = serviceLines.find((candidate) => candidate.id === page.line);
  if (!line) throw new Error(`Unknown service line: ${page.line}`);
  const [sections, cta, contact] = await Promise.all([
    getTranslations({ locale, namespace: "Sections" }),
    getTranslations({ locale, namespace: "ContactCta" }),
    getTranslations({ locale, namespace: "ContactPage" }),
  ]);
  const community = linePages[page.line].kind === "community";
  const contactAnchor = `#${cta("id")}`;
  // Community services are quoted on Discord, once the invitation exists; the others in the quote form, with their line chosen.
  const primaryHref = community ? (getChannelHref("discord") ?? contactAnchor) : quoteFormHref(locale, contact("quoteId"), page.line);
  const externalPrimary = primaryHref.startsWith("http");
  const name = getPageName(page.pathname)[locale];
  const titleText = [...page.hero.titleLines[locale], page.hero.titleAccent[locale]].join(" ").replace(/\.$/, "");

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbJsonLd(locale, breadcrumbTrail(page.pathname).map((pathname) => ({ name: getPageName(pathname)[locale], pathname }))),
          serviceJsonLd(locale, { name: titleText, description: page.meta.description[locale], pathname: page.pathname }),
        ]}
      />
      <PageHero
        label={`${line.name[locale]} · ${name}`}
        titleLines={page.hero.titleLines[locale]}
        titleAccent={page.hero.titleAccent[locale]}
        text={page.hero.text[locale]}
        spacing="pt-10 pb-22"
        before={<Breadcrumbs pathname={page.pathname} locale={locale} label={sections("breadcrumb")} />}
        actions={
          <>
            <a href={primaryHref} className={buttonClass.primary} {...(externalPrimary ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {page.hero.cta[locale]}
            </a>
            <a href={contactAnchor} className={buttonClass.secondary}>
              {sections("otherChannels")}
            </a>
          </>
        }
      />

      <div className="surface-stone">
        <Container>
          <StackedSection first label={sections("offer")} title={page.offer.title[locale]} titleId="offer-title">
            <NumberedCards items={page.offer.items.map((item) => ({ title: item.title[locale], text: item.text[locale] }))} />
          </StackedSection>

          <SplitSection compact label={sections("deliverables")} title={page.deliverables.title[locale]} titleId="deliverables-title">
            <div className="flex flex-col gap-10">
              <MarkedList roomy items={page.deliverables.items.map((item) => item[locale])} />
              {page.deliverables.chips ? (
                <div className="flex flex-col gap-3.5">
                  <h3 className="leading-[1.4] tracking-[0.1em] type-display">{page.deliverables.chips.label[locale]}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {page.deliverables.chips.items.map((chip) => (
                      <li key={chip} className="inline-flex min-h-9 items-center border border-ink px-3.5 font-mono text-xs tracking-[0.1em] uppercase">
                        {chip}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </SplitSection>

          <StepsSection
            label={sections("process")}
            titleId="process-title"
            variant="page"
            steps={page.process.map((step, index) => ({
              number: String(index + 1).padStart(2, "0"),
              title: step.title[locale],
              text: step.text[locale],
            }))}
          />

          <FaqSection
            label={sections("faq")}
            title={page.faq.title[locale]}
            titleId="faq-title"
            variant="page"
            last={false}
            items={page.faq.items.map((faq) => ({ id: faq.id, question: faq.question[locale], answer: faq.answer[locale] }))}
          />

          <StackedSection last label={sections("related")} title={page.related.title[locale]} titleId="related-title">
            <RelatedGrid
              items={page.related.items.map((item) => ({
                label: serviceLines.find((candidate) => candidate.id === item.line)?.name[locale] ?? "",
                name: item.name[locale],
                href: item.pathname,
              }))}
            />
          </StackedSection>
        </Container>
      </div>

      <ContactCta first={community ? "discord" : "whatsapp"} community={community} line={page.line} />
    </>
  );
}
