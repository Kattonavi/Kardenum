import { getTranslations } from "next-intl/server";
import { KardenumSymbol } from "@/components/brand/kardenum-symbol";
import { AppLink } from "@/components/ui/app-link";
import { serviceLines } from "@/content/service-lines";
import type { AppLocale } from "@/i18n/locales";
import { isListed } from "@/routes";
import { Container } from "./container";
import { FooterNotices } from "./footer-notices";

// Rendered at build time, so the year is the build year.
const YEAR = new Date().getFullYear();

const legalLinkClass = "inline-flex min-h-11 min-w-11 items-center justify-center transition-colors duration-150 hover:text-stone";

/**
 * Site footer (maquetas B-Gremio-inicio-v2, B-Linea-Minecraft and B-Linea-Discord): brand, the
 * five lines, legal links and the trademark notices (Minecraft on every page, Discord on its pages).
 */
export async function SiteFooter({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Footer" });

  return (
    <footer className="surface-ink">
      <Container>
        <div className="flex flex-col gap-5 border-t border-line pt-7 pb-10">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            <span className="inline-flex items-center gap-2.5">
              <KardenumSymbol size={18} variant="negative" />
              <span className="text-sm tracking-[0.16em] type-display">Kardenum</span>
            </span>
            <span className="font-mono text-xs tracking-[0.1em] text-(--muted-text) uppercase">
              {serviceLines.map((line) => line.shortName[locale]).join(" · ")}
            </span>
            <div className="flex flex-wrap items-center gap-x-5 font-mono text-xs tracking-[0.1em] text-(--muted-text) uppercase">
              <nav aria-label={t("legalLabel")} className="flex flex-wrap gap-x-5">
                {isListed("/guias") ? (
                  <AppLink href="/guias" className={legalLinkClass}>
                    {t("guides")}
                  </AppLink>
                ) : null}
                <AppLink href="/legal/privacidad" className={legalLinkClass}>
                  {t("privacy")}
                </AppLink>
                <AppLink href="/legal/terminos" className={legalLinkClass}>
                  {t("terms")}
                </AppLink>
              </nav>
              <span>© {YEAR} Kardenum</span>
            </div>
          </div>
          <FooterNotices texts={{ minecraft: t("minecraftNotice"), discord: t("discordNotice") }} />
        </div>
      </Container>
    </footer>
  );
}
