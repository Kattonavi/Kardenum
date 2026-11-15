import type { Localized } from "../i18n/locales";
import type { AppPathname } from "../routes";

/**
 * Typed content model. Content lives in the repo: adding a case or a guide is adding a file.
 * English texts are written for how people search in English, not translated word for word.
 */

export type ServiceLineId = "desarrollo" | "diseno" | "video" | "minecraft" | "discord";

export type ServiceSubpage = {
  readonly pathname: AppPathname;
  readonly label: Localized<string>;
};

export type ServiceLine = {
  readonly id: ServiceLineId;
  readonly numeral: "I" | "II" | "III" | "IV" | "V";
  readonly pathname: AppPathname;
  readonly name: Localized<string>;
  /** One word, for the footer strip. */
  readonly shortName: Localized<string>;
  /** What the line includes, in one sentence. */
  readonly summary: Localized<string>;
  /** Services with their own page inside the line. */
  readonly subpages: readonly ServiceSubpage[];
};

export type Faq = {
  readonly id: string;
  readonly question: Localized<string>;
  readonly answer: Localized<string>;
};

export type ProcessStep = {
  readonly number: string;
  readonly title: Localized<string>;
  readonly text: Localized<string>;
};

/** Title and description of a page, per language (unique across the site). */
export type PageMeta = {
  /** About 60 characters, keyword first on service pages. */
  readonly title: Localized<string>;
  /** About 150 characters: what is offered, ending with an invitation to get a quote. */
  readonly description: Localized<string>;
  /** Text of the social image: a short label, the title lines and an optional accent line in bronze. */
  readonly og: Localized<{ readonly label: string; readonly lines: readonly string[]; readonly accent?: string }>;
};

/**
 * What can be shown of a project. It is agreed in the quote and written in the contract.
 * - publico: the work and the client's name.
 * - reservado: the work, without the name ("Cliente reservado").
 * - privado: nothing. Private cases are never generated.
 */
export type CaseVisibility = "publico" | "reservado" | "privado";

export type CaseClient =
  | { readonly kind: "named"; readonly name: string }
  | { readonly kind: "reserved" }
  | { readonly kind: "own" };

export type PortfolioCase = {
  readonly slug: Localized<string>;
  readonly title: Localized<string>;
  readonly summary: Localized<string>;
  readonly lines: readonly ServiceLineId[];
  readonly year: number;
  readonly client: CaseClient;
  readonly visibilidad: CaseVisibility;
};

export type Guide = {
  readonly slug: Localized<string>;
  readonly title: Localized<string>;
  readonly summary: Localized<string>;
  readonly line: ServiceLineId;
  /** ISO dates, both shown on the page. */
  readonly publishedAt: string;
  readonly updatedAt: string;
};
