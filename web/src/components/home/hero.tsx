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
      <Container className="flex flex-col items-center gap-6.5 py-11 text-center md:pt-18 md:pb-16">
        <p className="flex items-center gap-3 type-label tracking-[0.14em] text-(--muted-text)">
          <span aria-hidden="true" className="size-2 shrink-0 bg-bronze" />
          {t("heroLabel")}
        </p>
        <h1 className="max-w-[68.75rem] text-[clamp(2.125rem,1.084rem+4.27vw,4.5rem)] leading-[1.02] font-extrabold type-display">
          {t("heroTitle")} <span className="text-(--accent-text)">{t("heroTitleAccent")}</span>
        </h1>
        <p className="max-w-[52ch] text-[clamp(1rem,0.918rem+0.337vw,1.1875rem)] leading-[1.55] text-(--muted-text)">{t("heroText")}</p>
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
