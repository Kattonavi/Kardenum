"use client";

import Link from "next/link";
import { ArrowRightIcon, CloseIcon } from "@/components/ui/icons";
import { usePathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/locales";
import { hideLanguageOffer, rememberLanguage } from "@/lib/language-choice";
import { pathInLocale } from "@/routes";
import { Container } from "./container";

type LanguageBarProps = {
  /** Language of the page. */
  locale: AppLocale;
  /** Language being offered; every text of the bar is written in it. */
  offered: AppLocale;
  regionLabel: string;
  text: string;
  action: string;
  dismissLabel: string;
};

/**
 * Offers the other language without redirecting (docs/specs/001-barra-de-idioma.md).
 * It is rendered on every page but stays hidden unless the inline script in the layout
 * marked <html> before the first paint, so it never shifts the page.
 */
export function LanguageBar({ locale, offered, regionLabel, text, action, dismissLabel }: LanguageBarProps) {
  const pathname = usePathname();

  function dismiss() {
    rememberLanguage(locale);
    hideLanguageOffer();
  }

  return (
    <div role="region" aria-label={regionLabel} lang={offered} className="hidden surface-stone lang-offer:block">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
        <p className="text-[15px] leading-normal">{text}</p>
        <div className="flex items-center gap-2">
          <Link
            href={pathInLocale(pathname, offered)}
            hrefLang={offered}
            onClick={() => rememberLanguage(offered)}
            className="inline-flex min-h-11 items-center gap-2 border border-ink px-4 text-xs tracking-[0.12em] type-display transition-colors duration-150 hover:bg-ink hover:text-stone"
          >
            {action}
            <ArrowRightIcon size={16} />
          </Link>
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={dismiss}
            className="inline-flex size-11 cursor-pointer items-center justify-center transition-colors duration-150 hover:text-(--accent-text)"
          >
            <CloseIcon size={18} />
          </button>
        </div>
      </Container>
    </div>
  );
}
