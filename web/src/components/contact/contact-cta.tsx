import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { buttonClass } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { ServiceLineId } from "@/content/types";
import { isAppLocale } from "@/i18n/locales";
import { type ContactChannel, getChannelHref, getWrittenEmail, hasPendingChannels, quoteFormHref } from "@/lib/contact";
import { isMinecraftPage } from "@/lib/notices";
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
};

/**
 * Closing band of every page: "Hablemos de tu proyecto." with the three contact channels,
 * centred (docs/handoff/fase-2/maquetas; one closing for the whole site, spec 012, decision 8).
 * WhatsApp leads to the quote form, which builds the message (plan §4: "llamado a cotizar con
 * la línea ya preseleccionada"). Discord and e-mail are shown inert while they have no data,
 * with a bracketed note (the handoff's convention for pending content).
 * On a page about Minecraft the e-mail address is also written out (spec 008, RF-5): the brand's
 * rules do not take a chat link as the only means of contact.
 */
export function ContactCta({ first = "whatsapp", community = false, line, lines = line ? [line] : [] }: ContactCtaProps) {
  const t = useTranslations("ContactCta");
  const channels = useTranslations("Channels");
  const sections = useTranslations("Sections");
  const contact = useTranslations("ContactPage");
  const locale = useLocale();
  const quoteHref = quoteFormHref(isAppLocale(locale) ? locale : "es", contact("quoteId"), line);
  const writtenEmail = isMinecraftPage(lines) ? getWrittenEmail() : null;

  return (
    <div className="surface-ink">
      <Container>
        <section id={t("id")} aria-labelledby="contact-cta-title" className="flex flex-col items-center gap-6.5 py-18 text-center md:py-30">
          <p className="flex items-center gap-3 type-label tracking-[0.14em] text-(--muted-text)">
            <span aria-hidden="true" className="size-2 shrink-0 bg-bronze" />
            {t("label")}
          </p>
          <h2 id="contact-cta-title" className="max-w-[56.25rem] text-[clamp(2rem,1.124rem+3.596vw,4rem)] leading-[1.02] font-extrabold type-display">
            {t("title")}
          </h2>
          <p className="max-w-[50ch] text-[clamp(1rem,0.918rem+0.337vw,1.1875rem)] leading-[1.55] text-(--muted-text)">{t("text")}</p>
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
