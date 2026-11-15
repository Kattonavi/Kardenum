"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { type AppLocale, locales } from "@/i18n/locales";
import { rememberLanguage } from "@/lib/language-choice";

type LocaleSwitcherProps = {
  locale: AppLocale;
  /** Accessible name of the group, e.g. "Idioma". */
  label: string;
  /** Language names in their own language: { es: "Español", en: "English" }. */
  names: Record<AppLocale, string>;
  variant: "compact" | "buttons";
};

/**
 * ES / EN. Each option leads to the same page in that language (never to the home page)
 * and the choice is remembered, so the language bar stops offering the other version.
 */
export function LocaleSwitcher({ locale, label, names, variant }: LocaleSwitcherProps) {
  const pathname = usePathname();

  if (variant === "buttons") {
    return (
      <div role="group" aria-label={label} className="flex gap-2">
        {locales.map((option) => {
          const current = option === locale;
          return (
            <Link
              key={option}
              href={pathname}
              locale={option}
              lang={option}
              hrefLang={option}
              aria-current={current ? "true" : undefined}
              onClick={() => rememberLanguage(option)}
              className={`inline-flex min-h-11 flex-1 items-center justify-center border font-mono text-xs tracking-[0.1em] uppercase transition-colors duration-150 ${
                current ? "border-stone bg-stone text-ink" : "border-line text-stone hover:border-stone"
              }`}
            >
              {names[option]}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div role="group" aria-label={label} className="flex items-center font-mono text-xs tracking-[0.1em]">
      {locales.map((option, index) => {
        const current = option === locale;
        return (
          <span key={option} className="flex items-center">
            {index > 0 ? (
              <span aria-hidden="true" className="text-(--muted-text)">
                /
              </span>
            ) : null}
            <Link
              href={pathname}
              locale={option}
              lang={option}
              hrefLang={option}
              title={names[option]}
              aria-current={current ? "true" : undefined}
              onClick={() => rememberLanguage(option)}
              className={`inline-flex min-h-11 min-w-11 items-center uppercase transition-colors duration-150 hover:text-(--accent-text) ${
                index === 0 ? "justify-end pr-2" : "justify-start pl-2"
              } ${current ? "" : "text-(--muted-text)"}`}
            >
              {option}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
