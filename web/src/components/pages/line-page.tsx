import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/contact/contact-cta";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { ChooserGrid, MarkedList, NumberedList, SplitSection, StackedSection, StepsSection } from "@/components/sections/content";
import { BracketVisual, HeroStrip, PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { buttonClass } from "@/components/ui/button";
import { processSteps } from "@/content/home";
import { linePages } from "@/content/lines";
import { getPageName } from "@/content/pages";
import { serviceLines } from "@/content/service-lines";
import type { ServiceLineId } from "@/content/types";
import { isAppLocale } from "@/i18n/locales";
import { getChannelHref } from "@/lib/contact";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail, isListed } from "@/routes";

type LocaleParams = Promise<{ locale: string }>;

function getLine(id: ServiceLineId) {
  const line = serviceLines.find((candidate) => candidate.id === id);
  if (!line) throw new Error(`Unknown service line: ${id}`);
  return line;
}

export async function lineMetadata(id: ServiceLineId, params: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return buildPageMetadata(getLine(id).pathname, locale);
}

/**
 * Page of a service line (maquetas B-Linea-*), for the five lines. The content decides which
 * sections exist: "which one do you need?" and "what you get" on service lines, the scope and
 * the Discord-first closing on community lines. Works and guides join when those sections of
 * the site are public.
 */
export async function LinePage({ id, params }: { id: ServiceLineId; params: LocaleParams }) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();

  const line = getLine(id);
  const page = linePages[id];
  const [sections, cta] = await Promise.all([
    getTranslations({ locale, namespace: "Sections" }),
    getTranslations({ locale, namespace: "ContactCta" }),
  ]);
  const community = page.kind === "community";
  const contactAnchor = `#${cta("id")}`;
  // On community lines the main button goes straight to Discord once the invitation exists.
  const primaryHref = community ? (getChannelHref("discord") ?? contactAnchor) : contactAnchor;
  const externalPrimary = primaryHref.startsWith("http");
  const steps = processSteps.map((step, index) => ({
    number: step.number,
    title: step.title[locale],
    text: index === 0 ? page.processFirstStep[locale] : step.text[locale],
  }));

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbJsonLd(locale, breadcrumbTrail(line.pathname).map((pathname) => ({ name: getPageName(pathname)[locale], pathname }))),
          serviceJsonLd(locale, { name: line.name[locale], description: page.meta.description[locale], pathname: line.pathname }),
        ]}
      />
      <PageHero
        label={`${line.numeral} · ${line.name[locale]}`}
        titleLines={page.hero.titleLines[locale]}
        titleAccent={page.hero.titleAccent[locale]}
        text={page.hero.text[locale]}
        size={community ? "large" : "base"}
        tight
        before={<Breadcrumbs pathname={line.pathname} locale={locale} label={sections("breadcrumb")} />}
        // The reel of the video line joins here once the studio has one.
        visual={page.hero.visual === "bracket" ? <BracketVisual /> : null}
        actions={
          <>
            <a href={primaryHref} className={buttonClass.primary} {...(externalPrimary ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {page.hero.cta[locale]}
            </a>
            <a href={`#${sections("servicesId")}`} className={buttonClass.secondary}>
              {sections("viewServices")}
            </a>
          </>
        }
        after={<HeroStrip label={page.strip.label[locale]} items={page.strip.items[locale]} />}
      />

      <div className="surface-stone">
        <Container>
          <StackedSection id={sections("servicesId")} first label={sections("services")} title={page.services.title[locale]} titleId="services-title">
            <NumberedList
              linkLabel={sections("viewService")}
              items={page.services.items.map((service) => ({
                title: service.title[locale],
                text: service.text[locale],
                href: service.subpage && isListed(service.subpage) ? service.subpage : undefined,
              }))}
            />
            {page.services.note ? <p className="max-w-[44rem] leading-[1.6] text-(--muted-text)">{page.services.note[locale]}</p> : null}
          </StackedSection>

          {page.chooser ? (
            <StackedSection label={sections("chooser")} title={page.chooser.title[locale]} titleId="chooser-title">
              <ChooserGrid
                options={page.chooser.options.map((option) => ({
                  condition: option.condition[locale],
                  need: option.need[locale],
                  answer: option.answer[locale],
                  text: option.text[locale],
                }))}
              />
            </StackedSection>
          ) : null}

          {page.deliverables ? (
            <SplitSection label={sections("deliverables")} title={page.deliverables.title[locale]} titleId="deliverables-title">
              <MarkedList items={page.deliverables.items.map((item) => item[locale])} />
            </SplitSection>
          ) : null}

          {page.scope ? (
            <SplitSection label={sections("scope")} title={page.scope.title[locale]} titleId="scope-title">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-8">
                <div className="flex flex-col gap-3.5">
                  <h3 className="leading-[1.4] tracking-[0.1em] type-display">{sections("does")}</h3>
                  <MarkedList items={page.scope.does.map((item) => item[locale])} />
                </div>
                <div className="flex flex-col gap-3.5">
                  <h3 className="leading-[1.4] tracking-[0.1em] type-display">{sections("doesNot")}</h3>
                  <MarkedList mark="excluded" items={page.scope.doesNot.map((item) => item[locale])} />
                </div>
              </div>
            </SplitSection>
          ) : null}

          {/* The questions of the line live on the questions page (spec 012, RF-43): the closing band links to its group. */}
          <StepsSection label={sections("process")} titleId="process-title" variant="page" steps={steps} />
        </Container>
      </div>

      <ContactCta first={community ? "discord" : "whatsapp"} community={community} line={id} />
    </>
  );
}
