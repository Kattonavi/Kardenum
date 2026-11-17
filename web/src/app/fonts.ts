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
//
// Its unicode-range says exactly which characters this file has. The rest of the Latin letters
// (the ones of Portuguese, French and others; they are not written here because the font guard
// reads this file too) are in a second file of the same family, declared in globals.css with its own
// range and never preloaded: a browser asks for it only where one of those characters is shown
// (a name typed into the quote form). The range is the one scripts/subset-archivo.py prints;
// src/lib/fonts.test.ts fails the build if the two stop matching.
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
    { prop: "unicode-range", value: "U+0020-007E, U+00A0-00A1, U+00A7, U+00A9-00AB, U+00AE, U+00B0, U+00B7, U+00BA-00BB, U+00BF, U+00C1, U+00C9, U+00CD, U+00D1, U+00D3, U+00DA, U+00DC, U+00E1, U+00E9, U+00ED, U+00F1, U+00F3, U+00FA, U+00FC, U+2013-2014, U+2018-2019, U+201C-201D, U+2022, U+2026, U+203A, U+20AC, U+2122" },
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
