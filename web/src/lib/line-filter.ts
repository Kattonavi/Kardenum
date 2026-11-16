import { serviceLines } from "../content/service-lines";
import type { ServiceLineId } from "../content/types";

// Which lines the filter of the portfolio and the guides offers (src/components/sections/line-filter.tsx).
// Kept apart from the component so the browser tests read the same rule.

/**
 * Lines offered by the filter: those with at least one item, in menu order (founder's decision,
 * 2026-11-15: a filter that would show nothing is not offered). With fewer than two there is
 * nothing to choose and the filter is not drawn (`showFilter`).
 */
export function filterLines(itemLines: readonly (readonly ServiceLineId[])[]): ServiceLineId[] {
  const used = new Set(itemLines.flat());
  return serviceLines.map((line) => line.id).filter((id) => used.has(id));
}

export function showFilter(lines: readonly ServiceLineId[]): boolean {
  return lines.length > 1;
}

