import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/contact/contact-cta";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/sections/content";
import { FaqList } from "@/components/sections/faq";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { AppLink } from "@/components/ui/app-link";
import { buttonClass } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { faqAnchor, faqGroups } from "@/content/faq";
import { linePages } from "@/content/lines";
import { getPageName } from "@/content/pages";
import { isAppLocale } from "@/i18n/locales";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/routes";

const PATHNAME = "/preguntas-frecuentes";

export async function generateMetadata({ params }: PageProps<"/[locale]/preguntas-frecuentes">): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return buildPageMetadata(PATHNAME, locale);
}

// Questions (spec 012, RF-41 to RF-43): every question of the site on one page. The seven
// general ones first (they used to close the home page), then one group per service line (they
// used to close the page of each line). It is linked from the footer, from the closing band of
// every page and from each line; it is not in the menu. No FAQPage structured data, as on the
// rest of the site (src/lib/seo/json-ld.ts).
export default async function FaqPage({ params }: PageProps<"/[locale]/preguntas-frecuentes">) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const [t, home, sections] = await Promise.all([
    getTranslations({ locale, namespace: "FaqPage" }),
    getTranslations({ locale, namespace: "Home" }),
    getTranslations({ locale, namespace: "Sections" }),
  ]);

  const groups = faqGroups.map((group) => {
    const { line } = group;
    return {
      line,
      id: line ? faqAnchor(line, locale) : t("generalId"),
      name: line ? line.name[locale] : t("general"),
      label: line ? `${line.numeral} · ${line.name[locale]}` : t("general"),
      title: line ? linePages[line.id].faq.title[locale] : t("generalTitle"),
      items: group.items.map((faq) => ({ id: faq.id, question: faq.question[locale], answer: faq.answer[locale] })),
    };
  });

  return (
    <>
      <JsonLd nodes={[breadcrumbJsonLd(locale, breadcrumbTrail(PATHNAME).map((pathname) => ({ name: getPageName(pathname)[locale], pathname })))]} />
      <PageHero
        label={t("label")}
        titleLines={[t("titleLine")]}
        titleAccent={t("titleAccent")}
        text={t("text")}
        spacing="pt-10 pb-12"
        before={<Breadcrumbs pathname={PATHNAME} locale={locale} label={sections("breadcrumb")} />}
        after={
          <nav aria-label={t("topicsLabel")} className="border-t border-line pt-6 pb-10">
            <ul className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <li key={group.id}>
                  <a href={`#${group.id}`} className={buttonClass.line}>
                    {group.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      <div className="surface-stone">
        <Container className="pb-2">
          {groups.map((group, index) => (
            <section
              key={group.id}
              id={group.id}
              aria-labelledby={`${group.id}-title`}
              className={`flex scroll-mt-6 flex-wrap items-start gap-x-16 gap-y-8 pb-22 ${index === 0 ? "pt-22" : "border-t border-(--rule) pt-18"}`}
            >
              <div className="flex flex-[1_1_18rem] flex-col gap-6">
                <SectionHeader label={group.label} title={group.title} titleId={`${group.id}-title`} />
                {group.line ? (
                  <AppLink href={group.line.pathname} className={`${buttonClass.line} self-start`}>
                    {home("viewLine", { name: group.name })}
                    <ArrowRightIcon size={14} />
                  </AppLink>
                ) : null}
              </div>
              <div className="min-w-0 flex-[2_1_32rem]">
                <FaqList items={group.items} openFirst={index === 0} />
              </div>
            </section>
          ))}
        </Container>
      </div>

      <ContactCta faqLink={false} />
    </>
  );
}
