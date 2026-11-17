import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { LineCard } from "@/components/scenes/line-card";
import { Scene } from "@/components/scenes/scene";
import { AppLink } from "@/components/ui/app-link";
import { buttonClass } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { featuredLineServices } from "@/content/home";
import { serviceLines } from "@/content/service-lines";
import type { AppLocale } from "@/i18n/locales";

/**
 * "Lo que hacemos" of the home page (docs/handoff/fase-2/maquetas): the five lines, seen before
 * they are read. The lines with featured services (Desarrollo and Diseño) are large blocks, the
 * scene on one side and the text on the other, alternating; the rest are cards with their scene
 * on top. The sentences of each line are the ones the rest of the site uses (service-lines.ts).
 */
export function LinesShowcase({ id, locale }: { id: string; locale: AppLocale }) {
  const t = useTranslations("Home");
  const featured = serviceLines.filter((line) => line.id in featuredLineServices);
  const cards = serviceLines.filter((line) => !(line.id in featuredLineServices));

  return (
    <section id={id} aria-labelledby="services-title" className="band-later band-jump band-lines surface-ink">
      <Container className="flex flex-col gap-12 pb-18 md:gap-20 md:pb-28">
        <div className="flex flex-col gap-4.5">
          <p className="eyebrow">{t("linesLabel")}</p>
          <h2 id="services-title" className="title-band">
            {t("servicesTitle")}
          </h2>
        </div>

        {featured.map((line, index) => (
          <article key={line.id} className={index % 2 === 1 ? "reveal feature-row flex-row-reverse" : "reveal feature-row"}>
            <div className="feature-scene">
              <Scene line={line.id} />
            </div>
            <div className="feature-text">
              <span aria-hidden="true" className="numeral">
                {line.numeral}
              </span>
              <h3 className="title-block">{line.name[locale]}</h3>
              <p className="text-[1.0625rem] leading-[1.55] text-(--muted-text)">{line.summary[locale]}</p>
              <ul className="flex flex-wrap gap-2">
                {featuredLineServices[line.id]?.map((service) => (
                  <li key={service.es} className="chip">
                    {service[locale]}
                  </li>
                ))}
              </ul>
              <AppLink href={line.pathname} className={`${buttonClass.line} mt-2 self-start`}>
                {t("viewLine", { name: line.name[locale] })}
                <ArrowRightIcon size={14} />
              </AppLink>
            </div>
          </article>
        ))}

        <ul className="grid gap-5 md:grid-cols-3">
          {cards.map((line) => (
            <LineCard key={line.id} line={line} locale={locale} headingLevel={3} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
