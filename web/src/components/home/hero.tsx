import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { buttonClass } from "@/components/ui/button";

type HeroProps = {
  /** Anchors of the sections the two buttons lead to. */
  contactId: string;
  servicesId: string;
};

// Home hero (maqueta B-Gremio-inicio-v2): type and color only, no image, so the largest paint is text.
export function Hero({ contactId, servicesId }: HeroProps) {
  const t = useTranslations("Home");

  return (
    <section className="surface-ink">
      <Container className="flex flex-col gap-8 pt-24 pb-22">
        <p className="flex items-center gap-3 type-label text-(--muted-text)">
          <span aria-hidden="true" className="size-2 shrink-0 bg-bronze" />
          {t("heroLabel")}
        </p>
        <h1 className="text-[clamp(1.875rem,4.6vw,3.625rem)] leading-[1.05] tracking-[0.01em] type-display">
          {/* A space before each <br>: readers that ignore the break still get separate words. */}
          {t("heroTitleLine1")} <br />
          {t("heroTitleLine2")} <br />
          <span className="text-bronze">{t("heroTitleAccent")}</span>
        </h1>
        <p className="max-w-[34rem] text-lg leading-[1.6] text-(--muted-text)">{t("heroText")}</p>
        <div className="flex flex-wrap gap-3">
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
