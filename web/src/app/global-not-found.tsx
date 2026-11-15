import type { Metadata } from "next";
import Link from "next/link";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import { archivo, jetbrainsMono } from "./fonts";
import "./globals.css";

// Served (with a real 404 status and full HTML) for every URL that matches no route.
// It bypasses the [locale] layout, so it cannot know the language: Spanish first, as in
// maqueta B-404, plus an English line. The designed version with menu and footer comes
// with the pages step.
export const metadata: Metadata = {
  title: es.NotFound.metaTitle,
};

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh">
        <main className="flex min-h-dvh flex-col justify-center bg-ink px-6 text-stone">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            <p className="font-mono text-xs tracking-[0.14em] text-bronze uppercase">{es.NotFound.label}</p>
            <h1 className="text-4xl font-semibold tracking-[0.04em] uppercase font-stretch-[125%]">
              {es.NotFound.title}
            </h1>
            <p className="text-lg text-ash">{es.NotFound.body}</p>
            <Link
              href="/"
              className="inline-flex min-h-12 w-fit items-center bg-bronze px-6 text-[13px] font-semibold tracking-[0.14em] text-ink uppercase font-stretch-[125%]"
            >
              {es.NotFound.home}
            </Link>
            <p lang="en" className="mt-6 border-t border-line pt-6 text-sm text-ash">
              {en.NotFound.title}{" "}
              <Link href="/en" className="text-stone underline underline-offset-4">
                {en.NotFound.home}
              </Link>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
