import { Fragment } from "react";
import { AppLink } from "@/components/ui/app-link";
import { getPageName } from "@/content/pages";
import type { AppLocale } from "@/i18n/locales";
import { type AppPathname, breadcrumbTrail } from "@/routes";

type BreadcrumbsProps = {
  pathname: AppPathname;
  locale: AppLocale;
  /** Accessible name of the navigation, e.g. "Ruta". */
  label: string;
  /** A collection entry under `pathname` (a portfolio case): it closes the trail as the page on screen. */
  entry?: { readonly name: string };
};

/** Path of an inner page, from the home page down (maquetas B-Linea-*). Sits on the ink band. */
export function Breadcrumbs({ pathname, locale, label, entry }: BreadcrumbsProps) {
  const trail = breadcrumbTrail(pathname);

  return (
    <nav aria-label={label} className="pt-7">
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs tracking-[0.1em] uppercase">
        {trail.map((crumb, index) => {
          const name = getPageName(crumb)[locale];
          const last = !entry && index === trail.length - 1;
          return (
            <Fragment key={crumb}>
              <li>
                {last ? (
                  <span aria-current="page" className="inline-flex min-h-11 items-center">
                    {name}
                  </span>
                ) : (
                  <AppLink
                    href={crumb}
                    className="inline-flex min-h-11 min-w-11 items-center text-(--muted-text) transition-colors duration-150 hover:text-(--accent-text)"
                  >
                    {name}
                  </AppLink>
                )}
              </li>
              {last ? null : (
                <li aria-hidden="true" className="text-graphite">
                  /
                </li>
              )}
            </Fragment>
          );
        })}
        {/* Every page of the trail above already closed with its separator: the entry adds none. */}
        {entry ? (
          <li>
            <span aria-current="page" className="inline-flex min-h-11 items-center">
              {entry.name}
            </span>
          </li>
        ) : null}
      </ol>
    </nav>
  );
}
