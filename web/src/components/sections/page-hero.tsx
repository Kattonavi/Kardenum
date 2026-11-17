import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { TitleLines } from "@/components/ui/title-lines";

type PageHeroProps = {
  /** Small label above the title, e.g. "I · Desarrollo". */
  label: string;
  titleLines: readonly string[];
  titleAccent?: string;
  /** The title in the lines it takes next to the scene (spec 013, RF-21); it goes with `visual`. */
  titleBeside?: readonly string[];
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
  /** The piece next to the title: the scene of the line (HeroScene). It goes under the text on a narrow window. */
  visual?: ReactNode;
  /** Strip under the hero, inside the same ink band. */
  after?: ReactNode;
};

// The smallest size is 29 px, one less than in the first mockups: at weight 800 the longest word of
// a title ("DEVELOPMENT") was 3 px wider than a 320 px screen.
const TITLE_SIZE = {
  base: "text-[clamp(1.8125rem,4.6vw,3.625rem)]",
  large: "text-[clamp(2.125rem,5.4vw,4.25rem)]",
} as const;

/**
 * Next to a scene the title is sized by its column, so it breaks in the same lines at every
 * width (spec 013, RF-21). A title whose longest line is longer than this takes the smaller of
 * the two sizes: measured in the title face, 17 letters are the widest line the larger one holds.
 */
const LONG_LINE = 17;

// Opening band of an inner page (maquetas B-Linea-*), on ink. With a scene it is two columns
// on a wide window: the text on the left (55 %) and the scene on the right (spec 012, RF-51;
// spec 013, RF-20).
export function PageHero({
  label,
  titleLines,
  titleAccent,
  titleBeside,
  text,
  size = "base",
  spacing = "pt-10 pb-24",
  tight = false,
  before,
  actions,
  visual,
  after,
}: PageHeroProps) {
  const split = Boolean(visual);
  const besideSize = titleBeside && Math.max(...titleBeside.map((line) => line.length)) > LONG_LINE ? "title-beside title-beside-long" : "title-beside";

  return (
    <section className="surface-ink">
      <Container>
        {before}
        <div className={`${split ? "hero-split" : "flex flex-wrap items-center gap-x-16 gap-y-12"} ${spacing}`}>
          <div className={split ? "hero-text" : "flex min-w-0 flex-[3_1_32rem] flex-col gap-6"}>
            <p className="flex items-center gap-3 type-label text-(--muted-text)">
              <span aria-hidden="true" className="size-2 shrink-0 bg-bronze" />
              {label}
            </p>
            <h1 className={`${split ? besideSize : TITLE_SIZE[size]} ${tight ? "leading-[1.02]" : "leading-[1.05]"} font-extrabold tracking-[0.01em] type-display`}>
              <TitleLines lines={titleLines} accent={titleAccent} beside={split ? titleBeside : undefined} />
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
