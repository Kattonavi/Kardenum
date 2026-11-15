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
  "inline-flex min-h-11 min-w-11 items-center justify-center text-[15px] transition-colors duration-150 hover:text-(--accent-text)";

/**
 * Site header (maquetas B-Nav-escritorio and B-Movil-menu): language bar, logo and menu.
 * From 1024 px: Servicios (dropdown), Portafolio (only when public), Nosotros, ES / EN and Cotizar.
 * Below: ES / EN and the button that opens the full-screen menu.
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
          <nav aria-label={nav("label")} className="relative flex items-center justify-between gap-x-3 border-b border-line py-4 lg:gap-x-8 lg:py-6">
            <AppLink href="/" aria-label={t("homeLink")} className="inline-flex min-h-11 items-center gap-2.5 lg:gap-3">
              <KardenumSymbol size={26} variant="negative" className="size-[22px] lg:size-[26px]" />
              <span className="text-[15px] tracking-[0.16em] type-display lg:text-lg">Kardenum</span>
            </AppLink>

            <div className="flex items-center gap-2 lg:gap-7">
              <div className="hidden lg:block">
                <ServicesMenu label={nav("services")} lines={lines} allServicesLabel={nav("allServices")} unsureLabel={nav("unsure")} />
              </div>
              {showPortfolio ? (
                <NavLink href="/portafolio" className={`${navLinkClass} max-lg:hidden`}>
                  {nav("portfolio")}
                </NavLink>
              ) : null}
              <NavLink href="/nosotros" className={`${navLinkClass} max-lg:hidden`}>
                {nav("about")}
              </NavLink>
              {/* Below 360 px there is no room for it next to the logo: the language choice stays inside the menu. */}
              <div className="max-[359px]:hidden">
                <LocaleSwitcher locale={locale} label={language("label")} names={languageNames} variant="compact" />
              </div>
              {/* Filled in bronze on the Contact page itself (maqueta B-Contacto). */}
              <NavLink
                href="/contacto"
                className="inline-flex min-h-11 items-center border px-5 text-xs tracking-[0.14em] type-display transition-colors duration-150 max-lg:hidden"
                currentClassName="border-bronze bg-bronze text-ink"
                idleClassName="border-stone hover:border-bronze hover:text-bronze"
              >
                {nav("quote")}
              </NavLink>
              <div className="lg:hidden">
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
