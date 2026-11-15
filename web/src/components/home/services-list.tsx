import { useTranslations } from "next-intl";
import { AppLink } from "@/components/ui/app-link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { serviceLines } from "@/content/service-lines";
import type { AppLocale } from "@/i18n/locales";

// The five lines as numbered rows (identidad-visual.md → "Lista de servicios"): roman numeral,
// name in capitals, what it includes and an arrow, separated by 1 px rules.
export function ServicesList({ id, locale }: { id: string; locale: AppLocale }) {
  const t = useTranslations("Home");

  return (
    <section id={id} aria-labelledby="services-title" className="flex flex-col gap-10 py-22">
      <div className="flex flex-col gap-4">
        <p className="type-label text-(--muted-text)">{t("servicesLabel")}</p>
        <h2 id="services-title" className="text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.15] tracking-[0.01em] type-display">
          {t("servicesTitle")}
        </h2>
      </div>
      <ul className="border-t border-(--rule)">
        {serviceLines.map((line) => (
          <li key={line.id} className="border-b border-(--rule)">
            <AppLink
              href={line.pathname}
              className="flex flex-wrap items-baseline gap-x-8 gap-y-1.5 py-6 transition-colors duration-150 hover:text-(--accent-text)"
            >
              <span aria-hidden="true" className="w-14 text-2xl leading-[1.2] font-medium type-display">
                {line.numeral}
              </span>
              <h3 className="flex-[1_1_15rem] leading-[1.4] tracking-[0.12em] type-display">{line.name[locale]}</h3>
              <span className="flex-[2_1_20rem] leading-normal text-(--muted-text)">{line.summary[locale]}</span>
              <ArrowRightIcon size={20} className="shrink-0 self-center" />
            </AppLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
