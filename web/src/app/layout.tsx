import type { Metadata } from "next";
import { isSiteIndexable } from "@/lib/indexing";
import { archivo, jetbrainsMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kardenum — estudio de desarrollo, diseño y video",
  description:
    "Un estudio para llevar tu proyecto de la idea a algo que puedas mostrar con orgullo. Escuchamos, proponemos y construimos contigo cada parte.",
  robots: isSiteIndexable() ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
