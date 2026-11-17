import type { Localized } from "../i18n/locales";
import type { AppPathname } from "../routes";
import type { PortfolioPendingKey } from "../site.config";
import type { MDXModule } from "mdx/types";

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
    /**
     * The same title in the lines it takes next to the scene on a wide window (spec 013, RF-21):
     * at most three, and none with a single word when the words allow it. One text, its lines
     * separated by " / ".
     */
    readonly titleBeside: Localized<string>;
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
    /**
     * The same title in the lines it takes next to the scene on a wide window (spec 013, RF-21):
     * at most three, and none with a single word when the words allow it. One text, its lines
     * separated by " / ".
     */
    readonly titleBeside: Localized<string>;
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

/**
 * A value of a case that does not exist yet. Its bracketed note lives in site.config.ts
 * (`portfolioPending`, regla 6 de la Constitución): content files never carry brackets.
 */
export type PendingRef = { readonly pending: PortfolioPendingKey };

/** A value of a case, or the reference to its note while it is pending. */
export type CaseValue<T> = T | PendingRef;

/**
 * Picture of a case: one of its own compositions or an image.
 * - mark: the brand symbol of the case, drawn by the site (Kardenum).
 * - image: a file of src/assets/cases, by its id in src/components/portfolio/case-images.ts.
 */
export type CaseVisual =
  | { readonly kind: "mark"; readonly alt: Localized<string> }
  | { readonly kind: "image"; readonly image: string; readonly alt: Localized<string> };

/** One piece of the gallery (4:3): a picture, a composition of the case, or a pending one. */
export type CasePiece =
  | CaseVisual
  | { readonly kind: "palette"; readonly title: Localized<string>; readonly colors: readonly string[] }
  | {
      readonly kind: "typeface";
      readonly title: Localized<string>;
      /** Name of the display face, set in it. */
      readonly name: string;
      readonly sample: string;
      /** Second face, with its sample, in the mono face. */
      readonly secondary: string;
    }
  | { readonly kind: "pending"; readonly ref: PendingRef };

/** What every published case carries (maquetas B-Portafolio and B-Caso). */
type CaseContent = {
  /** Internal id: the file name and the prefix of its pending data in site.config.ts. */
  readonly id: string;
  readonly slug: Localized<string>;
  readonly name: string;
  /** The sentence under the name on the case page. */
  readonly summary: Localized<string>;
  /** What was done, for the card; the card adds who it was for ("Proyecto propio"). */
  readonly cardText: Localized<string>;
  readonly lines: readonly ServiceLineId[];
  readonly year: CaseValue<number>;
  /** Picture of the card (4:3). */
  readonly cover: CaseValue<CaseVisual>;
  /** Main picture of the case page (16:9). */
  readonly hero: CaseValue<CaseVisual>;
  readonly challenge: CaseValue<Localized<string>>;
  /** "Qué hicimos". */
  readonly work: CaseValue<readonly Localized<string>[]>;
  readonly result: CaseValue<Localized<string>>;
  readonly pieces: readonly CasePiece[];
  /** Title and description of the case page (about 60 and 150 characters). */
  readonly meta: { readonly title: Localized<string>; readonly description: Localized<string> };
};

/**
 * A case of the portfolio, by what can be shown of it (plan-sitio-web.md §5):
 * - publico: the work and the client's name, or "Proyecto propio";
 * - reservado: the work without the name: the type has no field where a name could go;
 * - privado: only what the studio needs to count it. No content fits in it, and it is never generated.
 */
export type PortfolioCase =
  | (CaseContent & { readonly visibilidad: "publico"; readonly client: Exclude<CaseClient, { readonly kind: "reserved" }> })
  | (CaseContent & { readonly visibilidad: "reservado"; readonly client: Extract<CaseClient, { readonly kind: "reserved" }> })
  | { readonly visibilidad: "privado"; readonly id: string; readonly lines: readonly ServiceLineId[]; readonly year: number };

/** A case that is published (publico or reservado). */
export type ShownCase = Exclude<PortfolioCase, { readonly visibilidad: "privado" }>;

/**
 * A guide (maqueta B-Guia-plantilla, spec 006): its data here, its body in `es.mdx` and `en.mdx`
 * next to it. The body marks each section with <Section n={0}>…</Section>; the titles of the
 * sections live only here, so the index "En esta guía" and the headings cannot disagree.
 */
export type GuideMeta = {
  /** Internal id: the name of its folder in src/content/guides. */
  readonly id: string;
  readonly line: ServiceLineId;
  /** Page of the related service: its sub-page, or the page of its line when it has none. */
  readonly service: AppPathname;
  readonly slug: Localized<string>;
  /** Name in the breadcrumbs ("Tienda Tebex"). */
  readonly shortName: Localized<string>;
  /** The question the guide answers, as people search it. It is the h1. */
  readonly title: Localized<string>;
  readonly summary: Localized<string>;
  /** Dates as YYYY-MM-DD; the update is never before the publication. */
  readonly publishedAt: string;
  readonly updatedAt: string;
  readonly readingMinutes: number;
  /** Titles of the sections, from 00 ("Antes de empezar") to the last one ("Siguientes pasos"). */
  readonly sections: readonly Localized<string>[];
  /** Title and description of the page (about 60 and 150 characters). */
  readonly meta: { readonly title: Localized<string>; readonly description: Localized<string> };
};

/** A guide in the registry: its data and the body of each language, loaded only by the site. */
export type GuideContent = {
  readonly meta: GuideMeta;
  readonly body: Localized<() => Promise<MDXModule>>;
};
