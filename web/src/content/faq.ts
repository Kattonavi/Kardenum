import type { AppLocale } from "../i18n/locales";
import { localizedPath } from "../routes";
import { homeFaqs } from "./home";
import { linePages } from "./lines";
import { serviceLines } from "./service-lines";
import type { Faq, ServiceLine } from "./types";

/**
 * The questions page (spec 012, RF-41): every question of the site in one place. First the seven
 * general ones (they used to close the home page), then the ones of each service line (they used
 * to close the page of the line). Nothing is rewritten: the texts are the approved ones.
 */
export type FaqGroup = {
  /** The line the questions belong to; none for the general ones. */
  readonly line?: ServiceLine;
  readonly items: readonly Faq[];
};

/**
 * A question of a line whose answer is, word for word, one of the general answers is shown once,
 * with the general ones ("can you improve the site I already have?" was on both pages).
 */
const generalAnswers = new Set(homeFaqs.map((faq) => faq.answer.es));

export const faqGroups: readonly FaqGroup[] = [
  { items: homeFaqs },
  ...serviceLines.map((line) => ({ line, items: linePages[line.id].faq.items.filter((faq) => !generalAnswers.has(faq.answer.es)) })),
];

/** Anchor of a line's questions on the questions page: the last part of the line's own address, in the page's language. */
export function faqAnchor(line: ServiceLine, locale: AppLocale): string {
  return localizedPath(line.pathname, locale).split("/").pop() ?? line.id;
}
