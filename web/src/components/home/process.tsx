import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { processSteps } from "@/content/home";
import type { AppLocale } from "@/i18n/locales";

/**
 * "Cómo trabajamos" of the home page (docs/handoff/fase-2/maquetas): the four steps on stone, in
 * four columns (one on a phone), each under a 2 px rule. The numbers stay: the order is the
 * information. On stone the accent as text is the deep bronze.
 */
export function HomeProcess({ locale }: { locale: AppLocale }) {
  const t = useTranslations("Home");

  return (
    <section aria-labelledby="process-title" className="surface-stone">
      <Container className="flex flex-col gap-11 py-16 md:py-26">
        <div className="flex flex-col gap-4.5">
          <p className="flex items-center gap-3 type-label tracking-[0.14em] text-(--muted-text)">
            <span aria-hidden="true" className="size-2 shrink-0 bg-bronze" />
            {t("processLabel")}
          </p>
          <h2 id="process-title" className="text-[clamp(1.75rem,1.312rem+1.8vw,2.75rem)] leading-[1.05] font-extrabold type-display">
            {t("processTitle")}
          </h2>
        </div>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <li key={step.number} className="reveal flex flex-col gap-3.5 border-t-2 border-ink pt-6.5">
              <span aria-hidden="true" className="font-mono text-[0.8125rem] tracking-[0.14em] text-(--accent-text)">
                {step.number}
              </span>
              <h3 className="text-[1.375rem] leading-[1.1] font-extrabold type-display">{step.title[locale]}</h3>
              <p className="leading-[1.55] text-(--muted-text)">{step.text[locale]}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
