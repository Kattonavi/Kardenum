import { Archivo, JetBrains_Mono } from "next/font/google";

// Archivo variable with the width axis: headings use width 125 + weight 600 (identidad-visual.md).
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

// JetBrains Mono for labels, numbering and data (11–12 px, uppercase).
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});
