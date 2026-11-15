import { useTranslations } from "next-intl";
import { KardenumSymbol } from "@/components/brand/kardenum-symbol";
import { Link } from "@/i18n/navigation";
import { Container } from "./container";

export const MAIN_CONTENT_ID = "contenido";

// Layout skeleton. The full menu (Servicios dropdown, ES / EN, Cotizar) and the mobile
// menu are built from maqueta B-Nav-escritorio in the components step.
export function SiteHeader() {
  const t = useTranslations("Layout");

  return (
    <>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only bg-bronze text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:px-4"
      >
        {t("skipToContent")}
      </a>
      <header className="bg-ink text-stone">
        <Container>
          <div className="flex items-center justify-between border-b border-line py-6">
            <Link href="/" className="inline-flex min-h-11 items-center gap-3">
              <KardenumSymbol size={26} variant="negative" />
              <span className="text-lg font-semibold tracking-[0.16em] uppercase font-stretch-[125%]">Kardenum</span>
            </Link>
          </div>
        </Container>
      </header>
    </>
  );
}
