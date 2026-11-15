/**
 * Button looks from the identity (identidad-visual.md → "Componentes"): no rounded corners,
 * 48 px minimum height, Archivo at width 125, weight 600, 13 px with 0.14em tracking.
 * They are class names, so the same look serves links, buttons and inert placeholders.
 */
const base =
  "inline-flex min-h-12 items-center justify-center px-7 text-[13px] tracking-[0.14em] type-display transition-colors duration-150";

export const buttonClass = {
  /** Bronze with ink text: the single accent of a screen. */
  primary: `${base} bg-bronze text-ink hover:bg-(--primary-hover) hover:text-(--primary-hover-text)`,
  /** Ink with stone text: the main action on a light surface that already has its accent. */
  dark: `${base} bg-ink text-stone hover:bg-bronze-deep`,
  /** 1 px border, no fill. It takes the text color of its surface. */
  secondary: `${base} border border-current hover:border-(--accent-text) hover:text-(--accent-text)`,
} as const;

export type ButtonVariant = keyof typeof buttonClass;
