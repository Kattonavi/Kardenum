import type { Localized } from "../i18n/locales";
import type { AppPathname } from "../routes";
import { privacyDocument, termsDocument } from "./legal";
import { linePages } from "./lines";
import { serviceLines } from "./service-lines";
import { subpages } from "./subpages";
import type { PageMeta } from "./types";

/**
 * Title, description and social image text of every built page, in both languages.
 * content.test.ts checks that each built route has an entry and that titles and descriptions
 * are unique. Titles and descriptions are provisional until the keywords are validated.
 */
export const pageMeta: Partial<Record<AppPathname, PageMeta>> = {
  "/": {
    title: {
      es: "Kardenum — estudio de desarrollo, diseño y video",
      en: "Kardenum — software, design and video studio",
    },
    description: {
      es: "Estudio de desarrollo, diseño y video: sitios web, tiendas online, software a la medida, identidad visual y edición de video. Cotiza tu proyecto.",
      en: "Software, design and video studio: websites, online stores, custom software, brand identity and video editing. Get a quote for your project.",
    },
    og: {
      es: {
        label: "Estudio de desarrollo, diseño y video",
        lines: ["Software, diseño", "y video."],
        accent: "Un solo estudio.",
      },
      en: {
        label: "Software, design and video studio",
        lines: ["Software, design", "and video."],
        accent: "One studio.",
      },
    },
  },
  "/servicios": {
    title: {
      es: "Servicios de desarrollo, diseño y video — Kardenum",
      en: "Software, design and video services — Kardenum",
    },
    description: {
      es: "Cinco líneas de servicio: desarrollo, diseño, video y animación, Minecraft y Discord, todas cotizadas a la medida. Elige la tuya y cotiza tu proyecto.",
      en: "Five service lines: development, design, video and animation, Minecraft and Discord, each quoted to fit. Choose yours and get a quote for your project.",
    },
    og: {
      es: { label: "Servicios", lines: ["Cinco líneas,"], accent: "un mismo criterio." },
      en: { label: "Services", lines: ["Five lines,"], accent: "one standard." },
    },
  },
  "/nosotros": {
    title: {
      es: "Nosotros: varios oficios, un solo estudio — Kardenum",
      en: "About us: several crafts, one studio — Kardenum",
    },
    description: {
      es: "Kardenum es un estudio independiente que integra desarrollo, diseño, video y servicios para comunidades, con 30 días de garantía. Hablemos de tu proyecto.",
      en: "Kardenum is an independent studio for development, design, video and community services, with a 30-day warranty. Let's talk about your project.",
    },
    og: {
      es: { label: "Nosotros", lines: ["Varios oficios."], accent: "Un solo estudio." },
      en: { label: "About", lines: ["Several crafts."], accent: "One studio." },
    },
  },
  "/preguntas-frecuentes": {
    title: {
      es: "Preguntas frecuentes sobre nuestros servicios — Kardenum",
      en: "FAQ: web, design, video, Minecraft and Discord — Kardenum",
    },
    description: {
      es: "Respuestas sobre desarrollo, diseño, video, Minecraft y Discord: qué incluye cada servicio, cómo trabajamos y qué cubre la garantía. Cotiza tu proyecto.",
      en: "Answers about web development, design, video, Minecraft and Discord: what each service includes, how we work and what the warranty covers. Get a quote.",
    },
    og: {
      es: { label: "Preguntas frecuentes", lines: ["Claridad antes"], accent: "de empezar." },
      en: { label: "FAQ", lines: ["Clarity before"], accent: "we start." },
    },
  },
  "/contacto": {
    title: {
      es: "Contacto y cotización a la medida — Kardenum",
      en: "Contact us and get a quote — Kardenum",
    },
    description: {
      es: "Escríbenos por WhatsApp, Discord o correo. Arma tu solicitud en el cotizador y recibe una cotización a la medida para tu proyecto. Cotiza hoy.",
      en: "Write to us on WhatsApp, Discord or email. Build your request in the quote form and receive a quote made to fit your project. Get a quote today.",
    },
    og: {
      es: { label: "Contacto", lines: ["Hablemos de"], accent: "tu proyecto." },
      en: { label: "Contact", lines: ["Let's talk about"], accent: "your project." },
    },
  },
  "/portafolio": {
    title: {
      es: "Portafolio: trabajo que podemos mostrar — Kardenum",
      en: "Our work: projects we can show — Kardenum",
    },
    description: {
      es: "Proyectos de desarrollo, diseño, video, Minecraft y Discord, publicados con permiso del cliente. Filtra por línea de servicio y cotiza el tuyo.",
      en: "Development, design, video, Minecraft and Discord projects, published with the client's permission. Filter by service line and get a quote for yours.",
    },
    og: {
      es: { label: "Portafolio", lines: ["Trabajo que"], accent: "podemos mostrar." },
      en: { label: "Work", lines: ["Work we"], accent: "can show." },
    },
  },
  "/guias": {
    title: {
      es: "Guías de desarrollo, Minecraft y Discord — Kardenum",
      en: "Guides on websites, Minecraft and Discord — Kardenum",
    },
    description: {
      es: "Guías para entender antes de decidir: sitios web, servidores de Minecraft y comunidades de Discord, explicados paso a paso. Cotiza tu proyecto.",
      en: "Guides to understand before you decide: websites, Minecraft servers and Discord communities, explained step by step. Get a quote for your project.",
    },
    og: {
      es: { label: "Guías", lines: ["Guías para entender"], accent: "antes de decidir." },
      en: { label: "Guides", lines: ["Guides to understand"], accent: "before you decide." },
    },
  },
  ...Object.fromEntries(serviceLines.map((line) => [line.pathname, linePages[line.id].meta])),
  ...Object.fromEntries(Object.values(subpages).map((page) => [page.pathname, page.meta])),
  [privacyDocument.pathname]: privacyDocument.meta,
  [termsDocument.pathname]: termsDocument.meta,
};

export function getPageMeta(pathname: AppPathname): PageMeta {
  const meta = pageMeta[pathname];
  if (!meta) throw new Error(`No page meta for "${pathname}". Add it to src/content/pages.ts.`);
  return meta;
}

export function hasPageMeta(pathname: AppPathname): boolean {
  return pathname in pageMeta;
}

/**
 * Name of each page in menus and breadcrumbs. A page without its own entry here is not
 * expected to appear in a breadcrumb trail.
 */
export const pageNames: Partial<Record<AppPathname, Localized<string>>> = {
  "/": { es: "Inicio", en: "Home" },
  "/servicios": { es: "Servicios", en: "Services" },
  "/preguntas-frecuentes": { es: "Preguntas frecuentes", en: "FAQ" },
  "/nosotros": { es: "Nosotros", en: "About" },
  "/contacto": { es: "Contacto", en: "Contact" },
  "/portafolio": { es: "Portafolio", en: "Work" },
  "/guias": { es: "Guías", en: "Guides" },
  "/legal/privacidad": { es: "Privacidad", en: "Privacy" },
  "/legal/terminos": { es: "Términos", en: "Terms" },
  ...Object.fromEntries(serviceLines.map((line) => [line.pathname, line.name])),
  ...Object.fromEntries(serviceLines.flatMap((line) => line.subpages.map((subpage) => [subpage.pathname, subpage.label]))),
};

export function getPageName(pathname: AppPathname): Localized<string> {
  const name = pageNames[pathname];
  if (!name) throw new Error(`No page name for "${pathname}". Add it to src/content/pages.ts.`);
  return name;
}
