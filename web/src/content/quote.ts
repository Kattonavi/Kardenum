import type { Localized } from "../i18n/locales";
import { linePages } from "./lines";
import type { ServiceLineId } from "./types";

/**
 * Options of the WhatsApp quote form (docs/specs/002-cotizador-whatsapp.md).
 * The mockup only lists the project types of Desarrollo; the other lines use the names of
 * their services, already approved on each line page. Provisional until the founder reviews them.
 */
const serviceNames = (line: ServiceLineId): Localized<string>[] => linePages[line].services.items.map((service) => service.title);

export const quoteProjectTypes: Record<ServiceLineId, readonly Localized<string>[]> = {
  desarrollo: [
    { es: "Sitio web", en: "Website" },
    { es: "Tienda online", en: "Online store" },
    { es: "Aplicación web", en: "Web application" },
    { es: "Software a la medida", en: "Custom software" },
    { es: "Mejora o rediseño", en: "Improvement or redesign" },
  ],
  diseno: serviceNames("diseno"),
  video: serviceNames("video"),
  minecraft: serviceNames("minecraft"),
  discord: serviceNames("discord"),
};

/** Last option of every line, and the default: the message never claims a choice the person did not make. */
export const quoteUnsure: Localized<string> = { es: "Todavía no lo tengo claro", en: "I am not sure yet" };

export const quoteDeadlines: readonly Localized<string>[] = [
  { es: "Lo antes posible", en: "As soon as possible" },
  { es: "En el próximo mes", en: "Within the next month" },
  { es: "En uno a tres meses", en: "In one to three months" },
  { es: "Sin fecha definida", en: "No set date" },
];

/** Default deadline, for the same reason as `quoteUnsure`. */
export const quoteDefaultDeadline: Localized<string> = { es: "Sin fecha definida", en: "No set date" };
