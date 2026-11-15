/**
 * Brand colors as plain values, for places that cannot read CSS variables
 * (generated images, the web manifest, theme-color). The source of truth for the
 * interface is the @theme block in src/app/globals.css; brand.test.ts keeps both in sync.
 */
export const brand = {
  ink: "#111110",
  stone: "#f4f4f1",
  mist: "#d9d8d2",
  graphite: "#55544f",
  ash: "#b5b4ae",
  line: "#3a3936",
  bronze: "#b8923a",
  bronzeDeep: "#7a5c14",
} as const;
