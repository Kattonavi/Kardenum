import { getTranslations } from "next-intl/server";
import { KardenumSymbol } from "@/components/brand/kardenum-symbol";
import { AppLink } from "@/components/ui/app-link";
import { getPageName } from "@/content/pages";
import { serviceLines } from "@/content/service-lines";
import type { AppLocale } from "@/i18n/locales";
import { entryNotices } from "@/lib/entries";
import { type AppPathname, isListed } from "@/routes";
import { Container } from "./container";
import { FooterNotices } from "./footer-notices";

// Rendered at build time, so the year is the build year.
const YEAR = new Date().getFullYear();

/** The main pages, for the navigation shown when the phone menu cannot open. The five lines follow in the footer itself. */
const FALLBACK_LINKS: readonly AppPathname[] = ["/servicios", "/nosotros", "/contacto"];

const footerLinkClass = "inline-flex min-h-11 min-w-11 items-center transition-colors duration-150 hover:text-stone";

/**
 * Site footer (docs/handoff/fase-2/maquetas; spec 012, RF-40): brand, the five lines, the
 * questions page, legal links and the year. The trademark notices stay, each on the pages of its
 * line only (spec 008).
 * The lines are links: the footer is also where the phone menu control leads before its script runs.
 */
export async function SiteFooter({ locale }: { locale: AppLocale }) {
  const [t, nav] = await Promise.all([getTranslations({ locale, namespace: "Footer" }), getTranslations({ locale, namespace: "Nav" })]);

  return (
    <footer className="surface-ink">
      <Container>
        <div className="flex flex-col gap-5 border-t border-line pt-7 pb-10">
          {/* Where the phone menu control leads before its script runs (or if it never loads). It is
              shown only when it is the target of that link: with the script, the menu opens instead. */}
          <nav id={t("id")} aria-label={nav("label")} className="hidden flex-wrap gap-x-6 border-b border-line pb-5 target:flex">
            {FALLBACK_LINKS.map((pathname) => (
              <AppLink key={pathname} href={pathname} className="inline-flex min-h-11 min-w-11 items-center text-lg tracking-[0.08em] type-display transition-colors duration-150 hover:text-(--accent-text)">
                {getPageName(pathname)[locale]}
              </AppLink>
            ))}
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            <span className="inline-flex items-center gap-2.5">
              <KardenumSymbol size={18} variant="negative" />
              <span className="text-sm tracking-[0.16em] type-display">Kardenum</span>
            </span>
            <nav aria-label={t("linesLabel")}>
              <ul className="flex flex-wrap items-center gap-x-5.5 font-mono text-xs tracking-[0.1em] text-(--muted-text) uppercase">
                {serviceLines.map((line) => (
                  <li key={line.id}>
                    <AppLink href={line.pathname} className={footerLinkClass}>
                      {line.shortName[locale]}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-wrap items-center gap-x-5.5 font-mono text-xs tracking-[0.1em] text-(--muted-text) uppercase">
              <nav aria-label={t("legalLabel")} className="flex flex-wrap gap-x-5.5">
                <AppLink href="/preguntas-frecuentes" className={footerLinkClass}>
                  {t("faq")}
                </AppLink>
                {isListed("/guias") ? (
                  <AppLink href="/guias" className={footerLinkClass}>
                    {t("guides")}
                  </AppLink>
                ) : null}
                <AppLink href="/legal/privacidad" className={footerLinkClass}>
                  {t("privacy")}
                </AppLink>
                <AppLink href="/legal/terminos" className={footerLinkClass}>
                  {t("terms")}
                </AppLink>
              </nav>
              <span>© {YEAR} Kardenum</span>
            </div>
          </div>
          {/* Only the entries this build generates, and only the ones with a notice, reach the browser. */}
          <FooterNotices entries={entryNotices()} texts={{ minecraft: t("minecraftNotice"), discord: t("discordNotice") }} />
        </div>
      </Container>
    </footer>
  );
}
