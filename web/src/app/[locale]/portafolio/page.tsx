import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContactCta } from "@/components/contact/contact-cta";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { CaseCover } from "@/components/portfolio/case-visuals";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { getPageName } from "@/content/pages";
import { serviceLines } from "@/content/service-lines";
import type { ServiceLineId } from "@/content/types";
import { isAppLocale } from "@/i18n/locales";
import { clientLabel, lineNames, showCaseValue, visibleCases } from "@/lib/portfolio";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail, entryPath } from "@/routes";

const PATHNAME = "/portafolio";

export async function generateMetadata({ params }: PageProps<"/[locale]/portafolio">) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return buildPageMetadata(PATHNAME, locale);
}

/**
 * The filter works without JavaScript: one radio per line, and CSS hides the cards that are not
 * of the chosen one (:has()). Tailwind only emits classes it finds written whole, so each one
 * is spelled out here.
 */
const HIDDEN_UNLESS_CHOSEN: Readonly<Record<ServiceLineId, string>> = {
  desarrollo: "group-has-[#filter-desarrollo:checked]/works:hidden",
  diseno: "group-has-[#filter-diseno:checked]/works:hidden",
  video: "group-has-[#filter-video:checked]/works:hidden",
  minecraft: "group-has-[#filter-minecraft:checked]/works:hidden",
  discord: "group-has-[#filter-discord:checked]/works:hidden",
};

const filterOptionClass =
  "relative inline-flex min-h-11 cursor-pointer items-center border border-ink px-5 text-xs tracking-[0.14em] type-display transition-colors duration-150 has-checked:bg-ink has-checked:text-stone has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink";

/** Portfolio index (maqueta B-Portafolio, spec 005): the rule in view, the filter by line and one card per published case. */
export default async function Page({ params }: PageProps<"/[locale]/portafolio">) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const [t, sections] = await Promise.all([
    getTranslations({ locale, namespace: "Portfolio" }),
    getTranslations({ locale, namespace: "Sections" }),
  ]);
  const cases = visibleCases();
  const texts = { ownProject: t("ownProject"), reservedClient: t("reservedClient") };
  const options = [{ id: "all", label: t("all") }, ...serviceLines.map((line) => ({ id: line.id, label: line.shortName[locale] }))];

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
          <section aria-label={t("projects")} className="group/works flex flex-col gap-10 pt-12 pb-24">
            <fieldset className="flex min-w-0 flex-wrap gap-2">
              <legend className="sr-only">{t("filterLabel")}</legend>
              {options.map((option) => (
                <label key={option.id} className={filterOptionClass}>
                  <input type="radio" name="linea" id={`filter-${option.id}`} value={option.id} defaultChecked={option.id === "all"} className="sr-only" />
                  {option.label}
                </label>
              ))}
            </fieldset>

            <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(21.25rem,100%),1fr))] gap-x-8 gap-y-12">
              {cases.map((item) => {
                const year = showCaseValue(item.year, locale);
                const hidden = serviceLines.filter((line) => !item.lines.includes(line.id)).map((line) => HIDDEN_UNLESS_CHOSEN[line.id]);
                return (
                  <li key={item.id} className={hidden.join(" ")}>
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
