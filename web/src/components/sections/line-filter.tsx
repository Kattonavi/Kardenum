import { serviceLines } from "@/content/service-lines";
import type { ServiceLineId } from "@/content/types";
import type { AppLocale } from "@/i18n/locales";

/**
 * Filter by service line that works without JavaScript (portfolio and guides, specs 005 and 006):
 * one radio per line inside the section marked `FILTER_GROUP`, and each item hides itself with
 * CSS (:has()) when the chosen line is not one of its own. Arrow keys move the choice, as in any
 * radio group. Tailwind only emits classes it finds written whole, so each one is spelled out.
 */
export const FILTER_GROUP = "group/filtered";

const HIDDEN_UNLESS_CHOSEN: Readonly<Record<ServiceLineId, string>> = {
  desarrollo: "group-has-[#filter-desarrollo:checked]/filtered:hidden",
  diseno: "group-has-[#filter-diseno:checked]/filtered:hidden",
  video: "group-has-[#filter-video:checked]/filtered:hidden",
  minecraft: "group-has-[#filter-minecraft:checked]/filtered:hidden",
  discord: "group-has-[#filter-discord:checked]/filtered:hidden",
};

/** Classes of an item of the given lines: hidden whenever another line is chosen. */
export function filteredItemClass(lines: readonly ServiceLineId[]): string {
  return serviceLines
    .filter((line) => !lines.includes(line.id))
    .map((line) => HIDDEN_UNLESS_CHOSEN[line.id])
    .join(" ");
}

const OPTION_CLASS = {
  /** Portfolio (maqueta B-Portafolio): the display face. */
  display: "px-5 text-xs tracking-[0.14em] type-display",
  /** Guides (maqueta B-Guias): the mono face. */
  mono: "px-4 font-mono text-xs tracking-[0.1em] uppercase",
} as const;

type LineFilterProps = {
  locale: AppLocale;
  /** Accessible name of the group, e.g. "Filtrar por línea de servicio". */
  legend: string;
  /** Label of the option that shows everything ("Todos", "Todas"). */
  allLabel: string;
  variant: keyof typeof OPTION_CLASS;
};

export function LineFilter({ locale, legend, allLabel, variant }: LineFilterProps) {
  const options = [{ id: "all", label: allLabel }, ...serviceLines.map((line) => ({ id: line.id, label: line.shortName[locale] }))];

  return (
    <fieldset className="flex min-w-0 flex-wrap gap-2">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <label
          key={option.id}
          className={`relative inline-flex min-h-11 cursor-pointer items-center border border-ink transition-colors duration-150 has-checked:bg-ink has-checked:text-stone has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${OPTION_CLASS[variant]}`}
        >
          <input type="radio" name="linea" id={`filter-${option.id}`} value={option.id} defaultChecked={option.id === "all"} className="sr-only" />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
