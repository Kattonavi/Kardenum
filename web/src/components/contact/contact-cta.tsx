import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { buttonClass } from "@/components/ui/button";
import { contactChannels, hasPendingChannels } from "@/lib/contact";
import { ChannelLink } from "./channel-link";

/**
 * Closing band of every page: "Hablemos de tu proyecto." with the three contact channels,
 * WhatsApp first. While the channels have no data they are shown inert, with a bracketed
 * note (the handoff's convention for pending content).
 */
export function ContactCta() {
  const t = useTranslations("ContactCta");
  const channels = useTranslations("Channels");

  return (
    <section id={t("id")} aria-labelledby="contact-cta-title" className="surface-ink">
      <Container className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8 py-22">
        <div className="flex flex-[1_1_24rem] flex-col gap-4">
          <h2 id="contact-cta-title" className="text-[clamp(1.5rem,3.4vw,2.75rem)] leading-[1.1] tracking-[0.01em] type-display">
            {t("title")}
          </h2>
          <p className="max-w-[34rem] text-lg leading-[1.6] text-(--muted-text)">{t("text")}</p>
        </div>
        <div className="flex flex-col gap-3">
          <ul aria-label={channels("label")} className="flex flex-wrap gap-3">
            {contactChannels.map((channel, index) => (
              <li key={channel}>
                <ChannelLink channel={channel} className={index === 0 ? buttonClass.primary : buttonClass.secondary}>
                  {channels(channel)}
                </ChannelLink>
              </li>
            ))}
          </ul>
          {hasPendingChannels() ? <p className="type-label text-(--muted-text)">[{channels("pending")}]</p> : null}
        </div>
      </Container>
    </section>
  );
}
