import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

// next/font self-hosts the files. The `variable` class on <html> is what includes their
// @font-face rules; the font stacks and the measured fallbacks live in globals.css.

// Archivo, variable in weight and width: headings use width 125 (identidad-visual.md). The file
// is the Latin subset Google Fonts serves, cut to what the site draws: weights 400 to 800, widths
// 100 to 125 and the characters of its texts, 40 KB instead of 90 (spec 013, RF-40;
// scripts/subset-archivo.py; src/lib/fonts.test.ts watches the characters). It is the file every
// page waits for longest after its scripts, so it stays preloaded.
//
// The family keeps the name the stacks of globals.css use, and no fallback of next/font: the
// fallbacks measured for this site are the ones in globals.css.
export const archivo = localFont({
  src: "../assets/fonts/Archivo-site.woff2",
  weight: "400 800",
  style: "normal",
  display: "swap",
  variable: "--font-archivo",
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "Archivo" },
    { prop: "font-stretch", value: "100% 125%" },
  ],
});

// JetBrains Mono for labels, numbering and data (11–12 px, uppercase). It stays preloaded
// (the default). Without the preload was tried and measured on 2026-11-17 (spec 013, RF-44): the
// browser then asks for it at the first layout with the highest priority, Lighthouse counts it as
// blocking, and the simulated first paint goes from 0.91 to 1.06 s on the home page and from 0.76
// to 1.06 s on the questions page, with the same LCP. `preload: false` is the whole change.
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});
