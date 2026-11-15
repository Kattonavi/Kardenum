import Image from "next/image";
import { KardenumSymbol } from "@/components/brand/kardenum-symbol";
import type { CasePiece, CaseValue, CaseVisual } from "@/content/types";
import type { AppLocale } from "@/i18n/locales";
import { isPendingRef, pendingNote } from "@/lib/portfolio";
import { getCaseImage } from "./case-images";

// Pictures of the portfolio (maquetas B-Portafolio and B-Caso). A pending picture is a box with
// its note, as the mockups draw the ones that do not exist yet. No rounded corners, no inline
// styles (the content policy is style-src 'self'): colors of a palette are SVG fills.

const placeholderFill = "border border-mist bg-[#e4e3dd]";
const noteClass = "font-mono text-[0.6875rem] leading-normal tracking-[0.14em] text-graphite uppercase";
const pieceLabelClass = "font-mono text-[0.6875rem] tracking-[0.14em] text-graphite uppercase";

function PendingBox({ note, ratio }: { note: string; ratio: "aspect-4/3" | "aspect-video" }) {
  return (
    <div className={`flex ${ratio} items-center justify-center p-6 text-center ${placeholderFill}`}>
      <span className={noteClass}>{note}</span>
    </div>
  );
}

function CaseImage({ visual, locale, sizes, preload = false }: { visual: Extract<CaseVisual, { kind: "image" }>; locale: AppLocale; sizes: string; preload?: boolean }) {
  return <Image src={getCaseImage(visual.image)} alt={visual.alt[locale]} sizes={sizes} preload={preload} className="size-full object-cover" />;
}

/** Picture of a card in the index (4:3). */
export function CaseCover({ cover, locale }: { cover: CaseValue<CaseVisual>; locale: AppLocale }) {
  if (isPendingRef(cover)) return <PendingBox note={pendingNote(cover, locale)} ratio="aspect-4/3" />;
  if (cover.kind === "image") {
    return (
      <div className="aspect-4/3 overflow-hidden bg-ink">
        <CaseImage visual={cover} locale={locale} sizes="(min-width: 75rem) 22rem, (min-width: 48rem) 50vw, 100vw" />
      </div>
    );
  }
  return (
    <div className="flex aspect-4/3 items-center justify-center bg-ink">
      <div role="img" aria-label={cover.alt[locale]}>
        <KardenumSymbol size={96} variant="negative" className="size-24" />
      </div>
    </div>
  );
}

/** Main picture of a case page (16:9). The symbol of a brand case goes with its name, as in the mockup. */
export function CaseHeroVisual({ hero, name, locale }: { hero: CaseValue<CaseVisual>; name: string; locale: AppLocale }) {
  if (isPendingRef(hero)) return <PendingBox note={pendingNote(hero, locale)} ratio="aspect-video" />;
  if (hero.kind === "image") {
    return (
      <div className="aspect-video overflow-hidden bg-ink">
        {/* The first picture of the page: requested early, it is usually the largest paint. */}
        <CaseImage visual={hero} locale={locale} sizes="(min-width: 75rem) 70rem, 100vw" preload />
      </div>
    );
  }
  return (
    <div className="flex aspect-video flex-wrap content-center items-center justify-center gap-x-10 gap-y-5 bg-ink p-6 text-stone">
      <div role="img" aria-label={hero.alt[locale]}>
        <KardenumSymbol size={112} variant="negative" className="size-28" />
      </div>
      <span className="text-[clamp(1.5rem,4.6vw,3.5rem)] leading-none tracking-[0.14em] type-display">{name}</span>
    </div>
  );
}

/** One piece of the gallery (4:3). */
export function CasePieceView({ piece, locale }: { piece: CasePiece; locale: AppLocale }) {
  switch (piece.kind) {
    case "pending":
      return <PendingBox note={pendingNote(piece.ref, locale)} ratio="aspect-4/3" />;
    case "image":
      return (
        <div className="aspect-4/3 overflow-hidden bg-[#e4e3dd]">
          <CaseImage visual={piece} locale={locale} sizes="(min-width: 75rem) 34rem, 100vw" />
        </div>
      );
    case "mark":
      return (
        <div className="flex aspect-4/3 items-center justify-center bg-[#e4e3dd]">
          <div role="img" aria-label={piece.alt[locale]}>
            <KardenumSymbol size={160} variant="positive" className="size-40" />
          </div>
        </div>
      );
    case "palette":
      return (
        <div className="flex aspect-4/3 flex-col justify-center gap-5 border border-mist p-8">
          <span className={pieceLabelClass}>{piece.title[locale]}</span>
          {/* Columns of at least 3.5rem: five in a row on wide screens, wrapping on narrow ones and with large text. */}
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(3.5rem,1fr))] gap-3">
            {piece.colors.map((color) => (
              <li key={color} className="flex flex-col gap-2">
                <svg viewBox="0 0 1 1" aria-hidden="true" focusable="false" className={`aspect-square h-auto w-full ${color.toLowerCase() === "#f4f4f1" ? "border border-mist" : ""}`}>
                  <rect width="1" height="1" fill={color} />
                </svg>
                <span className="font-mono text-[0.6875rem] text-graphite">{color}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "typeface":
      return (
        <div className="flex aspect-4/3 flex-col justify-center gap-4 border border-mist p-8">
          <span className={pieceLabelClass}>{piece.title[locale]}</span>
          <span className="text-[clamp(2rem,4.4vw,3.5rem)] leading-none tracking-[0.04em] type-display">{piece.name}</span>
          <span className="text-xl leading-[1.4]">{piece.sample}</span>
          <span className="font-mono text-xs tracking-[0.14em] text-graphite uppercase">{piece.secondary}</span>
        </div>
      );
  }
}
