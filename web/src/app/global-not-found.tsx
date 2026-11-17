import type { Metadata, Viewport } from "next";
import Link from "next/link";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import { KardenumSymbol } from "@/components/brand/kardenum-symbol";
import { Container } from "@/components/layout/container";
import { AnalyticsScript } from "@/components/seo/analytics-script";
import { buttonClass } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { TitleLines } from "@/components/ui/title-lines";
import { getPageName } from "@/content/pages";
import { serviceLines } from "@/content/service-lines";
import { brand } from "@/lib/brand";
import { type AppPathname, isBuilt, isListed, localizedPath } from "@/routes";
import { archivo, jetbrainsMono } from "./fonts";
import "./globals.css";

// Served, with a real 404 status and full HTML, for every URL that matches no route (maqueta B-404).
//
// It replaces the [locale] layout, so it cannot know the language and cannot use the shared
// header and footer: those depend on next-intl's request context, and with them Next falls
// back to its empty error shell. Header and footer here are static, with plain links to pages
// that exist. Spanish first, as in the mockup, plus one line in English.
export const metadata: Metadata = {
  title: es.NotFound.metaTitle,
};

export const viewport: Viewport = { themeColor: brand.ink };

const CONTENT_ID = "contenido";
const YEAR = new Date().getFullYear();

const available = (pathname: AppPathname) => isBuilt(pathname) && isListed(pathname);
const href = (pathname: AppPathname) => localizedPath(pathname, "es");

/** Pages offered from here, in the order of the menu. Hidden or unbuilt pages are left out. */
const destinations = (
  [
    { pathname: "/servicios", name: getPageName("/servicios").es },
    { pathname: "/portafolio", name: es.Nav.portfolio },
    { pathname: "/guias", name: es.Footer.guides },
    { pathname: "/nosotros", name: getPageName("/nosotros").es },
    { pathname: "/contacto", name: getPageName("/contacto").es },
  ] satisfies { pathname: AppPathname; name: string }[]
).filter((destination) => available(destination.pathname));

const legalLinks = (
  [
    { pathname: "/preguntas-frecuentes", name: es.Footer.faq },
    { pathname: "/legal/privacidad", name: es.Footer.privacy },
    { pathname: "/legal/terminos", name: es.Footer.terms },
  ] satisfies { pathname: AppPathname; name: string }[]
).filter((link) => available(link.pathname));

const navLinkClass = "inline-flex min-h-11 min-w-11 items-center justify-center text-[0.9375rem] transition-colors duration-150 hover:text-(--accent-text)";

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-dvh flex-col surface-ink">
        <a
          href={`#${CONTENT_ID}`}
          className="sr-only bg-bronze text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:px-4"
        >
          {es.Layout.skipToContent}
        </a>

        {/* Same switch as the site header: by the header's width in rem, so large text gets the compact form. */}
        <header>
          <Container>
            <nav aria-label={es.Nav.label} className="flex items-center justify-between gap-x-3 border-b border-line py-4 @5xl:gap-x-8 @5xl:py-6">
              <Link href="/" aria-label={es.Layout.homeLink} className="inline-flex min-h-11 items-center gap-2.5 @5xl:gap-3">
                <KardenumSymbol size={26} variant="negative" className="size-[1.375rem] @5xl:size-[1.625rem]" />
                <span className="text-[0.9375rem] tracking-[0.16em] type-display whitespace-nowrap @5xl:text-lg @max-[22.5rem]:hidden">Kardenum</span>
              </Link>
              <div className="flex items-center gap-2 @5xl:gap-7">
                {available("/servicios") ? (
                  <Link href={href("/servicios")} className={`${navLinkClass} @max-5xl:hidden`}>
                    {es.Nav.services}
                  </Link>
                ) : null}
                {available("/nosotros") ? (
                  <Link href={href("/nosotros")} className={`${navLinkClass} @max-5xl:hidden`}>
                    {es.Nav.about}
                  </Link>
                ) : null}
                {/* This page is in Spanish; the English option leads to the English home page. */}
                <div role="group" aria-label={es.Language.label} className="flex items-center font-mono text-xs tracking-[0.1em] uppercase @max-5xl:hidden">
                  <span lang="es" title={es.Language.es} aria-current="true" className="inline-flex min-h-11 min-w-11 items-center justify-end pr-2">
                    es
                  </span>
                  <span aria-hidden="true" className="text-(--muted-text)">
                    /
                  </span>
                  <Link
                    href={localizedPath("/", "en")}
                    lang="en"
                    hrefLang="en"
                    title={en.Language.en}
                    className="inline-flex min-h-11 min-w-11 items-center justify-start pl-2 text-(--muted-text) transition-colors duration-150 hover:text-(--accent-text)"
                  >
                    en
                  </Link>
                </div>
                {available("/contacto") ? (
                  <Link
                    href={href("/contacto")}
                    className="nav-quote"
                  >
                    {es.Nav.quote}
                  </Link>
                ) : null}
              </div>
            </nav>
          </Container>
        </header>

        <main id={CONTENT_ID} tabIndex={-1} className="flex-1">
          <Container className="flex flex-col gap-7 pt-24 pb-28">
            <p className="flex items-center gap-3 type-label text-(--muted-text)">
              <span aria-hidden="true" className="size-2 shrink-0 bg-bronze" />
              {es.NotFound.label}
            </p>
            <h1 className="text-[clamp(2.125rem,5.4vw,4.25rem)] leading-[1.05] font-extrabold tracking-[0.01em] type-display">
              <TitleLines lines={[es.NotFound.titleLine]} accent={es.NotFound.titleAccent} />
            </h1>
            <p className="max-w-[36rem] text-lg leading-[1.6] text-(--muted-text)">{es.NotFound.body}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/" className={buttonClass.primary}>
                {es.NotFound.home}
              </Link>
              {available("/contacto") ? (
                <Link href={href("/contacto")} className={buttonClass.secondary}>
                  {es.NotFound.contact}
                </Link>
              ) : null}
            </div>
            {destinations.length > 0 ? (
              <ul aria-label={es.NotFound.linksLabel} className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3">
                {destinations.map((destination) => (
                  <li key={destination.pathname}>
                    <Link
                      href={href(destination.pathname)}
                      className="flex min-h-16 items-center justify-between gap-4 border border-line px-5 text-[0.8125rem] tracking-[0.12em] type-display transition-colors duration-150 hover:border-stone"
                    >
                      {destination.name}
                      <ArrowRightIcon size={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <p lang="en" className="mt-6 flex flex-wrap items-center gap-x-3 border-t border-line pt-6 text-(--muted-text)">
              {en.NotFound.title}
              <Link
                href={localizedPath("/", "en")}
                hrefLang="en"
                className="inline-flex min-h-11 items-center gap-2 text-stone underline underline-offset-4 transition-colors duration-150 hover:text-(--accent-text)"
              >
                {en.NotFound.home}
              </Link>
            </p>
          </Container>
        </main>

        <footer>
          <Container>
            <div className="flex flex-col gap-5 border-t border-line pt-7 pb-10">
              <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
                <span className="inline-flex items-center gap-2.5">
                  <KardenumSymbol size={18} variant="negative" />
                  <span className="text-sm tracking-[0.16em] type-display">Kardenum</span>
                </span>
                <nav aria-label={es.Footer.linesLabel}>
                  <ul className="label-row">
                    {serviceLines
                      .filter((line) => available(line.pathname))
                      .map((line) => (
                        <li key={line.id}>
                          <Link href={href(line.pathname)} className="quiet-link">
                            {line.shortName.es}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </nav>
                <div className="label-row">
                  {legalLinks.length > 0 ? (
                    <nav aria-label={es.Footer.legalLabel} className="flex flex-wrap gap-x-5.5">
                      {legalLinks.map((link) => (
                        <Link key={link.pathname} href={href(link.pathname)} className="quiet-link">
                          {link.name}
                        </Link>
                      ))}
                    </nav>
                  ) : null}
                  <span>© {YEAR} Kardenum</span>
                </div>
              </div>
            </div>
          </Container>
        </footer>
        <AnalyticsScript />
      </body>
    </html>
  );
}
