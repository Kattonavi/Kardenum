import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { buttonClass } from "@/components/ui/button";

type HeroProps = {
  /** Anchors of the sections the two buttons lead to. */
  contactId: string;
  servicesId: string;
};

/**
 * Home hero (docs/handoff/fase-2/maquetas): centred, type only, so the largest paint is text.
 * The picture of the first screen is the carousel right under it.
 * The title runs as one sentence and wraps by itself; its second half is in the accent.
 */
export function Hero({ contactId, servicesId }: HeroProps) {
  const t = useTranslations("Home");

  return (
    <section className="surface-ink">
      <Container className="centred-stack py-11 md:pt-18 md:pb-16">
        <p className="eyebrow">{t("heroLabel")}</p>
        <h1 className="title-hero">
          {t("heroTitle")} <span className="text-(--accent-text)">{t("heroTitleAccent")}</span>
        </h1>
        <p className="max-w-[52ch] lede">{t("heroText")}</p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <a href={`#${contactId}`} className={buttonClass.primary}>
            {t("heroPrimary")}
          </a>
          <a href={`#${servicesId}`} className={buttonClass.secondary}>
            {t("heroSecondary")}
          </a>
        </div>
      </Container>
    </section>
  );
}
