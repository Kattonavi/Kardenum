type KardenumSymbolProps = {
  /** Rendered width and height in px. Minimum on screen: 16 (identidad-visual.md). */
  size: number;
  /** "negative" (stone + bronze) for dark backgrounds, "positive" (ink + bronze) for light ones. */
  variant: "negative" | "positive";
  className?: string;
};

// The L5 · Corchete symbol, inline. Decorative: the brand name next to it carries the accessible name.
export function KardenumSymbol({ size, variant, className }: KardenumSymbolProps) {
  const base = variant === "negative" ? "var(--color-stone)" : "var(--color-ink)";
  return (
    <svg width={size} height={size} viewBox="0 0 640 640" aria-hidden="true" focusable="false" className={className}>
      <path fill={base} d="M0 0 L160 0 L160 80 L80 80 L80 560 L160 560 L160 640 L0 640 Z" />
      <path fill={base} d="M526.86 0 L640 0 L320 320 L640 640 L526.86 640 L206.86 320 Z" />
      <path fill="var(--color-bronze)" d="M416 272 L512 272 L512 368 L416 368 Z" />
    </svg>
  );
}
