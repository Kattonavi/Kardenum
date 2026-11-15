import { useTranslations } from "next-intl";
import { KardenumSymbol } from "@/components/brand/kardenum-symbol";
import { Container } from "./container";

// Rendered at build time, so the year is the build year.
const YEAR = new Date().getFullYear();

// Layout skeleton from maqueta B-404. Privacy and Terms links arrive with the legal pages;
// the Minecraft and Discord notices with their pages.
export function SiteFooter() {
  const t = useTranslations("Layout");

  return (
    <footer className="bg-ink text-stone">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line pt-7 pb-10">
          <span className="inline-flex items-center gap-2.5">
            <KardenumSymbol size={18} variant="negative" />
            <span className="text-sm font-semibold tracking-[0.16em] uppercase font-stretch-[125%]">Kardenum</span>
          </span>
          <span className="font-mono text-xs tracking-[0.1em] text-ash uppercase">{t("lines")}</span>
          <span className="font-mono text-xs tracking-[0.1em] text-ash uppercase">© {YEAR} Kardenum</span>
        </div>
      </Container>
    </footer>
  );
}
