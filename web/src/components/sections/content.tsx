import type { ReactNode } from "react";
import { AppLink } from "@/components/ui/app-link";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { AppPathname } from "@/routes";

// Building blocks of the stone band of a page (maquetas B-Linea-*). After the first one, each
// section opens with a 1 px rule; 72 px above the content and 88 px below.

type SectionHeaderProps = {
  /** Small label above the title (kept from the approved mockups). */
  label: string;
  title: string;
  /** id of the <h2>, used as the accessible name of the section. */
  titleId: string;
};

export function SectionHeader({ label, title, titleId }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="type-label text-(--muted-text)">{label}</p>
      <h2 id={titleId} className="max-w-[40rem] text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.15] tracking-[0.01em] type-display">
        {title}
      </h2>
    </div>
  );
}

type StackedSectionProps = SectionHeaderProps & {
  id?: string;
  /** The first section of the band has no rule and more room above. */
  first?: boolean;
  children: ReactNode;
};

/** Section with its header on top and the content below. */
export function StackedSection({ id, first = false, children, ...header }: StackedSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={header.titleId}
      className={`flex flex-col ${first ? "gap-10 py-22" : "gap-8 border-t border-(--rule) pt-18 pb-22"}`}
    >
      <SectionHeader {...header} />
      {children}
    </section>
  );
}

type SplitSectionProps = SectionHeaderProps & {
  id?: string;
  /** Extra room below, for the last section before the closing band. */
  last?: boolean;
  children: ReactNode;
};

/** Section with its header on the left and the content on the right; they stack on narrow screens. */
export function SplitSection({ id, last = false, children, ...header }: SplitSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={header.titleId}
      className={`flex flex-wrap items-start gap-x-16 gap-y-8 border-t border-(--rule) pt-18 ${last ? "pb-24" : "pb-22"}`}
    >
      <div className="flex-[1_1_18rem]">
        <SectionHeader {...header} />
      </div>
      <div className="min-w-0 flex-[2_1_32rem]">{children}</div>
    </section>
  );
}

export type NumberedItem = {
  title: string;
  text: string;
  /** Page of the service; only passed when that page is public. */
  href?: AppPathname;
};

/** Services of a line as numbered rows: number, name in capitals, what it is and a link if it has its own page. */
export function NumberedList({ items, linkLabel }: { items: readonly NumberedItem[]; linkLabel: string }) {
  // The link column is reserved only when some row has a link, so rows stay aligned.
  const hasLinks = items.some((item) => item.href);

  return (
    <ol className="border-t border-(--rule)">
      {items.map((item, index) => (
        <li key={item.title} className="flex flex-wrap items-baseline gap-x-8 gap-y-3 border-b border-mist py-7">
          <span aria-hidden="true" className="w-10 shrink-0 font-mono text-xs tracking-[0.1em] text-(--muted-text)">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="flex-[1_1_14rem] text-lg leading-[1.3] tracking-[0.08em] type-display">{item.title}</h3>
          <p className="flex-[2_1_22rem] leading-[1.55] text-(--muted-text)">{item.text}</p>
          {item.href ? (
            <AppLink
              href={item.href}
              className="inline-flex min-h-11 min-w-38 items-center gap-2 text-xs tracking-[0.14em] type-display transition-colors duration-150 hover:text-(--accent-text)"
            >
              {linkLabel}
              <ArrowRightIcon size={16} />
            </AppLink>
          ) : hasLinks ? (
            <span aria-hidden="true" className="min-w-38" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export type ChooserCard = { condition: string; need: string; answer: string; text: string };

/** "Which one do you need?": one card per situation, with the kind of project that answers it. */
export function ChooserGrid({ options }: { options: readonly ChooserCard[] }) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] border-t border-l border-t-(--rule) border-l-mist">
      {options.map((option) => (
        <li key={option.need} className="flex flex-col gap-3 border-r border-b border-mist p-7">
          <span className="font-mono text-[11px] tracking-[0.14em] text-(--muted-text) uppercase">{option.condition}</span>
          <h3 className="leading-[1.4] tracking-[0.1em] type-display">{option.need}</h3>
          <span aria-hidden="true" className="h-0.5 w-8 bg-bronze" />
          <p className="text-lg leading-[1.4] font-semibold">{option.answer}</p>
          <p className="text-[15px] leading-normal text-(--muted-text)">{option.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** List with a mark per line: a bronze square for what is included, a dash for what is not. */
export function MarkedList({ items, mark = "included" }: { items: readonly string[]; mark?: "included" | "excluded" }) {
  return (
    <ul className="border-t border-mist">
      {items.map((item) => (
        <li key={item} className="flex items-baseline gap-3.5 border-b border-mist py-3.5 leading-normal">
          <span aria-hidden="true" className={`shrink-0 ${mark === "included" ? "size-2 bg-bronze" : "h-0.5 w-2 bg-graphite"}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export type Step = { number: string; title: string; text: string };

type StepsSectionProps = {
  /** The label is the heading of this section (it has no larger title in the mockups). */
  label: string;
  titleId: string;
  steps: readonly Step[];
  /** "home": no rule above. "page": a rule above, as every section after the first. */
  variant: "home" | "page";
};

/** Steps in order. The numbers stay: the order is the information. */
export function StepsSection({ label, titleId, steps, variant }: StepsSectionProps) {
  return (
    <section aria-labelledby={titleId} className={`flex flex-col gap-8 ${variant === "home" ? "pb-24" : "border-t border-(--rule) pt-18 pb-22"}`}>
      <h2 id={titleId} className="type-label text-(--muted-text)">
        {label}
      </h2>
      <ol
        className={`grid gap-8 ${
          variant === "home"
            ? "grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))]"
            : "grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))]"
        }`}
      >
        {steps.map((step) => (
          <li key={step.number} className="flex flex-col gap-3">
            <span aria-hidden="true" className="font-mono text-xs tracking-[0.1em]">
              {step.number}
            </span>
            <span aria-hidden="true" className="h-0.5 w-8 bg-bronze" />
            <h3 className="leading-[1.4] tracking-[0.1em] type-display">{step.title}</h3>
            <p className="text-[15px] leading-normal text-(--muted-text)">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
