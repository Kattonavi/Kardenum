import type { PortfolioCase } from "../types";
import { kaelionCase } from "./kaelion";
import { kardenumCase } from "./kardenum";

/**
 * Every case of the portfolio, in the order of the index; "next project" follows it too.
 * Adding a case is adding its file and listing it here. Private cases may be listed (they count
 * for nothing and are never generated: src/lib/portfolio.ts).
 */
export const portfolioCases: readonly PortfolioCase[] = [kardenumCase, kaelionCase];
