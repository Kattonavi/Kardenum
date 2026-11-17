import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { MotionToggle } from "@/components/scenes/motion-toggle";
import { Scene } from "@/components/scenes/scene";
import { AppLink } from "@/components/ui/app-link";
import { buttonClass } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { ServiceLine, ServiceLineId } from "@/content/types";
import type { AppLocale } from "@/i18n/locales";

type LineCardProps = {
  line: ServiceLine;
  locale: AppLocale;
  /** Level of the name of the line: 3 under a section title (home), 2 where the cards are the sections (services index). */
  headingLevel: 2 | 3;
  /** Extra content between the sentence and the button (links to the public sub-pages of the line). */
  children?: ReactNode;
  className?: string;
};

/**
 * A service line as a card (docs/handoff/fase-2/maquetas; spec 012, RF-33 and RF-50): its scene
 * on top, numeral, name, the sentence the whole site uses for the line and the button that names
 * where it leads. The whole card is the link: the button stretches over it (its ::after covers
 * the card), so the link keeps a short name ("Ver Minecraft") instead of the whole card's text.
 * It is a list item: the parent provides the list.
 */
export function LineCard({ line, locale, headingLevel, children, className = "" }: LineCardProps) {
  const t = useTranslations("Home");
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <li className={className ? `reveal line-card ${className}` : "reveal line-card"}>
      <Scene line={line.id} bare />
      <div className="line-card-body">
        <span aria-hidden="true" className="numeral">
          {line.numeral}
        </span>
        <Heading className="title-card">{line.name[locale]}</Heading>
        <p className="text-[0.9375rem] leading-normal text-(--muted-text)">{line.summary[locale]}</p>
        {children}
        <AppLink href={line.pathname} className={`${buttonClass.line} mt-auto self-start after:absolute after:inset-0`}>
          {t("viewLine", { name: line.name[locale] })}
          <ArrowRightIcon size={14} />
        </AppLink>
      </div>
    </li>
  );
}

/**
 * The scene of a line next to the title of its page, with the control that pauses it (spec 012,
 * RF-51, RF-52 and RF-15): the right column of the first screen on a wide window, under the text
 * on a phone.
 */
export function HeroScene({ line }: { line: ServiceLineId }) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Scene line={line} />
      <MotionToggle className="self-start" />
    </div>
  );
}
