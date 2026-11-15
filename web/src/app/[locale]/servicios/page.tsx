import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/contact/contact-cta";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { AppLink } from "@/components/ui/app-link";
import { buttonClass } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
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

// Index of the five service lines (maqueta B-Servicios).
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
        spacing="pt-10 pb-22"
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

      <div className="surface-stone">
        <Container>
          <section aria-label={t("linesLabel")} className="pt-18 pb-22">
            <ol className="border-t border-(--rule)">
              {serviceLines.map((line) => {
                const subpages = line.subpages.filter((subpage) => isListed(subpage.pathname));
                return (
                  <li key={line.id} className="flex flex-wrap items-start gap-x-10 gap-y-4 border-b border-(--rule) py-10">
                    <span aria-hidden="true" className="w-12 shrink-0 font-mono text-[0.8125rem] tracking-[0.1em] text-(--muted-text)">
                      {line.numeral}
                    </span>
                    <div className="flex min-w-0 flex-[1_1_26rem] flex-col gap-3.5">
                      <h2 className="text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.15] tracking-[0.04em] type-display">{line.name[locale]}</h2>
                      <p className="max-w-[40rem] text-[1.0625rem] leading-[1.6] text-(--muted-text)">{line.summary[locale]}</p>
                      {subpages.length > 0 ? (
                        <ul className="flex flex-wrap gap-2">
                          {subpages.map((subpage) => (
                            <li key={subpage.pathname}>
                              <AppLink
                                href={subpage.pathname}
                                className="inline-flex min-h-11 items-center border border-ink px-3.5 font-mono text-xs tracking-[0.08em] transition-colors duration-150 hover:bg-ink hover:text-stone"
                              >
                                {subpage.label[locale]}
                              </AppLink>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    <AppLink
                      href={line.pathname}
                      aria-label={`${t("viewLine")}: ${line.name[locale]}`}
                      className="inline-flex min-h-11 items-center gap-2.5 text-xs tracking-[0.14em] type-display transition-colors duration-150 hover:text-(--accent-text)"
                    >
                      {t("viewLine")}
                      <ArrowRightIcon size={16} />
                    </AppLink>
                  </li>
                );
              })}
            </ol>
          </section>

          <section aria-labelledby="guidance-title" className="flex flex-wrap items-center justify-between gap-x-12 gap-y-6 pb-24">
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
