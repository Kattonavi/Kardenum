import { getTranslations } from "next-intl/server";
import { KardenumSymbol } from "@/components/brand/kardenum-symbol";
import { AppLink } from "@/components/ui/app-link";
import { type AppLocale, otherLocale } from "@/i18n/locales";
import { contactChannels, quoteFormHref } from "@/lib/contact";
import { isListed } from "@/routes";
import { Container } from "./container";
import { LanguageBar } from "./language-bar";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";
import { getNavLines } from "./nav-data";
import { ServicesMenu } from "./services-menu";

export const MAIN_CONTENT_ID = "contenido";

const navLinkClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center text-[0.9375rem] transition-colors duration-150 hover:text-(--accent-text)";

/**
 * Site header (maquetas B-Nav-escritorio and B-Movil-menu): language bar, logo and menu.
 * Full header: Servicios (dropdown), Portafolio (only when public), Nosotros, ES / EN and Cotizar.
 * Compact header: ES / EN and the button that opens the full-screen menu.
 *
 * The switch is a container query on the header's width in rem (64rem = 1024 px at the default
 * text size), not a viewport breakpoint, and the header's type is in rem. The header is declared
 * a query container in globals.css, together with main and footer. With the text at 200 %
 * (WCAG 1.4.4) the compact header takes over before anything overflows; a viewport media query
 * does not notice the root font size.
 */
export async function SiteHeader({ locale }: { locale: AppLocale }) {
  const offered = otherLocale(locale);
  const [t, nav, language, offer, channels, contact] = await Promise.all([
    getTranslations({ locale, namespace: "Layout" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Language" }),
    // The bar speaks the language it offers.
    getTranslations({ locale: offered, namespace: "Language" }),
    getTranslations({ locale, namespace: "Channels" }),
    getTranslations({ locale, namespace: "ContactPage" }),
  ]);
  const lines = getNavLines(locale);
  const showPortfolio = isListed("/portafolio");
  const languageNames = { es: language("es"), en: language("en") };

  return (
    <>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only bg-bronze text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:px-4"
      >
        {t("skipToContent")}
      </a>
      <header className="relative z-30 surface-ink">
        <LanguageBar
          locale={locale}
          offered={offered}
          regionLabel={offer("label")}
          text={offer("offerText")}
          action={offer("offerAction")}
          dismissLabel={offer("offerDismiss")}
        />
        <Container>
          <nav aria-label={nav("label")} className="relative flex items-center justify-between gap-x-3 border-b border-line py-4 @5xl:gap-x-8 @5xl:py-6">
            <AppLink href="/" aria-label={t("homeLink")} className="inline-flex min-h-11 items-center gap-2.5 @5xl:gap-3">
              <KardenumSymbol size={26} variant="negative" className="size-[1.375rem] @5xl:size-[1.625rem]" />
              {/* With very large text on a narrow screen the symbol alone stays; the link keeps its name. */}
              <span className="text-[0.9375rem] tracking-[0.16em] type-display whitespace-nowrap @5xl:text-lg @max-[15rem]:hidden">Kardenum</span>
            </AppLink>

            <div className="flex items-center gap-2 @5xl:gap-7">
              <div className="hidden @5xl:block">
                <ServicesMenu label={nav("services")} lines={lines} allServicesLabel={nav("allServices")} unsureLabel={nav("unsure")} />
              </div>
              {showPortfolio ? (
                <NavLink href="/portafolio" className={`${navLinkClass} @max-5xl:hidden`}>
                  {nav("portfolio")}
                </NavLink>
              ) : null}
              <NavLink href="/nosotros" className={`${navLinkClass} @max-5xl:hidden`}>
                {nav("about")}
              </NavLink>
              {/* Below 22.5rem (360 px) there is no room for it next to the logo: the language choice stays inside the menu. */}
              <div className="@max-[22.5rem]:hidden">
                <LocaleSwitcher locale={locale} label={language("label")} names={languageNames} variant="compact" />
              </div>
              {/* Filled in bronze on the Contact page itself (maqueta B-Contacto). */}
              <NavLink
                href="/contacto"
                className="inline-flex min-h-11 items-center border px-5 text-xs tracking-[0.14em] type-display transition-colors duration-150 @max-5xl:hidden"
                currentClassName="border-bronze bg-bronze text-ink"
                idleClassName="border-stone hover:border-bronze hover:text-bronze"
              >
                {nav("quote")}
              </NavLink>
              <div className="@5xl:hidden">
                <MobileMenu
                  locale={locale}
                  lines={lines}
                  showPortfolio={showPortfolio}
                  languageNames={languageNames}
                  channels={contactChannels.map((channel) => ({
                    channel,
                    label: channels(channel),
                    href: channel === "whatsapp" ? quoteFormHref(locale, contact("quoteId")) : undefined,
                  }))}
                  labels={{
                    open: nav("openMenu"),
                    close: nav("closeMenu"),
                    menu: nav("menuTitle"),
                    nav: nav("label"),
                    home: t("homeLink"),
                    services: nav("services"),
                    allServices: nav("allServicesShort"),
                    portfolio: nav("portfolio"),
                    about: nav("about"),
                    quote: nav("quoteProject"),
                    language: language("label"),
                    channels: channels("label"),
                  }}
                />
              </div>
            </div>
          </nav>
        </Container>
      </header>
    </>
  );
}
