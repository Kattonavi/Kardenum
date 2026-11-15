import type { Metadata, Viewport } from "next";
import Link from "next/link";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import { buttonClass } from "@/components/ui/button";
import { brand } from "@/lib/brand";
import { archivo, jetbrainsMono } from "./fonts";
import "./globals.css";

// Served (with a real 404 status and full HTML) for every URL that matches no route.
// It bypasses the [locale] layout, so it cannot know the language: Spanish first, as in
// maqueta B-404, plus an English line. The designed version with menu and footer comes
// with the pages step.
export const metadata: Metadata = {
  title: es.NotFound.metaTitle,
};

export const viewport: Viewport = { themeColor: brand.ink };

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh">
        <main className="flex min-h-dvh flex-col justify-center px-5 surface-ink lg:px-10">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            <p className="type-label text-bronze">{es.NotFound.label}</p>
            <h1 className="text-4xl leading-[1.1] tracking-[0.01em] type-display">{es.NotFound.title}</h1>
            <p className="text-lg text-(--muted-text)">{es.NotFound.body}</p>
            <Link href="/" className={`${buttonClass.primary} w-fit`}>
              {es.NotFound.home}
            </Link>
            <p lang="en" className="mt-6 border-t border-line pt-6 text-sm text-(--muted-text)">
              {en.NotFound.title}{" "}
              <Link href="/en" className="inline-flex min-h-11 items-center text-stone underline">
                {en.NotFound.home}
              </Link>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
