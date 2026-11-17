import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { buttonClass } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { faqAnchor } from "@/content/faq";
import { serviceLines } from "@/content/service-lines";
import type { ServiceLineId } from "@/content/types";
import { isAppLocale } from "@/i18n/locales";
import { type ContactChannel, getChannelHref, getWrittenEmail, hasPendingChannels, quoteFormHref } from "@/lib/contact";
import { isMinecraftPage } from "@/lib/notices";
import { localizedPath } from "@/routes";
import { ChannelLink } from "./channel-link";

const CHANNEL_ORDER: Record<"whatsapp" | "discord", readonly ContactChannel[]> = {
  whatsapp: ["whatsapp", "discord", "email"],
  discord: ["discord", "whatsapp", "email"],
};

type ContactCtaProps = {
  /** Channel shown first, as the main button. Discord on the Minecraft and Discord pages. */
  first?: "whatsapp" | "discord";
  /** Adds the invitation to the studio's Discord server (community landings). */
  community?: boolean;
  /** Line of the page: it arrives preselected in the quote form. */
  line?: ServiceLineId;
  /** Lines the page is about, when they are not just `line` (a case has several and preselects none). */
  lines?: readonly ServiceLineId[];
  /** False on the questions page itself. */
  faqLink?: boolean;
};

/**
 * Closing band of every page: "Hablemos de tu proyecto." with the three contact channels,
 * centred (docs/handoff/fase-2/maquetas; one closing for the whole site, spec 012, decision 8),
 * and a link to the questions page.
 * WhatsApp leads to the quote form, which builds the message (plan §4: "llamado a cotizar con
 * la línea ya preseleccionada"). Discord and e-mail are shown inert while they have no data,
 * with a bracketed note (the handoff's convention for pending content).
 * On a page about Minecraft the e-mail address is also written out (spec 008, RF-5): the brand's
 * rules do not take a chat link as the only means of contact.
 */
export function ContactCta({ first = "whatsapp", community = false, line, lines = line ? [line] : [], faqLink = true }: ContactCtaProps) {
  const t = useTranslations("ContactCta");
  const channels = useTranslations("Channels");
  const sections = useTranslations("Sections");
  const contact = useTranslations("ContactPage");
  const locale = useLocale();
  const appLocale = isAppLocale(locale) ? locale : "es";
  const quoteHref = quoteFormHref(appLocale, contact("quoteId"), line);
  // On the page of a line the link lands on the questions of that line.
  const lineOfPage = line ? serviceLines.find((candidate) => candidate.id === line) : undefined;
  const faqHref = `${localizedPath("/preguntas-frecuentes", appLocale)}${lineOfPage ? `#${faqAnchor(lineOfPage, appLocale)}` : ""}`;
  const writtenEmail = isMinecraftPage(lines) ? getWrittenEmail() : null;

  return (
    // Never on the first screen: laid out when the visitor comes near (band-later, globals.css).
    <div className="band-later surface-ink">
      <Container>
        <section id={t("id")} aria-labelledby="contact-cta-title" className="centred-stack py-18 md:py-30">
          <p className="eyebrow">{t("label")}</p>
          <h2 id="contact-cta-title" className="title-closing">
            {t("title")}
          </h2>
          <p className="max-w-[50ch] lede">{t("text")}</p>
          <ul aria-label={channels("label")} className="flex flex-wrap justify-center gap-3.5">
            {CHANNEL_ORDER[first].map((channel, index) => (
              <li key={channel}>
                {channel === "whatsapp" ? (
                  <a href={quoteHref} className={index === 0 ? buttonClass.primary : buttonClass.secondary}>
                    {channels(channel)}
                  </a>
                ) : (
                  <ChannelLink channel={channel} className={index === 0 ? buttonClass.primary : buttonClass.secondary}>
                    {channels(channel)}
                  </ChannelLink>
                )}
              </li>
            ))}
          </ul>
          {writtenEmail ? (
            <p data-written-email className="flex flex-wrap items-center justify-center gap-x-2.5 type-label text-(--muted-text)">
              {channels("email")}
              {writtenEmail.href ? (
                <a
                  href={writtenEmail.href}
                  className="inline-flex min-h-11 items-center text-sm tracking-normal text-stone normal-case underline underline-offset-4 transition-colors duration-150 hover:text-(--accent-text)"
                >
                  {writtenEmail.text}
                </a>
              ) : (
                <span className="text-sm tracking-normal normal-case">{writtenEmail.text}</span>
              )}
            </p>
          ) : null}
          {hasPendingChannels(["discord", "email"]) ? <p className="type-label text-(--muted-text)">[{channels("pending")}]</p> : null}
          {faqLink ? (
            // A plain link: it may carry the anchor of a group, which the typed routes do not describe.
            <a
              href={faqHref}
              data-faq-link
              className="text-link"
            >
              {t("faq")}
              <ArrowRightIcon size={14} />
            </a>
          ) : null}
        </section>
        {community ? (
          <section aria-label={channels("discord")} className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line py-10">
            <p className="leading-[1.6] text-(--muted-text)">{sections("communityText")}</p>
            <ChannelLink
              channel="discord"
              className={`inline-flex min-h-11 items-center gap-2.5 text-xs tracking-[0.14em] type-display ${
                getChannelHref("discord") === null ? "" : "transition-colors duration-150 hover:text-(--accent-text)"
              }`}
            >
              {sections("communityAction")}
              <ArrowRightIcon size={16} />
            </ChannelLink>
          </section>
        ) : null}
      </Container>
    </div>
  );
}
