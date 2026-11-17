import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { MotionToggle } from "@/components/scenes/motion-toggle";
import { Scene } from "@/components/scenes/scene";
import { serviceLines } from "@/content/service-lines";
import type { ServiceLine } from "@/content/types";
import type { AppLocale } from "@/i18n/locales";
// The styles of the carousel travel with the ones of the scenes, in one sheet (spec 013, RF-40).
import "@/app/motion.css";

/**
 * Carousel of the home page (spec 012, RF-20 to RF-25; styles and movement in
 * src/app/carousel.css): the five scenes, one in the centre and its neighbours at the sides.
 *
 * Server component, no script. The row holds a copy of the last scene before the five and copies
 * of the first two after them, so the animation can start again without a visible jump; the
 * copies are hidden from screen readers. The row of scenes takes keyboard focus: focus pauses
 * it, and with reduced motion it is the strip the visitor moves by hand.
 */
export function SceneCarousel({ locale }: { locale: AppLocale }) {
  const t = useTranslations("Carousel");
  const [first, second] = serviceLines;
  const last = serviceLines.at(-1);
  if (!first || !second || !last) throw new Error("The carousel needs the service lines.");
  const slides: readonly { line: ServiceLine; copy: boolean }[] = [
    { line: last, copy: true },
    ...serviceLines.map((line) => ({ line, copy: false })),
    { line: first, copy: true },
    { line: second, copy: true },
  ];

  return (
    <section aria-label={t("label")} className="carousel">
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focus pauses the row, and with reduced motion it scrolls: it must be reachable with the keyboard (WCAG 2.1.1 and 2.2.2) */}
      <div role="group" tabIndex={0} aria-label={t("scenes")} className="carousel-viewport">
        <div className="carousel-track">
          {slides.map(({ line, copy }, index) => (
            <div key={index} aria-hidden={copy ? "true" : undefined} className="carousel-slide">
              <Scene line={line.id} />
            </div>
          ))}
        </div>
      </div>
      <Container>
        <div className="carousel-foot">
          <ol aria-hidden="true" className="carousel-tabs md:flex-1">
            {serviceLines.map((line) => (
              <li key={line.id} className="carousel-tab">
                <span className="carousel-tab-bar" />
                {/* Drawn by the stylesheet, like the words of a scene: on a phone the five names share
                    one row and take turns, and five texts on top of each other are not text to read. */}
                <span className="carousel-tab-name" data-name={`${line.numeral} · ${line.name[locale]}`} data-short={line.shortName[locale]} />
              </li>
            ))}
          </ol>
          <MotionToggle className="self-start md:-mt-px" />
        </div>
      </Container>
    </section>
  );
}
