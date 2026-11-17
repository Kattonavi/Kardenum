import { PlusIcon } from "@/components/ui/icons";
import { SectionHeader } from "./content";

export type FaqEntry = { id: string; question: string; answer: string };

type FaqSectionProps = {
  id?: string;
  label: string;
  title: string;
  titleId: string;
  items: readonly FaqEntry[];
  /** "home": no rule above. "page": a rule above, as every section after the first. */
  variant: "home" | "page";
  /** False when another section follows inside the same band. */
  last?: boolean;
};

// Questions as native <details>: the answers are in the HTML even when folded, they work
// without JavaScript and with the keyboard. The first one starts open, as in the mockups.
export function FaqSection({ id, label, title, titleId, items, variant, last = true }: FaqSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`flex flex-wrap items-start gap-x-16 gap-y-8 ${last ? "pb-24" : "pb-22"} ${variant === "page" ? "border-t border-(--rule) pt-18" : ""}`}
    >
      <div className="flex-[1_1_18rem]">
        <SectionHeader label={label} title={title} titleId={titleId} />
      </div>
      <div className="min-w-0 flex-[2_1_32rem]">
        <FaqList items={items} />
      </div>
    </section>
  );
}

/**
 * The questions alone, for a place that already has its heading (the groups of the questions
 * page). `openFirst` is false for every group but the first: one open answer per page.
 */
export function FaqList({ items, openFirst = true }: { items: readonly FaqEntry[]; openFirst?: boolean }) {
  return (
    <div className="border-t border-(--rule)">
      {items.map((item, index) => (
        <details key={item.id} open={openFirst && index === 0} className="group border-b border-(--rule)">
          <summary className="flex min-h-21 items-center justify-between gap-6 py-5 transition-colors duration-150 hover:text-(--accent-text)">
            <h3 className="leading-[1.4] tracking-[0.02em] type-wide">{item.question}</h3>
            <PlusIcon size={20} className="shrink-0 transition-transform duration-150 group-open:rotate-45" />
          </summary>
          <p className="max-w-[44rem] pb-6 leading-[1.6] text-(--muted-text)">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
