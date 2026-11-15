import { useTranslations } from "next-intl";
import { PlusIcon } from "@/components/ui/icons";
import type { Faq as FaqItem } from "@/content/types";
import type { AppLocale } from "@/i18n/locales";

type FaqProps = {
  id: string;
  locale: AppLocale;
  items: readonly FaqItem[];
};

// Questions as native <details>: the answers are in the HTML even when folded, they work
// without JavaScript and with the keyboard. The first one starts open, as in the mockup.
export function Faq({ id, locale, items }: FaqProps) {
  const t = useTranslations("Home");

  return (
    <section id={id} aria-labelledby="faq-title" className="flex flex-wrap items-start gap-x-16 gap-y-8 pb-24">
      <div className="flex flex-[1_1_18rem] flex-col gap-4">
        <p className="type-label text-(--muted-text)">{t("faqLabel")}</p>
        <h2 id="faq-title" className="text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.15] tracking-[0.01em] type-display">
          {t("faqTitle")}
        </h2>
      </div>
      <div className="min-w-0 flex-[2_1_32rem] border-t border-(--rule)">
        {items.map((item, index) => (
          <details key={item.id} open={index === 0} className="group border-b border-(--rule)">
            <summary className="flex min-h-21 items-center justify-between gap-6 py-5 transition-colors duration-150 hover:text-(--accent-text)">
              <h3 className="leading-[1.4] tracking-[0.02em] type-wide">{item.question[locale]}</h3>
              <PlusIcon size={20} className="shrink-0 transition-transform duration-150 group-open:rotate-45" />
            </summary>
            <p className="max-w-[44rem] pb-6 leading-[1.6] text-(--muted-text)">{item.answer[locale]}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
