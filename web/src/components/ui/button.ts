/**
 * Button looks. They are class names, so the same look serves links, buttons and inert placeholders.
 *
 * Since the phase 2 mockups (docs/handoff/fase-2): no rounded corners, 52 px minimum height,
 * Archivo at width 125, weight 700, 13 px with 0.12em tracking.
 *
 * Each look is one named class defined in src/app/globals.css ("Named looks"): a page carries
 * the name, not the whole list of utilities, which would travel twice in every document.
 */
export const buttonClass = {
  /** Bronze with ink text: the single accent of a screen. */
  primary: "btn-primary",
  /** Ink with stone text: the main action on a light surface that already has its accent. */
  dark: "btn-dark",
  /** 1 px border, no fill. The border is the quiet rule of its surface (--button-rule). */
  secondary: "btn-secondary",
  /**
   * The way into a line or a service ("Ver Desarrollo →"): 1 px border, 44 px tall, in the label
   * face. Where it used to say just "Ver línea" in text, this says where the click leads.
   */
  line: "btn-line",
} as const;

export type ButtonVariant = keyof typeof buttonClass;
