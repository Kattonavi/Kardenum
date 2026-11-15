import type { Localized } from "../i18n/locales";
import type { AppPathname } from "../routes";
import type { PrivacySectionId, TermsSectionId } from "../site.config";
import type { PageMeta } from "./types";

/**
 * Structure of the legal pages (maquetas B-Legal-privacidad and B-Legal-terminos): titles and
 * order of the sections, which are approved. Who answers for the site, the dates and the text
 * of each section live in site.config.ts, pending until the studio writes them
 * (docs/specs/003-paginas-legales.md).
 */
export type LegalSection<SectionId extends string> = {
  /** "owner" is the section built from the data of who answers for the site. */
  readonly id: "owner" | SectionId;
  readonly title: Localized<string>;
};

export type LegalDocument<SectionId extends string> = {
  readonly pathname: AppPathname;
  readonly title: Localized<string>;
  /** Sentence of the "owner" section. Each {field} is replaced with the data in site.config.ts. */
  readonly ownerSentence: Localized<string>;
  readonly sections: readonly LegalSection<SectionId>[];
  readonly meta: PageMeta;
};

export const privacyDocument: LegalDocument<PrivacySectionId> = {
  pathname: "/legal/privacidad",
  title: { es: "Política de privacidad", en: "Privacy policy" },
  ownerSentence: {
    es: "{name}, {identification}, con domicilio en {address}. Correo: {email}. Teléfono: {phone}.",
    en: "{name}, {identification}, with registered address at {address}. E-mail: {email}. Phone: {phone}.",
  },
  sections: [
    { id: "owner", title: { es: "Quién es el responsable", en: "Who is responsible" } },
    { id: "data", title: { es: "Qué datos recopilamos", en: "What data we collect" } },
    { id: "purposes", title: { es: "Para qué los usamos", en: "What we use it for" } },
    { id: "rights", title: { es: "Tus derechos", en: "Your rights" } },
    { id: "exercise", title: { es: "Cómo ejercerlos", en: "How to exercise them" } },
    { id: "contact", title: { es: "Quién atiende tus solicitudes", en: "Who handles your requests" } },
    { id: "analytics", title: { es: "Analítica y cookies", en: "Analytics and cookies" } },
    { id: "retention", title: { es: "Vigencia y conservación", en: "Validity and retention" } },
  ],
  // Provisional, like every title and description until the keywords are validated.
  meta: {
    title: { es: "Política de privacidad — Kardenum", en: "Privacy policy — Kardenum" },
    description: {
      es: "Cómo trata Kardenum los datos personales que recibe por sus canales de contacto: qué datos, para qué se usan, tus derechos y cómo ejercerlos.",
      en: "How Kardenum handles the personal data it receives through its contact channels: which data, what it is used for, your rights and how to exercise them.",
    },
    og: {
      es: { label: "Legal", lines: ["Política de"], accent: "privacidad." },
      en: { label: "Legal", lines: ["Privacy"], accent: "policy." },
    },
  },
};

export const termsDocument: LegalDocument<TermsSectionId> = {
  pathname: "/legal/terminos",
  title: { es: "Términos del sitio", en: "Site terms" },
  ownerSentence: {
    es: "{name}, {identification}, con domicilio en {address}. Correo: {email}.",
    en: "{name}, {identification}, with registered address at {address}. E-mail: {email}.",
  },
  sections: [
    { id: "owner", title: { es: "Quién opera este sitio", en: "Who operates this site" } },
    { id: "purpose", title: { es: "Para qué es este sitio", en: "What this site is for" } },
    { id: "quotes", title: { es: "Cotizaciones y contratación", en: "Quotes and contracting" } },
    { id: "intellectualProperty", title: { es: "Propiedad intelectual", en: "Intellectual property" } },
    { id: "portfolio", title: { es: "Portafolio", en: "Portfolio" } },
    { id: "links", title: { es: "Enlaces a otros sitios", en: "Links to other sites" } },
    { id: "liability", title: { es: "Limitación de responsabilidad", en: "Limitation of liability" } },
    { id: "law", title: { es: "Ley aplicable y cambios", en: "Governing law and changes" } },
  ],
  meta: {
    title: { es: "Términos del sitio — Kardenum", en: "Site terms — Kardenum" },
    description: {
      es: "Condiciones de uso del sitio de Kardenum: quién lo opera, para qué sirve, cotizaciones, propiedad intelectual, enlaces externos y ley aplicable.",
      en: "Terms of use of the Kardenum site: who operates it, what it is for, quotes, intellectual property, external links and governing law.",
    },
    og: {
      es: { label: "Legal", lines: ["Términos"], accent: "del sitio." },
      en: { label: "Legal", lines: ["Site"], accent: "terms." },
    },
  },
};
