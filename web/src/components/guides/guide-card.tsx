import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { serviceLines } from "@/content/service-lines";
import type { GuideMeta } from "@/content/types";
import type { AppLocale } from "@/i18n/locales";
import { formatGuideDate } from "@/lib/guides";
import { entryPath } from "@/routes";

type GuideCardProps = {
  guide: GuideMeta;
  locale: AppLocale;
  texts: { readonly guide: string; readonly read: string };
  /** Heading level of the title: h2 in the index, h3 under "Guías relacionadas". */
  heading: "h2" | "h3";
  /** The summary is shown in the index, not among the related guides (maqueta B-Guia-plantilla). */
  withSummary?: boolean;
  className?: string;
};

/** Card of a guide (maquetas B-Guias and B-Guia-plantilla): "Guía · línea", date, title, summary and "Leer guía". */
export function GuideCard({ guide, locale, texts, heading: Heading, withSummary = false, className = "" }: GuideCardProps) {
  const line = serviceLines.find((candidate) => candidate.id === guide.line);
  return (
    <li className={`flex border-r border-b border-mist ${className}`}>
      <Link
        href={entryPath("/guias/[slug]", guide.slug, locale)}
        className={`group flex w-full flex-col gap-4 p-7 transition-colors duration-150 hover:bg-[#e4e3dd] ${withSummary ? "min-h-55" : "min-h-45"}`}
      >
        <span className="flex justify-between gap-4 font-mono text-[0.6875rem] text-graphite uppercase">
          <span className="tracking-[0.14em]">{`${texts.guide} · ${line?.shortName[locale] ?? guide.line}`}</span>
          <time dateTime={guide.publishedAt} className="tracking-[0.1em]">
            {formatGuideDate(guide.publishedAt, locale)}
          </time>
        </span>
        <Heading className="text-lg leading-[1.35] tracking-[0.04em] type-wide">{guide.title[locale]}</Heading>
        {withSummary ? <span className="text-[0.9375rem] leading-normal text-(--muted-text)">{guide.summary[locale]}</span> : null}
        <span className="mt-auto inline-flex items-center gap-2 text-xs tracking-[0.14em] type-display">
          {texts.read}
          <ArrowRightIcon size={16} />
        </span>
      </Link>
    </li>
  );
}
