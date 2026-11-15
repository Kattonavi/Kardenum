import type { Localized } from "./i18n/locales";

/**
 * Brand name and data of the studio, in one place.
 *
 * Data that does not exist yet is `pending`: it is shown as a bracketed placeholder and is never
 * invented. When a value is defined, replace it with `{ status: "ready", value: ... }`.
 * A build with SITE_INDEXABLE=true fails while ANY value here is pending (src/lib/launch.ts).
 */
export type Pending = { readonly status: "pending"; readonly placeholder: string };
export type Ready<T> = { readonly status: "ready"; readonly value: T };
export type Provided<T> = Pending | Ready<T>;

/** Pending value whose placeholder is shown in the language of the page (legal pages). */
export type PendingLocalized = { readonly status: "pending"; readonly placeholder: Localized<string> };
export type ProvidedLocalized<T> = PendingLocalized | Ready<T>;
/** A legal text: once written, its paragraphs in each language. */
export type ProvidedText = ProvidedLocalized<Localized<readonly string[]>>;

function pending(placeholder: string): Pending {
  return { status: "pending", placeholder };
}

function pendingIn(es: string, en: string): PendingLocalized {
  return { status: "pending", placeholder: { es, en } };
}

/** Sections of each legal page whose text is written by the studio; the first section of both is built from `legal.owner`. */
export type PrivacySectionId = "data" | "purposes" | "rights" | "exercise" | "contact" | "analytics" | "retention";
export type TermsSectionId = "purpose" | "quotes" | "intellectualProperty" | "portfolio" | "links" | "liability" | "law";

export type LegalDocumentData<SectionId extends string> = {
  /** Date the document comes into force, as YYYY-MM-DD. */
  readonly effectiveDate: ProvidedLocalized<string>;
  /** Date of the last change, as YYYY-MM-DD. */
  readonly updatedDate: ProvidedLocalized<string>;
  /** Opening paragraph: who the document applies to and what it explains. */
  readonly intro: ProvidedText;
  readonly sections: Readonly<Record<SectionId, ProvidedText>>;
};

export type SiteConfig = {
  readonly name: string;
  /**
   * Production origin: the default of SITE_URL and the only origin an indexable build accepts.
   * Absolute URLs are built with getSiteUrl() (src/lib/site-url.ts), never from this field directly.
   */
  readonly url: string;
  /** What the studio is, for titles and SEO. */
  readonly descriptor: Localized<string>;
  readonly contact: {
    /** Contact e-mail address. */
    readonly email: Provided<string>;
    /** WhatsApp number in international format, digits only (used as https://wa.me/<number>). */
    readonly whatsapp: Provided<string>;
    /** Permanent invite URL to the studio's Discord server (also the target of /discord). */
    readonly discordInvite: Provided<string>;
  };
  /**
   * Legal pages (docs/specs/003-paginas-legales.md, maquetas B-Legal-*). The mockups give the
   * structure and the section titles; who answers for the site, the dates and the text of each
   * section do not exist yet. They are written by the studio (or its lawyer), never by the site.
   */
  readonly legal: {
    /** Who answers for the site. Filled once, used in the first section of both pages. */
    readonly owner: {
      /** Name or company name. */
      readonly name: ProvidedLocalized<string>;
      /** Identification of the person or company. */
      readonly identification: ProvidedLocalized<string>;
      /** City and address of the registered office. */
      readonly address: ProvidedLocalized<string>;
      /** E-mail for legal matters (it may be the contact one). */
      readonly email: ProvidedLocalized<string>;
      readonly phone: ProvidedLocalized<string>;
    };
    readonly privacy: LegalDocumentData<PrivacySectionId>;
    readonly terms: LegalDocumentData<TermsSectionId>;
  };
  /** Official profiles for JSON-LD `sameAs`. Only real, existing profiles. */
  readonly profiles: readonly string[];
  /** Sections that are built but stay out of menus and the sitemap, with noindex, until they have real content. */
  readonly features: {
    /** Goes public with at least one piece per service line. */
    readonly portfolio: boolean;
    readonly guides: boolean;
    /** The service sub-pages (online stores, custom software, plugins, servers, Tebex, bots). */
    readonly serviceSubpages: boolean;
  };
};

export const siteConfig: SiteConfig = {
  name: "Kardenum",
  url: "https://kardenum.com",
  descriptor: {
    es: "Estudio de desarrollo, diseño y video",
    en: "Software, design and video studio",
  },
  contact: {
    email: pending("[correo@kardenum.com]"),
    whatsapp: pending("[WhatsApp]"),
    discordInvite: pending("[Discord]"),
  },
  // Every bracket below is a note from the approved mockups about what goes there (the English
  // ones are their translation). Replace each with { status: "ready", value: ... }.
  legal: {
    owner: {
      name: pendingIn("[Nombre o razón social]", "[Name or company name]"),
      identification: pendingIn("[identificación]", "[identification]"),
      address: pendingIn("[ciudad y dirección]", "[city and address]"),
      email: pendingIn("[correo]", "[e-mail]"),
      phone: pendingIn("[teléfono]", "[phone]"),
    },
    privacy: {
      effectiveDate: pendingIn("[fecha]", "[date]"),
      updatedDate: pendingIn("[fecha]", "[date]"),
      intro: pendingIn(
        "[Introducción: a quién aplica esta política y qué explica. Dos frases.]",
        "[Introduction: who this policy applies to and what it explains. Two sentences.]",
      ),
      sections: {
        data: pendingIn(
          "[Los datos que llegan por los canales de contacto: nombre, medio de contacto y lo que nos cuentas de tu proyecto. Si el sitio usa analítica, qué datos de navegación registra.]",
          "[The data that arrives through the contact channels: name, means of contact and what you tell us about your project. If the site uses analytics, which browsing data it records.]",
        ),
        purposes: pendingIn(
          "[Responder tus solicitudes, preparar cotizaciones y prestar el servicio contratado.]",
          "[Answering your requests, preparing quotes and providing the contracted service.]",
        ),
        rights: pendingIn(
          "[Conocer, actualizar, rectificar y suprimir tus datos, y revocar la autorización, según la Ley 1581 de 2012.]",
          "[Knowing, updating, correcting and deleting your data, and withdrawing the authorization, under Law 1581 of 2012.]",
        ),
        exercise: pendingIn(
          "[A qué correo escribir, qué incluir en la solicitud y en cuánto tiempo respondemos.]",
          "[Which e-mail to write to, what to include in the request and how long we take to answer.]",
        ),
        contact: pendingIn("[Persona o área responsable y su contacto.]", "[Person or area in charge and their contact.]"),
        analytics: pendingIn(
          "[Qué herramienta de analítica se usa. Con Umami no se usan cookies.]",
          "[Which analytics tool is used. With Umami no cookies are used.]",
        ),
        retention: pendingIn(
          "[Desde cuándo rige esta política y por cuánto tiempo se conservan los datos.]",
          "[Since when this policy applies and how long the data is kept.]",
        ),
      },
    },
    terms: {
      effectiveDate: pendingIn("[fecha]", "[date]"),
      updatedDate: pendingIn("[fecha]", "[date]"),
      intro: pendingIn(
        "[Introducción: qué regulan estos términos y a quién aplican. Dos frases.]",
        "[Introduction: what these terms govern and who they apply to. Two sentences.]",
      ),
      sections: {
        purpose: pendingIn(
          "[El sitio es informativo: presenta los servicios del estudio. Ningún precio se publica; todo se cotiza a la medida.]",
          "[The site is informative: it presents the services of the studio. No price is published; everything is quoted to fit.]",
        ),
        quotes: pendingIn(
          "[Las condiciones de cada servicio (pagos, revisiones, garantía, entrega de derechos y confidencialidad) van en la cotización o el contrato que acepta cada cliente.]",
          "[The conditions of each service (payments, revisions, warranty, transfer of rights and confidentiality) go in the quote or the contract each client accepts.]",
        ),
        intellectualProperty: pendingIn(
          "[De quién son los textos, el diseño, la marca y el código de este sitio.]",
          "[Who owns the texts, the design, the brand and the code of this site.]",
        ),
        portfolio: pendingIn(
          "[Los proyectos se muestran con autorización del cliente, según el nivel acordado: público, reservado o privado.]",
          "[Projects are shown with the client's authorization, at the agreed level: public, reserved or private.]",
        ),
        links: pendingIn(
          "[El estudio no responde por el contenido de sitios de terceros enlazados desde aquí.]",
          "[The studio is not responsible for the content of third-party sites linked from here.]",
        ),
        liability: pendingIn(
          "[Alcance de la responsabilidad del estudio por el uso de la información del sitio.]",
          "[Scope of the studio's liability for the use of the information on the site.]",
        ),
        law: pendingIn("[Ley que rige estos términos y cómo se avisan los cambios.]", "[Law that governs these terms and how changes are announced.]"),
      },
    },
  },
  profiles: [],
  features: {
    portfolio: false,
    guides: false,
    serviceSubpages: false,
  },
};

/**
 * Data of the portfolio cases that does not exist yet (docs/specs/005-portafolio-y-casos.md), by
 * "<case id>.<field>". A case points to its note with `{ pending: "<key>" }` and the page shows
 * the note; once the value exists it is written in the case file and its key is removed here.
 *
 * Kept apart from `siteConfig` on purpose: these only block the launch while the portfolio is on
 * (RF-7, src/lib/portfolio.ts); every value inside `siteConfig` always does.
 * Image placeholders are pending data too: each box shows its note and is counted by the launch check.
 */
export const portfolioPending = {
  "kardenum.result": pendingIn("[Resultado del proyecto: cifras o un comentario del cliente]", "[Project result: figures or a comment from the client]"),
  "kardenum.siteScreenshot": pendingIn("[Captura del sitio]", "[Website screenshot]"),
  "kaelion.year": pendingIn("[Año]", "[Year]"),
  "kaelion.cover": pendingIn("[Captura del servidor]", "[Server screenshot]"),
  "kaelion.hero": pendingIn("[Imagen principal: captura del servidor en 16:9]", "[Main image: server screenshot in 16:9]"),
  "kaelion.challenge": pendingIn("[El reto: qué problema había y para quién]", "[The challenge: what the problem was and for whom]"),
  "kaelion.work": pendingIn("[Qué hicimos: lo que se construyó, en una lista]", "[What we did: what was built, as a list]"),
  "kaelion.result": pendingIn("[Resultado del proyecto: cifras o un comentario del cliente]", "[Project result: figures or a comment from the client]"),
  "kaelion.serverScreenshot": pendingIn("[Piezas: capturas del servidor en 4:3]", "[Pieces: server screenshots in 4:3]"),
} as const satisfies Readonly<Record<string, PendingLocalized>>;

export type PortfolioPendingKey = keyof typeof portfolioPending;
