import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ChannelLink } from "@/components/contact/channel-link";
import { QuoteForm } from "@/components/contact/quote-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/sections/content";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { buttonClass } from "@/components/ui/button";
import { getPageName } from "@/content/pages";
import { quoteDeadlines, quoteDefaultDeadline, quoteProjectTypes, quoteUnsure } from "@/content/quote";
import { serviceLines } from "@/content/service-lines";
import { isAppLocale } from "@/i18n/locales";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/routes";
import { siteConfig } from "@/site.config";

const PATHNAME = "/contacto";

export async function generateMetadata({ params }: PageProps<"/[locale]/contacto">): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return buildPageMetadata(PATHNAME, locale);
}

const cardClass = "flex flex-col gap-3.5 border border-line p-7";

// Contact (maqueta B-Contacto): the three channels, the WhatsApp quote form and what happens next.
export default async function ContactPage({ params }: PageProps<"/[locale]/contacto">) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const [t, sections, channels] = await Promise.all([
    getTranslations({ locale, namespace: "ContactPage" }),
    getTranslations({ locale, namespace: "Sections" }),
    getTranslations({ locale, namespace: "Channels" }),
  ]);
  const { email, whatsapp } = siteConfig.contact;
  const afterSteps = [
    { number: "01", title: t("after1Title"), text: t("after1Text") },
    { number: "02", title: t("after2Title"), text: t("after2Text") },
    { number: "03", title: t("after3Title"), text: t("after3Text") },
  ];

  return (
    <>
      <JsonLd nodes={[breadcrumbJsonLd(locale, breadcrumbTrail(PATHNAME).map((pathname) => ({ name: getPageName(pathname)[locale], pathname })))]} />
      <PageHero
        label={t("label")}
        titleLines={[t("titleLine")]}
        titleAccent={t("titleAccent")}
        text={t("text")}
        spacing="pt-10 pb-18"
        before={<Breadcrumbs pathname={PATHNAME} locale={locale} label={sections("breadcrumb")} />}
        after={
          <section aria-label={t("channelsLabel")} className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6 pb-24">
            <div className={cardClass}>
              <span aria-hidden="true" className="font-mono text-[11px] tracking-[0.14em] text-(--muted-text)">
                01
              </span>
              <h2 className="text-xl leading-[1.3] tracking-[0.08em] type-display">{channels("whatsapp")}</h2>
              <p className="leading-[1.55] text-(--muted-text)">{t("whatsappText")}</p>
              <div className="mt-auto pt-2">
                <a href={`#${t("quoteId")}`} className={buttonClass.primary}>
                  {t("whatsappAction")}
                </a>
              </div>
            </div>
            <div className={cardClass}>
              <span aria-hidden="true" className="font-mono text-[11px] tracking-[0.14em] text-(--muted-text)">
                02
              </span>
              <h2 className="text-xl leading-[1.3] tracking-[0.08em] type-display">{channels("discord")}</h2>
              <p className="leading-[1.55] text-(--muted-text)">{t("discordText")}</p>
              <div className="mt-auto pt-2">
                <ChannelLink channel="discord" className={buttonClass.secondary}>
                  {t("discordAction")}
                </ChannelLink>
              </div>
            </div>
            <div className={cardClass}>
              <span aria-hidden="true" className="font-mono text-[11px] tracking-[0.14em] text-(--muted-text)">
                03
              </span>
              <h2 className="text-xl leading-[1.3] tracking-[0.08em] type-display">{channels("email")}</h2>
              <p className="leading-[1.55] text-(--muted-text)">{t("emailText")}</p>
              {/* The address, or its bracketed placeholder while it is not defined (site.config.ts). */}
              <span className="font-mono text-[13px] tracking-[0.04em] break-all">{email.status === "ready" ? email.value : email.placeholder}</span>
              <div className="mt-auto pt-2">
                <ChannelLink channel="email" className={buttonClass.secondary}>
                  {t("emailAction")}
                </ChannelLink>
              </div>
            </div>
          </section>
        }
      />

      <div className="surface-stone">
        <Container>
          <section id={t("quoteId")} aria-labelledby="quote-title" className="flex flex-col gap-10 py-22">
            <div className="flex flex-col gap-4">
              <SectionHeader label={t("quoteLabel")} title={t("quoteTitle")} titleId="quote-title" />
              <p className="max-w-[40rem] text-[17px] leading-[1.6] text-(--muted-text)">{t("quoteText")}</p>
            </div>
            <QuoteForm
              lines={serviceLines.map((line) => ({
                id: line.id,
                name: line.name[locale],
                projectTypes: quoteProjectTypes[line.id].map((type) => type[locale]),
              }))}
              deadlines={quoteDeadlines.map((deadline) => deadline[locale])}
              defaultDeadline={quoteDefaultDeadline[locale]}
              unsure={quoteUnsure[locale]}
              whatsappNumber={whatsapp.status === "ready" ? whatsapp.value : null}
              messageLabels={{
                greeting: t("messageGreeting"),
                introduction: t.raw("messageIntroduction"),
                line: t("messageLine"),
                project: t("messageProject"),
                deadline: t("messageDeadline"),
              }}
              labels={{
                line: t("fieldLine"),
                type: t("fieldType"),
                idea: t("fieldIdea"),
                ideaPlaceholder: t("ideaPlaceholder"),
                deadline: t("fieldDeadline"),
                name: t("fieldName"),
                namePlaceholder: t("namePlaceholder"),
                submit: t("submit"),
                submitNote: t("submitNote"),
                pendingNote: t("pendingNote"),
                noScript: t("noScript"),
                previewRegion: t("previewRegion"),
                previewLabel: t("previewLabel"),
                previewName: t("previewName"),
                previewIdea: t("previewIdea"),
                previewNote: t("previewNote"),
              }}
            />
          </section>

          <section aria-labelledby="after-title" className="flex flex-col gap-8 border-t border-(--rule) pt-18 pb-24">
            <SectionHeader label={t("afterLabel")} title={t("afterTitle")} titleId="after-title" />
            <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-8">
              {afterSteps.map((step) => (
                <li key={step.number} className="flex flex-col gap-3">
                  <span aria-hidden="true" className="font-mono text-xs tracking-[0.1em]">
                    {step.number}
                  </span>
                  <span aria-hidden="true" className="h-0.5 w-8 bg-bronze" />
                  <h3 className="leading-[1.4] tracking-[0.1em] type-display">{step.title}</h3>
                  <p className="text-[15px] leading-normal text-(--muted-text)">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </Container>
      </div>
    </>
  );
}
