import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { use } from "react";
import { SceneCarousel } from "@/components/home/scene-carousel";
import { Container } from "@/components/layout/container";
import { Scene } from "@/components/scenes/scene";
import { serviceLines } from "@/content/service-lines";
import { isAppLocale } from "@/i18n/locales";
import { buildPageMetadata } from "@/lib/seo/metadata";

// TEST GALLERY, never published. docs/pruebas/escenas-de-prueba/install.py copies this file over
// the home page of a scratch clone, so the scenes can be opened in a browser before any real
// page uses them (spec 012, decision 9): the carousel, and each scene at 900 px and, without its
// border, at 300 px.

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return buildPageMetadata("/", locale);
}

export default function SceneGallery({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  if (!isAppLocale(locale)) notFound();

  return (
    <section className="surface-ink">
      <Container className="py-16">
        <h1 className="text-2xl type-display">Galería de prueba · escenas y carrusel</h1>
      </Container>
      {/* The carousel carries the pause control of the page. */}
      <SceneCarousel locale={locale} />
      <Container className="flex flex-col gap-10 py-16">
        {serviceLines.map((line) => (
          <div key={line.id} className="flex flex-wrap items-start gap-8">
            <div className="w-full max-w-[56.25rem]">
              <Scene line={line.id} />
            </div>
            <div className="w-[18.75rem] bg-coal">
              <Scene line={line.id} bare />
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
