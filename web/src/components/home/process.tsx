import { useTranslations } from "next-intl";
import { processSteps } from "@/content/home";
import type { AppLocale } from "@/i18n/locales";

// How we work, in four steps. The numbers stay: the order is the information.
export function Process({ locale }: { locale: AppLocale }) {
  const t = useTranslations("Home");

  return (
    <section aria-labelledby="process-title" className="flex flex-col gap-8 pb-24">
      <h2 id="process-title" className="type-label font-normal text-(--muted-text)">
        {t("processLabel")}
      </h2>
      <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-8">
        {processSteps.map((step) => (
          <li key={step.number} className="flex flex-col gap-3">
            <span aria-hidden="true" className="font-mono text-xs tracking-[0.1em]">
              {step.number}
            </span>
            <span aria-hidden="true" className="h-0.5 w-8 bg-bronze" />
            <h3 className="leading-[1.4] tracking-[0.1em] type-display">{step.title[locale]}</h3>
            <p className="text-[15px] leading-normal text-(--muted-text)">{step.text[locale]}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
