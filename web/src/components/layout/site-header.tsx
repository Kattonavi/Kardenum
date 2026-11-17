import { getTranslations } from "next-intl/server";
import { KardenumSymbol } from "@/components/brand/kardenum-symbol";
import { AppLink } from "@/components/ui/app-link";
import { type AppLocale, otherLocale } from "@/i18n/locales";
import { contactChannels, quoteFormHref } from "@/lib/contact";
import { builtEntries, entryLinks } from "@/lib/entries";
import { entryLinkKey, isListed } from "@/routes";
import { Container } from "./container";
import { LanguageBar } from "./language-bar";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";
import { getNavLines } from "./nav-data";
import { ServicesMenu } from "./services-menu";

export const MAIN_CONTENT_ID = "contenido";

const navLinkClass = "nav-link";

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
  const [t, nav, language, offer, channels, contact, footer] = await Promise.all([
    getTranslations({ locale, namespace: "Layout" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Language" }),
    // The bar speaks the language it offers.
    getTranslations({ locale: offered, namespace: "Language" }),
    getTranslations({ locale, namespace: "Channels" }),
    getTranslations({ locale, namespace: "ContactPage" }),
    getTranslations({ locale, namespace: "Footer" }),
  ]);
  const lines = getNavLines(locale);
  const showPortfolio = isListed("/portafolio");
  const languageNames = { es: language("es"), en: language("en") };
  // Only entries that are built (published cases); private ones never get here.
  const entries = entryLinks();
  const portfolioEntries = builtEntries()
    .filter((entry) => entry.collection === "/portafolio/[slug]")
    .map((entry) => entryLinkKey(locale, entry.slug[locale]));

  return (
    <>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="skip-link"
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
          entries={entries}
        />
        <Container>
          <nav aria-label={nav("label")} className="header-row">
            <AppLink href="/" aria-label={t("homeLink")} className="inline-flex min-h-11 items-center gap-2.5 @5xl:gap-3">
              <KardenumSymbol size={26} variant="negative" className="size-[1.375rem] @5xl:size-[1.625rem]" />
              {/* With very large text on a narrow screen the symbol alone stays; the link keeps its name. */}
              <span className="wordmark">Kardenum</span>
            </AppLink>

            <div className="flex items-center gap-2 @5xl:gap-7">
              <div className="hidden @5xl:block">
                <ServicesMenu label={nav("services")} lines={lines} allServicesLabel={nav("allServices")} unsureLabel={nav("unsure")} />
              </div>
              {showPortfolio ? (
                <NavLink href="/portafolio" sectionEntries={portfolioEntries} className={`${navLinkClass} @max-5xl:hidden`}>
                  {nav("portfolio")}
                </NavLink>
              ) : null}
              <NavLink href="/nosotros" className={`${navLinkClass} @max-5xl:hidden`}>
                {nav("about")}
              </NavLink>
              {/* Below 22.5rem (360 px) there is no room for it next to the logo: the language choice stays inside the menu. */}
              <div className="@max-[22.5rem]:hidden">
                <LocaleSwitcher locale={locale} label={language("label")} names={languageNames} variant="compact" entries={entries} />
              </div>
              {/* Filled in bronze on the Contact page itself (maqueta B-Contacto). */}
              <NavLink
                href="/contacto"
                className="nav-quote @max-5xl:hidden"
                currentClassName="border-bronze bg-bronze text-ink"
                idleClassName="border-stone hover:border-bronze hover:text-bronze"
              >
                {nav("quote")}
              </NavLink>
              {/* The menu hides its own control in the full header; its dialog must never be inside a hidden element. */}
              <MobileMenu
                locale={locale}
                lines={lines}
                showPortfolio={showPortfolio}
                footerId={footer("id")}
                  languageNames={languageNames}
                  entries={entries}
                  channels={contactChannels.map((channel) => ({
                    channel,
                    label: channels(channel),
                    href: channel === "whatsapp" ? quoteFormHref(locale, contact("quoteId")) : undefined,
                  }))}
                  labels={{
                    open: nav("openMenu"),
                    footerNav: nav("footerNav"),
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
          </nav>
        </Container>
      </header>
    </>
  );
}
