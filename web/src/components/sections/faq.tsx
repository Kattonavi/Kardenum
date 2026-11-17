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
// Each piece carries a named look and the plus is drawn by the stylesheet (globals.css, "A
// question and its answer"): the page with every question has to fit in the first TCP flight.
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
    <div className="reveal border-t border-(--rule)">
      {items.map((item, index) => (
        <details key={item.id} open={openFirst && index === 0} className="faq-item">
          <summary className="faq-question">
            <h3 className="faq-title">{item.question}</h3>
          </summary>
          <p className="faq-answer">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
