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

/** A service inside a line page. `subpage` links to its own page once that page is public. */
export type LineService = {
  readonly title: Localized<string>;
  readonly text: Localized<string>;
  readonly subpage?: AppPathname;
};

/** One card of "which one do you need?": a condition, the need and the kind of project that answers it. */
export type ChooserOption = {
  readonly condition: Localized<string>;
  readonly need: Localized<string>;
  readonly answer: Localized<string>;
  readonly text: Localized<string>;
};

/**
 * Content of a service line page (maquetas B-Linea-*).
 * - "service" (Desarrollo, Diseño, Video): WhatsApp is the first channel.
 * - "community" (Minecraft, Discord): Discord first, the bracket in the hero, an explicit scope
 *   and the invitation to the studio's server.
 */
export type LinePageContent = {
  readonly line: ServiceLineId;
  readonly kind: "service" | "community";
  readonly hero: {
    readonly titleLines: Localized<readonly string[]>;
    /** Last line of the title, in bronze. */
    readonly titleAccent: Localized<string>;
    readonly text: Localized<string>;
    /** Label of the main button. */
    readonly cta: Localized<string>;
    /** "reel" shows the studio reel next to the title, only while a reel exists. */
    readonly visual: "none" | "bracket" | "reel";
  };
  /** Strip under the hero: technologies, platforms or formats. */
  readonly strip: { readonly label: Localized<string>; readonly items: Localized<readonly string[]> };
  readonly services: {
    readonly title: Localized<string>;
    readonly items: readonly LineService[];
    readonly note?: Localized<string>;
  };
  readonly chooser?: { readonly title: Localized<string>; readonly options: readonly ChooserOption[] };
  /** "Qué recibes". */
  readonly deliverables?: { readonly title: Localized<string>; readonly items: readonly Localized<string>[] };
  /** "Alcance": what the studio does and what it does not. */
  readonly scope?: {
    readonly title: Localized<string>;
    readonly does: readonly Localized<string>[];
    readonly doesNot: readonly Localized<string>[];
  };
  /** Text of the first step of "how we work", which names what the line produces. */
  readonly processFirstStep: Localized<string>;
  readonly faq: { readonly title: Localized<string>; readonly items: readonly Faq[] };
  readonly meta: PageMeta;
};

export type SubpageId = "tiendas-online" | "software-a-la-medida" | "plugins" | "servidores" | "tebex" | "bots";

/** A service named in "related services": its own page when it has one, the page of its line when not. */
export type RelatedService = {
  readonly line: ServiceLineId;
  readonly name: Localized<string>;
  readonly pathname: AppPathname;
};

/**
 * Content of a service sub-page (maquetas B-Sub-*): one service with searches of its own, inside
 * its line. The works and the guides of the service join the page when the portfolio and the
 * guides are public.
 */
export type SubpageContent = {
  readonly id: SubpageId;
  readonly pathname: AppPathname;
  readonly line: ServiceLineId;
  readonly hero: {
    readonly titleLines: Localized<readonly string[]>;
    /** Last line of the title, in bronze. */
    readonly titleAccent: Localized<string>;
    readonly text: Localized<string>;
    /** Label of the main button. */
    readonly cta: Localized<string>;
  };
  /** "Qué hacemos": four things the studio builds in this service. */
  readonly offer: {
    readonly title: Localized<string>;
    readonly items: readonly { readonly title: Localized<string>; readonly text: Localized<string> }[];
  };
  /** "Qué recibes", with an optional group of names (compatibility, technologies). */
  readonly deliverables: {
    readonly title: Localized<string>;
    readonly items: readonly Localized<string>[];
    readonly chips?: { readonly label: Localized<string>; readonly items: readonly string[] };
  };
  /** The four steps of "how we work", worded for this service. */
  readonly process: readonly { readonly title: Localized<string>; readonly text: Localized<string> }[];
  /** Title of "Trabajos", shown with the portfolio. */
  readonly works: { readonly title: Localized<string> };
  readonly faq: { readonly title: Localized<string>; readonly items: readonly Faq[] };
  readonly related: { readonly title: Localized<string>; readonly items: readonly RelatedService[] };
  readonly meta: PageMeta;
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
