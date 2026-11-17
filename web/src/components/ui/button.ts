/**
 * Button looks. They are class names, so the same look serves links, buttons and inert placeholders.
 *
 * Since the phase 2 mockups (docs/handoff/fase-2): no rounded corners, 52 px minimum height,
 * Archivo at width 125, weight 700, 13 px with 0.12em tracking.
 */
const base =
  "inline-flex min-h-13 items-center justify-center px-7 text-[0.8125rem] font-bold tracking-[0.12em] type-display transition-colors duration-150";

export const buttonClass = {
  /** Bronze with ink text: the single accent of a screen. */
  primary: `${base} bg-bronze text-ink hover:bg-(--primary-hover) hover:text-(--primary-hover-text)`,
  /** Ink with stone text: the main action on a light surface that already has its accent. */
  dark: `${base} bg-ink text-stone hover:bg-bronze-deep`,
  /** 1 px border, no fill. The border is the quiet rule of its surface (--button-rule). */
  secondary: `${base} border border-(--button-rule) hover:border-(--accent-text) hover:text-(--accent-text)`,
  /**
   * The way into a line or a service ("Ver Desarrollo →"): 1 px border, 44 px tall, in the label
   * face. Where it used to say just "Ver línea" in text, this says where the click leads.
   */
  line: "inline-flex min-h-11 items-center gap-2 border border-(--button-rule) px-4 font-mono text-xs tracking-[0.12em] uppercase transition-colors duration-150 hover:border-(--accent-text) hover:text-(--accent-text)",
} as const;

export type ButtonVariant = keyof typeof buttonClass;
