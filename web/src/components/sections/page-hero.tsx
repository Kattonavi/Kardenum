import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { TitleLines } from "@/components/ui/title-lines";

type PageHeroProps = {
  /** Small label above the title, e.g. "I · Desarrollo". */
  label: string;
  titleLines: readonly string[];
  titleAccent?: string;
  text: string;
  /** "large" is the title of the community landings (Minecraft, Discord). */
  size?: "base" | "large";
  /** Vertical padding of the hero block; the default is the one of the line pages. */
  spacing?: string;
  /** Line pages set their title a little tighter (1.02) than the other pages (1.05). */
  tight?: boolean;
  /** Breadcrumbs, above the hero. */
  before?: ReactNode;
  /** Buttons under the text. */
  actions?: ReactNode;
  /** Decorative piece next to the title. */
  visual?: ReactNode;
  /** Strip under the hero, inside the same ink band. */
  after?: ReactNode;
};

const TITLE_SIZE = {
  base: "text-[clamp(1.875rem,4.6vw,3.625rem)]",
  large: "text-[clamp(2.125rem,5.4vw,4.25rem)]",
} as const;

// Opening band of an inner page (maquetas B-Linea-*): type and color only, on ink.
export function PageHero({
  label,
  titleLines,
  titleAccent,
  text,
  size = "base",
  spacing = "pt-10 pb-24",
  tight = false,
  before,
  actions,
  visual,
  after,
}: PageHeroProps) {
  return (
    <section className="surface-ink">
      <Container>
        {before}
        <div className={`flex flex-wrap items-center gap-x-16 gap-y-12 ${spacing}`}>
          <div className="flex min-w-0 flex-[3_1_32rem] flex-col gap-6">
            <p className="flex items-center gap-3 type-label text-(--muted-text)">
              <span aria-hidden="true" className="size-2 shrink-0 bg-bronze" />
              {label}
            </p>
            <h1 className={`${TITLE_SIZE[size]} ${tight ? "leading-[1.02]" : "leading-[1.05]"} tracking-[0.01em] type-display`}>
              <TitleLines lines={titleLines} accent={titleAccent} />
            </h1>
            <p className="max-w-[36rem] text-lg leading-[1.6] text-(--muted-text)">{text}</p>
            {actions ? <div className="flex flex-wrap gap-3 pt-2">{actions}</div> : null}
          </div>
          {visual}
        </div>
        {after}
      </Container>
    </section>
  );
}

/** The logo's bracket drawn in outline, with the accent square: the piece of the community landings. */
export function BracketVisual() {
  return (
    <div aria-hidden="true" className="flex flex-[1_1_16rem] justify-center">
      <svg viewBox="-24 -24 688 688" className="h-auto w-full max-w-[340px]" focusable="false">
        <path fill="none" stroke="var(--color-line)" strokeWidth="3" d="M0 0 L160 0 L160 80 L80 80 L80 560 L160 560 L160 640 L0 640 Z" />
        <path fill="none" stroke="var(--color-line)" strokeWidth="3" d="M526.86 0 L640 0 L320 320 L640 640 L526.86 640 L206.86 320 Z" />
        <path fill="none" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="6 10" d="M0 320 L640 320 M320 0 L320 640" />
        <path fill="var(--color-bronze)" d="M416 272 L512 272 L512 368 L416 368 Z" />
      </svg>
    </div>
  );
}

/** Strip of technologies, platforms or formats under the hero. The items are not interactive. */
export function HeroStrip({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-8 pb-12">
      <p id="hero-strip-label" className="type-label text-(--muted-text)">
        {label}
      </p>
      <ul aria-labelledby="hero-strip-label" className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="inline-flex min-h-9 items-center border border-line px-3.5 font-mono text-xs tracking-[0.1em] uppercase">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
