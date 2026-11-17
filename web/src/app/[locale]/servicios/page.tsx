import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/contact/contact-cta";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/sections/page-hero";
import { LineCard } from "@/components/scenes/line-card";
import { MotionToggle } from "@/components/scenes/motion-toggle";
import { JsonLd } from "@/components/seo/json-ld";
import { AppLink } from "@/components/ui/app-link";
import { buttonClass } from "@/components/ui/button";
import { getPageName } from "@/content/pages";
import { serviceLines } from "@/content/service-lines";
import { isAppLocale } from "@/i18n/locales";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail, isListed } from "@/routes";

const PATHNAME = "/servicios";

export async function generateMetadata({ params }: PageProps<"/[locale]/servicios">): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return buildPageMetadata(PATHNAME, locale);
}

// Index of the five service lines (maqueta B-Servicios; cards with scenes since spec 012).
export default async function ServicesPage({ params }: PageProps<"/[locale]/servicios">) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const [t, sections, cta] = await Promise.all([
    getTranslations({ locale, namespace: "ServicesPage" }),
    getTranslations({ locale, namespace: "Sections" }),
    getTranslations({ locale, namespace: "ContactCta" }),
  ]);

  return (
    <>
      <JsonLd nodes={[breadcrumbJsonLd(locale, breadcrumbTrail(PATHNAME).map((pathname) => ({ name: getPageName(pathname)[locale], pathname })))]} />
      <PageHero
        label={t("label")}
        titleLines={[t("titleLine")]}
        titleAccent={t("titleAccent")}
        text={t("text")}
        spacing="pt-10 pb-14"
        before={<Breadcrumbs pathname={PATHNAME} locale={locale} label={sections("breadcrumb")} />}
        actions={
          <>
            <a href={`#${cta("id")}`} className={buttonClass.primary}>
              {t("quote")}
            </a>
            {isListed("/portafolio") ? (
              <AppLink href="/portafolio" className={buttonClass.secondary}>
                {t("portfolio")}
              </AppLink>
            ) : null}
          </>
        }
      />

      {/* The five lines as cards, on ink like the cards of the home page (spec 012, RF-50). On a wide
          window: three in the first row and two, wider, in the second, so no row is left short. */}
      <div className="surface-ink">
        <Container>
          <section aria-label={t("linesLabel")} className="flex flex-col gap-5 pb-22">
            <MotionToggle className="self-end" />
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
              {serviceLines.map((line, index) => {
                const subpages = line.subpages.filter((subpage) => isListed(subpage.pathname));
                return (
                  <LineCard
                    key={line.id}
                    line={line}
                    locale={locale}
                    headingLevel={2}
                    className={`${index < 3 ? "lg:col-span-2" : "lg:col-span-3"} ${index === serviceLines.length - 1 ? "md:max-lg:col-span-2" : ""}`}
                  >
                    {subpages.length > 0 ? (
                      // Above the stretched link of the card, so each sub-page keeps its own link.
                      <ul className="relative z-10 flex flex-wrap gap-2">
                        {subpages.map((subpage) => (
                          <li key={subpage.pathname}>
                            <AppLink href={subpage.pathname} className={buttonClass.line}>
                              {subpage.label[locale]}
                            </AppLink>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </LineCard>
                );
              })}
            </ul>
          </section>
        </Container>
      </div>

      <div className="surface-stone">
        <Container>
          <section aria-labelledby="guidance-title" className="flex flex-wrap items-center justify-between gap-x-12 gap-y-6 py-22">
            <div className="flex flex-[1_1_26rem] flex-col gap-3">
              <h2 id="guidance-title" className="text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.15] tracking-[0.01em] type-display">
                {t("guidanceTitle")}
              </h2>
              <p className="max-w-[36rem] text-[1.0625rem] leading-[1.6] text-(--muted-text)">{t("guidanceText")}</p>
            </div>
            <AppLink href="/contacto" className={buttonClass.dark}>
              {t("guidanceAction")}
            </AppLink>
          </section>
        </Container>
      </div>

      <ContactCta />
    </>
  );
}
