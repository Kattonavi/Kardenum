import { serviceLines } from "@/content/service-lines";
import type { AppLocale } from "@/i18n/locales";
import { type AppPathname, isListed } from "@/routes";

export type NavSubpage = { href: AppPathname; label: string };

export type NavLine = {
  numeral: string;
  name: string;
  summary: string;
  href: AppPathname;
  /** Only sub-pages that are public; hidden ones never reach the menu. */
  subpages: NavSubpage[];
};

/** The five service lines for the menus, in one language. Plain data, so it can cross to client components. */
export function getNavLines(locale: AppLocale): NavLine[] {
  return serviceLines.map((line) => ({
    numeral: line.numeral,
    name: line.name[locale],
    summary: line.summary[locale],
    href: line.pathname,
    subpages: line.subpages
      .filter((subpage) => isListed(subpage.pathname))
      .map((subpage) => ({ href: subpage.pathname, label: subpage.label[locale] })),
  }));
}
