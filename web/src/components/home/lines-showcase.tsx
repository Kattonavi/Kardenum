import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { Scene } from "@/components/scenes/scene";
import { AppLink } from "@/components/ui/app-link";
import { buttonClass } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { featuredLineServices } from "@/content/home";
import { serviceLines } from "@/content/service-lines";
import type { ServiceLine } from "@/content/types";
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

  const lineLink = (line: ServiceLine, className: string) => (
    <AppLink href={line.pathname} className={`${buttonClass.line} mt-2 self-start ${className}`}>
      {t("viewLine", { name: line.name[locale] })}
      <ArrowRightIcon size={14} />
    </AppLink>
  );

  return (
    <section id={id} aria-labelledby="services-title" className="band-later surface-ink [--band-size:170rem] md:[--band-size:145rem] lg:[--band-size:100rem]">
      <Container className="flex flex-col gap-12 pb-18 md:gap-20 md:pb-28">
        <div className="flex flex-col gap-4.5">
          <p className="flex items-center gap-3 type-label tracking-[0.14em] text-(--muted-text)">
            <span aria-hidden="true" className="size-2 shrink-0 bg-bronze" />
            {t("linesLabel")}
          </p>
          <h2 id="services-title" className="text-[clamp(1.75rem,1.312rem+1.8vw,2.75rem)] leading-[1.05] font-extrabold type-display">
            {t("servicesTitle")}
          </h2>
        </div>

        {featured.map((line, index) => (
          <article key={line.id} className={`reveal flex flex-wrap items-center gap-6 md:gap-14 ${index % 2 === 1 ? "flex-row-reverse" : ""}`}>
            <div className="min-w-0 flex-[1.5_1_30rem]">
              <Scene line={line.id} />
            </div>
            <div className="flex min-w-0 flex-[1_1_20rem] flex-col gap-4">
              <span aria-hidden="true" className="font-mono text-xs tracking-[0.14em] text-(--accent-text)">
                {line.numeral}
              </span>
              <h3 className="text-[clamp(1.625rem,1.296rem+1.348vw,2.375rem)] leading-[1.05] font-extrabold type-display">{line.name[locale]}</h3>
              <p className="text-[1.0625rem] leading-[1.55] text-(--muted-text)">{line.summary[locale]}</p>
              <ul className="flex flex-wrap gap-2">
                {featuredLineServices[line.id]?.map((service) => (
                  <li key={service.es} className="border border-line px-3 py-2 font-mono text-xs tracking-[0.08em]">
                    {service[locale]}
                  </li>
                ))}
              </ul>
              {lineLink(line, "")}
            </div>
          </article>
        ))}

        <ul className="grid gap-5 md:grid-cols-3">
          {cards.map((line) => (
            // The whole card is the link: the button stretches over it (its ::after covers the card).
            <li key={line.id} className="reveal relative flex flex-col border border-line bg-coal transition-colors duration-150 hover:border-graphite">
              <Scene line={line.id} bare />
              <div className="flex flex-1 flex-col gap-2.5 px-5.5 pt-5 pb-6">
                <span aria-hidden="true" className="font-mono text-xs tracking-[0.14em] text-(--accent-text)">
                  {line.numeral}
                </span>
                <h3 className="text-xl leading-[1.1] font-bold type-display">{line.name[locale]}</h3>
                <p className="text-[0.9375rem] leading-normal text-(--muted-text)">{line.summary[locale]}</p>
                {lineLink(line, "mt-auto after:absolute after:inset-0")}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
