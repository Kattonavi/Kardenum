/**
 * WhatsApp quote builder (docs/specs/002-cotizador-whatsapp.md). Pure functions: the form
 * only collects the values and shows what these return. Nothing is stored or sent anywhere.
 */
export const QUOTE_LIMITS = { name: 80, description: 1000 } as const;

export type QuoteFields = {
  name: string;
  line: string;
  projectType: string;
  deadline: string;
  description: string;
};

/** Words of the message, in the language of the page. */
export type QuoteLabels = {
  /** "Hola, Kardenum." */
  greeting: string;
  /** "Soy {name}." */
  introduction: string;
  line: string;
  project: string;
  deadline: string;
};

/**
 * Half of an emoji (pasted, or left by a field that cut it) is a lone surrogate, and
 * encodeURIComponent throws on it. With the `u` flag the class matches only unpaired ones.
 */
const withoutBrokenCharacters = (value: string): string => value.replace(/[\uD800-\uDFFF]/gu, "");

/** At most `limit` characters, counted as whole characters so the cut never splits one. */
const truncate = (value: string, limit: number): string => Array.from(value).slice(0, limit).join("");

/** One line, single spaces, no control characters, cut to the limit. */
export function cleanName(value: string): string {
  const oneLine = withoutBrokenCharacters(value)
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return truncate(oneLine, QUOTE_LIMITS.name).trim();
}

/** Keeps the paragraphs the person wrote, without control characters or runs of blank lines. */
export function cleanDescription(value: string): string {
  const paragraphs = withoutBrokenCharacters(value)
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ")
    .replace(/[^\S\n]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return truncate(paragraphs, QUOTE_LIMITS.description).trim();
}

/**
 * "Soy {name}." with the name in its place. The replacement is a function on purpose: as a
 * string, "$&" or "$$" typed in a name would be read as patterns and change the message.
 */
export function introduce(introduction: string, name: string): string {
  return introduction.replace("{name}", () => name);
}

/** The message exactly as it reaches the studio. Without a name there is no "Soy…"; without an idea, no last paragraph. */
export function buildQuoteMessage(fields: QuoteFields, labels: QuoteLabels): string {
  const name = cleanName(fields.name);
  const description = cleanDescription(fields.description);
  const lines = [
    name ? `${labels.greeting} ${introduce(labels.introduction, name)}` : labels.greeting,
    `${labels.line}: ${fields.line}`,
    `${labels.project}: ${fields.projectType}`,
    `${labels.deadline}: ${fields.deadline}`,
  ];
  return description ? `${lines.join("\n")}\n\n${description}` : lines.join("\n");
}

/** Link that opens the chat with the message ready. `number` is the international number; only its digits are used. */
export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

/** Value of `?linea=` if it is one of the known lines; anything else is ignored. */
export function parseLineParam<Id extends string>(value: string | null | undefined, lineIds: readonly Id[]): Id | null {
  return lineIds.find((id) => id === value) ?? null;
}
